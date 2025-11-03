# Specification: Dynamic Badge Generation

**Capability**: `dynamic-badge-generation`
**Feature**: Center Persona Badges and Add Extensibility
**Last Updated**: 2025-11-03

---

## Purpose

Generate persona selector badges dynamically from `window.VULCA_DATA.personas` array, eliminating the need to manually edit HTML when adding new personas.

## ADDED Requirements

### Requirement: Badges SHALL be generated dynamically from data source

The persona-selector.js module SHALL read `window.VULCA_DATA.personas` array and generate corresponding badge button elements programmatically.

**Rationale**: Adding new personas should only require editing `js/data.js`. Manual HTML editing creates maintenance burden and risk of data/UI mismatch.

**Acceptance Criteria**:
- `renderBadges()` function generates badges from VULCA_DATA
- Each badge displays `nameZh` and `nameEn` from persona data
- Badge `data-persona` attribute set to persona `id`
- Badges render in same order as VULCA_DATA.personas array
- Event listeners attached during badge creation
- Rendering happens after VULCA_DATA validation
- Works with any number of personas (1-50+)

#### Scenario: System generates badges from 6-persona data array

**Given**: `window.VULCA_DATA.personas` contains 6 persona objects
**And**: HTML contains empty `<div id="persona-badges-container"></div>`
**When**: `persona-selector.js` initializes
**And**: `renderBadges()` is called
**Then**: 6 `<button class="persona-badge">` elements are created
**And**: Each badge displays correct Chinese and English names
**And**: Badges appear in order: Su Shi, Guo Xi, Ruskin, Mama Zola, Petrova, AI Ethics
**And**: All badges have correct `data-persona` attributes
**And**: Click/double-click listeners are attached and functional

**Code example**:
```javascript
function renderBadges() {
  const container = document.getElementById('persona-badges-container');
  if (!container) {
    console.error('PersonaSelection: badges container not found');
    return;
  }

  const personas = window.VULCA_DATA.personas;
  if (!Array.isArray(personas) || personas.length === 0) {
    console.error('PersonaSelection: personas data not available');
    return;
  }

  // Clear existing badges (for hot-reload support)
  container.innerHTML = '';

  personas.forEach(persona => {
    const badge = createBadgeElement(persona);
    container.appendChild(badge);
  });

  console.log(`✓ Rendered ${personas.length} persona badges`);
}
```

**DOM verification**:
```javascript
const badges = document.querySelectorAll('.persona-badge');
expect(badges.length).toBe(6);

const expectedIds = ['su-shi', 'guo-xi', 'john-ruskin', 'mama-zola', 'professor-petrova', 'ai-ethics'];
badges.forEach((badge, index) => {
  expect(badge.dataset.persona).toBe(expectedIds[index]);
});
```

---

#### Scenario: Adding 7th persona only requires editing data.js

**Given**: Current system has 6 personas
**When**: Developer adds 7th persona to `VULCA_DATA.personas`:
```javascript
{
  id: "walter-benjamin",
  nameZh: "瓦尔特·本雅明",
  nameEn: "Walter Benjamin",
  period: "德国批评家 (1892-1940)",
  era: "Modern German",
  bio: "...",
  color: "#8B4789",
  bias: "Mechanical reproduction, aura, dialectical images"
}
```
**And**: No HTML changes are made
**And**: No CSS changes are made (color added via data-persona attribute selector)
**And**: Page is refreshed
**Then**: 7 badges render automatically
**And**: "Walter Benjamin" badge appears at the end
**And**: Badge has correct color border when active (CSS uses `[data-persona="walter-benjamin"].active`)
**And**: Single-click/double-click interactions work identically to other badges

**Extensibility verification**:
```javascript
// Simulate adding persona
window.VULCA_DATA.personas.push({
  id: "walter-benjamin",
  nameZh: "瓦尔特·本雅明",
  nameEn: "Walter Benjamin",
  color: "#8B4789"
  // ... other fields
});

// Re-render
renderBadges();

const badges = document.querySelectorAll('.persona-badge');
expect(badges.length).toBe(7);

const lastBadge = badges[6];
expect(lastBadge.dataset.persona).toBe('walter-benjamin');
expect(lastBadge.querySelector('.badge-name').textContent).toBe('瓦尔特·本雅明');
expect(lastBadge.querySelector('.badge-name-en').textContent).toBe('Walter Benjamin');
```

---

### Requirement: Badge creation SHALL include all necessary DOM attributes and event listeners

The `createBadgeElement(persona)` function SHALL return a fully configured badge element with correct classes, attributes, content, and attached event handlers.

