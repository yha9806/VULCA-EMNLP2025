/**
 * PixiRenderer - Core rendering engine for VULCA Exhibition
 * Initializes PixiJS application and manages ParticleContainer
 *
 * Week 1 Task 1.1: PixiJS Integration
 */

class PixiRenderer {
  constructor(containerElement) {
    this.container = containerElement;
    this.app = null;
    this.particleContainer = null;
    this.fps = 0;
    this.frameTime = 0;
    this.lastFrameTime = performance.now();
    this.initPromise = this.init();
  }

  /**
   * Initialize PixiJS application (async for PixiJS 8.x)
   */
  async init() {
    try {
      console.log('Creating PIXI.Application...');
      console.log('PIXI version:', PIXI.VERSION);

      // Create PixiJS application
      this.app = new PIXI.Application();

      // Initialize app (required in PixiJS 8.x)
      console.log('Initializing application...');
      await this.app.init({
        width: window.innerWidth,
        height: window.innerHeight * 0.7,  // 70% height for exhibition area
        backgroundColor: 0xFAFAF8,  // 极浅米色
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      console.log('PIXI.Application initialized:', this.app);

      // Get canvas element
      const canvas = this.app.canvas;
      if (!canvas) {
        throw new Error('PixiJS canvas not available after init');
      }

      console.log('Canvas found, appending to container');
      this.container.appendChild(canvas);

      // Create ParticleContainer for high-performance rendering
      // Supports 100K+ particles with a single draw call
      this.particleContainer = new PIXI.ParticleContainer(
        100000,  // Maximum number of particles
        {
          scale: true,
          position: true,
          rotation: true,
          uvs: false,
          tint: true,  // Enable color tinting
          alpha: true,
        }
      );

      // Add particle container to stage
      this.app.stage.addChild(this.particleContainer);

      // Setup responsive resizing
      window.addEventListener('resize', () => this.handleResize());

      // Setup rendering loop
      this.app.ticker.add((delta) => this.update(delta));

      console.log('✅ PixiJS Renderer initialized successfully');
      if (this.app.renderer) {
        console.log(`   Canvas: ${this.app.renderer.width}x${this.app.renderer.height}`);
      } else if (this.app.canvas) {
        console.log(`   Canvas: ${this.app.canvas.width}x${this.app.canvas.height}`);
      }
      console.log(`   ParticleContainer capacity: 100,000 particles`);

      return true;
    } catch (error) {
      console.error('❌ PixiJS initialization failed:', error);
      return false;
    }
  }

  /**
   * Handle window resize
   */
  handleResize() {
    if (!this.app || !this.app.renderer) return;

    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight * 0.7;

    try {
      this.app.renderer.resize(newWidth, newHeight);
      console.log(`📐 Resized to ${newWidth}x${newHeight}`);
    } catch (error) {
      console.error('Resize failed:', error);
    }

    // Trigger resize event for other components
    window.dispatchEvent(new CustomEvent('pixi-resized', {
      detail: { width: newWidth, height: newHeight }
    }));
  }

  /**
   * Update loop - called every frame
   */
  update(delta) {
    // Calculate FPS
    const currentTime = performance.now();
    this.frameTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;

    // Update FPS counter (average over 10 frames)
    this.fps = Math.round(1000 / this.frameTime);

    // Dispatch frame update event for particle systems
    window.dispatchEvent(new CustomEvent('pixi-frame-update', {
      detail: { delta, fps: this.fps, frameTime: this.frameTime }
    }));
  }

  /**
   * Add a sprite to the particle container
   */
  addParticle(sprite) {
    if (this.particleContainer) {
      this.particleContainer.addChild(sprite);
    }
  }

  /**
   * Remove a sprite from the particle container
   */
  removeParticle(sprite) {
    if (this.particleContainer && sprite.parent === this.particleContainer) {
      this.particleContainer.removeChild(sprite);
    }
  }

  /**
   * Get renderer info for debugging
   */
  getInfo() {
    const width = this.app.renderer?.width || this.app.canvas?.width || 0;
    const height = this.app.renderer?.height || this.app.canvas?.height || 0;
    return {
      width,
      height,
      fps: this.fps,
      frameTime: this.frameTime.toFixed(2),
      particleCount: this.particleContainer.children.length,
      maxParticles: 100000,
    };
  }

  /**
   * Take a screenshot of the current frame
   */
  takeScreenshot() {
    if (this.app && this.app.renderer.view) {
      return this.app.renderer.view.toDataURL('image/png');
    }
    return null;
  }

  /**
   * Destroy renderer and cleanup
   */
  destroy() {
    if (this.app) {
      this.app.destroy(true);
      this.app = null;
      this.particleContainer = null;
      console.log('🗑️  PixiJS Renderer destroyed');
    }
  }
}

// Make globally accessible
window.PixiRenderer = PixiRenderer;
