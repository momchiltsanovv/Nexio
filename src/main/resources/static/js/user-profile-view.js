document.addEventListener('DOMContentLoaded', function () {
    // Add click handlers to item cards
    document.querySelectorAll('.item-card').forEach(card => {
        card.addEventListener('click', function () {
            // Extract item ID from data attribute or URL
            const itemId = this.dataset.itemId;
            if (itemId) {
                window.location.href = '/items/' + itemId;
            }
        });
    });

});
