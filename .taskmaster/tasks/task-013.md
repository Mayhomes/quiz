# Task 013: Google Sheets Integration for Results Aggregation

## Metadata
- **ID**: task-013
- **Status**: pending
- **Priority**: high
- **Tags**: backend, google-sheets, integration, data
- **Created**: 2025-11-12T01:12:38+07:00
- **Updated**: 2025-11-12T01:12:38+07:00
- **Google Sheet URL**: https://docs.google.com/spreadsheets/d/114RmHlWam_wlZb9ZLb9C67X8B1rb97k2i5MDCKBN_bo/

## Description
Implement automatic submission of quiz results to Google Sheets for centralized data collection and analysis

## Dependencies
- task-007 (Create Results Display Page)
- task-008 (Implement Data Export Functionality)

## Subtasks
- [x] Create config/google-sheets.config.js configuration file
- [ ] Setup Google Sheets API access
- [ ] Create Google Apps Script for data reception
- [ ] Implement client-side submission to Google Sheets
- [ ] Add submission status feedback to results page
- [ ] Handle submission errors gracefully
- [ ] Test data submission and verification

## Implementation Steps

### Step 1: Setup Google Apps Script (REQUIRED)

1. Open your Google Sheet:
   https://docs.google.com/spreadsheets/d/114RmHlWam_wlZb9ZLb9C67X8B1rb97k2i5MDCKBN_bo/

2. Go to **Extensions > Apps Script**

3. Delete any existing code and paste the code from:
   `google-apps-script/Code.gs`

4. Click **Deploy > New deployment**

5. Settings:
   - Type: **Web app**
   - Execute as: **Me** (your account)
   - Who has access: **Anyone**

6. Click **Deploy** and authorize the script

7. **IMPORTANT**: Copy the Web App URL (looks like: `https://script.google.com/macros/s/ABC123.../exec`)

8. Update `config/google-sheets.config.js`:
   - Replace `YOUR_DEPLOYMENT_ID` with your actual URL

### Step 2: Test Google Apps Script

1. In Apps Script editor, run the `testScript()` function
2. Check your Google Sheet - you should see a test row added
3. If successful, the sheet will have headers and one test data row

### Step 3: Update Results Page

Add Google Sheets submission to `results.html`:

```html
<!-- Add before other scripts -->
<script src="config/google-sheets.config.js"></script>
<script src="js/google-sheets.js"></script>
```

Update `js/results.js` to submit data on page load:

```javascript
// In ResultsManager.initialize()
// After displaying results, submit to Google Sheets
this.submitToGoogleSheets();
```

Add method to ResultsManager:

```javascript
async submitToGoogleSheets() {
    if (!this.summary) return;
    
    try {
        const result = await window.submitToGoogleSheets(this.summary);
        
        if (result.success) {
            console.log('✓ Results submitted to Google Sheets');
            this.showSubmissionStatus(true);
        } else if (result.skipped) {
            console.log('Google Sheets submission skipped');
        } else {
            console.warn('Failed to submit to Google Sheets:', result.message);
            this.showSubmissionStatus(false, result.message);
        }
    } catch (error) {
        console.error('Error submitting to Google Sheets:', error);
        this.showSubmissionStatus(false, error.message);
    }
}

showSubmissionStatus(success, message = '') {
    // Optional: Show a notification to user
    // You can add a small status indicator on the results page
}
```

## Configuration Files Created

✓ `config/google-sheets.config.js` - Configuration settings
✓ `google-apps-script/Code.gs` - Google Apps Script code
✓ `js/google-sheets.js` - Client-side submission module

## Google Sheet Structure

The script will create a sheet named "QuizResults" with these columns:

1. Timestamp
2. Name
3. Phone
4. Agent Name
5. Start Time
6. Completion Time
7. Total Questions
8. MCQ Count
9. Essay Count
10. MCQ Score
11. MCQ Total
12. MCQ Percentage
13. Essay Score
14. Essay Total
15. Total Score
16. Max Score
17. Total Percentage
18. Question Details (JSON)

## Features

✓ Automatic submission when results page loads
✓ Retry logic (3 attempts with exponential backoff)
✓ Timeout handling (10 seconds)
✓ Error handling and logging
✓ Can be enabled/disabled via config
✓ No-CORS mode for cross-origin requests
✓ Stores detailed question-by-question answers

## Testing Checklist

- [ ] Google Apps Script deployed successfully
- [ ] Test function in Apps Script works
- [ ] Sheet headers created correctly
- [ ] Test data appears in sheet
- [ ] Web app URL updated in config
- [ ] Quiz submission creates new row in sheet
- [ ] All data fields populated correctly
- [ ] Retry logic works on failure
- [ ] Error handling works gracefully

## Acceptance Criteria

- [ ] Google Apps Script deployed and accessible
- [ ] Configuration file properly set up
- [ ] Quiz results automatically submitted to Google Sheets
- [ ] Data appears correctly in the sheet
- [ ] Errors handled gracefully without breaking the app
- [ ] User can still download JSON/CSV if Google Sheets fails
- [ ] Submission happens in background (non-blocking)

## Notes

- Google Sheets submission is optional and non-blocking
- If submission fails, user can still download results manually
- Uses `no-cors` mode which means we can't read response status
- Assumes success if no error is thrown
- All submissions are logged to browser console

## Security Considerations

- Google Apps Script runs as your account
- Anyone with the URL can submit data
- Consider adding validation in Apps Script
- Don't expose sensitive API keys in client-side code
- Sheet ID is public but data requires Google account access

## Troubleshooting

**If submission fails:**
1. Check browser console for errors
2. Verify Web App URL is correct in config
3. Ensure Apps Script is deployed as "Anyone" can access
4. Check Google Apps Script logs (View > Logs)
5. Test the script URL directly in browser
6. Verify CORS settings in Apps Script

**Common Issues:**
- Wrong deployment URL
- Script not authorized
- "Anyone" access not enabled
- Network/firewall blocking requests
