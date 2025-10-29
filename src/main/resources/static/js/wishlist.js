document.addEventListener('DOMContentLoaded', function () {
    const wishlistGrid = document.getElementById('wishlistGrid');
    const emptyState = document.getElementById('emptyState');
    const wishlistCount = document.getElementById('wishlistCount');
    const clearWishlist = document.getElementById('clearWishlist');

    let items = Array.from(wishlistGrid.children);

    function updateCount() {
        const visibleItems = items.filter(item => item.style.display !== 'none');
        wishlistCount.textContent = `${visibleItems.length} item${visibleItems.length !== 1 ? 's' : ''}`;

        if (visibleItems.length === 0) {
            emptyState.style.display = 'block';
            wishlistGrid.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            wishlistGrid.style.display = 'grid';
        }
    }

    updateCount();
});

const style = document.createElement('style');
style.textContent = `
        @keyframes fadeOut {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.8); }
        }
    `;
document.head.appendChild(style);
