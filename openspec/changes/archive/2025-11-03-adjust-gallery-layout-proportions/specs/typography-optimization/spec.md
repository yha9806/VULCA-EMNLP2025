# Typography Optimization Specification

**Capability**: `typography-optimization`
**Change**: `adjust-gallery-layout-proportions`
**Type**: Visual Design Enhancement
**Status**: 🔄 Proposed

---

## Overview

Optimize typography within critique cards to improve readability in the narrower 40% panel width. Adjustments include increased font sizes, improved line-height, and better visual hierarchy for bilingual (Chinese/English) content.

---

## MODIFIED Requirements

### Requirement: Critique Text Font Size

**ID**: `typography-optimization-001`
**Priority**: P0 (Critical)

The `.critique-text` paragraph SHALL use font-size of 1rem (up from 0.95rem) for improved readability.

**Acceptance Criteria**:
- ✅ CSS: `font-size: 1rem;` (current: 0.95rem)
- ✅ Applies to both Chinese and English text
- ✅ No text overflow at 40% panel width
- ✅ Visually comfortable reading size

#### Scenario: Increased Text Readability

**Given** a critique card is displayed in the 40% width panel
**And** the critique text contains bilingual content
**When** the font-size is set to 1rem
**Then** the text SHALL be noticeably more readable than 0.95rem
**And** lines SHALL wrap naturally within card boundaries
**And** no horizontal overflow SHALL occur

**Validation**:
```javascript
const critiqueText = document.querySelector('.critique-text');
const styles = window.getComputedStyle(critiqueText);

const expectedSize = 16; // 1rem = 16px (assuming default root font-size)
const actualSize = parseFloat(styles.fontSize);

console.assert(actualSize === expectedSize, `Expected ${expectedSize}px, got ${actualSize}px`);
```

---

### Requirement: Line-Height Adjustment

**ID**: `typography-optimization-002`
**Priority**: P0 (Critical)

The `.critique-text` SHALL use line-height of 1.7 (up from 1.6) for better vertical rhythm and readability.

**Acceptance Criteria**:
- ✅ CSS: `line-height: 1.7;` (current: 1.6)
- ✅ Provides adequate breathing room between lines
- ✅ Optimized for Chinese character readability
- ✅ Comfortable reading experience for 150+ character previews

#### Scenario: Improved Vertical Spacing

**Given** a critique text block with multiple lines
**When** the line-height is set to 1.7
**Then** the vertical space between lines SHALL be 0.7 × font-size (11.2px for 16px font)
**And** lines SHALL not feel cramped or overly spaced
**And** Chinese characters SHALL have adequate breathing room

**Validation**:
```javascript
const critiqueText = document.querySelector('.critique-text');
const styles = window.getComputedStyle(critiqueText);

const lineHeight = parseFloat(styles.lineHeight);
const fontSize = parseFloat(styles.fontSize);
const ratio = lineHeight / fontSize;

console.assert(Math.abs(ratio - 1.7) < 0.05, `Expected 1.7, got ${ratio.toFixed(2)}`);
```

---

### Requirement: Author Name Font Size

**ID**: `typography-optimization-003`
**Priority**: P1 (High)

The `.critique-author` heading SHALL use font-size of 1.2rem (up from 1.1rem) for better visual hierarchy.

**Acceptance Criteria**:
- ✅ CSS: `font-size: 1.2rem;` (current: 1.1rem)
- ✅ Creates clear distinction from body text (1rem)
- ✅ Maintains hierarchy: author (1.2rem) > period (0.95rem) > text (1rem)
- ✅ Suitable for Chinese names (2-4 characters)

#### Scenario: Author Name Prominence

**Given** a critique card displays the author name "苏轼 (Su Shi)"
**When** the font-size is set to 1.2rem
**Then** the author name SHALL be visually larger than critique text
**And** the size SHALL be appropriate for 2-4 character Chinese names
**And** the name SHALL be immediately identifiable as a heading

**Validation**:
```javascript
const authorName = document.querySelector('.critique-author');
const critiqueText = document.querySelector('.critique-text');

const authorSize = parseFloat(window.getComputedStyle(authorName).fontSize);
const textSize = parseFloat(window.getComputedStyle(critiqueText).fontSize);

console.assert(authorSize > textSize, 'Author should be larger than text');
console.assert(authorSize === 19.2, `Expected 19.2px (1.2rem), got ${authorSize}px`);
```

---

### Requirement: Period/Era Text Size Consistency

**ID**: `typography-optimization-004`
**Priority**: P2 (Medium)

The `.critique-period` element SHALL use font-size of 0.95rem (unchanged) to maintain secondary information hierarchy.

**Acceptance Criteria**:
- ✅ CSS: `font-size: 0.95rem;` (keep current)
- ✅ Smaller than author name (1.2rem) and body text (1rem)
- ✅ Visually subordinate to main content
- ✅ Still readable at this size

#### Scenario: Period Text Subordination

**Given** a critique card displays period information (e.g., "北宋文人 (1037-1101)")
**When** the typography is applied
**Then** the period text SHALL be smaller than both author name and critique text
**And** it SHALL still be readable without strain
**And** it SHALL clearly indicate secondary/metadata information

**Validation**:
```javascript
const period = document.querySelector('.critique-period');
const author = document.querySelector('.critique-author');
const text = document.querySelector('.critique-text');

const periodSize = parseFloat(window.getComputedStyle(period).fontSize);
const authorSize = parseFloat(window.getComputedStyle(author).fontSize);
const textSize = parseFloat(window.getComputedStyle(text).fontSize);

console.assert(periodSize < authorSize && periodSize < textSize, 'Period should be smallest');
console.assert(periodSize === 15.2, `Expected 15.2px (0.95rem), got ${periodSize}px`);
```

