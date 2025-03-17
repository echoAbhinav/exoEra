// Modal Functions
function openAddProjectModal() {
    document.getElementById('addProjectModal').classList.add('active');
}

function closeModal() {
    document.getElementById('addProjectModal').classList.remove('active');
    resetForm();
}

// Filter Projects
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filter = btn.dataset.filter;
        filterProjects(filter);
    });
});

function filterProjects(category) {
    const projects = document.querySelectorAll('.project-card');
    const portfolioGrid = document.querySelector('.portfolio-grid');
    let hasVisibleProjects = false;

    // Remove existing no results message
    const existingMsg = document.querySelector('.no-results');
    if (existingMsg) existingMsg.remove();

    projects.forEach((project, index) => {
        if (category === 'all' || project.dataset.category === category) {
            project.style.display = 'block';
            project.style.opacity = '0';
            project.style.transform = 'translateY(20px)';
            
            // Stagger animation
            setTimeout(() => {
                project.style.opacity = '1';
                project.style.transform = 'translateY(0)';
            }, index * 100);
            
            hasVisibleProjects = true;
        } else {
            project.style.opacity = '0';
            project.style.transform = 'translateY(20px)';
            setTimeout(() => {
                project.style.display = 'none';
            }, 300);
        }
    });

    // Show no results message if needed
    if (!hasVisibleProjects) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <i class="fas fa-search"></i>
            <p>No projects found in ${category === 'all' ? 'any' : 'the ' + category} category</p>
            <button class="filter-btn" onclick="resetFilters()">
                <i class="fas fa-redo"></i> Show All Projects
            </button>
        `;
        portfolioGrid.appendChild(noResults);
    }
}

// Reset filters
function resetFilters() {
    const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
    allBtn.click();
}

// View Toggle
document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const view = btn.dataset.view;
        document.getElementById('portfolioGrid').className = 
            `portfolio-grid ${view === 'list' ? 'list-view' : ''}`;
    });
});

// Enhanced file input preview
document.getElementById('projectImage').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const container = this.closest('.file-input-container');
    const content = container.querySelector('.file-input-content');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            content.innerHTML = `
                <img src="${e.target.result}" alt="Preview" class="file-input-preview">
            `;
        };
        reader.readAsDataURL(file);
    } else {
        content.innerHTML = `
            <i class="fas fa-cloud-upload-alt"></i>
            <p>Click or drag image to upload</p>
            <span class="file-type">Supported formats: JPG, PNG, GIF</span>
        `;
    }
});

// Enhanced project creation
document.getElementById('addProjectForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    try {
        const formData = {
            title: document.getElementById('projectTitle').value,
            category: document.getElementById('projectCategory').value,
            description: document.getElementById('projectDescription').value,
            technologies: document.getElementById('projectTech').value
                .split(',')
                .map(t => t.trim())
                .filter(t => t),
            image: await readFileAsDataURL(document.getElementById('projectImage').files[0])
        };

        // Validate form data
        if (!formData.title || !formData.category || !formData.description || !formData.technologies.length) {
            throw new Error('Please fill in all required fields');
        }

        const projectCard = createProjectCard(formData);
        const portfolioGrid = document.getElementById('portfolioGrid');
        
        // Add with animation
        projectCard.style.opacity = '0';
        projectCard.style.transform = 'translateY(20px)';
        
        if (portfolioGrid.children.length > 0) {
            portfolioGrid.insertBefore(projectCard, portfolioGrid.firstChild);
        } else {
            portfolioGrid.appendChild(projectCard);
        }

        // Trigger animation
        setTimeout(() => {
            projectCard.style.opacity = '1';
            projectCard.style.transform = 'translateY(0)';
        }, 50);

        showNotification('Project added successfully! 🎉');
        closeModal();
        this.reset();
        
        // Reset file input
        const fileInputContent = document.querySelector('.file-input-content');
        fileInputContent.innerHTML = `
            <i class="fas fa-cloud-upload-alt"></i>
            <p>Click or drag image to upload</p>
            <span class="file-type">Supported formats: JPG, PNG, GIF</span>
        `;
        
    } catch (error) {
        showNotification(error.message, 'error');
    }
});

// Enhanced project card creation
function createProjectCard(data) {
    const div = document.createElement('div');
    div.className = 'project-card';
    div.dataset.category = data.category.toLowerCase();
    
    div.innerHTML = `
        <div class="project-image">
            <img src="${data.image}" alt="${data.title}">
            <div class="project-overlay">
                <div class="project-actions">
                    <button onclick="previewProject(this)" title="Preview">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="editProject(this)" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteProject(this)" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="project-info">
            <h3>${data.title}</h3>
            <p>${data.description}</p>
            <div class="project-meta">
                <span class="project-category">
                    <i class="fas ${getCategoryIcon(data.category)}"></i>
                    ${data.category}
                </span>
                <span class="project-date">
                    <i class="far fa-calendar-alt"></i>
                    ${new Date().toLocaleDateString()}
                </span>
            </div>
            <div class="project-tags">
                ${data.technologies.map(tech => `
                    <span><i class="fas fa-code"></i>${tech}</span>
                `).join('')}
            </div>
        </div>
    `;
    
    return div;
}

// Get appropriate icon for category
function getCategoryIcon(category) {
    const icons = {
        'web': 'fa-globe',
        'mobile': 'fa-mobile-alt',
        'design': 'fa-paint-brush'
    };
    return icons[category] || 'fa-code';
}

// Enhanced Preview Project
function previewProject(btn) {
    const card = btn.closest('.project-card');
    const modal = document.createElement('div');
    modal.className = 'modal preview-modal';
    
    modal.innerHTML = `
        <div class="modal-content preview-content">
            <div class="preview-header">
                <h2>${card.querySelector('h3').textContent}</h2>
                <button class="close-preview" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="preview-body">
                <img src="${card.querySelector('img').src}" alt="Project Preview">
                <div class="preview-info">
                    <p>${card.querySelector('p').textContent}</p>
                    <div class="preview-meta">
                        <span class="category">
                            <i class="fas ${getCategoryIcon(card.querySelector('.project-category').textContent)}"></i>
                            ${card.querySelector('.project-category').textContent}
                        </span>
                        <span class="date">
                            <i class="far fa-calendar-alt"></i>
                            ${card.querySelector('.project-date').textContent}
                        </span>
                    </div>
                    <div class="preview-tags">
                        ${card.querySelector('.project-tags').innerHTML}
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 50);
}

