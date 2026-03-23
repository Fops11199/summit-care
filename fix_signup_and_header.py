import glob
import re

print("Starting fixes...")

# 1. Append step CSS to style.css
step_css = """
/* AUTH FORM STEPS */
.form-step {
    display: none;
    animation: fadeIn 0.4s ease forwards;
}

.form-step.active {
    display: block;
}

.step-actions {
    display: flex;
    justify-content: space-between;
    gap: var(--space-4);
    margin-top: var(--space-6);
}

.step-actions .btn {
    flex: 1;
}

.consent-options {
    background: var(--color-bg-alt);
    padding: var(--space-4);
    border-radius: var(--radius-lg);
    margin-bottom: var(--space-4);
}

.consent-checkbox {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: 0.85rem;
    color: var(--c-steel);
    margin-bottom: var(--space-2);
}

.consent-checkbox input[type="checkbox"] {
    width: auto;
    margin: 0;
}

.mark-all-btn {
    background: none;
    border: 1px solid var(--c-teal-400);
    color: var(--c-teal-500);
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-full);
    font-size: 0.8rem;
    cursor: pointer;
    margin-bottom: var(--space-4);
    transition: all 0.3s ease;
}

.mark-all-btn:hover {
    background: var(--c-teal-500);
    color: white;
}

/* Auth Progress bar */
.auth-progress {
    display: flex;
    gap: 6px;
    margin-bottom: var(--space-6);
}
.progress-step {
    flex: 1;
    height: 4px;
    background: var(--color-border);
    border-radius: 2px;
    transition: background 0.3s ease;
}
.progress-step.active {
    background: var(--c-teal-500);
}

@media (max-width: 900px) {
    .nav-actions {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
    }
}
"""
try:
    with open("style.css", "r", encoding="utf-8") as f:
        css = f.read()
    if "/* AUTH FORM STEPS */" not in css:
        with open("style.css", "a", encoding="utf-8") as f:
            f.write("\n" + step_css)
except Exception as e:
    print(f"Error updating css: {e}")

# 2. Rewrite signup.html
signup_html = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Sign up | Summit Care</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    <link rel="stylesheet" href="style.css" />
    <script defer src="signup.js"></script>
