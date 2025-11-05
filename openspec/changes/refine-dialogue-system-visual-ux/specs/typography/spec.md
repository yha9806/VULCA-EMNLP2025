# Spec: Dialogue Player Header Typography

**Change ID**: `refine-dialogue-system-visual-ux`
**Capability**: Header Typography Optimization
**Status**: Proposed

---

## Overview

Fix header title overflow issues and improve typographic hierarchy by reducing font sizes, adding responsive scaling, and implementing line clamping for long titles.

---

## Requirements

### ADDED

#### REQ-TYPO-001: Responsive Chinese Title Sizing
**Priority**: P0

The Chinese topic title SHALL use responsive font sizing with `clamp()` to prevent overflow on narrow viewports.

**Specification**:
- Base size: `clamp(1rem, 3vw, 1.2rem)`
- Min: 1rem (16px) on 320px mobile
- Max: 1.2rem (19.2px) on 1024px+ desktop
- Line height: 1.3 for compact stacking

**Validation**:
```css
/* styles/components/dialogue-player.css */
.dialogue-player__topic-zh {
  font-size: clamp(1rem, 3vw, 1.2rem);
  line-height: 1.3;
}
```

**Acceptance Criteria**:
- [ ] Font size scales smoothly from 1rem to 1.2rem
- [ ] No overflow on 375px viewport (iPhone SE)
- [ ] Title remains readable without zooming

---

#### REQ-TYPO-002: Responsive English Subtitle Sizing
**Priority**: P0

The English subtitle SHALL use smaller responsive sizing to establish clear visual hierarchy.

**Specification**:
- Base size: `clamp(0.85rem, 2.5vw, 0.95rem)`
- Min: 0.85rem (13.6px) on mobile
- Max: 0.95rem (15.2px) on desktop
- Opacity: 0.9 for secondary hierarchy

**Validation**:
```css
.dialogue-player__topic-en {
  font-size: clamp(0.85rem, 2.5vw, 0.95rem);
  opacity: 0.9;
  margin-top: 4px;
}
```

**Acceptance Criteria**:
- [ ] English subtitle is visually smaller than Chinese title
- [ ] Opacity creates clear hierarchy (90% vs 100%)
- [ ] Spacing (4px margin-top) separates bilingual lines

---

#### REQ-TYPO-003: Line Clamping for Long Titles
**Priority**: P1

The Chinese title SHALL support multi-line display with a maximum of 2 lines, using `-webkit-line-clamp` for overflow.

**Specification**:
- Max lines: 2
- Overflow behavior: Ellipsis (`...`)
- Tooltip on hover: Show full title if clamped

**Validation**:
```css
.dialogue-player__topic-zh {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

**JavaScript (tooltip)**:
```javascript
// In dialogue-player.js
_renderHeader() {
  const titleEl = document.querySelector('.dialogue-player__topic-zh');

  // Check if text is clamped
  if (titleEl.scrollHeight > titleEl.clientHeight) {
    titleEl.title = titleEl.textContent; // Native tooltip
  }
}
```

**Acceptance Criteria**:
- [ ] Titles longer than 2 lines display ellipsis
- [ ] Hover on clamped title shows full text in tooltip
- [ ] Layout does not break with very long titles (50+ characters)

---

#### REQ-TYPO-004: Enhanced Header Padding
**Priority**: P2

The header container SHALL have increased padding to provide breathing room for the smaller font sizes.

**Specification**:
- Padding: `28px 24px` (increased from `20px 16px`)
- Min-height: `80px` to prevent collapse

**Validation**:
```css
.dialogue-player__header {
  padding: 28px 24px;
  min-height: 80px;
}
```

**Acceptance Criteria**:
- [ ] Header does not feel cramped
- [ ] Title and participants have balanced spacing
- [ ] Min-height prevents layout shift during loading

---

### MODIFIED

#### REQ-TYPO-MODIFIED-001: Update Existing Topic Class
**Element**: `.dialogue-player__topic`

**Before**:
```css
.dialogue-player__topic {
  font-size: 1.5rem; /* Too large */
  line-height: 1.3;
}
```

**After**:
```css
.dialogue-player__topic {
  margin: 0 0 12px 0;
  font-weight: 600;
  /* Size moved to language-specific classes */
}
```

**Rationale**: Remove fixed size, delegate to `.dialogue-player__topic-zh` and `.dialogue-player__topic-en` for responsive control.

---

### REMOVED

None (existing classes modified, not removed)

---

## Scenarios

### Scenario 1: Long Title Displays Without Overflow

**Given** a dialogue thread with a long bilingual title: "机械笔触中的自然韵律：探索人工智能在艺术创作中的边界与可能性 / Natural Rhythm in Mechanical Brushstrokes: Exploring the Boundaries and Possibilities of AI in Art Creation"
**When** the dialogue player is rendered on a 375px viewport (mobile)
**Then** the Chinese title MUST display on maximum 2 lines
**And** the overflow MUST be truncated with ellipsis (`...`)
**And** the English subtitle MUST be fully visible below

**Validation**:
```javascript
// Test on iPhone SE viewport (375px)
const titleEl = document.querySelector('.dialogue-player__topic-zh');
const subtitleEl = document.querySelector('.dialogue-player__topic-en');

