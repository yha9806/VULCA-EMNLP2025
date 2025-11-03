# Design: Add Interactive Persona Selector

**Change ID**: `add-interactive-persona-selector`
**Created**: 2025-11-03

---

## Architecture Overview

This enhancement introduces a **global persona selection system** that coordinates multiple data visualization components through a centralized state manager and event-driven architecture.

### Current Architecture

```
index.html
├─ #rpait-radar-panel
│  ├─ canvas#rpait-radar-chart
│  └─ .viz-controls (单一/对比 toggle)
└─ #persona-matrix-panel
   ├─ canvas#persona-matrix-chart
   └─ select (dimension filter)

rpait-radar.js
├─ selectedPersonas: ['su-shi']  (hardcoded)
└─ selectPersona() (no UI trigger)

persona-matrix.js
├─ currentDimension: 'all'
└─ displays all 6 personas (not filterable)
```

**Problem**: No shared state, no persona selection UI, radar chart stuck on Su Shi.

### Proposed Architecture

```
index.html
├─ #persona-selector-controls (NEW)
│  ├─ <select multiple> with 6 personas
│  └─ preset buttons (古代/现代/全部)
├─ #rpait-radar-panel
│  └─ listens to persona:selectionChanged
└─ #persona-matrix-panel
   └─ listens to persona:selectionChanged

Global State Manager (NEW)
├─ window.PersonaSelection
│  ├─ selectedPersonas: string[]
│  ├─ setSelection(ids: string[])
│  ├─ getSelection(): string[]
│  └─ emit('persona:selectionChanged')

Chart Listeners
├─ rpait-radar.js → updates selectedPersonas → chart.update()
└─ persona-matrix.js → filters personas → chart.update()
```

**Benefits**: Single source of truth, synchronized charts, extensible for future visualizations.

---

## Design Decisions

### Decision 1: Global vs. Per-Chart Selection

**Options Considered**:
- **A**: Global selector controls all charts
- **B**: Each chart has independent selector
- **C**: Hybrid: global + per-chart overrides

**Choice**: **Option A** - Global selector

**Rationale**:
- User requested synchronized behavior ("对比部分也需要可选可调整")
- Prevents confusion from seeing different personas in different charts
- Simpler mental model: "I'm comparing these 3 personas across all metrics"
- Easier to implement and maintain

**Trade-offs**:
- Pro: Consistent experience, single control surface
- Con: Cannot compare different persona sets in different charts
- Mitigation: Users can change selection quickly if needed

---

### Decision 2: UI Component Type

**Options Considered**:
- **A**: Multi-select dropdown (`<select multiple>`)
- **B**: Checkbox list (always visible)
- **C**: Tag-based selector with autocomplete
- **D**: Radio buttons with "add more" button

**Choice**: **Option A** - Multi-select dropdown

**Rationale**:
- Familiar pattern for users (standard HTML control)
- Compact when closed (saves vertical space)
- Native accessibility support (ARIA, keyboard navigation)
- Works on mobile without custom touch handling
- Supports preset buttons for quick selection

**Implementation**:
```html
<div class="persona-selector-wrapper">
  <label for="persona-select">选择评论家 Select Personas (最多3位)</label>
  <div class="selector-row">
    <select id="persona-select" multiple size="6" aria-describedby="persona-help">
      <option value="su-shi" selected>苏轼 Su Shi</option>
      <option value="guo-xi" selected>郭熙 Guo Xi</option>
      <option value="john-ruskin" selected>约翰·罗斯金 John Ruskin</option>
      <option value="mama-zola">佐拉妈妈 Mama Zola</option>
      <option value="professor-petrova">埃琳娜·佩特洛娃教授 Professor Petrova</option>
      <option value="ai-ethics">AI伦理评审员 AI Ethics Reviewer</option>
    </select>
    <div class="preset-buttons">
      <button class="preset-btn" data-preset="ancient">古代</button>
      <button class="preset-btn" data-preset="modern">现代</button>
      <button class="preset-btn" data-preset="all">全部</button>
    </div>
  </div>
  <p id="persona-help" class="help-text">按住 Ctrl/Cmd 选择多位评论家</p>
</div>
```

**Styling**:
- Color-coded option backgrounds matching persona.color
- Custom scrollbar for better aesthetics
- Responsive width: 100% on mobile, 60% on desktop

---

### Decision 3: State Management Pattern

**Options Considered**:
- **A**: Plain JavaScript object with CustomEvent
- **B**: Vue.js reactive state
- **C**: Redux-like store
- **D**: Browser sessionStorage only

**Choice**: **Option A** - Plain JavaScript with CustomEvent

