/**
 * ThoughtChainVisualizer Component
 *
 * Visualizes conversation flow and thought chains between critics with:
 * - SVG connection lines showing message relationships
 * - Color-coded interaction types
 * - Animated draw-in effects
 * - Hover previews
 *
 * @version 1.0.0
 * @created 2025-11-04
 */

class ThoughtChainVisualizer {
  /**
   * @param {Object} dialogueThread - Dialogue thread with messages
   * @param {HTMLElement} container - Container element for visualization
   * @param {Object} options - Configuration options
   */
  constructor(dialogueThread, container, options = {}) {
    // Validation
    if (!dialogueThread || !dialogueThread.messages) {
      throw new Error('[ThoughtChainVisualizer] Invalid dialogue thread provided');
    }
    if (!container) {
      throw new Error('[ThoughtChainVisualizer] Container element required');
    }

    // Core properties
    this.thread = dialogueThread;
    this.container = container;
    this.options = {
      showConnectionLines: true,
      animateLines: true,
      enableHoverPreviews: true,
      ...options
    };

    // SVG overlay for connection lines
    this.svgOverlay = null;
    this.connectionLines = new Map(); // messageId -> SVG path element
    this.messageElements = new Map(); // messageId -> DOM element

    // Interaction type color map
    this.interactionColors = {
      'initial': '#6366f1',        // Indigo
      'agree-extend': '#22c55e',   // Green
      'question-challenge': '#eab308', // Yellow
      'synthesize': '#8b5cf6',     // Purple
      'counter': '#ef4444',        // Red
      'reflect': '#3b82f6'         // Blue
    };

    console.log('[ThoughtChainVisualizer] Initialized', {
      threadId: this.thread.id,
      messageCount: this.thread.messages.length,
      options: this.options
    });

    // Initialize SVG overlay
    this._initializeSVGOverlay();
  }

  /**
   * Initialize SVG overlay for connection lines
   * @private
   */
  _initializeSVGOverlay() {
    // Create SVG element
    this.svgOverlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svgOverlay.setAttribute('class', 'thought-chain-svg-overlay');
    this.svgOverlay.setAttribute('width', '100%');
    this.svgOverlay.setAttribute('height', '100%');
    this.svgOverlay.style.position = 'absolute';
    this.svgOverlay.style.top = '0';
    this.svgOverlay.style.left = '0';
    this.svgOverlay.style.pointerEvents = 'none'; // Allow clicks through to messages
    this.svgOverlay.style.zIndex = '1';

    // Create defs for arrow markers
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

    // Create arrow markers for each interaction type
    Object.entries(this.interactionColors).forEach(([type, color]) => {
      const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
      marker.setAttribute('id', `arrow-${type}`);
      marker.setAttribute('viewBox', '0 0 10 10');
      marker.setAttribute('refX', '8');
      marker.setAttribute('refY', '5');
      marker.setAttribute('markerWidth', '6');
      marker.setAttribute('markerHeight', '6');
      marker.setAttribute('orient', 'auto-start-reverse');

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
      path.setAttribute('fill', color);

      marker.appendChild(path);
      defs.appendChild(marker);
    });

    this.svgOverlay.appendChild(defs);

    // Position container relatively and prepend SVG
    this.container.style.position = 'relative';
    this.container.insertBefore(this.svgOverlay, this.container.firstChild);

    console.log('[ThoughtChainVisualizer] SVG overlay created');
  }

  /**
   * Get color for interaction type
   * @param {string} interactionType - Type of interaction
   * @returns {string} Color code
   */
  getColorForType(interactionType) {
    return this.interactionColors[interactionType] || '#9ca3af';
  }

  /**
   * Register a message element for connection line tracking
   * @param {string} messageId - Message ID
   * @param {HTMLElement} element - DOM element for the message
   */
  registerMessageElement(messageId, element) {
    this.messageElements.set(messageId, element);
    console.log('[ThoughtChainVisualizer] Registered message element:', messageId);
  }

