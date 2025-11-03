# Adjust Gallery Layout Proportions - Implementation Tasks

**Change ID**: `adjust-gallery-layout-proportions`
**Total Estimated Time**: 120 minutes (2 hours)
**Status**: ✅ Completed

---

## Phase 1: CSS Image-Critique Ratio Adjustment (10 min)

### Task 1.1: Update Tablet Breakpoint (768px) Ratios
**Time**: 2 min
**File**: `styles/main.css` lines ~1566-1580

**Action**:
- [ ] Change `.artwork-image-container { flex: 0 0 35%; }` to `flex: 0 0 60%;`
- [ ] Change `.critiques-panel { flex: 0 0 65%; }` to `flex: 0 0 40%;`
- [ ] Update gap from `20px` to `40px`

**Validation**:
```bash
# Visual check at 768px viewport
# Image should occupy ~60% width, critiques ~40%
```

---

### Task 1.2: Update Desktop Breakpoint (1024px) Ratios
**Time**: 2 min
**File**: `styles/main.css` lines ~1586-1605

**Action**:
- [ ] Change `.artwork-image-container { flex: 0 0 40%; }` to `flex: 0 0 60%;`
- [ ] Change `.critiques-panel { flex: 0 0 60%; }` to `flex: 0 0 40%;`
- [ ] Update gap from `40px` to `48px`

**Validation**:
```bash
# Visual check at 1024px viewport
# Image:critique ratio should be 60:40
```

---

### Task 1.3: Update Large Screen Breakpoint (1440px) Ratios
**Time**: 2 min
**File**: `styles/main.css` lines ~1625-1644

**Action**:
- [ ] Change `.artwork-image-container { flex: 0 0 35%; }` to `flex: 0 0 60%;`
- [ ] Change `.critiques-panel { flex: 0 0 65%; }` to `flex: 0 0 40%;`
- [ ] Keep gap at `48px`

**Validation**:
```bash
# Visual check at 1440px viewport
```

---

### Task 1.4: Update Ultra-Wide Breakpoint (1920px) Ratios
**Time**: 2 min
**File**: `styles/main.css` lines ~1664-1683

**Action**:
- [ ] Change `.artwork-image-container { flex: 0 0 35%; }` to `flex: 0 0 60%;`
- [ ] Change `.critiques-panel { flex: 0 0 65%; }` to `flex: 0 0 40%;`
- [ ] Keep gap at `48px`

**Validation**:
```bash
# Visual check at 1920px viewport
```

---

### Task 1.5: Verify Mobile Vertical Stack Unchanged
**Time**: 2 min
**File**: `styles/main.css` lines ~1726-1745

**Action**:
- [ ] Confirm `.artwork-display { flex-direction: column; }` is present
- [ ] Confirm no ratio changes on mobile (<768px)
- [ ] Verify full-width image and critiques

**Validation**:
```bash
# Visual check at 375px viewport
# Should be vertical stack, not horizontal split
```

---

## Phase 2: Single-Column Layout Conversion (15 min)

### Task 2.1: Convert Base .critiques-panel to Flexbox
**Time**: 3 min
**File**: `styles/main.css` lines ~1365-1373

**Action**:
- [ ] Remove `display: grid;`
- [ ] Remove `grid-template-columns: 1fr;`
- [ ] Add `display: flex;`
- [ ] Add `flex-direction: column;`
- [ ] Change `gap: 16px;` (keep if already 16px)
- [ ] Remove `align-content: start;` (not used in flexbox)

**Before**:
```css
.critiques-panel {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  overflow-y: auto;
  padding-right: 8px;
  align-content: start;
}
```

**After**:
```css
.critiques-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  padding-right: 8px;
}
```

**Validation**:
- [ ] No console errors
- [ ] Critiques display in single column

---

### Task 2.2: Remove Tablet 2-Column Grid Rule
**Time**: 2 min
**File**: `styles/main.css` lines ~1575-1580

