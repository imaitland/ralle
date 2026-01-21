/**
 * RALLE Internationalization (i18n) Engine
 * Vanilla JS translation system with JSON locale files
 */

(function() {
  'use strict';

  const I18n = {
    currentLocale: 'en',
    defaultLocale: 'en',
    supportedLocales: ['en', 'es-MX', 'zh-CN'],
    translations: {},
    isReady: false,

    /**
     * Initialize the i18n system
     */
    async init() {
      this.currentLocale = this.detectLanguage();
      await this.loadTranslations(this.currentLocale);
      this.applyTranslations();
      this.updateHtmlLang();
      this.initLanguageSwitcher();
      this.markReady();
    },

    /**
     * Detect user's preferred language
     * Priority: URL param > localStorage > browser language > default
     */
    detectLanguage() {
      // 1. Check URL parameter
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get('lang');
      if (urlLang && this.supportedLocales.includes(urlLang)) {
        localStorage.setItem('ralle-lang', urlLang);
        return urlLang;
      }

      // 2. Check localStorage
      const storedLang = localStorage.getItem('ralle-lang');
      if (storedLang && this.supportedLocales.includes(storedLang)) {
        return storedLang;
      }

      // 3. Check browser language
      const browserLang = navigator.language || navigator.userLanguage;
      if (browserLang) {
        // Check for exact match first
        if (this.supportedLocales.includes(browserLang)) {
          return browserLang;
        }
        // Check for language family match (e.g., 'es' matches 'es-MX')
        const langFamily = browserLang.split('-')[0];
        const familyMatch = this.supportedLocales.find(locale =>
          locale.startsWith(langFamily + '-') || locale === langFamily
        );
        if (familyMatch) {
          return familyMatch;
        }
      }

      // 4. Default to English
      return this.defaultLocale;
    },

    /**
     * Load translations from JSON file
     */
    async loadTranslations(locale) {
      try {
        const response = await fetch(`locales/${locale}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load locale: ${locale}`);
        }
        this.translations = await response.json();
        this.currentLocale = locale;
      } catch (error) {
        console.warn(`Failed to load ${locale}, falling back to ${this.defaultLocale}`, error);
        if (locale !== this.defaultLocale) {
          await this.loadTranslations(this.defaultLocale);
        }
      }
    },

    /**
     * Get a translation by key (supports nested keys like "hero.title")
     */
    t(key) {
      const keys = key.split('.');
      let value = this.translations;

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          console.warn(`Translation not found: ${key}`);
          return key;
        }
      }

      return value;
    },

    /**
     * Apply translations to all elements with data-i18n attribute
     */
    applyTranslations() {
      document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = this.t(key);

        if (translation !== key) {
          // Check if element has data-i18n-html attribute for HTML content
          if (element.hasAttribute('data-i18n-html')) {
            element.innerHTML = translation;
          } else {
            element.textContent = translation;
          }
        }
      });

      // Handle placeholder attributes
      document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const translation = this.t(key);
        if (translation !== key) {
          element.placeholder = translation;
        }
      });

      // Handle aria-label attributes
      document.querySelectorAll('[data-i18n-aria]').forEach(element => {
        const key = element.getAttribute('data-i18n-aria');
        const translation = this.t(key);
        if (translation !== key) {
          element.setAttribute('aria-label', translation);
        }
      });

      // Handle title attribute
      document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        const translation = this.t(key);
        if (translation !== key) {
          element.setAttribute('title', translation);
        }
      });

      // Handle meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && this.translations.meta && this.translations.meta.description) {
        metaDesc.setAttribute('content', this.translations.meta.description);
      }

      // Handle page title
      if (this.translations.meta && this.translations.meta.title) {
        document.title = this.translations.meta.title;
      }
    },

    /**
     * Update the html lang attribute
     */
    updateHtmlLang() {
      document.documentElement.lang = this.currentLocale.split('-')[0];
    },

    /**
     * Initialize language switcher buttons
     */
    initLanguageSwitcher() {
      document.querySelectorAll('[data-lang]').forEach(button => {
        const lang = button.getAttribute('data-lang');

        // Mark current language as active
        if (lang === this.currentLocale) {
          button.classList.add('active');
          button.setAttribute('aria-current', 'true');
        } else {
          button.classList.remove('active');
          button.removeAttribute('aria-current');
        }

        // Add click handler
        button.addEventListener('click', (e) => {
          e.preventDefault();
          this.switchLanguage(lang);
        });
      });
    },

    /**
     * Switch to a different language
     */
    async switchLanguage(locale) {
      if (!this.supportedLocales.includes(locale) || locale === this.currentLocale) {
        return;
      }

      // Store preference
      localStorage.setItem('ralle-lang', locale);

      // Update URL without page reload
      const url = new URL(window.location);
      url.searchParams.set('lang', locale);
      history.replaceState(null, '', url);

      // Load new translations and apply
      await this.loadTranslations(locale);
      this.applyTranslations();
      this.updateHtmlLang();

      // Update switcher button states
      document.querySelectorAll('[data-lang]').forEach(button => {
        const lang = button.getAttribute('data-lang');
        if (lang === locale) {
          button.classList.add('active');
          button.setAttribute('aria-current', 'true');
        } else {
          button.classList.remove('active');
          button.removeAttribute('aria-current');
        }
      });
    },

    /**
     * Mark the page as ready (removes FOUC prevention)
     */
    markReady() {
      this.isReady = true;
      document.documentElement.setAttribute('data-i18n-ready', '');
    }
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => I18n.init());
  } else {
    I18n.init();
  }

  // Expose for external use
  window.I18n = I18n;
})();
