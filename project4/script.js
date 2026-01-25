document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initMobileMenu();
    initScrollEffects();
    initContactForm();
    initProjectModals();
    initSkillAnimations();
});

function initNavigation() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                const navLinksMenu = document.getElementById('navLinks');
                if (navLinksMenu.classList.contains('active')) {
                    navLinksMenu.classList.remove('active');
                    document.getElementById('mobileMenuToggle').classList.remove('active');
                }
            }
        });
    });
}

function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container')) {
            navLinks.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
}

function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function initContactForm() {
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');
        
        let isValid = true;
        
        clearErrors();
        
        if (!validateName(name.value)) {
            showError('nameError', 'Please enter a valid name (at least 2 characters)');
            name.classList.add('error');
            isValid = false;
        }
        
        if (!validateEmail(email.value)) {
            showError('emailError', 'Please enter a valid email address');
            email.classList.add('error');
            isValid = false;
        }
        
        if (!validateSubject(subject.value)) {
            showError('subjectError', 'Subject must be at least 5 characters long');
            subject.classList.add('error');
            isValid = false;
        }
        
        if (!validateMessage(message.value)) {
            showError('messageError', 'Message must be at least 10 characters long');
            message.classList.add('error');
            isValid = false;
        }
        
        if (isValid) {
            const formData = {
                name: name.value,
                email: email.value,
                subject: subject.value,
                message: message.value,
                timestamp: new Date().toISOString()
            };
            
            saveContactMessage(formData);
            showSuccessModal();
            form.reset();
        }
    });
    
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('error');
            const errorId = this.id + 'Error';
            document.getElementById(errorId).textContent = '';
        });
    });
}

function validateName(name) {
    return name.trim().length >= 2;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

function validateSubject(subject) {
    return subject.trim().length >= 5;
}

function validateMessage(message) {
    return message.trim().length >= 10;
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
}

function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.textContent = '');
    
    const errorInputs = document.querySelectorAll('.error');
    errorInputs.forEach(input => input.classList.remove('error'));
}

function saveContactMessage(data) {
    let messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    messages.push(data);
    localStorage.setItem('contactMessages', JSON.stringify(messages));
}

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.add('active');
    
    setTimeout(() => {
        modal.classList.remove('active');
    }, 3000);
}

const successModalClose = document.getElementById('successModalClose');
successModalClose.addEventListener('click', () => {
    document.getElementById('successModal').classList.remove('active');
});

