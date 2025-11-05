# Tasks: Refine Dialogue System Visual Design and UX

**Change ID**: `refine-dialogue-system-visual-ux`
**Status**: Proposed
**Estimated Time**: 6-10 hours
**Priority**: High (ultrathink)

---

## Phase 1: Color System Alignment (1-2 hours)

### Task 1.1: Update Header Gradient (15 min)
**File**: `styles/components/dialogue-player.css`

**Changes**:
```css
/* Line 40 - Replace purple gradient with warm gradient */
.dialogue-player__header {
  padding: 28px 24px;
  background: linear-gradient(135deg, #B85C3C 0%, #D4A574 100%); /* CHANGED: Was #667eea → #764ba2 */
  color: #ffffff;
  min-height: 80px;
}
```

**Success Criteria**:
- [x] Header displays terracotta-to-gold gradient
- [x] No purple colors visible in header
- [x] Gradient angle is 135deg

**Testing**:
```bash
# Visual check
open http://localhost:9999/pages/dialogue-test.html
# Inspect header background in DevTools
```

---

### Task 1.2: Add Text Shadow for Readability (10 min)
**File**: `styles/components/dialogue-player.css`

**Changes**:
```css
/* Line 38-61 - Add text-shadow to header text */
.dialogue-player__header {
  /* ... existing styles ... */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); /* NEW */
}

.dialogue-player__topic,
.dialogue-player__participants {
  text-shadow: inherit; /* NEW: Inherit from header */
}
```

**Success Criteria**:
- [x] Header text has subtle shadow
- [x] Text remains readable on warm gradient
- [x] Contrast ratio ≥ 4.5:1 (WCAG AA)

**Testing**:
```bash
# Check contrast with WebAIM Contrast Checker
# https://webaim.org/resources/contrastchecker/
# Foreground: #ffffff, Background: #C57158 (mid-gradient)
```

---

### Task 1.3: Update Control Button Colors (20 min)
**File**: `styles/components/dialogue-player.css`

**Changes**:
```css
/* Line 358-382 - Update button background */
.control-button {
  padding: 10px 20px;
  background: #B85C3C; /* CHANGED: Was #667eea */
  color: #ffffff;
  /* ... rest unchanged ... */
}

.control-button:hover {
  background: #A04B2F; /* CHANGED: Was #5568d3 */
  /* ... rest unchanged ... */
}

/* Line 332-341 - Update active mode toggle */
.mode-toggle-btn.active {
  background: linear-gradient(135deg, #B85C3C 0%, #D4A574 100%); /* CHANGED */
  color: #ffffff;
  border-color: #B85C3C; /* CHANGED */
  box-shadow: 0 2px 8px rgba(184, 92, 60, 0.3); /* CHANGED: RGBA of terracotta */
}

.mode-toggle-btn.active:hover {
  background: linear-gradient(135deg, #A04B2F 0%, #C57158 100%); /* CHANGED: Darker */
  border-color: #A04B2F;
}
```

**Success Criteria**:
- [x] Control buttons use terracotta color
- [x] Hover states darken appropriately
- [x] Active mode toggle matches header gradient
- [x] Box shadow color updated to terracotta RGBA

**Testing**:
```javascript
// In browser console
const btn = document.querySelector('.control-button');
const style = window.getComputedStyle(btn);
console.assert(style.backgroundColor === 'rgb(184, 92, 60)', 'Button color is terracotta');
```

---

### Task 1.4: Remove All Purple Color References (15 min)
**File**: `styles/components/dialogue-player.css`

**Changes**:
- Search for `#667eea`, `#764ba2`, `#5568d3` (hover state)
- Replace with warm equivalents or remove

**Success Criteria**:
- [x] Zero instances of purple hex codes in file
- [x] `grep -i "#667eea\|#764ba2" styles/components/dialogue-player.css` returns no matches

**Testing**:
```bash
# Automated check
grep -n "#667eea\|#764ba2\|#5568d3" styles/components/dialogue-player.css
# Expected: No output (exit code 1)
```

---

### Task 1.5: Visual Regression Test (10 min)
**Tool**: Manual screenshot comparison

**Process**:
1. Take "before" screenshot of dialogue player
2. Apply color changes
3. Take "after" screenshot
4. Compare side-by-side

**Success Criteria**:
- [x] Header gradient is warm (not purple)
- [x] Buttons are terracotta (not purple)
- [x] Overall color scheme matches site palette
- [x] No visual regressions (layout intact)

---

## Phase 2: Header Typography Refactor (1-2 hours)

### Task 2.1: Implement Responsive Chinese Title (20 min)
**File**: `styles/components/dialogue-player.css`

**Changes**:
```css
/* Line 52-54 - Update .dialogue-player__topic-zh */
.dialogue-player__topic-zh {
  display: block;
  font-size: clamp(1rem, 3vw, 1.2rem); /* NEW: Responsive sizing */
  font-weight: 600; /* MOVED: From parent */
  line-height: 1.3;

  /* NEW: Line clamping */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

**Success Criteria**:
- [x] Title scales from 1rem (mobile) to 1.2rem (desktop)
- [x] Max 2 lines displayed
- [x] Long titles show ellipsis (...)
- [x] No overflow on 375px viewport

**Testing**:
```javascript
// Test responsive scaling
const title = document.querySelector('.dialogue-player__topic-zh');
const sizes = [375, 768, 1024, 1440];

