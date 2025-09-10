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

// GitHub-style Parallax Effect - Optimized for smoothness
let ticking = false;
let hero, heroHeight;

// Cache DOM elements
document.addEventListener('DOMContentLoaded', () => {
    hero = document.querySelector('.hero');
    if (hero) {
        heroHeight = hero.offsetHeight;
    }
});

function updateParallax() {
    if (!hero) return;
    
    const scrolled = window.pageYOffset;
    const scrollProgress = scrolled / heroHeight;
    
    // Calculate progress within the current viewport cycle
    const cycleProgress = (scrolled % heroHeight) / heroHeight;
    
    // Scale down and move back effect - resets every viewport height
    const scale = Math.max(0.8, 1 - cycleProgress * 0.2); // Scale from 1 to 0.8
    const translateZ = cycleProgress * -100; // Move back in Z-axis
    
    hero.style.transform = `translate3d(0, 0, ${translateZ}px) scale(${scale})`;
    
    // Smooth fade effect - resets every viewport height
    const opacity = Math.max(0, Math.min(1, 1 - cycleProgress * 1.5));
    hero.style.opacity = opacity;
    
    ticking = false;
}

// Navbar background change
function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(33, 35, 70, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(33, 35, 70, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.2)';
        }
    }
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateParallax();
            updateNavbar();
        });
        ticking = true;
    }
});


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
                    // Reset animation first
                    entry.target.classList.remove('visible');
                    
                    // Force reflow to ensure reset is applied
                    entry.target.offsetHeight;
                    
                    // Add visible class to trigger animation
                    entry.target.classList.add('visible');
                    
                    // For staggered animations, also reveal children
                    if (entry.target.classList.contains('reveal-stagger')) {
                        const children = entry.target.children;
                        Array.from(children).forEach((child, index) => {
                            // Reset child animation
                            child.classList.remove('visible');
                            
                            setTimeout(() => {
                                child.classList.add('visible');
                            }, index * 100);
                        });
                    }
                } else {
                    // Reset animation when out of view
                    entry.target.classList.remove('visible');
                    if (entry.target.classList.contains('reveal-stagger')) {
                        const children = entry.target.children;
                        Array.from(children).forEach(child => {
                            child.classList.remove('visible');
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

// Trigger counter animation when stats come into view - resets every time
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                // Reset to initial value first
                if (text.includes('10K')) {
                    stat.textContent = '0K+';
                    animateCounter(stat, '10K');
                } else if (text.includes('50K')) {
                    stat.textContent = '0K+';
                    animateCounter(stat, '50K');
                } else if (text.includes('4.9')) {
                    stat.textContent = '0★';
                    animateCounter(stat, '4.9★');
                }
            });
        } else {
            // Reset when out of view
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                if (text.includes('10K')) {
                    stat.textContent = '0K+';
                } else if (text.includes('50K')) {
                    stat.textContent = '0K+';
                } else if (text.includes('4.9')) {
                    stat.textContent = '0★';
                }
            });
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

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

    // Log In Button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Redirect to login page
            window.location.href = '/login';
        });
    }

    // Check if user is logged in and update UI
    checkLoginStatus();

    // Handle Start Shopping button
    const startShoppingBtn = document.getElementById('startShoppingBtn');
    console.log('Start Shopping button found:', startShoppingBtn);
    if (startShoppingBtn) {
        startShoppingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Start Shopping button clicked - redirecting to sign-up...');
            window.location.href = '/login?tab=register';
        });
        console.log('Start Shopping button event listener attached');
    } else {
        console.error('Start Shopping button not found!');
        // Fallback: try to attach event listener when button becomes available
        const observer = new MutationObserver((mutations) => {
            const button = document.getElementById('startShoppingBtn');
            if (button) {
                console.log('Start Shopping button found via observer');
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Start Shopping button clicked (fallback) - redirecting to sign-up...');
                    window.location.href = '/login?tab=register';
                });
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Additional fallback: Event delegation for Start Shopping button
    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'startShoppingBtn') {
            e.preventDefault();
            e.stopPropagation();
            console.log('Start Shopping button clicked (event delegation) - redirecting to sign-up...');
            window.location.href = '/login?tab=register';
        }
    });

    // Handle CTA section buttons
    const ctaSignUpBtn = document.querySelector('.cta-actions .btn-primary');
    if (ctaSignUpBtn && (ctaSignUpBtn.textContent.includes('Sign Up') || ctaSignUpBtn.textContent.includes('edu Email'))) {
        ctaSignUpBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Redirecting to sign-up from CTA...');
            window.location.href = '/login?tab=register';
        });
    }

    // Demo Button handler removed - no longer needed

    // Category cards click handlers removed - now handled by modal functionality
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
    // Animate hero elements with minimal delays
    const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-description, .hero-actions');
    heroElements.forEach((el, index) => {
        // Minimal delay: badge=0ms, title=50ms, description=100ms, actions=150ms
        fadeInUp(el, index * 10);
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

    // Add typing effect to hero title with minimal delay
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        let i = 0;
        
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50); // Even faster typing speed
            }
        };
        
        setTimeout(typeWriter, 50); // Minimal delay - start almost immediately
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

    // Magnetic hover effect removed

    // 3D card tilt effect removed

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

    // Cursor trail effect removed

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
    const loginBtn = document.getElementById('loginBtn');
    
    if (isLoggedIn) {
        if (signInBtn) signInBtn.style.display = 'none';
        if (getStartedBtn) getStartedBtn.style.display = 'none';
        if (loginBtn) loginBtn.style.display = 'none';
    } else {
        if (signInBtn) signInBtn.style.display = 'inline-flex';
        if (getStartedBtn) getStartedBtn.style.display = 'inline-flex';
        if (loginBtn) loginBtn.style.display = 'inline-flex';
    }
}

