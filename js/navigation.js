/**
 * Navigation Handler
 *
 * Manages menu navigation across all pages including:
 * - Menu toggle (open/close)
 * - Page highlighting in menu
 * - Navigation to different pages
 *
 * @version 1.0.0
 */

(function() {
  'use strict';

  class NavigationHandler {
    constructor() {
      this.menuToggle = document.getElementById('menu-toggle');
      this.menuDrawer = document.getElementById('floating-menu');
      this.menuOverlay = document.getElementById('menu-overlay');
      this.menuItems = document.querySelectorAll('.menu-item');
    }

    init() {
      if (!this.menuToggle || !this.menuDrawer || !this.menuOverlay) {
        console.warn('[Navigation] Menu elements not found');
        return;
      }

      // Menu toggle button
      this.menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMenu();
      });

      // Menu items
      this.menuItems.forEach(item => {
        item.addEventListener('click', () => {
          // Close menu after navigation (mobile)
          if (window.innerWidth < 768) {
            this.closeMenu();
          }
        });
      });

      // Close menu when clicking overlay
      this.menuOverlay.addEventListener('click', () => {
        this.closeMenu();
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (this.menuDrawer.hasAttribute('hidden')) return;
        if (!this.menuDrawer.contains(e.target) && !this.menuToggle.contains(e.target)) {
          this.closeMenu();
        }
      });

      // Close menu on Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeMenu();
        }
      });

      // Highlight current page
      this.highlightCurrentPage();

      console.log('[Navigation] Handler initialized');
    }

    toggleMenu() {
      if (this.menuDrawer.hasAttribute('hidden')) {
        this.openMenu();
      } else {
        this.closeMenu();
      }
    }

    openMenu() {
      this.menuDrawer.removeAttribute('hidden');
      this.menuOverlay.classList.add('active');
      this.menuToggle.setAttribute('aria-expanded', 'true');
    }

    closeMenu() {
      this.menuDrawer.setAttribute('hidden', '');
      this.menuOverlay.classList.remove('active');
      this.menuToggle.setAttribute('aria-expanded', 'false');
    }

    highlightCurrentPage() {
      const currentPath = window.location.pathname;

      this.menuItems.forEach(item => {
        // Skip non-link items
        if (item.tagName !== 'A') return;

        const itemPath = item.getAttribute('href');
        if (!itemPath) return;

        // Remove active class
        item.classList.remove('active');

        // Add active class if this is the current page
        if (this.isCurrentPage(currentPath, itemPath)) {
          item.classList.add('active');
        }
      });
    }

    isCurrentPage(currentPath, itemPath) {
      // Handle root path
      if (itemPath === '/' || itemPath === '/index.html') {
        return currentPath === '/' || currentPath === '/index.html' || currentPath === '';
      }

      // Handle nested paths
      return currentPath.includes(itemPath);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const nav = new NavigationHandler();
      nav.init();
    });
  } else {
    const nav = new NavigationHandler();
    nav.init();
  }

  // Expose for testing
  window.NavigationHandler = NavigationHandler;

})();
