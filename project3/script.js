let currentSlide = 0;
let slides = [];
let totalSlides = 0;
let autoPlayInterval = null;
let isPlaying = false;
let slideSpeed = 3000;

document.addEventListener('DOMContentLoaded', function() {
    initSlider();
    setupEventListeners();
});

function initSlider() {
    slides = document.querySelectorAll('.slide');
    totalSlides = slides.length;
    
    document.getElementById('totalSlides').textContent = totalSlides;
    document.getElementById('currentSlide').textContent = currentSlide + 1;
    
    createDots();
    showSlide(0);
}

function setupEventListeners() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const speedRange = document.getElementById('speedRange');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    prevBtn.addEventListener('click', () => navigateSlide(-1));
    nextBtn.addEventListener('click', () => navigateSlide(1));
    playPauseBtn.addEventListener('click', toggleAutoPlay);
    speedRange.addEventListener('input', updateSpeed);
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            goToSlide(index);
        });
    });
    
    document.addEventListener('keydown', handleKeyPress);
}

function showSlide(index) {
    slides.forEach(slide => {
        slide.classList.remove('active');
        slide.classList.add('fade-out');
    });
    
    setTimeout(() => {
        slides.forEach(slide => slide.classList.remove('fade-out'));
        slides[index].classList.add('active');
    }, 100);
    
    updateSlideCounter();
    updateDots();
    updateThumbnails();
}

function navigateSlide(direction) {
    currentSlide += direction;
    
    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    }
    
    showSlide(currentSlide);
}

function goToSlide(index) {
    currentSlide = index;
    showSlide(currentSlide);
}

function nextSlide() {
    navigateSlide(1);
}

function updateSlideCounter() {
    document.getElementById('currentSlide').textContent = currentSlide + 1;
}

function createDots() {
    const dotsContainer = document.getElementById('dotsContainer');
    dotsContainer.innerHTML = '';
    
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
}

function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        if (index === currentSlide) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function updateThumbnails() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumbnail, index) => {
        if (index === currentSlide) {
            thumbnail.classList.add('active');
        } else {
            thumbnail.classList.remove('active');
        }
    });
}

function toggleAutoPlay() {
    if (isPlaying) {
        stopAutoPlay();
    } else {
        startAutoPlay();
    }
}

function startAutoPlay() {
    isPlaying = true;
    const playIcon = document.querySelector('.play-icon');
    const pauseIcon = document.querySelector('.pause-icon');
    const playPauseText = document.getElementById('playPauseText');
    
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
    playPauseText.textContent = 'Pause';
    
    autoPlayInterval = setInterval(nextSlide, slideSpeed);
}

function stopAutoPlay() {
    isPlaying = false;
    const playIcon = document.querySelector('.play-icon');
    const pauseIcon = document.querySelector('.pause-icon');
    const playPauseText = document.getElementById('playPauseText');
    
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
    playPauseText.textContent = 'Play';
    
    clearInterval(autoPlayInterval);
}

function updateSpeed(e) {
    slideSpeed = parseInt(e.target.value);
    const speedValue = document.getElementById('speedValue');
    speedValue.textContent = (slideSpeed / 1000) + 's';
    
    if (isPlaying) {
        stopAutoPlay();
        startAutoPlay();
    }
}

function handleKeyPress(e) {
    if (e.key === 'ArrowLeft') {
        navigateSlide(-1);
    } else if (e.key === 'ArrowRight') {
        navigateSlide(1);
    } else if (e.key === ' ') {
        e.preventDefault();
        toggleAutoPlay();
    }
}

window.addEventListener('visibilitychange', function() {
    if (document.hidden && isPlaying) {
        stopAutoPlay();
    }
});
