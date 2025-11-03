# Design Document - Redesign Heatmap Layout and Data

**Change ID**: `redesign-heatmap-layout-and-data`
**Date**: 2025-11-03

---

## Architecture Decisions

### Decision 1: Data Source - Artwork-Specific RPAIT vs Global Average

**Options considered**:
A. **Artwork-specific RPAIT** (Selected)
   - Use critique-level RPAIT scores for current artwork
   - Example: Su Shi's R score for artwork-1 is 7 (from critique data)

B. Global average RPAIT (Current)
   - Average all 4 artworks: R = (7+8+6+7)/4 = 7
   - Loses artwork-specific context

C. Weighted average by artwork importance
   - Could weight recent or featured artworks higher
   - Adds complexity without clear user benefit

**Decision**: **A - Artwork-specific RPAIT**

**Rationale**:
- **Context relevance**: Users are viewing a specific artwork, so similarity should reflect that artwork
- **Data richness**: We have per-artwork RPAIT in `critiques` array, why average it away?
- **Integration**: Enables carousel integration - heatmap updates when user navigates artworks
- **Insight depth**: Reveals how persona relationships differ across artworks

**Implementation**:
```javascript
// NEW: Get RPAIT for specific artwork
function getPersonaRPAITForArtwork(personaId, artworkId) {
  const critique = window.VULCA_DATA.critiques.find(c =>
    c.personaId === personaId && c.artworkId === artworkId
  );
  return critique ? critique.rpait : null;
}

// OLD: Get global average (to be replaced in heatmap)
function getPersonaAverageRPAIT(personaId) {
  const critiques = window.VULCA_DATA.critiques.filter(c => c.personaId === personaId);
  // ... averaging logic
}
```

---

### Decision 2: Dimension Similarity Formula

**Options considered**:

A. **Normalized score difference** (Selected for single dimension)
   - Formula: `similarity = 1 - |score1 - score2| / 10`
   - Example: Su Shi R7 vs Guo Xi R9 = 1 - |7-9|/10 = 0.8

B. Cosine similarity on single dimension
   - Treat single scores as 1D vectors
   - Formula: `cos(θ) = (a·b) / (|a||b|) = (7·9) / (√49·√81) = 0.952`
   - Problem: Always positive, less intuitive

C. Euclidean distance normalized
   - Formula: `similarity = 1 - |score1 - score2| / √200`
   - More complex, same result as option A

D. Percentile-based similarity
   - Compare ranks instead of absolute scores
   - Requires statistical distribution

**Decision**: **A - Normalized score difference** for single dimension, **cosine similarity** for 'all' dimensions

**Rationale**:
- **Intuitive**: "相差2分 = 0.8相似度" is easy to understand
- **Symmetric**: Same result regardless of order
- **Bounded**: Always in [0, 1] range
- **Consistent**: Matches user mental model of score proximity

**Implementation**:
```javascript
function calculateDimensionSimilarity(persona1Id, persona2Id, dimension, artworkId) {
  const rpait1 = getPersonaRPAITForArtwork(persona1Id, artworkId);
  const rpait2 = getPersonaRPAITForArtwork(persona2Id, artworkId);

  if (!rpait1 || !rpait2) return 0;

  if (dimension === 'all') {
    // 5D cosine similarity (unchanged)
    return rpaitCosineSimilarity(rpait1, rpait2);
  } else {
    // Single dimension: normalized difference
    const score1 = rpait1[dimension];
    const score2 = rpait2[dimension];
    return 1 - Math.abs(score1 - score2) / 10;
  }
}
```

---

### Decision 3: Dynamic Grid Sizing vs Fixed 6×6

**Options considered**:

A. **Dynamic N×N based on selected personas** (Selected)
   - 2 selected → 2×2 grid
   - 3 selected → 3×3 grid
   - 6 selected → 6×6 grid

B. Fixed 6×6 with disabled cells (Current)
   - Always show all 6 personas
   - Gray out unselected personas

C. Fixed 6×6 with filtering
   - Show all 6, but only highlight selected
   - Dim unselected personas

D. Responsive reflow
   - 2 personas → 1 row
   - 4 personas → 2×2 grid
   - 6 personas → 2×3 grid

**Decision**: **A - Dynamic N×N**

