# Implementation Tasks - Complete Advanced Features

**Total Estimated Effort:** 200-240 hours (3-4 weeks at 60h/week)

---

## Phase 3: Layer 2 Physics Engine (40-50 hours)

### Task 3.1: Cursor Tracking System
- [ ] Add cursor position tracking to InteractionManager
  - `tracking.js` - Track pointer position globally
  - Update position on every `mousemove` / `touchmove`
  - Handle edge cases (window blur, touches)
- [ ] Create cursor position API accessible to particle systems
  - Expose `getCursorPosition()` method
  - Add `onCursorMove()` callback
- [ ] Add visual cursor indicator (optional glow effect)
- **Validation:** Cursor position logged to console, matches pointer location
- **Time:** 6-8 hours

### Task 3.2: Attraction Force Calculation
- [ ] Implement inverse-square-law attraction in ParticleSystem
  - For each particle, calculate distance to cursor
  - Apply force = G / (distance²)
  - Cap effective range at ~300px
  - Add acceleration to particle velocity
- [ ] Tune G constant for feel
  - Start with G = 5000, adjust based on feel
  - Create config: `CURSOR_ATTRACTION_STRENGTH`
- [ ] Add damping to prevent runaway particles
  - velocity *= 0.98 per frame
  - Optional: friction coefficient
- **Validation:** Particles visibly attracted to cursor, smooth motion
- **Time:** 8-10 hours

### Task 3.3: Wind Field Generation
- [ ] Integrate Perlin noise library
  - Use `SimplexNoise` or `Noise.js` from npm
  - Or implement 2D Perlin from scratch (educational)
- [ ] Generate wind field for particles
  - For each particle: `windX = Perlin(x/scale, y/scale, time)`
  - Apply wind force to particles
  - Vary strength with mouse proximity (optional)
- [ ] Tune wind field parameters
  - Scale factor (how zoomed-in the noise is)
  - Strength multiplier (force magnitude)
  - Time progression speed
- [ ] Create visual test (particles follow wind)
- **Validation:** Wind patterns visible, continuous flow
- **Time:** 8-10 hours

### Task 3.4: Trail Rendering System
- [ ] Create ParticleTrail class
  - Store last N particle positions (10-20)
  - Update trail on each particle move
- [ ] Render trails in PixiJS
  - Draw line segments connecting trail points
  - Fade alpha from old (faint) to new (bright)
  - Use graphics.lineStyle for trails
