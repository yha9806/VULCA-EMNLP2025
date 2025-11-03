# Legend Improvement Specification

**Feature**: Discrete Labeled Color Swatches Legend
**Component**: `js/visualizations/similarity-heatmap.js`, `styles/main.css`, `index.html`
**Status**: Proposed

---

## Overview

Replace the current generic gradient bar legend with a discrete labeled swatches legend that explicitly shows the 5 viridis color ranges with their corresponding similarity values and Chinese/English labels.

---

## MODIFIED Requirements

### Requirement: Legend SHALL Display Discrete Color Swatches

The legend MUST display 5 discrete color swatches instead of a continuous gradient bar.

**Previous**: Continuous gradient bar with only "低相似度" and "高相似度" labels at endpoints
**New**: 5 discrete swatches with specific value ranges and labels

**Rationale**: Discrete swatches make it clear which colors correspond to which similarity ranges, improving interpretation.

#### Scenario: Legend structure with 5 swatches

**Given** the heatmap is rendered with the new legend
**When** inspecting the legend element
**Then** it SHALL contain exactly 5 legend items
**And** each item SHALL have:
  - A color swatch element
  - A text label with value range
  - A Chinese descriptive label

**Validation**:
```javascript
const legend = document.querySelector('.heatmap-legend');
const items = legend.querySelectorAll('.legend-item');

assert(items.length === 5, 'Should have 5 legend items');

items.forEach(item => {
  const swatch = item.querySelector('.legend-swatch');
  const label = item.querySelector('.legend-label');

  assert(swatch !== null, 'Each item should have a color swatch');
  assert(label !== null, 'Each item should have a text label');
  assert(swatch.style.backgroundColor !== '', 'Swatch should have background color');
});
```

---

### Requirement: Legend Items SHALL Match Viridis Color Stops

Each legend swatch MUST display the exact viridis color from the color scheme specification.

#### Scenario: Color swatch values

**Given** the legend is rendered
**When** inspecting the color swatches
**Then** the swatches SHALL have the following background colors:
  1. `#440154` (deep purple) - 0.0-0.3 range
  2. `#31688e` (blue) - 0.3-0.5 range
  3. `#35b779` (green) - 0.5-0.7 range
  4. `#fde724` (yellow) - 0.7-0.9 range
  5. `#ffffff` (white) with border - 0.9-1.0 range

**Validation**:
```javascript
const swatches = document.querySelectorAll('.legend-swatch');

const expectedColors = ['#440154', '#31688e', '#35b779', '#fde724', '#ffffff'];
swatches.forEach((swatch, index) => {
  const bg = window.getComputedStyle(swatch).backgroundColor;
  const hex = rgbToHex(bg);
  assert(hex.toLowerCase() === expectedColors[index].toLowerCase(),
    `Swatch ${index} should be ${expectedColors[index]}`);
});

// Last swatch (white) should have a border for visibility
const lastSwatch = swatches[swatches.length - 1];
const border = window.getComputedStyle(lastSwatch).border;
assert(border !== 'none' && border !== '', 'White swatch should have border');
```

---

### Requirement: Legend Labels SHALL Display Value Ranges and Chinese Labels

Each legend item MUST show:
- The similarity value range (e.g., "0.0-0.3")
- A Chinese descriptive label (e.g., "极低")

#### Scenario: Legend label content

**Given** the legend is rendered
**When** inspecting the label text
**Then** the following labels SHALL be displayed:
  1. "0.0-0.3 极低" (Very Low)
  2. "0.3-0.5 低" (Low)
  3. "0.5-0.7 中" (Medium)
  4. "0.7-0.9 高" (High)
  5. "0.9-1.0 极高" (Very High)

**Validation**:
```javascript
const labels = document.querySelectorAll('.legend-label');
const expectedLabels = [
  '0.0-0.3 极低',
  '0.3-0.5 低',
  '0.5-0.7 中',
  '0.7-0.9 高',
  '0.9-1.0 极高'
];

labels.forEach((label, index) => {
  assert(label.textContent.includes(expectedLabels[index]),
    `Label ${index} should include "${expectedLabels[index]}"`);
});
```

---

### Requirement: Legend Layout SHALL Be Horizontal on Desktop

The legend items SHALL be arranged horizontally in a row on desktop viewports (≥768px).

**Rationale**: Horizontal layout matches the linear progression of similarity values and fits naturally below the heatmap.

