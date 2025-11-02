# Specification: RPAIT Radar Chart Visualization

**Capability**: `rpait-radar-chart`
**Version**: 1.0
**Status**: Proposed

---

## Overview

The RPAIT Radar Chart provides an intuitive visual representation of persona critique profiles across five dimensions: Representation (R), Philosophy (P), Aesthetic (A), Identity (I), and Tradition (T). Users can compare personas visually and filter by artwork to see context-specific scores.

---

## ADDED Requirements

### Requirement 1: Radar Chart Rendering
**ID**: `RRC-001`
**Priority**: MUST
**Type**: Functional

The system SHALL render a radar chart displaying RPAIT scores for one or more personas using Chart.js type 'radar'.

**Acceptance Criteria**:
- Chart displays 5 axes labeled "Representation", "Philosophy", "Aesthetic", "Identity", "Tradition"
- Each axis scale ranges from 0-10 with step size of 2
- Chart renders without visual distortion on all supported screen sizes
- Chart uses persona.color from data.js for consistent branding

#### Scenario: Single Persona Display
**Given** the user views the visualization section
**When** the page loads with default state
**Then** the radar chart displays Su Shi's RPAIT scores (R:7, P:9, A:8, I:8, T:7)
**And** the chart uses Su Shi's brand color (#B85C3C) for the data series
**And** the chart background shows a semi-transparent fill (rgba with 0.2 alpha)

**Verification Code**:
```javascript
const chart = Chart.getChart('rpait-radar-chart');
expect(chart.config.type).toBe('radar');
expect(chart.data.datasets[0].label).toBe('苏轼 (Su Shi)');
expect(chart.data.datasets[0].data).toEqual([7, 9, 8, 8, 7]);
expect(chart.data.datasets[0].borderColor).toBe('#B85C3C');
```

---

### Requirement 2: Comparison Mode
**ID**: `RRC-002`
**Priority**: SHOULD
**Type**: Functional

The system SHOULD allow overlaying up to 3 personas on the same radar chart for direct comparison.

**Acceptance Criteria**:
- Toggle button switches between "Single Mode" and "Comparison Mode"
- In comparison mode, user can select 2-3 personas via dropdown or persona cards
- Each persona's data series uses its unique color from data.js
- Legend displays all visible personas with color indicators

#### Scenario: Compare Two Personas
**Given** the radar chart is in comparison mode
**When** the user selects "苏轼 (Su Shi)" and "郭熙 (Guo Xi)"
**Then** the chart displays both personas' RPAIT scores overlaid
**And** Su Shi's series uses color #B85C3C
**And** Guo Xi's series uses color #5D8AA8
**And** the legend shows both names with color swatches

**Verification Code**:
```javascript
const chart = Chart.getChart('rpait-radar-chart');
expect(chart.data.datasets.length).toBe(2);
expect(chart.data.datasets[0].label).toContain('Su Shi');
expect(chart.data.datasets[1].label).toContain('Guo Xi');
expect(chart.data.datasets[0].borderColor).toBe('#B85C3C');
expect(chart.data.datasets[1].borderColor).toBe('#5D8AA8');
```

---

### Requirement 3: Artwork Filtering
**ID**: `RRC-003`
**Priority**: MUST
**Type**: Functional

The system SHALL update the radar chart when the carousel artwork changes, displaying persona scores specific to the active artwork.

**Acceptance Criteria**:
- Chart listens to 'visualization:update' custom event
- When artwork changes, chart fetches artwork-specific RPAIT scores from VULCA_DATA.critiques
- Chart updates within 100ms of event firing
- Chart animation completes smoothly (200ms duration)

#### Scenario: Carousel Navigation Updates Chart
**Given** the radar chart displays Su Shi's overall average scores
**When** the user navigates to artwork-2 in the carousel
**Then** the radar chart updates to show Su Shi's scores for artwork-2 specifically
**And** the chart update completes within 100ms
**And** the chart title changes to "苏轼 - 作品2"

