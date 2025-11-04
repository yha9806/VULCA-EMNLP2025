# Proposal: Fix Chart Labels Bilingual Support

**Change ID**: `fix-chart-labels-bilingual-support`
**Created**: 2025-11-04
**Status**: Proposed
**Priority**: High
**Effort**: 45 minutes

---

## Problem Statement

### What's Wrong

The data visualization charts on the homepage display **hard-coded Chinese labels** that do not update when users switch language:

**Affected Charts**:
1. **RPAIT Radar Chart** (`rpait-radar.js`)
   - Dimension labels: '代表性', '哲学性', '美学性', '身份性', '传统性'
   - Persona names: `persona.nameZh` only
   - ARIA labels: Hard-coded Chinese

2. **Persona Comparison Matrix** (`persona-matrix.js`)
   - Dataset labels: '代表性', '哲学性', '美学性', '身份性', '传统性'
   - Y-axis labels: `persona.nameZh` only
   - ARIA labels: Hard-coded Chinese

**Impact**:
- When users click the language toggle button to switch to English, chart labels **remain in Chinese**
- Inconsistent with other bilingual content (hero title, critique text, critic names)
- Breaks the user's expectation of a fully bilingual site

### Where It Happens

**File 1**: `js/visualizations/rpait-radar.js`
- Lines 93-99: Dimension labels array
- Line 112: Persona name in legend
- Line 157: ARIA label

**File 2**: `js/visualizations/persona-matrix.js`
- Lines 102-124: Dataset labels (all 5 dimensions)
- Lines 130-136: Dimension names mapping
- Line 96: Persona names for Y-axis
- Line 187: ARIA label

### User Report

User stated:
> "Critic Dimension Distribution, Critic Comparison Matrix 这个里面的标签也是中文"
> (The labels inside Critic Dimension Distribution and Critic Comparison Matrix are also in Chinese)

---

## Solution Overview

### What Changes

Convert hard-coded Chinese chart labels to **dynamic bilingual labels** that update based on the current language setting.

### How It Works

**Strategy**: Create a centralized translation function that returns labels based on `document.documentElement.getAttribute('data-lang')`, then update Chart.js instances when language changes.

**Key Components**:
1. **Translation Helper Function**:
   ```javascript
   function getChartLabels(lang = 'zh') {
     const labels = {
       dimensions: {
         zh: ['代表性', '哲学性', '美学性', '身份性', '传统性'],
         en: ['Representation', 'Philosophicality', 'Aesthetics', 'Identity', 'Tradition']
       },
       dimensionMap: {
         R: { zh: '代表性', en: 'Representation' },
         P: { zh: '哲学性', en: 'Philosophicality' },
         A: { zh: '美学性', en: 'Aesthetics' },
         I: { zh: '身份性', en: 'Identity' },
         T: { zh: '传统性', en: 'Tradition' },
         all: { zh: '所有RPAIT维度', en: 'All RPAIT Dimensions' }
       }
     };
     return labels;
   }
   ```

2. **Persona Name Selector**:
   ```javascript
   function getPersonaName(persona, lang = 'zh') {
     return lang === 'en' ? persona.nameEn || persona.nameZh : persona.nameZh;
   }
   ```

3. **Language Change Listener**:
   ```javascript
   document.addEventListener('langchange', (e) => {
     const lang = e.detail.lang;
     updateRadarChart();  // Re-render with new language
     updateMatrixChart(); // Re-render with new language
   });
   ```

### Why This Approach

1. **Centralized Translations** - All label translations in one place, easy to maintain
2. **Chart.js Compatible** - Works with Chart.js's data update API
3. **Event-Driven** - Leverages existing `langchange` event from `lang-manager.js`
4. **Consistent Pattern** - Similar to how critique text switches language
5. **No DOM Manipulation** - Updates Chart.js data directly (cleaner than HTML)

---

## Scope & Impact

### Files Modified

1. **js/visualizations/rpait-radar.js** (1 file)
   - Add `getChartLabels()` function
   - Add `getPersonaName()` function
   - Update `getChartData()` to use dynamic labels
   - Add `langchange` event listener
   - Estimated changes: +40 lines, -5 lines

2. **js/visualizations/persona-matrix.js** (1 file)
   - Add `getChartLabels()` function
   - Add `getPersonaName()` function
   - Update `getChartData()` to use dynamic labels
   - Add `langchange` event listener
   - Estimated changes: +45 lines, -8 lines

### Affected Features

- ✅ RPAIT Radar Chart
- ✅ Persona Comparison Matrix (Bar Chart)
- ❌ No impact on other visualizations (none exist)
- ❌ No impact on critique text or hero title

### Risks

- **Medium Risk** - Chart.js instances need to be updated correctly
- **Testing Required** - Verify no memory leaks when re-rendering charts
- **Performance** - Re-rendering charts on language toggle (should be fast <100ms)

---

## Translation Accuracy

### Proposed English Translations

