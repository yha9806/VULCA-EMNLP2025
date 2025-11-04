# Design: Fix Navigation Alignment and Text

**Change ID**: `fix-navigation-alignment-and-text`
**Last Updated**: 2025-11-04

---

## Architectural Decisions

### AD-1: Use Absolute Positioning for Navigation Alignment

**Context**:
The unified navigation component introduced a vertical layout where the navigation bar occupies space above the image display area. This causes the image to be offset vertically from the critiques panel, breaking the horizontal alignment expectation.

**Considered Options**:

**Option A: Move Navigation Outside Component (Grid Layout)**
- Restructure HTML to extract navigation from `unified-navigation-container`
- Use CSS Grid on `.artwork-display` with 3 cells:
  ```
  Row 1: Navigation (spans 2 columns)
  Row 2: Image (col 1) | Critiques (col 2)
  ```
- **Pros**: Clean separation, navigation doesn't occlude image
- **Cons**:
  - Breaks component encapsulation (navigation no longer inside `UnifiedNavigation` component)
  - Requires HTML structure changes
  - Violates single responsibility principle (component should manage its own navigation)

**Option B: Absolute Positioning Inside Component**
- Keep navigation inside `unified-navigation-wrapper`
- Use `position: absolute` to float navigation above image
- Image fills full container height
- **Pros**:
  - Preserves component encapsulation
  - No HTML changes needed
  - Image and critiques align perfectly
  - Navigation remains visually associated with image area
- **Cons**:
  - Navigation may partially occlude top portion of image
  - Requires careful z-index management

**Option C: Negative Margin Compensation**
- Keep vertical layout but use negative margin on image container
- `margin-top: -[navigation-height]` to pull image upward
- **Pros**: Simple CSS-only fix
- **Cons**:
  - Fragile (breaks if navigation height changes)
  - Doesn't work well with responsive design
  - Still creates visual clutter (navigation and image overlap awkwardly)

**Decision**: **Option B - Absolute Positioning**

**Rationale**:
1. **Component Integrity**: Keeps navigation within the component that manages it
2. **No Breaking Changes**: HTML structure remains unchanged, no API modifications
3. **Visual Quality**: Semi-transparent background (already implemented) ensures readability
4. **Flexibility**: Easy to adjust position or add padding if occlusion becomes an issue
5. **Responsive**: Works across all breakpoints without additional media queries

**Trade-offs Accepted**:
- Navigation may cover image top edge (~60px height)
- **Mitigation**: Images already have placeholder system with safe margins
- **Mitigation**: Navigation has `rgba(255, 255, 255, 0.95)` background + `box-shadow` for visual separation

---

### AD-2: English-Only Navigation Text (Remove Bilingual Display)

**Context**:
The current navigation displays bilingual button text and uses Chinese separator "的" in the indicator ("1 的 4"), which reads awkwardly and creates visual clutter in the compact navigation bar.

**Considered Options**:

**Option A: Dynamic Language Toggle (Current Implementation)**
- Show Chinese or English based on `[data-lang]` attribute
- Indicator: "1 的 4" (Chinese) or "1 of 4" (English)
- Buttons: "上一件作品" / "Previous Artwork"
- **Pros**: Follows i18n best practices
- **Cons**:
  - Chinese numeric separator "的" is grammatically awkward
  - Bilingual spans increase button width
  - Requires maintaining CSS language selectors

**Option B: English-Only Display Text + Bilingual ARIA**
- Display text: Always English ("1 of 4", "Previous Artwork")
- ARIA labels: Bilingual (includes Chinese artwork titles)
- **Pros**:
  - English numeric format universally understood
  - Simpler HTML (no nested language spans)
  - Cleaner button design
  - Maintains accessibility for Chinese screen readers
- **Cons**:
  - Visual text not localized (but arrows ◄ ► are universal)

**Option C: Symbolic-Only Navigation**
- Remove all text, use only symbols: ◄ [1/4] ►
- Rely entirely on ARIA for text descriptions
- **Pros**: Language-agnostic, ultra-compact
- **Cons**:
  - Less discoverable (users may not understand what "1/4" means)
  - Reduces accessibility for sighted users

**Decision**: **Option B - English-Only Display + Bilingual ARIA**

**Rationale**:
1. **Clarity**: "1 of 4" is clearer than "1 的 4" for numeric pagination
2. **Universal Understanding**: English numerics/arrows recognized globally
3. **Accessibility Preserved**: ARIA labels still provide bilingual artwork titles
4. **Simplicity**: Removes 6 lines of CSS (language selector rules)
5. **User Feedback**: User explicitly requested English-only format

**Implementation Notes**:
- Remove `<span lang="zh">` and `<span lang="en">` wrappers
- Keep single `<span class="button-text">` with English content
- Preserve bilingual ARIA labels for screen readers:
  ```javascript
  aria-label="Previous artwork: 记忆（绘画操作单元：第二代）"
  ```

---

### AD-3: Preserve ARIA Bilingual Support

**Context**:
While display text is moving to English-only, ARIA labels provide accessibility metadata for screen readers.

**Decision**: **Keep ARIA labels bilingual** (include both Chinese and English artwork titles)

**Rationale**:
1. **Accessibility**: Chinese screen reader users benefit from native-language descriptions
2. **No Visual Impact**: ARIA labels are hidden from sighted users
3. **Low Maintenance Cost**: Artwork titles already exist in both languages in `VULCA_DATA`
4. **Best Practice**: Accessibility should not be reduced when simplifying UI