**Rationale**:
- No framework dependencies (project is vanilla JS)
- CustomEvent is standard, well-supported
- Simple enough for this use case
- sessionStorage for persistence only (not primary state)

**Implementation**:
```javascript
window.PersonaSelection = (function() {
  let selectedPersonas = ['su-shi', 'guo-xi', 'john-ruskin']; // Default

  function setSelection(personaIds) {
    // Validate
    if (!Array.isArray(personaIds) || personaIds.length === 0) {
      console.error('Invalid selection');
      return false;
    }
    if (personaIds.length > 3) {
      alert('最多选择3位评论家进行对比');
      return false;
    }

    // Update state
    selectedPersonas = personaIds;

    // Persist
    try {
      sessionStorage.setItem('persona-selection', JSON.stringify(personaIds));
    } catch (e) {
      console.warn('sessionStorage unavailable');
    }

    // Emit event
    const event = new CustomEvent('persona:selectionChanged', {
      detail: { personas: selectedPersonas }
    });
    window.dispatchEvent(event);

    return true;
  }

  function getSelection() {
    return selectedPersonas.slice(); // Return copy
  }

  // Restore from sessionStorage on load
  function init() {
    try {
      const stored = sessionStorage.getItem('persona-selection');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed.length <= 3) {
          selectedPersonas = parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to restore selection');
    }
  }

  init();

  return { setSelection, getSelection };
})();
```

---

### Decision 4: Default Selection

**Options Considered**:
- **A**: Su Shi only (current behavior)
- **B**: All 6 personas
- **C**: 3 diverse personas (ancient + modern + AI)
- **D**: Random 3 personas

**Choice**: **Option C** - Su Shi + Guo Xi + John Ruskin

**Rationale**:
- User requested "multiple personas" as default
- These 3 represent diverse perspectives:
  - **Su Shi** (北宋文人): Traditional Chinese literati
  - **Guo Xi** (北宋山水画家): Formalist aesthetics
  - **John Ruskin** (维多利亚评论家): Western ethical criticism
- Not too crowded (3 is max for clarity)
- Introduces users to comparison mode immediately

---

### Decision 5: Preset Button Behavior

**Options Considered**:
- **A**: Presets replace current selection entirely
- **B**: Presets toggle personas (add/remove)
- **C**: Presets filter available options

**Choice**: **Option A** - Replace selection

**Rationale**:
- Clear, predictable behavior
- "古代" → deselect all, select [su-shi, guo-xi]
- "现代" → deselect all, select [john-ruskin, professor-petrova, ai-ethics]
- "全部" → select all 6 (with warning if > 3)

**Edge Case Handling**:
- If preset would select > 3 personas, show error: "最多选择3位评论家，请手动调整"
- For "全部", default to first 3 personas and show info message

---

### Decision 6: Chart Update Strategy

**Options Considered**:
- **A**: Immediate update (update('none'))
- **B**: Animated update (update() with 200ms)
- **C**: Debounced update (wait 500ms after last change)

**Choice**: **Option B** - Animated update (200ms)

