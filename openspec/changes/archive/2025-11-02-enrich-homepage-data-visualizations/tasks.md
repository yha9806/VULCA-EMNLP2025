# Implementation Tasks: Homepage Data Visualizations

**Change ID**: `enrich-homepage-data-visualizations`
**Total Estimated Time**: 18-24 hours
**Created**: 2025-11-02

---

## Task Organization

Tasks are organized into 3 phases:
1. **Foundation** (4-6 hours) - Data infrastructure and setup
2. **Visualization Components** (10-14 hours) - Build 4 interactive charts
3. **Polish & Integration** (4-6 hours) - Responsiveness, accessibility, testing

---

## Phase 1: Foundation (4-6 hours)

### Task 1.1: Create Analysis Module
**File**: `js/analysis.js`
**Estimated Time**: 2 hours
**Dependencies**: None
**Priority**: MUST

**Objectives**:
- Port RPAIT similarity calculations from `src/analyze.py`
- Implement cosine similarity for RPAIT vectors
- Create utility functions for data aggregation

**Success Criteria**:
- [ ] `rpaitCosineSimilarity(persona1, persona2)` returns 0-1 score
- [ ] `getPersonaAverageRPAIT(personaId)` fetches correct data from VULCA_DATA
- [ ] `getArtworkRPAITProfile(artworkId)` averages across all personas
- [ ] `buildSimilarityMatrix()` generates 6×6 persona similarity matrix
- [ ] All functions have JSDoc comments and type hints
- [ ] Console logs show "✓ Analysis module initialized" on load

**Implementation Notes**:
```javascript
// js/analysis.js structure
window.VULCA_ANALYSIS = {
  init() {
    this.similarityMatrix = this.buildSimilarityMatrix();
    this.artworkProfiles = this.buildArtworkProfiles();
    console.log('✓ Analysis module initialized');
  },

  rpaitCosineSimilarity(rpait1, rpait2) {
    const v1 = [rpait1.R, rpait1.P, rpait1.A, rpait1.I, rpait1.T];
    const v2 = [rpait2.R, rpait2.P, rpait2.A, rpait2.I, rpait2.T];
    // ... cosine similarity implementation
  },

  // ... other functions
};
```

---

### Task 1.2: Set Up HTML Structure
**File**: `index.html`
**Estimated Time**: 1 hour
**Dependencies**: None
**Priority**: MUST

**Objectives**:
- Add visualization section container after gallery-nav
- Create 4 panel divs with canvas/svg elements
- Add control buttons and selectors

**Success Criteria**:
- [ ] `<section class="visualization-section">` exists after line 137
- [ ] 4 viz panels: `#rpait-radar-panel`, `#persona-matrix-panel`, `#similarity-heatmap-panel`, `#network-graph-panel`
- [ ] Canvas elements have correct IDs: `rpait-radar-chart`, `persona-matrix-chart`
- [ ] SVG element `#network-graph` exists
- [ ] All panels have semantic HTML (h3 headings, proper structure)
- [ ] HTML validates (no errors in W3C validator)

**Template**:
```html
<!-- Insert after gallery-nav section -->
<section class="visualization-section" id="visualization-section">
  <div class="container">
    <header class="viz-header">
      <h2>数据洞察 / Data Insights</h2>
      <p>探索评论家视角与作品之间的多维关系</p>
    </header>

    <div class="viz-grid">
      <!-- 4 panels here -->
    </div>
  </div>
</section>
```

---

### Task 1.3: Add Base CSS Styles
**File**: `styles/main.css`
**Estimated Time**: 1 hour
**Dependencies**: Task 1.2
**Priority**: MUST

**Objectives**:
- Add visualization section layout styles
- Create grid system for responsive panels
- Define color variables for dimensions and personas

**Success Criteria**:
- [ ] `.visualization-section` has proper padding and background gradient
- [ ] `.viz-grid` uses CSS Grid with auto-fit columns
- [ ] `.viz-panel` has white background, border-radius, box-shadow
- [ ] Color variables defined for R/P/A/I/T dimensions
- [ ] Responsive breakpoints: desktop (≥1024px), tablet (768-1023px), mobile (<768px)
- [ ] Styles compile without errors

**CSS Variables to Add**:
```css
:root {
  /* RPAIT Dimension Colors */
  --rpait-r: #E8998D;
  --rpait-p: #A3A8C5;
  --rpait-a: #B8D8BE;
  --rpait-i: #F4C2C2;
  --rpait-t: #D4A574;

  /* Heatmap Gradient */
  --heatmap-low: hsl(0, 70%, 75%);
  --heatmap-mid: hsl(40, 70%, 75%);
  --heatmap-high: hsl(120, 70%, 75%);
}
```