function initProjectModals() {
    const viewButtons = document.querySelectorAll('.btn-view');
    const modal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    const modalBody = document.getElementById('modalBody');
    
    const projectDetails = {
        '1': {
            title: 'E-Commerce Platform',
            description: 'A comprehensive full-stack e-commerce solution featuring user authentication, product management, shopping cart functionality, and secure payment integration using Stripe.',
            features: [
                'User authentication and authorization',
                'Product catalog with search and filters',
                'Shopping cart and wishlist',
                'Secure payment processing with Stripe',
                'Order tracking and management',
                'Admin dashboard for inventory management',
                'Real-time notifications',
                'Responsive design for all devices'
            ],
            technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe API', 'JWT', 'Redux'],
            github: 'https://github.com',
            demo: 'https://example.com'
        },
        '2': {
            title: 'Weather Dashboard',
            description: 'An interactive weather tracking application that provides real-time weather data, forecasts, and historical weather patterns with beautiful visualizations.',
            features: [
                'Current weather conditions',
                '7-day weather forecast',
                'Hourly temperature predictions',
                'Interactive weather maps',
                'Location-based services',
                'Multiple city tracking',
                'Weather alerts and notifications',
                'Historical weather data charts'
            ],
            technologies: ['JavaScript', 'OpenWeather API', 'Chart.js', 'Leaflet.js', 'HTML5', 'CSS3'],
            github: 'https://github.com',
            demo: 'https://example.com'
        },
        '3': {
            title: 'Task Management App',
            description: 'A collaborative task management platform designed for teams to organize projects, assign tasks, and track progress in real-time.',
            features: [
                'Create and manage projects',
                'Task assignment and prioritization',
                'Real-time collaboration',
                'Progress tracking with charts',
                'Due date reminders',
                'Team member management',
                'Activity timeline',
                'Export reports'
            ],
            technologies: ['React', 'Firebase', 'Material-UI', 'Context API', 'Cloud Functions'],
            github: 'https://github.com',
            demo: 'https://example.com'
        },
        '4': {
            title: 'Blog Platform',
            description: 'A modern blogging platform with markdown support, rich text editing, and social features for writers and readers.',
            features: [
                'Markdown editor with preview',
                'Rich text formatting',
                'Comment system with moderation',
                'Social sharing integration',
                'SEO optimization',
                'Tag and category system',
                'User profiles and following',
                'Reading time estimation'
            ],
            technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'TailwindCSS', 'NextAuth'],
            github: 'https://github.com',
            demo: 'https://example.com'
        },
        '5': {
            title: 'Portfolio Analyzer',
            description: 'An investment portfolio tracking and analysis tool that helps users monitor their investments and make data-driven decisions.',
            features: [
                'Real-time stock price tracking',
                'Portfolio performance metrics',
                'Investment allocation charts',
                'Profit/loss calculations',
                'Historical performance analysis',
                'Market news integration',
                'Watchlist management',
                'Export portfolio reports'
            ],
            technologies: ['Python', 'Flask', 'D3.js', 'Pandas', 'SQLAlchemy', 'Alpha Vantage API'],
            github: 'https://github.com',
            demo: 'https://example.com'
        },
        '6': {
            title: 'Fitness Tracker',
            description: 'A comprehensive health and fitness tracking mobile application for iOS and Android with workout plans and nutrition tracking.',
            features: [
                'Workout plan creation',
                'Exercise logging with sets/reps',
                'Nutrition tracking and calorie counting',
                'Progress visualization',
                'Body measurements tracking',
                'Custom goal setting',
                'Social features and challenges',
                'Integration with wearable devices'
            ],
            technologies: ['React Native', 'Redux', 'Express', 'MongoDB', 'JWT', 'Chart.js'],
            github: 'https://github.com',
            demo: 'https://example.com'
        }
    };
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const projectId = this.getAttribute('data-project');
            const project = projectDetails[projectId];
            
            if (project) {
                modalBody.innerHTML = `
                    <h2>${project.title}</h2>
                    <p style="color: var(--text-light); margin: 1rem 0 2rem;">${project.description}</p>
                    
                    <h3 style="margin-bottom: 1rem; color: var(--primary-color);">Key Features</h3>
                    <ul style="list-style: none; padding: 0; margin-bottom: 2rem;">
                        ${project.features.map(feature => `
                            <li style="padding: 0.5rem 0; color: var(--text-light);">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" style="display: inline; vertical-align: middle; margin-right: 0.5rem;">
                                    <polyline points="20 6 9 17 4 12"/>
                                </svg>
                                ${feature}
                            </li>
                        `).join('')}
                    </ul>
                    
                    <h3 style="margin-bottom: 1rem; color: var(--primary-color);">Technologies Used</h3>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem;">
                        ${project.technologies.map(tech => `
                            <span class="tag">${tech}</span>
                        `).join('')}
                    </div>
                    
                    <div style="display: flex; gap: 1rem;">
                        <a href="${project.github}" class="btn btn-primary" target="_blank">
                            View Code
                        </a>
                        <a href="${project.demo}" class="btn btn-secondary" target="_blank">
                            Live Demo
                        </a>
                    </div>
                `;
                
                modal.classList.add('active');
            }
        });
    });
    
    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modal.classList.remove('active');
            document.getElementById('successModal').classList.remove('active');
        }
    });
}

function initSkillAnimations() {
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.skill-progress');
                progressBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                });
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const skillsSection = document.querySelector('.skills-grid');
    if (skillsSection) {
        skillObserver.observe(skillsSection);
    }
}