**Rationale**: Badges must be functionally identical to manually created ones, including accessibility and interaction.

**Acceptance Criteria**:
- Badge is `<button>` element (not `<div>`)
- Has `persona-badge` class
- Has `data-persona` attribute set to persona.id
- Contains `.badge-name` span with `nameZh`
- Contains `.badge-name-en` span with `nameEn`
- Has `aria-pressed` attribute (initially "false")
- Has `aria-label` with full persona name
- Has single-click/double-click event listeners attached
- Returns element ready to append to DOM

#### Scenario: createBadgeElement generates fully functional badge

**Given**: Persona object for Su Shi
**When**: `createBadgeElement(suShiData)` is called
**Then**: Returns `<button>` element with:
```html
<button
  class="persona-badge"
  data-persona="su-shi"
  aria-pressed="false"
  aria-label="苏轼 Su Shi"
>
  <span class="badge-name">苏轼</span>
  <span class="badge-name-en">Su Shi</span>
</button>
```
**And**: Element has click event listener attached
**And**: Clicking badge triggers `handleBadgeSingleClick()`
**And**: Double-clicking badge triggers `handleBadgeDoubleClick()`

**Function implementation**:
```javascript
function createBadgeElement(persona) {
  const badge = document.createElement('button');
  badge.className = 'persona-badge';
  badge.dataset.persona = persona.id;
  badge.setAttribute('aria-pressed', 'false');
  badge.setAttribute('aria-label', `${persona.nameZh} ${persona.nameEn}`);

  // Create name spans
  const nameZh = document.createElement('span');
  nameZh.className = 'badge-name';
  nameZh.textContent = persona.nameZh;

  const nameEn = document.createElement('span');
  nameEn.className = 'badge-name-en';
  nameEn.textContent = persona.nameEn;

  badge.appendChild(nameZh);
  badge.appendChild(nameEn);

  // Attach event listeners (single/double click logic)
  let clickTimeout = null;
  let lastClickTime = 0;
  let lastClickedBadge = null;

  badge.addEventListener('click', (event) => {
    const currentTime = Date.now();
    const timeSinceLastClick = currentTime - lastClickTime;

    if (timeSinceLastClick < 300 && lastClickedBadge === badge) {
      // Double click
      clearTimeout(clickTimeout);
      handleBadgeDoubleClick(persona.id, badge);
      lastClickTime = 0;
      lastClickedBadge = null;
    } else {
      // Single click
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

### Requirement: Badge rendering SHALL validate data before attempting generation

The system SHALL check for presence and validity of `window.VULCA_DATA.personas` before attempting to render badges.

**Rationale**: Missing or malformed data should fail gracefully with clear error messages, not cause runtime exceptions.

**Acceptance Criteria**:
- Check `window.VULCA_DATA` exists
- Check `window.VULCA_DATA.personas` exists
- Check `personas` is array
- Check array not empty
- Log clear error if validation fails
- Skip rendering if data invalid
- Don't break other initialization steps

#### Scenario: System handles missing personas data gracefully

**Given**: `window.VULCA_DATA` exists but `personas` array is undefined
**When**: `renderBadges()` is called
**Then**: Console logs error: "PersonaSelection: personas data not available"
**And**: No badges are rendered
**And**: No JavaScript exceptions thrown
**And**: Other persona-selector.js features continue to work (sessionStorage restore, etc.)

**Validation code**:
```javascript
function renderBadges() {
  const container = document.getElementById('persona-badges-container');
  if (!container) {
    console.error('PersonaSelection: badges container not found');
    return;
  }

  if (!window.VULCA_DATA) {
    console.error('PersonaSelection: VULCA_DATA not loaded');
    return;
  }

  const personas = window.VULCA_DATA.personas;
  if (!Array.isArray(personas)) {
    console.error('PersonaSelection: personas must be an array');
    return;
  }

  if (personas.length === 0) {
    console.warn('PersonaSelection: personas array is empty');
    return;
  }

  // Proceed with rendering...
}
```

---

#### Scenario: System handles malformed persona objects gracefully

**Given**: `VULCA_DATA.personas` contains an object missing required `id` field
**When**: `renderBadges()` iterates over personas
**Then**: The malformed persona is skipped (not rendered)
**And**: Console logs warning: "PersonaSelection: skipping persona without id"
**And**: Valid personas still render correctly
**And**: System doesn't crash

**Defensive rendering**:
```javascript
personas.forEach(persona => {
  // Validate required fields
  if (!persona.id || !persona.nameZh || !persona.nameEn) {
    console.warn('PersonaSelection: skipping invalid persona', persona);
    return; // Skip this persona
  }

  const badge = createBadgeElement(persona);
  container.appendChild(badge);
});
```

---

### Requirement: Dynamic badges SHALL synchronize with initial selection state

After rendering badges, the system SHALL apply the `active` class and `aria-pressed="true"` to badges matching the current `selectedPersonas` state.

**Rationale**: Default selection (Su Shi, Guo Xi, Ruskin) must be visually reflected immediately on page load.

**Acceptance Criteria**:
- `syncBadgesWithState()` called after `renderBadges()`
- Badges matching `selectedPersonas` get `.active` class
- Badges matching `selectedPersonas` get `aria-pressed="true"`
- Other badges remain inactive
- Works with sessionStorage-restored selection
- Works with default selection

#### Scenario: Default selection reflected in rendered badges

**Given**: `selectedPersonas` default is `['su-shi', 'guo-xi', 'john-ruskin']`
**And**: No sessionStorage data exists
**When**: Page loads and badges render
**And**: `syncBadgesWithState()` is called
**Then**: Su Shi badge has `.active` class and `aria-pressed="true"`
**And**: Guo Xi badge has `.active` class and `aria-pressed="true"`
**And**: Ruskin badge has `.active` class and `aria-pressed="true"`
**And**: Mama Zola badge does NOT have `.active` class, has `aria-pressed="false"`
**And**: Petrova badge does NOT have `.active` class, has `aria-pressed="false"`
**And**: AI Ethics badge does NOT have `.active` class, has `aria-pressed="false"`

**Initialization sequence**:
```javascript
function init() {
  // 1. Restore from sessionStorage if available
  const restored = restoreSelection();

  if (!restored) {
    console.log('✓ Persona selection initialized with defaults:', selectedPersonas);
  }

  // 2. Render badges from data
  renderBadges();

  // 3. Sync badges with current selection (default or restored)
  syncBadgesWithState();

  // 4. Initialize UI handlers (after badges exist)
  initUIHandlers();
}
```

---

## Non-Requirements

- **Out of scope**: Lazy loading badges (render all on init)
- **Out of scope**: Virtual scrolling for 100+ personas
- **Out of scope**: Badge sorting/filtering UI
- **Out of scope**: Badge animations during rendering
- **Out of scope**: Persona search functionality

---

## Dependencies

**Required**:
- `window.VULCA_DATA.personas` array (loaded from js/data.js)
- Empty `#persona-badges-container` element in HTML
- Existing `syncBadgesWithState()` function
- Existing CSS `.persona-badge` styles

