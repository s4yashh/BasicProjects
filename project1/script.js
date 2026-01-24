// ========================================
// Global Variables and State Management
// ========================================

// Store comments for each blog post in local storage
let commentsData = JSON.parse(localStorage.getItem('blogComments')) || {
    'post-1': [],
    'post-2': [],
    'post-3': []
};

// ========================================
// Initialization - DOM Content Loaded
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initComments();
    initSearch();
    initSocialShare();
    initMobileMenu();
    
    console.log('Blog website initialized successfully!');
});

// ========================================
// Navigation Functionality
// ========================================
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const blogPosts = document.querySelectorAll('.blog-post');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get the post ID from data attribute
            const postId = this.getAttribute('data-post');
            
            // Show/hide blog posts based on selection
            if (postId === 'all') {
                // Show all posts with fade-in animation
                blogPosts.forEach(post => {
                    post.classList.remove('hidden');
                    post.classList.add('fade-in');
                });
            } else {
                // Hide all posts first
                blogPosts.forEach(post => {
                    post.classList.add('hidden');
                });
                
                // Show only the selected post
                const selectedPost = document.getElementById(postId);
                if (selectedPost) {
                    selectedPost.classList.remove('hidden');
                    selectedPost.classList.add('fade-in');
                    
                    // Smooth scroll to the post
                    selectedPost.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}

// ========================================
// Mobile Menu (Hamburger) Functionality
// ========================================
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger to X
            this.classList.toggle('active');
        });
        
        // Close mobile menu when a link is clicked
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
}

// ========================================
// Comments System Functionality
// ========================================
function initComments() {
    // Load existing comments from localStorage
    loadComments();
    
    // Add event listeners to all submit buttons
    const submitButtons = document.querySelectorAll('.submit-comment');
    
    submitButtons.forEach(button => {
        button.addEventListener('click', function() {
            const postId = this.getAttribute('data-post-id');
            const commentForm = this.closest('.comment-form');
            const nameInput = commentForm.querySelector('.comment-name');
            const messageInput = commentForm.querySelector('.comment-message');
            
            // Get input values
            const name = nameInput.value.trim();
            const message = messageInput.value.trim();
            
            // Validate inputs
            if (name === '' || message === '') {
                alert('Please fill in both name and message fields!');
                return;
            }
            
            // Create comment object
            const comment = {
                id: Date.now(), // Unique ID based on timestamp
                author: name,
                text: message,
                date: new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            };
            
            // Add comment to the data structure
            if (!commentsData[postId]) {
                commentsData[postId] = [];
            }
            commentsData[postId].push(comment);
            
            // Save to localStorage
            localStorage.setItem('blogComments', JSON.stringify(commentsData));
            
            // Display the new comment
            displayComment(postId, comment);
            
            // Clear the form
            nameInput.value = '';
            messageInput.value = '';
            
            // Show success feedback
            showNotification('Comment added successfully!');
        });
    });
}

// Load and display all comments from localStorage
function loadComments() {
    Object.keys(commentsData).forEach(postId => {
        const comments = commentsData[postId];
        comments.forEach(comment => {
            displayComment(postId, comment);
        });
    });
}

// Display a single comment in the comments list
function displayComment(postId, comment) {
    const commentsList = document.querySelector(`.comments-list[data-post-id="${postId}"]`);
    
    if (commentsList) {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment fade-in';
        commentElement.innerHTML = `
            <div class="comment-header">
                <span class="comment-author">${escapeHtml(comment.author)}</span>
                <span class="comment-date">${comment.date}</span>
            </div>
            <p class="comment-text">${escapeHtml(comment.text)}</p>
        `;
        
        // Add to the top of comments list
        commentsList.insertBefore(commentElement, commentsList.firstChild);
    }
}

// ========================================
// Search Functionality
// ========================================
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const blogPosts = document.querySelectorAll('.blog-post');
    
    // Function to perform search
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // Show all posts if search is empty
            blogPosts.forEach(post => {
                post.classList.remove('hidden');
            });
            return;
        }
        
        let foundResults = false;
        
        blogPosts.forEach(post => {
            // Search in title, content, and tags
            const title = post.querySelector('.post-title').textContent.toLowerCase();
            const content = post.querySelector('.post-body').textContent.toLowerCase();
            const tags = post.getAttribute('data-tags')?.toLowerCase() || '';
            
            // Check if search term matches
            if (title.includes(searchTerm) || content.includes(searchTerm) || tags.includes(searchTerm)) {
                post.classList.remove('hidden');
                post.classList.add('fade-in');
                foundResults = true;
            } else {
                post.classList.add('hidden');
            }
        });
        
        // Show message if no results found
        if (!foundResults) {
            showNotification('No blog posts found matching your search.');
        }
    }
    
    // Search on button click
    searchBtn.addEventListener('click', performSearch);
    
    // Search on Enter key press
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Real-time search as user types (optional - debounced)
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            if (searchInput.value.length >= 3) {
                performSearch();
            } else if (searchInput.value.length === 0) {
                // Show all posts when search is cleared
                blogPosts.forEach(post => {
                    post.classList.remove('hidden');
                });
            }
        }, 300); // Wait 300ms after user stops typing
    });
}

// ========================================
// Social Share Functionality
// ========================================
function initSocialShare() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.getAttribute('data-platform');
            const postElement = this.closest('.blog-post');
            const postTitle = postElement.querySelector('.post-title').textContent;
            const postUrl = window.location.href;
            
            // Create share URLs for different platforms
            let shareUrl = '';
            
            switch(platform) {
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(postUrl)}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
                    break;
            }
            
            // Open share window
            if (shareUrl) {
                window.open(shareUrl, 'share-dialog', 'width=600,height=400');
                showNotification(`Sharing on ${platform.charAt(0).toUpperCase() + platform.slice(1)}...`);
            }
        });
    });
}

// ========================================
// Utility Functions
// ========================================

// Escape HTML to prevent XSS attacks in comments
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show notification message to user
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add notification animations to the page
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========================================
// Additional Features and Enhancements
// ========================================

// Smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add reading progress indicator
window.addEventListener('scroll', function() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    // Create progress bar if it doesn't exist
    let progressBar = document.getElementById('reading-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.id = 'reading-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(to right, #2563eb, #f59e0b);
            z-index: 10000;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
    }
    
    progressBar.style.width = scrolled + '%';
});

// Log analytics (for demonstration purposes)
console.log('Blog Analytics:');
console.log('Total Posts:', document.querySelectorAll('.blog-post').length);
console.log('Total Comments:', Object.values(commentsData).reduce((sum, comments) => sum + comments.length, 0));
