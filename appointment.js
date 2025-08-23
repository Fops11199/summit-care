// Appointment Booking SPA Logic
const bookingState = {
    serviceId: null,
    serviceName: null,
    visitType: null,
    doctorId: null,
    doctorName: null,
    date: null,
    time: null
};

// Mock Data
const mockServices = [
    { id: 'general', name: 'General Medicine' },
    { id: 'cardiology', name: 'Cardiology' },
    { id: 'pediatrics', name: 'Pediatrics' }
];
const mockDoctors = [
    { id: 'd1', name: 'Dr. John Smith', photo: 'images/smith.jpg', specialty: 'general' },
    { id: 'd2', name: 'Dr. Emily Carter', photo: 'images/carter.jpg', specialty: 'cardiology' },
    { id: 'd3', name: 'Dr. Michael Lee', photo: 'images/lee.jpg', specialty: 'cardiology' },
    { id: 'd4', name: 'Dr. Sarah Chen', photo: 'images/chen.jpg', specialty: 'pediatrics' }
];

// Utility: Parse URL query params
function getQueryParam(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
}

// Stepper Progress
function setProgress(step) {
    document.querySelectorAll('.stepper-step').forEach((el, idx) => {
        el.classList.toggle('active', idx === step);
    });
}

// Step 1: Visit Details
function handleStep1() {
    const serviceSelect = document.getElementById('serviceSelect');
    const visitTypeRadios = document.getElementsByName('visitType');
    const nextBtn = document.getElementById('step1Next');
    // Pre-select service if URL param exists
    const preService = getQueryParam('service');
    if (preService) {
        serviceSelect.value = preService;
        bookingState.serviceId = preService;
        bookingState.serviceName = mockServices.find(s => s.id === preService)?.name || '';
    }
    serviceSelect.addEventListener('change', () => {
        bookingState.serviceId = serviceSelect.value;
        bookingState.serviceName = mockServices.find(s => s.id === serviceSelect.value)?.name || '';
        nextBtn.disabled = !serviceSelect.value;
    });
    visitTypeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            bookingState.visitType = radio.value;
        });
    });
    nextBtn.addEventListener('click', () => {
        if (!bookingState.serviceId) return;
        document.getElementById('step1').classList.add('hidden');
        document.getElementById('step2').classList.remove('hidden');
        setProgress(1);
        renderDoctors(bookingState.serviceId);
    });
}

