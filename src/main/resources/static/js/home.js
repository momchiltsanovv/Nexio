// Complete home page functionality with working dropdown menus
document.addEventListener('DOMContentLoaded', function() {
    // Remove no-js class to enable animations
    document.documentElement.classList.remove('no-js');

    // Filter state management
    let currentFilters = {
        category: '',
        condition: '',
        minPrice: '',
        maxPrice: '',
        sortBy: 'newest',
        location: '',
        quickFilter: 'all'
    };

    // Initialize filter select elements
    function initializeFilterSelects() {
        const filterSelects = document.querySelectorAll('.filter-select');
        
        filterSelects.forEach(select => {
            select.addEventListener('change', function() {
                const value = this.value;
                const selectId = this.id;
                
                // Update filter based on select ID
                updateFilterValue(selectId, value);
                
                // Apply filters immediately
                filterProducts();
            });
        });
    }
    
    
    // Update filter value based on dropdown ID
    function updateFilterValue(selectId, value) {
        console.log(`Updating filter: ${selectId} = ${value}`);
        switch(selectId) {
            case 'categorySelect':
                currentFilters.category = value;
                break;
            case 'conditionSelect':
                currentFilters.condition = value;
                break;
            case 'sortSelect':
                currentFilters.sortBy = value;
                break;
            case 'locationSelect':
                currentFilters.location = value;
                break;
        }
        console.log('Current filters:', currentFilters);
    }
    

    // Filter toggle functionality
    function toggleFilterSection() {
        console.log('Filter button clicked!');
        const filters = document.getElementById('advancedFilters');
        const button = document.getElementById('filterToggle');
        
        if (filters && button) {
            if (filters.style.display === 'none' || filters.style.display === '') {
                filters.style.display = 'block';
                button.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"/>
                    </svg>
                    Hide Filters`;
                console.log('Filters shown');
            } else {
                filters.style.display = 'none';
                button.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"/>
                    </svg>
                    Filters`;
                console.log('Filters hidden');
            }
        } else {
            console.error('Filter elements not found!');
        }
    }

    // Add event listener to filter toggle button
    const filterToggle = document.getElementById('filterToggle');
    if (filterToggle) {
        filterToggle.addEventListener('click', toggleFilterSection);
    }

    
    


    // Filter products based on search and filters
    function filterProducts() {
        const searchInput = document.getElementById('searchInput');
        const productCards = document.querySelectorAll('.product-card');
        
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const category = currentFilters.category || '';
        const condition = currentFilters.condition || '';
        const minPrice = parseFloat(document.getElementById('minPrice')?.value) || 0;
        const maxPrice = parseFloat(document.getElementById('maxPrice')?.value) || Infinity;
        const sortBy = currentFilters.sortBy || 'newest';
        const location = currentFilters.location || '';

        console.log('Filtering with:', {
            searchTerm, category, condition, minPrice, maxPrice, sortBy, location
        });

        // Show/hide showcase section based on search
        const showcaseSection = document.querySelector('.showcase-section');
        if (showcaseSection) {
            if (searchTerm !== '') {
                showcaseSection.style.display = 'none';
            } else {
                showcaseSection.style.display = 'block';
            }
        }

        let visibleProducts = [];

        productCards.forEach(card => {
            const productName = card.querySelector('.product-name')?.textContent.toLowerCase() || '';
            const productBrand = card.querySelector('.product-brand')?.textContent.toLowerCase() || '';
            const productPriceText = card.querySelector('.product-price')?.textContent.replace('$', '') || '0';
            const productPrice = parseFloat(productPriceText);
            
            // Search filter
            const matchesSearch = searchTerm === '' || 
                productName.includes(searchTerm) || 
                productBrand.includes(searchTerm);

            // Price filter
            const matchesPrice = productPrice >= minPrice && productPrice <= maxPrice;

            // Filter by category
            const productCategory = card.getAttribute('data-category') || '';
            const matchesCategory = category === '' || productCategory === category;
            
            // Filter by condition
            const productCondition = card.getAttribute('data-condition') || '';
            const matchesCondition = condition === '' || productCondition === condition;
            
            // Filter by location
            const productLocation = card.getAttribute('data-location') || '';
            const matchesLocation = location === '' || productLocation === location;

            if (matchesSearch && matchesPrice && matchesCategory && matchesCondition && matchesLocation) {
                card.style.display = 'block';
                visibleProducts.push(card);
            } else {
                card.style.display = 'none';
            }
        });

        console.log(`Filtered products: ${visibleProducts.length} visible out of ${productCards.length} total`);

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
            if (productsGrid) {
                visibleProducts.forEach(product => {
                    productsGrid.appendChild(product);
                });
            }
        }
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
                color: #ffffff;
                font-size: 18px;
                background: var(--surface-elevated);
                backdrop-filter: blur(20px);
                border-radius: var(--radius-xl);
                border: 1px solid var(--border);
                box-shadow: var(--shadow);
            `;
            noResultsMsg.innerHTML = `
                <div style="font-size: 48px; margin-bottom: 16px;">🔍</div>
                <h3 style="margin: 0 0 8px 0; color: #ffffff; font-weight: 700;">No results found</h3>
                <p style="margin: 0; color: rgba(255, 255, 255, 0.8);">No products match "${searchTerm}". Try a different search term.</p>
            `;
            if (productsGrid) {
                productsGrid.appendChild(noResultsMsg);
            }
        }
    }

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterProducts, 300));
    }

    // Price input filtering
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    if (minPriceInput) {
        minPriceInput.addEventListener('input', debounce(filterProducts, 300));
    }
    if (maxPriceInput) {
        maxPriceInput.addEventListener('input', debounce(filterProducts, 300));
    }

    // Clear all filters functionality
    const clearFilters = document.getElementById('clearFilters');
    if (clearFilters) {
        clearFilters.addEventListener('click', function() {
            // Reset all filter inputs
            if (minPriceInput) minPriceInput.value = '';
            if (maxPriceInput) maxPriceInput.value = '';
            if (searchInput) searchInput.value = '';
            
            // Reset select elements
            const categorySelect = document.getElementById('categorySelect');
            const conditionSelect = document.getElementById('conditionSelect');
            const sortSelect = document.getElementById('sortSelect');
            const locationSelect = document.getElementById('locationSelect');
            
            if (categorySelect) categorySelect.value = '';
            if (conditionSelect) conditionSelect.value = '';
            if (sortSelect) sortSelect.value = 'newest';
            if (locationSelect) locationSelect.value = '';
            
            // Reset filter state
            currentFilters = {
                category: '',
                condition: '',
                minPrice: '',
                maxPrice: '',
                sortBy: 'newest',
                location: ''
            };
            
            // Show all products
            const productCards = document.querySelectorAll('.product-card');
            productCards.forEach(card => {
                card.style.display = 'block';
            });

            // Remove no results message
            const noResultsMsg = document.getElementById('no-results-message');
            if (noResultsMsg) {
                noResultsMsg.remove();
            }
        });
    }
    
    // Apply filters functionality
    const applyFilters = document.getElementById('applyFilters');
    if (applyFilters) {
        applyFilters.addEventListener('click', function() {
            filterProducts();
        });
    }

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

    // Wishlist functionality
    const wishlistIcons = document.querySelectorAll('.wishlist-icon');
    wishlistIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Prevent card click from triggering
            
            this.classList.toggle('active');
            
            if (this.classList.contains('active')) {
                console.log('Added to wishlist');
            } else {
                console.log('Removed from wishlist');
            }
        });
    });

    // Product card click functionality
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't navigate if wishlist icon was clicked
            if (e.target.closest('.wishlist-icon')) {
                return;
            }
            
            // Get product details for navigation
            const productTitle = this.querySelector('.item-title')?.textContent || 'Unknown Item';
            const productCategory = this.getAttribute('data-category') || 'electronics';
            
            // For now, simulate navigation with a placeholder item ID
            // In a real app, you'd get the actual item ID from the card data
            const itemId = generatePlaceholderItemId(productTitle, productCategory);
            
            console.log(`Navigating to item: ${productTitle} (ID: ${itemId})`);
            
            // Navigate to item view page
            window.location.href = `/item/${itemId}`;
        });
        
        // Add hover effect to indicate clickability
        card.style.cursor = 'pointer';
    });

    // Generate a placeholder item ID based on product info
    function generatePlaceholderItemId(title, category) {
        // Create a simple hash-like ID for demo purposes
        // In production, this would come from your database
        const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '');
        const categoryPrefix = category.slice(0, 3);
        const hash = cleanTitle.slice(0, 8);
        return `${categoryPrefix}-${hash}-${Math.random().toString(36).substr(2, 4)}`;
    }

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
            
            const counter = document.querySelector('.slider-counter');
            if (counter) {
                counter.textContent = `${currentSlide}/${totalSlides}`;
            }
        });
    });

    // Navbar button functionality
    const wishlistBtn = document.getElementById('wishlistBtn');
    const profileBtn = document.getElementById('profileBtn');

    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
            console.log('Wishlist button clicked');
        });
    }

    if (profileBtn) {
        profileBtn.addEventListener('click', function() {
            console.log('Profile button clicked');
        });
    }

    // Initialize all dropdowns
    initializeFilterSelects();
    
    // Navigation Options Button functionality
    const navOptionsBtn = document.getElementById('navOptionsBtn');
    const navOptionsDropdown = document.getElementById('navOptionsDropdown');
    
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

    // Make functions available globally
    window.toggleFilterSection = toggleFilterSection;
    window.filterProducts = filterProducts;
    
    console.log('Home page initialized with working dropdowns!');
});
