const FORT_TYPE_LABELS = { giri: "गिरिदुर्ग", jala: "जलदुर्ग", bhui: "भुईकोट", vana: "वनदुर्ग" };
const REGISTRATION_TYPE_LABELS = { individual: "वैयक्तिक", group: "समूह" };
const SHEET_HEADERS = [
  "Registration Number",
  "Timestamp",
  "Registration Type",
  "Participant / Group Name",
  "District / Area",
  "Mobile",
  "Alternate Mobile",
  "Email",
  "Fort Name",
  "Fort Type",
  "Google Drive Folder URL",
  "Consent",
  "Country",
  "Country Code",
  "Mobile Number",
  "State / Province",
  "City",
  "Postal / ZIP Code",
  "Country ISO",
];
const REGISTRATION_NUMBER_HEADER = "Registration Number";
const INTERNATIONAL_HEADERS = SHEET_HEADERS.slice(12);
const COUNTRY_CALLING_CODES = {
  AC:"247",AD:"376",AE:"971",AF:"93",AG:"1",AI:"1",AL:"355",AM:"374",AO:"244",AR:"54",AS:"1",AT:"43",AU:"61",AW:"297",AX:"358",AZ:"994",BA:"387",BB:"1",BD:"880",BE:"32",BF:"226",BG:"359",BH:"973",BI:"257",BJ:"229",BL:"590",BM:"1",BN:"673",BO:"591",BQ:"599",BR:"55",BS:"1",BT:"975",BW:"267",BY:"375",BZ:"501",CA:"1",CC:"61",CD:"243",CF:"236",CG:"242",CH:"41",CI:"225",CK:"682",CL:"56",CM:"237",CN:"86",CO:"57",CR:"506",CU:"53",CV:"238",CW:"599",CX:"61",CY:"357",CZ:"420",DE:"49",DJ:"253",DK:"45",DM:"1",DO:"1",DZ:"213",EC:"593",EE:"372",EG:"20",EH:"212",ER:"291",ES:"34",ET:"251",FI:"358",FJ:"679",FK:"500",FM:"691",FO:"298",FR:"33",GA:"241",GB:"44",GD:"1",GE:"995",GF:"594",GG:"44",GH:"233",GI:"350",GL:"299",GM:"220",GN:"224",GP:"590",GQ:"240",GR:"30",GT:"502",GU:"1",GW:"245",GY:"592",HK:"852",HN:"504",HR:"385",HT:"509",HU:"36",ID:"62",IE:"353",IL:"972",IM:"44",IN:"91",IO:"246",IQ:"964",IR:"98",IS:"354",IT:"39",JE:"44",JM:"1",JO:"962",JP:"81",KE:"254",KG:"996",KH:"855",KI:"686",KM:"269",KN:"1",KP:"850",KR:"82",KW:"965",KY:"1",KZ:"7",LA:"856",LB:"961",LC:"1",LI:"423",LK:"94",LR:"231",LS:"266",LT:"370",LU:"352",LV:"371",LY:"218",MA:"212",MC:"377",MD:"373",ME:"382",MF:"590",MG:"261",MH:"692",MK:"389",ML:"223",MM:"95",MN:"976",MO:"853",MP:"1",MQ:"596",MR:"222",MS:"1",MT:"356",MU:"230",MV:"960",MW:"265",MX:"52",MY:"60",MZ:"258",NA:"264",NC:"687",NE:"227",NF:"672",NG:"234",NI:"505",NL:"31",NO:"47",NP:"977",NR:"674",NU:"683",NZ:"64",OM:"968",PA:"507",PE:"51",PF:"689",PG:"675",PH:"63",PK:"92",PL:"48",PM:"508",PR:"1",PS:"970",PT:"351",PW:"680",PY:"595",QA:"974",RE:"262",RO:"40",RS:"381",RU:"7",RW:"250",SA:"966",SB:"677",SC:"248",SD:"249",SE:"46",SG:"65",SH:"290",SI:"386",SJ:"47",SK:"421",SL:"232",SM:"378",SN:"221",SO:"252",SR:"597",SS:"211",ST:"239",SV:"503",SX:"1",SY:"963",SZ:"268",TA:"290",TC:"1",TD:"235",TG:"228",TH:"66",TJ:"992",TK:"690",TL:"670",TM:"993",TN:"216",TO:"676",TR:"90",TT:"1",TV:"688",TW:"886",TZ:"255",UA:"380",UG:"256",US:"1",UY:"598",UZ:"998",VA:"39",VC:"1",VE:"58",VG:"1",VI:"1",VN:"84",VU:"678",WF:"681",WS:"685",XK:"383",YE:"967",YT:"262",ZA:"27",ZM:"260",ZW:"263"
};