sizes.forEach(width => {
  window.resizeTo(width, 800);
  const fontSize = parseFloat(window.getComputedStyle(title).fontSize);
  console.log(`${width}px: ${fontSize}px`);
  console.assert(fontSize >= 16 && fontSize <= 19.2);
});
```

---

### Task 2.2: Implement Responsive English Subtitle (15 min)
**File**: `styles/components/dialogue-player.css`

**Changes**:
```css
/* Line 56-61 - Update .dialogue-player__topic-en */
.dialogue-player__topic-en {
  display: block;
  font-size: clamp(0.85rem, 2.5vw, 0.95rem); /* NEW: Responsive sizing */
  opacity: 0.9;
  margin-top: 4px;
  line-height: 1.4; /* NEW: Slightly taller for English */
}
```

**Success Criteria**:
- [x] Subtitle scales from 0.85rem to 0.95rem
- [x] Visually smaller than Chinese title
- [x] 90% opacity for hierarchy
- [x] 4px spacing from Chinese title

**Testing**:
```javascript
const zhTitle = document.querySelector('.dialogue-player__topic-zh');
const enTitle = document.querySelector('.dialogue-player__topic-en');

const zhSize = parseFloat(window.getComputedStyle(zhTitle).fontSize);
const enSize = parseFloat(window.getComputedStyle(enTitle).fontSize);
const enOpacity = parseFloat(window.getComputedStyle(enTitle).opacity);

console.assert(enSize < zhSize, 'English smaller than Chinese');
console.assert(enOpacity === 0.9, 'English opacity is 90%');
```

---

### Task 2.3: Add Title Tooltip for Long Titles (30 min)
**File**: `js/components/dialogue-player.js`

**Changes**:
```javascript
// In _renderHeader() method
_renderHeader() {
  const headerHTML = `
    <div class="dialogue-player__header">
      <div class="dialogue-player__topic">
        <span class="dialogue-player__topic-zh" lang="zh">${this.thread.topic.zh}</span>
        <span class="dialogue-player__topic-en" lang="en">${this.thread.topic.en}</span>
      </div>
      <div class="dialogue-player__participants">
        ${this._renderParticipants()}
      </div>
    </div>
  `;

  this.headerContainer.innerHTML = headerHTML;

  // NEW: Add tooltip for clamped titles
  this._addTitleTooltip();
}

// NEW METHOD
_addTitleTooltip() {
  const titleEl = this.container.querySelector('.dialogue-player__topic-zh');

  // Check if text is clamped (scrollHeight > clientHeight)
  if (titleEl.scrollHeight > titleEl.clientHeight) {
    titleEl.title = titleEl.textContent; // Native browser tooltip
    titleEl.style.cursor = 'help'; // Visual cue
    console.log('[DialoguePlayer] Title clamped, tooltip added');
  }
}
```

**Success Criteria**:
- [ ] Long titles (2+ lines) show tooltip on hover
- [ ] Tooltip contains full title text
- [ ] Cursor changes to "help" (question mark)
- [ ] Short titles do not show tooltip

**Testing**:
```javascript
// Test with long title
const longTitle = '机械笔触中的自然韵律：探索人工智能在艺术创作中的边界与可能性与传统美学的对话空间与未来展望';
dialoguePlayer.thread.topic.zh = longTitle;
dialoguePlayer._renderHeader();