---

### Task 1.4: Configure Script Loading
**File**: `index.html`
**Estimated Time**: 30 minutes
**Dependencies**: Task 1.1, 1.2
**Priority**: MUST

**Objectives**:
- Add analysis.js script tag
- Add D3.js CDN links (minimal modules)
- Ensure load order: data.js → analysis.js → visualizations

**Success Criteria**:
- [ ] `<script src="/js/analysis.js?v=1">` loads before visualizations
- [ ] D3.js force and selection modules load from CDN
- [ ] No 404 errors in network tab
- [ ] Scripts load in correct order (verified in DevTools)

---

### Task 1.5: Initialize Analysis on Load
**File**: `js/analysis.js`
**Estimated Time**: 30 minutes
**Dependencies**: Task 1.1, 1.4
**Priority**: MUST

**Objectives**:
- Call `VULCA_ANALYSIS.init()` on DOMContentLoaded
- Pre-compute similarity matrix
- Cache results in memory

**Success Criteria**:
- [ ] Analysis initializes automatically on page load
- [ ] Console shows "✓ Analysis module initialized"
- [ ] `window.VULCA_ANALYSIS.similarityMatrix` populated with 36 entries
- [ ] No errors in console

---

## Phase 2: Visualization Components (10-14 hours)

### Task 2.1: Build RPAIT Radar Chart Component
**File**: `js/visualizations/rpait-radar.js`
**Estimated Time**: 2.5 hours
**Dependencies**: Task 1.1, 1.2, 1.3
**Priority**: MUST

**Objectives**:
- Initialize Chart.js radar chart
- Display Su Shi's RPAIT scores by default
- Implement comparison mode (overlay 2-3 personas)
- Handle artwork filter updates

**Success Criteria**:
- [ ] Chart renders on page load with Su Shi's data
- [ ] 5 axes labeled (R, P, A, I, T) in Chinese and English
- [ ] Persona color from `data.js` applied correctly
- [ ] "Comparison Mode" button overlays 2 personas
- [ ] Carousel navigation triggers chart update via `visualization:update` event
- [ ] Chart updates within 100ms
- [ ] No visual distortion on mobile (375px width)

**Verification Command**:
```javascript
// In browser console
const chart = Chart.getChart('rpait-radar-chart');
console.log(chart.data.datasets[0].label);  // Should show "苏轼 (Su Shi)"
console.log(chart.data.datasets[0].data);   // Should be [7, 9, 8, 8, 7]
```

---

### Task 2.2: Build Persona Comparison Matrix
**File**: `js/visualizations/persona-matrix.js`
**Estimated Time**: 3 hours
**Dependencies**: Task 1.1, 1.2, 1.3
**Priority**: MUST

**Objectives**:
- Create horizontal bar chart comparing all personas
- Implement dimension filter (All, R, P, A, I, T)
- Color-code bars by dimension
- Update on artwork change

**Success Criteria**:
- [ ] Chart displays 6 personas × 5 dimensions (30 bars total) in "All" mode
- [ ] Dimension selector filters to single dimension
- [ ] Each dimension uses correct color variable
- [ ] Bars sorted by score (highest to lowest)
- [ ] Tooltip shows exact score and dimension name
- [ ] Chart responsive on tablet (400px width)

**Implementation Checklist**:
```javascript
// Dataset structure
datasets: [
  { label: 'Representation (R)', data: [7,8,6,7,8,8], backgroundColor: 'var(--rpait-r)' },
  { label: 'Philosophy (P)', data: [9,7,8,6,7,8], backgroundColor: 'var(--rpait-p)' },
  // ... A, I, T
]
```

---

### Task 2.3: Build Similarity Heatmap
**File**: `js/visualizations/similarity-heatmap.js`
**Estimated Time**: 2.5 hours
**Dependencies**: Task 1.1, 1.2, 1.3
**Priority**: MUST

**Objectives**:
- Render 6×6 HTML/CSS grid
- Color cells by similarity score (green to red gradient)
- Display numerical scores in cells
- Add hover tooltips

**Success Criteria**:
- [ ] 36 cells render in 6×6 grid
- [ ] Diagonal cells (Su Shi ↔ Su Shi) show 1.00 and bright green
- [ ] Off-diagonal cells show correct similarity scores
- [ ] Color scale: ≥0.9 green, 0.7-0.9 yellow-green, 0.5-0.7 orange, <0.5 red
- [ ] Hover shows tooltip: "Su Shi ↔ Guo Xi: 0.92 (High similarity)"
- [ ] Cell hover scales up 10% with smooth transition
- [ ] Grid responsive on mobile (stacks to single column if needed)

