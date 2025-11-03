# Image-Critique Ratio Specification

**Capability**: `image-critique-ratio`
**Change**: `adjust-gallery-layout-proportions`
**Type**: Layout Proportion Adjustment
**Status**: 🔄 Proposed

---

## Overview

Adjust the flex-basis ratio of `.artwork-image-container` and `.critiques-panel` from 40:60 to 60:40, prioritizing artwork imagery while maintaining critique readability. This change applies to all responsive breakpoints (≥768px).

---

## MODIFIED Requirements

### Requirement: Desktop Image Container Ratio

**ID**: `image-critique-ratio-001`
**Priority**: P0 (Critical)

The `.artwork-image-container` element SHALL occupy 60% of the `.artwork-display` container width on desktop viewports (≥1024px).

**Acceptance Criteria**:
- ✅ CSS property: `flex: 0 0 60%`
- ✅ Applied to `@media (min-width: 1024px)` breakpoint
- ✅ Image width increased from current 40% to 60%
- ✅ No aspect ratio distortion (maintain 16:9 or 3:2)

#### Scenario: Desktop Image Ratio Application

**Given** the user is viewing the gallery on a desktop screen (1024px+ width)
**And** an artwork is displayed in the gallery hero section
**When** the page layout is calculated
**Then** the `.artwork-image-container` SHALL occupy 60% of the horizontal space
**And** the `.critiques-panel` SHALL occupy 40% of the horizontal space
**And** the total SHALL equal 100% (accounting for gap)

**Validation**:
```javascript
// Browser DevTools Console
const container = document.querySelector('.artwork-image-container');
const panel = document.querySelector('.critiques-panel');
const display = document.querySelector('.artwork-display');

const containerWidth = container.offsetWidth;
const displayWidth = display.offsetWidth;
const ratio = (containerWidth / displayWidth) * 100;

console.assert(ratio >= 59 && ratio <= 61, `Expected ~60%, got ${ratio.toFixed(1)}%`);
// Expected: ratio ≈ 60% (within 1% tolerance for rounding)
```

---

### Requirement: Tablet Image Container Ratio

**ID**: `image-critique-ratio-002`
**Priority**: P0 (Critical)

The `.artwork-image-container` element SHALL occupy 60% of the `.artwork-display` container width on tablet viewports (768px–1023px).

**Acceptance Criteria**:
- ✅ CSS property: `flex: 0 0 60%`
- ✅ Applied to `@media (min-width: 768px)` breakpoint
- ✅ Image width increased from current 35% to 60%
- ✅ Consistent with desktop ratio

#### Scenario: Tablet Image Ratio Application

**Given** the user is viewing the gallery on a tablet (768px width)
**And** an artwork is displayed
**When** the responsive layout is applied
**Then** the `.artwork-image-container` SHALL occupy 60% width
**And** the `.critiques-panel` SHALL occupy 40% width
**And** both elements SHALL display horizontally (flex-direction: row)

**Validation**:
```css
/* Expected CSS at 768px breakpoint */
@media (min-width: 768px) {
  .artwork-display {
    flex-direction: row;
  }
  .artwork-image-container {
    flex: 0 0 60%; /* Changed from 35% */
  }
  .critiques-panel {
    flex: 0 0 40%; /* Changed from 65% */
  }
}
```

---

### Requirement: Large Screen Image Ratio Consistency

**ID**: `image-critique-ratio-003`
**Priority**: P1 (High)

The `.artwork-image-container` SHALL maintain 60% flex-basis on large screens (1440px+) and ultra-wide displays (1920px+).

**Acceptance Criteria**:
- ✅ CSS property consistent across all large breakpoints
- ✅ Applied to `@media (min-width: 1440px)` breakpoint
- ✅ Applied to `@media (min-width: 1920px)` breakpoint
- ✅ Image does not exceed max-width: 1600px (constrained by gallery-hero)

#### Scenario: Large Screen Ratio Consistency

**Given** the user is viewing on a 1440px or 1920px wide screen
**And** the gallery hero is center-aligned with max-width constraint
**When** the artwork display is rendered
**Then** the image container SHALL occupy 60% of the available space
**And** the critiques panel SHALL occupy 40%
**And** the layout SHALL remain horizontally balanced

**Validation**:
```javascript
// Test at 1920px viewport
window.resizeTo(1920, 1080);

const image = document.querySelector('.artwork-image-container');
const critiques = document.querySelector('.critiques-panel');

const imagePercent = (image.offsetWidth / image.parentElement.offsetWidth) * 100;
const critiquesPercent = (critiques.offsetWidth / critiques.parentElement.offsetWidth) * 100;

console.assert(imagePercent >= 59 && imagePercent <= 61, `Image: ${imagePercent}%`);
console.assert(critiquesPercent >= 39 && critiquesPercent <= 41, `Critiques: ${critiquesPercent}%`);
```

---

