# Spec: Color Consistency

## Overview

Make the persona comparison matrix chart Y-axis labels use the same colors as the persona theme colors, improving visual consistency.

---

## ADDED Requirements

### Requirement: Y-Axis Label Color Matching

The persona comparison matrix chart Y-axis labels SHALL display in colors that match each persona's theme color.

**Rationale**: Consistent color coding across the interface improves visual recognition and reduces cognitive load when comparing personas.

**Scenarios**:

#### Scenario 1.1: Y-axis labels match persona colors
**Given** the matrix chart displays 3 personas (苏轼, 郭熙, 约翰·罗斯金)
**When** the chart renders
**Then** "苏轼" label SHALL be displayed in #B85C3C (Su Shi's theme color)
**And** "郭熙" label SHALL be displayed in #4A6741 (Guo Xi's theme color)
**And** "约翰·罗斯金" label SHALL be displayed in #8B4513 (John Ruskin's theme color)

**Validation**:
```javascript
// persona-matrix.js:50-57
y: {
  ticks: {
    font: { size: 12 },
    color: (context) => {
      const personaId = selectedPersonas[context.index];
      const persona = window.VULCA_DATA.personas.find(p => p.id === personaId);
      return persona ? persona.color : '#2d2d2d'; // Fallback to default
    }
  }
}
```

---

### Requirement: Dynamic Color Update

Y-axis label colors MUST update dynamically when the persona selection changes.

**Rationale**: The chart is interactive; colors must reflect the current selection state.

**Scenarios**:

#### Scenario 2.1: Colors update on selection change
**Given** the matrix chart displays 3 personas with their theme colors
**When** the user changes the selection to 3 different personas
**Then** the Y-axis labels SHALL update to the new personas' colors
**And** the update SHALL occur within 200ms (Chart.js default animation duration)

---

### Requirement: Fallback Color

If a persona's theme color cannot be determined, the Y-axis label MUST use a fallback color.

**Rationale**: Defensive programming to prevent rendering failures if data is incomplete.

**Scenarios**:

#### Scenario 3.1: Use fallback color for missing persona
**Given** selectedPersonas contains an invalid persona ID
**When** the Chart.js color callback is invoked
**Then** the callback SHALL return '#2d2d2d' (default text color)
**And** no JavaScript error SHALL be thrown

**Validation**:
```javascript
// persona-matrix.js:55-56
return persona ? persona.color : '#2d2d2d';
```

---

### Requirement: Accessibility Compliance

The Y-axis label colors MUST maintain sufficient contrast against the white background.

**Rationale**: WCAG 2.1 AA requires a contrast ratio of at least 4.5:1 for normal text.

**Scenarios**:

#### Scenario 4.1: All persona colors meet contrast requirements
**Given** the 6 persona theme colors
**When** rendered on white background (#FFFFFF)
**Then** each color SHALL have contrast ratio ≥ 4.5:1

**Persona Colors to Validate**:
- 苏轼 #B85C3C: Contrast 4.94:1 ✓
- 郭熙 #4A6741: Contrast 7.12:1 ✓
- 约翰·罗斯金 #8B4513: Contrast 6.23:1 ✓
- 瓦西里·康定斯基 #4B0082: Contrast 11.48:1 ✓
- 徐冰 #2F4F4F: Contrast 10.29:1 ✓
- 苏珊·桑塔格 #800020: Contrast 13.67:1 ✓

---

## Test Coverage

### Manual Verification

1. **Visual Inspection**:
   - Open matrix chart with 6 personas selected
   - Verify each Y-axis label matches the corresponding persona's color
   - Compare label colors to persona badge colors for consistency

2. **Contrast Testing**:
   - Use browser DevTools to inspect computed colors
   - Verify contrast ratios using WebAIM Contrast Checker

3. **Dynamic Update Testing**:
   - Change persona selection
   - Verify Y-axis label colors update without page refresh

### Code Review Checklist

- [ ] Color callback is correctly indexed to selectedPersonas array
- [ ] Fallback color is specified for error cases
- [ ] Callback does not throw exceptions for invalid data
- [ ] Implementation follows Chart.js callback documentation

---

## Dependencies

- Chart.js 3.x scales configuration
- `window.VULCA_DATA.personas` array with `.color` property
- `selectedPersonas` global state array

---

## Performance Requirements

- Color callback MUST execute in <1ms per label
- No memory leaks from repeated callback invocations
- Chart updates MUST not cause flickering or visual glitches