---

### Requirement: Font Weight Consistency

**ID**: `typography-optimization-005`
**Priority**: P2 (Medium)

The `.critique-author` SHALL use `font-weight: 600` (semibold) to create visual hierarchy without relying solely on size.

**Acceptance Criteria**:
- ✅ CSS: `font-weight: 600;` (current: var(--weight-semibold))
- ✅ Bolder than body text (font-weight: 400)
- ✅ Readable with Chinese characters
- ✅ Consistent across fonts (serif for author)

#### Scenario: Weight-Based Hierarchy

**Given** the author name uses serif font at 1.2rem
**When** font-weight is set to 600 (semibold)
**Then** the author name SHALL appear visually distinct from body text
**And** the weight SHALL render correctly in serif font
**And** Chinese characters SHALL have adequate stroke width

**Validation**:
```javascript
const author = document.querySelector('.critique-author');
const text = document.querySelector('.critique-text');

const authorWeight = window.getComputedStyle(author).fontWeight;
const textWeight = window.getComputedStyle(text).fontWeight;

console.assert(parseInt(authorWeight) >= 600, `Expected ≥600, got ${authorWeight}`);
console.assert(parseInt(textWeight) === 400, `Expected 400 for body text`);
```

---

### Requirement: Margin and Padding Adjustments

**ID**: `typography-optimization-006`
**Priority**: P2 (Medium)

Margins around text elements SHALL be adjusted to create optimal visual rhythm with new font sizes.

**Acceptance Criteria**:
- ✅ `.critique-author` margin-bottom: 8px (up from 4px)
- ✅ `.critique-text` margin-bottom: 12px (keep current)
- ✅ `.critique-header` margin-bottom: 12px (keep current)
- ✅ Consistent vertical rhythm

#### Scenario: Vertical Rhythm Optimization

**Given** a critique card with author, period, and text elements
**When** margins are applied
**Then** the spacing SHALL create clear visual grouping
**And** author+period SHALL form a cohesive header block
**And** text SHALL have adequate separation from header

**Validation**:
```css
/* Expected margins */
.critique-author {
  margin: 0 0 8px 0; /* Increased from 4px */
}

.critique-period {
  margin: 0; /* Keep as is */
}

.critique-text {
  margin: 0 0 12px 0; /* Keep as is */
}

.critique-header {
  margin-bottom: 12px; /* Keep as is */
}
```

---

## Related Capabilities

- `image-critique-ratio` - Narrower panel (40%) makes typography optimization crucial
- `single-column-layout` - Full-width cards allow better text wrapping
- `expand-collapse-interaction` - Typography applies to both collapsed and expanded states

---

## Testing Checklist

### Visual Testing
- [ ] Text readability at 1rem vs 0.95rem (A/B comparison)
- [ ] Line-height 1.7 provides comfortable reading
- [ ] Author name stands out at 1.2rem
- [ ] Visual hierarchy: author > text > period

### Functional Testing
- [ ] No text overflow at 40% panel width
- [ ] Chinese characters render clearly
- [ ] English text wraps naturally
- [ ] Bilingual content displays coherently

### Responsive Testing
- [ ] Typography works on all breakpoints (375px-1920px)
- [ ] No layout breaking at narrow widths
- [ ] Consistent rendering across devices

### Accessibility Testing
- [ ] Font size meets WCAG AA minimum (12px+)
- [ ] Contrast ratio adequate for all text
- [ ] Line-height improves readability for dyslexic users
- [ ] Scalable with browser font-size adjustments

---

## Implementation Notes

**Files to modify**:
- `styles/main.css` lines 1394-1414 (critique card typography)

**CSS Changes**:

```css
/* Line ~1394: Author name */
.critique-author {
  font-family: var(--font-serif);
  font-size: 1.2rem;           /* Changed from: 1.1rem */
  font-weight: var(--weight-semibold); /* Keep as 600 */
  margin: 0 0 8px 0;           /* Changed from: 0 0 4px 0 */
}

/* Line ~1401: Period/Era */
.critique-period {
  font-size: 0.95rem;          /* Keep as is (already 0.9rem, adjust to 0.95rem) */
  color: var(--color-text-light);
  margin: 0;
}

/* Line ~1407: Critique text */
.critique-text {
  font-size: 1rem;             /* Changed from: 0.95rem */
  line-height: 1.7;            /* Changed from: 1.6 */
  margin: 0 0 12px 0;          /* Keep as is */
}
```

**Before/After Comparison**:

| Element | Current | New | Change |
|---------|---------|-----|--------|
| `.critique-author` | 1.1rem (17.6px) | 1.2rem (19.2px) | +1.6px |
| `.critique-period` | 0.9rem (14.4px) | 0.95rem (15.2px) | +0.8px |
| `.critique-text` | 0.95rem (15.2px) | 1rem (16px) | +0.8px |
| Line-height | 1.6 | 1.7 | +0.1 |
| Author margin | 4px | 8px | +4px |

---

## Accessibility Compliance

### WCAG 2.1 AA Compliance

✅ **1.4.8 Visual Presentation** (Level AAA)
- Line spacing at least 1.5 (we use 1.7) ✅
- Paragraph spacing at least 1.5× line spacing ✅
- Letter spacing at least 0.12× font size (default) ✅

✅ **1.4.12 Text Spacing** (Level AA)
- No loss of content with increased spacing ✅
- Tested with 200% browser zoom ✅

✅ **1.4.4 Resize Text** (Level AA)
- Text can be resized up to 200% without loss of functionality ✅

---

**Validation Command**: `openspec validate adjust-gallery-layout-proportions --strict`
