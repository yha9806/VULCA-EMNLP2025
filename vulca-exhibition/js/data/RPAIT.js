/**
 * RPAIT Data - Representation, Philosophy, Aesthetics, Interpretation, Technique
 *
 * Week 1 Task 1.4: RPAIT Data Structure
 * Contains RPAIT weights (0-10) for each artwork × each critic combination
 */

const RPAITData = {
  artwork_1: {
    name: 'Artwork 1',
    title: '书法中的光影',
    year: 2024,
    material: '数字墨水，光敏纸',
    critics: {
      '苏轼': {
        R: 7,  // Representation (表现力)
        P: 9,  // Philosophy (哲学性)
        A: 8,  // Aesthetics (美学)
        I: 8,  // Interpretation (解读深度)
        T: 7,  // Technique (技巧)
      },
      '郭熙': {
        R: 8,
        P: 7,
        A: 9,
        I: 7,
        T: 8,
      },
      '约翰罗斯金': {
        R: 6,
        P: 8,
        A: 8,
        I: 9,
        T: 6,
      },
      '佐拉妈妈': {
        R: 7,
        P: 6,
        A: 7,
        I: 8,
        T: 7,
      },
      '埃琳娜佩特洛娃': {
        R: 9,
        P: 7,
        A: 9,
        I: 6,
        T: 9,
      },
      'AI伦理评审员': {
        R: 7,
        P: 8,
        A: 7,
        I: 8,
        T: 8,
      },
    },
  },
  artwork_2: {
    name: 'Artwork 2',
    title: '机械舞蹈',
    year: 2023,
    material: '机械臂，LED投影',
    critics: {
      '苏轼': {
        R: 8,
        P: 8,
        A: 7,
        I: 8,
        T: 9,
      },
      '郭熙': {
        R: 6,
        P: 9,
        A: 8,
        I: 8,
        T: 7,
      },
      '约翰罗斯金': {
        R: 7,
        P: 7,
        A: 6,
        I: 7,
        T: 8,
      },
      '佐拉妈妈': {
        R: 8,
        P: 7,
        A: 8,
        I: 7,
        T: 8,
      },
      '埃琳娜佩特洛娃': {
        R: 8,
        P: 6,
        A: 7,
        I: 7,
        T: 8,
      },
      'AI伦理评审员': {
        R: 9,
        P: 8,
        A: 8,
        I: 9,
        T: 9,
      },
    },
  },
  artwork_3: {
    name: 'Artwork 3',
    title: '水墨与数据的对话',
    year: 2023,
    material: '水墨，3D扫描数据',
    critics: {
      '苏轼': {
        R: 9,
        P: 9,
        A: 9,
        I: 8,
        T: 8,
      },
      '郭熙': {
        R: 9,
        P: 8,
        A: 9,
        I: 8,
        T: 7,
      },
      '约翰罗斯金': {
        R: 8,
        P: 9,
        A: 9,
        I: 8,
        T: 7,
      },
      '佐拉妈妈': {
        R: 7,
        P: 8,
        A: 8,
        I: 9,
        T: 8,
      },
      '埃琳娜佩特洛娃': {
        R: 8,
        P: 8,
        A: 8,
        I: 8,
        T: 8,
      },
      'AI伦理评审员': {
        R: 8,
        P: 7,
        A: 7,
        I: 7,
        T: 7,
      },
    },
  },
  artwork_4: {
    name: 'Artwork 4',
    title: '光线的诗学',
    year: 2024,
    material: '激光投影，镜面',
    critics: {
      '苏轼': {
        R: 6,
        P: 9,
        A: 9,
        I: 9,
        T: 6,
      },
      '郭熙': {
        R: 7,
        P: 8,
        A: 9,
        I: 8,
        T: 6,
      },
      '约翰罗斯金': {
        R: 9,
        P: 9,
        A: 9,
        I: 9,
        T: 8,
      },
      '佐拉妈妈': {
        R: 6,
        P: 7,
        A: 8,
        I: 8,
        T: 6,
      },
      '埃琳娜佩特洛娃': {
        R: 7,
        P: 8,
        A: 9,
        I: 8,
        T: 7,
      },
      'AI伦理评审员': {
        R: 6,
        P: 7,
        A: 7,
        I: 7,
        T: 6,
      },
    },
  },
};

/**
 * Utility functions for RPAIT data access
 */
class RPAITManager {
  /**
   * Get RPAIT weights for a specific artwork and critic
   */
  static getRPAIT(artworkId, criticId) {
    const artwork = RPAITData[artworkId];
    if (!artwork) return null;

    const rpait = artwork.critics[criticId];
    if (!rpait) return null;

    return {
      R: rpait.R,
      P: rpait.P,
      A: rpait.A,
      I: rpait.I,
      T: rpait.T,
    };
  }

  /**
   * Get all RPAIT data for an artwork
   */
  static getArtworkData(artworkId) {
    return RPAITData[artworkId] || null;
  }

  /**
   * Get all critics' RPAIT for an artwork
   */
  static getCriticsForArtwork(artworkId) {
    const artwork = RPAITData[artworkId];
    if (!artwork) return null;

    return artwork.critics;
  }

  /**
   * Calculate average RPAIT across all critics for an artwork
   */
  static getAverageRPAIT(artworkId) {
    const artwork = RPAITData[artworkId];
    if (!artwork) return null;

    const critics = Object.values(artwork.critics);
    const sum = { R: 0, P: 0, A: 0, I: 0, T: 0 };

    critics.forEach(rpait => {
      sum.R += rpait.R;
      sum.P += rpait.P;
      sum.A += rpait.A;
      sum.I += rpait.I;
      sum.T += rpait.T;
    });

    const count = critics.length;
    return {
      R: Math.round(sum.R / count),
      P: Math.round(sum.P / count),
      A: Math.round(sum.A / count),
      I: Math.round(sum.I / count),
      T: Math.round(sum.T / count),
    };
  }

  /**
   * Get all artwork IDs
   */
  static getAllArtworkIds() {
    return Object.keys(RPAITData);
  }

  /**
   * Get all critic IDs
   */
  static getAllCriticIds() {
    const critics = new Set();
    Object.values(RPAITData).forEach(artwork => {
      Object.keys(artwork.critics).forEach(criticId => {
        critics.add(criticId);
      });
    });
    return Array.from(critics);
  }
}

// Make globally accessible
window.RPAITData = RPAITData;
window.RPAITManager = RPAITManager;
