/**
 * InteractionManager - Handles user interactions with particle systems
 *
 * Week 1 Task 1.5: Basic Interaction Event System
 * Manages hover, click, drag interactions
 */

class InteractionManager {
  constructor(pixiApp, layout, appInstance) {
    this.app = pixiApp;
    this.layout = layout;
    this.appInstance = appInstance;  // Reference to VulcaExhibition for pause/resume
    this.particleSystems = {};  // Map of region -> ParticleSystem

    // Interaction state
    this.activeRegion = null;
    this.hoveredRegion = null;
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.dragCurrent = { x: 0, y: 0 };

    // Layer 3: Auto-play pause/resume timing
    this.lastInteractionTime = Date.now();
    this.resumeAutoPlayTimer = null;

    // Layer 2: Physics Engine initialization
    this.physicsEngine = new PhysicsEngine({
      attractionStrength: 5000,
      attractionRange: 300,
      windScale: 100,
      windStrength: 0.5,
      damping: 0.98,
      trailsEnabled: true,
      trailLength: 15,
    });

    // Enable interaction on stage
    this.app.stage.interactive = true;
    this.app.stage.hitArea = new PIXI.Rectangle(0, 0, this.app.renderer.width, this.app.renderer.height);

    // Bind event handlers
    this.setupEventHandlers();

    console.log('✅ InteractionManager initialized');
    console.log('✅ PhysicsEngine (Layer 2) ready');
  }

  /**
   * Setup event listeners
   */
  setupEventHandlers() {
    const stage = this.app.stage;

    // Mouse move / hover
    stage.on('pointermove', (event) => this.handlePointerMove(event));

    // Mouse down
    stage.on('pointerdown', (event) => this.handlePointerDown(event));

    // Mouse up
    stage.on('pointerup', (event) => this.handlePointerUp(event));

    // Touch events
    stage.on('touchstart', (event) => this.handlePointerDown(event));
    stage.on('touchend', (event) => this.handlePointerUp(event));
    stage.on('touchmove', (event) => this.handlePointerMove(event));

    // Window resize
    window.addEventListener('pixi-resized', (event) => this.handleResize(event));

    // Keyboard
    window.addEventListener('keydown', (event) => this.handleKeyDown(event));
  }

  /**
   * Register a particle system for a region
   */
  registerParticleSystem(regionKey, particleSystem) {
    this.particleSystems[regionKey] = particleSystem;
    console.log(`✅ Registered particle system for region: ${regionKey}`);
  }

  /**
   * Get cursor position (for Layer 2 Physics)
   */
  getCursorPosition() {
    return this.physicsEngine.getCursorPosition();
  }

  /**
   * Callback for cursor move events
   */
  onCursorMove(callback) {
    this.cursorMoveCallback = callback;
  }

  /**
   * Handle pointer move (hover)
   */
  handlePointerMove(event) {
    const { x, y } = event.global;
    const regionKey = this.layout.getRegionAtPoint(x, y);

    // Layer 2: Update physics engine with cursor position
    // All particles will be attracted to cursor position
    const region = this.layout.regions[regionKey];
    if (region) {
      // Convert global coordinates to region-local coordinates
      const regionLocalX = x - region.x;
      const regionLocalY = y - region.y;
      this.physicsEngine.setCursorPosition(regionLocalX, regionLocalY, true);
    } else {
      // Cursor outside any region
      this.physicsEngine.setCursorPosition(x, y, false);
    }

    // Handle hover state change
    if (regionKey !== this.hoveredRegion) {
      if (this.hoveredRegion) {
        const prevSystem = this.particleSystems[this.hoveredRegion];
        if (prevSystem) prevSystem.handleHover(false);
      }

      this.hoveredRegion = regionKey;

      if (this.hoveredRegion) {
        const system = this.particleSystems[this.hoveredRegion];
        if (system) system.handleHover(true);
      }
    }

    // Handle dragging
    if (this.isDragging && this.activeRegion) {
      this.dragCurrent = { x, y };
      const system = this.particleSystems[this.activeRegion];
      if (system) {
        this.applyWindField(system, this.dragStart, this.dragCurrent);
      }
    }

    // Update cursor style
    this.updateCursorStyle(regionKey);
  }

