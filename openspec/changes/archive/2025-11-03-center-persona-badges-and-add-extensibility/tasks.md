# Tasks: Center Persona Badges and Add Extensibility

**Change ID**: `center-persona-badges-and-add-extensibility`
**Total Estimated Time**: 45 minutes

---

## Phase 1: CSS Center Alignment (5 minutes)

### Task 1.1: Add center alignment to persona badges

**File**: `styles/main.css`
**Lines**: 2598-2603 (`.persona-badges` class)
**Time**: 5 minutes

**Steps**:
1. Open `styles/main.css`
2. Find `.persona-badges` class (line ~2598)
3. Add `justify-content: center;` after `gap: 8px;`
4. Save file

**Success criteria**:
- [ ] `justify-content: center` added to `.persona-badges`
- [ ] CSS syntax valid (no trailing semicolon issues)
- [ ] File saved

**Validation**:
```bash
grep -A 5 "\.persona-badges {" styles/main.css | grep "justify-content: center"
```

---

## Phase 2: Dynamic Badge Generation (25 minutes)

### Task 2.1: Remove static badge HTML

**File**: `index.html`
**Lines**: 152-177 (static badge buttons)
**Time**: 3 minutes

**Steps**:
1. Open `index.html`
2. Find `.persona-badges` div (line ~152)
3. Delete all 6 `<button class="persona-badge">` elements (lines 153-176)
4. Keep empty `<div class="persona-badges" id="persona-badges-container"></div>`
5. Keep help text `<p class="help-text">单击选择评论家，双击取消选择 · 可选择任意数量</p>`
6. Save file

**Success criteria**:
- [ ] 6 static badge buttons removed
- [ ] Empty container remains with `id="persona-badges-container"`
- [ ] Help text preserved
- [ ] HTML validates

**Validation**:
```bash
# Should return 0 (no static badges)
grep -c 'data-persona="su-shi"' index.html
```

---

### Task 2.2: Implement createBadgeElement() function

**File**: `js/persona-selector.js`
**Lines**: Add after `syncBadgesWithState()` function (after line ~253)
**Time**: 10 minutes

**Steps**:
1. Open `js/persona-selector.js`
2. Add `createBadgeElement(persona)` function after `syncBadgesWithState()`
3. Create `<button>` element with class `persona-badge`
4. Set `data-persona` attribute
5. Create and append `.badge-name` span (nameZh)
6. Create and append `.badge-name-en` span (nameEn)
7. Set ARIA attributes (`aria-pressed="false"`, `aria-label`)
8. Attach click event listener with single/double-click detection logic
9. Return configured badge element

**Success criteria**:
- [ ] Function accepts `persona` parameter
- [ ] Returns `<button>` element
- [ ] Element has correct structure (2 spans inside)
- [ ] Event listener attached
- [ ] ARIA attributes set
- [ ] No syntax errors

**Code template**:
```javascript
/**
 * Create a badge element for a persona
 * @param {Object} persona - Persona object from VULCA_DATA
 * @returns {HTMLButtonElement} - Configured badge button
 */
function createBadgeElement(persona) {
  const badge = document.createElement('button');
  badge.className = 'persona-badge';
  badge.dataset.persona = persona.id;
  badge.setAttribute('aria-pressed', 'false');
  badge.setAttribute('aria-label', `${persona.nameZh} ${persona.nameEn}`);

  const nameZh = document.createElement('span');
  nameZh.className = 'badge-name';
  nameZh.textContent = persona.nameZh;

  const nameEn = document.createElement('span');
  nameEn.className = 'badge-name-en';
  nameEn.textContent = persona.nameEn;

  badge.appendChild(nameZh);
  badge.appendChild(nameEn);

  // Attach event listeners (reuse existing click/double-click logic)
  let clickTimeout = null;
  let lastClickTime = 0;

  badge.addEventListener('click', (event) => {
    const currentTime = Date.now();
    const timeSinceLastClick = currentTime - lastClickTime;

    if (timeSinceLastClick < 300 && lastClickedBadge === badge) {
      clearTimeout(clickTimeout);
      handleBadgeDoubleClick(persona.id, badge);
      lastClickTime = 0;
      lastClickedBadge = null;
    } else {
      clearTimeout(clickTimeout);
      clickTimeout = setTimeout(() => {
        handleBadgeSingleClick(persona.id, badge);
      }, 300);
      lastClickTime = currentTime;
      lastClickedBadge = badge;
    }
  });

  return badge;
}
```

---

### Task 2.3: Implement renderBadges() function

**File**: `js/persona-selector.js`
**Lines**: Add after `createBadgeElement()` function
**Time**: 7 minutes

