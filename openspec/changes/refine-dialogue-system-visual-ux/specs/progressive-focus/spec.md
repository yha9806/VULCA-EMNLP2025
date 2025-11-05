# Spec: Progressive Focus Interaction

**Change ID**: `refine-dialogue-system-visual-ux`
**Capability**: Progressive Focus Interaction
**Status**: Proposed

---

## Overview

Implement progressive focus interaction where the current message is highlighted (full opacity, centered), past messages are dimmed (40% opacity), and future messages are dimmed with a "生成中..." badge.

**User Request**:
> "对话的信息板块交互不明显，可以只居中显示最新出现的评论内容板块，然后上文板块变成半透明，下文板块也是半透明，并显示（生成中...）这样的字样"

---

## Requirements

### ADDED

#### REQ-FOCUS-001: Past Message Dimming
**Priority**: P0

Messages that have already been revealed (before the current message) SHALL be displayed with 40% opacity to provide context while focusing attention on the current message.

**Specification**:
- CSS class: `.past`
- Opacity: 0.4
- Transform: None (no scale changes)
- Transition: 300ms ease-out

**Validation**:
```css
/* styles/components/dialogue-player.css */
.dialogue-message.past {
  opacity: 0.4;
  transition: opacity 0.3s ease-out;
}
```

**Acceptance Criteria**:
- [ ] Past messages have 40% opacity
- [ ] Transition is smooth (300ms)
- [ ] Text remains readable (contrast still sufficient)

---

#### REQ-FOCUS-002: Current Message Emphasis
**Priority**: P0

The currently active message SHALL be displayed with full opacity, centered in the viewport, and with a subtle scale emphasis.

**Specification**:
- CSS class: `.current`
- Opacity: 1.0
- Transform: `scale(1.02)` (subtle emphasis)
- Scroll behavior: `scrollIntoView({ block: 'center', behavior: 'smooth' })`
- Transition: 300ms ease-out

**Validation**:
```css
.dialogue-message.current {
  opacity: 1;
  transform: scale(1.02);
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;
}
```

```javascript
// In DialoguePlayer._revealMessage()
msgEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
```

**Acceptance Criteria**:
- [ ] Current message has 100% opacity
- [ ] Message is centered vertically in viewport
- [ ] Subtle scale (1.02) is applied
- [ ] Auto-scroll is smooth (not jarring)

---

#### REQ-FOCUS-003: Future Message Dimming
**Priority**: P0

Messages that have not yet been revealed (after the current message) SHALL be displayed with 40% opacity to indicate they are upcoming.

**Specification**:
- CSS class: `.future`
- Opacity: 0.4
- Transform: None
- Transition: 300ms ease-out

**Validation**:
```css
.dialogue-message.future {
  opacity: 0.4;
  transition: opacity 0.3s ease-out;
}
```

**Acceptance Criteria**:
- [ ] Future messages have 40% opacity
- [ ] Transition is smooth when message becomes current
- [ ] Messages are visible but clearly not active

---

#### REQ-FOCUS-004: "生成中..." Badge for Future Messages
**Priority**: P0

Future messages SHALL display a "生成中..." (Generating...) badge to indicate they are pending.

**Specification**:
- Badge position: Bottom-right corner of message bubble
- Badge style: Semi-transparent overlay with pulsing animation
- Text: "生成中..." (Chinese) / "Generating..." (English)
- Animation: Fade in/out pulse (1.5s loop)

**Validation**:
```css
.dialogue-message.future::after {
  content: "生成中...";
  position: absolute;
  bottom: 12px;
  right: 16px;
  padding: 4px 12px;
  background: rgba(102, 126, 234, 0.15);
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #667eea;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
```

**Acceptance Criteria**:
- [ ] Badge displays "生成中..." on future messages
- [ ] Badge pulses smoothly (1.5s cycle)
- [ ] Badge does not overlap message content
- [ ] Badge disappears when message becomes current

---

#### REQ-FOCUS-005: State Transition Management
**Priority**: P0

The dialogue player SHALL manage state transitions when a new message is revealed: current → past, hidden → current, future → current.

**Specification**:
- Track current message index
- On reveal:
  1. Remove `.current` from previous message, add `.past`
  2. Remove `.message-hidden`, `.future` from new message, add `.current`
  3. Update all remaining unrevealed messages with `.future`
  4. Scroll new current message into center

**Validation**:
```javascript
// In DialoguePlayer class
_revealMessage(messageId) {
  // Step 1: Transition previous current to past
  if (this._currentMessageEl) {
    this._currentMessageEl.classList.remove('current');
    this._currentMessageEl.classList.add('past');
  }

  // Step 2: Reveal new current message
  const msgEl = this.messageElements.get(messageId);
  msgEl.classList.remove('message-hidden', 'future');
  msgEl.classList.add('current');

  this._currentMessageEl = msgEl;

  // Step 3: Mark future messages
  this._markFutureMessages();

  // Step 4: Scroll to center
  msgEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

_markFutureMessages() {
  const currentIndex = this.currentMessageIndex;
  this.thread.messages.forEach((msg, idx) => {
    if (idx > currentIndex) {
      const el = this.messageElements.get(msg.id);
      if (!el.classList.contains('message-hidden')) {
        el.classList.add('future');
      }
    }
  });
}
```

