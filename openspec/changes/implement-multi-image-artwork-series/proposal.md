# Proposal: Implement Multi-Image Artwork Series System

## Why

Currently, each artwork in the VULCA exhibition displays only a single image (`imageUrl`), which severely limits the exhibition's ability to:

1. **Tell Complete Stories**: Artists' creative processes involve sketches, iterations, installations, and final pieces that cannot be captured in one image
2. **Provide Rich Context**: Viewers cannot see different angles, details, or environmental contexts of the artworks
3. **Support Diverse Critique**: Critics need multiple visual references to provide nuanced commentary on different aspects of a work
4. **Scale with Content**: Adding new artworks requires creating complete image series, but the current structure doesn't support this workflow

**Root Causes**:
- Data structure uses single `imageUrl` string per artwork
- `renderArtworkImage()` function only handles one image
- Critique system assumes one image per artwork
- No image gallery/carousel infrastructure exists

**Impact**:
- Limited exhibition depth and engagement
- Difficult to add new artworks with proper context
- Critics cannot reference specific images in their commentary
- Poor scalability for future content expansion

## What Changes

### Core Capabilities

**1. Multi-Image Data Structure** (关联结构)
- Extend `data.js` to support image series with metadata
- Each artwork contains array of image objects with:
  - Unique image ID for referencing
  - Image URL and alt text
  - Category/type (sketch, process, installation, detail, final)
  - Caption and creation context
  - Sequence order

**2. Image Carousel Component**
- Replace single image display with interactive carousel
- Support 5-10 images per artwork
- Navigation controls (prev/next, indicators)
- Smooth transitions and lazy loading
- Keyboard and touch support

**3. Hybrid Critique System** (混合模式)
- **Overall artwork critique**: Existing system (6 critics × 1 artwork)
- **Image-specific annotations**: Optional critic comments on individual images
- **Series-level analysis**: Critics can reference specific images in overall critique
- Flexible data model supporting both modes

**4. Scalable Image Management**
- Structured image organization in `/assets/artworks/{artwork-id}/`
- Image metadata validation
- Support for future additions without code changes
- Documentation for data entry workflow

### Success Criteria

**Must Have (P0)**:
- ✅ Each artwork supports 5-10 images in data structure
- ✅ Carousel displays all images with smooth navigation
- ✅ Existing critique system continues to work
- ✅ Image metadata (caption, category) displays properly
- ✅ New artworks can be added following documented pattern

**Should Have (P1)**:
- ✅ Critics can reference specific images in critiques (e.g., "image 3 shows...")
- ✅ Image categories visually distinguished (sketch vs. final)
- ✅ Responsive carousel on mobile/tablet/desktop
- ✅ Keyboard navigation (arrow keys)

**Nice to Have (P2)**:
- ✅ Critics provide image-specific annotations
- ✅ Lightbox/fullscreen mode for detailed viewing
- ✅ Thumbnail strip for quick navigation
- ✅ Lazy loading for performance

## Dependencies & Sequencing

**Phase 1: Data Structure & Carousel** (Week 1)
- Update `data.js` with image series
- Build basic carousel component
- Update `renderArtworkImage()` to use carousel
- No dependencies

**Phase 2: Hybrid Critique Integration** (Week 1)
- Depends on: Phase 1 carousel
- Extend critique data model
- Update critique rendering
- Add image reference syntax

**Phase 3: Content Migration** (Week 2)
- Depends on: Phase 1 + 2 complete
- Source additional images for existing 4 artworks
- Create image metadata
- Test with real content

**Phase 4: Documentation & Tooling** (Week 2)
- Depends on: Phase 3 validation
- Write data entry guide
- Create image processing scripts
- Validation utilities

## Questions for Review

1. **Image Quality Standards**: Should all images follow 1200×800px (3:2) format, or allow varied aspect ratios per series?
2. **Category Taxonomy**: What image categories are needed? (sketch, process, installation, detail, final, context, other)
3. **Critique Syntax**: How should critics reference specific images? Plain text ("in image 3") or structured syntax?
4. **Migration Strategy**: Should we retroactively add images to existing 4 artworks before deploying, or launch with placeholder support?
5. **Performance Budget**: With 4 artworks × 8 images = 32 images, do we need aggressive lazy loading or is eager loading acceptable?
6. **Mobile UX**: Should mobile use swipe gestures only, or also show navigation buttons?