**Steps**:
1. Add `renderBadges()` function after `createBadgeElement()`
2. Get `#persona-badges-container` element
3. Validate `window.VULCA_DATA.personas` exists
4. Clear container (for hot-reload support)
5. Loop through personas array
6. Call `createBadgeElement()` for each persona
7. Append badge to container
8. Log success message

**Success criteria**:
- [ ] Function validates VULCA_DATA presence
- [ ] Function validates personas array
- [ ] Function clears existing badges
- [ ] Function creates and appends all badges
- [ ] Console logs success
- [ ] Error handling for missing data

**Code template**:
```javascript
/**
 * Render all persona badges from data
 */
function renderBadges() {
  const container = document.getElementById('persona-badges-container');
  if (!container) {
    console.error('PersonaSelection: badges container not found');
    return;
  }

  if (!window.VULCA_DATA || !window.VULCA_DATA.personas) {
    console.error('PersonaSelection: VULCA_DATA.personas not available');
    return;
  }

  const personas = window.VULCA_DATA.personas;
  if (!Array.isArray(personas) || personas.length === 0) {
    console.warn('PersonaSelection: personas array is empty');
    return;
  }

  // Clear existing badges
  container.innerHTML = '';

  // Render each persona
  personas.forEach(persona => {
    if (!persona.id || !persona.nameZh || !persona.nameEn) {
      console.warn('PersonaSelection: skipping invalid persona', persona);
      return;
    }

    const badge = createBadgeElement(persona);
    container.appendChild(badge);
  });

  console.log(`✓ Rendered ${personas.length} persona badges`);
}
```

---

### Task 2.4: Update initUIHandlers() to work with dynamic badges

**File**: `js/persona-selector.js`
**Lines**: Modify `initUIHandlers()` function (lines 145-183)
**Time**: 5 minutes

