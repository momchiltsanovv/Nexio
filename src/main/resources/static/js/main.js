// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

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
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

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
    // Get Started Button
    const getStartedBtns = document.querySelectorAll('.btn-primary');
    getStartedBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.textContent.includes('Get Started') || btn.textContent.includes('Sign Up')) {
                e.preventDefault();
                // Add your sign-up logic here
                console.log('Redirecting to sign-up...');
                // window.location.href = '/signup';
            }
        });
    });

    // Sign In Button
    const signInBtn = document.querySelector('.btn-outline');
    if (signInBtn) {
        signInBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Add your sign-in logic here
            console.log('Redirecting to sign-in...');
            // window.location.href = '/signin';
        });
    }

    // Demo Button
    const demoBtns = document.querySelectorAll('.btn-secondary');
    demoBtns.forEach(btn => {
        if (btn.textContent.includes('Demo')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // Add demo logic here
                console.log('Opening demo...');
                alert('Demo feature coming soon!');
            });
        }
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
//TODO CONNECT THE LINKS TO THE LOGIN/REGISTER PAGE