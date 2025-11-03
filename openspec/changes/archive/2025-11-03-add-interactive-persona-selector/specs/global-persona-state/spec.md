# Specification: Global Persona Selection State

**Capability**: `global-persona-state`
**Feature**: Add Interactive Persona Selector
**Last Updated**: 2025-11-03

---

## Purpose

Provide a centralized state manager (`window.PersonaSelection`) that coordinates persona selection across multiple visualization components through a global event system.

## ADDED Requirements

### Requirement: Global State Manager Module

A global JavaScript module SHALL be created to manage selected personas state and emit change events when selection updates.

**Rationale**: Multiple charts need to respond to the same persona selection. A centralized state manager prevents synchronization issues and provides a single source of truth.

**Acceptance Criteria**:
- Module exposed as `window.PersonaSelection`
- Manages array of selected persona IDs (e.g., `['su-shi', 'guo-xi']`)
- Provides `setSelection(personaIds)` method to update state
- Provides `getSelection()` method to retrieve current state
- Emits `persona:selectionChanged` CustomEvent when state changes
- Validates selection (must have 1-3 personas)
- Default selection: `['su-shi', 'guo-xi', 'john-ruskin']`

#### Scenario: JavaScript module initializes on page load

**Given**: The homepage has loaded completely
**When**: The `persona-selector.js` script executes
**Then**: `window.PersonaSelection` object is defined
**And**: `window.PersonaSelection.getSelection()` returns `['su-shi', 'guo-xi', 'john-ruskin']`
**And**: The state is initialized before any chart renders
**And**: Console logs: "✓ Persona selection state initialized"

**Example Code**:
```javascript
// File: js/persona-selector.js

window.PersonaSelection = (function() {
  'use strict';

  let selectedPersonas = ['su-shi', 'guo-xi', 'john-ruskin']; // Default
  let previousSelection = selectedPersonas.slice();

  /**
   * Set the selected personas and emit change event
   * @param {string[]} personaIds - Array of persona IDs
   * @returns {boolean} - True if successful, false if invalid
   */
  function setSelection(personaIds) {
    // Validate input
    if (!Array.isArray(personaIds)) {
      console.error('PersonaSelection: personaIds must be an array');
      return false;
    }

    if (personaIds.length === 0) {
      console.error('PersonaSelection: Must select at least 1 persona');
      alert('请至少选择1位评论家');
      return false;
    }

    if (personaIds.length > 3) {
      console.error('PersonaSelection: Cannot select more than 3 personas');
      alert('最多选择3位评论家进行对比');
      return false;
    }

    // Validate persona IDs exist
    const validIds = window.VULCA_DATA.personas.map(p => p.id);
    const invalidIds = personaIds.filter(id => !validIds.includes(id));
    if (invalidIds.length > 0) {
      console.error('PersonaSelection: Invalid persona IDs:', invalidIds);
      return false;
    }

    // Store previous selection for potential rollback
    previousSelection = selectedPersonas.slice();

    // Update state
    selectedPersonas = personaIds.slice(); // Clone array

    // Persist to sessionStorage
    persistSelection();

    // Emit event
    emitChangeEvent();

    console.log('✓ Persona selection updated:', selectedPersonas);
    return true;
  }

  /**
   * Get current selection (returns a copy)
   * @returns {string[]} - Array of selected persona IDs
   */
  function getSelection() {
    return selectedPersonas.slice(); // Return copy to prevent mutation
  }

  /**
   * Emit custom event to notify listeners
   */
  function emitChangeEvent() {
    const event = new CustomEvent('persona:selectionChanged', {
      detail: {
        personas: selectedPersonas.slice(),
        count: selectedPersonas.length
      },
      bubbles: true
    });
    window.dispatchEvent(event);
  }

  /**
   * Persist selection to sessionStorage
   */
  function persistSelection() {
    try {
      sessionStorage.setItem('vulca-persona-selection', JSON.stringify(selectedPersonas));
    } catch (e) {
      console.warn('PersonaSelection: sessionStorage unavailable', e);
    }
  }

  /**
   * Restore selection from sessionStorage
   */
  function restoreSelection() {
    try {
      const stored = sessionStorage.getItem('vulca-persona-selection');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed.length <= 3) {
          selectedPersonas = parsed;
          console.log('✓ Restored persona selection from sessionStorage:', selectedPersonas);
        }
      }
    } catch (e) {
      console.warn('PersonaSelection: Failed to restore from sessionStorage', e);
    }
  }

  /**
   * Initialize state manager
   */
  function init() {
    // Restore from sessionStorage if available
    restoreSelection();

    console.log('✓ Persona selection state initialized:', selectedPersonas);
  }

  // Auto-initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  return {
    setSelection,
    getSelection
  };
})();
```

