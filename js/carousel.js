/**
 * VULCA Artwork Carousel Controller
 * js/carousel.js - v1.0.0
 *
 * Manages artwork navigation state and provides navigation methods
 * Does NOT mutate DOM - that's handled by gallery-hero.js
 */

window.ArtworkCarousel = (function() {
  'use strict';

  // Data will be accessed at init time, not load time

  class Carousel {
    constructor(artworks, critiques, personas) {
      this.artworks = artworks || [];
      this.critiques = critiques || [];
      this.personas = personas || [];
      this.currentIndex = 0;
      this.listeners = {};

      console.log(`✓ Carousel initialized with ${this.artworks.length} artworks`);
    }

    /**
     * Navigate to next artwork (with looping)
     */
    next() {
      this.currentIndex = (this.currentIndex + 1) % this.artworks.length;
      this._notifyListeners('navigate');
      return this.getCurrentArtwork();
    }

    /**
     * Navigate to previous artwork (with looping)
     */
    prev() {
      this.currentIndex = (this.currentIndex - 1 + this.artworks.length) % this.artworks.length;
      this._notifyListeners('navigate');
      return this.getCurrentArtwork();
    }

    /**
     * Jump to specific artwork by index
     * @param {number} index - Artwork index (0-3)
     */
    goTo(index) {
      if (index < 0 || index >= this.artworks.length) {
        console.warn(`⚠ Invalid artwork index: ${index}`);
        return null;
      }
      this.currentIndex = index;
      this._notifyListeners('navigate');
      return this.getCurrentArtwork();
    }

    /**
     * Get current artwork object
     */
    getCurrentArtwork() {
      return this.artworks[this.currentIndex] || null;
    }

    /**
     * Get current artwork index (0-3)
     */
    getCurrentIndex() {
      return this.currentIndex;
    }

    /**
     * Get artwork count
     */
    getArtworkCount() {
      return this.artworks.length;
    }

    /**
     * Get all critiques for current artwork
     */
    getArtworkCritiques() {
      const currentArtwork = this.getCurrentArtwork();
      if (!currentArtwork) return [];

      return this.critiques.filter(c => c.artworkId === currentArtwork.id) || [];
    }

    /**
     * Get specific critique by artwork and critic index
     */
    getCritiqueForArtwork(artworkIndex, criticIndex) {
      const artwork = this.artworks[artworkIndex];
      if (!artwork) return null;

      const artworkCritiques = this.critiques.filter(c => c.artworkId === artwork.id);
      return artworkCritiques[criticIndex] || null;
    }

    /**
     * Subscribe to navigation events
     */
    on(eventName, callback) {
      if (!this.listeners[eventName]) {
        this.listeners[eventName] = [];
      }
      this.listeners[eventName].push(callback);
    }

    /**
     * Unsubscribe from events
     */
    off(eventName, callback) {
      if (!this.listeners[eventName]) return;
      this.listeners[eventName] = this.listeners[eventName].filter(cb => cb !== callback);
    }

    /**
     * Internal: Notify all listeners of event
     */
    _notifyListeners(eventName) {
      if (!this.listeners[eventName]) return;

      const currentArtwork = this.getCurrentArtwork();
      const critics = this.getArtworkCritiques();

      this.listeners[eventName].forEach(callback => {
        callback({
          artwork: currentArtwork,
          index: this.currentIndex,
          critics: critics
        });
      });

      // Emit custom event for visualizations to consume
      if (eventName === 'navigate' && currentArtwork) {
        window.dispatchEvent(new CustomEvent('visualization:update', {
          detail: {
            artworkId: currentArtwork.id,
            artworkIndex: this.currentIndex,
            artwork: currentArtwork
          }
        }));
      }
    }
  }

  // Create and initialize carousel instance
  function init() {
    const data = window.VULCA_DATA;

    if (!data || !data.artworks || !data.critiques || !data.personas) {
      console.error('❌ VULCA_DATA not found or incomplete');
      return null;
    }

    const carousel = new Carousel(data.artworks, data.critiques, data.personas);
    window.carousel = carousel; // Make globally accessible

    console.log(`✓ Carousel initialized with ${data.artworks.length} artworks`);
    return carousel;
  }

  // Initialize on load (wait for VULCA_DATA if needed)
  function attemptInit() {
    if (window.VULCA_DATA_READY) {
      // Data is ready, initialize now
      init();
    } else {
      // Data not ready yet, wait for event
      document.addEventListener('vulca-data-ready', init, { once: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attemptInit);
  } else {
    attemptInit();
  }

  return Carousel;
})();

console.log('✓ Carousel module loaded');
