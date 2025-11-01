/**
 * ParticleSystem - Individual particle system for each artwork-critic combination
 *
 * Week 1 Task 1.3: Particle System Framework
 * 24 systems total (4 artworks × 6 critics)
 */

class ParticleSystem {
  constructor(options = {}) {
    this.artworkId = options.artworkId;      // artwork_1, artwork_2, etc.
    this.criticId = options.criticId;        // 苏轼, 郭熙, etc.
    this.regionBounds = options.regionBounds; // { x, y, w, h }

    // Particle data
    this.particles = [];
    this.particleCount = 80;  // Default, will be updated by RPAIT
    this.maxParticles = 300;   // Maximum particles

    // State
    this.enabled = true;
    this.isActive = false;  // Whether this system is currently active
    this.fadeOutAlpha = 1.0;  // For fade-out effect

    // Layer 1: Gallery Walk (spatial focus)
    this.fadeAlpha = 0;              // 0-1, temporal fade-in/fade-out animation
    this.sequenceIndex = 0;          // 0-5, order of appearance
    this.regionFocused = false;      // Is this region currently hovered?

    // Layer 3: Auto-Play (prominence weighting)
    this.prominenceLevel = 0.05;     // 0-1, dynamic weighting (0.05=min, 1.0=max)
    this.baseProminence = 0.05;      // Static baseline for negative space visibility

    // Computed final alpha
    this.finalAlpha = 0;             // = fadeAlpha × (baseProminence + prominenceLevel × 0.95)

    // RPAIT weights
    this.rpait = options.rpait || { R: 5, P: 5, A: 5, I: 5, T: 5 };
    this.currentVisuals = null;  // Cached visual parameters

    // Color and motion identity
    this.colorIdentity = ColorUtils.getPersonaColorIdentity(this.criticId);
    this.motionPattern = this.colorIdentity.motionPattern;

    // Display container
    this.displayContainer = new PIXI.Container();
    this.displayContainer.position.set(this.regionBounds.x, this.regionBounds.y);

    // Particle sprites pool
    this.spritePool = [];

    // Initialize
    this.initParticles();
  }

  /**
   * Initialize particles
   */
  initParticles() {
    for (let i = 0; i < this.particleCount; i++) {
      const particle = this.createParticle();
      this.particles.push(particle);
    }
    console.log(`✅ ParticleSystem initialized: ${this.criticId} (${this.artworkId}) with ${this.particleCount} particles`);
  }

  /**
   * Create a single particle
   */
  createParticle() {
    return {
      x: Math.random() * this.regionBounds.w,
      y: Math.random() * this.regionBounds.h,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: 2 + Math.random() * 3,
      alpha: 0.1 + Math.random() * 0.2,
      color: this.colorIdentity.primaryColor,
      lifespan: 1,
      maxAge: 100 + Math.random() * 100,
    };
  }

  /**
   * Update RPAIT weights and respond visually
   */
  updateRPAIT(rpait) {
    this.rpait = RPAITMapper.normalizeRPAIT(rpait);

    // Map RPAIT to visual properties
    const visuals = RPAITMapper.mapToVisuals(this.rpait, this.criticId);

    // Update particle count based on R (Representation)
    const targetCount = Math.round(visuals.particleCount);
    this.particleCount = Math.min(targetCount, this.maxParticles);

    // Adjust particle count
    while (this.particles.length < this.particleCount) {
      this.particles.push(this.createParticle());
    }
    while (this.particles.length > this.particleCount) {
      this.particles.pop();
    }

    // Store visual properties for this update cycle
    this.currentVisuals = visuals;

    // Update other parameters
    this.updateMotionParameters();
    this.updateColorParameters();

    console.log(`🎨 Updated RPAIT for ${this.criticId} (${this.artworkId}):`, {
      R: this.rpait.R,
      P: this.rpait.P,
      A: this.rpait.A,
      I: this.rpait.I,
      T: this.rpait.T,
      particleCount: this.particleCount,
    });
  }

  /**
   * Update motion parameters based on P (Philosophy)
   */
  updateMotionParameters() {
    const p = this.rpait.P / 10;  // 0-1
    const t = this.rpait.T / 10;  // 0-1

    this.particles.forEach(particle => {
      // Base speed depends on Technique
      const speed = 0.5 + t * 1.5;

      // Drift intensity depends on Philosophy
      const driftIntensity = (1 + p * 0.3);

      particle.vx *= driftIntensity;
      particle.vy *= driftIntensity;
    });
  }

  /**
   * Update color parameters based on A (Aesthetics) and I (Interpretation)
   */
  updateColorParameters() {
    if (!this.currentVisuals) {
      this.currentVisuals = RPAITMapper.mapToVisuals(this.rpait, this.criticId);
    }

    const visuals = this.currentVisuals;

    // Generate dynamic color from RPAIT weights
    const hue = RPAITMapper.generateHue(this.rpait.A, this.criticId);
    const saturation = RPAITMapper.generateSaturation(this.rpait.A);
    const lightness = RPAITMapper.generateLightness(this.rpait.A);

    const rgbColor = ColorUtils.hslToRgb(hue, saturation, lightness);
    const hexColor = ColorUtils.rgbToHex(rgbColor.r, rgbColor.g, rgbColor.b);

    // Alpha based on Interpretation
    const alphaMin = visuals.alphaMin;
    const alphaMax = visuals.alphaMax;

    this.particles.forEach(particle => {
      particle.color = hexColor;
      particle.alpha = alphaMin + Math.random() * (alphaMax - alphaMin);
      particle.size = visuals.particleSize;
    });

    console.log(`   🎨 Color updated: HSL(${hue.toFixed(0)}, ${saturation.toFixed(0)}%, ${lightness.toFixed(0)}%)`);
  }

