# Tasks: 图表本地化与角色限制移除

**Total Estimated Time**: 110 minutes
**Status**: ✅ Completed
**Deployed**: 2025-11-03

---

## Phase 1: Remove Persona Display Limits (15 min)

### Task 1.1: Remove radar chart slicing restriction
**Estimate**: 5 min
**File**: `js/visualizations/rpait-radar.js`

**Steps**:
1. Open `rpait-radar.js`
2. Navigate to line 101 in `getChartData()` function
3. Change: `const datasets = selectedPersonas.slice(0, 3).map(personaId => {`
4. To: `const datasets = selectedPersonas.map(personaId => {`
5. Save file

**Success Criteria**:
- [ ] ✅ `.slice(0, 3)` removed from line 101
- [ ] ✅ File saved without syntax errors

---

### Task 1.2: Remove sessionStorage upper limit validation
**Estimate**: 5 min
**File**: `js/persona-selector.js`

**Steps**:
1. Open `persona-selector.js`
2. Navigate to line 107 in `restoreSelection()` function
3. Change: `if (Array.isArray(parsed) && parsed.length > 0 && parsed.length <= 3) {`
4. To: `if (Array.isArray(parsed) && parsed.length > 0) {`
5. Save file

**Success Criteria**:
- [ ] ✅ `&& parsed.length <= 3` removed from line 107
- [ ] ✅ File saved without syntax errors

---

### Task 1.3: Test unlimited persona selection
**Estimate**: 5 min

**Steps**:
1. Start local server: `python -m http.server 8888`
2. Open browser: `http://localhost:8888`
3. Select all 6 personas using badge selector
4. Verify radar chart displays 6 datasets
5. Refresh page
6. Verify all 6 personas persist

**Success Criteria**:
- [ ] ✅ Radar chart shows 6 datasets
- [ ] ✅ Selection persists after refresh

---

## Phase 2: Radar Chart Localization (20 min)

### Task 2.1: Localize dimension labels array
**Estimate**: 5 min
**File**: `js/visualizations/rpait-radar.js`

**Steps**:
1. Navigate to lines 94-98 in `getChartData()` function
2. Change labels array from bilingual to Chinese-only
3. Change: `'代表性 Representation', '哲学性 Philosophy', ...`
4. To: `'代表性', '哲学性', '美学性', '身份性', '传统性'`
5. Save file

**Success Criteria**:
- [ ] ✅ All 5 dimension labels are pure Chinese
- [ ] ✅ No English keywords in labels array

---

### Task 2.2: Localize legend labels
**Estimate**: 5 min
**File**: `js/visualizations/rpait-radar.js`

**Steps**:
1. Navigate to line 112 in `getChartData()` function
2. Change dataset label from bilingual to Chinese-only
3. Change: `label: \`\${persona.nameZh} (\${persona.nameEn})\`,`
4. To: `label: persona.nameZh,`
5. Save file

**Success Criteria**:
- [ ] ✅ Legend shows only `persona.nameZh`
- [ ] ✅ No English names in parentheses

---

### Task 2.3: Localize first ARIA label function
**Estimate**: 5 min
**File**: `js/visualizations/rpait-radar.js`

**Steps**:
1. Navigate to lines 156-159 in `updateARIALabel()` function
2. Change ARIA label to Chinese
3. Update dimension names in label string
4. Use Chinese colon `：` and Chinese comma `、`
5. Save file

**Success Criteria**:
- [ ] ✅ ARIA label starts with "RPAIT雷达图显示"
- [ ] ✅ Dimension names are in Chinese
- [ ] ✅ Uses `persona.nameZh` instead of `persona.nameEn`

---

### Task 2.4: Localize second ARIA label function
**Estimate**: 5 min
**File**: `js/visualizations/rpait-radar.js`

**Steps**:
1. Navigate to lines 228-235 in second `updateARIALabel()` function
2. Change persona name source from `nameEn` to `nameZh`
3. Change join delimiter from `, ` to `、`
4. Change ARIA label text to Chinese
5. Save file

