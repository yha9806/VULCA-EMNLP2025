/**
 * Exhibition Data Loader
 *
 * Dynamically loads exhibition configuration, data, and dialogue files.
 * Provides caching and error handling for production use.
 *
 * Usage:
 *   import { ExhibitionLoader } from '/shared/js/exhibition-loader.js';
 *   const loader = new ExhibitionLoader('negative-space-of-the-tide');
 *   const exhibition = await loader.loadAll();
 *   // exhibition = { config, data, dialogues }
 */

/**
 * ExhibitionLoader class
 * Handles loading and caching of exhibition JSON files
 */
export class ExhibitionLoader {
  /**
   * @param {string} exhibitionId - Exhibition slug/ID (e.g., 'negative-space-of-the-tide')
   */
  constructor(exhibitionId) {
    this.exhibitionId = exhibitionId;
    this.baseUrl = `/exhibitions/${exhibitionId}`;

    // Cache storage
    this.cache = {
      config: null,
      data: null,
      dialogues: null
    };

    // Loading state
    this.loading = {
      config: false,
      data: false,
      dialogues: false
    };
  }

  /**
   * Load config.json
   * @returns {Promise<Object>} Exhibition configuration
   */
  async loadConfig() {
    if (this.cache.config) {
      console.log('[ExhibitionLoader] Using cached config.json');
      return this.cache.config;
    }

    if (this.loading.config) {
      console.warn('[ExhibitionLoader] Config already loading, please wait');
      // Wait for existing request to complete
      await this._waitForLoad('config');
      return this.cache.config;
    }

    this.loading.config = true;
    const url = `${this.baseUrl}/config.json`;

    try {
      console.log(`[ExhibitionLoader] Fetching ${url}...`);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const config = await response.json();
      this.cache.config = config;
      this.loading.config = false;

      console.log('[ExhibitionLoader] ✓ config.json loaded:', config.titleZh);
      return config;
    } catch (error) {
      this.loading.config = false;
      console.error(`[ExhibitionLoader] ✗ Failed to load config.json:`, error);
      throw new Error(`Failed to load exhibition config: ${error.message}`);
    }
  }

  /**
   * Load data.json
   * @returns {Promise<Object>} Exhibition data (artworks, personas, critiques)
   */
  async loadData() {
    if (this.cache.data) {
      console.log('[ExhibitionLoader] Using cached data.json');
      return this.cache.data;
    }

    if (this.loading.data) {
      console.warn('[ExhibitionLoader] Data already loading, please wait');
      await this._waitForLoad('data');
      return this.cache.data;
    }

    this.loading.data = true;
    const url = `${this.baseUrl}/data.json`;

    try {
      console.log(`[ExhibitionLoader] Fetching ${url}...`);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      this.cache.data = data;
      this.loading.data = false;

      console.log('[ExhibitionLoader] ✓ data.json loaded:', {
        artworks: data.artworks.length,
        personas: data.personas.length,
        critiques: data.critiques.length
      });
      return data;
    } catch (error) {
      this.loading.data = false;
      console.error(`[ExhibitionLoader] ✗ Failed to load data.json:`, error);
      throw new Error(`Failed to load exhibition data: ${error.message}`);
    }
  }

  /**
   * Load dialogues.json
   * @returns {Promise<Object>} Dialogue data
   */
  async loadDialogues() {
    if (this.cache.dialogues) {
      console.log('[ExhibitionLoader] Using cached dialogues.json');
      return this.cache.dialogues;
    }

    if (this.loading.dialogues) {
      console.warn('[ExhibitionLoader] Dialogues already loading, please wait');
      await this._waitForLoad('dialogues');
      return this.cache.dialogues;
    }

    this.loading.dialogues = true;
    const url = `${this.baseUrl}/dialogues.json`;

    try {
      console.log(`[ExhibitionLoader] Fetching ${url}...`);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const dialogues = await response.json();
      this.cache.dialogues = dialogues;
      this.loading.dialogues = false;

      console.log('[ExhibitionLoader] ✓ dialogues.json loaded:', {
        dialogues: dialogues.dialogues.length,
        messages: dialogues.dialogues.reduce((sum, d) => sum + d.messages.length, 0)
      });
      return dialogues;
    } catch (error) {
      this.loading.dialogues = false;
      console.error(`[ExhibitionLoader] ✗ Failed to load dialogues.json:`, error);
      throw new Error(`Failed to load exhibition dialogues: ${error.message}`);
    }
  }

