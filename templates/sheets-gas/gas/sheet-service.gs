function getDataSheet_() {
  const spreadsheet = SpreadsheetApp.openById(APP_CONFIG.spreadsheetId);
  const sheet = spreadsheet.getSheetByName(APP_CONFIG.sheets.data);
  if (!sheet) throw new Error('Data sheet not found');
  return sheet;
}

function appendDataRow_(values) {
  const sheet = getDataSheet_();
  sheet.appendRow(values);
}