**CSS Structure**:
```css
.heatmap-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 2px;
}

.heatmap-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}
```

---

### Task 2.4: Build Network Graph
**File**: `js/visualizations/network-graph.js`
**Estimated Time**: 4 hours
**Dependencies**: Task 1.1, 1.2, 1.3, D3.js loaded
**Priority**: SHOULD

**Objectives**:
- Initialize D3 force-directed graph
- Create 10 nodes (4 artworks + 6 personas)
- Create 24 edges (all artwork-persona pairs)
- Implement drag interaction
- Implement click-to-filter

**Success Criteria**:
- [ ] Graph renders with 10 circles (4 large, 6 medium)
- [ ] 24 lines connect artworks to personas
- [ ] Edge thickness reflects RPAIT alignment (thicker = higher)
- [ ] Nodes draggable with mouse
- [ ] Force simulation runs for 300 ticks then stops
- [ ] Clicking artwork node filters to show only its 6 edges
- [ ] Graph centers in SVG viewport
- [ ] No node overlaps after simulation stabilizes

**D3.js Initialization**:
```javascript
const nodes = [
  { id: 'artwork-1', type: 'artwork', radius: 40, color: '#667eea' },
  // ... 3 more artworks
  { id: 'su-shi', type: 'persona', radius: 25, color: '#B85C3C' },
  // ... 5 more personas
];

const links = [
  { source: 'artwork-1', target: 'su-shi', weight: 0.85 },
  // ... 23 more links
];

const simulation = d3.forceSimulation(nodes)
  .force('link', d3.forceLink(links).id(d => d.id).distance(d => 100 / d.weight))
  .force('charge', d3.forceManyBody().strength(-300))
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('collision', d3.forceCollide().radius(d => d.radius + 5));
```

---

### Task 2.5: Implement Event Communication
**File**: `js/carousel.js` (modify), `js/visualizations/*.js`
**Estimated Time**: 1.5 hours
**Dependencies**: All Phase 2 tasks
**Priority**: MUST

**Objectives**:
- Emit `visualization:update` event when carousel changes
- All visualizations listen to this event
- Update all 4 charts when artwork changes

**Success Criteria**:
- [ ] Carousel emits event: `window.dispatchEvent(new CustomEvent('visualization:update', {detail: {artworkId}}))`
- [ ] All 4 visualizations listen to event
- [ ] Radar chart updates within 100ms
- [ ] Matrix chart updates within 100ms
- [ ] Heatmap updates within 150ms (CSS transitions)
- [ ] Network graph updates within 200ms (D3 simulation restart)
- [ ] No console errors during update

**Integration Code**:
```javascript
// In carousel.js (add this)
function updateArtwork(newIndex) {
  const artworkId = VULCA_DATA.artworks[newIndex].id;
  window.dispatchEvent(new CustomEvent('visualization:update', {
    detail: { artworkId, artworkIndex: newIndex }
  }));
}

// In each visualization component (add this)
window.addEventListener('visualization:update', (e) => {
  const { artworkId } = e.detail;
  updateChart(artworkId);
});
```

---

## Phase 3: Polish & Integration (4-6 hours)

### Task 3.1: Responsive CSS Refinement
**File**: `styles/main.css`
**Estimated Time**: 2 hours
**Dependencies**: All Phase 2 tasks
**Priority**: MUST

**Objectives**:
- Fine-tune responsive breakpoints
- Ensure charts scale properly
- Fix mobile layout issues

**Success Criteria**:
- [ ] Desktop (1920px): All 4 panels visible, 2×2 grid
- [ ] Laptop (1440px): 2×2 grid, charts slightly smaller
- [ ] Tablet (768px): 1×4 stack, charts 400×320px
- [ ] Mobile (375px): 1×4 stack, charts 100% width × 280px
- [ ] No horizontal scroll at any breakpoint
- [ ] Text remains readable (min 12px) on all devices
- [ ] Buttons and controls remain tappable (min 44×44px)

**Testing Devices**:
- Desktop: 1920×1080, 1440×900
- Tablet: iPad (768×1024), iPad Pro (1024×1366)
- Mobile: iPhone SE (375×667), iPhone 12 (390×844), Galaxy S21 (360×800)

---

### Task 3.2: Accessibility Enhancements
**File**: Multiple files
**Estimated Time**: 1.5 hours
**Dependencies**: All Phase 2 tasks
**Priority**: MUST

