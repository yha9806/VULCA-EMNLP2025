# Spec: Hybrid Critique System

## Overview

Extends critique system to support overall artwork critiques plus optional image-specific references using [img:id] syntax.

---

## ADDED Requirements

### Requirement: Image Reference Syntax

**Identifier**: `critique-001`

Critics SHALL reference specific images in critique text using `[img:image-id]` syntax, which renders as clickable links.

**Priority**: P0

#### Scenario: Image Reference in Critique

**Given** critique text: "如[img:img-1-3]所示，机械臂的动作充满诗意..."
**When** critique is rendered
**Then** `[img:img-1-3]` is converted to clickable link
**And** clicking link navigates carousel to image img-1-3
**And** referenced image is visually highlighted

---

### Requirement: Reference Validation

**Identifier**: `critique-002`

System SHALL validate that all referenced image IDs exist in the artwork's images array.

**Priority**: P1

#### Scenario: Invalid Reference Detection

**Given** critique references `[img:img-1-99]`
**And** artwork only has images img-1-1 through img-1-6
**When** validation runs
**Then** console warning: "Invalid image reference: img-1-99 not found in artwork-1"
**And** text displays original syntax `[img:img-1-99]` without link

---

## MODIFIED Requirements

### Requirement: Critique Data Structure Extension

**Identifier**: `critique-data-structure`

The critique data structure SHALL be extended to include `imageReferences` array for tracking which images are mentioned.

**BEFORE**:
```javascript
critique: {
  artworkId, personaId, textZh, textEn, rpait
}
```

**AFTER**:
```javascript
critique: {
  artworkId, personaId, textZh, textEn, rpait,
  imageReferences: ["img-1-3", "img-1-5"]  // Extracted from text
}
```

#### Scenario: Image References Extracted on Load

**Given** critique with text containing "[img:img-1-3]" and "[img:img-1-5]"
**When** data loads
**Then** `imageReferences` array SHALL contain ["img-1-3", "img-1-5"]
**And** array is empty if no references found

---

## REMOVED Requirements

None
