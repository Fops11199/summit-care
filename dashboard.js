// Summit Care Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initDashboard();
    initUserMenu();
    initLogout();
    
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Personalize dashboard
    const userData = JSON.parse(localStorage.getItem('summitCare_userData') || '{}');
    if (userData && userData.fullName) {
        const welcomeEl = document.getElementById('dashboardWelcome');
        if (welcomeEl) {
            welcomeEl.textContent = `Welcome, ${userData.fullName}!`;
        }
        // You can also personalize other dashboard sections here
    }
});

// Initialize Dashboard
function initDashboard() {
    // Check if user is logged in
    if (!isUserLoggedIn()) {
        redirectToLogin();
        return;
    }
    
    // Load user data
    loadUserData();
    
    // Initialize dashboard components
    initAppointmentActions();
    initMessageActions();
    initQuickActions();
    
    // Load personalized data
    loadHealthSummary();
    loadAppointments();
    loadMessages();
    loadActivity();
}

// User Authentication Check
function isUserLoggedIn() {
    // Check localStorage for user session
    const userSession = localStorage.getItem('summitCare_userSession');
    if (!userSession) return false;
    
    try {
        const session = JSON.parse(userSession);
        const now = new Date().getTime();
        
        // Check if session is expired (24 hours)
        if (now - session.timestamp > 24 * 60 * 60 * 1000) {
            localStorage.removeItem('summitCare_userSession');
            return false;
        }
        
        return true;
    } catch (e) {
        localStorage.removeItem('summitCare_userSession');
        return false;
    }
}

// Redirect to login if not authenticated
function redirectToLogin() {
    window.location.href = 'login.html';
}

// Load User Data
function loadUserData() {
    const userData = getUserData();
    if (userData) {
        // Update user name in header
        const userNameElements = document.querySelectorAll('.user-name, .user-first-name');
        userNameElements.forEach(element => {
            element.textContent = userData.firstName || 'User';
        });
        
        // Update welcome message
        const welcomeTitle = document.querySelector('.welcome-title');
        if (welcomeTitle) {
            welcomeTitle.innerHTML = `Welcome back, <span class="user-first-name">${userData.firstName || 'User'}</span>!`;
        }
    }
}

// Get User Data from localStorage
function getUserData() {
    try {
        const userData = localStorage.getItem('summitCare_userData');
        return userData ? JSON.parse(userData) : null;
    } catch (e) {
        return null;
    }
}

// Load Health Summary
function loadHealthSummary() {
    // In a real app, this would fetch from API
    // For demo, we'll use mock data
    const healthData = {
        bloodPressure: '120/80',
        weight: '165 lbs',
        medications: '3 Active',
        nextVisit: 'March 28'
    };
    
    // Update health summary cards
    updateHealthSummary(healthData);
}

// Update Health Summary Display
function updateHealthSummary(data) {
    const summaryCards = document.querySelectorAll('.summary-card');
    
    summaryCards.forEach(card => {
        const metricElement = card.querySelector('.metric');
        if (metricElement) {
            const cardType = card.querySelector('h3').textContent.toLowerCase();
            
            switch (cardType) {
                case 'blood pressure':
                    metricElement.textContent = data.bloodPressure;
                    break;
                case 'weight':
                    metricElement.textContent = data.weight;
                    break;
                case 'medications':
                    metricElement.textContent = data.medications;
                    break;
                case 'next visit':
                    metricElement.textContent = data.nextVisit;
                    break;
            }
        }
    });
}

// Load Appointments
function loadAppointments() {
    // In a real app, this would fetch from API
    // For demo, we'll use mock data
    const appointments = [
        {
            date: 'MAR 28',
            time: '10:00 AM',
            doctor: 'Dr. Sarah Johnson',
            type: 'Cardiology Consultation',
            visitType: 'virtual'
        },
        {
            date: 'APR 5',
            time: '2:30 PM',
            doctor: 'Dr. Michael Chen',
            type: 'Annual Physical',
            visitType: 'in-person'
        }
    ];
    
    updateAppointments(appointments);
}

