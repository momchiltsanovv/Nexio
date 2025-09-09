document.addEventListener('DOMContentLoaded', () => {
    // Check URL parameters to determine which tab to show
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');

    if (tab === 'login') {
        switchToTab('login');
    } else if (tab === 'register') {
        switchToTab('register');
    }

    // Check if user should be remembered
    checkRememberMe();

    // Initialize tab switching functionality
    initializeTabSwitching();

    // Initialize form handlers
    initializeFormHandlers();

    // Initialize password toggles
    initializePasswordToggles();

    // Initialize social buttons
    initializeSocialButtons();

    // Initialize other buttons
    initializeOtherButtons();
});

// Tab switching functionality
function initializeTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabSlider = document.querySelector('.tab-slider');
    const registerContainer = document.getElementById('register-container');
    const loginContainer = document.getElementById('login-container');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            // Don't do anything if clicking the already active tab
            if (button.classList.contains('active')) return;

            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Move slider
            if (targetTab === 'login') {
                tabSlider.classList.add('login-active');
            } else {
                tabSlider.classList.remove('login-active');
            }

            // Switch form containers with animation
            const currentContainer = document.querySelector('.form-container.active');
            const targetContainer = targetTab === 'login' ? loginContainer : registerContainer;

            if (currentContainer !== targetContainer) {
                // Start exit animation for current container
                currentContainer.classList.remove('active');
                currentContainer.classList.add(targetTab === 'login' ? 'slide-out-left' : 'slide-out-right');

                // After animation, show new container
                setTimeout(() => {
                    targetContainer.classList.add('active');
                    targetContainer.classList.remove('slide-out-left', 'slide-out-right');

                    // Clean up previous container
                    setTimeout(() => {
                        currentContainer.classList.remove('slide-out-left', 'slide-out-right');
                    }, 100);
                }, 250);
            }
        });
    });
}

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
            if (validateForm(loginForm, 'login')) {
                handleFormSubmission(loginSubmit, 'login');
            }
        });
    }

    // Register form
    const registerForm = document.getElementById('register-form');
    const registerSubmit = document.getElementById('register-submit');

    if (registerForm && registerSubmit) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm(registerForm, 'register')) {
                handleFormSubmission(registerSubmit, 'register');
            }
        });
    }
}

// Form validation function
function validateForm(form, formType) {
    const formData = new FormData(form);

    if (formType === 'register') {
        // Check required fields for registration
        const requiredFields = ['firstName', 'lastName', 'email', 'university', 'password'];
        for (const field of requiredFields) {
            if (!formData.get(field) || formData.get(field).trim() === '') {
                showToast(`Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`, 'error');
                return false;
            }
        }

        // Check terms checkbox
        if (!formData.get('terms')) {
            showToast('Please agree to the Terms & Conditions', 'error');
            return false;
        }

        // Basic email validation
        const email = formData.get('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('Please enter a valid email address', 'error');
            return false;
        }

        // Password length validation
        const password = formData.get('password');
        if (password.length < 6) {
            showToast('Password must be at least 6 characters long', 'error');
            return false;
        }
    } else if (formType === 'login') {
        // Check required fields for login
        const email = formData.get('email');
        const password = formData.get('password');

        if (!email || email.trim() === '') {
            showToast('Please enter your email', 'error');
            return false;
        }

        if (!password || password.trim() === '') {
            showToast('Please enter your password', 'error');
            return false;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('Please enter a valid email address', 'error');
            return false;
        }
    }

    return true;
}

function handleFormSubmission(button, formType) {
    // Show loading state
    button.classList.add('loading');
    button.disabled = true;

    // Get form data including remember me checkbox
    const form = button.closest('form');
    const formData = new FormData(form);

    // Handle remember me functionality for login
    if (formType === 'login') {
        const rememberMe = formData.get('rememberMe');
        if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
            localStorage.setItem('rememberedEmail', formData.get('email'));
            console.log('Remember me enabled for 30 days');
        } else {
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('rememberedEmail');
        }
    }

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Hide loading state
        button.classList.remove('loading');
        button.disabled = false;

        // Show success message
        showToast(`${formType === 'login' ? 'Login' : 'Registration'} successful!`, 'success');

        // Save user data to localStorage (for demo purposes)
        try {
            const formDataObj = Object.fromEntries(formData.entries());
            if (formType === 'login') {
                if (formDataObj.email) localStorage.setItem('email', formDataObj.email);
            } else if (formType === 'register') {
                // Save all registration data including university
                if (formDataObj.email) localStorage.setItem('email', formDataObj.email);
                if (formDataObj.firstName) localStorage.setItem('firstName', formDataObj.firstName);
                if (formDataObj.lastName) localStorage.setItem('lastName', formDataObj.lastName);
                if (formDataObj.university) localStorage.setItem('university', formDataObj.university); // Added university field
                if (formDataObj.username) localStorage.setItem('username', formDataObj.username);

                // Log registration data for debugging
                console.log('Registration data saved:', {
                    email: formDataObj.email,
                    firstName: formDataObj.firstName,
                    lastName: formDataObj.lastName,
                    university: formDataObj.university
                });
            }
        } catch (e) {
            console.error('Error saving form data:', e);
        }

        // Redirect after successful submission
        setTimeout(() => {
            if (formType === 'login') {
                window.location.href = '/profile';
            } else {
                // For registration, you might want to redirect to a welcome page or login
                window.location.href = '/profile';
            }
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
        { id: 'google-register', message: 'Google Sign-Up coming soon!' },
        { id: 'apple-register', message: 'Apple Sign-Up coming soon!' },
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

// Other buttons (forgot password, terms links)
function initializeOtherButtons() {
    // Forgot password
    const forgotPasswordBtn = document.querySelector('.forgot-password');
    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener('click', () => {
            showToast('Password reset link sent to your email!', 'success');
        });
    }

    // Terms links
    document.querySelectorAll('.terms-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('Terms and policies page coming soon!', 'success');
        });
    });
}

function switchToTab(tabName) {
    const tabButtons = document.querySelectorAll('.tab-button');
    const formContainers = document.querySelectorAll('.form-container');
    const tabSlider = document.querySelector('.tab-slider');

    // Remove active class from all tabs and containers
    tabButtons.forEach(btn => btn.classList.remove('active'));
    formContainers.forEach(container => container.classList.remove('active'));

    // Add active class to selected tab
    const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
    const selectedContainer = document.getElementById(`${tabName}-container`);

    if (selectedTab && selectedContainer) {
        selectedTab.classList.add('active');
        selectedContainer.classList.add('active');

        // Move slider - using CSS classes instead of direct style manipulation
        if (tabName === 'login') {
            tabSlider.classList.add('login-active');
        } else {
            tabSlider.classList.remove('login-active');
        }
    }
}
