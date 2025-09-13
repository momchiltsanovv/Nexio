// Wishlist page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Remove no-js class to enable animations
    document.documentElement.classList.remove('no-js');
    
    // Initialize wishlist
    initializeWishlist();
    
    // Set up event listeners
    setupEventListeners();
    
    // Update stats
    updateStats();
    
    // Update filter counts
    updateFilterCounts();
    
    // Initialize scroll reveal animations
    initializeScrollReveal();
    
    // Override navbar background changes to keep it dark
    overrideNavbarBackground();
    
    console.log('Wishlist page initialized successfully!');
});

// Wishlist data management
let wishlistData = {
    items: [],
    filters: {
        category: 'all',
        sortBy: 'date-added',
        view: 'grid'
    }
};

// Initialize wishlist with sample data
function initializeWishlist() {
    // Load wishlist from localStorage or use sample data
    const savedWishlist = localStorage.getItem('wishlistItems');
    if (savedWishlist) {
        try {
            wishlistData.items = JSON.parse(savedWishlist);
        } catch (e) {
            console.error('Error loading wishlist:', e);
            wishlistData.items = getSampleWishlistData();
        }
    } else {
        wishlistData.items = getSampleWishlistData();
    }
    
    // Render wishlist items
    renderWishlistItems();
}

// Get sample wishlist data
function getSampleWishlistData() {
    return [
        {
            id: 1,
            title: "Calculus: Early Transcendentals",
            description: "Used textbook in good condition, 8th edition",
            price: 45,
            condition: "Good",
            category: "textbooks",
            dateAdded: "2024-01-15",
            emoji: "📚",
            badge: "Textbook"
        },
        {
            id: 2,
            title: "MacBook Air M1",
            description: "2020 MacBook Air, 8GB RAM, 256GB SSD",
            price: 120,
            condition: "Excellent",
            category: "electronics",
            dateAdded: "2024-01-14",
            emoji: "💻",
            badge: "Electronics"
        },
        {
            id: 3,
            title: "Office Chair",
            description: "Ergonomic office chair, adjustable height",
            price: 80,
            condition: "Very Good",
            category: "furniture",
            dateAdded: "2024-01-13",
            emoji: "🪑",
            badge: "Furniture"
        },
        {
            id: 4,
            title: "University Hoodie",
            description: "Official university hoodie, size M",
            price: 25,
            condition: "Good",
            category: "clothing",
            dateAdded: "2024-01-12",
            emoji: "👕",
            badge: "Clothing"
        },
        {
            id: 5,
            title: "Introduction to Psychology",
            description: "Psychology textbook, 12th edition, like new",
            price: 35,
            condition: "Like New",
            category: "textbooks",
            dateAdded: "2024-01-11",
            emoji: "📖",
            badge: "Textbook"
        },
        {
            id: 6,
            title: "Sony WH-1000XM4 Headphones",
            description: "Noise-canceling wireless headphones, excellent condition",
            price: 65,
            condition: "Excellent",
            category: "electronics",
            dateAdded: "2024-01-10",
            emoji: "🎧",
            badge: "Electronics"
        },
        {
            id: 7,
            title: "IKEA Desk Lamp",
            description: "Modern LED desk lamp with adjustable brightness",
            price: 120,
            condition: "Very Good",
            category: "furniture",
            dateAdded: "2024-01-09",
            emoji: "🛏️",
            badge: "Furniture"
        },
        {
            id: 8,
            title: "Nike Air Force 1",
            description: "White sneakers, size 9, worn twice",
            price: 18,
            condition: "Like New",
            category: "clothing",
            dateAdded: "2024-01-08",
            emoji: "👟",
            badge: "Clothing"
        },
        {
            id: 9,
            title: "Statistics and Data Analysis",
            description: "Advanced statistics textbook with practice problems",
            price: 55,
            condition: "Good",
            category: "textbooks",
            dateAdded: "2024-01-07",
            emoji: "📊",
            badge: "Textbook"
        },
        {
            id: 10,
            title: "iPhone 12 Case",
            description: "Clear protective case with MagSafe compatibility",
            price: 40,
            condition: "New",
            category: "electronics",
            dateAdded: "2024-01-06",
            emoji: "📱",
            badge: "Electronics"
        }
    ];
}