| Chinese | English | Source |
|---------|---------|--------|
| 代表性 | Representation | RPAIT framework definition |
| 哲学性 | Philosophicality | RPAIT framework definition |
| 美学性 | Aesthetics | RPAIT framework definition |
| 身份性 | Identity | RPAIT framework definition |
| 传统性 | Tradition | RPAIT framework definition |
| 所有RPAIT维度 | All RPAIT Dimensions | Composite label |
| 评论家对比矩阵 | Critic Comparison Matrix | Already used in HTML (line 188) |
| RPAIT雷达图 | RPAIT Radar Chart | Standard visualization term |

**Note**: These translations are consistent with existing documentation and the RPAIT framework paper (EMNLP 2025).

---

## Verification Plan

### Test Cases

#### Test 1: Radar Chart - Default Language (Chinese)
- Open `http://localhost:9999`
- Scroll to "数据洞察" section
- Inspect Radar Chart

**Expected**:
- Dimension labels: 代表性, 哲学性, 美学性, 身份性, 传统性
- Legend: Chinese persona names (苏轼, 郭熙, etc.)

#### Test 2: Radar Chart - Switch to English
- Click language toggle button (EN)
- Observe Radar Chart

**Expected**:
- Dimension labels change to: Representation, Philosophicality, Aesthetics, Identity, Tradition
- Legend changes to: English persona names (Su Shi, Guo Xi, etc.)
- No visual glitches or layout shifts

#### Test 3: Matrix Chart - Switch to English
- With English language active
- Observe Persona Comparison Matrix

**Expected**:
- Dataset labels (legend): Representation, Philosophicality, Aesthetics, Identity, Tradition
- Y-axis labels: English persona names
- ARIA label updates to English

#### Test 4: Switch Back to Chinese
- Click language toggle button (中)
- Observe both charts

**Expected**:
- All labels revert to Chinese
- No console errors

#### Test 5: Language Persistence
- Switch to English
- Refresh page (F5)

**Expected**:
- Charts load with English labels on initial render

### Success Criteria

- [ ] Radar chart labels display in current language
- [ ] Matrix chart labels display in current language
- [ ] Persona names display in current language (legend + Y-axis)
- [ ] Language switch updates charts instantly (<100ms)
- [ ] No console errors during language toggle
- [ ] No memory leaks (check with Chrome DevTools)
- [ ] ARIA labels update to match current language

---

## Dependencies

### Related Changes

- **Depends on**: `fix-hero-title-bilingual-support` (provides pattern reference)
- **Parent**: `implement-full-site-bilingual-support` (OpenSpec change)

### External Dependencies

- **lang-manager.js**: Provides `langchange` event
- **Chart.js**: Already loaded (v4.4.0)
- No new libraries required

---

## Timeline

| Phase | Task | Duration |
|-------|------|----------|
| 1 | Create `getChartLabels()` and `getPersonaName()` helpers | 10 min |
| 2 | Modify `rpait-radar.js` | 15 min |
| 3 | Modify `persona-matrix.js` | 15 min |
| 4 | Test all 5 test cases | 10 min |
| 5 | Validate with OpenSpec | 5 min |
| **Total** | | **55 min** |

---

## Implementation Notes

### Chart.js Data Update Pattern

To update Chart.js labels without recreating the instance:

```javascript
// Update chart data
radarChart.data.labels = getChartLabels(lang).dimensions[lang];
radarChart.data.datasets.forEach((dataset, i) => {
  const persona = personas[i];
  dataset.label = getPersonaName(persona, lang);
});

// Trigger update
radarChart.update('none'); // 'none' = no animation for instant update
```

### ARIA Label Pattern

```javascript
function updateARIALabel(lang) {
  const canvas = document.getElementById('rpait-radar-chart');
  const text = lang === 'en'
    ? `RPAIT radar chart showing ${count} critics`
    : `RPAIT雷达图显示 ${count} 位评论家`;
  canvas.setAttribute('aria-label', text);
}
```

---

## Open Questions

**Q1**: Should dimension labels use full words or abbreviations in English?
- **Option A**: "Representation" (current proposal)
- **Option B**: "R (Representation)"

**Decision**: Use full words for consistency with Chinese version

**Q2**: Should persona names use `nameEn` or transliterated names?
- **Example**: "Su Shi" vs "苏轼 (Su Shi)"

**Decision**: Use `persona.nameEn` (or fallback to `nameZh` if missing)

---

## Acceptance Criteria

- [ ] Radar chart displays bilingual dimension labels
- [ ] Radar chart legend displays bilingual persona names
- [ ] Matrix chart displays bilingual dataset labels
- [ ] Matrix chart Y-axis displays bilingual persona names
- [ ] Language toggle updates both charts instantly
- [ ] ARIA labels update to match current language
- [ ] No visual regressions (layout remains unchanged)
- [ ] Code follows existing patterns in visualization files
- [ ] OpenSpec validation passes (`openspec validate fix-chart-labels-bilingual-support --strict`)
