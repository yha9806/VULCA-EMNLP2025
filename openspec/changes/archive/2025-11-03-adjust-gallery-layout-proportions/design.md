# Adjust Gallery Layout Proportions - Design Document

**Change ID**: `adjust-gallery-layout-proportions`
**Date**: 2025-11-03
**Status**: 🔄 Design

---

## Design Decisions

### Decision 1: Image-Critique Ratio Strategy

**Context**: Need to increase image prominence while maintaining critique readability.

**Options Considered**:

A) **50-50 Balanced Split**
   - ✅ Equal visual weight
   - ❌ Doesn't sufficiently prioritize artwork
   - ❌ No significant improvement over current 40-60

B) **60-40 Image-First** ✅ SELECTED
   - ✅ Clear visual hierarchy (artwork is hero)
   - ✅ 50% more image area than current (40% → 60%)
   - ✅ Critiques still have substantial space (40%)
   - ✅ Balances art appreciation with critical analysis
   - ⚠️ Requires single-column critique layout to fit content

C) **70-30 Extreme Image Focus**
   - ✅ Maximum artwork prominence
   - ❌ Critique panel too narrow for comfortable reading
   - ❌ May feel unbalanced on large screens

D) **Responsive Dynamic Ratio** (different ratios per breakpoint)
   - ✅ Optimized for each screen size
   - ❌ Inconsistent experience across devices
   - ❌ More complex CSS maintenance
   - ❌ User requested "A) 所有设备"

**Decision**: **Option B (60-40)** provides optimal balance between artwork prominence and critique readability. Consistent across all devices as user requested.

**Implementation**:
```css
.artwork-image-container { flex: 0 0 60%; }
.critiques-panel { flex: 0 0 40%; }
```

---

### Decision 2: Critique Layout System

**Context**: Multi-column grid (3-4 columns) creates visual fragmentation. Need more readable layout.

**Options Considered**:

A) **Keep Multi-Column Grid, Reduce Columns**
   - Change desktop from 3-4 columns to 2 columns
   - ✅ Simpler than current
   - ❌ Still requires horizontal scanning
   - ❌ Doesn't align with user request "单列垂直滚动列表"

B) **Single-Column Vertical List** ✅ SELECTED
   - ✅ Natural top-to-bottom reading flow
   - ✅ Maximizes available width (40%) for each critique
   - ✅ Easier to scan all critiques sequentially
   - ✅ Consistent experience across all devices
   - ✅ Works well with expand/collapse pattern
   - ⚠️ Requires more vertical scrolling

C) **Two-Column on Large Screens Only**
   - Mobile: 1 column
   - Desktop: 2 columns
   - ✅ More content visible without scrolling
   - ❌ User specifically requested single-column
   - ❌ Still requires horizontal scanning

D) **Masonry Layout** (Pinterest-style)
   - ✅ Efficient space usage
   - ❌ Unpredictable card positions
   - ❌ Complex implementation
   - ❌ Harder to scan sequentially

**Decision**: **Option B (Single-Column)** aligns with user request and provides optimal reading experience for bilingual critique content.

**Implementation**:
```css
/* Replace grid system */
.critiques-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

/* Remove all grid-template-columns media queries */
```

---

### Decision 3: Typography Optimization Approach

**Context**: User requested "调整字体大小和行距" for better readability.

**Options Considered**:

A) **Incremental Adjustment** ✅ SELECTED
   - Font-size: 0.95rem → 1rem (+0.05rem)
   - Line-height: 1.6 → 1.7 (+0.1)
   - Author name: 1.1rem → 1.2rem
   - ✅ Noticeable improvement without drastic change
   - ✅ Maintains visual consistency with other UI elements
   - ✅ Works across all devices
   - ⚠️ Requires testing for overflow issues

B) **Aggressive Scale-Up**
   - Font-size: 0.95rem → 1.1rem (+0.15rem)
   - Line-height: 1.6 → 1.8
   - ✅ Maximum readability improvement
   - ❌ May cause layout overflow with 40% width constraint
   - ❌ Risk of visual imbalance with other UI elements

C) **Responsive Typography** (different sizes per breakpoint)
   - Mobile: 0.9rem
   - Tablet: 1rem
   - Desktop: 1.1rem
   - ✅ Optimized for each screen
   - ❌ Inconsistent reading experience
   - ❌ More complex CSS
   - ❌ User requested uniform change across all devices

D) **Variable Font Scaling** (using clamp())
   - `font-size: clamp(0.95rem, 2vw, 1.1rem)`
   - ✅ Fluid responsive typography
   - ❌ Harder to predict exact sizes
   - ❌ May not be necessary for this use case

**Decision**: **Option A (Incremental)** provides measurable improvement while maintaining design consistency and fitting within 40% width constraint.

**Implementation**:
```css
.critique-text {
  font-size: 1rem;          /* Up from 0.95rem */
  line-height: 1.7;         /* Up from 1.6 */
}

.critique-author {
  font-size: 1.2rem;        /* Up from 1.1rem */
}

.critique-period {
  font-size: 0.95rem;       /* Keep as is (already 0.9rem) */
}
```