**Rationale**:
- **Focus**: Users want to compare selected personas, not see grayed-out noise
- **Clarity**: Larger cells when fewer personas selected = better readability
- **Consistency**: Matches radar and matrix behavior (only show selected)
- **Space efficiency**: Don't waste space on irrelevant data

**Trade-offs**:
- ✅ Pro: Better focus, larger cells
- ⚠️ Neutral: Grid reshapes on selection (acceptable with transitions)
- ❌ Con: Can't see unselected personas for reference (user can select more if needed)

---

### Decision 4: Axis Label Format

**Options considered**:

A. **Short Chinese names** (Selected)
   - Y-axis: Full Chinese name (苏轼)
   - X-axis: 2-character abbreviation or initial (苏、郭、罗、克、格、惠)
   - Full name in tooltip

B. Full Chinese + English (Current)
   - Y-axis: "苏轼 (Su Shi)"
   - Problem: Too long, causes overlap

C. Icons/Avatars
   - Use small profile images
   - Problem: No suitable images available

D. Color codes only
   - Use persona colors
   - Problem: Not accessible, requires legend

E. Initials only
   - Y-axis: "SS"
   - X-axis: "SS"
   - Problem: Loss of clarity (Greenberg and Gombrich both "G")

**Decision**: **A - Short Chinese names**

**Rationale**:
- **Readability**: Chinese names are 2-3 characters, fit well in rotated labels
- **Familiarity**: Users recognize Chinese names from other visualizations
- **No overlap**: Short labels prevent collision even at 45° rotation
- **Tooltip fallback**: Hover shows full bilingual name

**Implementation**:
```javascript
// Y-axis: Full Chinese name
yLabel.textContent = persona.nameZh;  // "苏轼"

// X-axis: First 2 characters
const shortName = persona.nameZh.slice(0, 2);  // "苏轼" → "苏"
// Or use full name if short enough
xLabel.textContent = persona.nameZh.length <= 3 ? persona.nameZh : shortName;
```

---

### Decision 5: Panel Size - Small vs Large

**Options considered**:

A. **Large panel** (`.viz-panel-large`) (Selected)
   - Same size as network graph
   - Spans 2 grid columns in desktop layout

B. Small panel (Current)
   - Same size as radar and matrix
   - 1 grid column

C. Medium panel
   - 1.5 grid columns
   - Custom size class

D. Full-width panel
   - Spans entire viewport width
   - Takes separate row

**Decision**: **A - Large panel**

**Rationale**:
- **Importance**: Heatmap shows N² data points, needs more space than radar (5 points) or matrix (N bars)
- **Consistency**: Large panel signals "this is a primary visualization"
- **Readability**: More space = larger cells = better visibility
- **Grid balance**: With large panel, layout is: [Radar + Matrix] [Heatmap] [Network Graph]

**CSS implementation**:
```css
.viz-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--spacing-lg);
}

.viz-panel {
  /* Standard panel */
}

.viz-panel-large {
  grid-column: span 2;  /* Spans 2 columns */
}

@media (max-width: 1024px) {
  .viz-panel-large {
    grid-column: span 1;  /* Full width on tablet/mobile */
  }
}
```

---

### Decision 6: Event Integration Strategy

**Options considered**:

A. **Event listeners on existing events** (Selected)
   - Listen to `persona-selected`, `dimension-change`, `visualization:update`
   - No new events needed

B. Polling state
   - Check selectedPersonas/currentDimension on interval
   - Problem: Inefficient, delay in updates

C. Shared state object
   - Create global `window.VISUALIZATION_STATE`
   - All visualizations read from it
   - Problem: Tight coupling, hard to debug

D. Pub-sub system
   - Implement custom event bus
   - Problem: Over-engineering for this scope

**Decision**: **A - Event listeners**

**Rationale**:
- **Simple**: Existing event system works well
- **Decoupled**: Heatmap doesn't need to know about persona-selector internals
- **Performant**: Events fire only on actual changes
- **Debuggable**: Can see events in DevTools

**Implementation**:
```javascript
// Listen to persona selector
window.addEventListener('persona-selected', (e) => {
  selectedPersonas = e.detail.selectedPersonas;
  renderHeatmap();
});

// Listen to dimension selector
document.getElementById('dimension-selector').addEventListener('change', (e) => {
  currentDimension = e.target.value;
  updateDimensionLabel();
  renderHeatmap();
});

// Listen to artwork carousel
window.addEventListener('visualization:update', (e) => {
  currentArtworkId = e.detail.artworkId;
  renderHeatmap();
});
```

