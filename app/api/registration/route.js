import { validateRegistration } from "../../../lib/registration-validation.js";

import { createCertificateToken } from "../../../lib/certificate-token.js";
import { content } from "../../../src/data/content";

function json(body, status = 200) {
  return Response.json(body, { status });
}

export async function POST(request) {
  let input;
  try {
    input = await request.json();
  } catch {
    return json({ success: false, message: content.mr.messages.apiInvalidRequest }, 400);
  }

  const language = input?.language === "en" ? "en" : "mr";
  const messages = content[language].messages;

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return json({ success: false, message: messages.apiInvalidForm }, 400);
  }

  const { values, errors, valid } = validateRegistration(input, language);
  if (!valid) return json({ success: false, errors, message: messages.apiCorrectInformation }, 422);

  const endpoint = process.env.GOOGLE_APPS_SCRIPT_URL;
  const sharedSecret = process.env.GOOGLE_APPS_SCRIPT_SHARED_SECRET;
  if (!endpoint || !sharedSecret || sharedSecret.length < 32) {
    return json({ success: false, message: messages.apiRegistrationUnconfigured }, 503);
  }

  try {
    const appScriptUrl = new URL(endpoint);
    if (appScriptUrl.protocol !== "https:" || appScriptUrl.hostname !== "script.google.com" || !appScriptUrl.pathname.startsWith("/macros/s/") || !appScriptUrl.pathname.endsWith("/exec")) {
      return json({ success: false, message: messages.apiAppsScriptConfig }, 503);
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
      return json({ success: false, message: messages.apiUnreadableSheets }, 502);
    }

    if (result?.duplicate === true) {
      return json({
        success: false,
        duplicate: true,
        message: messages.apiDuplicateRegistration,
      }, 409);
    }

    if (!upstream.ok || result?.success !== true) {
      return json({ success: false, message: messages.apiSheetsSaveFailed }, 502);
    }

    return json({
      success: true,
      message: messages.apiRegistrationSaved,
      certificateToken: createCertificateToken(values.name, sharedSecret),
    });
  } catch {
    return json({ success: false, message: messages.serviceUnavailable }, 502);
  }
}




