# Proposal: Fix Gallery Hero CSS Alignment and Structure Mismatch

## Why

The gallery-hero.js implementation (added in commit 2f34932) introduced critical structural and styling issues that break the homepage display:

### **Critical Issues Discovered**

1. **RPAIT Visualization HTML Structure Mismatch** 🔴 Critical
   - gallery-hero.js creates incompatible HTML structure for RPAIT charts
   - Expected structure uses `.rpait-bar` > `.rpait-label` + `.rpait-bar-bg` > `.rpait-bar-fill`
   - Actual structure uses `.rpait-bar-container` > `.rpait-label` (span) + `.rpait-bar` (inline-styled)
   - Result: Charts display as unstyled text with no visual bars

2. **Missing CSS Definitions for New Elements** 🔴 Critical
   - `.hero-title-section` - No CSS definition (gallery-hero.js line 62)
   - `.artwork-header-section` - No CSS definition (gallery-hero.js line 99)
   - `.artwork-rpait-visualization` - No CSS definition (gallery-hero.js line 164)
   - Result: Elements use browser defaults, causing layout collapse

3. **Incorrect Layout Insertion Order** 🟡 High
   - `artwork-header-section` inserted into `artwork-display` breaks flex layout
   - Expected: `.artwork-display` contains only image-container + critiques-panel (side-by-side)
   - Actual: Header inserted as first child, disrupting flex alignment
   - Result: Image, header, and critiques stack incorrectly

4. **Critique Language Display Bug** 🟡 High
   - All critiques show English text regardless of language setting
   - `data-lang` attribute check may be failing
   - Result: Chinese users see English content

5. **Version Inconsistencies and Code Duplication** 🟢 Medium
   - Multiple rendering approaches across gallery-init.js, gallery-hero.js, critics-page.js
   - RPAIT rendering logic duplicated and inconsistent
   - CSS scattered across multiple sections for same components

## Summary

**Refactor gallery-hero.js to align with existing CSS design system, fix HTML structure mismatches, add missing CSS definitions, and consolidate duplicate rendering logic.**

**Change ID:** `fix-gallery-hero-css-alignment`

**Scope:**
- Fix RPAIT visualization HTML structure to match CSS expectations
- Add CSS definitions for 3 new container elements
- Correct layout insertion order in artwork-display
- Fix language toggle for critique text display
- Consolidate RPAIT rendering logic
- Clean up version inconsistencies

---

## What Changes

### Files Modified

**1. `js/gallery-hero.js`**
   - **Lines 151-233**: Rewrite `renderRPAITVisualization()` to match critics-page.js structure
     - Use `.rpait-bar` (not `.rpait-bar-container`)
     - Create `.rpait-bar-bg` background container
     - Create `.rpait-bar-fill` with width and backgroundColor
     - Add `<abbr>` with dimension full name
   - **Lines 86-149**: Fix `renderArtworkHeader()` insertion logic
     - Insert into `#gallery-hero` directly, NOT into `.artwork-display`
     - Position before `.artwork-display` element
   - **Lines 56-84**: Keep `renderHeroTitle()` structure (working correctly)
   - **Lines 134-140**: Fix language detection for critique text
     - Check `document.documentElement.getAttribute('data-lang')`
     - Add fallback to `localStorage.getItem('preferred-lang')`
     - Console log current language for debugging