---

### Decision 7: Empty State Handling

**Options considered**:

A. **Show message + quick actions** (Selected)
   ```
   请选择至少2位评论家以查看相似度矩阵
   [选择全部 (6)]  [选择3位]
   ```

B. Show grayed-out grid
   - Display 6×6 grid with disabled cells
   - Problem: Confusing visual state

C. Hide panel entirely
   - Remove from DOM when <2 personas
   - Problem: Jarring layout shift

D. Show default selection
   - Auto-select 3 personas if user deselects all
   - Problem: Takes away user control

**Decision**: **A - Message + quick actions**

**Rationale**:
- **Guidance**: Tells user exactly what to do
- **Convenience**: Quick-select buttons reduce friction
- **Clarity**: Empty state is intentional, not broken
- **Accessibility**: Screen readers announce the message

---

### Decision 8: Legend Adaptation

**Options considered**:

A. **Dynamic legend based on dimension** (Selected)
   - For single dimension: Show score difference ranges
     - "0.8-1.0: 相差0-2分"
   - For 'all' dimensions: Show similarity ranges
     - "0.8-1.0: 极高相似度"

B. Fixed legend (Current)
   - Always show viridis ranges
   - Problem: Doesn't explain dimension-specific meaning

C. No legend
   - Rely on tooltips only
   - Problem: Less discoverable

D. Dual legend
   - Show both score difference and similarity
   - Problem: Cluttered, confusing

**Decision**: **A - Dynamic legend**

**Rationale**:
- **Context-appropriate**: Legend explains what colors mean in current mode
- **Educational**: Helps users understand dimension similarity
- **Consistent**: Uses same viridis colors, just different labels

**Implementation**:
```javascript
function updateLegend(dimension) {
  const legendData = dimension === 'all' ? [
    { range: '0.0-0.2', label: '极低相似度', color: '#440154' },
    { range: '0.2-0.4', label: '低相似度', color: '#31688e' },
    // ...
  ] : [
    { range: '0.0-0.2', label: '相差8-10分', color: '#440154' },
    { range: '0.2-0.4', label: '相差6-8分', color: '#31688e' },
    // ...
  ];

  renderLegendItems(legendData);
}
```

---

## Data Flow Diagram

```
┌─────────────────┐
│ Persona Selector│──► persona-selected event
└─────────────────┘      │
                         │  detail: { selectedPersonas: ['su-shi', 'guo-xi'] }
                         │
┌─────────────────┐      │
│Dimension Selector│─────┼──► change event
└─────────────────┘      │      │  value: 'R' | 'P' | 'A' | 'I' | 'T' | 'all'
                         │      │
┌─────────────────┐      │      │
│Artwork Carousel │──────┼──────┼──► visualization:update event
└─────────────────┘      │      │      │  detail: { artworkId: 'artwork-1' }
                         │      │      │
                         ▼      ▼      ▼
                    ┌──────────────────────┐
                    │  Similarity Heatmap  │
                    │                      │
                    │  1. Filter to        │
                    │     selected personas│
                    │                      │
                    │  2. For each pair,   │
                    │     calculate        │
                    │     dimension-       │
                    │     specific         │
                    │     similarity using │
                    │     current artwork  │
                    │                      │
                    │  3. Render N×N grid  │
                    │     with viridis     │
                    │     colors           │
                    │                      │
                    │  4. Update title     │
                    │     and legend       │
                    └──────────────────────┘
```

---

## Calculation Examples

### Example 1: Single Dimension Similarity

**Context**:
- Artwork: artwork-1 (记忆)
- Dimension: R (Representation)
- Persona 1: Su Shi (苏轼) - R7
- Persona 2: Guo Xi (郭熙) - R8

**Calculation**:
```
similarity = 1 - |7 - 8| / 10
           = 1 - 1/10
           = 0.9
```

**Interpretation**: "苏轼和郭熙在《记忆》的写实性维度上相差1分，相似度为0.9"

### Example 2: All Dimensions Similarity

