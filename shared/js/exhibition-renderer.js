/**
 * Exhibition Renderer
 *
 * Renders exhibition pages from loaded data (config, data, dialogues).
 * Handles DOM manipulation and component initialization.
 *
 * Usage:
 *   import { ExhibitionRenderer } from '/shared/js/exhibition-renderer.js';
 *   const renderer = new ExhibitionRenderer(rootElement);
 *   await renderer.render(config, data, dialogues);
 */

/**
 * ExhibitionRenderer class
 * Renders exhibition content from JSON data
 */
export class ExhibitionRenderer {
  /**
   * @param {HTMLElement} root - Root element to render into (e.g., #exhibition-root)
   */
  constructor(root) {
    this.root = root;
    this.config = null;
    this.data = null;
    this.dialogues = null;
  }

  /**
   * Render complete exhibition
   * @param {Object} config - Exhibition configuration
   * @param {Object} data - Exhibition data (artworks, personas, critiques)
   * @param {Object} dialogues - Dialogue data
   */
  async render(config, data, dialogues) {
    console.log('[ExhibitionRenderer] Rendering exhibition:', config.titleZh);

    this.config = config;
    this.data = data;
    this.dialogues = dialogues;

    // Clear root
    this.root.innerHTML = '';

    try {
      // 1. Update meta tags
      this.updateMetaTags();

      // 2. Render exhibition structure
      this.renderStructure();

      // 3. Initialize components (deferred to avoid blocking)
      await this.initializeComponents();

      console.log('[ExhibitionRenderer] ✓ Exhibition rendered successfully');
    } catch (error) {
      console.error('[ExhibitionRenderer] ✗ Rendering failed:', error);
      this.renderError(error);
    }
  }

  /**
   * Update page meta tags with exhibition data
   */
  updateMetaTags() {
    const { titleZh, titleEn, descriptionZh, descriptionEn, assets } = this.config;
    const currentLang = document.documentElement.lang || 'zh-CN';

    // Update <title>
    const title = currentLang === 'en' ? `${titleEn} | VULCA` : `${titleZh} | VULCA`;
    document.title = title;

    // Update meta description
    const description = currentLang === 'en' ? descriptionEn : descriptionZh;
    this.updateMetaTag('name', 'description', description);

    // Update Open Graph tags
    this.updateMetaTag('property', 'og:title', titleZh);
    this.updateMetaTag('property', 'og:description', descriptionZh);
    this.updateMetaTag('property', 'og:type', 'website');
    this.updateMetaTag('property', 'og:url', window.location.href);

    // Update OG image (convert relative to absolute)
    if (assets && assets.ogImage) {
      const ogImageUrl = this.resolveAssetUrl(assets.ogImage);
      this.updateMetaTag('property', 'og:image', ogImageUrl);
    }

    // Update Twitter Card tags
    this.updateMetaTag('name', 'twitter:card', 'summary_large_image');
    this.updateMetaTag('name', 'twitter:title', titleZh);
    this.updateMetaTag('name', 'twitter:description', descriptionZh);

    if (assets && assets.ogImage) {
      const ogImageUrl = this.resolveAssetUrl(assets.ogImage);
      this.updateMetaTag('name', 'twitter:image', ogImageUrl);
    }

    console.log('[ExhibitionRenderer] ✓ Meta tags updated');
  }

