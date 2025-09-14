// Terms and Conditions Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeScrollEffects();
    initializeAccessibility();
    console.log('Terms and Conditions page loaded successfully!');
});

// Navigation functionality
function initializeNavigation() {
    const navOptionsBtn = document.getElementById('navOptionsBtn');
    const navOptionsDropdown = document.getElementById('navOptionsDropdown');
    const wishlistBtn = document.getElementById('wishlistBtn');
    const profileBtn = document.getElementById('profileBtn');

    // Navigation dropdown toggle
    if (navOptionsBtn && navOptionsDropdown) {
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

    // Navigation button handlers
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
            window.location.href = '/wishlist';
        });
    }

    if (profileBtn) {
        profileBtn.addEventListener('click', function() {
            window.location.href = '/profile';
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Scroll effects and animations
function initializeScrollEffects() {
    // Smooth scroll for anchor links
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

    // Reading progress indicator removed
    
    // Animate sections on scroll
    initializeScrollAnimations();
}

// Reading progress indicator function removed

// Initialize scroll animations for terms sections
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe terms sections for animation
    document.querySelectorAll('.terms-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Accessibility enhancements
function initializeAccessibility() {
    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // ESC key to close dropdown
        if (e.key === 'Escape') {
            const dropdown = document.getElementById('navOptionsDropdown');
            if (dropdown) {
                dropdown.classList.remove('active');
            }
        }

        // Enter/Space on buttons
        if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('nav-options-btn')) {
            e.preventDefault();
            e.target.click();
        }
    });

    // Add focus outline for better accessibility
    const style = document.createElement('style');
    style.textContent = `
        .nav-option-link:focus,
        .btn:focus {
            outline: 2px solid var(--secondary-color);
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(style);
}

// Utility functions for enhanced user experience
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function printTerms() {
    window.print();
}

// Copy link functionality
function copyPageLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showNotification('Link copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy link:', err);
    });
}

// Simple notification system
function showNotification(message, duration = 3000) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        background: var(--surface-elevated);
        backdrop-filter: blur(20px);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: 16px 20px;
        color: white;
        font-weight: 500;
        box-shadow: var(--shadow-lg);
        transform: translateX(400px);
        transition: transform 0.3s ease;
        z-index: 2000;
        max-width: 300px;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, duration);
}

// Error handling for failed requests
function handleError(error, userMessage = 'Something went wrong') {
    console.error('Error:', error);
    showNotification(userMessage);
}

// Analytics tracking (placeholder)
function trackEvent(eventName, eventData = {}) {
    // In a real app, this would send data to your analytics service
    console.log('Analytics event:', eventName, eventData);
}

// Track page view
trackEvent('terms_page_view', {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
});

// Add table of contents functionality (optional enhancement)
function createTableOfContents() {
    const tocContainer = document.createElement('div');
    tocContainer.className = 'table-of-contents';
    tocContainer.style.cssText = `
        position: fixed;
        right: 24px;
        top: 50%;
        transform: translateY(-50%);
        background: var(--surface-elevated);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: 16px;
        max-width: 200px;
        z-index: 100;
        display: none;
    `;

    const tocTitle = document.createElement('h4');
    tocTitle.textContent = 'Contents';
    tocTitle.style.cssText = `
        color: white;
        font-size: 14px;
        margin: 0 0 12px 0;
        font-weight: 600;
    `;
    tocContainer.appendChild(tocTitle);

    // Create TOC links
    const sections = document.querySelectorAll('.terms-section h3');
    sections.forEach((heading, index) => {
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = heading.textContent;
        link.style.cssText = `
            display: block;
            color: var(--text-light);
            text-decoration: none;
            font-size: 12px;
            padding: 4px 0;
            border-bottom: 1px solid transparent;
            transition: all 0.3s ease;
        `;
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            heading.scrollIntoView({ behavior: 'smooth' });
        });

        tocContainer.appendChild(link);
    });

    // Only show TOC on larger screens
    if (window.innerWidth > 1200) {
        document.body.appendChild(tocContainer);
        tocContainer.style.display = 'block';
    }
}

// Initialize table of contents on larger screens
if (window.innerWidth > 1200) {
    createTableOfContents();
}

// Handle window resize
window.addEventListener('resize', function() {
    const toc = document.querySelector('.table-of-contents');
    if (window.innerWidth > 1200 && !toc) {
        createTableOfContents();
    } else if (window.innerWidth <= 1200 && toc) {
        toc.remove();
    }
});
