/**
 * Quiz Scorer Module
 * Calculates scores for MCQ and Essay questions
 * Vinhomes Green Paradise Quiz
 */

(function() {
    'use strict';

    class QuizScorer {
        /**
         * Calculate score for the quiz
         * @param {Array} questions - Array of quiz questions
         * @param {Object} answers - Object with question index as key and answer as value
         * @returns {Object} Score results
         */
        static calculateScore(questions, answers) {
            let mcqScore = 0;
            let mcqTotal = 0;
            const details = [];

            questions.forEach((question, index) => {
                const userAnswer = answers[index] || null;

                if (question.id.startsWith('mcq')) {
                    mcqTotal++;
                    const isCorrect = userAnswer === question.correctAnswer;

                    if (isCorrect) {
                        mcqScore++;
                    }

                    details.push({
                        questionId: question.id,
                        questionNumber: index + 1,
                        type: 'mcq',
                        questionText: question.text,
                        userAnswer: userAnswer,
                        correctAnswer: question.correctAnswer, // Store but don't show to user
                        isCorrect: isCorrect,
                        points: isCorrect ? 1 : 0,
                        maxPoints: 1
                    });
                }
            });

            const totalScore = mcqScore; // MCQ only
            const maxScore = mcqTotal; // 30 points total

            return {
                mcqScore: mcqScore,
                mcqTotal: mcqTotal,
                mcqPercentage: mcqTotal > 0 ? ((mcqScore / mcqTotal) * 100).toFixed(1) : 0,
                essayScore: 0,
                essayTotal: 0,
                essayCount: 0,
                totalScore: totalScore,
                maxScore: maxScore,
                percentage: maxScore > 0 ? ((totalScore / maxScore) * 100).toFixed(1) : 0,
                details: details,
                timestamp: new Date().toISOString()
            };
        }

        /**
         * Calculate and save results to localStorage
         * @param {Array} questions - Array of quiz questions
         * @param {Object} answers - Object with answers
         * @returns {Object} Score results
         */
        static calculateAndSave(questions, answers) {
            const results = this.calculateScore(questions, answers);

            // Store results
            localStorage.setItem('quizResults', JSON.stringify(results));

            console.log('Quiz results calculated and saved:', {
                mcqScore: `${results.mcqScore}/${results.mcqTotal}`,
                totalScore: `${results.totalScore}/${results.maxScore}`,
                percentage: `${results.percentage}%`
            });

            return results;
        }

        /**
         * Get stored results from localStorage
         * @returns {Object|null} Stored results or null
         */
        static getResults() {
            const resultsJson = localStorage.getItem('quizResults');
            if (resultsJson) {
                try {
                    return JSON.parse(resultsJson);
                } catch (error) {
                    console.error('Error parsing quiz results:', error);
                    return null;
                }
            }
            return null;
        }

        /**
         * Generate complete summary with user info and quiz data
         * @returns {Object|null} Complete summary or null
         */
        static generateSummary() {
            const userInfoJson = localStorage.getItem('userInfo');
            const questionsJson = localStorage.getItem('quizQuestions');
            const answersJson = localStorage.getItem('quizAnswers');
            const results = this.getResults();

            if (!userInfoJson || !questionsJson || !results) {
                console.error('Missing data for summary generation');
                return null;
            }

            try {
                const userInfo = JSON.parse(userInfoJson);
                const questions = JSON.parse(questionsJson);
                const answers = answersJson ? JSON.parse(answersJson) : {};

                return {
                    userInfo: {
                        name: userInfo.name,
                        phone: userInfo.phone,
                        agentName: userInfo.agentName,
                        startTime: userInfo.timestamp
                    },
                    quiz: {
                        totalQuestions: questions.length,
                        mcqCount: results.mcqTotal,
                        essayCount: results.essayCount,
                        questions: questions,
                        answers: answers
                    },
                    score: {
                        mcq: {
                            score: results.mcqScore,
                            total: results.mcqTotal,
                            percentage: results.mcqPercentage
                        },
                        essay: {
                            score: results.essayScore,
                            total: results.essayTotal,
                            status: 'pending_manual_review'
                        },
                        total: {
                            score: results.totalScore,
                            maxScore: results.maxScore,
                            percentage: results.percentage
                        }
                    },
                    details: results.details,
                    completedAt: results.timestamp
                };
            } catch (error) {
                console.error('Error generating summary:', error);
                return null;
            }
        }

        /**
         * Clear all quiz data from localStorage
         */
        static clearAllData() {
            localStorage.removeItem('quizResults');
            localStorage.removeItem('quizAnswers');
            localStorage.removeItem('quizQuestions');
            localStorage.removeItem('timerState');
            console.log('All quiz data cleared');
        }

        /**
         * Get statistics about answered questions
         * @param {Array} questions - Array of questions
         * @param {Object} answers - Object with answers
         * @returns {Object} Statistics
         */
        static getAnswerStatistics(questions, answers) {
            const total = questions.length;
            const answered = Object.keys(answers).filter(key => {
                const answer = answers[key];
                return answer !== null && answer !== undefined && answer !== '';
            }).length;

            return {
                total: total,
                answered: answered,
                unanswered: total - answered,
                percentage: total > 0 ? ((answered / total) * 100).toFixed(1) : 0
            };
        }
    }

    // Export to global scope
    window.QuizScorer = QuizScorer;

})();