// Step 2: Choose Provider
function renderDoctors(serviceId) {
    const grid = document.getElementById('doctorGrid');
    grid.innerHTML = '';
    const filtered = mockDoctors.filter(doc => doc.specialty === serviceId);
    if (filtered.length === 0) {
        grid.innerHTML = '<div class="empty-state">We currently have no specialists available online for this service. Please call our office to book.</div>';
    } else {
        filtered.forEach(doc => {
            const card = document.createElement('div');
            card.className = 'doctor-card';
            card.innerHTML = `<img src="${doc.photo}" alt="${doc.name}" class="doctor-photo"/><div class="doctor-info"><div class="doctor-name">${doc.name}</div><div class="doctor-specialty">${mockServices.find(s => s.id === doc.specialty)?.name || ''}</div></div>`;
            card.tabIndex = 0;
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Select ${doc.name}`);
            card.addEventListener('click', () => selectDoctor(doc));
            card.addEventListener('keydown', e => { if (e.key === 'Enter') selectDoctor(doc); });
            grid.appendChild(card);
        });
        // Any Provider Option
        const anyBtn = document.createElement('button');
        anyBtn.className = 'doctor-card any-provider';
        anyBtn.textContent = 'Any Available Provider';
        anyBtn.addEventListener('click', () => selectDoctor({ id: 'any', name: 'Any Available Provider' }));
        grid.appendChild(anyBtn);
    }
}
function selectDoctor(doc) {
    bookingState.doctorId = doc.id;
    bookingState.doctorName = doc.name;
    document.querySelectorAll('.doctor-card').forEach(card => card.classList.remove('selected'));
    if (doc.id === 'any') {
        document.querySelector('.any-provider').classList.add('selected');
    } else {
        Array.from(document.querySelectorAll('.doctor-card')).find(card => card.textContent.includes(doc.name)).classList.add('selected');
    }
    document.getElementById('step2Next').disabled = false;
}
function handleStep2() {
    document.getElementById('step2Back').addEventListener('click', () => {
        document.getElementById('step2').classList.add('hidden');
        document.getElementById('step1').classList.remove('hidden');
        setProgress(0);
    });
    document.getElementById('step2Next').addEventListener('click', () => {
        if (!bookingState.doctorId) return;
        document.getElementById('step2').classList.add('hidden');
        document.getElementById('step3').classList.remove('hidden');
        setProgress(2);
        renderCalendar();
    });
}

// Step 3: Select Time
function renderCalendar() {
    const calendar = document.getElementById('calendarGrid');
    calendar.innerHTML = '';
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    // Header
    const header = document.createElement('div');
    header.className = 'calendar-header';
    header.textContent = today.toLocaleString('default', { month: 'long', year: 'numeric' });
    calendar.appendChild(header);
    // Days of week
    const daysRow = document.createElement('div');
    daysRow.className = 'calendar-days-row';
    ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(day => {
        const d = document.createElement('div');
        d.className = 'calendar-day-label';
        d.textContent = day;
        daysRow.appendChild(d);
    });
    calendar.appendChild(daysRow);
    // Dates
    let row = document.createElement('div');
    row.className = 'calendar-row';
    for (let i = 0; i < firstDay.getDay(); i++) {
        const empty = document.createElement('div');
        empty.className = 'calendar-cell empty';
        row.appendChild(empty);
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
        const dateObj = new Date(year, month, d);
        const cell = document.createElement('div');
        cell.className = 'calendar-cell';
        cell.textContent = d;
        if (dateObj < today) {
            cell.classList.add('disabled');
        } else {
            cell.tabIndex = 0;
            cell.setAttribute('role', 'button');
            cell.setAttribute('aria-label', `Select ${dateObj.toDateString()}`);
            cell.addEventListener('click', () => selectDate(dateObj));
            cell.addEventListener('keydown', e => { if (e.key === 'Enter') selectDate(dateObj); });
        }
        row.appendChild(cell);
        if ((firstDay.getDay() + d) % 7 === 0) {
            calendar.appendChild(row);
            row = document.createElement('div');
            row.className = 'calendar-row';
        }
    }
    calendar.appendChild(row);
}
function selectDate(dateObj) {
    bookingState.date = dateObj.toISOString().slice(0,10);
    document.querySelectorAll('.calendar-cell').forEach(cell => cell.classList.remove('selected'));
    Array.from(document.querySelectorAll('.calendar-cell')).find(cell => cell.textContent == dateObj.getDate()).classList.add('selected');
    renderTimeSlots(dateObj);
}
function renderTimeSlots(dateObj) {
    const timeGrid = document.getElementById('timeGrid');
    timeGrid.innerHTML = '';
    // Mock time slots
    const slots = ['09:00 AM','09:30 AM','11:00 AM','01:00 PM','02:00 PM','03:30 PM','04:00 PM'];
    slots.forEach(slot => {
        const btn = document.createElement('button');
        btn.className = 'time-slot-btn';
        btn.textContent = slot;
        btn.addEventListener('click', () => selectTime(slot));
        timeGrid.appendChild(btn);
    });
}
function selectTime(slot) {
    bookingState.time = slot;
    document.querySelectorAll('.time-slot-btn').forEach(btn => btn.classList.remove('selected'));
    Array.from(document.querySelectorAll('.time-slot-btn')).find(btn => btn.textContent === slot).classList.add('selected');
    document.getElementById('step3Next').disabled = false;
}
function handleStep3() {
    document.getElementById('step3Back').addEventListener('click', () => {
        document.getElementById('step3').classList.add('hidden');
        document.getElementById('step2').classList.remove('hidden');
        setProgress(1);
    });
    document.getElementById('step3Next').addEventListener('click', () => {
        if (!bookingState.date || !bookingState.time) return;
        document.getElementById('step3').classList.add('hidden');
        document.getElementById('step4').classList.remove('hidden');
        setProgress(3);
        renderSummary();
    });
}

// Step 4: Confirm
function renderSummary() {
    const summary = document.getElementById('summaryDetails');
    const userName = localStorage.getItem('userName') || 'Patient';
    summary.innerHTML = `
        <div><strong>What:</strong> ${bookingState.serviceName}</div>
        <div><strong>Who:</strong> ${bookingState.doctorName}</div>
        <div><strong>When:</strong> ${formatDate(bookingState.date)} at ${bookingState.time}</div>
        <div><strong>Patient:</strong> ${userName}</div>
    `;
}
function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
function handleStep4() {
    document.getElementById('step4Back').addEventListener('click', () => {
        document.getElementById('step4').classList.add('hidden');
        document.getElementById('step3').classList.remove('hidden');
        setProgress(2);
    });
    document.getElementById('confirmBtn').addEventListener('click', () => {
        document.getElementById('confirmBtn').disabled = true;
        document.getElementById('confirmBtn').textContent = 'Booking...';
        setTimeout(() => {
            saveAppointment();
            showSuccessModal();
        }, 1200);
    });
}
function saveAppointment() {
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    appointments.push({
        id: `appt_${Date.now()}`,
        serviceName: bookingState.serviceName,
        doctorId: bookingState.doctorId,
        doctorName: bookingState.doctorName,
        date: bookingState.date,
        time: bookingState.time
    });
    localStorage.setItem('appointments', JSON.stringify(appointments));
}
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('hidden');
    document.getElementById('modalMsg').textContent = `Your appointment with ${bookingState.doctorName} is booked for ${formatDate(bookingState.date)} at ${bookingState.time}. You will receive an email confirmation shortly.`;
    document.getElementById('goDashboardBtn').addEventListener('click', () => {
        window.location.href = 'dashboard.html';
    });
}

// Init
window.addEventListener('DOMContentLoaded', () => {
    setProgress(0);
    handleStep1();
    handleStep2();
    handleStep3();
    handleStep4();
});

// Wait for the DOM to be fully loaded before running the script
// --- STATE MANAGEMENT ---
// A single object to hold the user's selections
// (already declared above as bookingState)

window.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENT SELECTIONS ---
    const steps = [
        document.getElementById('step1'),
        document.getElementById('step2'),
        document.getElementById('step3'),
        document.getElementById('step4')
    ];
    const progressSteps = document.querySelectorAll('.stepper-step');
    // Navigation Buttons
    const nextToStep2Btn = document.getElementById('step1Next');
    const backToStep1Btn = document.getElementById('step2Back');
    const nextToStep3Btn = document.getElementById('step2Next');
    const backToStep2Btn = document.getElementById('step3Back');
    const nextToStep4Btn = document.getElementById('step3Next');
    const backToStep3Btn = document.getElementById('step4Back');
    const confirmBtn = document.getElementById('confirmBtn');
    // Content Containers
    const serviceSelect = document.getElementById('serviceSelect');
    const doctorGrid = document.getElementById('doctorGrid');
    // --- CORE FUNCTIONS ---
    function navigateToStep(stepNumber) {
        steps.forEach((step, index) => {
            step.classList.toggle('hidden', index !== stepNumber);
        });
        updateProgress(stepNumber);
    }
    function updateProgress(currentStep) {
        progressSteps.forEach((step, index) => {
            step.classList.toggle('active', index === currentStep);
        });
    }
    function populateServices() {
        // Already populated in HTML, but could be dynamic if needed
    }
    function renderDoctors(serviceId) {
        doctorGrid.innerHTML = '';
        const filteredDoctors = mockDoctors.filter(doc => doc.specialty === serviceId);
        if (filteredDoctors.length === 0) {
            doctorGrid.innerHTML = '<div class="empty-state">We currently have no specialists available online for this service. Please call our office to book.</div>';
            nextToStep3Btn.disabled = true;
            return;
        }
        filteredDoctors.forEach(doctor => {
            const card = document.createElement('div');
            card.className = 'doctor-card';
            card.dataset.doctorId = doctor.id;
            card.innerHTML = `
                <img src="${doctor.photo}" alt="Photo of ${doctor.name}" class="doctor-photo">
                <div class="doctor-info">
                    <div class="doctor-name">${doctor.name}</div>
                    <div class="doctor-specialty">${mockServices.find(s => s.id === doctor.specialty)?.name || ''}</div>
                </div>
            `;
            card.addEventListener('click', () => {
                document.querySelectorAll('.doctor-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                bookingState.doctorId = doctor.id;
                bookingState.doctorName = doctor.name;
                nextToStep3Btn.disabled = false;
            });
            doctorGrid.appendChild(card);
        });
        // Any Provider Option
        const anyBtn = document.createElement('button');
        anyBtn.className = 'doctor-card any-provider';
        anyBtn.textContent = 'Any Available Provider';
        anyBtn.addEventListener('click', () => {
            document.querySelectorAll('.doctor-card').forEach(c => c.classList.remove('selected'));
            anyBtn.classList.add('selected');
            bookingState.doctorId = 'any';
            bookingState.doctorName = 'Any Available Provider';
            nextToStep3Btn.disabled = false;
        });
        doctorGrid.appendChild(anyBtn);
    }
    function renderSummary() {
        const summary = document.getElementById('summaryDetails');
        const userName = localStorage.getItem('userName') || 'Patient';
        summary.innerHTML = `
            <div><strong>What:</strong> ${bookingState.serviceName}</div>
            <div><strong>Who:</strong> ${bookingState.doctorName}</div>
            <div><strong>When:</strong> ${formatDate(bookingState.date)} at ${bookingState.time}</div>
            <div><strong>Patient:</strong> ${userName}</div>
        `;
    }
    // --- EVENT LISTENERS ---
    serviceSelect.addEventListener('change', () => {
        const selectedId = serviceSelect.value;
        if (selectedId) {
            const selectedService = mockServices.find(s => s.id === selectedId);
            bookingState.serviceId = selectedId;
            bookingState.serviceName = selectedService.name;
            nextToStep2Btn.disabled = false;
        } else {
            nextToStep2Btn.disabled = true;
        }
    });
    nextToStep2Btn.addEventListener('click', () => {
        renderDoctors(bookingState.serviceId);
        navigateToStep(1);
    });
    backToStep1Btn.addEventListener('click', () => navigateToStep(0));
    nextToStep3Btn.addEventListener('click', () => {
        // In a real app, you would render a calendar here
        // For this demo, we will just move to the next step
        bookingState.date = new Date().toISOString().slice(0,10); // Mock data
        bookingState.time = "10:00 AM"; // Mock data
        nextToStep4Btn.disabled = false; // Simulate time selection
        navigateToStep(2);
    });
    backToStep2Btn.addEventListener('click', () => navigateToStep(1));
    nextToStep4Btn.addEventListener('click', () => {
        renderSummary();
        navigateToStep(3);
    });
    backToStep3Btn.addEventListener('click', () => navigateToStep(2));
    confirmBtn.addEventListener('click', () => {
        const newAppointment = { ...bookingState, id: `appt_${Date.now()}` };
        let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        appointments.push(newAppointment);
        localStorage.setItem('appointments', JSON.stringify(appointments));
        document.getElementById('modalMsg').textContent = `Your appointment with ${bookingState.doctorName} is booked for ${formatDate(bookingState.date)} at ${bookingState.time}.`;
        document.getElementById('successModal').classList.remove('hidden');
    });
    document.getElementById('goDashboardBtn').addEventListener('click', () => {
        window.location.href = 'dashboard.html';
    });
    // --- INITIALIZATION ---
    // If you want to pre-select service from URL param
    const preService = getQueryParam('service');
    if (preService) {
        serviceSelect.value = preService;
        bookingState.serviceId = preService;
        bookingState.serviceName = mockServices.find(s => s.id === preService)?.name || '';
        nextToStep2Btn.disabled = false;
    }
    navigateToStep(0); // Start at step 1
});