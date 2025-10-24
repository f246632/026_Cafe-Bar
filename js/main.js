/**
 * KAFFEE.BAR - Main JavaScript
 * Handles navigation, menu loading, reviews, forms, and smooth scrolling
 */

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  initSmoothScrolling();
  initScrollAnimations();
  loadMenu();
  loadReviews();
  initContactForm();
  initIntersectionObserver();
});

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Navbar scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });

  // Mobile menu toggle
  if (navToggle) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      this.classList.toggle('active');
    });
  }

  // Close mobile menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navMenu.classList.remove('active');
      if (navToggle) {
        navToggle.classList.remove('active');
      }
    });
  });

  // Active link highlighting
  window.addEventListener('scroll', function() {
    let current = '';
    const sections = document.querySelectorAll('section[id]');

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// ============================================
// SMOOTH SCROLLING
// ============================================
function initSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

      if (href === '#' || href === '#home') {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        return;
      }

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
  const fadeElements = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1
  });

  fadeElements.forEach(element => {
    observer.observe(element);
  });
}

// ============================================
// MENU LOADING
// ============================================
async function loadMenu() {
  try {
    const response = await fetch('data/menu.json');
    const menuData = await response.json();
    const menuContainer = document.getElementById('menu-content');

    if (!menuContainer) return;

    menuData.categories.forEach(category => {
      const categoryElement = createMenuCategory(category);
      menuContainer.appendChild(categoryElement);
    });
  } catch (error) {
    console.error('Error loading menu:', error);
    displayMenuError();
  }
}

function createMenuCategory(category) {
  const categoryDiv = document.createElement('div');
  categoryDiv.className = 'menu-category fade-in';

  const categoryTitle = document.createElement('h3');
  categoryTitle.textContent = category.name;

  const categoryDesc = document.createElement('p');
  categoryDesc.className = 'menu-category-description';
  categoryDesc.textContent = category.description;

  const itemsContainer = document.createElement('div');
  itemsContainer.className = 'menu-items';

  category.items.forEach(item => {
    const itemElement = createMenuItem(item);
    itemsContainer.appendChild(itemElement);
  });

  categoryDiv.appendChild(categoryTitle);
  categoryDiv.appendChild(categoryDesc);
  categoryDiv.appendChild(itemsContainer);

  return categoryDiv;
}

function createMenuItem(item) {
  const itemDiv = document.createElement('div');
  itemDiv.className = 'menu-item';

  const itemHeader = document.createElement('div');
  itemHeader.className = 'menu-item-header';

  const itemName = document.createElement('div');
  itemName.className = 'menu-item-name';
  itemName.textContent = item.name;

  const itemPrice = document.createElement('div');
  itemPrice.className = 'menu-item-price';
  itemPrice.textContent = item.price;

  itemHeader.appendChild(itemName);
  itemHeader.appendChild(itemPrice);

  const itemDesc = document.createElement('div');
  itemDesc.className = 'menu-item-description';
  itemDesc.textContent = item.description;

  itemDiv.appendChild(itemHeader);
  itemDiv.appendChild(itemDesc);

  // Add dietary tags if available
  if (item.dietary && item.dietary.length > 0) {
    const dietaryContainer = document.createElement('div');
    dietaryContainer.className = 'menu-item-dietary';

    item.dietary.forEach(tag => {
      const tagSpan = document.createElement('span');
      tagSpan.className = 'dietary-tag';
      tagSpan.textContent = tag;
      dietaryContainer.appendChild(tagSpan);
    });

    itemDiv.appendChild(dietaryContainer);
  }

  return itemDiv;
}

function displayMenuError() {
  const menuContainer = document.getElementById('menu-content');
  if (menuContainer) {
    menuContainer.innerHTML = '<p style="text-align: center; color: #666;">Menu is currently unavailable. Please visit us or call for menu information.</p>';
  }
}

