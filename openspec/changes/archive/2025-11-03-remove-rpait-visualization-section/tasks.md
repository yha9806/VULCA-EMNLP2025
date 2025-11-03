# Tasks: Remove RPAIT Visualization Section

**Change ID**: `remove-rpait-visualization-section`
**Total Estimated Time**: 30 minutes

---

## Phase 1: JavaScript Cleanup (10 minutes)

### Task 1.1: Remove renderRPAITVisualization() function
**File**: `js/gallery-hero.js`
**Lines**: 152-252 (approx. 101 lines)
**Time**: 3 minutes

**Steps**:
1. Locate the `renderRPAITVisualization()` function definition
2. Delete the entire function from opening brace to closing brace
3. Verify no syntax errors remain

**Success Criteria**:
- [ ] Function definition completely removed
- [ ] No orphaned code blocks
- [ ] No trailing comments referring to removed function
- [ ] File still has valid JavaScript syntax

**Validation**:
```bash
# Check function is removed
grep -n "function renderRPAITVisualization" js/gallery-hero.js
# Expected: No matches (exit code 1)

# Check JavaScript syntax
node --check js/gallery-hero.js
# Expected: No errors
```

---

### Task 1.2: Remove renderRPAITVisualization() call from render pipeline
**File**: `js/gallery-hero.js`
**Line**: 48 (approx.)
**Time**: 2 minutes

**Steps**:
1. Locate the main `render()` or initialization function
2. Find the line `renderRPAITVisualization(carousel);`
3. Delete this line
4. Verify render pipeline still has correct flow

**Success Criteria**:
- [ ] Function call removed from render pipeline
- [ ] Other render functions still called in correct order
- [ ] No dangling semicolons or commas

**Validation**:
```bash
# Check call is removed
grep -n "renderRPAITVisualization" js/gallery-hero.js
# Expected: No matches (exit code 1)
```

---

### Task 1.3: Update console logs (optional)
**File**: `js/gallery-hero.js`
**Time**: 2 minutes

**Steps**:
1. Search for console logs related to RPAIT visualization
2. Remove or update logs like `console.log('✓ Rendered RPAIT visualization')`
3. Verify no orphaned log statements

**Success Criteria**:
- [ ] No console logs referring to removed feature
- [ ] Other diagnostic logs preserved

**Validation**:
```bash
# Check for RPAIT-related logs
grep -n "RPAIT visualization" js/gallery-hero.js
# Expected: No matches
```

---

### Task 1.4: Verify JavaScript still loads
**Time**: 3 minutes

**Steps**:
1. Open `index.html` in browser
2. Open browser console (F12)
3. Check for JavaScript errors
4. Verify gallery renders correctly

**Success Criteria**:
- [ ] No JavaScript errors in console
- [ ] Gallery hero displays artwork
- [ ] Critiques render correctly
- [ ] Navigation buttons work

**Validation**:
```javascript
// Browser console check
console.log('Gallery hero:', document.getElementById('gallery-hero'));
// Expected: Element should exist

console.log('Critiques:', document.querySelectorAll('.critique-panel').length);
// Expected: 6 critique panels
```

---

## Phase 2: CSS Cleanup (10 minutes)

### Task 2.1: Remove .artwork-rpait-visualization styles
**File**: `styles/main.css`
**Lines**: 1433-1440 (approx.)
**Time**: 3 minutes

**Steps**:
1. Locate `.artwork-rpait-visualization {` style block
2. Delete the entire rule set including closing brace
3. Verify no syntax errors

**Current Code to Remove**:
```css
.artwork-rpait-visualization {
  padding: var(--spacing-lg);
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border-radius: 12px;
  margin-top: var(--spacing-xl);
  border: 1px solid rgba(255, 255, 255, 0.8);
}
```

**Success Criteria**:
- [ ] `.artwork-rpait-visualization` rule removed
- [ ] No orphaned property declarations
- [ ] CSS still validates

**Validation**:
```bash
# Check class is removed
grep -n "\.artwork-rpait-visualization" styles/main.css
# Expected: No matches (exit code 1)
```

---

### Task 2.2: Remove .rpait-title styles
**File**: `styles/main.css`
**Lines**: 1442-1448 (approx.)
**Time**: 2 minutes

**Steps**:
1. Locate `.rpait-title {` style block
2. Delete the entire rule set
3. Verify no syntax errors

**Current Code to Remove**:
```css
.rpait-title {
  font-family: var(--font-serif);
  font-size: 1.2rem;
  font-weight: var(--weight-semibold);
  margin-bottom: var(--spacing-md);
  text-align: center;
  color: var(--color-text);
}
```

