# Random Quiz Questions Web App

A timed quiz web application with randomized questions that saves results to Google Sheets.

## Project Overview

This application allows users to take a 20-minute timed quiz with randomly selected questions. Each quiz consists of 28 multiple-choice questions and 2 essay questions. Results are automatically saved to Google Sheets, and users receive only their total score.

## Features

- **Random Question Selection**: 28 MCQs randomly selected from a pool of 51
- **Essay Questions**: 2 essay questions always included at the end
- **20-Minute Timer**: Countdown timer with auto-submit
- **Google Sheets Integration**: Automatic data storage
- **Score Summary**: Users see only total score, not individual answers
- **Responsive Design**: Works on desktop and mobile devices

## Quiz Structure

- **Master Set**: 51 MCQs + 9 Essay Questions
- **Per User**: 28 MCQs + 2 Essay Questions = 30 Total Questions
- **Time Limit**: 20 minutes
- **Scoring**: MCQs (1 point each), Essays (5 points each)

## Taskmaster-AI Integration

This project uses Taskmaster-AI for task management and workflow automation.

### Configuration Files

- `taskmaster.config.json` - Main configuration
- `.taskmaster/tasks.json` - Task definitions and tracking
- `.taskmaster/history.json` - Task history and logs

### Task Management

View and manage tasks using the Taskmaster-AI CLI or by editing `.taskmaster/tasks.json`.

Current tasks include:
1. Setup Frontend Structure
2. Implement Question Randomization
3. Implement Timer Component
4. Setup Google Sheets Backend
5. Implement Score Calculation
6. Create Question Bank
7. Testing and QA
8. Responsive Design Implementation

## Getting Started

### Prerequisites

- Modern web browser
- Google Account (for Google Sheets integration)
- Text editor or IDE

### Installation

1. Clone or download this repository
2. Review the PRD document (`prd.txt`) for detailed requirements
3. Follow the task list in `.taskmaster/tasks.json` for implementation order

### Google Sheets Setup

1. Create a new Google Sheet
2. Set up the following columns:
   - Timestamp
   - Name
   - Phone
   - Agent Name
   - Q1 Answer through Q30 Answer
   - Total Score
3. Create a Google Apps Script to handle data submission
4. Configure the script URL in your frontend code

## Project Structure

```
quiz/
├── prd.txt                      # Product Requirements Document
├── README.md                    # This file
├── taskmaster.config.json       # Taskmaster-AI configuration
├── .taskmaster/
│   ├── tasks.json              # Task definitions
│   └── history.json            # Task history
├── src/                        # Source code (to be created)
├── tests/                      # Test files (to be created)
├── docs/                       # Documentation (to be created)
└── config/                     # Configuration files (to be created)
```

## Development Workflow

1. Review tasks in `.taskmaster/tasks.json`
2. Update task status as you progress
3. Follow the PRD specifications in `prd.txt`
4. Test thoroughly before deployment

## Technical Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Google Apps Script
- **Data Storage**: Google Sheets
- **Task Management**: Taskmaster-AI

## Acceptance Criteria

✓ Quiz generates 30 random questions per user (28 MCQs + 2 essays)  
✓ Timer counts down from 20 minutes with auto-submit  
✓ Users cannot see correct answers  
✓ Results saved to Google Sheet with all required data  
✓ Total score summary displayed immediately  
✓ Responsive UI for desktop and mobile  

## Contributing

Follow the task list and PRD specifications when contributing to this project.

## License

[Add your license here]

## Contact

[Add contact information here]