**Acceptance Criteria**:
- [ ] Only one message has `.current` class at a time
- [ ] Previous current message transitions to `.past`
- [ ] All unrevealed messages have `.future` class
- [ ] State transitions are atomic (no race conditions)

---

#### REQ-FOCUS-006: Disable Auto-Scroll in Manual Mode
**Priority**: P1

When the user manually scrolls the message container, auto-scroll to current message SHALL be temporarily disabled until the next manual reveal action (play/next button).

**Specification**:
- Listen for `scroll` events on `.dialogue-player__messages`
- Set `autoScrollDisabled = true` on manual scroll
- Re-enable on play/pause/next button click
- Show visual indicator (e.g., "Auto-scroll paused" tooltip)

**Validation**:
```javascript
_attachScrollListener() {
  this.messagesContainer.addEventListener('scroll', () => {
    if (!this._isAutoScrolling) {
      this.autoScrollDisabled = true;
      this._showScrollPausedIndicator();
    }
  });
}

_revealMessage(messageId) {
  // ... state transitions ...

  if (!this.autoScrollDisabled) {
    this._isAutoScrolling = true;
    msgEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => { this._isAutoScrolling = false; }, 600); // After scroll completes
  }
}
```

**Acceptance Criteria**:
- [ ] Manual scroll pauses auto-scroll
- [ ] Indicator shows "Auto-scroll paused"
- [ ] Auto-scroll resumes on play/next button click

---

### MODIFIED

#### REQ-FOCUS-MODIFIED-001: Update Reveal Animation
**Element**: `.dialogue-message.message-appearing`

**Before**:
```css
.dialogue-message.message-appearing {
  animation: fadeInUp 0.4s ease-out forwards;
}
```

**After**:
```css
.dialogue-message.message-appearing {
  animation: fadeInUp 0.4s ease-out forwards;
}

/* Now also adds .current class immediately */
```

**Rationale**: Simplify animation - appearing messages should immediately become current, no intermediate state needed.

---

### REMOVED

None (new classes added, existing behavior extended)

---

## Scenarios

### Scenario 1: Current Message is Centered and Emphasized

**Given** the dialogue player is in animated mode
**And** 3 messages have been revealed
**When** the 4th message is revealed
**Then** the 4th message MUST be centered vertically in the viewport
**And** the 4th message MUST have 100% opacity
**And** the 4th message MUST have a subtle scale of 1.02
**And** messages 1-3 MUST have 40% opacity (past state)

**Validation**:
```javascript
// After revealing 4th message
const currentMsg = document.querySelector('.dialogue-message.current');
const pastMsgs = document.querySelectorAll('.dialogue-message.past');

assert(currentMsg !== null, 'Current message exists');
assert(window.getComputedStyle(currentMsg).opacity === '1', 'Current opacity 100%');

const transform = window.getComputedStyle(currentMsg).transform;
assert(transform.includes('scale(1.02)') || transform.includes('matrix(1.02'), 'Current scaled');

assert(pastMsgs.length === 3, '3 past messages');
pastMsgs.forEach(msg => {
  assert(window.getComputedStyle(msg).opacity === '0.4', 'Past opacity 40%');
});
```

---

### Scenario 2: Future Messages Show "生成中..." Badge

**Given** the dialogue player has 10 messages total
**And** 5 messages have been revealed
**When** the user views the message container
**Then** messages 6-10 MUST display the "生成中..." badge
**And** the badge MUST pulse with a 1.5s animation
**And** the badge text MUST be "生成中..." in Chinese

**Validation**:
```javascript
const futureMsgs = document.querySelectorAll('.dialogue-message.future');

assert(futureMsgs.length === 5, '5 future messages');

futureMsgs.forEach(msg => {
  const badge = window.getComputedStyle(msg, '::after');
  assert(badge.content.includes('生成中'), 'Badge shows "生成中..."');

  // Check animation (harder to test, use visual inspection)
  const animation = badge.animation;
  assert(animation.includes('pulse'), 'Pulse animation applied');
});
```

---

### Scenario 3: State Transitions on Reveal

**Given** message 5 is current
**When** message 6 is revealed
**Then** message 5 MUST transition from `.current` to `.past`
**And** message 6 MUST transition from `.future` to `.current`
**And** messages 7+ MUST remain in `.future` state
**And** the transition MUST be smooth (300ms)

