# Proposal: Center Persona Badges and Add Extensibility

**Change ID**: `center-persona-badges-and-add-extensibility`
**Created**: 2025-11-03
**Status**: Proposed

---

## Problem Statement

The persona selector badges in the Data Insights section have two issues:

1. **Left-aligned layout**: The persona badges are currently left-aligned (flex-start), which looks unbalanced when fewer personas are selected or on wider screens. The badges should be centered for better visual harmony with other sections.

2. **No extensibility for adding personas**: The current implementation requires manual HTML editing to add new personas. With plans to add more critic personas in the future, the system needs:
   - Clear documentation on data format
   - Automatic badge generation from data
   - No need to modify HTML when adding new personas

**Current behavior**:
- 6 persona badges display left-aligned in `index.html`
- Adding a 7th persona requires editing both `js/data.js` AND `index.html`
- No centralized documentation on persona data schema

**User request**: "这个：单击选择评论家，双击取消选择 · 可选择任意数量 也就是网站的角色卡选择的部分的选项按钮需要居中。现在是左对齐的状态。我们后面可能回加更多的角色卡，要在后台或者是其他地方预留好添加的格式。"

---

## Why

**Visual consistency**: All other sections (viz-header, viz-grid, help-text) use centered alignment. Left-aligned badges break this visual flow and feel unfinished.

**Future scalability**: The project will add more personas (critics from different cultures, time periods, or perspectives). Manual HTML editing creates:
- High maintenance burden
- Risk of HTML/JS data mismatch
- No single source of truth for persona data

**Developer experience**: New personas should be added by simply updating `js/data.js` with no other file changes required.

---

## Proposed Solution

### 1. Center-align persona badges

Add `justify-content: center` to `.persona-badges` CSS:

```css
.persona-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 6px;
  justify-content: center;  /* NEW */
}
```

### 2. Dynamic badge generation

Convert static HTML badges to JavaScript-generated badges:

**Before** (index.html):
```html
<div class="persona-badges">
  <button class="persona-badge active" data-persona="su-shi">...</button>
  <button class="persona-badge active" data-persona="guo-xi">...</button>
  <!-- ... manually repeated for all 6 personas -->
</div>
```

**After** (index.html):
```html
<div class="persona-badges" id="persona-badges-container">
  <!-- Populated by JavaScript -->
</div>
```

**JavaScript** (persona-selector.js):
```javascript
function renderBadges() {
  const container = document.getElementById('persona-badges-container');
  const personas = window.VULCA_DATA.personas;

  personas.forEach(persona => {
    const badge = createBadgeElement(persona);
    container.appendChild(badge);
  });
}
```

### 3. Persona data schema documentation

Add inline JSDoc comments to `js/data.js`:

```javascript
/**
 * Persona schema for adding new critics:
 * @typedef {Object} Persona
 * @property {string} id - Unique identifier (kebab-case, e.g., "su-shi")
 * @property {string} nameZh - Chinese name
 * @property {string} nameEn - English name
 * @property {string} period - Time period description (中文)
 * @property {string} era - Era label (English)
 * @property {string} bio - Full biography (bilingual)
 * @property {string} color - Hex color for visual identity
 * @property {string} bias - Short bias description
 */
personas: [
  // Existing personas...
]
```

---

## What Changes

### Added

1. **Dynamic badge rendering** (persona-selector.js):
   - `renderBadges()` - Generate badges from VULCA_DATA
   - `createBadgeElement(persona)` - Create badge DOM with event listeners
   - Auto-initialize on DOMContentLoaded

2. **Persona schema documentation** (js/data.js):
   - JSDoc type definition for Persona object
   - Inline comments explaining each field
   - Example of minimal persona entry

### Modified

1. **CSS** (styles/main.css):
   - `.persona-badges`: Add `justify-content: center`

2. **HTML** (index.html):
   - Replace static badge HTML with empty container `#persona-badges-container`
   - Remove hardcoded 6 badge elements

3. **JavaScript** (persona-selector.js):
   - Move badge initialization to `renderBadges()`
   - Call `renderBadges()` in `init()`

### Removed

- Static HTML badge elements (replaced by dynamic generation)

---

## Non-Goals

- **Out of scope**: Admin UI for managing personas
- **Out of scope**: Database backend for persona storage
- **Out of scope**: Persona CRUD API endpoints
- **Out of scope**: Multi-language persona descriptions beyond zh/en

---

## Success Metrics

**Visual**:
- ✅ Badges are horizontally centered on all screen sizes (375px, 768px, 1920px)
- ✅ Center alignment matches other Data Insights section elements

**Extensibility**:
- ✅ Adding 7th persona only requires editing `js/data.js`
- ✅ Badge auto-generates with correct color, name, and behavior
- ✅ No HTML modification needed

**Documentation**:
- ✅ JSDoc clearly explains all persona fields
- ✅ Developer can add persona following documentation alone

---

## Dependencies

**Required**:
- Existing `window.VULCA_DATA.personas` array
- Existing persona-selector.js module
- Existing CSS persona-badge styles

**Optional**: None

---

## Timeline Estimate

**Total**: ~45 minutes

| Phase | Duration | Tasks |
|-------|----------|-------|
| Phase 1: CSS center alignment | 5 min | Add justify-content: center |
| Phase 2: Dynamic badge generation | 25 min | renderBadges(), createBadgeElement(), event listeners |
| Phase 3: Documentation | 10 min | JSDoc comments in data.js |
| Phase 4: Testing | 5 min | Verify on multiple screen sizes |

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Dynamic rendering breaks event listeners | Attach listeners inside `createBadgeElement()` before appending to DOM |
| Badge order changes unexpectedly | Maintain `personas` array order from data.js (no sorting) |
| Performance with many personas (20+) | Use document fragment for batch DOM insertion |
| Missing data breaks rendering | Add validation: skip personas missing required fields |

---

## Alternatives Considered

### Alternative 1: CSS Grid with justify-items
**Rejected**: Flex is simpler and already used. No need for grid complexity.

### Alternative 2: Admin UI for persona management
**Rejected**: Overkill for current needs. Direct file editing is sufficient.

### Alternative 3: Load personas from JSON file
**Rejected**: Adds HTTP request overhead. Personas are small enough to inline in data.js.

---

## References

- Current implementation: `styles/main.css` (line 2598-2603)
- Current HTML: `index.html` (lines 152-177)
- Persona data: `js/data.js` (lines 150-211)
- User request: Translated above
