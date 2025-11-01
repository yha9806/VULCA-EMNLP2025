/**
 * PhysicsEngine - Layer 2 Interactive Physics
 *
 * Phase 3: Advanced particle physics driven by user interaction
 * Features:
 * - Cursor tracking
 * - Inverse-square-law attraction force
 * - Perlin noise wind fields
 * - Velocity damping
 * - Particle trail rendering
 */

class PhysicsEngine {
  constructor(options = {}) {
    // Configuration
    this.CURSOR_ATTRACTION_STRENGTH = options.attractionStrength || 5000;
    this.CURSOR_ATTRACTION_RANGE = options.attractionRange || 300;
    this.CURSOR_ATTRACTION_ENABLED = options.attractionEnabled !== false;

    this.WIND_SCALE = options.windScale || 100;
    this.WIND_STRENGTH = options.windStrength || 0.5;
    this.WIND_SPEED = options.windSpeed || 1.0;
    this.WIND_ENABLED = options.windEnabled !== false;

    this.PARTICLE_DAMPING = options.damping || 0.98;
    this.PARTICLE_TRAILS_ENABLED = options.trailsEnabled !== false;
    this.TRAIL_LENGTH = options.trailLength || 15;

    // State
    this.cursorPosition = { x: 0, y: 0 };
    this.cursorValid = false;
    this.time = 0;

    // Noise generator (will use SimplexNoise if available, or fallback)
    this.noiseGenerator = options.noiseGenerator || new PerlinNoiseGenerator();

    console.log('✅ PhysicsEngine initialized');
  }

  /**
   * Update cursor position (called on mousemove/touchmove)
   */
  setCursorPosition(x, y, isValid = true) {
    this.cursorPosition = { x, y };
    this.cursorValid = isValid;
  }

  /**
   * Get current cursor position
   */
  getCursorPosition() {
    return this.cursorValid ? { ...this.cursorPosition } : null;
  }

  /**
   * Main physics update - apply all forces to particles
   */
  updateParticles(particles, deltaTime = 0.016, regionBounds = null) {
    this.time += deltaTime * this.WIND_SPEED;

    particles.forEach(particle => {
      // 1. Apply cursor attraction force
      if (this.CURSOR_ATTRACTION_ENABLED && this.cursorValid) {
        this.applyAttractionForce(particle, this.cursorPosition);
      }

      // 2. Apply wind field force
      if (this.WIND_ENABLED) {
        this.applyWindForce(particle, deltaTime);
      }

      // 3. Apply velocity damping
      this.applyDamping(particle);

      // 4. Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // 5. Store trail position BEFORE clamping
      if (this.PARTICLE_TRAILS_ENABLED) {
        this.updateTrail(particle);
      }

      // 6. Clamp to bounds
      if (regionBounds) {
        this.clampToRegion(particle, regionBounds);
      }
    });
  }

  /**
   * Calculate attraction force toward cursor (inverse-square-law)
   */
  applyAttractionForce(particle, cursorPos) {
    const dx = cursorPos.x - particle.x;
    const dy = cursorPos.y - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Only apply within range
    if (distance > this.CURSOR_ATTRACTION_RANGE) {
      return;
    }

    // Inverse-square-law: F = G / (distance + 1)²
    // +1 prevents division by zero when particle overlaps cursor
    const force = this.CURSOR_ATTRACTION_STRENGTH / Math.pow(distance + 1, 2);

    // Normalize direction and apply force
    if (distance > 0) {
      const normalizedDx = dx / distance;
      const normalizedDy = dy / distance;

      particle.vx += normalizedDx * force * 0.01;
      particle.vy += normalizedDy * force * 0.01;
    }
  }

  /**
   * Generate wind force using Perlin noise
   */
  applyWindForce(particle, deltaTime) {
    // Generate wind field at particle position
    // Use different noise channels for X and Y
    const windX = this.noiseGenerator.noise(
      particle.x / this.WIND_SCALE,
      particle.y / this.WIND_SCALE,
      this.time
    ) * this.WIND_STRENGTH;

    const windY = this.noiseGenerator.noise(
      particle.x / this.WIND_SCALE,
      particle.y / this.WIND_SCALE,
      this.time + 1000
    ) * this.WIND_STRENGTH;

    // Apply wind force to velocity
    particle.vx += windX * 0.1;
    particle.vy += windY * 0.1;
  }

  /**
   * Apply velocity damping (exponential decay)
   */
  applyDamping(particle) {
    particle.vx *= this.PARTICLE_DAMPING;
    particle.vy *= this.PARTICLE_DAMPING;
  }

  /**
   * Update particle trail (store last N positions)
   */
  updateTrail(particle) {
    if (!particle.trailPositions) {
      particle.trailPositions = [];
    }

    // Add current position to trail
    particle.trailPositions.push({
      x: particle.x,
      y: particle.y,
    });

    // Keep only last N positions
    if (particle.trailPositions.length > this.TRAIL_LENGTH) {
      particle.trailPositions.shift();
    }
  }

