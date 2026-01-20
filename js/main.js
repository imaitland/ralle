/**
 * RALLE Static Site
 * Vanilla JS for progressive enhancement
 */

(function() {
  'use strict';

  // FAQ accordion
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
      const header = item.querySelector('h3');
      if (!header) return;

      header.addEventListener('click', () => {
        // Close other items
        faqItems.forEach(other => {
          if (other !== item && other.classList.contains('open')) {
            other.classList.remove('open');
          }
        });

        // Toggle current item
        item.classList.toggle('open');
      });

      // Keyboard accessibility
      header.setAttribute('tabindex', '0');
      header.setAttribute('role', 'button');
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          header.click();
        }
      });
    });

    // Open FAQ item based on URL hash, or first item by default
    const hash = window.location.hash.slice(1);
    const targetItem = hash ? document.querySelector(`.faq-item#${CSS.escape(hash)}`) : null;

    if (targetItem) {
      targetItem.classList.add('open');
    } else if (faqItems.length > 0) {
      faqItems[0].classList.add('open');
    }
  }

  // Smooth scroll for anchor links
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();

          // If target is a FAQ item, open it and close others
          if (target.classList.contains('faq-item')) {
            document.querySelectorAll('.faq-item.open').forEach(item => {
              if (item !== target) item.classList.remove('open');
            });
            target.classList.add('open');
          }

          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          // Update URL without jumping
          history.pushState(null, null, targetId);
        }
      });
    });
  }

  // Handle hash on page load (for direct links to sections)
  function handleHashOnLoad() {
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
      }
    }
  }

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    initFAQ();
    initSmoothScroll();
    handleHashOnLoad();
  });
})();
