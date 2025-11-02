/**
 * Artwork Image Carousel Component
 * Version: 1.0.0
 *
 * Interactive carousel for displaying multi-image artwork series with
 * smooth navigation, keyboard shortcuts, and touch gestures.
 *
 * Part of: implement-multi-image-artwork-series OpenSpec change
 * Spec: openspec/changes/implement-multi-image-artwork-series/specs/image-carousel-component/spec.md
 */

(function() {
  'use strict';

  /**
   * ArtworkImageCarousel Class
   *
   * Manages display and navigation of artwork image series.
   *
   * @example
   * const carousel = new ArtworkImageCarousel(artwork, containerElement);
   * carousel.render();
   * carousel.next(); // Navigate to next image
   * carousel.prev(); // Navigate to previous image
   * carousel.goTo(2); // Jump to image at index 2
   */
  class ArtworkImageCarousel {
    /**
     * Constructor
     *
     * @param {Object} artwork - Artwork object from VULCA_DATA.artworks
     * @param {HTMLElement} container - DOM element to render carousel into
     * @param {Object} options - Configuration options
     */
    constructor(artwork, container, options = {}) {
      // Validation
      if (!artwork) {
        throw new Error('[Carousel] Artwork object is required');
      }
      if (!container || !(container instanceof HTMLElement)) {
        throw new Error('[Carousel] Container must be a valid DOM element');
      }

      // Core properties
      this.artwork = artwork;
      this.container = container;

      // Get images using compatibility helper
      if (!window.ImageCompat) {
        throw new Error('[Carousel] ImageCompat utility not loaded. Include js/utils/image-compat.js before carousel.');
      }
      this.images = window.ImageCompat.getArtworkImages(artwork);

      if (this.images.length === 0) {
        console.warn(`[Carousel] No images found for artwork ${artwork.id}`);
      }

      // State
      this.currentIndex = 0;
      this.loadedImages = new Set(); // Track which images are loaded
      this.highlightedImages = new Set(); // Images referenced in critiques

      // Options
      this.options = {
        autoplay: options.autoplay || false,
        autoplayInterval: options.autoplayInterval || 5000,
        loop: options.loop !== false, // Default: true
        preloadAdjacent: options.preloadAdjacent !== false, // Default: true
        showMetadata: options.showMetadata !== false, // Default: true
        showIndicators: options.showIndicators !== false, // Default: true
        enableKeyboard: options.enableKeyboard !== false, // Default: true
        enableTouch: options.enableTouch !== false, // Default: true
        transition: options.transition || 'fade', // 'fade' or 'slide'
        transitionDuration: options.transitionDuration || 300, // ms
        ...options
      };

      // DOM references (populated during render)
      this.elements = {
        carousel: null,
        viewport: null,
        imageContainer: null,
        prevButton: null,
        nextButton: null,
        indicators: null,
        metadata: null
      };

      // Event handlers (bound to this instance)
      this._boundKeyHandler = this._handleKeyDown.bind(this);
      this._boundTouchStart = this._handleTouchStart.bind(this);
      this._boundTouchMove = this._handleTouchMove.bind(this);
      this._boundTouchEnd = this._handleTouchEnd.bind(this);

      // Touch state
      this._touchStartX = 0;
      this._touchStartY = 0;
      this._touchCurrentX = 0;
      this._touchCurrentY = 0;
      this._isSwiping = false;

      console.log(`[Carousel] Initialized for ${artwork.id} with ${this.images.length} images`);
    }

    /**
     * Render carousel HTML structure
     *
     * Creates DOM elements and attaches event listeners.
     * Safe to call multiple times (will clear and re-render).
     */
    render() {
      console.log(`[Carousel] Rendering carousel for ${this.artwork.id}`);

      // Clear container
      this.container.innerHTML = '';
      this.container.className = 'artwork-carousel';

      // Create main carousel structure
      const carouselHTML = `
        <div class="carousel-wrapper">
          <!-- Main viewport -->
          <div class="carousel-viewport" role="region" aria-label="Artwork image carousel">
            <div class="carousel-image-container"></div>
          </div>

          <!-- Navigation controls (will be populated by _renderControls) -->
          <div class="carousel-controls">
            <button class="carousel-btn carousel-btn-prev" aria-label="Previous image">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button class="carousel-btn carousel-btn-next" aria-label="Next image">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>

          <!-- Indicators (dots) -->
          <div class="carousel-indicators" role="tablist" aria-label="Image selection"></div>

          <!-- Image metadata -->
          <div class="carousel-metadata"></div>
        </div>
      `;

      this.container.innerHTML = carouselHTML;

      // Store DOM references
      this.elements.carousel = this.container.querySelector('.carousel-wrapper');
      this.elements.viewport = this.container.querySelector('.carousel-viewport');
      this.elements.imageContainer = this.container.querySelector('.carousel-image-container');
      this.elements.prevButton = this.container.querySelector('.carousel-btn-prev');
      this.elements.nextButton = this.container.querySelector('.carousel-btn-next');
      this.elements.indicators = this.container.querySelector('.carousel-indicators');
      this.elements.metadata = this.container.querySelector('.carousel-metadata');

      // Render sub-components
      this._renderIndicators();
      this._renderCurrentImage();
      this._renderMetadata();
      this._updateNavigationState();

      // Attach event listeners
      this._attachEventListeners();

      console.log(`[Carousel] Render complete, displaying image ${this.currentIndex + 1} of ${this.images.length}`);
    }

    /**
     * Navigate to next image
     *
     * @returns {boolean} True if navigation occurred, false if at end (and loop disabled)
     */
    next() {
      if (this.currentIndex < this.images.length - 1) {
        return this.goTo(this.currentIndex + 1);
      } else if (this.options.loop) {
        return this.goTo(0);
      }
      console.log('[Carousel] At last image, loop disabled');
      return false;
    }

    /**
     * Navigate to previous image
     *
     * @returns {boolean} True if navigation occurred, false if at start (and loop disabled)
     */
    prev() {
      if (this.currentIndex > 0) {
        return this.goTo(this.currentIndex - 1);
      } else if (this.options.loop) {
        return this.goTo(this.images.length - 1);
      }
      console.log('[Carousel] At first image, loop disabled');
      return false;
    }

    /**
     * Jump to specific image by index
     *
     * @param {number} index - Target image index (0-based)
     * @returns {boolean} True if navigation occurred
     */
    goTo(index) {
      // Validate index
      if (index < 0 || index >= this.images.length) {
        console.warn(`[Carousel] Invalid index ${index}, must be 0-${this.images.length - 1}`);
        return false;
      }

      if (index === this.currentIndex) {
        console.log(`[Carousel] Already at index ${index}`);
        return false;
      }

      console.log(`[Carousel] Navigating from ${this.currentIndex} to ${index}`);

      // Update state
      const previousIndex = this.currentIndex;
      this.currentIndex = index;

      // Update UI
      this._renderCurrentImage();
      this._renderMetadata();
      this._updateIndicators();
      this._updateNavigationState();

      // Preload adjacent images if enabled
      if (this.options.preloadAdjacent) {
        this._preloadAdjacentImages();
      }

      // Emit custom event
      this._emitEvent('carousel:change', {
        previousIndex,
        currentIndex: this.currentIndex,
        image: this.images[this.currentIndex]
      });

      return true;
    }

    /**
     * Highlight specific images (used by critique system)
     *
     * @param {Array<string>} imageIds - Array of image IDs to highlight
     */
    highlightImages(imageIds) {
      this.highlightedImages = new Set(imageIds);
      this._updateIndicators();
      console.log(`[Carousel] Highlighting ${imageIds.length} images:`, imageIds);
    }

    /**
     * Clear all highlights
     */
    clearHighlights() {
      this.highlightedImages.clear();
      this._updateIndicators();
      console.log('[Carousel] Cleared all highlights');
    }

    /**
     * Destroy carousel and clean up
     *
     * Removes event listeners and clears DOM.
     */
    destroy() {
      console.log(`[Carousel] Destroying carousel for ${this.artwork.id}`);

      // Remove event listeners
      this._detachEventListeners();

      // Clear DOM
      this.container.innerHTML = '';
      this.container.className = '';

      // Clear references
      this.elements = {};
      this.images = [];
      this.loadedImages.clear();
      this.highlightedImages.clear();
    }

    // ========================================
    // Private Methods
    // ========================================

    /**
     * Render current image
     * @private
     */
    _renderCurrentImage() {
      if (this.images.length === 0) {
        this.elements.imageContainer.innerHTML = '<div class="carousel-empty">No images available</div>';
        return;
      }

      const image = this.images[this.currentIndex];

      // Create image element with loading state
      const imgHTML = `
        <div class="carousel-slide ${this.options.transition === 'slide' ? 'slide' : 'fade'}">
          <img
            src="${image.url}"
            alt="${image.titleEn}"
            class="carousel-image"
            data-image-id="${image.id}"
            loading="eager"
          />
          <div class="carousel-loading">
            <div class="spinner"></div>
            <p>Loading image...</p>
          </div>
        </div>
      `;

      this.elements.imageContainer.innerHTML = imgHTML;

      // Handle image load/error
      const imgElement = this.elements.imageContainer.querySelector('img');
      const loadingElement = this.elements.imageContainer.querySelector('.carousel-loading');

      imgElement.addEventListener('load', () => {
        loadingElement.style.display = 'none';
        imgElement.classList.add('loaded');
        this.loadedImages.add(image.id);
        console.log(`[Carousel] Image loaded: ${image.id}`);
      });

      imgElement.addEventListener('error', () => {
        loadingElement.innerHTML = `
          <div class="carousel-error">
            <p>⚠️ Failed to load image</p>
            <p class="error-detail">${image.titleZh}</p>
          </div>
        `;
        console.error(`[Carousel] Failed to load image: ${image.url}`);
      });
    }

    /**
     * Render metadata overlay
     * @private
     */
    _renderMetadata() {
      if (!this.options.showMetadata || this.images.length === 0) {
        this.elements.metadata.innerHTML = '';
        return;
      }

      const image = this.images[this.currentIndex];
      const categoryLabel = this._getCategoryLabel(image.category);

      const metadataHTML = `
        <div class="carousel-metadata-content">
          <!-- Category badge -->
          <span class="category-badge category-${image.category}">${categoryLabel}</span>

          <!-- Image count indicator -->
          <span class="image-counter" aria-label="Image ${this.currentIndex + 1} of ${this.images.length}">
            ${this.currentIndex + 1} / ${this.images.length}
          </span>

          <!-- Titles -->
          <h3 class="image-title" lang="zh">${image.titleZh}</h3>
          <p class="image-title-en" lang="en">${image.titleEn}</p>

          <!-- Caption (if exists) -->
          ${image.caption ? `<p class="image-caption">${image.caption}</p>` : ''}
        </div>
      `;

      this.elements.metadata.innerHTML = metadataHTML;
    }

    /**
     * Render indicator dots
     * @private
     */
    _renderIndicators() {
      if (!this.options.showIndicators || this.images.length <= 1) {
        this.elements.indicators.innerHTML = '';
        return;
      }

      const indicatorsHTML = this.images.map((image, index) => `
        <button
          class="carousel-indicator ${index === this.currentIndex ? 'active' : ''} ${this.highlightedImages.has(image.id) ? 'highlighted' : ''}"
          role="tab"
          aria-label="Go to image ${index + 1}: ${image.titleEn}"
          aria-selected="${index === this.currentIndex}"
          data-index="${index}"
          data-image-id="${image.id}"
        ></button>
      `).join('');

      this.elements.indicators.innerHTML = indicatorsHTML;

      // Attach click handlers to indicators
      this.elements.indicators.querySelectorAll('.carousel-indicator').forEach((indicator, index) => {
        indicator.addEventListener('click', () => this.goTo(index));
      });
    }

    /**
     * Update indicator states
     * @private
     */
    _updateIndicators() {
      if (!this.options.showIndicators) return;

      this.elements.indicators.querySelectorAll('.carousel-indicator').forEach((indicator, index) => {
        const imageId = indicator.dataset.imageId;

        indicator.classList.toggle('active', index === this.currentIndex);
        indicator.classList.toggle('highlighted', this.highlightedImages.has(imageId));
        indicator.setAttribute('aria-selected', index === this.currentIndex);
      });
    }

    /**
     * Update navigation button states (disabled at edges if loop disabled)
     * @private
     */
    _updateNavigationState() {
      if (!this.options.loop) {
        this.elements.prevButton.disabled = this.currentIndex === 0;
        this.elements.nextButton.disabled = this.currentIndex === this.images.length - 1;
      } else {
        this.elements.prevButton.disabled = false;
        this.elements.nextButton.disabled = false;
      }
    }

    /**
     * Preload adjacent images for smoother navigation
     * @private
     */
    _preloadAdjacentImages() {
      const toPreload = [];

      // Previous image
      if (this.currentIndex > 0) {
        toPreload.push(this.currentIndex - 1);
      } else if (this.options.loop) {
        toPreload.push(this.images.length - 1);
      }

      // Next image
      if (this.currentIndex < this.images.length - 1) {
        toPreload.push(this.currentIndex + 1);
      } else if (this.options.loop) {
        toPreload.push(0);
      }

      toPreload.forEach(index => {
        const image = this.images[index];
        if (!this.loadedImages.has(image.id)) {
          const img = new Image();
          img.src = image.url;
          img.onload = () => {
            this.loadedImages.add(image.id);
            console.log(`[Carousel] Preloaded: ${image.id}`);
          };
        }
      });
    }

    /**
     * Attach all event listeners
     * @private
     */
    _attachEventListeners() {
      // Navigation buttons
      this.elements.prevButton.addEventListener('click', () => this.prev());
      this.elements.nextButton.addEventListener('click', () => this.next());

      // Keyboard navigation
      if (this.options.enableKeyboard) {
        document.addEventListener('keydown', this._boundKeyHandler);
      }

      // Touch gestures
      if (this.options.enableTouch) {
        this.elements.viewport.addEventListener('touchstart', this._boundTouchStart, { passive: true });
        this.elements.viewport.addEventListener('touchmove', this._boundTouchMove, { passive: false });
        this.elements.viewport.addEventListener('touchend', this._boundTouchEnd, { passive: true });
      }
    }

    /**
     * Detach all event listeners
     * @private
     */
    _detachEventListeners() {
      document.removeEventListener('keydown', this._boundKeyHandler);

      if (this.elements.viewport) {
        this.elements.viewport.removeEventListener('touchstart', this._boundTouchStart);
        this.elements.viewport.removeEventListener('touchmove', this._boundTouchMove);
        this.elements.viewport.removeEventListener('touchend', this._boundTouchEnd);
      }
    }

    /**
     * Handle keyboard navigation
     * @private
     */
    _handleKeyDown(event) {
      // Only handle if carousel is visible and focused
      if (!this.container.offsetParent) return;

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          this.next();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          this.prev();
          break;
        case 'Home':
          event.preventDefault();
          this.goTo(0);
          break;
        case 'End':
          event.preventDefault();
          this.goTo(this.images.length - 1);
          break;
      }
    }

    /**
     * Handle touch start
     * @private
     */
    _handleTouchStart(event) {
      this._touchStartX = event.touches[0].clientX;
      this._touchStartY = event.touches[0].clientY;
      this._isSwiping = false;
    }

    /**
     * Handle touch move
     * @private
     */
    _handleTouchMove(event) {
      if (!this._touchStartX) return;

      this._touchCurrentX = event.touches[0].clientX;
      this._touchCurrentY = event.touches[0].clientY;

      const deltaX = this._touchCurrentX - this._touchStartX;
      const deltaY = this._touchCurrentY - this._touchStartY;

      // Detect horizontal swipe (not vertical scroll)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        this._isSwiping = true;
        event.preventDefault(); // Prevent scroll
      }
    }

    /**
     * Handle touch end
     * @private
     */
    _handleTouchEnd(event) {
      if (!this._isSwiping) return;

      const deltaX = this._touchCurrentX - this._touchStartX;
      const threshold = 50; // Minimum swipe distance in pixels

      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          // Swipe right -> previous
          this.prev();
        } else {
          // Swipe left -> next
          this.next();
        }
      }

      // Reset
      this._touchStartX = 0;
      this._touchStartY = 0;
      this._touchCurrentX = 0;
      this._touchCurrentY = 0;
      this._isSwiping = false;
    }

    /**
     * Get localized category label
     * @private
     */
    _getCategoryLabel(category) {
      const labels = {
        sketch: 'Sketch',
        process: 'Process',
        installation: 'Installation',
        detail: 'Detail',
        final: 'Final',
        context: 'Context'
      };
      return labels[category] || category;
    }

    /**
     * Emit custom event
     * @private
     */
    _emitEvent(eventName, detail) {
      const event = new CustomEvent(eventName, { detail, bubbles: true });
      this.container.dispatchEvent(event);
    }
  }

  // Export to global namespace
  window.ArtworkImageCarousel = ArtworkImageCarousel;

  console.log('[Carousel] ArtworkImageCarousel class registered');

})();