**Verification Code**:
```javascript
// Trigger carousel change
window.dispatchEvent(new CustomEvent('visualization:update', {
  detail: { artworkId: 'artwork-2' }
}));

// Wait for update
await waitFor(100);

const chart = Chart.getChart('rpait-radar-chart');
const artwork2Critique = VULCA_DATA.critiques.find(
  c => c.artworkId === 'artwork-2' && c.personaId === 'su-shi'
);
expect(chart.data.datasets[0].data).toEqual([
  artwork2Critique.rpait.R,
  artwork2Critique.rpait.P,
  artwork2Critique.rpait.A,
  artwork2Critique.rpait.I,
  artwork2Critique.rpait.T
]);
```

---

### Requirement 4: Responsive Design
**ID**: `RRC-004`
**Priority**: MUST
**Type**: Non-Functional

The radar chart SHALL adapt to different screen sizes while maintaining readability and visual integrity.

**Acceptance Criteria**:
- Desktop (≥1024px): Chart size 500×400px, fits 2 charts side-by-side
- Tablet (768-1023px): Chart size 400×320px, single column layout
- Mobile (≤767px): Chart size 100% width × 280px height, labels abbreviated if needed
- Font sizes scale proportionally (18px → 14px → 12px)

#### Scenario: Mobile Layout Adaptation
**Given** the user views the page on a mobile device (375px width)
**When** the radar chart renders
**Then** the chart occupies full container width (minus padding)
**And** the chart height is 280px
**And** axis labels use abbreviated form ("Rep", "Phil", "Aes", "Iden", "Trad")
**And** all text remains readable (minimum 12px font size)

**Verification Code**:
```javascript
// Set viewport to mobile
window.resizeTo(375, 667);
await waitForResize();

const canvas = document.getElementById('rpait-radar-chart');
const computedStyle = getComputedStyle(canvas);
expect(canvas.width).toBeGreaterThan(320);  // Accounting for padding
expect(canvas.height).toBe(280);

const chart = Chart.getChart('rpait-radar-chart');
expect(chart.data.labels).toEqual(['Rep', 'Phil', 'Aes', 'Iden', 'Trad']);
```

---

### Requirement 5: Accessibility Compliance
**ID**: `RRC-005`
**Priority**: MUST
**Type**: Non-Functional

The radar chart SHALL meet WCAG 2.1 AA accessibility standards.

**Acceptance Criteria**:
- Canvas element has role="img" and descriptive aria-label
- Color contrast ratio ≥4.5:1 for all text on backgrounds
- Keyboard users can Tab to chart controls and interact
- Screen readers announce data changes when chart updates

#### Scenario: Screen Reader Announces Chart Data
**Given** a screen reader user navigates to the radar chart
**When** the chart focus is activated
**Then** the screen reader announces: "RPAIT radar chart showing Su Shi's scores: Representation 7, Philosophy 9, Aesthetic 8, Identity 8, Tradition 7"
**And** when the chart updates, the screen reader announces the new data

**Verification Code**:
```html
<canvas id="rpait-radar-chart"
        role="img"
        aria-label="RPAIT radar chart showing Su Shi's scores: Representation 7, Philosophy 9, Aesthetic 8, Identity 8, Tradition 7"
        tabindex="0">
</canvas>
```

```javascript
// Test contrast ratio
const textColor = getComputedStyle(document.querySelector('.viz-panel h3')).color;
const bgColor = getComputedStyle(document.querySelector('.viz-panel')).backgroundColor;
const contrast = calculateContrastRatio(textColor, bgColor);
expect(contrast).toBeGreaterThanOrEqual(4.5);
```

---

### Requirement 6: Performance Optimization
**ID**: `RRC-006`
**Priority**: SHOULD
**Type**: Non-Functional

The radar chart SHOULD render and update efficiently without blocking the main thread.

**Acceptance Criteria**:
- Initial render completes within 300ms
- Chart update (data change) completes within 100ms
- Chart resize (responsive) completes within 150ms
- Memory usage <10MB for chart instance

#### Scenario: Fast Initial Render
**Given** the user scrolls to the visualization section
**When** the radar chart initializes
**Then** the chart renders fully within 300ms
**And** the browser main thread is not blocked for >16ms (60fps)

**Verification Code**:
```javascript
const startTime = performance.now();

// Initialize chart
const chart = new Chart(ctx, config);

const renderTime = performance.now() - startTime;
expect(renderTime).toBeLessThan(300);

// Check for long tasks
const longTasks = performance.getEntriesByType('longtask');
const blockingTasks = longTasks.filter(task => task.duration > 16);
expect(blockingTasks.length).toBe(0);
```