  /**
   * Draw connection line between two messages
   * @param {string} fromMessageId - Source message ID
   * @param {string} toMessageId - Target message ID
   * @param {string} interactionType - Type of interaction
   */
  drawConnectionLine(fromMessageId, toMessageId, interactionType) {
    if (!this.options.showConnectionLines) return;

    const fromElement = this.messageElements.get(fromMessageId);
    const toElement = this.messageElements.get(toMessageId);

    if (!fromElement || !toElement) {
      console.warn('[ThoughtChainVisualizer] Cannot draw line: element not found', {
        fromMessageId,
        toMessageId
      });
      return;
    }

    // Get bounding rectangles
    const containerRect = this.container.getBoundingClientRect();
    const fromRect = fromElement.getBoundingClientRect();
    const toRect = toElement.getBoundingClientRect();

    // Calculate positions relative to container
    const x1 = fromRect.left - containerRect.left + fromRect.width / 2;
    const y1 = fromRect.bottom - containerRect.top;
    const x2 = toRect.left - containerRect.left + toRect.width / 2;
    const y2 = toRect.top - containerRect.top;

    // Control point for quadratic bezier (smooth curve)
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;

    // Create SVG path
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M ${x1},${y1} Q ${cx},${cy} ${x2},${y2}`);
    path.setAttribute('class', `connection-line connection-line-${interactionType}`);
    path.setAttribute('stroke', this.getColorForType(interactionType));
    path.setAttribute('stroke-width', '2');
    path.setAttribute('fill', 'none');
    path.setAttribute('marker-end', `url(#arrow-${interactionType})`);
    path.setAttribute('data-from', fromMessageId);
    path.setAttribute('data-to', toMessageId);
    path.setAttribute('data-interaction', interactionType);

    // Calculate path length for stroke-dasharray animation
    if (this.options.animateLines) {
      const pathLength = path.getTotalLength();
      path.style.strokeDasharray = pathLength;
      path.style.strokeDashoffset = pathLength;
      path.style.transition = 'stroke-dashoffset 1s ease-in-out';
    }

    // Add hover effect
    if (this.options.enableHoverPreviews) {
      path.style.pointerEvents = 'stroke'; // Make stroke hoverable
      path.style.cursor = 'pointer';

      path.addEventListener('mouseenter', (e) => {
        this._showLinePreview(toMessageId, e);
        path.style.strokeWidth = '3';
        path.style.opacity = '1';
      });

      path.addEventListener('mouseleave', () => {
        this._hideLinePreview();
        path.style.strokeWidth = '2';
        path.style.opacity = '0.6';
      });

      path.addEventListener('click', () => {
        this._scrollToMessage(toMessageId);
      });
    }

    // Add to overlay
    this.svgOverlay.appendChild(path);
    this.connectionLines.set(toMessageId, path);

    // Trigger animation
    if (this.options.animateLines) {
      setTimeout(() => {
        path.style.strokeDashoffset = '0';
      }, 100);
    }

    console.log('[ThoughtChainVisualizer] Drew connection line', {
      from: fromMessageId,
      to: toMessageId,
      interactionType
    });
  }

  /**
   * Draw all connection lines based on message relationships
   */
  drawAllConnections() {
    this.thread.messages.forEach((message) => {
      if (message.replyTo) {
        // Find the message being replied to
        const replyToMessage = this.thread.messages.find(m => m.personaId === message.replyTo);
        if (replyToMessage) {
          this.drawConnectionLine(replyToMessage.id, message.id, message.interactionType);
        }
      }
    });

    console.log('[ThoughtChainVisualizer] Drew all connections');
  }

  /**
   * Update connection line positions (e.g., after window resize)
   */
  updateConnectionPositions() {
    // Redraw all connection lines
    this.connectionLines.forEach((path, messageId) => {
      const fromMessageId = path.getAttribute('data-from');
      const interactionType = path.getAttribute('data-interaction');

      // Remove old path
      path.remove();
      this.connectionLines.delete(messageId);

      // Redraw with new positions
      this.drawConnectionLine(fromMessageId, messageId, interactionType);
    });

    console.log('[ThoughtChainVisualizer] Updated connection positions');
  }

  /**
   * Show preview tooltip on line hover
   * @private
   * @param {string} messageId - Target message ID
   * @param {MouseEvent} event - Mouse event
   */
  _showLinePreview(messageId, event) {
    const message = this.thread.messages.find(m => m.id === messageId);
    if (!message) return;

    const lang = document.documentElement.getAttribute('data-lang') || 'zh';
    const persona = window.VULCA_DATA.personas.find(p => p.id === message.personaId);
    const textContent = lang === 'en' ? message.textEn : message.textZh;
    const snippet = textContent.substring(0, 100) + (textContent.length > 100 ? '...' : '');

    // Create or update tooltip
    let tooltip = document.querySelector('.thought-chain-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'thought-chain-tooltip';
      document.body.appendChild(tooltip);
    }

    tooltip.innerHTML = `
      <div class="tooltip-author" style="color: ${persona.color}">
        ${lang === 'en' ? persona.nameEn : persona.nameZh}
      </div>
      <div class="tooltip-snippet">${snippet}</div>
    `;

    tooltip.style.display = 'block';
    tooltip.style.left = `${event.pageX + 10}px`;
    tooltip.style.top = `${event.pageY + 10}px`;
  }

  /**
   * Hide preview tooltip
   * @private
   */
  _hideLinePreview() {
    const tooltip = document.querySelector('.thought-chain-tooltip');
    if (tooltip) {
      tooltip.style.display = 'none';
    }
  }

  /**
   * Scroll to a specific message
   * @private
   * @param {string} messageId - Message ID to scroll to
   */
  _scrollToMessage(messageId) {
    const element = this.messageElements.get(messageId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Highlight briefly
      element.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.5)';
      setTimeout(() => {
        element.style.boxShadow = '';
      }, 2000);
    }
  }

  /**
   * Clear all connection lines
   */
  clearConnections() {
    this.connectionLines.forEach(path => path.remove());
    this.connectionLines.clear();
    console.log('[ThoughtChainVisualizer] Cleared all connections');
  }

  /**
   * Destroy the visualizer and clean up
   */
  destroy() {
    this.clearConnections();
    if (this.svgOverlay) {
      this.svgOverlay.remove();
    }
    this.messageElements.clear();
    console.log('[ThoughtChainVisualizer] Destroyed');
  }
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThoughtChainVisualizer;
}