// Set up event listeners
function setupEventListeners() {
    
    // Navigation options dropdown toggle
    const navOptionsBtn = document.getElementById('navOptionsBtn');
    const navOptionsDropdown = document.getElementById('navOptionsDropdown');
    
    if (navOptionsBtn && navOptionsDropdown) {
        navOptionsBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            navOptionsDropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!navOptionsBtn.contains(e.target) && !navOptionsDropdown.contains(e.target)) {
                navOptionsDropdown.classList.remove('active');
            }
        });
        
        // Close dropdown when clicking on a link
        const navOptionLinks = navOptionsDropdown.querySelectorAll('.nav-option-link');
        navOptionLinks.forEach(link => {
            link.addEventListener('click', function() {
                navOptionsDropdown.classList.remove('active');
            });
        });
    }
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            setActiveFilter(filter);
            applyFilters();
        });
    });
    
    // Sort select
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            wishlistData.filters.sortBy = this.value;
            applyFilters();
        });
    }
    
    // View toggle buttons
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            setActiveView(view);
        });
    });
    
    // Remove item buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-btn')) {
            const itemElement = e.target.closest('.wishlist-item');
            const itemId = parseInt(itemElement.getAttribute('data-id'));
            removeFromWishlist(itemId);
        }
    });
    
    // View details buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-primary') && e.target.textContent.includes('View Details')) {
            const itemElement = e.target.closest('.wishlist-item');
            const itemId = parseInt(itemElement.getAttribute('data-id'));
            viewItemDetails(itemId);
        }
    });
}

// Set active filter
function setActiveFilter(filter) {
    // Update filter state
    wishlistData.filters.category = filter;
    
    // Update UI
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('active');
        }
    });
}

// Set active view
function setActiveView(view) {
    // Update view state
    wishlistData.filters.view = view;
    
    // Update UI
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-view') === view) {
            btn.classList.add('active');
        }
    });
    
    // Update grid layout
    const wishlistGrid = document.getElementById('wishlistGrid');
    if (wishlistGrid) {
        if (view === 'list') {
            wishlistGrid.classList.add('list-view');
        } else {
            wishlistGrid.classList.remove('list-view');
        }
    }
}

// Apply filters and sorting
function applyFilters() {
    let filteredItems = [...wishlistData.items];
    
    // Filter by category
    if (wishlistData.filters.category !== 'all') {
        filteredItems = filteredItems.filter(item => item.category === wishlistData.filters.category);
    }
    
    // Sort items
    switch (wishlistData.filters.sortBy) {
        case 'date-added':
            filteredItems.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            break;
        case 'price-low':
            filteredItems.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredItems.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredItems.sort((a, b) => a.title.localeCompare(b.title));
            break;
    }
    
    // Render filtered items
    renderWishlistItems(filteredItems);
}

