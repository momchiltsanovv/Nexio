document.addEventListener('DOMContentLoaded', () => {
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

// University Select Functionality
function initializeUniversityDropdown() {
    const universitySelect = document.getElementById('register-university');

    if (universitySelect) {
        // The select element handles everything automatically
        // No additional JavaScript needed for basic functionality
        console.log('University select initialized');
    }
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
    // Register form
    const registerForm = document.getElementById('register-form');
    const registerSubmit = document.getElementById('register-submit');

    if (registerForm && registerSubmit) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm(registerForm)) {
                handleFormSubmission(registerSubmit);
            }
        });
    }
}

// Form validation function
function validateForm(form) {
    // Get university value from select
    const universityValue = document.getElementById('register-university')?.value;

    // Check required fields for registration
    const firstName = document.getElementById('register-first-name')?.value?.trim();
    const lastName = document.getElementById('register-last-name')?.value?.trim();
    const username = document.getElementById('register-username')?.value?.trim();
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

    if (!username) {
        showToast('Please fill in your username', 'error');
        return false;
    }

    if (username.length < 6) {
        showToast('Username must be at least 6 characters long', 'error');
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

    return true;
}

function handleFormSubmission(button) {
    // Show loading state
    button.classList.add('loading');
    button.disabled = true;

    // Get form data
    const form = button.closest('form');

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Hide loading state
        button.classList.remove('loading');
        button.disabled = false;

        // Show success message
        showToast('Registration successful!', 'success');

        // Save user data to localStorage (for demo purposes)
        try {
            // Save all registration data including university and username
            const email = document.getElementById('register-email')?.value;
            const firstName = document.getElementById('register-first-name')?.value;
            const lastName = document.getElementById('register-last-name')?.value;
            const username = document.getElementById('register-username')?.value;
            const university = document.getElementById('register-university')?.value;

            if (email) localStorage.setItem('email', email);
            if (firstName) localStorage.setItem('firstName', firstName);
            if (lastName) localStorage.setItem('lastName', lastName);
            if (username) localStorage.setItem('username', username);
            if (university) localStorage.setItem('university', university);

            // Log registration data for debugging
            console.log('Registration data saved:', {
                email: email,
                firstName: firstName,
                lastName: lastName,
                username: username,
                university: university
            });
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
            // Reset university select to default option
            const universitySelect = document.getElementById('register-university');
            if (universitySelect) {
                universitySelect.selectedIndex = 0; // Select the placeholder option
            }
        }
    }, 800);
}

// Social authentication buttons
function initializeSocialButtons() {
    const socialButtons = [
        { id: 'google-register', message: 'Google Sign-Up coming soon!' },
        { id: 'apple-register', message: 'Apple Sign-Up coming soon!' }
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

// Other buttons (terms links)
function initializeOtherButtons() {
    // Terms links
    document.querySelectorAll('.terms-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('Terms and policies page coming soon!', 'success');
        });
    });
}
