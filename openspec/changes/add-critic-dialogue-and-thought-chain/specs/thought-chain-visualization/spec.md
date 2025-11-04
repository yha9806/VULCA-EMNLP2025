# Spec: Thought Chain Visualization

**Capability**: `thought-chain-visualization`
**Change**: `add-critic-dialogue-and-thought-chain`
**Version**: 1.0.0

---

## ADDED Requirements

### Requirement: Connection Lines Between Critics

The system SHALL render SVG connection lines showing reply relationships between critic dialogue messages with animated draw-in effects.

**Acceptance Criteria**:
- [ ] SVG paths connect source critic to target critic
- [ ] Lines are color-coded by interaction type (6 types)
- [ ] Animated stroke-dashoffset for draw-in effect
- [ ] Arrow markers at line endpoints
- [ ] Hover shows relationship snippet

#### Scenario: Connection Line Rendering

**Given** a dialogue thread where Guo Xi replies to Su Shi
**When** the dialogue reaches Guo Xi's message
**Then** an SVG path SHALL be drawn from Su Shi's card to Guo Xi's card
**And** the line SHALL be colored green (agree-extend type)
**And** the line SHALL animate from 0% to 100% over 500ms
**And** an arrow marker SHALL point to Guo Xi's card

**Validation**:
```javascript
const thread = {
  messages: [
    { personaId: 'su-shi', timestamp: 0, interactionType: 'initial' },
    { personaId: 'guo-xi', timestamp: 3000, replyTo: 'su-shi', interactionType: 'agree-extend' }
  ]
};

visualizer.renderThread(thread);

// After animation completes
setTimeout(() => {
  const path = document.querySelector('.connection-line.agree-extend[data-from="su-shi"][data-to="guo-xi"]');
  console.assert(path !== null, 'Connection line should exist');
  console.assert(path.getAttribute('stroke') === '#4ade80', 'Should be green for agree-extend');
}, 600);
```

---

### Requirement: Interaction Type Color Coding

Connection lines and badges SHALL use consistent color coding for 6 interaction types.

**Acceptance Criteria**:
- [ ] `initial` - indigo (#6366f1)
- [ ] `agree-extend` - green (#4ade80)
- [ ] `question-challenge` - amber (#fbbf24)
- [ ] `synthesize` - purple (#8b5cf6)
- [ ] `counter` - red (#f87171)
- [ ] `reflect` - blue (#60a5fa)
- [ ] All colors meet WCAG AA contrast (4.5:1)

#### Scenario: Color Consistency

**Given** 6 different interaction types in a dialogue thread
**When** connections are rendered
**Then** each interaction type SHALL have its designated color
**And** connection lines SHALL match badge colors
**And** colors SHALL be consistent across desktop and mobile

---

### Requirement: Quote Block Rendering

When a critic quotes another critic's text, the system SHALL render an inline quote block with source attribution.

**Acceptance Criteria**:
- [ ] Quote blocks have left border with source persona's color
- [ ] Source critic name displayed with `<cite>` tag
- [ ] Bilingual support (Chinese/English)
- [ ] Click quote block to scroll to original message

#### Scenario: Quote Block Display

**Given** Guo Xi quotes Su Shi: "机械臂运笔如人手"
**When** Guo Xi's message is rendered
**Then** a quote block SHALL appear with Su Shi's theme color border
**And** the quoted text SHALL be displayed verbatim
**And** a cite tag SHALL show "苏轼：" or "Su Shi:"
**And** clicking the quote SHALL scroll to Su Shi's original message

**Validation**:
```javascript
const message = {
  personaId: 'guo-xi',
  textZh: '苏兄所言极是...',
  replyTo: 'su-shi',
  quotedText: '机械臂运笔如人手'
};

visualizer.renderMessage(message);

const quoteBlock = document.querySelector('.quoted-text');
console.assert(quoteBlock !== null, 'Quote block should exist');

const borderColor = window.getComputedStyle(quoteBlock).borderLeftColor;
const suShiColor = '#B85C3C'; // Su Shi's theme color
console.assert(borderColor === 'rgb(184, 92, 60)', 'Border should be Su Shi\'s color');
```

---

### Requirement: Interaction Tags/Badges

Each dialogue message SHALL display a badge indicating its interaction type with bilingual text.

**Acceptance Criteria**:
- [ ] Badge displays on message card
- [ ] Shows Chinese/English text based on language setting
- [ ] Uses interaction type color as background
- [ ] Click badge to jump to referenced message (if applicable)
- [ ] Hover badge to show tooltip with full explanation

#### Scenario: Badge Display and Interaction

**Given** a message with `question-challenge` interaction type
**When** the message is rendered
**Then** a badge SHALL appear with amber background (#fbbf24)
**And** badge text SHALL show "质疑" (Chinese) or "Questions" (English)
**And** clicking the badge SHALL scroll to the message being questioned
**And** hovering SHALL show tooltip: "This critic is questioning a previous observation"

---

## MODIFIED Requirements

_None_ - This is an additive feature.

---

## REMOVED Requirements

_None_ - This is an additive feature.

---

## Cross-Capability Dependencies

### Depends On:
- `dialogue-playback` - Timeline state for rendering connections at correct time
- `dialogue-data` - Interaction types and reply relationships

---

## Test Coverage Matrix

| Requirement | Unit Test | Integration Test | Visual Test | A11y Test |
|-------------|-----------|------------------|-------------|-----------|
| Connection Lines | ✅ SVG gen | ✅ Full thread | ✅ Screenshots | ✅ ARIA |
| Color Coding | ✅ Color map | ✅ All types | ✅ Contrast | N/A |
| Quote Blocks | ✅ Rendering | ✅ Click nav | ✅ Mobile/desktop | ✅ Semantics |
| Interaction Tags | ✅ Badge gen | ✅ Click nav | ✅ All types | ✅ Tooltips |

---

## Visual Specifications

**Connection Line Styles**:
```css
.connection-line {
  stroke-width: 2px;
  fill: none;
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: drawLine 500ms ease-out forwards;
}

@keyframes drawLine {
  to { stroke-dashoffset: 0; }
}
```

**Quote Block Styles**:
```css
.quoted-text {
  border-left: 4px solid var(--persona-color);
  padding-left: 12px;
  margin: 8px 0;
  font-style: italic;
  opacity: 0.9;
}
```

**Interaction Badge Styles**:
```css
.interaction-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}

.interaction-badge.agree-extend {
  background: #4ade80;
  color: #166534;
}
```
