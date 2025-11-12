# Frontend-Only Implementation Guide

## Overview
Build the quiz application using only HTML, CSS, and JavaScript - no backend required!

## Architecture

```
┌─────────────────────────────────────────┐
│         Frontend Application            │
├─────────────────────────────────────────┤
│  HTML Pages                             │
│  - index.html (Landing/Form)            │
│  - quiz.html (Quiz Interface)           │
│  - results.html (Score Display)         │
├─────────────────────────────────────────┤
│  JavaScript Modules                     │
│  - app.js (Main controller)             │
│  - quiz.js (Quiz logic)                 │
│  - timer.js (20-min countdown)          │
│  - randomizer.js (Question selection)   │
│  - storage.js (Data persistence)        │
│  - scorer.js (Score calculation)        │
├─────────────────────────────────────────┤
│  Data Files (JSON)                      │
│  - mcq-questions-part1.json             │
│  - mcq-questions-part2.json             │
│  - essay-questions.json                 │
├─────────────────────────────────────────┤
│  Storage Options                        │
│  - localStorage (Browser)               │
│  - Download JSON/CSV file               │
│  - Optional: EmailJS, Firebase          │
└─────────────────────────────────────────┘
```

## Project Structure

```
quiz/
├── index.html                 # Landing page with user info form
├── quiz.html                  # Quiz interface
├── results.html               # Results display
├── css/
│   ├── styles.css            # Main styles
│   ├── quiz.css              # Quiz-specific styles
│   └── responsive.css        # Mobile/tablet styles
├── js/
│   ├── app.js                # Main application controller
│   ├── quiz.js               # Quiz logic and state management
│   ├── timer.js              # 20-minute countdown timer
│   ├── randomizer.js         # Question randomization
│   ├── storage.js            # localStorage management
│   ├── scorer.js             # Score calculation
│   └── utils.js              # Helper functions
├── data/
│   ├── mcq-questions-part1.json
│   ├── mcq-questions-part2.json
│   └── essay-questions.json
└── assets/
    └── images/               # Logo, icons, etc.
```

## Implementation Steps

### Step 1: Landing Page (index.html)

**Features:**
- User information form (Name, Phone, Agent Name)
- Form validation
- "Start Quiz" button
- Store user info in localStorage

**Key Code:**
```javascript
// Validate and store user info
function startQuiz(event) {
  event.preventDefault();
  
  const userInfo = {
    name: document.getElementById('name').value,
    phone: document.getElementById('phone').value,
    agentName: document.getElementById('agentName').value,
    timestamp: new Date().toISOString()
  };
  
  // Validate
  if (!userInfo.name || !userInfo.phone || !userInfo.agentName) {
    alert('Please fill in all fields');
    return;
  }
  
  // Store in localStorage
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
  
  // Redirect to quiz
  window.location.href = 'quiz.html';
}
```

### Step 2: Question Randomization (randomizer.js)

**Features:**
- Load all questions from JSON files
- Randomly select 28 MCQs from 51
- Randomly select 2 essays from 9
- Place essays at the end

**Key Code:**
```javascript
async function loadAndRandomizeQuestions() {
  // Load all questions
  const mcqPart1 = await fetch('data/mcq-questions-part1.json').then(r => r.json());
  const mcqPart2 = await fetch('data/mcq-questions-part2.json').then(r => r.json());
  const essays = await fetch('data/essay-questions.json').then(r => r.json());
  
  // Combine MCQs
  const allMCQs = [...mcqPart1.questions, ...mcqPart2.questions];
  
  // Shuffle and select
  const selectedMCQs = shuffleArray(allMCQs).slice(0, 28);
  const selectedEssays = shuffleArray(essays.questions).slice(0, 2);
  
  // Combine: 28 MCQs + 2 Essays
  const quizQuestions = [...selectedMCQs, ...selectedEssays];
  
  // Store in localStorage
  localStorage.setItem('quizQuestions', JSON.stringify(quizQuestions));
  
  return quizQuestions;
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
```

### Step 3: Quiz Interface (quiz.html + quiz.js)

