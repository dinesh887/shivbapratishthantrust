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
];
const REGISTRATION_NUMBER_HEADER = "Registration Number";

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

  const required = ["registrationType", "name", "district", "mobile", "email", "fortName", "fortType", "driveFolderUrl"];
  if (required.some(function (key) { return !String(data[key] || "").trim(); }) || data.consent !== true) {
    return output({ success: false, message: "Required fields are missing." });
  }

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    const sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
    const registrationColumn = ensureRegistrationNumberColumn(sheet);
    applySheetTextFont(sheet);

    const lastRow = sheet.getLastRow();
    const existingRows = lastRow > 1
      ? sheet.getRange(2, 1, lastRow - 1, Math.max(sheet.getLastColumn(), registrationColumn)).getValues()
      : [];
    if (lastRow > 1) {
      const submittedName = normalizeName(data.name);
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
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
    const newRow = [
      registrationNumber,
      submittedAt,
      REGISTRATION_TYPE_LABELS[data.registrationType],
      data.name,
      data.district,
      data.mobile,
      data.alternateMobile || "",
      data.email,
      data.fortName,
      FORT_TYPE_LABELS[data.fortType],
      data.driveFolderUrl,
      "Yes",
    ];
    sheet.appendRow(newRow);
    applySheetTextFont(sheet);

    return output({ success: true });
  } catch (error) {
    return output({ success: false, message: "Could not write registration to the spreadsheet." });
  } finally {
    try { lock.releaseLock(); } catch (error) {}
  }
}



