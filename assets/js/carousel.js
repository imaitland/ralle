/*!
 * Carousel initialization using Splide.js
 */

// Import Splide
import Splide from '@splidejs/splide';

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  const carouselElement = document.querySelector('#image-carousel');

  if (carouselElement) {
    new Splide('#image-carousel', {
      type: 'loop',           // Enable infinite loop
      autoplay: true,         // Enable auto-play
      interval: 4000,         // 4 seconds between transitions
      speed: 800,             // Transition speed in ms
      pauseOnHover: true,     // Pause when user hovers
      pauseOnFocus: true,     // Pause when user focuses
      arrows: false,          // Hide navigation arrows (clean look)
      pagination: false,      // Hide pagination dots (clean look)
      drag: true,             // Enable drag to navigate
      keyboard: true,         // Enable keyboard navigation
      perPage: 1,             // Show one slide at a time
      gap: 0,                 // No gap between slides
      lazyLoad: 'nearby',     // Lazy load nearby images
      preloadPages: 1,        // Preload 1 page ahead
    }).mount();
  }
});
