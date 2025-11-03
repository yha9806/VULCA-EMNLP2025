# Spec: Chart Localization

## Overview

Convert all bilingual labels (Chinese/English) in data visualization charts to pure Chinese, improving clarity for the target Chinese-speaking audience.

---

## ADDED Requirements

### Requirement: Radar Chart Pure Chinese Labels

All user-visible text in the RPAIT radar chart SHALL be displayed in Chinese only, removing English translations.

**Rationale**: The target audience is Chinese researchers. Bilingual labels create visual clutter and reduce readability.

**Scenarios**:

#### Scenario 1.1: Dimension labels are Chinese-only
**Given** the radar chart is rendered
**When** the user views the dimension labels
**Then** labels SHALL be `['代表性', '哲学性', '美学性', '身份性', '传统性']`
**And** labels SHALL NOT contain English translations

**Validation**:
```javascript
// rpait-radar.js:94-98
const labels = [
  '代表性',  // NOT '代表性 Representation'
  '哲学性',  // NOT '哲学性 Philosophy'
  '美学性',  // NOT '美学性 Aesthetic'
  '身份性',  // NOT '身份性 Identity'
  '传统性'   // NOT '传统性 Tradition'
];
```

#### Scenario 1.2: Legend shows Chinese names only
**Given** the radar chart displays persona data
**When** the user views the legend
**Then** legend SHALL show `persona.nameZh` (e.g., "苏轼")
**And** legend SHALL NOT show English names (e.g., "(Su Shi)")

**Validation**:
```javascript
// rpait-radar.js:112
label: persona.nameZh,  // NOT `${persona.nameZh} (${persona.nameEn})`
```

---

### Requirement: Matrix Chart Pure Chinese Labels

All user-visible text in the persona comparison matrix chart SHALL be displayed in Chinese only.

**Scenarios**:

#### Scenario 2.1: Dataset labels are Chinese
**Given** the matrix chart is rendered in "all dimensions" mode
**When** the user views the legend
**Then** labels SHALL be `['代表性', '哲学性', '美学性', '身份性', '传统性']`

**Validation**:
```javascript
// persona-matrix.js:102-125
const datasets = [
  { label: '代表性', ... },  // NOT '代表性 Representation'
  { label: '哲学性', ... },
  { label: '美学性', ... },
  { label: '身份性', ... },
  { label: '传统性', ... }
];
```

---

### Requirement: HTML Section Titles Localized

The Data Insights section title SHALL be displayed in Chinese only.

**Scenarios**:

#### Scenario 3.1: Section header is Chinese-only
**Given** the user views the main page
**When** they see the data visualization section
**Then** the header SHALL be "数据洞察"
**And** SHALL NOT include "/ Data Insights"

**Validation**:
```html
<!-- index.html:138 -->
<h2>数据洞察</h2>  <!-- NOT "数据洞察 / Data Insights" -->
```

---

### Requirement: Dropdown Options Localized

All dimension selector dropdown options SHALL be displayed in Chinese only.

**Scenarios**:

#### Scenario 4.1: Dropdown shows Chinese options
**Given** the dimension selector dropdown is opened
**When** the user views the options
**Then** options SHALL be pure Chinese
**And** SHALL NOT contain English translations

**Validation**:
```html
<!-- index.html:165-169 -->
<option value="all">全部维度</option>  <!-- NOT "全部维度 / All Dimensions" -->
<option value="R">代表性</option>
<option value="P">哲学性</option>
<option value="A">美学性</option>
<option value="I">身份性</option>
<option value="T">传统性</option>
```

---

### Requirement: ARIA Labels Localized

All ARIA labels for accessibility SHALL be in Chinese to match the interface language.

**Rationale**: WCAG 2.1 AA requires consistent language for screen reader users.

**Scenarios**:

#### Scenario 5.1: Radar chart ARIA label is Chinese
**Given** a screen reader user accesses the radar chart
**When** the chart's aria-label is read
**Then** it SHALL be in Chinese format: `"RPAIT雷达图显示 N 位评论家：名字1、名字2"`

**Validation**:
```javascript
// rpait-radar.js:233-234
`RPAIT雷达图显示 ${selectedPersonas.length} 位评论家：${personaNames.join('、')}`
```

#### Scenario 5.2: Matrix chart ARIA label is Chinese
**Given** a screen reader user accesses the matrix chart
**When** the chart's aria-label is read
**Then** it SHALL include Chinese dimension name: `"评论家对比矩阵显示所有评论家的代表性"`

**Validation**:
```javascript
// persona-matrix.js:187
`评论家对比矩阵显示所有评论家的${dimensionText}`
```

---

### Requirement: Chinese Punctuation Usage

All Chinese text SHALL use proper Chinese punctuation marks.

**Scenarios**:

#### Scenario 6.1: Use enumeration comma in lists
**Given** multiple persona names are joined in ARIA labels
**When** the names are concatenated
**Then** they SHALL use `、` (Chinese enumeration comma)
**And** SHALL NOT use `,` (Western comma)

**Validation**:
```javascript
// rpait-radar.js:231
personaNames.join('、')  // "苏轼、郭熙、约翰·罗斯金"
// NOT: personaNames.join(', ')
```

---

## Test Coverage

### Validation Grep Commands

```bash
# Verify no English dimension keywords remain
rg "Representation|Philosophy|Aesthetic|Identity|Tradition" js/visualizations/ --glob "*.js"
# Expected: 0 matches

# Verify no bilingual titles remain
rg "数据洞察 / Data Insights" index.html
# Expected: 0 matches

# Verify Chinese punctuation usage
rg "join\(', '\)" js/visualizations/ --glob "*.js"
# Expected: 0 matches
```

---

## Dependencies

- Existing VULCA_DATA structure (persona.nameZh, persona.nameEn)
- Chart.js label configuration
- HTML dropdown elements

---

## Accessibility Requirements

- ARIA labels MUST be in Chinese
- Screen readers MUST correctly announce Chinese text (tested with NVDA/VoiceOver)
- Language attribute SHOULD be set to `lang="zh"` for Chinese text spans
