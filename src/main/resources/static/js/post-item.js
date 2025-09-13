// Post Item Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    initializeNavigation();
    
    // Form functionality
    initializeForm();
    
    // Image upload functionality
    initializeImageUpload();
    
    // Form validation
    initializeValidation();
});

// Navigation Functions
function initializeNavigation() {
    const navOptionsBtn = document.getElementById('navOptionsBtn');
    const navOptionsDropdown = document.getElementById('navOptionsDropdown');
    const wishlistBtn = document.getElementById('wishlistBtn');
    const profileBtn = document.getElementById('profileBtn');

    // Toggle navigation dropdown
    if (navOptionsBtn && navOptionsDropdown) {
        navOptionsBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            navOptionsDropdown.classList.toggle('active');
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (navOptionsDropdown && !navOptionsDropdown.contains(e.target) && !navOptionsBtn.contains(e.target)) {
            navOptionsDropdown.classList.remove('active');
        }
    });

    // Navigation button handlers
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
            window.location.href = '/wishlist';
        });
    }

    if (profileBtn) {
        profileBtn.addEventListener('click', function() {
            window.location.href = '/profile';
        });
    }
}

// Form Functions
function initializeForm() {
    const form = document.getElementById('postItemForm');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Validate form
    if (!validateForm(data)) {
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>Posting...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showToast('Item posted successfully!', 'success');
        form.reset();
        clearImagePreviews();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Redirect to home page after a delay
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
    }, 2000);
}

// Image Upload Functions
function initializeImageUpload() {
    const uploadArea = document.getElementById('imageUploadArea');
    const fileInput = document.getElementById('item-images');
    const previewContainer = document.getElementById('imagePreviewContainer');
    
    if (!uploadArea || !fileInput || !previewContainer) return;
    
    // Click to upload
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--secondary-color)';
        uploadArea.style.background = 'rgba(255, 255, 255, 0.05)';
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--border)';
        uploadArea.style.background = 'rgba(255, 255, 255, 0.02)';
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--border)';
        uploadArea.style.background = 'rgba(255, 255, 255, 0.02)';
        
        const files = e.dataTransfer.files;
        handleFileSelection(files);
    });
    
    // File input change
    fileInput.addEventListener('change', function(e) {
        const files = e.target.files;
        handleFileSelection(files);
    });
}

function handleFileSelection(files) {
    const previewContainer = document.getElementById('imagePreviewContainer');
    const maxFiles = 5;
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    // Clear existing previews if starting fresh
    if (previewContainer.children.length === 0) {
        clearImagePreviews();
    }
    
    // Validate files
    const validFiles = Array.from(files).filter(file => {
        if (!file.type.startsWith('image/')) {
            showToast('Please select only image files', 'error');
            return false;
        }
        if (file.size > maxSize) {
            showToast('File size must be less than 10MB', 'error');
            return false;
        }
        return true;
    });
    
    // Check total file count
    const currentCount = previewContainer.children.length;
    if (currentCount + validFiles.length > maxFiles) {
        showToast(`Maximum ${maxFiles} images allowed`, 'error');
        return;
    }
    
    // Process valid files
    validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            createImagePreview(e.target.result, file);
        };
        reader.readAsDataURL(file);
    });
}

function createImagePreview(src, file) {
    const previewContainer = document.getElementById('imagePreviewContainer');
    
    const preview = document.createElement('div');
    preview.className = 'image-preview';
    
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Preview';
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.innerHTML = '×';
    removeBtn.addEventListener('click', function() {
        preview.remove();
    });
    
    preview.appendChild(img);
    preview.appendChild(removeBtn);
    previewContainer.appendChild(preview);
}

function clearImagePreviews() {
    const previewContainer = document.getElementById('imagePreviewContainer');
    if (previewContainer) {
        previewContainer.innerHTML = '';
    }
}

// Validation Functions
function initializeValidation() {
    const form = document.getElementById('postItemForm');
    if (!form) return;
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateForm(data) {
    let isValid = true;
    
    // Required fields
    const requiredFields = ['title', 'price', 'description', 'category', 'condition', 'location'];
    
    requiredFields.forEach(field => {
        const element = document.querySelector(`[name="${field}"]`);
        if (!data[field] || data[field].trim() === '') {
            showFieldError(element, 'This field is required');
            isValid = false;
        }
    });
    
    // Price validation
    if (data.price && (isNaN(data.price) || parseFloat(data.price) < 0)) {
        const priceElement = document.querySelector('[name="price"]');
        showFieldError(priceElement, 'Please enter a valid price');
        isValid = false;
    }
    
    // Description length
    if (data.description && data.description.length < 10) {
        const descElement = document.querySelector('[name="description"]');
        showFieldError(descElement, 'Description must be at least 10 characters');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    clearFieldError(field);
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Specific validations
    switch (fieldName) {
        case 'price':
            if (value && (isNaN(value) || parseFloat(value) < 0)) {
                showFieldError(field, 'Please enter a valid price');
                return false;
            }
            break;
        case 'description':
            if (value && value.length < 10) {
                showFieldError(field, 'Description must be at least 10 characters');
                return false;
            }
            break;
    }
    
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = 'var(--error-color)';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = 'var(--error-color)';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '4px';
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Toast Notification Functions
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Utility Functions
function formatPrice(price) {
    return parseFloat(price).toFixed(2);
}

function generateItemId() {
    return 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Export functions for potential external use
window.postItemUtils = {
    showToast,
    validateForm,
    clearImagePreviews
};