#### Scenario: Horizontal layout on desktop

**Given** the viewport width is ≥768px
**When** the legend is rendered
**Then** the legend container SHALL use flexbox or grid with horizontal direction
**And** all 5 items SHALL be displayed in a single row

**Validation**:
```javascript
window.resizeTo(1024, 768);

const legend = document.querySelector('.heatmap-legend');
const styles = window.getComputedStyle(legend);

assert(
  styles.display === 'flex' && styles.flexDirection === 'row' ||
  styles.display === 'grid' && parseInt(styles.gridTemplateColumns.split(' ').length) >= 5,
  'Legend should use horizontal layout on desktop'
);

const items = legend.querySelectorAll('.legend-item');
const firstItemRect = items[0].getBoundingClientRect();
const lastItemRect = items[items.length - 1].getBoundingClientRect();

// All items should be roughly at the same vertical position
const verticalTolerance = 10;
assert(
  Math.abs(firstItemRect.top - lastItemRect.top) < verticalTolerance,
  'All legend items should be in the same row'
);
```

---

### Requirement: Legend Layout SHALL Be Responsive on Mobile

The legend items MAY wrap or stack vertically on mobile devices (<768px) to fit available space.

#### Scenario: Responsive layout on mobile

**Given** the viewport width is <768px
**When** the legend is rendered
**Then** the legend items MAY wrap to multiple rows
**Or** MAY stack vertically
**And** all items SHALL remain visible and readable

**Validation**:
```javascript
window.resizeTo(375, 667);

const legend = document.querySelector('.heatmap-legend');
const items = legend.querySelectorAll('.legend-item');

// All items should be visible
items.forEach(item => {
  const rect = item.getBoundingClientRect();
  assert(rect.width > 0 && rect.height > 0, 'Item should be visible');
});

// Items should fit within viewport
const legendRect = legend.getBoundingClientRect();
assert(legendRect.right <= window.innerWidth, 'Legend should not overflow viewport');
```

---

## REMOVED Requirements

### Requirement: Generic Gradient Bar SHALL Be Removed

The existing `.legend-gradient` element with continuous gradient SHALL be removed.

**Previous HTML**:
```html
<div class="viz-legend">
  <span>低相似度</span>
  <div class="legend-gradient"></div>
  <span>高相似度</span>
</div>
```

#### Scenario: Old gradient bar no longer exists

**Given** the heatmap is rendered with new legend
**When** searching for `.legend-gradient` element
**Then** no such element SHALL exist in the DOM
**And** no CSS SHALL reference `.legend-gradient`

**Validation**:
```javascript
const gradientBar = document.querySelector('.legend-gradient');
assert(gradientBar === null, 'Old gradient bar should be removed');

// Check CSS doesn't reference it
const styles = document.styleSheets;
let foundGradientRef = false;
for (let sheet of styles) {
  try {
    for (let rule of sheet.cssRules) {
      if (rule.selectorText && rule.selectorText.includes('legend-gradient')) {
        foundGradientRef = true;
        break;
      }
    }
  } catch (e) {} // Skip CORS-blocked stylesheets
}
assert(!foundGradientRef, 'CSS should not reference .legend-gradient');
```

---

## ADDED Requirements

### Requirement: Legend Title SHALL Be Added

A title element SHALL precede the legend items to label the legend.

#### Scenario: Legend title

**Given** the legend is rendered
**When** inspecting the legend structure
**Then** a title element SHALL exist with text "相似度范围" or "Similarity Range"
**And** the title SHALL be visually distinct (bold or different size)

**Validation**:
```javascript
const legendTitle = document.querySelector('.heatmap-legend .legend-title');
assert(legendTitle !== null, 'Legend should have a title');
assert(
  legendTitle.textContent === '相似度范围' || legendTitle.textContent === 'Similarity Range',
  'Title should be in Chinese or English'
);

const styles = window.getComputedStyle(legendTitle);
assert(
  parseInt(styles.fontWeight) >= 600 || parseFloat(styles.fontSize) > 14,
  'Title should be visually distinct'
);
```

---

### Requirement: Swatch Size SHALL Be Consistent

All color swatches SHALL have the same size for visual consistency.

#### Scenario: Uniform swatch dimensions

**Given** the legend is rendered
**When** measuring swatch dimensions
**Then** all swatches SHALL have the same width and height
**And** swatches SHALL be at least 20px × 20px for visibility

