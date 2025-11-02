# Tasks: Fix Gallery Hero CSS Alignment

## Phase 1: Critical Structural Fixes (Priority: P0)

### Task 1.1: Fix RPAIT Visualization HTML Structure
**File**: `js/gallery-hero.js` (lines 151-233)

**Actions**:
1. Rewrite `renderRPAITVisualization()` function
2. Change outer container from `.rpait-bar-container` to `.rpait-bar`
3. Change label from `<span class="rpait-label">` to `<div class="rpait-label">`
4. Add `<abbr title="Full Name">R</abbr>` inside label
5. Add `<span class="score">7/10</span>` inside label
6. Create `.rpait-bar-bg` container element
7. Create `.rpait-bar-fill` element inside bg
8. Set `fill.style.width` = `${(score/10)*100}%`
9. Set `fill.style.backgroundColor` = persona color
10. Remove direct inline width styling on `.rpait-bar`

**Reference**: `js/critics-page.js` lines 198-222

**Validation**:
- [ ] RPAIT bars display as colored horizontal bars
- [ ] Each bar shows dimension label + score (e.g., "R 7/10")
- [ ] Hover on dimension letter shows full name tooltip
- [ ] Bar width corresponds to score (70% width for score 7)
- [ ] Bar color matches persona color

**Estimated Time**: 45 minutes

---

### Task 1.2: Add Missing CSS Definitions
**File**: `styles/main.css`

**Actions**:

**1.2a: Add `.hero-title-section` CSS (after line 1245)**
```css
.hero-title-section {
  text-align: center;
  padding: var(--spacing-xl) 0 var(--spacing-lg) 0;
  max-width: 1200px;
  margin: 0 auto;
}
```

**1.2b: Add `.artwork-header-section` CSS (after line 1276)**
```css
.artwork-header-section {
  text-align: center;
  padding: var(--spacing-lg) 0;
  max-width: 900px;
  margin: 0 auto;
}

.artwork-header-section .artwork-title {
  font-family: var(--font-serif);
  font-size: var(--size-title-artwork);
  font-weight: var(--weight-semibold);
  margin-bottom: var(--spacing-sm);
  line-height: 1.3;
}

.artwork-header-section .artwork-title span {
  display: block;
}

.artwork-header-section .artwork-title [lang="en"] {
  font-size: 0.85em;
  color: var(--color-text-light);
  font-weight: var(--weight-regular);
  margin-top: 4px;
}

.artwork-meta {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
  align-items: center;
  margin-top: var(--spacing-sm);
  font-size: 0.95rem;
  color: var(--color-text-light);
  font-family: var(--font-sans);
}

.artwork-artist {
  color: var(--color-text);
  font-weight: var(--weight-semibold);
}
```

**1.2c: Add `.artwork-rpait-visualization` CSS (after line 1334)**
```css
.artwork-rpait-visualization {
  padding: var(--spacing-lg);
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(6px);
  border-radius: 8px;
  margin: var(--spacing-lg) auto;
  max-width: 900px;
}

.rpait-title {
  font-family: var(--font-serif);
  font-size: 1.2rem;
  font-weight: var(--weight-semibold);
  margin-bottom: var(--spacing-md);
  text-align: center;
  color: var(--color-text);
}
```

**Validation**:
- [ ] Hero title section has visible padding and centered alignment
- [ ] Artwork header section displays with proper typography
- [ ] RPAIT visualization has frosted glass background effect
- [ ] All text properly sized and spaced
- [ ] Elements centered on page

**Estimated Time**: 30 minutes

---

### Task 1.3: Fix Artwork Header Insertion Order
**File**: `js/gallery-hero.js` (lines 86-149)

**Actions**:
1. In `renderArtworkHeader()`, change insertion logic:
   - Remove: `artworkDisplay.insertBefore(artworkHeader, artworkDisplay.firstChild)`
   - Add: `galleryHero.insertBefore(artworkHeader, artworkDisplay)`
2. This ensures header appears BEFORE `.artwork-display`, not inside it
3. Preserve flex layout: `.artwork-display` contains only image-container + critiques-panel

**Before** (incorrect):
```
#gallery-hero
  └─ .artwork-display
       ├─ .artwork-header-section  ← WRONG (breaks flex)
       ├─ #artwork-image-container
       └─ #critiques-panel
```

**After** (correct):
```
#gallery-hero
  ├─ .hero-title-section
  ├─ .artwork-header-section  ← CORRECT (outside artwork-display)
  ├─ .artwork-display
  │    ├─ #artwork-image-container
  │    └─ #critiques-panel
  └─ .artwork-rpait-visualization
```