**Optional**: None

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

Uses standard DOM APIs: `createElement`, `appendChild`, `addEventListener`.

---

## Performance Impact

**Rendering time**:
- 6 personas: ~5-10ms (negligible)
- 20 personas: ~15-30ms (acceptable)
- 100 personas: ~100-200ms (still acceptable, no optimization needed)

**Memory**: ~2KB per badge × persona count

**No performance concerns at projected scale (10-20 personas).**

---

## Validation

**Manual testing**:
- [ ] 6 badges render on page load
- [ ] Default 3 badges show as active
- [ ] Adding 7th persona to data.js renders 7 badges
- [ ] Badges display correct names (Chinese + English)
- [ ] Click/double-click interactions work
- [ ] Missing personas data logs error without crashing

**Automated testing**:
```javascript
describe('Dynamic Badge Generation', () => {
  it('should render badges from VULCA_DATA', () => {
    renderBadges();
    const badges = document.querySelectorAll('.persona-badge');
    expect(badges.length).toBe(window.VULCA_DATA.personas.length);
  });

  it('should create badge with correct structure', () => {
    const persona = window.VULCA_DATA.personas[0];
    const badge = createBadgeElement(persona);

    expect(badge.tagName).toBe('BUTTON');
    expect(badge.className).toBe('persona-badge');
    expect(badge.dataset.persona).toBe(persona.id);
    expect(badge.querySelector('.badge-name').textContent).toBe(persona.nameZh);
    expect(badge.querySelector('.badge-name-en').textContent).toBe(persona.nameEn);
  });

  it('should sync active state after rendering', () => {
    selectedPersonas = ['su-shi', 'guo-xi'];
    renderBadges();
    syncBadgesWithState();

    const suShiBadge = document.querySelector('[data-persona="su-shi"]');
    const guoXiBadge = document.querySelector('[data-persona="guo-xi"]');
    const ruskinBadge = document.querySelector('[data-persona="john-ruskin"]');

    expect(suShiBadge.classList.contains('active')).toBe(true);
    expect(guoXiBadge.classList.contains('active')).toBe(true);
    expect(ruskinBadge.classList.contains('active')).toBe(false);
  });
});
```
