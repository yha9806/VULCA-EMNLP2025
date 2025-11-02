# Proposal: Enrich Homepage Data Visualizations

**Change ID**: `enrich-homepage-data-visualizations`
**Status**: Proposed
**Created**: 2025-11-02
**Author**: Claude Code

---

## Problem Statement

### Current State
The VULCA exhibition homepage (`index.html`) currently presents artwork and critiques in a **linear, text-heavy format**:
- Upper section: Gallery hero with artwork carousel and critique panels (recently enhanced with multi-image support)
- **Lower section: EMPTY/PLACEHOLDER** - no visualizations to help users understand the rich analytical data
- Chart.js library is already loaded (`chart.js@4.4.0`) but unused on homepage
- Visualization container exists in markup but remains unpopulated (`<section class="visualization-container">`)

### Gap Analysis
The project contains **extensive analytical capabilities** in `src/analyze.py`:
- **RPAIT dimension scoring** (R/P/A/I/T) - 5 dimensions × 6 personas × 4 artworks = 120 data points
- **Semantic similarity calculations** using BAAI/bge-large-zh-v1.5 embeddings
- **Earth Mover's Distance (EMD)** for critique distribution analysis
- **Diversity and coherence metrics** for persona groups
- **Persona profile alignment scores**

However, **none of this rich data is visualized on the homepage**. Users cannot:
1. Compare personas across RPAIT dimensions visually
2. See semantic relationships between critiques
3. Understand artwork-persona connections at a glance
4. Explore data-driven insights into critical diversity

### User Impact
Without visualizations, users miss:
- **Discovery**: "Which personas share similar perspectives?"
- **Comparison**: "How does Su Shi's aesthetic (A) score differ from Ruskin's?"
- **Patterns**: "Do certain artworks elicit more philosophical (P) critiques?"
- **Context**: "What is the semantic diversity of responses to this artwork?"

---

## Proposed Solution

### What Changes

Add **4 interactive visualization panels** to the homepage lower section:

1. **RPAIT Radar Charts** (Spider/Polar charts)
   - One chart per persona showing R/P/A/I/T distribution
   - Overlay mode to compare multiple personas
   - Highlight active artwork's RPAIT scores vs. persona averages

2. **Persona Comparison Matrix**
   - Heatmap showing RPAIT similarity between personas
   - Bar charts comparing personas across individual dimensions
   - Toggle between absolute scores and relative differences

3. **Semantic Similarity Heatmap**
   - 6×6 matrix showing critique semantic similarity (persona × persona)
   - Filter by artwork to see artwork-specific patterns
   - Color-coded by similarity score (0-1 scale)

4. **Artwork-Persona Network Graph**
   - Interactive force-directed graph
   - Nodes: artworks (large) + personas (medium)
   - Edges: weighted by RPAIT alignment or semantic similarity
   - Hover to see detailed scores

### Why

**Business Goals**:
- **Increase engagement**: Visual exploration encourages longer session times
- **Demonstrate research depth**: EMNLP 2025 publication showcases analytical rigor
- **Enable discovery**: Users find insights they wouldn't discover through text alone
- **Educational value**: Visualizations teach RPAIT framework intuitively

**Technical Goals**:
- **Leverage existing data**: `js/data.js` already contains all RPAIT scores
- **Reuse computation**: Port `src/analyze.py` logic to JavaScript for client-side calculation
- **Maintain performance**: Use Chart.js (already loaded) for rendering
- **Responsive design**: All charts adapt to mobile/tablet/desktop

**User Goals**:
- **Quick comprehension**: "Show me persona differences in 5 seconds"
- **Deep exploration**: "Let me drill into specific dimension comparisons"
- **Multi-modal learning**: Visual + textual content reinforces understanding

### How

**Phase 1: Foundation (Data & Architecture)**
1. Create `js/analysis.js` - Port key functions from `src/analyze.py`:
   - `calculateRPAITSimilarity(persona1, persona2)` - Cosine similarity on R/P/A/I/T vectors
   - `calculateSemanticSimilarity(critique1, critique2)` - Placeholder (future: use embedding API)
   - `getPersonaAverageRPAIT(personaId)` - Average across all artworks
   - `getArtworkRPAITProfile(artworkId)` - Average across all persona critiques

2. Create `js/visualizations/` directory structure:
   ```
   js/visualizations/
   ├── rpait-radar.js       // Radar chart component
   ├── persona-matrix.js    // Comparison matrix
   ├── similarity-heatmap.js // Semantic heatmap
   └── network-graph.js     // Force-directed graph
   ```