  /**
   * Handle pointer down (click)
   */
  handlePointerDown(event) {
    const { x, y } = event.global;
    const regionKey = this.layout.getRegionAtPoint(x, y);

    if (regionKey) {
      this.isDragging = true;
      this.activeRegion = regionKey;
      this.dragStart = { x, y };

      // Trigger click effect
      const system = this.particleSystems[regionKey];
      if (system) {
        system.handleClick();
        this.dispatchInteractionEvent('click', regionKey, system.rpait);
      }

      console.log(`👆 Click on region: ${regionKey}`);
    }
  }

  /**
   * Handle pointer up
   */
  handlePointerUp(event) {
    this.isDragging = false;
    this.activeRegion = null;
  }

  /**
   * Handle resize
   */
  handleResize(event) {
    const { width, height } = event.detail;
    // Update layout if needed
    this.layout.handleResize(width, height);
  }

  /**
   * Handle keyboard input
   */
  handleKeyDown(event) {
    // Debug keys
    if (event.key === 'd') {
      this.toggleDebugMode();
    }
    if (event.key === 'r') {
      this.resetAllSystems();
    }
  }

  /**
   * Apply wind field effect for dragging
   */
  applyWindField(system, dragStart, dragCurrent) {
    const dx = dragCurrent.x - dragStart.x;
    const dy = dragCurrent.y - dragStart.y;

    // Scale drag to wind strength
    const windStrength = Math.sqrt(dx * dx + dy * dy) / 100;

    system.particles.forEach(particle => {
      particle.vx += dx * 0.01 * windStrength;
      particle.vy += dy * 0.01 * windStrength;
    });
  }

  /**
   * Update cursor style based on region
   */
  updateCursorStyle(regionKey) {
    if (regionKey) {
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'default';
    }
  }

  /**
   * Toggle debug mode
   */
  toggleDebugMode() {
    const isDebug = window.location.search.includes('debug');
    const newUrl = isDebug
      ? window.location.href.replace('?debug', '')
      : window.location.href + '?debug';
    window.location.href = newUrl;
  }

  /**
   * Reset all particle systems
   */
  resetAllSystems() {
    Object.values(this.particleSystems).forEach(system => {
      system.reset();
    });
    console.log('🔄 All particle systems reset');
  }

  /**
   * Dispatch custom interaction event
   */
  dispatchInteractionEvent(type, regionKey, rpait) {
    window.dispatchEvent(new CustomEvent('particle-interaction', {
      detail: {
        type,  // 'hover', 'click', 'drag'
        region: regionKey,
        rpait: rpait,
        timestamp: Date.now(),
      }
    }));
  }

  /**
   * Check if should resume auto-play (Layer 3)
   * Called every frame - resumes after 3 seconds of no interaction
   */
  checkResumeAutoPlay() {
    if (!this.appInstance?.autoPlayManager) return;

    const now = Date.now();
    const timeSinceInteraction = now - this.lastInteractionTime;

    // Resume auto-play if 3+ seconds have passed since last interaction
    if (timeSinceInteraction >= 3000 && !this.appInstance.autoPlayManager.isEnabled) {
      this.appInstance.autoPlayManager.resume();
    }
  }

  /**
   * Get interaction stats for debugging
   */
  getStats() {
    return {
      hoveredRegion: this.hoveredRegion,
      activeRegion: this.activeRegion,
      isDragging: this.isDragging,
      registeredSystems: Object.keys(this.particleSystems).length,
    };
  }

  /**
   * Destroy interaction manager
   */
  destroy() {
    this.app.stage.removeAllListeners();
    this.particleSystems = {};
    if (this.resumeAutoPlayTimer) {
      clearTimeout(this.resumeAutoPlayTimer);
    }
    console.log('🗑️  InteractionManager destroyed');
  }
}

// Make globally accessible
window.InteractionManager = InteractionManager;
