document.addEventListener('DOMContentLoaded', () => {
    // Selectors
    const navLinks = document.querySelectorAll('.admin-nav-link');
    const sections = document.querySelectorAll('.dashboard-section');
    const adminContent = document.getElementById('adminContent');
    const globalSearch = document.getElementById('globalSearch');

    // State
    let activeSection = 'overview';
    let activeMessageThreadId = null;

    // Initialization
    initDashboard();

    function initDashboard() {
        renderOverview();
        renderPatients();
        renderAppointments();
        renderMessages();
        setupNav();
        setupSearch();
    }

    // Navigation Logic
    function setupNav() {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = link.getAttribute('data-section');
                switchSection(sectionId);
            });
        });

        // Sidebar toggle for mobile (if needed)
        // const sidebar = document.getElementById('adminSidebar');
    }

    function switchSection(sectionId) {
        if (!sectionId || sectionId === '#') return;
        
        activeSection = sectionId;

        // Update Nav UI
        navLinks.forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`.admin-nav-link[data-section="${sectionId}"]`);
        if (activeLink) activeLink.classList.add('active');

        // Update Content UI
        sections.forEach(s => s.classList.remove('active'));
        const targetSection = document.getElementById(`section-${sectionId}`);
        if (targetSection) targetSection.classList.add('active');

        // Refresh data for the section if needed
        if (sectionId === 'overview') renderOverview();
        if (sectionId === 'patients') renderPatients();
        if (sectionId === 'appointments') renderAppointments();
        if (sectionId === 'messages') renderMessages();
    }

    // Render Overview
    function renderOverview() {
        document.getElementById('stat-total-patients').textContent = patientsData.length;
        document.getElementById('stat-today-appointments').textContent = allAppointmentsData.filter(a => a.date === '2026-03-30').length;
        document.getElementById('stat-pending-messages').textContent = messagesData.length;

        // Recent Activity Table (Mocked from patientsData)
        const activityBody = document.querySelector('#recent-activity-table tbody');
        activityBody.innerHTML = patientsData.slice(0, 5).map(p => `
            <tr>
                <td>
                    <div class="patient-cell">
                        <div class="patient-avatar">${p.name.charAt(0)}</div>
                        <span>${p.name}</span>
                    </div>
                </td>
                <td>Patient added to system</td>
                <td>${p.lastVisit}</td>
                <td><span class="pill pill-teal">New</span></td>
            </tr>
        `).join('');

        // Today's Schedule List
        const scheduleList = document.getElementById('today-schedule-list');
        scheduleList.innerHTML = allAppointmentsData.filter(a => a.date === '2026-03-30').map(a => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #eee;">
                <div>
                    <div style="font-weight: 600; font-size: 0.9rem;">${a.time} - ${a.patientName}</div>
                    <div style="font-size: 0.75rem; color: var(--c-mist);">${a.type} Visit</div>
                </div>
                <span class="pill ${a.status === 'Confirmed' ? 'pill-teal' : 'pill-amber'}" style="font-size: 0.7rem;">${a.status}</span>
            </div>
        `).join('');
    }

    // Render Patients
    function renderPatients() {
        const patientsBody = document.querySelector('#patients-table tbody');
        patientsBody.innerHTML = patientsData.map(p => `
            <tr>
                <td>
                    <div class="patient-cell">
                        <div class="patient-avatar">${p.name.charAt(0)}</div>
                        <div>
                            <div style="font-weight: 600;">${p.name}</div>
                            <div style="font-size: 0.75rem; color: var(--c-mist);">${p.email}</div>
                        </div>
                    </div>
                </td>
                <td>#${p.id.toUpperCase()}</td>
                <td>${p.age} / ${p.gender}</td>
                <td>${p.lastVisit}</td>
                <td><span class="pill ${p.status === 'Stable' ? 'pill-teal' : 'pill-amber'}">${p.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="alert('View Details: ${p.name}')"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-sm btn-outline" onclick="alert('Message: ${p.name}')"><i class="fas fa-comment"></i></button>
                </td>
            </tr>
        `).join('');
    }

    // Render Appointments
    function renderAppointments() {
        const appointmentsBody = document.querySelector('#all-appointments-table tbody');
        appointmentsBody.innerHTML = allAppointmentsData.map(a => `
            <tr>
                <td>
                    <div style="font-weight: 600;">${a.date}</div>
                    <div style="font-size: 0.75rem; color: var(--c-mist);">${a.time}</div>
                </td>
                <td>${a.patientName}</td>
                <td>${a.doctor}</td>
                <td><i class="fas ${a.type === 'Virtual' ? 'fa-video' : 'fa-user-md'}" style="margin-right: 8px;"></i> ${a.type}</td>
                <td><span class="pill ${a.status === 'Confirmed' ? 'pill-teal' : a.status === 'Arrived' ? 'pill-teal' : 'pill-amber'}">${a.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-outline"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    }

    // Render Messages
    function renderMessages() {
        const threadList = document.getElementById('message-thread-list');
        threadList.innerHTML = messagesData.map(m => `
            <div class="thread-item ${activeMessageThreadId === m.id ? 'active' : ''}" data-id="${m.id}">
                <h4>${m.patientName}</h4>
                <p>${m.thread[m.thread.length - 1].message}</p>
            </div>
        `).join('');

        // Thread Click Events
        document.querySelectorAll('.thread-item').forEach(item => {
            item.addEventListener('click', () => {
                const threadId = item.getAttribute('data-id');
                selectThread(threadId);
            });
        });
    }

    function selectThread(id) {
        activeMessageThreadId = id;
        renderMessages(); // To update active class

        const thread = messagesData.find(m => m.id === id);
        if (!thread) return;

        document.getElementById('active-chat-name').textContent = thread.patientName;
        
        const chatContainer = document.getElementById('chat-messages-container');
        chatContainer.innerHTML = thread.thread.map(msg => `
            <div class="message-bubble ${msg.sender}">
                ${msg.message}
                <div style="font-size: 0.7rem; opacity: 0.7; margin-top: 4px; text-align: right;">${msg.timestamp}</div>
            </div>
        `).join('');
        
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Send Message Logic
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const chatInput = document.getElementById('chatInput');

    function handleSendMessage() {
        const messageText = chatInput.value.trim();
        if (!messageText || !activeMessageThreadId) return;

        const thread = messagesData.find(m => m.id === activeMessageThreadId);
        if (thread) {
            const now = new Date();
            const timestamp = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            thread.thread.push({
                sender: 'doctor',
                message: messageText,
                timestamp: timestamp
            });

            chatInput.value = '';
            selectThread(activeMessageThreadId);
            renderMessages(); // Update preview
        }
    }

    sendMessageBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendMessage();
    });

    // Search Logic
    function setupSearch() {
        globalSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (activeSection === 'patients') {
                const filtered = patientsData.filter(p => p.name.toLowerCase().includes(query) || p.id.toLowerCase().includes(query));
                // Real-time filtering could be implemented here by re-rendering with filtered data
            }
        });
    }

    // Book Appointment Button
    document.getElementById('bookNewBtn').addEventListener('click', () => {
        switchSection('appointments');
        alert('Opening appointment scheduler...');
    });
});
