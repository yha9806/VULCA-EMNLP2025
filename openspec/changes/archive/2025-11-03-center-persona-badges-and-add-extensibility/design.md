# Design: Center Persona Badges and Add Extensibility

**Change ID**: `center-persona-badges-and-add-extensibility`
**Last Updated**: 2025-11-03

---

## Overview

This change addresses two related concerns: visual alignment of persona badges and system extensibility for adding new personas. The solution balances immediate UI fixes with forward-looking architecture.

---

## Key Design Decisions

### Decision 1: Center alignment via CSS justify-content

**Context**: Persona badges are currently left-aligned, breaking visual consistency with centered elements in the Data Insights section.

**Options considered**:
- **A**: Add `justify-content: center` to flex container
- **B**: Use CSS Grid with `justify-items: center`
- **C**: Add margin:auto to individual badges

**Decision**: **Option A** - justify-content: center

**Rationale**:
- Simplest one-line change
- Flex is already used for layout
- No need to restructure existing CSS
- Works with dynamic badge count (flex-wrap maintains center alignment)

**Trade-offs**:
- ✅ Simple, minimal change
- ✅ Responsive by default
- ❌ Doesn't work with fixed-width badges (but we use flex sizing)

---

### Decision 2: Dynamic badge generation from data

**Context**: Adding new personas requires editing both data.js AND index.html, creating maintenance burden.

**Options considered**:
- **A**: Keep static HTML, just document the process
- **B**: Generate badges dynamically from VULCA_DATA.personas
- **C**: Create separate persona-config.json file
- **D**: Build admin UI for persona management

**Decision**: **Option B** - Dynamic generation from existing data.js

**Rationale**:
- Single source of truth (data.js already exists)
- No new files or HTTP requests
- Automatic synchronization between data and UI
- Enables future enhancements (search, filtering, sorting)
- User confirmed they only want to edit data.js

**Trade-offs**:
- ✅ Zero maintenance overhead for new personas
- ✅ No data/UI sync issues
- ✅ Extensible for future features
- ❌ Slight initial rendering delay (negligible for 6-10 personas)
- ❌ Requires JavaScript (but already a requirement)

**Rejected alternatives**:
- **A**: Doesn't solve extensibility problem
- **C**: Adds complexity and HTTP request overhead
- **D**: Overkill for current scale (6 personas, may grow to 10-15)

---

### Decision 3: Render timing strategy

**Context**: When should badges be generated to ensure VULCA_DATA is loaded?

**Options considered**:
- **A**: Render in persona-selector.js init()
- **B**: Render immediately in <script> tag after data.js
- **C**: Use DOMContentLoaded event

**Decision**: **Option A** - Render in init() after VULCA_DATA validation

**Rationale**:
- persona-selector.js already validates VULCA_DATA presence
- Consistent with existing initialization pattern
- Script load order guarantees data.js loads first (index.html line 358)

**Implementation**:
```javascript
function init() {
  // Restore from sessionStorage if available
  const restored = restoreSelection();

  if (!restored) {
    console.log('✓ Persona selection initialized with defaults:', selectedPersonas);
  }

  // NEW: Render badges from data
  renderBadges();

  // Initialize UI handlers (now waits for badges to exist)
  initUIHandlers();
}
```

---

### Decision 4: Event listener attachment pattern

**Context**: How should click/double-click listeners be attached to dynamically created badges?

**Options considered**:
- **A**: Event delegation on container
- **B**: Direct attachment in createBadgeElement()
- **C**: Hybrid: delegation for single-click, direct for double-click

**Decision**: **Option B** - Direct attachment during creation

**Rationale**:
- Consistent with current pattern (badges are known at creation time)
- Simpler code (no event.target checks)
- Better performance for small badge counts (<20)
- Easier to debug (direct listener on element)

