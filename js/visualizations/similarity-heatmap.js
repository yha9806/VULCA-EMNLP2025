/**
 * Similarity Heatmap Visualization
 * Version 1.0
 *
 * Displays 6×6 heatmap showing RPAIT-based similarity between personas
 */

(function() {
  'use strict';

  /**
   * Initialize the similarity heatmap
   */
  function initHeatmap() {
    const container = document.getElementById('similarity-heatmap');
    if (!container) {
      console.error('❌ Heatmap container not found');
      return;
    }

    renderHeatmap();
    console.log('✓ Similarity heatmap initialized');
  }

  /**
   * Render the heatmap grid
   */
  function renderHeatmap() {
    const container = document.getElementById('similarity-heatmap');
    if (!container) return;

    const personas = window.VULCA_DATA.personas;
    const matrix = window.VULCA_ANALYSIS.getSimilarityMatrix();

    container.innerHTML = '';

    personas.forEach(persona1 => {
      personas.forEach(persona2 => {
        const similarity = matrix[persona1.id][persona2.id];
        const cell = createHeatmapCell(persona1, persona2, similarity);
        container.appendChild(cell);
      });
    });
  }

  /**
   * Create a single heatmap cell
   */
  function createHeatmapCell(persona1, persona2, similarity) {
    const cell = document.createElement('div');
    cell.className = 'heatmap-cell';
    cell.textContent = similarity.toFixed(2);

    // Color based on similarity
    const color = getHeatmapColor(similarity);
    cell.style.backgroundColor = color;

    // Tooltip
    const label = getSimilarityLabel(similarity);
    cell.title = `${persona1.nameEn} ↔ ${persona2.nameEn}: ${similarity.toFixed(2)} (${label})`;

    // ARIA
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', cell.title);

    return cell;
  }

  /**
   * Get color for similarity value
   */
  function getHeatmapColor(similarity) {
    if (similarity >= 0.9) {
      return 'hsl(120, 70%, 75%)';  // Green - high similarity
    } else if (similarity >= 0.7) {
      return 'hsl(60, 70%, 75%)';   // Yellow-green - medium-high
    } else if (similarity >= 0.5) {
      return 'hsl(40, 70%, 75%)';   // Orange - medium
    } else {
      return 'hsl(0, 70%, 75%)';    // Red - low similarity
    }
  }

  /**
   * Get text label for similarity value
   */
  function getSimilarityLabel(similarity) {
    if (similarity >= 0.9) return 'Very High similarity';
    if (similarity >= 0.7) return 'High similarity';
    if (similarity >= 0.5) return 'Medium similarity';
    return 'Low similarity';
  }

  /**
   * Handle visualization update event
   */
  function handleVisualizationUpdate(e) {
    // Heatmap doesn't change with artwork (it's based on overall persona similarity)
    // But we could highlight certain cells if needed in the future
  }

  /**
   * Initialize event listeners
   */
  function initEventListeners() {
    window.addEventListener('visualization:update', handleVisualizationUpdate);
    console.log('✓ Heatmap event listeners initialized');
  }

  /**
   * Main initialization
   */
  function init() {
    if (!window.VULCA_DATA || !window.VULCA_ANALYSIS) {
      console.error('❌ VULCA_DATA or VULCA_ANALYSIS not loaded');
      return;
    }

    initHeatmap();
    initEventListeners();
  }

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.SimilarityHeatmap = {
    update: renderHeatmap
  };
})();
