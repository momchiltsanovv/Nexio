document.querySelectorAll('.tab-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
        const targetTab = trigger.dataset.tab;
        const tabList = document.querySelector('.tab-list');
        const currentPanel = document.querySelector('.tab-panel.active');
        const targetPanel = document.getElementById(targetTab + '-tab');
        const welcomeTitle = document.querySelector('.welcome-title');
        const welcomeSubtitle = document.querySelector('.welcome-subtitle');

        // Don't do anything if clicking the already active tab
        if (trigger.classList.contains('active')) return;

        // Update tab list indicator
        if (targetTab === 'register') {
            tabList.classList.add('register-active');
            welcomeTitle.textContent = 'Join Nexio';
            welcomeSubtitle.textContent = 'Start your digital journey today';
        } else {
            tabList.classList.remove('register-active');
            welcomeTitle.textContent = 'Welcome back';
            welcomeSubtitle.textContent = 'Connect to your digital future';
        }

        // Update active tab trigger
        document.querySelectorAll('.tab-trigger').forEach(t => t.classList.remove('active'));
        trigger.classList.add('active');

        // Animate panel transition
        if (currentPanel !== targetPanel) {
            // Start exit animation for current panel
            currentPanel.classList.remove('active');
            currentPanel.style.transform = targetTab === 'register' ? 'translateX(-20px)' : 'translateX(20px)';
            currentPanel.style.opacity = '0';

            // After a short delay, show the new panel
            setTimeout(() => {
                targetPanel.classList.add('active');
                targetPanel.style.transform = 'translateX(0)';
                targetPanel.style.opacity = '1';

                // Reset the previous panel position
                setTimeout(() => {
                    currentPanel.style.transform = '';
                    currentPanel.style.opacity = '';
                }, 100);
            }, 200);
        }
    });
});

// Password visibility toggle
document.querySelectorAll('.password-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
        const targetId = toggle.dataset.target;
        const input = document.getElementById(targetId);
        const eyeIcon = toggle.querySelector('.eye-icon');

        if (input.type === 'password') {
            input.type = 'text';
            eyeIcon.innerHTML = `
                        <path d="m17.94 17.94a10.07 10.07 0 0 1-15.88 0"></path>
                        <path d="m1 1 22 22"></path>
                        <path d="M1 12s4-8 11-8a9.96 9.96 0 0 1 5 1.3"></path>
                        <path d="M12 21c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"></path>
                    `;
        } else {
            input.type = 'password';
            eyeIcon.innerHTML = `
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    `;
        }
    });
});

// Toast notification function
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

// Login form submission
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    if (email && password) {
        showToast('Welcome back to Nexio!', 'success');
    } else {
        showToast('Please fill in all fields', 'error');
    }
});

// Register form submission
document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (!name || !email || !password || !confirmPassword) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }

    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }

    showToast('Welcome to Nexio!', 'success');
});

// Google authentication buttons
document.getElementById('google-login').addEventListener('click', () => {
    showToast('Google Sign-In coming soon!', 'success');
});

// Form validation and loading states
function initializeFormHandlers() {
    // Login form
    const loginForm = document.getElementById('login-form');
    const loginSubmit = document.getElementById('login-submit');
    
    if (loginForm && loginSubmit) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmission(loginSubmit, 'login');
        });
    }
    
    // Register form
    const registerForm = document.getElementById('register-form');
    const registerSubmit = document.getElementById('register-submit');
    
    if (registerForm && registerSubmit) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmission(registerSubmit, 'register');
        });
    }
    
    // Add real-time validation
    addRealTimeValidation();
}

function handleFormSubmission(button, formType) {
    // Show loading state
    button.classList.add('loading');
    button.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Hide loading state
        button.classList.remove('loading');
        button.disabled = false;
        
        // Show success message
        showToast(`${formType === 'login' ? 'Login' : 'Registration'} successful!`, 'success');
        
        // Reset form
        const form = button.closest('form');
        if (form) {
            form.reset();
            clearFormValidation(form);
        }
    }, 2000);
}

function addRealTimeValidation() {
    const inputs = document.querySelectorAll('.input');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        input.addEventListener('input', () => {
            clearFieldError(input);
        });
    });
}

function validateField(input) {
    const formGroup = input.closest('.form-group');
    const value = input.value.trim();
    const fieldName = input.name;
    
    // Clear previous states
    formGroup.classList.remove('success', 'error');
    
    if (!value) {
        if (input.required) {
            showFieldError(formGroup, `${fieldName} is required`);
            return false;
        }
    } else {
        // Email validation
        if (fieldName === 'email' && !isValidEmail(value)) {
            showFieldError(formGroup, 'Please enter a valid email address');
            return false;
        }
        
        // Password validation
        if (fieldName === 'password' && value.length < 6) {
            showFieldError(formGroup, 'Password must be at least 6 characters');
            return false;
        }
        
        // Confirm password validation
        if (fieldName === 'confirmPassword') {
            const password = document.querySelector('input[name="password"]').value;
            if (value !== password) {
                showFieldError(formGroup, 'Passwords do not match');
                return false;
            }
        }
        
        // Show success state
        formGroup.classList.add('success');
    }
    
    return true;
}

function showFieldError(formGroup, message) {
    formGroup.classList.add('error');
    
    // Remove existing error message
    const existingError = formGroup.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#dc2626';
    errorDiv.style.fontSize = '0.75rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.style.marginLeft = '0.5rem';
    
    formGroup.appendChild(errorDiv);
}

function clearFieldError(input) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.remove('error');
    
    const existingError = formGroup.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function clearFormValidation(form) {
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        group.classList.remove('success', 'error');
        const error = group.querySelector('.field-error');
        if (error) {
            error.remove();
        }
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Initialize form handlers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeFormHandlers();
});

document.getElementById('google-register').addEventListener('click', () => {
    showToast('Google Sign-Up coming soon!', 'success');
});

// Forgot password
document.querySelector('.forgot-password').addEventListener('click', () => {
    showToast('Password reset link sent to your email!', 'success');
});

// Terms links
document.querySelectorAll('.terms-link').forEach(link => {
    link.addEventListener('click', () => {
        showToast('Terms and policies page coming soon!', 'success');
    });
});