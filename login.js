// Summit Care - Login Page JavaScript
// Mock Authentication with 5 Dummy Patient Accounts

// ─── Dummy Accounts Database ───────────────────────────────────────────
const DUMMY_ACCOUNTS = [
    {
        id: 'user_001',
        email: 'john.doe@patient.com',
        password: 'summit123',
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
        role: 'Patient',
        dob: '1985-04-12',
        bloodType: 'O+',
        doctor: 'Dr. Sarah Jenkins',
        nextVisit: 'Apr 2',
        bloodPressure: '118/76',
        weight: '178 lbs',
        medications: '2 Active'
    },
    {
        id: 'user_002',
        email: 'maria.santos@patient.com',
        password: 'summit123',
        firstName: 'Maria',
        lastName: 'Santos',
        fullName: 'Maria Santos',
        role: 'Patient',
        dob: '1992-08-25',
        bloodType: 'A+',
        doctor: 'Dr. Marcus Thorne',
        nextVisit: 'Apr 7',
        bloodPressure: '122/80',
        weight: '135 lbs',
        medications: '1 Active'
    },
    {
        id: 'user_003',
        email: 'david.chen@patient.com',
        password: 'summit123',
        firstName: 'David',
        lastName: 'Chen',
        fullName: 'David Chen',
        role: 'Patient',
        dob: '1978-01-30',
        bloodType: 'B-',
        doctor: 'Dr. Lisa Park',
        nextVisit: 'Apr 14',
        bloodPressure: '130/85',
        weight: '192 lbs',
        medications: '4 Active'
    },
    {
        id: 'user_004',
        email: 'sarah.johnson@patient.com',
        password: 'summit123',
        firstName: 'Sarah',
        lastName: 'Johnson',
        fullName: 'Sarah Johnson',
        role: 'Patient',
        dob: '1990-11-05',
        bloodType: 'AB+',
        doctor: 'Dr. Emma Rhodes',
        nextVisit: 'May 1',
        bloodPressure: '115/72',
        weight: '148 lbs',
        medications: '0 Active'
    },
    {
        id: 'user_005',
        email: 'michael.torres@patient.com',
        password: 'summit123',
        firstName: 'Michael',
        lastName: 'Torres',
        fullName: 'Michael Torres',
        role: 'Patient',
        dob: '1965-06-18',
        bloodType: 'O-',
        doctor: 'Dr. Marcus Thorne',
        nextVisit: 'Apr 20',
        bloodPressure: '138/88',
        weight: '210 lbs',
        medications: '5 Active'
    }
];

// ─── DOM Ready ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (!loginForm) return;

    // Inject the demo credentials helper UI
    injectCredentialsHelper();

    // Password visibility toggle
    const passwordToggle = document.querySelector('.password-toggle');
    if (passwordToggle) {
        passwordToggle.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            const icon = this.querySelector('i');
            if (icon) icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        });
    }

    // Remember me pre-fill
    const remembered = localStorage.getItem('summitCare_remember');
    const rememberCheckbox = document.querySelector('input[name="remember"]');
    if (remembered === 'true' && rememberCheckbox) {
        rememberCheckbox.checked = true;
        const savedEmail = localStorage.getItem('summitCare_email');
        if (savedEmail && emailInput) emailInput.value = savedEmail;
    }

    if (rememberCheckbox) {
        rememberCheckbox.addEventListener('change', function () {
            if (this.checked) {
                localStorage.setItem('summitCare_remember', 'true');
                localStorage.setItem('summitCare_email', emailInput.value);
            } else {
                localStorage.removeItem('summitCare_remember');
                localStorage.removeItem('summitCare_email');
            }
        });
    }

    // ─── Form Submission ───────────────────────────────────────────────
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = (emailInput.value || '').trim().toLowerCase();
        const password = (passwordInput.value || '');

        if (!email || !password) {
            showLoginError('Please enter your email and password.');
            return;
        }

        // Get button ref — use document.querySelector as a fallback
        const submitBtn = document.querySelector('#loginForm button[type="submit"]')
                       || loginForm.querySelector('button[type="submit"]');

        if (!submitBtn) {
            showLoginError('Form error. Please refresh the page.');
            return;
        }

        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In&hellip;';
        submitBtn.disabled = true;

        // Simulate network delay with error guard
        setTimeout(function () {
            try {
                // 1. Check built-in dummy accounts
                let match = DUMMY_ACCOUNTS.find(function (acc) {
                    return acc.email === email && acc.password === password;
                });

                // 2. Check accounts registered via the signup form
                if (!match) {
                    const raw = localStorage.getItem('summitCare_registeredUsers');
                    const registeredUsers = raw ? JSON.parse(raw) : [];
                    match = registeredUsers.find(function (u) {
                        return u.email === email && u.password === password;
                    });
                }

                if (match) {
                    // Persist session
                    localStorage.setItem('summitCare_userData', JSON.stringify(match));
                    localStorage.setItem('summitCare_userSession', JSON.stringify({
                        userId: match.id,
                        timestamp: Date.now(),
                        token: 'demo_' + Math.random().toString(36).substr(2, 9)
                    }));

                    const remCb = document.querySelector('input[name="remember"]');
                    if (remCb && remCb.checked) {
                        localStorage.setItem('summitCare_remember', 'true');
                        localStorage.setItem('summitCare_email', email);
                    }

                    showToast('Welcome back, ' + match.firstName + '! Redirecting\u2026', 'success');
                    setTimeout(function () { window.location.href = 'dashboard.html'; }, 1400);

                } else {
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.disabled = false;
                    showLoginError('Invalid email or password. Check the demo credentials below or sign up first.');
                    emailInput.focus();
                }
            } catch (err) {
                // Surface any silent errors
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
                showLoginError('Something went wrong: ' + err.message + '. Please try again.');
                console.error('Login error:', err);
            }
        }, 1200);
    });
});