**Validation**:
- [ ] Image and critiques panel side-by-side (flex preserved)
- [ ] Artwork header appears above image, below hero title
- [ ] Layout doesn't break at any viewport size
- [ ] Navigation updates header correctly

**Estimated Time**: 15 minutes

---

## Phase 2: Layout Refinement (Priority: P1)

### Task 2.1: Update Critiques Panel to Grid Layout
**File**: `styles/main.css` (lines 1277-1284)

**Actions**:
1. Replace `.critiques-panel` CSS:
```css
.critiques-panel {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  overflow-y: auto;
  padding-right: 8px;
  max-height: 70vh;
  align-content: start;
}
```

2. Add responsive adjustments:
```css
/* Mobile: 1 column */
@media (max-width: 767px) {
  .critiques-panel {
    grid-template-columns: 1fr;
    max-height: none;
  }
}

/* Tablet: 2 columns */
@media (min-width: 768px) and (max-width: 1023px) {
  .critiques-panel {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 3 columns */
@media (min-width: 1024px) {
  .critiques-panel {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

**Validation**:
- [ ] 6 critiques visible without scrolling (desktop)
- [ ] Grid adapts to viewport: 1 col (mobile), 2 col (tablet), 3 col (desktop)
- [ ] Equal column widths
- [ ] Vertical alignment looks balanced
- [ ] Critiques don't overflow container

**Estimated Time**: 20 minutes

---

### Task 2.2: Test Responsive Breakpoints
**Tool**: Playwright browser testing

**Actions**:
1. Test mobile (375px × 667px):
   - [ ] All content visible
   - [ ] 1 column critique layout
   - [ ] Hero title readable
   - [ ] RPAIT bars render correctly

2. Test tablet (768px × 1024px):
   - [ ] 2 column critique layout
   - [ ] Image and critiques side-by-side
   - [ ] All text legible

3. Test desktop (1440px × 900px):
   - [ ] 3 column critique layout
   - [ ] Optimal spacing
   - [ ] All elements centered properly

**Validation**:
- [ ] No horizontal scrollbar at any breakpoint
- [ ] All content accessible
- [ ] Typography scales appropriately
- [ ] Images maintain aspect ratio

**Estimated Time**: 30 minutes

---

## Phase 3: Language & Polish (Priority: P2)

### Task 3.1: Fix Language Toggle for Critiques
**File**: `js/gallery-hero.js` (lines 134-140)

**Actions**:
1. Update language detection in `createCriticPanel()`:
```javascript
// OLD (line 136-137)
const lang = document.documentElement.getAttribute('data-lang') || 'zh';
const text = lang === 'en' ? critique.textEn : critique.textZh;

// NEW (improved)
const lang = document.documentElement.getAttribute('data-lang')
  || localStorage.getItem('preferred-lang')
  || 'zh';

console.log(`[Gallery Hero] Rendering critique for ${persona.nameZh} in language: ${lang}`);