// Animated Statistics Dashboard
function initStatsDashboard() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const activityItems = document.querySelectorAll('.activity-item');
    
    // Animate counters
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format number with commas
            const formatted = Math.floor(current).toLocaleString();
            element.textContent = formatted;
        }, 16);
    }
    
    // Start counter animations when dashboard comes into view
    function startCounterAnimations() {
        statNumbers.forEach((element, index) => {
            const target = parseInt(element.getAttribute('data-target'));
            setTimeout(() => {
                animateCounter(element, target, 2000);
            }, index * 200); // Stagger animations
        });
    }
    
    // Animate activity items
    function animateActivityItems() {
        activityItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(30px)';
                item.style.transition = 'all 0.5s ease-out';
                
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, 100);
            }, index * 100);
        });
    }
    
    // Simulate live activity updates
    function simulateLiveActivity() {
        const activityFeed = document.querySelector('.activity-feed');
        if (!activityFeed) return;
        
        const activities = [
            {
                icon: '📚',
                text: '<span class="user">@new_user</span> listed <span class="item">Chemistry Lab Manual</span> for <span class="price">$25</span>',
                time: '1m ago'
            },
            {
                icon: '💻',
                text: '<span class="user">@tech_student</span> listed <span class="item">Gaming Laptop</span> for <span class="price">$650</span>',
                time: '3m ago'
            },
            {
                icon: '🤝',
                text: '<span class="user">@buyer123</span> and <span class="user">@seller456</span> completed an exchange',
                time: '5m ago'
            },
            {
                icon: '💬',
                text: '<span class="user">@student_amy</span> started chatting about <span class="item">Biology Textbook</span>',
                time: '7m ago'
            }
        ];
        
        setInterval(() => {
            const randomActivity = activities[Math.floor(Math.random() * activities.length)];
            const newItem = document.createElement('div');
            newItem.className = 'activity-item';
            newItem.style.opacity = '0';
            newItem.style.transform = 'translateX(30px)';
            
            newItem.innerHTML = `
                <div class="activity-icon">${randomActivity.icon}</div>
                <div class="activity-text">${randomActivity.text}</div>
                <div class="activity-time">${randomActivity.time}</div>
            `;
            
            // Add to top of feed
            activityFeed.insertBefore(newItem, activityFeed.firstChild);
            
            // Animate in
            setTimeout(() => {
                newItem.style.transition = 'all 0.5s ease-out';
                newItem.style.opacity = '1';
                newItem.style.transform = 'translateX(0)';
            }, 100);
            
            // Remove old items (keep only 4)
            const items = activityFeed.querySelectorAll('.activity-item');
            if (items.length > 4) {
                const oldItem = items[items.length - 1];
                oldItem.style.transition = 'all 0.5s ease-out';
                oldItem.style.opacity = '0';
                oldItem.style.transform = 'translateX(-30px)';
                setTimeout(() => {
                    if (oldItem.parentNode) {
                        oldItem.parentNode.removeChild(oldItem);
                    }
                }, 500);
            }
        }, 8000); // Add new activity every 8 seconds
    }
    
    // Update statistics periodically
    function updateStatistics() {
        setInterval(() => {
            statNumbers.forEach((element) => {
                const current = parseInt(element.textContent.replace(/,/g, ''));
                const increment = Math.floor(Math.random() * 5) + 1; // Random increment 1-5
                const newValue = current + increment;
                
                // Animate the update
                animateCounter(element, newValue, 1000);
            });
        }, 15000); // Update every 15 seconds
    }
    
    // Initialize dashboard
    function initDashboard() {
        // Start counter animations
        startCounterAnimations();
        
        // Animate activity items
        setTimeout(animateActivityItems, 1000);
        
        // Start live activity simulation
        setTimeout(simulateLiveActivity, 2000);
        
        // Start statistics updates
        setTimeout(updateStatistics, 5000);
    }
    
    // Start when dashboard is visible
    const dashboard = document.querySelector('.live-metrics');
    if (dashboard) {
        // Use Intersection Observer to start animations when visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initDashboard();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(dashboard);
    }
}