**Context**:
- Artwork: artwork-1
- Dimension: all
- Persona 1: Su Shi - RPAIT (7, 9, 8, 8, 7)
- Persona 2: Guo Xi - RPAIT (8, 8, 9, 7, 6)

**Calculation**:
```
v1 = [7, 9, 8, 8, 7]
v2 = [8, 8, 9, 7, 6]

dot = 7·8 + 9·8 + 8·9 + 8·7 + 7·6 = 56 + 72 + 72 + 56 + 42 = 298

|v1| = √(49 + 81 + 64 + 64 + 49) = √307 ≈ 17.52
|v2| = √(64 + 64 + 81 + 49 + 36) = √294 ≈ 17.15

similarity = 298 / (17.52 · 17.15) ≈ 0.99
```

**Interpretation**: "苏轼和郭熙在《记忆》的RPAIT整体评分非常相似（0.99）"

---

## Performance Considerations

### Rendering Performance

**Current**: 36 cells (6×6) render in ~20ms
**New**: 2-36 cells (2×2 to 6×6) render in ~5-30ms

**Optimization strategies**:
1. **Debounce events**: Wait 100ms after last persona-selected before re-rendering
2. **Cache calculations**: Store artwork-specific similarity matrices
3. **Incremental updates**: Only re-render changed cells (future optimization)

### Memory Usage

**Additional data structures**:
```javascript
// Cache artwork-specific similarity matrices
const similarityCache = {
  'artwork-1': {
    'all': { /* 6×6 matrix */ },
    'R': { /* 6×6 matrix */ },
    'P': { /* 6×6 matrix */ },
    // ...
  },
  // ... for each artwork
};
```

**Estimated size**: 4 artworks × 6 dimensions × 36 values × 8 bytes ≈ 7KB (negligible)

---

## Responsive Breakpoints

| Viewport | Panel Columns | Cell Size | Label Font |
|----------|---------------|-----------|------------|
| <768px   | 1 (full width)| 50×50px   | 10px       |
| 768-1024px | 1 (spans 1)  | 60×60px   | 12px       |
| 1024-1440px | 2 (spans 2) | 70×70px   | 12px       |
| >1440px  | 2 (spans 2)   | 80×80px   | 14px       |

---

## Accessibility Considerations

1. **Screen readers**: Announce current dimension and artwork in heatmap title
2. **Keyboard navigation**: Tab through cells, Escape to clear highlights
3. **Color independence**: Text values + tooltips don't rely on color alone
4. **Focus indicators**: Visible focus rings on cells and labels
5. **ARIA labels**: Update cell labels to include dimension context
   - Before: "苏轼 与 郭熙 的相似度: 0.9"
   - After: "苏轼 与 郭熙 在《记忆》写实性维度的相似度: 0.9"

---

## Testing Strategy

### Unit Tests (Conceptual)

```javascript
describe('calculateDimensionSimilarity', () => {
  it('returns 1.0 for identical scores in single dimension', () => {
    const result = calculateDimensionSimilarity('su-shi', 'su-shi', 'R', 'artwork-1');
    expect(result).toBe(1.0);
  });

  it('returns 0.9 for 1-point difference', () => {
    // Su Shi R7 vs Guo Xi R8
    const result = calculateDimensionSimilarity('su-shi', 'guo-xi', 'R', 'artwork-1');
    expect(result).toBe(0.9);
  });

  it('uses cosine similarity for all dimensions', () => {
    const result = calculateDimensionSimilarity('su-shi', 'guo-xi', 'all', 'artwork-1');
    expect(result).toBeGreaterThan(0.9);
  });
});
```

### Integration Tests

1. Select 2 personas → heatmap shows 2×2 grid
2. Select 6 personas → heatmap shows 6×6 grid
3. Change dimension to 'R' → similarity values update
4. Navigate to next artwork → similarity values update
5. Hover over cell → tooltip shows artwork + dimension context

---

## Migration Path

**From**: Global average similarity, 6×6 fixed grid
**To**: Artwork-specific, dimension-aware, dynamic N×N grid

**Steps**:
1. Keep old `getSimilarityMatrix()` for backward compatibility
2. Add new `getArtworkDimensionSimilarityMatrix(artworkId, dimension, personas)`
3. Update heatmap to use new function
4. Deprecate old function with console warning
5. Remove old function in next major version

---

**Decision record complete**: All major architectural choices documented with rationale
