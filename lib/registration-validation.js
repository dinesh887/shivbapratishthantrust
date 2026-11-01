import { content } from "../src/data/content";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const NAME_PATTERN = /^\p{L}[\p{L}\p{M}]*(?: \p{L}[\p{L}\p{M}]*)*$/u;
const PERSON_NAME_PATTERN = /^\p{L}[\p{L}\p{M}]*(?:['’\u002d][\p{L}\p{M}]+)*(?: \p{L}[\p{L}\p{M}]*(?:['’\u002d][\p{L}\p{M}]+)*)*$/u;
const EMAIL_LOCAL_PATTERN = /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/i;
const FORT_TYPES = new Set(["giri", "jala", "bhui", "vana"]);
const REGISTRATION_TYPES = new Set(["individual", "group"]);

function isValidEmail(value) {
  const parts = value.split("@");
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  const labels = domain.split(".");
  return local.length <= 64 &&
    EMAIL_LOCAL_PATTERN.test(local) &&
    !local.startsWith(".") &&
    !local.endsWith(".") &&
    !local.includes("..") &&
    labels.length >= 2 &&
    labels.every((label) => label.length <= 63 && /^[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?$/i.test(label)) &&
    /^[A-Z]{2,63}$/i.test(labels[labels.length - 1]);
}

function text(value) {
  return typeof value === "string" ? value.trim().replace(/\s+/gu, " ") : "";
}

function mobile(value) {
  return typeof value === "string" ? value.trim().replace(/\s+/gu, "") : "";
}

function parseMobile(value, country) {
  try {
    const parsed = parsePhoneNumberFromString(value, country);
    return parsed?.isValid() && (!parsed.country || parsed.country === country) ? parsed : null;
  } catch {
    return null;
  }
}

export function validateRegistration(input, language = "mr") {
  const localized = content[language === "en" ? "en" : "mr"];
  const enteredDistrict = text(input.district);
  const legacy = !input.countryIso && !input.country;
  const countryIso = text(input.countryIso || "IN").toUpperCase();
  const enteredMobile = mobile(input.mobile);
  const parsedMobile = parseMobile(enteredMobile, countryIso);
  const enteredMobileDigitCount = (parsedMobile?.nationalNumber || enteredMobile.replace(/\D/gu, "")).length;
  const enteredAlternateMobile = mobile(input.alternateMobile);
  const parsedAlternateMobile = enteredAlternateMobile ? parseMobile(enteredAlternateMobile, countryIso) : null;
  const values = {
    registrationType: text(input.registrationType),
    name: text(input.name),
    district: enteredDistrict,
    mobile: parsedMobile?.number || "",
    mobileNational: parsedMobile?.nationalNumber || "",
    alternateMobile: parsedAlternateMobile?.number || "",
    alternateMobileNational: parsedAlternateMobile?.nationalNumber || "",
    country: text(input.country) || (countryIso === "IN" ? "India" : ""),
    countryIso,
    callingCode: parsedMobile ? `+${parsedMobile.countryCallingCode}` : text(input.callingCode),
    stateCode: text(input.stateCode),
    stateProvince: text(input.stateProvince || (legacy ? enteredDistrict : "")),
    city: text(input.city),
    cityId: text(input.cityId),
    postalCode: text(input.postalCode),
    email: typeof input.email === "string" ? input.email.trim() : "",
    fortName: text(input.fortName),
    fortType: text(input.fortType),
    driveFolderUrl: typeof input.driveFolderUrl === "string" ? input.driveFolderUrl.trim() : "",
    consent: input.consent === true || input.consent === "yes",
  };
  const errors = {};

  if (!REGISTRATION_TYPES.has(values.registrationType)) errors.registrationType = localized.validationErrors.registrationType[0];
  if (!values.name) errors.name = localized.validationErrors.name[0];
  else if (values.name.length < 2 || values.name.length > 80) errors.name = localized.validationErrors.name[1];
  else if (!PERSON_NAME_PATTERN.test(values.name)) errors.name = language === "en"
    ? "Use letters, spaces, apostrophes, or hyphens in the name."
    : "नावात अक्षरे, मोकळ्या जागा, अपोस्ट्रॉफी किंवा हायफन वापरा.";

  if (!values.country || !/^[A-Z]{2}$/.test(values.countryIso)) errors.country = language === "en" ? "Select a valid country." : "वैध देश निवडा.";
  if (input.callingCode && values.callingCode && input.callingCode !== values.callingCode) errors.country = language === "en" ? "Country calling code does not match." : "देशाचा दूरध्वनी कोड जुळत नाही.";
  if (legacy && !enteredDistrict) errors.district = localized.validationErrors.district[0];
  if (!enteredMobile) errors.mobile = localized.validationErrors.mobile[0];
  else if (enteredMobileDigitCount !== 9 && enteredMobileDigitCount !== 10) errors.mobile = language === "en" ? "Enter a phone number with 9 or 10 digits." : "९ किंवा १० अंकी मोबाईल क्रमांक द्या.";
  else if (!values.mobile) errors.mobile = language === "en" ? "Enter a valid phone number for the selected country." : "निवडलेल्या देशासाठी वैध मोबाईल क्रमांक द्या.";

  if (enteredAlternateMobile && !parsedAlternateMobile) {
    errors.alternateMobile = localized.validationErrors.alternateMobile[0];
  }

  for (const [key, value, label] of [["stateProvince", values.stateProvince, "State / Province"], ["city", values.city, "City"], ["postalCode", values.postalCode, "Postal / ZIP Code"]]) {
    if (value.length > 100) errors[key] = language === "en" ? `${label} must be 100 characters or fewer.` : `${label} १०० अक्षरांपेक्षा कमी असावे.`;
  }
  if (input.stateRequired === "true" && (!values.stateCode || !values.stateProvince)) errors.stateProvince = language === "en" ? "Select a state or province." : "राज्य किंवा प्रांत निवडा.";
  if (input.cityRequired === "true" && !values.city) errors.city = language === "en" ? "Select or enter a city." : "शहर निवडा किंवा भरा.";

  if (!values.email) errors.email = localized.validationErrors.email[0];
  else if (values.email.length > 254 || !isValidEmail(values.email)) errors.email = localized.validationErrors.email[1];

  if (!values.fortName) errors.fortName = localized.validationErrors.fortName[0];
  else if (values.fortName.length < 2 || values.fortName.length > 80) errors.fortName = localized.validationErrors.fortName[1];
  else if (!NAME_PATTERN.test(values.fortName)) errors.fortName = localized.validationErrors.fortName[2];

  if (!FORT_TYPES.has(values.fortType)) errors.fortType = localized.validationErrors.fortType[0];

  if (!values.driveFolderUrl) errors.driveFolderUrl = localized.validationErrors.driveFolderUrl[0];
  else {
    try {
      const url = new URL(values.driveFolderUrl);
      if (url.protocol !== "https:" || url.hostname !== "drive.google.com" || url.username || url.password || !/^\/drive\/folders\/[A-Za-z0-9_-]+\/?$/.test(url.pathname)) {
        errors.driveFolderUrl = localized.validationErrors.driveFolderUrl[1];
      }
    } catch {
      errors.driveFolderUrl = localized.validationErrors.driveFolderUrl[2];
    }
    if (values.driveFolderUrl.length > 2048) errors.driveFolderUrl = localized.validationErrors.driveFolderUrl[3];
  }

  if (!values.consent) errors.consent = localized.validationErrors.consent[0];

  return { values, errors, valid: Object.keys(errors).length === 0 };
}
