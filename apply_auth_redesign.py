import glob
import os

print("Applying Auth Redesign and logo fix...")

# 1. Add logo text to all HTML files ensuring it includes Summit Care
for filepath in glob.glob("*.html"):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Safely inject the logo-text span if it doesn't already exist
    search = '<img src="images/summit-care-logo.png" alt="Summit Care Logo" class="logo-img">'
    replace = '<img src="images/summit-care-logo.png" alt="Summit Care Logo" class="logo-img">\n                    <span class="logo-text">Summit Care</span>'
    
    if replace not in content:
        content = content.replace(search, replace)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)

# 2. Append CSS to style.css
css_rules = """
/* ═══════════════════════════════════════════════════
   AUTH PAGES (LOGIN & SIGNUP) SPLIT DESIGN
   ═══════════════════════════════════════════════════ */
.auth-page-body {
    background: var(--color-bg-alt);
    min-height: 100vh;
    min-height: 100svh; /* mobile viewport stability */
    min-height: 100dvh; /* dynamic viewport on modern browsers */
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-6);
}

.auth-container {
    background: var(--c-white);
    max-width: 1100px;
    width: 100%;
    border-radius: var(--radius-3xl);
    box-shadow: var(--shadow-xl);
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    overflow: hidden;
    position: relative;
    border: 1px solid var(--color-border);
}

.auth-form-side {
    padding: var(--space-8) var(--space-10);
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    z-index: 2;
    background: var(--color-bg);
}

.auth-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-8);
}

.auth-header .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
}

.auth-header .logo-text {
    font-family: var(--font-display);
    font-weight: 700;
    color: var(--c-ink);
    font-size: 1.25rem;
}

.auth-header .home-link {
    font-size: 0.9rem;
    color: var(--color-text-muted);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: color var(--transition-fast);
}

.auth-header .home-link:hover {
    color: var(--c-teal-500);
}

.auth-form-wrapper {
    max-width: 420px;
    margin: 0 auto;
    width: 100%;
}

.auth-form-wrapper h1 {
    font-family: var(--font-display);
    font-size: 2.25rem;
    font-weight: 700;
    margin-bottom: var(--space-2);
    color: var(--c-ink);
}

.auth-form-wrapper p.auth-subtitle {
    color: var(--color-text-muted);
    margin-bottom: var(--space-6);
    font-size: 0.95rem;
}

/* Glassmorphism input wrapper style mimicking reference */
.auth-form .form-field {
    margin-bottom: var(--space-4);
}

.auth-form label {
    display: block;
    margin-bottom: 0.4rem;
    color: var(--c-steel);
    font-size: 0.85rem;
    font-weight: 500;
}

.auth-form input {
    width: 100%;
    padding: 0.875rem 1.25rem;
    border-radius: var(--radius-lg);
    border: 2px solid rgba(0, 184, 158, 0.1);
    background: linear-gradient(135deg, rgba(255,255,255,0.8), rgba(245, 242, 236, 0.5));
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
    font-size: 0.95rem;
    font-family: var(--font-body);
    transition: all var(--transition-fast);
}

.auth-form input:focus {
    outline: none;
    border-color: var(--c-teal-400);
    box-shadow: 0 0 0 4px var(--c-teal-50), inset 0 2px 4px rgba(0,0,0,0.02);
    background: var(--c-white);
}

.auth-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-6);
    font-size: 0.85rem;
}

.forgot-link {
    color: var(--c-amber-500);
    text-decoration: none;
    font-weight: 600;
}

.forgot-link:hover {
    text-decoration: underline;
}

.auth-form .btn-primary {
    width: 100%;
    padding: 0.875rem 1.5rem;
    border-radius: var(--radius-lg);
    font-size: 1.05rem;
}

.auth-social {
    margin-top: var(--space-6);
    text-align: center;
}

.auth-social p {
    color: var(--c-steel);
    font-size: 0.9rem;
    margin-bottom: var(--space-3);
}

.auth-social p a {
    color: var(--c-ink);
    text-decoration: none;
}

.auth-social p a:hover {
    text-decoration: underline;
}

/* Right Side Graphic */
.auth-image-side {
    position: relative;
    background: linear-gradient(135deg, var(--c-teal-400) 0%, var(--c-teal-700) 100%);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-8);
}

/* Decorative background circle */
.auth-image-side::before {
    content: '';
    position: absolute;
    width: 150%;
    height: 150%;
    right: -25%;
    bottom: -25%;
    background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 60%);
    border-radius: 50%;
    pointer-events: none;
}

.auth-visual {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: var(--radius-2xl);
    box-shadow: var(--shadow-xl);
    border: 4px solid rgba(255,255,255,0.15);
}

@media (max-width: 900px) {
    .auth-container {
        grid-template-columns: 1fr;
    }
    .auth-image-side {
        display: none;
    }
    .auth-form-side {
        padding: var(--space-6) var(--space-4);
    }
}
"""

