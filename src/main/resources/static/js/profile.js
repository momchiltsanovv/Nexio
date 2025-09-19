// Profile data management
let profileData = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    major: '',
    graduationYear: '',
    joinDate: '',
    socialLinks: {
        instagram: '',
        linkedin: ''
    },
    verification: {
        email: false
    }
};

// Initialize profile on page load
document.addEventListener('DOMContentLoaded', function() {
    // Navigation Options Button functionality
    const navOptionsBtn = document.getElementById('navOptionsBtn');
    const navOptionsDropdown = document.getElementById('navOptionsDropdown');
    
    if (navOptionsBtn && navOptionsDropdown) {
        // Toggle dropdown on button click
        navOptionsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            navOptionsDropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!navOptionsBtn.contains(e.target) && !navOptionsDropdown.contains(e.target)) {
                navOptionsDropdown.classList.remove('active');
            }
        });
        
        // Close dropdown when clicking on links
        const navOptionLinks = navOptionsDropdown.querySelectorAll('.nav-option-link');
        navOptionLinks.forEach(link => {
            link.addEventListener('click', function() {
                navOptionsDropdown.classList.remove('active');
            });
        });
    }

    loadProfileData();
    populateProfile();
    setupEditModal();
    setupDeleteAccountModal();
});

// Setup edit modal event listeners
function setupEditModal() {
    const modal = document.getElementById('editProfileModal');
    const form = document.getElementById('editProfileForm');
    const closeBtn = document.getElementById('closeEditModal');
    const cancelBtn = document.getElementById('cancelEdit');
    
    if (form) {
        form.addEventListener('submit', handleEditFormSubmit);
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeEditModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeEditModal);
    }
    
    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeEditModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeEditModal();
        }
    });
}

// Load profile data from localStorage
function loadProfileData() {
    profileData = {
        firstName: localStorage.getItem('firstName') || '',
        lastName: localStorage.getItem('lastName') || '',
        email: localStorage.getItem('rememberedEmail') || localStorage.getItem('userEmail') || '',
        username: localStorage.getItem('username') || '',
        major: localStorage.getItem('major') || 'Computer Science',
        graduationYear: localStorage.getItem('graduationYear') || '2025',
        joinDate: localStorage.getItem('joinDate') || new Date().toLocaleDateString(),
        socialLinks: {
            instagram: localStorage.getItem('social_instagram') || '',
            linkedin: localStorage.getItem('social_linkedin') || ''
        },
        verification: {
            email: localStorage.getItem('verified_email') === 'true' || false
        }
    };

    // Generate username from email if not exists
    if (!profileData.username && profileData.email) {
        profileData.username = profileData.email.split('@')[0];
    }

    // Set default username if still empty
    if (!profileData.username) {
        profileData.username = 'student';
    }
}

// Populate profile UI with data
function populateProfile() {
    const displayFirstName = profileData.firstName || profileData.username || 'Student';
    const fullName = [profileData.firstName, profileData.lastName].filter(Boolean).join(' ') || profileData.username || 'Student';
    const displayEmail = profileData.email || `${profileData.username}@example.edu`;

    // Update DOM elements
    const elements = {
        'profile-first-name': displayFirstName,
        'profile-full-name': fullName,
        'profile-email': displayEmail,
        'profile-username': `@${profileData.username}`,
        'profile-major': profileData.major,
        'profile-graduation': profileData.graduationYear,
        'profile-joined': `Joined ${profileData.joinDate}`
    };

    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });

    // Generate avatar initials
    generateAvatarInitials(fullName, profileData.username);
    
    // Update verification badges
    updateVerificationBadges();
    
    // Update social links
    updateSocialLinks();
    
    // Update review status
    updateReviewStatus();
}

// Generate avatar initials
function generateAvatarInitials(fullName, username) {
    let initials = 'S'; // Default

    if (profileData.firstName && profileData.lastName) {
        initials = profileData.firstName.charAt(0) + profileData.lastName.charAt(0);
    } else if (profileData.firstName) {
        initials = profileData.firstName.charAt(0);
    } else if (username) {
        initials = username.charAt(0);
    }

    const avatarElement = document.getElementById('avatar-initials');
    if (avatarElement) {
        avatarElement.textContent = initials.toUpperCase();
    }
}


// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate social links
function validateSocialLinks(socialLinks) {
    const urlPatterns = {
        instagram: /^https?:\/\/(www\.)?instagram\.com\/[\w\.]+\/?$/,
        linkedin: /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w\-]+\/?$/
    };

    for (const [platform, url] of Object.entries(socialLinks)) {
        if (url && !urlPatterns[platform].test(url)) {
            return {
                valid: false,
                message: `Please enter a valid ${platform} URL`
            };
        }
    }

    return { valid: true };
}

// Update verification badges
function updateVerificationBadges() {
    const emailBadge = document.getElementById('email-badge');
    
    if (emailBadge) {
        // Remove all verification classes first
        emailBadge.classList.remove('verified', 'not-verified');
        
        if (profileData.verification.email) {
            emailBadge.classList.add('verified');
            // Update icon and text for verified state
            const icon = emailBadge.querySelector('.badge-icon');
            const text = emailBadge.querySelector('.badge-text');
            icon.textContent = '✓';
            text.textContent = 'Email Verified';
        } else {
            emailBadge.classList.add('not-verified');
            // Update icon and text for not verified state
            const icon = emailBadge.querySelector('.badge-icon');
            const text = emailBadge.querySelector('.badge-text');
            icon.textContent = '✗';
            text.textContent = 'Email Not Verified';
        }
    }
}

// Update social links
function updateSocialLinks() {
    const socialLinks = {
        instagram: document.getElementById('instagram-link'),
        linkedin: document.getElementById('linkedin-link')
    };

    Object.entries(socialLinks).forEach(([platform, element]) => {
        if (element) {
            const url = profileData.socialLinks[platform];
            if (url) {
                element.href = url;
                element.classList.add('has-link');
                element.target = '_blank';
                element.rel = 'noopener noreferrer';
            } else {
                element.href = '#';
                element.classList.remove('has-link');
                element.onclick = (e) => {
                    e.preventDefault();
                    showToast(`Add your ${platform} link in profile settings`, 'info');
                };
            }
        }
    });
}

// Verification functions
function verifyEmail() {
    if (profileData.verification.email) {
        // If already verified, show option to unverify (for demo purposes)
        profileData.verification.email = false;
        localStorage.setItem('verified_email', 'false');
        updateVerificationBadges();
        updateVerificationButton();
        showToast('Email verification removed', 'info');
    } else {
        // Simulate email verification process
        showToast('Verification email sent! Check your inbox.', 'success');
        
        // Simulate successful verification after 3 seconds
        setTimeout(() => {
            profileData.verification.email = true;
            localStorage.setItem('verified_email', 'true');
            updateVerificationBadges();
            updateVerificationButton();
            showToast('Email verified successfully!', 'success');
        }, 3000);
    }
}


// Update verification button text and state
function updateVerificationButton() {
    const verifyBtn = document.getElementById('verify-email-btn');
    if (verifyBtn) {
        if (profileData.verification.email) {
            verifyBtn.textContent = 'Unverify Email';
            verifyBtn.classList.add('btn-secondary');
        } else {
            verifyBtn.textContent = 'Verify Email';
            verifyBtn.classList.remove('btn-secondary');
        }
    }
}

