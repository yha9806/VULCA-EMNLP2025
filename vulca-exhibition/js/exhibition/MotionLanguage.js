/**
 * MotionLanguage - Define unique motion patterns for each critic
 *
 * Week 2 Task 2.3: Motion Pattern Generation
 * Each critic has a unique way of interpreting movement
 */

class MotionLanguage {
  /**
   * Get motion pattern for a critic based on their RPAIT
   */
  static getMotionPattern(criticId, rpait = {}) {
    const patterns = {
      '苏轼': this.brushStroke(rpait),
      '郭熙': this.perspectiveDepth(rpait),
      '约翰罗斯金': this.ascendingNarrative(rpait),
      '佐拉妈妈': this.circularSynchrony(rpait),
      '埃琳娜佩特洛娃': this.geometricStructure(rpait),
      'AI伦理评审员': this.algorithmicFractal(rpait),
    };

    return patterns[criticId] || patterns['苏轼'];
  }

  /**
   * 苏轼 - Brush Stroke: Flowing, organic wave motion
   */
  static brushStroke(rpait) {
    const p = rpait.P ? rpait.P / 10 : 0.5;
    return {
      name: 'brush_stroke',
      pattern: 'sinusoidal_wave',
      description: '笔触：流动的波形运动，如笔墨在纸上的自然流动',
      amplitude: 2 + p * 2,
      frequency: 0.5 + p * 0.2,
      easing: 'sine',
      directionVector: (t) => ({
        x: Math.sin(t * 0.02 * p) * (2 + p),
        y: Math.cos(t * 0.015 * p) * (2 + p),
      }),
    };
  }

  /**
   * 郭熙 - Perspective Depth: Receding planes, layered motion
   */
  static perspectiveDepth(rpait) {
    const i = rpait.I ? rpait.I / 10 : 0.5;
    return {
      name: 'perspective_depth',
      pattern: 'layered_recession',
      description: '透视：从近到远的分层运动，建立空间深度',
      depth: i * 5,
      scale: (distance) => Math.pow(0.8, distance / 100),
      easing: 'exponential',
      layerCount: 3,
    };
  }

  /**
   * 约翰罗斯金 - Ascending Narrative: Progressive upward movement
   */
  static ascendingNarrative(rpait) {
    const a = rpait.A ? rpait.A / 10 : 0.5;
    return {
      name: 'ascending_narrative',
      pattern: 'upward_spiral',
      description: '上升：进步性的向上螺旋运动，表现上升的叙述弧',
      spiralRadius: 1 + a * 2,
      spiralPitch: 0.5 + a * 0.5,
      upwardForce: 0.5 + a * 0.5,
      easing: 'cubic-out',
    };
  }

  /**
   * 佐拉妈妈 - Circular Synchrony: Synchronized circular motion
   */
  static circularSynchrony(rpait) {
    const p = rpait.P ? rpait.P / 10 : 0.5;
    return {
      name: 'circular_synchrony',
      pattern: 'circular_orbit',
      description: '圆形：多个粒子围绕中心同步旋转，表现和谐的循环',
      orbitRadius: 1.5 + p * 1.5,
      angularVelocity: 0.01 + p * 0.01,
      phase: Math.random() * Math.PI * 2,
      synchronization: 0.8 + p * 0.2,
    };
  }

  /**
   * 埃琳娜佩特洛娃 - Geometric Structure: Precise geometric patterns
   */
  static geometricStructure(rpait) {
    const t = rpait.T ? rpait.T / 10 : 0.5;
    return {
      name: 'geometric_structure',
      pattern: 'grid_lattice',
      description: '几何：严密的几何阵列，表现精确的结构美学',
      gridSize: 4 + Math.floor(t * 4),
      precision: 0.5 + t * 0.5,
      alignment: 'strict',
      spacing: 50 + t * 30,
    };
  }

  /**
   * AI伦理评审员 - Algorithmic Fractal: Self-similar recursive patterns
   */
  static algorithmicFractal(rpait) {
    const r = rpait.R ? rpait.R / 10 : 0.5;
    return {
      name: 'algorithmic_fractal',
      pattern: 'sierpinski_variation',
      description: 'AI：自相似分形运动，表现算法的优雅与复杂性',
      depth: 3 + Math.floor(r * 3),
      scaleFactor: 0.5 + r * 0.3,
      rotationAngle: (60 + r * 30) * Math.PI / 180,
      iterations: 4 + Math.floor(r * 2),
    };
  }

  /**
   * Apply motion pattern to a particle
   */
  static applyMotion(particle, pattern, time, regionBounds) {
    if (!pattern) return;

    switch (pattern.pattern) {
      case 'sinusoidal_wave':
        this.applySinusoidalMotion(particle, pattern, time);
        break;
      case 'circular_orbit':
        this.applyCircularMotion(particle, pattern, time, regionBounds);
        break;
      case 'upward_spiral':
        this.applySpiralMotion(particle, pattern, time);
        break;
      case 'grid_lattice':
        this.applyGridMotion(particle, pattern, time, regionBounds);
        break;
      case 'sierpinski_variation':
        this.applyFractalMotion(particle, pattern, time);
        break;
    }
  }

  static applySinusoidalMotion(particle, pattern, time) {
    const direction = pattern.directionVector(time);
    particle.vx += direction.x * 0.1;
    particle.vy += direction.y * 0.1;
  }

  static applyCircularMotion(particle, pattern, time, regionBounds) {
    const cx = regionBounds.w / 2;
    const cy = regionBounds.h / 2;
    const angle = time * pattern.angularVelocity + pattern.phase;
    const radius = pattern.orbitRadius * 20;

    particle.x = cx + Math.cos(angle) * radius;
    particle.y = cy + Math.sin(angle) * radius;
  }

  static applySpiralMotion(particle, pattern, time) {
    const angle = time * 0.01;
    const radius = (time % 1000) / 1000 * pattern.spiralRadius * 20;

    particle.vx = Math.cos(angle) * radius * 0.01;
    particle.vy = Math.sin(angle) * radius * 0.01 - pattern.upwardForce * 0.1;
  }

  static applyGridMotion(particle, pattern, time, regionBounds) {
    // Snap to grid
    const spacing = pattern.spacing;
    particle.x = Math.round(particle.x / spacing) * spacing;
    particle.y = Math.round(particle.y / spacing) * spacing;
  }

  static applyFractalMotion(particle, pattern, time) {
    const scale = Math.pow(pattern.scaleFactor, pattern.depth);
    const angle = pattern.rotationAngle * time * 0.001;

    particle.vx = Math.cos(angle) * scale * 0.5;
    particle.vy = Math.sin(angle) * scale * 0.5;
  }

  /**
   * Get all motion patterns
   */
  static getAllPatterns() {
    return {
      '苏轼': 'brush_stroke',
      '郭熙': 'perspective_depth',
      '约翰罗斯金': 'ascending_narrative',
      '佐拉妈妈': 'circular_synchrony',
      '埃琳娜佩特洛娃': 'geometric_structure',
      'AI伦理评审员': 'algorithmic_fractal',
    };
  }
}

// Make globally accessible
window.MotionLanguage = MotionLanguage;