**Validation**:
```javascript
// Before reveal
const msg5 = document.querySelector('.dialogue-message[data-id="message-5"]');
const msg6 = document.querySelector('.dialogue-message[data-id="message-6"]');

assert(msg5.classList.contains('current'), 'Msg 5 is current');
assert(msg6.classList.contains('future'), 'Msg 6 is future');

// Trigger reveal
dialoguePlayer._revealMessage('message-6');

// After reveal (wait for transition)
setTimeout(() => {
  assert(msg5.classList.contains('past'), 'Msg 5 is now past');
  assert(msg6.classList.contains('current'), 'Msg 6 is now current');

  const msg7 = document.querySelector('.dialogue-message[data-id="message-7"]');
  assert(msg7.classList.contains('future'), 'Msg 7 still future');
}, 350); // After 300ms transition
```

---

### Scenario 4: Auto-Scroll Centers Current Message

**Given** the dialogue player is in animated mode
**And** the message container is scrollable (content height > container height)
**When** a new message is revealed
**Then** the message container MUST auto-scroll smoothly
**And** the new current message MUST be centered vertically in the viewport
**And** the scroll duration MUST be approximately 600ms

**Validation**:
```javascript
const container = document.querySelector('.dialogue-player__messages');
const initialScrollTop = container.scrollTop;

// Reveal next message
dialoguePlayer._revealMessage('message-7');

// After smooth scroll completes
setTimeout(() => {
  const currentMsg = document.querySelector('.dialogue-message.current');
  const msgRect = currentMsg.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  const msgCenter = msgRect.top + msgRect.height / 2;
  const containerCenter = containerRect.top + containerRect.height / 2;

  // Allow 20px tolerance for "centered"
  assert(Math.abs(msgCenter - containerCenter) < 20, 'Message centered in viewport');
}, 700); // After 600ms scroll
```

---

### Scenario 5: Manual Scroll Pauses Auto-Scroll

**Given** the dialogue player is playing automatically
**And** auto-scroll is enabled
**When** the user manually scrolls up to read past messages
**Then** auto-scroll MUST be paused
**And** a visual indicator MUST appear saying "Auto-scroll paused"
**And** the dialogue player MUST continue revealing messages (without scrolling)

**Validation**:
```javascript
// Start playback
dialoguePlayer.play();

// Simulate manual scroll
const container = document.querySelector('.dialogue-player__messages');
container.scrollTop = 100; // User scrolls up
container.dispatchEvent(new Event('scroll'));

// Check auto-scroll disabled
assert(dialoguePlayer.autoScrollDisabled === true, 'Auto-scroll paused');

const indicator = document.querySelector('.scroll-paused-indicator');
assert(indicator !== null, 'Indicator visible');
assert(indicator.textContent.includes('Auto-scroll paused'), 'Indicator text correct');
```

---

## Dependencies

- **Upstream**: Typography spec (message layout must be stable)
- **Downstream**: Content visibility spec (must handle missing messages gracefully)

---

## Testing Strategy

### Manual Testing
1. **Visual Focus**: Play dialogue, verify current message is bright, past/future are dim
2. **Badge Animation**: Verify "生成中..." badge pulses smoothly
3. **Scroll Behavior**: Verify auto-scroll centers current message
4. **Manual Scroll**: Scroll manually, verify auto-scroll pauses

### Automated Testing
1. **State Transition**: Unit tests for `.past`, `.current`, `.future` class logic
2. **Scroll Position**: Measure scroll position after reveal, verify centering
3. **Performance**: Ensure transitions maintain 60 FPS (no jank)

---

## Accessibility

### Screen Reader Support
- **Past messages**: Announce as "Previous comment by [name]"
- **Current message**: Announce as "Current comment by [name], [content]"
- **Future messages**: Announce as "Upcoming comment by [name], generating"

**Implementation**:
```html
<div class="dialogue-message current" role="article" aria-current="true" aria-label="Current comment by Su Shi">
  <!-- content -->
</div>

<div class="dialogue-message future" role="article" aria-label="Upcoming comment by Wang Yangming, generating">
  <!-- content -->
</div>
```

### Keyboard Navigation
- **Tab**: Focus on current message
- **Arrow Up/Down**: Navigate between messages (override auto-scroll)
- **Space**: Pause/resume playback

---

## Performance

### Optimization
- Use CSS `will-change: opacity, transform` on `.dialogue-message` to hint GPU acceleration
- Limit `scrollIntoView` calls to 1 per reveal (no repeated calls)
- Debounce manual scroll listener (prevent excessive `autoScrollDisabled` toggles)

**Validation**:
```css
.dialogue-message {
  will-change: opacity, transform;
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;
}
```

---

## Migration Notes

### Breaking Changes
None - new CSS classes added, existing behavior extended.

### Rollback
Remove progressive focus classes:
```javascript
// Revert to original behavior (all messages 100% opacity, no centering)
document.querySelectorAll('.dialogue-message').forEach(msg => {
  msg.classList.remove('past', 'current', 'future');
});
```

---

## Success Metrics

- [ ] Current message always centered and at 100% opacity
- [ ] Past messages dimmed to 40% opacity
- [ ] Future messages show "生成中..." badge with pulse animation
- [ ] Auto-scroll smoothly centers current message (600ms)
- [ ] Manual scroll pauses auto-scroll with visible indicator
- [ ] User feedback confirms improved focus and clarity
