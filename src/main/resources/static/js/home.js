// DOM Elements
let itemsGrid;
let searchInput;
let searchButton;
let sortSelect;
let activeFilters;
let resultsCount;
let loadingIndicator;
let noResults;
let pagination;

// State
let currentFilters = {
    search: '',
    categories: [],
    conditions: [],
    minPrice: null,
    maxPrice: null,
    location: '',
    sort: 'newest'
};

let currentPage = 1;
let itemsPerPage = 12;
let totalItems = 0;
let allItems = []; // Will be populated from DOM payload in home.html

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    initializeEventListeners();
    initializeMobileFilters();
    // Load any filters from URL now that elements exist
    loadFiltersFromURL();
    hydrateItemsFromDOM();
    loadItems();
    updateURL();
});

// Initialize DOM elements
function initializeElements() {
    itemsGrid = document.getElementById('itemsGrid');
    // IDs in template use mainSearchInput/mainSearchBtn
    searchInput = document.getElementById('mainSearchInput');
    searchButton = document.getElementById('mainSearchBtn');
    sortSelect = document.getElementById('sortSelect');
    activeFilters = document.getElementById('activeFilters');
    resultsCount = document.getElementById('resultsCount');
    loadingIndicator = document.getElementById('loadingIndicator');
    noResults = document.getElementById('noResults');
    pagination = document.getElementById('pagination');
}

// Read server-provided items from hidden DOM and map into JS objects
function hydrateItemsFromDOM() {
    const nodes = document.querySelectorAll('.item-card');
    allItems = Array.from(nodes).map(n => ({
        id: n.getAttribute('data-id'),
        title: n.getAttribute('data-title') || '',
        description: n.getAttribute('data-description') || '',
        price: parseFloat(n.getAttribute('data-price') || '0'),
        category: n.getAttribute('data-category') || '',
        condition: n.getAttribute('data-condition') || '',
        location: n.getAttribute('data-location') || '',
        imageUrl: n.getAttribute('data-imageurl') || '/images/defaults/no_image.webp',
        seller: {
            name: n.getAttribute('data-seller-name') || '',
            university: n.getAttribute('data-seller-uni') || '',
            avatar: n.getAttribute('data-seller-avatar') || '/images/defaults/default_pfp.jpg'
        },
        createdAt: n.getAttribute('data-createdat') || '1970-01-01',
        views: parseInt(n.getAttribute('data-views') || '0'),
        inWishlist: n.getAttribute('data-inwishlist') === 'true',
        featured: n.getAttribute('data-featured') === 'true'
    }));
}

// Initialize event listeners
function initializeEventListeners() {
    // Search functionality
    if (searchInput) searchInput.addEventListener('input', debounce(handleSearch, 300));
    if (searchButton) searchButton.addEventListener('click', handleSearch);

    // Sort functionality
    sortSelect.addEventListener('change', handleSort);

    // Filter functionality
    initializeFilterListeners();
    initializeFilterCollapsibles();

    // Force list view styling and skip toggle
    if (itemsGrid) itemsGrid.classList.add('list-view');

    // Pagination
    initializePagination();

    // Clear filters
    document.getElementById('clearFilters').addEventListener('click', clearAllFilters);

    // Mobile filters removed (filters always visible)

    // Navigation functionality
    initializeNavigation();

    // Wishlist functionality
    initializeWishlistButtons();
}

// Initialize filter listeners
function initializeFilterListeners() {
    // Category filters
    document.querySelectorAll('input[name="category"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateCategoryFilter(this.value, this.checked);
        });
    });

    // Condition filters
    document.querySelectorAll('input[name="condition"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateConditionFilter(this.value, this.checked);
        });
    });

    // University filters removed

    // Price filters
    document.getElementById('minPrice').addEventListener('input', debounce(updatePriceFilter, 500));
    document.getElementById('maxPrice').addEventListener('input', debounce(updatePriceFilter, 500));

    // Location filter
    document.getElementById('locationFilter').addEventListener('change', function() {
        updateLocationFilter(this.value);
    });
}

