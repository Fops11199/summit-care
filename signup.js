// Signup Page JavaScript for Summit Care

document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signupForm');
    const progressSteps = document.querySelectorAll('.progress-step');
    const formSteps = document.querySelectorAll('.form-step');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const submitButton = document.querySelector('button[type="submit"]');
    const formStatus = document.querySelector('.form-status');

    let currentStep = 1;
    const totalSteps = 4;

    // Initialize form
    initializeForm();

    function initializeForm() {
        // Hide all steps except first
        formSteps.forEach((step, index) => {
            if (index === 0) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Update progress indicator
        updateProgress();
    }

    function updateProgress() {
        progressSteps.forEach((step, index) => {
            if (index + 1 <= currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    function showStep(stepNumber) {
        // Hide all steps
        formSteps.forEach(step => step.classList.remove('active'));

        // Show current step
        const currentStepElement = document.querySelector(`[data-step="${stepNumber}"]`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }

        // Update progress
        currentStep = stepNumber;
        updateProgress();

        // Scroll to top of form
        signupForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Next step functionality with validation alert
    nextButtons.forEach(button => {
        button.addEventListener('click', function () {
            const nextStep = parseInt(this.getAttribute('data-next'));
            if (!validateCurrentStep()) {
                alert('Please fix the errors in this section before continuing.');
                return;
            }
            showStep(nextStep);
        });
    });

    // Previous step functionality
    prevButtons.forEach(button => {
        button.addEventListener('click', function () {
            const prevStep = parseInt(this.getAttribute('data-prev'));
            showStep(prevStep);
        });
    });

    // Form validation
    const validators = {
        fullName: (value) => {
            if (!value.trim()) return 'Full name is required.';
            if (value.trim().length < 2) return 'Please enter your full name.';
            return true;
        },
        firstName: (value) => {
            if (!value.trim()) return 'First name is required.';
            if (value.trim().length < 2) return 'First name must be at least 2 characters.';
            return true;
        },
        lastName: (value) => {
            if (!value.trim()) return 'Last name is required.';
            if (value.trim().length < 2) return 'Last name must be at least 2 characters.';
            return true;
        },
        address: (value) => {
            if (!value.trim()) return 'Address is required.';
            if (value.trim().length < 5) return 'Please enter a valid address.';
            return true;
        },
        dateOfBirth: (value) => {
            if (!value) return 'Date of birth is required.';
            const today = new Date();
            const birthDate = new Date(value);
            const age = today.getFullYear() - birthDate.getFullYear();
            if (age < 0 || age > 120) return 'Please enter a valid date of birth.';
            return true;
        },
        gender: (value) => {
            if (!value) return 'Please select your gender.';
            return true;
        },
        nin: (value) => {
            if (!value.trim()) return 'National ID number is required.';
            if (value.trim().length < 5) return 'National ID number must be at least 5 characters.';
            return true;
        },
        email: (value) => {
            if (!value.trim()) return 'Email address is required.';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address.';
            return true;
        },
        phone: (value) => {
            if (!value.trim()) return 'Phone number is required.';
            if (value.trim().length < 10) return 'Phone number must be at least 10 digits.';
            return true;
        },
        streetAddress: (value) => {
            if (!value.trim()) return 'Street address is required.';
            if (value.trim().length < 5) return 'Street address must be at least 5 characters.';
            return true;
        },
        city: (value) => {
            if (!value.trim()) return 'City is required.';
            return true;
        },
        state: (value) => {
            if (!value.trim()) return 'State/Region is required.';
            return true;
        },
        postalCode: (value) => {
            if (!value.trim()) return 'Postal code is required.';
            if (value.trim().length < 3) return 'Postal code must be at least 3 characters.';
            return true;
        },
        emergencyName: (value) => {
            if (!value.trim()) return 'Emergency contact name is required.';
            if (value.trim().length < 2) return 'Emergency contact name must be at least 2 characters.';
            return true;
        },
        emergencyRelationship: (value) => {
            if (!value) return 'Please select relationship to patient.';
            return true;
        },
        emergencyPhone: (value) => {
            if (!value.trim()) return 'Emergency contact phone is required.';
            if (value.trim().length < 10) return 'Emergency contact phone must be at least 10 digits.';
            return true;
        },
        username: (value) => {
            if (!value.trim()) return 'Username is required.';
            if (value.trim().length < 3) return 'Username must be at least 3 characters.';
            if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores.';
            return true;
        },
        password: (value) => {
            if (!value.trim()) return 'Password is required.';
            if (value.length < 8) return 'Password must be at least 8 characters long.';
            return true;
        },
        confirmPassword: (value) => {
            const password = document.getElementById('password').value;
            if (!value.trim()) return 'Please confirm your password.';
            if (value !== password) return 'Passwords do not match.';
            return true;
        }
    };

    function validateCurrentStep() {
        const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
        const fields = currentStepElement.querySelectorAll('input[required], select[required]');
        let isValid = true;

        fields.forEach(field => {
            const result = validateField(field);
            if (!result) {
                isValid = false;
            }
        });

        return isValid;
    }

    function validateField(input) {
        const { id, value } = input;
        const errorEl = input.parentElement.querySelector('.error')
                     || input.parentElement.parentElement.querySelector('.error');

        // If there's no validator for this field, treat it as valid
        if (!validators[id]) {
            if (errorEl) errorEl.textContent = '';
            return true;
        }

        const result = validators[id](value);
        if (result !== true) {
            if (errorEl) errorEl.textContent = result;
            return false;
        }
        if (errorEl) errorEl.textContent = '';
        return true;
    }

    // Real-time validation
    const allInputs = signupForm.querySelectorAll('input, select');
    allInputs.forEach(input => {
        input.addEventListener('input', () => validateField(input));
        input.addEventListener('blur', () => validateField(input));
    });

    // Ensure all nav buttons start enabled — validation runs on click
    function updateButtonStates() {
        formSteps.forEach(step => {
            const nextBtn = step.querySelector('.next-step');
            const prevBtn = step.querySelector('.prev-step');
            if (nextBtn)  { nextBtn.disabled  = false; nextBtn.classList.add('enabled'); }
            if (prevBtn)  { prevBtn.disabled   = false; prevBtn.classList.add('enabled'); }
        });
    }
    updateButtonStates();

    // Password strength checker
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function () {
            checkPasswordStrength(this.value);
        });
    }

    function checkPasswordStrength(password) {
        const strengthBar = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');

        let strength = 0;
        let feedback = '';

        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        const strengthColors = ['#ff4444', '#ff8800', '#ffbb33', '#00C851', '#007E33'];
        const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

        if (strengthBar && strengthText) {
            strengthBar.style.width = `${(strength / 5) * 100}%`;
            strengthBar.style.backgroundColor = strengthColors[strength - 1] || '#ff4444';
            strengthText.textContent = strengthLabels[strength - 1] || 'Very Weak';
            strengthBar.setAttribute('data-strength', strength);
        }
    }

    // Password visibility toggle
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function () {
            const input = this.parentElement.querySelector('input');
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);

            const icon = this.querySelector('i');
            icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        });
    });

    // Mark All button logic for consents
    const markAllBtn = document.getElementById('markAllBtn');
    if (markAllBtn) {
        markAllBtn.addEventListener('click', function () {
            document.querySelectorAll('.consent-options input[type="checkbox"]').forEach(cb => {
                cb.checked = true;
                cb.dispatchEvent(new Event('input'));
            });
        });
    }

    // Form submission
    signupForm.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!validateCurrentStep()) {
            formStatus.textContent = 'Please fix the errors above and try again.';
            formStatus.style.color = '#8a0000';
            return;
        }

        // Validate all required consents
        const requiredConsents = signupForm.querySelectorAll('input[required]');
        const uncheckedConsents = Array.from(requiredConsents).filter(input =>
            input.type === 'checkbox' && !input.checked
        );

        if (uncheckedConsents.length > 0) {
            formStatus.textContent = 'Please accept all required consents and agreements.';
            formStatus.style.color = '#8a0000';
            return;
        }

        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        submitButton.disabled = true;

        formStatus.textContent = 'Creating your account...';
        formStatus.style.color = '#111';

        setTimeout(() => {
            const formData = new FormData(signupForm);
            const email = (formData.get('email') || '').trim().toLowerCase();
            const password = (formData.get('password') || '').trim();
            const fullName = (formData.get('fullName') || '').trim();
            const nameParts = fullName.split(' ');

            // ── Load the shared user registry ──────────────────────────
            const registeredUsers = JSON.parse(
                localStorage.getItem('summitCare_registeredUsers') || '[]'
            );

            // Check for duplicate email (also check built-in dummy accounts via login.js list)
            const duplicate = registeredUsers.some(u => u.email === email);
            if (duplicate) {
                formStatus.textContent = 'An account with this email already exists. Please log in.';
                formStatus.style.color = '#8a0000';
                submitButton.innerHTML = 'Sign Up & Complete';
                submitButton.disabled = false;
                return;
            }

            // ── Build new user record ───────────────────────────────────
            const newUser = {
                id: 'user_' + Math.random().toString(36).substr(2, 9),
                firstName: nameParts[0] || fullName,
                lastName: nameParts.slice(1).join(' ') || '',
                fullName: fullName,
                email: email,
                password: password,                 // stored for mock login matching
                phone: formData.get('phone') || '',
                dob: formData.get('dateOfBirth') || '',
                gender: formData.get('gender') || '',
                address: formData.get('address') || '',
                bloodType: formData.get('bloodGroup') || 'Unknown',
                allergies: formData.get('allergies') || 'None',
                insuranceId: formData.get('insuranceId') || '',
                role: 'Patient',
                doctor: 'Dr. Sarah Jenkins',        // default assigned doctor
                nextVisit: 'TBD',
                bloodPressure: 'Not recorded',
                weight: 'Not recorded',
                medications: '0 Active',
                registeredAt: new Date().toISOString()
            };

            // ── Append and persist ──────────────────────────────────────
            registeredUsers.push(newUser);
            localStorage.setItem('summitCare_registeredUsers', JSON.stringify(registeredUsers));

            // Also write as the active session so they land on the dashboard
            localStorage.setItem('summitCare_userData', JSON.stringify(newUser));
            localStorage.setItem('summitCare_userSession', JSON.stringify({
                userId: newUser.id,
                timestamp: Date.now(),
                token: 'demo_token_' + Math.random().toString(36).substr(2, 9)
            }));

            formStatus.textContent = 'Account created! Redirecting to your dashboard…';
            formStatus.style.color = '#054105';

            setTimeout(() => {
                showToast(`Welcome to Summit Care, ${newUser.firstName}! 🎉`, 'success');
                setTimeout(() => { window.location.href = 'dashboard.html'; }, 900);
            }, 800);
        }, 1500);
    });

    // Enhanced form interactions
    const formFields = signupForm.querySelectorAll('.form-field input, .form-field select');
    formFields.forEach(field => {
        field.addEventListener('focus', () => {
            field.parentElement.classList.add('focused');
        });

        field.addEventListener('blur', () => {
            field.parentElement.classList.remove('focused');
        });
    });

    // Auto-advance date picker
    const dateOfBirthInput = document.getElementById('dateOfBirth');
    if (dateOfBirthInput) {
        // Set max date to today
        const today = new Date().toISOString().split('T')[0];
        dateOfBirthInput.setAttribute('max', today);
    }

    // Phone number formatting
    const phoneInputs = signupForm.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                value = value.match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
                e.target.value = !value[2] ? value[1] :
                    !value[3] ? `(${value[1]}) ${value[2]}` :
                        `(${value[1]}) ${value[2]}-${value[3]}`;
            }
        });
    });

    // Keyboard navigation between steps
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            if (currentStep < totalSteps) {
                if (validateCurrentStep()) {
                    showStep(currentStep + 1);
                }
            }
        }
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
