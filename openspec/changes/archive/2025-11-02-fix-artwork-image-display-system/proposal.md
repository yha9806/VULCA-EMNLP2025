# Proposal: Fix Artwork Image Display System

## Why

The VULCA exhibition platform currently has broken artwork image display because image files are missing from the `/assets/` directory. While the data structure (`js/data.js`) correctly references `/assets/artwork-1.jpg` through `/assets/artwork-4.jpg`, these files don't exist, causing:

1. **Broken User Experience**: Visitors see broken image placeholders instead of artworks
2. **Data Addition Blocker**: Cannot add new artworks without understanding the image handling system
3. **Deployment Issue**: Production site at vulcaart.art is serving a broken gallery
4. **Testing Difficulty**: Cannot validate responsive design without actual image assets

**Root Causes Identified**:
- No placeholder images exist for the 4 artworks
- No fallback mechanism when images fail to load
- No visual feedback indicating missing images
- Assets directory structure exists but is empty (only README.md)

**Impact**:
- Gallery hero renderer loads but displays nothing
- Carousel navigation works but has no visual content
- Critics and RPAIT visualizations are orphaned without context
- New data additions cannot be validated visually

## What Changes

This change implements a robust image display system with immediate fallback solutions and long-term asset management:

### Immediate Solution (Phase 1)
1. **Placeholder Image System**: Generate CSS-based placeholder images with artwork metadata
2. **Error Handling**: Add onerror handlers to gracefully handle missing images
3. **Visual Feedback**: Display artwork title, year, and "Image Pending" message in placeholder

### Long-term Solution (Phase 2)
4. **Asset Acquisition**: Source actual artwork images from Sougwen Chung's portfolio
5. **Image Optimization**: Process images for web performance (1200×800px, <500KB)
6. **Data Structure Enhancement**: Add image metadata (alt text, credits, dimensions)

### System Improvements (Phase 3)
7. **Loading States**: Implement skeleton loaders while images load
8. **Lazy Loading**: Add progressive image loading for better performance
9. **Responsive Images**: Use srcset for different viewport sizes
10. **Documentation**: Update data.js comments with image requirements

## Success Criteria

**Phase 1 - Immediate (Must Have)**:
- ✅ Gallery displays placeholder content for all 4 artworks
- ✅ No broken image icons visible to users
- ✅ Placeholders show artwork title, artist, and year
- ✅ Console logs clearly indicate which images are missing
- ✅ New artwork data can be added and validated without real images

**Phase 2 - Asset Acquisition (Should Have)**:
- ✅ All 4 artwork images sourced and optimized
- ✅ Images load successfully in all browsers
- ✅ File sizes < 500KB per image
- ✅ Proper copyright attribution documented

**Phase 3 - Enhancement (Nice to Have)**:
- ✅ Smooth loading transitions with skeleton screens
- ✅ Responsive srcset for mobile/tablet/desktop
- ✅ Lazy loading for performance optimization
- ✅ Error recovery and retry mechanisms

## Dependencies & Sequencing

1. **Phase 1 (Placeholder System)**: Independent, can start immediately
   - No dependencies
   - Blocks: Phase 2 testing validation

2. **Phase 2 (Asset Acquisition)**: Requires Phase 1 for validation
   - Depends on: Phase 1 placeholder infrastructure
   - Parallel work: Image sourcing can begin during Phase 1 development

3. **Phase 3 (Enhancements)**: Requires Phase 2 completion
   - Depends on: Real images from Phase 2
   - Optional: Can be deferred to future iteration

## Architectural Decisions

See `design.md` for detailed reasoning on:
- CSS vs Canvas for placeholder generation
- Base64 inline placeholders vs external assets
- Error handling strategy (graceful degradation vs retry)
- Image optimization pipeline (ImageMagick vs Sharp vs Squoosh)
- Data structure for image metadata
- Lazy loading implementation approach

## Related Changes

- `responsive-layout-optimization` (spec) - Placeholder sizing must respect responsive breakpoints
- `immersive-autoplay-with-details` (archived) - Gallery hero renderer is the primary consumer

## Questions for Review

1. Should placeholders use gradient backgrounds or solid colors?
2. What is the preferred image sourcing strategy (direct artist contact vs museum archive)?
3. Should we implement automatic image resizing in the data pipeline?
4. Do we need to support multiple image formats (JPG, PNG, WebP)?
5. Should error states be logged to analytics for monitoring?