**Success Criteria**:
- [ ] `.rpait-title` rule removed
- [ ] CSS still validates

**Validation**:
```bash
# Check class is removed
grep -n "\.rpait-title" styles/main.css
# Expected: No matches (exit code 1)
```

---

### Task 2.3: Remove .artwork-rpait-visualization scroll-reveal animation
**File**: `styles/main.css`
**Lines**: 1813-1815 (approx.)
**Time**: 2 minutes

**Steps**:
1. Locate `.artwork-rpait-visualization[data-reveal]` rule
2. Delete this animation rule
3. Verify other scroll-reveal animations still work

**Current Code to Remove**:
```css
.artwork-rpait-visualization[data-reveal] {
  transition-delay: 0.4s; /* Appear after critique panels */
}
```

**Success Criteria**:
- [ ] Animation rule for removed element deleted
- [ ] Other `[data-reveal]` animations preserved (critique panels, etc.)

**Validation**:
```bash
# Check specific rule removed
grep -n "\.artwork-rpait-visualization\[data-reveal\]" styles/main.css
# Expected: No matches

# Verify other animations preserved
grep -n "\.critique-panel\[data-reveal\]" styles/main.css
# Expected: Should find matches
```

---

### Task 2.4: Verify .rpait-dimensions styles preserved
**File**: `styles/main.css`
**Lines**: 1081-1102 (approx.)
**Time**: 2 minutes

**Steps**:
1. Locate `.rpait-dimensions` styles
2. Verify they are NOT deleted (used by `pages/critics.html`)
3. Test critics page still renders correctly

**Code to PRESERVE**:
```css
.rpait-dimensions {
  list-style: none;
  padding: 0;
  margin: 0;
}

.rpait-dimensions li {
  padding: 0.75rem 0;
  font-size: 0.95rem;
  line-height: 1.5;
  border-bottom: 1px solid var(--color-border);
}

.rpait-dimensions li:last-child {
  border-bottom: none;
}

.rpait-dimensions strong {
  color: var(--color-text);
  font-weight: 700;
}
```

**Success Criteria**:
- [ ] `.rpait-dimensions` styles still exist
- [ ] `pages/critics.html` displays RPAIT dimensions correctly

**Validation**:
```bash
# Verify styles preserved
grep -n "\.rpait-dimensions" styles/main.css
# Expected: Match found (lines 1081-1102)

# Test critics page
# Open pages/critics.html and verify RPAIT dimension list displays
```

---

### Task 2.5: Verify CSS still loads
**Time**: 1 minute

**Steps**:
1. Hard refresh browser (Ctrl+Shift+R)
2. Check Network tab for CSS loading
3. Verify no 404 errors
4. Verify layout still renders correctly

**Success Criteria**:
- [ ] `styles/main.css` loads successfully (200 status)
- [ ] No CSS-related errors in console
- [ ] Gallery hero layout intact
- [ ] Critique panels styled correctly

---

## Phase 3: Visual Testing (10 minutes)

### Task 3.1: Test desktop viewport (1920px)
**Time**: 2 minutes

**Steps**:
1. Set browser width to 1920px
2. Load `index.html`
3. Verify no RPAIT visualization appears
4. Verify critique panels display correctly
5. Verify data visualization section works

**Success Criteria**:
- [ ] No RPAIT viz section between critiques and navigation
- [ ] Layout flows smoothly from critiques to page indicator
- [ ] All 6 critique panels visible
- [ ] Critique panel RPAIT scores visible
- [ ] Data visualization charts render below

**Validation**:
```javascript
// Browser console
document.querySelector('.artwork-rpait-visualization')
// Expected: null

document.querySelectorAll('.critique-panel').length
// Expected: 6

document.querySelectorAll('.critique-rpait').length
// Expected: 6 (one per critique)
```

---

### Task 3.2: Test tablet viewport (768px)
**Time**: 2 minutes

**Steps**:
1. Set browser width to 768px
2. Reload page
3. Verify responsive layout still works
4. Verify no RPAIT viz appears

**Success Criteria**:
- [ ] Gallery hero adapts to tablet width
- [ ] Critiques stack or display in responsive grid
- [ ] No layout overflow or horizontal scroll
- [ ] No RPAIT viz section visible

---

### Task 3.3: Test mobile viewport (375px)
**Time**: 2 minutes

**Steps**:
1. Set browser width to 375px
2. Reload page
3. Verify mobile layout intact
4. Verify no RPAIT viz appears

**Success Criteria**:
- [ ] Gallery hero displays in mobile view
- [ ] Critiques stack vertically
- [ ] Navigation controls visible and usable
- [ ] No RPAIT viz section visible

---

