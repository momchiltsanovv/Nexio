// Photo preview functionality
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('photo-1');
    const preview = document.getElementById('preview-1');
    const icon = document.getElementById('icon-1');
    const removeBtn = document.getElementById('remove-1');
    const slot = document.getElementById('slot-1');

    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file.');
                this.value = '';
                return;
            }
            
            // Validate file size (30MB limit)
            if (file.size > 30 * 1024 * 1024) {
                alert('File size must be less than 30MB.');
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
});
