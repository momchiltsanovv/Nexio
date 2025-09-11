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
        availability: '',
        quickFilter: 'all'
    };

    // Initialize all custom dropdowns
    function initializeCustomDropdowns() {
        const customSelects = document.querySelectorAll('.custom-select');
        
        customSelects.forEach(select => {
            const button = select.querySelector('.select-button');
            const dropdown = select.querySelector('.select-dropdown');
            const textSpan = select.querySelector('.select-text');
            const options = select.querySelectorAll('.select-option');
            
            if (!button || !dropdown || !textSpan) return;
            
            // Toggle dropdown on button click
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Close other dropdowns
                closeAllDropdowns();
                
                // Toggle current dropdown
                const isActive = dropdown.classList.contains('active');
                if (!isActive) {
                    button.classList.add('active');
                    dropdown.classList.add('active');
                    select.classList.add('active');
                }
            });
            
            // Handle option selection
            options.forEach(option => {
                option.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const value = this.getAttribute('data-value');
                    const text = this.textContent;
                    
                    // Update selected option styling
                    options.forEach(opt => opt.classList.remove('selected'));
                    this.classList.add('selected');
                    
                    // Update button text
                    textSpan.textContent = text;
                    
                    // Close dropdown
                    button.classList.remove('active');
                    dropdown.classList.remove('active');
                    select.classList.remove('active');
                    
                    // Update filter based on select ID
                    updateFilterValue(select.id, value);
                    
                    // Apply filters immediately
                    filterProducts();
                });
            });
        });
    }
    
    // Close all dropdowns
    function closeAllDropdowns() {
        document.querySelectorAll('.custom-select').forEach(select => {
            const button = select.querySelector('.select-button');
            const dropdown = select.querySelector('.select-dropdown');
            if (button && dropdown) {
                button.classList.remove('active');
                dropdown.classList.remove('active');
                select.classList.remove('active');
            }
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
            case 'availabilitySelect':
                currentFilters.availability = value;
                break;
        }
        console.log('Current filters:', currentFilters);
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.custom-select')) {
            closeAllDropdowns();
        }
    });
    
    // Close dropdowns on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllDropdowns();
        }
    });

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

    // Quick Filter functionality
    const quickFilterBtns = document.querySelectorAll('.quick-filter-btn');
    quickFilterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            quickFilterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterType = this.getAttribute('data-filter');
            currentFilters.quickFilter = filterType;
            
            // Apply quick filter
            applyQuickFilter(filterType);
        });
    });
    
    // Apply quick filter based on type
    function applyQuickFilter(filterType) {
        // Reset advanced filters
        const minPrice = document.getElementById('minPrice');
        const maxPrice = document.getElementById('maxPrice');
        if (minPrice) minPrice.value = '';
        if (maxPrice) maxPrice.value = '';
        
        switch(filterType) {
            case 'all':
                // Reset all filters
                currentFilters = {
                    category: '',
                    condition: '',
                    minPrice: '',
                    maxPrice: '',
                    sortBy: 'newest',
                    location: '',
                    availability: '',
                    quickFilter: 'all'
                };
                // Reset custom dropdowns
                resetCustomSelect('categorySelect', 'All Categories');
                resetCustomSelect('conditionSelect', 'All Conditions');
                resetCustomSelect('locationSelect', 'All Locations');
                resetCustomSelect('availabilitySelect', 'All Items');
                break;
            case 'textbooks':
                currentFilters.category = 'textbooks';
                updateCustomSelect('categorySelect', 'textbooks', 'Textbooks');
                break;
            case 'electronics':
                currentFilters.category = 'electronics';
                updateCustomSelect('categorySelect', 'electronics', 'Electronics');
                break;
            case 'furniture':
                currentFilters.category = 'furniture';
                updateCustomSelect('categorySelect', 'furniture', 'Furniture');
                break;
            case 'clothing':
                currentFilters.category = 'clothing';
                updateCustomSelect('categorySelect', 'clothing', 'Clothing');
                break;
            case 'sports':
                currentFilters.category = 'sports';
                updateCustomSelect('categorySelect', 'sports', 'Sports');
                break;
            case 'under-50':
                currentFilters.maxPrice = '50';
                if (maxPrice) maxPrice.value = '50';
                break;
            case 'new-items':
                currentFilters.condition = 'new';
                updateCustomSelect('conditionSelect', 'new', 'New');
                break;
        }
        
        // Apply the filters
        filterProducts();
    }
    
    function updateCustomSelect(selectId, value, text) {
        const select = document.getElementById(selectId);
        if (!select) return;
        
        const button = select.querySelector('.select-button');
        const textSpan = button?.querySelector('.select-text');
        const dropdown = select.querySelector('.select-dropdown');
        
        // Update button text
        if (textSpan) {
            textSpan.textContent = text;
        }
        
        // Update selected option
        if (dropdown) {
            dropdown.querySelectorAll('.select-option').forEach(option => {
                option.classList.remove('selected');
            });
            const selectedOption = dropdown.querySelector(`[data-value="${value}"]`);
            if (selectedOption) {
                selectedOption.classList.add('selected');
            }
        }
    }

    // Reset dropdown to default value
    function resetCustomSelect(selectId, defaultText) {
        const select = document.getElementById(selectId);
        if (!select) return;
        
        const button = select.querySelector('.select-button');
        const textSpan = select.querySelector('.select-text');
        const dropdown = select.querySelector('.select-dropdown');
        const options = select.querySelectorAll('.select-option');
        
        // Reset button text
        if (textSpan) {
            textSpan.textContent = defaultText;
        }
        
        // Reset selected option
        options.forEach(option => option.classList.remove('selected'));
        const firstOption = select.querySelector('.select-option:first-child');
        if (firstOption) {
            firstOption.classList.add('selected');
        }
        
        // Close dropdown
        if (button && dropdown) {
            button.classList.remove('active');
            dropdown.classList.remove('active');
            select.classList.remove('active');
        }
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
        const availability = currentFilters.availability || '';

        console.log('Filtering with:', {
            searchTerm, category, condition, minPrice, maxPrice, sortBy, location, availability
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
            
            // Filter by availability
            const productAvailability = card.getAttribute('data-availability') || '';
            const matchesAvailability = availability === '' || productAvailability === availability;

            if (matchesSearch && matchesPrice && matchesCategory && matchesCondition && matchesLocation && matchesAvailability) {
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
            
            // Reset custom dropdowns
            resetCustomSelect('categorySelect', 'All Categories');
            resetCustomSelect('conditionSelect', 'All Conditions');
            resetCustomSelect('sortSelect', 'Newest First');
            resetCustomSelect('locationSelect', 'All Locations');
            resetCustomSelect('availabilitySelect', 'All Items');
            
            // Reset quick filter buttons
            quickFilterBtns.forEach(btn => btn.classList.remove('active'));
            const allItemsBtn = document.querySelector('[data-filter="all"]');
            if (allItemsBtn) allItemsBtn.classList.add('active');
            
            // Reset filter state
            currentFilters = {
                category: '',
                condition: '',
                minPrice: '',
                maxPrice: '',
                sortBy: 'newest',
                location: '',
                availability: '',
                quickFilter: 'all'
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
        icon.addEventListener('click', function() {
            this.classList.toggle('active');
            
            if (this.classList.contains('active')) {
                console.log('Added to wishlist');
            } else {
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
    initializeCustomDropdowns();
    
    // Make functions available globally
    window.toggleFilterSection = toggleFilterSection;
    window.filterProducts = filterProducts;
    
    console.log('Home page initialized with working dropdowns!');
});
