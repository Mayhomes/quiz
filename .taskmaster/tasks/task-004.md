# Task 004: Implement 20-Minute Countdown Timer

## Metadata
- **ID**: task-004
- **Status**: pending
- **Priority**: high
- **Tags**: frontend, javascript, timer
- **Created**: 2025-11-11T19:46:51+07:00
- **Updated**: 2025-11-11T19:46:51+07:00

## Description
Create timer component with countdown, visual warnings, and auto-submit at 00:00

## Dependencies
- task-002 (Build Quiz Interface Page)

## Subtasks
- [ ] Create timer.js module
- [ ] Implement countdown from 20:00 to 00:00
- [ ] Update display every second
- [ ] Add color warnings (green > yellow > red)
- [ ] Implement auto-submit when time expires
- [ ] Prevent submission after timeout
- [ ] Add timer to quiz page UI

## Implementation Details

### timer.js
```javascript
class QuizTimer {
    constructor(durationMinutes, onComplete) {
        this.duration = durationMinutes * 60; // Convert to seconds
        this.remaining = this.duration;
        this.onComplete = onComplete;
        this.interval = null;
        this.startTime = null;
        this.timerElement = document.getElementById('timer');
    }
    
    start() {
        this.startTime = Date.now();
        this.updateDisplay();
        
        this.interval = setInterval(() => {
            this.remaining--;
            this.updateDisplay();
            this.updateWarningColor();
            
            if (this.remaining <= 0) {
                this.stop();
                this.onComplete();
            }
        }, 1000);
    }
    
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.remaining / 60);
        const seconds = this.remaining % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (this.timerElement) {
            this.timerElement.textContent = display;
        }
    }
    
    updateWarningColor() {
        if (!this.timerElement) return;
        
        // Remove all warning classes
        this.timerElement.classList.remove('timer-normal', 'timer-warning', 'timer-critical');
        
        if (this.remaining < 120) { // Less than 2 minutes
            this.timerElement.classList.add('timer-critical');
        } else if (this.remaining < 300) { // Less than 5 minutes
            this.timerElement.classList.add('timer-warning');
        } else {
            this.timerElement.classList.add('timer-normal');
        }
    }
    
    getTimeRemaining() {
        return this.remaining;
    }
    
    isExpired() {
        return this.remaining <= 0;
    }
}

// Initialize timer when quiz page loads
function initializeTimer(onTimeUp) {
    const timer = new QuizTimer(20, onTimeUp);
    timer.start();
    return timer;
}

// Export
window.QuizTimer = {
    Timer: QuizTimer,
    initialize: initializeTimer
};
```

### CSS for Timer (add to styles.css)
```css
.timer {
    font-size: 24px;
    font-weight: bold;
    padding: 10px 20px;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.timer-normal {
    background-color: #4CAF50;
    color: white;
}

.timer-warning {
    background-color: #FFC107;
    color: #333;
    animation: pulse 1s infinite;
}

.timer-critical {
    background-color: #F44336;
    color: white;
    animation: pulse 0.5s infinite;
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
}
```

## Acceptance Criteria
- [ ] Timer starts at 20:00 when quiz page loads
- [ ] Timer counts down accurately (1 second intervals)
- [ ] Display format is MM:SS
- [ ] Timer is green when > 5 minutes remaining
- [ ] Timer is yellow when 2-5 minutes remaining
- [ ] Timer is red when < 2 minutes remaining
- [ ] Timer pulses/animates when in warning/critical state
- [ ] Auto-submit triggers when timer reaches 00:00
- [ ] User cannot submit after timer expires
- [ ] Timer stops when quiz is submitted manually

## Testing Checklist
- [ ] Test full 20-minute countdown (or use shorter duration for testing)
- [ ] Verify color changes at correct thresholds
- [ ] Test auto-submit functionality
- [ ] Test manual submit before time expires
- [ ] Verify timer stops after submission
- [ ] Test page refresh (timer should restart - acceptable for MVP)

## Files to Create
- `js/timer.js`

## Files to Modify
- `css/styles.css` (add timer styles)
- `quiz.html` (ensure timer element exists)

## Notes
- Timer uses setInterval for countdown
- Visual warnings help users manage time
- Auto-submit prevents late submissions
- For MVP, timer resets on page refresh (enhancement: persist timer state)
