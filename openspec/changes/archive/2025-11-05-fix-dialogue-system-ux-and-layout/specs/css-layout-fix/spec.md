# Specification: CSS Layout Fix

**Capability**: `css-layout-fix`
**Version**: 1.0
**Status**: Proposed
**Priority**: P0 (Critical Blocker)

---

## Overview

Fix critical CSS layout collapse in DialoguePlayer component where messages container has visible height of only 48px, causing 99% of dialogue content to be invisible to users.

---

## ADDED Requirements

### Requirement 1: Messages Container Height
**ID**: `CLF-001`
**Priority**: MUST
**Type**: Functional

The `.dialogue-player__messages` container SHALL expand to accommodate all rendered dialogue messages without clipping or overflow outside the scrollable area.

**Acceptance Criteria**:
- Container computed height ≥ 400px minimum
- Container grows naturally to fit content (up to 600px max)
- Scrollbar appears when content exceeds max-height
- All messages have positive y-coordinates (visible in scroll area)

#### Scenario: Container Expands with Content
**Given** a DialoguePlayer with 6 messages rendered
**When** the component initializes
**Then** the messages container height SHALL be ≥400px
**And** all 6 messages SHALL be within the scrollable viewport (y > 0)
**And** the first message top SHALL be > 0px
**And** the last message bottom SHALL be accessible via scrolling

**Verification Code**:
```javascript
const player = new DialoguePlayer(thread, container);
const messagesEl = container.querySelector('.dialogue-player__messages');
const messages = messagesEl.querySelectorAll('.dialogue-message');

expect(messagesEl.clientHeight).toBeGreaterThanOrEqual(400);
expect(messages[0].getBoundingClientRect().top).toBeGreaterThan(0);
```

---

### Requirement 2: Parent Container Height Context
**ID**: `CLF-002`
**Priority**: MUST
**Type**: Functional

The `.dialogue-player` parent container SHALL provide explicit height constraints to enable flex child expansion using `min-height` and `height: auto`.

**Acceptance Criteria**:
- Parent has min-height: 500px set
- Parent allows natural height growth (height: auto)
- Flex layout distributes space correctly to children

#### Scenario: Parent Establishes Flex Context
**Given** a DialoguePlayer is mounted in the DOM
**When** inspecting the `.dialogue-player` container styles
**Then** the computed min-height SHALL be 500px
**And** the height property SHALL be 'auto' or explicit pixel value
**And** flex children SHALL receive proportional space

**Verification Code**:
```javascript
const playerEl = container.querySelector('.dialogue-player');
const computed = window.getComputedStyle(playerEl);

expect(parseInt(computed.minHeight)).toBe(500);
expect(computed.display).toBe('flex');
expect(computed.flexDirection).toBe('column');
```

---

### Requirement 3: Responsive Height Adjustments
**ID**: `CLF-003`
**Priority**: MUST
**Type**: Functional

The system SHALL adjust container min-heights responsively based on viewport width to maintain usability on mobile devices.

**Acceptance Criteria**:
- Mobile (≤767px): min-height 300px
- Tablet (768-1023px): min-height 350px
- Desktop (≥1024px): min-height 400px
- Transitions smooth between breakpoints

#### Scenario: Mobile Viewport Adjustment
**Given** the viewport width is 375px (mobile)
**When** a DialoguePlayer is rendered
**Then** the messages container min-height SHALL be 300px
**And** the layout SHALL remain functional
**And** all messages SHALL still be accessible via scrolling

**Verification Code**:
```javascript
window.resizeTo(375, 667);
const player = new DialoguePlayer(thread, container);
const messagesEl = container.querySelector('.dialogue-player__messages');
const computed = window.getComputedStyle(messagesEl);

expect(parseInt(computed.minHeight)).toBe(300);
```

---

### Requirement 4: Layout Stability During Animation
**ID**: `CLF-004`
**Priority**: SHOULD
**Type**: Non-Functional (Performance)

When dialogue animation is playing, the container dimensions SHALL remain constant to prevent layout shift and maintain Cumulative Layout Shift (CLS) < 0.1.

**Acceptance Criteria**:
- Player height constant during playback
- Messages container height constant
- No vertical jump or reflow
- CLS score < 0.1 (Google Core Web Vitals)

#### Scenario: No Layout Shift During Playback
**Given** a DialoguePlayer in animated mode
**When** playback transitions from first to last message
**Then** the player container height SHALL remain unchanged
**And** the messages container height SHALL remain unchanged
**And** no layout shift SHALL be measurable

**Verification Code**:
```javascript
const player = new DialoguePlayer(thread, container);
const initialHeight = container.clientHeight;
const initialMessagesHeight = container.querySelector('.dialogue-player__messages').clientHeight;

player.play();
await sleep(10000); // Wait for animation

expect(container.clientHeight).toBe(initialHeight);
expect(container.querySelector('.dialogue-player__messages').clientHeight).toBe(initialMessagesHeight);
```

---

## Success Metrics

- **Layout Stability**: CLS score < 0.1
- **Content Visibility**: 100% of messages within scrollable viewport
- **Height Accuracy**: Computed height matches content height ±10px
- **Cross-Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Responsive**: Functional at 375px, 768px, 1024px viewports
