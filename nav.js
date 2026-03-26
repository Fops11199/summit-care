// Navigation Component JavaScript for Summit Care
// Include this file in all pages that use the navigation

document.addEventListener('DOMContentLoaded', function () {
    // Mobile navigation toggle
    const navToggleButton = document.querySelector('.nav-toggle');
    const siteNav = document.querySelector('#site-nav');

    if (navToggleButton && siteNav) {
        navToggleButton.addEventListener('click', () => {
            const isOpen = siteNav.classList.toggle('open');
            navToggleButton.setAttribute('aria-expanded', String(isOpen));
        });

        // Close nav on link click (mobile)
        const navLinks = siteNav.querySelectorAll('a');
        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                if (siteNav.classList.contains('open')) {
                    siteNav.classList.remove('open');
                    navToggleButton.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // Scroll to a target while accounting for the sticky header height.
    function scrollToSection(target) {
        const header = document.querySelector('.site-header');
        const headerHeight = header ? header.getBoundingClientRect().height : 0;
        const y = Math.max(
            0,
            target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 8
        );

        window.scrollTo({ top: y, behavior: 'smooth' });

        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        try {
            target.focus({ preventScroll: true });
        } catch {
            target.focus();
        }
    }

    // Handle internal page navigation (for home page sections)
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (!href || href.length < 2) return; // skip if just '#'

            const target = document.getElementById(href.substring(1));
            if (target) {
                e.preventDefault();
                scrollToSection(target);
            }
        });
    });

    // Handle cross-page navigation (for home page sections from other pages)
    const homeSectionLinks = document.querySelectorAll('a[href^="index.html#"]');
    homeSectionLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.includes('#')) {
                const [page, section] = href.split('#');
                if (page === 'index.html' && window.location.pathname.includes('index.html')) {
                    // We're already on the home page, scroll to section
                    e.preventDefault();
                    const target = document.getElementById(section);
                    if (target) {
                        scrollToSection(target);
                    }
                }
                // If we're not on the home page, let the link navigate normally
            }
        });
    });

    // Add active state to current page in navigation
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-list a[href]');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Handle dropdown navigation
    const dropdownItems = document.querySelectorAll('.nav-item-dropdown');
    dropdownItems.forEach(item => {
        const dropdownMenu = item.querySelector('.dropdown-menu');

        // Desktop hover
        item.addEventListener('mouseenter', () => {
            if (window.innerWidth > 900) {
                dropdownMenu.style.opacity = '1';
                dropdownMenu.style.visibility = 'visible';
                dropdownMenu.style.transform = 'translateY(0)';
            }
        });

        item.addEventListener('mouseleave', () => {
            if (window.innerWidth > 900) {
                dropdownMenu.style.opacity = '0';
                dropdownMenu.style.visibility = 'hidden';
                dropdownMenu.style.transform = 'translateY(-8px)';
            }
        });

        // Mobile touch
        if (window.innerWidth <= 900) {
            const dropdownLink = item.querySelector('.nav-link-dropdown');
            dropdownLink.addEventListener('click', (e) => {
                e.preventDefault();
                dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
            });
        }
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-item-dropdown')) {
            const openDropdowns = document.querySelectorAll('.dropdown-menu');
            openDropdowns.forEach(dropdown => {
                dropdown.style.opacity = '0';
                dropdown.style.visibility = 'hidden';
                dropdown.style.transform = 'translateY(-8px)';
                if (window.innerWidth <= 900) dropdown.style.display = 'none';
            });
        }
    });

    // Handle window resize for responsive navigation
    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) {
            siteNav.classList.remove('open');
            if (navToggleButton) {
                navToggleButton.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // Handle sticky header scroll state
    const siteHeader = document.querySelector('.site-header');
    if (siteHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                siteHeader.classList.add('scrolled');
            } else {
                siteHeader.classList.remove('scrolled');
            }
        }, { passive: true });
        
        // Initial check in case page is loaded already scrolled
        if (window.scrollY > 50) {
            siteHeader.classList.add('scrolled');
        }
    }

    // ─── Global Auth Navigation State ────────────────────────────────
    function updateAuthNavState() {
        const sessionString = localStorage.getItem('summitCare_userSession');
        if (!sessionString) return;

        try {
            const session = JSON.parse(sessionString);
            const now = new Date().getTime();
            
            // Validate 24-hour expiry
            if (now - session.timestamp > 24 * 60 * 60 * 1000) {
                localStorage.removeItem('summitCare_userSession');
                return;
            }

            // User is actively logged in
            const userDataStr = localStorage.getItem('summitCare_userData');
            const userData = userDataStr ? JSON.parse(userDataStr) : {};
            const firstName = userData.firstName || 'My';

            // 1. Update Desktop Nav Actions (hide Log In/Sign Up, show Dashboard/Logout)
            const desktopNavs = document.querySelectorAll('.nav-actions');
            desktopNavs.forEach(desktopNav => {
                const toggle = desktopNav.querySelector('.nav-toggle');
                const toggleHTML = toggle ? toggle.outerHTML : '';
                
                desktopNav.innerHTML = `
                    <a href="dashboard.html" class="btn btn-outline" style="white-space: nowrap; padding: 0.625rem 1.25rem;">
                        <i class="fas fa-user-circle"></i> ${firstName}'s Portal
                    </a>
                    <a href="appointment.html" class="btn btn-primary btn-pulse" style="white-space: nowrap; padding: 0.625rem 1.25rem;">
                        Book Appointment
                    </a>
                    <a href="javascript:void(0)" onclick="logoutUser()" class="btn btn-outline" style="white-space: nowrap; padding: 0.625rem 1.1rem; border-color: rgba(220,53,69,0.3); color: #dc3545;" title="Log Out">
                        <i class="fas fa-sign-out-alt"></i>
                    </a>
                    ${toggleHTML}
                `;
                
                // Rebind toggle listener if we just recreated its HTML
                const newToggle = desktopNav.querySelector('.nav-toggle');
                const siteNav = document.querySelector('#site-nav');
                if (newToggle && siteNav) {
                    newToggle.addEventListener('click', () => {
                        const isOpen = siteNav.classList.toggle('open');
                        newToggle.setAttribute('aria-expanded', String(isOpen));
                    });
                }
            });

            // 2. Update Mobile Menu (hide auth links)
            const mobileBtns = document.querySelectorAll('.mobile-only-btn a');
            mobileBtns.forEach(btn => {
                const h = btn.getAttribute('href');
                if (h === 'login.html' || h === 'signup.html') {
                    btn.parentElement.style.display = 'none';
                }
            });

            // 3. Inject new Mobile Auth Links
            const navList = document.querySelector('.nav-list') || document.getElementById('main-nav-list');
            if (navList) {
                const dashLi = document.createElement('li');
                dashLi.className = 'mobile-only-btn';
                dashLi.innerHTML = `<a href="dashboard.html" style="color: var(--c-teal-700); font-weight: 600;"><i class="fas fa-columns"></i> Dashboard</a>`;
                
                const logoutLi = document.createElement('li');
                logoutLi.className = 'mobile-only-btn';
                logoutLi.innerHTML = `<a href="javascript:void(0)" onclick="logoutUser()" style="color: #dc3545; font-weight: 600;"><i class="fas fa-sign-out-alt"></i> Log Out</a>`;

                navList.appendChild(dashLi);
                navList.appendChild(logoutLi);
            }
        } catch (e) {
            console.error('Error enforcing auth UI state:', e);
        }
    }

    updateAuthNavState();
});

// Global Logout handler accessible from inline oncick scripts
window.logoutUser = function() {
    localStorage.removeItem('summitCare_userSession');
    // Also clear session identity payload unless specifically saved elsewhere
    localStorage.removeItem('summitCare_userData');
    
    // Redirect cleanly
    window.location.href = window.location.pathname.includes('dashboard.html') ? 'login.html' : window.location.href;
};
