/**
 * DialoguePlayer - Animated Dialogue Playback Component
 *
 * Handles timeline-based playback of critic dialogue threads with:
 * - Animated message rendering (typing effects)
 * - Playback controls (play/pause/speed/scrub)
 * - Timeline management with requestAnimationFrame
 *
 * Usage:
 *   const player = new DialoguePlayer(dialogueThread, container, options);
 *   player.play();
 *
 * @version 1.0.0
 * @created 2025-11-04
 */

class DialoguePlayer {
  /**
   * Create a DialoguePlayer instance
   * @param {Object} dialogueThread - Dialogue thread object from VULCA_DATA.dialogues
   * @param {HTMLElement} container - DOM element to render dialogue into
   * @param {Object} options - Configuration options
   * @param {number} options.speed - Playback speed multiplier (default: 1.0)
   * @param {boolean} options.autoPlay - Start playing immediately (default: false)
   * @param {string} options.lang - Language for rendering ('zh'|'en', default: 'zh')
   */
  constructor(dialogueThread, container, options = {}) {
    // Validate inputs
    if (!dialogueThread || !dialogueThread.messages) {
      throw new Error('[DialoguePlayer] Invalid dialogue thread provided');
    }
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error('[DialoguePlayer] Invalid container element provided');
    }

    // Core state
    this.thread = dialogueThread;
    this.container = container;
    this.options = {
      speed: options.speed || 1.0,
      autoPlay: options.autoPlay || false,
      lang: options.lang || 'zh'
    };

    // Playback state
    this.currentTime = 0;
    this.speed = this.options.speed;
    this.isPlaying = false;
    this.isPaused = false;
    this.lastFrameTime = 0;
    this.rafId = null;

    // Message tracking
    this.renderedMessages = new Set();
    this.messageElements = new Map();

    // Calculate total duration (max timestamp + buffer)
    this.totalDuration = this._calculateTotalDuration();

    // Initialize UI
    this._initializeUI();

    // Initialize ThoughtChainVisualizer for connection lines (Phase 4)
    this.thoughtChainVisualizer = null;
    if (typeof ThoughtChainVisualizer !== 'undefined') {
      this.thoughtChainVisualizer = new ThoughtChainVisualizer(
        this.thread,
        this.messagesContainer,
        {
          showConnectionLines: options.showConnectionLines !== false,
          animateLines: options.animateLines !== false,
          enableHoverPreviews: options.enableHoverPreviews !== false
        }
      );
      console.log('[DialoguePlayer] ThoughtChainVisualizer initialized');
    }

    console.log(`[DialoguePlayer] Initialized for thread: ${this.thread.id}`);
    console.log(`[DialoguePlayer] Messages: ${this.thread.messages.length}, Duration: ${this.totalDuration}ms`);