**Rationale**:
- Provides visual feedback that chart is responding
- 200ms is fast enough to feel instant but smooth
- Matches existing animation duration in both charts
- No need for debounce (users won't spam selection)

**Implementation**:
```javascript
// In rpait-radar.js
window.addEventListener('persona:selectionChanged', (e) => {
  selectedPersonas = e.detail.personas;
  updateRadarChart(); // Uses chart.update() with 200ms animation
});

// In persona-matrix.js
window.addEventListener('persona:selectionChanged', (e) => {
  selectedPersonas = e.detail.personas;
  updateMatrixChart(); // Uses chart.update() with 200ms animation
});
```

---

## Data Flow

```
User Action
   ↓
[Dropdown Selection Change]
   ↓
PersonaSelection.setSelection(['su-shi', 'guo-xi'])
   ↓
Validation (1-3 personas?)
   ↓
Update state + sessionStorage
   ↓
Emit CustomEvent('persona:selectionChanged')
   ↓
   ├─→ rpait-radar.js listener
   │     ├─ selectedPersonas = ['su-shi', 'guo-xi']
   │     └─ chart.update() (200ms animation)
   │
   └─→ persona-matrix.js listener
         ├─ filter personas to ['su-shi', 'guo-xi']
         └─ chart.update() (200ms animation)
```

---

## UI/UX Considerations

### Visual Hierarchy

```
#data-insights
├─ .section-header ("数据洞察 / Data Insights")
├─ .persona-selector-wrapper (NEW - prominent position)
│  ├─ <label> with icon
│  ├─ <select> + preset buttons
│  └─ help text
└─ .viz-grid (existing charts)
```

**Positioning**: Place selector immediately below section header, above charts, so users see it first.

### Color Coding

- Each `<option>` uses `background-color: persona.color` with `opacity: 0.2`
- Selected options have darker background (`opacity: 0.4`)
- Matches persona colors in charts for visual consistency

### Error Messaging

| Scenario | Message | Display |
|----------|---------|---------|
| Select > 3 personas | "最多选择3位评论家进行对比" | Alert (blocking) |
| Deselect all | "请至少选择1位评论家" | Alert (blocking) |
| Preset "全部" clicked | "已选择前3位评论家（最多3位）" | Toast (3s) |

---

## Accessibility

### Keyboard Navigation

- `Tab` to focus dropdown
- `Arrow Up/Down` to navigate options
- `Space` to toggle selection
- `Ctrl+A` to select all (with validation)
- `Escape` to close dropdown

### Screen Reader

```html
<select
  id="persona-select"
  multiple
  aria-label="选择评论家进行对比分析"
  aria-describedby="persona-help persona-count"
>
  <!-- options -->
</select>
<div id="persona-count" class="sr-only" aria-live="polite">
  已选择 3 位评论家
</div>
```

**Announcements**:
- On selection change: "已选择 苏轼、郭熙、约翰·罗斯金，共3位评论家"
- On chart update: "图表已更新" (via aria-live region)

---

## Performance Considerations

### Chart Re-rendering

- **Current**: Chart.js updates ~50-100ms per chart
- **Expected**: 2 charts × 100ms = 200ms total
- **Acceptable**: < 300ms is perceived as instant
- **Optimization**: Use `chart.update('none')` if animation feels slow

### DOM Updates

- Dropdown: Native `<select>` is highly optimized
- No virtual scrolling needed (only 6 options)
- Preset buttons: Simple event listeners (negligible overhead)

### Memory

- State manager: ~1KB in memory
- sessionStorage: ~100 bytes per selection
- No memory leaks (event listeners properly managed)

---

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| `<select multiple>` | ✅ All | ✅ All | ✅ All | ✅ All |
| CustomEvent | ✅ 15+ | ✅ 11+ | ✅ 6+ | ✅ 12+ |
| sessionStorage | ✅ 4+ | ✅ 2+ | ✅ 4+ | ✅ 12+ |
| CSS :has() | ✅ 105+ | ✅ 121+ | ✅ 15.4+ | ✅ 105+ |

**Target**: Chrome/Edge 90+, Firefox 88+, Safari 14+ (matches project's existing browser support).

---

## Testing Strategy

### Unit Tests (Manual)

1. **State Manager**:
   - `setSelection([])` → returns false, shows error
   - `setSelection(['su-shi'])` → returns true, emits event
   - `setSelection(['a', 'b', 'c', 'd'])` → returns false (> 3)
   - `getSelection()` → returns copy (not reference)

2. **Dropdown**:
   - Select 1 persona → chart updates
   - Select 3 personas → chart updates
   - Select 4 personas → error message
   - Deselect all → error message

3. **Presets**:
   - "古代" → selects [su-shi, guo-xi]
   - "现代" → selects [john-ruskin, professor-petrova, ai-ethics]
   - "全部" → error message or select first 3

### Integration Tests

1. **Chart Sync**:
   - Change selection → both charts update simultaneously
   - Selection persists across page reload (sessionStorage)
   - Charts display correct personas with correct colors

2. **Visual Regression**:
   - Compare screenshots before/after selection change
   - Verify radar chart shows 1-3 datasets
   - Verify matrix chart filters personas correctly

### Accessibility Tests

- Use VoiceOver (macOS) / NVDA (Windows)
- Verify dropdown announces all options
- Verify selection changes are announced
- Keyboard-only navigation test

---

## Rollback Plan

**If Issues Occur**:

1. **Quick Fix**: Set `display: none` on `.persona-selector-wrapper`
   - Charts revert to default behavior (Su Shi only)
   - No JavaScript errors

2. **Full Rollback**:
   ```bash
   git revert <commit-sha>
   ```
   - Remove persona-selector.js
   - Remove HTML for selector
   - Restore original rpait-radar.js default

3. **Graceful Degradation**:
   - If PersonaSelection fails to load, charts use fallback defaults
   - If sessionStorage unavailable, selection not persisted (still works per session)

---

## Future Enhancements (Out of Scope)

- **Persona grouping**: Organize by era, culture, discipline
- **Search/filter**: Type to find persona by name
- **Saved comparisons**: Bookmark favorite persona combinations
- **Export**: Download chart with current selection as PNG
- **Mobile gestures**: Swipe to change personas

---

## References

- Chart.js Documentation: https://www.chartjs.org/docs/latest/developers/updates.html
- CustomEvent MDN: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
- Multi-select best practices: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/examples/listbox-collapsible/
