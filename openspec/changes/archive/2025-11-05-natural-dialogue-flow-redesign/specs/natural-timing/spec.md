# Spec: Natural Timing Engine

**Capability**: `natural-timing`
**Change ID**: `natural-dialogue-flow-redesign`
**Created**: 2025-11-05

---

## Overview

Replace fixed timestamp-based animation with randomized natural timing that simulates human conversation pacing ("看似像是在思考" - looks like thinking).

---

## ADDED Requirements

### Requirement 1: Random Delay Generation

The system SHALL provide a utility function to generate random delays within a specified range.

**Rationale**: Natural conversation has unpredictable pauses; bounded randomness provides variability while maintaining acceptable pacing.

**Dependencies**: None

#### Scenario: Generate random delay within bounds

**Given** a random delay generator function
**When** called with min=1000ms and max=2000ms
**Then** it MUST return an integer between 1000 and 2000 (inclusive)
**And** the distribution SHOULD be uniform across the range

```javascript
// Example usage
const delay = this._randomDelay(1000, 2000);
console.assert(delay >= 1000 && delay <= 2000, 'Delay out of bounds');
```

---

### Requirement 2: Natural Delay Calculation

The system SHALL calculate message appearance delays based on message length, position, and bounded randomness.

**Rationale**: Longer messages require more "thinking time"; first message should appear faster to engage users immediately.

**Dependencies**: Requirement 1 (random delay generation)

#### Scenario: Calculate delay for first message

**Given** a dialogue with multiple messages
**When** calculating delay for the first message (index 0)
**Then** the delay MUST be 80% of the normal thinking time
**And** the delay MUST be at least 800ms
**And** the delay SHOULD NOT exceed 2500ms

```javascript
const firstMessageDelay = this._calculateNaturalDelay(messages[0], 0);
console.assert(firstMessageDelay >= 800, 'First message too fast');
console.assert(firstMessageDelay <= 2500, 'First message too slow');
```

#### Scenario: Calculate delay proportional to message length

**Given** a message with 200 characters of text
**When** calculating the natural delay
**Then** the delay MUST include base thinking time (1500-3000ms)
**And** the delay MUST add 500ms for every 100 characters
**And** the total delay MUST NOT exceed 5000ms

```javascript
// Message with 200 chars
const message = { textZh: 'x'.repeat(200), textEn: 'x'.repeat(200) };
const delay = this._calculateNaturalDelay(message, 1);

// Base (1500-3000) + length adjustment (1000) = 2500-4000ms
console.assert(delay >= 2500, 'Delay too short for long message');
console.assert(delay <= 5000, 'Delay exceeds maximum');
```

#### Scenario: Cap maximum delay at 5 seconds

**Given** a very long message (1000+ characters)
**When** calculating the natural delay
**Then** the delay MUST NOT exceed 5000ms
**Even if** the length-based calculation suggests a longer delay

```javascript
const longMessage = { textZh: 'x'.repeat(1000), textEn: 'x'.repeat(1000) };
const delay = this._calculateNaturalDelay(longMessage, 5);
console.assert(delay <= 5000, 'Delay not capped at maximum');
```

---

### Requirement 3: Auto-Play on Initialization

The system SHALL automatically start dialogue playback without user interaction.

**Rationale**: User expects dialogue to unfold naturally upon opening, not wait for manual trigger.

**Dependencies**: Requirement 2 (delay calculation)

#### Scenario: Auto-start playback after initialization

**Given** a DialoguePlayer instance is created
**When** the constructor completes
**Then** playback MUST start automatically within 100ms
**And** the first message MUST appear within 2.5 seconds

```javascript
const player = new DialoguePlayer(dialogue, container);

// Verify auto-start
setTimeout(() => {
  const firstMessage = container.querySelector('.dialogue-message');
  console.assert(firstMessage.classList.contains('message-appearing'),
    'First message did not appear');
}, 2600); // Slightly after maximum first-message delay
```

