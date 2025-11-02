/**
 * Scroll Reveal Module
 *
 * Uses Intersection Observer API to detect when elements enter the viewport
 * and trigger fade-in animations. Optimized for performance with GPU-accelerated
 * CSS transitions.
 *
 * Usage:
 * - Add `data-reveal` attribute to any element you want to animate
 * - Elements will automatically fade in when scrolling into view
 * - Respects prefers-reduced-motion for accessibility
 */

class ScrollReveal {
  constructor(options = {}) {
    // Threshold: trigger when 10% of element is visible
    this.threshold = options.threshold || 0.1;

    // Root margin: offset from bottom to trigger slightly before fully visible
    this.rootMargin = options.rootMargin || '0px 0px -10% 0px';

    this.observer = null;
    this.elements = [];
  }

  /**
   * Initialize the Intersection Observer and start observing elements
   */
  init() {
    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
      console.warn('[Scroll Reveal] Intersection Observer not supported, skipping animations');
      return;
    }

    // Find all elements with data-reveal attribute
    this.elements = Array.from(document.querySelectorAll('[data-reveal]'));

    if (this.elements.length === 0) {
      console.log('[Scroll Reveal] No elements with data-reveal attribute found');
      return;
    }

    // Add reveal-pending class to all elements
    this.elements.forEach(element => {
      element.classList.add('reveal-pending');
    });

    // Create Intersection Observer
    this.observer = new IntersectionObserver(
      (entries) => this.onIntersect(entries),
      {
        threshold: this.threshold,
        rootMargin: this.rootMargin
      }
    );

    // Start observing all elements
    this.elements.forEach(element => {
      this.observer.observe(element);
    });

    console.log(`[Scroll Reveal] Initialized with ${this.elements.length} elements`);
  }

  /**
   * Handle intersection events
   * @param {IntersectionObserverEntry[]} entries
   */
  onIntersect(entries) {
    entries.forEach(entry => {
      // Element has entered the viewport
      if (entry.isIntersecting) {
        const element = entry.target;

        // Remove pending state and add revealed class
        element.classList.remove('reveal-pending');
        element.classList.add('revealed');

        // Unobserve element after reveal (performance optimization)
        this.observer.unobserve(element);

        console.log('[Scroll Reveal] Element revealed:', element);
      }
    });
  }

  /**
   * Manually observe a new element (useful for dynamically added content)
   * @param {HTMLElement} element
   */
  observe(element) {
    if (!this.observer) {
      console.warn('[Scroll Reveal] Observer not initialized');
      return;
    }

    element.classList.add('reveal-pending');
    this.observer.observe(element);
  }

  /**
   * Manually unobserve an element
   * @param {HTMLElement} element
   */
  unobserve(element) {
    if (!this.observer) return;
    this.observer.unobserve(element);
  }

  /**
   * Destroy the observer and clean up
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.elements = [];
    console.log('[Scroll Reveal] Destroyed');
  }
}

// Initialize scroll reveal when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.scrollReveal = new ScrollReveal();
    window.scrollReveal.init();
  });
} else {
  // DOM already loaded
  window.scrollReveal = new ScrollReveal();
  window.scrollReveal.init();
}
