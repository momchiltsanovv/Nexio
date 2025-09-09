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

    // Initialize university dropdown
    initializeUniversityDropdown();
});

// University Custom Select Functionality
function initializeUniversityDropdown() {
    const universitySelectButton = document.getElementById('universitySelectButton');
    const universitySelectDropdown = document.getElementById('universitySelectDropdown');
    const universitySelectedText = document.getElementById('universitySelectedText');
    const universitySelectOptions = document.querySelectorAll('#universitySelectDropdown .select-option');
    const universityHiddenInput = document.getElementById('register-university');

    if (universitySelectButton && universitySelectDropdown) {
        universitySelectButton.addEventListener('click', () => {
            universitySelectButton.classList.toggle('active');
            universitySelectDropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!universitySelectButton.contains(e.target) && !universitySelectDropdown.contains(e.target)) {
                universitySelectButton.classList.remove('active');
                universitySelectDropdown.classList.remove('active');
            }
        });

        universitySelectOptions.forEach(option => {
            option.addEventListener('click', () => {
                const value = option.dataset.value;
                const text = option.textContent;

                // Update selected option
                universitySelectOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');

                // Update button text and remove placeholder class
                universitySelectedText.textContent = text;
                universitySelectedText.classList.remove('placeholder');

                // Update hidden input value
                if (universityHiddenInput) {
                    universityHiddenInput.value = value;
                }

                // Close dropdown
                universitySelectButton.classList.remove('active');
                universitySelectDropdown.classList.remove('active');
            });
        });
    }
}

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
    if (formType === 'register') {
        // Get university value from hidden input
        const universityValue = document.getElementById('register-university')?.value;

        // Check required fields for registration
        const firstName = document.getElementById('register-first-name')?.value?.trim();
        const lastName = document.getElementById('register-last-name')?.value?.trim();
        const email = document.getElementById('register-email')?.value?.trim();
        const password = document.getElementById('register-password')?.value;
        const termsChecked = document.getElementById('terms')?.checked;

        // Validate each field
        if (!firstName) {
            showToast('Please fill in your first name', 'error');
            return false;
        }

        if (!lastName) {
            showToast('Please fill in your last name', 'error');
            return false;
        }

        if (!email) {
            showToast('Please fill in your email', 'error');
            return false;
        }

        if (!universityValue) {
            showToast('Please select your university', 'error');
            return false;
        }

        if (!password) {
            showToast('Please fill in your password', 'error');
            return false;
        }

        // Check terms checkbox
        if (!termsChecked) {
            showToast('Please agree to the Terms & Conditions', 'error');
            return false;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('Please enter a valid email address', 'error');
            return false;
        }

        // Password length validation
        if (password.length < 6) {
            showToast('Password must be at least 6 characters long', 'error');
            return false;
        }

    } else if (formType === 'login') {
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
    }

    return true;
}

function handleFormSubmission(button, formType) {
    // Show loading state
    button.classList.add('loading');
    button.disabled = true;

    // Get form data
    const form = button.closest('form');

    // Handle remember me functionality for login
    if (formType === 'login') {
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
            if (formType === 'login') {
                const email = document.getElementById('login-email')?.value;
                if (email) localStorage.setItem('email', email);
            } else if (formType === 'register') {
                // Save all registration data including university
                const email = document.getElementById('register-email')?.value;
                const firstName = document.getElementById('register-first-name')?.value;
                const lastName = document.getElementById('register-last-name')?.value;
                const university = document.getElementById('register-university')?.value;

                if (email) localStorage.setItem('email', email);
                if (firstName) localStorage.setItem('firstName', firstName);
                if (lastName) localStorage.setItem('lastName', lastName);
                if (university) localStorage.setItem('university', university);

                // Log registration data for debugging
                console.log('Registration data saved:', {
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    university: university
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
            // Reset university dropdown
            const universitySelectedText = document.getElementById('universitySelectedText');
            const universityHiddenInput = document.getElementById('register-university');
            const universitySelectOptions = document.querySelectorAll('#universitySelectDropdown .select-option');

            if (universitySelectedText) {
                universitySelectedText.textContent = 'Select your university';
                universitySelectedText.classList.add('placeholder');
            }
            if (universityHiddenInput) {
                universityHiddenInput.value = '';
            }
            universitySelectOptions.forEach(opt => opt.classList.remove('selected'));
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