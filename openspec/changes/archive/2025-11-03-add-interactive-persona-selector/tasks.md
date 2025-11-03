# Tasks: Add Interactive Persona Selector

**Change ID**: `add-interactive-persona-selector`
**Total Estimated Time**: 2 hours

---

## Phase 1: Global State Manager (30 minutes)

### Task 1.1: Create persona-selector.js module
**File**: `js/persona-selector.js` (NEW)
**Time**: 15 minutes

**Steps**:
1. Create new file `js/persona-selector.js`
2. Implement IIFE module pattern
3. Define `window.PersonaSelection` object
4. Implement `selectedPersonas` state variable (default: `['su-shi', 'guo-xi', 'john-ruskin']`)
5. Implement `setSelection(personaIds)` method with validation
6. Implement `getSelection()` method returning array copy
7. Add validation: array type, length 1-3, valid persona IDs
8. Add error handling: console errors + user alerts

**Success Criteria**:
- [ ] Module exports `window.PersonaSelection`
- [ ] `setSelection([])` returns `false` and shows alert
- [ ] `setSelection(['invalid'])` returns `false`
- [ ] `setSelection(['su-shi', 'guo-xi', 'x', 'y'])` returns `false` (> 3)
- [ ] `setSelection(['su-shi'])` returns `true`
- [ ] `getSelection()` returns copy of array

**Validation**:
```javascript
// Browser console test
console.log(window.PersonaSelection); // Should exist
console.log(window.PersonaSelection.getSelection()); // ['su-shi', 'guo-xi', 'john-ruskin']
window.PersonaSelection.setSelection(['invalid']); // Should return false
```

---

### Task 1.2: Implement CustomEvent system
**File**: `js/persona-selector.js`
**Time**: 10 minutes

**Steps**:
1. Create `emitChangeEvent()` private function
2. Construct `CustomEvent('persona:selectionChanged')` with detail payload
3. Set `detail: { personas: [], count: N }`
4. Set `bubbles: true`
5. Dispatch event on `window` object
6. Call `emitChangeEvent()` after successful `setSelection()`

**Success Criteria**:
- [ ] Event name is `persona:selectionChanged`
- [ ] Event detail contains `personas` array and `count` number
- [ ] Event bubbles (can be caught by any element)
- [ ] Event fires only after validation passes
- [ ] Event does NOT fire if validation fails

**Validation**:
```javascript
// Browser console test
window.addEventListener('persona:selectionChanged', (e) => {
  console.log('Event received:', e.detail);
});
window.PersonaSelection.setSelection(['su-shi', 'guo-xi']);
// Should log: {personas: ['su-shi', 'guo-xi'], count: 2}
```

---

### Task 1.3: Implement sessionStorage persistence
**File**: `js/persona-selector.js`
**Time**: 5 minutes

**Steps**:
1. Create `persistSelection()` function with try-catch
2. Save to `sessionStorage['vulca-persona-selection']` as JSON
3. Create `restoreSelection()` function
4. Parse JSON from sessionStorage on module init
5. Validate restored data (array, length 1-3, valid IDs)
6. Fallback to default if invalid or unavailable

**Success Criteria**:
- [ ] Selection saved to sessionStorage on change
- [ ] Page reload restores selection from sessionStorage
- [ ] Invalid sessionStorage data falls back to default
- [ ] Private browsing (no sessionStorage) degrades gracefully
- [ ] Console warns if sessionStorage unavailable

**Validation**:
```javascript
// Browser console test
window.PersonaSelection.setSelection(['mama-zola']);
console.log(sessionStorage.getItem('vulca-persona-selection'));
// Should show: '["mama-zola"]'
location.reload(); // After reload, selection should persist
```

---

## Phase 2: Persona Selector UI (45 minutes)

### Task 2.1: Add HTML structure to index.html
**File**: `index.html`
**Lines**: Insert after line 148 (below "数据洞察" header)
**Time**: 10 minutes