  /**
   * Clamp particle to region bounds
   */
  clampToRegion(particle, bounds) {
    particle.x = Math.max(bounds.x, Math.min(bounds.x + bounds.w, particle.x));
    particle.y = Math.max(bounds.y, Math.min(bounds.y + bounds.h, particle.y));
  }

  /**
   * Initialize trail for a particle
   */
  initializeTrail(particle) {
    particle.trailPositions = [];
  }

  /**
   * Get trail information for rendering
   */
  getTrailData(particle) {
    if (!particle.trailPositions || particle.trailPositions.length < 2) {
      return null;
    }

    return {
      positions: [...particle.trailPositions],
      length: particle.trailPositions.length,
    };
  }

  /**
   * Reset physics for a particle
   */
  resetParticle(particle) {
    particle.vx = 0;
    particle.vy = 0;
    particle.trailPositions = [];
  }

  /**
   * Toggle attraction force
   */
  setAttractionEnabled(enabled) {
    this.CURSOR_ATTRACTION_ENABLED = enabled;
  }

  /**
   * Toggle wind field
   */
  setWindEnabled(enabled) {
    this.WIND_ENABLED = enabled;
  }

  /**
   * Toggle trail rendering
   */
  setTrailsEnabled(enabled) {
    this.PARTICLE_TRAILS_ENABLED = enabled;
  }

  /**
   * Adjust attraction strength (tuning)
   */
  setAttractionStrength(value) {
    this.CURSOR_ATTRACTION_STRENGTH = value;
  }

  /**
   * Get debug info
   */
  getDebugInfo() {
    return {
      cursorPosition: this.getCursorPosition(),
      attractionEnabled: this.CURSOR_ATTRACTION_ENABLED,
      windEnabled: this.WIND_ENABLED,
      trailsEnabled: this.PARTICLE_TRAILS_ENABLED,
      damping: this.PARTICLE_DAMPING,
      time: this.time,
    };
  }
}

/**
 * Perlin Noise Generator (Simple 2D Perlin implementation)
 * Falls back to SimplexNoise if available
 */
class PerlinNoiseGenerator {
  constructor() {
    this.permutation = this.generatePermutation();
    this.p = [...this.permutation, ...this.permutation];
  }

  generatePermutation() {
    const p = [];
    for (let i = 0; i < 256; i++) {
      p[i] = Math.floor(Math.random() * 256);
    }
    return p;
  }

  noise(x, y, z) {
    // Simplified 2D Perlin noise
    // This is a basic implementation; for production consider using SimplexNoise library

    // Get integer and fractional parts
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const zi = Math.floor(z) & 255;

    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const zf = z - Math.floor(z);

    // Fade curves (smoothstep)
    const u = this.fade(xf);
    const v = this.fade(yf);
    const w = this.fade(zf);

    // Hash coordinates
    const aaa = this.p[this.p[this.p[xi] + yi] + zi];
    const aba = this.p[this.p[this.p[xi] + this.inc(yi)] + zi];
    const aab = this.p[this.p[this.p[xi] + yi] + this.inc(zi)];
    const abb = this.p[this.p[this.p[xi] + this.inc(yi)] + this.inc(zi)];
    const baa = this.p[this.p[this.p[this.inc(xi)] + yi] + zi];
    const bba = this.p[this.p[this.p[this.inc(xi)] + this.inc(yi)] + zi];
    const bab = this.p[this.p[this.p[this.inc(xi)] + yi] + this.inc(zi)];
    const bbb = this.p[this.p[this.p[this.inc(xi)] + this.inc(yi)] + this.inc(zi)];

    // Compute dot products
    const x1 = this.grad(aaa, xf, yf, zf);
    const x2 = this.grad(baa, xf - 1, yf, zf);
    const y1 = this.lerp(x1, x2, u);

    const x3 = this.grad(aba, xf, yf - 1, zf);
    const x4 = this.grad(bba, xf - 1, yf - 1, zf);
    const y2 = this.lerp(x3, x4, u);

    const z1 = this.lerp(y1, y2, v);

    const x5 = this.grad(aab, xf, yf, zf - 1);
    const x6 = this.grad(bab, xf - 1, yf, zf - 1);
    const y3 = this.lerp(x5, x6, u);

    const x7 = this.grad(abb, xf, yf - 1, zf - 1);
    const x8 = this.grad(bbb, xf - 1, yf - 1, zf - 1);
    const y4 = this.lerp(x7, x8, u);

    const z2 = this.lerp(y3, y4, v);

    return (this.lerp(z1, z2, w) + 1) / 2;  // Normalize to 0-1
  }

  fade(t) {
    // Smoothstep: 3t² - 2t³
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  lerp(t, a, b) {
    return a + t * (b - a);
  }

  grad(hash, x, y, z) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 8 ? y : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  inc(n) {
    return (n + 1) & 255;
  }
}
