// Messages Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatList = document.getElementById('chatList');
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatSearchInput = document.getElementById('chatSearchInput');
    const emptyChatState = document.getElementById('emptyChatState');
    const navOptionsBtn = document.getElementById('navOptionsBtn');
    const navOptionsDropdown = document.getElementById('navOptionsDropdown');
    const wishlistBtn = document.getElementById('wishlistBtn');
    const profileBtn = document.getElementById('profileBtn');
    const mobileChatListBtn = document.getElementById('mobileChatListBtn');
    const chatListSidebar = document.querySelector('.chat-list-sidebar');

    // State
    let currentChatId = null;
    let chatData = {
        1: {
            id: 1,
            name: 'John Doe',
            avatar: 'JD',
            status: 'Online',
            messages: [
                { type: 'received', content: 'Hey! I saw your MacBook Pro listing. Is it still available?', time: '2:30 PM' },
                { type: 'sent', content: 'Yes, it\'s still available! Are you interested in purchasing it?', time: '2:32 PM' },
                { type: 'received', content: 'Definitely! I\'m looking for a laptop for my studies. What\'s the condition like?', time: '2:35 PM' },
                { type: 'sent', content: 'It\'s in excellent condition - barely used, no scratches or dents. I can send you some photos if you\'d like to see it in detail.', time: '2:37 PM' },
                { type: 'received', content: 'That would be great! And what about the battery life?', time: '2:40 PM' },
                { type: 'sent', content: 'The battery is still at 95% capacity. I\'ve only had it for about 6 months and used it mainly for coding projects.', time: '2:42 PM' },
                { type: 'received', content: 'Perfect! When would be a good time to meet up and check it out?', time: '2:45 PM' },
                { type: 'sent', content: 'I\'m free tomorrow afternoon around 3 PM. We could meet at the campus library if that works for you?', time: '2:47 PM' }
            ]
        },
        2: {
            id: 2,
            name: 'Sarah Miller',
            avatar: 'SM',
            status: 'Offline',
            messages: [
                { type: 'received', content: 'Thanks for the textbook! Great condition.', time: '1:15 PM' },
                { type: 'sent', content: 'You\'re welcome! Glad it worked out well for you.', time: '1:20 PM' }
            ]
        },
        3: {
            id: 3,
            name: 'Mike Johnson',
            avatar: 'MJ',
            status: 'Online',
            messages: [
                { type: 'received', content: 'Can we meet tomorrow for the chair?', time: '11:30 AM' },
                { type: 'sent', content: 'Sure! What time works for you?', time: '11:35 AM' }
            ]
        },
        4: {
            id: 4,
            name: 'Alex Lee',
            avatar: 'AL',
            status: 'Offline',
            messages: [
                { type: 'received', content: 'The hoodie looks perfect, thanks!', time: 'Yesterday' }
            ]
        },
        5: {
            id: 5,
            name: 'Emma Wilson',
            avatar: 'EW',
            status: 'Offline',
            messages: [
                { type: 'received', content: 'Is the iPhone still for sale?', time: '2 days ago' }
            ]
        }
    };

    // Initialize
    init();

    function init() {
        // Set up event listeners
        setupEventListeners();
        
        // Load first chat by default
        loadChat(1);
        
        // Initialize navigation
        initNavigation();
    }

    function setupEventListeners() {
        // Chat list item clicks
        chatList.addEventListener('click', handleChatItemClick);
        
        // Send message
        sendBtn.addEventListener('click', handleSendMessage);
        messageInput.addEventListener('keypress', handleKeyPress);
        messageInput.addEventListener('input', handleInputResize);
        
        // Search functionality
        chatSearchInput.addEventListener('input', handleSearch);
        
        
        // Mobile chat list toggle
        mobileChatListBtn.addEventListener('click', toggleMobileChatList);
        
        // Navigation
        navOptionsBtn.addEventListener('click', toggleNavOptions);
        wishlistBtn.addEventListener('click', () => window.location.href = '/wishlist');
        profileBtn.addEventListener('click', () => window.location.href = '/profile');
        
        // Close dropdown when clicking outside
        document.addEventListener('click', handleOutsideClick);
    }

    function handleChatItemClick(e) {
        const chatItem = e.target.closest('.chat-item');
        if (!chatItem) return;
        
        const chatId = parseInt(chatItem.dataset.chatId);
        loadChat(chatId);
    }

    function loadChat(chatId) {
        currentChatId = chatId;
        const chat = chatData[chatId];
        
        if (!chat) return;
        
        // Update active chat item
        document.querySelectorAll('.chat-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-chat-id="${chatId}"]`).classList.add('active');
        
        // Update chat header
        updateChatHeader(chat);
        
        // Update messages
        updateChatMessages(chat.messages);
        
        // Hide empty state
        emptyChatState.classList.add('hidden');
        
        // Clear unread count
        clearUnreadCount(chatId);
        
        // Close mobile chat list if open
        if (window.innerWidth <= 768) {
            chatListSidebar.classList.remove('open');
        }
        
        // Focus input
        messageInput.focus();
    }

    function updateChatHeader(chat) {
        const userInfo = document.querySelector('.chat-user-info');
        const userName = userInfo.querySelector('.user-name');
        const userStatus = userInfo.querySelector('.user-status');
        const avatar = userInfo.querySelector('.avatar-placeholder');
        
        userName.textContent = chat.name;
        userStatus.textContent = chat.status;
        avatar.textContent = chat.avatar;
        
        // Update online indicator
        const onlineIndicator = userInfo.querySelector('.online-indicator');
        if (chat.status === 'Online') {
            onlineIndicator.style.display = 'block';
        } else {
            onlineIndicator.style.display = 'none';
        }
    }

    function updateChatMessages(messages) {
        chatMessages.innerHTML = '';
        
        messages.forEach(message => {
            const messageGroup = createMessageGroup(message);
            chatMessages.appendChild(messageGroup);
        });
        
        // Scroll to bottom
        scrollToBottom();
    }

    function createMessageGroup(message) {
        const messageGroup = document.createElement('div');
        messageGroup.className = 'message-group';
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.type}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const messageText = document.createElement('p');
        messageText.textContent = message.content;
        messageContent.appendChild(messageText);
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = message.time;
        
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(messageTime);
        messageGroup.appendChild(messageDiv);
        
        return messageGroup;
    }

    function handleSendMessage() {
        const message = messageInput.value.trim();
        if (!message || !currentChatId) return;
        
        // Add message to chat data
        const newMessage = {
            type: 'sent',
            content: message,
            time: getCurrentTime()
        };
        
        chatData[currentChatId].messages.push(newMessage);
        
        // Update UI
        const messageGroup = createMessageGroup(newMessage);
        chatMessages.appendChild(messageGroup);
        
        // Clear input
        messageInput.value = '';
        messageInput.style.height = 'auto';
        
        // Scroll to bottom
        scrollToBottom();
        
        // Simulate response after delay
        setTimeout(() => {
            simulateResponse();
        }, 1000 + Math.random() * 2000);
    }

    function simulateResponse() {
        if (!currentChatId) return;
        
        const responses = [
            "That sounds great!",
            "I'll think about it and get back to you.",
            "Thanks for letting me know.",
            "When would be a good time to meet?",
            "Perfect! I'm interested.",
            "Can you send me more details?",
            "That works for me.",
            "Let me check my schedule and get back to you."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const responseMessage = {
            type: 'received',
            content: randomResponse,
            time: getCurrentTime()
        };
        
        chatData[currentChatId].messages.push(responseMessage);
        
        // Update UI
        const messageGroup = createMessageGroup(responseMessage);
        chatMessages.appendChild(messageGroup);
        
        // Scroll to bottom
        scrollToBottom();
        
        // Update chat preview
        updateChatPreview(currentChatId, randomResponse);
    }

    function updateChatPreview(chatId, message) {
        const chatItem = document.querySelector(`[data-chat-id="${chatId}"]`);
        if (!chatItem) return;
        
        const preview = chatItem.querySelector('.chat-preview');
        const time = chatItem.querySelector('.chat-time');
        
        preview.textContent = message;
        time.textContent = 'now';
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }

    function handleInputResize() {
        messageInput.style.height = 'auto';
        messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
    }

    function handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        const chatItems = document.querySelectorAll('.chat-item');
        
        chatItems.forEach(item => {
            const chatName = item.querySelector('.chat-name').textContent.toLowerCase();
            const chatPreview = item.querySelector('.chat-preview').textContent.toLowerCase();
            
            if (chatName.includes(searchTerm) || chatPreview.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }


    function clearUnreadCount(chatId) {
        const chatItem = document.querySelector(`[data-chat-id="${chatId}"]`);
        if (!chatItem) return;
        
        const unreadCount = chatItem.querySelector('.unread-count');
        if (unreadCount) {
            unreadCount.remove();
        }
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    }

    // Navigation functions
    function initNavigation() {
        // Mobile navigation toggle
        if (window.innerWidth <= 768) {
            // Add mobile-specific functionality here
        }
    }

    function toggleNavOptions() {
        navOptionsDropdown.classList.toggle('active');
    }

    function toggleMobileChatList() {
        chatListSidebar.classList.toggle('open');
    }

    function handleOutsideClick(e) {
        // Close nav options dropdown
        if (!navOptionsDropdown.contains(e.target) && !navOptionsBtn.contains(e.target)) {
            navOptionsDropdown.classList.remove('active');
        }
        
        // Close mobile chat list if clicking outside (mobile only)
        if (window.innerWidth <= 768) {
            if (!chatListSidebar.contains(e.target) && !mobileChatListBtn.contains(e.target)) {
                chatListSidebar.classList.remove('open');
            }
        }
    }

    // Auto-resize textarea
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navOptionsDropdown.classList.remove('active');
        }
    });

    // Add some sample interactions for demonstration
    function addSampleInteractions() {
        // Simulate typing indicator (optional enhancement)
        let typingTimeout;
        
        messageInput.addEventListener('input', function() {
            clearTimeout(typingTimeout);
            // In a real app, you'd send a "typing" indicator to other users
        });
    }

    // Initialize sample interactions
    addSampleInteractions();

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Escape to close dropdowns
        if (e.key === 'Escape') {
            navOptionsDropdown.classList.remove('active');
        }
        
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            chatSearchInput.focus();
        }
    });

    // Add smooth scrolling behavior
    chatMessages.style.scrollBehavior = 'smooth';
    
    // Add loading states for better UX
    function showLoadingState() {
        // In a real app, you'd show loading indicators
    }

    function hideLoadingState() {
        // In a real app, you'd hide loading indicators
    }

    // Export functions for potential external use
    window.MessagesApp = {
        loadChat,
        sendMessage: handleSendMessage,
        searchChats: handleSearch
    };
});
