/**
 * Navigation Menu Internationalization
 * Manages bilingual menu labels
 * Part of: implement-full-site-bilingual-support OpenSpec change
 */

const NAV_I18N = {
  'menu-home': { zh: '主画廊', en: 'Gallery' },
  'menu-critics': { zh: '评论家', en: 'Critics' },
  'menu-about': { zh: '关于', en: 'About' },
  'menu-process': { zh: '过程', en: 'Process' }
};

function updateMenuLanguage(lang) {
  if (!['zh', 'en'].includes(lang)) {
    console.warn(`[Nav i18n] Invalid language: ${lang}`);
    return;
  }

  Object.keys(NAV_I18N).forEach(key => {
    const element = document.querySelector(`.${key} .menu-label`);
    if (element) {
      element.textContent = NAV_I18N[key][lang];
    }
  });

  console.log(`[Nav i18n] Menu updated to: ${lang}`);
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.updateMenuLanguage = updateMenuLanguage;
}

console.log('✓ Navigation i18n loaded');
