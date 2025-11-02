# Design: Multi-Image Artwork Series System

## Overview

This document captures architectural decisions for implementing a scalable multi-image artwork display system that supports 5-10 images per artwork while maintaining the existing critique structure.

---

## Decision 1: Data Structure Architecture

### Options Considered

**A. Flat Structure (Simple)**
```javascript
artwork: {
  id: "artwork-1",
  images: [
    { url: "/assets/artwork-1-img1.jpg", caption: "..." },
    { url: "/assets/artwork-1-img2.jpg", caption: "..." }
  ]
}
```
- ✅ Simple to implement
- ✅ Easy to understand
- ❌ Cannot reference images in critiques
- ❌ Limited metadata support
- ❌ Hard to maintain image-specific data

**B. Relational Structure (Complex) - CHOSEN**
```javascript
artwork: {
  id: "artwork-1",
  primaryImageId: "img-1-1",  // Default/hero image
  images: [
    {
      id: "img-1-1",
      url: "/assets/artworks/artwork-1/01-sketch.jpg",
      category: "sketch",
      sequence: 1,
      titleZh: "初步草图",
      titleEn: "Initial Sketch",
      caption: "Early exploration...",
      metadata: { year: 2022, dimensions: "1200x800" }
    },
    // ... more images
  ]
}

critique: {
  artworkId: "artwork-1",
  personaId: "su-shi",
  overallText: "整体评论...",
  imageReferences: ["img-1-3", "img-1-7"],  // Referenced images
  imageAnnotations: [  // Optional: image-specific comments
    { imageId: "img-1-3", note: "此图尤为精妙..." }
  ]
}
```
- ✅ Images have unique IDs for referencing
- ✅ Supports rich metadata per image
- ✅ Critics can reference specific images
- ✅ Flexible for future extensions
- ❌ More complex data structure
- ❌ Requires ID management

**Decision**: **B - Relational Structure**

**Rationale**:
- User requirement: "混合模式" critiques need image referencing
- Scalability: Future features (annotations, image-specific analysis) require unique IDs
- Maintainability: Clear separation between image data and references
- Cost: Complexity is manageable with proper validation and documentation

---

## Decision 2: Carousel Component Architecture

### Options Considered

**A. Third-Party Library (e.g., Swiper.js, Slick)**
- ✅ Feature-rich out of the box
- ✅ Well-tested and maintained
- ❌ External dependency (70-100KB)
- ❌ May not fit custom design
- ❌ Limited control over behavior

**B. Custom Vanilla JS Carousel - CHOSEN**
- ✅ Full control over behavior and styling
- ✅ Minimal bundle size (<5KB)
- ✅ Integrates seamlessly with existing code
- ✅ No external dependencies
- ❌ Must implement features from scratch
- ❌ Requires testing across devices

**C. CSS-Only Carousel (Scroll Snap)**
- ✅ Native browser behavior
- ✅ Zero JavaScript
- ❌ Limited control over animations
- ❌ Poor keyboard navigation support
- ❌ Difficult to sync with critique system

**Decision**: **B - Custom Vanilla JS Carousel**

**Rationale**:
- Project already uses vanilla JS (no framework dependencies)
- Need tight integration with critique system (image references)
- Custom design requirements (RPAIT-themed UI)
- Performance: 5-10 images per artwork × 4 artworks = manageable without library overhead

**Implementation Pattern**:
```javascript
class ArtworkImageCarousel {
  constructor(artwork, container) {
    this.artwork = artwork;
    this.images = artwork.images;
    this.currentIndex = 0;
    this.container = container;
    this.init();
  }

  render() {
    // Render current image + metadata
    // Update navigation indicators
    // Apply transitions
  }

  next() { /* ... */ }
  prev() { /* ... */ }
  goTo(index) { /* ... */ }

  // Event handlers
  onKeyboard(e) { /* Arrow keys */ }
  onTouch(e) { /* Swipe gestures */ }
}
```

---

## Decision 3: Image Category System

### Options Considered

