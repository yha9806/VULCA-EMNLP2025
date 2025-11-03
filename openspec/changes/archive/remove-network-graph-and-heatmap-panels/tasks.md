# Tasks - Remove Network Graph and Similarity Heatmap Panels

**Change ID**: `remove-network-graph-and-heatmap-panels`
**Estimated Total Time**: 55 minutes

---

## Phase 1: Remove Similarity Heatmap (30 minutes)

### Task 1.1: Remove Heatmap HTML Panel (5 min)

**File**: `index.html`

**Action**: Delete lines 182-197 (entire heatmap panel)

**Delete this block**:
```html
<!-- Panel 3: Similarity Heatmap -->
<div class="viz-panel viz-panel-large" id="similarity-heatmap-panel">
  <h3>评论家相似度矩阵 · 当前维度: <span id="heatmap-dimension-label">全部维度</span></h3>
  <div class="heatmap-container">
    <div class="heatmap-corner"></div>
    <div class="heatmap-x-labels"></div>
    <div class="heatmap-y-labels"></div>
    <div id="similarity-heatmap" class="heatmap-matrix"></div>
  </div>
  <div class="heatmap-legend" role="legend">
    <div class="legend-title">相似度范围</div>
    <div class="legend-items">
      <!-- Will be populated by JavaScript -->
    </div>
  </div>
</div>
```

**Success criteria**:
- [ ] Lines 182-197 deleted from index.html
- [ ] `.viz-grid` now only contains 3 panels (Radar, Matrix, Network Graph)
- [ ] HTML validates (no unclosed tags)

---

### Task 1.2: Remove Heatmap Script Tag (2 min)

**File**: `index.html`

**Action**: Delete line 359

**Delete this line**:
```html
<script src="/js/visualizations/similarity-heatmap.js?v=1"></script>
```

**Success criteria**:
- [ ] Script tag removed
- [ ] File still loads in browser
- [ ] Console shows 404 error for similarity-heatmap.js (expected until we delete file)

---

### Task 1.3: Test Page After HTML Removal (3 min)

**Action**: Open `http://localhost:9999` in browser

**Verification checklist**:
- [ ] Page loads successfully
- [ ] No heatmap panel visible (expected)
- [ ] RPAIT Radar displays correctly
- [ ] Persona Matrix displays correctly
- [ ] Network Graph displays correctly (still present at this stage)
- [ ] Console shows 404 for similarity-heatmap.js (acceptable for now)

---

### Task 1.4: Delete Heatmap JavaScript File (2 min)

**Action**: Delete file `js/visualizations/similarity-heatmap.js`

**Command**:
```bash
rm js/visualizations/similarity-heatmap.js
```

**Success criteria**:
- [ ] File deleted
- [ ] Console now shows no 404 error (script tag already removed)
- [ ] Page still loads correctly

---

### Task 1.5: Verify No Other Files Reference Heatmap (3 min)

**Action**: Search codebase for references to heatmap

**Commands**:
```bash
# Search for heatmap references
rg "similarity-heatmap" --type html --type css --type js

# Search for heatmap functions
rg "heatmap" --type js -i
```

**Expected results**:
- Only CSS styles should be found (will be removed in next task)
- No JavaScript imports or requires
- No other HTML references

**Success criteria**:
- [ ] No unexpected references found
- [ ] Documented any remaining references for cleanup

---

### Task 1.6: Remove Heatmap CSS Styles (10 min)

**File**: `styles/main.css`

**Action**: Search and remove all heatmap-related styles

**Search patterns**:
```css
.heatmap-matrix
.heatmap-cell
.heatmap-label
.heatmap-corner
.heatmap-x-labels
.heatmap-y-labels
.heatmap-legend
.legend-title
.legend-items
.legend-item
.legend-swatch
.legend-label
.heatmap-empty-state
.empty-state-message
.empty-state-actions
.empty-state-btn
.heatmap-tooltip
.heatmap-row-highlighted
.heatmap-col-highlighted
.heatmap-cell-active
.heatmap-cell-diagonal
.highlighted
#similarity-heatmap
#heatmap-dimension-label
```

**Estimated removal**: ~300-400 lines of CSS

**Success criteria**:
- [ ] All `.heatmap-*` styles removed
- [ ] All `#similarity-heatmap*` styles removed
- [ ] All `.legend-*` styles removed (if only used by heatmap)
- [ ] All `.empty-state-*` styles removed
- [ ] CSS file validates (no syntax errors)
- [ ] Page layout still works correctly

---

### Task 1.7: Remove Heatmap Analysis Functions (5 min)

