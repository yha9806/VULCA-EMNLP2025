/**
 * RPAITMapper - Maps RPAIT weights to visual properties
 *
 * Week 2 Task 2.1: RPAIT to Visuals Mapping
 */

class RPAITMapper {
  /**
   * Map RPAIT weights to visual parameters for a particle system
   */
  static mapToVisuals(rpait, criticId) {
    return {
      // R (表现力) → 粒子的视觉存在感
      particleCount: 80 + (rpait.R * 20),
      particleSize: 2 + (rpait.R * 0.8),
      luminosity: 0.5 + (rpait.R * 0.05),
      saturation: 100 + (rpait.R * 10),

      // P (哲学性) → 粒子的运动模式
      driftIntensity: 1 + (rpait.P * 0.3),
      driftFrequency: 0.5 + (rpait.P * 0.15),
      rhythmPattern: this.generateRhythm(rpait.P),
      periodicity: 2000 + (rpait.P * 500),

      // A (美学) → 粒子的颜色与视觉形式
      hue: this.generateHue(rpait.A, criticId),
      colorScheme: this.mapToPersonaColor(rpait.A, criticId),
      glowIntensity: 0.1 + (rpait.A * 0.15),
      shapeVariety: this.mapToShapeVariety(rpait.A),

      // I (解读深度) → 粒子的淡出与消散
      alphaSpeed: 5 + (rpait.I * 10),
      alphaMin: 0.05 + (rpait.I * 0.05),
      alphaMax: 0.3 + (rpait.I * 0.2),
      fadeComplexity: this.generateFadeCurve(rpait.I),

      // T (技巧) → 粒子的精确性与速度
      speed: 1.5 + (rpait.T * 0.8),
      acceleration: 0.1 + (rpait.T * 0.05),
      precision: 0.5 + (rpait.T * 0.5),
      burstOnClick: rpait.T > 6,
    };
  }

  /**
   * Generate hue based on weight and critic
   */
  static generateHue(weight, criticId) {
    const baseHues = {
      '苏轼': 0,         // 灰色基调
      '郭熙': 120,       // 绿色基调
      '约翰罗斯金': 280,  // 紫色基调
      '佐拉妈妈': 20,    // 橙色基调
      '埃琳娜佩特洛娃': 0, // 红色基调
      'AI伦理评审员': 200, // 青色基调
    };

    const baseHue = baseHues[criticId] || 0;
    const variation = (weight - 5) * 8;  // ±40度范围

    return (baseHue + variation + 360) % 360;
  }

  /**
   * Generate saturation based on weight
   */
  static generateSaturation(weight) {
    // Lower weight = less saturated, higher weight = more saturated
    return 40 + weight * 6;  // 40% - 100%
  }

  /**
   * Generate lightness based on weight
   */
  static generateLightness(weight) {
    // Lower weight = darker, higher weight = lighter
    return 35 + weight * 4;  // 35% - 75%
  }

  /**
   * Map to persona color scheme
   */
  static mapToPersonaColor(weight, criticId) {
    const colorSchemes = {
      '苏轼': 'monochromatic',
      '郭熙': 'analogous',
      '约翰罗斯金': 'complementary',
      '佐拉妈妈': 'warm',
      '埃琳娜佩特洛娃': 'formal',
      'AI伦理评审员': 'digital',
    };

    return colorSchemes[criticId] || 'monochromatic';
  }

  /**
   * Generate shape variety based on weight
   */
  static mapToShapeVariety(weight) {
    if (weight < 3) return 'circle';
    if (weight < 6) return 'mixed';
    return 'diverse';
  }

  /**
   * Generate rhythm pattern based on Philosophy weight
   */
  static generateRhythm(weight) {
    const patterns = ['steady', 'oscillating', 'pulsing', 'chaotic'];
    const index = Math.min(3, Math.floor(weight / 2.5));
    return patterns[index];
  }

  /**
   * Generate fade curve based on Interpretation weight
   */
  static generateFadeCurve(weight) {
    if (weight < 3) return 'linear';
    if (weight < 6) return 'sinusoidal';
    if (weight < 8) return 'polynomial';
    return 'complex';
  }

  /**
   * Apply visual parameters to a particle
   */
  static applyVisuals(particle, visuals) {
    particle.size = Math.max(0.5, Math.min(10, visuals.particleSize || 2));
    particle.alpha = (visuals.alphaMin || 0.1) + Math.random() * (visuals.alphaMax || 0.2);
  }

  /**
   * Create a visual update callback
   */
  static createUpdateCallback(rpait, criticId) {
    const visuals = this.mapToVisuals(rpait, criticId);

    return (particle) => {
      particle.size = visuals.particleSize;
      particle.alpha = visuals.alphaMin + Math.random() * (visuals.alphaMax - visuals.alphaMin);

      // Apply motion based on Philosophy
      const driftX = Math.sin(Date.now() * visuals.driftFrequency * 0.001) * visuals.driftIntensity;
      const driftY = Math.cos(Date.now() * visuals.driftFrequency * 0.001) * visuals.driftIntensity;

      particle.vx += driftX * 0.01;
      particle.vy += driftY * 0.01;
    };
  }

  /**
   * Get RPAIT dimension descriptions
   */
  static getDimensionDescriptions() {
    return {
      R: {
        name: 'Representation (表现力)',
        description: '艺术的视觉表现力和存在感',
        visualEffect: '粒子数量、大小、亮度',
        range: '0-10',
      },
      P: {
        name: 'Philosophy (哲学性)',
        description: '作品所包含的哲学思想深度',
        visualEffect: '运动模式和节奏',
        range: '0-10',
      },
      A: {
        name: 'Aesthetics (美学)',
        description: '美学价值和视觉形式的优雅性',
        visualEffect: '颜色、光晕、形状',
        range: '0-10',
      },
      I: {
        name: 'Interpretation (解读深度)',
        description: '评论家的解读深度和复杂性',
        visualEffect: '淡出速度和消散模式',
        range: '0-10',
      },
      T: {
        name: 'Technique (技巧)',
        description: '艺术执行的技巧和精确度',
        visualEffect: '速度、精确性、爆裂效果',
        range: '0-10',
      },
    };
  }

  /**
   * Validate RPAIT weights
   */
  static validateRPAIT(rpait) {
    const dimensions = ['R', 'P', 'A', 'I', 'T'];
    return dimensions.every(dim => {
      const value = rpait[dim];
      return typeof value === 'number' && value >= 0 && value <= 10;
    });
  }

  /**
   * Normalize RPAIT to 0-10 range
   */
  static normalizeRPAIT(rpait) {
    return {
      R: Math.max(0, Math.min(10, rpait.R || 5)),
      P: Math.max(0, Math.min(10, rpait.P || 5)),
      A: Math.max(0, Math.min(10, rpait.A || 5)),
      I: Math.max(0, Math.min(10, rpait.I || 5)),
      T: Math.max(0, Math.min(10, rpait.T || 5)),
    };
  }
}

// Make globally accessible
window.RPAITMapper = RPAITMapper;
