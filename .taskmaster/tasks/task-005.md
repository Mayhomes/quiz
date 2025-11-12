# Task 005: Implement Quiz Logic and State Management

## Metadata
- **ID**: task-005
- **Status**: pending
- **Priority**: high
- **Tags**: frontend, javascript, state
- **Created**: 2025-11-11T19:46:51+07:00
- **Updated**: 2025-11-11T19:46:51+07:00

## Description
Create main quiz controller to manage questions, answers, and user interactions

## Dependencies
- task-003 (Implement Question Randomization Logic)
- task-004 (Implement 20-Minute Countdown Timer)

## Subtasks
- [ ] Create quiz.js module
- [ ] Load randomized questions
- [ ] Display questions (all at once or one by one)
- [ ] Capture user answers
- [ ] Save answers to localStorage
- [ ] Handle quiz submission
- [ ] Navigate to results page

## Implementation Details

### quiz.js
```javascript
class QuizManager {
    constructor() {
        this.questions = [];
        this.answers = {};
        this.timer = null;
        this.isSubmitted = false;
    }
    
    async initialize() {
        // Load user info
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            alert('Vui lòng điền thông tin trước khi bắt đầu quiz');
            window.location.href = 'index.html';
            return;
        }
        
        // Load or randomize questions
        this.questions = await window.QuizRandomizer.initializeQuiz();
        
        if (!this.questions || this.questions.length === 0) {
            alert('Không thể tải câu hỏi');
            return;
        }
        
        // Display questions
        this.displayAllQuestions();
        
        // Initialize timer
        this.timer = window.QuizTimer.initialize(() => this.autoSubmit());
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load saved answers if any
        this.loadSavedAnswers();
    }
    
    displayAllQuestions() {
        const container = document.getElementById('questions-container');
        container.innerHTML = '';
        
        this.questions.forEach((question, index) => {
            const questionEl = this.createQuestionElement(question, index);
            container.appendChild(questionEl);
        });
        
        // Update progress
        document.getElementById('total-questions').textContent = this.questions.length;
    }
    
    createQuestionElement(question, index) {
        const div = document.createElement('div');
        div.className = 'question';
        div.dataset.questionId = question.id;
        
        if (question.id.startsWith('mcq')) {
            div.innerHTML = this.renderMCQ(question, index);
        } else {
            div.innerHTML = this.renderEssay(question, index);
        }
        
        return div;
    }
    
    renderMCQ(question, index) {
        const optionsHTML = question.options.map(option => {
            const value = option.charAt(0); // Extract A, B, C, D
            return `
                <label class="option">
                    <input type="radio" name="q${index}" value="${value}" data-question-index="${index}">
                    <span>${option}</span>
                </label>
            `;
        }).join('');
        
        return `
            <h3>Câu hỏi ${index + 1}</h3>
            <p class="question-text">${question.text}</p>
            <div class="options">
                ${optionsHTML}
            </div>
        `;
    }
    
    renderEssay(question, index) {
        return `
            <h3>Câu hỏi ${index + 1} (Tự luận)</h3>
            <p class="question-text">${question.text}</p>
            ${question.hint ? `<p class="hint"><em>Gợi ý: ${question.hint}</em></p>` : ''}
            <textarea 
                name="q${index}" 
                rows="6" 
                placeholder="Nhập câu trả lời của bạn..."
                data-question-index="${index}"
            ></textarea>
        `;
    }
    
    setupEventListeners() {
        // Listen for answer changes
        document.getElementById('questions-container').addEventListener('change', (e) => {
            if (e.target.matches('input[type="radio"], textarea')) {
                const questionIndex = parseInt(e.target.dataset.questionIndex);
                this.saveAnswer(questionIndex, e.target.value);
            }
        });
        
        // Submit button
        document.getElementById('submit-btn').addEventListener('click', () => {
            this.submitQuiz();
        });
        
        // Warn before leaving page
        window.addEventListener('beforeunload', (e) => {
            if (!this.isSubmitted) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }
    
    saveAnswer(questionIndex, answer) {
        this.answers[questionIndex] = answer;
        localStorage.setItem('quizAnswers', JSON.stringify(this.answers));
    }
    
    loadSavedAnswers() {
        const saved = localStorage.getItem('quizAnswers');
        if (saved) {
            this.answers = JSON.parse(saved);
            
            // Restore answers to form
            Object.keys(this.answers).forEach(index => {
                const answer = this.answers[index];
                const input = document.querySelector(`[data-question-index="${index}"]`);
                
                if (input) {
                    if (input.type === 'radio') {
                        const radio = document.querySelector(`input[name="q${index}"][value="${answer}"]`);
                        if (radio) radio.checked = true;
                    } else if (input.tagName === 'TEXTAREA') {
                        input.value = answer;
                    }
                }
            });
        }
    }
    
    submitQuiz() {
        if (this.isSubmitted) return;
        
        // Confirm submission
        const confirmed = confirm('Bạn có chắc chắn muốn nộp bài?');
        if (!confirmed) return;
        
        this.isSubmitted = true;
        
        // Stop timer
        if (this.timer) {
            this.timer.stop();
        }
        
        // Calculate score
        window.QuizScorer.calculateAndSave(this.questions, this.answers);
        
        // Navigate to results
        window.location.href = 'results.html';
    }
    
    autoSubmit() {
        alert('Hết giờ! Bài thi sẽ được nộp tự động.');
        this.isSubmitted = true;
        window.QuizScorer.calculateAndSave(this.questions, this.answers);
        window.location.href = 'results.html';
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    const quizManager = new QuizManager();
    quizManager.initialize();
});
```

## Acceptance Criteria
- [ ] Quiz loads randomized questions successfully
- [ ] All 30 questions display correctly
- [ ] User can select/enter answers
- [ ] Answers are saved to localStorage on change
- [ ] Saved answers persist on page refresh
- [ ] Submit button triggers confirmation dialog
- [ ] Timer auto-submit works when time expires
- [ ] Quiz navigates to results page after submission
- [ ] Warning shown when trying to leave page before submission

## Testing Checklist
- [ ] Test question display (MCQ and essay)
- [ ] Test answer selection and saving
- [ ] Test page refresh (answers should persist)
- [ ] Test manual submission
- [ ] Test auto-submission (reduce timer for testing)
- [ ] Test navigation to results page
- [ ] Test with incomplete answers
- [ ] Test with all answers completed

## Files to Create
- `js/quiz.js`

## Notes
- Displays all questions at once (can be modified for one-by-one display)
- Answers auto-save to localStorage
- Integrates with timer and randomizer modules
- Handles both manual and auto submission
