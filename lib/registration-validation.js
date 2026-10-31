import { content } from "../src/data/content";

const ALLOWED_DISTRICTS = new Set(content.mr.validationOptions.districts);
const NAME_PATTERN = /^\p{L}[\p{L}\p{M}]*(?: \p{L}[\p{L}\p{M}]*)*$/u;
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

export function validateRegistration(input, language = "mr") {
  const localized = content[language === "en" ? "en" : "mr"];
  const values = {
    registrationType: text(input.registrationType),
    name: text(input.name),
    district: text(input.district),
    mobile: mobile(input.mobile),
    alternateMobile: mobile(input.alternateMobile),
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
  else if (!NAME_PATTERN.test(values.name)) errors.name = localized.validationErrors.name[2];

  if (!ALLOWED_DISTRICTS.has(values.district)) errors.district = localized.validationErrors.district[0];
  if (!values.mobile) errors.mobile = localized.validationErrors.mobile[0];
  else if (!/^[6-9]\d{9}$/.test(values.mobile)) errors.mobile = localized.validationErrors.mobile[1];

  if (values.alternateMobile && !/^[6-9]\d{9}$/.test(values.alternateMobile)) {
    errors.alternateMobile = localized.validationErrors.alternateMobile[0];
  }

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
