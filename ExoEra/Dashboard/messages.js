// Sidebar Toggle Function
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // Prevent body scroll when sidebar is open on mobile
    document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : 'auto';
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    const sidebar = document.querySelector('.sidebar');
    const toggle = document.querySelector('.menu-toggle');
    
    if (!sidebar.contains(e.target) && 
        !toggle.contains(e.target) && 
        sidebar.classList.contains('active')) {
        toggleSidebar();
    }
});

// New Chat Modal
const newChatBtn = document.querySelector('.new-chat-btn');
const modal = document.getElementById('newChatModal');

newChatBtn.addEventListener('click', () => {
    modal.classList.add('active');
});

// Chat List Selection
const chatItems = document.querySelectorAll('.chat-item');
chatItems.forEach(item => {
    item.addEventListener('click', () => {
        document.querySelector('.chat-item.active')?.classList.remove('active');
        item.classList.add('active');
        
        // On mobile, hide sidebar after selection
        if (window.innerWidth <= 768) {
            document.querySelector('.chat-sidebar').classList.remove('active');
        }
    });
});

// Toggle chat list on mobile
const toggleChatList = () => {
    const chatList = document.querySelector('.chat-list-panel');
    chatList.classList.toggle('active');
};

// Send message function
const sendMessage = () => {
    const input = document.querySelector('.input-container input');
    const message = input.value.trim();
    
    if (message) {
        const messageHTML = `
            <div class="message sent">
                <div class="message-content">
                    <p>${message}</p>
                    <span class="message-time">${new Date().toLocaleTimeString()}</span>
                </div>
            </div>
        `;
        
        document.querySelector('.chat-messages').insertAdjacentHTML('beforeend', messageHTML);
        input.value = '';
        
        // Scroll to bottom
        const chatMessages = document.querySelector('.chat-messages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
};

// Event listeners
document.querySelector('.send-btn').addEventListener('click', sendMessage);
document.querySelector('.input-container input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Attachment Button
const attachBtn = document.querySelector('.attach-btn');
attachBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf,.doc,.docx';
    input.click();
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            alert(`File "${file.name}" selected for upload`);
        }
    };
});

// Emoji Button
const emojiBtn = document.querySelector('.emoji-btn');
emojiBtn.addEventListener('click', () => {
    // Add emoji picker functionality
    alert('Emoji picker coming soon!');
});

// Mobile Responsive Menu
const addMobileMenuButton = () => {
    if (window.innerWidth <= 768) {
        const chatHeader = document.querySelector('.chat-main .chat-header');
        if (!document.querySelector('.mobile-menu-btn')) {
            const menuBtn = document.createElement('button');
            menuBtn.className = 'mobile-menu-btn';
            menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            menuBtn.addEventListener('click', () => {
                document.querySelector('.chat-sidebar').classList.add('active');
            });
            chatHeader.insertBefore(menuBtn, chatHeader.firstChild);
        }
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    addMobileMenuButton();
    
    // Scroll to bottom of messages
    const chatMessages = document.querySelector('.chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Search functionality
    const searchInput = document.querySelector('.chat-search input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        chatItems.forEach(item => {
            const name = item.querySelector('.chat-name').textContent.toLowerCase();
            const preview = item.querySelector('.chat-preview').textContent.toLowerCase();
            item.style.display = name.includes(searchTerm) || preview.includes(searchTerm) ? 'flex' : 'none';
        });
    });

    // Action buttons
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            switch(action) {
                case 'call':
                    alert('Starting voice call...');
                    break;
                case 'video':
                    alert('Starting video call...');
                    break;
                case 'info':
                    alert('Opening chat info...');
                    break;
            }
        });
    });
});

// Handle window resize
window.addEventListener('resize', addMobileMenuButton);

// Search functionality
const searchInput = document.querySelector('.chat-search input');
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    chatItems.forEach(item => {
        const name = item.querySelector('.chat-name').textContent.toLowerCase();
        const preview = item.querySelector('.chat-preview').textContent.toLowerCase();
        
        if (name.includes(searchTerm) || preview.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
});

// Message handling functionality
document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.querySelector('.chat-input-area input');
    const sendBtn = document.querySelector('.send-btn');
    const chatMessages = document.querySelector('.chat-messages');
    const chatItems = document.querySelectorAll('.chat-item');

    // Function to send message
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            const time = new Date().toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
            });

            const messageHTML = `
                <div class="message sent">
                    <div class="message-avatar">
                        <img src="path/to/your/avatar.jpg" alt="You">
                    </div>
                    <div class="message-bubble">
                        <div class="message-content">
                            <p>${message}</p>
                        </div>
                        <span class="message-time">${time}</span>
                    </div>
                </div>
            `;

            // Add message to chat
            chatMessages.insertAdjacentHTML('beforeend', messageHTML);
            
            // Clear input
            messageInput.value = '';
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Simulate reply
            setTimeout(() => {
                const replyHTML = `
                    <div class="message received">
                        <div class="message-avatar">
                            <img src="path/to/contact/avatar.jpg" alt="Contact">
                        </div>
                        <div class="message-bubble">
                            <div class="message-content">
                                <p>Thanks for your message! I'll get back to you soon.</p>
                            </div>
                            <span class="message-time">${time}</span>
                        </div>
                    </div>
                `;
                chatMessages.insertAdjacentHTML('beforeend', replyHTML);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
        }
    }

    // Send message on button click
    sendBtn.addEventListener('click', sendMessage);

    // Send message on Enter key
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Chat item selection
    chatItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            chatItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');
            
            // On mobile, hide the chat list panel
            if (window.innerWidth <= 768) {
                document.querySelector('.chat-list-panel').classList.remove('active');
            }
        });
    });
}); 