**Steps**:
1. Open `initUIHandlers()` function
2. Remove `querySelectorAll('.persona-badge')` from function scope (badges don't exist yet)
3. Move badge event listener attachment to `createBadgeElement()` (already done in Task 2.2)
4. Keep only global click detection variables if needed
5. Ensure function doesn't error if badges don't exist yet

**Success criteria**:
- [ ] Function doesn't query badges that don't exist yet
- [ ] Event listeners attached in `createBadgeElement()` instead
- [ ] No runtime errors
- [ ] Click detection still works

**Updated code**:
```javascript
/**
 * Initialize UI event handlers
 * Note: Badge event listeners are now attached in createBadgeElement()
 */
function initUIHandlers() {
  // Badge handlers moved to createBadgeElement()
  // This function can be removed or used for future global handlers
  console.log('✓ UI handlers initialized');
}
```

---

### Task 2.5: Call renderBadges() in init()

**File**: `js/persona-selector.js`
**Lines**: Modify `init()` function (lines 137-150)
**Time**: 2 minutes

**Steps**:
1. Open `init()` function
2. After `restoreSelection()`, add call to `renderBadges()`
3. After `renderBadges()`, call `syncBadgesWithState()`
4. Then call `initUIHandlers()`
5. Ensure correct order: restore → render → sync → handlers

**Success criteria**:
- [ ] `renderBadges()` called in init
- [ ] Called after sessionStorage restore
- [ ] Called before `syncBadgesWithState()`
- [ ] Function order correct

**Updated code**:
```javascript
function init() {
  // Restore from sessionStorage if available
  const restored = restoreSelection();

  if (!restored) {
    console.log('✓ Persona selection initialized with defaults:', selectedPersonas);
  }

  // NEW: Render badges from data
  renderBadges();

  // Sync badges with current selection (default or restored)
  syncBadgesWithState();

  // Initialize UI handlers (after badges exist)
  initUIHandlers();
}
```

---

## Phase 3: Documentation (10 minutes)

### Task 3.1: Add JSDoc persona schema documentation

**File**: `js/data.js`
**Lines**: Add before `personas:` array (before line ~150)
**Time**: 10 minutes

**Steps**:
1. Open `js/data.js`
2. Find `personas:` array declaration (line ~150)
3. Add comprehensive JSDoc block above it
4. Include `@typedef` for Persona object
5. Document all 8 fields with `@property` tags
6. Add type annotations
7. Add validation guidelines (kebab-case, hex colors, word counts)
8. Add "How to Add New Persona" section with numbered steps
9. Add example persona object with `@example` tag
10. Save file

**Success criteria**:
- [ ] JSDoc block added before `personas:` array
- [ ] All 8 fields documented
- [ ] Type annotations included
- [ ] Validation guidelines clear
- [ ] Step-by-step guide included
- [ ] Example provided
- [ ] Comments well-formatted

**Documentation template** (see spec for full version):
```javascript
/**
 * Persona data schema for art critic profiles
 *
 * @typedef {Object} Persona
 * @property {string} id - Unique identifier (kebab-case)
 * @property {string} nameZh - Chinese display name
 * @property {string} nameEn - English display name
 * @property {string} period - Time period description (中文)
 * @property {string} era - Era classification (English)
 * @property {string} bio - Full biography (~300-500 words)
 * @property {string} color - Hex color code (#RRGGBB)
 * @property {string} bias - Critical perspective summary
 *
 * === HOW TO ADD A NEW PERSONA ===
 * 1. Open this file (js/data.js)
 * 2. Scroll to personas: array below
 * 3. Add new object at END of array
 * 4. Fill all 8 required fields
 * 5. Choose unique color hex code
 * 6. Save file
 * 7. Add corresponding critiques
 * 8. Clear browser cache and refresh
 *
 * @example
 * {
 *   id: "new-critic",
 *   nameZh: "新评论家",
 *   nameEn: "New Critic",
 *   period: "当代 (1980-)",
 *   era: "Contemporary",
 *   bio: "Full biography here...",
 *   color: "#FF5733",
 *   bias: "Focus on digital aesthetics"
 * }
 */
personas: [
  // Existing 6 personas...
]
```

---

## Phase 4: Testing (5 minutes)

### Task 4.1: Manual visual testing

**Time**: 3 minutes

**Steps**:
1. Open browser and navigate to `http://localhost:9999`
2. Scroll to Data Insights section
3. Verify 6 badges render correctly
4. Verify badges are center-aligned
5. Verify 3 default badges show as active (Su Shi, Guo Xi, Ruskin)
6. Click badge to toggle selection
7. Double-click badge to deselect
8. Verify radar and matrix charts update

**Success criteria**:
- [ ] 6 badges visible
- [ ] Badges centered horizontally
- [ ] Default selection correct
- [ ] Single-click toggles
- [ ] Double-click deselects
- [ ] Charts update correctly

---

### Task 4.2: Responsive testing

**Time**: 2 minutes

**Steps**:
1. Open browser DevTools (F12)
2. Enable device toolbar (Ctrl+Shift+M)
3. Test at 375px width (mobile)
4. Test at 768px width (tablet)
5. Test at 1440px width (desktop)
6. Verify badges center-align at all sizes
7. Verify badges wrap correctly on narrow screens

**Success criteria**:
- [ ] Centered at 375px
- [ ] Centered at 768px
- [ ] Centered at 1440px
- [ ] No horizontal overflow
- [ ] Badges wrap appropriately

---

## Phase 5: Validation (Optional)

### Task 5.1: Add 7th persona to test extensibility

**File**: `js/data.js`
**Time**: 5 minutes (optional verification)

**Steps**:
1. Open `js/data.js`
2. Add test persona at end of personas array:
```javascript
{
  id: "test-critic",
  nameZh: "测试评论家",
  nameEn: "Test Critic",
  period: "测试用 (2025)",
  era: "Contemporary Test",
  bio: "Test persona for verifying dynamic badge generation...",
  color: "#FF6B6B",
  bias: "Testing extensibility"
}
```
3. Save file
4. Clear browser cache (Ctrl+Shift+Delete)
5. Refresh page (Ctrl+R)
6. Verify 7 badges appear
7. Verify new badge works identically to others

**Success criteria**:
- [ ] 7 badges render
- [ ] New badge displays correct name
- [ ] New badge has correct color when active
- [ ] Click/double-click works
- [ ] No HTML editing was needed

---

## Dependency Graph

```
Phase 1 (CSS) ────┐
                  ├─→ Phase 4 (Testing)
Phase 2 (JS) ─────┘
     ├─ Task 2.1 → 2.2 → 2.3 → 2.4 → 2.5
     └─ All must complete before testing
Phase 3 (Docs) ───→ (Independent, can be done anytime)
```

**Can be parallelized**:
- Phase 1 and Phase 2 are independent (can be done in any order)
- Phase 3 is independent (documentation can be added anytime)

**Must be sequential**:
- Within Phase 2: Tasks 2.1 → 2.2 → 2.3 → 2.4 → 2.5 (in order)
- Phase 4 must come after Phases 1 and 2 complete

---

## Rollback Plan

If issues occur:

1. **Revert CSS only**: `git checkout styles/main.css` (keeps dynamic badges)
2. **Revert badges only**: `git checkout index.html js/persona-selector.js` (keeps center alignment)
3. **Full rollback**: `git checkout styles/main.css index.html js/persona-selector.js`

Low risk - changes are isolated and well-tested patterns.
