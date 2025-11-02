/**
 * Network Graph Visualization
 * Version 1.0 (Simplified - without D3.js force simulation)
 *
 * Displays artwork-persona relationships as a simple network
 * Uses static circular layout for MVP
 */

(function() {
  'use strict';

  let svg = null;
  let width = 800;
  let height = 500;

  /**
   * Initialize the network graph
   */
  function initNetworkGraph() {
    svg = document.getElementById('network-graph');
    if (!svg) {
      console.error('❌ Network graph SVG not found');
      return;
    }

    // Get dimensions from container
    const container = svg.parentElement;
    width = container.clientWidth || 800;
    height = 500;

    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    renderGraph();
    console.log('✓ Network graph initialized (simplified layout)');
  }

  /**
   * Render the network graph with static circular layout
   */
  function renderGraph() {
    if (!svg) return;

    // Clear existing content
    svg.innerHTML = '';

    const personas = window.VULCA_DATA.personas;
    const artworks = window.VULCA_DATA.artworks;

    // Calculate positions
    const centerX = width / 2;
    const centerY = height / 2;
    const artworkRadius = Math.min(width, height) / 6;
    const personaRadius = Math.min(width, height) / 3;

    // Position artworks in inner circle
    const artworkNodes = artworks.map((artwork, i) => {
      const angle = (i / artworks.length) * 2 * Math.PI - Math.PI / 2;
      return {
        id: artwork.id,
        x: centerX + artworkRadius * Math.cos(angle),
        y: centerY + artworkRadius * Math.sin(angle),
        type: 'artwork',
        label: `作品${i + 1}`,
        color: getArtworkColor(i)
      };
    });

    // Position personas in outer circle
    const personaNodes = personas.map((persona, i) => {
      const angle = (i / personas.length) * 2 * Math.PI - Math.PI / 2;
      return {
        id: persona.id,
        x: centerX + personaRadius * Math.cos(angle),
        y: centerY + personaRadius * Math.sin(angle),
        type: 'persona',
        label: persona.nameZh,
        color: persona.color
      };
    });

    const allNodes = [...artworkNodes, ...personaNodes];

    // Create links (edges) between artworks and personas
    const links = [];
    artworks.forEach(artwork => {
      personas.forEach(persona => {
        const rpait = window.VULCA_ANALYSIS.getPersonaArtworkRPAIT(persona.id, artwork.id);
        if (rpait) {
          // Calculate alignment score (average of RPAIT dimensions)
          const alignment = (rpait.R + rpait.P + rpait.A + rpait.I + rpait.T) / 5 / 10;

          links.push({
            source: artwork.id,
            target: persona.id,
            weight: alignment
          });
        }
      });
    });

    // Draw edges first (so they're behind nodes)
    const edgesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    edgesGroup.setAttribute('class', 'edges');

    links.forEach(link => {
      const sourceNode = allNodes.find(n => n.id === link.source);
      const targetNode = allNodes.find(n => n.id === link.target);

      if (sourceNode && targetNode) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('class', 'link');
        line.setAttribute('x1', sourceNode.x);
        line.setAttribute('y1', sourceNode.y);
        line.setAttribute('x2', targetNode.x);
        line.setAttribute('y2', targetNode.y);
        line.setAttribute('stroke-width', link.weight * 3);  // Weight affects thickness
        line.setAttribute('stroke-opacity', link.weight * 0.6);
        edgesGroup.appendChild(line);
      }
    });

    svg.appendChild(edgesGroup);

    // Draw nodes
    const nodesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    nodesGroup.setAttribute('class', 'nodes');

    allNodes.forEach(node => {
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.setAttribute('class', 'node-group');

      // Circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('class', 'node');
      circle.setAttribute('cx', node.x);
      circle.setAttribute('cy', node.y);
      circle.setAttribute('r', node.type === 'artwork' ? 30 : 20);
      circle.setAttribute('fill', node.color);
      circle.setAttribute('data-type', node.type);
      circle.setAttribute('data-id', node.id);

      // Label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('class', 'label');
      text.setAttribute('x', node.x);
      text.setAttribute('y', node.y + (node.type === 'artwork' ? 45 : 35));
      text.setAttribute('text-anchor', 'middle');
      text.textContent = node.label;

      group.appendChild(circle);
      group.appendChild(text);
      nodesGroup.appendChild(group);
    });

    svg.appendChild(nodesGroup);
  }

  /**
   * Get color for artwork node
   */
  function getArtworkColor(index) {
    const colors = [
      '#667eea',  // Blue-purple
      '#11998e',  // Green-cyan
      '#eb3349',  // Red-orange
      '#d66d75'   // Pink-purple
    ];
    return colors[index % colors.length];
  }

  /**
   * Handle window resize
   */
  function handleResize() {
    if (!svg) return;

    const container = svg.parentElement;
    const newWidth = container.clientWidth || 800;

    if (Math.abs(newWidth - width) > 50) {  // Only re-render if significant change
      width = newWidth;
      renderGraph();
    }
  }

  /**
   * Handle visualization update event
   */
  function handleVisualizationUpdate(e) {
    // Network graph could highlight specific artwork's connections
    // For MVP, we just keep the static layout
  }

  /**
   * Handle reset button
   */
  function handleReset() {
    renderGraph();
  }

  /**
   * Handle export button (simplified - just shows message)
   */
  function handleExport() {
    alert('Export functionality coming soon! For now, use browser screenshot tools.');
  }

  /**
   * Initialize event listeners
   */
  function initEventListeners() {
    window.addEventListener('visualization:update', handleVisualizationUpdate);
    window.addEventListener('resize', debounce(handleResize, 250));

    // Control buttons
    const resetBtn = document.querySelector('#network-graph-panel [data-action="reset"]');
    const exportBtn = document.querySelector('#network-graph-panel [data-action="export"]');

    if (resetBtn) {
      resetBtn.addEventListener('click', handleReset);
    }

    if (exportBtn) {
      exportBtn.addEventListener('click', handleExport);
    }

    console.log('✓ Network graph event listeners initialized');
  }

  /**
   * Debounce utility
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Main initialization
   */
  function init() {
    if (!window.VULCA_DATA || !window.VULCA_ANALYSIS) {
      console.error('❌ VULCA_DATA or VULCA_ANALYSIS not loaded');
      return;
    }

    initNetworkGraph();
    initEventListeners();
  }

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.NetworkGraph = {
    update: renderGraph
  };
})();
