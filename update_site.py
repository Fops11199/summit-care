import os
import glob
import re

print("Starting update script...")

# 1. Update style.css
try:
    with open('style.css', 'r', encoding='utf-8') as f:
        css = f.read()
    
    css = css.replace('Outfit', 'Poppins')
    
    if '.logo-img' not in css:
        css += '\n.logo-img { max-height: 40px; width: auto; }\n'
        css += '.footer-brand .logo-img { max-height: 48px; }\n'
        
    with open('style.css', 'w', encoding='utf-8') as f:
        f.write(css)
    print("style.css updated")
except Exception as e:
    print(f"Error updating style.css: {e}")

# 2. Rename logo file to remove spaces
old_logo = 'images/summit care logo.png'
new_logo = 'images/summit-care-logo.png'
if os.path.exists(old_logo):
    os.rename(old_logo, new_logo)
    print("Renamed logo image")

# 3. Update HTML files
html_files = glob.glob('*.html')
logo_html_pattern = r'<span class="logo-mark"[^>]*>.*?</span>\s*<span class="logo-text">Summit Care</span>'
new_logo_html = '<img src="images/summit-care-logo.png" alt="Summit Care Logo" class="logo-img">'

for filepath in html_files:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Font link
        content = content.replace('family=Outfit', 'family=Poppins')
        
        # Logo
        content = re.sub(logo_html_pattern, new_logo_html, content, flags=re.DOTALL)
        
        # Placeholder Links - Social
        content = re.sub(r'href="#"([^>]*)aria-label="Facebook"', r'href="https://facebook.com/summitcare"\1aria-label="Facebook"', content)
        content = re.sub(r'href="#"([^>]*)aria-label="Twitter"', r'href="https://twitter.com/summitcare"\1aria-label="Twitter"', content)
        content = re.sub(r'href="#"([^>]*)aria-label="Instagram"', r'href="https://instagram.com/summitcare"\1aria-label="Instagram"', content)
        content = re.sub(r'href="#"([^>]*)aria-label="LinkedIn"', r'href="https://linkedin.com/company/summitcare"\1aria-label="LinkedIn"', content)
        content = re.sub(r'href="#"([^>]*)aria-label="YouTube"', r'href="https://youtube.com/summitcare"\1aria-label="YouTube"', content)
        
        # Legal links that are currently '#'
        content = re.sub(r'href="#"([^>]*)>Privacy Policy</a>', r'href="privacy.html"\1>Privacy Policy</a>', content)
        content = re.sub(r'href="#"([^>]*)>Terms of Service</a>', r'href="terms.html"\1>Terms of Service</a>', content)
        content = re.sub(r'href="#"([^>]*)>HIPAA Notice</a>', r'href="privacy.html"\1>HIPAA Notice</a>', content)
        
        # Replace the rest with javascript:void(0) to prevent page jumps
        content = content.replace('href="#"', 'href="javascript:void(0)"')

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
    except Exception as e:
        print(f"Error on {filepath}: {e}")

print("Update script finished.")