**Validation**:
```javascript
const swatches = document.querySelectorAll('.legend-swatch');
const firstRect = swatches[0].getBoundingClientRect();

swatches.forEach((swatch, index) => {
  const rect = swatch.getBoundingClientRect();
  assert(rect.width === firstRect.width, `Swatch ${index} width should match first swatch`);
  assert(rect.height === firstRect.height, `Swatch ${index} height should match first swatch`);
  assert(rect.width >= 20 && rect.height >= 20, 'Swatches should be at least 20px × 20px');
});
```

---

### Requirement: Legend SHALL Include Accessibility Attributes

The legend MUST include ARIA attributes for screen reader support.

#### Scenario: ARIA labels on legend

**Given** the legend is rendered
**When** inspecting accessibility attributes
**Then** the legend container SHALL have `role="legend"` or `role="list"`
**And** each legend item SHALL have descriptive `aria-label`

**Validation**:
```javascript
const legend = document.querySelector('.heatmap-legend');
const role = legend.getAttribute('role');
assert(role === 'legend' || role === 'list', 'Legend should have appropriate role');

const items = legend.querySelectorAll('.legend-item');
items.forEach((item, index) => {
  const ariaLabel = item.getAttribute('aria-label');
  assert(ariaLabel !== null && ariaLabel !== '', 'Legend item should have aria-label');
  assert(ariaLabel.includes('相似度') || ariaLabel.includes('similarity'),
    'Aria label should describe similarity range');
});
```

---

## Non-Functional Requirements

### Visual Design

