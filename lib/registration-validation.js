const ALLOWED_DISTRICTS = new Set([
  "मुंबई", "ठाणे", "पालघर", "रायगड", "रत्नागिरी", "सिंधुदुर्ग", "पुणे", "सातारा", "सांगली", "कोल्हापूर", "सोलापूर", "नाशिक", "अहमदनगर", "छत्रपती संभाजीनगर", "इतर",
]);
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

export function validateRegistration(input) {
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

  if (!REGISTRATION_TYPES.has(values.registrationType)) errors.registrationType = "नोंदणीचा प्रकार निवडा.";
  if (!values.name) errors.name = "सहभागी किंवा समूहाचे नाव आवश्यक आहे.";
  else if (values.name.length < 2 || values.name.length > 80) errors.name = "नाव २ ते ८० अक्षरांचे असावे.";
  else if (!NAME_PATTERN.test(values.name)) errors.name = "नावात फक्त अक्षरे आणि मोकळ्या जागा वापरा.";

  if (!ALLOWED_DISTRICTS.has(values.district)) errors.district = "जिल्हा किंवा परिसर निवडा.";
  if (!values.mobile) errors.mobile = "संपर्क क्रमांक आवश्यक आहे.";
  else if (!/^[6-9]\d{9}$/.test(values.mobile)) errors.mobile = "भारतीय मोबाईल क्रमांक ६, ७, ८ किंवा ९ ने सुरू होणारे १० अंकांचे असावे.";

  if (values.alternateMobile && !/^[6-9]\d{9}$/.test(values.alternateMobile)) {
    errors.alternateMobile = "पर्यायी क्रमांक रिकामा ठेवा किंवा १० अंकी भारतीय मोबाईल क्रमांक द्या.";
  }

  if (!values.email) errors.email = "ईमेल पत्ता आवश्यक आहे.";
  else if (values.email.length > 254 || !isValidEmail(values.email)) errors.email = "वैध ईमेल पत्ता द्या.";

  if (!values.fortName) errors.fortName = "आपण बनवत असलेल्या गडाचे नाव आवश्यक आहे.";
  else if (values.fortName.length < 2 || values.fortName.length > 80) errors.fortName = "गडाचे नाव २ ते ८० अक्षरांचे असावे.";
  else if (!NAME_PATTERN.test(values.fortName)) errors.fortName = "गडाच्या नावात फक्त अक्षरे आणि मोकळ्या जागा वापरा.";

  if (!FORT_TYPES.has(values.fortType)) errors.fortType = "गडाचा प्रकार निवडा.";

  if (!values.driveFolderUrl) errors.driveFolderUrl = "Google Drive फोल्डरची लिंक आवश्यक आहे.";
  else {
    try {
      const url = new URL(values.driveFolderUrl);
      if (url.protocol !== "https:" || url.hostname !== "drive.google.com" || url.username || url.password || !/^\/drive\/folders\/[A-Za-z0-9_-]+\/?$/.test(url.pathname)) {
        errors.driveFolderUrl = "Google Drive मधील वैध फोल्डर लिंक द्या.";
      }
    } catch {
      errors.driveFolderUrl = "वैध Google Drive फोल्डर लिंक द्या.";
    }
    if (values.driveFolderUrl.length > 2048) errors.driveFolderUrl = "फोल्डरची लिंक २०४८ अक्षरांपेक्षा मोठी नसावी.";
  }

  if (!values.consent) errors.consent = "नोंदणीसाठी नियम व अटी मान्य करणे आवश्यक आहे.";

  return { values, errors, valid: Object.keys(errors).length === 0 };
}
