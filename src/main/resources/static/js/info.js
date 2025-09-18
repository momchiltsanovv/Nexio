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

    // Add click functionality to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const title = card.querySelector('h3').textContent;
            console.log('Feature card clicked:', title);
            showCardDetails(title, card);
        });
    });

    // Add click functionality to team member cards
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        member.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const name = member.querySelector('h3').textContent;
            const role = member.querySelector('p').textContent;
            console.log('Team member clicked:', name);
            showTeamMemberDetails(name, role, member);
        });
    });
});

// Function to show feature card details
function showCardDetails(title, card) {
    const description = card.querySelector('p').textContent;
    const icon = card.querySelector('.feature-icon').textContent;
    
    // Get modal elements
    const modal = document.getElementById('cardModal');
    const modalIcon = document.getElementById('modalIcon');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalFeatures = document.getElementById('modalFeatures');
    
    // Populate modal content
    modalIcon.innerHTML = icon;
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    
    // Add specific features based on the card type
    let features = [];
    switch(title) {
        case 'Student-Verified':
            features = [
                'University email verification required',
                'Campus community exclusivity',
                'Enhanced trust and safety',
                'Reduced fraud and scams'
            ];
            break;
        case 'Secure Transactions':
            features = [
                'Peer-to-peer verification system',
                'Safe payment processing',
                'Dispute resolution support',
                'Transaction monitoring'
            ];
            break;
        case 'Sustainable':
            features = [
                'Reduces campus waste',
                'Promotes circular economy',
                'Environmental consciousness',
                'Community sustainability'
            ];
            break;
        case 'Local Community':
            features = [
                'Campus-based connections',
                'Local meetup options',
                'Shared university experience',
                'Community building'
            ];
            break;
        default:
            features = [
                'Designed specifically for students',
                'Enhanced user experience',
                'Campus-focused features',
                'Student community benefits'
            ];
    }
    
    // Populate features
    modalFeatures.innerHTML = '';
    features.forEach(feature => {
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

// Function to show team member details
function showTeamMemberDetails(name, role, member) {
    // Get modal elements
    const modal = document.getElementById('cardModal');
    const modalIcon = document.getElementById('modalIcon');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalFeatures = document.getElementById('modalFeatures');
    
    // Get university info and image
    const university = member.querySelector('span').textContent;
    const memberImage = member.querySelector('.member-image');
    const imageSrc = memberImage ? memberImage.src : '';
    const imageAlt = memberImage ? memberImage.alt : name;
    
    // Populate modal content
    if (imageSrc) {
        modalIcon.innerHTML = `<img src="${imageSrc}" alt="${imageAlt}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;">`;
    } else {
        modalIcon.innerHTML = '👤'; // Fallback to default person icon
    }
    modalTitle.textContent = name;
    modalDescription.textContent = `${role} at ${university}`;
    
    // Add specific features based on the team member
    let features = [];
    switch(name) {
        case 'Momchil Tsanov':
            features = [
                'Co-Founder & CEO of Nexio',
                'Computer Science student at New Bulgarian University',
                'Leads product development and strategy',
                'Passionate about student entrepreneurship',
                'Focuses on technical innovation and user experience'
            ];
            break;
        case 'Daria Dian':
            features = [
                'Marketing Specialist at Nexio',
                'Student at New Bulgarian University',
                'Manages brand awareness and user acquisition',
                'Creates engaging marketing campaigns',
                'Builds community partnerships and outreach'
            ];
            break;
        case 'Teya Simova':
            features = [
                'Public Relations Specialist at Nexio',
                'Student at New Bulgarian University',
                'Handles media relations and communications',
                'Manages social media presence',
                'Coordinates events and community engagement'
            ];
            break;
        default:
            features = [
                'Part of the Nexio development team',
                'Passionate about student marketplace solutions',
                'Committed to creating the best user experience',
                'Dedicated to building a safe student community'
            ];
    }
    
    // Populate features
    modalFeatures.innerHTML = '';
    features.forEach(feature => {
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

// Function to close modal
function closeModal() {
    const modal = document.getElementById('cardModal');
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('cardModal');
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Mobile Navigation Dropdown functionality for info page
document.addEventListener('DOMContentLoaded', function() {
    // Navigation Options Button functionality
    const navOptionsBtn = document.getElementById('navOptionsBtn');
    const navOptionsDropdown = document.getElementById('navOptionsDropdown');
    const wishlistBtn = document.getElementById('wishlistBtn');
    const profileBtn = document.getElementById('profileBtn');
    
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
});

console.log('Info page loaded successfully!');
