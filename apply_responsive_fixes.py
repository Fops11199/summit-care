import glob
import re

print("Applying mobile layout fixes...")

# 1. Inject mobile-only buttons into nav-list of all HTML files
btn_html = """                        <li class="mobile-only-btn"><a href="login.html">Log In</a></li>
                        <li class="mobile-only-btn"><a href="signup.html">Sign Up</a></li>
                        <li class="mobile-only-btn auth-book-btn"><a href="appointment.html">Book Appointment</a></li>
                    </ul>"""

# 2. Append mobile CSS to style.css
mobile_css = """
/* MOBILE RESPONSIVENESS OVERRIDES */
.mobile-only-btn {
    display: none;
}

@media (max-width: 900px) {
    /* Hide top header buttons to prevent scatter */
    .nav-actions .btn {
        display: none !important;
    }
    
    /* Reset nav-actions if it was scattered before */
    .nav-actions {
        display: flex !important;
        flex-direction: row !important;
        flex-wrap: nowrap !important;
        justify-content: flex-end !important;
        align-items: center !important;
        gap: 0 !important;
        width: auto !important;
    }

    /* Show links inside mobile menu dropdown */
    .mobile-only-btn {
        display: block;
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px solid rgba(0,0,0,0.05);
    }
    
    .mobile-only-btn a {
        color: var(--c-ink) !important;
        font-weight: 600 !important;
        display: block;
        padding: 0.5rem 1rem !important;
    }
    
    .mobile-only-btn.auth-book-btn a {
        background: var(--c-teal-500);
        color: white !important;
        border-radius: var(--radius-full);
        text-align: center;
        margin-top: 0.5rem;
    }

    /* Prevent Hero Content from overflowing */
    .hero-content {
        display: flex;
        flex-direction: column;
        width: 100%;
        text-align: center;
    }
    
    .hero-text-content {
        max-width: 100%;
        text-align: center;
    }
    
    .cta-group {
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .hero-visual {
        margin-top: 2rem;
        display: flex;
        justify-content: center;
    }
    
    /* Ensure grids stack nicely */
    .stats-grid, .bento-grid, .team-grid {
        grid-template-columns: 1fr !important;
    }
}
"""

try:
    with open("style.css", "r", encoding="utf-8") as f:
        css = f.read()
    
    # Remove old bad flex wrap
    bad_css = """@media (max-width: 900px) {
    .nav-actions {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
    }
}"""
    css = css.replace(bad_css, "")
    
    if "/* MOBILE RESPONSIVENESS OVERRIDES */" not in css:
        with open("style.css", "w", encoding="utf-8") as f:
            f.write(css + "\n" + mobile_css)
        print("Updated style.css with overrides.")
except Exception as e:
    print(f"Error touching style.css: {e}")

for filepath in glob.glob("*.html"):
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
            
        if "mobile-only-btn" not in content and "</ul>" in content:
            new_content = re.sub(r'</ul>\s*</nav>', btn_html + '\n                </nav>', content)
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_content)
    except Exception as e:
        pass
        
print("Responsive fixes applied.")