**Action**:
- [ ] Delete entire block:
```css
.critiques-panel {
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
```
- [ ] Or comment out for reference

**Validation**:
- [ ] Tablet (768px) shows single column, not 2 columns

---

### Task 2.3: Remove Desktop 3-Column Grid Rule
**Time**: 2 min
**File**: `styles/main.css` lines ~1600-1605

**Action**:
- [ ] Delete:
```css
.critiques-panel {
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
```

**Validation**:
- [ ] Desktop (1024px) shows single column, not 3 columns

---

### Task 2.4: Remove Large Screen 4-Column Grid Rule
**Time**: 2 min
**File**: `styles/main.css` lines ~1639-1644

**Action**:
- [ ] Delete:
```css
.critiques-panel {
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;
}
```

**Validation**:
- [ ] Large screen (1440px) shows single column, not 4 columns

---

### Task 2.5: Remove Ultra-Wide 4-Column Grid Rule
**Time**: 2 min
**File**: `styles/main.css` lines ~1678-1683

**Action**:
- [ ] Delete:
```css
.critiques-panel {
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;
}
```

**Validation**:
- [ ] Ultra-wide (1920px) shows single column

---

### Task 2.6: Verify Mobile Overflow Behavior
**Time**: 2 min
**File**: `styles/main.css` lines ~1741-1745

**Action**:
- [ ] Confirm `overflow-y: visible;` is present for mobile
- [ ] Ensure desktop uses `overflow-y: auto;`

**Validation**:
```javascript
const panel = document.querySelector('.critiques-panel');
const styles = window.getComputedStyle(panel);

// Desktop
if (window.innerWidth >= 768) {
  console.assert(styles.overflowY === 'auto', 'Desktop should have overflow-y: auto');
} else {
  console.assert(styles.overflowY === 'visible', 'Mobile should have overflow-y: visible');
}
```

---

### Task 2.7: Test Scrolling at All Breakpoints
**Time**: 2 min

**Action**:
- [ ] Test smooth scroll at 768px
- [ ] Test smooth scroll at 1024px
- [ ] Test smooth scroll at 1440px
- [ ] Test document scroll at 375px (mobile)

**Validation**:
- [ ] No horizontal scrollbar appears
- [ ] Vertical scrolling is smooth
- [ ] All 6 critique cards visible when scrolling

---

## Phase 3: Typography Optimization (10 min)

### Task 3.1: Update .critique-text Font Size and Line-Height
**Time**: 2 min
**File**: `styles/main.css` lines ~1407-1411

**Action**:
- [ ] Change `font-size: 0.95rem;` to `font-size: 1rem;`
- [ ] Change `line-height: 1.6;` to `line-height: 1.7;`

**Before**:
```css
.critique-text {
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0 0 12px 0;
}
```

**After**:
```css
.critique-text {
  font-size: 1rem;
  line-height: 1.7;
  margin: 0 0 12px 0;
}
```

**Validation**:
- [ ] Text visibly larger and more readable
- [ ] No overflow issues

---

### Task 3.2: Update .critique-author Font Size and Margin
**Time**: 2 min
**File**: `styles/main.css` lines ~1394-1399

**Action**:
- [ ] Change `font-size: 1.1rem;` to `font-size: 1.2rem;`
- [ ] Change `margin: 0 0 4px 0;` to `margin: 0 0 8px 0;`

**Before**:
```css
.critique-author {
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-weight: var(--weight-semibold);
  margin: 0 0 4px 0;
}
```

**After**:
```css
.critique-author {
  font-family: var(--font-serif);
  font-size: 1.2rem;
  font-weight: var(--weight-semibold);
  margin: 0 0 8px 0;
}
```

**Validation**:
- [ ] Author name more prominent
- [ ] Adequate spacing below author name

---

### Task 3.3: Update .critique-period Font Size
**Time**: 1 min
**File**: `styles/main.css` lines ~1401-1405

**Action**:
- [ ] Change `font-size: 0.9rem;` to `font-size: 0.95rem;` (if currently 0.9rem)

