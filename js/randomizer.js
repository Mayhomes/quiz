/**
 * Question Randomizer Module
 * Loads and randomizes quiz questions
 * Vinhomes Green Paradise Quiz
 */

(function() {
    'use strict';

    /**
     * Fisher-Yates shuffle algorithm
     * @param {Array} array - Array to shuffle
     * @returns {Array} Shuffled array
     */
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Load questions from JSON files
     * @returns {Promise<Object>} Object containing MCQs
     */
    async function loadQuestions() {
        try {
            const mcqPart1Response = await fetch('data/mcq-questions-part1.json');

            if (!mcqPart1Response.ok) {
                throw new Error('Failed to load question files');
            }

            const mcqPart1 = await mcqPart1Response.json();

            return {
                mcqs: mcqPart1.questions
            };
        } catch (error) {
            console.error('Error loading questions:', error);
            throw new Error('Không thể tải câu hỏi. Vui lòng kiểm tra kết nối và thử lại.');
        }
    }

    /**
     * Shuffle answer options for a question while preserving correct answer
     * @param {Object} question - Question object
     * @returns {Object} Question with shuffled options
     */
    function shuffleQuestionOptions(question) {
        const correctAnswer = question.correctAnswer;
        const shuffledOptions = shuffleArray(question.options);
        
        return {
            ...question,
            options: shuffledOptions,
            correctAnswer: correctAnswer // Keep the correct answer text, not the index
        };
    }

    /**
     * Randomize and select questions for the quiz
     * @returns {Promise<Array>} Array of 20 selected questions
     */
    async function randomizeQuestions() {
        const data = await loadQuestions();
        
        if (!data || !data.mcqs) {
            throw new Error('Invalid question data');
        }

        // Validate we have enough questions
        if (data.mcqs.length < 20) {
            throw new Error(`Không đủ câu hỏi trắc nghiệm (cần 20, có ${data.mcqs.length})`);
        }

        // Shuffle and select 20 MCQs
        const shuffledMCQs = shuffleArray(data.mcqs);
        const selectedMCQs = shuffledMCQs.slice(0, 20);
        
        // Shuffle answer options for each question
        const questionsWithShuffledOptions = selectedMCQs.map(q => shuffleQuestionOptions(q));

        // Store in localStorage
        localStorage.setItem('quizQuestions', JSON.stringify(questionsWithShuffledOptions));
        
        console.log('Questions randomized:', {
            mcqs: selectedMCQs.length,
            total: questionsWithShuffledOptions.length
        });

        return questionsWithShuffledOptions;
    }

    /**
     * Initialize quiz with randomized questions
     * Checks if questions already exist (page refresh)
     * @returns {Promise<Array>} Array of quiz questions
     */
    async function initializeQuiz() {
        // Check if questions already exist (page refresh)
        let questionsJson = localStorage.getItem('quizQuestions');
        
        if (questionsJson) {
            try {
                const questions = JSON.parse(questionsJson);
                
                // Validate the stored questions
                if (Array.isArray(questions) && questions.length === 20) {
                    console.log('Using existing questions from localStorage');
                    return questions;
                }
            } catch (error) {
                console.error('Error parsing stored questions:', error);
            }
        }

        // First time or invalid data - randomize questions
        console.log('Randomizing new questions...');
        return await randomizeQuestions();
    }

    /**
     * Get stored questions without randomizing
     * @returns {Array|null} Stored questions or null
     */
    function getStoredQuestions() {
        const questionsJson = localStorage.getItem('quizQuestions');
        if (questionsJson) {
            try {
                return JSON.parse(questionsJson);
            } catch (error) {
                console.error('Error parsing stored questions:', error);
                return null;
            }
        }
        return null;
    }

    /**
     * Clear stored questions
     */
    function clearQuestions() {
        localStorage.removeItem('quizQuestions');
        console.log('Questions cleared from localStorage');
    }

    // Export to global scope
    window.QuizRandomizer = {
        initializeQuiz,
        randomizeQuestions,
        getStoredQuestions,
        clearQuestions
    };

})();
