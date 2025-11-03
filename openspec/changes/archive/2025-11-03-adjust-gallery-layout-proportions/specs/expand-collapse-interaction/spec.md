# Expand/Collapse Interaction Specification

**Capability**: `expand-collapse-interaction`
**Change**: `adjust-gallery-layout-proportions`
**Type**: Interactive Feature
**Status**: 🔄 Proposed

---

## Overview

Add expand/collapse functionality to critique cards, allowing users to toggle between preview (150 characters) and full text display. Includes button interaction, smooth animations, and ARIA accessibility support.

---

## ADDED Requirements

### Requirement: Collapse State by Default

**ID**: `expand-collapse-interaction-001`
**Priority**: P0 (Critical)

Critique cards SHALL display in collapsed state by default, showing truncated text preview (150 characters) with an "展开 ▼" button.

**Acceptance Criteria**:
- ✅ Default state: collapsed (150 characters visible)
- ✅ Button text: "展开 ▼"
- ✅ Button ARIA attribute: `aria-expanded="false"`
- ✅ Truncation logic preserves sentence integrity

#### Scenario: Default Collapsed State

**Given** the gallery page loads with artwork and critiques
**When** a critique card is rendered
**Then** the `.critique-text` SHALL display only the first 150 characters
**And** the text SHALL end with "..." if truncated
**And** a button labeled "展开 ▼" SHALL appear below the text
**And** the card SHALL NOT have the "expanded" class

**Validation**:
```javascript
const card = document.querySelector('.critique-panel');
const text = card.querySelector('.critique-text');
const button = card.querySelector('.critique-toggle-btn');

console.assert(!card.classList.contains('expanded'), 'Should be collapsed by default');
console.assert(text.textContent.length <= 153, 'Text should be truncated (~150 chars + ...)');
console.assert(button.textContent.includes('展开'), 'Button should say "展开"');
console.assert(button.getAttribute('aria-expanded') === 'false', 'ARIA expanded should be false');
```

---

### Requirement: Smart Text Truncation

**ID**: `expand-collapse-interaction-002`
**Priority**: P1 (High)

Text truncation SHALL attempt to break at sentence boundaries (。，) rather than mid-word, providing natural preview endpoints.

**Acceptance Criteria**:
- ✅ Truncate at last period (。) or comma (，) within 150 chars
- ✅ Fallback to 150 chars if no punctuation found
- ✅ Append "..." to indicate truncation
- ✅ Preserve full text in `data-full-text` attribute

#### Scenario: Intelligent Truncation at Sentence Boundary

**Given** a critique text: "这是第一句。这是第二句，很长。这是第三句。"
**And** the text exceeds 150 characters
**When** the truncation function is applied
**Then** the text SHALL be cut at the last "。" or "，" before 150 chars
**And** the truncated text SHALL end with a complete phrase
**And** "..." SHALL be appended

**Validation**:
```javascript
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;

  const truncated = text.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('。');
  const lastComma = truncated.lastIndexOf('，');

  const breakPoint = Math.max(lastPeriod, lastComma);

  // Only use breakpoint if it's not too early (>50 chars)
  return breakPoint > 50
    ? text.substring(0, breakPoint + 1) + '...'
    : truncated + '...';
}

// Test
const text = "这是第一句。这是第二句，很长的内容继续写下去...";
const result = truncateText(text, 150);
console.assert(result.endsWith('。...') || result.endsWith('，...'), 'Should end at punctuation');
```

---

### Requirement: Expand Interaction

**ID**: `expand-collapse-interaction-003`
**Priority**: P0 (Critical)

Clicking the "展开 ▼" button SHALL expand the critique to display full text with smooth transition animation.

**Acceptance Criteria**:
- ✅ Click event toggles expansion
- ✅ Full text replaces truncated text
- ✅ Button text changes to "收起 ▲"
- ✅ ARIA attribute updates to `aria-expanded="true"`
- ✅ Smooth CSS transition (0.3s)
- ✅ Card gains "expanded" class

#### Scenario: Click to Expand

**Given** a critique card in collapsed state
**And** the "展开 ▼" button is visible
**When** the user clicks the button
**Then** the `.critique-text` SHALL display the complete critique text
**And** the button label SHALL change to "收起 ▲"
**And** the card SHALL gain the "expanded" class
**And** the expansion SHALL animate smoothly over 0.3 seconds
**And** `aria-expanded` SHALL update to "true"