**Before**:
```css
.critique-period {
  font-size: 0.9rem;
  color: var(--color-text-light);
  margin: 0;
}
```

**After**:
```css
.critique-period {
  font-size: 0.95rem;
  color: var(--color-text-light);
  margin: 0;
}
```

**Validation**:
- [ ] Period text still subordinate to author and body text

---

### Task 3.4: Visual Comparison Test
**Time**: 3 min

**Action**:
- [ ] Compare before/after font sizes
- [ ] Check visual hierarchy: author (1.2rem) > text (1rem) > period (0.95rem)
- [ ] Verify Chinese characters render clearly
- [ ] Verify English text wraps naturally

**Validation**:
```javascript
const author = document.querySelector('.critique-author');
const text = document.querySelector('.critique-text');
const period = document.querySelector('.critique-period');

const authorSize = parseFloat(window.getComputedStyle(author).fontSize);
const textSize = parseFloat(window.getComputedStyle(text).fontSize);
const periodSize = parseFloat(window.getComputedStyle(period).fontSize);

console.assert(authorSize > textSize && textSize > periodSize, 'Size hierarchy correct');
console.log(`Author: ${authorSize}px, Text: ${textSize}px, Period: ${periodSize}px`);
// Expected: Author: 19.2px, Text: 16px, Period: 15.2px
```

---

### Task 3.5: Accessibility Font Size Check
**Time**: 2 min

**Action**:
- [ ] Verify all text ≥ 12px (WCAG AA minimum)
- [ ] Test 200% browser zoom
- [ ] Verify no content is hidden or cut off

**Validation**:
- [ ] All text readable at 200% zoom
- [ ] No horizontal scroll required
- [ ] Layout remains intact

---

## Phase 4: Expand/Collapse Functionality (30 min)

### Task 4.1: Add truncateText() Utility Function
**Time**: 5 min
**File**: `js/gallery-hero.js` (add near top of IIFE)

**Action**:
- [ ] Add function before `render()` function:

```javascript
/**
 * Smart text truncation at sentence boundaries
 * @param {string} text - Full text
 * @param {number} maxLength - Maximum characters (default 150)
 * @returns {string} - Truncated text with "..."
 */
function truncateText(text, maxLength = 150) {
  if (!text || text.length <= maxLength) return text;

  const truncated = text.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('。');
  const lastComma = truncated.lastIndexOf('，');

  const breakPoint = Math.max(lastPeriod, lastComma);

  // Use sentence boundary if found after 50 chars
  return breakPoint > 50
    ? text.substring(0, breakPoint + 1) + '...'
    : truncated + '...';
}
```

**Validation**:
- [ ] Test with various text lengths
- [ ] Verify sentence boundary detection
- [ ] Check Chinese punctuation handling

---

### Task 4.2: Add toggleCritiqueExpansion() Handler
**Time**: 5 min
**File**: `js/gallery-hero.js`

**Action**:
- [ ] Add toggle function:

```javascript
/**
 * Toggle critique expansion state
 * @param {HTMLElement} card - Critique card element
 * @param {HTMLElement} textElement - Text paragraph element
 * @param {HTMLElement} button - Toggle button element
 * @param {string} fullText - Full critique text
 */
function toggleCritiqueExpansion(card, textElement, button, fullText) {
  const isExpanded = card.classList.contains('expanded');

  if (isExpanded) {
    // Collapse
    card.classList.remove('expanded');
    textElement.textContent = truncateText(fullText, 150);
    button.textContent = '展开 ▼';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', '展开评论全文');
  } else {
    // Expand
    card.classList.add('expanded');
    textElement.textContent = fullText;
    button.textContent = '收起 ▲';
    button.setAttribute('aria-expanded', 'true');
    button.setAttribute('aria-label', '收起评论');
  }
}
```

**Validation**:
- [ ] Function toggles class correctly
- [ ] ARIA attributes update
- [ ] Button text changes

---

