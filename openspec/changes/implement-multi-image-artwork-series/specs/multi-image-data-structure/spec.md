# Spec: Multi-Image Data Structure

## Overview

This spec defines the data structure for supporting 5-10 images per artwork with rich metadata, enabling relational linking between images and critiques.

---

## ADDED Requirements

### Requirement: Artwork Image Series Data Model

**Identifier**: `multi-image-data-001`

Each artwork SHALL support an `images` array containing 1-10 image objects with unique IDs, URLs, categories, and metadata.

**Rationale**: Enables complete visual storytelling of artistic process while maintaining backward compatibility with single-image artworks.

**Dependencies**: None

**Priority**: P0 (Critical - foundation for all other features)

#### Scenario: Artwork with Multiple Images

**Given** an artwork object in `data.js`
**When** the artwork includes `images` array with 5 image objects
**Then** each image SHALL have:
- `id`: Unique identifier (e.g., "img-1-1", "img-1-2")
- `url`: Absolute path to image file
- `category`: One of ["sketch", "process", "installation", "detail", "final", "context"]
- `sequence`: Integer determining display order
- `titleZh`: Chinese title/caption
- `titleEn`: English title/caption
- `caption`: Optional detailed description
- `metadata`: Optional object with `year`, `dimensions`, `medium`, etc.

**Validation**:
```javascript
const artwork = VULCA_DATA.artworks[0];
assert(Array.isArray(artwork.images), 'images must be array');
assert(artwork.images.length >= 1 && artwork.images.length <= 10, '1-10 images');

artwork.images.forEach(img => {
  assert(img.id && img.id.match(/^img-\d+-\d+$/), 'ID format: img-{artwork}-{seq}');
  assert(img.url && img.url.startsWith('/assets/'), 'URL must be absolute');
  assert(['sketch','process','installation','detail','final','context'].includes(img.category));
  assert(Number.isInteger(img.sequence) && img.sequence >= 1);
  assert(img.titleZh && img.titleEn, 'Bilingual titles required');
});
```

---

### Requirement: Primary Image Designation

**Identifier**: `multi-image-data-002`

Each artwork SHALL designate one image as the primary/hero image via `primaryImageId` field.

**Rationale**: Provides default image for thumbnails, social sharing, and initial display.

**Dependencies**: `multi-image-data-001`

**Priority**: P0

#### Scenario: Primary Image Defaults to First Image

**Given** artwork with `images` array but no `primaryImageId`
**When** system retrieves primary image
**Then** it SHALL return the first image in sequence order (lowest `sequence` value)

#### Scenario: Explicit Primary Image

**Given** artwork with `primaryImageId: "img-1-3"`
**When** system retrieves primary image
**Then** it SHALL return the image with `id === "img-1-3"`
**And** if that ID doesn't exist, fall back to first image

---

### Requirement: Backward Compatibility with Single Image

**Identifier**: `multi-image-data-003`

The system SHALL support artworks with legacy `imageUrl` field by automatically converting to `images` array format.

**Rationale**: Enables gradual migration without breaking existing artworks.

**Dependencies**: None

**Priority**: P0

#### Scenario: Legacy imageUrl Converted to Images Array

**Given** artwork with `imageUrl: "/assets/artwork-1.jpg"` (no `images` field)
**When** renderer retrieves artwork images
**Then** it SHALL return array with single image object:
```javascript
[{
  id: `${artwork.id}-legacy`,
  url: artwork.imageUrl,
  category: "final",
  sequence: 1,
  titleZh: artwork.titleZh,
  titleEn: artwork.titleEn,
  caption: artwork.context
}]
```

---

### Requirement: Image Category Enum Validation

**Identifier**: `multi-image-data-004`

All image `category` fields SHALL use standardized enum values with defined visual treatments.

**Rationale**: Ensures consistent labeling and enables category-specific styling.

**Dependencies**: `multi-image-data-001`

**Priority**: P1

#### Scenario: Valid Category Values

**Given** image category definitions:
- `sketch`: Conceptual drawings, preliminary studies
- `process`: Work-in-progress, creation documentation
- `installation`: Exhibition setup, environmental context
- `detail`: Close-up views, technical details
- `final`: Completed artwork, final presentation
- `context`: Supplementary materials, artist statements

