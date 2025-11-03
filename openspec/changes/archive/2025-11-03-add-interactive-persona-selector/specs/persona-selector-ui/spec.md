# Specification: Persona Selector UI Component

**Capability**: `persona-selector-ui`
**Feature**: Add Interactive Persona Selector
**Last Updated**: 2025-11-03

---

## Purpose

Provide a global multi-select dropdown UI that allows users to choose 1-3 personas for comparison across data visualizations in the Data Insights section.

## ADDED Requirements

### Requirement: Multi-Select Dropdown Component

The persona selector SHALL be implemented as a multi-select dropdown with checkboxes, positioned above the visualization grid in the Data Insights section.

**Rationale**: Users need a clear, accessible way to select which personas to compare in the radar chart and matrix chart. A multi-select dropdown is familiar, compact, and works well on all devices.

**Acceptance Criteria**:
- Multi-select `<select>` element with 6 persona options
- Each option displays: "中文名 English Name" (e.g., "苏轼 Su Shi")
- Options color-coded with persona theme colors (background with 20% opacity)
- Label reads "选择评论家 Select Personas (最多3位)"
- Positioned immediately below "数据洞察 / Data Insights" section header
- Help text below dropdown: "按住 Ctrl/Cmd 选择多位评论家"

#### Scenario: User opens the Data Insights section

**Given**: User scrolls to the Data Insights section on the homepage
**When**: The section comes into view
**Then**: The persona selector dropdown appears above the visualization grid
**And**: The dropdown shows 3 pre-selected personas (Su Shi, Guo Xi, John Ruskin)
**And**: The label "选择评论家 Select Personas (最多3位)" is visible
**And**: Help text "按住 Ctrl/Cmd 选择多位评论家" appears below the dropdown

**Example Code**:
```html
<div class="persona-selector-wrapper">
  <label for="persona-select">选择评论家 Select Personas (最多3位)</label>
  <select id="persona-select" multiple size="6"
          aria-label="选择评论家进行对比分析"
          aria-describedby="persona-help">
    <option value="su-shi" selected>苏轼 Su Shi</option>
    <option value="guo-xi" selected>郭熙 Guo Xi</option>
    <option value="john-ruskin" selected>约翰·罗斯金 John Ruskin</option>
    <option value="mama-zola">佐拉妈妈 Mama Zola</option>
    <option value="professor-petrova">埃琳娜·佩特洛娃教授 Professor Petrova</option>
    <option value="ai-ethics">AI伦理评审员 AI Ethics Reviewer</option>
  </select>
  <p id="persona-help" class="help-text">按住 Ctrl/Cmd 选择多位评论家</p>
</div>
```

---

#### Scenario: User selects a fourth persona

**Given**: User has already selected 3 personas (Su Shi, Guo Xi, Ruskin)
**When**: User attempts to select a fourth persona (Mama Zola) while holding Ctrl/Cmd
**Then**: An alert appears with message "最多选择3位评论家进行对比"
**And**: The fourth persona is NOT selected
**And**: The dropdown reverts to showing only the original 3 selections
**And**: Focus returns to the dropdown

**Example Code**:
```javascript
// In persona-selector.js
selectElement.addEventListener('change', (e) => {
  const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);

  if (selected.length > 3) {
    e.preventDefault();
    alert('最多选择3位评论家进行对比');
    // Revert to previous selection
    restorePreviousSelection();
    return;
  }

  window.PersonaSelection.setSelection(selected);
});
```

---

### Requirement: Preset Selection Buttons

Three preset buttons SHALL be provided next to the dropdown for quick persona selection: "古代", "现代", and "全部".

**Rationale**: Users want quick access to common comparison groups without manually selecting individual personas. Presets reduce cognitive load and speed up exploration.

**Acceptance Criteria**:
- Three buttons displayed horizontally next to the dropdown
- "古代" button selects: Su Shi + Guo Xi (2 ancient Chinese critics)
- "现代" button selects: John Ruskin + Professor Petrova + AI Ethics Reviewer (3 modern critics)
- "全部" button attempts to select all 6 but shows error (> 3 limit)
- Buttons have hover state and active state feedback
- Clicking a preset replaces current selection entirely

