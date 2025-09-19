// User Profile View functionality
let userProfileData = {};

// Initialize page on load
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

    loadUserProfileData();
    loadUserItems();
    setupEventListeners();
});

// Load user profile data from Thymeleaf model
function loadUserProfileData() {
    // This would typically be populated from the server-side model
    // For now, we'll use the data that's already in the HTML via Thymeleaf
    console.log('User profile data loaded from server');
}

// Load user's items (placeholder for now)
function loadUserItems() {
    const itemsContainer = document.getElementById('userItemsContainer');
    const noItemsMessage = document.getElementById('noItemsMessage');
    
    // For now, show the no items message
    // In a real implementation, this would fetch items from the server
    if (noItemsMessage) {
        noItemsMessage.style.display = 'block';
    }
    
    // TODO: Implement actual item loading from server
    console.log('Loading user items...');
}

// Setup event listeners
function setupEventListeners() {
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
}

// Send message functionality
function sendMessage() {
    showToast('Message feature coming soon!', 'info');
    // TODO: Implement actual messaging functionality
    console.log('Send message clicked');
}

// Go back functionality
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = '/home';
    }
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

// Make functions globally accessible
window.sendMessage = sendMessage;
window.goBack = goBack;

console.log('User profile view page loaded successfully!');
