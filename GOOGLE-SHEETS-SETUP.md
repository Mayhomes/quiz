# Google Sheets Setup - Quick Guide

## ⚠️ Important: API Key Method Doesn't Work!

Google Sheets API requires OAuth2 for write operations, not API Keys.
**We're using Google Apps Script instead** - it's simpler and more secure!

## 🚀 Setup Steps (5 minutes)

### Step 1: Open Apps Script Editor

1. Open your Google Sheet:
   ```
   https://docs.google.com/spreadsheets/d/114RmHlWam_wlZb9ZLb9C67X8B1rb97k2i5MDCKBN_bo/
   ```

2. Click **Extensions** → **Apps Script**

### Step 2: Paste the Code

1. Delete any existing code in the editor

2. Open the file `google-apps-script.gs` in this project

3. Copy ALL the code from that file

4. Paste it into the Apps Script editor

5. Click the **Save** icon (💾) or press `Ctrl+S`

### Step 3: Deploy as Web App

1. Click **Deploy** → **New deployment**

2. Click the gear icon ⚙️ next to "Select type"

3. Choose **"Web app"**

4. Configure settings:
   - **Description**: "Vinhomes Quiz Results"
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone**

5. Click **Deploy**

6. Click **Authorize access**

7. Choose your Google account

8. Click **Advanced** → **Go to [Project Name] (unsafe)**

9. Click **Allow**

10. **COPY THE WEB APP URL** (looks like: `https://script.google.com/macros/s/ABC123.../exec`)

### Step 4: Update Configuration

1. Open `config/google-sheets.config.js`

2. Replace `YOUR_SCRIPT_URL_HERE` with your copied URL:
   ```javascript
   SCRIPT_URL: 'https://script.google.com/macros/s/ABC123.../exec',
   ```

3. Save the file

### Step 5: Test It!

1. Refresh your quiz app in the browser (`Ctrl+R` or `F5`)

2. Complete a quiz

3. Check the results page for: **"✅ Kết quả đã được lưu vào Google Sheets"**

4. Open your Google Sheet - you should see a new row with your quiz data!

## ✅ What You Should See

### In Your Google Sheet:
- A new sheet tab called "QuizResults"
- Header row with green background
- Your quiz data in a new row

### In Browser Console (F12):
```
Submitting results to Google Sheets...
Submission attempt 1/3
✅ Successfully submitted to Google Sheets
```

### On Results Page:
- Green notification: "✅ Kết quả đã được lưu vào Google Sheets"

## 🐛 Troubleshooting

### "Script URL not configured"
- Make sure you updated `config/google-sheets.config.js` with your actual URL
- Clear browser cache (`Ctrl+Shift+R`)

### "Authorization required"
- Re-deploy the script
- Make sure you clicked "Allow" during authorization

### No data in sheet
- Check browser console for errors
- Verify the script URL is correct
- Try the test command below

### "Request timeout"
- Your internet connection may be slow
- The script might be taking too long
- Try again

## 🧪 Test Command

Open browser console (F12) and run:

```javascript
// Test the connection
fetch(GOOGLE_SHEETS_CONFIG.SCRIPT_URL)
  .then(r => console.log('✅ Script is reachable'))
  .catch(e => console.error('❌ Cannot reach script:', e));
```

## 🔒 Security Notes

- ✅ Your sheet stays private (only you can view it)
- ✅ No API keys exposed
- ✅ Script runs as your account
- ✅ Anyone can submit data (but can't read existing data)

## 📊 Data Collected

Each quiz submission saves:
- Timestamp
- User info (Name, Phone, Agent)
- Quiz statistics
- Scores (MCQ auto-graded, Essay pending)
- Detailed answers (JSON format)

## 🎯 That's It!

Once you complete these steps, your quiz app will automatically save all results to Google Sheets!

No more API key errors! 🎉