---

### Requirement 4: Cumulative Timing

The system SHALL schedule messages with cumulative delays, not simultaneous timers.

**Rationale**: Messages must appear sequentially, not overlapping; each message's timing depends on the previous one.

**Dependencies**: Requirement 2 (delay calculation)

#### Scenario: Schedule messages sequentially

**Given** a dialogue with 3 messages
**And** Message 1 has delay 1000ms
**And** Message 2 has delay 2000ms
**And** Message 3 has delay 1500ms
**When** playback starts
**Then** Message 1 MUST appear at t=1000ms
**And** Message 2 MUST appear at t=3000ms (1000 + 2000)
**And** Message 3 MUST appear at t=4500ms (1000 + 2000 + 1500)

```javascript
let cumulativeDelay = 0;
const appearTimes = [];

messages.forEach((msg, index) => {
  const delay = this._calculateNaturalDelay(msg, index);
  cumulativeDelay += delay;
  appearTimes.push(cumulativeDelay);
});

// Verify cumulative timing
console.assert(appearTimes[0] < appearTimes[1], 'Not sequential');
console.assert(appearTimes[1] < appearTimes[2], 'Not sequential');
```

---

### Requirement 5: Smooth Message Reveal

The system SHALL reveal hidden messages with fade-in animation and auto-scroll.

**Rationale**: Abrupt appearance feels jarring; smooth transitions enhance perceived quality.

**Dependencies**: Requirement 4 (cumulative timing)

#### Scenario: Fade in message on reveal

**Given** a message with class `message-hidden`
**When** the reveal timeout triggers
**Then** the `message-hidden` class MUST be removed
**And** the `message-appearing` class MUST be added
**And** the message opacity MUST transition from 0 to 1
**And** the message position MUST transition from translateY(10px) to translateY(0)
**And** the animation duration MUST be 400ms

```javascript
const msgEl = container.querySelector('.dialogue-message.message-hidden');

// Trigger reveal
player._revealMessage(messageId);

// Verify classes
console.assert(!msgEl.classList.contains('message-hidden'), 'Still hidden');
console.assert(msgEl.classList.contains('message-appearing'), 'Not appearing');

// Verify animation (requires waiting)
setTimeout(() => {
  const opacity = window.getComputedStyle(msgEl).opacity;
  console.assert(parseFloat(opacity) === 1, 'Opacity not fully revealed');
}, 450); // After 400ms animation + 50ms buffer
```

#### Scenario: Auto-scroll to revealed message

**Given** a message that is off-screen
**When** the message is revealed
**Then** the container MUST scroll to bring the message into view
**And** the scroll behavior MUST be smooth
**And** the message SHOULD be positioned at the bottom of the viewport

```javascript
// Reveal message
player._revealMessage(messageId);

// Verify scrollIntoView was called (requires spy/mock)
console.assert(msgEl.scrollIntoView.calledWith({
  behavior: 'smooth',
  block: 'end'
}), 'scrollIntoView not called correctly');
```

---

## MODIFIED Requirements

### Requirement 6: Remove Manual Playback Controls

The system SHALL NOT render playback controls (play/pause, speed, scrubber).

