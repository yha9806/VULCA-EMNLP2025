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

    // RPAIT weights
    this.rpait = options.rpait || { R: 5, P: 5, A: 5, I: 5, T: 5 };

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
    this.rpait = rpait;

    // Update particle count based on R (Representation)
    const targetCount = Math.round(80 + (rpait.R * 20));
    this.particleCount = Math.min(targetCount, this.maxParticles);

    // Adjust particle count
    while (this.particles.length < this.particleCount) {
      this.particles.push(this.createParticle());
    }
    while (this.particles.length > this.particleCount) {
      this.particles.pop();
    }

    // Update other parameters
    this.updateMotionParameters();
    this.updateColorParameters();
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
   * Update color parameters based on A (Aesthetics)
   */
  updateColorParameters() {
    const a = this.rpait.A / 10;  // 0-1
    const i = this.rpait.I / 10;  // 0-1

    // Color brightness based on Aesthetics
    const colorVariant = ColorUtils.generateVariant(
      this.colorIdentity.primaryColor,
      this.rpait.A
    );

    // Alpha based on Interpretation
    const alphaMin = 0.05 + i * 0.05;
    const alphaMax = 0.3 + i * 0.2;

    this.particles.forEach(particle => {
      particle.color = colorVariant;
      particle.alpha = alphaMin + Math.random() * (alphaMax - alphaMin);
    });
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
   * Render particles to display container
   */
  render() {
    if (!this.enabled || !this.isActive) return;

    // Clear previous frame
    this.displayContainer.removeChildren();

    // Draw particles
    this.particles.forEach(particle => {
      const sprite = new PIXI.Graphics();
      sprite.beginFill(particle.color);
      sprite.drawCircle(particle.x, particle.y, particle.size / 2);
      sprite.endFill();
      sprite.alpha = particle.alpha * particle.lifespan;

      this.displayContainer.addChild(sprite);
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
