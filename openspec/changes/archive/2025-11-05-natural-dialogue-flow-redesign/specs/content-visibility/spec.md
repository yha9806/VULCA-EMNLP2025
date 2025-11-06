# Spec: Content Visibility Fix

**Capability**: `content-visibility`
**Change ID**: `natural-dialogue-flow-redesign`
**Created**: 2025-11-05

---

## Overview

Fix content display issues where message text is clipped, truncated, or hidden due to CSS overflow constraints ("板块和内容展示不完全，被遮挡了或者是剪切掉了" - sections and content not fully displayed, blocked or clipped).

---

## ADDED Requirements

### Requirement 1: Text Wrapping for Long Content

The system SHALL wrap long text content to prevent horizontal overflow.

**Rationale**: User reports content being clipped; long words or URLs can break layout if not wrapped properly.

**Dependencies**: None

#### Scenario: Wrap long words within message

**Given** a message containing a long word (50+ characters without spaces)
**When** the message is rendered
**Then** the word MUST wrap to the next line
**And** NO horizontal scrollbar SHOULD appear
**And** the text MUST remain fully readable

```css
/* Required CSS */
.message-content {
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}
```

**Verification**:
```javascript
const longWord = 'a'.repeat(100);
const message = { textZh: longWord, textEn: longWord };
player._renderMessage(message);

const msgEl = container.querySelector('.message-content');
const hasHorizontalScroll = msgEl.scrollWidth > msgEl.clientWidth;
console.assert(!hasHorizontalScroll, 'Horizontal overflow present');
```

#### Scenario: Preserve readability with wrapping

**Given** a message with naturally wrapped text
**When** the message is rendered at 375px viewport width
**Then** the text MUST wrap at word boundaries
**And** the line height MUST be at least 1.6 (for readability)
**And** the text color MUST have sufficient contrast (≥4.5:1)

```javascript
const msgContent = container.querySelector('.message-content');
const lineHeight = window.getComputedStyle(msgContent).lineHeight;
console.assert(parseFloat(lineHeight) >= 1.6 * parseFloat(msgContent.fontSize),
  'Line height too small');
```

---

### Requirement 2: Vertical Scrolling for Long Conversations

The system SHALL provide vertical scrolling when message content exceeds container height.

**Rationale**: Dialogues with 10+ messages need scrolling to view all content without layout collapse.

**Dependencies**: None

#### Scenario: Enable scrolling when content exceeds height

**Given** a dialogue with 15 messages (total height >600px)
**When** the dialogue player is rendered
**Then** the messages container MUST have `overflow-y: auto`
**And** a vertical scrollbar MUST appear
**And** all messages MUST be accessible via scrolling

```css
/* Required CSS */
.dialogue-player__messages {
  overflow-y: auto;
  max-height: 600px;
}
```

**Verification**:
```javascript
const messagesContainer = container.querySelector('.dialogue-player__messages');
const hasVerticalScroll = messagesContainer.scrollHeight > messagesContainer.clientHeight;
console.assert(hasVerticalScroll, 'No vertical scroll for long content');

// Verify all messages accessible
messagesContainer.scrollTop = messagesContainer.scrollHeight;
const lastMessage = messagesContainer.lastElementChild;
const lastRect = lastMessage.getBoundingClientRect();
const containerRect = messagesContainer.getBoundingClientRect();
console.assert(lastRect.top < containerRect.bottom, 'Last message not scrollable');
```

---

### Requirement 3: Maintain Visual Polish with Overflow

The system SHALL maintain rounded corners while allowing content overflow.

**Rationale**: `overflow: hidden` on container clips content but is needed for `border-radius: 12px`; must balance aesthetics with functionality.

**Dependencies**: Requirement 2 (vertical scrolling)

#### Scenario: Clip container edges without clipping content

**Given** a dialogue player with rounded corners
**When** content overflows vertically
**Then** the container MUST have `overflow: hidden` (for border-radius)
**And** the messages area MUST have `overflow-y: auto` (for scrolling)
**And** NO content MUST be clipped outside the messages area