  /**
   * Update positions of particles
   */
  update(delta) {
    if (!this.enabled || !this.isActive) return;

    const bounds = this.regionBounds;
    const p = this.rpait.P / 10;

    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.vx * (1 + p * 0.5);
      particle.y += particle.vy * (1 + p * 0.5);

      // Boundary detection (bounce)
      if (particle.x < 0 || particle.x > bounds.w) particle.vx *= -1;
      if (particle.y < 0 || particle.y > bounds.h) particle.vy *= -1;

      // Keep within bounds
      particle.x = Math.max(0, Math.min(bounds.w, particle.x));
      particle.y = Math.max(0, Math.min(bounds.h, particle.y));

      // Age particles
      particle.lifespan -= 0.005;
      if (particle.lifespan < 0) {
        Object.assign(particle, this.createParticle());
      }
    });
  }

  /**
   * Render particles to display container (with performance optimization)
   */
  render() {
    if (!this.enabled) {
      this.displayContainer.removeChildren();
      return;
    }

    // Calculate final alpha from fadeAlpha and prominenceLevel (Layer 1 + Layer 3)
    this.finalAlpha = this.fadeAlpha *
      (this.baseProminence + this.prominenceLevel * 0.95);

    // Skip rendering if alpha too low (negative space principle)
    if (this.finalAlpha < 0.01) {
      this.displayContainer.removeChildren();
      return;
    }

    // Clear previous frame
    this.displayContainer.removeChildren();

    // Don't render if no particles
    if (this.particles.length === 0) return;

    // Create a single graphics object for batch rendering (more efficient)
    const graphics = new PIXI.Graphics();

    // Draw all particles in one batch
    this.particles.forEach(particle => {
      const alpha = particle.alpha * particle.lifespan * this.finalAlpha;

      // Skip if alpha is too low
      if (alpha < 0.01) return;

      // Set fill style
      const color = particle.color;
      graphics.beginFill(color, alpha);

      // Draw circle
      const radius = particle.size / 2;
      graphics.drawCircle(particle.x, particle.y, radius);

      graphics.endFill();
    });

    this.displayContainer.addChild(graphics);
  }

  /**
   * Render particles with glow effect (for high Aesthetics values)
   */
  renderWithGlow() {
    if (!this.enabled) return;

    // Calculate final alpha from fadeAlpha and prominenceLevel (Layer 1 + Layer 3)
    this.finalAlpha = this.fadeAlpha *
      (this.baseProminence + this.prominenceLevel * 0.95);

    // Skip rendering if alpha too low
    if (this.finalAlpha < 0.01) {
      this.displayContainer.removeChildren();
      return;
    }

    this.displayContainer.removeChildren();

    const glowIntensity = this.currentVisuals?.glowIntensity || 0.1;

    this.particles.forEach(particle => {
      const alpha = particle.alpha * particle.lifespan * this.finalAlpha;

      // Draw glow
      if (glowIntensity > 0.05) {
        const glow = new PIXI.Graphics();
        const color = particle.color;
        const glowColor = ColorUtils.blendColors(color, 0xFFFFFF, 0.3);

        glow.beginFill(glowColor, alpha * glowIntensity * 0.5);
        glow.drawCircle(particle.x, particle.y, particle.size);
        glow.endFill();

        this.displayContainer.addChild(glow);
      }

      // Draw particle
      const graphics = new PIXI.Graphics();
      graphics.beginFill(particle.color, alpha);
      graphics.drawCircle(particle.x, particle.y, particle.size / 2);
      graphics.endFill();

      this.displayContainer.addChild(graphics);
    });
  }

  /**
   * Handle hover effect - magnify particles
   */
  handleHover(isHovering) {
    this.isActive = isHovering;
    if (isHovering) {
      this.displayContainer.scale.set(1.05);
      console.log(`✨ Hovering over: ${this.criticId} (${this.artworkId})`);
    } else {
      this.displayContainer.scale.set(1);
    }
  }

  /**
   * Handle click effect - burst animation
   */
  handleClick() {
    this.particles.forEach(particle => {
      const angle = Math.atan2(particle.y - this.regionBounds.h / 2, particle.x - this.regionBounds.w / 2);
      particle.vx = Math.cos(angle) * 5;
      particle.vy = Math.sin(angle) * 5;
    });
    console.log(`💥 Burst effect: ${this.criticId} (${this.artworkId})`);
  }

  /**
   * Get particle system info for debugging
   */
  getInfo() {
    return {
      artworkId: this.artworkId,
      criticId: this.criticId,
      particleCount: this.particles.length,
      isActive: this.isActive,
      rpait: this.rpait,
      colorIdentity: this.colorIdentity.name,
    };
  }

  /**
   * Reset particle system
   */
  reset() {
    this.particles = [];
    this.initParticles();
    this.isActive = false;
    this.displayContainer.removeChildren();
  }

  /**
   * Destroy particle system
   */
  destroy() {
    this.particles = [];
    this.displayContainer.destroy();
    console.log(`🗑️  ParticleSystem destroyed: ${this.criticId} (${this.artworkId})`);
  }
}

// Make globally accessible
window.ParticleSystem = ParticleSystem;