// Enhanced Delete Project
function deleteProject(btn) {
    const card = btn.closest('.project-card');
    
    // Create confirmation modal
    const modal = document.createElement('div');
    modal.className = 'modal delete-modal';
    modal.innerHTML = `
        <div class="modal-content delete-content">
            <h2><i class="fas fa-exclamation-triangle"></i> Delete Project</h2>
            <p>Are you sure you want to delete this project? This action cannot be undone.</p>
            <div class="modal-actions">
                <button class="cancel-btn" onclick="this.closest('.modal').remove()">Cancel</button>
                <button class="delete-btn" onclick="confirmDelete(this)">Delete Project</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 50);
    
    // Store reference to the card
    modal.dataset.cardId = card.id || Date.now().toString();
    card.id = modal.dataset.cardId;
}

function confirmDelete(btn) {
    const modal = btn.closest('.modal');
    const card = document.getElementById(modal.dataset.cardId);
    
    // Animate card removal
    card.style.opacity = '0';
    card.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        card.remove();
        modal.remove();
        showNotification('Project deleted successfully');
    }, 300);
}

// Reset file input
function resetFileInput() {
    const fileInputContent = document.querySelector('.file-input-content');
    fileInputContent.innerHTML = `
        <i class="fas fa-cloud-upload-alt"></i>
        <p>Click or drag image to upload</p>
    `;
    document.querySelector('.file-input-container').style.padding = '0';
}

// Add notification function
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(45deg, #28a745, #34ce57)' : 'linear-gradient(45deg, #dc3545, #ff4444)'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    requestAnimationFrame(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    });
    
    setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Mobile Menu Toggle
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // Prevent body scroll when sidebar is open
    document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
}

// Close sidebar when window is resized above breakpoint
window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Add active class to current nav link
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.parentElement.classList.add('active');
        }
    });
});

// Enhanced view toggle functionality
function toggleView(view) {
    const grid = document.querySelector('.portfolio-grid');
    const viewBtns = document.querySelectorAll('.view-btn');
    
    viewBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });

    grid.className = `portfolio-grid ${view === 'list' ? 'list-view' : ''}`;
    
    // Re-trigger animations
    const projects = document.querySelectorAll('.project-card');
    projects.forEach((project, index) => {
        project.style.opacity = '0';
        project.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            project.style.opacity = '1';
            project.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Enhanced filter functionality with navigation
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const portfolioGrid = document.querySelector('.portfolio-grid');

    // Function to filter and animate projects
    function filterAndAnimateProjects(category) {
        let hasVisibleProjects = false;
        let delay = 0;

        projectCards.forEach(card => {
            card.style.animation = 'none';
            card.offsetHeight; // Trigger reflow

            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
                card.style.animation = `fadeInUp 0.5s ease forwards ${delay}s`;
                delay += 0.1;
                hasVisibleProjects = true;
            } else {
                card.style.opacity = '0';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 500);
            }
        });

        // Scroll to the section smoothly
        portfolioGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });

        return hasVisibleProjects;
    }

    // Create category sections if they don't exist
    function createCategorySections() {
        const categories = ['web', 'mobile', 'design'];
        categories.forEach(category => {
            const existingSection = document.querySelector(`#${category}-section`);
            if (!existingSection) {
                const section = document.createElement('div');
                section.id = `${category}-section`;
                section.className = 'portfolio-section';
                section.innerHTML = `
                    <h2 class="section-title">
                        <i class="fas ${getCategoryIcon(category)}"></i>
                        ${getCategoryTitle(category)}
                    </h2>
                    <div class="section-grid"></div>
                `;
                portfolioGrid.appendChild(section);
            }
        });
    }

    // Function to get category title
    function getCategoryTitle(category) {
        const titles = {
            'web': 'Web Development',
            'mobile': 'Mobile Apps',
            'design': 'UI/UX Design'
        };
        return titles[category] || category;
    }

    // Organize projects into sections
    function organizeProjectsIntoSections() {
        projectCards.forEach(card => {
            const category = card.dataset.category;
            if (category !== 'all') {
                const section = document.querySelector(`#${category}-section .section-grid`);
                if (section) {
                    section.appendChild(card.cloneNode(true));
                }
            }
        });
    }

    // Handle filter button clicks
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.filter;
            
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Handle navigation
            if (category !== 'all') {
                const section = document.querySelector(`#${category}-section`);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }

            const hasProjects = filterAndAnimateProjects(category);

            // Show/hide sections based on filter
            document.querySelectorAll('.portfolio-section').forEach(section => {
                section.style.display = category === 'all' || 
                    section.id === `${category}-section` ? 'block' : 'none';
            });

            // Handle no results
            const existingMsg = document.querySelector('.no-results');
            if (existingMsg) existingMsg.remove();

            if (!hasProjects) {
                showNoResults(category);
            }
        });
    });

    // Initialize sections and organization
    createCategorySections();
    organizeProjectsIntoSections();

    // Check URL hash on page load
    const initialCategory = window.location.hash.slice(1) || 'all';
    const targetBtn = document.querySelector(`.filter-btn[data-filter="${initialCategory}"]`);
    if (targetBtn) {
        targetBtn.click();
    }
});