**File**: `js/analysis.js`

**Action**: Remove 3 functions (lines ~111-219)

**Delete these functions**:
```javascript
getPersonaRPAITForArtwork(personaId, artworkId) { ... }

calculateDimensionSimilarity(persona1Id, persona2Id, dimension, artworkId) { ... }

getArtworkDimensionSimilarityMatrix(artworkId, dimension, personaIds) { ... }
```

**Before removal, verify no usage**:
```bash
rg "getPersonaRPAITForArtwork" --type js
rg "calculateDimensionSimilarity" --type js
rg "getArtworkDimensionSimilarityMatrix" --type js
```

**Expected result**: No matches (heatmap.js already deleted)

**Success criteria**:
- [ ] Grep shows no usage of these functions
- [ ] All 3 functions deleted from analysis.js
- [ ] File still valid JavaScript (no syntax errors)
- [ ] Remaining analysis functions still work

---

### Task 1.8: Test After Heatmap Removal (3 min)

**Action**: Full functionality test

**Verification checklist**:
- [ ] Page loads at http://localhost:9999
- [ ] No heatmap panel visible
- [ ] RPAIT Radar renders and functions correctly
- [ ] Persona Matrix renders and functions correctly
- [ ] Persona selector works (click badges)
- [ ] Dimension selector works (dropdown changes matrix)
- [ ] Network Graph still visible and functional
- [ ] No console errors
- [ ] Layout looks correct (no gaps or overlaps)

---

## Phase 2: Remove Network Graph (15 minutes)

### Task 2.1: Remove Network Graph HTML Panel (5 min)

**File**: `index.html`

**Action**: Delete lines 199-207 (entire network graph panel)

**Delete this block**:
```html
<!-- Panel 4: Network Graph -->
<div class="viz-panel viz-panel-large" id="network-graph-panel">
  <h3>作品-评论家关系网络</h3>
  <svg id="network-graph" role="img" aria-label="Artwork-persona network graph" tabindex="0"></svg>
  <div class="viz-controls">
    <button class="viz-btn" data-action="reset" aria-label="Reset graph layout">重置布局</button>
    <button class="viz-btn" data-action="export" aria-label="Export as PNG">导出PNG</button>
  </div>
</div>
```

**Success criteria**:
- [ ] Lines deleted from index.html
- [ ] `.viz-grid` now only contains 2 panels (Radar, Matrix)
- [ ] HTML validates

---

### Task 2.2: Remove Network Graph Script Tag (2 min)

**File**: `index.html`

**Action**: Delete script tag for network-graph.js

**Delete this line**:
```html
<script src="/js/visualizations/network-graph.js?v=1"></script>
```

**Success criteria**:
- [ ] Script tag removed
- [ ] Page loads (console may show 404 for now)

---

### Task 2.3: Delete Network Graph JavaScript File (1 min)

**Action**: Delete file `js/visualizations/network-graph.js`

**Command**:
```bash
rm js/visualizations/network-graph.js
```

**Success criteria**:
- [ ] File deleted
- [ ] No 404 error in console (script tag already removed)

---

### Task 2.4: Remove Network Graph CSS Styles (5 min)

**File**: `styles/main.css`

**Action**: Search and remove all network graph styles

**Search patterns**:
```css
#network-graph
#network-graph-panel
.network-node
.network-link
.network-label
```

**Estimated removal**: ~100-200 lines

**Success criteria**:
- [ ] All `#network-graph*` styles removed
- [ ] All `.network-*` styles removed
- [ ] CSS validates
- [ ] Remaining styles don't reference deleted elements

---

### Task 2.5: Test After Network Graph Removal (2 min)

**Action**: Functional test

**Verification checklist**:
- [ ] Page loads successfully
- [ ] Only 2 visualization panels visible (Radar + Matrix)
- [ ] Both panels display correctly
- [ ] Persona selector works
- [ ] Dimension selector works
- [ ] No console errors
- [ ] Layout is clean and balanced

---

## Phase 3: Clean Up and Final Testing (10 minutes)

### Task 3.1: Remove `.viz-panel-large` Class (3 min)

**Action**: Check if `.viz-panel-large` is still needed

**Files to check**:
- `index.html` - Search for `viz-panel-large`
- `styles/main.css` - Check `.viz-panel-large` definition

**Decision**:
- If NO usage found → Remove class definition from CSS
- If used by other panels → Keep class definition

**Success criteria**:
- [ ] Searched for all usage
- [ ] Removed or kept class with clear reason
- [ ] No broken references

---

### Task 3.2: Verify Grid Layout with 2 Panels (2 min)

