# Specification: Semantic Similarity Heatmap

**Capability**: `similarity-heatmap`
**Version**: 1.0
**Status**: Proposed

---

## Overview

The Similarity Heatmap visualizes pairwise similarity scores between personas using a 6×6 grid rendered with HTML/CSS, providing quick insight into which critical perspectives align or diverge.

---

## ADDED Requirements

### Requirement 1: Heatmap Grid Rendering
**ID**: `SSH-001`
**Priority**: MUST

The system SHALL render a 6×6 grid showing RPAIT-based similarity scores between all persona pairs.

#### Scenario: Display Similarity Matrix
**Given** the page loads
**When** the heatmap initializes
**Then** a 36-cell grid (6×6) renders with color-coded cells
**And** each cell displays the similarity score (0.00-1.00 format)
**And** cell color reflects score: green (≥0.9), yellow-green (0.7-0.9), orange (0.5-0.7), red (<0.5)

**Verification Code**:
```javascript
const cells = document.querySelectorAll('.heatmap-cell');
expect(cells.length).toBe(36);

// Check Su Shi ↔ Guo Xi cell
const cellSuGuo = cells[1];  // Assuming row-major order
const score = parseFloat(cellSuGuo.textContent);
expect(score).toBeCloseTo(0.92, 2);  // Expected high similarity
expect(cellSuGuo.style.backgroundColor).toContain('hsl(120');  // Green range
```

---

### Requirement 2: Similarity Calculation
**ID**: `SSH-002`
**Priority**: MUST

The system SHALL calculate similarity using cosine similarity on RPAIT vectors (5-dimensional).

#### Scenario: Compute Cosine Similarity
**Given** two personas with RPAIT vectors
**When** similarity is calculated
**Then** the result equals: dot(v1, v2) / (||v1|| * ||v2||)
**And** the result is in range [0, 1]

**Verification Code**:
```javascript
const suShi = { R: 7, P: 9, A: 8, I: 8, T: 7 };
const guoXi = { R: 8, P: 7, A: 8, I: 7, T: 8 };
const similarity = rpaitCosineSimilarity(suShi, guoXi);
expect(similarity).toBeGreaterThanOrEqual(0);
expect(similarity).toBeLessThanOrEqual(1);
```

---

### Requirement 3: Interactive Tooltips
**ID**: `SSH-003`
**Priority**: SHOULD

The system SHOULD display detailed tooltips on cell hover showing persona names and interpretation.

#### Scenario: Hover Shows Details
**Given** the user hovers over a heatmap cell
**When** the mouse enters the cell
**Then** a tooltip appears showing "Su Shi ↔ Guo Xi: 0.92 (High similarity)"
**And** the cell scales up 10% for emphasis

---

## Implementation Note

```javascript
function rpaitCosineSimilarity(persona1, persona2) {
  const v1 = [persona1.R, persona1.P, persona1.A, persona1.I, persona1.T];
  const v2 = [persona2.R, persona2.P, persona2.A, persona2.I, persona2.T];

  const dot = v1.reduce((sum, val, i) => sum + val * v2[i], 0);
  const mag1 = Math.sqrt(v1.reduce((sum, val) => sum + val * val, 0));
  const mag2 = Math.sqrt(v2.reduce((sum, val) => sum + val * val, 0));

  return dot / (mag1 * mag2);
}
```

---

**End of Specification**