const titleEl = document.querySelector('.dialogue-player__topic-zh');
console.assert(titleEl.hasAttribute('title'), 'Tooltip attribute exists');
console.assert(titleEl.title === longTitle, 'Tooltip shows full text');
```

---

### Task 2.4: Increase Header Padding (10 min)
**File**: `styles/components/dialogue-player.css`

**Changes**:
```css
/* Line 38-43 - Update header padding */
.dialogue-player__header {
  padding: 28px 24px; /* CHANGED: Was 20px 16px */
  background: linear-gradient(135deg, #B85C3C 0%, #D4A574 100%);
  color: #ffffff;
  min-height: 80px; /* NEW: Prevent collapse */
}
```

**Success Criteria**:
- [x] Header padding increased from 20px to 28px (vertical)
- [x] Header padding increased from 16px to 24px (horizontal)
- [x] Min-height 80px prevents collapse with short titles
- [x] Header feels spacious, not cramped

**Testing**:
```javascript
const header = document.querySelector('.dialogue-player__header');
const style = window.getComputedStyle(header);
console.assert(style.paddingTop === '28px', 'Vertical padding is 28px');
console.assert(style.paddingLeft === '24px', 'Horizontal padding is 24px');
console.assert(parseInt(style.minHeight) >= 80, 'Min-height is 80px');
```

---

### Task 2.5: Test Typography on Mobile (15 min)
**Devices**: iPhone SE (375px), iPad (768px)

**Process**:
1. Open dialogue player on iPhone SE viewport
2. Test with short title (10 characters)
3. Test with medium title (40 characters)
4. Test with long title (80+ characters)
5. Verify no overflow, proper line clamping

**Success Criteria**:
- [x] No title overflow on 375px viewport
- [x] Line clamp works (2 lines max)
- [x] Ellipsis visible on long titles
- [~] Tooltip works on mobile (long press?) - Deferred to JS implementation
- [x] English subtitle fully visible

---

### Task 2.6: Update `.dialogue-player__topic` Parent (10 min)
**File**: `styles/components/dialogue-player.css`

**Changes**:
```css
/* Line 45-50 - Update parent class */
.dialogue-player__topic {
  margin: 0 0 12px 0;
  font-weight: 600; /* KEEP: Default weight */
  /* REMOVED: font-size (now in child classes) */
  /* REMOVED: line-height (now in child classes) */
}
```

**Rationale**: Delegate font sizing to language-specific child classes for better control.

**Success Criteria**:
- [x] Parent class only sets margin and font-weight
- [x] Child classes handle all sizing and line-height
- [x] No layout regressions

---

## Phase 3: Content Visibility Debug (1 hour)

### Task 3.1: Add Defensive Null Checks (20 min)
**File**: `js/components/dialogue-player.js`

**Changes**:
```javascript
// In _render() method
_render() {
  try {
    // NEW: Defensive checks
    if (!this.thread) {
      throw new Error('[DialoguePlayer] No dialogue thread data provided');
    }

    if (!this.thread.messages || !Array.isArray(this.thread.messages)) {
      throw new Error('[DialoguePlayer] Thread.messages is missing or invalid');
    }

    if (this.thread.messages.length === 0) {
      console.warn('[DialoguePlayer] Thread has no messages, showing empty state');
      this._showEmptyState();
      return;
    }

    if (!this.thread.participants || this.thread.participants.length === 0) {
      console.warn('[DialoguePlayer] No participants data, using fallback');
      // Non-fatal, proceed with render
    }

    // Existing render logic...
    this._renderHeader();
    this._renderMessages();
    this._renderControls();

    console.log('[DialoguePlayer] Render completed successfully');

  } catch (error) {
    console.error('[DialoguePlayer] Render failed:', error);
    console.error('[DialoguePlayer] Stack trace:', error.stack);
    this._showErrorState(error.message);
  }
}
```

**Success Criteria**:
- [ ] No crashes when `thread` is null/undefined
- [ ] No crashes when `messages` is empty array
- [ ] Descriptive errors logged to console
- [ ] Error state UI shown on failure

**Testing**:
```javascript
// Test invalid data
const invalidCases = [
  null,
  undefined,
  {},
  { messages: null },
  { messages: [] },
  { messages: 'not-an-array' }
];

invalidCases.forEach(data => {
  const player = new DialoguePlayer('container', data);
  // Should not crash, should show error/empty state
});
```

---

### Task 3.2: Implement Loading State UI (25 min)
**Files**:
- `js/components/dialogue-player.js` (logic)
- `styles/components/dialogue-player.css` (styles)

**Changes (JS)**:
```javascript
// In constructor
constructor(containerId, threadData) {
  this.container = document.getElementById(containerId);
  this.state = 'loading'; // NEW: Initial state

  this._showLoadingState(); // NEW

  // Simulate async data loading
  this._loadThreadData(threadData)
    .then(() => {
      this.state = 'success';
      this._hideLoadingState();
      this._render();
    })
    .catch(error => {
      this.state = 'error';
      this._showErrorState(error.message);
    });
}

// NEW METHOD
_showLoadingState() {
  this.container.innerHTML = `
    <div class="dialogue-player-loading">
      <div class="spinner"></div>
      <p>Loading dialogue...</p>
    </div>
  `;
}

// NEW METHOD
_hideLoadingState() {
  const loadingEl = this.container.querySelector('.dialogue-player-loading');
  if (loadingEl) {
    loadingEl.remove();
  }
}

// NEW METHOD
_loadThreadData(threadData) {
  return new Promise((resolve, reject) => {
    // Minimum loading time to prevent flash
    const minLoadTime = 300;
    const startTime = Date.now();

    setTimeout(() => {
      try {
        this._validateThreadData(threadData);
        this.thread = threadData;
        resolve();
      } catch (error) {
        reject(error);
      }
    }, Math.max(0, minLoadTime - (Date.now() - startTime)));
  });
}
```

**Changes (CSS)**:
```css
/* NEW: Loading state styles */
.dialogue-player-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #6b7280;
}

.dialogue-player-loading .spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top-color: #B85C3C; /* Warm terracotta */
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.dialogue-player-loading p {
  font-size: 0.95rem;
  margin: 0;
}
```

**Success Criteria**:
- [ ] Loading spinner displays on init
- [ ] Loading state visible for minimum 300ms
- [ ] Smooth transition to content
- [ ] No flash of unstyled content

**Testing**:
```javascript
const startTime = Date.now();
const player = new DialoguePlayer('container', validData);

// Check at 150ms (should still be loading)
setTimeout(() => {
  const loading = document.querySelector('.dialogue-player-loading');
  console.assert(loading !== null, 'Loading state visible at 150ms');
}, 150);

// Check at 350ms (should be done)
setTimeout(() => {
  const loading = document.querySelector('.dialogue-player-loading');
  console.assert(loading === null, 'Loading state hidden after 300ms');
}, 350);
```

---

### Task 3.3: Implement Error State UI (20 min)
**Files**:
- `js/components/dialogue-player.js` (logic)
- `styles/components/dialogue-player.css` (styles)

**Changes (JS)**:
```javascript
// NEW METHOD
_showErrorState(errorMessage) {
  this.container.innerHTML = `
    <div class="dialogue-player-error">
      <div class="error-icon">⚠️</div>
      <h3>Unable to Display Dialogue</h3>
      <p class="error-message">${this._sanitizeErrorMessage(errorMessage)}</p>
      <button class="error-retry-btn" onclick="location.reload()">Reload Page</button>
    </div>
  `;

  console.error('[DialoguePlayer] Error state shown:', errorMessage);
}

// NEW METHOD
_sanitizeErrorMessage(message) {
  const errorMap = {
    'No dialogue thread data provided': 'No dialogue data available',
    'Thread.messages is missing or invalid': 'Dialogue data is incomplete',
    'Thread has no messages': 'This dialogue has no messages'
  };

  return errorMap[message] || 'An unexpected error occurred';
}
```

**Changes (CSS)**:
```css
/* NEW: Error state styles */
.dialogue-player-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px;
  text-align: center;
  color: #6b7280;
}

