import { validateRegistration } from "../../../lib/registration-validation.js";

import { createCertificateToken } from "../../../lib/certificate-token.js";
import { content } from "../../../src/data/content";
import { getCountries, getStatesOfCountry, getCitiesOfState, getAllCitiesOfCountry } from "@countrystatecity/countries";
import { getCountryCallingCode } from "libphonenumber-js";

function json(body, status = 200) {
  return Response.json(body, { status });
}

function normalizeCityName(value) {
  return String(value || "").normalize("NFKC").trim().replace(/\s+/gu, " ").toLocaleLowerCase();
}

function isListedCity(cities, cityId, cityName) {
  const normalizedName = normalizeCityName(cityName);
  return cities.some((entry) =>
    (String(entry.id) === cityId && entry.name === cityName) ||
    (normalizedName && normalizeCityName(entry.name) === normalizedName)
  );
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

  const countries = await getCountries();
  const country = countries.find((entry) => entry.iso2 === values.countryIso);
  const legacyLocation = !input.countryIso && !input.country;
  let expectedCallingCode = "";
  try { expectedCallingCode = `+${getCountryCallingCode(values.countryIso)}`; } catch {}
  if (!country || country.name !== values.country || expectedCallingCode !== values.callingCode) {
    return json({ success: false, errors: { country: "Select a valid country and calling code." }, message: messages.apiCorrectInformation }, 422);
  }
  if (!legacyLocation) {
    const states = await getStatesOfCountry(values.countryIso);
    if (states.length && !input.stateCode) {
      return json({ success: false, errors: { stateProvince: "Select a state or province." }, message: messages.apiCorrectInformation }, 422);
    }
    if (states.length && input.stateCode) {
    const state = states.find((entry) => entry.iso2 === input.stateCode && entry.name === values.stateProvince);
    if (!state) return json({ success: false, errors: { stateProvince: "Select a valid state or province." }, message: messages.apiCorrectInformation }, 422);
    const cities = await getCitiesOfState(values.countryIso, input.stateCode);
    if (cities.length && !isListedCity(cities, values.cityId, values.city)) {
      return json({ success: false, errors: { city: "Select a valid city." }, message: messages.apiCorrectInformation }, 422);
    }
    if (!cities.length && !values.city) return json({ success: false, errors: { city: "Enter a city." }, message: messages.apiCorrectInformation }, 422);
    } else if (!states.length) {
      const cities = await getAllCitiesOfCountry(values.countryIso);
      if (cities.length && !values.city) return json({ success: false, errors: { city: "Select a city." }, message: messages.apiCorrectInformation }, 422);
      if (!cities.length && !values.city) return json({ success: false, errors: { city: "Enter a city." }, message: messages.apiCorrectInformation }, 422);
      if (cities.length && !isListedCity(cities, values.cityId, values.city)) {
      return json({ success: false, errors: { city: "Select a valid city." }, message: messages.apiCorrectInformation }, 422);
      }
    }
  }

  const endpoint = process.env.google_apps_script_url || process.env.GOOGLE_APPS_SCRIPT_URL;
  const sharedSecret = process.env.google_apps_script_shared_secret || process.env.GOOGLE_APPS_SCRIPT_SHARED_SECRET;
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
      certificateToken: createCertificateToken(values.name, sharedSecret, values.countryIso !== "IN" ? {
        country: values.country,
        countryIso: values.countryIso,
        stateProvince: values.stateProvince,
        city: values.city,
        postalCode: values.postalCode,
      } : null),
    });
  } catch {
    return json({ success: false, message: messages.serviceUnavailable }, 502);
  }
}