**Objectives**:
- Add ARIA labels to all interactive elements
- Ensure keyboard navigation works
- Test with screen reader
- Verify color contrast

**Success Criteria**:
- [ ] All canvas elements have `role="img"` and descriptive `aria-label`
- [ ] All buttons focusable via Tab key
- [ ] Enter key activates buttons
- [ ] Chart tooltips accessible via keyboard (focus + Spacebar)
- [ ] Screen reader announces chart data changes
- [ ] Color contrast ratio ≥4.5:1 for all text/background pairs
- [ ] No contrast errors in axe DevTools

**ARIA Labels Template**:
```html
<canvas id="rpait-radar-chart"
        role="img"
        aria-label="RPAIT radar chart showing Su Shi's scores: Representation 7, Philosophy 9, Aesthetic 8, Identity 8, Tradition 7"
        tabindex="0">
</canvas>

<button class="viz-btn" aria-label="Switch to comparison mode" data-mode="compare">
  对比模式
</button>
```

---

### Task 3.3: Performance Optimization
**File**: Multiple files
**Estimated Time**: 1.5 hours
**Dependencies**: All Phase 2 tasks
**Priority**: SHOULD

**Objectives**:
- Implement lazy loading for visualizations
- Cache computed data
- Optimize Chart.js update calls
- Debounce resize events

**Success Criteria**:
- [ ] Visualizations don't initialize until user scrolls near them (Intersection Observer)
- [ ] Similarity matrix computed once and cached
- [ ] Chart.js `.update('none')` used for instant updates (no animation)
- [ ] Window resize debounced to 250ms
- [ ] Initial page load time ≤2 seconds
- [ ] Chart render time ≤300ms
- [ ] Chart update time ≤100ms
- [ ] Memory usage ≤50MB for all charts combined

**Lazy Loading Implementation**:
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      initializeVisualizations();
      observer.disconnect();
    }
  });
}, { rootMargin: '200px' });

observer.observe(document.getElementById('visualization-section'));
```

---

### Task 3.4: Cross-Browser Testing
**File**: N/A (testing only)
**Estimated Time**: 1 hour
**Dependencies**: All tasks
**Priority**: MUST

**Objectives**:
- Test on all supported browsers
- Fix browser-specific bugs
- Verify Chart.js compatibility

**Success Criteria**:
- [ ] Chrome 90+: All visualizations render correctly
- [ ] Firefox 88+: All visualizations render correctly
- [ ] Safari 14+: All visualizations render correctly
- [ ] Edge 90+: All visualizations render correctly
- [ ] Mobile Safari (iOS 14+): All visualizations work on iPhone
- [ ] Chrome Mobile (Android 10+): All visualizations work on Android
- [ ] No console errors in any browser
- [ ] Chart.js animations smooth (≥30fps) in all browsers

**Testing Checklist**:
- [ ] Load homepage on each browser
- [ ] Navigate carousel → verify all charts update
- [ ] Resize window → verify responsive behavior
- [ ] Click comparison mode → verify overlay works
- [ ] Drag network graph nodes → verify interaction
- [ ] Check DevTools console for errors

---

### Task 3.5: Documentation & Comments
**File**: All JS files
**Estimated Time**: 1 hour
**Dependencies**: All tasks
**Priority**: SHOULD

**Objectives**:
- Add JSDoc comments to all functions
- Document Chart.js configurations
- Add inline comments for complex logic

**Success Criteria**:
- [ ] All exported functions have JSDoc blocks
- [ ] Parameters and return types documented
- [ ] Complex algorithms explained with comments
- [ ] Chart configuration objects have section comments
- [ ] README.md updated with visualization section (optional)

**JSDoc Template**:
```javascript
/**
 * Calculate cosine similarity between two RPAIT vectors.
 *
 * @param {Object} rpait1 - First RPAIT object with R, P, A, I, T properties
 * @param {Object} rpait2 - Second RPAIT object
 * @returns {number} Similarity score in range [0, 1], where 1 = identical
 *
 * @example
 * const similarity = rpaitCosineSimilarity(
 *   { R: 7, P: 9, A: 8, I: 8, T: 7 },
 *   { R: 8, P: 7, A: 8, I: 7, T: 8 }
 * );
 * console.log(similarity);  // 0.92
 */
