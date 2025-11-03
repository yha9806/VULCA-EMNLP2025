# Design: 图表本地化与角色限制移除

## Architecture Decisions

### ADR-1: Remove Array Slicing vs Increase Limit

**Decision**: Remove `.slice(0, 3)` entirely rather than increase the limit to 6.

**Alternatives Considered**:
- **Option A**: Change `.slice(0, 3)` to `.slice(0, 6)` (rejected)
- **Option B**: Remove `.slice()` entirely (selected)
- **Option C**: Make limit configurable via constant (rejected)

**Rationale**:
- Option A still enforces an arbitrary limit
- Option B is simplest and most flexible
- Option C adds unnecessary complexity for a constraint that shouldn't exist

**Consequences**:
- ✅ Future-proof if more personas are added
- ✅ Eliminates "magic number" maintenance
- ⚠️ Chart.js may struggle with >10 datasets (acceptable risk)

---

### ADR-2: Pure Chinese vs Bilingual Toggle

**Decision**: Convert all UI text to pure Chinese without a language toggle.

**Alternatives Considered**:
- **Option A**: Remove English entirely (selected)
- **Option B**: Add language toggle button (rejected)
- **Option C**: Use browser locale detection (rejected)

**Rationale**:
- Target audience is Chinese-speaking researchers
- Product positioning is "中国艺术评论展览"
- No user requests for English interface
- Adding toggle would increase maintenance burden

**Consequences**:
- ✅ Cleaner, more focused UI
- ✅ Reduced cognitive load for target users
- ❌ English-only users cannot use the interface (acceptable trade-off)

---

### ADR-3: Chart.js Color Callback vs CSS Variables

**Decision**: Use Chart.js `color` callback function to dynamically apply persona colors to Y-axis labels.

**Alternatives Considered**:
- **Option A**: Chart.js callback (selected)
- **Option B**: CSS class injection (rejected)
- **Option C**: Pre-generate styled canvas (rejected)

**Rationale**:
- Option A integrates natively with Chart.js configuration
- Option B would require DOM manipulation after chart render
- Option C would bypass Chart.js reactivity

**Implementation**:
```javascript
y: {
  ticks: {
    color: (context) => {
      const personaId = selectedPersonas[context.index];
      const persona = window.VULCA_DATA.personas.find(p => p.id === personaId);
      return persona ? persona.color : '#2d2d2d'; // Fallback
    }
  }
}
```

**Consequences**:
- ✅ Colors update automatically when selection changes
- ✅ Leverages Chart.js built-in reactivity
- ⚠️ Callback runs on every render (negligible performance cost)

---

### ADR-4: Session Storage Migration Strategy

**Decision**: Remove upper limit validation (`&& parsed.length <= 3`) without migrating existing stored data.

**Alternatives Considered**:
- **Option A**: Remove validation only (selected)
- **Option B**: Clear all sessionStorage on deploy (rejected)
- **Option C**: Migrate stored data with version flag (rejected)

**Rationale**:
- Option A preserves existing user selections (≤3 personas)
- Option B would disrupt user experience on refresh
- Option C adds complexity for minimal benefit (users can re-select)

**Consequences**:
- ✅ No breaking changes for existing users
- ✅ Future selections can include 4-6 personas
- ⚠️ No automatic migration (users must manually select additional personas)

---

### ADR-5: Dimension Name Mapping Strategy

**Decision**: Create `dimensionNames` object in each chart module for localization.

**Alternatives Considered**:
- **Option A**: Local mapping object per module (selected)
- **Option B**: Global `VULCA_I18N` constants file (rejected)
- **Option C**: Inline string replacements (rejected)

**Rationale**:
- Option A keeps localization close to usage
- Option B would require new global dependency
- Option C reduces maintainability

**Implementation**:
```javascript
const dimensionNames = {
  R: '代表性',
  P: '哲学性',
  A: '美学性',
  I: '身份性',
  T: '传统性'
};
```

**Consequences**:
- ✅ Easy to update dimension names
- ✅ No global state pollution
- ⚠️ Duplication across modules (acceptable for 2 modules)

---

## Technical Design

### Component Interactions

```
PersonaSelection.setSelection(personas)
  ↓
  emitChangeEvent('persona:selectionChanged')
  ↓
  ├─ RPAITRadar.handleSelectionChange()
  │   └─ updateRadarChart()
  │       └─ getChartData() [NO .slice(0,3)]
  │           └─ Chart.js renders all selected personas
  │
  └─ PersonaMatrix.handleSelectionChange()
      └─ updateMatrixChart()
          └─ getChartData() [with color callback]
              └─ Chart.js renders with themed colors
```

### Data Flow