**A. Free-Text Categories**
```javascript
image: { category: "early sketch of robotic arm" }
```
- ✅ Maximum flexibility
- ❌ Inconsistent labeling
- ❌ Cannot style by category
- ❌ Hard to filter/search

**B. Fixed Enum Categories - CHOSEN**
```javascript
const IMAGE_CATEGORIES = {
  SKETCH: "sketch",
  PROCESS: "process",
  INSTALLATION: "installation",
  DETAIL: "detail",
  FINAL: "final",
  CONTEXT: "context"
};

image: {
  category: "sketch",  // Must be one of IMAGE_CATEGORIES
  customNote: "..." // Free text for specifics
}
```
- ✅ Consistent labeling
- ✅ Can style differently per category
- ✅ Easy to validate
- ✅ Supports filtering/grouping
- ❌ Requires upfront category design

**C. Tag-Based System**
```javascript
image: { tags: ["sketch", "early", "conceptual"] }
```
- ✅ Multiple categories per image
- ✅ Flexible
- ❌ Overly complex for current needs
- ❌ UI complexity (how to display multiple tags)

**Decision**: **B - Fixed Enum Categories with Custom Notes**

**Rationale**:
- 6 categories cover most artwork documentation needs
- Visual distinction helps viewers understand image role
- Validation prevents typos
- Can extend to tags later if needed
- Custom note field provides flexibility for specifics

**Visual Treatment**:
- Sketch: Blue badge, dashed border
- Process: Green badge, dotted border
- Installation: Purple badge, photo frame
- Detail: Orange badge, magnifying glass icon
- Final: Red badge, checkmark icon
- Context: Gray badge, info icon

---

## Decision 4: Critique-Image Linking Strategy

### Options Considered

**A. Plain Text References**
```javascript
critique: {
  text: "如图3所示，机械臂的动作..."
}
```
- ✅ Simple to write
- ❌ No programmatic linking
- ❌ Breaks if image order changes
- ❌ Cannot highlight referenced images

**B. Structured References with Syntax - CHOSEN**
```javascript
critique: {
  textZh: "如[img:img-1-3]所示，机械臂的动作...",
  textEn: "As shown in [img:img-1-3], the robotic arm...",
  imageReferences: ["img-1-3", "img-1-7"]  // Extracted IDs
}

// Rendering converts [img:img-1-3] → clickable link
```
- ✅ Programmatic linking
- ✅ Order-independent (uses IDs)
- ✅ Can highlight referenced images
- ✅ Can validate references exist
- ❌ Requires parsing and rendering logic

**C. Separate Annotation Objects**
```javascript
critique: {
  text: "整体评论...",
  annotations: [
    { imageId: "img-1-3", text: "此图特别展示了..." }
  ]
}
```
- ✅ Clean separation
- ✅ Structured data
- ❌ Harder to read critiques
- ❌ Duplicates information (annotation vs. main text)

**Decision**: **B - Structured References with [img:id] Syntax**

**Rationale**:
- Balances readability and functionality
- Critics can naturally reference images in flowing text
- System can extract references for highlighting
- Graceful degradation: if parsing fails, [img:id] is still readable
- Validation: Can check if referenced IDs exist in artwork.images

**Rendering Logic**:
```javascript
function renderCritiqueWithImageRefs(critique, artwork) {
  const text = critique.textZh;
  const pattern = /\[img:(img-\d+-\d+)\]/g;

  return text.replace(pattern, (match, imageId) => {
    const image = artwork.images.find(img => img.id === imageId);
    if (!image) {
      console.warn(`Referenced image ${imageId} not found`);
      return match;  // Show original syntax
    }

    return `<a href="#"
               class="image-ref"
               data-image-id="${imageId}"
               onclick="carousel.goTo('${imageId}')">
              📷 ${image.titleZh}
            </a>`;
  });
}
```

---

## Decision 5: Image Loading Strategy

### Options Considered

