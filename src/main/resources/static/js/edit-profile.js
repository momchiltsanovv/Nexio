document.getElementById('profilePictureFile').addEventListener('change', function (e) {
    const file = e.target.files[0];
    const avatar = document.getElementById('avatarPreview');
    const fileInfo = document.getElementById('fileInfo');
    const hiddenURL = document.getElementById('profilePictureURL');

    if (file) {
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            this.value = '';
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB.');
            this.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            avatar.src = e.target.result;
            hiddenURL.value = e.target.result;
        };
        reader.readAsDataURL(file);

        fileInfo.textContent = `Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
        fileInfo.style.display = 'block';
    } else {
        avatar.src = 'https://via.placeholder.com/80x80/667eea/ffffff?text=U';
        hiddenURL.value = '';
        fileInfo.style.display = 'none';
    }
});

function clearField(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.value = '';
        field.focus();

        const clearBtn = field.parentElement.querySelector('.clear-btn');
        if (clearBtn) {
            clearBtn.style.display = 'none';
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const inputs = form.querySelectorAll('input[required]');

    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            if (this.value.trim() === '') {
                this.style.borderColor = '#dc3545';
            } else {
                this.style.borderColor = '#28a745';
            }
        });

        input.addEventListener('input', function () {
            const clearBtn = this.parentElement.querySelector('.clear-btn');
            if (clearBtn) {
                if (this.value.trim() === '') {
                    clearBtn.style.display = 'none';
                } else {
                    clearBtn.style.display = 'flex';
                }
            }
        });
    });
});