**Validation**:
```javascript
const card = document.querySelector('.critique-panel');
const button = card.querySelector('.critique-toggle-btn');
const fullText = card.dataset.fullText;

// Store initial state
const initialText = card.querySelector('.critique-text').textContent;

// Click button
button.click();

// Wait for animation
setTimeout(() => {
  const text = card.querySelector('.critique-text').textContent;

  console.assert(card.classList.contains('expanded'), 'Card should have expanded class');
  console.assert(text === fullText, 'Should show full text');
  console.assert(button.textContent.includes('收起'), 'Button should say "收起"');
  console.assert(button.getAttribute('aria-expanded') === 'true', 'ARIA should be true');
}, 350); // After 0.3s transition
```

---

### Requirement: Collapse Interaction

**ID**: `expand-collapse-interaction-004`
**Priority**: P0 (Critical)

Clicking the "收起 ▲" button SHALL collapse the critique back to preview state with smooth transition.

**Acceptance Criteria**:
- ✅ Click event toggles collapse
- ✅ Text reverts to 150-char preview
- ✅ Button text changes to "展开 ▼"
- ✅ ARIA attribute updates to `aria-expanded="false"`
- ✅ Smooth CSS transition (0.3s)
- ✅ Card loses "expanded" class

#### Scenario: Click to Collapse

**Given** a critique card in expanded state
**And** the "收起 ▲" button is visible
**When** the user clicks the button
**Then** the `.critique-text` SHALL display truncated text (150 chars)
**And** the button label SHALL change to "展开 ▼"
**And** the card SHALL lose the "expanded" class
**And** the collapse SHALL animate smoothly over 0.3 seconds
**And** `aria-expanded` SHALL update to "false"

**Validation**:
```javascript
const card = document.querySelector('.critique-panel.expanded');
const button = card.querySelector('.critique-toggle-btn');

// Click to collapse
button.click();

setTimeout(() => {
  const text = card.querySelector('.critique-text').textContent;

  console.assert(!card.classList.contains('expanded'), 'Expanded class should be removed');
  console.assert(text.length <= 153, 'Should show truncated text');
  console.assert(button.textContent.includes('展开'), 'Button should say "展开"');
  console.assert(button.getAttribute('aria-expanded') === 'false', 'ARIA should be false');
}, 350);
```

---

### Requirement: Toggle Button Styling

**ID**: `expand-collapse-interaction-005`
**Priority**: P1 (High)

The toggle button SHALL have clear visual styling distinguishing it from critique text, with hover and focus states.

**Acceptance Criteria**:
- ✅ Button appears below critique text
- ✅ Distinct color (e.g., primary brand color)
- ✅ Hover state: background color change
- ✅ Focus state: visible outline for keyboard navigation
- ✅ Cursor: pointer
- ✅ Font size: 0.9rem (smaller than body text)

#### Scenario: Button Visual Design

**Given** a critique card with toggle button
**When** the button is rendered
**Then** it SHALL be visually distinct from text content
**And** hovering SHALL change background or text color
**And** focusing via keyboard SHALL show visible outline
**And** cursor SHALL indicate interactivity (pointer)

**Validation**:
```css
.critique-toggle-btn {
  display: inline-block;
  background: none;
  border: none;
  color: var(--color-primary, #1976d2);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 12px;
  margin-top: 8px;
  border-radius: 4px;
  transition: background-color 0.2s, color 0.2s;
}

.critique-toggle-btn:hover {
  background-color: rgba(25, 118, 210, 0.08);
  color: #1565c0;
}

.critique-toggle-btn:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.critique-toggle-btn:active {
  background-color: rgba(25, 118, 210, 0.16);
}
```

---

### Requirement: Smooth Transition Animation

**ID**: `expand-collapse-interaction-006`
**Priority**: P1 (High)

Expansion and collapse SHALL use CSS transitions for smooth visual feedback, targeting `max-height` property.

**Acceptance Criteria**:
- ✅ Transition duration: 0.3s
- ✅ Easing function: cubic-bezier(0.4, 0, 0.2, 1)
- ✅ Animates max-height (collapsed: 150px, expanded: 2000px)
- ✅ No layout shift jank
- ✅ GPU-accelerated animation

#### Scenario: Smooth Expansion Animation

**Given** a critique card with CSS transitions defined
**When** the user clicks the expand button
**Then** the text container SHALL smoothly animate from 150px to full height
**And** the animation duration SHALL be 0.3 seconds
**And** the animation SHALL use the specified easing curve
**And** no visible jank or layout shift SHALL occur

**Validation**:
```css
.critique-text {
  max-height: 150px;        /* Collapsed state */
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.critique-panel.expanded .critique-text {
  max-height: 2000px;       /* Expanded state (arbitrarily large) */
}

/* Icon rotation animation */
.critique-toggle-btn .icon {
  display: inline-block;
  transition: transform 0.3s ease;
}

.critique-panel.expanded .critique-toggle-btn .icon {
  transform: rotate(180deg);
}
```