.dialogue-player-error .error-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.dialogue-player-error h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.dialogue-player-error .error-message {
  font-size: 0.95rem;
  margin: 0 0 24px 0;
  max-width: 400px;
}

.dialogue-player-error .error-retry-btn {
  padding: 10px 20px;
  background: #B85C3C;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.dialogue-player-error .error-retry-btn:hover {
  background: #A04B2F;
}
```

**Success Criteria**:
- [ ] Error state displays icon + message + button
- [ ] Technical errors converted to user-friendly text
- [ ] Retry button reloads page
- [ ] Error logged to console with stack trace

---

### Task 3.4: Add Data Validation Method (15 min)
**File**: `js/components/dialogue-player.js`

**Changes**:
```javascript
// NEW METHOD
_validateThreadData(thread) {
  if (!thread) {
    throw new Error('No dialogue thread data provided');
  }

  // Required fields
  if (!thread.id) {
    throw new Error('Thread missing required field: id');
  }
  if (!thread.topic || !thread.topic.zh) {
    throw new Error('Thread missing required field: topic.zh');
  }
  if (!Array.isArray(thread.messages)) {
    throw new Error('Thread.messages must be an array');
  }
  if (!Array.isArray(thread.participants)) {
    throw new Error('Thread.participants must be an array');
  }

  // Validate messages
  thread.messages.forEach((msg, idx) => {
    if (!msg.id) {
      throw new Error(`Message ${idx} missing required field: id`);
    }
    if (!msg.personaId) {
      throw new Error(`Message ${msg.id} missing required field: personaId`);
    }
    if (!msg.text || (!msg.text.zh && typeof msg.text !== 'string')) {
      throw new Error(`Message ${msg.id} missing required field: text`);
    }
  });

  console.log('[DialoguePlayer] Data validation passed');
}
```

**Success Criteria**:
- [ ] Invalid data rejected with descriptive error
- [ ] Missing required fields detected
- [ ] Array type validation works
- [ ] Valid data passes without errors

**Testing**:
```javascript
// Test validation
const validData = { /* valid structure */ };
const invalidData = { id: '1', messages: 'not-array' };

// Should pass
dialoguePlayer._validateThreadData(validData);

// Should throw
try {
  dialoguePlayer._validateThreadData(invalidData);
  console.error('Validation should have failed!');
} catch (error) {
  console.log('Validation correctly caught error:', error.message);
}
```

---

## Phase 4: Progressive Focus Interaction (2-3 hours)

### Task 4.1: Add CSS Classes for Message States (20 min)
**File**: `styles/components/dialogue-player.css`

**Changes**:
```css
/* NEW: Progressive focus states (after line 146) */

/* Past messages (dimmed, context) */
.dialogue-message.past {
  opacity: 0.4;
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;
}

/* Current message (highlighted, centered) */
.dialogue-message.current {
  opacity: 1;
  transform: scale(1.02); /* Subtle emphasis */
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;
  box-shadow: 0 4px 16px rgba(184, 92, 60, 0.2); /* Warm glow */
}

/* Future messages (dimmed, pending) */
.dialogue-message.future {
  opacity: 0.4;
  transition: opacity 0.3s ease-out;
  position: relative; /* For ::after badge */
}

/* "生成中..." badge for future messages */
.dialogue-message.future::after {
  content: "生成中...";
  position: absolute;
  bottom: 12px;
  right: 16px;
  padding: 4px 12px;
  background: rgba(184, 92, 60, 0.15); /* Warm terracotta tint */
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #B85C3C;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* GPU acceleration hint */
.dialogue-message {
  will-change: opacity, transform;
}
```

**Success Criteria**:
- [ ] Past messages have 40% opacity
- [ ] Current message has 100% opacity + scale
- [ ] Future messages have 40% opacity + badge
- [ ] Badge pulses smoothly (1.5s cycle)
- [ ] Transitions are smooth (300ms)

---

### Task 4.2: Implement State Transition Logic (45 min)
**File**: `js/components/dialogue-player.js`

**Changes**:
```javascript
// In class properties
constructor(containerId, threadData) {
  // ... existing code ...
  this._currentMessageEl = null; // NEW: Track current message element
  this.currentMessageIndex = -1; // NEW: Track current message index
}

// MODIFIED: Update _revealMessage() method
_revealMessage(messageId) {
  const msgIdx = this.thread.messages.findIndex(m => m.id === messageId);
  if (msgIdx === -1) {
    console.error(`[DialoguePlayer] Message not found: ${messageId}`);
    return;
  }

  // Step 1: Transition previous current to past
  if (this._currentMessageEl) {
    this._currentMessageEl.classList.remove('current');
    this._currentMessageEl.classList.add('past');
    console.log('[DialoguePlayer] Previous message transitioned to past');
  }

  // Step 2: Reveal and set new current message
  const msgEl = this.messageElements.get(messageId);
  msgEl.classList.remove('message-hidden', 'future');
  msgEl.classList.add('current');

  this._currentMessageEl = msgEl;
  this.currentMessageIndex = msgIdx;

  console.log(`[DialoguePlayer] Message ${msgIdx + 1} revealed as current`);

  // Step 3: Mark all future messages
  this._markFutureMessages();

  // Step 4: Auto-scroll to center (if enabled)
  if (!this.autoScrollDisabled) {
    this._scrollToMessage(msgEl);
  }
}

// NEW METHOD: Mark future messages
_markFutureMessages() {
  this.thread.messages.forEach((msg, idx) => {
    if (idx > this.currentMessageIndex) {
      const el = this.messageElements.get(msg.id);
      // Only mark as future if already revealed (not hidden)
      if (el && !el.classList.contains('message-hidden')) {
        el.classList.add('future');
        el.classList.remove('past', 'current');
      }
    }
  });
}

// NEW METHOD: Scroll message to center
_scrollToMessage(msgEl) {
  this._isAutoScrolling = true; // Prevent scroll event handler from disabling

  msgEl.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    inline: 'nearest'
  });

  // Re-enable after scroll completes (600ms duration)
  setTimeout(() => {
    this._isAutoScrolling = false;
  }, 600);

  console.log('[DialoguePlayer] Auto-scrolled to current message');
}
```

**Success Criteria**:
- [ ] Only one message has `.current` class at a time
- [ ] Previous current transitions to `.past`
- [ ] Future messages have `.future` class
- [ ] State transitions are atomic (no race conditions)
- [ ] Console logs track state changes

**Testing**:
```javascript
// Test state transitions
dialoguePlayer._revealMessage('msg-1');
let current = document.querySelector('.dialogue-message.current');
console.assert(current.dataset.id === 'msg-1', 'Msg 1 is current');