**A. Eager Load All Images**
```javascript
images.forEach(img => {
  const imgEl = new Image();
  imgEl.src = img.url;
  // All images load immediately
});
```
- ✅ No loading delays when navigating
- ❌ Slow initial page load (4 artworks × 8 images = 32 images)
- ❌ Wastes bandwidth if user doesn't view all images
- ❌ Poor mobile performance

**B. Lazy Load on Demand - CHOSEN**
```javascript
// Load current + next/prev images only
function loadVisibleImages(currentIndex) {
  const toLoad = [
    images[currentIndex],
    images[currentIndex - 1],
    images[currentIndex + 1]
  ].filter(Boolean);

  toLoad.forEach(loadImage);
}
```
- ✅ Fast initial load
- ✅ Bandwidth efficient
- ✅ Smooth navigation (preload adjacent images)
- ❌ Small delay on navigation (mitigated by preloading)

**C. Progressive Loading (Blur-Up)**
```javascript
// Load low-res placeholder → high-res image
image: {
  urlLowRes: "/assets/thumbs/img-1-1.jpg",  // 50KB
  urlHighRes: "/assets/artworks/artwork-1/01.jpg"  // 200KB
}
```
- ✅ Instant visual feedback
- ✅ Smooth transition
- ❌ Requires generating thumbnails
- ❌ More complex implementation
- ❌ Overkill for 200KB images

**Decision**: **B - Lazy Load on Demand with Adjacent Preloading**

**Rationale**:
- Images are already optimized (<200KB)
- Loading current + adjacent (3 images max) balances UX and performance
- No extra thumbnail generation needed
- Simpler implementation
- Can add progressive loading later if needed

**Implementation**:
```javascript
class ImageLoader {
  constructor() {
    this.loaded = new Set();
  }

  load(imageUrl) {
    if (this.loaded.has(imageUrl)) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.loaded.add(imageUrl);
        resolve(img);
      };
      img.onerror = reject;
      img.src = imageUrl;
    });
  }

  preloadAdjacent(images, currentIndex) {
    const adjacent = [
      images[currentIndex - 1],
      images[currentIndex],
      images[currentIndex + 1]
    ].filter(Boolean);

    adjacent.forEach(img => this.load(img.url));
  }
}
```

---

## Decision 6: File Organization

### Options Considered

**A. Flat Assets Directory**
```
assets/
├── artwork-1-img1.jpg
├── artwork-1-img2.jpg
├── artwork-2-img1.jpg
└── ...
```
- ✅ Simple
- ❌ Hard to manage (100+ files)
- ❌ No logical grouping
- ❌ Naming collisions risk

**B. Nested by Artwork - CHOSEN**
```
assets/
└── artworks/
    ├── artwork-1/
    │   ├── 01-sketch-robotic-arm.jpg
    │   ├── 02-process-training.jpg
    │   ├── 03-final-installation.jpg
    │   └── metadata.json  // Optional: image metadata
    ├── artwork-2/
    └── ...
```
- ✅ Logical grouping
- ✅ Easy to add/remove artwork sets
- ✅ Clear naming convention
- ✅ Supports metadata files
- ❌ Deeper path structure

**C. Category-Based Organization**
```
assets/
└── artworks/
    ├── sketches/
    ├── process/
    ├── installations/
    └── finals/
```
- ✅ Groups by type
- ❌ Same artwork scattered across folders
- ❌ Hard to maintain consistency

**Decision**: **B - Nested by Artwork**

**Rationale**:
- Each artwork is a self-contained unit
- Easy to add complete artwork sets
- Supports future features (artist notes, videos, etc.)
- Consistent with asset acquisition workflow (get all materials for one artwork at a time)

**Naming Convention**:
```
{sequence}-{category}-{description}.jpg

Examples:
01-sketch-initial-concept.jpg
02-sketch-robotic-arm-detail.jpg
03-process-training-phase.jpg
04-process-installation-setup.jpg
05-final-exhibition-view.jpg
06-detail-brush-mechanism.jpg
```

---

## Decision 7: Migration Strategy