// Card Modal Functionality
const cardData = {
    'University Verified': {
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 12l2 2 4-4"/>
            <circle cx="12" cy="12" r="9"/>
        </svg>`,
        description: 'All items are verified by university students and staff to ensure authenticity and quality.',
        features: [
            'Student ID verification required',
            'University email confirmation',
            'Quality assurance process',
            'Trusted seller network'
        ]
    },
    'Secure Payments': {
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
        </svg>`,
        description: 'Your transactions are protected with bank-level security and encrypted payment processing.',
        features: [
            'SSL encryption',
            'PCI DSS compliant',
            'Fraud protection',
            'Secure checkout process'
        ]
    },
    'Fast Delivery': {
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
            <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>`,
        description: 'Get your items delivered quickly with our efficient campus delivery network.',
        features: [
            'Same-day delivery available',
            'Campus pickup points',
            'Real-time tracking',
            'Delivery notifications'
        ]
    },
    'Easy Returns': {
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2-2z"/>
            <polyline points="8,7 8,1 16,1 16,7"/>
        </svg>`,
        description: 'Not satisfied? Return items easily with our hassle-free return policy.',
        features: [
            '30-day return window',
            'Free return shipping',
            'Quick refund process',
            'No questions asked policy'
        ]
    },
    '24/7 Support': {
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>`,
        description: 'Our support team is available around the clock to help you with any questions.',
        features: [
            'Live chat support',
            'Email assistance',
            'Phone support',
            'FAQ knowledge base'
        ]
    },
    'Student Discounts': {
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>`,
        description: 'Exclusive discounts and deals for university students and staff members.',
        features: [
            'Student ID verification',
            'Exclusive pricing',
            'Seasonal promotions',
            'Bulk order discounts'
        ]
    },
    'Semester Sync': {
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>`,
        description: 'Automatic reminders to sell textbooks at semester end. Never miss the perfect selling time.',
        features: [
            'Automatic semester tracking',
            'Smart selling reminders',
            'Optimal timing notifications',
            'Textbook lifecycle management'
        ]
    },
    'Direct Messaging': {
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>`,
        description: 'Chat directly with buyers and sellers. Negotiate prices and arrange meetups safely.',
        features: [
            'Real-time messaging',
            'Price negotiation tools',
            'Safe meetup coordination',
            'Secure communication'
        ]
    },
    'Trust & Safety': {
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>`,
        description: 'User ratings, verification badges, and report system keep your transactions secure.',
        features: [
            'User rating system',
            'Verification badges',
            'Report and safety tools',
            'Secure transaction monitoring'
        ]
    },
    'Photo Recognition': {
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
        </svg>`,
        description: 'Take a photo of any item and our AI will automatically detect the category, condition, and suggest details. Smart selling made simple.',
        features: [
            'AI-powered image analysis',
            'Automatic category detection',
            'Smart condition assessment',
            'Instant listing suggestions'
        ]
    },
    'Electronics': {
        icon: '📱',
        description: 'Find the latest gadgets, laptops, phones, and tech accessories from fellow students.',
        features: [
            'Latest smartphone models',
            'Gaming laptops and consoles',
            'Audio equipment',
            'Tech accessories'
        ]
    },
    'Textbooks': {
        icon: '📚',
        description: 'Buy and sell textbooks for your courses at affordable prices.',
        features: [
            'Current semester books',
            'Previous editions available',
            'Digital and physical copies',
            'Course-specific bundles'
        ]
    },
    'Furniture': {
        icon: '🪑',
        description: 'Dorm room essentials, study desks, and furniture for your living space.',
        features: [
            'Dorm room furniture',
            'Study desks and chairs',
            'Storage solutions',
            'Decorative items'
        ]
    },
    'Clothing': {
        icon: '👕',
        description: 'University merchandise, casual wear, and formal attire for students.',
        features: [
            'University merchandise',
            'Casual and formal wear',
            'Seasonal clothing',
            'Accessories and shoes'
        ]
    },
    'Sports': {
        icon: '⚽',
        description: 'Sports equipment, gym gear, and athletic wear for active students.',
        features: [
            'Gym and fitness equipment',
            'Team sports gear',
            'Athletic wear',
            'Outdoor equipment'
        ]
    },
    'Dorm Supplies': {
        icon: '🏠',
        description: 'Bedding, kitchen items, and dorm essentials for your living space.',
        features: [
            'Bedding and linens',
            'Kitchen essentials',
            'Storage solutions',
            'Dorm room decor'
        ]
    },
    'Study Group': {
        icon: '🔬',
        description: 'Share lab equipment, calculators, and study materials with fellow students.',
        features: [
            'Lab equipment sharing',
            'Calculator rentals',
            'Study materials',
            'Group study tools'
        ]
    },
    'Other': {
        icon: '🎒',
        description: 'Miscellaneous items, school supplies, and everything else you might need.',
        features: [
            'School supplies',
            'Art and craft materials',
            'Kitchen essentials',
            'Personal care items'
        ]
    },
    // Metric cards data
    'Active Students': {
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>`,
        description: 'Our growing community of verified university students actively buying and selling items.',
        features: [
            '12,847+ verified students',
            'Growing 12.5% monthly',
            'Active across 47 universities',
            'High engagement rates'
        ]
    },
    'Universities': {
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
            <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>`,
        description: 'We are expanding to universities nationwide, bringing the marketplace to more campuses.',
        features: [
            '47 universities and growing',
            '3 new universities this month',
            'Campus-specific features',
            'Local delivery networks'
        ]
    },
    'Avg Rating': {
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>`,
        description: 'Our high user satisfaction rating reflects the quality of our platform and community.',
        features: [
            '4.8/5 average rating',
            'Improved by 0.2 points',
            'Based on user reviews',
            'Quality assurance focus'
        ]
    },
    'Total Sales': {
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>`,
        description: 'The total value of successful transactions facilitated through our platform.',
        features: [
            '$2.1M in total sales',
            '15.7% growth this month',
            'Secure payment processing',
            'Trusted transaction system'
        ]
    },
    // Highlight items data
    'University Verified': {
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 12l2 2 4-4"/>
            <circle cx="12" cy="12" r="9"/>
        </svg>`,
        description: 'All users are verified university students with .edu email addresses.',
        features: [
            'Student ID verification',
            'University email required',
            'Trusted community',
            'Secure transactions'
        ]
    },
    'Campus Delivery': {
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
        </svg>`,
        description: 'Convenient delivery options right to your campus location.',
        features: [
            'Dorm delivery available',
            'Campus pickup points',
            'Same-day delivery',
            'Safe meetup locations'
        ]
    },
    '24/7 Support': {
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>`,
        description: 'Round-the-clock customer support to help you with any questions.',
        features: [
            'Live chat support',
            'Email assistance',
            'Phone support',
            'FAQ knowledge base'
        ]
    },
    // Steps list data
    'Sign Up': {
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="8.5" cy="7" r="4"/>
            <line x1="20" y1="8" x2="20" y2="14"/>
            <line x1="23" y1="11" x2="17" y2="11"/>
        </svg>`,
        description: 'Create your account and verify your student email to join your campus marketplace.',
        features: [
            'University email verification',
            'Student ID confirmation',
            'Secure account setup',
            'Campus community access'
        ]
    },
    'List or Browse': {
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10,9 9,9 8,9"/>
        </svg>`,
        description: 'Post your items for sale or browse through categories to find what you need.',
        features: [
            'Easy item listing',
            'Category browsing',
            'Search functionality',
            'Student-focused categories'
        ]
    },
    'Connect & Chat': {
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>`,
        description: 'Message sellers or buyers directly to ask questions and negotiate deals.',
        features: [
            'Direct messaging',
            'Real-time chat',
            'Safe communication',
            'Deal negotiation'
        ]
    },
    'Meet & Complete': {
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 12l2 2 4-4"/>
            <circle cx="12" cy="12" r="9"/>
        </svg>`,
        description: 'Meet up safely and complete your transaction with verification codes.',
        features: [
            'Safe meetup locations',
            'Verification system',
            'Secure transactions',
            'Campus safety features'
        ]
    },
    // Bullet list data
    'Find a compatible buyer or seller': {
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>`,
        description: 'Students are the ideal buyers and sellers because they understand each other\'s needs.',
        features: [
            'Student-to-student marketplace',
            'Shared campus experience',
            'Understanding of student needs',
            'Peer-to-peer connections'
        ]
    },
    'Safe and local transactions': {
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
        </svg>`,
        description: 'No need to travel across the city. Connect with students within your campus community.',
        features: [
            'Campus-based transactions',
            'Local meetup points',
            'Reduced travel time',
            'Community safety'
        ]
    },
    'Promote sustainability': {
        icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>`,
        description: 'Turn unused items into cash while helping to reduce waste and promote sustainability.',
        features: [
            'Reduce waste',
            'Extend item lifecycle',
            'Earn money from unused items',
            'Environmental responsibility'
        ]
    }
};