// Update Appointments Display
function updateAppointments(appointments) {
    const appointmentList = document.querySelector('.appointment-list');
    if (!appointmentList) return;
    
    // Clear existing appointments
    appointmentList.innerHTML = '';
    
    appointments.forEach(appointment => {
        const appointmentElement = createAppointmentElement(appointment);
        appointmentList.appendChild(appointmentElement);
    });
}

// Create Appointment Element
function createAppointmentElement(appointment) {
    const appointmentDiv = document.createElement('div');
    appointmentDiv.className = 'appointment-item';
    
    const visitTypeClass = appointment.visitType === 'virtual' ? 'virtual' : 'in-person';
    const visitTypeIcon = appointment.visitType === 'virtual' ? 'fa-video' : 'fa-user-md';
    
    appointmentDiv.innerHTML = `
        <div class="appointment-time">
            <div class="date">${appointment.date}</div>
            <div class="time">${appointment.time}</div>
        </div>
        <div class="appointment-details">
            <h4>${appointment.doctor}</h4>
            <p>${appointment.type}</p>
            <span class="appointment-type ${visitTypeClass}">
                <i class="fas ${visitTypeIcon}"></i> ${appointment.visitType === 'virtual' ? 'Virtual Visit' : 'In-Person'}
            </span>
        </div>
        <div class="appointment-actions">
            <button class="btn btn-sm btn-outline">Reschedule</button>
            <button class="btn btn-sm btn-primary">${appointment.visitType === 'virtual' ? 'Join Call' : 'View Details'}</button>
        </div>
    `;
    
    return appointmentDiv;
}

// Load Messages
function loadMessages() {
    // In a real app, this would fetch from API
    // For demo, we'll use mock data
    const messages = [
        {
            sender: 'Dr. Sarah Johnson',
            avatar: 'fa-user-md',
            message: 'Your lab results are ready. Please review them in your portal.',
            time: '2 hours ago',
            unread: true
        },
        {
            sender: 'Nurse Maria',
            avatar: 'fa-user-nurse',
            message: 'Reminder: Don\'t forget to take your medication at 8 PM tonight.',
            time: '1 day ago',
            unread: false
        },
        {
            sender: 'System Notification',
            avatar: 'fa-bell',
            message: 'Your prescription refill has been approved and shipped.',
            time: '3 days ago',
            unread: false
        }
    ];
    
    updateMessages(messages);
}

// Update Messages Display
function updateMessages(messages) {
    const messageList = document.querySelector('.message-list');
    if (!messageList) return;
    
    // Clear existing messages
    messageList.innerHTML = '';
    
    messages.forEach(message => {
        const messageElement = createMessageElement(message);
        messageList.appendChild(messageElement);
    });
}

// Create Message Element
function createMessageElement(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-item ${message.unread ? 'unread' : ''}`;
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas ${message.avatar}"></i>
        </div>
        <div class="message-content">
            <div class="message-header">
                <h4>${message.sender}</h4>
                <span class="message-time">${message.time}</span>
            </div>
            <p>${message.message}</p>
        </div>
        ${message.unread ? '<div class="message-status"><span class="unread-indicator"></span></div>' : ''}
    `;
    
    return messageDiv;
}

// Load Activity
function loadActivity() {
    // In a real app, this would fetch from API
    // For demo, we'll use mock data
    const activities = [
        {
            type: 'Appointment Scheduled',
            description: 'Cardiology consultation with Dr. Johnson',
            time: '2 hours ago',
            icon: 'fa-calendar-check'
        },
        {
            type: 'Prescription Refilled',
            description: 'Metformin 500mg - 30 day supply',
            time: '1 day ago',
            icon: 'fa-pills'
        },
        {
            type: 'Lab Results Uploaded',
            description: 'Blood work results from March 10',
            time: '3 days ago',
            icon: 'fa-file-medical'
        }
    ];
    
    updateActivity(activities);
}

