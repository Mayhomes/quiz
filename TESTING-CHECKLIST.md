# Testing Checklist - Vinhomes Quiz App

## 🔧 Pre-Test Setup

### Step 1: Clear Browser Cache (CRITICAL!)
The browser may have cached old files. You MUST do a hard refresh:

- **Windows/Linux**: Press `Ctrl + Shift + R`
- **Mac**: Press `Cmd + Shift + R`
- **Alternative**: Open DevTools (F12) → Right-click refresh button → "Empty Cache and Hard Reload"

### Step 2: Verify Configuration
Check that these files are correct:

```bash
# Should only have google-sheets-submit.js (NOT google-sheets-api.js)
ls js/google-sheets*.js

# Should show your Apps Script URL
cat config/google-sheets.config.js | grep SCRIPT_URL
```

Expected output:
```
js/google-sheets-submit.js
SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxj9Z-lfbGXDJTX6jegUt6oLADMZhQ-5Po2dfzmGKIj53Bv-aN6PGHwoSgUYd2ewV87Jw/exec'
```

## ✅ Test 1: Landing Page

### Actions:
1. Go to `http://localhost:8000`
2. Fill in form:
   - Name: "Test User"
   - Phone: "0123456789"
   - Agent: "Test Agent"
3. Click "Bắt đầu làm bài"

### Expected Results:
- ✅ Form validates correctly
- ✅ No errors in console
- ✅ Redirects to quiz.html
- ✅ No "Hết giờ!" alert appears

### Console Check:
```
Previous quiz data and timer state cleared
```

## ✅ Test 2: Quiz Page Load

### Expected Results:
- ✅ Page loads without errors
- ✅ User name displayed: "Xin chào, Test User"
- ✅ Timer shows: "20:00"
- ✅ Questions load (30 total)
- ✅ Progress bar shows: "0/30" and "0%"

### Console Check:
```
Questions loaded: 30
Timer started: 1200 seconds
```

### Common Issues:
- ❌ "Hết giờ!" alert → Browser cache not cleared
- ❌ Stuck on "Đang tải câu hỏi..." → Check browser console for errors

## ✅ Test 3: Quiz Functionality

### Actions:
1. Answer 5 MCQ questions (click radio buttons)
2. Scroll down to essay questions
3. Type some text in essay textarea
4. Scroll back up

### Expected Results:
- ✅ Radio buttons work
- ✅ Textarea accepts input
- ✅ Progress bar updates: "7/30" and "23%"
- ✅ Answered questions have visual indicator
- ✅ Timer counts down (e.g., "19:58", "19:57"...)
- ✅ Scroll-to-top button appears

### Console Check:
```
(No errors)
```

## ✅ Test 4: Timer Functionality

### Actions:
1. Wait and watch the timer
2. Check timer color changes

### Expected Results:
- ✅ Timer counts down every second
- ✅ Green color initially
- ✅ Yellow at 5 minutes remaining
- ✅ Red at 2 minutes remaining

### Console Check:
```
(Timer state being saved to localStorage)
```

## ✅ Test 5: Quiz Submission

### Actions:
1. Answer at least 10 questions
2. Click "Nộp bài" button
3. Check confirmation modal
4. Click "Nộp bài" in modal

### Expected Results:
- ✅ Modal appears with question count
- ✅ Shows "10/30" answered
- ✅ Redirects to results.html
- ✅ Timer stops

## ✅ Test 6: Results Page

### Expected Results:
- ✅ Page loads successfully
- ✅ User info displayed correctly
- ✅ Score displayed (MCQ score only)
- ✅ Essay status: "Chờ chấm điểm"
- ✅ Download buttons work
- ✅ **NO API KEY ERRORS** in console

### Console Check (CRITICAL):
```
Submitting results to Google Sheets...
Submission attempt 1/3
✅ Successfully submitted to Google Sheets
```

### ❌ If you see API KEY ERROR:
```
Error: API keys are not supported by this API
```
**Solution**: Your browser cache is not cleared! Do `Ctrl+Shift+R` again!

## ✅ Test 7: Google Sheets Integration

### Actions:
1. Check browser console on results page
2. Open Google Sheet in new tab

### Expected Results:
- ✅ Console shows: "✅ Successfully submitted to Google Sheets"
- ✅ Green notification appears: "✅ Kết quả đã được lưu vào Google Sheets"
- ✅ New row in Google Sheet with your data
- ✅ Sheet tab named "QuizResults"
- ✅ Headers with green background

### Google Sheet URL:
```
https://docs.google.com/spreadsheets/d/114RmHlWam_wlZb9ZLb9C67X8B1rb97k2i5MDCKBN_bo/
```

### ❌ If submission fails:
- Check Apps Script URL in config
- Verify Apps Script is deployed as "Anyone" can access
- Check browser console for specific error

## ✅ Test 8: Download Features

### Actions:
1. Click "Tải xuống JSON"
2. Click "Tải xuống CSV"

### Expected Results:
- ✅ JSON file downloads
- ✅ CSV file downloads
- ✅ Files contain quiz data
- ✅ Filenames have timestamp

## ✅ Test 9: Retake Quiz

### Actions:
1. Click "Làm lại bài thi"
2. Confirm the dialog
3. Fill in form again
4. Start new quiz

### Expected Results:
- ✅ Redirects to landing page
- ✅ Form is empty
- ✅ New quiz has different questions (randomized)
- ✅ Timer starts at 20:00
- ✅ No old answers present

## ✅ Test 10: Mobile Responsiveness

### Actions:
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test on different screen sizes

### Expected Results:
- ✅ Layout adapts to screen size
- ✅ All buttons clickable
- ✅ Text readable
- ✅ No horizontal scroll

## 🐛 Common Issues & Solutions

### Issue 1: "API keys are not supported" error
**Cause**: Browser cached old `google-sheets-api.js` file  
**Solution**: Hard refresh with `Ctrl+Shift+R`

### Issue 2: "Hết giờ!" alert on quiz start
**Cause**: Old timer state in localStorage  
**Solution**: Already fixed! If still happening, clear localStorage manually

### Issue 3: Questions not loading
**Cause**: JSON files missing or incorrect path  
**Solution**: Check `data/` folder has all JSON files

### Issue 4: Google Sheets submission fails
**Cause**: Apps Script URL not configured or incorrect  
**Solution**: Check `config/google-sheets.config.js` has correct URL

### Issue 5: Timer not counting down
**Cause**: JavaScript error  
**Solution**: Check browser console for errors

## 📊 Test Results Summary

| Test | Status | Notes |
|------|--------|-------|
| Landing Page | ⬜ | |
| Quiz Load | ⬜ | |
| Quiz Functionality | ⬜ | |
| Timer | ⬜ | |
| Submission | ⬜ | |
| Results Page | ⬜ | |
| Google Sheets | ⬜ | |
| Download | ⬜ | |
| Retake | ⬜ | |
| Mobile | ⬜ | |

## 🎯 Critical Success Criteria

For the app to be production-ready, ALL of these must pass:

1. ✅ No console errors (except warnings)
2. ✅ Timer works correctly (20 minutes, auto-submit)
3. ✅ All 30 questions display
4. ✅ Answers are saved
5. ✅ Score calculated correctly
6. ✅ **Google Sheets integration works (NO API KEY ERRORS)**
7. ✅ Download features work
8. ✅ Mobile responsive

## 🚀 Ready for Production?

If all tests pass: **YES!** ✅  
If any test fails: **NO** - Fix issues first ❌

---

**Last Updated**: 2025-11-12  
**Tester**: _________________  
**Date Tested**: _________________