// Render wishlist items
function renderWishlistItems(items = null) {
    const itemsToRender = items || wishlistData.items;
    const wishlistGrid = document.getElementById('wishlistGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (!wishlistGrid) return;
    
    // Clear existing items
    wishlistGrid.innerHTML = '';
    
    if (itemsToRender.length === 0) {
        // Show empty state
        if (emptyState) {
            emptyState.style.display = 'block';
        }
        return;
    }
    
    // Hide empty state
    if (emptyState) {
        emptyState.style.display = 'none';
    }
    
    // Render items
    itemsToRender.forEach(item => {
        const itemElement = createWishlistItemElement(item);
        wishlistGrid.appendChild(itemElement);
    });
}

// Create wishlist item element
function createWishlistItemElement(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'wishlist-item';
    itemDiv.setAttribute('data-id', item.id);
    itemDiv.setAttribute('data-category', item.category);
    itemDiv.setAttribute('data-price', item.price);
    itemDiv.setAttribute('data-date', item.dateAdded);
    
    itemDiv.innerHTML = `
        <div class="item-image">
            <div class="item-emoji">${item.emoji}</div>
            <div class="item-badge">${item.badge}</div>
        </div>
        <div class="item-content">
            <h3 class="item-title">${item.title}</h3>
            <p class="item-description">${item.description}</p>
            <div class="item-meta">
                <span class="item-price">$${item.price}</span>
                <span class="item-condition">${item.condition}</span>
            </div>
            <div class="item-actions">
                <button class="btn btn-primary btn-sm">View Details</button>
                <button class="btn btn-outline btn-sm remove-btn">Remove</button>
            </div>
        </div>
    `;
    
    return itemDiv;
}

// Remove item from wishlist
function removeFromWishlist(itemId) {
    // Find item index
    const itemIndex = wishlistData.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;
    
    // Get item for confirmation
    const item = wishlistData.items[itemIndex];
    
    // Show confirmation
    if (confirm(`Remove "${item.title}" from your wishlist?`)) {
        // Remove item
        wishlistData.items.splice(itemIndex, 1);
        
        // Save to localStorage
        localStorage.setItem('wishlistItems', JSON.stringify(wishlistData.items));
        
        // Update UI
        applyFilters();
        updateStats();
        updateFilterCounts();
        
        // Show toast
        showToast(`"${item.title}" removed from wishlist`, 'success');
    }
}

// View item details
function viewItemDetails(itemId) {
    const item = wishlistData.items.find(item => item.id === itemId);
    if (!item) return;
    
    // For now, just show an alert
    // In a real app, this would open a modal or navigate to item details
    alert(`Viewing details for: ${item.title}\n\nPrice: $${item.price}\nCondition: ${item.condition}\nCategory: ${item.category}\nDate Added: ${new Date(item.dateAdded).toLocaleDateString()}`);
}

// Update stats
function updateStats() {
    const totalItems = wishlistData.items.length;
    const totalValue = wishlistData.items.reduce((sum, item) => sum + item.price, 0);
    
    // Update total items
    const totalItemsElement = document.getElementById('total-items');
    if (totalItemsElement) {
        totalItemsElement.textContent = totalItems;
    }
    
    // Update total value
    const totalValueElement = document.getElementById('total-value');
    if (totalValueElement) {
        totalValueElement.textContent = `$${totalValue}`;
    }
}

// Update filter counts
function updateFilterCounts() {
    const categories = ['all', 'textbooks', 'electronics', 'furniture', 'clothing'];
    
    categories.forEach(category => {
        const countElement = document.getElementById(`count-${category}`);
        if (countElement) {
            let count;
            if (category === 'all') {
                count = wishlistData.items.length;
            } else {
                count = wishlistData.items.filter(item => item.category === category).length;
            }
            countElement.textContent = count;
        }
    });
}

// Share wishlist
function shareWishlist() {
    const totalItems = wishlistData.items.length;
    const totalValue = wishlistData.items.reduce((sum, item) => sum + item.price, 0);
    
    const shareText = `Check out my wishlist on Nexio! I have ${totalItems} items worth $${totalValue} total.`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Nexio Wishlist',
            text: shareText,
            url: window.location.href
        }).catch(err => {
            console.log('Error sharing:', err);
            fallbackShare(shareText);
        });
    } else {
        fallbackShare(shareText);
    }
}

