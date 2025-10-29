// Photo preview functionality
document.addEventListener('DOMContentLoaded', function() {
    // Handle file upload and preview for each photo slot
    for (let i = 1; i <= 5; i++) {
        const fileInput = document.getElementById(`photo-${i}`);
        const preview = document.getElementById(`preview-${i}`);
        const icon = document.getElementById(`icon-${i}`);
        const removeBtn = document.getElementById(`remove-${i}`);
        const slot = document.getElementById(`slot-${i}`);

        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            
            if (file) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    alert('Please select a valid image file.');
                    this.value = '';
                    return;
                }
                
                // Validate file size (5MB limit)
                if (file.size > 5 * 1024 * 1024) {
                    alert('File size must be less than 5MB.');
                    this.value = '';
                    return;
                }
                
                // Create preview
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                    icon.style.display = 'none';
                    removeBtn.style.display = 'flex';
                    slot.classList.add('has-photo');
                };
                reader.readAsDataURL(file);
            }
        });

        // Handle remove photo
        removeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            fileInput.value = '';
            preview.style.display = 'none';
            preview.src = '';
            icon.style.display = 'flex';
            removeBtn.style.display = 'none';
            slot.classList.remove('has-photo');
        });
    }
});