**Steps**:
1. Locate `<div class="viz-grid">` in Data Insights section (line ~150)
2. Insert `.persona-selector-wrapper` div BEFORE `.viz-grid`
3. Add `<label for="persona-select">选择评论家 Select Personas (最多3位)</label>`
4. Add `<select id="persona-select" multiple size="6">`
5. Add 6 `<option>` elements with persona data from `VULCA_DATA.personas`
6. Pre-select 3 options: su-shi, guo-xi, john-ruskin (add `selected` attribute)
7. Add preset buttons container with 3 buttons
8. Add help text: `<p id="persona-help">按住 Ctrl/Cmd 选择多位评论家</p>`
9. Add ARIA attributes: `aria-label`, `aria-describedby`

**Success Criteria**:
- [ ] Dropdown appears above visualization grid
- [ ] Dropdown shows 6 personas
- [ ] 3 personas pre-selected (Su Shi, Guo Xi, Ruskin)
- [ ] Preset buttons visible: "古代", "现代", "全部"
- [ ] Help text visible below dropdown
- [ ] No layout shifts or visual glitches

**Validation**:
```javascript
// Browser console
document.getElementById('persona-select').selectedOptions.length; // Should be 3
Array.from(document.getElementById('persona-select').selectedOptions).map(o => o.value);
// Should be: ['su-shi', 'guo-xi', 'john-ruskin']
```

---

### Task 2.2: Add CSS styling for persona selector
**File**: `styles/main.css`
**Lines**: Add after Data Insights section styles (~line 1520)
**Time**: 15 minutes

**Steps**:
1. Add `.persona-selector-wrapper` styles (flex layout, gap, padding, background)
2. Add `#persona-select` styles (width, border, border-radius, font-size)
3. Add `#persona-select option` base styles (padding, margin)
4. Add option background colors for each persona (6 CSS rules):
   - `[value="su-shi"]` → `rgba(184, 92, 60, 0.2)`
   - `[value="guo-xi"]` → `rgba(74, 124, 126, 0.2)`
   - ... (repeat for all 6)
5. Add `option:checked` styles (darker background at 40% opacity, font-weight)
6. Add `.preset-btn` styles (pill shape, hover states, active states)
7. Add `.help-text` styles (font-size, color, margin)
8. Add responsive breakpoints (mobile, tablet, desktop)

**Success Criteria**:
- [ ] Dropdown has rounded corners and subtle border
- [ ] Each option has persona-colored background
- [ ] Selected options have darker background
- [ ] Preset buttons have pill shape
- [ ] Hover and active states work
- [ ] Mobile layout stacks vertically

**Validation**:
```css
/* Verify color coding */
#persona-select option[value="su-shi"] {
  background-color: rgba(184, 92, 60, 0.2); /* Su Shi red-brown */
}

#persona-select option:checked {
  background-color: rgba(184, 92, 60, 0.4); /* Darker when selected */
  font-weight: 600;
}
```

---

### Task 2.3: Implement dropdown change handler
**File**: `js/persona-selector.js`
**Time**: 10 minutes

**Steps**:
1. Add `initDropdownListener()` function
2. Get `#persona-select` element
3. Add `change` event listener
4. Extract selected option values into array
5. Validate selection length (1-3)
6. If > 3, show alert and revert to previous selection
7. If valid, call `PersonaSelection.setSelection()`
8. Update selection count in ARIA live region

**Success Criteria**:
- [ ] Changing dropdown triggers event listener
- [ ] Selecting 4th persona shows alert and reverts
- [ ] Valid selection (1-3) updates global state
- [ ] Global state emits `persona:selectionChanged` event
- [ ] Dropdown updates visual state after validation

**Validation**:
```javascript
// After implementing, test in browser:
// 1. Select 3 personas → should work
// 2. Try to select 4th → should show alert
// 3. Deselect all → should show alert
```

---

### Task 2.4: Implement preset buttons
**File**: `js/persona-selector.js`
**Time**: 10 minutes