  /**
   * Update or create a meta tag
   * @param {string} attributeName - 'name' or 'property'
   * @param {string} attributeValue - Meta tag identifier
   * @param {string} content - Meta tag content
   */
  updateMetaTag(attributeName, attributeValue, content) {
    let meta = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);

    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attributeName, attributeValue);
      document.head.appendChild(meta);
    }

    meta.setAttribute('content', content);
  }

  /**
   * Resolve relative asset URL to absolute URL
   * @param {string} relativeUrl - Relative URL (e.g., './assets/cover.jpg')
   * @returns {string} Absolute URL
   */
  resolveAssetUrl(relativeUrl) {
    const baseUrl = window.location.origin;
    const exhibitionPath = `/exhibitions/${this.config.id}`;

    // Remove leading './' if present
    const cleanUrl = relativeUrl.replace(/^\.\//, '');

    return `${baseUrl}${exhibitionPath}/${cleanUrl}`;
  }

  /**
   * Render exhibition HTML structure
   */
  renderStructure() {
    this.root.innerHTML = `
      <div class="exhibition-container" data-exhibition-id="${this.config.id}">
        <!-- Hero Section -->
        <section id="hero-section" class="hero-section">
          <!-- Will be populated by initializeComponents() -->
        </section>

        <!-- Dialogue Section -->
        <section id="dialogue-section" class="dialogue-section">
          <!-- Will be populated by DialoguePlayer -->
        </section>

        <!-- Critics Section -->
        <section id="critics-section" class="critics-section">
          <!-- Will be populated by critics visualization -->
        </section>
      </div>
    `;

    console.log('[ExhibitionRenderer] ✓ Structure rendered');
  }

  /**
   * Initialize interactive components
   */
  async initializeComponents() {
    console.log('[ExhibitionRenderer] Initializing components...');

    // Initialize components based on enabled features
    const features = this.config.features || [];

    // 1. Hero section (artwork display)
    await this.initializeHero();

    // 2. Dialogue Player
    if (features.includes('dialogue-player')) {
      await this.initializeDialoguePlayer();
    }

    // 3. RPAIT visualizations
    if (features.includes('rpait-radar') || features.includes('persona-matrix')) {
      await this.initializeCriticsVisualizations();
    }

    console.log('[ExhibitionRenderer] ✓ Components initialized');
  }

  /**
   * Initialize hero section (artwork display)
   */
  async initializeHero() {
    const heroSection = document.getElementById('hero-section');
    if (!heroSection) return;

    const currentLang = document.documentElement.lang || 'zh-CN';
    const title = currentLang === 'en' ? this.config.titleEn : this.config.titleZh;
    const description = currentLang === 'en' ? this.config.descriptionEn : this.config.descriptionZh;

    heroSection.innerHTML = `
      <div class="hero-content">
        <h1 class="hero-title">
          <span lang="zh">${this.config.titleZh}</span>
          <span lang="en">${this.config.titleEn}</span>
        </h1>
        <p class="hero-description">
          <span lang="zh">${this.config.descriptionZh || ''}</span>
          <span lang="en">${this.config.descriptionEn || ''}</span>
        </p>
      </div>

      <div id="artwork-display" class="artwork-display">
        <!-- Artwork carousel or single image -->
      </div>
    `;

    // If ArtworkCarousel component is available, initialize it
    if (typeof window.ArtworkCarousel !== 'undefined' && this.data.artworks.length > 0) {
      const artworkDisplay = document.getElementById('artwork-display');
      // Initialize carousel with first artwork
      // TODO: Implement ArtworkCarousel integration
      console.log('[ExhibitionRenderer] TODO: Initialize ArtworkCarousel');
    }
  }

  /**
   * Initialize Dialogue Player
   */
  async initializeDialoguePlayer() {
    const dialogueSection = document.getElementById('dialogue-section');
    if (!dialogueSection || !this.dialogues || !this.dialogues.dialogues) return;

    // Check if DialoguePlayer is available
    if (typeof window.DialoguePlayer === 'undefined') {
      console.warn('[ExhibitionRenderer] DialoguePlayer not found, skipping dialogue rendering');
      return;
    }

    // Create container for dialogue player
    dialogueSection.innerHTML = `
      <div id="dialogue-player-container" class="dialogue-player-container">
        <!-- DialoguePlayer will be initialized here -->
      </div>
    `;

    // Initialize DialoguePlayer with first dialogue
    // (In production, this would allow switching between dialogues)
    if (this.dialogues.dialogues.length > 0) {
      const firstDialogue = this.dialogues.dialogues[0];
      const container = document.getElementById('dialogue-player-container');

      try {
        // Make VULCA_DATA available for DialoguePlayer (backward compatibility)
        if (!window.VULCA_DATA) {
          window.VULCA_DATA = this.data;
        }

        // Initialize DialoguePlayer
        const player = new window.DialoguePlayer(firstDialogue, container, {
          speed: 1.0,
          autoPlay: true,
          lang: document.documentElement.lang === 'en' ? 'en' : 'zh'
        });

        console.log('[ExhibitionRenderer] ✓ DialoguePlayer initialized');
      } catch (error) {
        console.error('[ExhibitionRenderer] ✗ Failed to initialize DialoguePlayer:', error);
      }
    }
  }

  /**
   * Initialize critics visualizations (RPAIT radar, persona matrix)
   */
  async initializeCriticsVisualizations() {
    const criticsSection = document.getElementById('critics-section');
    if (!criticsSection) return;

    // This would initialize RPAIT visualizations
    // For now, we'll just log a placeholder
    console.log('[ExhibitionRenderer] TODO: Initialize critics visualizations');
  }

  /**
   * Render error state
   * @param {Error} error - Error object
   */
  renderError(error) {
    this.root.innerHTML = `
      <div class="exhibition-error">
        <h2>⚠️ Exhibition Rendering Error</h2>
        <p>${error.message}</p>
        <pre>${error.stack || ''}</pre>
        <button onclick="window.location.reload()">Reload Page</button>
      </div>
    `;
  }
}

/**
 * Render exhibition from loaded data
 * Convenience function for simple use cases
 * @param {HTMLElement} root - Root element
 * @param {Object} exhibition - { config, data, dialogues }
 */
export async function renderExhibition(root, exhibition) {
  const renderer = new ExhibitionRenderer(root);
  await renderer.render(exhibition.config, exhibition.data, exhibition.dialogues);
}

// Export for global use (backward compatibility)
if (typeof window !== 'undefined') {
  window.ExhibitionRenderer = ExhibitionRenderer;
  window.renderExhibition = renderExhibition;

  console.log('[ExhibitionRenderer] Module loaded and available globally');
}
