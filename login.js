// Login Page JavaScript for Summit Care

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.querySelector('.password-toggle');
    const formStatus = document.querySelector('.form-status');

    // Password visibility toggle
    if (passwordToggle) {
        passwordToggle.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            const icon = this.querySelector('i');
            icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        });
    }

    // Form validation
    const validators = {
        email: (value) => {
            if (!value.trim()) return 'Email address is required.';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address.';
            return true;
        },
        password: (value) => {
            if (!value.trim()) return 'Password is required.';
            if (value.length < 6) return 'Password must be at least 6 characters long.';
            return true;
        }
    };

    function validateField(input) {
        const { id, value } = input;
        const errorEl = input.parentElement.parentElement.querySelector('.error');
        if (!errorEl) return true;

        const result = validators[id](value);
        if (result !== true) {
            errorEl.textContent = result;
            return false;
        }
        errorEl.textContent = '';
        return true;
    }

    // Real-time validation
    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('input', () => validateField(input));
        input.addEventListener('blur', () => validateField(input));
    });

    // Form submission
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const isValid = [emailInput, passwordInput].every(validateField);
        if (!isValid) {
            formStatus.textContent = 'Please fix the errors above and try again.';
            formStatus.style.color = '#8a0000';
            return;
        }

        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        submitBtn.disabled = true;

        formStatus.textContent = 'Signing you in...';
        formStatus.style.color = '#111';

        // Simulate login process
        setTimeout(() => {
            // For demo purposes, simulate successful login
            const formData = new FormData(loginForm);
            const email = formData.get('email');
            const password = formData.get('password');

            // Try to match against signup data first
            const storedUser = JSON.parse(localStorage.getItem('summitCare_userData') || '{}');
            if (storedUser.email === email && password.length >= 6) {
                formStatus.textContent = 'Login successful! Redirecting to dashboard...';
                formStatus.style.color = '#054105';
                const userSession = {
                    userId: storedUser.id,
                    timestamp: new Date().getTime(),
                    token: 'demo_token_' + Math.random().toString(36).substr(2, 9)
                };
                localStorage.setItem('summitCare_userSession', JSON.stringify(userSession));
                setTimeout(() => {
                    showToast('Welcome back! You have successfully logged in.', 'success');
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1000);
                }, 1500);
                return;
            }
            // Fallback to demo credentials
            if (email === 'demo@summitcare.com' && password === 'demo123') {
                formStatus.textContent = 'Login successful! Redirecting to dashboard...';
                formStatus.style.color = '#054105';
                const userData = {
                    firstName: 'John',
                    lastName: 'Doe',
                    email: email,
                    id: 'user_12345'
                };
                const userSession = {
                    userId: userData.id,
                    timestamp: new Date().getTime(),
                    token: 'demo_token_' + Math.random().toString(36).substr(2, 9)
                };
                localStorage.setItem('summitCare_userData', JSON.stringify(userData));
                localStorage.setItem('summitCare_userSession', JSON.stringify(userSession));
                setTimeout(() => {
                    showToast('Welcome back! You have successfully logged in.', 'success');
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1000);
                }, 1500);
            } else {
                formStatus.textContent = 'Invalid email or password. Please try again.';
                formStatus.style.color = '#8a0000';
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        }, 2000);
    });

    // Demo credentials helper
    const demoCredentials = document.createElement('div');
    demoCredentials.className = 'demo-credentials';
    demoCredentials.innerHTML = `
        <details>
            <summary>Demo Credentials</summary>
            <p><strong>Email:</strong> demo@summitcare.com</p>
            <p><strong>Password:</strong> demo123</p>
        </details>
    `;
    demoCredentials.style.cssText = `
        margin-top: 1rem;
        padding: 1rem;
        background: rgba(135, 206, 235, 0.1);
        border-radius: 8px;
        border: 1px solid var(--color-primary-light);
    `;

    const authFormContainer = document.querySelector('.auth-form-container');
    if (authFormContainer) {
        authFormContainer.appendChild(demoCredentials);
    }

    // Enhanced form interactions
    const formFields = document.querySelectorAll('.form-field input, .form-field select');
    formFields.forEach(field => {
        field.addEventListener('focus', () => {
            field.parentElement.classList.add('focused');
        });

        field.addEventListener('blur', () => {
            field.parentElement.classList.remove('focused');
        });
    });

    // Remember me functionality
    const rememberCheckbox = document.querySelector('input[name="remember"]');
    if (rememberCheckbox) {
        // Check if user previously chose to remember
        const remembered = localStorage.getItem('summitCare_remember');
        if (remembered === 'true') {
            rememberCheckbox.checked = true;
            const savedEmail = localStorage.getItem('summitCare_email');
            if (savedEmail) {
                emailInput.value = savedEmail;
            }
        }

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

    // Forgot password functionality
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function (e) {
            e.preventDefault();
            showToast('Password reset functionality would be implemented here. Please contact support.', 'info');
        });
    }

    // Social login buttons
    const socialButtons = document.querySelectorAll('.btn-social');
    socialButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const provider = this.textContent.includes('Google') ? 'Google' : 'Apple';
            showToast(`${provider} login integration would be implemented here.`, 'info');
        });
    });
});

// Toast notification system
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