// Update Activity Display
function updateActivity(activities) {
    const activityTimeline = document.querySelector('.activity-timeline');
    if (!activityTimeline) return;
    
    // Clear existing activities
    activityTimeline.innerHTML = '';
    
    activities.forEach(activity => {
        const activityElement = createActivityElement(activity);
        activityTimeline.appendChild(activityElement);
    });
}

// Create Activity Element
function createActivityElement(activity) {
    const activityDiv = document.createElement('div');
    activityDiv.className = 'activity-item';
    
    activityDiv.innerHTML = `
        <div class="activity-icon">
            <i class="fas ${activity.icon}"></i>
        </div>
        <div class="activity-content">
            <h4>${activity.type}</h4>
            <p>${activity.description}</p>
            <span class="activity-time">${activity.time}</span>
        </div>
    `;
    
    return activityDiv;
}

// Initialize User Menu
function initUserMenu() {
    const userMenuToggle = document.querySelector('.user-menu-toggle');
    const userDropdown = document.querySelector('.user-dropdown');
    
    if (userMenuToggle && userDropdown) {
        userMenuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            userDropdown.classList.toggle('open');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userMenuToggle.contains(e.target) && !userDropdown.contains(e.target)) {
                userMenuToggle.setAttribute('aria-expanded', 'false');
                userDropdown.classList.remove('open');
            }
        });
    }
}

// Initialize Logout
function initLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

// Logout Function
function logout() {
    // Clear user session
    localStorage.removeItem('summitCare_userSession');
    localStorage.removeItem('summitCare_userData');
    
    // Redirect to login
    window.location.href = 'login.html';
}

// Initialize Appointment Actions
function initAppointmentActions() {
    document.addEventListener('click', function(e) {
        if (e.target.matches('.btn-outline')) {
            const appointmentItem = e.target.closest('.appointment-item');
            if (appointmentItem) {
                // Handle reschedule
                showToast('Reschedule functionality would be implemented here.', 'info');
            }
        } else if (e.target.matches('.btn-primary')) {
            const appointmentItem = e.target.closest('.appointment-item');
            if (appointmentItem) {
                const buttonText = e.target.textContent.trim();
                if (buttonText === 'Join Call') {
                    showToast('Starting virtual consultation...', 'info');
                } else if (buttonText === 'View Details') {
                    showToast('Opening appointment details...', 'info');
                }
            }
        }
    });
}

// Initialize Message Actions
function initMessageActions() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.message-item')) {
            const messageItem = e.target.closest('.message-item');
            if (messageItem.classList.contains('unread')) {
                messageItem.classList.remove('unread');
                const unreadIndicator = messageItem.querySelector('.unread-indicator');
                if (unreadIndicator) {
                    unreadIndicator.remove();
                }
            }
        }
    });
}

// Initialize Quick Actions
function initQuickActions() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.quick-action-card')) {
            const actionCard = e.target.closest('.quick-action-card');
            const actionType = actionCard.querySelector('h3').textContent;
            
            showToast(`${actionType} functionality would be implemented here.`, 'info');
        }
    });
}

// Toast Notification System
function showToast(message, type = 'info') {
    let toast = document.createElement('div');
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    
    const colors = {
        info: { bg: 'rgba(135, 206, 235, 0.95)', color: '#00324a' },
        success: { bg: 'rgba(144, 238, 144, 0.95)', color: '#054105' },
        warning: { bg: 'rgba(255, 193, 7, 0.95)', color: '#856404' },
        error: { bg: 'rgba(220, 53, 69, 0.95)', color: '#ffffff' }
    };
    
    const style = colors[type] || colors.info;
    
    toast.style.cssText = `
        position: fixed;
        left: 50%;
        bottom: 32px;
        transform: translateX(-50%);
        background: ${style.bg};
        color: ${style.color};
        padding: 16px 24px;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        z-index: 9999;
        font-weight: 500;
        max-width: 90vw;
        text-align: center;
        backdrop-filter: blur(8px);
    `;
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Animate in
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    toast.style.transition = 'all 300ms ease-out';
    
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