// Add these styles
const sectionStyles = document.createElement('style');
sectionStyles.textContent = `
    .portfolio-section {
        margin-bottom: 40px;
    }

    .section-title {
        color: #fff;
        font-size: 1.8rem;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        padding-bottom: 10px;
        border-bottom: 2px solid rgba(255, 68, 68, 0.3);
    }

    .section-title i {
        color: #ff4444;
    }

    .section-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 25px;
        animation: fadeIn 0.5s ease;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(sectionStyles); 

// Show/Hide Modal
function openModal() {
    const modal = document.getElementById('addProjectModal');
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('addProjectModal');
    modal.style.display = 'none';
    document.getElementById('addProjectForm').reset();
}

// Handle file preview
document.getElementById('projectFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const preview = document.querySelector('.file-preview');
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const type = file.type.split('/')[0];
        switch(type) {
            case 'image':
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                break;
            case 'video':
                preview.innerHTML = `<video src="${e.target.result}" controls></video>`;
                break;
            case 'audio':
                preview.innerHTML = `<audio src="${e.target.result}" controls></audio>`;
                break;
            default:
                preview.innerHTML = `<div class="file-name">${file.name}</div>`;
        }
    };
    
    reader.readAsDataURL(file);
});

// Handle project type change
document.getElementById('projectType').addEventListener('change', function(e) {
    const fileUpload = document.querySelector('.file-upload');
    const externalLink = document.querySelector('.external-link');
    
    if (e.target.value === 'external') {
        fileUpload.style.display = 'none';
        externalLink.style.display = 'block';
    } else {
        fileUpload.style.display = 'block';
        externalLink.style.display = 'none';
    }
});

// Handle form submission
document.getElementById('addProjectForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form values
    const title = document.getElementById('projectTitle').value;
    const description = document.getElementById('projectDescription').value;
    const imageUrl = document.getElementById('projectImage').value;
    const category = document.getElementById('projectCategory').value;
    const technologies = document.getElementById('projectTech').value
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech !== '');

    // Create project card
    const projectCard = createProjectCard({
        title,
        description,
        imageUrl,
        category,
        technologies
    });

    // Add to projects grid
    const projectsGrid = document.querySelector('.projects-grid');
    projectsGrid.insertBefore(projectCard, projectsGrid.firstChild);

    // Close modal and reset form
    closeModal();
});

// Create project card
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    card.innerHTML = `
        <div class="project-image">
            <img src="${project.imageUrl}" alt="${project.title}">
            <div class="project-overlay">
                <div class="project-category">${getCategoryName(project.category)}</div>
            </div>
        </div>
        <div class="project-info">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-tech">
                ${project.technologies.map(tech => `
                    <span class="tech-tag">${tech}</span>
                `).join('')}
            </div>
        </div>
    `;

    // Add animation class
    card.classList.add('fade-in');
    
    return card;
}

// Helper function to get category display name
function getCategoryName(category) {
    const categories = {
        'web': 'Web Development',
        'mobile': 'Mobile Apps',
        'ui': 'UI/UX Design'
    };
    return categories[category] || category;
}

// Filter projects by category
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const category = this.dataset.category;
        const cards = document.querySelectorAll('.project-card');
        
        cards.forEach(card => {
            if (category === 'all' || card.querySelector('.project-category').textContent === getCategoryName(category)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('addProjectModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Add this CSS for animation
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        animation: fadeIn 0.5s ease-in;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);