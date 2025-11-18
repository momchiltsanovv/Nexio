// Photo preview functionality
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('photo-1');
    const preview = document.getElementById('preview-1');
    const icon = document.getElementById('icon-1');
    const removeBtn = document.getElementById('remove-1');
    const slot = document.getElementById('slot-1');

    // Name character counter and validation
    const nameField = document.getElementById('name');
    const nameCharCounter = document.getElementById('nameCharCounter');
    const nameCharCount = document.getElementById('nameCharCount');
    
    function updateNameFeedback() {
        if (!nameField) return;
        const length = nameField.value.length;
        nameCharCount.textContent = length;
        
        if (length >= 3) {
            nameField.classList.remove('invalid');
            nameField.classList.add('valid');
            nameCharCounter.classList.remove('invalid');
            nameCharCounter.classList.add('valid');
        } else {
            nameField.classList.remove('valid');
            nameField.classList.add('invalid');
            nameCharCounter.classList.remove('valid');
            nameCharCounter.classList.add('invalid');
        }
    }
    
    if (nameField) {
        nameField.addEventListener('input', updateNameFeedback);
        nameField.addEventListener('paste', function() {
            setTimeout(updateNameFeedback, 0);
        });
        // Initialize on page load
        updateNameFeedback();
    }

    // Description character counter and validation
    const descriptionField = document.getElementById('description');
    const charCounter = document.getElementById('charCounter');
    const charCount = document.getElementById('charCount');
    
    function updateDescriptionFeedback() {
        const length = descriptionField.value.length;
        charCount.textContent = length;
        
        if (length >= 10) {
            descriptionField.classList.remove('invalid');
            descriptionField.classList.add('valid');
            charCounter.classList.remove('invalid');
            charCounter.classList.add('valid');
        } else {
            descriptionField.classList.remove('valid');
            descriptionField.classList.add('invalid');
            charCounter.classList.remove('valid');
            charCounter.classList.add('invalid');
        }
    }
    
    if (descriptionField) {
        descriptionField.addEventListener('input', updateDescriptionFeedback);
        descriptionField.addEventListener('paste', function() {
            setTimeout(updateDescriptionFeedback, 0);
        });
        // Initialize on page load
        updateDescriptionFeedback();
    }

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

    // Dropdown and price validation
    const categoryField = document.getElementById('category');
    const conditionField = document.getElementById('condition');
    const locationField = document.getElementById('exchangeLocation');
    const priceField = document.getElementById('price');

    function updateDropdownFeedback(selectElement) {
        if (!selectElement) return;
        if (selectElement.value && selectElement.value !== '') {
            selectElement.classList.remove('invalid');
            selectElement.classList.add('valid');
        } else {
            selectElement.classList.remove('valid');
            selectElement.classList.add('invalid');
        }
    }

    function updatePriceFeedback() {
        if (!priceField) return;
        const priceValue = parseFloat(priceField.value);
        if (priceValue !== null && priceValue !== undefined && !isNaN(priceValue) && priceValue >= 0 && priceField.value.trim() !== '') {
            priceField.classList.remove('invalid');
            priceField.classList.add('valid');
        } else {
            priceField.classList.remove('valid');
            priceField.classList.add('invalid');
        }
    }

    // Initialize dropdowns validation
    if (categoryField) {
        categoryField.addEventListener('change', function() {
            updateDropdownFeedback(this);
        });
        updateDropdownFeedback(categoryField);
    }

    if (conditionField) {
        conditionField.addEventListener('change', function() {
            updateDropdownFeedback(this);
        });
        updateDropdownFeedback(conditionField);
    }

    if (locationField) {
        locationField.addEventListener('change', function() {
            updateDropdownFeedback(this);
        });
        updateDropdownFeedback(locationField);
    }

    // Initialize price validation
    if (priceField) {
        priceField.addEventListener('input', updatePriceFeedback);
        priceField.addEventListener('blur', updatePriceFeedback);
        updatePriceFeedback();
    }

    // Form submission validation
    const form = document.getElementById('postItemForm');
    if (form && descriptionField) {
        form.addEventListener('submit', function(e) {
            // Validate name
            const nameLength = nameField ? nameField.value.trim().length : 0;
            if (nameLength < 3) {
                e.preventDefault();
                e.stopPropagation();
                
                // Show error message
                alert('Title must be at least 3 characters long.');
                
                // Focus on name field and highlight it
                if (nameField) {
                    nameField.focus();
                    nameField.classList.add('invalid');
                    nameField.classList.remove('valid');
                    nameCharCounter.classList.add('invalid');
                    nameCharCounter.classList.remove('valid');
                    
                    // Scroll to name field
                    nameField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                
                return false;
            }
            
            // Validate description
            const descriptionLength = descriptionField.value.trim().length;
            if (descriptionLength < 10) {
                e.preventDefault();
                e.stopPropagation();
                
                // Show error message
                alert('Description must be at least 10 characters long.');
                
                // Focus on description field and highlight it
                descriptionField.focus();
                descriptionField.classList.add('invalid');
                descriptionField.classList.remove('valid');
                charCounter.classList.add('invalid');
                charCounter.classList.remove('valid');
                
                // Scroll to description field
                descriptionField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                return false;
            }
            
            // Validate image
            if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
                e.preventDefault();
                e.stopPropagation();
                
                // Show error message
                alert('Please upload a photo for your item.');
                
                // Highlight image upload area
                slot.classList.add('invalid-upload');
                setTimeout(() => {
                    slot.classList.remove('invalid-upload');
                }, 3000);
                
                // Scroll to image upload area
                slot.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                return false;
            }
        });
    }
});