function rpaitCosineSimilarity(rpait1, rpait2) {
  // ... implementation
}
```

---

### Task 3.6: Final Integration Testing
**File**: N/A (testing only)
**Estimated Time**: 1 hour
**Dependencies**: All tasks
**Priority**: MUST

**Objectives**:
- End-to-end testing of all features
- Verify no regressions in existing functionality
- Test edge cases

**Success Criteria**:
- [ ] Page loads without errors
- [ ] All 4 visualizations render on initial load
- [ ] Carousel navigation updates all visualizations
- [ ] Comparison mode works for radar chart
- [ ] Dimension filter works for matrix chart
- [ ] Heatmap tooltips appear on hover
- [ ] Network graph nodes draggable
- [ ] Clicking artwork node filters network graph
- [ ] Mobile layout works on 375px width
- [ ] No broken images or 404 errors
- [ ] No console errors or warnings

**Manual Test Cases**:
1. Load page → Scroll to visualizations → Verify all 4 panels render
2. Click carousel "Next" → Verify all charts update
3. Click "Comparison Mode" → Select 2 personas → Verify overlay
4. Select "Philosophy (P)" filter → Verify matrix shows only P dimension
5. Hover heatmap cell → Verify tooltip appears
6. Drag Su Shi node in network graph → Verify smooth movement
7. Click artwork-1 node → Verify only 6 edges remain visible
8. Resize window to 375px → Verify mobile layout
9. Tab through all buttons → Verify keyboard navigation
10. Test with screen reader → Verify announcements

---

## Verification Checklist

### Functional Requirements
- [ ] RPAIT radar chart displays all personas correctly
- [ ] Comparison mode overlays 2-3 personas
- [ ] Persona matrix compares all dimensions
- [ ] Dimension filter isolates single dimension
- [ ] Similarity heatmap shows 36 cells with correct scores
- [ ] Network graph displays 10 nodes and 24 edges
- [ ] Carousel navigation updates all visualizations
- [ ] All charts update within specified time limits

### Non-Functional Requirements
- [ ] Desktop responsive (1920px, 1440px, 1024px)
- [ ] Tablet responsive (768px)
- [ ] Mobile responsive (375px)
- [ ] All interactive elements keyboard accessible
- [ ] Screen reader announces chart data
- [ ] Color contrast ≥4.5:1 (WCAG AA)
- [ ] Initial render <300ms
- [ ] Chart update <100ms
- [ ] Memory usage <50MB

### Browser Compatibility
- [ ] Chrome 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Edge 90+
- [ ] Mobile Safari (iOS 14+)
- [ ] Chrome Mobile (Android 10+)

### Code Quality
- [ ] All functions have JSDoc comments
- [ ] No console errors or warnings
- [ ] Code follows project conventions
- [ ] Files properly organized in directories
- [ ] Version numbers incremented in script tags

---

## Risk Mitigation

### High-Risk Tasks
1. **Task 2.4** (Network Graph): D3.js integration complexity → Allow 4 hours, consider Chart.js bubble chart fallback
2. **Task 2.5** (Event Communication): Timing issues → Extensive testing with carousel navigation
3. **Task 3.1** (Responsive CSS): Layout breakage → Test early and often on real devices

### Contingency Plans
- If D3.js network graph takes >5 hours → Simplify to static layout (no force simulation)
- If Chart.js heatmap unavailable → Use HTML/CSS grid (already planned)
- If performance <requirements → Disable animations, use simpler chart types

---

## Success Metrics

**MVP Success** (Must achieve):
- ✅ All 4 visualization types implemented
- ✅ Charts update when carousel navigates
- ✅ Mobile responsive layout works
- ✅ No console errors

**Full Success** (Goal):
- ✅ All specifications met (RRC-001 through APN-004)
- ✅ Performance targets achieved (<300ms render)
- ✅ WCAG AA accessibility compliance
- ✅ Cross-browser compatibility verified

**Stretch Success** (Bonus):
- ⭐ User testing shows 80%+ find visualizations helpful
- ⭐ Chart export functionality (PNG/SVG)
- ⭐ Tutorial overlay explaining RPAIT dimensions
- ⭐ True semantic similarity via embedding API

---

## Timeline Summary

| Phase | Tasks | Time Estimate |
|-------|-------|---------------|
| Phase 1: Foundation | 5 tasks | 4-6 hours |
| Phase 2: Visualizations | 5 tasks | 10-14 hours |
| Phase 3: Polish | 6 tasks | 4-6 hours |
| **Total** | **16 tasks** | **18-24 hours** |

**Recommended Schedule** (3 working days):
- Day 1: Phase 1 (all) + Task 2.1-2.2
- Day 2: Task 2.3-2.5 + Task 3.1
- Day 3: Task 3.2-3.6

---

**End of Tasks Document**