**2. `styles/main.css`**
   - **After line 1245**: Add `.hero-title-section` CSS
     ```css
     .hero-title-section {
       text-align: center;
       padding: var(--spacing-xl) 0 var(--spacing-lg) 0;
       max-width: 1200px;
       margin: 0 auto;
     }
     ```
   - **After line 1276**: Add `.artwork-header-section` CSS
     ```css
     .artwork-header-section {
       text-align: center;
       padding: var(--spacing-lg) 0;
       max-width: 900px;
       margin: 0 auto;
     }

     .artwork-meta {
       display: flex;
       gap: var(--spacing-sm);
       justify-content: center;
       align-items: center;
       margin-top: var(--spacing-sm);
       font-size: 0.95rem;
       color: var(--color-text-light);
     }

     .artwork-artist {
       color: var(--color-text);
     }
     ```
   - **After line 1334**: Add `.artwork-rpait-visualization` CSS
     ```css
     .artwork-rpait-visualization {
       padding: var(--spacing-lg);
       background: rgba(255, 255, 255, 0.4);
       backdrop-filter: blur(6px);
       border-radius: 8px;
       margin: var(--spacing-lg) 0;
     }

     .rpait-title {
       font-family: var(--font-serif);
       font-size: 1.2rem;
       font-weight: var(--weight-semibold);
       margin-bottom: var(--spacing-md);
       text-align: center;
     }
     ```
   - **Lines 1277-1284**: Update `.critiques-panel` to use grid layout
     ```css
     .critiques-panel {
       flex: 1;
       display: grid;
       grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
       gap: 16px;
       overflow-y: auto;
       padding-right: 8px;
       max-height: 70vh;
     }
     ```

**3. `js/data.js`** (Minor cleanup - remove redundant RPAIT calculation if exists)

### Files Reviewed (No changes needed)
- `js/critics-page.js` - Reference implementation (lines 180-225)
- `js/carousel.js` - Working correctly
- `index.html` - Structure correct

---

## Success Criteria

- ✅ RPAIT visualization displays as colored bar chart (not plain text)
- ✅ Hero title section centered and styled correctly
- ✅ Artwork header (title + year + artist) displays below hero title
- ✅ Artwork image and critiques panel side-by-side (flex layout preserved)
- ✅ All 6 critic reviews visible in grid (2-3 columns depending on viewport)
- ✅ Critique text displays in correct language based on `data-lang` attribute
- ✅ Navigation between artworks updates all sections correctly
- ✅ No console errors or missing CSS warnings
- ✅ Responsive design works at 375px, 768px, 1440px breakpoints
- ✅ RPAIT bars animate/render smoothly

---

## Architectural Decisions

### 1. Align with Existing CSS System (Don't Create New One)

**Decision**: Rewrite gallery-hero.js to use existing CSS classes from critics-page.js implementation.

**Rationale**:
- CSS for `.rpait-bar`, `.rpait-bar-bg`, `.rpait-bar-fill` already exists (lines 993-1039)
- critics-page.js provides working reference implementation
- Creating parallel CSS creates maintenance burden
- Consistency across codebase

**Alternative Considered**: Create new CSS for gallery-hero
- **Rejected**: Increases CSS bloat, creates conflicting styles, harder to maintain

### 2. Fix Layout Insertion, Don't Restructure HTML

**Decision**: Insert `artwork-header-section` into `#gallery-hero` directly, not into `.artwork-display`.

**Rationale**:
- `.artwork-display` designed for 2-column flex (image + critiques)
- Inserting header breaks flex alignment
- Simpler DOM structure, easier to style

**Alternative Considered**: Restructure entire `.artwork-display` as grid
- **Rejected**: Would require rewriting all responsive CSS, high risk

### 3. Consolidate RPAIT Rendering into Shared Utility

**Decision**: Create `renderRPAITBar(dimension, score, personaColor)` utility function.

**Rationale**:
- Same logic needed in gallery-hero.js, critics-page.js, potentially future modules
- DRY principle
- Single source of truth for RPAIT HTML structure

**Alternative Considered**: Keep duplicated in each file
- **Rejected**: Already caused bugs, future changes require multi-file edits

---

## Dependencies & Sequencing

**Phase 1** (Critical Fixes - 2 hours):
1. Fix RPAIT HTML structure in `renderRPAITVisualization()` ✅ Blocks visual display
2. Add missing CSS for `.hero-title-section`, `.artwork-header-section`, `.artwork-rpait-visualization`
3. Fix `artwork-header` insertion order

**Phase 2** (Layout Refinement - 1 hour):
1. Update `.critiques-panel` to grid layout
2. Add responsive breakpoint adjustments
3. Test across 3 viewport sizes

