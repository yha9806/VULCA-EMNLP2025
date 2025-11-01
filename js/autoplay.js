/**
 * VULCA Auto-Play Immersive Experience
 * js/autoplay.js - v1.0.0
 *
 * Manages automatic carousel playback of artworks and critiques
 * No user interaction needed - fully automatic and looping
 */

window.AutoPlayController = (function() {
  'use strict';

  const CONFIG = {
    PANEL_APPEAR_TIME: 1200,    // ms - ghostAppear animation
    PANEL_DISPLAY_TIME: 2000,   // ms - how long panel stays visible
    PANEL_DISAPPEAR_TIME: 800,  // ms - ghostDisappear animation
    ARTWORK_APPEAR_TIME: 1200,  // ms
    VIZ_APPEAR_TIME: 1500,      // ms
    VIZ_DISPLAY_TIME: 3000,     // ms
    SECTION_DELAY: 500,         // ms - delay before next section
  };

  let currentSectionIndex = 0;
  let isPlaying = false;
  let animationTimeout = null;

  /**
   * Initialize auto-play controller
   */
  function init() {
    const sections = document.querySelectorAll('.artwork-section');
    if (sections.length === 0) {
      console.warn('⚠ No artwork sections found');
      return;
    }

    // Hide all panels initially
    sections.forEach((section) => {
      hideSection(section);
    });

    console.log(`✓ AutoPlay initialized with ${sections.length} artworks`);
    startPlayback();
  }

  /**
   * Start the playback loop
   */
  function startPlayback() {
    isPlaying = true;
    currentSectionIndex = 0;
    playNextSection();
  }

  /**
   * Play the current section and schedule next
   */
  function playNextSection() {
    if (!isPlaying) return;

    const sections = document.querySelectorAll('.artwork-section');
    if (sections.length === 0) return;

    const section = sections[currentSectionIndex];

    playSection(section, () => {
      // Move to next section
      currentSectionIndex = (currentSectionIndex + 1) % sections.length;

      // Schedule next section with delay
      animationTimeout = setTimeout(() => {
        playNextSection();
      }, CONFIG.SECTION_DELAY);
    });
  }

  /**
   * Play a single artwork section with all its critiques
   * @param {HTMLElement} section - The artwork section to play
   * @param {Function} callback - Called when section playback completes
   */
  function playSection(section, callback) {
    const artworkImage = section.querySelector('.artwork-image');
    const critiquePanels = section.querySelectorAll('.critique-panel');
    const vizContainer = section.querySelector('.visualization-container');

    let timelineIndex = 0;
    let totalDuration = 0;

    // Show artwork image
    showElement(artworkImage, 0);
    totalDuration = CONFIG.ARTWORK_APPEAR_TIME + CONFIG.PANEL_DISPLAY_TIME;

    // Show each critique panel sequentially
    critiquePanels.forEach((panel, index) => {
      const panelStartTime = totalDuration + (index * (CONFIG.PANEL_APPEAR_TIME + CONFIG.PANEL_DISPLAY_TIME));
      showElement(panel, panelStartTime);
      totalDuration = panelStartTime + CONFIG.PANEL_APPEAR_TIME + CONFIG.PANEL_DISPLAY_TIME;
    });

    // Show visualization
    const vizStartTime = totalDuration;
    showElement(vizContainer, vizStartTime);
    totalDuration = vizStartTime + CONFIG.VIZ_APPEAR_TIME + CONFIG.VIZ_DISPLAY_TIME;

    // Hide all elements after section is done
    const hideStartTime = totalDuration;
    hideElement(artworkImage, hideStartTime);
    critiquePanels.forEach((panel) => {
      hideElement(panel, hideStartTime);
    });
    hideElement(vizContainer, hideStartTime);

    // Calculate total section duration
    const sectionDuration = hideStartTime + CONFIG.PANEL_DISAPPEAR_TIME + 200;

    // Schedule callback
    animationTimeout = setTimeout(callback, sectionDuration);

    console.log(`▶ Playing section ${currentSectionIndex + 1} (${sectionDuration}ms)`);
  }

  /**
   * Show element with ghostAppear animation
   * @param {HTMLElement} el - Element to show
   * @param {number} delay - Delay before showing (ms)
   */
  function showElement(el, delay) {
    setTimeout(() => {
      el.style.animation = 'none';
      el.style.opacity = '0';
      el.style.filter = 'blur(12px)';

      // Trigger reflow to restart animation
      void el.offsetWidth;

      el.style.animation = 'ghostAppear 1.2s ease-in-out forwards';
      el.style.opacity = '1';
    }, delay);
  }

  /**
   * Hide element with ghostDisappear animation
   * @param {HTMLElement} el - Element to hide
   * @param {number} delay - Delay before hiding (ms)
   */
  function hideElement(el, delay) {
    setTimeout(() => {
      el.style.animation = 'ghostDisappear 0.8s ease-in-out forwards';
      el.style.opacity = '0';
    }, delay);
  }

  /**
   * Hide all elements in a section
   * @param {HTMLElement} section - Section to hide
   */
  function hideSection(section) {
    const artworkImage = section.querySelector('.artwork-image');
    const critiquePanels = section.querySelectorAll('.critique-panel');
    const vizContainer = section.querySelector('.visualization-container');

    [artworkImage, ...critiquePanels, vizContainer].forEach((el) => {
      if (el) {
        el.style.opacity = '0';
        el.style.animation = 'none';
      }
    });
  }

  /**
   * Stop playback
   */
  function stop() {
    isPlaying = false;
    if (animationTimeout) {
      clearTimeout(animationTimeout);
    }
  }

  /**
   * Resume playback
   */
  function resume() {
    if (!isPlaying) {
      startPlayback();
    }
  }

  /**
   * Public API
   */
  return {
    init: init,
    stop: stop,
    resume: resume,
  };
})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.AutoPlayController.init();
  });
} else {
  window.AutoPlayController.init();
}
