# Specification: Chart Labels Bilingual Support

**Capability**: `chart-labels-bilingual`
**Change**: `fix-chart-labels-bilingual-support`
**Status**: Proposed
**Priority**: High

---

## Overview

This specification defines the requirements for making data visualization chart labels support bilingual display (Chinese and English) with automatic language switching.

---

## ADDED Requirements

### Requirement: Radar Chart Labels SHALL Display in Current Language

**ID**: `CL-BIL-001`
**Priority**: High

The RPAIT Radar Chart SHALL display dimension labels and persona names in the current language setting.

**Acceptance Criteria**:
- Dimension labels use current language (代表性/Representation, etc.)
- Legend persona names use current language (苏轼/Su Shi, etc.)
- Language switch updates labels within 100ms

#### Scenario: Radar chart renders with Chinese labels by default

**Given** the user navigates to the homepage with default language (zh)
**When** the page finishes loading
**Then** the radar chart displays dimension labels: ['代表性', '哲学性', '美学性', '身份性', '传统性']
**And** the legend displays Chinese persona names

**Verification**:
```javascript
const chart = window.RPAITRadar;
const canvas = document.getElementById('rpait-radar-chart');
const ctx = canvas.getContext('2d');
const chartInstance = Chart.getChart(canvas);

console.assert(chartInstance.data.labels.includes('代表性'), 'Chinese dimension labels expected');
console.assert(chartInstance.data.datasets[0].label.includes('苏轼') || chartInstance.data.datasets[0].label.includes('郭熙'), 'Chinese persona names expected');
```

#### Scenario: Radar chart updates to English when language switches

**Given** the radar chart is displaying Chinese labels
**When** the user clicks the language toggle button to switch to English
**Then** the radar chart updates dimension labels to: ['Representation', 'Philosophicality', 'Aesthetics', 'Identity', 'Tradition']
**And** the legend updates to English persona names (Su Shi, Guo Xi, etc.)
**And** the update completes within 100ms

**Verification**:
```javascript
const langToggle = document.getElementById('lang-toggle');
const startTime = performance.now();

langToggle.click();

setTimeout(() => {
  const chartInstance = Chart.getChart(document.getElementById('rpait-radar-chart'));
  const endTime = performance.now();

  console.assert(chartInstance.data.labels.includes('Representation'), 'English dimension labels expected');
  console.assert((endTime - startTime) < 100, 'Update should complete within 100ms');
}, 150);
```

---

### Requirement: Matrix Chart Labels SHALL Display in Current Language

**ID**: `CL-BIL-002`
**Priority**: High

The Persona Comparison Matrix SHALL display dataset labels and Y-axis persona names in the current language setting.

**Acceptance Criteria**:
- Dataset labels (legend) use current language
- Y-axis labels use current language
- Language switch updates labels within 100ms

#### Scenario: Matrix chart renders with Chinese labels by default

**Given** the user navigates to the homepage with default language (zh)
**When** the page finishes loading
**Then** the matrix chart displays dataset labels: ['代表性', '哲学性', '美学性', '身份性', '传统性']
**And** the Y-axis displays Chinese persona names

**Verification**:
```javascript
const chartInstance = Chart.getChart(document.getElementById('persona-matrix-chart'));

console.assert(chartInstance.data.datasets[0].label === '代表性', 'Chinese dataset label expected');
console.assert(chartInstance.data.labels.every(name => /[\u4e00-\u9fa5]/.test(name)), 'Chinese persona names expected');
```

#### Scenario: Matrix chart updates to English when language switches

**Given** the matrix chart is displaying Chinese labels
**When** the user clicks the language toggle button to switch to English
**Then** the matrix chart updates dataset labels to English
**And** the Y-axis updates to English persona names
**And** the update completes within 100ms

**Verification**:
```javascript
const langToggle = document.getElementById('lang-toggle');
langToggle.click();

setTimeout(() => {
  const chartInstance = Chart.getChart(document.getElementById('persona-matrix-chart'));

  console.assert(chartInstance.data.datasets[0].label === 'Representation', 'English dataset label expected');
  console.assert(chartInstance.data.labels.every(name => !/[\u4e00-\u9fa5]/.test(name)), 'English persona names expected');
}, 150);
```

---

### Requirement: Chart ARIA Labels SHALL Update with Language

**ID**: `CL-BIL-003`
**Priority**: Medium

