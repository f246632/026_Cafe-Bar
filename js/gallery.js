/**
 * KAFFEE.BAR - Gallery & Lightbox JavaScript
 * Handles image gallery interactions and lightbox modal
 */

// ============================================
// GALLERY INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  initGallery();
  initLightbox();
});

// Gallery images array
const galleryImages = [
  {
    src: 'images/street-view-1.jpg',
    alt: 'KAFFEE.BAR exterior view - Prenzlauer Berg location'
  },
  {
    src: 'images/street-view-2.jpg',
    alt: 'KAFFEE.BAR street corner - welcoming entrance'
  },
  {
    src: 'images/street-view-3.jpg',
    alt: 'KAFFEE.BAR neighborhood - vibrant Stargarder Straße'
  }
];

let currentImageIndex = 0;

// ============================================
// GALLERY FUNCTIONALITY
// ============================================
function initGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', function() {
      currentImageIndex = index;
      openLightbox(index);
    });

    // Keyboard accessibility
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `View image ${index + 1} in lightbox`);

    item.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        currentImageIndex = index;
        openLightbox(index);
      }
    });
  });
}

// ============================================
// LIGHTBOX FUNCTIONALITY
// ============================================
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.querySelector('.lightbox-image');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  if (!lightbox) return;

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  // Previous button
  if (prevBtn) {
    prevBtn.addEventListener('click', showPreviousImage);
  }

  // Next button
  if (nextBtn) {
    nextBtn.addEventListener('click', showNextImage);
  }

  // Click outside image to close
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('active')) return;

    switch(e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        showPreviousImage();
        break;
      case 'ArrowRight':
        showNextImage();
        break;
    }
  });

  // Touch swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next image
        showNextImage();
      } else {
        // Swipe right - previous image
        showPreviousImage();
      }
    }
  }
}

// ============================================
// LIGHTBOX CONTROLS
// ============================================
function openLightbox(index) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.querySelector('.lightbox-image');

  if (!lightbox || !lightboxImage) return;

  currentImageIndex = index;

  // Update image
  lightboxImage.src = galleryImages[index].src;
  lightboxImage.alt = galleryImages[index].alt;

  // Show lightbox
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Add fade-in animation
  lightboxImage.style.opacity = '0';
  setTimeout(() => {
    lightboxImage.style.transition = 'opacity 0.3s ease';
    lightboxImage.style.opacity = '1';
  }, 10);

  // Preload adjacent images for better performance
  preloadAdjacentImages(index);
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.querySelector('.lightbox-image');

  if (!lightbox) return;

  // Fade out animation
  lightboxImage.style.opacity = '0';

  setTimeout(() => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }, 200);
}

function showNextImage() {
  currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
  updateLightboxImage();
}

function showPreviousImage() {
  currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
  updateLightboxImage();
}

function updateLightboxImage() {
  const lightboxImage = document.querySelector('.lightbox-image');

  if (!lightboxImage) return;

  // Fade out
  lightboxImage.style.opacity = '0';

  setTimeout(() => {
    // Update image
    lightboxImage.src = galleryImages[currentImageIndex].src;
    lightboxImage.alt = galleryImages[currentImageIndex].alt;

    // Fade in
    lightboxImage.style.opacity = '1';

    // Preload adjacent images
    preloadAdjacentImages(currentImageIndex);
  }, 200);
}

// ============================================
// PERFORMANCE OPTIMIZATIONS
// ============================================
function preloadAdjacentImages(index) {
  const nextIndex = (index + 1) % galleryImages.length;
  const prevIndex = (index - 1 + galleryImages.length) % galleryImages.length;

  // Preload next image
  const nextImg = new Image();
  nextImg.src = galleryImages[nextIndex].src;

  // Preload previous image
  const prevImg = new Image();
  prevImg.src = galleryImages[prevIndex].src;
}

// Preload all gallery images on page load for better UX
function preloadGalleryImages() {
  galleryImages.forEach(image => {
    const img = new Image();
    img.src = image.src;
  });
}

// Start preloading after page load
window.addEventListener('load', function() {
  // Delay preloading to not interfere with critical resources
  setTimeout(preloadGalleryImages, 1000);
});

// ============================================
// GALLERY ANIMATIONS
// ============================================
function animateGalleryOnScroll() {
  const gallerySection = document.querySelector('.gallery');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!gallerySection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        galleryItems.forEach((item, index) => {
          setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

            requestAnimationFrame(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            });
          }, index * 100);
        });

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });

  observer.observe(gallerySection);
}

// Initialize gallery animations
document.addEventListener('DOMContentLoaded', animateGalleryOnScroll);

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================
function enhanceGalleryAccessibility() {
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach((item, index) => {
    // Add ARIA labels
    item.setAttribute('aria-label', `Gallery image ${index + 1} of ${galleryItems.length}`);

    // Add role for screen readers
    item.setAttribute('role', 'button');

    // Visual focus indicator
    item.addEventListener('focus', function() {
      this.style.outline = '3px solid #6B4226';
      this.style.outlineOffset = '4px';
    });

    item.addEventListener('blur', function() {
      this.style.outline = 'none';
    });
  });
}

// Initialize accessibility enhancements
document.addEventListener('DOMContentLoaded', enhanceGalleryAccessibility);

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Get image dimensions
function getImageDimensions(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = src;
  });
}

// Check if image is loaded
function isImageLoaded(img) {
  return img.complete && img.naturalHeight !== 0;
}

// Console info
console.log('%cGallery Module Loaded', 'color: #6B4226; font-weight: bold;');
console.log(`📸 ${galleryImages.length} images available in gallery`);
