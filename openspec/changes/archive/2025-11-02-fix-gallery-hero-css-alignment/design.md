# Design: Fix Gallery Hero CSS Alignment

## Problem Statement

The gallery-hero.js module (commit 2f34932) was implemented without proper alignment to the existing CSS design system, causing critical visual and structural failures on the homepage. This document outlines the architectural decisions needed to fix these issues while maintaining consistency with the existing codebase.

---

## Root Cause Analysis

### Issue 1: Parallel Development Without CSS Coordination

**What Happened**:
- gallery-hero.js was developed independently from the established CSS design system
- Developers created new HTML structures without checking existing CSS class definitions
- Result: 3 new container elements with no CSS styling

**Why It Happened**:
- Lack of reference to critics-page.js implementation (working RPAIT visualization)
- No CSS review before JavaScript implementation
- Focus on functionality over design system compliance

**Lesson Learned**: Always check existing CSS classes before creating new HTML structures. Use working implementations as reference.

---

### Issue 2: RPAIT Visualization Structure Mismatch

**Expected Structure** (from existing CSS lines 993-1038):
```html
<div class="rpait-grid">
  <div class="rpait-bar">                    ← Container
    <div class="rpait-label">                ← Label with abbr + score
      <abbr title="Representation">R</abbr>
      <span class="score">7/10</span>
    </div>
    <div class="rpait-bar-bg">               ← Background bar
      <div class="rpait-bar-fill"            ← Fill bar (colored)
           style="width: 70%; background-color: #B85C3C">
      </div>
    </div>
  </div>
  <!-- Repeat for P, A, I, T -->
</div>
```

**Actual Incorrect Structure** (gallery-hero.js lines 205-228):
```html
<div class="rpait-grid">
  <div class="rpait-bar-container">          ← ❌ Wrong class (no CSS)
    <span class="rpait-label">R</span>       ← ❌ Should be div with children
    <div class="rpait-bar"                   ← ❌ Should be rpait-bar-fill
         style="width: 70%">                 ← ❌ Width on wrong element
    </div>
    <span class="rpait-score">7</span>       ← ❌ Should be nested in label
  </div>
</div>
```

**CSS Applied**:
- `.rpait-bar-container` → No CSS definition → Renders as unstyled `display: block`
- `.rpait-bar` with inline `width` → CSS expects `.rpait-bar` to be container, not the bar itself
- `<span class="rpait-label">` → CSS targets `div.rpait-label` with flex layout
- Result: Text displays but no colored bars render

---

## Architectural Decisions

### Decision 1: Align with Existing CSS, Don't Create New Parallel System

**Options Considered**:

**Option A: Create new CSS for gallery-hero specific classes** ❌
- Pros: Quick fix, doesn't touch existing CSS
- Cons: Creates parallel styling systems, future maintenance burden, inconsistency

**Option B: Refactor gallery-hero.js to match existing CSS** ✅ **CHOSEN**
- Pros: Maintains design system consistency, reuses existing CSS, DRY principle
- Cons: Requires rewriting JavaScript, takes more time initially

**Decision**: Option B

**Rationale**:
- Existing CSS is well-designed and tested (critics-page.js works correctly)
- Creating parallel systems violates DRY and causes long-term maintenance issues
- One-time refactor cost < ongoing maintenance of parallel systems
- Teaches developers to check existing patterns before implementing

---

### Decision 2: Reference Implementation Strategy

**Question**: Which file should be the "source of truth" for RPAIT rendering?

**Options**:

**Option A: gallery-init.js (uses Chart.js canvas)** ❌
- Pros: Uses charting library, potentially more flexible
- Cons: Heavy dependency, requires Chart.js library, different rendering approach

**Option B: critics-page.js (pure HTML/CSS)** ✅ **CHOSEN**
- Pros: Lightweight, no dependencies, matches existing CSS, already working
- Cons: None significant

**Decision**: Use critics-page.js as reference implementation

**Rationale**:
- critics-page.js RPAIT rendering (lines 180-225) perfectly matches CSS expectations
- Pure HTML/CSS solution is more maintainable than Chart.js dependency
- Already proven to work correctly in production
- Easier to style and customize with CSS

