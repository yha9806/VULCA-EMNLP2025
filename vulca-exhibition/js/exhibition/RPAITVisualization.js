/**
 * RPAITVisualization - Handles RPAIT data visualization
 *
 * Phase 4: RPAIT Data Visualization System
 * Creates and manages radar charts, comparisons, and heatmaps
 */

class RPAITVisualization {
  constructor(options = {}) {
    this.chartManager = new ChartManager({
      canvasContainer: options.canvasContainer,
    });

    this.currentChart = null;
    this.selectedPersonas = [];
    this.selectedArtwork = null;
    this.comparisonMode = false;

    // Dimension labels and order
    this.dimensions = ['Representation', 'Philosophy', 'Aesthetics', 'Interpretation', 'Technique'];
    this.dimensionShort = ['R', 'P', 'A', 'I', 'T'];

    // Persona colors (matching ColorUtils)
    this.personaColors = {
      '苏轼': 'rgba(255, 165, 0, 1)',           // Orange
      '郭熙': 'rgba(75, 192, 192, 1)',         // Teal
      '约翰罗斯金': 'rgba(148, 0, 211, 1)',    // Purple
      '佐拉妈妈': 'rgba(255, 192, 203, 1)',    // Pink
      '埃琳娜佩特洛娃': 'rgba(255, 69, 0, 1)', // Red-Orange
      'AI伦理评审员': 'rgba(70, 130, 180, 1)', // Steel Blue
    };

    console.log('✅ RPAITVisualization initialized');
  }

  /**
   * Display single persona's RPAIT scores as radar chart
   */
  displayPersonaChart(artworkId, personaId, containerId = 'rpait-chart-container') {
    // Get RPAIT data
    const rpait = RPAITManager.getRPAIT(artworkId, personaId);
    if (!rpait) {
      console.warn(`⚠️  No RPAIT data for ${personaId} (${artworkId})`);
      return null;
    }

    // Extract values in dimension order
    const values = this.dimensionShort.map(dim => {
      const fullDim = {
        'R': 'Representation',
        'P': 'Philosophy',
        'A': 'Aesthetics',
        'I': 'Interpretation',
        'T': 'Technique',
      }[dim];
      return rpait[fullDim.charAt(0).toUpperCase()] || 5;
    });

    // Create chart
    const chartId = `${artworkId}_${personaId}_radar`;
    const borderColor = this.personaColors[personaId] || 'rgba(255, 99, 132, 1)';

    const chart = this.chartManager.createRadarChart(chartId, {
      labels: this.dimensionShort,
      values: values,
      label: personaId,
      borderColor: borderColor,
      backgroundColor: borderColor.replace('1)', '0.2)'),
    }, {
      width: 300,
      height: 300,
    });

    this.selectedPersonas = [personaId];
    this.selectedArtwork = artworkId;
    this.comparisonMode = false;

    console.log(`✅ Displayed radar chart for ${personaId} (${artworkId})`);
    return chart;
  }

  /**
   * Display comparison of multiple personas
   */
  displayComparisonChart(artworkId, personaIds, containerId = 'rpait-chart-container') {
    if (personaIds.length < 2) {
      console.warn('⚠️  Need at least 2 personas for comparison');
      return null;
    }

    if (personaIds.length > 4) {
      console.warn('⚠️  Maximum 4 personas for comparison');
      personaIds = personaIds.slice(0, 4);
    }

    // Prepare datasets for each persona
    const datasets = personaIds.map(personaId => {
      const rpait = RPAITManager.getRPAIT(artworkId, personaId);
      if (!rpait) return null;

      const values = this.dimensionShort.map(dim => {
        const fullDim = {
          'R': 'Representation',
          'P': 'Philosophy',
          'A': 'Aesthetics',
          'I': 'Interpretation',
          'T': 'Technique',
        }[dim];
        return rpait[fullDim.charAt(0).toUpperCase()] || 5;
      });

      const borderColor = this.personaColors[personaId] || 'rgba(255, 99, 132, 1)';

      return {
        label: personaId,
        values: values,
        borderColor: borderColor,
      };
    }).filter(d => d !== null);

    if (datasets.length === 0) {
      console.error('❌ No valid RPAIT data found');
      return null;
    }

    // Create comparison chart
    const chartId = `${artworkId}_comparison_radar`;
    const chart = this.chartManager.createComparisonRadarChart(
      chartId,
      datasets,
      this.dimensionShort,
      { width: 400, height: 400 }
    );

    this.selectedPersonas = personaIds;
    this.selectedArtwork = artworkId;
    this.comparisonMode = true;

    console.log(`✅ Displayed comparison chart for ${personaIds.join(', ')} (${artworkId})`);
    return chart;
  }

