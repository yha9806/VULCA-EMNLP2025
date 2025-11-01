/**
 * Scroll Prevention Module
 *
 * Prevents scrolling on immersive gallery main page while allowing
 * full scroll functionality on detail pages.
 *
 * Usage:
 *   - On main gallery (index.html): window.IMMERSIVE_MODE = true
 *   - On detail pages (/pages/*.html): window.IMMERSIVE_MODE = false
 *
 * @version 1.0.0
 */

class ScrollPrevention {
  constructor() {
    this.isEnabled = false;
    this.scrollKeys = ['Space', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown'];

    // Bind methods to preserve 'this' context
    this.preventWheelScroll = this.preventWheelScroll.bind(this);
    this.preventKeyScroll = this.preventKeyScroll.bind(this);
    this.preventTouchScroll = this.preventTouchScroll.bind(this);
  }

  /**
   * Enable scroll prevention
   * Adds event listeners and CSS overrides
   */
  enable() {
    if (this.isEnabled) return;

    // Add wheel scroll prevention (mouse + trackpad)
    document.addEventListener('wheel', this.preventWheelScroll, { passive: false });

    // Add keyboard scroll prevention
    document.addEventListener('keydown', this.preventKeyScroll);

    // Add touch scroll prevention
    document.addEventListener('touchmove', this.preventTouchScroll, { passive: false });

    // CSS overflow prevention
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Prevent overscroll bounce on iOS
    if (this.isIOS()) {
      document.body.style.overscrollBehavior = 'none';
      document.documentElement.style.overscrollBehavior = 'none';
    }

    this.isEnabled = true;

    // Log for debugging
    if (typeof console !== 'undefined' && console.log) {
      console.log('[ScrollPrevention] Scroll prevention enabled');
    }
  }

  /**
   * Disable scroll prevention
   * Removes event listeners and CSS overrides
   */
  disable() {
    if (!this.isEnabled) return;

    // Remove event listeners
    document.removeEventListener('wheel', this.preventWheelScroll);
    document.removeEventListener('keydown', this.preventKeyScroll);
    document.removeEventListener('touchmove', this.preventTouchScroll);

    // Remove CSS overflow override
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    document.body.style.overscrollBehavior = '';
    document.documentElement.style.overscrollBehavior = '';

    this.isEnabled = false;

    // Log for debugging
    if (typeof console !== 'undefined' && console.log) {
      console.log('[ScrollPrevention] Scroll prevention disabled');
    }
  }

  /**
   * Prevent wheel scroll (mouse wheel, trackpad)
   * @param {WheelEvent} event
   */
  preventWheelScroll(event) {
    if (window.IMMERSIVE_MODE === true) {
      event.preventDefault();
    }
  }

  /**
   * Prevent keyboard scroll (Space, Arrow keys, Page Up/Down)
   * @param {KeyboardEvent} event
   */
  preventKeyScroll(event) {
    // Only prevent if IMMERSIVE_MODE is true
    if (window.IMMERSIVE_MODE !== true) return;

    // Check if key is in scroll keys list
    if (this.scrollKeys.includes(event.code)) {
      event.preventDefault();
    }
  }

  /**
   * Prevent touch scroll (mobile/tablet)
   * @param {TouchEvent} event
   */
  preventTouchScroll(event) {
    if (window.IMMERSIVE_MODE === true) {
      event.preventDefault();
    }
  }

  /**
   * Check if running on iOS
   * @returns {boolean}
   */
  isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  /**
   * Check if scroll was actually prevented (for validation)
   * @returns {number} Current scroll position (should be 0 if prevented)
   */
  checkScrollPosition() {
    return window.scrollY || window.pageYOffset || 0;
  }
}

// Initialize on page load
// Instantiate the scroll prevention handler
window.ScrollPrevention = ScrollPrevention;
window.scrollPreventionHandler = new ScrollPrevention();

// Enable/disable based on IMMERSIVE_MODE flag
if (window.IMMERSIVE_MODE === true) {
  window.scrollPreventionHandler.enable();
} else {
  // On detail pages, ensure scroll prevention is disabled
  window.scrollPreventionHandler.disable();
}

// Listen for mode changes and update scroll prevention
Object.defineProperty(window, 'IMMERSIVE_MODE', {
  configurable: true,
  set: function(value) {
    window._IMMERSIVE_MODE = value;
    if (value === true) {
      window.scrollPreventionHandler.enable();
    } else {
      window.scrollPreventionHandler.disable();
    }
  },
  get: function() {
    return window._IMMERSIVE_MODE !== undefined ? window._IMMERSIVE_MODE : false;
  }
});

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScrollPrevention;
}
