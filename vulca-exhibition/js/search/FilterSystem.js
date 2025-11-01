/**
 * FilterSystem - Multi-dimension filtering for critiques
 *
 * Phase 5 Task 5.2: Multi-Dimension Filtering System
 * Provides filtering by persona, artwork, RPAIT dimensions, and score ranges
 */

class FilterSystem {
  constructor(options = {}) {
    this.critiques = []; // All available critiques
    this.filteredResults = []; // Currently filtered results

    // Active filters
    this.filters = {
      personas: [], // Selected persona IDs (OR logic)
      artworks: [], // Selected artwork IDs (OR logic)
      rpaitDimension: null, // Single RPAIT dimension (R, P, A, I, T)
      rpaitMinScore: 0, // Min RPAIT score (0-10)
      rpaitMaxScore: 10, // Max RPAIT score (0-10)
      combinationLogic: 'AND', // AND: all filters must match, OR: any filter
    };

    // Available dimensions
    this.rpaitDimensions = [
      { key: 'R', label: 'Representation', fullName: 'Representation' },
      { key: 'P', label: 'Philosophy', fullName: 'Philosophy' },
      { key: 'A', label: 'Aesthetics', fullName: 'Aesthetics' },
      { key: 'I', label: 'Interpretation', fullName: 'Interpretation' },
      { key: 'T', label: 'Technique', fullName: 'Technique' },
    ];

    console.log('✅ FilterSystem initialized');
  }

  /**
   * Set critiques to filter
   */
  setCritiques(critiques) {
    this.critiques = critiques;
    console.log(`✅ FilterSystem loaded ${critiques.length} critiques`);
  }

  /**
   * Add persona to filter
   */
  addPersonaFilter(personaId) {
    if (!this.filters.personas.includes(personaId)) {
      this.filters.personas.push(personaId);
      this.applyFilters();
    }
  }

  /**
   * Remove persona from filter
   */
  removePersonaFilter(personaId) {
    const index = this.filters.personas.indexOf(personaId);
    if (index > -1) {
      this.filters.personas.splice(index, 1);
      this.applyFilters();
    }
  }

  /**
   * Clear all persona filters
   */
  clearPersonaFilters() {
    this.filters.personas = [];
    this.applyFilters();
  }

  /**
   * Add artwork to filter
   */
  addArtworkFilter(artworkId) {
    if (!this.filters.artworks.includes(artworkId)) {
      this.filters.artworks.push(artworkId);
      this.applyFilters();
    }
  }

  /**
   * Remove artwork from filter
   */
  removeArtworkFilter(artworkId) {
    const index = this.filters.artworks.indexOf(artworkId);
    if (index > -1) {
      this.filters.artworks.splice(index, 1);
      this.applyFilters();
    }
  }

  /**
   * Clear all artwork filters
   */
  clearArtworkFilters() {
    this.filters.artworks = [];
    this.applyFilters();
  }

  /**
   * Set RPAIT dimension filter
   */
  setRPAITDimension(dimension) {
    // Validate dimension
    if (dimension && !['R', 'P', 'A', 'I', 'T'].includes(dimension)) {
      console.warn(`⚠️  Invalid RPAIT dimension: ${dimension}`);
      return;
    }

    this.filters.rpaitDimension = dimension;
    this.applyFilters();
  }

  /**
   * Set RPAIT score range
   */
  setRPAITScoreRange(minScore, maxScore) {
    // Validate and clamp scores
    this.filters.rpaitMinScore = Math.max(0, Math.min(10, minScore || 0));
    this.filters.rpaitMaxScore = Math.max(0, Math.min(10, maxScore || 10));

    // Ensure min <= max
    if (this.filters.rpaitMinScore > this.filters.rpaitMaxScore) {
      [this.filters.rpaitMinScore, this.filters.rpaitMaxScore] = [
        this.filters.rpaitMaxScore,
        this.filters.rpaitMinScore,
      ];
    }

    this.applyFilters();
  }

  /**
   * Set combination logic (AND or OR)
   */
  setCombinationLogic(logic) {
    if (['AND', 'OR'].includes(logic)) {
      this.filters.combinationLogic = logic;
      this.applyFilters();
    }
  }

  /**
   * Check if critique matches persona filter
   */
  matchesPersonaFilter(critique) {
    // If no persona filters, all match
    if (this.filters.personas.length === 0) {
      return true;
    }

    // Match if critique's persona is in filter list (OR logic)
    return this.filters.personas.includes(critique.personaId);
  }

  /**
   * Check if critique matches artwork filter
   */
  matchesArtworkFilter(critique) {
    // If no artwork filters, all match
    if (this.filters.artworks.length === 0) {
      return true;
    }

    // Match if critique's artwork is in filter list (OR logic)
    return this.filters.artworks.includes(critique.artworkId);
  }

