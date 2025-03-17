// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeSwitch = document.getElementById('theme-switch');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        themeSwitch.checked = savedTheme === 'dark';
    }
    
    // Theme toggle event listener
    themeSwitch.addEventListener('change', function() {
        if (this.checked) {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Testimonial slider functionality
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    
    function showSlide(index) {
        // Hide all slides and remove active class from dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show the current slide and make dot active
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }
    
    // Next button event listener
    nextBtn.addEventListener('click', function() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    });
    
    // Previous button event listener
    prevBtn.addEventListener('click', function() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    });
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    
    // Auto-advance testimonials every 5 seconds
    setInterval(function() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }, 5000);
    
    // Animate stats counter when in viewport
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateStats() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const currentValue = parseInt(stat.textContent);
            
            if (currentValue < target) {
                // Calculate increment (faster for larger numbers)
                const increment = Math.ceil(target / 100);
                const newValue = Math.min(currentValue + increment, target);
                stat.textContent = newValue;
            }
        });
    }
    
    // Check if stats section is in viewport
    const statsSection = document.querySelector('.stats');
    let animationStarted = false;
    
    function checkIfInView() {
        const rect = statsSection.getBoundingClientRect();
        const isInView = (
            rect.top >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        );
        
        if (isInView && !animationStarted) {
            animationStarted = true;
            const statsInterval = setInterval(animateStats, 20);
            
            // Stop animation once all stats reach their target
            setTimeout(() => {
                clearInterval(statsInterval);
                // Ensure all stats show their final values
                statNumbers.forEach(stat => {
                    stat.textContent = stat.getAttribute('data-count');
                });
            }, 2000);
        }
    }
    
    // Check on scroll and initial load
    window.addEventListener('scroll', checkIfInView);
    window.addEventListener('load', checkIfInView);
    
    // Make header sticky on scroll
    const header = document.querySelector('header');
    let lastScrollPos = 0;
    
    window.addEventListener('scroll', function() {
        const currentScrollPos = window.pageYOffset;
        
        if (currentScrollPos > 100) {
            header.classList.add('sticky');
            
            // Hide header when scrolling down, show when scrolling up
            if (currentScrollPos > lastScrollPos) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }
        } else {
            header.classList.remove('sticky');
            header.classList.remove('hidden');
        }
        
        lastScrollPos = currentScrollPos;
    });
    
    // Form submission handling
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            
            if (emailInput.value.trim() !== '') {
                // Display success message
                const successMessage = document.createElement('p');
                successMessage.classList.add('success-message');
                successMessage.textContent = 'Thank you for subscribing!';
                
                // Replace form with success message
                this.innerHTML = '';
                this.appendChild(successMessage);
            }
        });
    }
    
    // Add animation to elements when they come into view
    const animatedElements = document.querySelectorAll('.feature-card, .point, .stat-item, .cta-content');
    
    function checkElementsInView() {
        animatedElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isInView = (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
            );
            
            if (isInView) {
                element.classList.add('animate');
            }
        });
    }
    
    // Run on scroll and initial load
    window.addEventListener('scroll', checkElementsInView);
    window.addEventListener('load', checkElementsInView);
});