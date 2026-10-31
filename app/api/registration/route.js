import { validateRegistration } from "../../../lib/registration-validation.js";

import { createCertificateToken } from "../../../lib/certificate-token.js";

function json(body, status = 200) {
  return Response.json(body, { status });
}

export async function POST(request) {
  let input;
  try {
    input = await request.json();
  } catch {
    return json({ success: false, message: "अवैध विनंती. कृपया फॉर्म पुन्हा तपासा." }, 400);
  }

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return json({ success: false, message: "अवैध फॉर्म माहिती." }, 400);
  }

  const { values, errors, valid } = validateRegistration(input);
  if (!valid) return json({ success: false, errors, message: "कृपया दाखवलेली माहिती दुरुस्त करा." }, 422);

  const endpoint = process.env.GOOGLE_APPS_SCRIPT_URL;
  const sharedSecret = process.env.GOOGLE_APPS_SCRIPT_SHARED_SECRET;
  if (!endpoint || !sharedSecret || sharedSecret.length < 32) {
    return json({ success: false, message: "नोंदणी सेवा सध्या कॉन्फिगर केलेली नाही. कृपया नंतर पुन्हा प्रयत्न करा." }, 503);
  }

  try {
    const appScriptUrl = new URL(endpoint);
    if (appScriptUrl.protocol !== "https:" || appScriptUrl.hostname !== "script.google.com" || !appScriptUrl.pathname.startsWith("/macros/s/") || !appScriptUrl.pathname.endsWith("/exec")) {
      return json({ success: false, message: "Google Apps Script URL कॉन्फिगरेशन तपासा." }, 503);
    }
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...values, sharedSecret }),
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(20000),
    });

    const responseText = await upstream.text();
    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      return json({ success: false, message: "Google Sheets कडून वाचता येण्याजोगा प्रतिसाद मिळाला नाही." }, 502);
    }

    if (result?.duplicate === true) {
      return json({
        success: false,
        duplicate: true,
        message: "या व्यक्तीचे किंवा समूहाचे नाव आधीच नोंदवले आहे. प्रत्येक व्यक्ती किंवा समूहासाठी एकच नोंदणी करता येते.",
      }, 409);
    }

    if (!upstream.ok || result?.success !== true) {
      return json({ success: false, message: "माहिती Google Sheets मध्ये जतन झाली नाही. कृपया पुन्हा प्रयत्न करा." }, 502);
    }

    return json({
      success: true,
      message: "नोंदणी यशस्वीरीत्या जतन झाली.",
      certificateToken: createCertificateToken(values.name, sharedSecret),
    });
  } catch {
    return json({ success: false, message: "नोंदणी सेवा सध्या उपलब्ध नाही. कृपया पुन्हा प्रयत्न करा." }, 502);
  }
}