  /**
   * Check if critique matches RPAIT dimension filter
   */
  matchesRPAITFilter(critique) {
    // If no dimension filter, all match
    if (!this.filters.rpaitDimension) {
      return true;
    }

    // Get RPAIT data for this critique
    const rpait = RPAITManager.getRPAIT(critique.artworkId, critique.personaId);
    if (!rpait) {
      return false;
    }

    // Get dimension value
    const dimensionMap = {
      'R': rpait.R,
      'P': rpait.P,
      'A': rpait.A,
      'I': rpait.I,
      'T': rpait.T,
    };

    const score = dimensionMap[this.filters.rpaitDimension];
    if (score === undefined) {
      return false;
    }

    // Check if score is within range
    return (
      score >= this.filters.rpaitMinScore &&
      score <= this.filters.rpaitMaxScore
    );
  }

  /**
   * Apply all filters to critiques
   */
  applyFilters() {
    if (this.critiques.length === 0) {
      this.filteredResults = [];
      return;
    }

    // Check if any filters are active
    const hasPersonaFilter = this.filters.personas.length > 0;
    const hasArtworkFilter = this.filters.artworks.length > 0;
    const hasRPAITFilter = this.filters.rpaitDimension !== null;

    // If no filters active, return all critiques
    if (!hasPersonaFilter && !hasArtworkFilter && !hasRPAITFilter) {
      this.filteredResults = this.critiques.map((c, idx) => ({
        critique: c,
        index: idx,
      }));
      return;
    }

    // Apply filters based on combination logic
    this.filteredResults = this.critiques
      .map((critique, index) => {
        const personaMatch = this.matchesPersonaFilter(critique);
        const artworkMatch = this.matchesArtworkFilter(critique);
        const rpaitMatch = this.matchesRPAITFilter(critique);

        let matches;
        if (this.filters.combinationLogic === 'AND') {
          // All filters must match
          matches = personaMatch && artworkMatch && rpaitMatch;
        } else {
          // ANY filter must match
          matches = personaMatch || artworkMatch || rpaitMatch;
        }

        return { critique, index, matches };
      })
      .filter((item) => item.matches)
      .map((item) => ({ critique: item.critique, index: item.index }));

    console.log(`✅ Filters applied: ${this.filteredResults.length} / ${this.critiques.length} results`);
  }

  /**
   * Get filtered results
   */
  getFilteredResults() {
    return this.filteredResults;
  }

  /**
   * Get all active filters
   */
  getActiveFilters() {
    return {
      personas: this.filters.personas,
      artworks: this.filters.artworks,
      rpaitDimension: this.filters.rpaitDimension,
      rpaitMinScore: this.filters.rpaitMinScore,
      rpaitMaxScore: this.filters.rpaitMaxScore,
      combinationLogic: this.filters.combinationLogic,
    };
  }

  /**
   * Get filter summary text
   */
  getFilterSummary() {
    const parts = [];

    if (this.filters.personas.length > 0) {
      parts.push(`评论家: ${this.filters.personas.join(', ')}`);
    }

    if (this.filters.artworks.length > 0) {
      parts.push(`作品: ${this.filters.artworks.join(', ')}`);
    }

    if (this.filters.rpaitDimension) {
      const dimLabel = this.rpaitDimensions.find(
        (d) => d.key === this.filters.rpaitDimension
      )?.label;
      parts.push(
        `${dimLabel}: ${this.filters.rpaitMinScore}-${this.filters.rpaitMaxScore}`
      );
    }

    return parts.length > 0 ? parts.join(' | ') : '无筛选条件';
  }

  /**
   * Reset all filters
   */
  resetFilters() {
    this.filters = {
      personas: [],
      artworks: [],
      rpaitDimension: null,
      rpaitMinScore: 0,
      rpaitMaxScore: 10,
      combinationLogic: 'AND',
    };

    this.applyFilters();
    console.log('✅ Filters reset');
  }

  /**
   * Get available personas from critiques
   */
  getAvailablePersonas() {
    const personas = new Set();
    this.critiques.forEach((c) => personas.add(c.personaId));
    return Array.from(personas).sort();
  }

  /**
   * Get available artworks from critiques
   */
  getAvailableArtworks() {
    const artworks = new Set();
    this.critiques.forEach((c) => artworks.add(c.artworkId));
    return Array.from(artworks).sort();
  }

  /**
   * Get RPAIT dimension list
   */
  getRPAITDimensions() {
    return this.rpaitDimensions;
  }

  /**
   * Get stats about filters
   */
  getStats() {
    return {
      totalCritiques: this.critiques.length,
      filteredCritiques: this.filteredResults.length,
      activePersonaFilters: this.filters.personas.length,
      activeArtworkFilters: this.filters.artworks.length,
      hasRPAITFilter: this.filters.rpaitDimension !== null,
    };
  }
}

// Make globally accessible
window.FilterSystem = FilterSystem;