  /**
   * Load all exhibition data at once
   * @returns {Promise<Object>} { config, data, dialogues }
   */
  async loadAll() {
    console.log(`[ExhibitionLoader] Loading all data for: ${this.exhibitionId}`);

    try {
      // Load all in parallel for better performance
      const [config, data, dialogues] = await Promise.all([
        this.loadConfig(),
        this.loadData(),
        this.loadDialogues()
      ]);

      console.log('[ExhibitionLoader] ✓ All data loaded successfully');

      return { config, data, dialogues };
    } catch (error) {
      console.error('[ExhibitionLoader] ✗ Failed to load exhibition:', error);
      throw error;
    }
  }

  /**
   * Clear cache (useful for development/debugging)
   */
  clearCache() {
    console.log('[ExhibitionLoader] Clearing cache');
    this.cache = {
      config: null,
      data: null,
      dialogues: null
    };
  }

  /**
   * Wait for a specific resource to finish loading
   * @private
   * @param {string} resource - Resource name ('config', 'data', or 'dialogues')
   * @returns {Promise<void>}
   */
  async _waitForLoad(resource) {
    const maxWait = 10000; // 10 seconds
    const interval = 100; // Check every 100ms
    let elapsed = 0;

    while (this.loading[resource] && elapsed < maxWait) {
      await new Promise(resolve => setTimeout(resolve, interval));
      elapsed += interval;
    }

    if (elapsed >= maxWait) {
      throw new Error(`Timeout waiting for ${resource} to load`);
    }
  }
}

/**
 * Detect exhibition ID from current URL
 * Assumes URL structure: /exhibitions/{exhibition-id}/
 * @returns {string|null} Exhibition ID or null if not found
 */
export function detectExhibitionId() {
  const path = window.location.pathname;

  // Match pattern: /exhibitions/exhibition-slug/ or /exhibitions/exhibition-slug/index.html
  const match = path.match(/\/exhibitions\/([a-z0-9-]+)\/?(?:index\.html)?$/);

  if (match) {
    const exhibitionId = match[1];
    console.log(`[ExhibitionLoader] Detected exhibition ID: ${exhibitionId}`);
    return exhibitionId;
  }

  console.warn('[ExhibitionLoader] Could not detect exhibition ID from URL:', path);
  return null;
}

/**
 * Initialize exhibition page automatically
 * Detects exhibition ID, loads data, and triggers render
 * @param {Function} renderCallback - Callback function to render exhibition
 * @returns {Promise<void>}
 */
export async function initExhibitionPage(renderCallback) {
  console.log('[ExhibitionLoader] Initializing exhibition page...');

  // Detect exhibition ID
  const exhibitionId = detectExhibitionId();

  if (!exhibitionId) {
    throw new Error('Could not detect exhibition ID from URL. Please check URL format.');
  }

  // Create loader
  const loader = new ExhibitionLoader(exhibitionId);

  // Show loading state
  const root = document.getElementById('exhibition-root');
  if (root) {
    root.innerHTML = `
      <div class="exhibition-loading">
        <div class="loading-spinner"></div>
        <p>Loading exhibition...</p>
      </div>
    `;
  }

  try {
    // Load all data
    const exhibition = await loader.loadAll();

    // Call render callback
    if (typeof renderCallback === 'function') {
      await renderCallback(exhibition);
    } else {
      console.warn('[ExhibitionLoader] No render callback provided');
    }

    console.log('[ExhibitionLoader] ✓ Exhibition initialized successfully');
  } catch (error) {
    console.error('[ExhibitionLoader] ✗ Exhibition initialization failed:', error);

    // Show error state
    if (root) {
      root.innerHTML = `
        <div class="exhibition-error">
          <h2>⚠️ Failed to Load Exhibition</h2>
          <p>${error.message}</p>
          <button onclick="window.location.reload()">Retry</button>
        </div>
      `;
    }

    throw error;
  }
}

// Export for global use (backward compatibility)
if (typeof window !== 'undefined') {
  window.ExhibitionLoader = ExhibitionLoader;
  window.detectExhibitionId = detectExhibitionId;
  window.initExhibitionPage = initExhibitionPage;

  console.log('[ExhibitionLoader] Module loaded and available globally');
}
