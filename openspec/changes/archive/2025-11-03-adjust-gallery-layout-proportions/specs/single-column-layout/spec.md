# Single-Column Layout Specification

**Capability**: `single-column-layout`
**Change**: `adjust-gallery-layout-proportions`
**Type**: Layout System Transformation
**Status**: 🔄 Proposed

---

## Overview

Transform `.critiques-panel` from multi-column grid layout to single-column vertical list. This improves reading flow, maximizes horizontal space for each critique within the 40% panel width, and provides consistent experience across all devices.

---

## MODIFIED Requirements

### Requirement: Replace Grid with Flexbox Column

**ID**: `single-column-layout-001`
**Priority**: P0 (Critical)

The `.critiques-panel` element SHALL use `display: flex` with `flex-direction: column` instead of `display: grid` with multiple columns.

**Acceptance Criteria**:
- ✅ CSS: `display: flex; flex-direction: column;`
- ✅ Remove all `grid-template-columns` declarations
- ✅ Applies to all breakpoints (mobile, tablet, desktop)
- ✅ Critiques stack vertically in document order

#### Scenario: Grid to Flex Conversion

**Given** the critique panel contains 6 critique cards
**When** the page is rendered on any device
**Then** the panel SHALL use flexbox layout
**And** critiques SHALL be arranged in a single vertical column
**And** NO grid-based multi-column layout SHALL be present
**And** critiques SHALL appear in data order (top to bottom)

**Validation**:
```javascript
const panel = document.querySelector('.critiques-panel');
const styles = window.getComputedStyle(panel);

console.assert(styles.display === 'flex', 'Display must be flex');
console.assert(styles.flexDirection === 'column', 'Must be column direction');
console.assert(!styles.gridTemplateColumns || styles.gridTemplateColumns === 'none', 'No grid columns');
```

---

### Requirement: Vertical Gap Spacing

**ID**: `single-column-layout-002`
**Priority**: P1 (High)

The vertical gap between critique cards SHALL be 16px, providing clear visual separation while maintaining compact layout.

**Acceptance Criteria**:
- ✅ CSS: `gap: 16px;`
- ✅ Consistent across all breakpoints
- ✅ Visual rhythm preserved
- ✅ No collapsing margins between cards

#### Scenario: Vertical Spacing Between Critiques

**Given** multiple critique cards are displayed in the panel
**When** the layout is rendered
**Then** each card SHALL have exactly 16px vertical spacing from adjacent cards
**And** no horizontal gap SHALL exist (single column)
**And** spacing SHALL be visually consistent throughout the list

**Validation**:
```javascript
const panel = document.querySelector('.critiques-panel');
const cards = panel.querySelectorAll('.critique-panel');

// Check gap between first two cards
const card1Bottom = cards[0].getBoundingClientRect().bottom;
const card2Top = cards[1].getBoundingClientRect().top;
const actualGap = card2Top - card1Bottom;

console.assert(Math.abs(actualGap - 16) < 2, `Expected 16px gap, got ${actualGap}px`);
```

---

### Requirement: Remove Multi-Column Media Queries

**ID**: `single-column-layout-003`
**Priority**: P0 (Critical)

All media query rules defining `grid-template-columns` for `.critiques-panel` SHALL be removed from the CSS.

**Acceptance Criteria**:
- ✅ Remove tablet 2-column rule: `grid-template-columns: repeat(2, 1fr)`
- ✅ Remove desktop 3-column rule: `grid-template-columns: repeat(3, 1fr)`
- ✅ Remove large screen 4-column rule: `grid-template-columns: repeat(4, 1fr)`
- ✅ Single-column layout applies universally

#### Scenario: Multi-Column Rules Removal

**Given** the CSS file contains multiple `@media` breakpoints
**When** searching for `grid-template-columns` within `.critiques-panel` rules
**Then** NO instances of `grid-template-columns` SHALL be found
**And** the layout SHALL remain single-column at all viewport widths

**Validation**:
```bash
# CSS file grep check
grep -n "\.critiques-panel" styles/main.css -A 10 | grep "grid-template-columns"
# Expected: No matches (exit code 1)
```

---

### Requirement: Overflow and Scrolling

**ID**: `single-column-layout-004`
**Priority**: P1 (High)

The `.critiques-panel` SHALL remain vertically scrollable with smooth scrolling behavior when content exceeds viewport height.

**Acceptance Criteria**:
- ✅ CSS: `overflow-y: auto;` (desktop/tablet)
- ✅ CSS: `overflow-y: visible;` (mobile <768px)
- ✅ Smooth scroll behavior enabled
- ✅ Scrollbar styling consistent with design system

#### Scenario: Vertical Scrolling Behavior

**Given** the critiques panel contains 6 expanded critique cards
**And** the total content height exceeds `max-height: calc(100vh - 240px)`
**When** the user scrolls within the panel
**Then** vertical scrolling SHALL be smooth and responsive
**And** the scrollbar SHALL appear on the right edge
**And** horizontal scrolling SHALL NOT occur