### Task 3.4: Test artwork navigation
**Time**: 2 minutes

**Steps**:
1. Click "Next" button to navigate to artwork 2
2. Verify render pipeline works correctly
3. Click "Next" again to artwork 3
4. Click "Previous" to return to artwork 2

**Success Criteria**:
- [ ] Each artwork renders without RPAIT viz
- [ ] Critiques update correctly for each artwork
- [ ] Navigation buttons work smoothly
- [ ] No JavaScript errors during navigation

**Validation**:
```javascript
// After clicking Next
document.querySelector('.artwork-indicator').textContent
// Expected: "2 of 4" or similar

document.querySelector('.artwork-rpait-visualization')
// Expected: null (should not appear on any artwork)
```

---

### Task 3.5: Verify critique panel RPAIT scores
**Time**: 2 minutes

**Steps**:
1. Scroll to view critique panels
2. Verify each panel displays RPAIT section at bottom
3. Verify scores match expected values (R, P, A, I, T)
4. Test on multiple artworks

**Success Criteria**:
- [ ] Each critique panel has "RPAIT:" section
- [ ] Each section shows 5 dimensions with scores
- [ ] Scores display correctly formatted (e.g., "R: 7")
- [ ] All 6 critiques have RPAIT information

**Validation**:
```javascript
// Check all critique panels
const critiques = document.querySelectorAll('.critique-panel');
critiques.forEach((critique, i) => {
  const rpaitSection = critique.querySelector('.critique-rpait');
  console.log(`Critique ${i+1} RPAIT:`, rpaitSection ? 'Found' : 'MISSING');
});
// Expected: All found
```

---

## Phase 4: Data Visualization Verification (Optional - 5 minutes)

### Task 4.1: Verify data visualization section
**Time**: 3 minutes

**Steps**:
1. Scroll to data visualization section below gallery hero
2. Verify RPAIT radar chart renders
3. Verify persona matrix displays
4. Verify all interactive features work

**Success Criteria**:
- [ ] RPAIT radar chart visible
- [ ] Persona comparison matrix visible
- [ ] Hover interactions work
- [ ] No console errors

---

### Task 4.2: Verify RPAIT data access
**Time**: 2 minutes

**Steps**:
1. Open browser console
2. Check `window.VULCA_DATA.personas` array
3. Verify each persona has `rpait` property
4. Verify RPAIT data intact

**Success Criteria**:
- [ ] `VULCA_DATA.personas` array exists
- [ ] Each persona has `rpait: { R, P, A, I, T }` object
- [ ] Values are numbers 1-10
- [ ] All 6 personas have RPAIT data

**Validation**:
```javascript
// Browser console
const personas = window.VULCA_DATA.personas;
personas.forEach(p => {
  console.log(`${p.nameEn}: R=${p.rpait.R}, P=${p.rpait.P}, A=${p.rpait.A}, I=${p.rpait.I}, T=${p.rpait.T}`);
});
// Expected: All personas should display complete RPAIT scores
```

---

## Final Checklist

**Before Commit**:
- [ ] All JavaScript functions removed
- [ ] All CSS styles cleaned up
- [ ] No console errors
- [ ] Visual regression testing passed (desktop, tablet, mobile)
- [ ] Critique panel RPAIT preserved
- [ ] Data visualization RPAIT preserved
- [ ] Navigation still works
- [ ] Code review completed

**Commit Message Template**:
```
feat: Remove redundant RPAIT visualization from gallery hero

Removes the aggregated RPAIT dimension analysis section that appeared
between critique panels and navigation controls. This information is
redundant as RPAIT scores are already displayed in:
- Individual critique panels (per-persona, per-artwork detail)
- Data visualization section (comprehensive charts and heatmaps)

Changes:
- Remove renderRPAITVisualization() function from js/gallery-hero.js
- Remove function call from render pipeline
- Remove .artwork-rpait-visualization CSS styles
- Remove .rpait-title CSS styles
- Remove scroll-reveal animation for removed element
- Preserve .rpait-dimensions styles (used by critics page)
- Preserve critique panel RPAIT display
- Preserve data visualization RPAIT charts

Result: Cleaner gallery hero layout, reduced visual clutter, improved
focus on artwork and critiques. No loss of RPAIT information.

Fixes: User-reported redundancy issue
```

---

## Rollback Instructions

**If issues found**:
```bash
# Revert the commit
git revert <commit-sha>

# Or restore specific files
git checkout HEAD~1 -- js/gallery-hero.js styles/main.css
```

**Recovery checklist**:
- [ ] Gallery hero displays RPAIT viz again
- [ ] No JavaScript errors
- [ ] All styles load correctly
- [ ] Layout renders as before
