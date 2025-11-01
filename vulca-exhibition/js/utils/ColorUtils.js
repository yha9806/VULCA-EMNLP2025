/**
 * ColorUtils - Color management and persona color identities
 *
 * Week 2 Task 2.2: Color Management
 */

class ColorUtils {
  /**
   * Get persona color identity
   * Each critic has unique color scheme, primary/accent/glow colors
   */
  static getPersonaColorIdentity(personaId) {
    const identities = {
      '苏轼': {
        name: '苏轼',
        primaryColor: 0x2F2E2C,      // #2F2E2C 深灰
        accentColor: 0x8B7D6B,
        glowColor: 0xD4D2CE,
        colorScheme: 'monochromatic',
        motionPattern: 'brush_stroke',
        rgb: { r: 47, g: 46, b: 44 },
      },
      '郭熙': {
        name: '郭熙',
        primaryColor: 0x2D5016,      // #2D5016 深绿
        accentColor: 0x6B8E23,
        glowColor: 0xB4D96F,
        colorScheme: 'analogous',
        motionPattern: 'perspective_depth',
        rgb: { r: 45, g: 80, b: 22 },
      },
      '约翰罗斯金': {
        name: '约翰罗斯金',
        primaryColor: 0x6B4C9A,      // #6B4C9A 紫色
        accentColor: 0xC77DFF,
        glowColor: 0xE0AAFF,
        colorScheme: 'complementary',
        motionPattern: 'ascending_narrative',
        rgb: { r: 107, g: 76, b: 154 },
      },
      '佐拉妈妈': {
        name: '佐拉妈妈',
        primaryColor: 0x8B6F47,      // #8B6F47 棕色
        accentColor: 0xD2691E,
        glowColor: 0xF4A460,
        colorScheme: 'warm',
        motionPattern: 'circular_synchrony',
        rgb: { r: 139, g: 111, b: 71 },
      },
      '埃琳娜佩特洛娃': {
        name: '埃琳娜佩特洛娃',
        primaryColor: 0xB22234,      // #B22234 红色
        accentColor: 0xD9534F,
        glowColor: 0xF5C6C6,
        colorScheme: 'formal',
        motionPattern: 'geometric_structure',
        rgb: { r: 178, g: 34, b: 52 },
      },
      'AI伦理评审员': {
        name: 'AI伦理评审员',
        primaryColor: 0x0066CC,      // #0066CC 蓝色
        accentColor: 0x00CCFF,
        glowColor: 0x00FFFF,
        colorScheme: 'digital',
        motionPattern: 'algorithmic_fractal',
        rgb: { r: 0, g: 102, b: 204 },
      },
    };

    return identities[personaId] || identities['苏轼'];
  }

  /**
   * Convert hex color (0xRRGGBB) to RGB object
   */
  static hexToRgb(hex) {
    const r = (hex >> 16) & 255;
    const g = (hex >> 8) & 255;
    const b = hex & 255;
    return { r, g, b };
  }

  /**
   * Convert RGB to hex color
   */
  static rgbToHex(r, g, b) {
    return (r << 16) | (g << 8) | b;
  }

  /**
   * Convert HSL to RGB
   * h: 0-360, s: 0-100, l: 0-100
   */
  static hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) {
      r = c; g = x; b = 0;
    } else if (h >= 60 && h < 120) {
      r = x; g = c; b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0; g = c; b = x;
    } else if (h >= 180 && h < 240) {
      r = 0; g = x; b = c;
    } else if (h >= 240 && h < 300) {
      r = x; g = 0; b = c;
    } else if (h >= 300 && h < 360) {
      r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return { r, g, b };
  }

  /**
   * Convert RGB to HSL
   */
  static rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }

  /**
   * RGB to Hex string (#RRGGBB)
   */
  static rgbToHexString(r, g, b) {
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0').toUpperCase()}`;
  }

  /**
   * Generate color variant based on weight (0-10)
   * Higher weight = brighter/more saturated
   */
  static generateVariant(baseHex, weight) {
    const { h, s, l } = this.hexToHsl(baseHex);

    // Adjust lightness and saturation based on weight
    const newL = Math.max(20, Math.min(80, l + (weight - 5) * 4));
    const newS = Math.max(20, Math.min(100, s + (weight - 5) * 3));

    const { r, g, b } = this.hslToRgb(h, newS, newL);
    return this.rgbToHex(r, g, b);
  }

  /**
   * Convert hex to HSL
   */
  static hexToHsl(hex) {
    const { r, g, b } = this.hexToRgb(hex);
    return this.rgbToHsl(r, g, b);
  }

  /**
   * Blend two colors based on alpha
   */
  static blendColors(color1, color2, alpha) {
    const c1 = this.hexToRgb(color1);
    const c2 = this.hexToRgb(color2);

    const r = Math.round(c1.r * (1 - alpha) + c2.r * alpha);
    const g = Math.round(c1.g * (1 - alpha) + c2.g * alpha);
    const b = Math.round(c1.b * (1 - alpha) + c2.b * alpha);

    return this.rgbToHex(r, g, b);
  }

  /**
   * Get complementary color
   */
  static getComplementaryColor(hex) {
    const { h, s, l } = this.hexToHsl(hex);
    const newH = (h + 180) % 360;
    const { r, g, b } = this.hslToRgb(newH, s, l);
    return this.rgbToHex(r, g, b);
  }

  /**
   * Get analogous colors (±60 degrees)
   */
  static getAnalogousColors(hex) {
    const { h, s, l } = this.hexToHsl(hex);

    const colors = [];
    for (let offset of [-60, 0, 60]) {
      const newH = (h + offset + 360) % 360;
      const { r, g, b } = this.hslToRgb(newH, s, l);
      colors.push(this.rgbToHex(r, g, b));
    }

    return colors;
  }
}

// Make globally accessible
window.ColorUtils = ColorUtils;