---

## MODIFIED Requirements

None. This is a new feature with no modifications to existing functionality.

---

## REMOVED Requirements

None. No existing features are being removed.

---

## Data Dependencies

**Requires**:
- `VULCA_DATA.personas[]` with fields:
  - `id` (string): Unique persona identifier
  - `nameZh` (string): Chinese name for display
  - `nameEn` (string): English name for display
  - `color` (string): Hex color code for chart styling
  - `rpait` (object): Average RPAIT scores across all artworks
    - `R`, `P`, `A`, `I`, `T` (numbers 0-10)

- `VULCA_DATA.critiques[]` with fields:
  - `artworkId` (string): Reference to artwork
  - `personaId` (string): Reference to persona
  - `rpait` (object): Artwork-specific RPAIT scores
    - `R`, `P`, `A`, `I`, `T` (numbers 0-10)

**Example Data**:
```javascript
{
  personas: [
    {
      id: "su-shi",
      nameZh: "苏轼",
      nameEn: "Su Shi",
      color: "#B85C3C",
      rpait: { R: 7, P: 9, A: 8, I: 8, T: 7 }
    }
  ],
  critiques: [
    {
      artworkId: "artwork-1",
      personaId: "su-shi",
      rpait: { R: 7, P: 9, A: 8, I: 8, T: 6 }  // Note: T differs from average
    }
  ]
}
```

---

## Implementation Notes

### Chart.js Configuration Template

```javascript
const config = {
  type: 'radar',
  data: {
    labels: [
      '代表性 Representation',
      '哲学性 Philosophy',
      '美学性 Aesthetic',
      '身份性 Identity',
      '传统性 Tradition'
    ],
    datasets: [{
      label: persona.nameZh + ' (' + persona.nameEn + ')',
      data: [
        persona.rpait.R,
        persona.rpait.P,
        persona.rpait.A,
        persona.rpait.I,
        persona.rpait.T
      ],
      backgroundColor: hexToRgba(persona.color, 0.2),
      borderColor: persona.color,
      borderWidth: 2,
      pointBackgroundColor: persona.color,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: persona.color
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.25,  // 500:400 = 1.25
    scales: {
      r: {
        min: 0,
        max: 10,
        ticks: {
          stepSize: 2,
          font: { size: 12 }
        },
        pointLabels: {
          font: { size: 14 }
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 14 },
          usePointStyle: true
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const dimension = ['R', 'P', 'A', 'I', 'T'][context.dataIndex];
            return `${dimension}: ${context.parsed.r}/10`;
          }
        }
      }
    },
    animation: {
      duration: 200,
      easing: 'easeInOutQuad'
    }
  }
};
```

### Event Handling

```javascript
// Listen for carousel changes
window.addEventListener('visualization:update', (e) => {
  const { artworkId } = e.detail;
  updateRadarChart(artworkId);
});

// Update chart data
function updateRadarChart(artworkId) {
  const chart = Chart.getChart('rpait-radar-chart');
  const currentPersona = getActivePersona();  // From state management

  // Get artwork-specific scores
  const critique = VULCA_DATA.critiques.find(
    c => c.artworkId === artworkId && c.personaId === currentPersona.id
  );

  // Update dataset
  chart.data.datasets[0].data = [
    critique.rpait.R,
    critique.rpait.P,
    critique.rpait.A,
    critique.rpait.I,
    critique.rpait.T
  ];

  // Update chart (no animation for smooth feel)
  chart.update('none');
}
```

---

## Testing Checklist

- [ ] Chart renders on page load without errors
- [ ] All 5 RPAIT dimensions display correctly
- [ ] Persona colors match data.js definitions
- [ ] Comparison mode overlays 2-3 personas
- [ ] Carousel navigation updates chart data
- [ ] Mobile layout scales appropriately
- [ ] Keyboard navigation works (Tab, Enter, Arrow keys)
- [ ] Screen reader announces chart content
- [ ] Color contrast meets WCAG AA
- [ ] Chart renders in <300ms
- [ ] Chart updates in <100ms
- [ ] Memory usage stays under 10MB

---

**End of Specification**