- [ ] Optimize trail rendering
  - Reuse graphics objects (don't create new each frame)
  - Consider instancing if many trails
- **Validation:** Trails visible when dragging, fades smoothly
- **Time:** 8-10 hours

### Task 3.5: Physics Integration Test
- [ ] Create test scene with all physics features active
- [ ] Verify cursor tracking + attraction + wind + trails work together
- [ ] Profile performance (target: 1920 particles at 24+ FPS)
- [ ] Record demo video of Layer 2 in action
- [ ] Gather metrics (CPU%, memory, FPS graph)
- **Validation:** All physics working, performance acceptable
- **Time:** 4-6 hours

---

## Phase 4: RPAIT Visualization System (50-70 hours)

### Task 4.1: Chart Library Integration
- [ ] Choose and integrate chart library
  - Install Chart.js (npm install chart.js)
  - Or use CDN version
- [ ] Create ChartManager class
  - Handles chart creation, updating, destroying
  - Wraps Chart.js API
- [ ] Setup chart canvas in HTML
  - Add canvas element to right sidebar
  - Size appropriately (400×400px or responsive)
- [ ] Test basic rendering
- **Validation:** Empty chart renders without errors
- **Time:** 6-8 hours

### Task 4.2: Radar Chart Implementation
- [ ] Implement radar chart rendering
  - Data format: { R: 7, P: 9, A: 8, I: 8, T: 6 }
  - Labels: Representation, Philosophy, Aesthetics, Interpretation, Technique
- [ ] Style radar chart
  - Color: persona color
  - Fill: semi-transparent
  - Border: solid line
  - Grid: subtle background
- [ ] Create chart update function
  - When user selects different artwork/persona
  - Chart updates instantly
- [ ] Add tooltip with exact values
- **Validation:** Radar chart renders correctly, values match data
- **Time:** 10-12 hours

### Task 4.3: Comparison View
- [ ] Extend radar chart to show multiple datasets
  - Support 2-4 personas simultaneously
  - Different colors per persona
  - Legend showing which line is which
- [ ] Create UI to select personas for comparison
  - Checkboxes or toggle buttons
  - "Add persona to comparison" interaction
  - "Remove persona" interaction
- [ ] Calculate dimension differences
  - Show Delta table (Persona A vs B)
  - Highlight largest differences
- [ ] Animate chart transitions
  - Smooth transition when adding/removing datasets
- **Validation:** Can compare 2-3 personas, differences calculated
- **Time:** 12-15 hours

### Task 4.4: Dimension Heatmap
- [ ] Create heatmap view (alternate to radar)
  - X-axis: dimensions (R, P, A, I, T)
  - Y-axis: personas
  - Color intensity: score 0-10
- [ ] Implement heatmap rendering
  - Use canvas or SVG
  - Color scale: white (0) → dark (10)
- [ ] Make heatmap interactive
  - Hover shows exact values
  - Click dimension to filter search
- **Validation:** Heatmap shows correct colors, all scores visible
- **Time:** 10-12 hours

### Task 4.5: Data Export Function
- [ ] Implement JSON export
  - Export current selection (artwork, personas, dimensions)
  - Format: pretty-printed JSON
- [ ] Implement CSV export
  - Tabular format suitable for Excel
  - Headers: Persona, Artwork, R, P, A, I, T, Full Critique
- [ ] Create export UI
  - "Download JSON" and "Download CSV" buttons
  - Show preview before download
- [ ] Test exports
- **Validation:** Files download correctly, data complete
- **Time:** 8-10 hours

### Task 4.6: Visualization Testing
- [ ] Create test cases for all chart types
- [ ] Test on mobile (responsive)
- [ ] Test accessibility (keyboard nav, screen reader)
- [ ] Performance test (rendering speed with large datasets)
- **Validation:** All charts render, mobile-responsive, accessible
- **Time:** 4-6 hours

---

## Phase 5: Content Interaction System (60-80 hours)

### Task 5.1: Search System Implementation
- [ ] Create search index at startup
  - Pre-compute keyword index
  - Index by persona, artwork, dimension, text
- [ ] Implement search function
  - Tokenize user query
  - Search indices
  - Rank results by relevance
  - Return top 20 matches
- [ ] Create search UI
  - Input box with real-time search
  - Results list showing matches
  - Show snippet of matching text
- [ ] Add search filters
  - Filter by persona
  - Filter by artwork
  - Filter by score range
- **Validation:** Search finds correct critiques, ranking makes sense
- **Time:** 10-12 hours

### Task 5.2: Advanced Filtering System
- [ ] Create filter UI component
  - Persona checkboxes
  - Artwork checkboxes
  - Dimension dropdowns
  - Score range slider
- [ ] Implement filter logic
  - Apply all filters to critique list
  - Show count of matching results
  - Update results real-time as filters change
- [ ] Combine search + filters
  - Search within filtered results (or vice versa)
  - Show combined result count
- [ ] Filter state management
  - Remember current filters
  - Display active filters clearly
  - "Clear all filters" button
- **Validation:** Filters work independently and together
- **Time:** 10-12 hours

### Task 5.3: Bookmark System
- [ ] Implement localStorage-backed bookmark manager
  - BookmarkManager class
  - CRUD operations (create, read, update, delete)
- [ ] Create bookmark UI
  - "Bookmark this critique" button
  - Visual indicator when bookmarked
  - Bookmark list in sidebar
- [ ] Bookmark persistence
  - Auto-save to localStorage
  - Auto-load on page refresh
  - Handle localStorage quota exceeded
- [ ] Bookmark management
  - Edit bookmark notes/tags
  - Delete bookmarks
  - Export bookmarks as JSON
- [ ] Add bookmark filtering
  - Show only bookmarked critiques
  - Search within bookmarks
- **Validation:** Bookmarks persist across sessions, CRUD works
- **Time:** 10-12 hours

### Task 5.4: Comparison View
- [ ] Create comparison UI layout
  - Side-by-side critique display
  - Difference highlighting
  - Dimension comparison table
- [ ] Implement comparison logic
  - Select 2 critiques to compare
  - Calculate differences (delta)
  - Highlight where they diverge
- [ ] Add comparison navigation
  - "Next comparison" button
  - "Previous comparison" button
  - Compare another persona (keep artwork fixed)
- [ ] Compare visuals (RPAIT scores)
  - Show radar charts side-by-side
  - Highlight dimensional differences
- **Validation:** Can compare any 2 critiques, differences clear
- **Time:** 10-12 hours

### Task 5.5: Sharing System
- [ ] Implement state serialization
  - Encode current selections as compact string
  - Use Base64 or URL-safe encoding
- [ ] Create share URL generator
  - Generate URL with state parameter
  - Make URLs human-readable length (<100 chars)
- [ ] Create share UI
  - "Copy Share Link" button
  - QR code generator (optional)
  - Social media share templates
- [ ] Implement share link loading
  - Parse URL parameter on page load
  - Apply saved state (filters, selections)
  - Show "Shared by" indicator
- [ ] Test sharing
  - Share link opens in incognito browser
  - Verify state accurately restored
- **Validation:** Share links work, state perfectly reproduced
- **Time:** 10-12 hours

### Task 5.6: Navigation & Discovery
- [ ] Create breadcrumb trail
  - Show: Home > Artwork > Persona > Critique
  - Each level clickable
- [ ] Create content map / overview
  - Visual grid of all artwork × persona combinations
  - Show current selection
  - Click to jump to different content
- [ ] Add "Related Content" suggestions
  - Show other critiques by same persona
  - Show other personas for same artwork
  - Show similar RPAIT profiles
- [ ] Create browsing history
  - Auto-track viewed critiques
  - Show recent critiques in sidebar
  - Allow clearing history
- **Validation:** Navigation clear, discovery aids useful
- **Time:** 8-10 hours

### Task 5.7: Integration Testing
- [ ] Test all interaction systems together
  - Search + filters + comparison
  - Bookmarks + sharing
  - Navigation between views
- [ ] Cross-browser testing
  - Chrome, Firefox, Safari, Edge
- [ ] Mobile testing
  - iPhone, Android
  - Touch interactions
  - Responsive layout
- [ ] Accessibility testing
  - Keyboard navigation entire flow
  - Screen reader with Search view
  - Focus visible everywhere
- [ ] Performance testing
  - 100 bookmarks loaded
  - Search across all 24 critiques
  - Comparison with high-res charts
- **Validation:** All systems work together, responsive, accessible
- **Time:** 8-10 hours

---

## Cross-Phase Tasks

### Code Quality & Testing
- [ ] Unit tests for physics calculations
  - Test attraction force formula
  - Test wind field generation
  - Test velocity damping
- [ ] Unit tests for visualization
  - Test RPAIT score transformation
  - Test chart data format
- [ ] Unit tests for search/filter
  - Test search ranking
  - Test filter combinations
- [ ] Integration tests
  - Physics + rendering
  - Charts + interaction
  - Search + filters + bookmarks

### Documentation
- [ ] Update inline code comments
- [ ] Create user guide for new features
- [ ] Document physics parameters (tunable values)
- [ ] Document chart API
- [ ] Document search query syntax

### Performance Optimization
- [ ] Profile and optimize physics engine
  - Target: 1920 particles @ 60fps (or acceptable 24-30fps)
  - Identify bottlenecks
- [ ] Optimize chart rendering
  - Throttle updates
  - Use OffscreenCanvas if available
- [ ] Optimize search
  - Use Web Workers if needed
  - Implement debouncing

### Accessibility Review
- [ ] WCAG 2.1 AA compliance audit
- [ ] Keyboard navigation review
- [ ] Screen reader testing
- [ ] Color contrast verification

---

## Deliverables Checklist

### Phase 3 Deliverable
- [ ] Layer 2 physics working (cursor, attraction, wind, trails)
- [ ] Physics demo video
- [ ] Performance metrics document

### Phase 4 Deliverable
- [ ] RPAIT visualization system (radar, comparison, heatmap)
- [ ] Chart demo screenshots
- [ ] Data export working

### Phase 5 Deliverable
- [ ] Search + filtering
- [ ] Bookmarks system
- [ ] Comparison view
- [ ] Sharing links
- [ ] Navigation helpers

### Final Deliverable
- [ ] All tests passing
- [ ] Accessibility audit passed
- [ ] Performance benchmarks met
- [ ] Documentation complete
- [ ] Feature demo video
- [ ] Archive change in OpenSpec

---

## Timeline

```
Week 1: Phase 3 (Physics)
├─ Mon-Wed: Cursor tracking + attraction
├─ Thu: Wind field
└─ Fri: Trails + integration testing

Week 2: Phase 4 (Visualization)
├─ Mon: Chart library integration
├─ Tue-Wed: Radar chart
├─ Thu: Comparison + heatmap
└─ Fri: Export + testing

Week 3: Phase 5a (Interaction - Search/Filter)
├─ Mon: Search system
├─ Tue: Filtering
├─ Wed: Integration test
└─ Thu-Fri: Buffer/optimization

Week 4: Phase 5b (Interaction - Bookmarks/Sharing)
├─ Mon: Bookmarks
├─ Tue: Sharing
├─ Wed: Comparison view
├─ Thu: Navigation
└─ Fri: Final testing + archive

Total: 4 weeks / 200-240 hours
```

---

## Success Metrics

By completion, the platform will have:

- ✅ 3 fully-implemented interaction layers (Layer 1, 2, 3)
- ✅ Interactive RPAIT visualization (4 chart types)
- ✅ Complete content discovery (search, filters, bookmarks)
- ✅ Sharing capability (reproducible state)
- ✅ 100% of originally planned features implemented
- ✅ >95% test coverage
- ✅ WCAG 2.1 AA accessibility
- ✅ Mobile-responsive design
- ✅ Performance: 1920 particles @ 24+ FPS

**Project completion:** From 25% to 100% ✅

