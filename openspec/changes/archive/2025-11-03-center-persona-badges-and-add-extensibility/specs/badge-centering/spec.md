# Specification: Badge Centering

**Capability**: `badge-centering`
**Feature**: Center Persona Badges and Add Extensibility
**Last Updated**: 2025-11-03

---

## Purpose

Center-align persona badge buttons in the Data Insights section to match the visual alignment of other section elements (viz-header, help-text, viz-grid).

## MODIFIED Requirements

### Requirement: Persona badges SHALL be center-aligned horizontally

The persona badge container SHALL use flexbox centering to align badges horizontally centered within their container.

**Rationale**: All other Data Insights section elements (header, help text, visualization grid) use centered alignment. Left-aligned badges break visual consistency and appear unfinished.

**Acceptance Criteria**:
- `.persona-badges` container uses `justify-content: center`
- Badges center-align on all screen sizes (375px, 768px, 1440px, 1920px)
- Center alignment maintained when flex-wrap occurs on narrow screens
- No horizontal scrolling on any screen size

#### Scenario: Badges center-align on desktop

**Given**: User views Data Insights section on desktop (1920px wide)
**And**: 6 persona badges fit on single row
**When**: The page renders
**Then**: The badges are horizontally centered in the container
**And**: Empty space is distributed equally on left and right sides
**And**: The badge row aligns with the centered "数据洞察" header above

**Visual assertion**:
```
┌─────────────────────────────────────────────┐
│           数据洞察 / Data Insights          │  ← Centered header
├─────────────────────────────────────────────┤
│                                              │
│     [苏轼]  [郭熙]  [约翰·罗斯金]           │  ← Centered badges
│     [佐拉妈妈]  [埃琳娜·佩特洛娃教授]  [AI]  │
│                                              │
│     单击选择，双击取消 · 可选择任意数量     │  ← Centered help text
└─────────────────────────────────────────────┘
```

**CSS verification**:
```javascript
const container = document.querySelector('.persona-badges');
const computedStyle = getComputedStyle(container);
expect(computedStyle.justifyContent).toBe('center');
```

---

#### Scenario: Badges center-align on mobile with wrapping

**Given**: User views Data Insights section on mobile (375px wide)
**And**: Badges wrap to multiple rows due to narrow screen
**When**: The page renders
**Then**: Each row of badges is center-aligned independently
**And**: No badges overflow container
**And**: Vertical spacing (gap) between rows is consistent

**Visual assertion** (mobile portrait):
```
┌────────────────────┐
│   数据洞察         │  ← Centered header
├────────────────────┤
│                    │
│   [苏轼]  [郭熙]   │  ← Row 1 centered
│   [约翰·罗斯金]    │  ← Row 2 centered
│   [佐拉妈妈]       │  ← Row 3 centered
│   [埃琳娜·佩特洛娃教授] │  ← Row 4 centered
│   [AI]            │  ← Row 5 centered
│                    │
│  单击选择，双击取消 │  ← Centered help text
└────────────────────┘
```

**Responsive verification**:
```javascript
// Test at 375px viewport
window.resizeTo(375, 667);
const badges = Array.from(document.querySelectorAll('.persona-badge'));
const container = document.querySelector('.persona-badges');

// Check no overflow
badges.forEach(badge => {
  const rect = badge.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  expect(rect.left).toBeGreaterThanOrEqual(containerRect.left);
  expect(rect.right).toBeLessThanOrEqual(containerRect.right);
});
```

---

#### Scenario: Center alignment maintained when badges are dynamically added/removed

**Given**: User has selected 3 personas (Su Shi, Guo Xi, Ruskin)
**And**: Badges are center-aligned
**When**: User clicks to add Mama Zola (4th badge becomes active)
**Then**: All 4 active badges remain center-aligned
**And**: Container re-centers to accommodate new selection
**When**: User double-clicks Guo Xi to remove it (3 badges remain active)
**Then**: The remaining 3 badges stay center-aligned
**And**: No visual jump or layout shift occurs