// Check line count (approximate - 2 lines × 1.3 line-height × 16px = ~41.6px)
assert(titleEl.clientHeight <= 45, 'Title max 2 lines');
assert(titleEl.scrollHeight > titleEl.clientHeight, 'Text is clamped');

// Check ellipsis visibility
const titleText = titleEl.textContent;
assert(titleText.includes('...') || titleEl.title !== '', 'Ellipsis or tooltip present');
```

---

### Scenario 2: Responsive Scaling Across Viewports

**Given** the dialogue player is rendered
**When** the viewport width changes from 375px to 1440px
**Then** the Chinese title font size MUST scale smoothly from 1rem to 1.2rem
**And** the English subtitle font size MUST scale smoothly from 0.85rem to 0.95rem
**And** no sudden jumps or layout shifts occur

**Validation**:
```javascript
// Test at breakpoints
const viewports = [375, 768, 1024, 1440];
const titleEl = document.querySelector('.dialogue-player__topic-zh');

viewports.forEach(width => {
  window.resizeTo(width, 800);
  const fontSize = parseFloat(window.getComputedStyle(titleEl).fontSize);

  // Verify within clamp range (16px - 19.2px)
  assert(fontSize >= 16 && fontSize <= 19.2, `Font size ${fontSize}px in range at ${width}px`);
});
```

---

### Scenario 3: Tooltip Shows Full Title on Clamp

**Given** a clamped title (2+ lines truncated to 2 lines)
**When** the user hovers over the title element
**Then** a native browser tooltip MUST appear
**And** the tooltip MUST display the full, untruncated title text

**Validation**:
```javascript
const titleEl = document.querySelector('.dialogue-player__topic-zh');

// Simulate long title
titleEl.textContent = '机械笔触中的自然韵律：探索人工智能在艺术创作中的边界与可能性与传统美学的对话空间';

// Trigger render (call component method)
dialoguePlayer._renderHeader();

// Check tooltip attribute
assert(titleEl.hasAttribute('title'), 'Title attribute exists');
assert(titleEl.title === titleEl.textContent, 'Tooltip shows full text');
```

---

### Scenario 4: Header Maintains Minimum Height

**Given** the dialogue player is rendered with a short title (e.g., "测试 / Test")
**When** the header content is minimal
**Then** the header container MUST maintain a minimum height of 80px
**And** the layout MUST not collapse or shift

**Validation**:
```javascript
const header = document.querySelector('.dialogue-player__header');
const headerHeight = header.clientHeight;

assert(headerHeight >= 80, `Header height ${headerHeight}px >= 80px`);
```

---

### Scenario 5: Visual Hierarchy is Clear

**Given** the dialogue player header is rendered
**When** the user views the bilingual title
**Then** the Chinese title MUST appear larger and bolder (primary)
**And** the English subtitle MUST appear smaller and slightly transparent (secondary)
**And** the visual weight difference MUST be immediately perceptible

**Validation**:
```javascript
const zhTitle = document.querySelector('.dialogue-player__topic-zh');
const enTitle = document.querySelector('.dialogue-player__topic-en');

const zhSize = parseFloat(window.getComputedStyle(zhTitle).fontSize);
const enSize = parseFloat(window.getComputedStyle(enTitle).fontSize);
const enOpacity = parseFloat(window.getComputedStyle(enTitle).opacity);

assert(zhSize > enSize, 'Chinese title larger than English');
assert(enOpacity === 0.9, 'English subtitle has 90% opacity');
```

---

## Dependencies

- **Upstream**: Color system spec (header background must be set first)
- **Downstream**: None

---

## Testing Strategy

### Manual Testing
1. **Viewport Testing**: Resize browser from 375px to 1920px, observe smooth scaling
2. **Long Title Testing**: Create thread with 100+ character title, verify 2-line clamp
3. **Hover Testing**: Hover over clamped title, verify tooltip appears
4. **Cross-Browser**: Test line-clamp in Chrome, Firefox, Safari (webkit prefix)

### Automated Testing
1. **Visual Regression**: Screenshot comparison at 3 breakpoints (375/768/1440px)
2. **Overflow Detection**: Automated check for `scrollHeight > clientHeight`
3. **Font Size Validation**: Computed style checks at breakpoints

---

## Browser Compatibility

### `-webkit-line-clamp` Support
- ✅ Chrome 6+ (2010)
- ✅ Firefox 68+ (2019, via `-webkit-` prefix)
- ✅ Safari 5+ (2010)
- ✅ Edge 17+ (2018)

**Fallback**: Not needed, 99%+ browser coverage. Older browsers simply show 3+ lines without truncation (acceptable degradation).

---

## Migration Notes

### Breaking Changes
None - this is a CSS-only change that improves existing behavior.

### Rollback
Revert CSS changes to restore original font sizes:
```css
.dialogue-player__topic {
  font-size: 1.5rem;
}

.dialogue-player__topic-en {
  font-size: 1.1rem;
}
```

---

## Success Metrics

- [ ] No title overflow on 375px mobile viewport
- [ ] Smooth font size transitions across all viewports
- [ ] Clamped titles show tooltips with full text
- [ ] User feedback confirms improved readability
- [ ] Visual hierarchy between Chinese/English is clear
