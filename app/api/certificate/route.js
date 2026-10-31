import "regenerator-runtime/runtime";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import sharp from "sharp";
import { verifyCertificateToken } from "../../../lib/certificate-token.js";
import { content } from "../../../src/data/content";

const MAX_NAME_LENGTH = 80;
const MAX_NAME_WIDTH = 475;
const NAME_BASELINE_Y = 326;
const FONT_START_SIZE = 28;
const FONT_MIN_SIZE = 15;
const RASTER_SCALE = 4;
const DEVANAGARI_RUN = /[\p{Script=Devanagari}\p{M}]+|[^\p{Script=Devanagari}\p{M}]+/gu;
const CERTIFICATE_NAME_COLOR = "#7a030f";

function json(body, status = 200) {
  return Response.json(body, { status });
}

function layoutName(runs, devanagariFont, latinFont, size) {
  let width = 0;
  let ascent = 0;
  let descent = 0;
  const segments = runs.map((text) => {
    const font = /[\p{Script=Devanagari}\p{M}]/u.test(text) ? devanagariFont : latinFont;
    const layout = font.layout(text);
    const scale = size / font.unitsPerEm;
    const runWidth = layout.positions.reduce((total, position) => total + position.xAdvance, 0) * scale;
    ascent = Math.max(ascent, font.ascent * scale);
    descent = Math.min(descent, font.descent * scale);
    const segment = { font, layout, scale, x: width };
    width += runWidth;
    return segment;
  });
  return { segments, width, ascent, descent, height: ascent - descent };
}

function shapedNameSvg(layout) {
  const paths = [];
  for (const segment of layout.segments) {
    let cursor = 0;
    segment.layout.glyphs.forEach((glyph, index) => {
      const position = segment.layout.positions[index];
      const path = glyph.path.toSVG();
      if (path) {
        const x = segment.x + (cursor + position.xOffset) * segment.scale;
        const y = layout.ascent - position.yOffset * segment.scale;
        paths.push(`<path d="${path}" transform="translate(${x} ${y}) scale(${segment.scale} ${-segment.scale})"/>`);
      }
      cursor += position.xAdvance;
    });
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(layout.width * RASTER_SCALE)}" height="${Math.ceil(layout.height * RASTER_SCALE)}" viewBox="0 0 ${layout.width} ${layout.height}"><g fill="${CERTIFICATE_NAME_COLOR}">${paths.join("")}</g></svg>`;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, message: content.en.messages.apiCertificateInvalidRequest }, 400);
  }

  const messages = content[body?.language === "en" ? "en" : "mr"].messages;

  const name = typeof body?.name === "string" ? body.name.trim().replace(/\s+/g, " ") : "";
  if (name.length < 2 || name.length > MAX_NAME_LENGTH || !/^\p{L}[\p{L}\p{M}]*(?: [\p{L}][\p{L}\p{M}]*)*$/u.test(name)) {
    return json({ success: false, message: messages.apiCertificateInvalidName }, 400);
  }
  const sharedSecret = process.env.GOOGLE_APPS_SCRIPT_SHARED_SECRET;
  if (!sharedSecret || !verifyCertificateToken(name, body?.certificateToken, sharedSecret)) {
    return json({ success: false, message: messages.apiCertificateConfirmation }, 403);
  }

  try {
    const templatePath = path.join(process.cwd(), "public", "certificates", "certificate-template.pdf");
    const devanagariFontPath = path.join(process.cwd(), "public", "fonts", "mukta-devanagari-600-normal.woff");
    const latinFontPath = path.join(process.cwd(), "public", "fonts", "mukta-latin-600-normal.woff");
    const [templateBytes, devanagariFontBytes, latinFontBytes] = await Promise.all([
      readFile(templatePath), readFile(devanagariFontPath), readFile(latinFontPath),
    ]);
    const pdf = await PDFDocument.load(templateBytes);
    if (pdf.getPageCount() !== 1) throw new Error("Expected a single-page certificate template.");

    const devanagariFont = fontkit.create(devanagariFontBytes);
    const latinFont = fontkit.create(latinFontBytes);
    const page = pdf.getPage(0);
    const runs = name.match(DEVANAGARI_RUN) || [name];
    let fontSize = FONT_START_SIZE;
    let shapedName = layoutName(runs, devanagariFont, latinFont, fontSize);
    while (shapedName.width > MAX_NAME_WIDTH && fontSize > FONT_MIN_SIZE) {
      fontSize -= 1;
      shapedName = layoutName(runs, devanagariFont, latinFont, fontSize);
    }
    if (shapedName.width > MAX_NAME_WIDTH) {
      return json({ success: false, message: messages.apiCertificateNameTooLong }, 400);
    }

    const nameImageBytes = await sharp(Buffer.from(shapedNameSvg(shapedName))).png().toBuffer();
    const nameImage = await pdf.embedPng(nameImageBytes);
    const imageWidth = nameImage.width / RASTER_SCALE;
    const imageHeight = nameImage.height / RASTER_SCALE;
    page.drawImage(nameImage, {
      x: (page.getWidth() - imageWidth) / 2,
      y: NAME_BASELINE_Y + shapedName.descent,
      width: imageWidth,
      height: imageHeight,
    });

    const bytes = await pdf.save();
    return new Response(bytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=certificate.pdf",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return json({ success: false, message: "The certificate could not be generated. Please try again." }, 500);
  }
}