dialoguePlayer._revealMessage('msg-2');
let past = document.querySelector('.dialogue-message.past');
current = document.querySelector('.dialogue-message.current');
console.assert(past.dataset.id === 'msg-1', 'Msg 1 is now past');
console.assert(current.dataset.id === 'msg-2', 'Msg 2 is now current');
```

---

### Task 4.3: Implement Auto-Scroll with Centering (30 min)
**File**: `js/components/dialogue-player.js`

**Changes**:
```javascript
// Already implemented in Task 4.2 (_scrollToMessage method)
// Additional: Add scroll event listener to detect manual scrolling

// In constructor or _attachEventListeners()
_attachScrollListener() {
  this.messagesContainer.addEventListener('scroll', () => {
    if (!this._isAutoScrolling) {
      this.autoScrollDisabled = true;
      this._showScrollPausedIndicator();
      console.log('[DialoguePlayer] Auto-scroll paused (manual scroll detected)');
    }
  });
}

// NEW METHOD: Show scroll paused indicator
_showScrollPausedIndicator() {
  if (document.querySelector('.scroll-paused-indicator')) {
    return; // Already showing
  }

  const indicator = document.createElement('div');
  indicator.className = 'scroll-paused-indicator';
  indicator.innerHTML = `
    <span>⏸ Auto-scroll paused</span>
    <button class="resume-scroll-btn">Resume</button>
  `;

  this.container.appendChild(indicator);

  // Resume button handler
  indicator.querySelector('.resume-scroll-btn').addEventListener('click', () => {
    this.autoScrollDisabled = false;
    indicator.remove();
    console.log('[DialoguePlayer] Auto-scroll resumed');
  });

  // Auto-hide after 5 seconds
  setTimeout(() => {
    if (indicator.parentNode) {
      indicator.remove();
    }
  }, 5000);
}
```

**CSS Changes**:
```css
/* NEW: Scroll paused indicator */
.scroll-paused-indicator {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 50;
  font-size: 0.875rem;
  color: #374151;
}

.scroll-paused-indicator .resume-scroll-btn {
  padding: 4px 12px;
  background: #B85C3C;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
}
```

**Success Criteria**:
- [ ] Current message centered vertically
- [ ] Smooth scroll animation (600ms)
- [ ] Manual scroll pauses auto-scroll
- [ ] Indicator shows "Auto-scroll paused"
- [ ] Resume button re-enables auto-scroll

---

### Task 4.4: Update Initial Render to Set States (20 min)
**File**: `js/components/dialogue-player.js`

**Changes**:
```javascript
// MODIFIED: Update _renderMessages() to set initial states
_renderMessages() {
  const messagesContainer = this.container.querySelector('.dialogue-player__messages');

  this.thread.messages.forEach((message, idx) => {
    const messageEl = this._renderMessage(message);

    // Set initial state based on index
    if (idx === 0) {
      // First message starts as current (will be revealed immediately)
      messageEl.classList.add('message-hidden'); // Hidden initially
    } else {
      // All other messages start as future (hidden)
      messageEl.classList.add('message-hidden', 'future');
    }

    messagesContainer.appendChild(messageEl);
    this.messageElements.set(message.id, messageEl);
  });

  // Optionally: Immediately reveal first message
  // this._revealMessage(this.thread.messages[0].id);
}
```

**Success Criteria**:
- [ ] First message marked for reveal (no `.future`)
- [ ] Subsequent messages marked as `.future`
- [ ] All messages initially hidden (`.message-hidden`)
- [ ] State classes applied before append

---

### Task 4.5: Test Progressive Focus Flow (30 min)
**Manual Testing**

**Test Cases**:
1. **Initial State**: All messages hidden, first message ready to reveal
2. **First Reveal**: Message 1 becomes current, no past messages
3. **Second Reveal**: Message 1 becomes past, message 2 becomes current
4. **Third Reveal**: Messages 1-2 are past, message 3 is current
5. **Manual Scroll**: User scrolls up, auto-scroll pauses, indicator shows
6. **Resume**: User clicks resume, auto-scroll re-enables

**Success Criteria**:
- [ ] Current message always at 100% opacity
- [ ] Past messages at 40% opacity
- [ ] Future messages show "生成中..." badge
- [ ] Badge pulses smoothly
- [ ] Auto-scroll centers current message
- [ ] Manual scroll pauses auto-scroll
- [ ] Indicator appears and functions

---

### Task 4.6: Add ARIA Attributes for Accessibility (20 min)
**File**: `js/components/dialogue-player.js`

**Changes**:
```javascript
// MODIFIED: Update _renderMessage() to add ARIA attributes
_renderMessage(message) {
  const messageEl = document.createElement('div');
  messageEl.className = 'dialogue-message';
  messageEl.dataset.id = message.id;

  // NEW: ARIA attributes
  messageEl.setAttribute('role', 'article');
  messageEl.setAttribute('aria-label', `Comment by ${this._getPersonaName(message.personaId)}`);

  // Content...
  messageEl.innerHTML = this._generateMessageHTML(message);

  return messageEl;
}

