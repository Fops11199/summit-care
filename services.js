// Services Page Interactivity for Summit Care
import { servicesData } from './mock-data.js';

document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const grid = document.getElementById('servicesGrid');
    const searchInput = document.getElementById('serviceSearch');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const notFoundMsg = document.getElementById('notFoundMsg');

    let activeCategory = 'All Services';
    let searchTerm = '';

    function renderGrid() {
        if (!grid) return;
        let filtered = servicesData.filter(service => {
            const matchesCategory = activeCategory === 'All Services' || service.category === activeCategory;
            const matchesSearch = service.name.toLowerCase().includes(searchTerm) || service.description.toLowerCase().includes(searchTerm);
            return matchesCategory && matchesSearch;
        });
        grid.innerHTML = '';
        if (filtered.length === 0) {
            if (notFoundMsg) notFoundMsg.classList.remove('hidden');
            return;
        } else {
            if (notFoundMsg) notFoundMsg.classList.add('hidden');
        }
        filtered.forEach(service => {
            const card = document.createElement('div');
            card.className = 'service-card';
            card.innerHTML = `
                <img src="${service.imageUrl}" alt="${service.alt}" class="service-img" />
                <h3 class="service-title">${service.name}</h3>
                <p class="service-desc">${service.description}</p>
                <div class="service-actions">
                    <button class="learn-more-btn" data-id="${service.id}">Learn More</button>
                    <button class="service-cta" data-id="${service.id}">Book Appointment</button>
                </div>
            `;
            card.querySelector('.service-cta').addEventListener('click', function () {
                window.location.href = `appointment.html?service=${service.id}`;
            });
            card.querySelector('.learn-more-btn').addEventListener('click', function () {
                showServicePopup(service);
            });
            grid.appendChild(card);
        });
    }

    // Popup logic
    function showServicePopup(service) {
        let popup = document.getElementById('servicePopup');
        if (!popup) {
            popup = document.createElement('div');
            popup.id = 'servicePopup';
            popup.className = 'service-popup';
            popup.innerHTML = `
                <div class="popup-content">
                    <span class="close-popup" tabindex="0" aria-label="Close popup">&times;</span>
                    <img src="${service.imageUrl}" alt="${service.alt}" class="popup-img" />
                    <h2>${service.name}</h2>
                    <p>${service.description}</p>
                    <a href="appointment.html?service=${service.id}" class="btn btn-primary">Book Appointment</a>
                </div>
            `;
            document.body.appendChild(popup);
            popup.querySelector('.close-popup').addEventListener('click', () => popup.remove());
            popup.querySelector('.close-popup').addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') popup.remove();
            });
        } else {
            popup.querySelector('.popup-img').src = service.imageUrl;
            popup.querySelector('.popup-img').alt = service.alt;
            popup.querySelector('h2').textContent = service.name;
            popup.querySelector('p').textContent = service.description;
            popup.querySelector('a').href = `appointment.html?service=${service.id}`;
            popup.style.display = 'block';
        }
    }

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('keyup', function (e) {
            searchTerm = e.target.value.trim().toLowerCase();
            renderGrid();
        });
    }

    // Category filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = btn.dataset.category;
            renderGrid();
        });
    });

    // Initial render (only if the grid exists)
    if (grid) renderGrid();
});
