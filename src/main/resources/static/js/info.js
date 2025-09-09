// Tab switching functionality
function showTab(tabName) {
    // Hide all content sections
    document.getElementById('about-content').style.display = 'none';
    document.getElementById('faq-content').style.display = 'none';

    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected content and activate tab
    if (tabName === 'about') {
        document.getElementById('about-content').style.display = 'block';
        document.querySelector('.tab-btn:first-child').classList.add('active');
    } else if (tabName === 'faq') {
        document.getElementById('faq-content').style.display = 'block';
        document.querySelector('.tab-btn:last-child').classList.add('active');
    }
}

// FAQ toggle functionality
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');

    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });

    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all links with href starting with #
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

    // Initialize with About Us tab active
    showTab('about');
});

// Add loading animation to buttons
function addLoadingState(button, text = 'Loading...') {
    const originalText = button.textContent;
    button.textContent = text;
    button.disabled = true;

    return function removeLoadingState() {
        button.textContent = originalText;
        button.disabled = false;
    };
}

// Handle tab keyboard navigation
document.addEventListener('keydown', function(event) {
    if (event.key === 'Tab' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        const activeTab = document.querySelector('.tab-btn.active');
        const tabs = document.querySelectorAll('.tab-btn');
        const currentIndex = Array.from(tabs).indexOf(activeTab);

        if (event.key === 'ArrowLeft' && currentIndex > 0) {
            event.preventDefault();
            tabs[currentIndex - 1].click();
            tabs[currentIndex - 1].focus();
        } else if (event.key === 'ArrowRight' && currentIndex < tabs.length - 1) {
            event.preventDefault();
            tabs[currentIndex + 1].click();
            tabs[currentIndex + 1].focus();
        }
    }
});

// Add intersection observer for animations
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
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.feature-card, .team-member, .faq-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

console.log('Info page loaded successfully!');
