/**
 * VULCA Navigation Auto-Hide Module
 * js/navigation-autohide.js - v1.0.0
 *
 * Implements auto-hide behavior for gallery navigation bar:
 * - Desktop: Hidden by default, shows on mouse hover near bottom edge
 * - Mobile: Always visible (no auto-hide)
 * - Keyboard: Focus reveals navigation
 */

(function() {
  'use strict';

  // State management
  let navVisible = false;
  let hideTimeout = null;
  const nav = document.querySelector('.gallery-nav');
  const hint = document.querySelector('.nav-hint');

  // Configuration
  const ACTIVATION_DISTANCE = 100; // pixels from bottom edge
  const HIDE_DELAY = 500; // milliseconds before hiding
  const THROTTLE_DELAY = 100; // milliseconds between mousemove checks
  const MOBILE_BREAKPOINT = 600; // pixels

  /**
   * Throttle function to limit execution frequency
   * @param {Function} func - Function to throttle
   * @param {number} delay - Delay in milliseconds
   * @returns {Function} Throttled function
   */
  function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func(...args);
      }
    };
  }

  /**
   * Show navigation bar
   */
  function showNavigation() {
    if (!navVisible && nav) {
      nav.classList.add('show');
      navVisible = true;
      clearTimeout(hideTimeout);
      console.log('[Nav Auto-Hide] Navigation revealed');
    }
  }

  /**
   * Hide navigation bar after delay
   */
  function hideNavigation() {
    if (navVisible && nav) {
      hideTimeout = setTimeout(() => {
        nav.classList.remove('show');
        navVisible = false;
        console.log('[Nav Auto-Hide] Navigation hidden');
      }, HIDE_DELAY);
    }
  }

  /**
   * Handle mouse movement to show/hide navigation
   * @param {MouseEvent} e - Mouse event
   */
  const handleMouseMove = throttle((e) => {
    // Skip on mobile
    if (window.innerWidth < MOBILE_BREAKPOINT) {
      return;
    }

    const distanceFromBottom = window.innerHeight - e.clientY;

    if (distanceFromBottom < ACTIVATION_DISTANCE && !navVisible) {
      // Mouse near bottom edge - show navigation
      showNavigation();
    } else if (distanceFromBottom >= ACTIVATION_DISTANCE && navVisible) {
      // Mouse moved away - hide after delay
      hideNavigation();
    }
  }, THROTTLE_DELAY);

  /**
   * Handle window resize events
   */
  const handleResize = throttle(() => {
    if (window.innerWidth < MOBILE_BREAKPOINT) {
      // Switched to mobile - remove show class
      if (nav) {
        nav.classList.remove('show');
        navVisible = false;
      }
    }
  }, 250);

  /**
   * Initialize keyboard focus detection
   */
  function initKeyboardHandlers() {
    if (!nav) return;

    const focusableElements = nav.querySelectorAll('button, .dot, a');

    focusableElements.forEach(element => {
      // Show navigation when element receives focus
      element.addEventListener('focus', () => {
        if (window.innerWidth >= MOBILE_BREAKPOINT) {
          showNavigation();
        }
      });

      // Hide navigation when focus leaves nav container
      element.addEventListener('blur', (e) => {
        if (window.innerWidth >= MOBILE_BREAKPOINT) {
          // Check if focus moved outside navigation
          if (!nav.contains(e.relatedTarget)) {
            hideNavigation();
          }
        }
      });
    });

    console.log('[Nav Auto-Hide] Keyboard handlers initialized for', focusableElements.length, 'elements');
  }

  /**
   * Initialize the navigation auto-hide module
   */
  function init() {
    // Validate required elements
    if (!nav) {
      console.error('[Nav Auto-Hide] ❌ Navigation bar not found');
      return;
    }

    // Set up event listeners
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);
    initKeyboardHandlers();

    console.log('[Nav Auto-Hide] ✓ Module initialized');
    console.log('[Nav Auto-Hide]   - Activation distance:', ACTIVATION_DISTANCE + 'px');
    console.log('[Nav Auto-Hide]   - Hide delay:', HIDE_DELAY + 'ms');
    console.log('[Nav Auto-Hide]   - Mobile breakpoint:', MOBILE_BREAKPOINT + 'px');
    console.log('[Nav Auto-Hide]   - Current viewport:', window.innerWidth + 'px');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

console.log('✓ Navigation auto-hide module loaded');
