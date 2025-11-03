# Adjust Gallery Layout Proportions - OpenSpec Proposal

**Change ID**: `adjust-gallery-layout-proportions`
**Status**: 🔄 Proposed
**Date**: 2025-11-03
**Author**: Claude Code + User Vision
**Target Audience**: Gallery visitors, art enthusiasts viewing artworks and critiques

---

## Executive Summary

Rebalance the homepage gallery layout to prioritize artwork imagery while improving critique readability. This change shifts the image-to-critique ratio from 40-60 to **60-40** (image-first), converts critique display from multi-column grid to **single-column vertical list**, optimizes **typography** for better reading experience, and adds **expand/collapse functionality** for critique text management.

### Key Transformation Points

| Aspect | Current | Redesigned |
|--------|---------|-----------|
| **Image:Critique Ratio (Desktop)** | 40:60 (critique-heavy) | 60:40 (image-first) |
| **Critique Layout** | Multi-column grid (3-4 columns) | Single-column vertical list |
| **Typography** | Font size 0.95rem, line-height 1.6 | Larger font, optimized line-height |
| **Text Display** | Truncated preview (250 chars) | Collapsed preview + expand button |
| **Scrolling** | Grid cells scroll together | Single smooth vertical scroll |
| **Responsive Behavior** | Different column counts per breakpoint | Consistent single-column across all devices |

---

## Problem Statement

### Current Issues

1. **Image-Critique Imbalance**
   - Current desktop ratio (40:60) prioritizes critiques over artwork
   - Artwork images feel cramped, especially for visually-rich pieces
   - Image container `flex: 0 0 40%` leaves only 40% width for visual content

2. **Multi-Column Grid Complexity**
   - Desktop shows 3-4 columns of critique cards
   - Difficult to scan and read critiques sequentially
   - Cards have varying heights, creating visual fragmentation
   - Horizontal eye movement required to read all critiques

3. **Typography Readability**
   - Font size 0.95rem may be too small for comfortable reading
   - Line-height 1.6 adequate but could be improved
   - Text preview truncation at 250 characters sometimes cuts mid-sentence

4. **No Expand/Collapse Interaction**
   - Users cannot view full critique text in-place
   - Must rely on fixed preview length
   - No progressive disclosure pattern

### User Impact

- **Artwork appreciation**: Images don't get sufficient visual prominence
- **Reading flow**: Multi-column layout disrupts natural reading sequence
- **Content discovery**: Users may miss critiques due to grid layout scanning difficulty
- **Interaction**: No control over text detail level

---

## Proposed Solution

### What Changes

#### 1. Image-Critique Ratio Adjustment
**All Breakpoints** (375px to 1920px):
```css
/* Current */
.artwork-image-container { flex: 0 0 40%; }
.critiques-panel { flex: 0 0 60%; }

/* New */
.artwork-image-container { flex: 0 0 60%; }
.critiques-panel { flex: 0 0 40%; }
```

#### 2. Single-Column Critique Layout
**Replace grid with vertical list**:
```css
/* Current */
.critiques-panel {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Desktop */
  gap: 24px;
}

/* New */
.critiques-panel {
  display: flex;
  flex-direction: column;
  gap: 16px; /* Tighter vertical spacing */
}
```

#### 3. Typography Optimization
**Increase font size and adjust line-height**:
```css
/* Current */
.critique-text {
  font-size: 0.95rem;
  line-height: 1.6;
}

/* New */
.critique-text {
  font-size: 1rem;        /* Larger for better readability */
  line-height: 1.7;       /* More generous line spacing */
}

.critique-author {
  font-size: 1.2rem;      /* Up from 1.1rem */
}
```

#### 4. Expand/Collapse Functionality
**Add JavaScript interaction**:
```javascript
// Default: Show 150 characters preview
// Click "展开" button → Show full text
// Click "收起" button → Collapse to preview

function toggleCritiqueExpansion(cardElement) {
  const textElement = cardElement.querySelector('.critique-text');
  const button = cardElement.querySelector('.critique-toggle-btn');

  if (cardElement.classList.contains('expanded')) {
    // Collapse
    textElement.textContent = truncateText(fullText, 150);
    button.textContent = '展开 ▼';
    cardElement.classList.remove('expanded');
  } else {
    // Expand
    textElement.textContent = fullText;
    button.textContent = '收起 ▲';
    cardElement.classList.add('expanded');
  }
}
```

### Why

**Image-first philosophy**: The exhibition is about artworks, not text. Visual content should dominate the layout.

**Reading ergonomics**: Single-column layout follows natural reading patterns (top-to-bottom) and reduces cognitive load.

**Typography**: Larger font improves readability on all devices, especially for bilingual content (Chinese + English).