**Validation**:
```javascript
const panel = document.querySelector('.critiques-panel');
const styles = window.getComputedStyle(panel);

// Desktop (≥768px)
if (window.innerWidth >= 768) {
  console.assert(styles.overflowY === 'auto', 'Should be auto on desktop');
} else {
  // Mobile uses document scroll
  console.assert(styles.overflowY === 'visible', 'Should be visible on mobile');
}
```

---

### Requirement: Full-Width Critique Cards

**ID**: `single-column-layout-005`
**Priority**: P1 (High)

Each `.critique-panel` card SHALL occupy 100% of the `.critiques-panel` width (minus scrollbar) to maximize reading area.

**Acceptance Criteria**:
- ✅ No fixed width constraints on cards
- ✅ Cards expand to fill available horizontal space
- ✅ Consistent card width throughout the list
- ✅ Text wrapping optimized for full width

#### Scenario: Full-Width Card Utilization

**Given** the critiques panel is 40% of the viewport width
**And** a critique card is rendered within the panel
**When** the card is measured
**Then** the card width SHALL equal panel width minus scrollbar width (~8px)
**And** all cards SHALL have identical width
**And** text SHALL wrap within card boundaries

**Validation**:
```javascript
const panel = document.querySelector('.critiques-panel');
const cards = panel.querySelectorAll('.critique-panel');

const panelWidth = panel.clientWidth; // Excludes scrollbar
const card1Width = cards[0].offsetWidth;
const card2Width = cards[1].offsetWidth;

console.assert(Math.abs(card1Width - panelWidth) < 5, 'Card should fill panel width');
console.assert(card1Width === card2Width, 'All cards should have same width');
```

---

## REMOVED Requirements

### Requirement: Grid Column Responsiveness (REMOVED)

**ID**: `single-column-layout-006-REMOVED`
**Reason**: Grid layout replaced with flexbox column

**Previous Behavior**:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns
- Large: 4 columns

**New Behavior**: Single column at all breakpoints (handled by Requirement 1)

---

## Related Capabilities

- `image-critique-ratio` - Critiques panel now 40% width (reduced from 60-65%)
- `typography-optimization` - Font adjustments compensate for narrower panel
- `expand-collapse-interaction` - Vertical list works well with expand/collapse pattern

---

## Testing Checklist

### Visual Testing
- [ ] Desktop (1024px): Single column, 16px gap, smooth scroll
- [ ] Tablet (768px): Single column, no multi-column grid
- [ ] Mobile (375px): Single column, full-width cards
- [ ] Large (1440px): Single column (not 4 columns)

### Layout Testing
- [ ] Cards fill 100% panel width
- [ ] No horizontal scrollbar
- [ ] Vertical scroll works smoothly
- [ ] Gap spacing consistent (16px between cards)

### Regression Testing
- [ ] No broken grid rules remain
- [ ] No orphaned media queries
- [ ] Typography remains readable in single column
- [ ] Hover effects still work on cards

---

## Implementation Notes

**Files to modify**:
- `styles/main.css` lines 1365-1746 (critiques-panel styles)

**CSS Changes**:

```css
/* Base styles (lines ~1365-1373) */
.critiques-panel {
  /* REMOVED: display: grid; */
  /* REMOVED: grid-template-columns: 1fr; */
  display: flex;              /* ADDED */
  flex-direction: column;     /* ADDED */
  gap: 16px;                  /* KEEP (same for both grid and flex) */
  overflow-y: auto;
  padding-right: 8px;
  align-content: start;       /* REMOVED (flex doesn't use this) */
}

/* Tablet breakpoint (lines ~1575-1580) - REMOVE entire block */
/* DELETE:
@media (min-width: 768px) {
  .critiques-panel {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}
*/

/* Desktop breakpoint (lines ~1600-1605) - REMOVE column rule */
/* DELETE:
.critiques-panel {
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
*/

/* Large screen (lines ~1639-1644) - REMOVE column rule */
/* DELETE:
.critiques-panel {
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;
}
*/

/* Ultra-wide (lines ~1678-1683) - REMOVE column rule */
/* DELETE:
.critiques-panel {
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;
}
*/

/* Mobile (lines ~1741-1745) - Keep overflow-y: visible */
@media (max-width: 767px) {
  .critiques-panel {
    flex: 1;
    overflow-y: visible; /* KEEP - mobile uses document scroll */
  }
}
```

**Key Deletions**:
1. All `grid-template-columns` declarations
2. All gap adjustments per breakpoint (standardize to 16px)
3. `align-content: start` (flexbox uses `align-items` instead)

**Key Additions**:
1. `display: flex;`
2. `flex-direction: column;`

---

**Validation Command**: `openspec validate adjust-gallery-layout-proportions --strict`
