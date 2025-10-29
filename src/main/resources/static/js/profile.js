function showDeleteModal() {
    document.getElementById('deleteModal').style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function hideDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
document.addEventListener('click', function (e) {
    const modal = document.getElementById('deleteModal');
    if (e.target === modal) {
        hideDeleteModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        hideDeleteModal();
    }
});