// MODIFIED: Update _revealMessage() to set aria-current
_revealMessage(messageId) {
  // ... existing code ...

  // Remove aria-current from previous
  if (this._currentMessageEl) {
    this._currentMessageEl.removeAttribute('aria-current');
  }

  // Set aria-current on new current message
  msgEl.setAttribute('aria-current', 'true');

  // ... rest of code ...
}
```

**Success Criteria**:
- [ ] Messages have `role="article"`
- [ ] Messages have descriptive `aria-label`
- [ ] Current message has `aria-current="true"`
- [ ] Screen reader announces "Current comment by [Name]"

---

## Phase 5: Quote Interaction Enhancement (1-2 hours)

### Task 5.1: Update Data Structure for Quotes (30 min)
**File**: `js/data.js` (or dialogue data files)

**Changes**:
```javascript
// MODIFIED: Add quote property to messages
const dialogueThreads = [
  {
    id: "thread-1",
    topic: { zh: "机械笔触中的自然韵律", en: "Natural Rhythm in Mechanical Brushstrokes" },
    participants: [
      { personaId: "su-shi", name: "Su Shi 苏轼" },
      { personaId: "wang-yangming", name: "Wang Yangming 王阳明" }
    ],
    messages: [
      {
        id: "msg-1",
        personaId: "su-shi",
        text: { zh: "机械与自然的对话...", en: "The dialogue between machine and nature..." },
        quote: null // Initial message, no quote
      },
      {
        id: "msg-2",
        personaId: "wang-yangming",
        text: { zh: "苏轼所言极是...", en: "Su Shi's words are absolutely true..." },
        quote: { // NEW: Quote reference
          messageId: "msg-1",
          personaId: "su-shi",
          text: { zh: "机械与自然的对话...", en: "The dialogue..." }
        }
      }
    ]
  }
];
```

**Migration Script**:
```javascript
// Convert existing blockquote HTML to quote data
function migrateQuoteBlocks(threads) {
  threads.forEach(thread => {
    thread.messages.forEach((msg, idx) => {
      // Parse HTML to find blockquote
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = msg.text.zh;
      const blockquote = tempDiv.querySelector('.message-quote');

      if (blockquote) {
        // Extract quote data
        const cite = blockquote.querySelector('cite').textContent;
        const quoteText = blockquote.querySelector('p').textContent;
        const personaId = findPersonaIdByName(cite);

        // Add quote property
        msg.quote = {
          messageId: thread.messages[idx - 1]?.id || null,
          personaId: personaId,
          text: { zh: quoteText, en: quoteText } // TODO: Add EN translation
        };

        // Remove blockquote from text
        blockquote.remove();
        msg.text.zh = tempDiv.innerHTML;
      }
    });
  });
}
```

**Success Criteria**:
- [ ] Messages with quotes have `.quote` property
- [ ] Quote structure: `{ messageId, personaId, text }`
- [ ] Old blockquote HTML removed from `.text`
- [ ] Migration script runs without errors

---

### Task 5.2: Render Inline Quote Reference (35 min)
**File**: `js/components/dialogue-player.js`

**Changes**:
```javascript
// MODIFIED: Update _renderMessage() to include quote ref
_renderMessage(message) {
  const messageEl = document.createElement('div');
  messageEl.className = 'dialogue-message';
  messageEl.dataset.id = message.id;
  messageEl.setAttribute('role', 'article');

  let contentHTML = '';

  // NEW: Render quote reference if present
  if (message.quote) {
    contentHTML += this._renderQuoteRef(message.quote);
  }

  // Render message content
  contentHTML += this._renderMessageContent(message);

  messageEl.innerHTML = contentHTML;
  return messageEl;
}

// NEW METHOD: Render quote reference
_renderQuoteRef(quote) {
  const persona = VULCA_DATA.personas.find(p => p.id === quote.personaId);
  const quoteId = `${quote.messageId}-quote`;

  return `
    <div class="quote-ref"
         data-quote-id="${quoteId}"
         role="button"
         tabindex="0"
         aria-haspopup="true"
         aria-expanded="false"
         aria-label="Reply to ${persona.nameZh} ${persona.nameEn}, press Enter to view quote">
      ↩ Reply to <span class="quote-ref-author" style="color: ${persona.color};">${persona.nameZh} ${persona.nameEn}</span>

      <div class="quote-ref-tooltip">
        <cite class="quote-tooltip-author" style="color: ${persona.color};">${persona.nameZh} ${persona.nameEn}</cite>
        <p class="quote-tooltip-text">${quote.text.zh}</p>
      </div>
    </div>
  `;
}
```

**Success Criteria**:
- [ ] Quote reference displays "↩ Reply to [Name]"
- [ ] Author name uses persona color
- [ ] Tooltip structure embedded (hidden by default)
- [ ] ARIA attributes present

---

### Task 5.3: Implement Desktop Hover Tooltip (25 min)
**File**: `styles/components/dialogue-player.css`

**Changes**:
```css
/* NEW: Quote reference styles (after line 267) */
.quote-ref {
  display: inline-block;
  font-size: 0.875rem;
  font-style: italic;
  color: #6b7280;
  cursor: pointer;
  margin-bottom: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  position: relative;
}

