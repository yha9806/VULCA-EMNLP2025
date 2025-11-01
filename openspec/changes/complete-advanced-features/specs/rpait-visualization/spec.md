# RPAIT Data Visualization - Specification

**Capability:** Multi-dimensional art critique analysis with interactive charts

---

## ADDED Requirements

### R1: Radar Chart Rendering
The system SHALL render 5-dimensional RPAIT scores as an interactive radar chart.

#### Scenario: User views persona critique
```gherkin
Given user selects artwork "万物于万物" and persona "Su Shi"
When visualization engine loads critique data
Then radar chart displays with 5 dimensions:
  - Representation (R): 7
  - Philosophy (P): 9
  - Aesthetics (A): 8
  - Interpretation (I): 8
  - Technique (T): 6
And radar is filled with semi-transparent color matching persona
```

**Acceptance Criteria:**
- Chart displays all 5 dimensions
- Values visible at each axis point
- Scale: 0-10 (gridlines at 2, 4, 6, 8, 10)
- Fill color: persona color (e.g., Su Shi = gold)
- Alpha fill: 0.3 (30% opacity)
- Border: 2px solid line in persona color
- Hover shows dimension names + exact values
- Instant render (<100ms) when data loaded

---

### R2: Comparison View (Multiple Personas)
The system SHALL display 2-4 radar charts side-by-side for comparison.

#### Scenario: User compares three personas
```gherkin
Given user has Su Shi critique displayed
When user clicks "Add Su Shi to Comparison" (or similar)
Then a second radar chart appears showing Guo Xi scores
And when user adds Mama Zola, a third chart appears
And legend shows which color is which persona
```

**Acceptance Criteria:**
- Support 2-4 personas simultaneously
- Each persona has distinct color
- Legend clearly labels personas
- Charts aligned horizontally (side-by-side)
- Responsive: 1 per row on mobile, 2-4 per row on desktop
- "Remove from comparison" button for each persona
- Max 4 personas enforced (disable "Add" button)

---

### R3: Dimension Difference Highlighting
The system SHALL calculate and display differences between personas.

#### Scenario: User sees where personas differ
```gherkin
Given Su Shi (R:7) and Guo Xi (R:8) displayed
When comparison view active
Then difference table shows:
  Dimension | Su Shi | Guo Xi | Delta
  ──────────────────────────────────
  Representation | 7 | 8 | +1
  Philosophy | 9 | 7 | -2
  ...
And largest differences highlighted in color
```

**Acceptance Criteria:**
- Delta = Persona2 - Persona1
- Positive deltas shown in green (+)
- Negative deltas shown in red (-)
- Largest 2 differences highlighted with background color
- Table updates when personas switched

---

### R4: Dimension Heatmap View
The system SHALL provide tabular heatmap visualization.

#### Scenario: User browses all persona scores
```gherkin
Given user clicks "Heatmap" tab
When all personas' scores displayed
Then table shows:
  Personas      | R  | P  | A  | I  | T
  ──────────────────────────────────────
  Su Shi        | 7  | 9  | 8  | 8  | 6
  Guo Xi        | 8  | 7  | 9  | 7  | 8
  Ruskin        | 6  | 8  | 8  | 9  | 5
  Mama Zola     | 7  | 6  | 7  | 8  | 6
  Elena Petrova | 9  | 7  | 9  | 6  | 9
  AI Reviewer   | 7  | 8  | 7  | 8  | 8
And cell colors represent intensity (white=0, dark=10)
```

**Acceptance Criteria:**
- All 6 personas visible in one view
- All 5 dimensions visible in columns
- Color intensity: white (score 0) → dark (score 10)
- Hover shows exact numeric value
- Click dimension to filter search (future feature)
- Works on mobile (scroll horizontally)

---

### R5: Data Export (JSON & CSV)
The system SHALL export selected data in standard formats.

#### Scenario: User exports comparison
```gherkin
Given user has 2 personas' critiques displayed
When user clicks "Download JSON"
Then JSON file downloads containing:
  {
    artwork: "万物于万物",
    personas: [
      {
        name: "Su Shi",
        rpait: { R: 7, P: 9, A: 8, I: 8, T: 6 },
        critique: "..."
      },
      ...
    ]
  }
```

**Acceptance Criteria:**
- JSON format: valid, properly indented
- CSV format: RFC 4180 compliant
- Includes: artwork, persona, all RPAIT scores, full critique text
- Headers clear
- Filename includes date + artwork name
- Preview shown before download

---

## MODIFIED Requirements

### R6: RPAITMapper - Visualization Data
The RPAITMapper SHALL provide data in chart-compatible format.

**New Method:**
```javascript
getVisualizationData(artworkId, personaId): {
  dimensions: {
    Representation: number,
    Philosophy: number,
    Aesthetics: number,
    Interpretation: number,
    Technique: number
  },
  persona: string,
  artwork: string
}
```

---

## UI/UX Requirements

### R7: Chart Accessibility
- Alt text for each chart
- Data table fallback for charts
- Keyboard navigation (Tab through charts)
- Screen reader compatible

### R8: Responsive Design
- Desktop (1024px+): 2-4 charts per row
- Tablet (768px): 2 charts per row
- Mobile (<768px): 1 chart per row
- Charts scale to fit container

### R9: Performance
- Chart render: <100ms
- Data load: <10ms
- Switch artworks: instant (no flash)
- Responsive to interactions: <16ms (60fps)

---

## Testing Requirements

### R10: Chart Data Format Tests
```javascript
test('radar chart data transforms correctly', () => {
  const data = mapRPAITForChart('万物于万物', 'Su Shi');
  expect(data.dimensions.Representation).toBe(7);
  expect(data.dimensions.Philosophy).toBe(9);
  expect(data.persona).toBe('Su Shi');
});

test('heatmap includes all 6 personas', () => {
  const heatmap = generateHeatmap('万物于万物');
  expect(heatmap.personas.length).toBe(6);
  expect(heatmap.dimensions.length).toBe(5);
});
```

### R11: Comparison Tests
```javascript
test('dimension differences calculated correctly', () => {
  const diff = calculateDifference('Su Shi', 'Guo Xi', 'Representation');
  expect(diff).toBe(8 - 7);  // Guo Xi - Su Shi
});

test('supports up to 4 personas in comparison', () => {
  const chart = createComparison(['Su Shi', 'Guo Xi', 'Ruskin', 'Zola']);
  expect(chart.datasets.length).toBe(4);

  // Adding 5th persona should fail
  expect(() => {
    chart.addPersona('Elena Petrova');
  }).toThrow();
});
```

### R12: Export Tests
```javascript
test('JSON export includes all data', () => {
  const json = exportAsJSON('万物于万物', ['Su Shi', 'Guo Xi']);
  expect(json.artwork).toBe('万物于万物');
  expect(json.personas.length).toBe(2);
  expect(json.personas[0].rpait.R).toBeDefined();
});

test('CSV export is RFC 4180 compliant', () => {
  const csv = exportAsCSV('万物于万物', ['Su Shi']);
  const lines = csv.split('\n');
  expect(lines[0]).toContain('Artwork');
  expect(lines[1]).toContain('万物于万物');
});
```

