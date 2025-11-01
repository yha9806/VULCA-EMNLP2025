/**
 * ChartManager - Manages Chart.js instances for RPAIT visualization
 *
 * Phase 4 Task 4.1: Chart Library Integration
 * Handles creation, updating, and destruction of charts
 */

class ChartManager {
  constructor(options = {}) {
    this.charts = new Map();
    this.canvasContainer = options.canvasContainer || null;
    this.chartDefaults = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 8,
          cornerRadius: 4,
          titleFont: { size: 12 },
          bodyFont: { size: 11 },
        },
      },
    };

    console.log('✅ ChartManager initialized');
  }

  /**
   * Create a radar chart for RPAIT visualization
   */
  createRadarChart(chartId, data, options = {}) {
    // Destroy existing chart if it exists
    if (this.charts.has(chartId)) {
      this.destroyChart(chartId);
    }

    // Get or create canvas element
    let canvas = document.getElementById(chartId);
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = chartId;
      canvas.width = options.width || 300;
      canvas.height = options.height || 300;

      if (this.canvasContainer) {
        this.canvasContainer.appendChild(canvas);
      }
    }

    // Validate Chart library is loaded
    if (!window.Chart) {
      console.error('❌ Chart.js not loaded');
      return null;
    }

    // Prepare chart configuration
    const chartConfig = {
      type: 'radar',
      data: {
        labels: data.labels || ['Representation', 'Philosophy', 'Aesthetics', 'Interpretation', 'Technique'],
        datasets: [
          {
            label: data.label || 'RPAIT Scores',
            data: data.values || [5, 5, 5, 5, 5],
            borderColor: data.borderColor || 'rgba(255, 99, 132, 1)',
            backgroundColor: data.backgroundColor || 'rgba(255, 99, 132, 0.2)',
            borderWidth: 2,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: data.borderColor || 'rgba(255, 99, 132, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 6,
            tension: 0.3,
          },
        ],
      },
      options: {
        ...this.chartDefaults,
        scale: {
          min: 0,
          max: 10,
          ticks: {
            stepSize: 2,
            font: { size: 10 },
          },
          grid: {
            color: 'rgba(200, 200, 200, 0.2)',
          },
        },
        plugins: {
          ...this.chartDefaults.plugins,
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: { size: 11 },
              padding: 10,
            },
          },
        },
        ...options,
      },
    };

    // Create Chart instance
    const chart = new Chart(canvas, chartConfig);
    this.charts.set(chartId, { chart, canvas, type: 'radar' });

    console.log(`✅ Radar chart created: ${chartId}`);
    return chart;
  }

  /**
   * Create a comparison radar chart with multiple datasets
   */
  createComparisonRadarChart(chartId, datasets, labels, options = {}) {
    if (this.charts.has(chartId)) {
      this.destroyChart(chartId);
    }

    let canvas = document.getElementById(chartId);
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = chartId;
      canvas.width = options.width || 400;
      canvas.height = options.height || 400;

      if (this.canvasContainer) {
        this.canvasContainer.appendChild(canvas);
      }
    }

    if (!window.Chart) {
      console.error('❌ Chart.js not loaded');
      return null;
    }

    // Prepare datasets with unique colors
    const colors = [
      'rgba(255, 99, 132, 1)',      // Red
      'rgba(54, 162, 235, 1)',      // Blue
      'rgba(75, 192, 192, 1)',      // Teal
      'rgba(255, 159, 64, 1)',      // Orange
    ];

    const chartDatasets = datasets.map((dataset, index) => ({
      label: dataset.label,
      data: dataset.values,
      borderColor: dataset.borderColor || colors[index % colors.length],
      backgroundColor: (dataset.borderColor || colors[index % colors.length]).replace('1)', '0.15)'),
      borderWidth: 2,
      fill: true,
      pointRadius: 4,
      pointBackgroundColor: dataset.borderColor || colors[index % colors.length],
      pointBorderColor: '#fff',
      pointBorderWidth: 1,
      tension: 0.3,
    }));

    const chartConfig = {
      type: 'radar',
      data: {
        labels: labels || ['R', 'P', 'A', 'I', 'T'],
        datasets: chartDatasets,
      },
      options: {
        ...this.chartDefaults,
        scale: {
          min: 0,
          max: 10,
          ticks: {
            stepSize: 2,
          },
          grid: {
            color: 'rgba(200, 200, 200, 0.2)',
          },
        },
        plugins: {
          ...this.chartDefaults.plugins,
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              font: { size: 11 },
              padding: 15,
            },
          },
        },
        ...options,
      },
    };

    const chart = new Chart(canvas, chartConfig);
    this.charts.set(chartId, { chart, canvas, type: 'comparison' });

    console.log(`✅ Comparison radar chart created: ${chartId}`);
    return chart;
  }

  /**
   * Update chart data
   */
  updateChart(chartId, newData) {
    const chartEntry = this.charts.get(chartId);
    if (!chartEntry) {
      console.warn(`⚠️  Chart not found: ${chartId}`);
      return;
    }

    const { chart } = chartEntry;

    // Update values
    if (newData.values) {
      chart.data.datasets[0].data = newData.values;
    }

    // Update label if provided
    if (newData.label) {
      chart.data.datasets[0].label = newData.label;
    }

    // Update colors if provided
    if (newData.borderColor) {
      chart.data.datasets[0].borderColor = newData.borderColor;
      chart.data.datasets[0].pointBackgroundColor = newData.borderColor;
    }

    if (newData.backgroundColor) {
      chart.data.datasets[0].backgroundColor = newData.backgroundColor;
    }

    chart.update('none'); // Update without animation
    console.log(`✅ Chart updated: ${chartId}`);
  }

  /**
   * Destroy a chart
   */
  destroyChart(chartId) {
    const chartEntry = this.charts.get(chartId);
    if (!chartEntry) return;

    const { chart, canvas } = chartEntry;
    chart.destroy();

    if (canvas && canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }

    this.charts.delete(chartId);
    console.log(`✅ Chart destroyed: ${chartId}`);
  }

  /**
   * Destroy all charts
   */
  destroyAll() {
    this.charts.forEach((_, chartId) => {
      this.destroyChart(chartId);
    });
  }

  /**
   * Get chart instance
   */
  getChart(chartId) {
    const chartEntry = this.charts.get(chartId);
    return chartEntry ? chartEntry.chart : null;
  }

  /**
   * Get debug info
   */
  getDebugInfo() {
    return {
      chartsCount: this.charts.size,
      chartIds: Array.from(this.charts.keys()),
    };
  }
}

// Make globally accessible
window.ChartManager = ChartManager;