3. Update `index.html`:
   - Add visualization container after gallery-nav section
   - Load Chart.js (already present) and new visualization scripts
   - Add HTML structure for 4 visualization panels

**Phase 2: Visualization Implementation**
1. **RPAIT Radar Charts** (`rpait-radar.js`):
   - Use Chart.js `type: 'radar'`
   - Data from `VULCA_DATA.personas[].rpait`
   - Interactive: click persona card to update radar
   - Show comparison mode (overlay 2-3 personas)

2. **Persona Comparison Matrix** (`persona-matrix.js`):
   - Use Chart.js `type: 'bar'` (horizontal bars)
   - Calculate RPAIT distance matrix (6×6)
   - Render heatmap using CSS grid + color scales
   - Add dimension selector (R/P/A/I/T/ALL)

3. **Semantic Similarity Heatmap** (`similarity-heatmap.js`):
   - **Phase 2a**: Use RPAIT-based similarity (immediate)
   - **Phase 2b**: Add true semantic similarity via embedding API (future)
   - Render 6×6 grid with color gradients
   - Interactive: hover shows exact scores + critique preview

4. **Artwork-Persona Network** (`network-graph.js`):
   - Use D3.js force-directed layout (add library)
   - Nodes: 4 artworks + 6 personas
   - Edge thickness = RPAIT alignment score
   - Interactive: drag nodes, click to filter connections

**Phase 3: Polish & Responsiveness**
1. CSS styling in `styles/main.css`:
   - Grid layout for visualization panels
   - Responsive breakpoints (mobile stacks vertically)
   - Consistent color scheme with existing design
   - Smooth transitions and hover states

2. Interaction patterns:
   - Gallery carousel navigation updates all visualizations
   - Click persona name to filter/highlight in charts
   - Toggle buttons to switch between view modes
   - Export visualization as PNG (Chart.js built-in)

3. Performance optimization:
   - Lazy-load visualizations below fold
   - Cache computed similarity matrices
   - Debounce resize events
   - Use Chart.js animations sparingly

---

## Verification Methods

### Functional Verification
1. **Data Accuracy**:
   - ✓ RPAIT scores match `js/data.js` values exactly
   - ✓ Similarity calculations match `src/analyze.py` output (within 0.01 tolerance)
   - ✓ All 6 personas appear in all visualizations

2. **Interaction**:
   - ✓ Carousel navigation updates visualization state
   - ✓ Persona selection filters/highlights correctly
   - ✓ Hover tooltips show accurate data
   - ✓ Mobile touch interactions work smoothly

3. **Visual Quality**:
   - ✓ Charts render without distortion on all screen sizes
   - ✓ Color scheme matches existing brand (check `main.css` variables)
   - ✓ Text labels are readable (WCAG AA contrast)
   - ✓ Animations complete in <300ms

### Cross-Browser Testing
- Chrome 90+ (primary target)
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

### Performance Benchmarks
- Initial render: <500ms (Chart.js + data processing)
- Interaction response: <100ms (update single chart)
- Full redraw: <200ms (switch artwork in carousel)
- Memory: <50MB for all charts combined

---

## Dependencies

### New Dependencies
- **D3.js v7** (for network graph only) - 280KB gzipped
  - Alternative: Use Chart.js bubble chart (less expressive but smaller)

### Existing Dependencies
- ✅ Chart.js 4.4.0 (already loaded)
- ✅ `js/data.js` (contains all RPAIT scores)
- ✅ `js/carousel.js` (provides artwork navigation events)

### Future Dependencies (Phase 2b+)
- Embedding API for true semantic similarity (optional enhancement)
- Plotly.js for 3D visualizations (if network graph needs upgrade)

---

## Impact Analysis

### Scope
- **Files Modified**: 5-7
  - `index.html` (+40 lines: visualization container)
  - `styles/main.css` (+200 lines: visualization styles)
  - `js/analysis.js` (NEW: ~300 lines)
  - `js/visualizations/*.js` (NEW: 4 files, ~800 lines total)

- **Files Created**: 5
  - 1 analysis module + 4 visualization components

### Breaking Changes
- **None**: All changes are additive
- Existing carousel and critique panels remain unchanged
- Chart.js library already loaded (no new external dependency risk)

### Migration Path
- No migration needed (new feature, not replacement)
- Fallback: If Chart.js fails to load, show static RPAIT tables

---

## Alternatives Considered

### Alternative A: Static PNG Images
- **Pros**: No JavaScript complexity, fast loading
- **Cons**: Not interactive, not data-driven, requires manual updates
- **Decision**: ❌ Rejected - loses core value of dynamic exploration