**Steps**:
1. Define `presets` object with 3 preset groups:
   - `ancient: ['su-shi', 'guo-xi']`
   - `modern: ['john-ruskin', 'professor-petrova', 'ai-ethics']`
   - `all: ['su-shi', 'guo-xi', 'john-ruskin', 'mama-zola', 'professor-petrova', 'ai-ethics']`
2. Add click listeners to all `.preset-btn` elements
3. Get preset type from `data-preset` attribute
4. For "全部" preset, check if length > 3 and show error
5. For valid presets, update dropdown selection programmatically
6. Call `PersonaSelection.setSelection()` with preset array

**Success Criteria**:
- [ ] "古代" button selects Su Shi + Guo Xi
- [ ] "现代" button selects Ruskin + Petrova + AI Ethics
- [ ] "全部" button shows error (6 personas > 3 limit)
- [ ] Dropdown visual state updates after preset click
- [ ] Charts update after preset selection

**Validation**:
```javascript
// Test preset buttons
document.querySelector('[data-preset="ancient"]').click();
// Should select only Su Shi and Guo Xi

document.querySelector('[data-preset="all"]').click();
// Should show alert: "最多选择3位评论家，请手动调整"
```

---

## Phase 3: Chart Integration (30 minutes)

### Task 3.1: Update rpait-radar.js defaults
**File**: `js/visualizations/rpait-radar.js`
**Lines**: 14-15
**Time**: 5 minutes

**Steps**:
1. Change `currentMode` from `'single'` to `'compare'` (line 13)
2. Change `selectedPersonas` from `['su-shi']` to `['su-shi', 'guo-xi', 'john-ruskin']` (line 14)
3. Update initial chart render to show 3 personas
4. Verify chart legend shows all 3 names
5. Verify chart displays 3 color-coded datasets

**Success Criteria**:
- [ ] Radar chart shows 3 personas on page load
- [ ] Chart legend lists Su Shi, Guo Xi, John Ruskin
- [ ] Each persona has distinct color overlay
- [ ] No JavaScript errors on load

**Validation**:
```javascript
// After change, check in browser console
console.log(window.radarChart.data.datasets.length); // Should be 3
console.log(window.radarChart.data.datasets.map(d => d.label));
// Should show: ["苏轼 (Su Shi)", "郭熙 (Guo Xi)", "约翰·罗斯金 (John Ruskin)"]
```

---

### Task 3.2: Add event listener to rpait-radar.js
**File**: `js/visualizations/rpait-radar.js`
**Lines**: Insert in `initEventListeners()` function (line ~232)
**Time**: 10 minutes

**Steps**:
1. Locate `initEventListeners()` function
2. Add `window.addEventListener('persona:selectionChanged', handler)` after existing listeners
3. Extract `personas` from `event.detail`
4. Update `selectedPersonas` variable
5. Call `updateRadarChart()` to re-render
6. Call `updateARIALabel()` to update accessibility label
7. Add console log for debugging

**Success Criteria**:
- [ ] Event listener registered successfully
- [ ] Listener receives event when dropdown changes
- [ ] `selectedPersonas` updates with new array
- [ ] Chart re-renders with correct personas
- [ ] ARIA label updates to list selected persona names
- [ ] No duplicate event listeners

**Validation**:
```javascript
// After implementation, test:
window.PersonaSelection.setSelection(['mama-zola']);
// Radar chart should update to show only Mama Zola within 300ms
```

---

### Task 3.3: Update persona-matrix.js to filter personas
**File**: `js/visualizations/persona-matrix.js`
**Lines**: Modify `getChartData()` function (line ~86)
**Time**: 10 minutes

**Steps**:
1. Add `selectedPersonas` variable at module level (default: same 3 personas)
2. Modify `getChartData()` to filter `window.VULCA_DATA.personas`
3. Filter: `personas.filter(p => selectedPersonas.includes(p.id))`
4. Use filtered array for labels and data
5. Ensure dimension filter still works with filtered personas
6. Update chart height dynamically based on filtered count

