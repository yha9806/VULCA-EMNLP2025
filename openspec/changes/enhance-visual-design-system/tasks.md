# Tasks: Visual Design System Enhancement

**Change ID**: `enhance-visual-design-system`
**Total Estimated Time**: 4 hours

---

## Phase 1: Design Tokens Foundation (30min)

### Task 1.1: Create design tokens file (15min)
- [ ] Create `styles/design-tokens.css`
- [ ] Define all CSS variables (colors, shadows, radius, typography, spacing)
- [ ] Add comprehensive comments
- [ ] **Success**: File created with 50+ design tokens

### Task 1.2: Import design tokens (15min)
- [ ] Import tokens in `index.html`
- [ ] Import tokens in `pages/exhibitions-archive.html`
- [ ] Import tokens in `pages/about.html`
- [ ] Verify tokens load in browser console
- [ ] **Success**: CSS variables accessible in all pages

---

## Phase 2: Component Unification (2h)

### Task 2.1: Update exhibition cards (30min)
- [ ] Replace `border-radius: 8px` with `var(--radius-md)`
- [ ] Replace shadow values with `var(--shadow-md)` and `var(--shadow-lg)`
- [ ] Verify hover effects still work
- [ ] Test on homepage and archive page
- [ ] **Success**: Cards look identical, use design tokens

### Task 2.2: Update global navigation (20min)
- [ ] Replace shadow value with `var(--shadow-sm)`
- [ ] Apply font size variables to nav items
- [ ] Update hover states
- [ ] Test mobile hamburger menu
- [ ] **Success**: Navigation uses design tokens, works responsively

### Task 2.3: Update buttons and CTAs (20min)
- [ ] Standardize button padding
- [ ] Apply border radius variable
- [ ] Unify hover/active states
- [ ] Update language toggle button
- [ ] **Success**: All buttons follow same style

### Task 2.4: Update Hero section (20min)
- [ ] Apply spacing variables to padding
- [ ] Apply type scale to headings
- [ ] Optimize clamp() values for fluid typography
- [ ] Test at multiple viewport sizes
- [ ] **Success**: Hero scales smoothly, uses tokens

### Task 2.5: Update footer (10min)
- [ ] Apply spacing variables
- [ ] Apply type scale to footer text
- [ ] Verify link styles
- [ ] **Success**: Footer matches design system

### Task 2.6: Verify exhibition pages (20min)
- [ ] Open `/exhibitions/negative-space-of-the-tide/`
- [ ] Check dialogue player still renders correctly
- [ ] Check thought chain still works
- [ ] Check responsive behavior
- [ ] **Success**: No visual regressions

---

## Phase 3: Typography & Spacing (1.5h)

### Task 3.1: Apply type scale to headings (30min)
- [ ] Update all h1 elements with type scale
- [ ] Update all h2 elements
- [ ] Update all h3 elements
- [ ] Apply line height variables
- [ ] Test at mobile/tablet/desktop
- [ ] **Success**: Typography follows modular scale

### Task 3.2: Optimize body text (20min)
- [ ] Apply `--font-size-base` to body text
- [ ] Set line height to `var(--leading-normal)`
- [ ] Improve Chinese-English spacing
- [ ] Test readability at multiple sizes
- [ ] **Success**: Body text comfortable to read

### Task 3.3: Implement vertical rhythm (30min)
- [ ] Update section padding to use spacing variables
- [ ] Update margin between elements (8px multiples)
- [ ] Check vertical spacing consistency
- [ ] Test on all pages
- [ ] **Success**: Consistent vertical rhythm

### Task 3.4: Optimize card content spacing (10min)
- [ ] Update card padding with spacing variables
- [ ] Update gap between card elements
- [ ] Verify stats layout
- [ ] Test overflow behavior
- [ ] **Success**: Cards have consistent internal spacing

---

## Phase 4: Testing & Validation (30min)

### Task 4.1: Visual regression testing (15min)
- [ ] Screenshot homepage (before/after)
- [ ] Screenshot archive page (before/after)
- [ ] Screenshot about page (before/after)
- [ ] Screenshot exhibition page (before/after)
- [ ] Compare side-by-side
- [ ] **Success**: No unexpected changes

### Task 4.2: Responsive testing (10min)
- [ ] Test at 375px (mobile)
- [ ] Test at 768px (tablet)
- [ ] Test at 1024px (desktop)
- [ ] Test at 1440px (large desktop)
- [ ] **Success**: All breakpoints work correctly

### Task 4.3: Interaction testing (5min)
- [ ] Test card hover effects
- [ ] Test button clicks
- [ ] Test navigation menu
- [ ] Test language toggle
- [ ] **Success**: All interactions smooth

---

## Phase 5: Documentation (Optional, 30min)

### Task 5.1: Update CLAUDE.md (15min)
- [ ] Document design token usage
- [ ] Add section on design system
- [ ] Update styling guidelines
- [ ] **Success**: Future contributors have clear guidance

### Task 5.2: Create design system reference (15min)
- [ ] Document all design tokens
- [ ] Provide usage examples
- [ ] Include do's and don'ts
- [ ] **Success**: Quick reference guide available

---

## Task Dependencies

```
Phase 1 (Tokens)
  ↓
Phase 2 (Components) → Can parallelize Tasks 2.1-2.5
  ↓
Phase 3 (Typography) → Must come after Phase 2
  ↓
Phase 4 (Testing)
  ↓
Phase 5 (Documentation) [Optional]
```

---

## Success Criteria

### Must Have
- [x] All CSS variables defined
- [x] Homepage uses design tokens (95%+)
- [x] Archive page uses design tokens (95%+)
- [x] No visual regressions on exhibition pages
- [x] Responsive design works at all breakpoints

### Should Have
- [x] Typography follows type scale
- [x] Vertical rhythm consistent
- [x] All shadows use tokens
- [x] All radii use tokens

### Nice to Have
- [ ] Design system documentation
- [ ] CLAUDE.md updated
- [ ] Visual regression screenshots archived

---

**Created**: 2025-11-11
**Status**: Ready for Execution