// Update review status
function updateReviewStatus() {
    // Calculate profile completion percentage
    let completionPercentage = 0;
    let completedItems = 0;
    let totalItems = 4; // email, social links, profile info, verification
    
    // Check email
    if (profileData.email) completedItems++;
    
    // Check social links
    const hasSocialLinks = Object.values(profileData.socialLinks).some(link => link.trim() !== '');
    if (hasSocialLinks) completedItems++;
    
    // Check profile info
    if (profileData.firstName && profileData.lastName) completedItems++;
    
    // Check verification
    if (profileData.verification.email) completedItems++;
    
    completionPercentage = Math.round((completedItems / totalItems) * 100);
    
    // Update progress bar
    const progressFill = document.getElementById('review-progress');
    if (progressFill) {
        progressFill.style.width = `${completionPercentage}%`;
    }
    
    // Update progress text
    const progressText = document.querySelector('.progress-text');
    if (progressText) {
        if (completionPercentage === 100) {
            progressText.textContent = 'Profile complete! You can now receive reviews.';
        } else {
            progressText.textContent = `Complete your profile to get reviews (${completionPercentage}%)`;
        }
    }
    
    // Update review badge based on completion
    const reviewBadge = document.getElementById('review-badge');
    const reviewIcon = reviewBadge?.querySelector('.review-icon');
    const reviewText = reviewBadge?.querySelector('.review-text');
    
    if (reviewBadge && reviewIcon && reviewText) {
        if (completionPercentage === 100) {
            reviewBadge.style.background = 'rgba(16, 185, 129, 0.1)';
            reviewBadge.style.borderColor = '#10b981';
            reviewBadge.style.color = '#10b981';
            reviewIcon.textContent = '✓';
            reviewText.textContent = 'Verified';
        } else if (completionPercentage >= 75) {
            reviewBadge.style.background = 'rgba(59, 130, 246, 0.1)';
            reviewBadge.style.borderColor = '#3b82f6';
            reviewBadge.style.color = '#3b82f6';
            reviewIcon.textContent = '⭐';
            reviewText.textContent = 'Almost Ready';
        } else {
            reviewBadge.style.background = 'rgba(255, 193, 7, 0.1)';
            reviewBadge.style.borderColor = '#ffc107';
            reviewBadge.style.color = '#ffc107';
            reviewIcon.textContent = '⭐';
            reviewText.textContent = 'New User';
        }
    }
}

// Show coming soon message
function showComingSoon(feature) {
    showToast(`${feature} feature coming soon!`, 'info');
}

// Toast notification system
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    if (toast && toastMessage) {
        // Remove existing classes
        toast.classList.remove('success', 'error', 'info');

        // Add new class and message
        if (type !== 'info') {
            toast.classList.add(type);
        }
        toastMessage.textContent = message;

        // Show toast
        toast.classList.add('show');

        // Hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}


// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading states to buttons
function addLoadingState(button, text = 'Loading...') {
    const originalText = button.textContent;
    button.textContent = text;
    button.disabled = true;

    return function removeLoadingState() {
        button.textContent = originalText;
        button.disabled = false;
    };
}

// Simulate API calls with loading states
function simulateApiCall(callback, delay = 1000) {
    setTimeout(callback, delay);
}


// Navbar scroll effect
let ticking = false;
const navbar = document.querySelector('.navbar');

function updateNavbar() {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(33, 35, 70, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        navbar.classList.add('scrolled');
    } else {
        navbar.style.background = 'rgba(33, 35, 70, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.2)';
        navbar.classList.remove('scrolled');
    }
    ticking = false;
}

// Override the global scroll handler
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
    }
});

