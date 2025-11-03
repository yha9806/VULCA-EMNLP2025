# Proposal: Add Interactive Persona Selector

**Change ID**: `add-interactive-persona-selector`
**Created**: 2025-11-03
**Status**: Proposed

---

## Problem Statement

The Data Insights section currently has limited interactivity for exploring different personas:

1. **RPAIT Radar Chart**:
   - Only displays Su Shi (苏轼) by default
   - Has "单一模式/对比模式" toggle buttons but no UI to select different personas
   - JavaScript has `selectPersona()` function but no way for users to trigger it

2. **Persona Comparison Matrix**:
   - Shows all 6 personas at once (not adjustable)
   - Has dimension filter dropdown but users cannot hide/show specific personas
   - Cannot focus on comparing just 2-3 personas of interest

3. **User Feedback**:
   - User explicitly requested: "这个图只能显示苏轼的？我需要多个选项，然后对比部分也需要可选可调整。"
   - Translation: "This chart only shows Su Shi? I need multiple options, and the comparison section also needs to be selectable and adjustable."

**Impact**: Users cannot explore different critical perspectives or create custom persona comparisons, severely limiting the analytical value of the data visualizations.

---

## Proposed Solution

Add a **global persona selector** that controls both the RPAIT radar chart and persona matrix chart, enabling users to:

1. Select 1-3 personas to display in the radar chart
2. Filter which personas appear in the comparison matrix
3. Switch between preset comparison groups (e.g., "古代评论家", "现代评论家", "全部")
4. Default to showing multiple personas in comparison mode

### Key Features

**Global Persona Selector UI**:
- Multi-select dropdown positioned above the visualization grid
- Shows all 6 personas with colored badges matching their theme colors
- Supports selecting 1-3 personas (enforced limit for clarity)
- Preset buttons for quick selection: "古代" (Su Shi + Guo Xi), "现代" (Ruskin + Petrova + AI), "全部"

**Chart Integration**:
- Radar chart displays selected personas (1-3) with color-coded datasets
- Matrix chart filters to show only selected personas
- Both charts update simultaneously when selection changes
- Smooth transitions with 200ms animations

**Default Behavior**:
- Start in "compare" mode showing 3 personas: Su Shi, Guo Xi, John Ruskin
- Pre-select these 3 personas in the dropdown
- Active "对比模式" button by default

---

## Why

**User Request**: "这个图只能显示苏轼的？我需要多个选项，然后对比部分也需要可选可调整。"

The current data visualization implementation has critical usability limitations:

1. **Radar Chart Fixed to One Persona**: The RPAIT radar chart defaults to showing only Su Shi with no UI to change it, despite having backend support for persona selection
2. **Matrix Chart Shows All Personas**: Users cannot focus on comparing specific personas of interest, reducing analytical clarity
3. **Inconsistent Interactivity**: Dimension filtering works, but persona filtering doesn't exist
4. **Missed Opportunity**: The `selectPersona()` function exists in code but is never exposed to users

This forces users into a one-size-fits-all view that doesn't match their analytical needs. Users want to:
- Compare ancient vs modern critics (Su Shi + Ruskin)
- Focus on formalist perspectives (Guo Xi + Petrova)
- Explore AI ethics views (AI + Ruskin for philosophical comparison)

**Business Impact**: Low engagement with data visualizations, reduced time-on-site, users leave without exploring different critical perspectives.

---

## What Changes

### Added

1. **New UI Component**: `PersonaSelector` - Global multi-select dropdown
   - Location: Above `#data-insights .viz-grid`
   - Displays persona names (中文 + English) with colored badges
   - Checkbox-based multi-select with 3-persona limit
   - Preset filter buttons

2. **Global State Manager**: `window.PersonaSelection`
   - Tracks currently selected personas (array of IDs)
   - Emits `persona:selectionChanged` custom event
   - Validates selection (1-3 personas required)
   - Persists selection in sessionStorage

3. **Chart Updates**:
   - **rpait-radar.js**: Listen to `persona:selectionChanged`, update `selectedPersonas`, re-render
   - **persona-matrix.js**: Filter personas based on global selection
   - Both charts share the same selected persona list

### Modified

1. **index.html**:
   - Add persona selector HTML above `.viz-grid` (line ~150)
   - Update default radar chart mode to "compare" (button `.active` class)

2. **rpait-radar.js**:
   - Change `selectedPersonas` default from `['su-shi']` to `['su-shi', 'guo-xi', 'john-ruskin']`
   - Change `currentMode` default from `'single'` to `'compare'`
   - Add event listener for `persona:selectionChanged`

3. **persona-matrix.js**:
   - Add persona filtering based on global selection
   - Update `getChartData()` to use filtered persona list

### Removed

None. This is a pure enhancement with no breaking changes.

---

## Non-Goals

- **Out of Scope**: Modifying similarity heatmap or network graph (they show all personas by nature)
- **Out of Scope**: Adding persona selection to individual critique panels
- **Out of Scope**: Changing RPAIT calculation logic
- **Out of Scope**: Mobile-specific dropdown UI (uses same dropdown on all screen sizes)

---

## Success Metrics

**Functional**:
- ✅ Users can select 1-3 personas from dropdown
- ✅ Radar chart displays selected personas correctly
- ✅ Matrix chart filters to selected personas
- ✅ Both charts update simultaneously (< 300ms)
- ✅ Preset buttons work correctly

**User Experience**:
- ✅ Default view shows 3 personas in comparison mode
- ✅ Dropdown closes after each selection
- ✅ Selected personas display with visual badges
- ✅ Charts animate smoothly on selection change

**Accessibility**:
- ✅ Dropdown keyboard navigable (Tab, Enter, Space)
- ✅ Screen reader announces selection changes
- ✅ ARIA labels describe all interactive controls

---

## Dependencies

**Required**:
- Existing `window.VULCA_DATA.personas` (6 personas)
- Existing `rpait-radar.js` and `persona-matrix.js`
- Chart.js library (already loaded)

**Optional**:
- sessionStorage API (for persistence, graceful fallback if unavailable)

---

## Timeline Estimate

**Total**: ~2 hours

| Phase | Duration | Tasks |
|-------|----------|-------|
| Phase 1: UI Component | 45 min | HTML structure, CSS styling, dropdown behavior |
| Phase 2: State Manager | 30 min | Global state, event system, validation |
| Phase 3: Chart Integration | 30 min | Connect both charts to state manager |
| Phase 4: Testing & Polish | 15 min | Cross-browser testing, accessibility validation |

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Chart performance with 3 datasets | Chart.js handles 3 datasets efficiently; use `update('none')` for instant updates |
| State sync issues between charts | Use centralized event system (`persona:selectionChanged`) with validation |
| Mobile dropdown UX | Use native `<select multiple>` with custom styling for touch-friendly experience |
| Users confused by 3-persona limit | Show clear error message: "最多选择3位评论家进行对比" |

---

## Alternatives Considered

### Alternative 1: Per-Chart Selectors
**Rejected**: Would create confusion if radar and matrix show different personas. Global selector ensures consistency.

### Alternative 2: Slider-Based Selection
**Rejected**: Dropdown is more familiar and works better for discrete persona selection.

### Alternative 3: Always Show All 6 Personas
**Rejected**: User explicitly requested adjustable filtering. Overcrowded charts reduce readability.

---

## References

- Current implementation: `js/visualizations/rpait-radar.js` (lines 14, 214-227)
- User request: Command args translated above
- Related archived change: `2025-11-02-enrich-homepage-data-visualizations`