**Success Criteria**:
- [ ] ✅ Uses `persona.nameZh` for name extraction
- [ ] ✅ Joins names with `、` (Chinese enumeration comma)
- [ ] ✅ ARIA label is fully in Chinese

---

## Phase 3: Matrix Chart Localization (25 min)

### Task 3.1: Localize dataset labels (all dimensions mode)
**Estimate**: 10 min
**File**: `js/visualizations/persona-matrix.js`

**Steps**:
1. Navigate to lines 102-125 in `getChartData()` function
2. Change all 5 dataset `label` properties from bilingual to Chinese
3. Update: `label: '代表性'`, `label: '哲学性'`, etc.
4. Save file

**Success Criteria**:
- [ ] ✅ All 5 datasets have Chinese-only labels
- [ ] ✅ No bilingual labels (e.g., "代表性 Representation") remain

---

### Task 3.2: Localize dimensionNames object
**Estimate**: 5 min
**File**: `js/visualizations/persona-matrix.js`

**Steps**:
1. Navigate to lines 130-136 in `getChartData()` function
2. Change dimensionNames object values from bilingual to Chinese
3. Update all 5 dimension names (R, P, A, I, T)
4. Save file

**Success Criteria**:
- [ ] ✅ dimensionNames object contains only Chinese values
- [ ] ✅ All 5 dimensions mapped correctly

---

### Task 3.3: Localize ARIA label with dimension mapping
**Estimate**: 10 min
**File**: `js/visualizations/persona-matrix.js`

**Steps**:
1. Navigate to lines 174-189 in `updateARIALabel()` function
2. Create dimensionNames mapping object within function
3. Map 'all' to '所有RPAIT维度', R/P/A/I/T to Chinese names
4. Change ARIA label text to Chinese format
5. Save file

**Success Criteria**:
- [ ] ✅ dimensionNames mapping object created
- [ ] ✅ All 6 options (all + 5 dimensions) mapped
- [ ] ✅ ARIA label is fully in Chinese

---

## Phase 4: HTML Localization (10 min)

### Task 4.1: Localize section header
**Estimate**: 2 min
**File**: `index.html`

**Steps**:
1. Navigate to line 138 (Data Insights section header)
2. Change: `<h2>数据洞察 / Data Insights</h2>`
3. To: `<h2>数据洞察</h2>`
4. Save file

**Success Criteria**:
- [ ] ✅ Section header is Chinese-only
- [ ] ✅ No "/ Data Insights" suffix

---

### Task 4.2: Localize dropdown options
**Estimate**: 5 min
**File**: `index.html`

**Steps**:
1. Navigate to lines 165-169 (dimension selector dropdown)
2. Change all 6 `<option>` text from bilingual to Chinese-only
3. Update "全部维度", "代表性", "哲学性", "美学性", "身份性", "传统性"
4. Save file

**Success Criteria**:
- [ ] ✅ All 6 dropdown options are Chinese-only
- [ ] ✅ No bilingual text (e.g., "全部维度 / All Dimensions")

---

### Task 4.3: Visual verification in browser
**Estimate**: 3 min

**Steps**:
1. Refresh browser page
2. Inspect section header visually
3. Open dimension selector dropdown
4. Verify all options are Chinese-only
5. Check browser console for errors

**Success Criteria**:
- [ ] ✅ Section header displays "数据洞察"
- [ ] ✅ Dropdown shows 6 Chinese options
- [ ] ✅ No console errors

---

## Phase 5: Color Consistency (20 min)

### Task 5.1: Add Y-axis color callback function
**Estimate**: 15 min
**File**: `js/visualizations/persona-matrix.js`

**Steps**:
1. Navigate to line 49 (Y-axis configuration in `initMatrixChart()`)
2. Add `color` callback function to `y.ticks` configuration
3. Implement persona color lookup by `context.index`
4. Add fallback to '#2d2d2d' for safety
5. Test callback syntax for errors

**Success Criteria**:
- [ ] ✅ Color callback added to y.ticks configuration
- [ ] ✅ Callback retrieves persona by selectedPersonas[context.index]
- [ ] ✅ Returns persona.color if found, '#2d2d2d' otherwise
- [ ] ✅ No syntax errors

