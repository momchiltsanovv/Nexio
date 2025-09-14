// Item View Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeWishlist();
    initializeImageGallery();
    initializeActions();
    initializeToast();
});

// Navigation functionality
function initializeNavigation() {
    const navOptionsBtn = document.getElementById('navOptionsBtn');
    const navOptionsDropdown = document.getElementById('navOptionsDropdown');

    if (navOptionsBtn && navOptionsDropdown) {
        navOptionsBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            navOptionsDropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!navOptionsDropdown.contains(e.target) && !navOptionsBtn.contains(e.target)) {
                navOptionsDropdown.classList.remove('active');
            }
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

// Wishlist functionality
function initializeWishlist() {
    const wishlistBtns = document.querySelectorAll('.wishlist-btn, #addToWishlistBtn');
    
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = this.classList.contains('active');
            
            if (isActive) {
                removeFromWishlist();
            } else {
                addToWishlist();
            }
            
            // Toggle visual state
            this.classList.toggle('active');
            
            // Update heart icon
            const heartIcon = this.querySelector('svg path');
            if (heartIcon) {
                if (this.classList.contains('active')) {
                    heartIcon.setAttribute('fill', 'currentColor');
                    heartIcon.removeAttribute('stroke');
                } else {
                    heartIcon.removeAttribute('fill');
                    heartIcon.setAttribute('stroke', 'currentColor');
                }
            }
        });
    });
}

function addToWishlist() {
    showToast('Added to wishlist! ❤️');
    
    // Here you would typically make an API call to add to wishlist
    // Example:
    // fetch('/api/wishlist/add', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ itemId: getItemId() })
    // });
}

function removeFromWishlist() {
    showToast('Removed from wishlist');
    
    // Here you would typically make an API call to remove from wishlist
    // Example:
    // fetch('/api/wishlist/remove', {
    //     method: 'DELETE',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ itemId: getItemId() })
    // });
}

// Image gallery functionality
function initializeImageGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.querySelector('.main-image .item-emoji');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Update main image (in a real app, this would change the actual image)
            const thumbnailEmoji = this.querySelector('.thumbnail-emoji');
            if (mainImage && thumbnailEmoji) {
                mainImage.textContent = thumbnailEmoji.textContent;
            }
        });
    });
}

// Action buttons functionality
function initializeActions() {
    // Contact seller button
    const contactBtn = document.querySelector('.btn-contact');
    if (contactBtn) {
        contactBtn.addEventListener('click', function() {
            // Redirect to messages or open contact modal
            showToast('Redirecting to messages...');
            setTimeout(() => {
                window.location.href = '/messages';
            }, 1000);
        });
    }

    // Share button
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            if (navigator.share) {
                // Use native sharing if available
                navigator.share({
                    title: document.title,
                    url: window.location.href
                }).then(() => {
                    showToast('Shared successfully!');
                }).catch(err => {
                    fallbackShare();
                });
            } else {
                fallbackShare();
            }
        });
    }

    // Navigation buttons
    const profileBtn = document.getElementById('profileBtn');
    const wishlistNavBtn = document.getElementById('wishlistBtn');

    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            window.location.href = '/profile';
        });
    }

    if (wishlistNavBtn) {
        wishlistNavBtn.addEventListener('click', () => {
            window.location.href = '/wishlist';
        });
    }

}

// Fallback sharing function
function fallbackShare() {
    // Copy URL to clipboard
    navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Link copied to clipboard!');
    }).catch(err => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Link copied to clipboard!');
    });
}

// Toast notification system
function initializeToast() {
    // Toast is already initialized in CSS, just need show/hide functions
}

function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }
}

// Utility functions
function getItemId() {
    // Extract item ID from URL
    const pathParts = window.location.pathname.split('/');
    return pathParts[pathParts.length - 1];
}

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key to close dropdown
    if (e.key === 'Escape') {
        const dropdown = document.getElementById('navOptionsDropdown');
        if (dropdown) {
            dropdown.classList.remove('active');
        }
    }
    
    // Enter key on wishlist button
    if (e.key === 'Enter' && e.target.classList.contains('wishlist-btn')) {
        e.target.click();
    }
});

// Smooth scrolling for anchor links
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

// Performance optimization: Lazy loading for images (when real images are added)
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Initialize lazy loading
initializeLazyLoading();

// Add loading states for buttons
function addLoadingState(button, loadingText = 'Loading...') {
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = loadingText;
    
    return function removeLoadingState() {
        button.disabled = false;
        button.textContent = originalText;
    };
}

// Error handling for failed requests
function handleError(error, userMessage = 'Something went wrong') {
    console.error('Error:', error);
    showToast(userMessage);
}

// Analytics tracking (placeholder)
function trackEvent(eventName, eventData = {}) {
    // In a real app, this would send data to your analytics service
    console.log('Analytics event:', eventName, eventData);
}

// Track page view
trackEvent('item_view', {
    itemId: getItemId(),
    timestamp: new Date().toISOString()
});

console.log('Item view page loaded successfully!');
