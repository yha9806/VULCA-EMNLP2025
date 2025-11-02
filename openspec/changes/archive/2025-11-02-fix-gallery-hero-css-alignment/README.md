# Fix Gallery Hero CSS Alignment - OpenSpec Change

**Status**: 📝 Proposed
**Change ID**: `fix-gallery-hero-css-alignment`
**Priority**: 🔴 P0 Critical
**Estimated Time**: 3.5-4 hours

---

## Quick Summary

The gallery-hero.js implementation (commit 2f34932) created **5 critical issues** by not aligning with the existing CSS design system:

1. 🔴 **RPAIT visualization HTML structure mismatch** - Charts don't render as colored bars
2. 🔴 **3 new elements without CSS definitions** - Layout completely broken
3. 🟡 **Incorrect DOM insertion order** - Flex layout disrupted
4. 🟡 **Language toggle doesn't update critiques** - Always shows English
5. 🟢 **Critique panel vertical-only layout** - Doesn't use horizontal space

---

## Files

| File | Purpose |
|------|---------|
| [`proposal.md`](./proposal.md) | Problem statement, scope, success criteria |
| [`tasks.md`](./tasks.md) | Step-by-step implementation checklist (11 tasks) |
| [`design.md`](./design.md) | Architectural decisions and tradeoffs |

---

## Key Decisions

### ✅ Align with Existing CSS (Don't Create New System)

**Decision**: Rewrite gallery-hero.js to match existing CSS classes from critics-page.js

**Why**: Maintains consistency, reduces maintenance burden, follows DRY principle

### ✅ Use critics-page.js as Reference Implementation

**Decision**: Copy RPAIT rendering structure from critics-page.js (lines 180-225)

**Why**: Already working, matches CSS perfectly, no dependencies

### ✅ Insert Header as Sibling, Not Child

**Decision**: Place `.artwork-header-section` outside `.artwork-display`, not inside

**Why**: Preserves flex layout, simpler DOM structure, easier to style

### ✅ Event-Driven Language Toggle

**Decision**: Dispatch `languageChanged` event, gallery-hero listens and re-renders

**Why**: Instant update, good UX, extensible to other components

### ✅ Grid Layout for Critiques

**Decision**: Use `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`

**Why**: Responsive, reduces scrolling, fills horizontal space efficiently

---

## Implementation Plan

### Phase 1: Critical Fixes (1.5h) - P0
1. ✅ Fix RPAIT HTML structure (45min)
2. ✅ Add 3 missing CSS definitions (30min)
3. ✅ Fix artwork header insertion (15min)

### Phase 2: Layout Refinement (50min) - P1
4. ✅ Update critiques to grid layout (20min)
5. ✅ Test responsive breakpoints (30min)

### Phase 3: Language & Polish (45min) - P2
6. ✅ Fix language toggle logic (20min)
7. ✅ Test navigation updates (15min)
8. ✅ Validate console clean (10min)

### Phase 4: Final Validation (1h 5min) - P3
9. ✅ Visual regression testing (20min)
10. ✅ Cross-browser testing (15min)
11. ✅ Update documentation (30min)

---

## Before & After

### Before (Broken)

```
❌ RPAIT shows as plain text "R 7 P 8 A 8 I 8 T 7"
❌ Hero title unstyled (no padding, left-aligned)
❌ Artwork header inside flex container (breaks layout)
❌ 6 critiques stack vertically (requires scrolling)
❌ Language toggle doesn't update text
```

### After (Fixed)

```
✅ RPAIT shows as colored horizontal bar chart
✅ Hero title centered with proper spacing
✅ Artwork header positioned correctly above image
✅ 6 critiques in 3-column grid (desktop)
✅ Language toggle instantly updates all text
```

---

## Testing Checklist

**Visual**:
- [ ] RPAIT bars render as colored charts
- [ ] All text properly styled and spaced
- [ ] Layout balanced and centered
- [ ] Grid adapts to viewport (1/2/3 columns)

**Functional**:
- [ ] Navigation updates all sections
- [ ] Language toggle works for all critiques
- [ ] No console errors
- [ ] Responsive at 375px, 768px, 1440px

**Cross-Browser**:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (if available)

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|-----------|
| CSS breaks other pages | Medium | Test critics/about/process pages |
| RPAIT bars don't render | High | Use critics-page.js as reference |
| Layout shift during nav | Medium | Test transitions carefully |
| Language toggle breaks | Low | Fallback to Chinese if fails |

**Overall Risk**: 🟢 Low - Changes are well-scoped and reversible

---

## Quick Start

### 1. Review Proposal
```bash
cat openspec/changes/fix-gallery-hero-css-alignment/proposal.md
```

### 2. Review Tasks
```bash
cat openspec/changes/fix-gallery-hero-css-alignment/tasks.md
```

### 3. Start Implementation
Follow tasks sequentially, starting with Phase 1:
1. Task 1.1: Fix RPAIT structure in `js/gallery-hero.js`
2. Task 1.2: Add CSS in `styles/main.css`
3. Task 1.3: Fix header insertion in `js/gallery-hero.js`

### 4. Test After Each Phase
- Phase 1: Visual check (RPAIT bars, styling)
- Phase 2: Responsive check (3 breakpoints)
- Phase 3: Functional check (language, navigation)
- Phase 4: Full validation

### 5. Commit & Push
```bash
git add js/gallery-hero.js styles/main.css
git commit -m "fix: Align gallery-hero with CSS design system

- Fix RPAIT visualization HTML structure
- Add missing CSS for hero-title, artwork-header, rpait-viz
- Fix artwork header insertion order
- Update critiques panel to grid layout
- Fix language toggle re-rendering

Closes #fix-gallery-hero-css-alignment"
git push origin master
```

---

## Related Changes

- `enhance-artwork-display-and-critiques` - Content enrichment (Phase 2-3 completed)
- `immersive-autoplay-with-details` - Original immersive design
- `art-centric-immersive-redesign` - CSS foundation

---

## Questions?

See [`design.md`](./design.md) for architectural details and tradeoff discussions.

See [`tasks.md`](./tasks.md) for step-by-step implementation guide.

See [`proposal.md`](./proposal.md) for full problem statement and success criteria.

---

**Next Steps**: Review proposal → Start Phase 1 → Test → Iterate