**Features:**
- Display questions one by one or all at once
- Collect user answers
- Show progress
- Timer integration

**Key Code:**
```javascript
class QuizManager {
  constructor() {
    this.questions = JSON.parse(localStorage.getItem('quizQuestions'));
    this.answers = {};
    this.currentQuestion = 0;
  }
  
  displayQuestion(index) {
    const question = this.questions[index];
    const container = document.getElementById('question-container');
    
    if (question.id.startsWith('mcq')) {
      container.innerHTML = this.renderMCQ(question, index);
    } else {
      container.innerHTML = this.renderEssay(question, index);
    }
  }
  
  renderMCQ(question, index) {
    return `
      <div class="question">
        <h3>Question ${index + 1}</h3>
        <p>${question.text}</p>
        <div class="options">
          ${question.options.map((opt, i) => `
            <label>
              <input type="radio" name="q${index}" value="${opt.charAt(0)}">
              ${opt}
            </label>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  renderEssay(question, index) {
    return `
      <div class="question">
        <h3>Question ${index + 1} (Essay)</h3>
        <p>${question.text}</p>
        ${question.hint ? `<p class="hint"><em>Gợi ý: ${question.hint}</em></p>` : ''}
        <textarea name="q${index}" rows="6" placeholder="Your answer..."></textarea>
      </div>
    `;
  }
  
  saveAnswer(questionIndex, answer) {
    this.answers[questionIndex] = answer;
    localStorage.setItem('quizAnswers', JSON.stringify(this.answers));
  }
  
  submitQuiz() {
    const results = this.calculateScore();
    localStorage.setItem('quizResults', JSON.stringify(results));
    window.location.href = 'results.html';
  }
}
```

### Step 4: Timer Component (timer.js)

**Features:**
- 20-minute countdown
- Visual warnings
- Auto-submit at 00:00

**Key Code:**
```javascript
class Timer {
  constructor(duration, onComplete) {
    this.duration = duration; // in seconds (20 * 60 = 1200)
    this.remaining = duration;
    this.onComplete = onComplete;
    this.interval = null;
    this.startTime = Date.now();
  }
  
  start() {
    this.interval = setInterval(() => {
      this.remaining--;
      this.updateDisplay();
      
      if (this.remaining <= 0) {
        this.stop();
        this.onComplete();
      }
    }, 1000);
  }
  
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
  
  updateDisplay() {
    const minutes = Math.floor(this.remaining / 60);
    const seconds = this.remaining % 60;
    const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    document.getElementById('timer').textContent = display;
    
    // Color warnings
    const timerEl = document.getElementById('timer');
    if (this.remaining < 120) { // < 2 minutes
      timerEl.className = 'timer-critical';
    } else if (this.remaining < 300) { // < 5 minutes
      timerEl.className = 'timer-warning';
    }
  }
}

// Usage
const timer = new Timer(20 * 60, () => {
  alert('Time is up! Submitting quiz...');
  quizManager.submitQuiz();
});
timer.start();
```

### Step 5: Score Calculation (scorer.js)

**Features:**
- Calculate MCQ score (auto)
- Mark essays for manual review
- Generate score summary

**Key Code:**
```javascript
function calculateScore(questions, answers) {
  let mcqScore = 0;
  let mcqTotal = 0;
  let essayCount = 0;
  
  questions.forEach((question, index) => {
    if (question.id.startsWith('mcq')) {
      mcqTotal++;
      const userAnswer = answers[index];
      if (userAnswer === question.correctAnswer) {
        mcqScore++;
      }
    } else {
      essayCount++;
    }
  });
  
  return {
    mcqScore: mcqScore,
    mcqTotal: mcqTotal,
    essayScore: 0, // Manual grading required
    essayTotal: essayCount * 5,
    totalScore: mcqScore, // Only MCQ for now
    maxScore: mcqTotal + (essayCount * 5),
    percentage: (mcqScore / mcqTotal * 100).toFixed(1)
  };
}
```

### Step 6: Results Display (results.html)

**Features:**
- Show total score
- Do NOT show correct answers
- Option to download results
- Option to retake quiz

**Key Code:**
```javascript
function displayResults() {
  const results = JSON.parse(localStorage.getItem('quizResults'));
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  
  document.getElementById('user-name').textContent = userInfo.name;
  document.getElementById('mcq-score').textContent = 
    `${results.mcqScore}/${results.mcqTotal}`;
  document.getElementById('total-score').textContent = 
    `${results.totalScore}/${results.maxScore}`;
  document.getElementById('percentage').textContent = 
    `${results.percentage}%`;
}

function downloadResults() {
  const results = {
    userInfo: JSON.parse(localStorage.getItem('userInfo')),
    questions: JSON.parse(localStorage.getItem('quizQuestions')),
    answers: JSON.parse(localStorage.getItem('quizAnswers')),
    score: JSON.parse(localStorage.getItem('quizResults'))
  };
  
  const dataStr = JSON.stringify(results, null, 2);
  const dataBlob = new Blob([dataStr], {type: 'application/json'});
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `quiz-results-${results.userInfo.name}-${Date.now()}.json`;
  link.click();
}
```

## Data Storage Options

### Option 1: localStorage (Recommended for MVP)
**Pros:**
- Simple, no setup required
- Works offline
- Fast

**Cons:**
- Data stays in browser only
- Can be cleared by user
- Limited to ~5-10MB

### Option 2: Download Results File
**Pros:**
- User has permanent copy
- Can be collected manually
- No data loss

**Cons:**
- Manual collection required
- User must remember to download

### Option 3: EmailJS (Optional Enhancement)
**Pros:**
- Automatic email delivery
- No backend needed
- Free tier available

**Setup:**
```javascript
// Add EmailJS library
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

// Send results via email
emailjs.send('service_id', 'template_id', {
  to_email: 'admin@example.com',
  user_name: userInfo.name,
  user_phone: userInfo.phone,
  agent_name: userInfo.agentName,
  score: results.totalScore,
  max_score: results.maxScore,
  results_json: JSON.stringify(results)
});
```

### Option 4: Google Sheets (Client-Side)
**Pros:**
- Centralized data collection
- No backend server needed
- Real-time updates

**Setup:**
Use Google Sheets API with API key (client-side only)

## Deployment

### Option 1: Static Hosting (Recommended)
- **Netlify**: Drag & drop deployment
- **Vercel**: Git integration
- **GitHub Pages**: Free hosting
- **Firebase Hosting**: Google's platform

### Option 2: Simple Web Server
```bash
# Python
python -m http.server 8000

# Node.js
npx serve

# PHP
php -S localhost:8000
```

## Security Considerations

1. **No sensitive data exposure**: All questions are public anyway
2. **Client-side validation**: Validate all inputs
3. **No answer key in frontend**: Only show after submission
4. **Rate limiting**: Not needed for single-user quiz

## Advantages of Frontend-Only

✅ **Simpler**: No backend code, no server management  
✅ **Faster**: No API calls, instant responses  
✅ **Cheaper**: Free hosting options  
✅ **Offline capable**: Can work without internet (with service worker)  
✅ **Easy deployment**: Just upload files  
✅ **No database**: No setup, no maintenance  

## Limitations

❌ **No centralized data**: Results stored locally or downloaded  
❌ **Manual collection**: Need to gather result files manually  
❌ **No real-time analytics**: Can't see live results  
❌ **Essay grading**: Still manual, but that's expected  

## Recommended Tech Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling, Grid, Flexbox
- **Vanilla JavaScript**: No framework needed (or use Alpine.js for simplicity)
- **localStorage**: Data persistence
- **JSON files**: Question bank
- **Optional**: EmailJS for automated result delivery

## Next Steps

1. Start with `task-001`: Create HTML structure
2. Implement `randomizer.js`: Question selection
3. Build `timer.js`: 20-minute countdown
4. Create `quiz.js`: Quiz logic
5. Implement `scorer.js`: Score calculation
6. Build `results.html`: Display scores
7. Add download functionality
8. Test thoroughly
9. Deploy to Netlify/Vercel

This approach is perfect for your use case and much simpler than a full-stack solution!