// Collapsible filter sections (dropdown-style)
function initializeFilterCollapsibles() {
    const sections = document.querySelectorAll('.filters-sidebar .filter-section');
    sections.forEach((section, index) => {
        const header = section.querySelector('h4');
        if (!header) return;

        // Determine content elements inside the section
        const optionBlocks = section.querySelectorAll('.filter-options, .price-range');
        const locationSelect = section.querySelector('.location-select');

        // By default: open the first section, collapse others
        const startOpen = index === 0; // keep Category open by default
        toggleSection(section, optionBlocks, locationSelect, startOpen);

        header.style.userSelect = 'none';
        header.addEventListener('click', () => {
            const isOpen = section.classList.contains('open');
            toggleSection(section, optionBlocks, locationSelect, !isOpen);
        });
    });
}

function toggleSection(section, optionBlocks, locationSelect, open) {
    if (open) {
        section.classList.add('open');
        optionBlocks.forEach(el => el && (el.style.display = 'block'));
        if (locationSelect) locationSelect.style.display = 'block';
    } else {
        section.classList.remove('open');
        optionBlocks.forEach(el => el && (el.style.display = 'none'));
        if (locationSelect) locationSelect.style.display = 'none';
    }
}

// Initialize view toggle
function initializeViewToggle() {}

// Initialize pagination
function initializePagination() {
    document.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.classList.contains('prev') && currentPage > 1) {
                currentPage--;
                loadItems();
            } else if (this.classList.contains('next') && currentPage < Math.ceil(totalItems / itemsPerPage)) {
                currentPage++;
                loadItems();
            }
        });
    });

    document.querySelectorAll('.page-number').forEach(btn => {
        btn.addEventListener('click', function() {
            const page = parseInt(this.textContent);
            if (page !== currentPage) {
                currentPage = page;
                loadItems();
            }
        });
    });
}

// Initialize navigation functionality
function initializeNavigation() {
    // User dropdown
    const userDropdownBtn = document.getElementById('userDropdownBtn');
    const userDropdown = document.querySelector('.user-dropdown');
    const userDropdownMenu = document.getElementById('userDropdownMenu');

    if (userDropdownBtn && userDropdown) {
        userDropdownBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            userDropdown.classList.toggle('open');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userDropdown.contains(e.target)) {
                userDropdown.classList.remove('open');
            }
        });
    }

    // Mobile menu
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            mobileMenu.classList.toggle('open');

            // Toggle hamburger icon
            const icon = this.querySelector('i');
            if (mobileMenu.classList.contains('open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                mobileMenu.classList.remove('open');
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when clicking on a link
        const mobileNavLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('open');
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
}

// Initialize wishlist buttons
function initializeWishlistButtons() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.wishlist-btn')) {
            const btn = e.target.closest('.wishlist-btn');
            const itemId = btn.dataset.itemId;
            toggleWishlist(itemId, btn);
        }
    });

    // Set initial state of wishlist icons
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const inWishlist = btn.dataset.inwishlist === 'true';
        const icon = btn.querySelector('i');
        if (inWishlist) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            btn.classList.add('active');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            btn.classList.remove('active');
        }
    });
}

// Initialize mobile filters
function initializeMobileFilters() {
    const sidebar = document.querySelector('.filters-sidebar');
    const mobileBody = document.querySelector('.mobile-filters-body');
    if (!sidebar || !mobileBody) {
        // Mobile filters container not present on this template; skip
        return;
    }
    // Clone desktop filters to mobile
    mobileBody.innerHTML = sidebar.innerHTML;
    // Re-initialize listeners for mobile filters
    initializeMobileFilterListeners();
    syncMobileFiltersWithCurrentState();
}

function initializeMobileFilterListeners() {
    const mobileFiltersBody = document.querySelector('.mobile-filters-body');

    // Category filters
    mobileFiltersBody.querySelectorAll('input[name="category"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateCategoryFilter(this.value, this.checked, true);
        });
    });

    // Condition filters
    mobileFiltersBody.querySelectorAll('input[name="condition"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateConditionFilter(this.value, this.checked, true);
        });
    });

    // Price filters
    mobileFiltersBody.querySelector('#minPrice').addEventListener('input', debounce(() => updatePriceFilter(true), 500));
    mobileFiltersBody.querySelector('#maxPrice').addEventListener('input', debounce(() => updatePriceFilter(true), 500));

    // Location filter
    mobileFiltersBody.querySelector('#locationFilter').addEventListener('change', function() {
        updateLocationFilter(this.value, true);
    });
}

