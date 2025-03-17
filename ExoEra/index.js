document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
        updateThemeIcon(savedTheme === 'dark-theme');
    } else {
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDarkScheme) {
            body.classList.add('dark-theme');
            updateThemeIcon(true);
        }
    }
    
    themeToggle.addEventListener('click', function() {
        const isDarkTheme = body.classList.toggle('dark-theme');
        localStorage.setItem('theme', isDarkTheme ? 'dark-theme' : '');
        updateThemeIcon(isDarkTheme);
    });
    
    function updateThemeIcon(isDark) {
        const sunIcon = themeToggle.querySelector('.fa-sun');
        const moonIcon = themeToggle.querySelector('.fa-moon');
        
        if (isDark) {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    }
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        // Toggle icon between bars and X
        const icon = mobileMenuBtn.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!mobileMenu.contains(event.target) && !mobileMenuBtn.contains(event.target) && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Dashboard Panel Toggle
    const dashboardBtn = document.getElementById('dashboardBtn');
    const dashboardPanel = document.getElementById('dashboardPanel');
    const closeDashboardBtn = document.getElementById('closeDashboardBtn');
    
    dashboardBtn.addEventListener('click', function() {
        dashboardPanel.classList.add('active');
        // Add overlay to background
        const overlay = document.createElement('div');
        overlay.classList.add('dashboard-overlay');
        document.body.appendChild(overlay);
    });
    
    closeDashboardBtn.addEventListener('click', closeDashboard);
    
    // Close dashboard when clicking overlay
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('dashboard-overlay')) {
            closeDashboard();
        }
    });
    
    function closeDashboard() {
        dashboardPanel.classList.remove('active');
        const overlay = document.querySelector('.dashboard-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
    
    // Reel Video Play Button
    const playButtons = document.querySelectorAll('.play-btn');
    
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            // This would normally trigger video playback
            // For a placeholder, we'll just add a "playing" class
            const videoContainer = this.closest('.reel-video');
            videoContainer.classList.toggle('playing');
            
            // Toggle play/pause icon
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-play')) {
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
                // In a real implementation, you would play the video here
            } else {
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
                // In a real implementation, you would pause the video here
            }
        });
    });
    
    // Implement Search Functionality
    const searchBar = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    
    searchButton.addEventListener('click', performSearch);
    searchBar.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    function performSearch() {
        const searchTerm = searchBar.value.trim();
        if (searchTerm) {
            // In a real implementation, you would redirect to search results page
            // or filter content based on the search term
            console.log('Searching for:', searchTerm);
            // Example: window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
            
            // For demo purposes, show a search notification
            showNotification(`Searching for "${searchTerm}"...`);
        }
    }
    
    // Like, Comment, and Share Button Functionality
    const interactionButtons = document.querySelectorAll('.reel-actions button, .trending-stats span');
    
    interactionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the specific action type
            const isLike = this.innerHTML.includes('fa-heart');
            const isComment = this.innerHTML.includes('fa-comment');
            const isShare = this.innerHTML.includes('fa-share');
            
            if (isLike) {
                // Toggle like status
                this.classList.toggle('liked');
                // In a real implementation, you would send a request to the server
                // to update the like count
                
                // For demo: update the like count
                let likeText = this.innerText.trim();
                let likeCount = parseInt(likeText.match(/\d+/)[0]);
                
                if (this.classList.contains('liked')) {
                    likeCount++;
                    showNotification('Added to your likes!');
                } else {
                    likeCount--;
                    showNotification('Removed from your likes');
                }
                
                this.innerHTML = `<i class="fas fa-heart"></i> ${likeCount}`;
            } else if (isComment) {
                // In a real implementation, you would open a comment form
                showNotification('Comment feature coming soon!');
            } else if (isShare) {
                // In a real implementation, you would open a share dialog
                showNotification('Share feature coming soon!');
            }
        });
    });
    
    // Connect and Apply Button Functionality
    const connectButtons = document.querySelectorAll('.connect-btn');
    const applyButtons = document.querySelectorAll('.apply-btn');
    const registerButtons = document.querySelectorAll('.register-btn');
    
    connectButtons.forEach(button => {
        button.addEventListener('click', function() {
            const connectionName = this.closest('.connection-card').querySelector('h3').innerText;
            this.classList.toggle('connected');
            if (this.classList.contains('connected')) {
                this.innerText = 'Connected';
                showNotification(`Connection request sent to ${connectionName}`);
            } else {
                this.innerText = 'Connect';
                showNotification(`Connection with ${connectionName} removed`);
            }
        });
    });
    
    applyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const roleName = this.closest('.audition-card').querySelector('h3').innerText;
            this.classList.toggle('applied');
            if (this.classList.contains('applied')) {
                this.innerText = 'Applied';
                showNotification(`Application submitted for "${roleName}"`);
            } else {
                this.innerText = 'Apply Now';
                showNotification(`Application withdrawn for "${roleName}"`);
            }
        });
    });
    
    registerButtons.forEach(button => {
        button.addEventListener('click', function() {
            const eventName = this.closest('.meetup-card').querySelector('h3').innerText;
            this.classList.toggle('registered');
            if (this.classList.contains('registered')) {
                this.innerText = 'Registered';
                showNotification(`You're registered for "${eventName}"`);
            } else {
                this.innerText = 'Register';
                showNotification(`Registration canceled for "${eventName}"`);
            }
        });
    });
    
    // Notification System
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.innerText = message;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Smooth Scrolling for Internal Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Handle window resize - hide mobile menu on desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Initialize any tooltips or popovers
    initializeTooltips();
    
    function initializeTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                const tooltipText = this.getAttribute('data-tooltip');
                const tooltip = document.createElement('div');
                tooltip.classList.add('tooltip');
                tooltip.innerText = tooltipText;
                
                // Position the tooltip
                const rect = this.getBoundingClientRect();
                tooltip.style.top = `${rect.top - 30}px`;
                tooltip.style.left = `${rect.left + rect.width / 2}px`;
                
                document.body.appendChild(tooltip);
                
                // Show tooltip
                setTimeout(() => {
                    tooltip.classList.add('show');
                }, 10);
            });
            
            element.addEventListener('mouseleave', function() {
                const tooltip = document.querySelector('.tooltip');
                if (tooltip) {
                    tooltip.classList.remove('show');
                    setTimeout(() => {
                        tooltip.remove();
                    }, 300);
                }
            });
        });
    }
});