---

### Decision 3: Layout Insertion Strategy

**Question**: Where should `.artwork-header-section` be inserted in the DOM?

**Options**:

**Option A: Inside `.artwork-display` as first child** ❌ **CURRENT (BROKEN)**
```html
<div class="artwork-display" style="display: flex;">
  <div class="artwork-header-section">...</div>  ← Breaks flex layout
  <div id="artwork-image-container">...</div>
  <div id="critiques-panel">...</div>
</div>
```
- Cons: Breaks flex layout (expects 2 children, not 3), requires CSS refactor

**Option B: As sibling to `.artwork-display` in `#gallery-hero`** ✅ **CHOSEN**
```html
<div id="gallery-hero">
  <div class="hero-title-section">...</div>
  <div class="artwork-header-section">...</div>  ← Positioned here
  <div class="artwork-display">
    <div id="artwork-image-container">...</div>
    <div id="critiques-panel">...</div>
  </div>
  <div class="artwork-rpait-visualization">...</div>
</div>
```
- Pros: Preserves flex layout, simpler DOM, easier to style independently

**Option C: Restructure `.artwork-display` as CSS grid** ❌
- Pros: Could accommodate 3+ children elegantly
- Cons: Requires rewriting all responsive CSS, high risk, affects working features

**Decision**: Option B

**Rationale**:
- Minimal disruption to existing, working flex layout
- Clear separation of concerns (header is metadata, not part of display layout)
- Easier to style header independently
- Matches semantic structure (header → display → visualization)

---

### Decision 4: Critiques Panel Layout Strategy

**Question**: How should 6 critic reviews be displayed?

**Current State** (lines 1277-1284):
```css
.critiques-panel {
  flex: 1;
  display: flex;
  flex-direction: column;  ← Vertical stack
  gap: 16px;
  overflow-y: auto;
}
```
- Result: All 6 critiques stack vertically, requires scrolling

**Options**:

**Option A: Keep vertical stack** ❌
- Pros: Simpler, mobile-first
- Cons: Requires scrolling, doesn't utilize horizontal space

**Option B: CSS Grid with auto-fit columns** ✅ **CHOSEN**
```css
.critiques-panel {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  overflow-y: auto;
  max-height: 70vh;
}
```
- Pros: Responsive, fills horizontal space, reduces scrolling
- Cons: Slightly more complex CSS

**Option C: Fixed 2-column or 3-column grid** ❌
- Pros: Predictable layout
- Cons: Doesn't adapt to viewport, may overflow or waste space

**Decision**: Option B (auto-fit grid)

**Rationale**:
- Automatically adapts to viewport width
- Mobile: 1 column (280px min-width)
- Tablet: 2 columns (560px+)
- Desktop: 3 columns (840px+)
- Reduces scrolling on larger screens
- Maintains readability with min-width constraint

---

### Decision 5: Language Toggle Implementation

**Question**: How should language switching update critique text?

**Current State**:
```javascript
const lang = document.documentElement.getAttribute('data-lang') || 'zh';
const text = lang === 'en' ? critique.textEn : critique.textZh;
```
- Problem: Doesn't re-render when language changes

**Options**:

**Option A: Reload page on language change** ❌
- Pros: Simple, guaranteed to work
- Cons: Poor UX, loses scroll position, slow

**Option B: Event-driven re-render** ✅ **CHOSEN**
```javascript
// Emit event on language toggle
document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: newLang } }));

// Listen and re-render
document.addEventListener('languageChanged', () => {
  render(window.carousel);
});
```
- Pros: Instant update, preserves state, good UX
- Cons: Requires event coordination across modules

**Option C: Polling `data-lang` attribute** ❌
- Pros: No event system needed
- Cons: Inefficient, introduces delay, wasteful

**Decision**: Option B (event-driven)

**Rationale**:
- Modern, reactive approach
- Already have event system in place (carousel uses 'navigate' events)
- Instant feedback to user
- Can be extended to other language-dependent components
- Matches existing architecture patterns

---

## Component Interaction Diagram

