// Profile data management
let profileData = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    joinDate: ''
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
        joinDate: localStorage.getItem('joinDate') || new Date().toLocaleDateString()
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
        email: document.getElementById('edit-email').value.trim()
    };

    // Validate email
    if (newData.email && !isValidEmail(newData.email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }

    // Update profile data
    profileData.firstName = newData.firstName;
    profileData.lastName = newData.lastName;
    if (newData.email) {
        profileData.email = newData.email;
    }

    // Update username if email changed
    if (newData.email && newData.email !== profileData.email) {
        profileData.username = newData.email.split('@')[0];
    }

    // Save to localStorage
    localStorage.setItem('firstName', profileData.firstName);
    localStorage.setItem('lastName', profileData.lastName);
    localStorage.setItem('userEmail', profileData.email);
    localStorage.setItem('username', profileData.username);

    // Update UI
    populateProfile();
    closeEditModal();
    showToast('Profile updated successfully!', 'success');
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
