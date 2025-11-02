# Specification: Artwork-Persona Network Graph

**Capability**: `network-graph`
**Version**: 1.0
**Status**: Proposed

---

## Overview

The Network Graph provides an interactive force-directed visualization of relationships between artworks and personas, with edge weights representing RPAIT alignment strength.

---

## ADDED Requirements

### Requirement 1: Graph Structure
**ID**: `APN-001`
**Priority**: MUST

The system SHALL render a force-directed graph with 10 nodes (4 artworks + 6 personas) and 24 edges (all artwork-persona pairs).

#### Scenario: Initial Graph Layout
**Given** the page loads
**When** the network graph initializes
**Then** 4 large circles (artworks, radius 40px) appear
**And** 6 medium circles (personas, radius 25px) appear
**And** 24 connecting lines (edges) appear between artwork-persona pairs
**And** the force simulation positions nodes without overlap

**Verification Code**:
```javascript
const svg = d3.select('#network-graph');
const nodes = svg.selectAll('circle');
expect(nodes.size()).toBe(10);

const artworkNodes = svg.selectAll('[data-type="artwork"]');
expect(artworkNodes.size()).toBe(4);

const edges = svg.selectAll('line');
expect(edges.size()).toBe(24);
```

---

### Requirement 2: Edge Weighting
**ID**: `APN-002`
**Priority**: MUST

The system SHALL weight edges by RPAIT alignment score, with higher alignment resulting in shorter edge distance and thicker lines.

#### Scenario: High Alignment = Close Nodes
**Given** Su Shi has high alignment (0.95) with artwork-1
**When** the force simulation runs
**Then** the Su Shi node positions close to artwork-1
**And** the connecting edge is thicker (3px) than low-alignment edges (1px)

---

### Requirement 3: Interactive Dragging
**ID**: `APN-003`
**Priority**: SHOULD

The system SHOULD allow users to drag nodes to explore the graph layout.

#### Scenario: Drag to Reposition
**Given** the graph is displayed
**When** the user drags the Su Shi node
**Then** the node follows the mouse cursor
**And** connected edges update in real-time
**And** the force simulation re-stabilizes after release

---

### Requirement 4: Click to Filter
**ID**: `APN-004`
**Priority**: SHOULD

The system SHOULD filter the graph to show only selected artwork's connections when an artwork node is clicked.

#### Scenario: Click Artwork-1
**Given** all 24 edges are visible
**When** the user clicks the artwork-1 node
**Then** only 6 edges (artwork-1 ↔ 6 personas) remain visible
**And** other artworks' edges fade to opacity 0.1
**And** clicking artwork-1 again resets to full graph

---

## D3.js Force Parameters

```javascript
const simulation = d3.forceSimulation(nodes)
  .force('link', d3.forceLink(links)
    .id(d => d.id)
    .distance(d => 100 / d.weight))  // Higher weight = closer
  .force('charge', d3.forceManyBody().strength(-300))
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('collision', d3.forceCollide().radius(d => d.radius + 5));
```

---

**End of Specification**
