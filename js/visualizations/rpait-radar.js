/**
 * RPAIT Radar Chart Visualization
 * Version 1.0
 *
 * Displays persona RPAIT scores as radar/spider charts
 * Supports single and comparison modes
 */

(function() {
  'use strict';

  let radarChart = null;
  let currentMode = 'single';  // 'single' or 'compare'
  let selectedPersonas = ['su-shi'];  // Default to Su Shi
  let currentArtworkId = 'artwork-1';  // Default artwork

  /**
   * Initialize the radar chart
   */
  function initRadarChart() {
    const canvas = document.getElementById('rpait-radar-chart');
    if (!canvas) {
      console.error('❌ Radar chart canvas not found');
      return;
    }

    const ctx = canvas.getContext('2d');

    // Get initial data
    const data = getChartData();

    radarChart = new Chart(ctx, {
      type: 'radar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.25,  // 500:400
        scales: {
          r: {
            min: 0,
            max: 10,
            ticks: {
              stepSize: 2,
              font: { size: 12 },
              backdropColor: 'transparent'
            },
            pointLabels: {
              font: { size: 14, weight: '500' },
              color: '#2d2d2d'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            angleLines: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { size: 14 },
              usePointStyle: true,
              padding: 15
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const dimensions = ['R', 'P', 'A', 'I', 'T'];
                const dim = dimensions[context.dataIndex];
                return `${context.dataset.label}: ${dim} = ${context.parsed.r}/10`;
              }
            }
          }
        },
        animation: {
          duration: 200,
          easing: 'easeInOutQuad'
        }
      }
    });

    console.log('✓ RPAIT radar chart initialized');
  }

  /**
   * Get chart data based on current mode and selection
   */
  function getChartData() {
    const labels = [
      '代表性 Representation',
      '哲学性 Philosophy',
      '美学性 Aesthetic',
      '身份性 Identity',
      '传统性 Tradition'
    ];

    const datasets = selectedPersonas.slice(0, 3).map(personaId => {
      const persona = window.VULCA_DATA.personas.find(p => p.id === personaId);
      if (!persona) return null;

      // Get RPAIT scores for current artwork
      const rpait = window.VULCA_ANALYSIS.getPersonaArtworkRPAIT(personaId, currentArtworkId) ||
                    window.VULCA_ANALYSIS.getPersonaAverageRPAIT(personaId);

      if (!rpait) return null;

      return {
        label: `${persona.nameZh} (${persona.nameEn})`,
        data: [rpait.R, rpait.P, rpait.A, rpait.I, rpait.T],
        backgroundColor: hexToRgba(persona.color, 0.2),
        borderColor: persona.color,
        borderWidth: 2,
        pointBackgroundColor: persona.color,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: persona.color,
        pointRadius: 4,
        pointHoverRadius: 6
      };
    }).filter(Boolean);

    return { labels, datasets };
  }

  /**
   * Update the radar chart with new data
   */
  function updateRadarChart() {
    if (!radarChart) return;

    const newData = getChartData();
    radarChart.data = newData;
    radarChart.update('none');  // No animation for instant update

    // Update ARIA label
    updateARIALabel();
  }

  /**
   * Update ARIA label for accessibility
   */
  function updateARIALabel() {
    const canvas = document.getElementById('rpait-radar-chart');
    if (!canvas) return;

    const persona = window.VULCA_DATA.personas.find(p => p.id === selectedPersonas[0]);
    if (!persona) return;

    const rpait = window.VULCA_ANALYSIS.getPersonaArtworkRPAIT(selectedPersonas[0], currentArtworkId) ||
                  window.VULCA_ANALYSIS.getPersonaAverageRPAIT(selectedPersonas[0]);

    if (rpait) {
      const label = `RPAIT radar chart showing ${persona.nameEn}'s scores: Representation ${rpait.R}, Philosophy ${rpait.P}, Aesthetic ${rpait.A}, Identity ${rpait.I}, Tradition ${rpait.T}`;
      canvas.setAttribute('aria-label', label);
    }
  }

  /**
   * Convert hex color to rgba
   */
  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  /**
   * Handle mode toggle (single vs compare)
   */
  function handleModeToggle(mode) {
    currentMode = mode;

    // Update button states
    document.querySelectorAll('#rpait-radar-panel .viz-btn').forEach(btn => {
      if (btn.dataset.mode === mode) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Adjust selected personas
    if (mode === 'single') {
      selectedPersonas = [selectedPersonas[0] || 'su-shi'];
    } else if (mode === 'compare') {
      // Add Guo Xi for comparison if only one persona selected
      if (selectedPersonas.length === 1) {
        selectedPersonas.push('guo-xi');
      }
    }

    updateRadarChart();
  }

  /**
   * Handle visualization update event (from carousel)
   */
  function handleVisualizationUpdate(e) {
    const { artworkId } = e.detail;
    if (artworkId) {
      currentArtworkId = artworkId;
      updateRadarChart();
    }
  }

  /**
   * Handle persona click (for future persona selection UI)
   */
  function selectPersona(personaId) {
    if (currentMode === 'single') {
      selectedPersonas = [personaId];
    } else {
      // Toggle persona in comparison mode
      const index = selectedPersonas.indexOf(personaId);
      if (index > -1) {
        selectedPersonas.splice(index, 1);
      } else if (selectedPersonas.length < 3) {
        selectedPersonas.push(personaId);
      }
    }
    updateRadarChart();
  }

  /**
   * Initialize event listeners
   */
  function initEventListeners() {
    // Mode toggle buttons
    document.querySelectorAll('#rpait-radar-panel .viz-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        handleModeToggle(btn.dataset.mode);
      });
    });

    // Listen for carousel artwork changes
    window.addEventListener('visualization:update', handleVisualizationUpdate);

    console.log('✓ Radar chart event listeners initialized');
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

    initRadarChart();
    initEventListeners();
  }

  // Auto-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for external access
  window.RPAITRadar = {
    selectPersona,
    update: updateRadarChart
  };
})();