```
User clicks language toggle (index.html)
   ↓
document.dispatchEvent('languageChanged')
   ↓
   ├─→ gallery-hero.js listens → calls render()
   ├─→ critiques re-fetch text in new language
   └─→ RPAIT labels stay same (language-neutral)

User clicks navigation button
   ↓
carousel.next() or carousel.prev()
   ↓
carousel.emit('navigate', { index: newIndex })
   ↓
gallery-hero.js listens → calls render()
   ↓
   ├─→ renderHeroTitle() ← Constant ("潮汐的负形")
   ├─→ renderArtworkHeader() ← Fetch artwork[newIndex]
   ├─→ renderArtworkImage() ← Fetch artwork[newIndex].imageUrl
   ├─→ renderCritiques() ← Fetch critiques for artwork[newIndex]
   ├─→ renderRPAITVisualization() ← Calculate avg RPAIT
   ├─→ updateIndicator() ← Show "2 of 4"
   └─→ renderDots() ← Highlight active dot
```

---

## CSS Architecture

### Class Hierarchy

```
.gallery-hero                          ← Main container (flex column)
  ├─ .hero-title-section               ← NEW: Needs CSS (centered text block)
  ├─ .artwork-header-section           ← NEW: Needs CSS (centered metadata)
  │    ├─ .artwork-title               ← Existing CSS (can reuse)
  │    └─ .artwork-meta                ← NEW: Flex row for year + artist
  ├─ .artwork-display                  ← Existing (flex row)
  │    ├─ #artwork-image-container     ← Existing (flex: 1)
  │    └─ #critiques-panel             ← Existing → UPDATE to grid
  │         └─ .critique-panel × 6     ← Existing CSS
  └─ .artwork-rpait-visualization      ← NEW: Needs CSS (frosted container)
       ├─ .rpait-title                 ← NEW: Section heading
       └─ .rpait-grid                  ← Existing CSS
            └─ .rpait-bar × 5          ← Existing CSS (fix JS to match)
```

### CSS Additions Required

| Element | Location | Purpose |
|---------|----------|---------|
| `.hero-title-section` | After line 1245 | Center and pad hero title |
| `.artwork-header-section` | After line 1276 | Center artwork metadata |
| `.artwork-meta` | With `.artwork-header-section` | Flex row for year + artist |
| `.artwork-rpait-visualization` | After line 1334 | Frosted glass container |
| `.rpait-title` | With `.artwork-rpait-visualization` | Section heading |

### CSS Modifications Required

| Element | Current | New | Reason |
|---------|---------|-----|--------|
| `.critiques-panel` | `display: flex; flex-direction: column;` | `display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));` | Multi-column layout |

---

## Performance Considerations

### Render Performance

**Current Issue**: Full re-render on every navigation
- All 6 critiques re-created from scratch
- All DOM nodes destroyed and rebuilt
- RPAIT visualization recalculated

**Optimization Opportunities** (Future work):
1. **DOM Diffing**: Only update changed critiques
2. **RPAIT Caching**: Cache RPAIT calculations per artwork
3. **Virtual Scrolling**: Render only visible critiques (if >6 personas)

**Decision for This Change**: Keep current full re-render approach
- Rationale:
  - Simple, predictable behavior
  - Performance is acceptable for 6 critiques
  - Premature optimization avoided
  - Can optimize later if needed

---

## Testing Strategy

### Unit Testing Approach

**JavaScript Functions to Test**:
1. `renderRPAITVisualization(carousel)` → Check correct HTML structure
2. `renderArtworkHeader(carousel)` → Check insertion point
3. `createCriticPanel(critique, personas)` → Check language logic

**Test Cases**:
```javascript
// Test RPAIT structure
const viz = renderRPAITVisualization(mockCarousel);
assert(viz.querySelectorAll('.rpait-bar').length === 5);
assert(viz.querySelector('.rpait-bar-fill').style.width !== '');
assert(viz.querySelector('.rpait-label abbr') !== null);

// Test language switching
document.documentElement.setAttribute('data-lang', 'en');
const panel = createCriticPanel(mockCritique, mockPersonas);
assert(panel.querySelector('.critique-text').textContent === mockCritique.textEn);
```