const text = lang === 'en' ? critique.textEn : critique.textZh;
```

2. Add re-render on language toggle:
```javascript
// In gallery-hero.js init() function
document.addEventListener('languageChanged', () => {
  console.log('[Gallery Hero] Language changed, re-rendering...');
  render(window.carousel);
});
```

3. Ensure language toggle dispatches event in `index.html`:
```javascript
// In index.html language toggle handler (line 319-330)
langToggle.addEventListener('click', () => {
  const html = document.documentElement;
  const currentLang = html.getAttribute('data-lang') || 'zh';
  const newLang = currentLang === 'zh' ? 'en' : 'zh';

  html.setAttribute('data-lang', newLang);
  localStorage.setItem('preferred-lang', newLang);

  // Dispatch event for other components
  document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: newLang } }));

  // Update button text
  langToggle.querySelector('.lang-text').textContent = newLang === 'zh' ? 'EN/中' : 'ZH/英';
});
```

**Validation**:
- [ ] Clicking language toggle updates all critique text
- [ ] Console logs confirm language change
- [ ] Language preference persists on page reload
- [ ] Default language is Chinese
- [ ] English toggle works for all 6 critiques

**Estimated Time**: 20 minutes

---

### Task 3.2: Test Navigation Updates
**Actions**:
1. Click "Next" button → verify:
   - [ ] Hero title remains visible
   - [ ] Artwork header updates (title, year, artist)
   - [ ] Image changes
   - [ ] All 6 critiques update
   - [ ] RPAIT visualization updates (5 scores)
   - [ ] Navigation indicator shows "2 of 4"

2. Click dot indicator (jump to artwork 3) → verify:
   - [ ] All content updates correctly
   - [ ] No flickering or layout shift
   - [ ] Smooth transition

3. Click "Previous" button → verify same updates

**Validation**:
- [ ] All sections update synchronously
- [ ] No console errors during navigation
- [ ] Navigation is smooth (no jank)
- [ ] Active artwork indicator correct

**Estimated Time**: 15 minutes

---

### Task 3.3: Validate Console Has No Errors
**Actions**:
1. Open browser DevTools console
2. Navigate through all 4 artworks
3. Toggle language 2-3 times
4. Check for:
   - [ ] No CSS warnings about missing classes
   - [ ] No JavaScript errors
   - [ ] All "✓ Rendered" log messages appear
   - [ ] No 404 errors for images (expected for placeholder assets)

**Validation**:
- [ ] Only expected 404s (app.js, placeholder JS files)
- [ ] All core functionality logs appear
- [ ] No red error messages
- [ ] No yellow warnings about layout

**Estimated Time**: 10 minutes

---

## Phase 4: Final Validation & Documentation (Priority: P3)

### Task 4.1: Visual Regression Testing
**Actions**:
1. Take screenshots at 3 breakpoints for all 4 artworks (12 screenshots total)
2. Compare against expected design:
   - [ ] Hero title visible and centered
   - [ ] Artwork header properly positioned
   - [ ] Image displays correctly
   - [ ] 6 critiques in grid layout
   - [ ] RPAIT bars show as colored charts
   - [ ] Footer visible

3. Check for visual bugs:
   - [ ] No text overflow
   - [ ] No layout shifts
   - [ ] Proper spacing and alignment
   - [ ] Consistent typography

**Estimated Time**: 20 minutes

---

### Task 4.2: Cross-Browser Testing
**Browsers to test**:
- [ ] Chrome/Edge (primary)
- [ ] Firefox
- [ ] Safari (if available)

**Validation**:
- [ ] All features work in each browser
- [ ] CSS renders correctly (backdrop-filter support check)
- [ ] No browser-specific bugs
- [ ] Flexbox and grid layouts consistent

**Estimated Time**: 15 minutes

---

### Task 4.3: Update Documentation
**Files**:
- `CLAUDE.md` - Update with new gallery-hero implementation details
- `openspec/changes/fix-gallery-hero-css-alignment/IMPLEMENTATION_SUMMARY.md` - Create completion report

**Actions**:
1. Document changes made
2. Note any deviations from original proposal
3. Record lessons learned
4. Update troubleshooting section

**Validation**:
- [ ] CLAUDE.md reflects current state
- [ ] Implementation summary complete
- [ ] All tasks marked completed

**Estimated Time**: 30 minutes

---

## Task Summary

| Phase | Tasks | Estimated Time | Priority |
|-------|-------|----------------|----------|
| Phase 1: Critical Fixes | 3 tasks | 1.5 hours | P0 |
| Phase 2: Layout Refinement | 2 tasks | 50 minutes | P1 |
| Phase 3: Language & Polish | 3 tasks | 45 minutes | P2 |
| Phase 4: Final Validation | 3 tasks | 1 hour 5 minutes | P3 |
| **Total** | **11 tasks** | **3 hours 40 minutes** | - |

---

## Dependencies

```
Task 1.1 (RPAIT fix) ──┐
                       ├─→ Task 2.1 (Grid layout)
Task 1.2 (CSS add)  ───┤
                       └─→ Task 2.2 (Responsive test)
Task 1.3 (Header fix) ─┘
                          ↓
Task 3.1 (Language) ───→ Task 3.2 (Navigation test)
                          ↓
                       Task 3.3 (Console validation)
                          ↓
                       Task 4.1 (Visual regression)
                          ↓
                       Task 4.2 (Cross-browser)
                          ↓
                       Task 4.3 (Documentation)
```

**Parallelizable Work**:
- Tasks 1.1, 1.2, 1.3 can be done in parallel (different files)
- Tasks 2.1 and 3.1 can be done in parallel

---

## Rollback Plan

If critical issues arise during implementation:

1. **Revert gallery-hero.js changes**: `git checkout HEAD~1 js/gallery-hero.js`
2. **Revert CSS changes**: `git checkout HEAD~1 styles/main.css`
3. **Clear browser cache**: Force refresh with Ctrl+Shift+R
4. **Restart local server**: Ensure clean state

**Backup Points**:
- Commit after Task 1.2 completion (CSS definitions added)
- Commit after Task 2.1 completion (Grid layout working)
- Final commit after all tasks complete
