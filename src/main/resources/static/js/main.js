// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Smooth Scrolling for Navigation Links
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

// Navbar Background on Scroll
window.addEventListener('scroll', throttle(() => {
    // Navbar background change
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(33, 35, 70, 0.98)'; // Keep dark theme
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(33, 35, 70, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.2)';
        }
    }
}, 16));


// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .category-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Stats Counter Animation
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target.toString().includes('K') ? target : target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start).toString() + (target.toString().includes('K') ? 'K+' : '+');
        }
    }, 16);
};

// Trigger counter animation when stats come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                if (text.includes('10K')) {
                    animateCounter(stat, '10K');
                } else if (text.includes('50K')) {
                    animateCounter(stat, '50K');
                } else if (text.includes('4.9')) {
                    animateCounter(stat, '4.9★');
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// Button Click Handlers
document.addEventListener('DOMContentLoaded', () => {
    // Sign In Button - redirect to log in tab
    const signInBtns = document.querySelectorAll('.btn-outline');
    signInBtns.forEach(btn => {
        if (btn.textContent.includes('Sign In')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Redirecting to login...');
                window.location.href = '/login?tab=login';
            });
        }
    });

    // Get Started Button - redirect to sign up tab
    const getStartedBtns = document.querySelectorAll('.btn-primary');
    getStartedBtns.forEach(btn => {
        if (btn.textContent.includes('Get Started')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Redirecting to sign-up...');
                window.location.href = '/login?tab=register';
            });
        }
    });

    // Handle hero section buttons
    const heroStartShoppingBtn = document.querySelector('.hero-actions .btn-primary');
    if (heroStartShoppingBtn && heroStartShoppingBtn.textContent.includes('Start Shopping')) {
        heroStartShoppingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Redirecting to sign-up for shopping...');
            window.location.href = '/login?tab=register';
        });
    }

    // Handle CTA section buttons
    const ctaSignUpBtn = document.querySelector('.cta-actions .btn-primary');
    if (ctaSignUpBtn && (ctaSignUpBtn.textContent.includes('Sign Up') || ctaSignUpBtn.textContent.includes('edu Email'))) {
        ctaSignUpBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Redirecting to sign-up from CTA...');
            window.location.href = '/login?tab=register';
        });
    }

    // Demo Button
    const demoBtns = document.querySelectorAll('.btn-secondary');
    demoBtns.forEach(btn => {
        if (btn.textContent.includes('Demo')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Opening demo...');
                alert('Demo feature coming soon!');
            });
        }
    });

    // Category cards click handlers (optional - for future functionality)
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const categoryName = card.querySelector('h3').textContent;
            console.log(`Clicked on ${categoryName} category`);
            // For now, redirect to sign up. Later you can redirect to category pages
            window.location.href = '/login?tab=register';
        });
    });
});

// Add loading states to buttons
const addLoadingState = (button) => {
    const originalText = button.innerHTML;
    button.innerHTML = '<span>Loading...</span>';
    button.disabled = true;

    // Simulate loading
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
    }, 2000);
};

// Form validation helper (for future forms)
const validateEmail = (email) => {
    const eduRegex = /^[^\s@]+@[^\s@]+\.edu$/;
    return eduRegex.test(email);
};

// Utility function for smooth animations
const fadeInUp = (element, delay = 0) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`;

    setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, delay);
};

// Initialize animations on page load
window.addEventListener('load', () => {
    // Animate hero elements
    const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-description, .hero-actions');
    heroElements.forEach((el, index) => {
        fadeInUp(el, index * 200);
    });
});

// Close mobile menu when clicking on links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu && navToggle && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Scroll to top functionality (optional)
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};



// Handle keyboard navigation
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Performance optimization: Throttle scroll events
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
};

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    // Navbar background change
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }
}, 16));

console.log('Nexio main.js loaded successfully!');
