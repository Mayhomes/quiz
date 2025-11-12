# Task 003: Implement Question Randomization Logic

## Metadata
- **ID**: task-003
- **Status**: pending
- **Priority**: high
- **Tags**: frontend, javascript, logic
- **Created**: 2025-11-11T19:46:51+07:00
- **Updated**: 2025-11-11T19:46:51+07:00

## Description
Create JavaScript to randomly select 28 MCQs from 51 and 2 essays from 9, with essays always at the end

## Dependencies
- task-002 (Build Quiz Interface Page)

## Subtasks
- [ ] Create randomizer.js module
- [ ] Load questions from JSON files
- [ ] Implement shuffle algorithm
- [ ] Select 28 random MCQs
- [ ] Select 2 random essays
- [ ] Combine questions with essays at end
- [ ] Store selected questions in localStorage

## Implementation Details

### randomizer.js
```javascript
// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Load questions from JSON files
async function loadQuestions() {
    try {
        const [mcqPart1Response, mcqPart2Response, essayResponse] = await Promise.all([
            fetch('data/mcq-questions-part1.json'),
            fetch('data/mcq-questions-part2.json'),
            fetch('data/essay-questions.json')
        ]);
        
        const mcqPart1 = await mcqPart1Response.json();
        const mcqPart2 = await mcqPart2Response.json();
        const essays = await essayResponse.json();
        
        return {
            mcqs: [...mcqPart1.questions, ...mcqPart2.questions],
            essays: essays.questions
        };
    } catch (error) {
        console.error('Error loading questions:', error);
        alert('Không thể tải câu hỏi. Vui lòng thử lại.');
        return null;
    }
}

// Randomize and select questions
async function randomizeQuestions() {
    const data = await loadQuestions();
    if (!data) return null;
    
    // Shuffle and select 28 MCQs
    const shuffledMCQs = shuffleArray(data.mcqs);
    const selectedMCQs = shuffledMCQs.slice(0, 28);
    
    // Shuffle and select 2 essays
    const shuffledEssays = shuffleArray(data.essays);
    const selectedEssays = shuffledEssays.slice(0, 2);
    
    // Combine: 28 MCQs + 2 Essays (essays at the end)
    const quizQuestions = [...selectedMCQs, ...selectedEssays];
    
    // Store in localStorage
    localStorage.setItem('quizQuestions', JSON.stringify(quizQuestions));
    
    return quizQuestions;
}

// Initialize quiz with randomized questions
async function initializeQuiz() {
    // Check if questions already exist (page refresh)
    let questions = localStorage.getItem('quizQuestions');
    
    if (!questions) {
        // First time - randomize questions
        questions = await randomizeQuestions();
    } else {
        // Parse existing questions
        questions = JSON.parse(questions);
    }
    
    return questions;
}

// Export functions
window.QuizRandomizer = {
    initializeQuiz,
    randomizeQuestions
};
```

## Acceptance Criteria
- [ ] Successfully loads all 51 MCQs from both JSON files
- [ ] Successfully loads all 9 essay questions
- [ ] Shuffle algorithm produces different results each time
- [ ] Exactly 28 MCQs are selected
- [ ] Exactly 2 essay questions are selected
- [ ] Essay questions are always at positions 29 and 30
- [ ] No duplicate questions in selection
- [ ] Selected questions stored in localStorage
- [ ] Handles errors gracefully (network issues, missing files)

## Testing Checklist
- [ ] Test with all question files present
- [ ] Test with missing question files (error handling)
- [ ] Verify randomization by running multiple times
- [ ] Verify no duplicates in selection
- [ ] Verify essay questions always at end
- [ ] Test localStorage persistence across page refresh

## Files to Create
- `js/randomizer.js`

## Notes
- Questions are loaded asynchronously using fetch API
- Uses Fisher-Yates shuffle for true randomization
- Stores questions in localStorage to persist across page refresh
- Error handling for network failures