### Requirement: Mobile Vertical Stack Preservation

**ID**: `image-critique-ratio-004`
**Priority**: P0 (Critical)

The 60:40 ratio SHALL NOT apply to mobile viewports (<768px). Mobile layout SHALL maintain vertical stack with full-width elements.

**Acceptance Criteria**:
- ✅ Mobile: `flex-direction: column`
- ✅ Image: full width (flex: 0 0 auto or 100%)
- ✅ Critiques: full width
- ✅ No horizontal split on small screens

#### Scenario: Mobile Vertical Stack

**Given** the user is viewing on a mobile device (375px width)
**When** the gallery page loads
**Then** the `.artwork-display` SHALL use `flex-direction: column`
**And** the `.artwork-image-container` SHALL occupy 100% width
**And** the `.critiques-panel` SHALL occupy 100% width
**And** both SHALL stack vertically (image on top, critiques below)

**Validation**:
```css
/* Mobile base styles (no media query) */
.artwork-display {
  flex-direction: column;
  gap: 15px;
}

.artwork-image-container {
  flex: 0 0 auto;
  /* Full width, auto height based on aspect-ratio */
}

.critiques-panel {
  flex: 1;
  /* Full width */
}
```

---

### Requirement: Gap and Spacing Adjustment

**ID**: `image-critique-ratio-005`
**Priority**: P2 (Medium)

The gap between `.artwork-image-container` and `.critiques-panel` SHALL be adjusted for optimal visual balance with 60:40 ratio.

**Acceptance Criteria**:
- ✅ Desktop gap: 48px (increased from 40px for better separation)
- ✅ Tablet gap: 40px (increased from 20px)
- ✅ Mobile gap: 15px (unchanged)
- ✅ Visually balanced spacing

#### Scenario: Spacing Adjustment for New Ratio

**Given** the image now occupies 60% width
**And** the critiques occupy 40% width
**When** the layout is rendered
**Then** the gap between image and critiques SHALL be 48px on desktop
**And** the gap SHALL provide clear visual separation
**And** the gap SHALL not cause horizontal overflow

**Validation**:
```css
/* Desktop */
@media (min-width: 1024px) {
  .artwork-display {
    gap: 48px; /* Increased from 40px */
  }
}

/* Tablet */
@media (min-width: 768px) {
  .artwork-display {
    gap: 40px; /* Increased from 20px */
  }
}
```

---

## Related Capabilities

- `single-column-layout` - Critiques panel layout changes
- `typography-optimization` - Text readability within 40% constraint
- `expand-collapse-interaction` - Content management for narrower critique panel

---

## Testing Checklist

### Visual Testing
- [ ] Desktop (1024px): Image 60%, critiques 40%
- [ ] Tablet (768px): Image 60%, critiques 40%
- [ ] Large (1440px): Image 60%, critiques 40%
- [ ] Ultra-wide (1920px): Image 60%, critiques 40%
- [ ] Mobile (375px): Vertical stack, full-width elements

### Functional Testing
- [ ] No horizontal overflow at any breakpoint
- [ ] Gap spacing visually balanced
- [ ] Image aspect ratio maintained
- [ ] Critiques panel scrollable (40% width sufficient)

### Cross-Browser Testing
- [ ] Chrome 120+
- [ ] Firefox 121+
- [ ] Safari 17+
- [ ] Edge 120+

---

## Implementation Notes

**Files to modify**:
- `styles/main.css` lines 1566-1683 (responsive breakpoints)

**CSS Changes**:
```css
/* Line 1570-1571: Tablet (768px) */
.artwork-image-container {
  flex: 0 0 60%; /* Changed from: flex: 0 0 35%; */
}

/* Line 1575-1576: Tablet critiques */
.critiques-panel {
  flex: 0 0 40%; /* Changed from: flex: 0 0 65%; */
}

/* Line 1596-1597: Desktop (1024px) */
.artwork-image-container {
  flex: 0 0 60%; /* Changed from: flex: 0 0 40%; */
}

/* Line 1600-1601: Desktop critiques */
.critiques-panel {
  flex: 0 0 40%; /* Changed from: flex: 0 0 60%; */
}

/* Line 1635-1636: Large (1440px) */
.artwork-image-container {
  flex: 0 0 60%; /* Changed from: flex: 0 0 35%; */
}

/* Line 1639-1640: Large critiques */
.critiques-panel {
  flex: 0 0 40%; /* Changed from: flex: 0 0 65%; */
}

/* Line 1674-1675: Ultra-wide (1920px) */
.artwork-image-container {
  flex: 0 0 60%; /* Changed from: flex: 0 0 35%; */
}

/* Line 1678-1679: Ultra-wide critiques */
.critiques-panel {
  flex: 0 0 40%; /* Changed from: flex: 0 0 65%; */
}
```

---

**Validation Command**: `openspec validate adjust-gallery-layout-proportions --strict`