---

#### Scenario: User changes persona selection via dropdown

**Given**: Current selection is `['su-shi', 'guo-xi', 'john-ruskin']`
**When**: User deselects John Ruskin and selects Mama Zola in the dropdown
**Then**: `PersonaSelection.setSelection(['su-shi', 'guo-xi', 'mama-zola'])` is called
**And**: The function validates the array (3 personas, all valid IDs)
**And**: The internal state updates to `['su-shi', 'guo-xi', 'mama-zola']`
**And**: `persona:selectionChanged` event is emitted with detail: `{personas: [...], count: 3}`
**And**: The selection is saved to sessionStorage
**And**: The function returns `true`

**Example Event Listener**:
```javascript
// In rpait-radar.js or persona-matrix.js
window.addEventListener('persona:selectionChanged', (event) => {
  console.log('Selection changed:', event.detail.personas);
  console.log('Count:', event.detail.count);
  // Update chart with new personas
  updateChart(event.detail.personas);
});
```

---

#### Scenario: User attempts to select 4 personas (invalid)

**Given**: Current selection is `['su-shi', 'guo-xi', 'john-ruskin']`
**When**: Dropdown change handler calls `PersonaSelection.setSelection(['su-shi', 'guo-xi', 'john-ruskin', 'mama-zola'])`
**Then**: The function validates the array length (4 > 3)
**And**: An alert appears: "最多选择3位评论家进行对比"
**And**: The internal state does NOT change (remains `['su-shi', 'guo-xi', 'john-ruskin']`)
**And**: No event is emitted
**And**: sessionStorage is NOT updated
**And**: The function returns `false`
**And**: Console logs error: "PersonaSelection: Cannot select more than 3 personas"

---

#### Scenario: User deselects all personas (invalid)

**Given**: Current selection is `['su-shi']`
**When**: Dropdown change handler calls `PersonaSelection.setSelection([])`
**Then**: The function validates the array length (0 < 1)
**And**: An alert appears: "请至少选择1位评论家"
**And**: The internal state does NOT change (remains `['su-shi']`)
**And**: No event is emitted
**And**: The function returns `false`
**And**: Console logs error: "PersonaSelection: Must select at least 1 persona"

---

### Requirement: sessionStorage Persistence

The persona selection SHALL be persisted to sessionStorage and restored on page reload.

**Rationale**: Users expect their selection to persist during a browsing session. sessionStorage provides non-intrusive persistence without requiring a backend.

**Acceptance Criteria**:
- Selection saved to `sessionStorage['vulca-persona-selection']` as JSON string
- On page load, state manager attempts to restore from sessionStorage
- If sessionStorage unavailable or contains invalid data, use default selection
- sessionStorage cleared when browser tab closes (session-only persistence)

#### Scenario: User reloads page after selecting personas

