// Profile data management
let profileData = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
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
    loadProfileData();
    populateProfile();
});

// Load profile data from localStorage
function loadProfileData() {
    profileData = {
        firstName: localStorage.getItem('firstName') || '',
        lastName: localStorage.getItem('lastName') || '',
        email: localStorage.getItem('rememberedEmail') || localStorage.getItem('userEmail') || '',
        username: localStorage.getItem('username') || '',
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

// Toggle edit mode
function toggleEditMode() {
    const modal = document.getElementById('edit-modal');
    if (modal) {
        modal.classList.add('show');

        // Populate edit form with current data
        document.getElementById('edit-first-name').value = profileData.firstName;
        document.getElementById('edit-last-name').value = profileData.lastName;
        document.getElementById('edit-email').value = profileData.email;
        document.getElementById('edit-instagram').value = profileData.socialLinks.instagram;
        document.getElementById('edit-linkedin').value = profileData.socialLinks.linkedin;
        
        // Update verification button state
        updateVerificationButton();
    }
}

// Close edit modal
function closeEditModal() {
    const modal = document.getElementById('edit-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Save profile changes
function saveProfile() {
    const newData = {
        firstName: document.getElementById('edit-first-name').value.trim(),
        lastName: document.getElementById('edit-last-name').value.trim(),
        email: document.getElementById('edit-email').value.trim(),
        socialLinks: {
            instagram: document.getElementById('edit-instagram').value.trim(),
            linkedin: document.getElementById('edit-linkedin').value.trim()
        }
    };

    // Validate email
    if (newData.email && !isValidEmail(newData.email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }

    // Validate social links
    const socialValidation = validateSocialLinks(newData.socialLinks);
    if (!socialValidation.valid) {
        showToast(socialValidation.message, 'error');
        return;
    }

    // Update profile data
    profileData.firstName = newData.firstName;
    profileData.lastName = newData.lastName;
    if (newData.email) {
        profileData.email = newData.email;
    }
    profileData.socialLinks = newData.socialLinks;

    // Update username if email changed
    if (newData.email && newData.email !== profileData.email) {
        profileData.username = newData.email.split('@')[0];
    }

    // Save to localStorage
    localStorage.setItem('firstName', profileData.firstName);
    localStorage.setItem('lastName', profileData.lastName);
    localStorage.setItem('userEmail', profileData.email);
    localStorage.setItem('username', profileData.username);
    localStorage.setItem('social_instagram', profileData.socialLinks.instagram);
    localStorage.setItem('social_linkedin', profileData.socialLinks.linkedin);

    // Update UI
    populateProfile();
    updateReviewStatus();
    closeEditModal();
    showToast('Profile updated successfully!', 'success');
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

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('edit-modal');
    if (event.target === modal) {
        closeEditModal();
    }
});

// Handle escape key to close modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeEditModal();
    }
});

// Handle form submission in modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && document.getElementById('edit-modal').classList.contains('show')) {
        event.preventDefault();
        saveProfile();
    }
});

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

// Enhanced save profile with loading state
function saveProfileWithLoading() {
    const saveBtn = document.querySelector('.modal-actions .btn-primary');
    const removeLoading = addLoadingState(saveBtn, 'Saving...');

    simulateApiCall(() => {
        saveProfile();
        removeLoading();
    }, 800);
}

// Update the save button onclick
document.addEventListener('DOMContentLoaded', function() {
    const saveBtn = document.querySelector('.modal-actions .btn-primary');
    if (saveBtn) {
        saveBtn.onclick = saveProfileWithLoading;
    }
});

// Auto-save draft changes
let draftTimer;
function saveDraft() {
    clearTimeout(draftTimer);
    draftTimer = setTimeout(() => {
        const draftData = {
            firstName: document.getElementById('edit-first-name')?.value || '',
            lastName: document.getElementById('edit-last-name')?.value || '',
            email: document.getElementById('edit-email')?.value || ''
        };
        localStorage.setItem('profileDraft', JSON.stringify(draftData));
    }, 1000);
}

// Load draft on modal open
function loadDraft() {
    const draft = localStorage.getItem('profileDraft');
    if (draft) {
        try {
            const draftData = JSON.parse(draft);
            if (draftData.firstName) document.getElementById('edit-first-name').value = draftData.firstName;
            if (draftData.lastName) document.getElementById('edit-last-name').value = draftData.lastName;
            if (draftData.email) document.getElementById('edit-email').value = draftData.email;
        } catch (e) {
            console.log('Error loading draft:', e);
        }
    }
}

// Clear draft after successful save
function clearDraft() {
    localStorage.removeItem('profileDraft');
}

// Add input listeners for draft saving
document.addEventListener('DOMContentLoaded', function() {
    const inputs = ['edit-first-name', 'edit-last-name', 'edit-email'];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', saveDraft);
        }
    });
});

console.log('Profile page loaded successfully!');
