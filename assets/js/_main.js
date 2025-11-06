/* ==========================================================================
   Various functions that we want to use within the template
   ========================================================================== */

// Always use light theme
let determineThemeSetting = () => {
  return "light";
};

// Always use light theme
let determineComputedTheme = () => {
  return "light";
};

// Always use light theme
const browserPref = 'light';

// Always set light theme
let setTheme = (theme) => {
  $("html").removeAttr("data-theme");
};

// Theme toggle removed - always use light theme
var toggleTheme = () => {
  // Function kept for compatibility but does nothing
};

/* ==========================================================================
   Plotly integration script so that Markdown codeblocks will be rendered
   ========================================================================== */

// Read the Plotly data from the code block, hide it, and render the chart as new node. This allows for the 
// JSON data to be retrieve when the theme is switched. The listener should only be added if the data is 
// actually present on the page.
import { plotlyDarkLayout, plotlyLightLayout } from './theme.js';
let plotlyElements = document.querySelectorAll("pre>code.language-plotly");
if (plotlyElements.length > 0) {
  document.addEventListener("readystatechange", () => {
    if (document.readyState === "complete") {
      plotlyElements.forEach((elem) => {
        // Parse the Plotly JSON data and hide it
        var jsonData = JSON.parse(elem.textContent);
        elem.parentElement.classList.add("hidden");

        // Add the Plotly node
        let chartElement = document.createElement("div");
        elem.parentElement.after(chartElement);

        // Always use light theme for plots
        const theme = plotlyLightLayout;
        if (jsonData.layout) {
          jsonData.layout.template = (jsonData.layout.template) ? { ...theme, ...jsonData.layout.template } : theme;
        } else {
          jsonData.layout = { template: theme };
        }
        Plotly.react(chartElement, jsonData.data, jsonData.layout);
      });
    }
  });
}

/* ==========================================================================
   Actions that should occur when the page has been fully loaded
   ========================================================================== */

$(document).ready(function () {
  // SCSS SETTINGS - These should be the same as the settings in the relevant files 
  const scssLarge = 925;          // pixels, from /_sass/_themes.scss
  const scssMastheadHeight = 70;  // pixels, from the current theme (e.g., /_sass/theme/_default.scss)

  // Always use light theme
  setTheme();

  // Theme toggle removed

  // Enable the sticky footer
  var bumpIt = function () {
    $("body").css("margin-bottom", $(".page__footer").outerHeight(true));
  }
  $(window).resize(function () {
    didResize = true;
  });
  setInterval(function () {
    if (didResize) {
      didResize = false;
      bumpIt();
    }}, 250);
  var didResize = false;
  bumpIt();

  // FitVids init
  fitvids();

  // Follow menu drop down
  $(".author__urls-wrapper button").on("click", function () {
    $(".author__urls").fadeToggle("fast", function () { });
    $(".author__urls-wrapper button").toggleClass("open");
  });

  // Restore the follow menu if toggled on a window resize
  jQuery(window).on('resize', function () {
    if ($('.author__urls.social-icons').css('display') == 'none' && $(window).width() >= scssLarge) {
      $(".author__urls").css('display', 'block')
    }
  });

  // Init smooth scroll, this needs to be slightly more than then fixed masthead height
  $("a").smoothScroll({
    offset: -scssMastheadHeight,
    preventDefault: false,
  });

  // Initialize Splide carousel
  const carouselElement = document.querySelector('#image-carousel');
  if (carouselElement && typeof Splide !== 'undefined') {
    var splide = new Splide('#image-carousel', {
      type: 'loop',           // Enable infinite loop
      arrows: false,          // Hide navigation arrows (clean look)
      pagination: false,      // Hide pagination dots (clean look)
      drag: true,             // Enable drag to navigate
      perPage: 1,             // Show one slide at a time
      autoplay: true,         // Enable autoplay
      interval: 4000,         // 4 seconds per slide
      speed: 1000,            // Transition speed
      pauseOnHover: false,    // Don't pause on hover
      pauseOnFocus: false,    // Don't pause on focus
    });

    splide.mount();
  }

});
