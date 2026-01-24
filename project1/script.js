let commentsData = JSON.parse(localStorage.getItem('blogComments')) || {
    'post-1': [],
    'post-2': [],
    'post-3': []
};

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initComments();
    initSearch();
    initSocialShare();
    initMobileMenu();
    console.log('Blog website initialized successfully!');
});

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const blogPosts = document.querySelectorAll('.blog-post');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            const postId = this.getAttribute('data-post');
            if (postId === 'all') {
                blogPosts.forEach(post => {
                    post.classList.remove('hidden');
                    post.classList.add('fade-in');
                });
            } else {
                blogPosts.forEach(post => {
                    post.classList.add('hidden');
                });
                const selectedPost = document.getElementById(postId);
                if (selectedPost) {
                    selectedPost.classList.remove('hidden');
                    selectedPost.classList.add('fade-in');
                    selectedPost.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
}

function initComments() {
    loadComments();
    const submitButtons = document.querySelectorAll('.submit-comment');
    submitButtons.forEach(button => {
        button.addEventListener('click', function() {
            const postId = this.getAttribute('data-post-id');
            const commentForm = this.closest('.comment-form');
            const nameInput = commentForm.querySelector('.comment-name');
            const messageInput = commentForm.querySelector('.comment-message');
            const name = nameInput.value.trim();
            const message = messageInput.value.trim();
            if (name === '' || message === '') {
                alert('Please fill in both name and message fields!');
                return;
            }
            const comment = {
                id: Date.now(),
                author: name,
                text: message,
                date: new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            };
            if (!commentsData[postId]) {
                commentsData[postId] = [];
            }
            commentsData[postId].push(comment);
            localStorage.setItem('blogComments', JSON.stringify(commentsData));
            displayComment(postId, comment);
            nameInput.value = '';
            messageInput.value = '';
            showNotification('Comment added successfully!');
        });
    });
}

function loadComments() {
    Object.keys(commentsData).forEach(postId => {
        const comments = commentsData[postId];
        comments.forEach(comment => {
            displayComment(postId, comment);
        });
    });
}

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
        commentsList.insertBefore(commentElement, commentsList.firstChild);
    }
}

function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const blogPosts = document.querySelectorAll('.blog-post');
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm === '') {
            blogPosts.forEach(post => {
                post.classList.remove('hidden');
            });
            return;
        }
        let foundResults = false;
        blogPosts.forEach(post => {
            const title = post.querySelector('.post-title').textContent.toLowerCase();
            const content = post.querySelector('.post-body').textContent.toLowerCase();
            const tags = post.getAttribute('data-tags')?.toLowerCase() || '';
            if (title.includes(searchTerm) || content.includes(searchTerm) || tags.includes(searchTerm)) {
                post.classList.remove('hidden');
                post.classList.add('fade-in');
                foundResults = true;
            } else {
                post.classList.add('hidden');
            }
        });
        if (!foundResults) {
            showNotification('No blog posts found matching your search.');
        }
    }
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            if (searchInput.value.length >= 3) {
                performSearch();
            } else if (searchInput.value.length === 0) {
                blogPosts.forEach(post => {
                    post.classList.remove('hidden');
                });
            }
        }, 300);
    });
}

function initSocialShare() {
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.getAttribute('data-platform');
            const postElement = this.closest('.blog-post');
            const postTitle = postElement.querySelector('.post-title').textContent;
            const postUrl = window.location.href;
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
            if (shareUrl) {
                window.open(shareUrl, 'share-dialog', 'width=600,height=400');
                showNotification(`Sharing on ${platform.charAt(0).toUpperCase() + platform.slice(1)}...`);
            }
        });
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
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
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

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

window.addEventListener('scroll', function() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
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

console.log('Blog Analytics:');
console.log('Total Posts:', document.querySelectorAll('.blog-post').length);
console.log('Total Comments:', Object.values(commentsData).reduce((sum, comments) => sum + comments.length, 0));