// Syncs the mobile filter UI with the currentFilters state.
function syncMobileFiltersWithCurrentState() {
    const mobileFiltersBody = document.querySelector('.mobile-filters-body');
    if (!mobileFiltersBody) return;

    // Sync categories
    mobileFiltersBody.querySelectorAll('input[name="category"]').forEach(checkbox => {
        checkbox.checked = currentFilters.categories.includes(checkbox.value);
    });

    // Sync conditions
    mobileFiltersBody.querySelectorAll('input[name="condition"]').forEach(checkbox => {
        checkbox.checked = currentFilters.conditions.includes(checkbox.value);
    });

    // Sync price
    mobileFiltersBody.querySelector('#minPrice').value = currentFilters.minPrice !== null ? currentFilters.minPrice : '';
    mobileFiltersBody.querySelector('#maxPrice').value = currentFilters.maxPrice !== null ? currentFilters.maxPrice : '';

    // Sync location
    mobileFiltersBody.querySelector('#locationFilter').value = currentFilters.location;
}

// Search functionality
function handleSearch() {
    currentFilters.search = searchInput.value.trim();
    currentPage = 1;
    loadItems();
    updateActiveFilters();
    updateURL();
}

// Sort functionality
function handleSort() {
    currentFilters.sort = sortSelect.value;
    loadItems();
    updateURL();
}

// Filter update functions
function updateCategoryFilter(category, checked, isMobile = false) {
    if (checked) {
        if (!currentFilters.categories.includes(category)) {
            currentFilters.categories.push(category);
        }
    } else {
        currentFilters.categories = currentFilters.categories.filter(c => c !== category);
    }

    if (!isMobile) {
        const mobileCheckbox = document.querySelector('.mobile-filters-body input[name="category"][value="' + category + '"]');
        if (mobileCheckbox) mobileCheckbox.checked = checked;
    } else {
        const desktopCheckbox = document.querySelector('.filters-sidebar input[name="category"][value="' + category + '"]');
        if (desktopCheckbox) desktopCheckbox.checked = checked;
    }

    currentPage = 1;
    loadItems();
    updateActiveFilters();
    updateURL();
}

function updateConditionFilter(condition, isChecked, isMobile = false) {
    if (isChecked) {
        if (!currentFilters.conditions.includes(condition)) {
            currentFilters.conditions.push(condition);
        }
    } else {
        currentFilters.conditions = currentFilters.conditions.filter(c => c !== condition);
    }

    if (!isMobile) {
        const mobileCheckbox = document.querySelector('.mobile-filters-body input[name="condition"][value="' + condition + '"]');
        if (mobileCheckbox) mobileCheckbox.checked = isChecked;
    } else {
        const desktopCheckbox = document.querySelector('.filters-sidebar input[name="condition"][value="' + condition + '"]');
        if (desktopCheckbox) desktopCheckbox.checked = isChecked;
    }

    currentPage = 1;
    loadItems();
    updateActiveFilters();
    updateURL();
}

// updateUniversityFilter removed

function updatePriceFilter(isMobile = false) {
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;

    currentFilters.minPrice = minPrice ? parseFloat(minPrice) : null;
    currentFilters.maxPrice = maxPrice ? parseFloat(maxPrice) : null;

    if (!isMobile) {
        document.querySelector('.mobile-filters-body #minPrice').value = minPrice;
        document.querySelector('.mobile-filters-body #maxPrice').value = maxPrice;
    } else {
        document.querySelector('.filters-sidebar #minPrice').value = minPrice;
        document.querySelector('.filters-sidebar #maxPrice').value = maxPrice;
    }

    currentPage = 1;
    loadItems();
    updateActiveFilters();
    updateURL();
}


function updateLocationFilter(location, isMobile = false) {
    currentFilters.location = location;

    if (!isMobile) {
        document.querySelector('.mobile-filters-body #locationFilter').value = location;
    } else {
        document.querySelector('.filters-sidebar #locationFilter').value = location;
    }

    currentPage = 1;
    loadItems();
    updateActiveFilters();
    updateURL();
}