### Task 4.3: Modify renderCritiques() to Use Card Creation
**Time**: 10 min
**File**: `js/gallery-hero.js` (modify existing function)

**Action**:
- [ ] Find `renderCritiques()` function
- [ ] Replace critique card creation with call to new helper function
- [ ] Store full text in `data-full-text` attribute

**Before** (simplified):
```javascript
function renderCritiques(carousel) {
  const critiques = getCurrentCritiques(carousel);
  const panel = document.getElementById('critiques-panel');
  panel.innerHTML = '';

  critiques.forEach(critique => {
    const card = createBasicCard(critique);
    panel.appendChild(card);
  });
}
```

**After**:
```javascript
function renderCritiques(carousel) {
  const critiques = getCurrentCritiques(carousel);
  const panel = document.getElementById('critiques-panel');
  panel.innerHTML = '';

  const artwork = carousel.currentArtwork();

  critiques.forEach(critique => {
    const card = createCritiqueCard(critique, artwork.id);
    panel.appendChild(card);
  });
}
```

**Validation**:
- [ ] Cards render with truncated text
- [ ] Toggle buttons appear
- [ ] Full text stored in data attribute

---

### Task 4.4: Create createCritiqueCard() Helper Function
**Time**: 10 min
**File**: `js/gallery-hero.js`

**Action**:
- [ ] Add complete card creation function:

```javascript
/**
 * Create critique card with expand/collapse functionality
 * @param {Object} critique - Critique data
 * @param {string} artworkId - Artwork identifier
 * @returns {HTMLElement} - Complete critique card
 */
function createCritiqueCard(critique, artworkId) {
  // Get persona data
  const persona = window.VULCA_DATA.personas.find(p => p.id === critique.personaId);
  if (!persona) {
    console.warn(`Persona not found: ${critique.personaId}`);
    return document.createElement('div');
  }

  // Create card container
  const card = document.createElement('div');
  card.className = 'critique-panel';
  card.dataset.critiqueId = `${artworkId}-${persona.id}`;
  card.style.borderLeftColor = persona.color;
  card.dataset.fullText = critique.textZh; // Store full text

  // Header (author + period)
  const header = document.createElement('div');
  header.className = 'critique-header';

  const authorName = document.createElement('h3');
  authorName.className = 'critique-author';
  authorName.textContent = `${persona.nameZh} (${persona.nameEn})`;

  const period = document.createElement('p');
  period.className = 'critique-period';
  period.textContent = persona.period;

  header.appendChild(authorName);
  header.appendChild(period);
  card.appendChild(header);

  // Text (truncated by default)
  const text = document.createElement('p');
  text.className = 'critique-text';
  text.id = `critique-text-${card.dataset.critiqueId}`;
  text.textContent = truncateText(critique.textZh, 150);
  card.appendChild(text);

  // Toggle button
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'critique-toggle-btn';
  toggleBtn.textContent = '展开 ▼';
  toggleBtn.setAttribute('aria-expanded', 'false');
  toggleBtn.setAttribute('aria-label', '展开评论全文');
  toggleBtn.setAttribute('aria-controls', text.id);

  toggleBtn.addEventListener('click', () => {
    toggleCritiqueExpansion(card, text, toggleBtn, critique.textZh);
  });

  card.appendChild(toggleBtn);

  return card;
}
```

**Validation**:
- [ ] Cards render with all elements
- [ ] Click events attached
- [ ] Persona colors applied

---

## Phase 5: CSS Styling for Expand/Collapse (15 min)

### Task 5.1: Add Toggle Button Base Styles
**Time**: 5 min
**File**: `styles/main.css` (add after `.critique-text` styles)

**Action**:
- [ ] Add button styling:

```css
.critique-toggle-btn {
  display: inline-block;
  background: none;
  border: none;
  color: #1976d2;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 12px;
  margin-top: 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.critique-toggle-btn:hover {
  background-color: rgba(25, 118, 210, 0.08);
  color: #1565c0;
}

.critique-toggle-btn:focus {
  outline: 2px solid #1976d2;
  outline-offset: 2px;
}

.critique-toggle-btn:active {
  background-color: rgba(25, 118, 210, 0.16);
}
```