- **Requirement**: Legend SHALL be visually subordinate to heatmap (smaller font, lighter weight)
- **Requirement**: Legend SHALL have adequate spacing between items (≥8px gap)
- **Requirement**: White swatch SHALL have a subtle border (1px solid #ccc) for visibility
- **Requirement**: Legend SHALL align with heatmap width on desktop

### Accessibility

- **Requirement**: Color swatches SHALL have text labels (not color-only)
- **Requirement**: Legend SHALL be readable by screen readers
- **Requirement**: Text color SHALL contrast with background (WCAG AA)

### Responsiveness

- **Requirement**: Legend SHALL adapt to all viewport sizes (375px-1920px+)
- **Requirement**: Legend items SHALL remain readable on mobile (font size ≥12px)
- **Requirement**: Legend SHALL not cause horizontal scrolling

### Performance

- **Requirement**: Legend rendering SHALL complete in <20ms
- **Requirement**: Legend SHALL not cause layout shift when rendered

---

## Implementation Notes

### HTML Structure

```html
<div class="heatmap-legend" role="legend">
  <div class="legend-title">相似度范围</div>

  <div class="legend-items">
    <div class="legend-item" aria-label="极低相似度，0.0到0.3">
      <span class="legend-swatch" style="background-color: #440154;"></span>
      <span class="legend-label">0.0-0.3 极低</span>
    </div>

    <div class="legend-item" aria-label="低相似度，0.3到0.5">
      <span class="legend-swatch" style="background-color: #31688e;"></span>
      <span class="legend-label">0.3-0.5 低</span>
    </div>

    <div class="legend-item" aria-label="中等相似度，0.5到0.7">
      <span class="legend-swatch" style="background-color: #35b779;"></span>
      <span class="legend-label">0.5-0.7 中</span>
    </div>

    <div class="legend-item" aria-label="高相似度，0.7到0.9">
      <span class="legend-swatch" style="background-color: #fde724;"></span>
      <span class="legend-label">0.7-0.9 高</span>
    </div>

    <div class="legend-item" aria-label="极高相似度，0.9到1.0">
      <span class="legend-swatch" style="background-color: #ffffff; border: 1px solid #ccc;"></span>
      <span class="legend-label">0.9-1.0 极高</span>
    </div>
  </div>
</div>
```

### CSS Styling

```css
.heatmap-legend {
  margin-top: var(--spacing-md, 16px);
  padding: 12px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
}

.legend-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--color-text, #333);
}

.legend-items {
  display: flex;
  flex-direction: row;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-swatch {
  width: 24px;
  height: 24px;
  border-radius: 3px;
  flex-shrink: 0;
}

.legend-label {
  font-size: 12px;
  color: var(--color-text-light, #666);
  white-space: nowrap;
}

/* Mobile responsive */
@media (max-width: 767px) {
  .legend-items {
    gap: 8px;
  }

  .legend-swatch {
    width: 20px;
    height: 20px;
  }

  .legend-label {
    font-size: 11px;
  }
}
```

### JavaScript Rendering

```javascript
function renderHeatmapLegend() {
  const legendContainer = document.querySelector('.heatmap-legend');

  // Clear existing content
  legendContainer.innerHTML = '';

  // Add title
  const title = document.createElement('div');
  title.className = 'legend-title';
  title.textContent = '相似度范围';
  legendContainer.appendChild(title);

  // Legend items data
  const legendData = [
    { color: '#440154', range: '0.0-0.3', label: '极低', ariaLabel: '极低相似度，0.0到0.3' },
    { color: '#31688e', range: '0.3-0.5', label: '低', ariaLabel: '低相似度，0.3到0.5' },
    { color: '#35b779', range: '0.5-0.7', label: '中', ariaLabel: '中等相似度，0.5到0.7' },
    { color: '#fde724', range: '0.7-0.9', label: '高', ariaLabel: '高相似度，0.7到0.9' },
    { color: '#ffffff', range: '0.9-1.0', label: '极高', ariaLabel: '极高相似度，0.9到1.0', border: true }
  ];

  // Create items container
  const itemsContainer = document.createElement('div');
  itemsContainer.className = 'legend-items';

  // Create each legend item
  legendData.forEach(data => {
    const item = document.createElement('div');
    item.className = 'legend-item';
    item.setAttribute('aria-label', data.ariaLabel);

    // Color swatch
    const swatch = document.createElement('span');
    swatch.className = 'legend-swatch';
    swatch.style.backgroundColor = data.color;
    if (data.border) {
      swatch.style.border = '1px solid #ccc';
    }

    // Text label
    const label = document.createElement('span');
    label.className = 'legend-label';
    label.textContent = `${data.range} ${data.label}`;

    item.appendChild(swatch);
    item.appendChild(label);
    itemsContainer.appendChild(item);
  });

  legendContainer.appendChild(itemsContainer);
  legendContainer.setAttribute('role', 'legend');
}
```

---

## Test Cases

| Test ID | Description | Expected Result |
|---------|-------------|-----------------|
| LI-01 | Legend has 5 items | Exactly 5 legend items rendered |
| LI-02 | Swatch colors match viridis | All 5 colors match color scheme spec |
| LI-03 | Labels show value ranges | All items show "X.X-X.X 标签" format |
| LI-04 | White swatch has border | Last swatch has visible border |
| LI-05 | Horizontal layout desktop | Items in single row on ≥768px |
| LI-06 | Responsive on mobile | Items wrap or stack on <768px |
| LI-07 | Old gradient removed | `.legend-gradient` doesn't exist |
| LI-08 | Legend title exists | Title "相似度范围" displayed |
| LI-09 | Uniform swatch size | All swatches same dimensions |
| LI-10 | Swatches ≥20px | All swatches at least 20×20px |
| LI-11 | ARIA attributes | `role="legend"` and `aria-label` on items |
| LI-12 | Visual hierarchy | Legend subordinate to heatmap |
| LI-13 | Adequate spacing | ≥8px gap between items |
| LI-14 | No horizontal scroll | Legend fits within viewport |
| LI-15 | Fast rendering | Completes in <20ms |

---

## Visual Comparison

### Before (Current)
```
┌─────────────────────────────────────┐
│ 低相似度 ████████████████ 高相似度  │  ← Generic gradient
└─────────────────────────────────────┘
```

### After (Enhanced)
```
相似度范围
┌────────┬────────┬────────┬────────┬────────┐
│ █ 0.0- │ █ 0.3- │ █ 0.5- │ █ 0.7- │ ▢ 0.9- │
│   0.3  │   0.5  │   0.7  │   0.9  │   1.0  │
│   极低  │   低   │   中   │   高   │   极高 │
└────────┴────────┴────────┴────────┴────────┘
         ← 5 discrete labeled swatches
```

---

## Dependencies

- `color-scheme/spec.md` - Viridis color values for swatches
- `index.html` - Legend container structure

---

## Related Specs

- `color-scheme/spec.md` - Colors shown in legend match heatmap colors
- `axis-labels/spec.md` - Legend positioned below heatmap and labels
- `value-display/spec.md` - Consistent use of value ranges