function output(result) {
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function normalizeName(value) {
  return String(value || "").trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

function boldSheetHeaders(sheet) {
  const headerWidth = sheet.getLastColumn();
  if (headerWidth > 0) {
    sheet.getRange(1, 1, 1, headerWidth)
      .setFontFamily("Noto Sans Devanagari")
      .setFontWeight("bold");
  }
}

function applySheetTextFont(sheet) {
  const rowCount = sheet.getLastRow();
  const columnCount = sheet.getLastColumn();
  if (rowCount > 1 && columnCount > 0) {
    sheet.getRange(2, 1, rowCount - 1, columnCount).setFontFamily("Noto Sans Devanagari");
  }
}

function ensureRegistrationNumberColumn(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(SHEET_HEADERS);
    boldSheetHeaders(sheet);
    return 1;
  }

  const lastColumn = Math.max(sheet.getLastColumn(), 1);
  const headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  const existingColumn = headers.indexOf(REGISTRATION_NUMBER_HEADER) + 1;

  if (existingColumn === 1) {
    boldSheetHeaders(sheet);
    return 1;
  }

  // Put Registration Number in column A while preserving the existing data.
  if (existingColumn > 1) {
    const registrationValues = sheet.getRange(1, existingColumn, sheet.getLastRow(), 1).getValues();
    sheet.insertColumnBefore(1);
    sheet.getRange(1, 1, registrationValues.length, 1).setValues(registrationValues);
    sheet.deleteColumn(existingColumn + 1);
  } else {
    sheet.insertColumnBefore(1);
  }

  sheet.getRange(1, 1).setValue(REGISTRATION_NUMBER_HEADER);
  boldSheetHeaders(sheet);
  return 1;
}

function ensureInternationalColumns(sheet) {
  const lastColumn = Math.max(sheet.getLastColumn(), 1);
  const headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  INTERNATIONAL_HEADERS.forEach(function (header) {
    if (headers.indexOf(header) === -1) {
      sheet.getRange(1, sheet.getLastColumn() + 1).setValue(header);
      headers.push(header);
    }
  });
  boldSheetHeaders(sheet);
  return headers;
}

function isE164(value) {
  return /^\+[1-9]\d{1,14}$/.test(String(value || ""));
}

function nextRegistrationNumber(existingRows, registrationColumn, properties, date) {
  const year = Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy");
  const propertyName = "REGISTRATION_SEQUENCE_" + year;
  const pattern = new RegExp("^SHB-" + year + "-(\\d+)$");
  let sequence = Number(properties.getProperty(propertyName) || 0);

  existingRows.forEach(function (row) {
    const match = String(row[registrationColumn - 1] || "").trim().match(pattern);
    if (match) sequence = Math.max(sequence, Number(match[1]));
  });

  sequence += 1;
  properties.setProperty(propertyName, String(sequence));
  return "SHB-" + year + "-" + String(sequence).padStart(5, "0");
}

function doPost(event) {
  const properties = PropertiesService.getScriptProperties();
  const expectedSecret = properties.getProperty("SHARED_SECRET");
  const sheetId = properties.getProperty("SHEET_ID");
  const sheetName = properties.getProperty("SHEET_NAME") || "Registrations";

  if (!expectedSecret || expectedSecret.length < 32 || !sheetId) return output({ success: false, message: "Backend configuration is incomplete." });

  let data;
  try {
    data = JSON.parse(event.postData.contents);
  } catch (error) {
    return output({ success: false, message: "Invalid JSON." });
  }

  if (!data || data.sharedSecret !== expectedSecret) return output({ success: false, message: "Unauthorized." });

  const legacy = !data.countryIso && !data.country;
  const countryIso = String(data.countryIso || "IN").toUpperCase();
  const required = ["registrationType", "name", "mobile", "email", "fortName", "fortType", "driveFolderUrl"];
  if (legacy) required.push("district");
  else required.push("country", "countryIso", "callingCode");
  if (required.some(function (key) { return !String(data[key] || "").trim(); }) || data.consent !== true) {
    return output({ success: false, message: "Required fields are missing." });
  }
  if (countryIso === "IN" && /^[6-9]\d{9}$/.test(String(data.mobile || ""))) data.mobile = "+91" + data.mobile;
  if (countryIso === "IN" && /^[6-9]\d{9}$/.test(String(data.alternateMobile || ""))) data.alternateMobileNational = data.alternateMobile;
  if (!isE164(data.mobile)) return output({ success: false, message: "Phone number must be a valid E.164 number." });
  if (countryIso === "IN" && !/^\+91[6-9]\d{9}$/.test(String(data.mobile))) return output({ success: false, message: "Indian phone number is invalid." });
  if (data.alternateMobileNational && !/^[6-9]\d{9}$/.test(String(data.alternateMobileNational))) return output({ success: false, message: "Alternate Indian phone number is invalid." });
  if (!REGISTRATION_TYPE_LABELS[data.registrationType] || !FORT_TYPE_LABELS[data.fortType]) return output({ success: false, message: "Registration type or fort type is invalid." });
  if (!legacy) {
    const callingCode = String(data.callingCode || "");
    const expectedCallingCode = COUNTRY_CALLING_CODES[countryIso] || "";
    if (!/^\+[1-9]\d{0,3}$/.test(callingCode) || callingCode !== "+" + expectedCallingCode || String(data.mobile).indexOf(callingCode) !== 0) {
      return output({ success: false, message: "Country or phone number is invalid." });
    }
  }

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    const sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
    const registrationColumn = ensureRegistrationNumberColumn(sheet);
    const headers = ensureInternationalColumns(sheet);
    applySheetTextFont(sheet);

    const lastRow = sheet.getLastRow();
    const existingRows = lastRow > 1
      ? sheet.getRange(2, 1, lastRow - 1, Math.max(sheet.getLastColumn(), registrationColumn)).getValues()
      : [];
    if (lastRow > 1) {
      const submittedName = normalizeName(data.name);
      const nameColumn = headers.indexOf("Participant / Group Name");
      const duplicate = existingRows.some(function (row) {
        return nameColumn !== -1 && normalizeName(row[nameColumn]) === submittedName;
      });
      if (duplicate) {
        return output({ success: false, duplicate: true, message: "This participant or group name is already registered." });
      }
    }

    const submittedAt = new Date();
    const registrationNumber = nextRegistrationNumber(existingRows, registrationColumn, properties, submittedAt);
    const isIndia = countryIso === "IN";
    const rowValues = {
      "Registration Number": registrationNumber,
      "Timestamp": submittedAt,
      "Registration Type": REGISTRATION_TYPE_LABELS[data.registrationType],
      "Participant / Group Name": data.name,
      "District / Area": data.district || "",
      "Mobile": isIndia ? (data.mobileNational || String(data.mobile).replace(/^\+91/, "")) : data.mobile,
      "Alternate Mobile": data.alternateMobileNational || "",
      "Email": data.email,
      "Fort Name": data.fortName,
      "Fort Type": FORT_TYPE_LABELS[data.fortType],
      "Google Drive Folder URL": data.driveFolderUrl,
      "Consent": "Yes",
      "Country": data.country || "India",
      "Country Code": data.callingCode || "+91",
      "Mobile Number": data.mobile,
      "State / Province": data.stateProvince || data.district || "",
      "City": data.city || "",
      "Postal / ZIP Code": data.postalCode || "",
      "Country ISO": countryIso,
    };
    const newRow = headers.map(function (header) { return rowValues[header] || ""; });
    sheet.appendRow(newRow);
    applySheetTextFont(sheet);

    return output({ success: true });
  } catch (error) {
    return output({ success: false, message: "Could not write registration to the spreadsheet." });
  } finally {
    try { lock.releaseLock(); } catch (error) {}
  }
}



