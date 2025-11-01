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

      // Initialize interaction manager
      this.interactionManager = new InteractionManager(
        this.renderer.app,
        this.layout
      );

      // Register particle systems with interaction manager
      Object.entries(this.particleSystems).forEach(([key, system]) => {
        this.interactionManager.registerParticleSystem(key, system);
      });

      // Setup event listeners
      this.setupEventListeners();

      // Start animation loop
      this.startAnimationLoop();

      // Enable demo mode - show particles from all systems on startup
      this.enableDemoMode();

      this.isInitialized = true;
      console.log('✅ VULCA Exhibition initialized successfully');
      const rendererInfo = this.renderer.getInfo();
      console.log(`   - Renderer: ${rendererInfo.width}x${rendererInfo.height}`);
      console.log(`   - Particle Systems: ${Object.keys(this.particleSystems).length}`);
      console.log(`   - Regions: ${Object.keys(this.layout.getAllRegions()).length}`);

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

      // Update all particle systems
      Object.values(this.particleSystems).forEach(system => {
        system.update(1);

        // Render based on aesthetics level
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
    console.log('✅ Animation loop started');
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

    // Update top panel
    const artwork = RPAITManager.getArtworkData(region);
    if (artwork) {
      this.updateTopPanel(region, rpait, artwork);
    }

    console.log(`🎨 Interaction: ${type} on ${region}`);
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