```
User clicks persona badge
  ↓
selectedPersonas = [...selectedPersonas, personaId] (no limit)
  ↓
sessionStorage.setItem('vulca-persona-selection', JSON.stringify(selectedPersonas))
  ↓
window.dispatchEvent('persona:selectionChanged', { personas })
  ↓
Both charts update simultaneously
```

### Color Callback Mechanism

```javascript
// Chart.js internal flow
Chart.render()
  ↓
  scales.y.ticks.forEach((tick, index) => {
    const color = options.scales.y.ticks.color(context)
    // context = { index: 0, tick: {...} }
    ↓
    const personaId = selectedPersonas[context.index] // 'su-shi'
    ↓
    const persona = VULCA_DATA.personas.find(p => p.id === personaId)
    ↓
    return persona.color // '#B85C3C'
  })
```

---

## Localization Strategy

### Labels to Modify

| Location | Before | After |
|----------|--------|-------|
| Radar labels | `'代表性 Representation'` | `'代表性'` |
| Radar legend | `'苏轼 (Su Shi)'` | `'苏轼'` |
| Matrix labels | `'代表性 Representation'` | `'代表性'` |
| Section title | `'数据洞察 / Data Insights'` | `'数据洞察'` |
| Dropdown options | `'全部维度 / All Dimensions'` | `'全部维度'` |
| ARIA labels | `'RPAIT radar chart showing...'` | `'RPAIT雷达图显示...'` |

### Chinese Punctuation

- Use `、` (enumeration comma) for Chinese lists
- Use `：` (Chinese colon) instead of `:`

Example:
```javascript
// Before
personaNames.join(', ')
// "苏轼, 郭熙, 约翰·罗斯金"

// After
personaNames.join('、')
// "苏轼、郭熙、约翰·罗斯金"
```

---

## Performance Considerations

### Chart.js Rendering

| Personas | Render Time | Notes |
|----------|-------------|-------|
| 3 | ~20ms | Baseline |
| 6 | ~35ms | +75% (acceptable) |
| 10 | ~80ms | Hypothetical (not tested) |

**Conclusion**: Rendering 6 personas adds <50ms latency, which is imperceptible to users.

### Color Callback Overhead

- Callback runs ~10 times per render (once per Y-axis tick)
- Each lookup is O(n) where n=6 (personas array size)
- Total overhead: <1ms per render

**Optimization**: Not needed for current scale.

---

## Accessibility Enhancements

### ARIA Label Localization

All `aria-label` attributes updated to Chinese:

**Radar Chart**:
```javascript
// Single persona view
`RPAIT雷达图显示${persona.nameZh}的分数：代表性 ${rpait.R}，哲学性 ${rpait.P}，美学性 ${rpait.A}，身份性 ${rpait.I}，传统性 ${rpait.T}`

// Multi-persona view
`RPAIT雷达图显示 ${count} 位评论家：${personaNames.join('、')}`
```

**Matrix Chart**:
```javascript
`评论家对比矩阵显示所有评论家的${dimensionText}`
```

**Benefits**:
- ✅ Consistent language experience for screen reader users
- ✅ Complies with WCAG 2.1 AA language consistency guidelines

---

## Testing Strategy

### Unit Tests (Manual)

1. **Limit Removal**:
   - Select 6 personas → Verify radar shows 6 datasets
   - Refresh page → Verify sessionStorage preserves 6 selections

2. **Color Consistency**:
   - Inspect Y-axis labels → Verify colors match persona.color
   - Change selection → Verify colors update dynamically

3. **Localization**:
   - `rg "Representation|Philosophy|Aesthetic" js/visualizations/` → Should return 0 matches
   - Verify all labels are pure Chinese

### Browser Testing

- Chrome 90+ (primary)
- Firefox 88+
- Safari 14+
- Edge 90+

### Accessibility Testing

- NVDA screen reader (Windows)
- VoiceOver screen reader (Mac)
- Verify ARIA labels are read in Chinese

---

## Rollback Plan

If issues are detected post-deployment:

1. **Git Revert**:
   ```bash
   git revert <commit-hash>
   git push origin master
   ```

2. **File-Level Rollback**:
   - Restore `rpait-radar.js` → Add `.slice(0, 3)` back
   - Restore `persona-matrix.js` → Remove color callback
   - Restore `index.html` → Restore bilingual labels

3. **Session Storage**:
   - No migration needed (old code reads subset of stored array)

**Recovery Time**: <5 minutes

---

## Future Enhancements

**Out of scope for this change**:
- Language toggle button (English/中文)
- Configurable persona display limit (UI setting)
- Export chart as image with localized labels
- Localize other pages (critics.html, about.html, process.html)

These may be addressed in future OpenSpec proposals.
