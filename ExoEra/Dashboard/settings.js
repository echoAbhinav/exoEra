// Sidebar Toggle Function
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // Prevent body scroll when sidebar is open on mobile
    document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : 'auto';
}

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
    const sidebar = document.querySelector('.sidebar');
    const toggle = document.querySelector('.menu-toggle');
    
    if (!sidebar.contains(e.target) && 
        !toggle.contains(e.target) && 
        sidebar.classList.contains('active')) {
        toggleSidebar();
    }
});

// Password Change Modal
const changePasswordBtn = document.querySelector('.change-password-btn');
const passwordModal = document.getElementById('passwordModal');
const cancelPasswordBtn = document.querySelector('.cancel-btn');

changePasswordBtn.addEventListener('click', () => {
    passwordModal.classList.add('active');
});

cancelPasswordBtn.addEventListener('click', () => {
    passwordModal.classList.remove('active');
});

// Close modal when clicking outside
passwordModal.addEventListener('click', (e) => {
    if (e.target === passwordModal) {
        passwordModal.classList.remove('active');
    }
});

// Password Form Submission
const passwordForm = document.getElementById('passwordForm');
passwordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Add password change logic here
    passwordModal.classList.remove('active');
});

// Theme switching functionality
const themeButtons = document.querySelectorAll('.theme-btn');
const root = document.documentElement;

function applyTheme(theme) {
    const isDark = theme === 'dark';
    
    // Update body class
    document.body.className = theme;
    
    // Update theme colors
    const colors = {
        dark: {
            bgMain: '#0a0a0a',
            bgLight: '#1a1a1a',
            bgDark: '#111111',
            textPrimary: '#ffffff',
            textSecondary: '#cccccc',
            borderColor: 'rgba(255, 255, 255, 0.1)'
        },
        light: {
            bgMain: '#ffffff',
            bgLight: '#f5f5f5',
            bgDark: '#eeeeee',
            textPrimary: '#000000',
            textSecondary: '#666666',
            borderColor: 'rgba(0, 0, 0, 0.1)'
        }
    };

    const currentColors = colors[theme];
    
    // Apply colors to CSS variables
    root.style.setProperty('--bg-main', currentColors.bgMain);
    root.style.setProperty('--bg-light', currentColors.bgLight);
    root.style.setProperty('--bg-dark', currentColors.bgDark);
    root.style.setProperty('--text-primary', currentColors.textPrimary);
    root.style.setProperty('--text-secondary', currentColors.textSecondary);
    root.style.setProperty('--border-color', currentColors.borderColor);
    
    // Update active state of theme buttons
    themeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });
    
    // Save theme preference
    localStorage.setItem('theme', theme);
    
    // Show notification
    showNotification(`${theme.charAt(0).toUpperCase() + theme.slice(1)} theme activated`);
}

// Theme button click handlers
themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;
        applyTheme(theme);
    });
});

// Load saved theme on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
    
    // Load other saved settings
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        // Apply saved settings
        document.querySelector('input[type="email"]').value = settings.email;
        document.querySelector('input[type="text"]').value = settings.username;
        
        // Apply accent color
        const savedColor = settings.accentColor;
        const colorBtn = Array.from(colorButtons).find(btn => 
            getComputedStyle(btn).backgroundColor === savedColor
        );
        if (colorBtn) colorBtn.click();
        
        // Apply notification settings
        settings.notifications.forEach(notification => {
            const toggle = Array.from(toggleSwitches).find(toggle => 
                toggle.closest('.toggle-group').querySelector('label').textContent === notification.name
            );
            if (toggle) toggle.checked = notification.enabled;
        });
    }
});

// Color picker functionality
const colorButtons = document.querySelectorAll('.color-btn');
colorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const color = getComputedStyle(btn).backgroundColor;
        
        // Remove active class from all buttons
        colorButtons.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Update primary color
        root.style.setProperty('--primary-color', color);
        
        // Save color preference
        localStorage.setItem('accent-color', color);
    });
});

// Toggle switches functionality
const toggleSwitches = document.querySelectorAll('.switch input');
toggleSwitches.forEach(toggle => {
    toggle.addEventListener('change', () => {
        const setting = toggle.closest('.toggle-group').querySelector('label').textContent;
        localStorage.setItem(setting, toggle.checked);
        
        // Show notification
        showNotification(`${setting} ${toggle.checked ? 'enabled' : 'disabled'}`);
    });
});

// Save changes functionality
const saveButton = document.querySelector('.save-all-btn');
saveButton.addEventListener('click', () => {
    // Collect all settings
    const settings = {
        email: document.querySelector('input[type="email"]').value,
        username: document.querySelector('input[type="text"]').value,
        theme: document.querySelector('.theme-btn.active').dataset.theme,
        accentColor: getComputedStyle(document.querySelector('.color-btn.active')).backgroundColor,
        notifications: Array.from(toggleSwitches).map(toggle => ({
            name: toggle.closest('.toggle-group').querySelector('label').textContent,
            enabled: toggle.checked
        }))
    };
    
    // Save to localStorage
    localStorage.setItem('settings', JSON.stringify(settings));
    
    // Show success notification
    showNotification('Settings saved successfully!');
});

// Notification function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
} 