**Validation**:
- [ ] Button visually distinct from text
- [ ] Hover effect works
- [ ] Focus outline visible

---

### Task 5.2: Add Expansion Transition Styles
**Time**: 5 min
**File**: `styles/main.css` (modify `.critique-text` rule)

**Action**:
- [ ] Update `.critique-text` with transition:

```css
.critique-text {
  font-size: 1rem;
  line-height: 1.7;
  margin: 0 0 12px 0;
  max-height: 150px;          /* ADDED */
  overflow: hidden;           /* ADDED */
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* ADDED */
}

.critique-panel.expanded .critique-text {
  max-height: 2000px; /* Large enough for longest critique */
}
```

**Validation**:
- [ ] Smooth animation when expanding
- [ ] Smooth animation when collapsing
- [ ] No layout shift jank

---

### Task 5.3: Add Icon Rotation Animation (Optional Enhancement)
**Time**: 3 min
**File**: `styles/main.css`

**Action**:
- [ ] Add rotation for visual feedback:

```css
.critique-toggle-btn {
  /* ... existing styles ... */
  position: relative;
}

.critique-toggle-btn::after {
  content: '';
  display: inline-block;
  margin-left: 4px;
  transition: transform 0.3s ease;
}

.critique-panel.expanded .critique-toggle-btn::after {
  transform: rotate(180deg);
}
```

**Validation**:
- [ ] Icon rotates on expand
- [ ] Icon rotates back on collapse

---

### Task 5.4: Test All Transition States
**Time**: 2 min

**Action**:
- [ ] Test expand animation smoothness
- [ ] Test collapse animation smoothness
- [ ] Test rapid click behavior
- [ ] Check performance (no dropped frames)

**Validation**:
```javascript
// Monitor frame rate during animation
let lastTime = performance.now();
let frames = 0;

function checkFPS() {
  frames++;
  const currentTime = performance.now();
  if (currentTime >= lastTime + 1000) {
    console.log(`FPS: ${frames}`);
    // Should be ~60fps
    frames = 0;
    lastTime = currentTime;
  }
  requestAnimationFrame(checkFPS);
}

// Start monitoring, then expand/collapse cards
requestAnimationFrame(checkFPS);
```

---

## Phase 6: Comprehensive Testing (15 min)

### Task 6.1: Visual Regression Testing
**Time**: 5 min

**Breakpoints to test**:
- [ ] 375px (Mobile - iPhone SE)
- [ ] 768px (Tablet - iPad)
- [ ] 1024px (Desktop - MacBook)
- [ ] 1440px (Large Desktop)
- [ ] 1920px (Full HD)

**Checklist per breakpoint**:
- [ ] Image:critique ratio correct (60:40 on desktop, vertical on mobile)
- [ ] Single-column layout (not grid)
- [ ] Typography readable and well-sized
- [ ] Expand/collapse buttons visible
- [ ] Smooth scrolling

---

### Task 6.2: Interaction Testing
**Time**: 5 min

**Test cases**:
- [ ] Click expand → Text expands, button changes
- [ ] Click collapse → Text collapses, button reverts
- [ ] Expand card 1 → Card 1 expands, others remain collapsed
- [ ] Expand all 6 cards → All expand independently
- [ ] Collapse mixed cards → Correct cards collapse
- [ ] Rapid click → No broken state
- [ ] Keyboard Tab → Focus moves to button
- [ ] Keyboard Enter → Toggles expansion
- [ ] Keyboard Space → Toggles expansion

**Validation**:
- [ ] All interactions work correctly
- [ ] No console errors
- [ ] Smooth animations

---

### Task 6.3: Accessibility Testing
**Time**: 3 min

