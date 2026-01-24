let timers = JSON.parse(localStorage.getItem('countdownTimers')) || [];
let timerIntervals = {};

document.addEventListener('DOMContentLoaded', function() {
    loadTimers();
    initEventListeners();
});

function initEventListeners() {
    const startBtn = document.getElementById('startBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const targetDateInput = document.getElementById('targetDate');
    
    const today = new Date().toISOString().split('T')[0];
    targetDateInput.setAttribute('min', today);
    
    startBtn.addEventListener('click', createTimer);
    closeModalBtn.addEventListener('click', closeCelebrationModal);
    
    document.getElementById('celebrationModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeCelebrationModal();
        }
    });
}

function createTimer() {
    const timerName = document.getElementById('timerName').value.trim();
    const targetDate = document.getElementById('targetDate').value;
    const targetTime = document.getElementById('targetTime').value;
    
    if (!timerName) {
        showNotification('Please enter a timer name', 'error');
        return;
    }
    
    if (!targetDate) {
        showNotification('Please select a target date', 'error');
        return;
    }
    
    const targetDateTime = new Date(`${targetDate}T${targetTime}`);
    const now = new Date();
    
    if (targetDateTime <= now) {
        showNotification('Please select a future date and time', 'error');
        return;
    }
    
    const timer = {
        id: Date.now(),
        name: timerName,
        targetDate: targetDate,
        targetTime: targetTime,
        targetDateTime: targetDateTime.toISOString(),
        completed: false
    };
    
    timers.push(timer);
    saveTimers();
    displayTimer(timer);
    
    document.getElementById('timerName').value = '';
    document.getElementById('targetDate').value = '';
    document.getElementById('targetTime').value = '00:00';
    
    showNotification('Countdown timer created successfully!', 'success');
}

function displayTimer(timer) {
    const container = document.getElementById('timersContainer');
    const timerCard = document.createElement('div');
    timerCard.className = 'timer-card';
    timerCard.id = `timer-${timer.id}`;
    
    timerCard.innerHTML = `
        <div class="timer-header">
            <h2 class="timer-name">${escapeHtml(timer.name)}</h2>
            <button class="btn-delete" onclick="deleteTimer(${timer.id})">Delete</button>
        </div>
        <div class="timer-display" id="display-${timer.id}">
            <div class="time-unit">
                <span class="time-value" id="days-${timer.id}">00</span>
                <span class="time-label">Days</span>
            </div>
            <div class="time-unit">
                <span class="time-value" id="hours-${timer.id}">00</span>
                <span class="time-label">Hours</span>
            </div>
            <div class="time-unit">
                <span class="time-value" id="minutes-${timer.id}">00</span>
                <span class="time-label">Minutes</span>
            </div>
            <div class="time-unit">
                <span class="time-value" id="seconds-${timer.id}">00</span>
                <span class="time-label">Seconds</span>
            </div>
        </div>
        <div class="timer-target">
            Target: ${formatTargetDate(timer.targetDate, timer.targetTime)}
        </div>
    `;
    
    container.appendChild(timerCard);
    startCountdown(timer);
}

function startCountdown(timer) {
    updateCountdown(timer);
    
    timerIntervals[timer.id] = setInterval(() => {
        updateCountdown(timer);
    }, 1000);
}

function updateCountdown(timer) {
    const now = new Date().getTime();
    const target = new Date(timer.targetDateTime).getTime();
    const distance = target - now;
    
    if (distance < 0) {
        clearInterval(timerIntervals[timer.id]);
        handleTimerCompletion(timer);
        return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById(`days-${timer.id}`).textContent = padZero(days);
    document.getElementById(`hours-${timer.id}`).textContent = padZero(hours);
    document.getElementById(`minutes-${timer.id}`).textContent = padZero(minutes);
    document.getElementById(`seconds-${timer.id}`).textContent = padZero(seconds);
}

function handleTimerCompletion(timer) {
    const timerCard = document.getElementById(`timer-${timer.id}`);
    const displayArea = document.getElementById(`display-${timer.id}`);
    
    timerCard.classList.add('completed');
    displayArea.innerHTML = `
        <div class="timer-completed">
            <div class="completion-icon">🎉</div>
            <div class="completion-text">Countdown Complete!</div>
        </div>
    `;
    
    timer.completed = true;
    saveTimers();
    
    showCelebration(timer.name);
    playCelebrationSound();
}

function showCelebration(timerName) {
    const modal = document.getElementById('celebrationModal');
    const message = document.getElementById('celebrationMessage');
    message.textContent = `"${timerName}" has reached zero!`;
    modal.classList.add('active');
}

function closeCelebrationModal() {
    const modal = document.getElementById('celebrationModal');
    modal.classList.remove('active');
}

function playCelebrationSound() {
    const audio = document.getElementById('celebrationSound');
    audio.play().catch(() => {});
}

function deleteTimer(timerId) {
    if (!confirm('Are you sure you want to delete this timer?')) {
        return;
    }
    
    clearInterval(timerIntervals[timerId]);
    delete timerIntervals[timerId];
    
    timers = timers.filter(t => t.id !== timerId);
    saveTimers();
    
    const timerCard = document.getElementById(`timer-${timerId}`);
    timerCard.style.animation = 'scaleOut 0.3s ease';
    setTimeout(() => {
        timerCard.remove();
    }, 300);
    
    showNotification('Timer deleted successfully', 'success');
}

function loadTimers() {
    const container = document.getElementById('timersContainer');
    container.innerHTML = '';
    
    timers.forEach(timer => {
        displayTimer(timer);
    });
}

function saveTimers() {
    localStorage.setItem('countdownTimers', JSON.stringify(timers));
}

function formatTargetDate(date, time) {
    const dateObj = new Date(`${date}T${time}`);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    return dateObj.toLocaleDateString('en-US', options);
}

function padZero(num) {
    return num.toString().padStart(2, '0');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    const bgColor = type === 'error' ? '#ef4444' : '#10b981';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes scaleOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.8);
        }
    }
`;
document.head.appendChild(style);
