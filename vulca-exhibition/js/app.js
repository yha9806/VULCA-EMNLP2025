/**
 * VULCA Exhibition - Main Application
 *
 * Orchestrates all components:
 * - PixiRenderer (rendering engine)
 * - ExhibitionLayout (4-region layout)
 * - ParticleSystem × 24 (6 critics × 4 artworks)
 * - InteractionManager (user interactions)
 * - RPAITMapper (RPAIT to visual mapping)
 */

class VulcaExhibition {
  constructor() {
    this.renderer = null;
    this.layout = null;
    this.interactionManager = null;
    this.particleSystems = {};

    // Phase 4: RPAIT Visualization
    this.rpaitVisualization = null;

    // Phase 5: Content Interaction System
    this.searchIndex = null;
    this.searchUI = null;
    this.filterSystem = null;
    this.filterUI = null;
    this.bookmarkSystem = null;

    this.isInitialized = false;
    this.animationFrameId = null;
    this.time = 0;

    this.init();
  }

  /**
   * Wait for PixiJS to load from CDN
   */
  async waitForPixiJS() {
    const maxAttempts = 50;  // 5 seconds max
    let attempts = 0;

    while (!window.PIXI && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }

    if (!window.PIXI) {
      throw new Error('PixiJS failed to load from CDN');
    }

    console.log('✅ PixiJS loaded');
  }