**Given**: User has selected `['su-shi', 'mama-zola']` and sessionStorage is available
**When**: User reloads the page (Ctrl+R or F5)
**Then**: The state manager reads `sessionStorage.getItem('vulca-persona-selection')`
**And**: Parses the JSON: `['su-shi', 'mama-zola']`
**And**: Validates the array (2 personas, valid IDs)
**And**: Sets `selectedPersonas = ['su-shi', 'mama-zola']`
**And**: The dropdown pre-selects these 2 personas
**And**: The charts render with these 2 personas
**And**: Console logs: "✓ Restored persona selection from sessionStorage: ['su-shi', 'mama-zola']"

**Example Code**:
```javascript
function restoreSelection() {
  try {
    const stored = sessionStorage.getItem('vulca-persona-selection');
    if (stored) {
      const parsed = JSON.parse(stored);

      // Validate
      if (Array.isArray(parsed) && parsed.length > 0 && parsed.length <= 3) {
        // Verify all IDs are valid
        const validIds = window.VULCA_DATA.personas.map(p => p.id);
        const allValid = parsed.every(id => validIds.includes(id));

        if (allValid) {
          selectedPersonas = parsed;
          console.log('✓ Restored persona selection from sessionStorage:', selectedPersonas);
          return true;
        }
      }
    }
  } catch (e) {
    console.warn('PersonaSelection: Failed to restore from sessionStorage', e);
  }
  return false;
}
```

---

#### Scenario: sessionStorage is unavailable (private browsing)

**Given**: User is in private/incognito mode where sessionStorage throws errors
**When**: The state manager tries to save selection via `sessionStorage.setItem()`
**Then**: The try-catch block catches the error
**And**: Console warns: "PersonaSelection: sessionStorage unavailable"
**And**: The selection still updates in memory (state manager works normally)
**And**: Charts update correctly
**And**: Selection just won't persist across reloads (acceptable degradation)

---

### Requirement: Event-Driven Architecture

The state manager SHALL use CustomEvent to notify listeners about selection changes in a decoupled manner.

**Rationale**: Charts and other components should not directly depend on the state manager implementation. Events provide loose coupling and extensibility.

**Acceptance Criteria**:
- Event name: `persona:selectionChanged`
- Event type: `CustomEvent`
- Event detail: `{ personas: string[], count: number }`
- Event bubbles: `true` (can be caught by any ancestor element)
- Event dispatched on `window` object
- Event dispatched synchronously after state update

#### Scenario: Multiple charts listen to the same event

**Given**: Both `rpait-radar.js` and `persona-matrix.js` have registered event listeners
**When**: User changes selection to `['su-shi', 'guo-xi']`
**Then**: `PersonaSelection.setSelection()` emits one `persona:selectionChanged` event
**And**: The radar chart listener receives the event with `detail.personas = ['su-shi', 'guo-xi']`
**And**: The matrix chart listener receives the same event
**And**: Both charts update within 300ms
**And**: The update happens in correct order (state change → event → listener → chart update)

**Example Listener**:
```javascript
// In rpait-radar.js
function initEventListeners() {
  window.addEventListener('persona:selectionChanged', (event) => {
    const { personas, count } = event.detail;
    console.log(`[Radar Chart] Received selection change: ${count} personas`, personas);

    selectedPersonas = personas;
    updateRadarChart();
  });
}

// In persona-matrix.js
function initEventListeners() {
  window.addEventListener('persona:selectionChanged', (event) => {
    const { personas, count } = event.detail;
    console.log(`[Matrix Chart] Received selection change: ${count} personas`, personas);

    selectedPersonas = personas;
    updateMatrixChart();
  });
}
```

---

### Requirement: Validation and Error Handling

The state manager SHALL validate all inputs and provide clear error messages for invalid operations.

**Rationale**: Robust validation prevents invalid states and provides helpful feedback to developers and users.

**Acceptance Criteria**:
- Validates `personaIds` is an array
- Validates array length is 1-3
- Validates all persona IDs exist in `window.VULCA_DATA.personas`
- Shows user-facing alerts for validation errors
- Logs developer-facing warnings to console
- Returns `false` on validation failure