```css
/* Hybrid overflow strategy */
.dialogue-player {
  overflow: hidden;        /* Clip for rounded corners */
  border-radius: 12px;
}

.dialogue-player__messages {
  overflow-y: auto;        /* Allow scrolling */
  max-height: 600px;
}
```

**Verification**:
```javascript
const player = container.querySelector('.dialogue-player');
const messages = container.querySelector('.dialogue-player__messages');

console.assert(window.getComputedStyle(player).overflow === 'hidden',
  'Container overflow not hidden');
console.assert(window.getComputedStyle(messages).overflowY === 'auto',
  'Messages overflow-y not auto');
```

---

## MODIFIED Requirements

### Requirement 4: Remove Max-Height Constraints (If Causing Clipping)

The system SHALL NOT apply overly restrictive max-height that clips content.

**Rationale**: Previous implementation may have had max-height that truncated messages; ensure proper constraints.

**Changes**:
- **Before**: Possibly `max-height: 500px` on messages container causing clipping
- **After**: `max-height: 600px` with `overflow-y: auto` for proper scrolling

#### Scenario: Verify max-height allows adequate content

**Given** a dialogue with 8 messages (total height ~500px)
**When** the dialogue is rendered
**Then** all messages MUST be visible without manual scrolling
**And** the container height MUST be at least 500px

```javascript
const messagesContainer = container.querySelector('.dialogue-player__messages');
const containerHeight = messagesContainer.clientHeight;
console.assert(containerHeight >= 500, 'Container height too small');

// Verify no clipping (all messages within scroll area)
const messages = messagesContainer.querySelectorAll('.dialogue-message');
const totalMessagesHeight = Array.from(messages).reduce((sum, msg) => {
  return sum + msg.offsetHeight;
}, 0);

console.assert(messagesContainer.scrollHeight >= totalMessagesHeight,
  'Messages clipped by container');
```

---

### Requirement 5: Responsive Height Adjustments

The system SHALL adjust minimum height based on viewport size to prevent clipping on mobile.

**Rationale**: User may view on mobile (375px); need responsive min-height to maintain readability.

**Changes**:
- **Desktop (≥1024px)**: `min-height: 400px`
- **Tablet (768-1023px)**: `min-height: 350px`
- **Mobile (≤767px)**: `min-height: 300px`

#### Scenario: Adjust height for mobile viewport

**Given** a viewport width of 375px
**When** the dialogue player is rendered
**Then** the messages container min-height MUST be 300px
**And** the messages MUST be readable (no font smaller than 14px)
**And** NO content MUST be clipped

```css
/* Responsive min-heights */
@media (max-width: 767px) {
  .dialogue-player__messages {
    min-height: 300px;
    max-height: 400px;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .dialogue-player__messages {
    min-height: 350px;
    max-height: 500px;
  }
}

@media (min-width: 1024px) {
  .dialogue-player__messages {
    min-height: 400px;
    max-height: 600px;
  }
}
```

**Verification**:
```javascript
// Test at 375px
window.resizeTo(375, 667);
const messagesContainer = container.querySelector('.dialogue-player__messages');
const minHeight = parseInt(window.getComputedStyle(messagesContainer).minHeight);
console.assert(minHeight === 300, 'Mobile min-height incorrect');
```

---

## REMOVED Requirements

None. This is a fix/enhancement, not a removal of existing functionality.

---

## Cross-Capability Dependencies

- **Natural Timing** (sibling capability): Auto-scroll during message reveal must work with overflow settings
- **ThoughtChainVisualizer**: SVG connection lines must not be clipped by overflow
- **Language Switching**: Text wrapping must work for both Chinese and English

---

## Acceptance Criteria

The content visibility fix is complete when:

1. ✅ Long words wrap correctly (no horizontal overflow)
2. ✅ Long messages scroll vertically when needed
3. ✅ Rounded corners maintained on container
4. ✅ No content clipped or hidden
5. ✅ Works on mobile (375px), tablet (768px), desktop (1024px+)
6. ✅ Font remains readable (≥14px on mobile)
7. ✅ Scrollbar appears only when needed
8. ✅ User feedback: "板块和内容展示完全" (sections and content fully displayed)
9. ✅ Visual polish maintained (no broken borders or layouts)
10. ✅ Performance: no layout thrashing during scroll
