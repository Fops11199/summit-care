import re

print("Patching mobile nav bugs...")

# 1. Fix nav.js empty space bug
with open("nav.js", "r", encoding="utf-8") as f:
    js = f.read()

# Make the click outside hide display as well
js = js.replace(
    "dropdown.style.transform = 'translateY(-8px)';",
    "dropdown.style.transform = 'translateY(-8px)';\n                if (window.innerWidth <= 900) dropdown.style.display = 'none';"
)
# Ensure dropdown menu is display:none by default on load for mobile
# Actually we can do that in CSS: .dropdown-menu { display: none; }
# And let the toggle switch it.

with open("nav.js", "w", encoding="utf-8") as f:
    f.write(js)

# 2. Fix style.css overflow and floating Log In
with open("style.css", "r", encoding="utf-8") as f:
    css = f.read()

# We need to change: `transform: translateY(-110%);` to `transform: translateY(calc(-100% - 76px)); opacity: 0;` inside the @media (max-width: 900px) .site-nav block, OR just update my overrides!

overrides = """
@media (max-width: 900px) {
    /* Critical fix for floating menu items */
    .site-nav {
        transform: translateY(calc(-100% - 80px)) !important;
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
    }
    
    .site-nav.open {
        transform: translateY(0) !important;
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto !important;
    }

    /* Fix the massive gap by default-hiding dropdowns on mobile */
    .dropdown-menu {
        display: none;
    }
}
"""

if "/* Critical fix for floating menu items */" not in css:
    css += "\n" + overrides
    with open("style.css", "w", encoding="utf-8") as f:
        f.write(css)

print("Bugs patched!")
