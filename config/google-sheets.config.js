/**
 * Google Sheets Configuration
 * Vinhomes Green Paradise Quiz - Google Apps Script Method
 */

const GOOGLE_SHEETS_CONFIG = {
    // Google Apps Script Web App URL
    SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzfnkFJ6InkC8exDhL9wmNCkbyDG1sXDFBl0U5ssERQNLPvhEA6nGFCCaDOYjqWvmajWg/exec',
    
    // Sheet name where data will be stored
    SHEET_NAME: 'QuizResults',
    
    // Enable/disable Google Sheets submission
    ENABLED: true,
    
    // Retry configuration
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
    
    // Timeout for requests
    TIMEOUT: 10000
};

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.GOOGLE_SHEETS_CONFIG = GOOGLE_SHEETS_CONFIG;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = GOOGLE_SHEETS_CONFIG;
}
