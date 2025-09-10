// Simple interactivity for the home page
document.addEventListener('DOMContentLoaded', function() {
    // Remove no-js class to enable animations
    document.documentElement.classList.remove('no-js');

    // Wishlist functionality
    const wishlistIcons = document.querySelectorAll('.wishlist-icon');
    
    wishlistIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            this.classList.toggle('active');
            
            if (this.classList.contains('active')) {
                // Add to wishlist
                console.log('Added to wishlist');
            } else {
                // Remove from wishlist
                console.log('Removed from wishlist');
            }
        });
    });

    // Slider functionality
    const sliderArrows = document.querySelectorAll('.slider-arrow');
    let currentSlide = 1;
    const totalSlides = 5;
    
    sliderArrows.forEach(arrow => {
        arrow.addEventListener('click', function() {
            if (this.querySelector('polyline').getAttribute('points') === '15,18 9,12 15,6') {
                // Previous
                currentSlide = currentSlide > 1 ? currentSlide - 1 : totalSlides;
            } else {
                // Next
                currentSlide = currentSlide < totalSlides ? currentSlide + 1 : 1;
            }
            
            document.querySelector('.slider-counter').textContent = `${currentSlide}/${totalSlides}`;
        });
    });

    // Search and Filter functionality
    const searchInput = document.getElementById('searchInput');
    const filterToggle = document.getElementById('filterToggle');
    const advancedFilters = document.getElementById('advancedFilters');
    const clearFilters = document.getElementById('clearFilters');
    const applyFilters = document.getElementById('applyFilters');
    const productCards = document.querySelectorAll('.product-card');

    // Toggle advanced filters
    filterToggle.addEventListener('click', function() {
        advancedFilters.classList.toggle('active');
        const isActive = advancedFilters.classList.contains('active');
        this.innerHTML = isActive ? 
            `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"/>
            </svg>
            Hide Filters` :
            `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"/>
            </svg>
            Filters`;
    });

    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        filterProducts();
    });

    // Clear all filters
    clearFilters.addEventListener('click', function() {
        // Reset all filter inputs
        document.getElementById('categoryFilter').value = '';
        document.getElementById('conditionFilter').value = '';
        document.getElementById('minPrice').value = '';
        document.getElementById('maxPrice').value = '';
        document.getElementById('sortFilter').value = 'newest';
        document.getElementById('locationFilter').value = '';
        document.getElementById('availabilityFilter').value = '';
        searchInput.value = '';
        
        // Show all products
        productCards.forEach(card => {
            card.style.display = 'block';
        });
    });

    // Apply filters
    applyFilters.addEventListener('click', function() {
        filterProducts();
    });

    // Filter products based on search and filters
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const category = document.getElementById('categoryFilter').value;
        const condition = document.getElementById('conditionFilter').value;
        const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
        const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
        const sortBy = document.getElementById('sortFilter').value;
        const location = document.getElementById('locationFilter').value;
        const availability = document.getElementById('availabilityFilter').value;

        // Show/hide showcase section based on search
        const showcaseSection = document.querySelector('.showcase-section');
        if (searchTerm !== '') {
            showcaseSection.style.display = 'none';
        } else {
            showcaseSection.style.display = 'block';
        }

        let visibleProducts = [];

        productCards.forEach(card => {
            const productName = card.querySelector('.product-name').textContent.toLowerCase();
            const productBrand = card.querySelector('.product-brand').textContent.toLowerCase();
            const productPrice = parseFloat(card.querySelector('.product-price').textContent.replace('$', ''));
            
            // Search filter - if there's a search term, only show matching products
            const matchesSearch = searchTerm === '' || 
                productName.includes(searchTerm) || 
                productBrand.includes(searchTerm);

            // Price filter
            const matchesPrice = productPrice >= minPrice && productPrice <= maxPrice;

            // For demo purposes, we'll simulate other filters
            const matchesCategory = category === '' || Math.random() > 0.3; // Simulate category matching
            const matchesCondition = condition === '' || Math.random() > 0.3; // Simulate condition matching
            const matchesLocation = location === '' || Math.random() > 0.3; // Simulate location matching
            const matchesAvailability = availability === '' || Math.random() > 0.3; // Simulate availability matching

            if (matchesSearch && matchesPrice && matchesCategory && matchesCondition && matchesLocation && matchesAvailability) {
                card.style.display = 'block';
                visibleProducts.push(card);
            } else {
                card.style.display = 'none';
            }
        });

        // Show "No results found" message if search has no matches
        showNoResultsMessage(searchTerm, visibleProducts.length);

        // Sort products
        if (sortBy !== 'newest') {
            visibleProducts.sort((a, b) => {
                const priceA = parseFloat(a.querySelector('.product-price').textContent.replace('$', ''));
                const priceB = parseFloat(b.querySelector('.product-price').textContent.replace('$', ''));
                
                switch (sortBy) {
                    case 'price-low':
                        return priceA - priceB;
                    case 'price-high':
                        return priceB - priceA;
                    case 'popular':
                        return Math.random() - 0.5; // Simulate popularity
                    default:
                        return 0;
                }
            });

            // Reorder in DOM
            const productsGrid = document.querySelector('.products-grid');
            visibleProducts.forEach(product => {
                productsGrid.appendChild(product);
            });
        }
    }

    // Real-time search as user types
    searchInput.addEventListener('input', debounce(filterProducts, 300));

    // Debounce function to limit search frequency
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Show "No results found" message
    function showNoResultsMessage(searchTerm, visibleCount) {
        const productsGrid = document.querySelector('.products-grid');
        let noResultsMsg = document.getElementById('no-results-message');
        
        // Remove existing no results message
        if (noResultsMsg) {
            noResultsMsg.remove();
        }
        
        // If there's a search term but no visible products, show message
        if (searchTerm !== '' && visibleCount === 0) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.id = 'no-results-message';
            noResultsMsg.style.cssText = `
                grid-column: 1 / -1;
                text-align: center;
                padding: 60px 20px;
                color: var(--text-muted);
                font-size: 18px;
                background: var(--surface-light);
                border-radius: var(--radius-xl);
                border: 1px solid var(--border-light);
            `;
            noResultsMsg.innerHTML = `
                <div style="font-size: 48px; margin-bottom: 16px;">🔍</div>
                <h3 style="margin: 0 0 8px 0; color: var(--text-dark);">No results found</h3>
                <p style="margin: 0;">No products match "${searchTerm}". Try a different search term.</p>
            `;
            productsGrid.appendChild(noResultsMsg);
        }
    }

    // Navbar button functionality
    const wishlistBtn = document.getElementById('wishlistBtn');
    const profileBtn = document.getElementById('profileBtn');

    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
            // Toggle wishlist visibility or redirect to wishlist page
            console.log('Wishlist button clicked');
            // You can add wishlist functionality here
            // For example: window.location.href = '/wishlist';
        });
    }

    if (profileBtn) {
        profileBtn.addEventListener('click', function() {
            // Redirect to profile page
            console.log('Profile button clicked');
            // You can add profile functionality here
            // For example: window.location.href = '/profile';
        });
    }

    // Hero button functionality
    const startShoppingBtn = document.getElementById('startShoppingBtn');
    const sellItemBtn = document.getElementById('sellItemBtn');

    if (startShoppingBtn) {
        startShoppingBtn.addEventListener('click', function() {
            // Scroll to products section
            const productsSection = document.querySelector('.popular-section');
            if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    if (sellItemBtn) {
        sellItemBtn.addEventListener('click', function() {
            // Redirect to sell page or show sell modal
            console.log('Sell item button clicked');
            // You can add sell functionality here
            // For example: window.location.href = '/sell';
        });
    }

    // Enhanced floating card interactions
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

    // Search Autocomplete Implementation
    const searchInput = document.getElementById('searchInput');
    const searchSuggestions = document.getElementById('searchSuggestions');
    const suggestionsContent = document.getElementById('suggestionsContent');
    const clearRecentBtn = document.getElementById('clearRecent');

    // Sample search suggestions data
    const searchSuggestionsData = [
        { text: 'MacBook Pro', category: 'Electronics' },
        { text: 'iPhone 14', category: 'Electronics' },
        { text: 'Calculus Textbook', category: 'Books' },
        { text: 'AirPods Pro', category: 'Electronics' },
        { text: 'Gaming Chair', category: 'Furniture' },
        { text: 'Textbook', category: 'Books' },
        { text: 'Laptop', category: 'Electronics' },
        { text: 'Desk Lamp', category: 'Furniture' },
        { text: 'Study Table', category: 'Furniture' },
        { text: 'Wireless Mouse', category: 'Electronics' }
    ];

    // Get recent searches from localStorage
    function getRecentSearches() {
        return JSON.parse(localStorage.getItem('recentSearches') || '[]');
    }

    // Save search to recent searches
    function saveRecentSearch(searchTerm) {
        if (!searchTerm.trim()) return;
        
        let recentSearches = getRecentSearches();
        recentSearches = recentSearches.filter(term => term !== searchTerm);
        recentSearches.unshift(searchTerm);
        recentSearches = recentSearches.slice(0, 5); // Keep only last 5 searches
        
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }

    // Clear recent searches
    function clearRecentSearches() {
        localStorage.removeItem('recentSearches');
        showSuggestions('');
    }

    // Show search suggestions
    function showSuggestions(query) {
        const recentSearches = getRecentSearches();
        const filteredSuggestions = searchSuggestionsData.filter(item => 
            item.text.toLowerCase().includes(query.toLowerCase())
        );

        suggestionsContent.innerHTML = '';

        if (query.length === 0) {
            // Show recent searches when no query
            if (recentSearches.length > 0) {
                recentSearches.forEach(term => {
                    const suggestionItem = createSuggestionItem(term, 'Recent');
                    suggestionsContent.appendChild(suggestionItem);
                });
            } else {
                // Show popular searches
                searchSuggestionsData.slice(0, 5).forEach(item => {
                    const suggestionItem = createSuggestionItem(item.text, item.category);
                    suggestionsContent.appendChild(suggestionItem);
                });
            }
        } else {
            // Show filtered suggestions
            filteredSuggestions.forEach(item => {
                const suggestionItem = createSuggestionItem(item.text, item.category);
                suggestionsContent.appendChild(suggestionItem);
            });
        }

        searchSuggestions.classList.toggle('show', suggestionsContent.children.length > 0);
    }

    // Create suggestion item element
    function createSuggestionItem(text, category) {
        const item = document.createElement('button');
        item.className = 'suggestion-item';
        item.innerHTML = `
            <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <span class="suggestion-text">${text}</span>
            <span class="suggestion-category">${category}</span>
        `;
        
        item.addEventListener('click', () => {
            searchInput.value = text;
            searchSuggestions.classList.remove('show');
            saveRecentSearch(text);
            // Trigger search
            searchInput.dispatchEvent(new Event('input'));
        });
        
        return item;
    }

    // Search input event listeners
    searchInput.addEventListener('input', debounce((e) => {
        const query = e.target.value;
        showSuggestions(query);
    }, 300));

    searchInput.addEventListener('focus', () => {
        showSuggestions(searchInput.value);
    });

    searchInput.addEventListener('blur', (e) => {
        // Delay hiding to allow clicking on suggestions
        setTimeout(() => {
            searchSuggestions.classList.remove('show');
        }, 200);
    });

    // Clear recent searches
    clearRecentBtn.addEventListener('click', clearRecentSearches);

    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
            searchSuggestions.classList.remove('show');
        }
    });

    // Back to Top Button Implementation
    const backToTopBtn = document.getElementById('backToTop');

    function toggleBackToTop() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', debounce(toggleBackToTop, 100));

    // Loading States Implementation
    const loadingOverlay = document.getElementById('loadingOverlay');

    function showLoading(text = 'Loading...') {
        const loadingText = loadingOverlay.querySelector('.loading-text');
        loadingText.textContent = text;
        loadingOverlay.classList.add('show');
    }

    function hideLoading() {
        loadingOverlay.classList.remove('show');
    }

    // Add loading states to buttons
    function addLoadingToButton(button, duration = 2000) {
        button.classList.add('loading');
        button.disabled = true;
        
        setTimeout(() => {
            button.classList.remove('loading');
            button.disabled = false;
        }, duration);
    }

    // Add loading states to search
    function addLoadingToSearch() {
        searchInput.classList.add('loading');
        setTimeout(() => {
            searchInput.classList.remove('loading');
        }, 1000);
    }

    // Add loading states to product cards
    function addLoadingToProductCards() {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.classList.add('loading');
        });
        
        setTimeout(() => {
            productCards.forEach(card => {
                card.classList.remove('loading');
            });
        }, 1500);
    }

    // Simulate loading for demo purposes
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-hero')) {
            addLoadingToButton(e.target, 2000);
        }
        
        if (e.target.classList.contains('filter-toggle')) {
            addLoadingToSearch();
        }
    });

    // Global loading functions for external use
    window.showLoading = showLoading;
    window.hideLoading = hideLoading;
    window.addLoadingToButton = addLoadingToButton;
    window.addLoadingToSearch = addLoadingToSearch;
    window.addLoadingToProductCards = addLoadingToProductCards;
});
