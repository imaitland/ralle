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

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    initGallery();
  });
})();