**Success Criteria**:
- [ ] Matrix chart filters to selected personas
- [ ] Chart shows correct number of bars (1-3)
- [ ] Y-axis labels show only selected persona names
- [ ] Dimension filter dropdown still works
- [ ] Chart adjusts height for 1, 2, or 3 personas

**Validation**:
```javascript
// Before: shows 6 personas
// After persona selection change:
window.PersonaSelection.setSelection(['su-shi', 'ai-ethics']);
// Matrix chart should show only 2 bars for Su Shi and AI Ethics
```

---

### Task 3.4: Add event listener to persona-matrix.js
**File**: `js/visualizations/persona-matrix.js`
**Lines**: Insert in `initEventListeners()` function
**Time**: 5 minutes

**Steps**:
1. Locate or create `initEventListeners()` function
2. Add `window.addEventListener('persona:selectionChanged', handler)`
3. Extract `personas` from `event.detail`
4. Update `selectedPersonas` variable
5. Call `updateMatrixChart()` to re-render
6. Add console log for debugging

**Success Criteria**:
- [ ] Event listener registered successfully
- [ ] Matrix chart updates when dropdown changes
- [ ] Both radar and matrix charts update simultaneously
- [ ] No race conditions or visual glitches

**Validation**:
```javascript
// Test synchronization
window.PersonaSelection.setSelection(['guo-xi', 'professor-petrova']);
// Both charts should update within 300ms showing same 2 personas
```

---

## Phase 4: Final Polish & Testing (15 minutes)

### Task 4.1: Update index.html to load persona-selector.js
**File**: `index.html`
**Lines**: Add script tag in `<head>` or before closing `</body>`
**Time**: 2 minutes

**Steps**:
1. Add `<script src="/js/persona-selector.js?v=1"></script>`
2. Ensure it loads BEFORE rpait-radar.js and persona-matrix.js
3. Ensure it loads AFTER data.js (needs VULCA_DATA)
4. Add version query parameter for cache busting

**Success Criteria**:
- [ ] Script loads without errors
- [ ] `window.PersonaSelection` available before charts initialize
- [ ] No 404 errors in console
- [ ] Correct load order maintained

**Validation**:
```html
<!-- Correct order in index.html -->
<script src="/js/data.js?v=3"></script>
<script src="/js/persona-selector.js?v=1"></script> <!-- NEW -->
<script src="/js/visualizations/rpait-radar.js?v=1"></script>
<script src="/js/visualizations/persona-matrix.js?v=1"></script>
```

---

### Task 4.2: Update "对比模式" button to active by default
**File**: `index.html`
**Lines**: Radar chart controls section (~line 157)
**Time**: 2 minutes

**Steps**:
1. Locate `.viz-controls` in `#rpait-radar-panel`
2. Remove `active` class from "单一模式" button
3. Add `active` class to "对比模式" button
4. Verify button states match JavaScript defaults

**Success Criteria**:
- [ ] "对比模式" button has `active` class in HTML
- [ ] "单一模式" button does NOT have `active` class
- [ ] Visual styling reflects active state (darker background)
- [ ] Matches `currentMode = 'compare'` in JavaScript

**Validation**:
```html
<!-- index.html (AFTER change) -->
<div class="viz-controls">
  <button class="viz-btn" data-mode="single">单一模式</button>
  <button class="viz-btn active" data-mode="compare">对比模式</button>
</div>
```

---

### Task 4.3: Test on multiple screen sizes
**Time**: 5 minutes

**Steps**:
1. Test desktop (1920px): Dropdown + presets in row
2. Test tablet (768px): Dropdown full width, presets below
3. Test mobile (375px): All stacked vertically
4. Verify touch targets ≥ 44px on mobile
5. Verify no horizontal scroll
6. Verify dropdown scrollable if needed

**Success Criteria**:
- [ ] Desktop: Horizontal layout, compact
- [ ] Tablet: Vertical layout, readable
- [ ] Mobile: Fully responsive, touch-friendly
- [ ] No layout breaks at any width
- [ ] All interactive elements accessible

