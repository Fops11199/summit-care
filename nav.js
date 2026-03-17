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

    // Handle internal page navigation (for home page sections)
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (!href || href.length < 2) return; // skip if just '#'

            const target = document.getElementById(href.substring(1));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
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
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
                        target.focus({ preventScroll: true });
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
});
