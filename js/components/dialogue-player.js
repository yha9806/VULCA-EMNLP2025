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
    // Phase 3: Enhanced validation with defensive null checks
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error('[DialoguePlayer] Invalid container element provided');
    }

    // Store container reference first for error state rendering
    this.container = container;
    this.state = 'loading'; // Phase 3: Initial state

    // Validate dialogue thread with detailed error messages
    if (!dialogueThread) {
      const error = new Error('[DialoguePlayer] No dialogue thread data provided');
      this._showErrorState(error.message);
      throw error;
    }

    if (!dialogueThread.messages || !Array.isArray(dialogueThread.messages)) {
      const error = new Error('[DialoguePlayer] Thread.messages is missing or invalid (must be array)');
      this._showErrorState(error.message);
      throw error;
    }

    if (dialogueThread.messages.length === 0) {
      console.warn('[DialoguePlayer] Thread has no messages, showing empty state');
      this._showEmptyState();
      return; // Early return, don't initialize further
    }

    if (!dialogueThread.participants || dialogueThread.participants.length === 0) {
      console.warn('[DialoguePlayer] No participants data, using fallback');
      // Non-fatal, proceed with render
    }

    // Core state
    this.thread = dialogueThread;
    this.state = 'success'; // Phase 3: Mark as loaded successfully
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

    // Natural Timing: Auto-start playback with natural timing
    requestAnimationFrame(() => {
      this._startNaturalPlayback();
    });
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
   * Generate random delay within range (Natural Timing)
   * @private
   * @param {number} min - Minimum delay (ms)
   * @param {number} max - Maximum delay (ms)
   * @returns {number} Random delay in milliseconds
   */
  _randomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Calculate natural delay for message appearance (Natural Timing)
   * Simulates thinking time based on message length
   * @private
   * @param {Object} message - Message object
   * @param {number} index - Message index in thread
   * @returns {number} Delay in milliseconds
   */
  _calculateNaturalDelay(message, index) {
    const THINKING_MIN = 2000;  // Increased from 1500ms
    const THINKING_MAX = 4000;  // Increased from 3000ms

    // Base random thinking time
    let delay = this._randomDelay(THINKING_MIN, THINKING_MAX);

    // Adjust for message length (300ms per 100 chars - reduced multiplier for subtlety)
    const lang = document.documentElement.getAttribute('data-lang') || 'zh';
    const text = lang === 'en' ? message.textEn : message.textZh;
    const lengthAdjustment = Math.floor(text.length / 100) * 300;
    delay += lengthAdjustment;

    // First message appears slightly faster (90% of normal delay for less aggressive reduction)
    if (index === 0) {
      delay = Math.floor(delay * 0.9);
    }

    // Cap maximum delay at 8 seconds (increased from 5s to allow "deep thinking")
    delay = Math.min(delay, 8000);

    console.log(`[DialoguePlayer] Message ${index} delay: ${delay}ms (length: ${text.length} chars)`);
    return delay;
  }

  /**
   * Reveal a hidden message with animation (Natural Timing)
   * @private
   * @param {string} messageId - Message ID to reveal
   */
  _revealMessage(messageId) {
    const msgEl = this.messageElements.get(messageId);
    if (!msgEl) {
      console.warn(`[DialoguePlayer] Message element not found: ${messageId}`);
      return;
    }

    // Remove hidden class, add appearing animation
    msgEl.classList.remove('message-hidden');
    msgEl.classList.add('message-appearing');

    // Scroll into view (smooth)
    msgEl.scrollIntoView({ behavior: 'smooth', block: 'end' });

    console.log(`[DialoguePlayer] Revealed message: ${messageId}`);
  }

  /**
   * Start natural playback with random timing (Natural Timing)
   * @private
   */
  _startNaturalPlayback() {
    console.log('[DialoguePlayer] Starting natural playback...');

    // Track timeouts for cleanup
    this._playbackTimeouts = [];

    let cumulativeDelay = 0;

    this.thread.messages.forEach((message, index) => {
      const delay = this._calculateNaturalDelay(message, index);
      cumulativeDelay += delay;

      const timeoutId = setTimeout(() => {
        this._revealMessage(message.id);
      }, cumulativeDelay);

      this._playbackTimeouts.push(timeoutId);
    });

    console.log(`[DialoguePlayer] Scheduled ${this.thread.messages.length} messages, total duration: ${cumulativeDelay}ms`);
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
      msgEl.className = 'dialogue-message message-hidden'; // Natural Timing: Start hidden
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

    console.log(`[DialoguePlayer] Pre-rendered ${this.thread.messages.length} hidden messages (natural timing mode)`);

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
    // Natural flow redesign: No controls needed
    // Dialogue auto-plays with natural timing
    this.controlsContainer.innerHTML = '';

    console.log('[DialoguePlayer] Controls initialized (minimal - no UI)');
  }

  /**
   * Attach event listeners to control elements
   * @private
   */
  _attachControlListeners() {
    // Natural flow redesign: No control listeners needed
    // Auto-play handles everything

    console.log('[DialoguePlayer] Control listeners attached (none - auto-play mode)');
  }

  // ============================================================================
  // Phase 3: Content Visibility - Error Handling & State Management
  // ============================================================================

  /**
   * Show error state UI when dialogue fails to load or render
   * @private
   * @param {string} errorMessage - User-friendly error message
   */
  _showErrorState(errorMessage) {
    // Convert technical errors to user-friendly messages
    const userMessage = this._sanitizeErrorMessage(errorMessage);

    this.container.innerHTML = `
      <div class="dialogue-player-error">
        <div class="error-icon" role="img" aria-label="Error">⚠️</div>
        <h3>Unable to Load Dialogue</h3>
        <p class="error-message">${userMessage}</p>
        <button class="error-retry-btn" onclick="window.location.reload();">
          Retry
        </button>
      </div>
    `;

    console.error('[DialoguePlayer] Error state displayed:', errorMessage);
  }

  /**
   * Show empty state UI when dialogue has no messages
   * @private
   */
  _showEmptyState() {
    this.container.innerHTML = `
      <div class="dialogue-player-error">
        <div class="error-icon" role="img" aria-label="Info">ℹ️</div>
        <h3>No Dialogue Content</h3>
        <p class="error-message">This dialogue thread contains no messages yet.</p>
      </div>
    `;

    console.log('[DialoguePlayer] Empty state displayed');
  }

  /**
   * Show loading state UI while dialogue is initializing
   * @private
   */
  _showLoadingState() {
    this.container.innerHTML = `
      <div class="dialogue-player-loading">
        <div class="spinner" role="status" aria-label="Loading"></div>
        <p>Loading dialogue...</p>
      </div>
    `;

    console.log('[DialoguePlayer] Loading state displayed');
  }

  /**
   * Hide loading state UI
   * @private
   */
  _hideLoadingState() {
    const loadingEl = this.container.querySelector('.dialogue-player-loading');
    if (loadingEl) {
      loadingEl.remove();
      console.log('[DialoguePlayer] Loading state hidden');
    }
  }

  /**
   * Sanitize error messages for user display
   * Converts technical errors to user-friendly messages
   * @private
   * @param {string} technicalError - Raw error message
   * @returns {string} User-friendly error message
   */
  _sanitizeErrorMessage(technicalError) {
    const errorMap = {
      'No dialogue thread data provided': 'Dialogue data is missing. Please refresh the page.',
      'Thread.messages is missing or invalid': 'Dialogue format is incorrect. Please contact support.',
      'Invalid dialogue thread provided': 'Unable to load dialogue data. Please try again.',
      'Invalid container element provided': 'Page rendering error. Please refresh the page.'
    };

    // Check if error message matches known patterns
    for (const [technical, friendly] of Object.entries(errorMap)) {
      if (technicalError.includes(technical)) {
        return friendly;
      }
    }

    // Default fallback message
    return 'Something went wrong while loading the dialogue. Please refresh the page and try again.';
  }

  /**
   * Validate dialogue thread data structure
   * Phase 3: Task 3.4 - Data validation method
   * @private
   * @param {Object} thread - Dialogue thread to validate
   * @throws {Error} If validation fails with descriptive message
   */
  _validateThreadData(thread) {
    if (!thread) {
      throw new Error('[DialoguePlayer] No dialogue thread data provided');
    }

    // Required fields
    if (!thread.id) {
      throw new Error('[DialoguePlayer] Thread missing required field: id');
    }
    if (!thread.topic) {
      throw new Error('[DialoguePlayer] Thread missing required field: topic');
    }
    if (!Array.isArray(thread.messages)) {
      throw new Error('[DialoguePlayer] Thread.messages must be an array');
    }
    if (!Array.isArray(thread.participants)) {
      throw new Error('[DialoguePlayer] Thread.participants must be an array');
    }

    // Validate messages
    thread.messages.forEach((msg, idx) => {
      if (!msg.id) {
        throw new Error(`[DialoguePlayer] Message ${idx} missing required field: id`);
      }
      if (!msg.personaId) {
        throw new Error(`[DialoguePlayer] Message ${msg.id} missing required field: personaId`);
      }
      if (!msg.text) {
        throw new Error(`[DialoguePlayer] Message ${msg.id} missing required field: text`);
      }
      if (typeof msg.timestamp !== 'number') {
        throw new Error(`[DialoguePlayer] Message ${msg.id} missing or invalid timestamp (must be number)`);
      }
    });

    console.log('[DialoguePlayer] Data validation passed ✓');
  }

  /**
   * Destroy player and clean up resources
   */
  destroy() {
    // Stop any pending timeouts
    if (this._playbackTimeouts) {
      this._playbackTimeouts.forEach(timeout => clearTimeout(timeout));
      this._playbackTimeouts = [];
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