// Fallback share method
function fallbackShare(text) {
    // Copy to clipboard
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Wishlist copied to clipboard!', 'success');
        }).catch(() => {
            showToast('Unable to share wishlist', 'error');
        });
    } else {
        showToast('Sharing not supported on this device', 'error');
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

// Add item to wishlist (for use from other pages)
function addToWishlist(item) {
    // Check if item already exists
    const existingItem = wishlistData.items.find(existing => existing.id === item.id);
    if (existingItem) {
        showToast('Item already in wishlist', 'error');
        return;
    }
    
    // Add item
    wishlistData.items.push(item);
    
    // Save to localStorage
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistData.items));
    
    // Update UI if on wishlist page
    if (document.getElementById('wishlistGrid')) {
        applyFilters();
        updateStats();
        updateFilterCounts();
    }
    
    showToast('Item added to wishlist!', 'success');
}

// Remove item from wishlist (for use from other pages)
function removeFromWishlistById(itemId) {
    const itemIndex = wishlistData.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;
    
    wishlistData.items.splice(itemIndex, 1);
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistData.items));
    
    // Update UI if on wishlist page
    if (document.getElementById('wishlistGrid')) {
        applyFilters();
        updateStats();
        updateFilterCounts();
    }
}

// Check if item is in wishlist
function isInWishlist(itemId) {
    return wishlistData.items.some(item => item.id === itemId);
}

// Get wishlist count
function getWishlistCount() {
    return wishlistData.items.length;
}

// Export functions for use in other pages
window.addToWishlist = addToWishlist;
window.removeFromWishlistById = removeFromWishlistById;
window.isInWishlist = isInWishlist;
window.getWishlistCount = getWishlistCount;
window.shareWishlist = shareWishlist;

// Search functionality
function searchWishlist(searchTerm) {
    const filteredItems = wishlistData.items.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    renderWishlistItems(filteredItems);
}

// Clear all filters
function clearAllFilters() {
    wishlistData.filters.category = 'all';
    wishlistData.filters.sortBy = 'date-added';
    
    // Update UI
    setActiveFilter('all');
    
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.value = 'date-added';
    }
    
    // Reapply filters
    applyFilters();
}

// Export additional functions
window.searchWishlist = searchWishlist;
window.clearAllFilters = clearAllFilters;

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to focus search (if search exists)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="search"]');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape to clear filters
    if (e.key === 'Escape') {
        clearAllFilters();
    }
});

// Auto-save wishlist changes
function autoSaveWishlist() {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistData.items));
}

// Set up auto-save
setInterval(autoSaveWishlist, 30000); // Auto-save every 30 seconds

// Handle page visibility change
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // Page became visible, refresh data
        const savedWishlist = localStorage.getItem('wishlistItems');
        if (savedWishlist) {
            try {
                const newItems = JSON.parse(savedWishlist);
                if (JSON.stringify(newItems) !== JSON.stringify(wishlistData.items)) {
                    wishlistData.items = newItems;
                    applyFilters();
                    updateStats();
                    updateFilterCounts();
                }
            } catch (e) {
                console.error('Error refreshing wishlist:', e);
            }
        }
    }
});

// Initialize scroll reveal animations
function initializeScrollReveal() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // If user prefers reduced motion, show all elements immediately
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
            el.classList.add('active');
        });
        return;
    }
    
    const revealObserverOptions = { 
        threshold: 0.1, 
        rootMargin: '0px 0px -50px 0px' 
    };
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Unobserve after animation to prevent re-triggering
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);
    
    // Observe all reveal elements
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
        revealObserver.observe(el);
    });
}

// Override navbar background to keep it dark
function overrideNavbarBackground() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    // Set initial dark background
    navbar.style.background = 'rgba(33, 35, 70, 0.95)';
    navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.2)';
    
    // Override any scroll-based background changes
    let ticking = false;
    
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
    
    // Also override any existing scroll handlers by redefining them
    const originalUpdateNavbar = window.updateNavbar;
    if (originalUpdateNavbar) {
        window.updateNavbar = updateNavbar;
    }
}

console.log('Wishlist functionality loaded successfully!');