### Visual Regression Testing

**Screenshots Needed**:
- Before fix: 4 artworks × 3 breakpoints = 12 screenshots
- After fix: 4 artworks × 3 breakpoints = 12 screenshots
- Compare side-by-side for each

**What to Check**:
- [ ] RPAIT bars appear as colored charts (not text)
- [ ] Layout is balanced and centered
- [ ] No text overflow or clipping
- [ ] Critiques in grid layout (desktop)
- [ ] All 6 critiques visible

---

## Rollback Strategy

### If Critical Issues Arise

**Step 1: Identify Severity**
- P0 (Blocker): Page doesn't load → Immediate rollback
- P1 (Critical): Visual broken but functional → Fix forward or rollback
- P2 (High): Minor visual issues → Fix forward

**Step 2: Rollback Commands**
```bash
# Revert JavaScript changes
git checkout HEAD~1 js/gallery-hero.js

# Revert CSS changes
git checkout HEAD~1 styles/main.css

# Force browser cache clear
# Ctrl+Shift+R in browser

# Restart local server
# Kill and restart python -m http.server 9999
```

**Step 3: Communicate**
- Document what went wrong
- Update OpenSpec change status
- Create new proposal for fix

---

## Future Improvements (Out of Scope)

### 1. Shared RPAIT Rendering Utility

**Problem**: RPAIT rendering duplicated in gallery-hero.js and critics-page.js

**Solution**:
```javascript
// js/utils/rpait-renderer.js
export function createRPAITBar(dimension, score, personaColor, fullName) {
  const bar = document.createElement('div');
  bar.className = 'rpait-bar';
  // ... standard implementation
  return bar;
}
```

**Benefits**:
- Single source of truth
- DRY principle
- Easier to maintain and update

**Why Not Now**:
- Adds complexity to this change
- Requires creating new file structure
- Can be done as separate refactor

---

### 2. CSS Custom Properties for Theming

**Problem**: Persona colors hardcoded in JavaScript

**Solution**:
```css
:root {
  --color-persona-su-shi: #B85C3C;
  --color-persona-guo-xi: #2D5F4F;
  /* ... */
}

.critique-panel[data-persona="su-shi"] {
  border-left-color: var(--color-persona-su-shi);
}
```

```javascript
// Use CSS custom property instead of inline style
fill.style.backgroundColor = `var(--color-persona-${personaId})`;
```

**Benefits**:
- Centralized color management
- Easier theme switching
- Better separation of concerns

**Why Not Now**:
- Requires refactoring color management across multiple files
- Risk of breaking existing styles
- Can be done as separate enhancement

---

### 3. Animation and Transitions

**Enhancement**: Add smooth transitions when navigating between artworks

**Implementation**:
```css
.artwork-display {
  transition: opacity 0.3s ease-in-out;
}

.artwork-display.transitioning {
  opacity: 0;
}
```

```javascript
function render(carousel) {
  // Fade out
  artworkDisplay.classList.add('transitioning');

  setTimeout(() => {
    // Update content
    renderArtworkImage(carousel);
    renderCritiques(carousel);

    // Fade in
    artworkDisplay.classList.remove('transitioning');
  }, 300);
}
```

**Benefits**:
- Smoother user experience
- Professional polish
- Visual feedback during navigation

**Why Not Now**:
- Adds complexity to render logic
- Risk of timing issues
- Should be tested separately first

---

## Conclusion

This design prioritizes **alignment with existing CSS design system** over creating new parallel systems. By referencing critics-page.js as the canonical implementation and fixing JavaScript to match CSS expectations, we maintain consistency and reduce long-term maintenance burden.

Key principles:
- ✅ Reuse existing CSS classes
- ✅ Follow established patterns
- ✅ Fix JavaScript to match CSS (not vice versa)
- ✅ Keep changes minimal and focused
- ✅ Test thoroughly across breakpoints

Estimated total implementation time: 3.5-4 hours
Risk level: Low (changes are well-scoped and reversible)