// View toggle
function toggleView() {}

// Load items (this would typically fetch from server)
function loadItems() {
    showLoading(true);

    // Work on server-provided items
    setTimeout(() => {
        const filteredItems = filterItems(allItems);
        const sortedItems = sortItems(filteredItems);

        // Paginate and display only the current page's items
        const paginatedItems = paginateItems(sortedItems);
        displayItems(paginatedItems);
        updateResultsCount(totalItems); // Use totalItems for pagination
        if (pagination) {
            pagination.style.display = 'block'; // Ensure pagination is visible
        }
        updatePagination(); // Update pagination controls
        showLoading(false);

        if (totalItems === 0) {
            showNoResults(true);
        } else {
            showNoResults(false);
        }
    }, 100);
}

// Filter items based on current filters
function filterItems(items) {
    return items.filter(item => {
        // Search filter
        if (currentFilters.search) {
            const searchTerm = currentFilters.search.toLowerCase();
            const searchableText = `${item.title} ${item.description} ${item.category}`.toLowerCase();
            if (!searchableText.includes(searchTerm)) {
                return false;
            }
        }

        // Category filter
        if (currentFilters.categories.length > 0) {
            if (!currentFilters.categories.includes(item.category)) {
                return false;
            }
        }

        // Condition filter
        if (currentFilters.conditions.length > 0) {
            if (!currentFilters.conditions.includes(item.condition)) {
                return false;
            }
        }

        // university filter removed

        // Price filter
        if (currentFilters.minPrice !== null && item.price < currentFilters.minPrice) {
            return false;
        }

        if (currentFilters.maxPrice !== null && item.price > currentFilters.maxPrice) {
            return false;
        }

        // Location filter
        if (currentFilters.location && item.location !== currentFilters.location) {
            return false;
        }

        return true;
    });
}

// Sort items
function sortItems(items) {
    const sortedItems = [...items];

    switch (currentFilters.sort) {
        case 'newest':
            return sortedItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        case 'oldest':
            return sortedItems.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        case 'price-low':
            return sortedItems.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sortedItems.sort((a, b) => b.price - a.price);
        case 'popular':
            return sortedItems.sort((a, b) => (b.views || 0) - (a.views || 0));
        default:
            return sortedItems;
    }
}

// Paginate items
function paginateItems(items) {
    totalItems = items.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
}

// Display items in the grid
function displayItems(items) {
    const allItemCards = Array.from(itemsGrid.querySelectorAll('.item-card'));

    // Hide all items initially
    allItemCards.forEach(card => card.style.display = 'none');

    // Display only the filtered and paginated items
    items.forEach(item => {
        const card = itemsGrid.querySelector(`.item-card[data-id="${item.id}"]`);
        if (card) {
            card.style.display = 'flex'; // Or 'block', depending on your CSS
        }
    });

    // Reorder items in the DOM to match the sorted order
    const fragment = document.createDocumentFragment();
    items.forEach(item => {
        const card = itemsGrid.querySelector(`.item-card[data-id="${item.id}"]`);
        if (card) {
            fragment.appendChild(card);
        }
    });
    itemsGrid.innerHTML = ''; // Clear existing items to re-append in sorted order
    itemsGrid.appendChild(fragment);

    // Re-initialize wishlist buttons for new items - no longer needed as items are just hidden/shown.
    // initializeWishlistButtons();
}

