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


// Scroll reveal animations
document.addEventListener('DOMContentLoaded', () => {
    // Remove no-js class to enable animations
    document.documentElement.classList.remove('no-js');
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        const revealObserverOptions = { 
            threshold: 0.1, 
            rootMargin: '0px 0px -50px 0px' 
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // For staggered animations, also reveal children
                    if (entry.target.classList.contains('reveal-stagger')) {
                        const children = entry.target.children;
                        Array.from(children).forEach((child, index) => {
                            setTimeout(() => {
                                child.classList.add('visible');
                            }, index * 100);
                        });
                    }
                }
            });
        }, revealObserverOptions);

        // Observe all elements with reveal classes
        const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');
        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    } else {
        // If reduced motion is preferred, show all elements immediately
        const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');
        revealElements.forEach(el => {
            el.classList.add('visible');
            if (el.classList.contains('reveal-stagger')) {
                const children = el.children;
                Array.from(children).forEach(child => {
                    child.classList.add('visible');
                });
            }
        });
    }
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
    const signInBtn = document.getElementById('signInBtn');
    if (signInBtn) {
        signInBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Redirecting to login...');
            window.location.href = '/login?tab=login';
        });
    }

    // Get Started Button - redirect to sign up tab
    const getStartedBtn = document.getElementById('getStartedBtn');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Redirecting to sign-up...');
            window.location.href = '/login?tab=register';
        });
    }

    // Logout Button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const response = await fetch('/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    }
                });
                
                if (response.ok) {
                    // Clear login status from localStorage
                    localStorage.removeItem('isLoggedIn');
                    window.location.href = '/login?message=' + encodeURIComponent('You have been logged out successfully.');
                } else {
                    console.error('Logout failed');
                }
            } catch (error) {
                console.error('Logout error:', error);
            }
        });
    }

    // Check if user is logged in and update UI
    checkLoginStatus();

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

// Interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add click effects to stats
    const stats = document.querySelectorAll('.stat');
    stats.forEach(stat => {
        stat.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Add click effects to floating cards
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.animation = 'none';
            this.style.transform = 'scale(1.2) rotate(5deg)';
            setTimeout(() => {
                this.style.animation = 'float 6s ease-in-out infinite';
                this.style.transform = '';
            }, 300);
        });
    });

    // Add hover sound effect simulation (visual feedback)
    const interactiveElements = document.querySelectorAll('.feature-card, .category-card, .nav-link');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });

    // Add scroll-triggered parallax effect to hero elements
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-badge, .floating-card');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        let i = 0;
        
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }

    // Advanced scroll-triggered animations
    const advancedScrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation for child elements
                const children = entry.target.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('visible');
                    }, index * 200);
                });
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

    // Observe advanced scroll elements
    const advancedElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');
    advancedElements.forEach(el => {
        advancedScrollObserver.observe(el);
    });

    // Magnetic hover effect
    const magneticElements = document.querySelectorAll('.magnetic');
    magneticElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0) scale(1)';
        });
    });

    // 3D card tilt effect
    const card3DElements = document.querySelectorAll('.card-3d');
    card3DElements.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });

    // Text reveal animation
    const textRevealElements = document.querySelectorAll('.text-reveal');
    textRevealElements.forEach(element => {
        const text = element.textContent;
        element.innerHTML = '';
        
        text.split('').forEach(char => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            element.appendChild(span);
        });
    });

    // Progress bar animations
    const progressBars = document.querySelectorAll('.progress-fill');
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });

    // Advanced button interactions
    const advancedButtons = document.querySelectorAll('.btn-advanced');
    advancedButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.animationPlayState = 'paused';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.animationPlayState = 'running';
        });
    });

    // Loading shimmer effect
    const shimmerElements = document.querySelectorAll('.loading-shimmer');
    shimmerElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.animationPlayState = 'paused';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.animationPlayState = 'running';
        });
    });

    // Cursor trail effect
    let mouseX = 0, mouseY = 0;
    let trail = [];
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Create trail particle
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = mouseX + 'px';
        particle.style.top = mouseY + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = 'rgba(206, 58, 129, 0.6)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.transition = 'all 0.3s ease';
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.style.opacity = '0';
            particle.style.transform = 'scale(0)';
            setTimeout(() => {
                document.body.removeChild(particle);
            }, 300);
        }, 100);
    });

    // Smooth scroll with easing
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                const targetPosition = target.offsetTop - 80;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Add ripple effect CSS
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Function to check login status and update UI
function checkLoginStatus() {
    // This would typically make an API call to check if user is logged in
    // For now, we'll check if there's a session cookie or localStorage
    const isLoggedIn = document.cookie.includes('JSESSIONID') || localStorage.getItem('isLoggedIn');
    
    const signInBtn = document.getElementById('signInBtn');
    const getStartedBtn = document.getElementById('getStartedBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (isLoggedIn) {
        if (signInBtn) signInBtn.style.display = 'none';
        if (getStartedBtn) getStartedBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'inline-flex';
    } else {
        if (signInBtn) signInBtn.style.display = 'inline-flex';
        if (getStartedBtn) getStartedBtn.style.display = 'inline-flex';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
}

console.log('Nexio main.js loaded successfully!');