// ============================================
// REVIEWS LOADING
// ============================================
async function loadReviews() {
  try {
    const response = await fetch('data/reviews.json');
    const reviewsData = await response.json();
    const reviewsContainer = document.getElementById('reviews-content');

    if (!reviewsContainer) return;

    reviewsData.reviews.forEach(review => {
      const reviewElement = createReviewCard(review);
      reviewsContainer.appendChild(reviewElement);
    });
  } catch (error) {
    console.error('Error loading reviews:', error);
  }
}

function createReviewCard(review) {
  const card = document.createElement('div');
  card.className = 'review-card fade-in';

  const header = document.createElement('div');
  header.className = 'review-header';

  const author = document.createElement('div');
  author.className = 'review-author';
  author.textContent = review.author;

  const rating = document.createElement('div');
  rating.className = 'review-rating';
  rating.textContent = '★'.repeat(review.rating);

  header.appendChild(author);
  header.appendChild(rating);

  const text = document.createElement('p');
  text.className = 'review-text';
  text.textContent = `"${review.text}"`;

  const date = document.createElement('div');
  date.className = 'review-date';
  date.textContent = review.date;

  card.appendChild(header);
  card.appendChild(text);
  card.appendChild(date);

  return card;
}

// ============================================
// CONTACT FORM
// ============================================
function initContactForm() {
  const form = document.getElementById('contact-form');

  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form data
    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      message: document.getElementById('message').value
    };

    // Validate form
    if (!validateForm(formData)) {
      return;
    }

    // Show success message
    showFormMessage('success', 'Thank you for your message! We\'ll get back to you soon.');

    // Reset form
    form.reset();
  });
}

function validateForm(data) {
  // Name validation
  if (data.name.trim().length < 2) {
    showFormMessage('error', 'Please enter your name.');
    return false;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    showFormMessage('error', 'Please enter a valid email address.');
    return false;
  }

  // Message validation
  if (data.message.trim().length < 10) {
    showFormMessage('error', 'Please enter a message (at least 10 characters).');
    return false;
  }

  return true;
}

function showFormMessage(type, message) {
  // Remove existing messages
  const existingMessage = document.querySelector('.form-message');
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create new message
  const messageDiv = document.createElement('div');
  messageDiv.className = `form-message form-message-${type}`;
  messageDiv.textContent = message;

  // Style the message
  messageDiv.style.padding = '1rem';
  messageDiv.style.borderRadius = '8px';
  messageDiv.style.marginTop = '1rem';
  messageDiv.style.textAlign = 'center';
  messageDiv.style.fontWeight = '500';

  if (type === 'success') {
    messageDiv.style.background = '#d4edda';
    messageDiv.style.color = '#155724';
    messageDiv.style.border = '1px solid #c3e6cb';
  } else {
    messageDiv.style.background = '#f8d7da';
    messageDiv.style.color = '#721c24';
    messageDiv.style.border = '1px solid #f5c6cb';
  }

  // Insert message
  const form = document.getElementById('contact-form');
  form.appendChild(messageDiv);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    messageDiv.style.transition = 'opacity 0.5s ease';
    messageDiv.style.opacity = '0';
    setTimeout(() => messageDiv.remove(), 500);
  }, 5000);
}

// ============================================
// INTERSECTION OBSERVER
// ============================================
function initIntersectionObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in', 'visible');
      }
    });
  }, observerOptions);

  // Observe all major sections
  const sections = document.querySelectorAll('section > .container > *');
  sections.forEach(section => {
    observer.observe(section);
  });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// ============================================
// PERFORMANCE OPTIMIZATIONS
// ============================================

// Lazy load images
if ('loading' in HTMLImageElement.prototype) {
  const images = document.querySelectorAll('img[loading="lazy"]');
  images.forEach(img => {
    img.src = img.src;
  });
} else {
  // Fallback for browsers that don't support lazy loading
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
  document.body.appendChild(script);
}

// Console welcome message
console.log('%cKAFFEE.BAR', 'font-size: 24px; font-weight: bold; color: #6B4226;');
console.log('%cWelcome to our website! ☕', 'font-size: 14px; color: #666;');
console.log('%cVisit us at Stargarder Straße 55a, 10437 Berlin', 'font-size: 12px; color: #999;');
