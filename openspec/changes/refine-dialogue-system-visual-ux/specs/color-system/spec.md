# Spec: Dialogue Player Color System Alignment

**Change ID**: `refine-dialogue-system-visual-ux`
**Capability**: Color System Alignment
**Status**: Proposed

---

## Overview

Replace the dialogue player's purple gradient header with warm, earthy tones that match VULCA's overall design system.

---

## Requirements

### ADDED

#### REQ-COLOR-001: Warm Gradient Header
**Priority**: P0

The dialogue player header SHALL use a warm gradient that aligns with the site's persona color palette.

**Specification**:
- Gradient: `linear-gradient(135deg, #B85C3C 0%, #D4A574 100%)`
- Colors derived from Su Shi persona (terracotta → gold)
- Applied to `.dialogue-player__header` class

**Validation**:
```css
/* styles/components/dialogue-player.css */
.dialogue-player__header {
  background: linear-gradient(135deg, #B85C3C 0%, #D4A574 100%);
}
```

**Acceptance Criteria**:
- [ ] Header gradient uses `#B85C3C` (start) and `#D4A574` (end)
- [ ] Gradient angle is 135deg (top-left to bottom-right)
- [ ] No purple colors (`#667eea`, `#764ba2`) remain in dialogue player

---

#### REQ-COLOR-002: Text Contrast Compliance
**Priority**: P0

All text on the warm gradient background SHALL meet WCAG AA contrast requirements (4.5:1 for normal text, 3:1 for large text).

**Specification**:
- White text (`#ffffff`) on warm gradient
- Add subtle text-shadow for enhanced readability: `0 1px 2px rgba(0, 0, 0, 0.1)`

**Validation**:
```css
.dialogue-player__header {
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
```

**Acceptance Criteria**:
- [ ] Contrast ratio ≥ 4.5:1 for topic text
- [ ] Contrast ratio ≥ 3:1 for participant badges
- [ ] Text remains legible on all viewport sizes

---

#### REQ-COLOR-003: Control Button Color Update
**Priority**: P1

The dialogue player control buttons SHALL use colors consistent with the new warm gradient header.

**Specification**:
- Primary control button: `#B85C3C` (terracotta)
- Hover state: `#A04B2F` (darker terracotta)
- Active mode toggle: Use warm gradient background

**Validation**:
```css
.control-button {
  background: #B85C3C;
}

.control-button:hover {
  background: #A04B2F;
}

.mode-toggle-btn.active {
  background: linear-gradient(135deg, #B85C3C 0%, #D4A574 100%);
}
```

**Acceptance Criteria**:
- [ ] Control buttons use terracotta color (`#B85C3C`)
- [ ] Hover states darken appropriately
- [ ] Active mode toggle matches header gradient

---

### MODIFIED

None (new styling applied to existing elements)

---

### REMOVED

#### REQ-COLOR-REMOVED-001: Purple Gradient
**Element**: `.dialogue-player__header`

The purple gradient (`#667eea → #764ba2`) is removed from the dialogue player header.

**Verification**:
- [ ] No instances of `#667eea` or `#764ba2` in `dialogue-player.css`
- [ ] `grep -r "#667eea\|#764ba2" styles/components/dialogue-player.css` returns no results

---

## Scenarios

### Scenario 1: Header Displays Warm Gradient

**Given** the dialogue player component is rendered on the page
**When** the user views the header section
**Then** the background MUST display a warm gradient from terracotta (#B85C3C) to gold (#D4A574)
**And** the gradient angle MUST be 135 degrees
**And** no purple colors are visible

**Validation**:
```javascript
// Visual test
const header = document.querySelector('.dialogue-player__header');
const computedStyle = window.getComputedStyle(header);
const bgImage = computedStyle.backgroundImage;

// Should contain: linear-gradient(135deg, rgb(184, 92, 60), rgb(212, 165, 116))
assert(bgImage.includes('rgb(184, 92, 60)'), 'Start color is terracotta');
assert(bgImage.includes('rgb(212, 165, 116)'), 'End color is gold');
```

---

### Scenario 2: Text Contrast Passes WCAG AA

**Given** the header uses the warm gradient background
**When** color contrast is measured for all text elements
**Then** the contrast ratio MUST be ≥ 4.5:1 for normal text
**And** the contrast ratio MUST be ≥ 3:1 for large text (topic title)

**Validation**:
```javascript
// Use WebAIM Contrast Checker API or manual testing
// Topic text (large, 1.2rem, bold)
const topicContrast = getContrastRatio('#ffffff', '#C57158'); // Mid-gradient color
assert(topicContrast >= 3.0, 'Topic contrast passes WCAG AA Large Text');

// Participant badges (normal, 0.9rem)
const badgeContrast = getContrastRatio('rgba(255,255,255,0.85)', '#C57158');
assert(badgeContrast >= 4.5, 'Badge contrast passes WCAG AA');
```

---

### Scenario 3: Control Buttons Match Header Theme

**Given** the dialogue player is rendered
**When** the user views the control buttons (play/pause, mode toggle)
**Then** the primary button MUST use terracotta background (#B85C3C)
**And** the active mode toggle MUST display the warm gradient
**And** hover states MUST darken colors appropriately

**Validation**:
```javascript
const playButton = document.querySelector('.control-button');
const activeToggle = document.querySelector('.mode-toggle-btn.active');

const buttonBg = window.getComputedStyle(playButton).backgroundColor;
const toggleBg = window.getComputedStyle(activeToggle).backgroundImage;

assert(buttonBg === 'rgb(184, 92, 60)', 'Button uses terracotta');
assert(toggleBg.includes('linear-gradient'), 'Active toggle uses gradient');
```

---

### Scenario 4: No Purple Colors Remain

**Given** the color system refactor is complete
**When** the CSS file is scanned for purple color codes
**Then** no instances of `#667eea` or `#764ba2` MUST exist in `dialogue-player.css`

**Validation**:
```bash
# Automated check
grep -i "#667eea\|#764ba2\|rgb(102, 126, 234)\|rgb(118, 75, 162)" \
  styles/components/dialogue-player.css

# Exit code 1 (no matches) = pass
# Exit code 0 (matches found) = fail
```

---

## Dependencies

- **Upstream**: None
- **Downstream**:
  - Typography spec (header text styling must complement new colors)
  - Control button refactoring (buttons must match new theme)

---

## Testing Strategy

### Manual Testing
1. **Visual Inspection**: Open dialogue player, verify header gradient is warm (not purple)
2. **Contrast Testing**: Use browser DevTools or WebAIM Contrast Checker
3. **Cross-Browser**: Test in Chrome, Firefox, Safari for gradient rendering consistency

### Automated Testing
1. **CSS Regression**: Screenshot test comparing before/after header colors
2. **Accessibility**: Automated contrast ratio validation with axe-core
3. **Code Search**: Grep for purple color codes (should return no matches)

---

## Migration Notes

### Breaking Changes
None - this is a pure CSS styling change with no JavaScript API changes.

### Rollback
Revert CSS changes to restore purple gradient:
```css
.dialogue-player__header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

---

## Success Metrics

- [ ] Header displays warm gradient (`#B85C3C → #D4A574`)
- [ ] All text contrast ratios pass WCAG AA
- [ ] Control buttons use terracotta color scheme
- [ ] Zero purple color instances in dialogue player CSS
- [ ] User feedback confirms improved visual cohesion
