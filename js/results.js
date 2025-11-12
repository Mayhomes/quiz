/**
 * Results Page Controller
 * Displays quiz results and handles export/retake actions
 * Vinhomes Green Paradise Quiz
 */

(function () {
  "use strict";

  class ResultsManager {
    constructor() {
      this.userInfo = null;
      this.results = null;
      this.summary = null;
    }

    /**
     * Initialize the results page
     */
    async initialize() {
      try {
        // Load data
        this.loadData();

        // Display results
        this.displayUserInfo();
        this.displayScores();

        // Setup event listeners
        this.setupEventListeners();

        // Submit to Google Sheets
        await this.submitToGoogleSheets();
      } catch (error) {
        console.error("Error initializing results:", error);
        alert("Không thể tải kết quả. Vui lòng thử lại.");
        window.location.href = "index.html";
      }
    }

    /**
     * Load data from localStorage
     */
    loadData() {
      // Load user info
      const userInfoJson = localStorage.getItem("userInfo");
      if (!userInfoJson) {
        throw new Error("User info not found");
      }
      this.userInfo = JSON.parse(userInfoJson);

      // Load results
      this.results = window.QuizScorer.getResults();
      if (!this.results) {
        throw new Error("Quiz results not found");
      }

      // Generate summary
      this.summary = window.QuizScorer.generateSummary();

      console.log("Results loaded:", this.results);
    }

    /**
     * Display user information
     */
    displayUserInfo() {
      // Name
      const nameEl = document.getElementById("user-name");
      if (nameEl) {
        nameEl.textContent = this.userInfo.name;
      }

      // Phone
      const phoneEl = document.getElementById("user-phone");
      if (phoneEl) {
        phoneEl.textContent = this.formatPhoneNumber(this.userInfo.phone);
      }

      // Agent
      const agentEl = document.getElementById("user-agent");
      if (agentEl) {
        agentEl.textContent = this.userInfo.agentName;
      }

      // Completed time
      const timeEl = document.getElementById("completed-time");
      if (timeEl && this.results.timestamp) {
        timeEl.textContent = this.formatDateTime(this.results.timestamp);
      }
    }

    /**
     * Display scores
     */
    displayScores() {
      // Total score
      const totalScoreEl = document.getElementById("total-score");
      if (totalScoreEl) {
        totalScoreEl.textContent = this.results.totalScore;
      }

      const maxScoreEl = document.getElementById("max-score");
      if (maxScoreEl) {
        maxScoreEl.textContent = this.results.maxScore;
      }

      // Percentage
      const percentageEl = document.getElementById("percentage");
      if (percentageEl) {
        percentageEl.textContent = this.results.percentage;
      }

      // MCQ score
      const mcqScoreEl = document.getElementById("mcq-score");
      if (mcqScoreEl) {
        mcqScoreEl.textContent = this.results.mcqScore;
      }

      const mcqTotalEl = document.getElementById("mcq-total");
      if (mcqTotalEl) {
        mcqTotalEl.textContent = this.results.mcqTotal;
      }

      const mcqPercentageEl = document.getElementById("mcq-percentage");
      if (mcqPercentageEl) {
        mcqPercentageEl.textContent = this.results.mcqPercentage;
      }

      // Essay count
      const essayCountEl = document.getElementById("essay-count");
      if (essayCountEl) {
        essayCountEl.textContent = this.results.essayCount;
      }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
      // Download JSON button
      const downloadJsonBtn = document.getElementById("download-json-btn");
      if (downloadJsonBtn) {
        downloadJsonBtn.addEventListener("click", () => this.downloadJSON());
      }

      // Download CSV button
      const downloadCsvBtn = document.getElementById("download-csv-btn");
      if (downloadCsvBtn) {
        downloadCsvBtn.addEventListener("click", () => this.downloadCSV());
      }

      // Retake button
      const retakeBtn = document.getElementById("retake-btn");
      if (retakeBtn) {
        retakeBtn.addEventListener("click", () => this.retakeQuiz());
      }
    }

    /**
     * Download results as JSON
     */
    downloadJSON() {
      if (!this.summary) {
        alert("Không có dữ liệu để tải xuống");
        return;
      }

      window.QuizExporter.downloadJSON(this.summary, this.userInfo.name);
    }

    /**
     * Download results as CSV
     */
    downloadCSV() {
      if (!this.summary) {
        alert("Không có dữ liệu để tải xuống");
        return;
      }

      window.QuizExporter.downloadCSV(this.summary, this.userInfo.name);
    }

    /**
     * Retake quiz
     */
    retakeQuiz() {
      const confirmed = confirm(
        "Bạn có chắc chắn muốn làm lại bài thi?\n\n" +
          "Kết quả hiện tại sẽ bị xóa và bạn sẽ nhận được bộ câu hỏi mới."
      );

      if (confirmed) {
        // Clear all quiz data
        window.QuizScorer.clearAllData();
        window.QuizTimer.clearState();

        // Redirect to home
        window.location.href = "index.html";
      }
    }

    /**
     * Format phone number
     * @param {string} phone - Phone number
     * @returns {string} Formatted phone number
     */
    formatPhoneNumber(phone) {
      if (!phone) return "-";

      // Format: 0123 456 789 or 0123 456 7890
      if (phone.length === 10) {
        return phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
      } else if (phone.length === 11) {
        return phone.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3");
      }
      return phone;
    }

    /**
     * Format date time
     * @param {string} isoString - ISO date string
     * @returns {string} Formatted date time
     */
    formatDateTime(isoString) {
      if (!isoString) return "-";

      try {
        const date = new Date(isoString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");

        return `${day}/${month}/${year} ${hours}:${minutes}`;
      } catch (error) {
        console.error("Error formatting date:", error);
        return "-";
      }
    }

    /**
     * Submit results to Google Sheets
     */
    async submitToGoogleSheets() {
      if (!this.summary) {
        console.warn("No summary data to submit");
        return;
      }

      if (!window.submitToGoogleSheets) {
        console.error("Google Sheets module not loaded");
        return;
      }

      try {
        console.log("Submitting results to Google Sheets...");

        const result = await window.submitToGoogleSheets(this.summary);

        if (result.success) {
          console.log("✅ Results successfully submitted to Google Sheets");
          this.showSubmissionNotification(true);
        } else if (result.skipped) {
          console.log("ℹ️ Google Sheets submission skipped:", result.message);
        } else {
          console.warn("⚠️ Failed to submit to Google Sheets:", result.message);
          this.showSubmissionNotification(false, result.message);
        }
      } catch (error) {
        console.error("❌ Error submitting to Google Sheets:", error);
        this.showSubmissionNotification(false, error.message);
      }
    }

    /**
     * Show submission notification
     * @param {boolean} success - Whether submission was successful
     * @param {string} message - Optional error message
     */
    showSubmissionNotification(success, message = "") {
      // Create notification element
      const notification = document.createElement("div");
      notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                background: ${success ? "#10B981" : "#F59E0B"};
                color: white;
                font-size: 14px;
                font-weight: 500;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                z-index: 1000;
                animation: slideIn 0.3s ease-out;
            `;

      if (success) {
        notification.innerHTML = "✅ Kết quả đã được lưu lại";
      } else {
        notification.innerHTML = `⚠️ Không thể lưu lại${
          message ? ": " + message : ""
        }`;
      }

      // Add animation
      const style = document.createElement("style");
      style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
      document.head.appendChild(style);

      // Add to page
      document.body.appendChild(notification);

      // Remove after 5 seconds
      setTimeout(() => {
        notification.style.animation = "slideIn 0.3s ease-out reverse";
        setTimeout(() => {
          notification.remove();
          style.remove();
        }, 300);
      }, 5000);
    }
  }

  // Initialize when page loads
  document.addEventListener("DOMContentLoaded", () => {
    const resultsManager = new ResultsManager();
    resultsManager.initialize();
  });
})();