.quote-ref:hover {
  background-color: #f3f4f6;
}

.quote-ref-author {
  font-weight: 600;
  font-style: normal;
}

/* Desktop hover tooltip */
@media (hover: hover) and (pointer: fine) {
  .quote-ref-tooltip {
    display: none;
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 8px;
    padding: 12px 16px;
    max-width: 400px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 100;
    white-space: normal;
    font-style: normal;
  }

  .quote-ref:hover .quote-ref-tooltip {
    display: block;
    animation: fadeIn 200ms ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  /* Tooltip arrow */
  .quote-ref-tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: #ffffff;
    filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
  }

  .quote-tooltip-author {
    display: block;
    font-weight: 600;
    font-size: 0.9rem;
    margin-bottom: 6px;
  }

  .quote-tooltip-text {
    font-size: 0.875rem;
    line-height: 1.5;
    color: #374151;
    margin: 0;
  }
}
```

**Success Criteria**:
- [ ] Tooltip hidden by default
- [ ] Tooltip appears on hover within 200ms
- [ ] Tooltip positioned above reference
- [ ] Tooltip has arrow pointing down
- [ ] Max-width 400px prevents overflow

---

### Task 5.4: Implement Mobile Click Modal (40 min)
**Files**:
- `js/components/dialogue-player.js` (logic)
- `styles/components/dialogue-player.css` (styles)

**Changes (JS)**:
```javascript
// In _attachEventListeners() or constructor
_attachQuoteInteractionHandlers() {
  const quoteRefs = this.container.querySelectorAll('.quote-ref');

  quoteRefs.forEach(ref => {
    // Click handler (mobile)
    ref.addEventListener('click', (e) => {
      if (window.matchMedia('(hover: none)').matches) {
        e.preventDefault();
        const quoteId = ref.dataset.quoteId;
        this._showQuoteModal(quoteId);
      }
    });

    // Keyboard handler (accessibility)
    ref.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const quoteId = ref.dataset.quoteId;

        if (window.matchMedia('(hover: none)').matches) {
          this._showQuoteModal(quoteId);
        }
        // On desktop, hover handles it (no action needed)
      }
    });
  });
}

// NEW METHOD: Show modal
_showQuoteModal(quoteId) {
  const quote = this._getQuoteByIdFromCurrentMessages(quoteId);
  if (!quote) {
    console.error(`[DialoguePlayer] Quote not found: ${quoteId}`);
    return;
  }

  const backdrop = document.createElement('div');
  backdrop.className = 'quote-modal-backdrop active';

  const modal = document.createElement('div');
  modal.className = 'quote-modal';
  modal.innerHTML = `
    <button class="quote-modal-close" aria-label="Close">&times;</button>
    <cite class="quote-modal-author" style="color: ${quote.persona.color};">${quote.persona.nameZh} ${quote.persona.nameEn}</cite>
    <p class="quote-modal-text">${quote.text.zh}</p>
  `;

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  // Dismiss handlers
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      this._closeQuoteModal(backdrop);
    }
  });

  modal.querySelector('.quote-modal-close').addEventListener('click', () => {
    this._closeQuoteModal(backdrop);
  });

  // Keyboard handler (Escape to close)
  const escapeHandler = (e) => {
    if (e.key === 'Escape') {
      this._closeQuoteModal(backdrop);
      document.removeEventListener('keydown', escapeHandler);
    }
  };
  document.addEventListener('keydown', escapeHandler);

  console.log('[DialoguePlayer] Quote modal opened');
}

// NEW METHOD: Close modal
_closeQuoteModal(backdrop) {
  backdrop.classList.remove('active');
  setTimeout(() => {
    backdrop.remove();
    console.log('[DialoguePlayer] Quote modal closed');
  }, 300); // After animation
}

