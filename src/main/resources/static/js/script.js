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