**Validation**:
```bash
# Chrome DevTools responsive testing
# Test widths: 375px, 768px, 1024px, 1440px, 1920px
```

---

### Task 4.4: Accessibility validation
**Time**: 3 minutes

**Steps**:
1. Test keyboard navigation (Tab, Arrow, Space, Enter)
2. Verify focus visible (2px outline)
3. Test with screen reader (NVDA or VoiceOver)
4. Verify ARIA labels announce correctly
5. Verify live region announces selection changes
6. Check color contrast ratios (WCAG AA)

**Success Criteria**:
- [ ] Dropdown keyboard navigable
- [ ] Focus visible on all elements
- [ ] Screen reader announces persona names
- [ ] Selection changes announced in live region
- [ ] Preset buttons have descriptive labels
- [ ] Color contrast ≥ 4.5:1 for text

**Validation**:
```html
<!-- Check ARIA attributes -->
<select
  id="persona-select"
  multiple
  aria-label="选择评论家进行对比分析"
  aria-describedby="persona-help persona-count"
></select>
<div id="persona-count" class="sr-only" aria-live="polite">
  已选择 3 位评论家
</div>
```

---

### Task 4.5: Browser compatibility testing
**Time**: 3 minutes

**Steps**:
1. Test Chrome/Edge 90+
2. Test Firefox 88+
3. Test Safari 14+
4. Verify CustomEvent works in all browsers
5. Verify `<select multiple>` works in all browsers
6. Verify sessionStorage works in all browsers

**Success Criteria**:
- [ ] Chrome: Full functionality
- [ ] Firefox: Full functionality
- [ ] Safari: Full functionality
- [ ] No polyfills needed
- [ ] Private browsing works (without sessionStorage)

---

## Final Checklist

**Before Commit**:
- [ ] All JavaScript modules load without errors
- [ ] Dropdown displays 6 personas
- [ ] 3 personas pre-selected by default
- [ ] Preset buttons work correctly
- [ ] Radar chart defaults to compare mode with 3 personas
- [ ] Matrix chart filters to selected personas
- [ ] Both charts update synchronously (< 300ms)
- [ ] sessionStorage persists selection across reloads
- [ ] Responsive design works on all screen sizes
- [ ] Keyboard navigation functional
- [ ] Screen reader accessible
- [ ] No console errors
- [ ] Cross-browser testing passed

**Commit Message Template**:
```
feat: Add interactive persona selector for data visualizations

Implements a global persona selection system that allows users to choose
1-3 personas for comparison across RPAIT radar chart and persona matrix.

Features:
- Multi-select dropdown with 6 personas
- Preset buttons for quick selection (古代/现代/全部)
- Global state manager with CustomEvent system
- sessionStorage persistence across page reloads
- Synchronized updates to both charts
- Default compare mode showing 3 personas
- Full keyboard and screen reader support
- Responsive design for all screen sizes

Changes:
- Add js/persona-selector.js (global state manager)
- Modify js/visualizations/rpait-radar.js (event listener + defaults)
- Modify js/visualizations/persona-matrix.js (filtering + event listener)
- Add persona selector UI to index.html
- Add CSS styling in styles/main.css
- Update radar chart default mode to 'compare'

User request: "这个图只能显示苏轼的？我需要多个选项，然后对比部分也需要可选可调整。"

Fixes: Data visualization persona selection
```

---

## Rollback Instructions

**If issues found**:
```bash
# Revert the commit
git revert <commit-sha>

# Or restore specific files
git checkout HEAD~1 -- js/persona-selector.js js/visualizations/rpait-radar.js js/visualizations/persona-matrix.js index.html styles/main.css
```

**Recovery checklist**:
- [ ] Remove persona-selector.js script tag from index.html
- [ ] Restore rpait-radar.js defaults (single mode, Su Shi only)
- [ ] Restore persona-matrix.js (show all 6 personas)
- [ ] Remove persona selector HTML from index.html
- [ ] Verify charts still work with old behavior