with open("style.css", "r", encoding="utf-8") as f:
    css = f.read()

if "AUTH PAGES (LOGIN & SIGNUP)" not in css:
    with open("style.css", "a", encoding="utf-8") as f:
        f.write("\n" + css_rules)

# 3. Rewrite login.html
login_html = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Sign in | Summit Care</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    <link rel="stylesheet" href="style.css" />
    <script defer src="login.js"></script>
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
                <h1>Sign in</h1>
                <p class="auth-subtitle">Access your secure healthcare portal</p>
                
                <form class="auth-form" id="loginForm" novalidate>
                    <div class="form-field">
                        <label for="email">Username or email address</label>
                        <input id="email" name="email" type="email" autocomplete="email" placeholder="omar@beyond.com" required />
                    </div>
                    
                    <div class="form-field">
                        <label for="password">Password</label>
                        <input id="password" name="password" type="password" autocomplete="current-password" placeholder="••••••••" required />
                    </div>
                    
                    <div class="auth-options">
                        <label class="remember-label"><input type="checkbox" name="remember" /> Remember me</label>
                        <a href="javascript:void(0)" class="forgot-link">Forget password ?</a>
                    </div>
                    
                    <button type="submit" class="btn btn-primary">Sign in</button>
                    
                    <div class="auth-social">
                        <p>Don't have account? <a href="signup.html"><strong>Sign up</strong></a></p>
                        <button type="button" class="btn btn-outline" style="width: 100%; margin-top: 1rem;"><i class="fab fa-google"></i> Sign in with Google</button>
                    </div>
                </form>
            </div>
        </div>
        
        <div class="auth-image-side">
            <img src="https://images.unsplash.com/photo-1576091160550-2173ff9e5ee4?auto=format&fit=crop&w=800&q=80" alt="Medical Professional" class="auth-visual">
        </div>
    </div>
</body>
</html>'''

with open("login.html", "w", encoding="utf-8") as f:
    f.write(login_html)

# 4. Rewrite signup.html
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
                
                <form class="auth-form" id="signupForm" novalidate>
                    <div class="form-field">
                        <label for="name">Full Name</label>
                        <input id="name" name="name" type="text" autocomplete="name" placeholder="John Doe" required />
                    </div>
                
                    <div class="form-field">
                        <label for="email">Email address</label>
                        <input id="email" name="email" type="email" autocomplete="email" placeholder="john@example.com" required />
                    </div>
                    
                    <div class="form-field">
                        <label for="password">Password</label>
                        <input id="password" name="password" type="password" autocomplete="new-password" placeholder="••••••••" required />
                    </div>
                    
                    <button type="submit" class="btn btn-primary" style="margin-top: 1.5rem;">Create Account</button>
                    
                    <div class="auth-social">
                        <p>Already have an account? <a href="login.html"><strong>Sign in</strong></a></p>
                    </div>
                </form>
            </div>
        </div>
        
        <div class="auth-image-side" style="background: linear-gradient(135deg, var(--c-charcoal) 0%, var(--c-obsidian) 100%);">
            <img src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80" alt="Modern Clinic" class="auth-visual">
        </div>
    </div>
</body>
</html>'''

with open("signup.html", "w", encoding="utf-8") as f:
    f.write(signup_html)

print("Auth redesign successfully processed.")