**Progressive disclosure**: Expand/collapse gives users control over detail level, reducing initial visual clutter while preserving access to full content.

### How

**Implementation Steps**:

1. **Phase 1: CSS Ratio Adjustment** (10 min)
   - Update `.artwork-image-container` flex basis to 60%
   - Update `.critiques-panel` flex basis to 40%
   - Test across all breakpoints (375/768/1024/1440/1920px)

2. **Phase 2: Single-Column Layout** (15 min)
   - Replace `display: grid` with `display: flex; flex-direction: column`
   - Remove all `grid-template-columns` media queries
   - Adjust gap and padding for vertical rhythm

3. **Phase 3: Typography Optimization** (10 min)
   - Update font-size for `.critique-text`, `.critique-author`, `.critique-period`
   - Adjust line-height for better readability
   - Test with Chinese and English content

4. **Phase 4: Expand/Collapse** (30 min)
   - Add `.critique-toggle-btn` to critique card HTML
   - Implement `toggleCritiqueExpansion()` in `gallery-hero.js`
   - Add CSS for button styling and expanded state
   - Update `renderCritiques()` to include toggle buttons

5. **Phase 5: Testing** (15 min)
   - Visual regression testing across all breakpoints
   - Interaction testing (expand/collapse)
   - Accessibility testing (keyboard navigation, ARIA)
   - Performance check (no layout shift)

---

## Success Metrics

### Functional Requirements
- ✅ Image occupies 60% width, critiques 40% (desktop/tablet)
- ✅ Critiques display in single column on all devices
- ✅ Font size increased to 1rem with line-height 1.7
- ✅ Expand button shows full critique text
- ✅ Collapse button returns to preview mode

### Visual Quality
- ✅ No layout shift when expanding/collapsing
- ✅ Smooth transition animations
- ✅ Consistent vertical rhythm in critique list
- ✅ Images maintain aspect ratio across all viewports

### Accessibility
- ✅ Toggle buttons keyboard-accessible (Tab + Enter)
- ✅ ARIA attributes for expanded state (`aria-expanded`)
- ✅ Screen reader announces state changes
- ✅ Focus indicators visible

### Performance
- ✅ No reflow issues when toggling text
- ✅ Smooth scrolling in critique panel
- ✅ No performance degradation with 6 critique cards

---

## Dependencies

### Code Files
- `styles/main.css` - Layout ratio, grid-to-flex conversion, typography
- `js/gallery-hero.js` - Expand/collapse interaction logic
- `index.html` - Minimal changes (may need toggle button markup)

### Data Files
- `js/data.js` - No changes required (critiques already have full text)

### External Dependencies
- None

---

## Risks and Mitigations

### Risk 1: Content Overflow
**Risk**: With only 40% width, critique panel may feel cramped
**Mitigation**: Single-column layout maximizes vertical space; expand/collapse manages text length

### Risk 2: Mobile Layout
**Risk**: 60-40 ratio may not work on small screens
**Mitigation**: Use vertical stack on mobile (<768px) as before, ratio only applies to desktop

### Risk 3: Reading Flow Disruption
**Risk**: Users may need to scroll more to see all critiques
**Mitigation**: Vertical scroll is more natural than grid scanning; smooth scroll enhances UX

### Risk 4: Expand/Collapse Performance
**Risk**: Multiple expanded cards may cause layout thrashing
**Mitigation**: Use CSS transitions, batch DOM updates, test with all 6 cards expanded

---

## Timeline Estimate

| Phase | Duration | Cumulative |
|-------|----------|------------|
| Proposal & Design | 15 min | 15 min |
| Specs Writing | 25 min | 40 min |
| Phase 1: CSS Ratio | 10 min | 50 min |
| Phase 2: Single-Column | 15 min | 65 min |
| Phase 3: Typography | 10 min | 75 min |
| Phase 4: Expand/Collapse | 30 min | 105 min |
| Phase 5: Testing | 15 min | 120 min |
| **Total** | **120 min** | **2 hours** |

---

## Future Enhancements

- **Smooth scroll animation**: Auto-scroll to expanded card
- **Persist expansion state**: Remember which critiques user expanded
- **"Expand All" / "Collapse All"**: Batch toggle for all critiques
- **Image zoom**: Click image to view full-screen
- **Responsive ratio**: Different ratios for ultra-wide monitors (21:9)

---

## Related Changes

- `2025-11-03-add-interactive-persona-selector` - Persona selection affects which critiques display
- `2025-11-02-fix-responsive-layout-issues` - Previous responsive layout work
- `2025-11-02-fix-gallery-hero-css-alignment` - Hero section alignment fixes

---

**Ready for validation**: Run `openspec validate adjust-gallery-layout-proportions --strict`