### Alternative B: Server-Side Rendering (Python + Matplotlib)
- **Pros**: Reuse existing `src/analyze.py` code exactly
- **Cons**: Requires server (GitHub Pages is static), no interactivity
- **Decision**: ❌ Rejected - violates static-site architecture

### Alternative C: Minimal Text Tables
- **Pros**: Accessible, simple, no libraries
- **Cons**: Not visually engaging, hard to spot patterns
- **Decision**: ✅ Partial adoption - add as fallback for non-JS users

### Alternative D: Use Plotly.js Instead of Chart.js
- **Pros**: More visualization types (3D, statistical)
- **Cons**: 3MB library (vs. Chart.js 280KB), overkill for needs
- **Decision**: ❌ Rejected - Chart.js sufficient for Phase 1-2

### Selected Approach
**Chart.js + Custom D3.js Network** (Hybrid):
- Chart.js for standard charts (radar, bar, heatmap)
- Lightweight D3.js module for network graph only
- Total overhead: ~350KB (acceptable for feature richness)

---

## Success Criteria

### MVP (Minimum Viable Product)
1. ✅ RPAIT radar chart displays all 6 personas correctly
2. ✅ Persona comparison matrix shows dimension bars
3. ✅ Charts update when carousel navigation occurs
4. ✅ Mobile layout stacks visualizations vertically
5. ✅ No console errors, all data validates

### Full Success
1. ✅ All 4 visualization types implemented and interactive
2. ✅ Semantic similarity heatmap shows RPAIT-based scores
3. ✅ Network graph renders with smooth force simulation
4. ✅ User testing: 80% find visualizations "helpful" or "very helpful"
5. ✅ Performance: All charts render in <500ms on mid-range hardware

### Stretch Goals (Future Phases)
1. ⭐ True semantic similarity via embedding API
2. ⭐ Export all visualizations as publication-ready SVG
3. ⭐ Add tutorial overlay explaining RPAIT dimensions
4. ⭐ Implement graph layout presets (circular, hierarchical)

---

## Timeline Estimate

- **Phase 1** (Foundation): 4-6 hours
  - Create `js/analysis.js` (2h)
  - Set up visualization structure (1h)
  - Update HTML/CSS containers (1h)
  - Testing & debugging (1-2h)

- **Phase 2** (Visualizations): 8-12 hours
  - RPAIT radar charts (2h)
  - Persona comparison matrix (3h)
  - Similarity heatmap (2h)
  - Network graph (3-4h)
  - Testing & refinement (2h)

- **Phase 3** (Polish): 4-6 hours
  - Responsive CSS (2h)
  - Interaction polish (1h)
  - Performance optimization (1h)
  - Cross-browser testing (1-2h)

**Total**: 16-24 hours (2-3 full working days)

---

## Risks & Mitigations

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Chart.js version incompatibility | Low | Medium | Pin to 4.4.0, test thoroughly |
| D3.js bundle size too large | Medium | Low | Use minimal D3 modules only, or fallback to Chart.js bubble |
| Mobile performance issues | Medium | High | Lazy-load below fold, use CSS transforms |
| Semantic similarity API fails | High | Medium | Start with RPAIT-based similarity (no API needed) |

### UX Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Charts confuse users | Medium | High | Add legend + tooltip explanations, tutorial mode |
| Too much visual clutter | Low | Medium | Progressive disclosure: show 1-2 charts by default |
| Color-blind accessibility | Low | High | Use patterns + colors, test with simulators |

### Project Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Timeline overrun | Medium | Low | Phase 1 & 2 deliver value independently |
| Scope creep | High | Medium | Strict adherence to 4 visualization types only |
| Maintenance burden | Low | Medium | Use well-documented libraries, add inline comments |

---

## Approval Checklist

- [ ] Proposal reviewed by stakeholders
- [ ] Design document created (`design.md`)
- [ ] Spec deltas written for each visualization
- [ ] Tasks broken down with time estimates
- [ ] Validation passed (`openspec validate --strict`)
- [ ] Implementation ready to begin

---

## References

- **Source Code**:
  - `src/analyze.py` - Original Python semantic analysis
  - `js/data.js` - RPAIT data source
  - `pages/critics.html` - Existing RPAIT dimension display

- **Libraries**:
  - [Chart.js Documentation](https://www.chartjs.org/docs/4.4.0/)
  - [D3.js Force Layout](https://d3js.org/d3-force)

- **Related Changes**:
  - `implement-multi-image-artwork-series` (archived) - Carousel foundation
  - `art-centric-immersive-redesign` - Overall homepage structure

- **Design References**:
  - RPAIT framework (project.md lines 168-179)
  - Persona definitions (js/data.js lines 130-217)
