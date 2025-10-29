function changeMainImage(imageUrl, clickedThumbnail) {
    document.getElementById('mainImage').src = imageUrl;

    // Remove 'active' class from all thumbnails
    document.querySelectorAll('.thumbnail').forEach(thumbnail => {
        thumbnail.classList.remove('active');
    });

    // Add 'active' class to the clicked thumbnail
    clickedThumbnail.classList.add('active');
}

// Add to wishlist functionality
document.addEventListener('DOMContentLoaded', function () {
    const wishlistBtn = document.querySelector('.btn-wishlist');
    if (wishlistBtn && wishlistBtn.textContent.includes('Wishlist')) {
        wishlistBtn.addEventListener('click', function () {
            // Toggle wishlist state
            const isInWishlist = this.classList.contains('active');
            if (isInWishlist) {
                this.classList.remove('active');
                this.innerHTML = '<i class="fas fa-heart"></i> Add to Wishlist';
            } else {
                this.classList.add('active');
                this.innerHTML = '<i class="fas fa-heart"></i> In Wishlist';
            }
        });
    }
});