### Options Considered

**A. Big Bang Migration**
- Replace all data.js at once
- Add 6-8 images per artwork immediately
- Deploy when complete

**B. Gradual Migration - CHOSEN**
- Phase 1: Deploy data structure + carousel with backward compatibility
- Phase 2: Add images to artwork-1 only (test)
- Phase 3: Complete remaining 3 artworks
- Phase 4: Remove backward compatibility code

**C. Parallel Systems**
- Keep old single-image system
- Build new multi-image system separately
- Switch via feature flag

**Decision**: **B - Gradual Migration with Backward Compatibility**

**Rationale**:
- Minimizes deployment risk
- Can validate each artwork individually
- Existing critiques continue to work
- Rollback is simple if issues arise

**Backward Compatibility**:
```javascript
// Old format still works
artwork: {
  imageUrl: "/assets/artwork-1.jpg"  // Single image
}

// New format
artwork: {
  images: [...]  // Multiple images
}

// Rendering handles both
function getArtworkImages(artwork) {
  if (artwork.images && artwork.images.length > 0) {
    return artwork.images;  // New format
  }

  // Backward compatibility: convert old format
  if (artwork.imageUrl) {
    return [{
      id: `${artwork.id}-legacy`,
      url: artwork.imageUrl,
      category: "final",
      titleZh: artwork.titleZh,
      titleEn: artwork.titleEn
    }];
  }

  return [];  // No images
}
```

---

## Cross-Cutting Concerns

### Performance
- **Target**: <1s initial load, <200ms carousel transition
- **Strategy**: Lazy loading + adjacent preloading
- **Monitoring**: Track image load times, carousel interaction metrics

### Accessibility
- **Keyboard**: Arrow keys navigate carousel, Enter opens fullscreen
- **Screen Readers**: Announce "Image X of Y: {title}"
- **ARIA**: Proper roles and labels for carousel controls

### SEO
- All images have descriptive alt text
- Image metadata includes artist, year, dimensions
- Structured data for image galleries

### Future Extensibility
- Data structure supports future fields (videos, 3D models, AR experiences)
- Carousel component is modular (can swap rendering engine)
- Critique system can add more complex annotations later

---

## Technical Debt & Trade-offs

### Accepted Debt
1. **No thumbnail generation**: Using full-size images for all views
   - *Trade-off*: Simpler implementation vs. potential performance improvement
   - *Mitigation*: Images already optimized (<200KB)
   - *Future*: Can add responsive images (srcset) later

2. **Client-side image loading**: No server-side optimization
   - *Trade-off*: Deployment simplicity (static site) vs. advanced optimization
   - *Mitigation*: Lazy loading reduces impact
   - *Future*: Can integrate CDN with image processing if needed

3. **Linear critique-image references**: [img:id] syntax is simple but not structured
   - *Trade-off*: Easy to write/read vs. more powerful annotation system
   - *Mitigation*: Syntax is extensible (can parse richer formats later)
   - *Future*: Can migrate to structured annotations without breaking existing critiques

### Avoided Complexity
- ❌ Not implementing: Image editing/cropping in browser
- ❌ Not implementing: User-uploaded images (static exhibition only)
- ❌ Not implementing: Video support (deferred to future change)
- ❌ Not implementing: Full-text search across image captions (future feature)

---

## Success Metrics

### Technical
- ✅ All images load successfully (0% error rate)
- ✅ Carousel interactions <200ms response time
- ✅ Mobile swipe gestures 95%+ success rate
- ✅ Backward compatibility: Existing 4 artworks work unchanged until migration

### User Experience
- ✅ Visitors view average 4+ images per artwork (vs. 1 currently)
- ✅ Image references in critiques are clicked (engagement metric)
- ✅ No broken image reports after deployment

### Developer Experience
- ✅ Adding new artwork takes <30 minutes (documented workflow)
- ✅ Image validation catches 100% of missing/incorrect references
- ✅ Zero regressions in existing features (critique display, RPAIT viz, navigation)