// Create HTML for a single item (removed - using Thymeleaf rendered items)
/*
function createItemHTML(item) {
    const conditionClass = item.condition.toLowerCase().replace('_', '-');
    const categoryIcon = getCategoryIcon(item.category);

    return `
        <div class="item-card" data-category="${item.category}" data-price="${item.price}" data-condition="${item.condition}">
            <div class="item-image">
                <img src="${item.imageUrl}" alt="${item.title}">
                <div class="item-badges">
                    <span class="condition-badge ${conditionClass}">${formatCondition(item.condition)}</span>
                    ${item.featured ? '<span class="featured-badge">Featured</span>' : ''}
                </div>
                <button class="wishlist-btn ${item.inWishlist ? 'active' : ''}" data-item-id="${item.id}">
                    <i class="${item.inWishlist ? 'fas' : 'far'} fa-heart"></i>
                </button>
            </div>
            <div class="item-content">
                <div class="item-category">
                    <i class="fas ${categoryIcon}"></i>
                    ${formatCategory(item.category)}
                </div>
                <h3 class="item-title">${item.title}</h3>
                <p class="item-description">${item.description}</p>
                <div class="item-details">
                    <div class="item-price">${item.price} лв</div>
                    <div class="item-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${item.location}
                    </div>
                </div>
                <div class="item-seller">
                    <img src="${item.seller.avatar}" alt="${item.seller.name}" class="seller-avatar">
                    <span class="seller-name">${item.seller.name}</span>
                    <span class="seller-uni">${item.seller.university}</span>
                </div>
                <div class="item-actions">
                    <button class="btn btn-primary" onclick="viewItem('${item.id}')">
                        <i class="fas fa-eye"></i>
                        View Details
                    </button>
                    <button class="btn btn-secondary" onclick="contactSeller('${item.id}')">
                        <i class="fas fa-envelope"></i>
                        Contact
                    </button>
                </div>
            </div>
        </div>
    `;
} */

// Update active filters display
function updateActiveFilters() {
    const filters = [];

    if (currentFilters.search) {
        filters.push({
            type: 'search',
            label: `"${currentFilters.search}"`,
            value: currentFilters.search
        });
    }

    currentFilters.categories.forEach(category => {
        filters.push({
            type: 'category',
            label: formatCategory(category),
            value: category
        });
    });

    currentFilters.conditions.forEach(condition => {
        filters.push({
            type: 'condition',
            label: formatCondition(condition),
            value: condition
        });
    });

    // university filter badges removed

    if (currentFilters.minPrice !== null || currentFilters.maxPrice !== null) {
        let priceLabel = '';
        if (currentFilters.minPrice !== null && currentFilters.maxPrice !== null) {
            priceLabel = `${currentFilters.minPrice} - ${currentFilters.maxPrice} лв`;
        } else if (currentFilters.minPrice !== null) {
            priceLabel = `From ${currentFilters.minPrice} лв`;
        } else {
            priceLabel = `Up to ${currentFilters.maxPrice} лв`;
        }
        filters.push({
            type: 'price',
            label: priceLabel,
            value: 'price'
        });
    }

    if (currentFilters.location) {
        filters.push({
            type: 'location',
            label: currentFilters.location,
            value: currentFilters.location
        });
    }

    const filtersHTML = filters.map(filter => `
        <div class="active-filter">
            ${filter.label}
            <span class="remove" onclick="removeFilter('${filter.type}', '${filter.value}')">&times;</span>
        </div>
    `).join('');

    activeFilters.innerHTML = filtersHTML;
}

// Remove individual filter
function removeFilter(type, value) {
    switch (type) {
        case 'search':
            currentFilters.search = '';
            searchInput.value = '';
            break;
        case 'category':
            currentFilters.categories = currentFilters.categories.filter(c => c !== value);
            document.querySelector(`input[name="category"][value="${value}"]`).checked = false;
            break;
        case 'condition':
            currentFilters.conditions = currentFilters.conditions.filter(c => c !== value);
            document.querySelector(`input[name="condition"][value="${value}"]`).checked = false;
            break;
        case 'university':
            currentFilters.universities = currentFilters.universities.filter(u => u !== value);
            document.querySelector(`input[name="university"][value="${value}"]`).checked = false;
            break;
        case 'price':
            currentFilters.minPrice = null;
            currentFilters.maxPrice = null;
            document.getElementById('minPrice').value = '';
            document.getElementById('maxPrice').value = '';
            break;
        case 'location':
            currentFilters.location = '';
            document.getElementById('locationFilter').value = '';
            break;
    }

    currentPage = 1;
    loadItems();
    updateActiveFilters();
    updateURL();
}

// Clear all filters
function clearAllFilters() {
    currentFilters = {
        search: '',
        categories: [],
        conditions: [],
        universities: [],
        minPrice: null,
        maxPrice: null,
        location: '',
        sort: 'newest'
    };

    // Reset form elements
    searchInput.value = '';
    sortSelect.value = 'newest';
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('locationFilter').value = '';

    currentPage = 1;
    loadItems();
    updateActiveFilters();
    updateURL();
}