**Dynamic alignment verification**:
```javascript
// Initial state: 3 selected
let container = document.querySelector('.persona-badges');
let initialCenter = container.getBoundingClientRect().left + container.getBoundingClientRect().width / 2;

// Add 4th badge
document.querySelector('[data-persona="mama-zola"]').click();
await new Promise(resolve => setTimeout(resolve, 100)); // Wait for animation

let newCenter = container.getBoundingClientRect().left + container.getBoundingClientRect().width / 2;
expect(Math.abs(newCenter - initialCenter)).toBeLessThan(1); // Center position unchanged

// Badges should still be centered
const computedStyle = getComputedStyle(container);
expect(computedStyle.justifyContent).toBe('center');
```

---

### Requirement: Center alignment SHALL NOT affect badge functionality

The CSS centering change SHALL NOT break existing click, double-click, hover, or keyboard navigation behaviors.

**Rationale**: Visual alignment is purely cosmetic and must not interfere with interaction logic.

**Acceptance Criteria**:
- Single-click toggle selection works identically to before
- Double-click deselect works identically to before
- Hover effects trigger correctly
- Keyboard Tab navigation order unchanged
- ARIA attributes remain intact
- Event listeners fire as expected

#### Scenario: Badge click behavior unaffected by centering

**Given**: Badges are center-aligned
**When**: User single-clicks inactive "Mama Zola" badge
**Then**: Badge becomes active (gains `.active` class)
**And**: `aria-pressed` updates to `"true"`
**And**: `persona:selectionChanged` event fires
**And**: Radar and matrix charts update
**When**: User single-clicks the now-active badge again
**Then**: Badge becomes inactive (loses `.active` class)
**And**: `aria-pressed` updates to `"false"`
**And**: `persona:selectionChanged` event fires again

**Functional verification**:
```javascript
const badge = document.querySelector('[data-persona="mama-zola"]');
const eventSpy = jest.fn();
window.addEventListener('persona:selectionChanged', eventSpy);

// Click to activate
badge.click();
expect(badge.classList.contains('active')).toBe(true);
expect(badge.getAttribute('aria-pressed')).toBe('true');
expect(eventSpy).toHaveBeenCalledTimes(1);

// Click to deactivate
badge.click();
await new Promise(resolve => setTimeout(resolve, 350)); // Wait for double-click timeout
expect(badge.classList.contains('active')).toBe(false);
expect(badge.getAttribute('aria-pressed')).toBe('false');
expect(eventSpy).toHaveBeenCalledTimes(2);
```

---

## Non-Requirements

- **Out of scope**: Vertical alignment (badges already correctly positioned)
- **Out of scope**: Badge size or spacing changes
- **Out of scope**: Animation of center alignment transition
- **Out of scope**: RTL (right-to-left) language support

---

## Dependencies

**Required**:
- Existing `.persona-badges` container (index.html)
- Existing flexbox layout with `display: flex` and `flex-wrap: wrap`

**Optional**: None

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

All browsers support `justify-content: center` on flex containers.

---

## Performance Impact

**Expected**: None. This is a single CSS property change.

**No layout reflow** - Flexbox recalculation is negligible (<1ms on desktop).

---

## Validation

**Manual testing**:
- [ ] View on desktop (1920px) - badges centered
- [ ] View on tablet (768px) - badges centered, may wrap
- [ ] View on mobile (375px) - badges centered, multiple rows
- [ ] Click badges - functionality unchanged
- [ ] Double-click badges - functionality unchanged
- [ ] Keyboard navigation (Tab) - order unchanged

**Automated testing**:
```javascript
describe('Badge Centering', () => {
  it('should center-align badges in container', () => {
    const container = document.querySelector('.persona-badges');
    const computedStyle = getComputedStyle(container);
    expect(computedStyle.justifyContent).toBe('center');
  });

  it('should maintain center alignment across screen sizes', () => {
    const viewports = [375, 768, 1440, 1920];
    viewports.forEach(width => {
      window.resizeTo(width, 800);
      const container = document.querySelector('.persona-badges');
      const computedStyle = getComputedStyle(container);
      expect(computedStyle.justifyContent).toBe('center');
    });
  });
});
```