**Code Template**:
```javascript
y: {
  ticks: {
    font: { size: 12 },
    color: (context) => {
      const personaId = selectedPersonas[context.index];
      const persona = window.VULCA_DATA.personas.find(p => p.id === personaId);
      return persona ? persona.color : '#2d2d2d';
    }
  }
}
```

---

### Task 5.2: Test color consistency
**Estimate**: 5 min

**Steps**:
1. Refresh browser page
2. Select 3 personas (e.g., 苏轼, 郭熙, 约翰·罗斯金)
3. Open browser DevTools → Elements → Inspect Y-axis labels
4. Verify label colors match persona theme colors:
   - 苏轼: #B85C3C
   - 郭熙: #4A6741
   - 约翰·罗斯金: #8B4513
5. Change selection, verify colors update

**Success Criteria**:
- [ ] ✅ Y-axis label colors match persona colors
- [ ] ✅ Colors update dynamically on selection change
- [ ] ✅ No color rendering errors

---

## Phase 6: Comprehensive Testing (15 min)

### Task 6.1: Functional testing
**Estimate**: 10 min

**Test Matrix**:
1. Select 1-6 personas → Verify radar shows correct count
2. Select 6 personas → Refresh → Verify persistence
3. Change dimension filter → Verify matrix updates
4. Check all text is Chinese-only (no English)
5. Verify Y-axis colors match persona colors

**Success Criteria**:
- [ ] ✅ All persona counts (1-6) work correctly
- [ ] ✅ Selection persists across refreshes
- [ ] ✅ Dimension filter works
- [ ] ✅ No English text visible
- [ ] ✅ Colors are consistent

---

### Task 6.2: Cross-browser testing
**Estimate**: 3 min

**Browsers**:
- [ ] ✅ Chrome 90+ (primary)
- [ ] ✅ Firefox 88+
- [ ] ✅ Edge 90+

**Success Criteria**:
- [ ] ✅ All features work in all browsers
- [ ] ✅ No browser-specific rendering issues

---

### Task 6.3: Mobile responsiveness
**Estimate**: 2 min

**Devices**:
1. iPhone (375px viewport)
2. iPad (768px viewport)
3. Desktop (1440px viewport)

**Success Criteria**:
- [ ] ✅ Charts render correctly on all devices
- [ ] ✅ Text is readable
- [ ] ✅ Colors display correctly

---

## Phase 7: Documentation & Cleanup (5 min)

### Task 7.1: Update code comments
**Estimate**: 3 min

**Steps**:
1. Review modified functions
2. Update comments to reflect Chinese-only labels
3. Add comment explaining color callback logic
4. Save all files

**Success Criteria**:
- [ ] ✅ Comments are accurate
- [ ] ✅ Complex logic is documented

---

### Task 7.2: Final code review
**Estimate**: 2 min

**Checklist**:
- [ ] ✅ All files saved
- [ ] ✅ No syntax errors
- [ ] ✅ No console warnings
- [ ] ✅ Git status shows 4 modified files

---

## Validation Commands

### Verify English removal
```bash
rg "Representation|Philosophy|Aesthetic|Identity|Tradition" js/visualizations/ --glob "*.js"
# Expected: 0 matches
```

### Verify bilingual title removal
```bash
rg "数据洞察 / Data Insights" index.html
# Expected: 0 matches
```

### Verify limit removal
```bash
rg "slice\(0, 3\)" js/visualizations/rpait-radar.js
# Expected: 0 matches

rg "&& parsed.length <= 3" js/persona-selector.js
# Expected: 0 matches
```

---

## Deployment

### Git Commit
```bash
git add index.html js/persona-selector.js js/visualizations/persona-matrix.js js/visualizations/rpait-radar.js
git commit -m "feat: 图表本地化与移除角色显示上限"
git push origin master
```

### Verification
- [ ] ✅ Commit created: 31dd9c1
- [ ] ✅ Pushed to GitHub
- [ ] ✅ GitHub Pages deployment successful
- [ ] ✅ Live site updated: https://vulcaart.art

---

**All tasks completed successfully on 2025-11-03** ✅
