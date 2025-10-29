document.addEventListener('DOMContentLoaded', function() {
        const searchInput = document.getElementById('searchInput');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const tableBody = document.getElementById('usersTableBody');
        const rows = tableBody.querySelectorAll('tr');

        // Initialize badge colors on page load
        function initializeBadges() {
            rows.forEach(row => {
                const roleBadge = row.querySelector('.role-badge');
                const statusBadge = row.querySelector('.status-badge');
                const role = row.dataset.role;
                const status = row.dataset.status;

                // Set role badge class
                if (roleBadge) {
                    roleBadge.classList.remove('admin', 'user');
                    roleBadge.classList.add(role === 'ADMIN' ? 'admin' : 'user');
                }

                // Set status badge class
                if (statusBadge) {
                    statusBadge.classList.remove('active', 'inactive');
                    statusBadge.classList.add(status);
                }
            });
        }

        // Initialize badges when page loads
        initializeBadges();

        // Search functionality
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterRows(searchTerm);
        });

        // Filter functionality
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');

                const filter = this.dataset.filter;
                filterRows('', filter);
            });
        });

        function filterRows(searchTerm = '', filter = 'all') {
            rows.forEach(row => {
                const name = row.querySelector('.fw-bold').textContent.toLowerCase();
                const email = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                const role = row.dataset.role;
                const status = row.dataset.status;

                let showRow = true;

                // Search filter
                if (searchTerm && !name.includes(searchTerm) && !email.includes(searchTerm)) {
                    showRow = false;
                }

                // Category filter
                if (filter !== 'all') {
                    if (filter === 'admin' && role !== 'ADMIN') showRow = false;
                    if (filter === 'user' && role !== 'USER') showRow = false;
                    if (filter === 'active' && status !== 'active') showRow = false;
                    if (filter === 'inactive' && status !== 'inactive') showRow = false;
                }

                row.style.display = showRow ? '' : 'none';
            });
        }

        // Handle role change forms
        document.querySelectorAll('form[action*="/toggle-role"]').forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault(); // Prevent default form submission

                const row = this.closest('tr');
                const roleBadge = row.querySelector('.role-badge');
                const currentRole = row.dataset.role;

                // Immediately change to new role
                const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
                const newRoleDisplay = newRole === 'ADMIN' ? 'Admin' : 'User';

                // Update the row data
                row.dataset.role = newRole;

                // Update the badge immediately
                roleBadge.classList.remove('admin', 'user');
                roleBadge.classList.add(newRole.toLowerCase());
                roleBadge.textContent = newRoleDisplay;

                // Submit the form to the server
                const formData = new FormData(this);
                fetch(this.action, {
                    method: 'POST',
                    body: formData
                }).then(response => {
                    if (!response.ok) {
                        // If server request fails, revert the change
                        row.dataset.role = currentRole;
                        roleBadge.classList.remove('admin', 'user');
                        roleBadge.classList.add(currentRole.toLowerCase());
                        roleBadge.textContent = currentRole === 'ADMIN' ? 'Admin' : 'User';
                        alert('Failed to update role. Please try again.');
                    }
                }).catch(error => {
                    // If request fails, revert the change
                    row.dataset.role = currentRole;
                    roleBadge.classList.remove('admin', 'user');
                    roleBadge.classList.add(currentRole.toLowerCase());
                    roleBadge.textContent = currentRole === 'ADMIN' ? 'Admin' : 'User';
                    alert('Failed to update role. Please try again.');
                });
            });
        });

        // Handle status change forms
        document.querySelectorAll('form[action*="/toggle-status"]').forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault(); // Prevent default form submission

                const row = this.closest('tr');
                const statusBadge = row.querySelector('.status-badge');
                const currentStatus = row.dataset.status;

                // Immediately change to new status
                const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
                const newStatusDisplay = newStatus === 'active' ? 'Active' : 'Inactive';

                // Update the row data
                row.dataset.status = newStatus;

                // Update the badge immediately
                statusBadge.classList.remove('active', 'inactive');
                statusBadge.classList.add(newStatus);
                statusBadge.textContent = newStatusDisplay;

                // Update toggle status button text and icon
                const toggleStatusButton = this.querySelector('.btn-status-toggle');
                const toggleStatusIcon = toggleStatusButton.querySelector('i');
                const toggleStatusText = toggleStatusButton.querySelector('span');

                toggleStatusButton.classList.remove('active', 'inactive');
                toggleStatusButton.classList.add(newStatus);
                toggleStatusIcon.classList.remove('fa-user-slash', 'fa-user-check');
                toggleStatusIcon.classList.add(newStatus === 'active' ? 'fa-user-slash' : 'fa-user-check');
                toggleStatusText.textContent = newStatus === 'active' ? 'Deactivate' : 'Activate';

                // Submit the form to the server
                const formData = new FormData(this);
                fetch(this.action, {
                    method: 'POST',
                    body: formData
                }).then(response => {
                    if (!response.ok) {
                        // If server request fails, revert the change
                        row.dataset.status = currentStatus;
                        statusBadge.classList.remove('active', 'inactive');
                        statusBadge.classList.add(currentStatus);
                        statusBadge.textContent = currentStatus === 'active' ? 'Active' : 'Inactive';

                        // Revert toggle status button text and icon
                        toggleStatusButton.classList.remove('active', 'inactive');
                        toggleStatusButton.classList.add(currentStatus);
                        toggleStatusIcon.classList.remove('fa-user-slash', 'fa-user-check');
                        toggleStatusIcon.classList.add(currentStatus === 'active' ? 'fa-user-slash' : 'fa-user-check');
                        toggleStatusText.textContent = currentStatus === 'active' ? 'Deactivate' : 'Activate';

                        alert('Failed to update status. Please try again.');
                    }
                }).catch(error => {
                    // If request fails, revert the change
                    row.dataset.status = currentStatus;
                    statusBadge.classList.remove('active', 'inactive');
                    statusBadge.classList.add(currentStatus);
                    statusBadge.textContent = currentStatus === 'active' ? 'Active' : 'Inactive';

                    // Revert toggle status button text and icon
                    toggleStatusButton.classList.remove('active', 'inactive');
                    toggleStatusButton.classList.add(currentStatus);
                    toggleStatusIcon.classList.remove('fa-user-slash', 'fa-user-check');
                    toggleStatusIcon.classList.add(currentStatus === 'active' ? 'fa-user-slash' : 'fa-user-check');
                    toggleStatusText.textContent = currentStatus === 'active' ? 'Deactivate' : 'Activate';

                    alert('Failed to update status. Please try again.');
                });
            });
        });
    });
