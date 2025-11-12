# Task 002: Build Quiz Interface Page

## Metadata
- **ID**: task-002
- **Status**: pending
- **Priority**: high
- **Tags**: frontend, html, quiz
- **Created**: 2025-11-11T19:46:51+07:00
- **Updated**: 2025-11-11T19:46:51+07:00

## Description
Create quiz.html with question display, answer inputs, and navigation

## Dependencies
- task-001 (Create Landing Page with User Info Form)

## Subtasks
- [ ] Create quiz.html structure
- [ ] Add question container
- [ ] Add MCQ radio button options
- [ ] Add essay textarea fields
- [ ] Add progress indicator
- [ ] Add Submit Quiz button
- [ ] Style quiz interface

## Implementation Details

### HTML Structure
```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quiz - Vinhomes Green Paradise</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <div class="quiz-container">
        <header>
            <h1>Vinhomes Green Paradise Quiz</h1>
            <div id="timer" class="timer">20:00</div>
        </header>
        
        <div id="progress" class="progress">
            <span id="current-question">1</span> / <span id="total-questions">30</span>
        </div>
        
        <div id="questions-container" class="questions">
            <!-- Questions will be dynamically loaded here -->
        </div>
        
        <button id="submit-btn" class="btn-submit">Nộp bài</button>
    </div>
    
    <script src="js/randomizer.js"></script>
    <script src="js/timer.js"></script>
    <script src="js/quiz.js"></script>
</body>
</html>
```

### Question Display Templates

**MCQ Template:**
```html
<div class="question mcq" data-question-id="mcq-001">
    <h3>Câu hỏi 1</h3>
    <p class="question-text">Question text here...</p>
    <div class="options">
        <label>
            <input type="radio" name="q1" value="A">
            <span>A. Option A</span>
        </label>
        <label>
            <input type="radio" name="q1" value="B">
            <span>B. Option B</span>
        </label>
        <label>
            <input type="radio" name="q1" value="C">
            <span>C. Option C</span>
        </label>
        <label>
            <input type="radio" name="q1" value="D">
            <span>D. Option D</span>
        </label>
    </div>
</div>
```

**Essay Template:**
```html
<div class="question essay" data-question-id="essay-052">
    <h3>Câu hỏi 29 (Tự luận)</h3>
    <p class="question-text">Essay question text here...</p>
    <p class="hint"><em>Gợi ý: hint text here...</em></p>
    <textarea name="q29" rows="6" placeholder="Nhập câu trả lời của bạn..."></textarea>
</div>
```

## Acceptance Criteria
- [ ] Page loads and displays header with timer
- [ ] Progress indicator shows current question number
- [ ] All 30 questions display correctly
- [ ] MCQ questions have radio buttons
- [ ] Essay questions have text areas
- [ ] Submit button is visible and functional
- [ ] Page is styled consistently with landing page
- [ ] Responsive on mobile devices

## Files to Create
- `quiz.html`

## Files to Modify
- `css/styles.css` (add quiz-specific styles)

## Notes
- Questions will be loaded dynamically from localStorage
- Timer will be initialized when page loads
- All answers should be saved to localStorage on change
