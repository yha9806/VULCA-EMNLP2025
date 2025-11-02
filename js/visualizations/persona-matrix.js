/**
 * Persona Comparison Matrix
 * Version 1.0
 *
 * Displays horizontal bar chart comparing personas across RPAIT dimensions
 */

(function() {
  'use strict';

  let matrixChart = null;
  let currentDimension = 'all';  // 'all', 'R', 'P', 'A', 'I', 'T'
  let currentArtworkId = 'artwork-1';

  /**
   * Initialize the comparison matrix chart
   */
  function initMatrixChart() {
    const canvas = document.getElementById('persona-matrix-chart');
    if (!canvas) {
      console.error('❌ Matrix chart canvas not found');
      return;
    }

    const ctx = canvas.getContext('2d');
    const data = getChartData();

    matrixChart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        indexAxis: 'y',  // Horizontal bars
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.5,
        scales: {
          x: {
            min: 0,
            max: 10,
            ticks: {
              stepSize: 2,
              font: { size: 12 }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          y: {
            ticks: {
              font: { size: 12 }
            },
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { size: 12 },
              usePointStyle: true,
              padding: 10
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.parsed.x}/10`;
              }
            }
          }
        },
        animation: {
          duration: 200
        }
      }
    });

    console.log('✓ Persona matrix chart initialized');
  }

  /**
   * Get chart data based on current dimension filter
   */
  function getChartData() {
    const personas = window.VULCA_DATA.personas;
    const labels = personas.map(p => p.nameZh);

    if (currentDimension === 'all') {
      // Show all 5 dimensions
      const datasets = [
        {
          label: 'Representation (R)',
          data: personas.map(p => getRPAITScore(p.id, 'R')),
          backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--rpait-r').trim()
        },
        {
          label: 'Philosophy (P)',
          data: personas.map(p => getRPAITScore(p.id, 'P')),
          backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--rpait-p').trim()
        },
        {
          label: 'Aesthetic (A)',
          data: personas.map(p => getRPAITScore(p.id, 'A')),
          backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--rpait-a').trim()
        },
        {
          label: 'Identity (I)',
          data: personas.map(p => getRPAITScore(p.id, 'I')),
          backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--rpait-i').trim()
        },
        {
          label: 'Tradition (T)',
          data: personas.map(p => getRPAITScore(p.id, 'T')),
          backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--rpait-t').trim()
        }
      ];
      return { labels, datasets };
    } else {
      // Show single dimension
      const dimensionNames = {
        R: 'Representation',
        P: 'Philosophy',
        A: 'Aesthetic',
        I: 'Identity',
        T: 'Tradition'
      };

      const datasets = [{
        label: dimensionNames[currentDimension],
        data: personas.map(p => getRPAITScore(p.id, currentDimension)),
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue(`--rpait-${currentDimension.toLowerCase()}`).trim()
      }];

      return { labels, datasets };
    }
  }

  /**
   * Get RPAIT score for a persona and dimension
   */
  function getRPAITScore(personaId, dimension) {
    const rpait = window.VULCA_ANALYSIS.getPersonaArtworkRPAIT(personaId, currentArtworkId) ||
                  window.VULCA_ANALYSIS.getPersonaAverageRPAIT(personaId);

    return rpait ? rpait[dimension] : 0;
  }

  /**
   * Update the matrix chart
   */
  function updateMatrixChart() {
    if (!matrixChart) return;

    const newData = getChartData();
    matrixChart.data = newData;
    matrixChart.update('none');

    updateARIALabel();
  }

  /**
   * Update ARIA label for accessibility
   */
  function updateARIALabel() {
    const canvas = document.getElementById('persona-matrix-chart');
    if (!canvas) return;

    const dimensionText = currentDimension === 'all' ? 'all RPAIT dimensions' : currentDimension;
    const label = `Persona comparison matrix showing ${dimensionText} for all personas`;
    canvas.setAttribute('aria-label', label);
  }

  /**
   * Handle dimension selector change
   */
  function handleDimensionChange(dimension) {
    currentDimension = dimension;
    updateMatrixChart();
  }

  /**
   * Handle visualization update event
   */
  function handleVisualizationUpdate(e) {
    const { artworkId } = e.detail;
    if (artworkId) {
      currentArtworkId = artworkId;
      updateMatrixChart();
    }
  }

  /**
   * Initialize event listeners
   */
  function initEventListeners() {
    const selector = document.getElementById('dimension-selector');
    if (selector) {
      selector.addEventListener('change', (e) => {
        handleDimensionChange(e.target.value);
      });
    }

    window.addEventListener('visualization:update', handleVisualizationUpdate);

    console.log('✓ Matrix chart event listeners initialized');
  }

  /**
   * Main initialization
   */
  function init() {
    if (!window.VULCA_DATA || !window.VULCA_ANALYSIS) {
      console.error('❌ VULCA_DATA or VULCA_ANALYSIS not loaded');
      return;
    }

    if (!window.Chart) {
      console.error('❌ Chart.js not loaded');
      return;
    }

    initMatrixChart();
    initEventListeners();
  }

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.PersonaMatrix = {
    update: updateMatrixChart
  };
})();
