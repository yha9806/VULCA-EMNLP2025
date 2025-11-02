# Design Document: Homepage Data Visualization Architecture

**Change ID**: `enrich-homepage-data-visualizations`
**Version**: 1.0
**Last Updated**: 2025-11-02

---

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Data Flow](#data-flow)
3. [Visualization Components](#visualization-components)
4. [Technical Decisions](#technical-decisions)
5. [Integration Points](#integration-points)
6. [Performance Strategy](#performance-strategy)
7. [Accessibility](#accessibility)

---

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Homepage (index.html)                     │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────┐           │
│  │  Gallery Hero Section (existing)             │           │
│  │  - Artwork Carousel                          │           │
│  │  - Critique Panels                           │           │
│  └──────────────────────────────────────────────┘           │
│                        ↓                                     │
│  ┌──────────────────────────────────────────────┐           │
│  │  Visualization Section (NEW)                 │           │
│  │  ┌────────────┐  ┌──────────────┐           │           │
│  │  │ RPAIT      │  │ Persona      │           │           │
│  │  │ Radar      │  │ Comparison   │           │           │
│  │  └────────────┘  └──────────────┘           │           │
│  │  ┌────────────┐  ┌──────────────┐           │           │
│  │  │ Similarity │  │ Network      │           │           │
│  │  │ Heatmap    │  │ Graph        │           │           │
│  │  └────────────┘  └──────────────┘           │           │
│  └──────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
         ↓                    ↓                    ↓
   ┌──────────┐      ┌──────────────┐      ┌──────────────┐
   │ Chart.js │      │ js/analysis  │      │ js/data.js   │
   │ Library  │      │ (compute)    │      │ (source)     │
   └──────────┘      └──────────────┘      └──────────────┘
```

### Module Structure

```
js/
├── analysis.js                    # Core computation module (NEW)
│   ├── calculateRPAITSimilarity()
│   ├── calculateRPAITDistance()
│   ├── getPersonaAverageRPAIT()
│   ├── getArtworkRPAITProfile()
│   └── buildSimilarityMatrix()
│
├── visualizations/                # Visualization components (NEW)
│   ├── rpait-radar.js            # Radar chart component
│   ├── persona-matrix.js          # Comparison matrix
│   ├── similarity-heatmap.js      # Semantic heatmap
│   └── network-graph.js           # Force-directed graph
│
├── data.js                        # Existing data (RPAIT scores)
├── carousel.js                    # Existing carousel (triggers updates)
└── gallery-hero.js                # Existing hero (may need event hooks)
```

---

## Data Flow

### Primary Data Sources

**1. RPAIT Scores (`js/data.js`)**
```javascript
// Existing structure
window.VULCA_DATA = {
  personas: [
    {
      id: "su-shi",
      rpait: { R: 7, P: 9, A: 8, I: 8, T: 7 }  // Average across all artworks
    },
    // ... 5 more personas
  ],
  critiques: [
    {
      artworkId: "artwork-1",
      personaId: "su-shi",
      rpait: { R: 7, P: 9, A: 8, I: 8, T: 6 }  // Specific to this artwork
    },
    // ... 23 more critiques (4 artworks × 6 personas)
  ]
}
```

**2. Computed Similarity Matrices (`js/analysis.js`)**
```javascript
// Generated on page load, cached
window.VULCA_ANALYSIS = {
  personaSimilarityMatrix: {
    // 6×6 matrix: personaId → personaId → similarity score (0-1)
    "su-shi": {
      "guo-xi": 0.92,      // High similarity (both focus on aesthetics)
      "john-ruskin": 0.65, // Medium similarity
      // ...
    },
    // ...
  },
  artworkRPAITProfiles: {
    // Average RPAIT across all personas for each artwork
    "artwork-1": { R: 7.2, P: 7.8, A: 7.5, I: 8.0, T: 6.5 }
    // ...
  }
}
```

### Data Flow Sequence

```
1. Page Load
   ↓
   Load VULCA_DATA (data.js)
   ↓
   Load analysis.js
   ↓
   Compute similarity matrices (analysis.init())
   ↓
   Cache results in window.VULCA_ANALYSIS
   ↓
   Initialize visualizations (all 4 components)
   ↓
   Render with artwork-1 as default

2. User Navigates Carousel
   ↓
   carousel.on('change', (newArtworkId) => {})
   ↓
   Update all visualizations with new artwork filter
   ↓
   Fetch artwork-specific RPAIT scores from VULCA_DATA.critiques
   ↓
   Re-render charts (Chart.js update() method)

3. User Clicks Persona
   ↓
   visualization.on('personaClick', (personaId) => {})
   ↓
   Highlight persona in all charts
   ↓
   Show detailed tooltip/modal with persona info
```

---

## Visualization Components

### 1. RPAIT Radar Chart (`rpait-radar.js`)

**Purpose**: Show multi-dimensional persona profiles visually

**Chart.js Configuration**:
```javascript
{
  type: 'radar',
  data: {
    labels: ['Representation', 'Philosophy', 'Aesthetic', 'Identity', 'Tradition'],
    datasets: [
      {
        label: 'Su Shi',
        data: [7, 9, 8, 8, 7],  // R, P, A, I, T
        backgroundColor: 'rgba(184, 92, 60, 0.2)',  // persona.color with alpha
        borderColor: '#B85C3C',
        borderWidth: 2
      },
      // ... up to 3 personas in comparison mode
    ]
  },
  options: {
    scales: {
      r: {
        min: 0,
        max: 10,
        ticks: { stepSize: 2 }
      }
    }
  }
}
```

**Interaction Modes**:
- **Single Mode**: Show one persona at a time (default)
- **Comparison Mode**: Overlay 2-3 personas (toggle button)
- **Artwork Filter**: Show persona's scores for current artwork only

**Responsive Behavior**:
- Desktop: 500×400px (fits 2 charts side-by-side)
- Tablet: 400×320px (stacks vertically)
- Mobile: 100% width, 280px height

---

### 2. Persona Comparison Matrix (`persona-matrix.js`)

**Purpose**: Compare personas across individual RPAIT dimensions

**Implementation Strategy**:
- **Chart Type**: Horizontal bar chart (Chart.js `type: 'bar'`)
- **Data Structure**: 5 datasets (one per dimension) × 6 bars (one per persona)

```javascript
{
  type: 'bar',
  data: {
    labels: ['Su Shi', 'Guo Xi', 'John Ruskin', /*...*/],
    datasets: [
      {
        label: 'Representation (R)',
        data: [7, 8, 6, 7, 8, 8],  // One value per persona
        backgroundColor: '#E8998D'
      },
      {
        label: 'Philosophy (P)',
        data: [9, 7, 8, 6, 7, 8],
        backgroundColor: '#A3A8C5'
      },
      // ... P, A, I, T
    ]
  },
  options: {
    indexAxis: 'y',  // Horizontal bars
    scales: {
      x: { min: 0, max: 10 }
    }
  }
}
```

**Toggle Options**:
- **Grouped Mode**: Show all 5 dimensions together (default)
- **Stacked Mode**: Stack dimensions per persona
- **Single Dimension Mode**: Filter to R, P, A, I, or T only

---

### 3. Semantic Similarity Heatmap (`similarity-heatmap.js`)

**Purpose**: Visualize critique similarity between personas

**Phase 1 Implementation** (RPAIT-based):
```javascript
// Calculate cosine similarity between RPAIT vectors
function rpaitCosineSimilarity(persona1, persona2) {
  const v1 = [persona1.R, persona1.P, persona1.A, persona1.I, persona1.T];
  const v2 = [persona2.R, persona2.P, persona2.A, persona2.I, persona2.T];

  const dot = v1.reduce((sum, val, i) => sum + val * v2[i], 0);
  const mag1 = Math.sqrt(v1.reduce((sum, val) => sum + val * val, 0));
  const mag2 = Math.sqrt(v2.reduce((sum, val) => sum + val * val, 0));

  return dot / (mag1 * mag2);  // Returns 0-1
}
```

**Rendering Approach**:
- **NOT using Chart.js** (no native heatmap type)
- **Custom HTML/CSS Grid**:
  ```html
  <div class="heatmap-grid">
    <div class="heatmap-cell" style="background: hsl(120, 70%, 75%)">
      0.92 <!-- Su Shi ↔ Guo Xi -->
    </div>
    <!-- ... 36 cells (6×6 matrix) -->
  </div>
  ```
- **Color Scale**: Green (high similarity) → Yellow (medium) → Red (low)
  - 0.9-1.0: `hsl(120, 70%, 75%)` (bright green)
  - 0.7-0.9: `hsl(60, 70%, 75%)` (yellow-green)
  - 0.5-0.7: `hsl(40, 70%, 75%)` (orange)
  - 0.0-0.5: `hsl(0, 70%, 75%)` (red)

**Interaction**:
- Hover: Tooltip shows `"Su Shi ↔ Guo Xi: 0.92 (High similarity)"`
- Click cell: Open modal with critique previews (side-by-side comparison)

---

### 4. Network Graph (`network-graph.js`)

**Purpose**: Explore artwork-persona relationships spatially

**Library Choice**: **D3.js v7 Force Simulation**
- Why not Chart.js? No native graph layout support
- Why D3? Industry standard for network graphs, 280KB gzipped
- Minimal import: `d3-force`, `d3-selection` only

**Graph Structure**:
```javascript
const nodes = [
  // 4 artwork nodes
  { id: 'artwork-1', type: 'artwork', radius: 40, color: '#667eea' },
  { id: 'artwork-2', type: 'artwork', radius: 40, color: '#11998e' },
  // ...

  // 6 persona nodes
  { id: 'su-shi', type: 'persona', radius: 25, color: '#B85C3C' },
  // ...
];

const links = [
  // Connect each artwork to each persona
  { source: 'artwork-1', target: 'su-shi', weight: 0.85 },  // RPAIT alignment
  // ... 24 links (4 artworks × 6 personas)
];
```

**Force Simulation Parameters**:
```javascript
d3.forceSimulation(nodes)
  .force('link', d3.forceLink(links).distance(d => 100 / d.weight))  // Stronger = closer
  .force('charge', d3.forceManyBody().strength(-300))  // Repulsion
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('collision', d3.forceCollide().radius(d => d.radius + 5));
```

**Interaction**:
- **Drag**: Nodes draggable (updates simulation)
- **Hover**: Highlight connected nodes + edges
- **Click Artwork**: Filter to show only that artwork's persona links
- **Click Persona**: Show RPAIT radar in sidebar

---

## Technical Decisions

### Decision 1: Client-Side Computation vs. Pre-Computed Data

**Options**:
- **A**: Pre-compute all matrices in Python, export to JSON
- **B**: Compute similarity matrices client-side in JavaScript
- **C**: Hybrid: Pre-compute complex metrics, compute simple ones client-side

**Decision**: **Option B (Client-Side)**

**Rationale**:
1. **Simplicity**: All data stays in `js/data.js`, no build step
2. **Flexibility**: Users can filter by artwork dynamically (e.g., "show similarity for artwork-1 only")
3. **Performance**: RPAIT vectors are small (6 personas × 5 dimensions = 30 values), cosine similarity is O(n²) = 36 operations
4. **Maintainability**: One source of truth (`data.js`), no sync issues

**Trade-off**: Cannot do true semantic similarity (requires embeddings) → Use RPAIT-based similarity as proxy for Phase 1

---

### Decision 2: Chart.js vs. D3.js vs. Plotly.js

| Library | Pros | Cons | Use Case |
|---------|------|------|----------|
| **Chart.js** | Already loaded, simple API, 280KB | Limited chart types (no heatmap/network) | Radar, bar charts ✅ |
| **D3.js** | Flexible, powerful, customizable | Steep learning curve, verbose | Network graph ✅ |
| **Plotly.js** | Rich statistical charts, 3D support | 3MB bundle size, overkill | ❌ Not needed |

**Decision**: **Chart.js + D3.js Hybrid**

**Rationale**:
- Chart.js handles 80% of needs (radar, bar)
- D3.js used only for network graph (import minimal modules: `d3-force`, `d3-selection`)
- Total overhead: 280KB (Chart.js) + 80KB (D3 minimal) = 360KB (acceptable)

---

### Decision 3: Heatmap Rendering Strategy

**Options**:
- **A**: Use Chart.js bubble chart (x=persona1, y=persona2, bubble size=similarity)
- **B**: Use D3.js heatmap (full control, custom rendering)
- **C**: Use HTML/CSS grid with colored divs

**Decision**: **Option C (HTML/CSS Grid)**

**Rationale**:
1. **Performance**: No canvas rendering overhead, pure CSS
2. **Accessibility**: Text values visible, screen reader friendly
3. **Simplicity**: No library dependency, easy to style
4. **Interactivity**: CSS `:hover` and click handlers easier than canvas events

**Implementation**:
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
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
  transition: transform 0.2s;
}

.heatmap-cell:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
```

---

### Decision 4: Event Communication Pattern

**Problem**: How do visualizations know when carousel changes artwork?

**Options**:
- **A**: Direct coupling (visualizations listen to DOM events on carousel)
- **B**: Event bus pattern (global `EventEmitter`)
- **C**: State management (React-style store)

**Decision**: **Option B (Event Bus)**

**Rationale**:
- **Decoupling**: Visualizations don't need to know about carousel internals
- **Simplicity**: Lightweight pattern, no framework overhead
- **Existing Pattern**: Project already uses event delegation (`js/eventDelegation.js`)

**Implementation**:
```javascript
// In carousel.js
window.addEventListener('artwork:change', (e) => {
  const { artworkId } = e.detail;
  // Update all visualizations
  window.dispatchEvent(new CustomEvent('visualization:update', {
    detail: { artworkId }
  }));
});

// In rpait-radar.js
window.addEventListener('visualization:update', (e) => {
  const { artworkId } = e.detail;
  updateRadarChart(artworkId);
});
```

---

## Integration Points

### 1. HTML Structure (index.html)

**Insert After** `<section class="gallery-nav">` (line ~137):

```html
<!-- DATA VISUALIZATION SECTION -->
<section class="visualization-section" id="visualization-section">
  <div class="container">
    <header class="viz-header">
      <h2>数据洞察 / Data Insights</h2>
      <p>探索评论家视角与作品之间的多维关系</p>
    </header>

    <div class="viz-grid">
      <!-- Panel 1: RPAIT Radar -->
      <div class="viz-panel" id="rpait-radar-panel">
        <h3>评论家维度分布</h3>
        <canvas id="rpait-radar-chart"></canvas>
        <div class="viz-controls">
          <button class="viz-btn" data-mode="single">单一模式</button>
          <button class="viz-btn active" data-mode="compare">对比模式</button>
        </div>
      </div>

      <!-- Panel 2: Persona Comparison -->
      <div class="viz-panel" id="persona-matrix-panel">
        <h3>评论家对比矩阵</h3>
        <canvas id="persona-matrix-chart"></canvas>
        <div class="viz-controls">
          <select id="dimension-selector">
            <option value="all">全部维度</option>
            <option value="R">Representation</option>
            <option value="P">Philosophy</option>
            <option value="A">Aesthetic</option>
            <option value="I">Identity</option>
            <option value="T">Tradition</option>
          </select>
        </div>
      </div>

      <!-- Panel 3: Similarity Heatmap -->
      <div class="viz-panel" id="similarity-heatmap-panel">
        <h3>语义相似度热力图</h3>
        <div id="similarity-heatmap"></div>
        <div class="viz-legend">
          <span>低相似度</span>
          <div class="legend-gradient"></div>
          <span>高相似度</span>
        </div>
      </div>

      <!-- Panel 4: Network Graph -->
      <div class="viz-panel viz-panel-large" id="network-graph-panel">
        <h3>作品-评论家关系网络</h3>
        <svg id="network-graph"></svg>
        <div class="viz-controls">
          <button class="viz-btn" data-action="reset">重置布局</button>
          <button class="viz-btn" data-action="export">导出PNG</button>
        </div>
      </div>
    </div>
  </div>
</section>
```

### 2. CSS Integration (styles/main.css)

**Add to** end of file:

```css
/* ==================== DATA VISUALIZATION SECTION ==================== */

.visualization-section {
  padding: var(--spacing-2xl) 0;
  background: linear-gradient(180deg, #f9f9f9 0%, #ffffff 100%);
}

.viz-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.viz-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-xl);
}

.viz-panel {
  background: white;
  border-radius: 12px;
  padding: var(--spacing-lg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.viz-panel-large {
  grid-column: 1 / -1;  /* Full width */
}

.viz-controls {
  margin-top: var(--spacing-md);
  display: flex;
  gap: var(--spacing-sm);
  justify-content: center;
}

.viz-btn {
  padding: 8px 16px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.viz-btn:hover {
  background: var(--color-bg-alt);
  transform: translateY(-1px);
}

.viz-btn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

/* Responsive */
@media (max-width: 768px) {
  .viz-grid {
    grid-template-columns: 1fr;
  }
}
```

### 3. Script Loading (index.html)

**Add Before** `<script src="/js/app.js">` (line ~275):

```html
<!-- Data Analysis Module -->
<script src="/js/analysis.js?v=1"></script>

<!-- Visualization Components -->
<script src="/js/visualizations/rpait-radar.js?v=1"></script>
<script src="/js/visualizations/persona-matrix.js?v=1"></script>
<script src="/js/visualizations/similarity-heatmap.js?v=1"></script>

<!-- D3.js for Network Graph (minimal modules) -->
<script src="https://cdn.jsdelivr.net/npm/d3-force@3"></script>
<script src="https://cdn.jsdelivr.net/npm/d3-selection@3"></script>
<script src="/js/visualizations/network-graph.js?v=1"></script>
```

---

## Performance Strategy

### 1. Lazy Loading

**Problem**: Visualizations below fold shouldn't block initial page load

**Solution**: Intersection Observer API

```javascript
// In app.js or visualization init script
const vizSection = document.getElementById('visualization-section');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // User scrolled to visualization section
      initializeVisualizations();
      observer.disconnect();  // Only initialize once
    }
  });
}, { rootMargin: '200px' });  // Start loading 200px before visible

observer.observe(vizSection);
```

### 2. Computation Caching

**Problem**: Re-calculating similarity matrices on every update is wasteful

**Solution**: Memoization

```javascript
// In analysis.js
const cache = {
  similarityMatrix: null,
  artworkProfiles: null
};

export function getSimilarityMatrix() {
  if (!cache.similarityMatrix) {
    cache.similarityMatrix = computeSimilarityMatrix();
  }
  return cache.similarityMatrix;
}
```

### 3. Chart Update Strategy

**Problem**: Re-creating Chart.js instances on every carousel change is slow

**Solution**: Use Chart.js `.update()` method

```javascript
// DON'T do this (slow):
chart.destroy();
chart = new Chart(ctx, config);

// DO this (fast):
chart.data.datasets[0].data = newData;
chart.update('none');  // 'none' = no animation, instant update
```

### 4. Debounced Resize

**Problem**: Window resize events fire dozens of times per second

**Solution**: Debounce handler

```javascript
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Re-render charts at new size
    updateAllChartDimensions();
  }, 250);
});
```

---

## Accessibility

### WCAG 2.1 AA Compliance

**1. Color Contrast**
- All text on colored backgrounds: minimum 4.5:1 ratio
- Heatmap cells include numerical values (not color-only)
- Patterns + colors for personas (e.g., Su Shi = solid, Guo Xi = striped)

**2. Keyboard Navigation**
- All interactive elements focusable via Tab
- Chart.js tooltips accessible via keyboard
- Network graph: Arrow keys to select nodes

**3. Screen Reader Support**
```html
<canvas id="rpait-radar-chart" role="img"
        aria-label="RPAIT radar chart showing Su Shi's scores: Representation 7, Philosophy 9, Aesthetic 8, Identity 8, Tradition 7">
</canvas>
```

**4. Accessible Data Tables** (Fallback)
```html
<details class="viz-fallback">
  <summary>View data as table (accessible format)</summary>
  <table>
    <caption>RPAIT Scores by Persona</caption>
    <thead>
      <tr><th>Persona</th><th>R</th><th>P</th><th>A</th><th>I</th><th>T</th></tr>
    </thead>
    <tbody>
      <tr><td>Su Shi</td><td>7</td><td>9</td><td>8</td><td>8</td><td>7</td></tr>
      <!-- ... -->
    </tbody>
  </table>
</details>
```

---

## Testing Strategy

### Unit Tests (Future)
```javascript
// analysis.test.js
describe('rpaitCosineSimilarity', () => {
  it('should return 1.0 for identical vectors', () => {
    const persona = { R: 7, P: 9, A: 8, I: 8, T: 7 };
    expect(rpaitCosineSimilarity(persona, persona)).toBe(1.0);
  });

  it('should return 0.0 for orthogonal vectors', () => {
    const p1 = { R: 10, P: 0, A: 0, I: 0, T: 0 };
    const p2 = { R: 0, P: 10, A: 0, I: 0, T: 0 };
    expect(rpaitCosineSimilarity(p1, p2)).toBe(0.0);
  });
});
```

### Integration Tests
1. Load page → Verify 4 visualization panels render
2. Click carousel next → Verify all charts update
3. Resize window → Verify charts maintain aspect ratio
4. Disable JavaScript → Verify fallback tables appear

### Visual Regression Tests (Future)
- Capture screenshots of each visualization
- Compare against baseline on CI

---

## Future Enhancements

### Phase 2b: True Semantic Similarity
- Integrate embedding API (BAAI/bge-large-zh-v1.5)
- Replace RPAIT-based similarity with actual critique embeddings
- Add "Compute Similarity" button (on-demand, not auto)

### Phase 3: Advanced Interactions
- Brushing & linking: Select personas in one chart, highlight in all
- Time-series: Show RPAIT evolution if multiple critique versions exist
- 3D network graph: Add depth dimension (requires Three.js)

### Phase 4: Export & Sharing
- Export all visualizations as publication-quality SVG
- Generate shareable URLs with visualization state (e.g., `?persona=su-shi&viz=radar`)
- PDF report generation (combine all charts)

---

## Appendix: Color Palette

```css
:root {
  /* Persona colors (from data.js) */
  --persona-su-shi: #B85C3C;
  --persona-guo-xi: #5D8AA8;
  --persona-ruskin: #8B7355;
  --persona-okakura: #A8C5A8;
  --persona-thorne: #6B5B95;
  --persona-zola: #D2691E;
  --persona-petrova: #8B8B83;
  --persona-thomas: #9D8B7C;

  /* Dimension colors */
  --rpait-r: #E8998D;  /* Representation - coral */
  --rpait-p: #A3A8C5;  /* Philosophy - lavender */
  --rpait-a: #B8D8BE;  /* Aesthetic - mint */
  --rpait-i: #F4C2C2;  /* Identity - pink */
  --rpait-t: #D4A574;  /* Tradition - tan */

  /* Heatmap gradient */
  --heatmap-low: hsl(0, 70%, 75%);    /* Red */
  --heatmap-mid: hsl(40, 70%, 75%);   /* Orange */
  --heatmap-high: hsl(120, 70%, 75%); /* Green */
}
```

---

**End of Design Document**