function openModal(cardTitle) {
    console.log('Opening modal for:', cardTitle);
    const modal = document.getElementById('cardModal');
    const modalIcon = document.getElementById('modalIcon');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalFeatures = document.getElementById('modalFeatures');
    
    const data = cardData[cardTitle];
    if (!data) {
        console.log('No data found for:', cardTitle);
        return;
    }
    
    // Populate modal content
    modalIcon.innerHTML = data.icon;
    modalTitle.textContent = cardTitle;
    modalDescription.textContent = data.description;
    
    // Clear and populate features
    modalFeatures.innerHTML = '';
    data.features.forEach(feature => {
        const featureElement = document.createElement('div');
        featureElement.className = 'modal-feature';
        featureElement.innerHTML = `
            <span class="modal-feature-icon">✓</span>
            <span class="modal-feature-text">${feature}</span>
        `;
        modalFeatures.appendChild(featureElement);
    });
    
    // Show modal
    modal.classList.add('active');
    document.body.classList.add('modal-open');
}

function closeModal() {
    const modal = document.getElementById('cardModal');
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
}

// Add click event listeners to cards
document.addEventListener('DOMContentLoaded', () => {
    // Feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const title = card.querySelector('h3').textContent;
            console.log('Feature card clicked:', title);
            openModal(title);
        });
    });
    
    // Category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const title = card.querySelector('h3').textContent;
            console.log('Category card clicked:', title);
            openModal(title);
        });
    });
    
    // Metric cards
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const title = card.querySelector('.metric-label').textContent;
            console.log('Metric card clicked:', title);
            openModal(title);
        });
    });
    
    // Highlight items
    const highlightItems = document.querySelectorAll('.highlight-item');
    highlightItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const title = item.querySelector('span').textContent;
            console.log('Highlight item clicked:', title);
            openModal(title);
        });
    });
    
    // Steps list items
    const stepsListItems = document.querySelectorAll('.steps-list li');
    stepsListItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const strongElement = item.querySelector('strong');
            if (strongElement) {
                const title = strongElement.textContent.replace(':', '');
                console.log('Steps list item clicked:', title);
                openModal(title);
            }
        });
    });
    
    // Bullet list items
    const bulletListItems = document.querySelectorAll('.bullet-list li');
    bulletListItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const strongElement = item.querySelector('strong');
            if (strongElement) {
                const title = strongElement.textContent;
                console.log('Bullet list item clicked:', title);
                openModal(title);
            }
        });
    });
    
    // Modal close functionality
    const modal = document.getElementById('cardModal');
    const closeBtn = document.querySelector('.modal-close');
    
    closeBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});

// Initialize stats dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initStatsDashboard();
});

console.log('Nexio main.js loaded successfully!');