**When** developer adds image with `category: "sketch"`
**Then** system accepts and applies sketch-specific styling (blue badge, dashed border)

**When** developer adds image with `category: "invalid"`
**Then** validation error thrown: "Invalid category: must be one of [sketch, process, installation, detail, final, context]"

---

### Requirement: File Organization Convention

**Identifier**: `multi-image-data-005`

Image files SHALL be organized in nested directories following `/assets/artworks/{artwork-id}/{sequence}-{category}-{slug}.jpg` naming pattern.

**Rationale**: Logical grouping, easy maintenance, prevents naming collisions.

**Dependencies**: None

**Priority**: P1

#### Scenario: Image Path Convention

**Given** artwork with `id: "artwork-1"`
**When** adding 3 images (sketch, process, final)
**Then** files SHALL be organized as:
```
/assets/artworks/artwork-1/
├── 01-sketch-initial-concept.jpg
├── 02-process-robotic-training.jpg
└── 03-final-exhibition-view.jpg
```

**And** corresponding `data.js` entries:
```javascript
images: [
  {
    id: "img-1-1",
    url: "/assets/artworks/artwork-1/01-sketch-initial-concept.jpg",
    category: "sketch",
    sequence: 1,
    // ...
  },
  // ...
]
```

---

## MODIFIED Requirements

### Requirement: Artwork Data Structure Extension

**Identifier**: `artwork-data-structure` (from existing spec)

The artwork data structure SHALL be extended to support both legacy single-image format and new multi-image format.

**BEFORE**:
```javascript
artwork: {
  id, titleZh, titleEn, year, imageUrl, artist, context
}
```

**AFTER**:
```javascript
artwork: {
  id, titleZh, titleEn, year, artist, context,
  imageUrl,  // Deprecated but supported for backward compatibility
  images: [...],  // New: array of image objects
  primaryImageId: "img-1-1"  // New: default image
}
```

#### Scenario: Extended Structure Supports Both Formats

**Given** artwork with new `images` array field
**When** system retrieves artwork data
**Then** it SHALL prioritize `images` array over `imageUrl`
**And** if `images` is empty or missing, fall back to `imageUrl`
**And** both formats render without errors

---

## REMOVED Requirements

None (additive change only)

---

## Cross-References

- **Related Specs**:
  - `image-carousel-component` - Consumes image series data
  - `hybrid-critique-system` - References images by ID

- **Related Changes**:
  - `fix-artwork-image-display-system` (archived) - Established single-image foundation

---

## Implementation Notes

### Example: Complete Artwork with Image Series

```javascript
{
  id: "artwork-1",
  titleZh: "记忆（绘画操作单元：第二代）",
  titleEn: "Memory (Painting Operation Unit: Second Generation)",
  year: 2022,
  artist: "Sougwen Chung",
  context: "Contemporary digital-robotic hybrid artwork...",
  primaryImageId: "img-1-5",  // The "final" image is primary

  images: [
    {
      id: "img-1-1",
      url: "/assets/artworks/artwork-1/01-sketch-concept.jpg",
      category: "sketch",
      sequence: 1,
      titleZh: "初步概念草图",
      titleEn: "Initial Concept Sketch",
      caption: "Early exploration of human-machine collaboration through drawing...",
      metadata: { year: 2021, dimensions: "1200x800", medium: "Digital" }
    },
    {
      id: "img-1-2",
      url: "/assets/artworks/artwork-1/02-process-training.jpg",
      category: "process",
      sequence: 2,
      titleZh: "机器学习训练过程",
      titleEn: "Machine Learning Training Process",
      caption: "Training the robotic arm to learn the artist's drawing gestures...",
      metadata: { year: 2022, dimensions: "1200x800" }
    },
    {
      id: "img-1-3",
      url: "/assets/artworks/artwork-1/03-process-collaboration.jpg",
      category: "process",
      sequence: 3,
      titleZh: "人机协作绘画",
      titleEn: "Human-Machine Collaborative Drawing",
      caption: "Artist and robotic arm creating together in real-time...",
      metadata: { year: 2022, dimensions: "1200x800" }
    },
    {
      id: "img-1-4",
      url: "/assets/artworks/artwork-1/04-detail-mechanism.jpg",
      category: "detail",
      sequence: 4,
      titleZh: "机械臂细节",
      titleEn: "Robotic Arm Detail",
      caption: "Close-up of the custom-built robotic drawing mechanism...",
      metadata: { year: 2022, dimensions: "1200x800" }
    },
    {
      id: "img-1-5",
      url: "/assets/artworks/artwork-1/05-final-drawing.jpg",
      category: "final",
      sequence: 5,
      titleZh: "最终作品",
      titleEn: "Final Drawing",
      caption: "The completed collaborative drawing, result of human-machine dialogue...",
      metadata: { year: 2022, dimensions: "1200x800", medium: "Mixed media on paper" }
    },
    {
      id: "img-1-6",
      url: "/assets/artworks/artwork-1/06-installation-vam.jpg",
      category: "installation",
      sequence: 6,
      titleZh: "V&A博物馆展览现场",
      titleEn: "Installation at V&A Museum",
      caption: "Exhibition view at Victoria and Albert Museum, London...",
      metadata: { year: 2022, dimensions: "1200x800", location: "V&A Museum, London" }
    }
  ]
}
```