---

### Decision 4: Expand/Collapse Implementation Pattern

**Context**: User requested "添加'展开/收起'按钮，默认显示部分文本，点击展开后显示完整内容".

**Options Considered**:

A) **Pure CSS Toggle** (checkbox hack)
   ```html
   <input type="checkbox" id="toggle-{id}" class="toggle-input">
   <label for="toggle-{id}">展开</label>
   <div class="critique-text">...</div>
   ```
   - ✅ No JavaScript required
   - ✅ Lightweight
   - ❌ Limited styling control
   - ❌ Can't dynamically change button text (展开 ↔ 收起)
   - ❌ Harder to add accessibility features

B) **JavaScript Event-Driven** ✅ SELECTED
   ```javascript
   button.addEventListener('click', () => {
     toggleCritiqueExpansion(card);
   });
   ```
   - ✅ Full control over button text and styling
   - ✅ Easy to add accessibility (ARIA attributes)
   - ✅ Can add animations and transitions
   - ✅ Consistent with existing `gallery-hero.js` architecture
   - ⚠️ Requires JavaScript enabled (acceptable for this project)

C) **Web Components** (Custom Element)
   - `<critique-card expandable>`
   - ✅ Encapsulated logic
   - ✅ Reusable component
   - ❌ Overkill for single use case
   - ❌ Browser compatibility concerns
   - ❌ Adds complexity to existing codebase

D) **Framework-Based** (Vue/React component)
   - ✅ Reactive state management
   - ❌ Requires adding entire framework
   - ❌ Project is vanilla JavaScript
   - ❌ Massive overkill

**Decision**: **Option B (JavaScript Event-Driven)** integrates cleanly with existing `gallery-hero.js` module and provides necessary flexibility for UX enhancements.

**Implementation**:
```javascript
// In gallery-hero.js, modify renderCritiques()

function createCritiqueCard(critique, persona) {
  const card = document.createElement('div');
  card.className = 'critique-panel';
  card.dataset.critiqueId = `${critique.artworkId}-${critique.personaId}`;

  // Store full text in data attribute
  card.dataset.fullText = critique.textZh;

  const text = document.createElement('p');
  text.className = 'critique-text';
  text.textContent = truncateText(critique.textZh, 150);

  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'critique-toggle-btn';
  toggleBtn.textContent = '展开 ▼';
  toggleBtn.setAttribute('aria-expanded', 'false');

  toggleBtn.addEventListener('click', () => {
    toggleCritiqueExpansion(card);
  });

  card.appendChild(text);
  card.appendChild(toggleBtn);
  return card;
}
```

---

### Decision 5: Preview Text Length

**Context**: Need to determine optimal truncation length for collapsed state.

**Options Considered**:

A) **150 Characters** ✅ SELECTED
   - ✅ ~2-3 sentences in Chinese
   - ✅ Enough to convey critique essence
   - ✅ Fits comfortably in collapsed card
   - ✅ Leaves room for expand button
   - ⚠️ May cut mid-sentence occasionally

B) **250 Characters** (current preview length)
   - ✅ More complete preview
   - ❌ Too long for collapsed state
   - ❌ Makes cards too tall, reduces benefit of collapsing

C) **100 Characters**
   - ✅ Very compact
   - ❌ Too short to be meaningful
   - ❌ Almost always cuts mid-sentence

D) **First Paragraph**
   - ✅ Natural break point
   - ❌ Paragraphs vary greatly in length
   - ❌ Some critiques are single paragraph

**Decision**: **Option A (150 characters)** balances preview utility with space efficiency. Will add smart truncation to avoid mid-word cuts.

**Implementation**:
```javascript
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;

  // Find last complete sentence within maxLength
  const truncated = text.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('。');
  const lastComma = truncated.lastIndexOf('，');

  const breakPoint = Math.max(lastPeriod, lastComma);

  return breakPoint > 50
    ? text.substring(0, breakPoint + 1) + '...'
    : truncated + '...';
}
```

---

### Decision 6: Mobile Responsive Behavior

**Context**: User requested "A) 所有设备" - apply changes to all devices.

**Options Considered**:

A) **Same Ratio on Mobile** (60-40 horizontal split on small screens)
   - ✅ Consistency across all devices
   - ❌ 60-40 horizontal split problematic on <768px screens
   - ❌ Image too wide, text too narrow on phone

B) **Vertical Stack on Mobile, Ratio on Desktop** ✅ SELECTED
   - ✅ Mobile: Full-width image, full-width critiques (vertical)
   - ✅ Desktop/Tablet: 60-40 horizontal split
   - ✅ Respects device constraints
   - ✅ Better UX on small screens
   - ⚠️ Slight inconsistency, but necessary for usability

C) **Same Ratio Everywhere, Horizontal Scroll on Mobile**
   - ✅ Truly consistent across devices
   - ❌ Horizontal scroll is poor UX on mobile
   - ❌ Users may miss critique content

**Decision**: **Option B** - "所有设备" interpreted as "apply single-column and typography changes universally", but maintain responsive layout strategy (vertical stack <768px, horizontal split ≥768px) for optimal UX.