// ─── Inject Credentials Helper ─────────────────────────────────────────
function injectCredentialsHelper() {
    const wrapper = document.querySelector('.auth-form-wrapper');
    if (!wrapper) return;

    const rows = DUMMY_ACCOUNTS.map(acc => `
        <tr>
            <td>
                <button class="quick-fill-btn" data-email="${acc.email}" data-pass="${acc.password}" title="Click to autofill">
                    <i class="fas fa-user-circle"></i> ${acc.fullName}
                </button>
            </td>
            <td class="cred-email">${acc.email}</td>
        </tr>
    `).join('');

    const box = document.createElement('div');
    box.className = 'demo-accounts-box';
    box.innerHTML = `
        <details>
            <summary><i class="fas fa-key"></i> Demo Accounts <span class="demo-badge">5 accounts</span></summary>
            <p class="demo-hint">All passwords: <strong>summit123</strong> &nbsp;·&nbsp; Click a name to autofill.</p>
            <table class="demo-table">
                <thead><tr><th>Name</th><th>Email</th></tr></thead>
                <tbody>${rows}</tbody>
            </table>
        </details>
    `;

    // Inline styles for reliability
    box.style.cssText = `
        margin-top: 1.5rem;
        background: rgba(0, 184, 158, 0.04);
        border: 1.5px solid rgba(0, 184, 158, 0.2);
        border-radius: 12px;
        overflow: hidden;
        font-size: 0.85rem;
    `;

    const detailsEl = box.querySelector('details');
    detailsEl.style.cssText = `padding: 0;`;

    const summaryEl = box.querySelector('summary');
    summaryEl.style.cssText = `
        cursor: pointer;
        padding: 0.75rem 1rem;
        font-weight: 600;
        color: var(--c-teal-700, #0d7377);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        list-style: none;
        background: rgba(0, 184, 158, 0.06);
        border-bottom: 1px solid rgba(0, 184, 158, 0.12);
        user-select: none;
    `;

    const badge = box.querySelector('.demo-badge');
    badge.style.cssText = `
        margin-left: auto;
        background: var(--c-teal-500, #00B89E);
        color: white;
        font-size: 0.72rem;
        padding: 2px 8px;
        border-radius: 99px;
    `;

    const hint = box.querySelector('.demo-hint');
    hint.style.cssText = `
        margin: 0.75rem 1rem 0.5rem;
        color: #555;
    `;

    const table = box.querySelector('.demo-table');
    table.style.cssText = `
        width: 100%;
        border-collapse: collapse;
        margin: 0;
        padding: 0 1rem 1rem;
    `;

    box.querySelectorAll('th').forEach(th => {
        th.style.cssText = `text-align: left; padding: 4px 6px; color: #888; border-bottom: 1px solid rgba(0,0,0,0.06);`;
    });

    box.querySelectorAll('td').forEach(td => {
        td.style.cssText = `padding: 5px 6px; border-bottom: 1px solid rgba(0,0,0,0.04); color: #333;`;
    });

    box.querySelectorAll('.quick-fill-btn').forEach(btn => {
        btn.style.cssText = `
            background: none;
            border: none;
            color: var(--c-teal-600, #00877a);
            cursor: pointer;
            font-weight: 600;
            font-size: 0.85rem;
            padding: 0;
            display: flex;
            align-items: center;
            gap: 4px;
        `;

        btn.addEventListener('click', () => {
            const form = document.getElementById('loginForm');
            const emailEl = document.getElementById('email');
            const passEl = document.getElementById('password');
            if (emailEl) emailEl.value = btn.dataset.email;
            if (passEl) passEl.value = btn.dataset.pass;
            detailsEl.removeAttribute('open');
            emailEl.focus();
            showToast(`Autofilled credentials for ${btn.textContent.trim()}`, 'info');
        });
    });

    wrapper.appendChild(box);
}

// ─── Helpers ───────────────────────────────────────────────────────────
function showLoginError(message) {
    let errEl = document.getElementById('loginError');
    if (!errEl) {
        errEl = document.createElement('p');
        errEl.id = 'loginError';
        errEl.style.cssText = `
            color: #c0392b;
            background: rgba(192,57,43,0.06);
            border: 1px solid rgba(192,57,43,0.2);
            padding: 0.65rem 1rem;
            border-radius: 8px;
            font-size: 0.875rem;
            margin-top: 0.75rem;
            text-align: center;
        `;
        const form = document.getElementById('loginForm');
        form.insertBefore(errEl, form.querySelector('button[type="submit"]'));
    }
    errEl.textContent = message;
    setTimeout(() => { if (errEl) errEl.textContent = ''; }, 6000);
}

function showToast(message, type = 'info') {
    const colors = {
        info:    { bg: 'rgba(0,184,158,0.92)',   color: '#fff' },
        success: { bg: 'rgba(39,174,96,0.95)',    color: '#fff' },
        warning: { bg: 'rgba(255,193,7,0.95)',    color: '#333' },
        error:   { bg: 'rgba(192,57,43,0.95)',    color: '#fff' }
    };
    const s = colors[type] || colors.info;

    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        left: 50%;
        bottom: 32px;
        transform: translateX(-50%) translateY(20px);
        background: ${s.bg};
        color: ${s.color};
        padding: 14px 24px;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.22);
        z-index: 9999;
        font-weight: 500;
        font-size: 0.95rem;
        max-width: 90vw;
        text-align: center;
        backdrop-filter: blur(8px);
        opacity: 0;
        transition: all 0.3s ease-out;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}
