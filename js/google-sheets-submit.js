/**
 * Google Sheets Submission via Apps Script
 * Vinhomes Green Paradise Quiz
 */

(function() {
    'use strict';

    class GoogleSheetsSubmitter {
        constructor(config) {
            this.config = config || window.GOOGLE_SHEETS_CONFIG;
        }

        async submit(data) {
            if (!this.config || !this.config.ENABLED) {
                return { success: false, message: 'Google Sheets disabled', skipped: true };
            }

            if (!this.config.SCRIPT_URL || this.config.SCRIPT_URL === 'YOUR_SCRIPT_URL_HERE') {
                return { success: false, message: 'Script URL not configured', skipped: true };
            }

            try {
                const result = await this.submitWithRetry(data);
                return result;
            } catch (error) {
                console.error('Error submitting to Google Sheets:', error);
                return { success: false, message: error.message };
            }
        }

        async submitWithRetry(data) {
            const maxRetries = this.config.MAX_RETRIES || 3;
            let lastError = null;

            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    console.log(`Submission attempt ${attempt}/${maxRetries}`);
                    const result = await this.sendRequest(data);
                    
                    if (result.success) {
                        console.log('✅ Successfully submitted to Google Sheets');
                        return result;
                    }
                    
                    lastError = new Error(result.message || 'Submission failed');
                } catch (error) {
                    console.error(`Attempt ${attempt} failed:`, error);
                    lastError = error;
                    
                    if (attempt < maxRetries) {
                        await this.sleep((this.config.RETRY_DELAY || 1000) * attempt);
                    }
                }
            }

            throw lastError || new Error('All submission attempts failed');
        }

        async sendRequest(data) {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), this.config.TIMEOUT || 10000);

            try {
                const response = await fetch(this.config.SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                    signal: controller.signal
                });

                clearTimeout(timeout);
                
                // With no-cors, we can't read the response, so assume success
                return { success: true, message: 'Data submitted' };
            } catch (error) {
                clearTimeout(timeout);
                if (error.name === 'AbortError') {
                    throw new Error('Request timeout');
                }
                throw error;
            }
        }

        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }

    async function submitToGoogleSheets(data) {
        const submitter = new GoogleSheetsSubmitter();
        return await submitter.submit(data);
    }

    window.GoogleSheetsSubmitter = GoogleSheetsSubmitter;
    window.submitToGoogleSheets = submitToGoogleSheets;
})();
