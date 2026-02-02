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

  // Testimonials infinite scroll with LQIP blur-up
  function initTestimonialsGrid() {
    const grid = document.getElementById('testimonials-grid');
    const sentinel = document.getElementById('testimonials-sentinel');
    if (!grid || !sentinel) return;

    const totalImages = 74;
    const excludedImages = [9];
    const batchSize = 5;
    let loaded = 0;
    const prefetchCache = new Map();

    // Create image element with wrapper and blurred xs placeholder
    function createImageElement(index) {
      const wrapper = document.createElement('div');
      wrapper.className = 'testimonial-item';

      const img = document.createElement('img');
      img.src = 'images/testimonials/xs/' + index + '.png';
      img.alt = 'RALLE supporter';
      img.className = 'testimonial-img testimonial-img--loading';
      img.dataset.index = index;

      wrapper.appendChild(img);
      return { wrapper: wrapper, img: img };
    }

    // Upgrade image from xs placeholder to full srcset
    function upgradeImage(img) {
      var index = img.dataset.index;
      return new Promise(function(resolve) {
        var fullImg = new Image();
        fullImg.srcset = [
          'images/testimonials/sm/' + index + '.png 240w',
          'images/testimonials/md/' + index + '.png 360w',
          'images/testimonials/lg/' + index + '.png 480w'
        ].join(', ');
        fullImg.sizes = '(max-width: 640px) 50vw, 33vw';
        fullImg.src = 'images/testimonials/md/' + index + '.png';

        var onLoad = function() {
          if (fullImg.decode) {
            fullImg.decode().then(function() {
              img.srcset = fullImg.srcset;
              img.sizes = fullImg.sizes;
              img.src = fullImg.src;
              img.classList.remove('testimonial-img--loading');
              img.classList.add('testimonial-img--loaded');
              resolve();
            }).catch(function() {
              // Fallback if decode fails
              img.srcset = fullImg.srcset;
              img.sizes = fullImg.sizes;
              img.src = fullImg.src;
              img.classList.remove('testimonial-img--loading');
              img.classList.add('testimonial-img--loaded');
              resolve();
            });
          } else {
            // Fallback for browsers without decode()
            img.srcset = fullImg.srcset;
            img.sizes = fullImg.sizes;
            img.src = fullImg.src;
            img.classList.remove('testimonial-img--loading');
            img.classList.add('testimonial-img--loaded');
            resolve();
          }
        };

        if (fullImg.complete) {
          onLoad();
        } else {
          fullImg.onload = onLoad;
          fullImg.onerror = function() {
            img.classList.remove('testimonial-img--loading');
            img.classList.add('testimonial-img--loaded');
            resolve();
          };
        }
      });
    }

    // Prefetch next batch into memory
    function prefetchBatch(start, count) {
      var end = Math.min(start + count, totalImages);
      for (var i = start + 1; i <= end; i++) {
        if (excludedImages.indexOf(i) === -1 && !prefetchCache.has(i)) {
          var img = new Image();
          img.srcset = [
            'images/testimonials/sm/' + i + '.png 240w',
            'images/testimonials/md/' + i + '.png 360w',
            'images/testimonials/lg/' + i + '.png 480w'
          ].join(', ');
          img.sizes = '(max-width: 640px) 50vw, 33vw';
          img.src = 'images/testimonials/md/' + i + '.png';
          prefetchCache.set(i, img);
        }
      }
      // Clear old entries to limit cache size
      if (prefetchCache.size > batchSize * 2) {
        var keys = Array.from(prefetchCache.keys());
        for (var j = 0; j < keys.length - batchSize * 2; j++) {
          prefetchCache.delete(keys[j]);
        }
      }
    }

    function loadBatch() {
      if (loaded >= totalImages) return;

      var images = [];
      var count = 0;

      // Create and append images with blurred placeholders, skipping excluded
      while (count < batchSize && loaded < totalImages) {
        loaded++;
        if (excludedImages.indexOf(loaded) === -1) {
          var elements = createImageElement(loaded);
          grid.appendChild(elements.wrapper);
          images.push(elements.img);
          count++;
        }
      }

      // Upgrade all images in parallel
      Promise.all(images.map(upgradeImage)).then(function() {
        // Prefetch next batch after current batch loads
        if (loaded < totalImages) {
          prefetchBatch(loaded, batchSize);
        }
      });
    }

    // Initial load
    loadBatch();

    // Infinite scroll with Intersection Observer
    var observer = new IntersectionObserver(function(entries) {
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
