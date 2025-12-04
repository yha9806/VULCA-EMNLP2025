/**
 * Data Loader for Multi-Exhibition Platform
 * Loads exhibition data from data.json and transforms it into VULCA_DATA format
 * Version: 2.0.0 - Optimized loading with split data files
 *
 * Loading Strategy:
 * - Initial load: artworks.json + personas.json (~65KB) for fast first paint
 * - On-demand: critiques loaded per-artwork when needed
 * - Fallback: If split files not available, uses original data.json
 */

(async function() {
  console.log('[Data Loader] Starting to load exhibition data...');

  // Critiques cache
  const critiquesCache = {};

  /**
   * Load critiques for a specific artwork (on-demand)
   * @param {string} artworkId - Artwork ID
   * @returns {Promise<Array>} - Critiques array
   */
  async function loadCritiquesForArtwork(artworkId) {
    // Check cache first
    if (critiquesCache[artworkId]) {
      return critiquesCache[artworkId];
    }

    try {
      const response = await fetch(`./data/critiques/${artworkId}.json`);
      if (response.ok) {
        const data = await response.json();
        critiquesCache[artworkId] = data.critiques || [];
        console.log(`[Data Loader] Loaded critiques for ${artworkId}`);
        return critiquesCache[artworkId];
      }
    } catch (e) {
      console.warn(`[Data Loader] Could not load critiques for ${artworkId}:`, e.message);
    }

    // Fallback to cached critiques from initial load
    return (window.VULCA_DATA?.critiques || []).filter(c => c.artworkId === artworkId);
  }

  /**
   * Get all cached critiques
   * @returns {Array} - All loaded critiques
   */
  function getAllCritiques() {
    return Object.values(critiquesCache).flat();
  }

  try {
    // Try optimized loading (split files)
    let artworksData, personasData, critiquesData = [];
    let useOptimizedLoading = true;

    try {
      // Load artworks and personas in parallel (first paint data)
      const [artworksResponse, personasResponse] = await Promise.all([
        fetch('./data/artworks.json'),
        fetch('./data/personas.json')
      ]);

      if (artworksResponse.ok && personasResponse.ok) {
        artworksData = await artworksResponse.json();
        personasData = await personasResponse.json();
        console.log('[Data Loader] ✓ Optimized loading: split files loaded');
      } else {
        useOptimizedLoading = false;
      }
    } catch (e) {
      console.log('[Data Loader] Split files not available, falling back to data.json');
      useOptimizedLoading = false;
    }

    // Fallback to original data.json
    if (!useOptimizedLoading) {
      const response = await fetch('./data.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const exhibitionData = await response.json();
      artworksData = { artworks: exhibitionData.artworks, metadata: exhibitionData.metadata };
      personasData = { personas: exhibitionData.personas };
      critiquesData = exhibitionData.critiques || [];
      console.log('[Data Loader] ✓ Fallback: data.json loaded');
    }

    console.log(`[Data Loader] Loaded ${artworksData.artworks.length} artworks`);

    // Transform exhibition data into VULCA_DATA format
    window.VULCA_DATA = {
      artworks: artworksData.artworks || [],
      personas: personasData.personas || [],
      critiques: critiquesData, // Initially empty or full (fallback)

      // New API for on-demand critique loading
      getCritiques: loadCritiquesForArtwork,
      getAllLoadedCritiques: getAllCritiques,
      isOptimizedLoading: useOptimizedLoading
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
    console.log(`  - Critiques: ${window.VULCA_DATA.critiques.length} (initial)`);

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

    // If using optimized loading, load all critiques in background for visualizations
    if (useOptimizedLoading) {
      console.log('[Data Loader] Loading all critiques in background for visualizations...');

      // Load all critiques asynchronously
      (async function loadAllCritiques() {
        try {
          const artworkIds = artworksData.artworks.map(a => a.id);
          const allCritiques = [];

          // Load in batches to avoid too many parallel requests
          const batchSize = 10;
          for (let i = 0; i < artworkIds.length; i += batchSize) {
            const batch = artworkIds.slice(i, i + batchSize);
            const promises = batch.map(async (artworkId) => {
              try {
                const response = await fetch(`./data/critiques/${artworkId}.json`);
                if (response.ok) {
                  const data = await response.json();
                  critiquesCache[artworkId] = data.critiques || [];
                  return data.critiques || [];
                }
              } catch (e) {
                console.warn(`[Data Loader] Could not load critiques for ${artworkId}`);
              }
              return [];
            });

            const results = await Promise.all(promises);
            results.forEach(critiques => allCritiques.push(...critiques));
          }

          // Update VULCA_DATA.critiques with all loaded critiques
          window.VULCA_DATA.critiques = allCritiques;
          console.log(`[Data Loader] ✓ All critiques loaded: ${allCritiques.length} total`);

          // Re-initialize analysis module if it exists
          if (window.VULCA_ANALYSIS && typeof window.VULCA_ANALYSIS.init === 'function') {
            console.log('[Data Loader] Re-initializing analysis module with critiques...');
            window.VULCA_ANALYSIS.init();
          }

          // Dispatch event for visualizations to update
          document.dispatchEvent(new CustomEvent('vulca-critiques-ready', {
            detail: { count: allCritiques.length }
          }));

        } catch (e) {
          console.error('[Data Loader] Failed to load all critiques:', e);
        }
      })();
    }

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