**Checklist**:
- [ ] Screen reader announces button label
- [ ] ARIA `aria-expanded` toggles correctly
- [ ] Focus indicator visible on button
- [ ] Keyboard navigation logical (Tab order)
- [ ] Color contrast meets WCAG AA (button vs background)
- [ ] Text readable at 200% zoom

**Tools**:
- Chrome DevTools Lighthouse (Accessibility score)
- NVDA or JAWS screen reader
- Browser zoom test

---

### Task 6.4: Cross-Browser Testing
**Time**: 2 min

**Browsers**:
- [ ] Chrome 120+ (Windows/Mac)
- [ ] Firefox 121+ (Windows/Mac)
- [ ] Safari 17+ (Mac/iOS)
- [ ] Edge 120+ (Windows)

**Check**:
- [ ] Layout renders correctly
- [ ] Animations smooth
- [ ] Interactions work
- [ ] No JavaScript errors

---

## Phase 7: Documentation and Cleanup (10 min)

### Task 7.1: Update CLAUDE.md
**Time**: 3 min
**File**: `CLAUDE.md`

**Action**:
- [ ] Add section documenting new 60:40 ratio
- [ ] Document single-column layout change
- [ ] Document expand/collapse feature
- [ ] Update FAQ if needed

---

### Task 7.2: Add Code Comments
**Time**: 3 min
**File**: `js/gallery-hero.js`

**Action**:
- [ ] Add JSDoc comments to new functions
- [ ] Document truncation logic
- [ ] Explain expand/collapse pattern

---

### Task 7.3: Git Commit
**Time**: 2 min

**Action**:
- [ ] Stage all modified files
- [ ] Create commit with message:

```bash
git add styles/main.css js/gallery-hero.js
git commit -m "feat: Adjust gallery layout to 60:40 image-first ratio with expand/collapse

- Change image:critique ratio from 40:60 to 60:40 across all breakpoints
- Convert critiques panel from multi-column grid to single-column list
- Optimize typography: 1rem text, 1.7 line-height, 1.2rem author names
- Add expand/collapse functionality with 150-char preview
- Implement smooth CSS transitions and keyboard accessibility
- Maintain mobile vertical stack layout

Refs: adjust-gallery-layout-proportions

🤖 Generated with Claude Code"
```

**Validation**:
- [ ] All files staged
- [ ] Commit message descriptive
- [ ] No uncommitted changes remain

---

### Task 7.4: Manual QA Checklist
**Time**: 2 min

**Final verification**:
- [ ] Local server running (`python -m http.server 9999`)
- [ ] Visit `http://localhost:9999`
- [ ] Navigate through all 4 artworks
- [ ] Expand/collapse several critiques
- [ ] Test on mobile device or emulator
- [ ] Check console for errors
- [ ] Verify smooth performance

---

## Summary

**Total tasks**: 47
**Estimated time**: 120 minutes (2 hours)

**Phase breakdown**:
- Phase 1 (Ratio Adjustment): 5 tasks, 10 min
- Phase 2 (Single-Column): 7 tasks, 15 min
- Phase 3 (Typography): 5 tasks, 10 min
- Phase 4 (JS Expand/Collapse): 4 tasks, 30 min
- Phase 5 (CSS Expand/Collapse): 4 tasks, 15 min
- Phase 6 (Testing): 4 tasks, 15 min
- Phase 7 (Documentation): 4 tasks, 10 min

**Dependencies**:
- Phase 1 and 2 can run in parallel (separate files)
- Phase 3 depends on Phase 2 (typography in single-column context)
- Phase 4 and 5 are interdependent (JS + CSS for expand/collapse)
- Phase 6 depends on Phases 1-5 (testing complete implementation)
- Phase 7 is final (documentation and commit)

**Risk areas**:
- Expand/collapse animation performance (monitor with DevTools)
- Text overflow at 40% panel width (test with longest critiques)
- Mobile layout regression (verify vertical stack intact)
- Accessibility compliance (keyboard navigation, screen readers)

---

**Ready to start**: Run `/openspec:apply adjust-gallery-layout-proportions`