**Implementation**:
```css
/* Base: Mobile vertical stack */
.artwork-display {
  flex-direction: column;
}

/* Tablet+ horizontal split with 60-40 ratio */
@media (min-width: 768px) {
  .artwork-display {
    flex-direction: row;
  }
  .artwork-image-container { flex: 0 0 60%; }
  .critiques-panel { flex: 0 0 40%; }
}
```

---

### Decision 7: Transition Animation Strategy

**Context**: Expand/collapse should feel smooth and natural.

**Options Considered**:

A) **No Animation**
   - ✅ Instant feedback
   - ❌ Jarring visual jump
   - ❌ Poor UX

B) **CSS Transition on Height** ✅ SELECTED
   ```css
   .critique-text {
     max-height: 100px; /* Collapsed */
     overflow: hidden;
     transition: max-height 0.3s ease;
   }
   .critique-panel.expanded .critique-text {
     max-height: 1000px; /* Expanded (arbitrarily large) */
   }
   ```
   - ✅ Smooth animation
   - ✅ GPU-accelerated
   - ✅ Easy to implement
   - ⚠️ Max-height trick (not exact height)

C) **JavaScript Height Calculation**
   ```javascript
   const height = element.scrollHeight;
   element.style.height = height + 'px';
   ```
   - ✅ Exact height animation
   - ❌ More complex
   - ❌ Requires layout recalculation
   - ❌ Potential performance issues

D) **Opacity Fade + Display Toggle**
   - ✅ Simple
   - ❌ Doesn't animate layout
   - ❌ Causes layout shift

**Decision**: **Option B (CSS max-height transition)** provides good balance of smoothness and simplicity. The max-height trick is well-established pattern.

**Implementation**:
```css
.critique-text {
  max-height: 150px;
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.critique-panel.expanded .critique-text {
  max-height: 2000px; /* Large enough for longest critique */
}

.critique-toggle-btn {
  transition: transform 0.3s ease;
}

.critique-panel.expanded .critique-toggle-btn {
  transform: rotate(180deg); /* Flip arrow icon */
}
```

---

## Architecture Overview

### File Structure

```
styles/
  main.css
    - .artwork-display (flex ratio 60-40)
    - .critiques-panel (flex-direction: column)
    - .critique-text (typography updates)
    - .critique-toggle-btn (button styling)
    - .critique-panel.expanded (expanded state)

js/
  gallery-hero.js
    - renderCritiques() ← Modified to include toggle buttons
    - createCritiqueCard() ← New helper function
    - toggleCritiqueExpansion() ← New interaction handler
    - truncateText() ← New utility function
```

### Data Flow

```
User Action: Click "展开" button
    ↓
Event Listener: button.addEventListener('click', ...)
    ↓
Handler: toggleCritiqueExpansion(card)
    ↓
DOM Update:
  - card.classList.toggle('expanded')
  - text.textContent = fullText or truncated
  - button.textContent = '收起 ▲' or '展开 ▼'
  - button.setAttribute('aria-expanded', true/false)
    ↓
CSS Transition: max-height animation
    ↓
Visual Feedback: Smooth expansion/collapse
```

---

## Testing Strategy

### Visual Regression Testing

**Breakpoints to test**:
- 375px (Mobile - iPhone SE)
- 768px (Tablet - iPad)
- 1024px (Desktop - MacBook)
- 1440px (Large Desktop)
- 1920px (Full HD)

**Scenarios**:
1. All critiques collapsed (default state)
2. One critique expanded
3. All critiques expanded
4. Mix of expanded/collapsed

### Interaction Testing

**Test cases**:
1. Click expand button → Text expands, button changes to "收起 ▲"
2. Click collapse button → Text collapses, button changes to "展开 ▼"
3. Expand multiple cards → Each maintains independent state
4. Scroll panel → Smooth scrolling with expanded cards
5. Keyboard navigation → Tab to button, Enter to toggle

### Accessibility Testing

**Checklist**:
- [ ] ARIA `aria-expanded` attribute toggles correctly
- [ ] Button has accessible name
- [ ] Focus indicator visible on button
- [ ] Screen reader announces expanded/collapsed state
- [ ] No focus trap in critique panel

### Performance Testing

**Metrics**:
- Layout shift (CLS) when toggling < 0.1
- Frame rate during animation ≥ 60fps
- Time to interactive unchanged
- Memory usage with 6 expanded cards < 50MB increase

---

## Rollback Plan

If issues arise after deployment:

1. **CSS Ratio Issues**
   - Revert `flex: 0 0 60%` back to `flex: 0 0 40%`
   - File: `styles/main.css` lines ~1596, ~1635, ~1674

2. **Layout Breaking**
   - Revert `display: flex; flex-direction: column` to `display: grid`
   - Restore `grid-template-columns` media queries
   - File: `styles/main.css` lines ~1365-1373

3. **Expand/Collapse Bugs**
   - Remove toggle button rendering from `gallery-hero.js`
   - Display full text by default (remove truncation)
   - Keep typography improvements

---

**Design Approved**: Ready for spec writing and implementation.
