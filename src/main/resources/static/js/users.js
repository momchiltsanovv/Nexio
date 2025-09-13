// Sample user data
const users = [
    {
        id: "USR001",
        username: "jane_cooper",
        firstName: "Jane",
        lastName: "Cooper",
        email: "jane@microsoft.com",
        status: "online",
        role: "admin",
        createdOn: "2023-01-15"
    },
    {
        id: "USR002",
        username: "floyd_miles",
        firstName: "Floyd",
        lastName: "Miles",
        email: "floyd@yahoo.com",
        status: "offline",
        role: "user",
        createdOn: "2023-02-20"
    },
    {
        id: "USR003",
        username: "ronald_richards",
        firstName: "Ronald",
        lastName: "Richards",
        email: "ronald@adobe.com",
        status: "offline",
        role: "user",
        createdOn: "2023-01-30"
    },
    {
        id: "USR004",
        username: "marvin_mckinney",
        firstName: "Marvin",
        lastName: "McKinney",
        email: "marvin@tesla.com",
        status: "online",
        role: "user",
        createdOn: "2023-03-10"
    },
    {
        id: "USR005",
        username: "jerome_bell",
        firstName: "Jerome",
        lastName: "Bell",
        email: "jerome@google.com",
        status: "online",
        role: "admin",
        createdOn: "2023-02-05"
    },
    {
        id: "USR006",
        username: "kathryn_murphy",
        firstName: "Kathryn",
        lastName: "Murphy",
        email: "kathryn@microsoft.com",
        status: "online",
        role: "user",
        createdOn: "2023-01-08"
    },
    {
        id: "USR007",
        username: "jacob_jones",
        firstName: "Jacob",
        lastName: "Jones",
        email: "jacob@yahoo.com",
        status: "online",
        role: "user",
        createdOn: "2023-04-12"
    },
    {
        id: "USR008",
        username: "kristin_watson",
        firstName: "Kristin",
        lastName: "Watson",
        email: "kristin@facebook.com",
        status: "offline",
        role: "admin",
        createdOn: "2023-03-25"
    }
];

let filteredUsers = [...users];
let currentSort = 'newest';

// Standard Select Functionality
const sortSelect = document.getElementById('sortSelect');

sortSelect.addEventListener('change', () => {
    currentSort = sortSelect.value;
    sortUsers();
    renderUsers();
});

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function createUserRow(user) {
    const buttonText = user.role === 'admin' ? 'Make User' : 'Make Admin';
    const buttonClass = user.role === 'admin' ? 'make-user' : 'make-admin';

    return `
        <tr class="table-row">
            <td class="table-cell">
                <div class="user-id">${user.id}</div>
            </td>
            <td class="table-cell">
                <div class="username">@${user.username}</div>
            </td>
            <td class="table-cell">
                <div class="user-name">${user.firstName} ${user.lastName}</div>
            </td>
            <td class="table-cell user-email">${user.email}</td>
            <td class="table-cell">
                <span class="status-badge status-${user.status}">${user.status}</span>
            </td>
            <td class="table-cell">
                <span class="role-badge role-${user.role}">${user.role}</span>
            </td>
            <td class="table-cell">
                <div class="created-date">${formatDate(user.createdOn)}</div>
            </td>
            <td class="table-cell actions-cell">
                <div class="actions-container">
                    <button class="action-button btn-edit" onclick="editUser('${user.id}')">Edit</button>
                    <button class="action-button btn-role ${buttonClass}" onclick="changeRole('${user.id}', '${user.role}')">
                        ${buttonText}
                    </button>
                    <button class="action-button btn-delete" onclick="deleteUser('${user.id}')">Delete</button>
                </div>
            </td>
        </tr>
    `;
}

function renderUsers() {
    const tbody = document.getElementById('usersTableBody');
    if (filteredUsers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    <div class="empty-state-icon">👥</div>
                    <p>No users found</p>
                </td>
            </tr>
        `;
    } else {
        tbody.innerHTML = filteredUsers.map(createUserRow).join('');
    }
}

function searchUsers() {
    const searchTerm = document.getElementById('searchBox').value.toLowerCase();
    filteredUsers = users.filter(user =>
        user.id.toLowerCase().includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm) ||
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.status.toLowerCase().includes(searchTerm) ||
        user.role.toLowerCase().includes(searchTerm)
    );
    sortUsers();
    renderUsers();
}

function sortUsers() {
    filteredUsers.sort((a, b) => {
        switch (currentSort) {
            case 'newest':
                return new Date(b.createdOn) - new Date(a.createdOn);
            case 'oldest':
                return new Date(a.createdOn) - new Date(b.createdOn);
            case 'name':
                return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
            case 'username':
                return a.username.localeCompare(b.username);
            case 'email':
                return a.email.localeCompare(b.email);
            default:
                return 0;
        }
    });
}

function editUser(userId) {
    console.log(`Edit user: ${userId}`);
    alert(`Edit user functionality for ${userId}`);
}

function changeRole(userId, currentRole) {
    const user = users.find(u => u.id === userId);
    if (user) {
        user.role = currentRole === 'admin' ? 'user' : 'admin';
        searchUsers(); // Refresh the filtered list
        console.log(`User ${userId} role changed to ${user.role}`);
    }
}

function deleteUser(userId) {
    if (confirm(`Are you sure you want to delete this user?`)) {
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex > -1) {
            users.splice(userIndex, 1);
            searchUsers(); // Refresh the filtered list
            console.log(`User ${userId} deleted`);
        }
    }
}

// Event listeners
document.getElementById('searchBox').addEventListener('input', searchUsers);

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    sortUsers();
    renderUsers();
});

// Function to load users from your API
async function loadUsersFromAPI() {
    try {
        const response = await fetch('/api/users');
        const apiUsers = await response.json();

        users.length = 0;
        users.push(...apiUsers);

        searchUsers();
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Uncomment the line below to load users from your API
// loadUsersFromAPI();
