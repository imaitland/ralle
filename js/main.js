/**
 * RALLE Static Site
 * Vanilla JS for progressive enhancement
 */

(function() {
  'use strict';

  // Smooth scroll for anchor links
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();

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

  // Page navigation rail - track active section
  function initPageNav() {
    const pageNav = document.querySelector('.page-nav');
    if (!pageNav) return;

    const navItems = pageNav.querySelectorAll('.page-nav__item');
    if (!navItems.length) return;

    // Get all target sections from nav hrefs
    const sections = [];
    navItems.forEach(item => {
      const href = item.getAttribute('href');
      if (href && href.startsWith('#')) {
        const section = document.querySelector(href);
        if (section) {
          sections.push({ id: href.slice(1), element: section, navItem: item });
        }
      }
    });

    if (!sections.length) return;

    // Intersection Observer to track visible sections
    let currentActive = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const activeSection = sections.find(s => s.element === entry.target);
            if (activeSection && activeSection.navItem !== currentActive) {
              navItems.forEach(item => {
                item.classList.remove('active');
                item.removeAttribute('aria-current');
              });
              activeSection.navItem.classList.add('active');
              activeSection.navItem.setAttribute('aria-current', 'true');
              currentActive = activeSection.navItem;
            }
          }
        });
      },
      {
        rootMargin: '-30% 0px -70% 0px',
        threshold: 0
      }
    );

    // Observe all sections
    sections.forEach(({ element }) => observer.observe(element));

    // Set initial active state based on scroll position or first item
    setTimeout(() => {
      if (!currentActive && navItems[0]) {
        navItems[0].classList.add('active');
        navItems[0].setAttribute('aria-current', 'true');
        currentActive = navItems[0];
      }
    }, 150);
  }

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    initSmoothScroll();
    handleHashOnLoad();
    initPageNav();
  });
})();