**Rationale**: User feedback explicitly states "不需要动画模式和对话模式" (don't need animation/dialogue modes); auto-play eliminates need for manual controls.

**Changes**:
- **Before**: `_initializeControls()` rendered play/pause button, speed selector, timeline scrubber, replay button
- **After**: `_initializeControls()` renders nothing (or minimal header only)

#### Scenario: Verify no playback controls in DOM

**Given** a DialoguePlayer instance is initialized
**When** the UI is rendered
**Then** the DOM MUST NOT contain elements with class `control-button`
**And** the DOM MUST NOT contain elements with class `speed-selector`
**And** the DOM MUST NOT contain elements with class `timeline-scrubber`
**And** the DOM MUST NOT contain elements with class `replay-btn`

```javascript
const player = new DialoguePlayer(dialogue, container);

// Verify absence of controls
console.assert(!container.querySelector('.control-button'),
  'Play/pause button still present');
console.assert(!container.querySelector('.speed-selector'),
  'Speed selector still present');
console.assert(!container.querySelector('.timeline-scrubber'),
  'Timeline scrubber still present');
console.assert(!container.querySelector('.replay-btn'),
  'Replay button still present');
```

---

### Requirement 7: Remove Mode Toggle UI

The system SHALL NOT render mode toggle buttons (View/Animate).

**Rationale**: User feedback explicitly rejects mode toggle design; single natural flow is simpler and more intuitive.

**Changes**:
- **Before**: `_initializeControls()` rendered mode toggle with "查看/View" and "动画/Animate" buttons
- **After**: No mode toggle; single playback mode only

#### Scenario: Verify no mode toggle in DOM

**Given** a DialoguePlayer instance is initialized
**When** the UI is rendered
**Then** the DOM MUST NOT contain elements with class `mode-toggle-container`
**And** the DOM MUST NOT contain elements with class `mode-toggle-btn`
**And** the DOM MUST NOT contain elements with class `mode-toggle-label`

```javascript
const player = new DialoguePlayer(dialogue, container);

// Verify absence of mode toggle
console.assert(!container.querySelector('.mode-toggle-container'),
  'Mode toggle container still present');
console.assert(!container.querySelector('.mode-toggle-btn'),
  'Mode toggle buttons still present');
```

---

## REMOVED Requirements

### Requirement 8: Fixed Timestamp Animation (REMOVED)

The system previously used fixed timestamps for message rendering:

```javascript
// OLD IMPLEMENTATION (REMOVED)
messages = [
  { id: 1, timestamp: 0 },
  { id: 2, timestamp: 2000 },
  { id: 3, timestamp: 4000 }
];

_checkTimeline(currentTime) {
  this.thread.messages.forEach(msg => {
    if (msg.timestamp <= currentTime && !this.renderedMessages.has(msg.id)) {
      this._renderMessage(msg);
    }
  });
}
```

**Reason for Removal**: User feedback states timing should be random ("随机时间间隔"), not fixed and mechanical.

**Replacement**: Natural timing with randomized delays (Requirement 2)

---

### Requirement 9: Manual Mode Switching (REMOVED)

The system previously provided `switchToAnimatedMode()` and `switchToStaticMode()` methods:

```javascript
// OLD IMPLEMENTATION (REMOVED)
switchToAnimatedMode() {
  this.displayMode = 'animated';
  this.messagesContainer.innerHTML = '';
  // ... clear and prepare for animation ...
}

switchToStaticMode() {
  this.displayMode = 'static';
  this._renderAllMessages();
  // ... render all messages immediately ...
}
```

**Reason for Removal**: User feedback explicitly rejects mode toggle design; single natural flow is preferred.

**Replacement**: Auto-play with natural timing (Requirement 3)

---

## Dependencies

- **CSS Changes**: `message-hidden`, `message-appearing` classes, `fadeInUp` animation
- **ThoughtChainVisualizer**: Connection lines should still work with natural timing
- **Language Switching**: Delay calculation must use current language's text length

---

## Acceptance Criteria

The natural timing implementation is complete when:

1. ✅ No mode toggle UI visible
2. ✅ No playback controls visible
3. ✅ Dialogue auto-plays on initialization
4. ✅ Messages appear with randomized delays (1500-5000ms range)
5. ✅ First message appears within 2.5 seconds
6. ✅ Delays proportional to message length
7. ✅ Smooth fade-in animation (400ms)
8. ✅ Auto-scroll keeps messages visible
9. ✅ Performance: 60fps, no lag
10. ✅ User feedback: "看似像是在思考" (looks like thinking)
