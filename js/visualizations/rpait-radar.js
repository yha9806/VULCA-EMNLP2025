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
  let selectedPersonas = ['su-shi', 'guo-xi', 'john-ruskin'];  // CHANGED: Default to 3 personas
  let currentArtworkId = 'artwork-1';  // Default artwork
  // REMOVED: currentMode - now automatically determined by selection count

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
      '代表性',
      '哲学性',
      '美学性',
      '身份性',
      '传统性'
    ];

    const datasets = selectedPersonas.map(personaId => {
      const persona = window.VULCA_DATA.personas.find(p => p.id === personaId);
      if (!persona) return null;

      // Get RPAIT scores for current artwork
      const rpait = window.VULCA_ANALYSIS.getPersonaArtworkRPAIT(personaId, currentArtworkId) ||
                    window.VULCA_ANALYSIS.getPersonaAverageRPAIT(personaId);

      if (!rpait) return null;

      return {
        label: persona.nameZh,
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
      const label = `RPAIT雷达图显示${persona.nameZh}的分数：代表性 ${rpait.R}，哲学性 ${rpait.P}，美学性 ${rpait.A}，身份性 ${rpait.I}，传统性 ${rpait.T}`;
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
   * Handle persona click (legacy function, now handled by global selector)
   */
  function selectPersona(personaId) {
    // SIMPLIFIED: Just toggle persona without mode restrictions
    const index = selectedPersonas.indexOf(personaId);
    if (index > -1) {
      selectedPersonas.splice(index, 1);
    } else {
      selectedPersonas.push(personaId);
    }
    updateRadarChart();
  }

  /**
   * Initialize event listeners
   */
  function initEventListeners() {
    // REMOVED: Mode toggle buttons (no longer needed)

    // Listen for carousel artwork changes
    window.addEventListener('visualization:update', handleVisualizationUpdate);

    // Listen for global persona selection changes
    window.addEventListener('persona:selectionChanged', (event) => {
      const { personas } = event.detail;
      console.log(`[Radar Chart] Selection changed to ${personas.length} personas`, personas);

      selectedPersonas = personas;
      updateRadarChart();

      // Update ARIA label for accessibility
      updateARIALabel();
    });

    console.log('✓ Radar chart event listeners initialized');
  }

  /**
   * Update ARIA label to reflect current selection
   */
  function updateARIALabel() {
    const canvas = document.getElementById('rpait-radar-chart');
    if (!canvas) return;

    const personaNames = selectedPersonas.map(id => {
      const persona = window.VULCA_DATA.personas.find(p => p.id === id);
      return persona ? persona.nameZh : id;
    }).join('、');

    canvas.setAttribute('aria-label',
      `RPAIT雷达图显示 ${selectedPersonas.length} 位评论家：${personaNames}`
    );
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
