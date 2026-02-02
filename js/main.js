/**
 * RALLE Static Site
 * Vanilla JS for progressive enhancement
 */

(function() {
  'use strict';

  // Gallery pagination
  function initGallery() {
    const container = document.querySelector('.gallery-container');
    if (!container) return;

    const pages = container.querySelectorAll('.gallery-page');
    const dots = container.querySelectorAll('.gallery-nav__dot');
    const prevBtn = container.querySelector('.gallery-nav__prev');
    const nextBtn = container.querySelector('.gallery-nav__next');

    if (pages.length < 2) return;

    let currentPage = 0;

    function showPage(index) {
      pages.forEach((page, i) => {
        page.classList.toggle('active', i === index);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === pages.length - 1;
      currentPage = index;
    }

    prevBtn.addEventListener('click', () => {
      if (currentPage > 0) showPage(currentPage - 1);
    });

    nextBtn.addEventListener('click', () => {
      if (currentPage < pages.length - 1) showPage(currentPage + 1);
    });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => showPage(i));
    });
  }

  // Testimonials infinite scroll
  function initTestimonialsGrid() {
    const grid = document.getElementById('testimonials-grid');
    const sentinel = document.getElementById('testimonials-sentinel');
    if (!grid || !sentinel) return;

    const totalImages = 74;
    const batchSize = 12;
    let loaded = 0;

    function loadBatch() {
      if (loaded >= totalImages) return;

      const end = Math.min(loaded + batchSize, totalImages);
      for (let i = loaded + 1; i <= end; i++) {
        const img = document.createElement('img');
        img.src = 'images/testimonials/md/' + i + '.png';
        img.srcset = [
          'images/testimonials/sm/' + i + '.png 240w',
          'images/testimonials/md/' + i + '.png 360w',
          'images/testimonials/lg/' + i + '.png 480w'
        ].join(', ');
        img.sizes = '(max-width: 640px) 50vw, 33vw';
        img.alt = 'RALLE supporter';
        img.loading = 'lazy';
        grid.appendChild(img);
      }
      loaded = end;
    }

    // Initial load
    loadBatch();

    // Infinite scroll with Intersection Observer
    const observer = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting && loaded < totalImages) {
        loadBatch();
      }
    }, { rootMargin: '200px' });

    observer.observe(sentinel);
  }

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    initGallery();
    initTestimonialsGrid();
  });
})();