### Validation Utility

```javascript
function validateArtworkImages(artwork) {
  const errors = [];

  // Check images array
  if (!artwork.images || !Array.isArray(artwork.images)) {
    errors.push(`Artwork ${artwork.id}: images must be array`);
    return errors;
  }

  if (artwork.images.length < 1 || artwork.images.length > 10) {
    errors.push(`Artwork ${artwork.id}: must have 1-10 images, got ${artwork.images.length}`);
  }

  // Validate each image
  const usedIds = new Set();
  const usedSequences = new Set();

  artwork.images.forEach((img, index) => {
    // ID validation
    if (!img.id || !img.id.match(/^img-\d+-\d+$/)) {
      errors.push(`Image ${index}: invalid ID format, expected img-{artwork}-{seq}`);
    }
    if (usedIds.has(img.id)) {
      errors.push(`Image ${index}: duplicate ID ${img.id}`);
    }
    usedIds.add(img.id);

    // URL validation
    if (!img.url || !img.url.startsWith('/assets/')) {
      errors.push(`Image ${img.id}: URL must be absolute path starting with /assets/`);
    }

    // Category validation
    const validCategories = ['sketch', 'process', 'installation', 'detail', 'final', 'context'];
    if (!valid Categories.includes(img.category)) {
      errors.push(`Image ${img.id}: invalid category "${img.category}"`);
    }

    // Sequence validation
    if (!Number.isInteger(img.sequence) || img.sequence < 1) {
      errors.push(`Image ${img.id}: sequence must be positive integer`);
    }
    if (usedSequences.has(img.sequence)) {
      errors.push(`Image ${img.id}: duplicate sequence ${img.sequence}`);
    }
    usedSequences.add(img.sequence);

    // Title validation
    if (!img.titleZh || !img.titleEn) {
      errors.push(`Image ${img.id}: missing bilingual titles`);
    }
  });

  // Primary image validation
  if (artwork.primaryImageId) {
    const primaryExists = artwork.images.some(img => img.id === artwork.primaryImageId);
    if (!primaryExists) {
      errors.push(`Primary image ID ${artwork.primaryImageId} not found in images array`);
    }
  }

  return errors;
}

// Usage
VULCA_DATA.artworks.forEach(artwork => {
  const errors = validateArtworkImages(artwork);
  if (errors.length > 0) {
    console.error(`Validation errors for ${artwork.id}:`, errors);
  }
});
```

---

## Testing Checklist

- [ ] Artwork with 1 image validates correctly
- [ ] Artwork with 10 images validates correctly
- [ ] Artwork with 11 images fails validation
- [ ] All 6 category types accepted
- [ ] Invalid category rejects
- [ ] Duplicate image IDs detected
- [ ] Duplicate sequences detected
- [ ] Missing titles detected
- [ ] Primary image ID validated
- [ ] Legacy imageUrl converted correctly
- [ ] Mixed legacy + new format coexist
