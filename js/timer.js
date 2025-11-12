/**
 * Quiz Timer Module
 * 20-minute countdown timer with auto-submit
 * Vinhomes Green Paradise Quiz
 */

(function() {
    'use strict';

    class QuizTimer {
        constructor(durationMinutes, onComplete) {
            this.duration = durationMinutes * 60; // Convert to seconds
            this.remaining = this.duration;
            this.onComplete = onComplete;
            this.interval = null;
            this.startTime = null;
            this.timerElement = document.getElementById('timer');
            this.isPaused = false;
        }

        /**
         * Start the timer
         */
        start() {
            if (this.interval) {
                console.warn('Timer already running');
                return;
            }

            this.startTime = Date.now();
            this.updateDisplay();
            this.updateWarningColor();

            this.interval = setInterval(() => {
                if (!this.isPaused) {
                    this.remaining--;
                    this.updateDisplay();
                    this.updateWarningColor();

                    // Save remaining time to localStorage
                    this.saveState();

                    if (this.remaining <= 0) {
                        this.stop();
                        if (this.onComplete) {
                            this.onComplete();
                        }
                    }
                }
            }, 1000);

            console.log('Timer started:', this.duration, 'seconds');
        }

        /**
         * Stop the timer
         */
        stop() {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
                console.log('Timer stopped');
            }
        }

        /**
         * Pause the timer
         */
        pause() {
            this.isPaused = true;
            console.log('Timer paused');
        }

        /**
         * Resume the timer
         */
        resume() {
            this.isPaused = false;
            console.log('Timer resumed');
        }

        /**
         * Update the timer display
         */
        updateDisplay() {
            const minutes = Math.floor(this.remaining / 60);
            const seconds = this.remaining % 60;
            const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            if (this.timerElement) {
                this.timerElement.textContent = display;
            }
        }

        /**
         * Update timer color based on remaining time
         */
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

        /**
         * Get time remaining in seconds
         * @returns {number} Seconds remaining
         */
        getTimeRemaining() {
            return this.remaining;
        }

        /**
         * Check if timer has expired
         * @returns {boolean} True if expired
         */
        isExpired() {
            return this.remaining <= 0;
        }

        /**
         * Get formatted time remaining
         * @returns {string} Formatted time (MM:SS)
         */
        getFormattedTime() {
            const minutes = Math.floor(this.remaining / 60);
            const seconds = this.remaining % 60;
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        /**
         * Save timer state to localStorage
         */
        saveState() {
            const state = {
                remaining: this.remaining,
                startTime: this.startTime,
                lastUpdate: Date.now()
            };
            localStorage.setItem('timerState', JSON.stringify(state));
        }

        /**
         * Restore timer state from localStorage
         * @returns {boolean} True if state was restored
         */
        restoreState() {
            const stateJson = localStorage.getItem('timerState');
            if (!stateJson) return false;

            try {
                const state = JSON.parse(stateJson);
                const elapsed = Math.floor((Date.now() - state.lastUpdate) / 1000);
                this.remaining = Math.max(0, state.remaining - elapsed);
                
                console.log('Timer state restored:', this.remaining, 'seconds remaining');
                return true;
            } catch (error) {
                console.error('Error restoring timer state:', error);
                return false;
            }
        }

        /**
         * Clear timer state from localStorage
         */
        static clearState() {
            localStorage.removeItem('timerState');
        }
    }

    /**
     * Initialize timer when quiz page loads
     * @param {Function} onTimeUp - Callback when time expires
     * @param {number} durationMinutes - Timer duration in minutes (default: 20)
     * @returns {QuizTimer} Timer instance
     */
    function initializeTimer(onTimeUp, durationMinutes = 20) {
        const timer = new QuizTimer(durationMinutes, onTimeUp);
        
        // Try to restore previous state (for page refresh)
        const restored = timer.restoreState();
        
        if (restored && timer.isExpired()) {
            // Timer already expired
            console.log('Timer already expired');
            if (onTimeUp) {
                onTimeUp();
            }
        } else {
            // Start the timer
            timer.start();
        }

        return timer;
    }

    // Export to global scope
    window.QuizTimer = {
        Timer: QuizTimer,
        initialize: initializeTimer,
        clearState: QuizTimer.clearState
    };

})();