</head>
<body class="auth-page-body">
    <div class="auth-container">
        <div class="auth-form-side">
            <div class="auth-header">
                <a class="logo" href="index.html">
                    <img src="images/summit-care-logo.png" alt="Summit Care Logo" class="logo-img">
                    <span class="logo-text">Summit Care</span>
                </a>
                <a href="index.html" class="home-link"><i class="fas fa-arrow-left"></i> Home</a>
            </div>
            
            <div class="auth-form-wrapper">
                <h1>Sign up</h1>
                <p class="auth-subtitle">Join us to manage your health journey</p>
                <div class="form-status" style="font-weight:600;margin-bottom:1rem;color:var(--c-danger);"></div>
                
                <div class="auth-progress">
                    <div class="progress-step active"></div>
                    <div class="progress-step"></div>
                    <div class="progress-step"></div>
                    <div class="progress-step"></div>
                </div>

                <form class="auth-form" id="signupForm" novalidate>
                    <div class="form-step active" data-step="1">
                        <div class="form-field">
                            <label for="fullName">Full Name</label>
                            <input id="fullName" name="fullName" type="text" autocomplete="name" placeholder="John Doe" required />
                            <div class="error" style="color:var(--c-danger);font-size:0.8rem;margin-top:4px;"></div>
                        </div>
                        <div class="form-field">
                            <label for="email">Email Address</label>
                            <input id="email" name="email" type="email" autocomplete="email" placeholder="your@email.com" required />
                            <div class="error" style="color:var(--c-danger);font-size:0.8rem;margin-top:4px;"></div>
                        </div>
                        <div class="form-field">
                            <label for="phone">Mobile Phone</label>
                            <input id="phone" name="phone" type="tel" autocomplete="tel" placeholder="(123) 456-7890" required />
                            <div class="error" style="color:var(--c-danger);font-size:0.8rem;margin-top:4px;"></div>
                        </div>
                        <div class="form-field">
                            <label for="password">Password</label>
                            <input id="password" name="password" type="password" autocomplete="new-password" placeholder="Create a strong password" required />
                            <div class="error" style="color:var(--c-danger);font-size:0.8rem;margin-top:4px;"></div>
                        </div>
                        <div class="step-actions" style="margin-top: 1rem;">
                            <button type="button" class="btn btn-primary next-step" data-next="2">Continue</button>
                        </div>
                    </div>

                    <div class="form-step" data-step="2">
                        <div class="form-field" style="margin-bottom: 1.5rem;">
                            <label for="dateOfBirth">Date of Birth</label>
                            <input id="dateOfBirth" name="dateOfBirth" type="date" required style="padding: 0.8rem;" />
                            <div class="error" style="color:var(--c-danger);font-size:0.8rem;margin-top:4px;"></div>
                        </div>
                        <div class="form-field" style="margin-bottom: 1.5rem;">
                            <label for="gender">Gender</label>
                            <select id="gender" name="gender" required style="width:100%;padding:0.875rem 1.25rem;border-radius:var(--radius-lg);border:2px solid rgba(0,184,158,0.1);font-family:var(--font-body);background:linear-gradient(135deg,rgba(255,255,255,0.8),rgba(245,242,236,0.5));">
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            <div class="error" style="color:var(--c-danger);font-size:0.8rem;margin-top:4px;"></div>
                        </div>
                        <div class="form-field">
                            <label for="address">Address</label>
                            <input id="address" name="address" type="text" autocomplete="street-address" placeholder="Enter your address" required />
                            <div class="error" style="color:var(--c-danger);font-size:0.8rem;margin-top:4px;"></div>
                        </div>
                        <div class="step-actions">
                            <button type="button" class="btn btn-outline prev-step" data-prev="1" style="border:1px solid var(--c-steel);">Back</button>
                            <button type="button" class="btn btn-primary next-step" data-next="3">Next</button>
                        </div>
                    </div>

                    <div class="form-step" data-step="3">
                        <div class="form-field" style="margin-bottom: 1.5rem;">
                            <label for="bloodGroup">Blood Group</label>
                            <select id="bloodGroup" name="bloodGroup" style="width:100%;padding:0.875rem 1.25rem;border-radius:var(--radius-lg);border:2px solid rgba(0,184,158,0.1);font-family:var(--font-body);background:linear-gradient(135deg,rgba(255,255,255,0.8),rgba(245,242,236,0.5));">
                                <option value="">Select blood group</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>
                        <div class="form-field">
                            <label for="allergies">Allergies (optional)</label>
                            <input id="allergies" name="allergies" type="text" placeholder="List any allergies" />
                        </div>
                        <div class="form-field">
                            <label for="insuranceId">Insurance / Patient ID (optional)</label>
                            <input id="insuranceId" name="insuranceId" type="text" placeholder="Enter ID" />
                        </div>
                        <div class="step-actions">
                            <button type="button" class="btn btn-outline prev-step" data-prev="2" style="border:1px solid var(--c-steel);">Back</button>
                            <button type="button" class="btn btn-primary next-step" data-next="4">Next</button>
                        </div>
                    </div>

                    <div class="form-step" data-step="4">
                        <div class="consent-options">
                            <button type="button" class="mark-all-btn" id="markAllBtn">Mark All Consents</button>
                            <label class="consent-checkbox"><input type="checkbox" name="consent_privacy" required /> I agree to the <a href="privacy.html" style="color:var(--c-teal-600);margin-left:4px;">Privacy Policy</a></label>
                            <label class="consent-checkbox"><input type="checkbox" name="consent_terms" required /> I agree to the <a href="terms.html" style="color:var(--c-teal-600);margin-left:4px;">Terms & Conditions</a></label>
                            <label class="consent-checkbox"><input type="checkbox" name="consent_general" required /> I consent to <a href="consent.html" style="color:var(--c-teal-600);margin-left:4px;">Treatment</a></label>
                        </div>
                        <div class="step-actions">
                            <button type="button" class="btn btn-outline prev-step" data-prev="3" style="border:1px solid var(--c-steel);">Back</button>
                            <button type="submit" class="btn btn-primary">Sign Up & Complete</button>
                        </div>
                        <div class="auth-social" style="margin-top: 1rem;">
                            <p style="font-size:0.85rem;">Already have an account? <a href="login.html"><strong>Sign in</strong></a></p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        
        <div class="auth-image-side" style="background: linear-gradient(135deg, var(--c-charcoal) 0%, var(--c-slate) 100%);">
            <img src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80" alt="Modern Clinic" class="auth-visual">
        </div>
    </div>
</body>
</html>'''

try:
    with open("signup.html", "w", encoding="utf-8") as f:
        f.write(signup_html)
except Exception as e:
    print(f"Error updating signup: {e}")

# 3. Update global header in all HTML files
new_nav_actions = """<div class="nav-actions">
                    <a class="btn header-btn-login" href="login.html" style="margin-right: 12px; font-weight: 600; font-family: var(--font-display); background: transparent; border: 1px solid var(--c-teal-500); color: var(--c-teal-500); padding: 0.6rem 1.5rem; border-radius: var(--radius-full);">Log In</a>
                    <a class="btn header-btn-signup" href="signup.html" style="margin-right: 12px; background: var(--c-charcoal); color: white; border-radius: var(--radius-full); padding: 0.6rem 1.5rem; font-weight: 600;">Sign Up</a>
                    <a class="btn btn-primary btn-pill" href="appointment.html">Book Appointment</a>"""

search_nav = r'<div class="nav-actions">\s*<a class="btn btn-primary btn-pill" href="appointment\.html">Book Appointment</a>'

for filepath in glob.glob("*.html"):
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        if "header-btn-login" not in content and "nav-actions" in content:
            content = re.sub(search_nav, new_nav_actions, content)
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(content)
    except Exception as e:
        pass
        
print("Fixes applied successfully.")