#### Scenario: User clicks "古代" preset button

**Given**: User has Su Shi, Guo Xi, and Ruskin selected
**When**: User clicks the "古代" button
**Then**: The dropdown selection changes to only Su Shi and Guo Xi
**And**: John Ruskin is deselected
**And**: The charts update to show only Su Shi and Guo Xi
**And**: No error message appears (2 personas is within limit)

**Example Code**:
```javascript
// In persona-selector.js
const presets = {
  ancient: ['su-shi', 'guo-xi'],
  modern: ['john-ruskin', 'professor-petrova', 'ai-ethics'],
  all: ['su-shi', 'guo-xi', 'john-ruskin', 'mama-zola', 'professor-petrova', 'ai-ethics']
};

document.querySelector('[data-preset="ancient"]').addEventListener('click', () => {
  setDropdownSelection(presets.ancient);
  window.PersonaSelection.setSelection(presets.ancient);
});
```

---

#### Scenario: User clicks "全部" preset button

**Given**: User has any personas selected
**When**: User clicks the "全部" button
**Then**: An alert appears with message "最多选择3位评论家，请手动调整"
**And**: The selection does NOT change
**And**: The charts do NOT update
**And**: Focus returns to the preset button

**Example Code**:
```javascript
document.querySelector('[data-preset="all"]').addEventListener('click', () => {
  if (presets.all.length > 3) {
    alert('最多选择3位评论家，请手动调整');
    return;
  }
  setDropdownSelection(presets.all);
  window.PersonaSelection.setSelection(presets.all);
});
```

---

### Requirement: Visual Feedback and Styling

The persona selector SHALL use color-coding and visual states to indicate selection status and persona identity.

**Rationale**: Visual feedback helps users understand current selection state and creates visual consistency with chart colors.

**Acceptance Criteria**:
- Each dropdown option has background color matching `persona.color` at 20% opacity
- Selected options have background color at 40% opacity
- Dropdown has rounded corners (8px) and subtle border
- Preset buttons have pill shape (border-radius: 20px)
- Active preset button has darker background
- Disabled state (if applicable) shown with 50% opacity

#### Scenario: User views the persona selector on desktop (1920px)

**Given**: User is viewing the page on a desktop browser at 1920px width
**When**: The persona selector renders
**Then**: The dropdown has width of 400px
**And**: Each option displays persona name in both Chinese and English
**And**: Su Shi's option has reddish-brown background (#B85C3C at 20% opacity)
**And**: Guo Xi's option has blue-green background (#4A7C7E at 20% opacity)
**And**: Selected options have 40% opacity background
**And**: Preset buttons are displayed in a row to the right of the dropdown

**Example CSS**:
```css
.persona-selector-wrapper {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
}

#persona-select {
  width: 400px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
}

#persona-select option {
  padding: 0.5rem;
  border-radius: 4px;
  margin-bottom: 2px;
}

#persona-select option[value="su-shi"] {
  background-color: rgba(184, 92, 60, 0.2);
}

#persona-select option:checked {
  background-color: rgba(184, 92, 60, 0.4);
  font-weight: 600;
}

.preset-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.preset-btn:hover {
  background: #f0f0f0;
}
```

---

### Requirement: Responsive Design

The persona selector SHALL adapt to different screen sizes while maintaining usability on mobile devices.

**Rationale**: Users access the site on various devices. The selector must work on touch screens and small viewports.

**Acceptance Criteria**:
- Desktop (≥1024px): Dropdown and presets in horizontal row
- Tablet (768-1023px): Dropdown full width, presets below
- Mobile (≤767px): Dropdown full width, presets stack vertically
- Touch-friendly: All interactive elements ≥44px tall
- Dropdown scrollable on small screens

#### Scenario: User views persona selector on mobile (375px)

**Given**: User is viewing the page on a mobile device at 375px width
**When**: The Data Insights section loads
**Then**: The persona selector dropdown spans full width (100%)
**And**: The preset buttons are stacked vertically below the dropdown
**And**: Each preset button is at least 44px tall for touch targets
**And**: The dropdown options are large enough to tap comfortably
**And**: Help text wraps to multiple lines if needed

