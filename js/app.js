/**
 * Landing Page - User Info Form Handler
 * Vinhomes Green Paradise Quiz
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
});

/**
 * Initialize the user info form
 */
function initializeForm() {
    const form = document.getElementById('userInfoForm');
    
    if (!form) {
        console.error('Form not found');
        return;
    }

    // Add form submit event listener
    form.addEventListener('submit', handleFormSubmit);

    // Add real-time validation
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('blur', validateInput);
        input.addEventListener('input', clearError);
    });

    // Check if user already has info stored (returning user)
    checkExistingUser();
}

/**
 * Handle form submission
 */
function handleFormSubmit(event) {
    event.preventDefault();

    // Get form values
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const agentName = document.getElementById('agentName').value.trim();

    // Validate all fields
    if (!validateAllFields(name, phone, agentName)) {
        return;
    }

    // Create user info object
    const userInfo = {
        name: name,
        phone: phone,
        agentName: agentName,
        timestamp: new Date().toISOString(),
        startTime: Date.now()
    };

    try {
        // Store user info in localStorage
        localStorage.setItem('userInfo', JSON.stringify(userInfo));

        // Clear any previous quiz data
        localStorage.removeItem('quizQuestions');
        localStorage.removeItem('quizAnswers');
        localStorage.removeItem('quizResults');
        localStorage.removeItem('timerState');
        
        console.log('Previous quiz data and timer state cleared');

        // Show loading state
        showLoading();

        // Redirect to quiz page after short delay
        setTimeout(() => {
            window.location.href = 'quiz.html';
        }, 500);

    } catch (error) {
        console.error('Error saving user info:', error);
        showError('Có lỗi xảy ra. Vui lòng thử lại.');
    }
}

/**
 * Validate all form fields
 */
function validateAllFields(name, phone, agentName) {
    let isValid = true;

    // Validate name
    if (!name || name.length < 2) {
        showFieldError('name', 'Vui lòng nhập họ và tên hợp lệ (ít nhất 2 ký tự)');
        isValid = false;
    }

    // Validate phone
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phone || !phoneRegex.test(phone)) {
        showFieldError('phone', 'Vui lòng nhập số điện thoại hợp lệ (10-11 số)');
        isValid = false;
    }

    // Validate agent name
    if (!agentName || agentName.length < 2) {
        showFieldError('agentName', 'Vui lòng nhập tên Agent hợp lệ');
        isValid = false;
    }

    return isValid;
}

/**
 * Validate individual input field
 */
function validateInput(event) {
    const input = event.target;
    const value = input.value.trim();

    clearFieldError(input.id);

    if (input.id === 'name' && value && value.length < 2) {
        showFieldError(input.id, 'Họ và tên phải có ít nhất 2 ký tự');
    }

    if (input.id === 'phone' && value) {
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(value)) {
            showFieldError(input.id, 'Số điện thoại không hợp lệ (10-11 số)');
        }
    }

    if (input.id === 'agentName' && value && value.length < 2) {
        showFieldError(input.id, 'Tên Agent phải có ít nhất 2 ký tự');
    }
}

/**
 * Clear error when user starts typing
 */
function clearError(event) {
    clearFieldError(event.target.id);
}

/**
 * Show error message for a specific field
 */
function showFieldError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const formGroup = input.closest('.form-group');
    
    // Remove existing error
    clearFieldError(fieldId);

    // Add error class
    formGroup.classList.add('error');

    // Create and add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    formGroup.appendChild(errorDiv);

    // Focus on the field
    input.focus();
}

/**
 * Clear error message for a specific field
 */
function clearFieldError(fieldId) {
    const input = document.getElementById(fieldId);
    const formGroup = input.closest('.form-group');
    
    formGroup.classList.remove('error');
    
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

/**
 * Show general error message
 */
function showError(message) {
    alert(message);
}

/**
 * Show loading state
 */
function showLoading() {
    const button = document.querySelector('.btn-primary');
    if (button) {
        button.disabled = true;
        button.innerHTML = '<span class="loading-spinner"></span> Đang tải...';
    }
}

/**
 * Check if user already has info stored
 */
function checkExistingUser() {
    const userInfo = localStorage.getItem('userInfo');
    
    if (userInfo) {
        try {
            const user = JSON.parse(userInfo);
            
            // Optional: Pre-fill form with existing data
            // Uncomment if you want to pre-fill the form
            /*
            document.getElementById('name').value = user.name || '';
            document.getElementById('phone').value = user.phone || '';
            document.getElementById('agentName').value = user.agentName || '';
            */
        } catch (error) {
            console.error('Error parsing user info:', error);
        }
    }
}

/**
 * Utility: Format phone number for display
 */
function formatPhoneNumber(phone) {
    // Format: 0123 456 789 or 0123 456 7890
    if (phone.length === 10) {
        return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
    } else if (phone.length === 11) {
        return phone.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
    }
    return phone;
}

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateAllFields,
        formatPhoneNumber
    };
}
