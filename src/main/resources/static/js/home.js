document.addEventListener('DOMContentLoaded', function () {
    const itemGrid = document.getElementById('itemsGrid');
    const itemCards = itemGrid ? itemGrid.querySelectorAll('.item-card') : [];
    const resultsCountSpan = document.getElementById('resultsCount');

    const mainSearchInput = document.getElementById('mainSearchInput');
    const mainSearchBtn = document.getElementById('mainSearchBtn');

    const categoryFilterButtons = document.querySelectorAll('#categoryFilterButtons .filter-btn');
    const conditionFilterButtons = document.querySelectorAll('#conditionFilterButtons .filter-btn');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const locationFilter = document.getElementById('locationFilter');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const sortSelect = document.getElementById('sortSelect');

    let activeCategoryFilter = 'all';
    let activeConditionFilter = 'all';
    let currentSearchTerm = '';
    let currentSortOrder = 'newest';

    // Initial setup for search input
    mainSearchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            applyFiltersAndSort();
        }
    });

    mainSearchBtn.addEventListener('click', applyFiltersAndSort);

    // Category filter event listeners
    categoryFilterButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryFilterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            activeCategoryFilter = this.dataset.filter;
            applyFiltersAndSort();
        });
    });

    // Condition filter event listeners
    conditionFilterButtons.forEach(button => {
        button.addEventListener('click', function() {
            conditionFilterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            activeConditionFilter = this.dataset.filter;
            applyFiltersAndSort();
        });
    });

    // Price filter event listeners
    minPriceInput.addEventListener('input', applyFiltersAndSort);
    maxPriceInput.addEventListener('input', applyFiltersAndSort);

    // Location filter event listener
    locationFilter.addEventListener('change', applyFiltersAndSort);

    // Sort select event listener
    sortSelect.addEventListener('change', function() {
        currentSortOrder = this.value;
        applyFiltersAndSort();
    });

    // Clear filters event listener
    clearFiltersBtn.addEventListener('click', function() {
        mainSearchInput.value = '';
        minPriceInput.value = '';
        maxPriceInput.value = '';
        locationFilter.value = 'all';
        sortSelect.value = 'newest';

        categoryFilterButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('#categoryFilterButtons .filter-btn[data-filter="all"]').classList.add('active');
        activeCategoryFilter = 'all';

        conditionFilterButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('#conditionFilterButtons .filter-btn[data-filter="all"]').classList.add('active');
        activeConditionFilter = 'all';

        applyFiltersAndSort();
    });


    function applyFiltersAndSort() {
        currentSearchTerm = mainSearchInput.value.toLowerCase();
        const minPrice = parseFloat(minPriceInput.value) || 0;
        const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
        const selectedLocation = locationFilter.value;

        let visibleItems = [];

        itemCards.forEach(card => {
            const category = card.dataset.category;
            const condition = card.dataset.condition;
            const price = parseFloat(card.dataset.price);
            const location = card.dataset.location;
            const title = card.dataset.title.toLowerCase();
            const description = card.dataset.description.toLowerCase();

            let showCard = true;

            // Category filter
            if (activeCategoryFilter !== 'all' && category !== activeCategoryFilter) {
                showCard = false;
            }

            // Condition filter
            if (activeConditionFilter !== 'all' && condition !== activeConditionFilter) {
                showCard = false;
            }

            // Price filter
            if (price < minPrice || price > maxPrice) {
                showCard = false;
            }

            // Location filter
            if (selectedLocation !== 'all' && location !== selectedLocation) {
                showCard = false;
            }

            // Search filter
            if (currentSearchTerm && !title.includes(currentSearchTerm) && !description.includes(currentSearchTerm)) {
                showCard = false;
            }

            if (showCard) {
                card.style.display = '';
                visibleItems.push(card);
            } else {
                card.style.display = 'none';
            }
        });

        // Sort visible items
        sortItems(visibleItems, currentSortOrder);

        // Update results count
        resultsCountSpan.textContent = visibleItems.length;

        // Show/hide empty state message
        const emptyState = document.getElementById('emptyState');
        const emptyStateMessage = document.getElementById('emptyStateMessage');
        
        if (emptyState && emptyStateMessage) {
            const hasActiveFilters = activeCategoryFilter !== 'all' || 
                                     activeConditionFilter !== 'all' || 
                                     minPrice > 0 || 
                                     maxPriceInput.value !== '' || 
                                     selectedLocation !== 'all' || 
                                     currentSearchTerm !== '';
            
        if (visibleItems.length === 0) {
                emptyState.style.display = 'flex';
                // Update message based on whether filters are applied
                if (hasActiveFilters) {
                    emptyStateMessage.textContent = 'No items match your current filters. Try adjusting your search criteria.';
                } else {
                    emptyStateMessage.textContent = 'There are currently no items available.';
                }
        } else {
            emptyState.style.display = 'none';
            }
        }
    }

    function sortItems(items, order) {
        items.sort((a, b) => {
            const priceA = parseFloat(a.dataset.price);
            const priceB = parseFloat(b.dataset.price);
            const dateA = new Date(a.dataset.createdat);
            const dateB = new Date(b.dataset.createdat);

            switch (order) {
                case 'newest':
                    return dateB - dateA;
                case 'oldest':
                    return dateA - dateB;
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'popular':
                    // Assuming popularity can be determined by some other data attribute,
                    // for now, we'll just keep the existing order if no popularity data.
                    return 0;
                default:
                    return 0;
            }
        });

        // Re-append sorted items to the grid
        if (itemGrid) {
        items.forEach(item => itemGrid.appendChild(item));
        }
    }

    // Initial apply of filters and sort on page load to set counts and visibility correctly
    applyFiltersAndSort();

    // Profile Completion Modal Logic
    const profileCompletionModal = document.getElementById('profileCompletionModal');
    const closeButton = profileCompletionModal ? profileCompletionModal.querySelector('.close-button') : null;

    if (profileCompletionModal && profileCompletionModal.getAttribute('data-th-if') === 'true') {
        profileCompletionModal.style.display = 'flex';
    }

    if (closeButton) {
        closeButton.addEventListener('click', function() {
            profileCompletionModal.style.display = 'none';
        });
    }

    // Close modal if user clicks outside of it
    window.addEventListener('click', function(event) {
        if (event.target === profileCompletionModal) {
            profileCompletionModal.style.display = 'none';
        }
    });

});
