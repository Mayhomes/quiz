/**
 * Google Apps Script for Masterise Homes Quiz
 * Deploy this as a Web App to receive quiz results
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1tzQ9M_WTKsxkID2aOVcgyDnIWfoFqTM5KkfZh3EYy88/
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code and paste this entire code
 * 4. Click "Deploy" > "New deployment"
 * 5. Choose "Web app" as deployment type
 * 6. Set "Execute as" to "Me"
 * 7. Set "Who has access" to "Anyone"
 * 8. Click "Deploy" and copy the Web App URL
 * 9. Update config/google-sheets.config.js with the URL
 */

const SHEET_NAME = 'QuizResults';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();
    addResultToSheet(sheet, data);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Data saved' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ status: 'ok', message: 'Script is running' })
  ).setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    const headers = [
      'Timestamp', 'Name', 'Phone', 'Team', 'Start Time', 'Completion Time',
      'Total Questions', 'MCQ Count', 'Essay Count', 'MCQ Score', 'MCQ Total',
      'MCQ Percentage', 'Essay Score', 'Essay Total', 'Total Score', 'Max Score',
      'Total Percentage', 'Question Details (JSON)'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#9B7E5C').setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
  }
  
  return sheet;
}

function addResultToSheet(sheet, data) {
  const row = [
    new Date().toISOString(),
    data.userInfo.name,
    data.userInfo.phone,
    data.userInfo.team,
    data.userInfo.startTime,
    data.completedAt,
    data.quiz.totalQuestions,
    data.quiz.mcqCount,
    data.quiz.essayCount,
    data.score.mcq.score,
    data.score.mcq.total,
    data.score.mcq.percentage,
    data.score.essay.score,
    data.score.essay.total,
    data.score.total.score,
    data.score.total.maxScore,
    data.score.total.percentage,
    JSON.stringify(data.details)
  ];
  
  sheet.appendRow(row);
}