Chart canvas elements' ARIA labels SHALL update to match the current language for accessibility.

**Acceptance Criteria**:
- ARIA labels use current language
- ARIA labels accurately describe chart content
- Screen readers announce language change

#### Scenario: ARIA labels update when switching to English

**Given** the charts are displaying Chinese labels
**When** the user switches to English
**Then** the radar chart's ARIA label updates to English
**And** the matrix chart's ARIA label updates to English

**Verification**:
```javascript
const langToggle = document.getElementById('lang-toggle');
langToggle.click();

setTimeout(() => {
  const radarCanvas = document.getElementById('rpait-radar-chart');
  const matrixCanvas = document.getElementById('persona-matrix-chart');

  const radarAria = radarCanvas.getAttribute('aria-label');
  const matrixAria = matrixCanvas.getAttribute('aria-label');

  console.assert(!/[\u4e00-\u9fa5]/.test(radarAria), 'Radar ARIA label should be in English');
  console.assert(!/[\u4e00-\u9fa5]/.test(matrixAria), 'Matrix ARIA label should be in English');
}, 150);
```

---

### Requirement: Chart Labels SHALL Persist Language Preference

**ID**: `CL-BIL-004`
**Priority**: Medium

When the page refreshes, charts SHALL render with the user's preferred language from localStorage.

**Acceptance Criteria**:
- Charts read language from `localStorage.getItem('preferred-lang')`
- Initial render uses correct language
- No flash of wrong language

#### Scenario: Charts render in English after page refresh

**Given** the user has switched to English (localStorage has 'preferred-lang' = 'en')
**When** the user refreshes the page
**Then** both charts render with English labels on initial load

**Verification**:
```javascript
localStorage.setItem('preferred-lang', 'en');
window.location.reload();

// After reload (in DOMContentLoaded):
document.addEventListener('DOMContentLoaded', () => {
  const radarChart = Chart.getChart(document.getElementById('rpait-radar-chart'));
  const matrixChart = Chart.getChart(document.getElementById('persona-matrix-chart'));

  console.assert(radarChart.data.labels.includes('Representation'), 'Radar should load in English');
  console.assert(matrixChart.data.datasets[0].label === 'Representation', 'Matrix should load in English');
});
```

---

## ADDED Requirements

None - this change modifies existing chart behavior.

---

## REMOVED Requirements

None - no functionality is being removed.

---

## Dependencies

### Internal Dependencies

- **lang-manager.js**: Provides `langchange` event and language state
- **Chart.js**: Version 4.4.0 (already loaded)
- **VULCA_DATA.personas**: Provides `nameZh` and `nameEn` fields

### External Dependencies

None - uses only existing libraries.

---

## Validation

### OpenSpec Validation

```bash
openspec validate fix-chart-labels-bilingual-support --strict
```

### Manual Testing Checklist

- [ ] Radar chart labels display in Chinese by default
- [ ] Radar chart labels switch to English when toggling language
- [ ] Matrix chart labels display in Chinese by default
- [ ] Matrix chart labels switch to English when toggling language
- [ ] Persona names use correct language in both charts
- [ ] ARIA labels update to match current language
- [ ] No console errors during language switching
- [ ] Language switch completes within 100ms
- [ ] Charts render in correct language after page refresh

---

## Non-Functional Requirements

### Performance

- Chart label update SHALL complete within 100ms
- No visible flicker during language transition
- No memory leaks after 10+ language toggles

### Accessibility

- ARIA labels SHALL match visible chart content
- ARIA labels SHALL use correct language
- Screen readers SHALL announce language changes

### Cross-Browser Compatibility

- SHALL work in Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- SHALL work on mobile browsers (iOS Safari, Chrome Android)

---

## Acceptance Criteria Summary

| ID | Description | Status |
|----|-------------|--------|
| CL-BIL-001 | Radar chart bilingual labels | ✅ Specified |
| CL-BIL-002 | Matrix chart bilingual labels | ✅ Specified |
| CL-BIL-003 | ARIA labels update with language | ✅ Specified |
| CL-BIL-004 | Language preference persistence | ✅ Specified |

---

## Notes

- English translations follow RPAIT framework terminology (EMNLP 2025 paper)
- Persona `nameEn` fields fallback to `nameZh` if missing
- Chart.js v4.4.0 supports hot data updates without destroying instances