// Edit Profile Modal Functions
function openEditModal() {
    const modal = document.getElementById('editProfileModal');
    if (modal) {
        // Populate form with current data
        populateEditForm();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeEditModal() {
    const modal = document.getElementById('editProfileModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

function populateEditForm() {
    // Populate form fields with current profile data
    const form = document.getElementById('editProfileForm');
    if (form) {
        form.elements.firstName.value = profileData.firstName || '';
        form.elements.lastName.value = profileData.lastName || '';
        form.elements.instagram.value = profileData.socialLinks.instagram || '';
        form.elements.linkedin.value = profileData.socialLinks.linkedin || '';
        form.elements.major.value = profileData.major || '';
        form.elements.graduationYear.value = profileData.graduationYear || '';
    }
}

function handleEditFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Validate form data
    const firstName = formData.get('firstName').trim();
    const lastName = formData.get('lastName').trim();
    const instagram = formData.get('instagram').trim();
    const linkedin = formData.get('linkedin').trim();
    const major = formData.get('major').trim();
    const graduationYear = formData.get('graduationYear');
    
    // Basic validation
    if (!firstName || !lastName) {
        showToast('First name and last name are required', 'error');
        return;
    }
    
    // Validate social links if provided
    const socialLinks = { instagram, linkedin };
    const validation = validateSocialLinks(socialLinks);
    if (!validation.valid) {
        showToast(validation.message, 'error');
        return;
    }
    
    // Validate graduation year
    if (graduationYear) {
        const year = parseInt(graduationYear);
        const currentYear = new Date().getFullYear();
        if (year < 2020 || year > currentYear + 10) {
            showToast('Please enter a valid graduation year', 'error');
            return;
        }
    }
    
    // Update profile data
    updateProfileData({
        firstName,
        lastName,
        instagram,
        linkedin,
        major,
        graduationYear: graduationYear ? parseInt(graduationYear) : null
    });
    
    // Close modal
    closeEditModal();
    
    // Show success message
    showToast('Profile updated successfully!', 'success');
}

function updateProfileData(newData) {
    // Update profileData object
    profileData.firstName = newData.firstName;
    profileData.lastName = newData.lastName;
    profileData.socialLinks.instagram = newData.instagram;
    profileData.socialLinks.linkedin = newData.linkedin;
    profileData.major = newData.major;
    profileData.graduationYear = newData.graduationYear;
    
    // Save to localStorage
    localStorage.setItem('firstName', newData.firstName);
    localStorage.setItem('lastName', newData.lastName);
    localStorage.setItem('social_instagram', newData.instagram);
    localStorage.setItem('social_linkedin', newData.linkedin);
    localStorage.setItem('major', newData.major);
    if (newData.graduationYear) {
        localStorage.setItem('graduationYear', newData.graduationYear.toString());
    }
    
    // Update UI
    populateProfile();
}

// Toggle edit mode function (called by the Edit Profile button)
function toggleEditMode() {
    openEditModal();
}

// Setup delete account modal event listeners
function setupDeleteAccountModal() {
    const modal = document.getElementById('deleteAccountModal');
    const closeBtn = document.getElementById('closeDeleteModal');
    const cancelBtn = document.getElementById('cancelDelete');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    const confirmInput = document.getElementById('confirmDelete');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeDeleteAccountModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeDeleteAccountModal);
    }
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', handleDeleteAccount);
    }
    
    if (confirmInput) {
        confirmInput.addEventListener('input', function() {
            const isConfirmed = this.value.trim().toUpperCase() === 'DELETE';
            confirmBtn.disabled = !isConfirmed;
        });
    }
    
    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeDeleteAccountModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeDeleteAccountModal();
        }
    });
}

// Show delete account modal
function showDeleteAccountModal() {
    const modal = document.getElementById('deleteAccountModal');
    const confirmInput = document.getElementById('confirmDelete');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    
    if (modal) {
        // Reset form
        if (confirmInput) {
            confirmInput.value = '';
        }
        if (confirmBtn) {
            confirmBtn.disabled = true;
        }
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

// Close delete account modal
function closeDeleteAccountModal() {
    const modal = document.getElementById('deleteAccountModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Handle delete account confirmation
function handleDeleteAccount() {
    const confirmInput = document.getElementById('confirmDelete');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    
    if (!confirmInput || confirmInput.value.trim().toUpperCase() !== 'DELETE') {
        showToast('Please type "DELETE" to confirm', 'error');
        return;
    }
    
    // Add loading state
    const removeLoading = addLoadingState(confirmBtn, 'Deleting...');
    
    // Make API call to delete account
    fetch('/users/delete', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => {
        removeLoading();
        
        if (response.ok) {
            // Clear all user data from localStorage
            const keysToRemove = [
                'firstName', 'lastName', 'email', 'username', 'major', 'graduationYear',
                'joinDate', 'social_instagram', 'social_linkedin', 'verified_email',
                'rememberedEmail', 'userEmail'
            ];
            
            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
            });
            
            // Close modal
            closeDeleteAccountModal();
            
            // Show success message
            showToast('Account deleted successfully. Redirecting...', 'success');
            
            // Redirect to home page after a short delay
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        } else {
            throw new Error('Failed to delete account');
        }
    })
    .catch(error => {
        removeLoading();
        console.error('Error deleting account:', error);
        showToast('Failed to delete account. Please try again.', 'error');
    });
}

// Make functions globally accessible
window.verifyEmail = verifyEmail;
window.toggleEditMode = toggleEditMode;
window.showDeleteAccountModal = showDeleteAccountModal;

console.log('Profile page loaded successfully!');
