/**
 * ExhibitionLayout - 4-region grid layout for artworks
 *
 * Week 1 Task 1.2: Exhibition Layout
 * Manages 2x2 grid of exhibition regions, each containing 6 particle systems
 */

class ExhibitionLayout {
  constructor(pixiRenderer) {
    this.renderer = pixiRenderer;
    this.app = pixiRenderer.app;
    this.width = this.app.renderer.width;
    this.height = this.app.renderer.height;

    // 4 artwork regions in 2x2 grid
    this.regions = {
      artwork_1: { x: 0,   y: 0,   w: 0.5, h: 0.5, label: 'Artwork 1' },  // 左上
      artwork_2: { x: 0.5, y: 0,   w: 0.5, h: 0.5, label: 'Artwork 2' },  // 右上
      artwork_3: { x: 0,   y: 0.5, w: 0.5, h: 0.5, label: 'Artwork 3' },  // 左下
      artwork_4: { x: 0.5, y: 0.5, w: 0.5, h: 0.5, label: 'Artwork 4' },  // 右下
    };

    // Region containers
    this.regionContainers = {};

    // Region metadata
    this.regionData = {};

    this.createRegions();
  }

  /**
   * Create region containers
   */
  createRegions() {
    Object.entries(this.regions).forEach(([key, region]) => {
      const bounds = this.calculateBounds(region);

      // Create container for this region
      const container = new PIXI.Container();
      container.position.set(bounds.x, bounds.y);

      // Set hitArea for interaction
      container.hitArea = new PIXI.Rectangle(0, 0, bounds.w, bounds.h);
      container.interactive = true;

      // Store reference
      this.regionContainers[key] = container;
      this.app.stage.addChild(container);

      // Debug: draw border (only in dev mode)
      if (window.location.search.includes('debug')) {
        const border = new PIXI.Graphics();
        border.lineStyle(1, 0xCCCCCC, 0.3);
        border.drawRect(0, 0, bounds.w, bounds.h);
        container.addChild(border);

        // Label
        const text = new PIXI.Text(region.label, {
          fontSize: 12,
          fill: 0xCCCCCC,
        });
        text.position.set(10, 10);
        container.addChild(text);
      }

      console.log(`✅ Region created: ${key} at (${bounds.x}, ${bounds.y}) ${bounds.w}x${bounds.h}`);
    });
  }

  /**
   * Calculate bounds for a region
   */
  calculateBounds(region) {
    return {
      x: region.x * this.width,
      y: region.y * this.height,
      w: region.w * this.width,
      h: region.h * this.height,
    };
  }

  /**
   * Get region by key
   */
  getRegion(key) {
    return this.regionContainers[key];
  }

  /**
   * Get all regions
   */
  getAllRegions() {
    return this.regionContainers;
  }

  /**
   * Get region at point (for mouse interaction)
   */
  getRegionAtPoint(x, y) {
    for (const [key, region] of Object.entries(this.regions)) {
      const bounds = this.calculateBounds(region);
      if (x >= bounds.x && x <= bounds.x + bounds.w &&
          y >= bounds.y && y <= bounds.y + bounds.h) {
        return key;
      }
    }
    return null;
  }

  /**
   * Update layout on resize
   */
  handleResize(newWidth, newHeight) {
    this.width = newWidth;
    this.height = newHeight;

    // Recalculate all region bounds
    Object.entries(this.regionContainers).forEach(([key, container]) => {
      const region = this.regions[key];
      const bounds = this.calculateBounds(region);
      container.position.set(bounds.x, bounds.y);
      container.hitArea = new PIXI.Rectangle(0, 0, bounds.w, bounds.h);
    });

    console.log(`📐 Layout resized to ${newWidth}x${newHeight}`);
  }

  /**
   * Add particle system to region
   */
  addParticleSystemToRegion(regionKey, particleSystem) {
    const container = this.regionContainers[regionKey];
    if (container && particleSystem.displayContainer) {
      container.addChild(particleSystem.displayContainer);
      console.log(`✅ Added particle system to ${regionKey}`);
    }
  }

  /**
   * Get region info for debugging
   */
  getInfo() {
    const info = {};
    Object.entries(this.regionContainers).forEach(([key, container]) => {
      info[key] = {
        children: container.children.length,
        bounds: this.calculateBounds(this.regions[key]),
      };
    });
    return info;
  }

  /**
   * Destroy layout and cleanup
   */
  destroy() {
    Object.values(this.regionContainers).forEach(container => {
      this.app.stage.removeChild(container);
      container.destroy();
    });
    this.regionContainers = {};
    console.log('🗑️  ExhibitionLayout destroyed');
  }
}

// Make globally accessible
window.ExhibitionLayout = ExhibitionLayout;