**Phase 3** (Language & Polish - 30 min):
1. Fix language toggle for critiques
2. Test navigation updates
3. Validate console has no errors

**Total Estimated Time**: 3.5 hours

---

## Related Changes

- `enhance-artwork-display-and-critiques` - Content enrichment (completed)
- `immersive-autoplay-with-details` - Original immersive design
- `art-centric-immersive-redesign` - CSS design system foundation

---

## Technical Notes

### RPAIT Rendering Structure (Reference)

**Correct Structure** (from critics-page.js lines 198-222):
```javascript
const bar = document.createElement('div');
bar.className = 'rpait-bar';

const label = document.createElement('div');  // ← div, not span
label.className = 'rpait-label';
label.innerHTML = `<abbr title="${fullName}">${key}</abbr><span class="score">${score}/10</span>`;

const barBg = document.createElement('div');  // ← Background container
barBg.className = 'rpait-bar-bg';

const fill = document.createElement('div');  // ← Fill element
fill.className = 'rpait-bar-fill';
fill.style.width = `${(score / 10) * 100}%`;
fill.style.backgroundColor = personaColor;

barBg.appendChild(fill);
bar.appendChild(label);
bar.appendChild(barBg);
```

**Current Incorrect Structure** (gallery-hero.js lines 207-225):
```javascript
const barContainer = document.createElement('div');
barContainer.className = 'rpait-bar-container';  // ❌ Wrong class

const label = document.createElement('span');  // ❌ Should be div
label.className = 'rpait-label';
label.textContent = dimension;  // ❌ Missing abbr, score suffix

const bar = document.createElement('div');
bar.className = 'rpait-bar';
bar.style.width = `${(score / 10) * 100}%`;  // ❌ Should be on .rpait-bar-fill

// ❌ Missing .rpait-bar-bg container
// ❌ Missing .rpait-bar-fill element
```

### CSS Class Definitions Location

| Class | File | Line |
|-------|------|------|
| `.rpait-grid` | main.css | 993-998 |
| `.rpait-bar` | main.css | 1000-1004 |
| `.rpait-label` | main.css | 1006-1011 |
| `.rpait-bar-bg` | main.css | 1025-1031 |
| `.rpait-bar-fill` | main.css | 1033-1038 |
| `.gallery-hero` | main.css | 1239-1245 |
| `.artwork-display` | main.css | 1247-1252 |
| `.critiques-panel` | main.css | 1277-1284 |

---

## Questions for Stakeholder Review

1. **Grid vs Flex for critiques panel**: Should 6 critiques always show in grid, or keep vertical stack on mobile?
2. **RPAIT visualization placement**: Current position (after critiques) OK, or move to different location?
3. **Language toggle persistence**: Should language preference persist across page reload? (localStorage already implemented)
4. **Hero title visibility**: Always show "潮汐的负形" on every artwork, or only on artwork 1?

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|-----------|
| CSS changes break other pages | Medium | Test all pages (critics.html, about.html, process.html) |
| RPAIT bars don't render | High | Use critics-page.js as reference, test immediately |
| Layout shift during navigation | Medium | Test carousel transitions carefully |
| Language toggle breaks | Low | Fallback to Chinese if detection fails |

---

## Validation Checklist

Before marking this change as complete:

- [ ] RPAIT bars render as colored charts (screenshot comparison)
- [ ] All 3 new containers have visible styling (inspect element)
- [ ] Hero title centered and readable
- [ ] Artwork header displays below hero title, above image
- [ ] Image and critiques side-by-side on desktop (1440px)
- [ ] 6 critiques visible in grid (count in DOM)
- [ ] Language toggle switches between Chinese/English (test both)
- [ ] Navigation arrows update all content correctly (test prev/next)
- [ ] No console errors (check browser devtools)
- [ ] Mobile responsive (test 375px viewport)
- [ ] Tablet responsive (test 768px viewport)