// Mobile filters removed

// Wishlist functionality
function toggleWishlist(itemId, button) {
    button.classList.toggle('active');
    const icon = button.querySelector('i');

    if (button.classList.contains('active')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        // In real app, make API call to add to wishlist
        console.log(`Added item ${itemId} to wishlist`);
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        // In real app, make API call to remove from wishlist
        console.log(`Removed item ${itemId} from wishlist`);
    }
}

// Item actions
function viewItem(itemId) {
    window.location.href = `/items/${itemId}`;
}

function contactSeller(itemId) {
    window.location.href = `/messages?item=${itemId}`;
}

// Update pagination
function updatePagination() {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Update prev/next buttons
    const prevBtn = document.querySelector('.page-btn.prev');
    const nextBtn = document.querySelector('.page-btn.next');

    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;

    // Update page numbers
    const pageNumbers = document.querySelector('.page-numbers');
    let pagesHTML = '';

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
        pagesHTML += `<button class="page-number" onclick="goToPage(1)">1</button>`;
        if (startPage > 2) {
            pagesHTML += `<span class="page-ellipsis">...</span>`;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pagesHTML += `<button class="page-number ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pagesHTML += `<span class="page-ellipsis">...</span>`;
        }
        pagesHTML += `<button class="page-number" onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }

    pageNumbers.innerHTML = pagesHTML;
}

function goToPage(page) {
    currentPage = page;
    loadItems();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Update results count
function updateResultsCount(count) {
    resultsCount.textContent = count;
}

// Show/hide loading
function showLoading(show) {
    loadingIndicator.style.display = show ? 'block' : 'none';
}

// Show/hide no results
function showNoResults(show) {
    noResults.style.display = show ? 'block' : 'none';
    itemsGrid.style.display = show ? 'none' : 'grid';
}

// Update URL with current filters (for bookmarking/sharing)
function updateURL() {
    const params = new URLSearchParams();

    if (currentFilters.search) params.set('search', currentFilters.search);
    if (currentFilters.categories.length > 0) params.set('categories', currentFilters.categories.join(','));
    if (currentFilters.conditions.length > 0) params.set('conditions', currentFilters.conditions.join(','));
    // university param removed
    if (currentFilters.minPrice !== null) params.set('minPrice', currentFilters.minPrice);
    if (currentFilters.maxPrice !== null) params.set('maxPrice', currentFilters.maxPrice);
    if (currentFilters.location) params.set('location', currentFilters.location);
    if (currentFilters.sort !== 'newest') params.set('sort', currentFilters.sort);
    if (currentPage > 1) params.set('page', currentPage);

    const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newURL);
}

// Load filters from URL on page load
function loadFiltersFromURL() {
    const params = new URLSearchParams(window.location.search);

    if (params.has('search')) {
        currentFilters.search = params.get('search');
        searchInput.value = currentFilters.search;
    }

    if (params.has('categories')) {
        currentFilters.categories = params.get('categories').split(',');
        currentFilters.categories.forEach(category => {
            const checkbox = document.querySelector(`input[name="category"][value="${category}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }

    if (params.has('conditions')) {
        currentFilters.conditions = params.get('conditions').split(',');
        currentFilters.conditions.forEach(condition => {
            const checkbox = document.querySelector(`input[name="condition"][value="${condition}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }

    // Similar for other filters...

    if (params.has('page')) {
        currentPage = parseInt(params.get('page')) || 1;
    }
}

// Utility functions
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

function getCategoryIcon(category) {
    const icons = {
        'TEXTBOOKS': 'fa-book',
        'ELECTRONICS': 'fa-laptop',
        'FURNITURE': 'fa-chair',
        'CLOTHING': 'fa-tshirt',
        'SPORTS': 'fa-dumbbell',
        'ACCESSORIES': 'fa-gem',
        'SERVICES': 'fa-handshake'
    };
    return icons[category] || 'fa-tag';
}

function formatCategory(category) {
    return category.charAt(0) + category.slice(1).toLowerCase().replace('_', ' ');
}

function formatCondition(condition) {
    return condition.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}

// Removed mock sample items; using server-provided items only

// Removed early call to loadFiltersFromURL(); it's now called after DOM is ready