  /**
   * Initialize the exhibition
   */
  async init() {
    try {
      console.log('🎨 Initializing VULCA Exhibition...');

      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
      }

      // Wait for PixiJS to load from CDN
      await this.waitForPixiJS();

      // Get container
      const container = document.getElementById('pixi-container');
      if (!container) {
        throw new Error('Container #pixi-container not found');
      }

      // Initialize PixiJS renderer
      this.renderer = new PixiRenderer(container);
      await this.renderer.initPromise;
      if (!this.renderer.app) {
        throw new Error('Failed to initialize PixiJS renderer');
      }

      // Initialize layout
      this.layout = new ExhibitionLayout(this.renderer);

      // Initialize particle systems for each artwork × critic combination
      this.initializeParticleSystems();

      // Initialize auto-play manager (Layer 3)
      this.autoPlayManager = new AutoPlayManager(this.layout);

      // Initialize interaction manager
      this.interactionManager = new InteractionManager(
        this.renderer.app,
        this.layout,
        this  // Pass app reference for pause/resume control
      );

      // Phase 4: Initialize RPAIT Visualization
      this.rpaitVisualization = new RPAITVisualization({
        canvasContainer: document.getElementById('rpait-chart-container'),
      });

      // Phase 5: Initialize Full-Text Search System
      this.initializeSearchSystem();

      // Register particle systems with interaction manager and layout
      Object.entries(this.particleSystems).forEach(([key, system]) => {
        this.interactionManager.registerParticleSystem(key, system);

        // Add to region systems mapping (Layer 1 + 3)
        this.layout.addSystemToRegion(system.artworkId, system);
      });

      // Setup event listeners
      this.setupEventListeners();

      // Start animation loop
      this.startAnimationLoop();

      // Auto-play will start automatically when page loads
      // (disable enableDemoMode - auto-play handles it now)

      this.isInitialized = true;
      console.log('✅ VULCA Exhibition initialized successfully');
      const rendererInfo = this.renderer.getInfo();
      console.log(`   - Renderer: ${rendererInfo.width}x${rendererInfo.height}`);
      console.log(`   - Particle Systems: ${Object.keys(this.particleSystems).length}`);
      console.log(`   - Regions: ${Object.keys(this.layout.getAllRegions()).length}`);
      console.log(`   - Phase 4 RPAIT Visualization: Ready`);
      console.log(`   - Phase 5 Full-Text Search: Ready (Press Ctrl+K to search)`);

      // Log info to console
      this.printDebugInfo();

    } catch (error) {
      console.error('❌ Initialization failed:', error);
      this.showErrorMessage(error.message);
    }
  }

  /**
   * Initialize 24 particle systems (4 artworks × 6 critics)
   */
  initializeParticleSystems() {
    const artworkIds = RPAITManager.getAllArtworkIds();
    const criticIds = RPAITManager.getAllCriticIds();

    artworkIds.forEach(artworkId => {
      criticIds.forEach(criticId => {
        const rpait = RPAITManager.getRPAIT(artworkId, criticId);
        if (!rpait) return;

        const systemKey = `${artworkId}_${criticId}`;
        const regionBounds = this.layout.calculateBounds(
          this.layout.regions[artworkId]
        );

        // Create particle system
        const system = new ParticleSystem({
          artworkId,
          criticId,
          regionBounds,
          rpait,
        });

        // Apply RPAIT weights to make particles responsive
        system.updateRPAIT(rpait);

        this.particleSystems[systemKey] = system;

        // Add to layout
        this.layout.addParticleSystemToRegion(artworkId, system);
      });
    });

    console.log(`✅ Created ${Object.keys(this.particleSystems).length} particle systems`);
  }

  /**
   * Initialize search system (Phase 5)
   */
  initializeSearchSystem() {
    // Create SearchIndex
    this.searchIndex = new SearchIndex({
      minTokenLength: 2,
      maxResults: 50,
    });

    // Build critique data from CritiqueData
    const critiques = [];
    Object.entries(CritiqueData).forEach(([artworkId, artworkData]) => {
      Object.entries(artworkData.critiques).forEach(([personaId, critiqueData]) => {
        critiques.push({
          artworkId,
          personaId,
          title: critiqueData.title,
          content: critiqueData.content,
        });
      });
    });

    // Build search index
    this.searchIndex.buildIndex(critiques);

    // Create SearchUI
    this.searchUI = new SearchUI({
      searchIndex: this.searchIndex,
      onResultSelect: (critique) => this.handleSearchResultSelect(critique),
    });

    // Create FilterSystem
    this.filterSystem = new FilterSystem();
    this.filterSystem.setCritiques(critiques);

    // Create FilterUI
    this.filterUI = new FilterUI({
      filterSystem: this.filterSystem,
      onFilterChange: (results) => this.handleFilterChange(results),
    });

    // Create BookmarkSystem
    this.bookmarkSystem = new BookmarkSystem({
      maxBookmarks: 100,
      storageKey: 'vulca-bookmarks',
    });

    console.log('✅ Search system initialized with ' + critiques.length + ' critiques');
    console.log('✅ Filter system initialized');
    console.log('✅ Bookmark system initialized');
  }

  /**
   * Handle search result selection
   */
  handleSearchResultSelect(critique) {
    // Get RPAIT data for this critique
    const rpait = RPAITManager.getRPAIT(critique.artworkId, critique.personaId);
    const artwork = RPAITManager.getArtworkData(critique.artworkId);

    // Update top panel with critique info
    if (artwork) {
      this.updateTopPanel(critique.artworkId, rpait, artwork);
    }

    // Display RPAIT radar chart
    if (this.rpaitVisualization) {
      this.rpaitVisualization.displayPersonaChart(critique.artworkId, critique.personaId);
    }

    console.log(`✅ Selected critique: ${critique.personaId} - ${critique.artworkId}`);
  }

  /**
   * Handle filter change
   */
  handleFilterChange(results) {
    const stats = this.filterSystem.getStats();
    const summary = this.filterSystem.getFilterSummary();

    console.log(`📊 Filters applied: ${stats.filteredCritiques} / ${stats.totalCritiques} results`);
    console.log(`   ${summary}`);
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Resize
    window.addEventListener('resize', () => this.handleResize());

    // Particle interaction events
    window.addEventListener('particle-interaction', (event) => {
      this.handleParticleInteraction(event);
    });

    // Frame update events
    window.addEventListener('pixi-frame-update', (event) => {
      this.handleFrameUpdate(event);
    });

    // Panel buttons
    document.querySelectorAll('.panel-button').forEach(button => {
      button.addEventListener('click', (e) => this.handlePanelButtonClick(e));
    });

    console.log('✅ Event listeners registered');
  }

  /**
   * Enable demo mode - activate all particle systems to showcase RPAIT-driven particles
   */
  enableDemoMode() {
    // Activate all particle systems to show the RPAIT-driven particle visualization
    Object.values(this.particleSystems).forEach((system, index) => {
      // Stagger activation for visual effect (200ms apart)
      setTimeout(() => {
        system.isActive = true;
      }, index * 50);
    });

    console.log('🎬 Demo mode enabled - all 24 particle systems activated');
  }

  /**
   * Start animation loop
   */
  startAnimationLoop() {
    const animate = () => {
      this.time += 1;

      // ========== Layer 3: Update auto-play ==========
      this.autoPlayManager.update(1);

      // ========== Layer 1 + 2 + 3: Update all particle systems ==========
      Object.values(this.particleSystems).forEach(system => {
        // ===== Layer 2: Apply physics forces =====
        // Physics engine updates all particles with:
        // - Cursor attraction force
        // - Wind field forces
        // - Velocity damping
        // - Trail tracking
        const regionBounds = {
          x: system.regionBounds.x,
          y: system.regionBounds.y,
          w: system.regionBounds.w,
          h: system.regionBounds.h,
        };

        this.interactionManager.physicsEngine.updateParticles(
          system.particles,
          0.016,  // ~60fps delta time
          regionBounds
        );

        // Update particle physics (Layer 1 + 3)
        system.update(1);

        // Layer 1: Handle fade-in/fade-out based on regionFocused
        if (system.regionFocused && !system.isActive) {
          // Region is hovered - start fading in
          system.fadeAlpha = Math.min(1, system.fadeAlpha + 0.02);  // ~1000ms fade
          system.isActive = true;
        } else if (!system.regionFocused && system.fadeAlpha > 0) {
          // Region is not hovered - fade out
          system.fadeAlpha = Math.max(0, system.fadeAlpha - 0.01);  // ~1500ms fade
          if (system.fadeAlpha === 0) {
            system.isActive = false;
          }
        }

        // Render if this system has visible alpha
        if (system.isActive) {
          if (system.rpait?.A >= 7) {
            system.renderWithGlow();
          } else {
            system.render();
          }
        }
      });

      // Continue loop
      this.animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    console.log('✅ Animation loop started (Layer 1 + Layer 2 + Layer 3 active)');
  }

  /**
   * Handle window resize
   */
  handleResize() {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight * 0.7;

    this.renderer.handleResize();
    this.layout.handleResize(newWidth, newHeight);
  }

  /**
   * Handle particle interaction events
   */
  handleParticleInteraction(event) {
    const { type, region, rpait } = event.detail;

    // Parse region key (format: "artwork_1_苏轼")
    // region = regionKey from InteractionManager, which includes artwork and persona
    const parts = region.split('_');
    let artworkId = null;
    let personaId = null;

    if (parts.length >= 3) {
      // Format: artwork_[id]_[persona...]
      artworkId = `${parts[0]}_${parts[1]}`;  // "artwork_1"
      personaId = parts.slice(2).join('_');   // Handle persona names with underscores
    }

    // Update top panel
    const artwork = RPAITManager.getArtworkData(artworkId);
    if (artwork) {
      this.updateTopPanel(artworkId, rpait, artwork);
    }

    // Phase 4: Display RPAIT radar chart
    if (this.rpaitVisualization && artworkId && personaId) {
      this.rpaitVisualization.displayPersonaChart(artworkId, personaId, 'rpait-chart-container');
    }

    console.log(`🎨 Interaction: ${type} on ${region} | Chart: ${artworkId} × ${personaId}`);
  }

  /**
   * Handle frame update
   */
  handleFrameUpdate(event) {
    // Update FPS display if in debug mode
    if (window.location.search.includes('debug')) {
      // Could update FPS counter here
    }
  }

  /**
   * Handle panel button clicks
   */
  handlePanelButtonClick(event) {
    const action = event.target.dataset.action;

    switch (action) {
      case 'compare':
        this.showComparison();
        break;
      case 'rpait':
        this.showRPAITGuide();
        break;
      case 'critique':
        this.showCritiqueDetails();
        break;
      case 'settings':
        this.showSettings();
        break;
      case 'about':
        this.showAbout();
        break;
    }
  }

  /**
   * Update top panel with artwork info
   */
  updateTopPanel(regionKey, rpait, artwork) {
    const titleEl = document.querySelector('.artwork-title');
    const metaEl = document.querySelector('.artwork-meta');

    if (titleEl) titleEl.textContent = artwork.title || regionKey;
    if (metaEl) metaEl.textContent = `${artwork.year} • ${artwork.material}`;

    // Update RPAIT chart
    this.updateRPAITChart(rpait);
  }

  /**
   * Update RPAIT radar chart
   */
  updateRPAITChart(rpait) {
    const svg = document.getElementById('rpait-chart');
    if (!svg) return;

    // Simple radar chart implementation
    // For now, just update the transform
    const scale = (rpait.R + rpait.P + rpait.A + rpait.I + rpait.T) / 50;
    svg.style.transform = `scale(${0.8 + scale * 0.2})`;
  }

  /**
   * Show comparison modal
   */
  showComparison() {
    console.log('📊 Show Comparison');
    // TODO: Implement comparison UI
  }

  /**
   * Show RPAIT guide
   */
  showRPAITGuide() {
    console.log('📖 Show RPAIT Guide');
    // TODO: Implement RPAIT guide
  }

  /**
   * Show critique details
   */
  showCritiqueDetails() {
    console.log('📝 Show Critique Details');
    // TODO: Implement critique details
  }

  /**
   * Show settings
   */
  showSettings() {
    console.log('⚙️  Show Settings');
    // TODO: Implement settings UI
  }

  /**
   * Show about
   */
  showAbout() {
    console.log('ℹ️  Show About');
    // TODO: Implement about page
  }

  /**
   * Print debug information
   */
  printDebugInfo() {
    if (!window.location.search.includes('debug')) return;

    console.group('🐛 Debug Info');
    console.log('Renderer:', this.renderer.getInfo());
    console.log('Layout Regions:', this.layout.getInfo());
    console.log('Particle Systems:', Object.keys(this.particleSystems).length);
    console.log('Interaction Stats:', this.interactionManager.getStats());
    console.groupEnd();
  }

  /**
   * Show error message
   */
  showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.9);
      color: #FF6B6B;
      padding: 20px 40px;
      border-radius: 8px;
      font-family: monospace;
      z-index: 1000;
      max-width: 500px;
      text-align: center;
    `;
    errorDiv.innerHTML = `
      <strong>❌ Error</strong><br>
      ${message}<br>
      <small>Check console for details</small>
    `;
    document.body.appendChild(errorDiv);
  }

  /**
   * Destroy and cleanup
   */
  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    Object.values(this.particleSystems).forEach(system => system.destroy());
    this.interactionManager?.destroy();
    this.layout?.destroy();
    this.renderer?.destroy();

    // Phase 5: Cleanup search and filter systems
    if (this.searchUI) {
      this.searchUI.close();
    }
    if (this.searchIndex) {
      this.searchIndex.clear();
    }
    if (this.filterUI) {
      this.filterUI.close();
    }
    if (this.filterSystem) {
      this.filterSystem.resetFilters();
    }

    this.particleSystems = {};
    this.isInitialized = false;

    console.log('🗑️  VULCA Exhibition destroyed');
  }
}

// Initialize exhibition when page loads
let vulcaExhibition = null;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    vulcaExhibition = new VulcaExhibition();
  });
} else {
  vulcaExhibition = new VulcaExhibition();
}

// Make globally accessible
window.VulcaExhibition = VulcaExhibition;
window.vulcaExhibition = vulcaExhibition;
