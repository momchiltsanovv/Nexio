document.addEventListener('DOMContentLoaded', () => {
    // Check URL parameters to determine which tab to show
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');

    if (tab === 'login') {
        // Switch to login tab
        switchToTab('login');
    } else if (tab === 'register') {
        // Switch to register tab (default is already register, but being explicit)
        switchToTab('register');
    }
});

// Tab switching functionality
document.addEventListener('DOMContentLoaded', () => {
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

    // Initialize form handlers
    initializeFormHandlers();
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
        }
    }, 2000);
}

// Social authentication buttons
document.getElementById('google-register')?.addEventListener('click', () => {
    showToast('Google Sign-Up coming soon!', 'success');
});

document.getElementById('apple-register')?.addEventListener('click', () => {
    showToast('Apple Sign-Up coming soon!', 'success');
});

document.getElementById('google-login')?.addEventListener('click', () => {
    showToast('Google Sign-In coming soon!', 'success');
});

document.getElementById('apple-login')?.addEventListener('click', () => {
    showToast('Apple Sign-In coming soon!', 'success');
});

// Forgot password
document.querySelector('.forgot-password')?.addEventListener('click', () => {
    showToast('Password reset link sent to your email!', 'success');
});

// Terms links
document.querySelectorAll('.terms-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('Terms and policies page coming soon!', 'success');
    });
});
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

        // Move slider
        if (tabName === 'login') {
            tabSlider.style.transform = 'translateX(100%)';
        } else {
            tabSlider.style.transform = 'translateX(0%)';
        }
    }
}
