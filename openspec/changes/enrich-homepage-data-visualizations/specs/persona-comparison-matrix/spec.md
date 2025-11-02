# Specification: Persona Comparison Matrix

**Capability**: `persona-comparison-matrix`
**Version**: 1.0
**Status**: Proposed

---

## Overview

The Persona Comparison Matrix displays RPAIT dimension scores for all personas side-by-side using horizontal bar charts, enabling quick visual comparison of critical perspectives across dimensions.

---

## ADDED Requirements

### Requirement 1: Bar Chart Rendering
**ID**: `PCM-001`
**Priority**: MUST

The system SHALL render a horizontal bar chart comparing all 6 personas across RPAIT dimensions using Chart.js type 'bar' with indexAxis 'y'.

#### Scenario: Display All Dimensions
**Given** the user views the persona matrix
**When** "All Dimensions" mode is selected
**Then** the chart displays 5 grouped bars per persona (R, P, A, I, T)
**And** each dimension uses its assigned color (R:#E8998D, P:#A3A8C5, A:#B8D8BE, I:#F4C2C2, T:#D4A574)

**Verification Code**:
```javascript
const chart = Chart.getChart('persona-matrix-chart');
expect(chart.config.options.indexAxis).toBe('y');
expect(chart.data.datasets.length).toBe(5);  // 5 dimensions
expect(chart.data.labels.length).toBe(6);    // 6 personas
```

---

### Requirement 2: Dimension Filtering
**ID**: `PCM-002`
**Priority**: SHOULD

The system SHOULD allow filtering to show a single RPAIT dimension for detailed comparison.

#### Scenario: Filter to Philosophy Dimension
**Given** the matrix displays all dimensions
**When** the user selects "Philosophy (P)" from the dimension selector
**Then** the chart shows only P scores for all 6 personas
**And** all bars use the Philosophy color (#A3A8C5)

---

### Requirement 3: Artwork Context
**ID**: `PCM-003`
**Priority**: MUST

The system SHALL update the matrix when artwork changes to show artwork-specific scores.

#### Scenario: Artwork-Specific Comparison
**Given** the user navigates to artwork-3
**When** the matrix updates
**Then** all displayed scores come from critiques for artwork-3 only

---

## Data Dependencies

**Requires**: Same as rpait-radar-chart (VULCA_DATA.personas, VULCA_DATA.critiques)

---

**End of Specification**
