/**
 * Version Management for Cache Busting
 * Vinhomes Green Paradise Quiz
 * 
 * Update APP_VERSION whenever you make changes to JS/CSS files
 * This will force browsers to reload the new files
 */

const APP_VERSION = '1.1.0';
const BUILD_DATE = '2025-11-12';

// Export for use in other modules
window.APP_VERSION = APP_VERSION;
window.BUILD_DATE = BUILD_DATE;

console.log(`Quiz App v${APP_VERSION} (${BUILD_DATE})`);
