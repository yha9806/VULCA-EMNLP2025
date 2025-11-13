/**
 * Data Loader for Multi-Exhibition Platform
 * Loads exhibition data from data.json and transforms it into VULCA_DATA format
 * Version: 1.0.0
 */

(async function() {
  console.log('[Data Loader] Starting to load exhibition data...');

  try {
    // Fetch data.json from the exhibition directory
    const response = await fetch('./data.json');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const exhibitionData = await response.json();
    console.log(`[Data Loader] Loaded ${exhibitionData.artworks.length} artworks from data.json`);

    // Transform exhibition data into VULCA_DATA format
    window.VULCA_DATA = {
      artworks: exhibitionData.artworks || [],
      personas: exhibitionData.personas || [],
      critiques: exhibitionData.critiques || []
    };

    // Set image categories (for backward compatibility)
    window.IMAGE_CATEGORIES = {
      SKETCH: "sketch",
      PROCESS: "process",
      INSTALLATION: "installation",
      DETAIL: "detail",
      FINAL: "final",
      CONTEXT: "context"
    };

    console.log('[Data Loader] ✓ Data loaded successfully:');
    console.log(`  - Artworks: ${window.VULCA_DATA.artworks.length}`);
    console.log(`  - Personas: ${window.VULCA_DATA.personas.length}`);
    console.log(`  - Critiques: ${window.VULCA_DATA.critiques.length}`);

    // Mark data as ready
    window.VULCA_DATA_READY = true;

    // Dispatch custom event to notify other scripts that data is ready
    const dataReadyEvent = new CustomEvent('vulca-data-ready', {
      detail: {
        artworks: window.VULCA_DATA.artworks.length,
        personas: window.VULCA_DATA.personas.length,
        critiques: window.VULCA_DATA.critiques.length
      }
    });
    document.dispatchEvent(dataReadyEvent);
    console.log('[Data Loader] ✓ Data ready event dispatched');

    // Wait for other scripts to load, then initialize
    // This ensures all modules (GalleryInit, carousel, etc.) are defined
    setTimeout(() => {
      console.log('[Data Loader] Triggering initialization...');

      // Initialize gallery system
      if (window.GalleryInit && typeof window.GalleryInit.init === 'function') {
        window.GalleryInit.init();
      }

      // Initialize carousel
      if (window.carousel && typeof window.carousel.init === 'function') {
        window.carousel.init();
      }

      // Render gallery hero
      if (window.renderGalleryHero && typeof window.renderGalleryHero === 'function') {
        window.renderGalleryHero();
      }

      console.log('[Data Loader] ✓ Initialization complete');
    }, 100); // Small delay to ensure all scripts are loaded

  } catch (error) {
    console.error('[Data Loader] ❌ Failed to load exhibition data:', error);

    // Fallback: Show error message to user
    const errorMessage = document.createElement('div');
    errorMessage.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 0, 0, 0.9);
      color: white;
      padding: 2rem;
      border-radius: 8px;
      font-family: monospace;
      z-index: 9999;
      max-width: 500px;
      text-align: center;
    `;
    errorMessage.innerHTML = `
      <h2>❌ Data Loading Error</h2>
      <p>Failed to load exhibition data.</p>
      <p style="font-size: 0.9em; opacity: 0.8;">${error.message}</p>
      <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; cursor: pointer;">
        Reload Page
      </button>
    `;
    document.body.appendChild(errorMessage);
  }
})();