#### Scenario: Developer passes invalid input to setSelection

**Given**: `window.PersonaSelection` is initialized
**When**: Developer calls `PersonaSelection.setSelection('su-shi')` (string instead of array)
**Then**: The function checks `Array.isArray('su-shi')` → `false`
**And**: Console logs error: "PersonaSelection: personaIds must be an array"
**And**: The function returns `false`
**And**: The state does NOT change
**And**: No event is emitted

**Example Code**:
```javascript
function setSelection(personaIds) {
  // Type validation
  if (!Array.isArray(personaIds)) {
    console.error('PersonaSelection: personaIds must be an array');
    return false;
  }

  // Length validation
  if (personaIds.length === 0 || personaIds.length > 3) {
    console.error(`PersonaSelection: Invalid length (${personaIds.length}). Must be 1-3.`);
    alert(personaIds.length === 0 ?
      '请至少选择1位评论家' :
      '最多选择3位评论家进行对比');
    return false;
  }

  // ID validation
  const validIds = window.VULCA_DATA.personas.map(p => p.id);
  const invalidIds = personaIds.filter(id => !validIds.includes(id));
  if (invalidIds.length > 0) {
    console.error('PersonaSelection: Invalid persona IDs:', invalidIds);
    return false;
  }

  // All validations passed
  selectedPersonas = personaIds.slice();
  persistSelection();
  emitChangeEvent();
  return true;
}
```

---

## Non-Requirements

- **Out of Scope**: Server-side persistence (backend API)
- **Out of Scope**: localStorage (use sessionStorage only)
- **Out of Scope**: Undo/redo functionality
- **Out of Scope**: Cross-tab synchronization

---

## Dependencies

**Required Data**: `window.VULCA_DATA.personas` (array of 6 persona objects)
**Required APIs**: sessionStorage (optional, graceful degradation)
**Required Modules**: None (vanilla JavaScript only)

---

## Browser Support

- Chrome/Edge 90+: Full support
- Firefox 88+: Full support
- Safari 14+: Full support
- CustomEvent: All modern browsers

---

## Performance Impact

**Expected**:
- Memory: ~1KB for state object
- sessionStorage: ~100 bytes per selection
- Event dispatch: <1ms
- No memory leaks (listeners properly managed by charts)

---

## Validation

**Manual Testing**:
- [ ] State initializes with default 3 personas
- [ ] `setSelection([...])` updates state correctly
- [ ] `getSelection()` returns copy (not reference)
- [ ] Event emitted on selection change
- [ ] sessionStorage saves selection
- [ ] Page reload restores selection
- [ ] Invalid inputs rejected with errors
- [ ] Multiple listeners receive same event

**Automated Testing**:
```javascript
describe('PersonaSelection State Manager', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('should initialize with default selection', () => {
    expect(window.PersonaSelection.getSelection()).toEqual([
      'su-shi', 'guo-xi', 'john-ruskin'
    ]);
  });

  it('should validate array input', () => {
    const result = window.PersonaSelection.setSelection('invalid');
    expect(result).toBe(false);
  });

  it('should enforce 3-persona limit', () => {
    const result = window.PersonaSelection.setSelection([
      'su-shi', 'guo-xi', 'john-ruskin', 'mama-zola'
    ]);
    expect(result).toBe(false);
  });

  it('should emit event on change', (done) => {
    window.addEventListener('persona:selectionChanged', (e) => {
      expect(e.detail.personas).toEqual(['su-shi']);
      expect(e.detail.count).toBe(1);
      done();
    });
    window.PersonaSelection.setSelection(['su-shi']);
  });

  it('should persist to sessionStorage', () => {
    window.PersonaSelection.setSelection(['su-shi', 'guo-xi']);
    const stored = JSON.parse(sessionStorage.getItem('vulca-persona-selection'));
    expect(stored).toEqual(['su-shi', 'guo-xi']);
  });
});
```