**Example**:
```javascript
// English display text
nextButton.textContent = "Next Artwork ►";

// Bilingual ARIA label
nextButton.setAttribute('aria-label',
  `Next artwork: 绘画操作单元：第一代（模仿） Painting Operation Unit: First Generation (Imitation)`
);
```

---

## CSS Architecture

### Positioning Strategy

**Before** (Static Layout):
```
┌─────────────────────────────┐
│ .unified-navigation-wrapper │ (flex column, gap: 16px)
│ ┌─────────────────────────┐ │
│ │ .artwork-navigation     │ │ ← Occupies 60px height
│ └─────────────────────────┘ │
│           ↓ gap: 16px       │
│ ┌─────────────────────────┐ │
│ │ .image-display-container│ │ ← Starts 76px below wrapper top
│ │                         │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

**After** (Absolute Positioning):
```
┌─────────────────────────────┐
│ .unified-navigation-wrapper │ (flex column, no gap)
│ ┌─────────────────────────┐ │ ← Absolute, floats above
│ │ .artwork-navigation     │ │    (top: 16px, z-index: 10)
│ └─────────────────────────┘ │
│ ╔═════════════════════════╗ │
│ ║ .image-display-container║ │ ← Starts at wrapper top (0px)
│ ║                         ║ │
│ ╚═════════════════════════╝ │
└─────────────────────────────┘
```

### Z-Index Layering

```
z-index: 10  → .artwork-navigation (floats above)
z-index: 5   → .image-carousel-controls (inside carousel)
z-index: 1   → .image-display-container
(default)    → .critiques-panel
```

**Rationale**: Navigation must be above image carousel controls to remain clickable.

---

## Responsive Behavior

### Mobile (< 600px)

**Current Layout**: Vertical stack (image above critiques)
```
┌─────────────────┐
│ [◄ Prev] 1 of 4 [Next ►] │ (floats above image)
│ ┌─────────────┐ │
│ │   Image     │ │
│ └─────────────┘ │
│                 │
│ Critiques...    │
└─────────────────┘
```

**Impact**:
- Absolute positioning works identically
- Navigation may cover more of image on small screens
- **Mitigation**: Navigation already has compact mobile styles (smaller padding)

### Tablet (600px - 1023px)

**Layout**: Side-by-side (60% image, 40% critiques)
```
┌──────────────────────────┬─────────────────┐
│ [◄ Prev] 1 of 4 [Next ►] │                 │
│ ┌──────────────────────┐ │ ┌─────────────┐ │ ← Aligned tops
│ │      Image           │ │ │ Critiques   │ │
│ └──────────────────────┘ │ └─────────────┘ │
└──────────────────────────┴─────────────────┘
```

**Impact**: Maximum benefit from alignment fix (most visible on this breakpoint)

### Desktop (> 1024px)

**Layout**: Side-by-side (60% image, 40% critiques, max-width constrained)

**Impact**: Same as tablet, with more spacing

---

## Performance Considerations

### Rendering Performance
- **No Impact**: Absolute positioning is GPU-accelerated (composite layer)
- **No Reflow**: Changing from `flex` to `absolute` is layout-shift-free (happens on mount)

### JavaScript Performance
- **Reduced DOM Nodes**: Removing bilingual spans reduces HTML by ~6 `<span>` elements per navigation render
- **Simplified Re-renders**: No language toggle logic needed

### Accessibility Performance
- **No Impact**: ARIA labels don't affect rendering performance
- **Screen Reader**: Bilingual labels may increase announcement time by ~0.5s (acceptable)

---

## Testing Strategy

### Visual Regression Testing
1. **Screenshot Comparison**: Image top vs critiques top (should be same horizontal line)
2. **Navigation Occlusion**: Verify image content visible below navigation bar
3. **Responsive Breakpoints**: Test alignment on 375px, 768px, 1024px, 1440px

### Functional Testing
1. **Click Handlers**: Verify buttons still trigger artwork navigation
2. **Keyboard Shortcuts**: Verify Shift+Arrow still works
3. **Boundary Conditions**: Test at first/last artwork (disabled states)

### Accessibility Testing
1. **Screen Reader**: Verify ARIA labels announce correctly (test with NVDA/JAWS)
2. **Focus Management**: Verify focus indicators visible above floating navigation
3. **Keyboard Navigation**: Verify Tab order logical

---

## Rollback Plan

### If Navigation Occludes Critical Content

**Option 1**: Add padding to image container
```css
.image-display-container {
  padding-top: 76px; /* Navigation height + gap */
}
```

**Option 2**: Revert to static positioning, accept misalignment

### If English-Only Text Causes Issues

**Rollback**: Restore bilingual spans from git history
```bash
git diff HEAD~1 js/components/unified-navigation.js
# Revert lines 350-390
```

---

## Future Enhancements

### Potential Improvements (Out of Scope for This Change)
1. **Auto-hide Navigation**: Fade out navigation after 3s of inactivity, show on hover
2. **Sticky Navigation**: Keep navigation fixed at top on scroll (for mobile)
3. **Animation**: Slide-in transition when navigation appears
4. **Customizable Position**: Allow users to move navigation to bottom of image

---

## References

- **Original Design**: `openspec/changes/unify-navigation-to-image-area/design.md`
- **CSS Positioning Spec**: [MDN - position: absolute](https://developer.mozilla.org/en-US/docs/Web/CSS/position)
- **ARIA Best Practices**: [W3C WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