**Action**: Test responsive layout

**Test at these viewport widths**:
- [ ] 375px (mobile): Panels stack vertically
- [ ] 768px (tablet): Panels stack or side-by-side (depends on grid)
- [ ] 1024px (desktop): Panels side-by-side
- [ ] 1440px (large desktop): Panels side-by-side with proper spacing

**Success criteria**:
- [ ] Layout adapts correctly at all breakpoints
- [ ] No visual gaps or overlaps
- [ ] Panels have appropriate spacing
- [ ] Mobile layout is usable

---

### Task 3.3: Full Functional Test (5 min)

**Action**: Comprehensive testing

**Homepage**:
- [ ] Page loads without errors
- [ ] RPAIT Radar displays correctly
- [ ] Persona Matrix displays correctly
- [ ] Persona selector: Click badges → visualizations update
- [ ] Dimension selector: Change dropdown → matrix updates
- [ ] No network graph visible
- [ ] No heatmap visible
- [ ] Console shows no errors
- [ ] Layout is visually balanced

**Gallery Navigation** (if applicable):
- [ ] Carousel navigation works
- [ ] Artwork sections display
- [ ] Critique cards render
- [ ] Navigation between artworks functional

**Performance**:
- [ ] Page loads faster (fewer scripts)
- [ ] No lag when interacting with visualizations
- [ ] Smooth transitions

---

## Phase 4: Validation and Documentation (5 minutes)

### Task 4.1: Code Cleanup Verification (2 min)

**Action**: Final grep for orphaned code

**Commands**:
```bash
# Check for any remaining heatmap references
rg "heatmap" -i

# Check for any remaining network-graph references
rg "network-graph" -i

# Check for removed function references
rg "getPersonaRPAITForArtwork"
rg "calculateDimensionSimilarity"
rg "getArtworkDimensionSimilarityMatrix"
```

**Expected results**:
- No unexpected references
- Only comments or git history mentions (acceptable)

**Success criteria**:
- [ ] No active code references found
- [ ] All imports/requires cleaned up
- [ ] No broken function calls

---

### Task 4.2: Browser Console Check (1 min)

**Action**: Open browser console and check for errors

**Check for**:
- [ ] No 404 errors for deleted files
- [ ] No "undefined function" errors
- [ ] No "element not found" errors
- [ ] Only expected log messages

**Success criteria**:
- [ ] Console is clean
- [ ] No errors related to removed code

---

### Task 4.3: Git Status Review (2 min)

**Action**: Review all changes before commit

**Command**:
```bash
git status
git diff
```

**Expected changes**:
- Modified: `index.html` (~30 lines deleted)
- Modified: `styles/main.css` (~500 lines deleted)
- Modified: `js/analysis.js` (~110 lines deleted)
- Deleted: `js/visualizations/similarity-heatmap.js`
- Deleted: `js/visualizations/network-graph.js`

**Success criteria**:
- [ ] All changes are intentional deletions
- [ ] No accidental modifications
- [ ] No untracked files
- [ ] Ready for commit

---

## Summary of Deliverables

### Files Modified
- ✅ `index.html` - Removed 2 panels + 2 script tags (~30 lines)
- ✅ `styles/main.css` - Removed heatmap + network graph styles (~500 lines)
- ✅ `js/analysis.js` - Removed 3 functions (~110 lines)

### Files Deleted
- ✅ `js/visualizations/similarity-heatmap.js` (648 lines)
- ✅ `js/visualizations/network-graph.js` (~300-500 lines)

### Total Lines Removed
- **~1,600-1,800 lines of code**

### Remaining Visualizations
- ✅ RPAIT Radar Chart (functional)
- ✅ Persona Comparison Matrix (functional)

---

## Post-Implementation Checklist

### Functional
- [ ] Homepage loads without errors
- [ ] Radar chart works correctly
- [ ] Matrix chart works correctly
- [ ] Persona selector updates both visualizations
- [ ] Dimension selector updates matrix
- [ ] No console errors

### Visual
- [ ] Layout is clean and balanced
- [ ] No gaps where panels were removed
- [ ] Responsive design works at all breakpoints
- [ ] Typography and spacing consistent

### Code Quality
- [ ] No orphaned CSS
- [ ] No unused JavaScript
- [ ] No broken references
- [ ] Clean git diff

### Performance
- [ ] Page loads faster
- [ ] Smaller JavaScript bundle
- [ ] Smaller CSS file
- [ ] Faster rendering

---

**Ready to implement**: All tasks are clearly defined with success criteria. Estimated time: 55 minutes.
