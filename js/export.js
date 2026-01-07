/**
 * Export Module - Handles exporting quiz results
 * Vinhomes Green Paradise Quiz
 */

(function() {
    'use strict';

    class QuizExporter {
        static downloadJSON(data, userName) {
            try {
                const jsonString = JSON.stringify(data, null, 2);
                const blob = new Blob([jsonString], { type: 'application/json' });
                const filename = this.generateFilename(userName, 'json');
                this.triggerDownload(blob, filename);
            } catch (error) {
                console.error('Error downloading JSON:', error);
                alert('Không thể tải xuống file JSON');
            }
        }

        static downloadCSV(data, userName) {
            try {
                const csvString = this.convertToCSV(data);
                const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
                const filename = this.generateFilename(userName, 'csv');
                this.triggerDownload(blob, filename);
            } catch (error) {
                console.error('Error downloading CSV:', error);
                alert('Không thể tải xuống file CSV');
            }
        }

        static convertToCSV(data) {
            const lines = [];
            lines.push('CLB NGÔI SAO MASTERISE HOMES - MAYHOMES - Kết quả');
            lines.push('');
            lines.push(`Họ tên,${data.userInfo.name}`);
            lines.push(`SĐT,${data.userInfo.phone}`);
            lines.push(`Đội nhóm,${data.userInfo.team}`);
            lines.push('');
            lines.push(`Điểm MCQ,${data.score.mcq.score}/${data.score.mcq.total}`);
            lines.push(`Tổng điểm,${data.score.total.score}/${data.score.total.maxScore}`);
            return lines.join('\n');
        }

        static generateFilename(userName, extension) {
            const timestamp = Date.now();
            const name = userName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            return `quiz-${name}-${timestamp}.${extension}`;
        }

        static triggerDownload(blob, filename) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    }

    window.QuizExporter = QuizExporter;
})();
