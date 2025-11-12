# Changelog - Vinhomes Quiz App

## Version 1.1.0 (2025-11-12)

### 🎯 Major Changes

#### Quiz Structure Update
- **Changed from**: 28 MCQ + 2 Essay (38 points total)
- **Changed to**: 30 MCQ only (30 points total)
- **Scoring**: 1 point per question
- **No essay questions**: Simplified grading and immediate results

### ✅ Features Updated

#### 1. Question Randomization (`js/randomizer.js`)
- Updated to select 30 MCQ questions from 51 available
- Removed essay question loading
- No longer fetches `essay-questions.json`

#### 2. Score Calculation (`js/scorer.js`)
- Updated to calculate MCQ-only scores
- Removed essay scoring logic
- Maximum score: 30 points
- Percentage calculation based on 30 points

#### 3. Results Display (`results.html`)
- Removed essay section from results page
- Updated MCQ total from 28 to 30
- Removed "pending review" notice for essays
- Cleaner, simpler results display

#### 4. Metadata (`data/all-questions.json`)
- Updated quiz structure metadata
- Reflected new 30 MCQ configuration
- Removed essay references

### 🔧 Technical Improvements

#### Cache Management
- Added `version.js` for version tracking
- Implemented `.htaccess` for HTTP cache control
- Created comprehensive cache management documentation
- Version bumped to 1.1.0

#### Google Sheets Integration
- ✅ Working with Google Apps Script method
- ✅ API Key method removed (not supported for writes)
- ✅ Automatic submission on results page
- ✅ Success/error notifications

#### Bug Fixes
- Fixed timer state not clearing on new quiz start
- Fixed browser cache issues with old API files
- Fixed syntax errors in randomizer and scorer

### 📊 Current Configuration

```javascript
{
  "totalQuestions": 51,        // Available in pool
  "perUserTotal": 30,          // Questions per quiz
  "perUserMCQ": 30,            // All MCQ
  "perUserEssay": 0,           // No essays
  "perUserMaxPoints": 30,      // Total possible score
  "timeLimit": "20 minutes"    // Quiz duration
}
```

### 🧪 Testing Checklist

Before deploying to production, verify:

- [ ] Quiz loads 30 questions (all MCQ)
- [ ] No essay questions appear
- [ ] Timer works correctly (20 minutes)
- [ ] Score calculation: 1 point per correct answer
- [ ] Maximum score shows as 30
- [ ] Results page displays correctly
- [ ] Google Sheets submission works
- [ ] Download JSON/CSV works
- [ ] Retake quiz works
- [ ] Mobile responsive

### 📝 Files Modified

#### Core Logic
- `js/randomizer.js` - Question selection logic
- `js/scorer.js` - Score calculation
- `js/app.js` - Timer state clearing

#### UI
- `results.html` - Results display
- `index.html` - Added version.js
- `quiz.html` - Added version.js

#### Configuration
- `data/all-questions.json` - Metadata update
- `config/google-sheets.config.js` - Apps Script URL
- `version.js` - Version tracking

#### Documentation
- `CHANGELOG.md` - This file
- `TESTING-CHECKLIST.md` - QA guide
- `CACHE-MANAGEMENT.md` - Cache strategy
- `GOOGLE-SHEETS-SETUP.md` - Integration guide

### 🚀 Deployment Notes

1. **Clear browser cache** after deployment
2. **Update APP_VERSION** in `version.js` for future changes
3. **Verify Google Sheets** integration is working
4. **Test on multiple devices** (desktop, mobile, tablet)
5. **Check all browsers** (Chrome, Firefox, Safari, Edge)

### 🔄 Migration from v1.0.0

Users with cached data from v1.0.0:
- Old quiz data will be cleared on new quiz start
- Timer state will be reset
- No manual intervention required

### 📞 Support

If issues arise:
1. Hard refresh browser: `Ctrl+Shift+R`
2. Clear browser cache
3. Check browser console for errors
4. Verify version in console: `Quiz App v1.1.0`

---

## Version 1.0.0 (2025-11-11)

### Initial Release

- Landing page with user info form
- Quiz interface with 28 MCQ + 2 Essay
- 20-minute countdown timer
- Score calculation and results page
- Google Sheets integration (Apps Script)
- JSON/CSV export
- Responsive design
- Vietnamese language support

---

**Current Version**: 1.1.0  
**Last Updated**: 2025-11-12  
**Status**: ✅ Ready for Testing
