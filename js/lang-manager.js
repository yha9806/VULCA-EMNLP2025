/**
 * Language Manager
 * Handles language selection with priority: URL > localStorage > default
 * Part of: implement-full-site-bilingual-support OpenSpec change
 */

class LanguageManager {
  constructor() {
    this.defaultLang = 'zh';
    this.storageKey = 'preferred-lang';
    this.validLangs = ['zh', 'en'];
  }

  getCurrentLanguage() {
    // 1. Check URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang && this.validLangs.includes(urlLang)) {
      return urlLang;
    }

    // 2. Check localStorage
    const storedLang = localStorage.getItem(this.storageKey);
    if (storedLang && this.validLangs.includes(storedLang)) {
      return storedLang;
    }

    // 3. Default
    return this.defaultLang;
  }

  setLanguage(lang, updateStorage = true) {
    if (!this.validLangs.includes(lang)) {
      console.error(`[LangManager] Invalid language: ${lang}`);
      return;
    }

    document.documentElement.setAttribute('data-lang', lang);

    // Only update localStorage if not from URL parameter
    if (updateStorage) {
      localStorage.setItem(this.storageKey, lang);
    }

    // Update toggle button
    this.updateToggleButton(lang);

    // Update navigation menu
    if (typeof window.updateMenuLanguage === 'function') {
      window.updateMenuLanguage(lang);
    }

    // Update meta tags
    if (typeof window.updateMetaTags === 'function') {
      window.updateMetaTags(lang);
    }

    // Dispatch custom event
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));

    console.log(`[LangManager] Language set to: ${lang}`);
  }

  initialize() {
    const lang = this.getCurrentLanguage();
    const fromUrl = new URLSearchParams(window.location.search).has('lang');

    // Set language without updating storage if from URL
    this.setLanguage(lang, !fromUrl);

    // Update button text
    this.updateToggleButton(lang);
  }

  updateToggleButton(lang) {
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
      const langText = langToggle.querySelector('.lang-text');
      if (langText) {
        // Show the language the button will switch to (opposite of current)
        langText.textContent = lang === 'zh' ? 'EN' : '中';
      }
    }
  }
}

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const langManager = new LanguageManager();
    langManager.initialize();
    window.langManager = langManager;
  });
} else {
  const langManager = new LanguageManager();
  langManager.initialize();
  window.langManager = langManager;
}

console.log('✓ Language Manager loaded');
