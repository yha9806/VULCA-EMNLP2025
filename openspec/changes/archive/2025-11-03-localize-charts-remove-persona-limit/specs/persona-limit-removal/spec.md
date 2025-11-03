# Spec: Persona Limit Removal

## Overview

Remove the 3-persona display limit from the RPAIT radar chart, allowing users to view all selected personas simultaneously.

---

## ADDED Requirements

### Requirement: Radar Chart Display Without Limit

The RPAIT radar chart SHALL render datasets for all personas in the `selectedPersonas` array without imposing a maximum limit.

**Rationale**: Users need the ability to compare all 6 personas simultaneously for comprehensive academic analysis. The current `.slice(0, 3)` restriction arbitrarily limits this functionality.

**Scenarios**:

#### Scenario 1.1: Display all 6 personas
**Given** the user has selected all 6 personas (苏轼, 郭熙, 约翰·罗斯金, 瓦西里·康定斯基, 徐冰, 苏珊·桑塔格)
**When** the radar chart renders
**Then** all 6 persona datasets SHALL be visible on the chart
**And** each dataset SHALL have distinct colors and labels

**Validation**:
```javascript
// rpait-radar.js:101
const datasets = selectedPersonas.map(personaId => {
  // NO .slice(0, 3) restriction
```

---

### Requirement: Session Storage Limit Removal

The persona selection state manager SHALL persist any number of selected personas to sessionStorage without enforcing an upper limit.

**Rationale**: The storage validation currently rejects arrays with more than 3 personas, preventing the radar chart limit removal from working correctly after page refresh.

**Scenarios**:

#### Scenario 2.1: Persist 6 persona selections
**Given** the user has selected 6 personas
**When** the selection is persisted to sessionStorage
**Then** all 6 persona IDs SHALL be stored
**And** no validation error SHALL occur

**Validation**:
```javascript
// persona-selector.js:107
if (Array.isArray(parsed) && parsed.length > 0) {
  // NO && parsed.length <= 3 restriction
```

#### Scenario 2.2: Restore 6 persona selections
**Given** sessionStorage contains 6 persona IDs
**When** the page loads
**Then** all 6 personas SHALL be restored to selectedPersonas
**And** the radar chart SHALL display all 6 datasets

---

### Requirement: Chart Reactivity Preservation

The radar chart MUST update immediately when the persona selection changes, regardless of how many personas are selected.

**Rationale**: Removing the limit should not degrade the existing reactivity behavior.

**Scenarios**:

#### Scenario 3.1: Add 4th persona dynamically
**Given** 3 personas are currently displayed
**When** the user selects a 4th persona
**Then** the chart SHALL update within 200ms
**And** the 4th dataset SHALL appear on the chart

#### Scenario 3.2: Remove persona from full selection
**Given** 6 personas are currently displayed
**When** the user deselects one persona
**Then** the chart SHALL update to show 5 datasets
**And** the correct dataset SHALL be removed

---

## Test Coverage

### Manual Test Cases

1. **TC-1**: Select 1-6 personas individually, verify each appears on chart
2. **TC-2**: Select all 6 personas, refresh page, verify all 6 persist
3. **TC-3**: Select 6 personas, deselect 3, verify chart updates correctly
4. **TC-4**: Measure render time with 3 vs 6 personas (should be <50ms difference)

### Regression Tests

- Ensure existing 1-3 persona selections continue to work
- Verify sessionStorage backward compatibility (existing 3-persona storage should still load)

---

## Dependencies

- Chart.js 3.x (existing)
- `window.VULCA_DATA.personas` array (existing)
- `window.PersonaSelection` state manager (existing)

---

## Performance Requirements

- Rendering 6 personas MUST complete within 100ms on modern browsers
- Color callback overhead MUST be <5ms per render
- sessionStorage read/write MUST complete within 10ms