    // Auto-play if requested
    if (this.options.autoPlay) {
      this.play();
    }
  }

  /**
   * Calculate total duration of dialogue based on timestamps
   * @private
   * @returns {number} Total duration in milliseconds
   */
  _calculateTotalDuration() {
    if (!this.thread.messages || this.thread.messages.length === 0) {
      return 0;
    }

    const maxTimestamp = Math.max(
      ...this.thread.messages.map(msg => msg.timestamp)
    );

    // Add 3 seconds buffer after last message for reading
    return maxTimestamp + 3000;
  }

  /**
   * Render all messages immediately (static display)
   * Phase 2: Content Pre-Rendering
   * @private
   */
  _renderAllMessages() {
    console.log('[DialoguePlayer] Pre-rendering all messages in static mode...');

    // Sort messages by timestamp to ensure chronological order
    const sortedMessages = [...this.thread.messages].sort((a, b) => a.timestamp - b.timestamp);

    // Render each message
    sortedMessages.forEach((message, index) => {
      const persona = this._getPersona(message.personaId);
      if (!persona) {
        console.warn(`[DialoguePlayer] Persona not found: ${message.personaId}`);
        return;
      }

      const lang = document.documentElement.getAttribute('data-lang') || this.options.lang;

      // Create message element
      const msgEl = document.createElement('div');
      msgEl.className = 'dialogue-message static-display visible';
      msgEl.dataset.messageId = message.id;
      msgEl.dataset.personaId = message.personaId;
      msgEl.dataset.interactionType = message.interactionType;
      msgEl.dataset.timestamp = message.timestamp;

      // Build message HTML
      msgEl.innerHTML = `
        <div class="message-header">
          <span class="message-author" style="color: ${persona.color}">
            ${lang === 'en' ? persona.nameEn : persona.nameZh}
          </span>
          <span class="interaction-badge ${message.interactionType}">
            ${this._getInteractionLabel(message.interactionType, lang)}
          </span>
        </div>
        <div class="message-content">
          ${lang === 'en' ? message.textEn : message.textZh}
        </div>
      `;

      // Add quote block if message references another message
      if (message.quotedText) {
        const quoteEl = this._createQuoteBlock(message);
        const contentEl = msgEl.querySelector('.message-content');
        contentEl.insertBefore(quoteEl, contentEl.firstChild);
      }

      // Append to container
      this.messagesContainer.appendChild(msgEl);

      // Track element and mark as rendered
      this.messageElements.set(message.id, msgEl);
      this.renderedMessages.add(message.id);
    });

    console.log(`[DialoguePlayer] Rendered ${this.thread.messages.length} messages in static mode`);

    // Draw all connection lines immediately (if ThoughtChainVisualizer is available)
    if (this.thoughtChainVisualizer) {
      // Register all message elements first
      this.thread.messages.forEach(msg => {
        const msgEl = this.messageElements.get(msg.id);
        if (msgEl) {
          this.thoughtChainVisualizer.registerMessageElement(msg.id, msgEl);
        }
      });

      // Draw all connections
      setTimeout(() => {
        this.thread.messages.forEach(msg => {
          if (msg.replyTo) {
            const replyToMessage = this.thread.messages.find(m => m.personaId === msg.replyTo);
            if (replyToMessage) {
              this.thoughtChainVisualizer.drawConnectionLine(
                replyToMessage.id,
                msg.id,
                msg.interactionType
              );
            }
          }
        });
        console.log('[DialoguePlayer] Drew all connection lines');
      }, 100); // Small delay for DOM to settle
    }
  }

  /**
   * Initialize UI structure and controls
   * @private
   */
  _initializeUI() {
    this.container.classList.add('dialogue-player');
    this.container.innerHTML = '';

    // Create dialogue header
    const header = document.createElement('div');
    header.className = 'dialogue-player__header';
    header.innerHTML = `
      <h3 class="dialogue-player__topic">
        <span class="dialogue-player__topic-zh">${this.thread.topic}</span>
        <span class="dialogue-player__topic-en">${this.thread.topicEn}</span>
      </h3>
      <div class="dialogue-player__participants">
        ${this.thread.participants.map(personaId => {
          const persona = window.VULCA_DATA.personas.find(p => p.id === personaId);
          return `<span class="dialogue-player__participant" data-persona="${personaId}">${persona ? persona.nameZh : personaId}</span>`;
        }).join(' · ')}
      </div>
    `;
    this.container.appendChild(header);

    // Create messages container
    this.messagesContainer = document.createElement('div');
    this.messagesContainer.className = 'dialogue-player__messages';
    this.container.appendChild(this.messagesContainer);

    // Phase 2: Pre-render all messages in static mode
    // This makes content immediately visible without animation
    this._renderAllMessages();

    // Create controls container
    this.controlsContainer = document.createElement('div');
    this.controlsContainer.className = 'dialogue-player__controls';
    this.container.appendChild(this.controlsContainer);

    // Populate controls (Task 3.4)
    this._initializeControls();

    // Enable responsive mode detection (Phase 5)
    this._setupResponsiveMode();

    // Enable touch gestures for mobile (Phase 5)
    this._setupTouchGestures();

    console.log('[DialoguePlayer] UI structure initialized');
  }

  /**
   * Setup responsive mode detection (Phase 5)
   * Automatically applies compact-mode class on small screens
   * @private
   */
  _setupResponsiveMode() {
    const checkResponsive = () => {
      if (window.innerWidth <= 480) {
        this.container.classList.add('compact-mode');
      } else {
        this.container.classList.remove('compact-mode');
      }
    };

    // Initial check
    checkResponsive();

    // Update on resize
    window.addEventListener('resize', checkResponsive);

    console.log('[DialoguePlayer] Responsive mode enabled');
  }

  /**
   * Setup touch gestures for timeline scrubbing (Phase 5)
   * Swipe left/right to advance/rewind timeline
   * @private
   */
  _setupTouchGestures() {
    let touchStartX = 0;
    let touchStartTime = 0;
    const swipeThreshold = 50; // minimum distance for swipe
    const timeJump = 2000; // 2 seconds per swipe

    this.messagesContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartTime = this.currentTime;
    }, { passive: true });

    this.messagesContainer.addEventListener('touchmove', (e) => {
      // Prevent default to avoid scroll conflicts
      const touchCurrentX = e.touches[0].clientX;
      const deltaX = touchCurrentX - touchStartX;

      // Show visual feedback for swipe
      if (Math.abs(deltaX) > swipeThreshold) {
        this.messagesContainer.style.transform = `translateX(${deltaX * 0.1}px)`;
      }
    }, { passive: true });

    this.messagesContainer.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const deltaX = touchEndX - touchStartX;

      // Reset visual feedback
      this.messagesContainer.style.transform = '';
      this.messagesContainer.style.transition = 'transform 0.3s ease';
      setTimeout(() => {
        this.messagesContainer.style.transition = '';
      }, 300);

      // Detect swipe direction and jump timeline
      if (Math.abs(deltaX) > swipeThreshold) {
        if (deltaX > 0) {
          // Swipe right: rewind
          this.seek(Math.max(0, this.currentTime - timeJump));
          console.log('[DialoguePlayer] Swipe right: rewind');
        } else {
          // Swipe left: forward
          this.seek(Math.min(this.totalDuration, this.currentTime + timeJump));
          console.log('[DialoguePlayer] Swipe left: forward');
        }
      }
    }, { passive: true });

    console.log('[DialoguePlayer] Touch gestures enabled');
  }

  /**
   * Start or resume playback
   */
  play() {
    if (this.isPlaying) {
      console.log('[DialoguePlayer] Already playing');
      return;
    }

    this.isPlaying = true;
    this.isPaused = false;
    this.lastFrameTime = performance.now();

    console.log(`[DialoguePlayer] Starting playback from ${this.currentTime}ms at ${this.speed}x speed`);
    this._animate();
  }

  /**
   * Pause playback
   */
  pause() {
    if (!this.isPlaying) {
      console.log('[DialoguePlayer] Not currently playing');
      return;
    }

    this.isPlaying = false;
    this.isPaused = true;

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    console.log(`[DialoguePlayer] Paused at ${this.currentTime}ms`);
  }

  /**
   * Resume playback after pause
   */
  resume() {
    if (!this.isPaused) {
      console.log('[DialoguePlayer] Not currently paused');
      return;
    }

    this.play();
  }

  /**
   * Set playback speed
   * @param {number} speed - Speed multiplier (0.5 = half speed, 2.0 = double speed)
   */
  setSpeed(speed) {
    if (speed <= 0) {
      console.warn('[DialoguePlayer] Speed must be positive, ignoring');
      return;
    }

    this.speed = speed;
    console.log(`[DialoguePlayer] Speed set to ${this.speed}x`);
  }

  /**
   * Jump to specific time in dialogue
   * @param {number} time - Time in milliseconds
   */
  scrubTo(time) {
    const clampedTime = Math.max(0, Math.min(time, this.totalDuration));
    this.currentTime = clampedTime;

    // Clear all rendered messages
    this.renderedMessages.clear();
    this.messagesContainer.innerHTML = '';

    // Re-render all messages up to current time
    this._renderMessagesUpToTime(this.currentTime);

    console.log(`[DialoguePlayer] Scrubbed to ${this.currentTime}ms`);
  }

  /**
   * Reset playback to beginning
   */
  reset() {
    this.pause();
    this.currentTime = 0;
    this.renderedMessages.clear();
    this.messagesContainer.innerHTML = '';

    console.log('[DialoguePlayer] Reset to beginning');
  }

  /**
   * Main animation loop (Task 3.2)
   * Uses requestAnimationFrame for smooth 60fps timeline advancement
   * @private
   */
  _animate() {
    if (!this.isPlaying) return;

    const now = performance.now();
    const deltaTime = now - this.lastFrameTime;

    // Advance timeline based on speed multiplier
    this.currentTime += deltaTime * this.speed;

    // Check if we've reached the end
    if (this.currentTime >= this.totalDuration) {
      this.currentTime = this.totalDuration;
      this.pause();
      console.log(`[DialoguePlayer] Playback completed at ${this.currentTime}ms`);
      return;
    }

    // Check for messages that should be rendered
    this._checkTimeline(this.currentTime);

    // Update last frame time
    this.lastFrameTime = now;

    // Schedule next frame
    this.rafId = requestAnimationFrame(() => this._animate());
  }

  /**
   * Check timeline and render due messages (Task 3.2)
   * Iterates through all messages and renders those whose timestamp has been reached
   * @private
   * @param {number} currentTime - Current playback time in ms
   */
  _checkTimeline(currentTime) {
    this.thread.messages.forEach(msg => {
      // Check if message timestamp has been reached and not yet rendered
      if (msg.timestamp <= currentTime && !this.renderedMessages.has(msg.id)) {
        console.log(`[DialoguePlayer] Rendering message at ${msg.timestamp}ms: ${msg.id}`);
        this._renderMessage(msg);
        this.renderedMessages.add(msg.id);
      }
    });
  }

  /**
   * Render messages up to a specific time (for scrubbing)
   * Used when user scrubs timeline to instantly show all messages up to that point
   * @private
   * @param {number} time - Time threshold in ms
   */
  _renderMessagesUpToTime(time) {
    // Filter messages by timestamp
    const messagesToRender = this.thread.messages
      .filter(msg => msg.timestamp <= time)
      .sort((a, b) => a.timestamp - b.timestamp);

    console.log(`[DialoguePlayer] Rendering ${messagesToRender.length} messages up to ${time}ms`);

    // Render each message without animation
    messagesToRender.forEach(msg => {
      if (!this.renderedMessages.has(msg.id)) {
        this._renderMessage(msg);
        this.renderedMessages.add(msg.id);
      }
    });
  }

  /**
   * Render a single message (Task 3.3)
   * Creates DOM element with persona styling, interaction badge, and bilingual support
   * @private
   * @param {Object} message - Message object with personaId, textZh, textEn, interactionType
   */
  _renderMessage(message) {
    const persona = this._getPersona(message.personaId);
    if (!persona) {
      console.warn(`[DialoguePlayer] Persona not found: ${message.personaId}`);
      return;
    }

    const lang = document.documentElement.getAttribute('data-lang') || this.options.lang;

    // Create message element
    const msgEl = document.createElement('div');
    msgEl.className = 'dialogue-message';
    msgEl.dataset.messageId = message.id;
    msgEl.dataset.personaId = message.personaId;
    msgEl.dataset.interactionType = message.interactionType;

    // Build message HTML
    msgEl.innerHTML = `
      <div class="message-header">
        <span class="message-author" style="color: ${persona.color}">
          ${lang === 'en' ? persona.nameEn : persona.nameZh}
        </span>
        <span class="interaction-badge ${message.interactionType}">
          ${this._getInteractionLabel(message.interactionType, lang)}
        </span>
      </div>
      <div class="message-content">
        ${lang === 'en' ? message.textEn : message.textZh}
      </div>
    `;

    // Add quote block if message references another message
    if (message.quotedText) {
      const quoteEl = this._createQuoteBlock(message);
      const contentEl = msgEl.querySelector('.message-content');
      contentEl.insertBefore(quoteEl, contentEl.firstChild);
    }

    // Enhance interaction badge (Task 4.4: Add click navigation and tooltip)
    const badgeEl = msgEl.querySelector('.interaction-badge');
    if (badgeEl && message.replyTo) {
      badgeEl.classList.add('clickable');
      badgeEl.style.cursor = 'pointer';
      badgeEl.setAttribute('title', this._getInteractionTooltip(message.interactionType, lang));

      badgeEl.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent message click if any
        this._scrollToPersonaMessage(message.replyTo);
      });
    } else if (badgeEl) {
      // Add tooltip even for non-clickable badges
      badgeEl.setAttribute('title', this._getInteractionTooltip(message.interactionType, lang));
    }

    // Add appearing animation class
    msgEl.classList.add('appearing');
    this.messagesContainer.appendChild(msgEl);

    // Track element for future reference
    this.messageElements.set(message.id, msgEl);

    // Register with ThoughtChainVisualizer (Phase 4)
    if (this.thoughtChainVisualizer) {
      this.thoughtChainVisualizer.registerMessageElement(message.id, msgEl);

      // Draw connection line if this message replies to another
      if (message.replyTo) {
        // Find the replied-to message
        const replyToMessage = this.thread.messages.find(m => m.personaId === message.replyTo);
        if (replyToMessage && this.renderedMessages.has(replyToMessage.id)) {
          // Both messages are rendered, draw connection line
          setTimeout(() => {
            this.thoughtChainVisualizer.drawConnectionLine(
              replyToMessage.id,
              message.id,
              message.interactionType
            );
          }, 100); // Small delay for DOM to settle
        }
      }
    }

    // Trigger animation on next frame
    requestAnimationFrame(() => {
      msgEl.classList.remove('appearing');
      msgEl.classList.add('visible');
    });

    // Auto-scroll to keep latest message visible
    msgEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    console.log(`[DialoguePlayer] Rendered message: ${message.id} (${persona.nameZh})`);
  }

  /**
   * Get persona data by ID
   * @private
   * @param {string} personaId - Persona identifier
   * @returns {Object|null} Persona object or null if not found
   */
  _getPersona(personaId) {
    return window.VULCA_DATA.personas.find(p => p.id === personaId) || null;
  }

  /**
   * Get interaction type label in specified language
   * @private
   * @param {string} type - Interaction type ID
   * @param {string} lang - Language code ('zh' or 'en')
   * @returns {string} Localized label
   */
  _getInteractionLabel(type, lang) {
    if (!window.INTERACTION_TYPES || !window.INTERACTION_TYPES[type]) {
      return type;
    }
    return lang === 'en'
      ? window.INTERACTION_TYPES[type].labelEn
      : window.INTERACTION_TYPES[type].labelZh;
  }

  /**
   * Get interaction type tooltip explanation (Task 4.4)
   * @private
   * @param {string} type - Interaction type ID
   * @param {string} lang - Language code ('zh' or 'en')
   * @returns {string} Tooltip text
   */
  _getInteractionTooltip(type, lang) {
    const tooltips = {
      'initial': {
        zh: '开启话题：首次对作品发表观点',
        en: 'Initial: First perspective on the artwork'
      },
      'agree-extend': {
        zh: '赞同并延伸：认同前人观点，进一步拓展',
        en: 'Agrees & Extends: Builds upon previous perspective'
      },
      'question-challenge': {
        zh: '质疑：对前人观点提出疑问或挑战',
        en: 'Questions: Challenges previous perspective'
      },
      'synthesize': {
        zh: '综合：整合多方观点，形成新见解',
        en: 'Synthesizes: Integrates multiple perspectives'
      },
      'counter': {
        zh: '反驳：明确反对前人观点，提出相反看法',
        en: 'Counters: Directly opposes previous perspective'
      },
      'reflect': {
        zh: '反思：基于对话回顾自身观点',
        en: 'Reflects: Reconsiders own perspective based on dialogue'
      }
    };

    if (tooltips[type]) {
      return tooltips[type][lang];
    }
    return type;
  }

  /**
   * Create quote block element for referenced messages (Task 4.3: Enhanced with click navigation)
   * @private
   * @param {Object} message - Message object with quotedText
   * @returns {HTMLElement} Quote block element
   */
  _createQuoteBlock(message) {
    const quoteEl = document.createElement('blockquote');
    quoteEl.className = 'message-quote';

    // Find the referenced message if replyTo exists
    if (message.replyTo) {
      const referencedMsg = this.thread.messages.find(m => m.personaId === message.replyTo);
      if (referencedMsg) {
        const referencedPersona = this._getPersona(referencedMsg.personaId);
        const lang = document.documentElement.getAttribute('data-lang') || this.options.lang;

        quoteEl.innerHTML = `
          <cite style="color: ${referencedPersona.color}">
            ${lang === 'en' ? referencedPersona.nameEn : referencedPersona.nameZh}:
          </cite>
          <p>${message.quotedText}</p>
        `;

        // Make quote block clickable to scroll to original message (Phase 4 enhancement)
        quoteEl.style.cursor = 'pointer';
        quoteEl.setAttribute('title', lang === 'en' ? 'Click to view original message' : '点击查看原始消息');
        quoteEl.dataset.replyTo = message.replyTo;

        quoteEl.addEventListener('click', () => {
          this._scrollToPersonaMessage(message.replyTo);
        });
      } else {
        quoteEl.innerHTML = `<p>${message.quotedText}</p>`;
      }
    } else {
      quoteEl.innerHTML = `<p>${message.quotedText}</p>`;
    }

    return quoteEl;
  }

  /**
   * Scroll to a specific persona's message
   * @private
   * @param {string} personaId - Persona ID to scroll to
   */
  _scrollToPersonaMessage(personaId) {
    // Find the first message by this persona
    const targetMessage = this.thread.messages.find(m => m.personaId === personaId);
    if (!targetMessage) {
      console.warn('[DialoguePlayer] No message found for persona:', personaId);
      return;
    }

    const targetElement = this.messageElements.get(targetMessage.id);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Highlight briefly with pulse animation
      targetElement.classList.add('pulse');
      setTimeout(() => {
        targetElement.classList.remove('pulse');
      }, 3000); // Remove after 2 animation cycles (1.5s each)

      console.log('[DialoguePlayer] Scrolled to message:', targetMessage.id);
    } else {
      console.warn('[DialoguePlayer] Message element not found:', targetMessage.id);
    }
  }

  /**
   * Initialize playback controls UI (Task 3.4)
   * Creates play/pause, speed selector, timeline scrubber, and time display
   * @private
   */
  _initializeControls() {
    this.controlsContainer.innerHTML = `
      <div class="controls-row">
        <button class="control-button play-pause-btn" aria-label="Play dialogue" data-action="play">
          <span class="btn-icon">▶</span>
          <span class="btn-label">播放</span>
        </button>

        <select class="speed-selector" aria-label="Playback speed">
          <option value="0.5">0.5x</option>
          <option value="1.0" selected>1.0x</option>
          <option value="1.5">1.5x</option>
          <option value="2.0">2.0x</option>
        </select>

        <button class="control-button replay-btn" aria-label="Replay dialogue">
          <span class="btn-icon">↻</span>
          <span class="btn-label">重播</span>
        </button>
      </div>

      <div class="timeline-container">
        <input type="range" class="timeline-scrubber" min="0" max="${this.totalDuration}" value="0" step="100" aria-label="Timeline position" />
        <div class="time-display">
          <span class="current-time">0:00</span>
          <span class="time-separator">/</span>
          <span class="total-time">${this._formatTime(this.totalDuration)}</span>
        </div>
      </div>
    `;

    // Store control element references
    this.playPauseBtn = this.controlsContainer.querySelector('.play-pause-btn');
    this.speedSelector = this.controlsContainer.querySelector('.speed-selector');
    this.replayBtn = this.controlsContainer.querySelector('.replay-btn');
    this.timelineScrubber = this.controlsContainer.querySelector('.timeline-scrubber');
    this.currentTimeDisplay = this.controlsContainer.querySelector('.current-time');
    this.totalTimeDisplay = this.controlsContainer.querySelector('.total-time');

    // Attach event listeners
    this._attachControlListeners();

    console.log('[DialoguePlayer] Controls initialized');
  }

  /**
   * Attach event listeners to control elements
   * @private
   */
  _attachControlListeners() {
    // Play/Pause button
    this.playPauseBtn.addEventListener('click', () => {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
      this._updatePlayPauseButton();
    });

    // Speed selector
    this.speedSelector.addEventListener('change', (e) => {
      const speed = parseFloat(e.target.value);
      this.setSpeed(speed);
    });

    // Replay button
    this.replayBtn.addEventListener('click', () => {
      this.reset();
      this.play();
      this._updatePlayPauseButton();
    });

    // Timeline scrubber
    this.timelineScrubber.addEventListener('input', (e) => {
      const time = parseInt(e.target.value);
      this.scrubTo(time);
      this._updateTimeDisplay();
    });

    // Update timeline during playback
    this._startTimelineUpdater();

    console.log('[DialoguePlayer] Control listeners attached');
  }

  /**
   * Update play/pause button state
   * @private
   */
  _updatePlayPauseButton() {
    const icon = this.playPauseBtn.querySelector('.btn-icon');
    const label = this.playPauseBtn.querySelector('.btn-label');

    if (this.isPlaying) {
      icon.textContent = '⏸';
      label.textContent = '暂停';
      this.playPauseBtn.setAttribute('aria-label', 'Pause dialogue');
      this.playPauseBtn.dataset.action = 'pause';
    } else {
      icon.textContent = '▶';
      label.textContent = '播放';
      this.playPauseBtn.setAttribute('aria-label', 'Play dialogue');
      this.playPauseBtn.dataset.action = 'play';
    }
  }

  /**
   * Update time display
   * @private
   */
  _updateTimeDisplay() {
    this.currentTimeDisplay.textContent = this._formatTime(this.currentTime);
    this.timelineScrubber.value = this.currentTime;
  }

  /**
   * Start timeline updater interval
   * @private
   */
  _startTimelineUpdater() {
    // Update timeline and time display every 100ms
    this._timelineUpdateInterval = setInterval(() => {
      if (this.isPlaying) {
        this._updateTimeDisplay();
      }
    }, 100);
  }

  /**
   * Format time in milliseconds to MM:SS
   * @private
   * @param {number} ms - Time in milliseconds
   * @returns {string} Formatted time string
   */
  _formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Destroy player and clean up resources
   */
  destroy() {
    this.pause();

    // Clear timeline updater interval
    if (this._timelineUpdateInterval) {
      clearInterval(this._timelineUpdateInterval);
      this._timelineUpdateInterval = null;
    }

    this.container.innerHTML = '';
    this.renderedMessages.clear();
    this.messageElements.clear();

    console.log('[DialoguePlayer] Destroyed');
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DialoguePlayer;
}

// Also expose globally for non-module usage
if (typeof window !== 'undefined') {
  window.DialoguePlayer = DialoguePlayer;
}

console.log('[DialoguePlayer] Class loaded successfully');