**Code pattern**:
```javascript
function createBadgeElement(persona) {
  const badge = document.createElement('button');
  // ... set attributes ...

  // Attach listeners immediately
  let clickTimeout = null;
  let lastClickTime = 0;

  badge.addEventListener('click', (event) => {
    // Handle single/double click logic
  });

  return badge;
}
```

**Trade-off**: If we later add 50+ personas, should reconsider event delegation for performance.

---

### Decision 5: Badge order and default selection

**Context**: In what order should badges render, and which should be pre-selected?

**Options considered**:
- **A**: Render in VULCA_DATA.personas array order
- **B**: Sort by era (ancient → modern)
- **C**: Sort by color hue

**Decision**: **Option A** - Preserve data.js array order

**Rationale**:
- Data.js order is already meaningful (curated by content creators)
- No implicit sorting assumptions
- Easy to reorder by simply editing array order
- Default selection (su-shi, guo-xi, john-ruskin) already works with current order

**Default selection logic**:
```javascript
// Keep existing default from persona-selector.js line 12
let selectedPersonas = ['su-shi', 'guo-xi', 'john-ruskin'];

// Sync badges after rendering
syncBadgesWithState();
```

---

### Decision 6: Documentation format

**Context**: How should persona schema be documented for future developers?

**Options considered**:
- **A**: Separate PERSONAS.md file
- **B**: Inline JSDoc comments in data.js
- **C**: TypeScript definitions file

**Decision**: **Option B** - Inline JSDoc in data.js

**Rationale**:
- Documentation lives next to data (single file to edit)
- JSDoc provides IDE autocomplete without TypeScript
- No build step required
- Immediately visible to any developer opening data.js

**Format**:
```javascript
/**
 * Persona schema for art critic profiles
 *
 * @typedef {Object} Persona
 * @property {string} id - Unique identifier (kebab-case, e.g., "su-shi")
 * @property {string} nameZh - Chinese display name
 * @property {string} nameEn - English display name
 * @property {string} period - Time period/role description (中文)
 * @property {string} era - Era classification (English)
 * @property {string} bio - Full biography (~300-500 words, bilingual)
 * @property {string} color - Hex color code for visual identity (#RRGGBB)
 * @property {string} bias - Short critical perspective summary
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

## Performance Considerations

**Badge rendering**: O(n) where n = persona count
- Current: 6 personas × ~50ms each = 300ms (negligible)
- Future: 20 personas × ~50ms each = 1000ms (still acceptable)
- Threshold: 50+ personas may need optimization (document fragment, virtual scrolling)

**Memory**: 6 badge DOM elements × ~2KB each = ~12KB (negligible)

**No performance concerns at current or projected scale.**

---

## Accessibility Considerations

Dynamic badges must maintain full accessibility:

```javascript
function createBadgeElement(persona) {
  const badge = document.createElement('button');
  badge.className = 'persona-badge';
  badge.dataset.persona = persona.id;
  badge.setAttribute('aria-pressed', 'false');  // Toggled on click
  badge.setAttribute('role', 'button');
  badge.setAttribute('aria-label', `${persona.nameZh} ${persona.nameEn}`);

  // ... content and listeners ...

  return badge;
}
```

**Keyboard navigation**: Maintained via native <button> semantics
**Screen readers**: ARIA attributes announce selection state

---

## Future Extensibility

This design enables future enhancements without breaking changes:

1. **Search/filter**: Add input above badges, filter rendered badges by name
2. **Persona categories**: Group badges by era/tradition/region
3. **Lazy loading**: Only render visible badges for 100+ personas
4. **Persona details**: Click to expand biography modal
5. **Sorting**: Add dropdown to sort by name/era/color

**All future features can leverage the same `VULCA_DATA.personas` data source.**

---

## Rollback Plan

If dynamic rendering causes issues:

1. Revert to static HTML badges (git checkout)
2. Apply only the CSS centering change
3. Document manual badge addition process

**Low risk**: Dynamic rendering is straightforward, well-tested pattern.
