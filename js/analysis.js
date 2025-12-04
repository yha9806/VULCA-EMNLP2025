/**
 * VULCA Analysis Module
 * Version 1.0
 *
 * Provides analytical functions for RPAIT data visualization
 * Ported from src/analyze.py for client-side computation
 */

window.VULCA_ANALYSIS = {
  // Cache for computed results
  cache: {
    similarityMatrix: null,
    artworkProfiles: null
  },

  /**
   * Initialize the analysis module
   * Pre-computes similarity matrices and artwork profiles
   */
  init() {
    if (!window.VULCA_DATA) {
      console.error('❌ VULCA_DATA not loaded. Cannot initialize analysis module.');
      return;
    }

    try {
      this.cache.similarityMatrix = this.buildSimilarityMatrix();
      this.cache.artworkProfiles = this.buildArtworkProfiles();
      console.log('✓ Analysis module initialized');
      console.log(`  - Similarity matrix: ${Object.keys(this.cache.similarityMatrix).length} personas`);
      console.log(`  - Artwork profiles: ${Object.keys(this.cache.artworkProfiles).length} artworks`);
    } catch (error) {
      console.error('❌ Analysis initialization failed:', error);
    }
  },

  /**
   * Calculate cosine similarity between two RPAIT vectors
   *
   * @param {Object} rpait1 - First RPAIT object with R, P, A, I, T properties (numbers 0-10)
   * @param {Object} rpait2 - Second RPAIT object
   * @returns {number} Similarity score in range [0, 1], where 1 = identical
   *
   * @example
   * const similarity = rpaitCosineSimilarity(
   *   { R: 7, P: 9, A: 8, I: 8, T: 7 },
   *   { R: 8, P: 7, A: 8, I: 7, T: 8 }
   * );
   * console.log(similarity);  // ~0.92
   */
  rpaitCosineSimilarity(rpait1, rpait2) {
    const v1 = [rpait1.R, rpait1.P, rpait1.A, rpait1.I, rpait1.T];
    const v2 = [rpait2.R, rpait2.P, rpait2.A, rpait2.I, rpait2.T];

    // Dot product
    const dot = v1.reduce((sum, val, i) => sum + val * v2[i], 0);

    // Magnitudes
    const mag1 = Math.sqrt(v1.reduce((sum, val) => sum + val * val, 0));
    const mag2 = Math.sqrt(v2.reduce((sum, val) => sum + val * val, 0));

    // Cosine similarity
    if (mag1 === 0 || mag2 === 0) return 0;
    return dot / (mag1 * mag2);
  },

  /**
   * Get persona's average RPAIT scores across all artworks
   *
   * @param {string} personaId - Persona ID (e.g., "su-shi")
   * @returns {Object|null} RPAIT object with R, P, A, I, T averages, or null if not found
   */
  getPersonaAverageRPAIT(personaId) {
    const persona = window.VULCA_DATA.personas.find(p => p.id === personaId);
    if (!persona) {
      console.warn(`⚠ Persona not found: ${personaId}`);
      return null;
    }

    // Return pre-computed average from data.js
    if (persona.rpait) {
      return persona.rpait;
    }

    // Fallback: compute from critiques
    const critiques = window.VULCA_DATA.critiques.filter(c => c.personaId === personaId);
    if (critiques.length === 0) {
      console.warn(`⚠ No critiques found for persona: ${personaId}`);
      return null;
    }

    const sum = { R: 0, P: 0, A: 0, I: 0, T: 0 };
    critiques.forEach(critique => {
      sum.R += critique.rpait.R;
      sum.P += critique.rpait.P;
      sum.A += critique.rpait.A;
      sum.I += critique.rpait.I;
      sum.T += critique.rpait.T;
    });

    const count = critiques.length;
    return {
      R: Math.round(sum.R / count),
      P: Math.round(sum.P / count),
      A: Math.round(sum.A / count),
      I: Math.round(sum.I / count),
      T: Math.round(sum.T / count)
    };
  },

  /**
   * Get artwork's RPAIT profile (average across all persona critiques)
   *
   * @param {string} artworkId - Artwork ID (e.g., "artwork-1")
   * @returns {Object|null} RPAIT object with R, P, A, I, T averages
   */
  getArtworkRPAITProfile(artworkId) {
    const critiques = window.VULCA_DATA.critiques.filter(c => c.artworkId === artworkId);
    if (critiques.length === 0) {
      console.warn(`⚠ No critiques found for artwork: ${artworkId}`);
      return null;
    }

    const sum = { R: 0, P: 0, A: 0, I: 0, T: 0 };
    critiques.forEach(critique => {
      sum.R += critique.rpait.R;
      sum.P += critique.rpait.P;
      sum.A += critique.rpait.A;
      sum.I += critique.rpait.I;
      sum.T += critique.rpait.T;
    });

    const count = critiques.length;
    return {
      R: (sum.R / count).toFixed(1),
      P: (sum.P / count).toFixed(1),
      A: (sum.A / count).toFixed(1),
      I: (sum.I / count).toFixed(1),
      T: (sum.T / count).toFixed(1)
    };
  },

  /**
   * Get persona's RPAIT scores for a specific artwork
   *
   * @param {string} personaId - Persona ID
   * @param {string} artworkId - Artwork ID
   * @returns {Object|null} RPAIT object or null if not found
   */
  getPersonaArtworkRPAIT(personaId, artworkId) {
    const critique = window.VULCA_DATA.critiques.find(
      c => c.personaId === personaId && c.artworkId === artworkId
    );

    if (!critique) {
      console.warn(`⚠ No critique found for ${personaId} → ${artworkId}`);
      return null;
    }

    return critique.rpait;
  },

  /**
   * Build 6×6 similarity matrix for all personas
   * Uses RPAIT-based cosine similarity
   *
   * @returns {Object} Nested object: personaId1 → personaId2 → similarity (0-1)
   */
  buildSimilarityMatrix() {
    const matrix = {};
    const personas = window.VULCA_DATA.personas;

    personas.forEach(persona1 => {
      matrix[persona1.id] = {};

      personas.forEach(persona2 => {
        const rpait1 = this.getPersonaAverageRPAIT(persona1.id);
        const rpait2 = this.getPersonaAverageRPAIT(persona2.id);

        if (rpait1 && rpait2) {
          matrix[persona1.id][persona2.id] = this.rpaitCosineSimilarity(rpait1, rpait2);
        } else {
          matrix[persona1.id][persona2.id] = 0;
        }
      });
    });

    return matrix;
  },

  /**
   * Build RPAIT profiles for all artworks
   *
   * @returns {Object} Object mapping artworkId → RPAIT average
   */
  buildArtworkProfiles() {
    const profiles = {};
    const artworks = window.VULCA_DATA.artworks;

    artworks.forEach(artwork => {
      profiles[artwork.id] = this.getArtworkRPAITProfile(artwork.id);
    });

    return profiles;
  },

  /**
   * Get similarity matrix (cached)
   *
   * @returns {Object} Persona similarity matrix
   */
  getSimilarityMatrix() {
    if (!this.cache.similarityMatrix) {
      this.cache.similarityMatrix = this.buildSimilarityMatrix();
    }
    return this.cache.similarityMatrix;
  },

  /**
   * Get artwork profiles (cached)
   *
   * @returns {Object} Artwork RPAIT profiles
   */
  getArtworkProfiles() {
    if (!this.cache.artworkProfiles) {
      this.cache.artworkProfiles = this.buildArtworkProfiles();
    }
    return this.cache.artworkProfiles;
  },

  /**
   * Calculate RPAIT distance (inverse of similarity)
   *
   * @param {Object} rpait1 - First RPAIT object
   * @param {Object} rpait2 - Second RPAIT object
   * @returns {number} Distance in range [0, 1], where 0 = identical
   */
  rpaitDistance(rpait1, rpait2) {
    return 1 - this.rpaitCosineSimilarity(rpait1, rpait2);
  },

  /**
   * Get all personas sorted by similarity to a given persona
   *
   * @param {string} personaId - Reference persona ID
   * @returns {Array} Array of {id, nameZh, nameEn, similarity} sorted by similarity (desc)
   */
  getPersonasSortedBySimilarity(personaId) {
    const matrix = this.getSimilarityMatrix();
    const personas = window.VULCA_DATA.personas;

    if (!matrix[personaId]) {
      console.warn(`⚠ No similarity data for persona: ${personaId}`);
      return [];
    }

    return personas
      .map(p => ({
        id: p.id,
        nameZh: p.nameZh,
        nameEn: p.nameEn,
        color: p.color,
        similarity: matrix[personaId][p.id]
      }))
      .sort((a, b) => b.similarity - a.similarity);
  }
};

// Auto-initialize when data is ready
function initWhenReady() {
  // If data already loaded, initialize immediately
  if (window.VULCA_DATA && window.VULCA_DATA.artworks) {
    window.VULCA_ANALYSIS.init();
  } else {
    // Wait for data-ready event
    document.addEventListener('vulca-data-ready', () => {
      window.VULCA_ANALYSIS.init();
    }, { once: true });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWhenReady);
} else {
  initWhenReady();
}