// NEW METHOD: Get quote data by ID
_getQuoteByIdFromCurrentMessages(quoteId) {
  // Extract messageId from quoteId format: "{messageId}-quote"
  const messageId = quoteId.replace('-quote', '');
  const message = this.thread.messages.find(m => m.id === messageId);

  if (!message || !message.quote) {
    return null;
  }

  const persona = VULCA_DATA.personas.find(p => p.id === message.quote.personaId);

  return {
    text: message.quote.text,
    persona: persona
  };
}
```

**Changes (CSS)**:
```css
/* Mobile click modal */
@media (hover: none) or (pointer: coarse) {
  .quote-ref-tooltip {
    display: none !important; /* Hide tooltip on mobile */
  }

  .quote-modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: none;
    align-items: center;
    justify-content: center;
    animation: fadeIn 300ms ease-out;
  }

  .quote-modal-backdrop.active {
    display: flex;
  }

  .quote-modal {
    position: relative;
    background: #ffffff;
    border-radius: 12px;
    padding: 24px;
    max-width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    animation: slideUp 300ms ease-out;
  }

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .quote-modal-close {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 32px;
    height: 32px;
    background: #f3f4f6;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    line-height: 1;
    color: #6b7280;
    transition: background 0.2s ease;
  }

  .quote-modal-close:hover {
    background: #e5e7eb;
  }

  .quote-modal-author {
    display: block;
    font-weight: 600;
    font-size: 1rem;
    margin-bottom: 12px;
  }

  .quote-modal-text {
    font-size: 0.95rem;
    line-height: 1.6;
    color: #374151;
    margin: 0;
  }
}
```

**Success Criteria**:
- [ ] Tap on quote ref opens modal (mobile only)
- [ ] Modal centered with backdrop
- [ ] Close button works
- [ ] Tap backdrop dismisses modal
- [ ] Escape key closes modal
- [ ] Animations smooth (300ms)

---

### Task 5.5: Test Quote Interactions (30 min)
**Manual Testing**

**Desktop Tests** (Chrome DevTools device toolbar OFF):
1. Hover over quote reference → Tooltip appears
2. Move mouse away → Tooltip disappears
3. Hover near viewport edge → Tooltip repositions (if implemented)
4. Tab to quote ref → Focus visible
5. Press Enter → Tooltip remains (or modal opens if mobile detection wrong)

**Mobile Tests** (Chrome DevTools device toolbar ON, iPhone SE):
1. Tap quote reference → Modal opens
2. Tap backdrop → Modal closes
3. Tap close button → Modal closes
4. Open modal, press Escape → Modal closes
5. Tab to quote ref, press Enter → Modal opens

**Success Criteria**:
- [ ] Desktop: Hover shows tooltip, no modal
- [ ] Mobile: Click shows modal, no tooltip
- [ ] Keyboard: Tab + Enter works on both
- [ ] Dismissal: All methods work (backdrop, button, Escape)

---

## Phase 6: Integration Testing & Polish (1 hour)

### Task 6.1: Cross-Browser Testing (20 min)
**Browsers**: Chrome, Firefox, Safari, Edge

**Test Cases**:
1. Header gradient displays correctly
2. Typography scales responsively
3. Progressive focus states work
4. Quote tooltips/modals function
5. Loading/error states display

**Success Criteria**:
- [ ] All features work in Chrome 90+
- [ ] All features work in Firefox 88+
- [ ] All features work in Safari 14+
- [ ] All features work in Edge 90+

---

### Task 6.2: Accessibility Audit (20 min)
**Tools**: axe DevTools, Lighthouse, NVDA/VoiceOver

**Checks**:
1. Color contrast ≥ 4.5:1 (WCAG AA)
2. Keyboard navigation works
3. ARIA attributes correct
4. Screen reader announcements
5. Focus indicators visible

**Success Criteria**:
- [ ] Zero critical axe violations
- [ ] Lighthouse Accessibility score ≥ 95
- [ ] Screen reader announces all states
- [ ] All interactions keyboard-accessible

---

### Task 6.3: Performance Testing (20 min)
**Metrics**: FPS, paint times, layout shifts

**Tests**:
1. Record FPS during message reveal (target: 60 FPS)
2. Measure time to first render (target: <500ms)
3. Check for layout shifts (CLS target: <0.1)
4. Test with 50+ messages (stress test)

**Tools**: Chrome DevTools Performance tab

**Success Criteria**:
- [ ] 60 FPS during all animations
- [ ] First render <500ms after data load
- [ ] Zero layout shifts (CLS = 0)
- [ ] Smooth performance with 50+ messages

---

## Summary

**Total Estimated Time**: 6-10 hours

| Phase | Tasks | Time Estimate |
|-------|-------|---------------|
| Phase 1: Color System | 5 tasks | 1-2 hours |
| Phase 2: Typography | 6 tasks | 1-2 hours |
| Phase 3: Content Visibility | 4 tasks | 1 hour |
| Phase 4: Progressive Focus | 6 tasks | 2-3 hours |
| Phase 5: Quote Interaction | 5 tasks | 1-2 hours |
| Phase 6: Integration Testing | 3 tasks | 1 hour |
| **Total** | **29 tasks** | **6-10 hours** |

---

## Success Criteria (Overall)

### Visual Alignment ✅
- [ ] Header gradient uses warm tones (#B85C3C → #D4A574)
- [ ] Colors pass WCAG AA contrast requirements
- [ ] No purple or cold colors in dialogue UI

### Typography ✅
- [ ] Title never overflows on 375px mobile
- [ ] Bilingual title fits comfortably in header
- [ ] Clear visual hierarchy (ZH primary, EN secondary)
- [ ] Long titles show tooltips

### Content Visibility ✅
- [ ] All dialogue threads render without empty panels
- [ ] Console shows no JavaScript errors during render
- [ ] Loading states visible before content appears
- [ ] Error states show user-friendly messages

### Progressive Focus ✅
- [ ] Current message centered and full opacity
- [ ] Past messages dimmed to 40% opacity
- [ ] Future messages show "生成中..." badge
- [ ] Smooth auto-scroll to current message
- [ ] Manual scroll pauses auto-scroll with indicator

### Quote Interaction ✅
- [ ] Quote blocks replaced with inline references
- [ ] Desktop: Hover shows tooltip within 200ms
- [ ] Mobile: Tap opens modal/popover
- [ ] Keyboard accessible (focus to reveal)

### Accessibility ✅
- [ ] All interactions keyboard-accessible
- [ ] Screen readers announce all states
- [ ] ARIA attributes correct
- [ ] Zero critical accessibility violations

### Performance ✅
- [ ] 60 FPS during all animations
- [ ] First render <500ms
- [ ] Zero layout shifts
- [ ] Smooth with 50+ messages

---

## Rollback Plan

If issues arise during implementation:

1. **Phase-by-Phase Rollback**: Each phase is independent, can be reverted individually
2. **Git Commits**: Commit after each phase completion for easy revert
3. **Feature Flags**: Add `enableProgressiveFocus`, `enableQuoteInteraction` config options
4. **CSS Overrides**: Quick revert by commenting out new CSS sections

**Commands**:
```bash
# Revert last phase
git revert HEAD

# Revert entire change
git revert <first-commit-hash>^..<last-commit-hash>

# Disable specific feature via config
// In dialogue-player.js
const config = {
  enableProgressiveFocus: false, // Disable if issues
  enableQuoteInteraction: true
};
```
