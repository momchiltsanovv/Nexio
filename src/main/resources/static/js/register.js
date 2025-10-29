// Password validation
document.addEventListener('DOMContentLoaded', function() {
    const password = document.getElementById('password');
    const submitBtn = document.getElementById('submitBtn');
    
    // Real-time password strength indicator
    password.addEventListener('input', function() {
        const value = this.value;
        const requirements = document.querySelectorAll('.password-requirements li');
        
        // Check each requirement
        const hasLength = value.length >= 8;
        const hasUpper = /[A-Z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(value);
        
        requirements[0].style.color = hasLength ? '#28a745' : '#6c757d';
        requirements[1].style.color = hasUpper ? '#28a745' : '#6c757d';
        requirements[2].style.color = hasNumber ? '#28a745' : '#6c757d';
        requirements[3].style.color = hasSpecial ? '#28a745' : '#6c757d';
        
        // Update border color
        if (hasLength && hasUpper && hasNumber && hasSpecial) {
            this.style.borderColor = '#28a745';
        } else if (value.length > 0) {
            this.style.borderColor = '#ffc107';
        } else {
            this.style.borderColor = '#e0e0e0';
        }
    });
    
    // Email validation for university domains
    const email = document.getElementById('email');
    email.addEventListener('blur', function() {
        const value = this.value.toLowerCase();
        const validDomains = [
            'nbu.bg', 'mu-sofia.bg', 'uni-sofia.bg', 'tu-sofia.bg', 
            'unwe.bg', 'uacg.bg', 'student.nbu.bg'
        ];
    });
    
    // Form submission handling
    const form = document.querySelector('form');
    form.addEventListener('submit', function(e) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        submitBtn.disabled = true;
    });
    
    // Social Sign-In handling
    // const googleBtn = document.getElementById('googleSignUpBtn');
    const githubBtn = document.getElementById('githubSignUpBtn');
    
    // googleBtn.addEventListener('click', function() {
    //     // For now, this is a placeholder. In a real implementation, you would:
    //     // 1. Initialize Google Sign-In API
    //     // 2. Handle the OAuth flow
    //     // 3. Send the Google token to your backend
    //     // 4. Create user account with Google profile data
    //     
    //     alert('Google Sign-In integration coming soon! For now, please use the regular registration form.');
    //     
    //     // Example of what the implementation might look like:
    //     /*
    //     gapi.load('auth2', function() {
    //         gapi.auth2.init({
    //             client_id: 'YOUR_GOOGLE_CLIENT_ID'
    //         }).then(function() {
    //             const authInstance = gapi.auth2.getAuthInstance();
    //             authInstance.signIn().then(function(googleUser) {
    //                 const profile = googleUser.getBasicProfile();
    //                 const idToken = googleUser.getAuthResponse().id_token;
    //                 
    //                 // Send to your backend
    //                 fetch('/auth/google-register', {
    //                     method: 'POST',
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                     },
    //                     body: JSON.stringify({
    //                         idToken: idToken,
    //                         email: profile.getEmail(),
    //                         firstName: profile.getGivenName(),
    //                         lastName: profile.getFamilyName()
    //                     })
    //                 }).then(response => response.json())
    //                 .then(data => {
    //                     if (data.success) {
    //                         window.location.href = '/users/profile';
    //                     } else {
    //                         alert('Registration failed: ' + data.message);
    //                     }
    //                 });
    //             });
    //         });
    //     });
    //     */
    // });
    
    githubBtn.addEventListener('click', function() {
        window.location.href = '/oauth2/authorization/github';
        
    });
});

// Enhanced client-side validation

    // Enhanced client-side validation for registration form
    document.addEventListener('DOMContentLoaded', function() {
        const form = document.querySelector('form');
        const inputs = form.querySelectorAll('input[required]');
        
        // Real-time validation for each input
        inputs.forEach(input => {
            // Validate on blur (when user leaves the field)
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            // Clear errors on input (when user starts typing)
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
        
        // Enhanced form submission validation
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                showFormError('Please fix the errors above before submitting.');
            }
        });
        
        function validateField(field) {
            const value = field.value.trim();
            const fieldName = field.name;
            let isValid = true;
            let errorMessage = '';
            
            // Clear previous errors
            clearFieldError(field);
            
            // Required field validation
            if (!value) {
                errorMessage = getRequiredMessage(fieldName);
                isValid = false;
            } else {
                // Field-specific validation
                switch (fieldName) {
                        
                    case 'username':
                        if (value.length < 3 || value.length > 20) {
                            errorMessage = 'Username must be between 3 and 20 characters';
                            isValid = false;
                        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                            errorMessage = 'Username can only contain letters, numbers, and underscores';
                            isValid = false;
                        }
                        break;
                        
                    case 'email':
                        if (!isValidEmail(value)) {
                            errorMessage = 'Please enter a valid email address';
                            isValid = false;
                        }
                        break;
                        
                    case 'password':
                        if (!isValidPassword(value)) {
                            errorMessage = 'Please create a password that meets the requirements';
                            isValid = false;
                        }
                        break;
                }
            }
            
            if (!isValid) {
                showFieldError(field, errorMessage);
            }
            
            return isValid;
        }
        
        function showFieldError(field, message) {
            // Create or update error message (no red border on input)
            let errorElement = field.parentNode.querySelector('.field-error');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'field-error alert-warning';
                field.parentNode.appendChild(errorElement);
            }
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        
        function clearFieldError(field) {
            const errorElement = field.parentNode.querySelector('.field-error');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        }
        
        function showFormError(message) {
            // Remove existing form error
            const existingError = document.querySelector('.form-error');
            if (existingError) {
                existingError.remove();
            }
            
            // Create new form error
            const errorElement = document.createElement('div');
            errorElement.className = 'form-error alert-warning';
            errorElement.textContent = message;
            errorElement.style.marginBottom = '20px';
            
            // Insert at the top of the form
            form.insertBefore(errorElement, form.firstChild);
            
            // Scroll to top of form
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        function getRequiredMessage(fieldName) {
            const messages = {
                'username': 'Please choose a username',
                'email': 'Please enter your email address',
                'password': 'Please create a password'
            };
            return messages[fieldName] || 'This field is required';
        }
        
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
    
    });