---

### Requirement: Independent Card State

**ID**: `expand-collapse-interaction-007`
**Priority**: P0 (Critical)

Each critique card SHALL maintain independent expand/collapse state. Expanding one card SHALL NOT affect others.

**Acceptance Criteria**:
- ✅ Each card has unique identifier
- ✅ State stored per card (via class, not global variable)
- ✅ Multiple cards can be expanded simultaneously
- ✅ No interference between cards

#### Scenario: Independent Multi-Card Expansion

**Given** the critique panel displays 6 critique cards
**When** the user expands cards #1, #3, and #5
**Then** only those 3 cards SHALL be in expanded state
**And** cards #2, #4, and #6 SHALL remain collapsed
**And** each card SHALL maintain its own toggle button state
**And** scrolling SHALL work smoothly with mixed states

**Validation**:
```javascript
const cards = document.querySelectorAll('.critique-panel');

// Expand odd-indexed cards
cards[0].querySelector('.critique-toggle-btn').click();
cards[2].querySelector('.critique-toggle-btn').click();
cards[4].querySelector('.critique-toggle-btn').click();

setTimeout(() => {
  console.assert(cards[0].classList.contains('expanded'), 'Card 1 expanded');
  console.assert(!cards[1].classList.contains('expanded'), 'Card 2 collapsed');
  console.assert(cards[2].classList.contains('expanded'), 'Card 3 expanded');
  console.assert(!cards[3].classList.contains('expanded'), 'Card 4 collapsed');
  console.assert(cards[4].classList.contains('expanded'), 'Card 5 expanded');
  console.assert(!cards[5].classList.contains('expanded'), 'Card 6 collapsed');
}, 350);
```

---

### Requirement: Keyboard Accessibility

**ID**: `expand-collapse-interaction-008`
**Priority**: P1 (High)

The toggle button SHALL be fully keyboard-accessible using Tab and Enter/Space keys.

**Acceptance Criteria**:
- ✅ Button focusable via Tab key
- ✅ Enter key triggers toggle
- ✅ Space key triggers toggle
- ✅ Focus indicator visible
- ✅ Logical tab order (after critique text)

#### Scenario: Keyboard Navigation

**Given** a user navigating via keyboard only
**When** the user tabs to a critique card
**Then** the toggle button SHALL receive focus (visible outline)
**And** pressing Enter SHALL expand/collapse the card
**And** pressing Space SHALL also expand/collapse the card
**And** focus SHALL remain on the button after toggle

**Validation**:
```javascript
const button = document.querySelector('.critique-toggle-btn');

// Simulate Tab focus
button.focus();
console.assert(document.activeElement === button, 'Button should be focused');

// Simulate Enter key
const enterEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
button.dispatchEvent(enterEvent);

// Check state changed
setTimeout(() => {
  const card = button.closest('.critique-panel');
  console.assert(card.classList.contains('expanded'), 'Should expand on Enter');
  console.assert(document.activeElement === button, 'Focus should remain on button');
}, 350);
```

---

### Requirement: Screen Reader Announcements

**ID**: `expand-collapse-interaction-009`
**Priority**: P1 (High)

State changes SHALL be announced to screen readers via ARIA attributes and live regions.

**Acceptance Criteria**:
- ✅ Button has `aria-expanded` attribute
- ✅ `aria-expanded` toggles true/false
- ✅ Button has `aria-label` describing action
- ✅ Optional: aria-live region announces state change

#### Scenario: Screen Reader Accessibility

**Given** a screen reader user encounters a critique card
**When** the toggle button is focused
**Then** the screen reader SHALL announce the button label and expanded state
**And** when clicked, the new state SHALL be announced
**And** the full text SHALL be accessible to screen reader

**Validation**:
```html
<!-- Collapsed state -->
<button
  class="critique-toggle-btn"
  aria-expanded="false"
  aria-label="展开评论全文"
  aria-controls="critique-text-1">
  展开 ▼
</button>

<!-- Expanded state -->
<button
  class="critique-toggle-btn"
  aria-expanded="true"
  aria-label="收起评论"
  aria-controls="critique-text-1">
  收起 ▲
</button>

<!-- Text container -->
<p
  class="critique-text"
  id="critique-text-1"
  aria-live="polite">
  <!-- Text content -->
</p>
```

---

## Related Capabilities

