// Summit Care - Main JavaScript File

document.addEventListener('DOMContentLoaded', function () {
  // Initialize all components
  initCarousel();
  initBackToTop();
  initNewsletterForm();
  initFormValidation();
  initThreeJS();
  initRevealAnimations();

  // Set current year in footer
  document.getElementById('year').textContent = new Date().getFullYear();
});

// Testimonial Carousel
function initCarousel() {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.testimonial-card');
  const dotsContainer = carousel.querySelector('.carousel-dots');
  const prevBtn = carousel.querySelector('.carousel-btn.prev');
  const nextBtn = carousel.querySelector('.carousel-btn.next');

  let currentSlide = 0;
  const totalSlides = slides.length;

  // Create dots dynamically
  if (dotsContainer) {
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      dotsContainer.appendChild(dot);
    }
  }

  const dots = carousel.querySelectorAll('.carousel-dot');

  function showSlide(index) {
    // Hide all slides
    slides.forEach((slide, i) => {
      slide.style.display = i === index ? 'block' : 'none';
    });

    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
      dot.setAttribute('aria-pressed', i === index ? 'true' : 'false');
    });

    currentSlide = index;
  }

  function nextSlide() {
    showSlide((currentSlide + 1) % totalSlides);
  }

  function prevSlide() {
    showSlide((currentSlide - 1 + totalSlides) % totalSlides);
  }

  // Event listeners
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
  });

  // Auto-advance
  setInterval(nextSlide, 5000);

  // Initialize first slide
  showSlide(0);
}

// Back to Top Button
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  function toggleBackToTop() {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  window.addEventListener('scroll', toggleBackToTop);
  backToTopBtn.addEventListener('click', scrollToTop);
}

// Newsletter Form
function initNewsletterForm() {
  const newsletterForm = document.getElementById('newsletterForm');
  if (!newsletterForm) return;

  newsletterForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const emailInput = this.querySelector('input[type="email"]');
    const email = emailInput.value.trim();

    if (!email) {
      showToast('Please enter your email address.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    // Show loading state
    const submitBtn = this.querySelector('.newsletter-btn');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;

    // Simulate subscription
    setTimeout(() => {
      showToast('Thank you for subscribing to our newsletter!', 'success');
      emailInput.value = '';
      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled = false;
    }, 1500);
  });
}

// Form Validation
function initFormValidation() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const message = formData.get('message').trim();

    let isValid = true;
    let errorMessage = '';

    if (!name) {
      errorMessage = 'Please enter your name.';
      isValid = false;
    } else if (!email) {
      errorMessage = 'Please enter your email address.';
      isValid = false;
    } else if (!isValidEmail(email)) {
      errorMessage = 'Please enter a valid email address.';
      isValid = false;
    } else if (!message) {
      errorMessage = 'Please enter your message.';
      isValid = false;
    }

    if (!isValid) {
      showToast(errorMessage, 'error');
      return;
    }

    // Show success message
    showToast('Thank you for your message! We\'ll get back to you soon.', 'success');
    this.reset();
  });
}

// Three.js Background Animation
function initThreeJS() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  // Create particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 100;
  const posArray = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: 0x87CEEB,
    transparent: true,
    opacity: 0.8
  });

  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // Create geometric shapes
  const geometry = new THREE.IcosahedronGeometry(0.5, 0);
  const material = new THREE.MeshBasicMaterial({
    color: 0x90EE90,
    wireframe: true,
    transparent: true,
    opacity: 0.3
  });

  const shapes = [];
  for (let i = 0; i < 5; i++) {
    const shape = new THREE.Mesh(geometry, material);
    shape.position.set(
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 8
    );
    shape.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    shapes.push(shape);
    scene.add(shape);
  }

  camera.position.z = 5;

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    particlesMesh.rotation.y += 0.001;
    particlesMesh.rotation.x += 0.0005;

    shapes.forEach((shape, index) => {
      shape.rotation.x += 0.01 + index * 0.001;
      shape.rotation.y += 0.01 + index * 0.001;
    });

    renderer.render(scene, camera);
  }

  animate();

  // Handle window resize
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener('resize', onWindowResize);
}

// Reveal Animations on Scroll
function initRevealAnimations() {
  const revealElements = document.querySelectorAll('.reveal-up');

  if (revealElements.length === 0) {
    console.log('No reveal-up elements found');
    return;
  }

  console.log(`Found ${revealElements.length} reveal-up elements`);

  // Add animated class to enable animations
  revealElements.forEach(element => {
    element.classList.add('animated');
  });

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        console.log('Element in view:', entry.target);
        // Unobserve after animation to improve performance
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(element => {
    observer.observe(element);
    // For debugging: show elements immediately on mobile
    if (window.innerWidth < 768) {
      element.classList.add('in-view');
    }
  });

  // Fallback: show all elements after a delay if they're still hidden
  setTimeout(() => {
    revealElements.forEach(element => {
      if (!element.classList.contains('in-view')) {
        element.classList.add('in-view');
        console.log('Fallback: showing element:', element);
      }
    });
  }, 2000);
}

// Utility Functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Toast Notification System
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


