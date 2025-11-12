# Task 006: Implement Score Calculation (Frontend)

## Metadata
- **ID**: task-006
- **Status**: pending
- **Priority**: high
- **Tags**: frontend, javascript, scoring
- **Created**: 2025-11-11T19:46:51+07:00
- **Updated**: 2025-11-11T19:46:51+07:00

## Description
Calculate MCQ scores in JavaScript and prepare data for storage

## Dependencies
- task-005 (Implement Quiz Logic and State Management)

## Subtasks
- [ ] Create scorer.js module
- [ ] Compare user answers with correct answers
- [ ] Calculate MCQ score (1 point each)
- [ ] Mark essays for manual review
- [ ] Calculate total score
- [ ] Generate score summary
- [ ] Store results in localStorage

## Implementation Details

### scorer.js
```javascript
class QuizScorer {
    static calculateScore(questions, answers) {
        let mcqScore = 0;
        let mcqTotal = 0;
        let essayCount = 0;
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
                    userAnswer: userAnswer,
                    correctAnswer: question.correctAnswer, // Store but don't show to user
                    isCorrect: isCorrect,
                    points: isCorrect ? 1 : 0
                });
            } else {
                essayCount++;
                details.push({
                    questionId: question.id,
                    questionNumber: index + 1,
                    type: 'essay',
                    userAnswer: userAnswer,
                    points: 0, // Manual grading required
                    status: 'pending_review'
                });
            }
        });
        
        return {
            mcqScore: mcqScore,
            mcqTotal: mcqTotal,
            mcqPercentage: mcqTotal > 0 ? ((mcqScore / mcqTotal) * 100).toFixed(1) : 0,
            essayScore: 0, // Manual grading
            essayTotal: essayCount * 5,
            totalScore: mcqScore, // Only MCQ for now
            maxScore: mcqTotal + (essayCount * 5),
            details: details,
            timestamp: new Date().toISOString()
        };
    }
    
    static calculateAndSave(questions, answers) {
        const results = this.calculateScore(questions, answers);
        
        // Store results
        localStorage.setItem('quizResults', JSON.stringify(results));
        
        return results;
    }
    
    static getResults() {
        const results = localStorage.getItem('quizResults');
        return results ? JSON.parse(results) : null;
    }
    
    static generateSummary() {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const questions = JSON.parse(localStorage.getItem('quizQuestions'));
        const answers = JSON.parse(localStorage.getItem('quizAnswers'));
        const results = this.getResults();
        
        if (!userInfo || !questions || !results) {
            return null;
        }
        
        return {
            userInfo: userInfo,
            quiz: {
                totalQuestions: questions.length,
                mcqCount: results.mcqTotal,
                essayCount: questions.length - results.mcqTotal,
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
                    percentage: ((results.totalScore / results.maxScore) * 100).toFixed(1)
                }
            },
            details: results.details,
            timestamp: results.timestamp
        };
    }
}

// Export
window.QuizScorer = QuizScorer;
```

## Scoring Rules

### MCQ Questions
- **Points per question**: 1 point
- **Total MCQ questions**: 28
- **Maximum MCQ score**: 28 points
- **Calculation**: Automatic comparison with correct answer

### Essay Questions
- **Points per question**: 5 points
- **Total essay questions**: 2
- **Maximum essay score**: 10 points
- **Calculation**: Manual review required (initially 0)

### Total Score
- **Maximum possible**: 38 points (28 MCQ + 10 Essay)
- **Displayed to user**: MCQ score only (essays pending)
- **Full score**: Available after manual essay grading

## Acceptance Criteria
- [ ] MCQ answers compared correctly with correct answers
- [ ] MCQ score calculated accurately (1 point each)
- [ ] Essay questions marked for manual review
- [ ] Total score calculated correctly
- [ ] Results stored in localStorage
- [ ] Score summary includes all necessary data
- [ ] User answers preserved for export
- [ ] Correct answers stored but not exposed to user

## Testing Checklist
- [ ] Test with all correct MCQ answers (should get 28/28)
- [ ] Test with all wrong MCQ answers (should get 0/28)
- [ ] Test with mixed correct/wrong answers
- [ ] Test with unanswered questions (should count as wrong)
- [ ] Verify essay questions marked as pending
- [ ] Verify total score calculation
- [ ] Test score persistence in localStorage

## Files to Create
- `js/scorer.js`

## Notes
- Only MCQ scores are calculated automatically
- Essay questions require manual grading
- Correct answers are stored but not shown to users
- Score details include question-by-question breakdown for admin review