- `image-critique-ratio` - Narrower panel makes preview/expand pattern more necessary
- `single-column-layout` - Vertical list works well with expand/collapse
- `typography-optimization` - Larger font makes 150-char preview more meaningful

---

## Testing Checklist

### Functional Testing
- [ ] Default: All cards collapsed with "展开 ▼" button
- [ ] Click expand: Text expands, button changes to "收起 ▲"
- [ ] Click collapse: Text collapses, button changes to "展开 ▼"
- [ ] Multiple cards: Independent state management
- [ ] Truncation: Smart breaks at sentence boundaries

### Interaction Testing
- [ ] Mouse click works
- [ ] Keyboard Enter works
- [ ] Keyboard Space works
- [ ] Touch tap works (mobile)
- [ ] Rapid clicks don't break state

### Animation Testing
- [ ] Smooth 0.3s transition
- [ ] No layout shift during animation
- [ ] No jank or stuttering
- [ ] Icon rotates smoothly

### Accessibility Testing
- [ ] ARIA expanded attribute toggles
- [ ] Screen reader announces state
- [ ] Keyboard navigation logical
- [ ] Focus indicator visible
- [ ] Tab order correct

### Visual Testing
- [ ] Button styling distinct from text
- [ ] Hover state visible
- [ ] Focus state visible
- [ ] Expanded state clear

---

## Implementation Notes

**Files to modify**:
- `js/gallery-hero.js` - Add expand/collapse logic
- `styles/main.css` - Add button and transition styles

**JavaScript Implementation** (`gallery-hero.js`):

```javascript
/**
 * Create critique card with expand/collapse functionality
 */
function createCritiqueCard(critique, persona, artworkId) {
  const card = document.createElement('div');
  card.className = 'critique-panel';
  card.dataset.critiqueId = `${artworkId}-${persona.id}`;
  card.style.borderLeftColor = persona.color;

  // Store full text
  card.dataset.fullText = critique.textZh;

  // Header
  const header = createCritiqueHeader(persona);
  card.appendChild(header);

  // Text (truncated by default)
  const text = document.createElement('p');
  text.className = 'critique-text';
  text.id = `critique-text-${card.dataset.critiqueId}`;
  text.textContent = truncateText(critique.textZh, 150);
  card.appendChild(text);

  // Toggle button
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'critique-toggle-btn';
  toggleBtn.textContent = '展开 ▼';
  toggleBtn.setAttribute('aria-expanded', 'false');
  toggleBtn.setAttribute('aria-label', '展开评论全文');
  toggleBtn.setAttribute('aria-controls', text.id);

  toggleBtn.addEventListener('click', () => {
    toggleCritiqueExpansion(card, text, toggleBtn, critique.textZh);
  });

  card.appendChild(toggleBtn);

  return card;
}

/**
 * Toggle expansion state
 */
function toggleCritiqueExpansion(card, textElement, button, fullText) {
  const isExpanded = card.classList.contains('expanded');

  if (isExpanded) {
    // Collapse
    card.classList.remove('expanded');
    textElement.textContent = truncateText(fullText, 150);
    button.textContent = '展开 ▼';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', '展开评论全文');
  } else {
    // Expand
    card.classList.add('expanded');
    textElement.textContent = fullText;
    button.textContent = '收起 ▲';
    button.setAttribute('aria-expanded', 'true');
    button.setAttribute('aria-label', '收起评论');
  }
}

/**
 * Smart text truncation
 */
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;

  const truncated = text.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('。');
  const lastComma = truncated.lastIndexOf('，');

  const breakPoint = Math.max(lastPeriod, lastComma);

  return breakPoint > 50
    ? text.substring(0, breakPoint + 1) + '...'
    : truncated + '...';
}
```

**CSS Implementation** (`main.css`):

```css
/* Toggle button styling */
.critique-toggle-btn {
  display: inline-block;
  background: none;
  border: none;
  color: #1976d2;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 12px;
  margin-top: 8px;
  border-radius: 4px;
  transition: background-color 0.2s, color 0.2s;
}

.critique-toggle-btn:hover {
  background-color: rgba(25, 118, 210, 0.08);
  color: #1565c0;
}

.critique-toggle-btn:focus {
  outline: 2px solid #1976d2;
  outline-offset: 2px;
}

.critique-toggle-btn:active {
  background-color: rgba(25, 118, 210, 0.16);
}

/* Text expansion animation */
.critique-text {
  max-height: 150px;
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.critique-panel.expanded .critique-text {
  max-height: 2000px; /* Large enough for longest critique */
}
```

---

**Validation Command**: `openspec validate adjust-gallery-layout-proportions --strict`