  /**
   * Calculate difference between two personas
   */
  calculateDifference(artworkId, persona1Id, persona2Id) {
    const rpait1 = RPAITManager.getRPAIT(artworkId, persona1Id);
    const rpait2 = RPAITManager.getRPAIT(artworkId, persona2Id);

    if (!rpait1 || !rpait2) {
      console.warn('⚠️  RPAIT data not found');
      return null;
    }

    const differences = {};
    this.dimensionShort.forEach(dim => {
      const fullDim = {
        'R': 'Representation',
        'P': 'Philosophy',
        'A': 'Aesthetics',
        'I': 'Interpretation',
        'T': 'Technique',
      }[dim];
      const key = fullDim.charAt(0).toUpperCase();
      differences[dim] = (rpait2[key] || 5) - (rpait1[key] || 5);
    });

    return differences;
  }

  /**
   * Get heatmap data for all personas on one artwork
   */
  getHeatmapData(artworkId) {
    const personaIds = RPAITManager.getAllCriticIds();
    const heatmapData = [];

    personaIds.forEach(personaId => {
      const rpait = RPAITManager.getRPAIT(artworkId, personaId);
      if (!rpait) return;

      const row = {
        persona: personaId,
        scores: {
          R: rpait.Representation || 5,
          P: rpait.Philosophy || 5,
          A: rpait.Aesthetics || 5,
          I: rpait.Interpretation || 5,
          T: rpait.Technique || 5,
        },
      };
      heatmapData.push(row);
    });

    return heatmapData;
  }

  /**
   * Generate HTML table for heatmap
   */
  generateHeatmapHTML(artworkId, containerId) {
    const data = this.getHeatmapData(artworkId);
    if (data.length === 0) {
      console.warn('⚠️  No heatmap data found');
      return '';
    }

    // Generate table HTML
    let html = '<table class="heatmap-table" style="border-collapse: collapse; width: 100%;">';

    // Header row
    html += '<tr style="background: #f5f5f5;">';
    html += '<th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Persona</th>';
    this.dimensionShort.forEach(dim => {
      html += `<th style="padding: 8px; border: 1px solid #ddd; text-align: center;">${dim}</th>`;
    });
    html += '</tr>';

    // Data rows
    data.forEach(row => {
      html += '<tr>';
      html += `<td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">${row.persona}</td>`;

      this.dimensionShort.forEach(dim => {
        const score = row.scores[dim];
        const intensity = score / 10; // 0-1
        const color = this.getHeatmapColor(intensity);
        html += `<td style="padding: 8px; border: 1px solid #ddd; background: ${color}; text-align: center;">${score}</td>`;
      });
      html += '</tr>';
    });

    html += '</table>';
    return html;
  }

  /**
   * Get color for heatmap based on intensity (0-1)
   */
  getHeatmapColor(intensity) {
    // White (0) to Dark Red (1)
    const r = Math.floor(255);
    const g = Math.floor(255 * (1 - intensity));
    const b = Math.floor(255 * (1 - intensity));
    return `rgb(${r}, ${g}, ${b})`;
  }

  /**
   * Get debug info
   */
  getDebugInfo() {
    return {
      selectedArtwork: this.selectedArtwork,
      selectedPersonas: this.selectedPersonas,
      comparisonMode: this.comparisonMode,
      chartsInfo: this.chartManager.getDebugInfo(),
    };
  }

  /**
   * Destroy all charts
   */
  destroy() {
    this.chartManager.destroyAll();
    this.selectedPersonas = [];
    this.selectedArtwork = null;
    console.log('🗑️  RPAITVisualization destroyed');
  }
}

// Make globally accessible
window.RPAITVisualization = RPAITVisualization;