**Example CSS**:
```css
@media (max-width: 767px) {
  .persona-selector-wrapper {
    flex-direction: column;
    gap: 1rem;
  }

  #persona-select {
    width: 100%;
  }

  .preset-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }

  .preset-btn {
    width: 100%;
    min-height: 44px;
    font-size: 1rem;
  }
}
```

---

### Requirement: Accessibility Compliance

The persona selector SHALL be fully accessible to keyboard users and screen reader users, following WCAG 2.1 AA standards.

**Rationale**: All users, including those with disabilities, must be able to select personas and compare visualizations.

**Acceptance Criteria**:
- Dropdown has `aria-label="选择评论家进行对比分析"`
- Dropdown has `aria-describedby` pointing to help text
- Live region announces selection changes (`aria-live="polite"`)
- Preset buttons have `aria-label` describing their function
- Keyboard navigation: Tab, Arrow keys, Space, Enter all work
- Focus visible with 2px outline

#### Scenario: Screen reader user selects personas

**Given**: User is navigating with NVDA screen reader on Windows
**When**: User tabs to the persona selector dropdown
**Then**: NVDA announces: "选择评论家进行对比分析, multi-select listbox, 3 of 6 selected"
**When**: User presses Down Arrow key twice to navigate options
**Then**: NVDA announces each persona name as focus moves
**When**: User presses Space to select/deselect an option
**Then**: NVDA announces: "苏轼 Su Shi, selected" or "deselected"
**And**: The live region announces total selection: "已选择 3 位评论家"

**Example HTML**:
```html
<select
  id="persona-select"
  multiple
  aria-label="选择评论家进行对比分析"
  aria-describedby="persona-help persona-count"
>
  <!-- options -->
</select>
<div id="persona-count" class="sr-only" aria-live="polite" aria-atomic="true">
  已选择 3 位评论家
</div>
<button
  class="preset-btn"
  data-preset="ancient"
  aria-label="快速选择古代评论家：苏轼和郭熙"
>
  古代
</button>
```

---

## Non-Requirements

- **Out of Scope**: Drag-and-drop reordering of selected personas
- **Out of Scope**: Search/filter functionality within dropdown
- **Out of Scope**: Custom checkboxes with persona avatars
- **Out of Scope**: Saving favorite persona combinations to user account

---

## Dependencies

**Required Data**: `window.VULCA_DATA.personas` (array of 6 persona objects with `id`, `nameZh`, `nameEn`, `color`)
**Required APIs**: None
**Required Modules**: `persona-selector.js` (new), `window.PersonaSelection` state manager (new)

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

---

## Performance Impact

**Expected**:
- DOM nodes added: ~15 (dropdown + options + buttons)
- JavaScript execution: <10ms (event listeners)
- CSS file size: +500 bytes
- Memory usage: ~2KB for state management

---

## Validation

**Manual Testing**:
- [ ] Dropdown renders with 3 personas pre-selected
- [ ] Selecting 4th persona shows error and reverts
- [ ] Preset buttons select correct persona combinations
- [ ] "全部" button shows error (> 3 limit)
- [ ] Color-coding matches persona theme colors
- [ ] Responsive layout works on 375px, 768px, 1920px
- [ ] Keyboard navigation functional (Tab, Arrow, Space, Enter)
- [ ] Screen reader announces all states correctly
- [ ] Help text visible and readable

**Automated Testing**:
```javascript
// Test suite: Persona Selector UI
describe('Persona Selector Component', () => {
  it('should render with 3 default selections', () => {
    const selected = Array.from(
      document.querySelectorAll('#persona-select option:checked')
    );
    expect(selected.length).toBe(3);
    expect(selected.map(opt => opt.value)).toContain('su-shi');
  });

  it('should prevent selecting more than 3 personas', () => {
    const dropdown = document.getElementById('persona-select');
    // Simulate selecting 4 options
    // Expect alert to be called
    // Expect selection to revert to 3
  });

  it('should apply correct background colors', () => {
    const suShiOption = document.querySelector('[value="su-shi"]');
    const bgColor = window.getComputedStyle(suShiOption).backgroundColor;
    expect(bgColor).toContain('rgba(184, 92, 60'); // #B85C3C
  });
});
```
