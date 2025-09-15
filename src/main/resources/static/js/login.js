document.addEventListener('DOMContentLoaded', () => {
    // Check if user should be remembered
    checkRememberMe();

    // Initialize form handlers
    initializeFormHandlers();

    // Initialize password toggles
    initializePasswordToggles();

    // Initialize social buttons
    initializeSocialButtons();

    // Initialize other buttons
    initializeOtherButtons();
});

// Password visibility toggle
function initializePasswordToggles() {
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const targetId = toggle.dataset.target;
            const input = document.getElementById(targetId);
            const eyeIcon = toggle.querySelector('.eye-icon');

            if (input && eyeIcon) {
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
            }
        });
    });
}

// Toast notification function
function showToast(message, type = 'success') {
    // Remove any existing toasts first
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Form validation and loading states
function initializeFormHandlers() {
    // Login form
    const loginForm = document.getElementById('login-form');
    const loginSubmit = document.getElementById('login-submit');

    if (loginForm && loginSubmit) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm(loginForm)) {
                handleFormSubmission(loginSubmit);
            }
        });
    }
}

// Form validation function
function validateForm(form) {
    // Check required fields for login
    const email = document.getElementById('login-email')?.value?.trim();
    const password = document.getElementById('login-password')?.value;

    if (!email) {
        showToast('Please enter your email', 'error');
        return false;
    }

    if (!password) {
        showToast('Please enter your password', 'error');
        return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address', 'error');
        return false;
    }

    return true;
}

function handleFormSubmission(button) {
    // Show loading state
    button.classList.add('loading');
    button.disabled = true;

    // Get form data
    const form = button.closest('form');

    // Handle remember me functionality for login
    const rememberMe = document.getElementById('remember-me')?.checked;
    const email = document.getElementById('login-email')?.value;

    if (rememberMe && email) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('rememberedEmail', email);
        console.log('Remember me enabled for 30 days');
    } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('rememberedEmail');
    }

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Hide loading state
        button.classList.remove('loading');
        button.disabled = false;

        // Show success message
        showToast('Login successful!', 'success');

        // Save user data to localStorage (for demo purposes)
        try {
            const email = document.getElementById('login-email')?.value;
            if (email) localStorage.setItem('email', email);
        } catch (e) {
            console.error('Error saving form data:', e);
        }

        // Redirect after successful submission
        setTimeout(() => {
            window.location.href = '/profile';
        }, 1500);

        // Reset form
        if (form) {
            form.reset();
        }
    }, 800);
}

function checkRememberMe() {
    const rememberMe = localStorage.getItem('rememberMe');
    const rememberedEmail = localStorage.getItem('rememberedEmail');

    if (rememberMe === 'true' && rememberedEmail) {
        // Pre-fill email field
        const emailInput = document.getElementById('login-email');
        const rememberCheckbox = document.getElementById('remember-me');

        if (emailInput && rememberCheckbox) {
            emailInput.value = rememberedEmail;
            rememberCheckbox.checked = true;
        }
    }
}

// Social authentication buttons
function initializeSocialButtons() {
    const socialButtons = [
        { id: 'google-login', message: 'Google Sign-In coming soon!' },
        { id: 'apple-login', message: 'Apple Sign-In coming soon!' }
    ];

    socialButtons.forEach(({ id, message }) => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', () => {
                showToast(message, 'success');
            });
        }
    });
}

// Other buttons (forgot password)
function initializeOtherButtons() {
    // Forgot password
    const forgotPasswordBtn = document.querySelector('.forgot-password');
    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener('click', () => {
            showToast('Password reset link sent to your email!', 'success');
        });
    }
}