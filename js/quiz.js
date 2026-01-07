/**
 * Quiz Controller - Main Quiz Logic
 * Manages quiz state, questions, answers, and user interactions
 * Vinhomes Green Paradise Quiz
 */

(function() {
    'use strict';

    class QuizManager {
        constructor() {
            this.questions = [];
            this.answers = {};
            this.timer = null;
            this.isSubmitted = false;
            this.userInfo = null;
        }

        /**
         * Initialize the quiz
         */
        async initialize() {
            try {
                // Check user info
                if (!this.loadUserInfo()) {
                    return;
                }

                // Display user name
                this.displayUserName();

                // Load or randomize questions
                await this.loadQuestions();

                // Display questions
                this.displayAllQuestions();

                // Initialize timer
                this.initializeTimer();

                // Setup event listeners
                this.setupEventListeners();

                // Load saved answers if any
                this.loadSavedAnswers();

                // Hide loading, show content
                this.showQuizContent();

                // Update progress
                this.updateProgress();

            } catch (error) {
                console.error('Error initializing quiz:', error);
                alert('Có lỗi xảy ra khi tải bài thi: ' + error.message);
                window.location.href = 'index.html';
            }
        }

        /**
         * Load user info from localStorage
         * @returns {boolean} True if user info exists
         */
        loadUserInfo() {
            const userInfoJson = localStorage.getItem('userInfo');
            
            if (!userInfoJson) {
                alert('Vui lòng điền thông tin trước khi bắt đầu quiz');
                window.location.href = 'index.html';
                return false;
            }

            try {
                this.userInfo = JSON.parse(userInfoJson);
                return true;
            } catch (error) {
                console.error('Error parsing user info:', error);
                alert('Thông tin người dùng không hợp lệ');
                window.location.href = 'index.html';
                return false;
            }
        }

        /**
         * Display user name in header
         */
        displayUserName() {
            const userNameEl = document.getElementById('userName');
            if (userNameEl && this.userInfo) {
                userNameEl.textContent = this.userInfo.name;
            }
        }

        /**
         * Load questions
         */
        async loadQuestions() {
            this.questions = await window.QuizRandomizer.initializeQuiz();

            if (!this.questions || this.questions.length === 0) {
                throw new Error('Không thể tải câu hỏi');
            }

            console.log('Questions loaded:', this.questions.length);
        }

        /**
         * Display all questions
         */
        displayAllQuestions() {
            const container = document.getElementById('questions-container');
            container.innerHTML = '';

            this.questions.forEach((question, index) => {
                const questionEl = this.createQuestionElement(question, index);
                container.appendChild(questionEl);
            });

            // Update total questions count
            const totalEl = document.getElementById('total-questions');
            if (totalEl) {
                totalEl.textContent = this.questions.length;
            }
        }

        /**
         * Create question element
         * @param {Object} question - Question data
         * @param {number} index - Question index
         * @returns {HTMLElement} Question element
         */
        createQuestionElement(question, index) {
            const div = document.createElement('div');
            div.className = 'question';
            div.dataset.questionId = question.id;
            div.dataset.questionIndex = index;

            if (question.id.startsWith('mcq')) {
                div.innerHTML = this.renderMCQ(question, index);
            } else {
                div.innerHTML = this.renderEssay(question, index);
            }

            return div;
        }

        /**
         * Render MCQ question
         * @param {Object} question - Question data
         * @param {number} index - Question index
         * @returns {string} HTML string
         */
        renderMCQ(question, index) {
            const optionsHTML = question.options.map(option => {
                // Use the full option text as the value to match correctAnswer
                return `
                    <label class="option">
                        <input type="radio" name="q${index}" value="${option}" data-question-index="${index}">
                        <span>${option}</span>
                    </label>
                `;
            }).join('');

            return `
                <h3>
                    Câu hỏi ${index + 1}
                    <span class="question-type-badge">Trắc nghiệm</span>
                </h3>
                <p class="question-text">${question.text}</p>
                <div class="options">
                    ${optionsHTML}
                </div>
            `;
        }

        /**
         * Render essay question
         * @param {Object} question - Question data
         * @param {number} index - Question index
         * @returns {string} HTML string
         */
        renderEssay(question, index) {
            return `
                <h3>
                    Câu hỏi ${index + 1}
                    <span class="question-type-badge essay">Tự luận</span>
                </h3>
                <p class="question-text">${question.text}</p>
                ${question.hint ? `<p class="hint"><em>💡 Gợi ý: ${question.hint}</em></p>` : ''}
                <textarea 
                    name="q${index}" 
                    rows="6" 
                    placeholder="Nhập câu trả lời của bạn..."
                    data-question-index="${index}"
                ></textarea>
            `;
        }

        /**
         * Initialize timer
         */
        initializeTimer() {
            this.timer = window.QuizTimer.initialize(() => this.autoSubmit(), 15);
        }

        /**
         * Setup event listeners
         */
        setupEventListeners() {
            // Listen for answer changes
            const container = document.getElementById('questions-container');
            container.addEventListener('change', (e) => {
                if (e.target.matches('input[type="radio"]')) {
                    const questionIndex = parseInt(e.target.dataset.questionIndex);
                    this.saveAnswer(questionIndex, e.target.value);
                    this.markQuestionAsAnswered(questionIndex);
                }
            });

            container.addEventListener('input', (e) => {
                if (e.target.matches('textarea')) {
                    const questionIndex = parseInt(e.target.dataset.questionIndex);
                    this.saveAnswer(questionIndex, e.target.value);
                    this.markQuestionAsAnswered(questionIndex);
                }
            });

            // Submit button
            const submitBtn = document.getElementById('submit-btn');
            if (submitBtn) {
                submitBtn.addEventListener('click', () => this.showSubmitModal());
            }

            // Modal buttons
            const confirmBtn = document.getElementById('confirm-submit');
            const cancelBtn = document.getElementById('cancel-submit');
            
            if (confirmBtn) {
                confirmBtn.addEventListener('click', () => this.submitQuiz());
            }
            
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => this.hideSubmitModal());
            }

            // Scroll to top button
            const scrollBtn = document.getElementById('scroll-top-btn');
            if (scrollBtn) {
                scrollBtn.addEventListener('click', () => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });

                // Show/hide scroll button based on scroll position
                window.addEventListener('scroll', () => {
                    if (window.pageYOffset > 300) {
                        scrollBtn.style.display = 'block';
                    } else {
                        scrollBtn.style.display = 'none';
                    }
                });
            }

            // Warn before leaving page
            window.addEventListener('beforeunload', (e) => {
                if (!this.isSubmitted) {
                    e.preventDefault();
                    e.returnValue = 'Bạn có chắc muốn rời khỏi trang? Bài làm của bạn sẽ bị mất.';
                }
            });
        }

        /**
         * Save answer to localStorage
         * @param {number} questionIndex - Question index
         * @param {string} answer - User's answer
         */
        saveAnswer(questionIndex, answer) {
            this.answers[questionIndex] = answer;
            localStorage.setItem('quizAnswers', JSON.stringify(this.answers));
            this.updateProgress();
        }

        /**
         * Mark question as answered visually
         * @param {number} questionIndex - Question index
         */
        markQuestionAsAnswered(questionIndex) {
            const questionEl = document.querySelector(`[data-question-index="${questionIndex}"]`);
            if (questionEl) {
                const questionDiv = questionEl.closest('.question');
                if (questionDiv) {
                    questionDiv.classList.add('answered');
                }
            }
        }

        /**
         * Load saved answers from localStorage
         */
        loadSavedAnswers() {
            const answersJson = localStorage.getItem('quizAnswers');
            if (!answersJson) return;

            try {
                this.answers = JSON.parse(answersJson);

                // Restore answers to form
                Object.keys(this.answers).forEach(index => {
                    const answer = this.answers[index];
                    if (!answer) return;

                    const input = document.querySelector(`[data-question-index="${index}"]`);

                    if (input) {
                        if (input.type === 'radio') {
                            const radio = document.querySelector(`input[name="q${index}"][value="${answer}"]`);
                            if (radio) {
                                radio.checked = true;
                                this.markQuestionAsAnswered(parseInt(index));
                            }
                        } else if (input.tagName === 'TEXTAREA') {
                            input.value = answer;
                            this.markQuestionAsAnswered(parseInt(index));
                        }
                    }
                });

                console.log('Saved answers restored:', Object.keys(this.answers).length);
            } catch (error) {
                console.error('Error loading saved answers:', error);
            }
        }

        /**
         * Update progress indicators
         */
        updateProgress() {
            const stats = window.QuizScorer.getAnswerStatistics(this.questions, this.answers);

            // Update answered count
            const answeredCountEl = document.getElementById('answered-count');
            if (answeredCountEl) {
                answeredCountEl.textContent = stats.answered;
            }

            // Update percentage
            const percentageEl = document.getElementById('answered-percentage');
            if (percentageEl) {
                percentageEl.textContent = stats.percentage + '%';
            }

            // Update progress bar
            const progressFill = document.getElementById('progress-fill');
            if (progressFill) {
                progressFill.style.width = stats.percentage + '%';
            }
        }

        /**
         * Show submit confirmation modal
         */
        showSubmitModal() {
            const stats = window.QuizScorer.getAnswerStatistics(this.questions, this.answers);

            // Update modal content
            document.getElementById('modal-answered').textContent = stats.answered;
            document.getElementById('modal-total').textContent = stats.total;

            // Show modal
            const modal = document.getElementById('submit-modal');
            if (modal) {
                modal.style.display = 'flex';
            }
        }

        /**
         * Hide submit confirmation modal
         */
        hideSubmitModal() {
            const modal = document.getElementById('submit-modal');
            if (modal) {
                modal.style.display = 'none';
            }
        }

        /**
         * Submit quiz
         */
        submitQuiz() {
            if (this.isSubmitted) return;

            this.isSubmitted = true;
            this.hideSubmitModal();

            // Stop timer
            if (this.timer) {
                this.timer.stop();
            }

            // Calculate score
            window.QuizScorer.calculateAndSave(this.questions, this.answers);

            // Navigate to results
            window.location.href = 'results.html';
        }

        /**
         * Auto-submit when time expires
         */
        autoSubmit() {
            alert('⏰ Hết giờ! Bài thi sẽ được nộp tự động.');
            this.isSubmitted = true;
            window.QuizScorer.calculateAndSave(this.questions, this.answers);
            window.location.href = 'results.html';
        }

        /**
         * Show quiz content (hide loading)
         */
        showQuizContent() {
            const loading = document.getElementById('loading-state');
            const questions = document.getElementById('questions-container');
            const submitSection = document.getElementById('submit-section');

            if (loading) loading.style.display = 'none';
            if (questions) questions.style.display = 'block';
            if (submitSection) submitSection.style.display = 'block';
        }
    }

    // Initialize when page loads
    document.addEventListener('DOMContentLoaded', () => {
        const quizManager = new QuizManager();
        quizManager.initialize();
    });

})();
