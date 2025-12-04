/**
 * Unified Navigation Component
 * Version: 1.0.0
 *
 * Provides a dual-layer navigation system for the VULCA exhibition platform:
 * - Outer layer: Navigates between different artworks
 * - Inner layer: Navigates between images within a single artwork
 *
 * Part of: unify-navigation-to-image-area OpenSpec change
 * Spec: openspec/changes/unify-navigation-to-image-area/specs/unified-navigation/spec.md
 *
 * @example
 * const nav = new UnifiedNavigation({
 *   container: document.getElementById('artwork-image-container'),
 *   artworkCarousel: window.carousel,
 *   showImageNav: true
 * });
 * nav.render();
 * nav.on('artwork:change', (data) => console.log('Artwork changed:', data));
 */

(function() {
  'use strict';

  /**
   * UnifiedNavigation Class
   *
   * Manages unified navigation UI with two hierarchical layers:
   * - Artwork navigation (outer): Switches between artworks in the exhibition
   * - Image navigation (inner): Switches between images within an artwork
   *
   * @class UnifiedNavigation
   */
  class UnifiedNavigation {
    /**
     * Constructor
     *
     * @param {Object} options - Configuration options
     * @param {HTMLElement} options.container - DOM element to render navigation into
     * @param {ArtworkCarousel} options.artworkCarousel - Artwork carousel controller instance
     * @param {boolean} [options.showImageNav=true] - Whether to show inner image navigation
     * @param {Object} [options.config] - Additional configuration
     * @param {boolean} [options.config.loop=false] - Enable looping at first/last artwork
     * @param {boolean} [options.config.autoHide=false] - Auto-hide navigation on inactivity
     * @param {number} [options.config.transitionDuration=300] - Transition duration in ms
     * @param {string} [options.config.theme='default'] - Visual theme (for future theming)
     *
     * @throws {Error} If container or artworkCarousel is invalid
     *
     * @example
     * const nav = new UnifiedNavigation({
     *   container: document.getElementById('artwork-image-container'),
     *   artworkCarousel: window.carousel,
     *   showImageNav: true,
     *   config: { loop: false, transitionDuration: 300 }
     * });
     */
    constructor(options = {}) {
      // Validation
      if (!options.container || !(options.container instanceof HTMLElement)) {
        throw new Error('[UnifiedNavigation] Container must be a valid DOM element');
      }
      if (!options.artworkCarousel) {
        throw new Error('[UnifiedNavigation] artworkCarousel is required');
      }

      // Core properties
      this.container = options.container;
      this.artworkCarousel = options.artworkCarousel;
      this.showImageNav = options.showImageNav !== false; // Default: true

      // Configuration (with defaults)
      this.config = {
        loop: options.config?.loop || false,
        autoHide: options.config?.autoHide || false,
        transitionDuration: options.config?.transitionDuration || 300,
        theme: options.config?.theme || 'default',
        // Future extensibility: Add more config options here
        enableKeyboardShortcuts: options.config?.enableKeyboardShortcuts !== false,
        enableTouchGestures: options.config?.enableTouchGestures || false, // Phase 2
        showArtworkDots: options.config?.showArtworkDots || false, // Optional feature
        ...options.config
      };

      // State management
      this.state = {
        currentArtworkIndex: this.artworkCarousel.getCurrentIndex(),
        currentImageIndex: 0,
        isTransitioning: false,
        isRendered: false
      };

      // DOM references (populated during render)
      this.elements = {
        wrapper: null,
        outerNav: null,
        prevButton: null,
        nextButton: null,
        indicator: null,
        innerContainer: null,
        imageCarousel: null // Reference to ArtworkImageCarousel instance
      };

      // Event listeners registry (for cleanup)
      this._listeners = {
        click: [],
        keyboard: [],
        custom: []
      };

      // Event emitter registry (custom events)
      this._eventHandlers = {};

      // Bound methods (for proper cleanup)
      this._boundHandlers = {
        prevClick: this._handlePrevClick.bind(this),
        nextClick: this._handleNextClick.bind(this),
        keydown: this._handleKeyDown.bind(this),
        artworkChange: this._handleArtworkChange.bind(this)
      };

      console.log(`[UnifiedNavigation] Initialized for ${this.artworkCarousel.getArtworkCount()} artworks`);

      // Auto-render on initialization
      this.render();
    }

    /**
     * Render the unified navigation component
     *
     * Creates DOM structure, attaches event listeners, and displays navigation.
     * Safe to call multiple times (will re-render).
     *
     * @public
     * @returns {void}
     *
     * @example
     * nav.render();
     */
    render() {
      console.log('[UnifiedNavigation] Rendering component...');

      // Clear container and mark as rendering
      this.container.innerHTML = '';
      this.container.className = 'unified-navigation-wrapper';
      this.state.isRendered = true;

      // Render outer layer (artwork navigation)
      this._renderOuterLayer();

      // Render inner layer (image display + optional carousel)
      this._renderInnerLayer();

      // Attach event listeners
      this._attachEventListeners();

      // Sync state with carousel
      this._syncState();

      // Update button states for initial render
      this._updateButtonStates();

      console.log('[UnifiedNavigation] Render complete');
    }

    /**
     * Destroy the component and clean up resources
     *
     * Removes all event listeners, clears DOM, and resets state.
     * After calling destroy(), the component cannot be used until re-instantiated.
     *
     * @public
     * @returns {void}
     *
     * @example
     * nav.destroy();
     */
    destroy() {
      console.log('[UnifiedNavigation] Destroying component...');

      // Remove event listeners
      this._detachEventListeners();

      // Destroy nested components
      if (this.elements.imageCarousel && typeof this.elements.imageCarousel.destroy === 'function') {
        this.elements.imageCarousel.destroy();
      }

      // Clear DOM
      this.container.innerHTML = '';
      this.container.className = '';

      // Clear references
      this.elements = {};
      this._listeners = { click: [], keyboard: [], custom: [] };
      this._eventHandlers = {};

      // Mark as destroyed
      this.state.isRendered = false;

      console.log('[UnifiedNavigation] Component destroyed');
    }

    /**
     * Update navigation to reflect new artwork
     *
     * Call this method when the artwork changes externally (e.g., via carousel API).
     * Updates button states, indicator, and re-renders inner layer if needed.
     *
     * @public
     * @param {number} artworkIndex - New artwork index (0-based)
     * @returns {void}
     *
     * @example
     * nav.updateArtwork(2); // Jump to artwork-3
     */
    updateArtwork(artworkIndex) {
      console.log(`[UnifiedNavigation] Updating to artwork ${artworkIndex}`);

      const previousIndex = this.state.currentArtworkIndex;
      this.state.currentArtworkIndex = artworkIndex;

      // Update UI
      this._updateIndicator();
      this._updateButtonStates();

      // Re-render inner layer for new artwork
      this._renderInnerLayer();

      // Emit event
      this._emit('artwork:change', {
        previousIndex: previousIndex,
        currentIndex: artworkIndex,
        artwork: this.artworkCarousel.getCurrentArtwork()
      });
    }

    /**
     * Update navigation to reflect new image within current artwork
     *
     * Call this method when the image changes within a multi-image artwork.
     * (Typically handled internally by nested image carousel)
     *
     * @public
     * @param {number} imageIndex - New image index (0-based)
     * @returns {void}
     *
     * @example
     * nav.updateImage(3); // Jump to 4th image
     */
    updateImage(imageIndex) {
      console.log(`[UnifiedNavigation] Updating to image ${imageIndex}`);

      const previousIndex = this.state.currentImageIndex;
      this.state.currentImageIndex = imageIndex;

      // Emit event
      this._emit('image:change', {
        previousIndex: previousIndex,
        currentIndex: imageIndex
      });
    }

    /**
     * Register event listener
     *
     * Supports custom events emitted by the component.
     * Available events: 'artwork:change', 'image:change'
     *
     * @public
     * @param {string} eventName - Event name
     * @param {Function} callback - Event handler function
     * @returns {void}
     *
     * @example
     * nav.on('artwork:change', (data) => {
     *   console.log('Artwork changed to:', data.currentIndex);
     * });
     */
    on(eventName, callback) {
      if (!this._eventHandlers[eventName]) {
        this._eventHandlers[eventName] = [];
      }
      this._eventHandlers[eventName].push(callback);
      console.log(`[UnifiedNavigation] Registered listener for '${eventName}'`);
    }

    /**
     * Unregister event listener
     *
     * @public
     * @param {string} eventName - Event name
     * @param {Function} callback - Event handler function to remove
     * @returns {void}
     *
     * @example
     * nav.off('artwork:change', myHandler);
     */
    off(eventName, callback) {
      if (!this._eventHandlers[eventName]) return;
      this._eventHandlers[eventName] = this._eventHandlers[eventName].filter(cb => cb !== callback);
      console.log(`[UnifiedNavigation] Removed listener for '${eventName}'`);
    }

    // ========================================
    // Private Methods (Internal Implementation)
    // ========================================

    /**
     * Render outer navigation layer (artwork navigation)
     * @private
     */
    _renderOuterLayer() {
      console.log('[UnifiedNavigation] Rendering outer layer (artwork navigation)...');

      // Get current artwork for ARIA labels
      const currentArtwork = this._getCurrentArtwork();
      const artworkCount = this._getArtworkCount();
      const currentIndex = this.state.currentArtworkIndex;

      // Get adjacent artwork titles for ARIA labels
      const prevArtwork = currentIndex > 0
        ? this.artworkCarousel.artworks[currentIndex - 1]
        : null;
      const nextArtwork = currentIndex < artworkCount - 1
        ? this.artworkCarousel.artworks[currentIndex + 1]
        : null;

      // Create navigation container
      const nav = document.createElement('nav');
      nav.className = 'artwork-navigation';
      nav.setAttribute('role', 'navigation');
      nav.setAttribute('aria-label', 'Artwork navigation');

      // Create previous button
      const prevButton = document.createElement('button');
      prevButton.id = 'unified-artwork-prev';
      prevButton.className = 'artwork-nav-button';
      prevButton.type = 'button';
      prevButton.setAttribute('aria-controls', 'artwork-image-container');

      if (prevArtwork) {
        prevButton.setAttribute('aria-label', `Previous artwork: ${prevArtwork.titleZh} ${prevArtwork.titleEn}`);
      } else {
        prevButton.setAttribute('aria-label', 'Previous artwork');
        prevButton.disabled = !this.config.loop;
      }

      // Previous button content: Arrow + Text
      prevButton.innerHTML = `
        <span class="button-icon" aria-hidden="true">◄</span>
        <span class="button-text">Previous Artwork</span>
      `;

      // Create artwork indicator
      const indicator = document.createElement('div');
      indicator.className = 'artwork-indicator';
      indicator.setAttribute('role', 'status');
      indicator.setAttribute('aria-live', 'polite');

      indicator.innerHTML = `
        <span class="current-index" aria-current="page">${currentIndex + 1}</span>
        <span class="separator"> of </span>
        <span class="total-count">${artworkCount}</span>
      `;

      // Create next button
      const nextButton = document.createElement('button');
      nextButton.id = 'unified-artwork-next';
      nextButton.className = 'artwork-nav-button';
      nextButton.type = 'button';

      if (nextArtwork) {
        nextButton.setAttribute('aria-label', `Next artwork: ${nextArtwork.titleZh} ${nextArtwork.titleEn}`);
      } else {
        nextButton.setAttribute('aria-label', 'Next artwork');
        nextButton.disabled = !this.config.loop;
      }

      // Next button content: Text + Arrow
      nextButton.innerHTML = `
        <span class="button-text">Next Artwork</span>
        <span class="button-icon" aria-hidden="true">►</span>
      `;

      // Assemble navigation
      nav.appendChild(prevButton);
      nav.appendChild(indicator);
      nav.appendChild(nextButton);

      // Append to container
      this.container.appendChild(nav);

      // Store DOM references
      this.elements.outerNav = nav;
      this.elements.prevButton = prevButton;
      this.elements.nextButton = nextButton;
      this.elements.indicator = indicator;

      console.log('[UnifiedNavigation] ✓ Outer layer rendered');
    }

    /**
     * Render inner layer (image display container)
     * @private
     */
    _renderInnerLayer() {
      console.log('[UnifiedNavigation] Rendering inner layer (image container)...');

      // Create inner container
      const innerContainer = document.createElement('div');
      innerContainer.className = 'image-display-container';
      innerContainer.id = 'artwork-image-container';

      // Get current artwork
      const currentArtwork = this._getCurrentArtwork();
      if (!currentArtwork) {
        console.error('[UnifiedNavigation] No current artwork found');
        return;
      }

      // Get images for current artwork
      const images = window.ImageCompat
        ? window.ImageCompat.getArtworkImages(currentArtwork)
        : [];

      // Determine if we should show image navigation
      const hasMultipleImages = images.length > 1;
      const shouldShowCarousel = this.showImageNav && hasMultipleImages;

      if (shouldShowCarousel && window.ArtworkImageCarousel) {
        // Multi-image artwork: Use carousel
        console.log(`[UnifiedNavigation] Rendering carousel for ${images.length} images`);

        // Create carousel instance
        const carousel = new window.ArtworkImageCarousel(currentArtwork, innerContainer, {
          loop: true,
          preloadAdjacent: true,
          enableKeyboard: true,
          enableTouch: true,
          showMetadata: true,
          transitionDuration: 300
        });

        // Render carousel
        carousel.render();

        // Store reference
        this.elements.imageCarousel = carousel;

        console.log('[UnifiedNavigation] ✓ Carousel rendered');
      } else {
        // Single image or no carousel: Simple display
        console.log('[UnifiedNavigation] Rendering single image');

        const figure = document.createElement('figure');
        figure.className = 'artwork-image';

        // Get image URL
        const imageUrl = images.length > 0 ? images[0].url : currentArtwork.imageUrl;

        // Create image element
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = `${currentArtwork.titleZh} ${currentArtwork.titleEn}`;
        img.loading = 'eager';

        // Error handler for missing images
        img.onerror = () => {
          console.warn(`[UnifiedNavigation] Image not found: ${imageUrl}`);
          // Note: In production, you might want to show a placeholder here
        };

        figure.appendChild(img);
        innerContainer.appendChild(figure);

        console.log('[UnifiedNavigation] ✓ Single image rendered');
      }

      // Append to container
      this.container.appendChild(innerContainer);

      // Store DOM reference
      this.elements.innerContainer = innerContainer;

      console.log('[UnifiedNavigation] ✓ Inner layer rendered');
    }

    /**
     * Attach all event listeners
     * @private
     */
    _attachEventListeners() {
      console.log('[UnifiedNavigation] Attaching event listeners...');

      // Attach button click handlers
      if (this.elements.prevButton) {
        this.elements.prevButton.addEventListener('click', this._boundHandlers.prevClick);
        this._listeners.click.push({ element: this.elements.prevButton, event: 'click', handler: this._boundHandlers.prevClick });
        console.log('[UnifiedNavigation] ✓ Prev button listener attached');
      }

      if (this.elements.nextButton) {
        this.elements.nextButton.addEventListener('click', this._boundHandlers.nextClick);
        this._listeners.click.push({ element: this.elements.nextButton, event: 'click', handler: this._boundHandlers.nextClick });
        console.log('[UnifiedNavigation] ✓ Next button listener attached');
      }

      // Listen to artwork carousel navigation events
      if (this.artworkCarousel && typeof this.artworkCarousel.on === 'function') {
        this.artworkCarousel.on('navigate', this._boundHandlers.artworkChange);
        this._listeners.custom.push({ source: 'artworkCarousel', event: 'navigate', handler: this._boundHandlers.artworkChange });
        console.log('[UnifiedNavigation] ✓ Carousel navigate listener attached');
      }

      // Attach keyboard shortcuts (if enabled)
      if (this.config.enableKeyboardShortcuts) {
        document.addEventListener('keydown', this._boundHandlers.keydown);
        this._listeners.keyboard.push({ element: document, event: 'keydown', handler: this._boundHandlers.keydown });
        console.log('[UnifiedNavigation] ✓ Keyboard shortcuts enabled (Shift+Arrow)');
      }

      console.log('[UnifiedNavigation] ✓ Event listeners attached');
    }

    /**
     * Detach all event listeners
     * @private
     */
    _detachEventListeners() {
      console.log('[UnifiedNavigation] Detaching event listeners...');

      // Remove click listeners
      this._listeners.click.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
      });
      this._listeners.click = [];

      // Remove keyboard listeners
      this._listeners.keyboard.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
      });
      this._listeners.keyboard = [];

      // Remove custom event listeners (from artwork carousel)
      this._listeners.custom.forEach(({ source, event, handler }) => {
        if (source === 'artworkCarousel' && this.artworkCarousel && typeof this.artworkCarousel.off === 'function') {
          this.artworkCarousel.off(event, handler);
        }
      });
      this._listeners.custom = [];

      console.log('[UnifiedNavigation] ✓ Event listeners detached');
    }

    /**
     * Sync state with artwork carousel
     * @private
     */
    _syncState() {
      this.state.currentArtworkIndex = this.artworkCarousel.getCurrentIndex();
      console.log(`[UnifiedNavigation] State synced: artwork ${this.state.currentArtworkIndex}`);
    }

    /**
     * Update artwork indicator text (X / Total)
     * @private
     */
    _updateIndicator() {
      if (!this.elements.indicator) return;

      const currentIndex = this.state.currentArtworkIndex;
      const artworkCount = this._getArtworkCount();

      // Update indicator content
      this.elements.indicator.innerHTML = `
        <span class="current-index" aria-current="page">${currentIndex + 1}</span>
        <span class="separator"> of </span>
        <span class="total-count">${artworkCount}</span>
      `;

      console.log(`[UnifiedNavigation] Indicator updated: ${currentIndex + 1} of ${artworkCount}`);
    }

    /**
     * Update button states (enabled/disabled)
     * @private
     */
    _updateButtonStates() {
      if (!this.elements.prevButton || !this.elements.nextButton) {
        console.warn('[UnifiedNavigation] Buttons not found, skipping state update');
        return;
      }

      const currentIndex = this.state.currentArtworkIndex;
      const artworkCount = this._getArtworkCount();
      const isFirstArtwork = currentIndex === 0;
      const isLastArtwork = currentIndex === artworkCount - 1;

      // Update Previous button
      if (isFirstArtwork) {
        this.elements.prevButton.disabled = true;
        this.elements.prevButton.setAttribute('aria-label', 'No previous artwork available');
        console.log('[UnifiedNavigation] Prev button disabled (at first artwork)');
      } else {
        this.elements.prevButton.disabled = false;
        const prevArtwork = this.artworkCarousel.artworks[currentIndex - 1];
        const ariaLabel = `Previous artwork: ${prevArtwork.titleZh} ${prevArtwork.titleEn}`;
        this.elements.prevButton.setAttribute('aria-label', ariaLabel);
        console.log('[UnifiedNavigation] Prev button enabled');
      }

      // Update Next button
      if (isLastArtwork) {
        this.elements.nextButton.disabled = true;
        this.elements.nextButton.setAttribute('aria-label', 'No next artwork available');
        console.log('[UnifiedNavigation] Next button disabled (at last artwork)');
      } else {
        this.elements.nextButton.disabled = false;
        const nextArtwork = this.artworkCarousel.artworks[currentIndex + 1];
        const ariaLabel = `Next artwork: ${nextArtwork.titleZh} ${nextArtwork.titleEn}`;
        this.elements.nextButton.setAttribute('aria-label', ariaLabel);
        console.log('[UnifiedNavigation] Next button enabled');
      }

      console.log(`[UnifiedNavigation] Button states updated: artwork ${currentIndex + 1}/${artworkCount}`);
    }

    /**
     * Handle previous button click
     * @private
     */
    _handlePrevClick(event) {
      event.preventDefault();
      console.log('[UnifiedNavigation] Prev button clicked');

      // Prevent action during transition
      if (this.state.isTransitioning) {
        console.log('[UnifiedNavigation] Navigation blocked: transition in progress');
        return;
      }

      // Navigate to previous artwork
      const previousArtwork = this.artworkCarousel.prev();
      if (previousArtwork) {
        console.log(`[UnifiedNavigation] Navigated to previous artwork: ${previousArtwork.id}`);
      }
    }

    /**
     * Handle next button click
     * @private
     */
    _handleNextClick(event) {
      event.preventDefault();
      console.log('[UnifiedNavigation] Next button clicked');

      // Prevent action during transition
      if (this.state.isTransitioning) {
        console.log('[UnifiedNavigation] Navigation blocked: transition in progress');
        return;
      }

      // Navigate to next artwork
      const nextArtwork = this.artworkCarousel.next();
      if (nextArtwork) {
        console.log(`[UnifiedNavigation] Navigated to next artwork: ${nextArtwork.id}`);
      }
    }

    /**
     * Handle keyboard shortcuts
     * @private
     * @param {KeyboardEvent} event - Keyboard event
     */
    _handleKeyDown(event) {
      // Only handle if keyboard shortcuts are enabled
      if (!this.config.enableKeyboardShortcuts) {
        return;
      }

      // Only handle Shift + Arrow keys
      if (!event.shiftKey) {
        return;
      }

      // Check if focus is in an input/textarea (don't interfere with text editing)
      const activeElement = document.activeElement;
      if (activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.isContentEditable
      )) {
        return;
      }

      // Handle Shift + ArrowLeft (previous artwork)
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        console.log('[UnifiedNavigation] Keyboard: Shift+ArrowLeft (prev artwork)');

        if (!this.elements.prevButton || this.elements.prevButton.disabled) {
          console.log('[UnifiedNavigation] Prev navigation blocked (at first artwork)');
          return;
        }

        this.artworkCarousel.prev();
      }
      // Handle Shift + ArrowRight (next artwork)
      else if (event.key === 'ArrowRight') {
        event.preventDefault();
        console.log('[UnifiedNavigation] Keyboard: Shift+ArrowRight (next artwork)');

        if (!this.elements.nextButton || this.elements.nextButton.disabled) {
          console.log('[UnifiedNavigation] Next navigation blocked (at last artwork)');
          return;
        }

        this.artworkCarousel.next();
      }
    }

    /**
     * Handle artwork change from carousel
     * @private
     * @param {Object} data - Event data from carousel { artwork, index, critics }
     */
    _handleArtworkChange(data) {
      console.log(`[UnifiedNavigation] Artwork changed to index ${data.index}`);

      const previousIndex = this.state.currentArtworkIndex;
      const newIndex = data.index;

      // Update state
      this.state.currentArtworkIndex = newIndex;
      this.state.isTransitioning = true;

      // Update UI
      this._updateIndicator();
      this._updateButtonStates();

      // Re-render inner layer for new artwork (with transition)
      // Add transition class
      this.container.classList.add('transitioning');

      // Wait for fade-out animation
      setTimeout(() => {
        // Re-render inner layer
        if (this.elements.innerContainer) {
          this.elements.innerContainer.remove();
        }
        this._renderInnerLayer();

        // Remove transition class to trigger fade-in
        this.container.classList.remove('transitioning');
        this.state.isTransitioning = false;

        console.log(`[UnifiedNavigation] Transition complete: ${previousIndex} → ${newIndex}`);
      }, this.config.transitionDuration || 150);

      // Emit custom event
      this._emit('artwork:change', {
        previousIndex: previousIndex,
        currentIndex: newIndex,
        artwork: data.artwork
      });

      console.log(`[UnifiedNavigation] ✓ Artwork change handled: ${data.artwork?.id || 'unknown'}`);

      // Preload adjacent artworks' images for smoother navigation
      this._preloadAdjacentArtworks(newIndex);
    }

    /**
     * Preload images for adjacent artworks
     * @private
     * @param {number} currentIndex - Current artwork index
     */
    _preloadAdjacentArtworks(currentIndex) {
      const artworks = this.artworkCarousel?.artworks;
      if (!artworks || !artworks.length) return;

      const indicesToPreload = [currentIndex - 1, currentIndex + 1];

      indicesToPreload.forEach(index => {
        if (index >= 0 && index < artworks.length) {
          const artwork = artworks[index];
          const imageUrl = artwork.imageUrl ||
            (artwork.images && artwork.images[0] && artwork.images[0].url);

          if (imageUrl) {
            // Use VULCALazyLoader if available, otherwise basic preload
            if (window.VULCALazyLoader && window.VULCALazyLoader.preload) {
              window.VULCALazyLoader.preload(imageUrl);
            } else {
              const img = new Image();
              img.src = imageUrl;
            }
            console.log(`[UnifiedNavigation] Preloading: ${artwork.id}`);
          }
        }
      });
    }

    /**
     * Emit custom event to registered listeners
     * @private
     * @param {string} eventName - Event name
     * @param {Object} data - Event data
     */
    _emit(eventName, data) {
      if (!this._eventHandlers[eventName]) return;
      this._eventHandlers[eventName].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`[UnifiedNavigation] Error in '${eventName}' handler:`, error);
        }
      });
    }

    /**
     * Get current artwork count (for extensibility)
     * @private
     * @returns {number} Total number of artworks
     */
    _getArtworkCount() {
      return this.artworkCarousel.getArtworkCount();
    }

    /**
     * Get current artwork object
     * @private
     * @returns {Object} Current artwork data
     */
    _getCurrentArtwork() {
      return this.artworkCarousel.getCurrentArtwork();
    }
  }

  // Export to global scope
  window.UnifiedNavigation = UnifiedNavigation;

  console.log('✓ UnifiedNavigation component loaded');

})();
