# Tasks: Implement Multi-Image Artwork Series System

Total Estimated Time: **3-4 weeks** (60-80 hours)

---

## Phase 1: Data Structure & Validation (Week 1, 15 hours)

### Task 1.1: Extend Data Structure
**Estimated Time**: 2 hours

1. Open `js/data.js`
2. Add `IMAGE_CATEGORIES` enum constant
3. Add example multi-image artwork (artwork-1) with 6 images
4. Keep existing `imageUrl` for backward compatibility
5. Test: Load page, verify no console errors

**Success Criteria**:
- [ ] `VULCA_DATA.artworks[0].images` is array with 6 objects
- [ ] Each image has id, url, category, sequence, titles
- [ ] Existing artworks 2-4 still use `imageUrl` (backward compat)
- [ ] Console logs no validation errors

---

### Task 1.2: Create Validation Utility
**Estimated Time**: 3 hours

1. Create `js/validators/artwork-validator.js`
2. Implement `validateArtworkImages(artwork)` function
3. Check: array length, ID format, unique IDs, valid categories, sequences
4. Add console warnings for validation failures
5. Run validation on page load in development mode

**Success Criteria**:
- [ ] Validator detects duplicate IDs
- [ ] Validator catches invalid categories
- [ ] Validator checks sequence uniqueness
- [ ] Validator validates primary image ID exists

---

### Task 1.3: Implement Backward Compatibility Helper
**Estimated Time**: 2 hours

1. Create `js/utils/image-compat.js`
2. Implement `getArtworkImages(artwork)` function
3. Handle both `images` array and legacy `imageUrl`
4. Convert single imageUrl to images array format
5. Test with mixed artwork formats

**Success Criteria**:
- [ ] Artworks with `images` array return as-is
- [ ] Artworks with only `imageUrl` return single-item array
- [ ] Converted images have correct structure (id, url, category, etc.)
- [ ] All existing artworks (1-4) work without modification

---

### Task 1.4: File Organization Setup
**Estimated Time**: 1 hour

1. Create directory structure: `/assets/artworks/artwork-1/`
2. Move `artwork-1.jpg` to `/assets/artworks/artwork-1/05-final-main.jpg`
3. Update `data.js` URL references
4. Document naming convention in `/assets/artworks/README.md`
5. Test: Verify image still loads correctly

**Success Criteria**:
- [ ] New directory structure exists
- [ ] Image loads from new path
- [ ] README documents {seq}-{category}-{slug}.jpg pattern
- [ ] Git commit with clear message

---

### Task 1.5: Documentation - Data Entry Guide
**Estimated Time**: 2 hours

1. Create `docs/ADDING_ARTWORKS.md`
2. Document complete workflow for adding new artwork
3. Include data.js template with all fields
4. Explain image naming convention
5. Provide validation checklist

**Success Criteria**:
- [ ] Guide includes complete artwork template
- [ ] Image naming rules clearly explained
- [ ] Validation steps documented
- [ ] Example walkthrough provided

---

## Phase 2: Carousel Component (Week 1-2, 20 hours)

### Task 2.1: Create Carousel Module
**Estimated Time**: 4 hours

1. Create `js/components/artwork-carousel.js`
2. Implement `ArtworkImageCarousel` class
3. Constructor: initialize with artwork, container
4. Methods: render(), next(), prev(), goTo(index)
5. Basic HTML structure generation

**Success Criteria**:
- [ ] Carousel class instantiates without errors
- [ ] render() displays current image
- [ ] next()/prev() change current index
- [ ] goTo(index) jumps to specific image

---

### Task 2.2: Navigation Controls UI
**Estimated Time**: 3 hours

1. Add prev/next button HTML
2. Style buttons with RPAIT theme
3. Add image indicators (dots)
4. Display "X of Y" text
5. Wire up click handlers

**Success Criteria**:
- [ ] Prev/next buttons appear and function
- [ ] Indicator dots show current position
- [ ] Clicking dot jumps to that image
- [ ] First/last image disables prev/next appropriately

---

### Task 2.3: Keyboard Navigation
**Estimated Time**: 2 hours

1. Add event listener for keydown
2. Handle ArrowLeft, ArrowRight, Home, End keys
3. Prevent default browser behavior
4. Only handle when carousel focused
5. Test across browsers

**Success Criteria**:
- [ ] Right arrow advances to next image
- [ ] Left arrow goes to previous image
- [ ] Home key goes to first image
- [ ] End key goes to last image
- [ ] Keys only work when carousel focused

---

### Task 2.4: Touch Gesture Support
**Estimated Time**: 4 hours

1. Add touchstart, touchmove, touchend listeners
2. Track swipe direction and distance
3. Require minimum swipe threshold (50px)
4. Handle swipe velocity for smooth UX
5. Test on mobile devices

**Success Criteria**:
- [ ] Swipe left advances to next
- [ ] Swipe right goes to previous
- [ ] Short swipes ignored (<50px)
- [ ] Works on iOS and Android
- [ ] No conflicts with page scrolling

---

### Task 2.5: Image Metadata Display
**Estimated Time**: 3 hours

1. Create metadata overlay component
2. Display titleZh, titleEn, caption
3. Show category badge with color coding
4. Display sequence indicator
5. Style with responsive typography

**Success Criteria**:
- [ ] Titles display in both languages
- [ ] Category badge shows correct color per type
- [ ] "3 of 6" indicator updates on navigation
- [ ] Caption text wraps properly on mobile
- [ ] Metadata overlay doesn't obscure image

---

### Task 2.6: Lazy Loading Implementation
**Estimated Time**: 4 hours

1. Create `ImageLoader` utility class
2. Implement preload strategy (current + adjacent)
3. Track loaded images in Set
4. Show loading spinner while image loads
5. Handle load errors with placeholder

**Success Criteria**:
- [ ] Only 3 images load initially (current + prev/next)
- [ ] Navigation preloads adjacent images
- [ ] Loading spinner shows during fetch
- [ ] Error placeholder if image fails
- [ ] Loaded images cached (no re-fetch)

---

## Phase 3: Hybrid Critique Integration (Week 2, 15 hours)

### Task 3.1: Image Reference Parser
**Estimated Time**: 3 hours

1. Create `js/utils/critique-parser.js`
2. Implement regex to find `[img:image-id]` patterns
3. Extract image IDs from critique text
4. Validate IDs against artwork.images
5. Return parsed data structure

**Success Criteria**:
- [ ] Parser finds all [img:id] occurrences
- [ ] IDs extracted correctly
- [ ] Invalid IDs logged as warnings
- [ ] Returns array of {index, imageId, valid}

---

### Task 3.2: Clickable Image References
**Estimated Time**: 4 hours

1. Extend `renderCritiques()` function
2. Replace [img:id] with clickable `<a>` tags
3. Add data-image-id attribute
4. Style links with RPAIT theme
5. Wire onclick to carousel.goTo()

**Success Criteria**:
- [ ] [img:img-1-3] becomes link with image title
- [ ] Clicking link navigates carousel to that image
- [ ] Invalid refs show original syntax (no link)
- [ ] Links styled distinctly from regular text

---

### Task 3.3: Visual Highlighting of Referenced Images
**Estimated Time**: 3 hours

1. Add `highlightedImages` state to carousel
2. When critique references images, pass IDs to carousel
3. Apply visual indicator (gold border) to highlighted images
4. Clear highlights when changing artworks
5. Animate highlight appearance

**Success Criteria**:
- [ ] Referenced images show gold border
- [ ] Indicator appears in carousel navigation
- [ ] Highlight clears on artwork change
- [ ] Animation is smooth (300ms fade)

---

### Task 3.4: Critique Data Structure Update
**Estimated Time**: 2 hours

1. Add `imageReferences` field to critique objects
2. Pre-compute references during data load
3. Store array of image IDs per critique
4. Update example critiques in data.js
5. Test with 2-3 artworks having references

**Success Criteria**:
- [ ] `critique.imageReferences` is array of strings
- [ ] References extracted on page load
- [ ] At least 3 critiques have image references
- [ ] No performance degradation

---

### Task 3.5: Documentation - Critique Writing Guide
**Estimated Time**: 3 hours

1. Create `docs/WRITING_CRITIQUES.md`
2. Explain [img:id] syntax
3. Provide examples of good references
4. Document image ID lookup method
5. Include best practices

**Success Criteria**:
- [ ] Syntax fully documented with examples
- [ ] ID lookup process explained
- [ ] Do's and don'ts listed
- [ ] Sample critiques provided

---

## Phase 4: Content Migration (Week 3, 15 hours)

### Task 4.1: Source Additional Images for Artwork-1
**Estimated Time**: 4 hours

1. Review Sougwen Chung's portfolio for Memory (2022)
2. Identify 5-6 images covering process, details, installation
3. Download high-resolution images
4. Optimize to 1200×800px, <200KB
5. Organize in `/assets/artworks/artwork-1/`

**Success Criteria**:
- [ ] 6 images sourced for artwork-1
- [ ] Images cover different categories
- [ ] All optimized to target specs
- [ ] Files follow naming convention

---

### Task 4.2: Create Metadata for Artwork-1 Images
**Estimated Time**: 2 hours

1. Write Chinese and English titles for each image
2. Draft caption text (~50-100 words each)
3. Assign categories (sketch, process, detail, etc.)
4. Determine sequence order
5. Add to data.js

**Success Criteria**:
- [ ] All 6 images have bilingual titles
- [ ] Captions provide meaningful context
- [ ] Categories appropriately assigned
- [ ] Sequence tells coherent story

---

### Task 4.3: Update Artwork-1 Critiques with Image References
**Estimated Time**: 3 hours

1. Review existing 6 critiques for artwork-1
2. Identify opportunities to reference specific images
3. Add [img:id] syntax to 3-4 critiques
4. Ensure references make contextual sense
5. Test rendering

**Success Criteria**:
- [ ] At least 3 critiques reference images
- [ ] References flow naturally in text
- [ ] All referenced IDs valid
- [ ] Links render correctly

---

### Task 4.4: Migrate Artwork-2 (Repeat 4.1-4.3)
**Estimated Time**: 3 hours

**Success Criteria**:
- [ ] 5-7 images sourced and optimized
- [ ] Metadata complete
- [ ] Critiques updated with references

---

### Task 4.5: Migrate Artworks-3 and 4
**Estimated Time**: 3 hours each = 6 hours total

**Success Criteria** (per artwork):
- [ ] 5-7 images sourced
- [ ] Metadata complete
- [ ] Critiques updated

---

## Phase 5: Testing & Polish (Week 3-4, 10 hours)

### Task 5.1: Cross-Browser Testing
**Estimated Time**: 3 hours

1. Test on Chrome, Firefox, Safari, Edge
2. Verify carousel navigation on all browsers
3. Check image loading behavior
4. Test keyboard shortcuts
5. Document any browser-specific issues

**Success Criteria**:
- [ ] Carousel works on Chrome 90+
- [ ] Carousel works on Firefox 88+
- [ ] Carousel works on Safari 14+
- [ ] Carousel works on Edge 90+
- [ ] No critical rendering bugs

---

### Task 5.2: Mobile Responsiveness Testing
**Estimated Time**: 3 hours

1. Test on iOS (iPhone 12, iPad)
2. Test on Android (Pixel, Samsung)
3. Verify touch gestures
4. Check metadata readability
5. Test portrait and landscape modes

**Success Criteria**:
- [ ] Swipe gestures work smoothly
- [ ] Images scale properly
- [ ] Text readable without zoom
- [ ] Navigation controls accessible
- [ ] Performance acceptable (<2s load)

---

### Task 5.3: Accessibility Audit
**Estimated Time**: 2 hours

1. Run Lighthouse accessibility scan
2. Verify keyboard navigation
3. Test with screen reader (NVDA/JAWS)
4. Check color contrast ratios
5. Add missing ARIA labels

**Success Criteria**:
- [ ] Lighthouse score >90
- [ ] All interactive elements keyboard accessible
- [ ] Screen reader announces images correctly
- [ ] ARIA roles properly assigned
- [ ] Focus indicators visible

---

### Task 5.4: Performance Optimization
**Estimated Time**: 2 hours

1. Measure page load time (target <3s)
2. Optimize lazy loading thresholds
3. Implement image caching
4. Minimize layout shifts
5. Profile with DevTools

**Success Criteria**:
- [ ] Initial load <3s on 3G
- [ ] Carousel transition <200ms
- [ ] No cumulative layout shift (CLS <0.1)
- [ ] Lazy loading reduces bandwidth by 50%

---

## Phase 6: Documentation & Deployment (Week 4, 5 hours)

### Task 6.1: Update CLAUDE.md
**Estimated Time**: 1 hour

1. Add multi-image system documentation
2. Update "Adding New Artworks" section
3. Document image reference syntax
4. Update troubleshooting FAQ

**Success Criteria**:
- [ ] Multi-image structure documented
- [ ] Data entry guide linked
- [ ] Common issues listed
- [ ] Examples provided

---

### Task 6.2: Update README.md
**Estimated Time**: 1 hour

1. Add "Image Series" feature description
2. Update project architecture diagram
3. Highlight critique-image linking
4. Add screenshots

**Success Criteria**:
- [ ] Feature clearly described
- [ ] Technical details accurate
- [ ] Screenshots illustrate key features

---

### Task 6.3: Create Migration Checklist
**Estimated Time**: 1 hour

1. Document pre-deployment steps
2. Create rollback plan
3. List validation checks
4. Define success metrics

**Success Criteria**:
- [ ] Checklist comprehensive
- [ ] Rollback plan tested
- [ ] Metrics defined

---

### Task 6.4: Deployment
**Estimated Time**: 1 hour

1. Run final validation
2. Commit all changes
3. Push to GitHub
4. Verify GitHub Pages deployment
5. Monitor for errors

**Success Criteria**:
- [ ] All tests pass
- [ ] Deployment successful
- [ ] Site loads without errors
- [ ] Images display correctly

---

### Task 6.5: Post-Deployment Monitoring
**Estimated Time**: 1 hour

1. Check browser console for errors
2. Verify all images load
3. Test carousel on live site
4. Check mobile performance
5. Gather initial user feedback

**Success Criteria**:
- [ ] No console errors
- [ ] 100% image load success rate
- [ ] Carousel fully functional
- [ ] Mobile UX acceptable

---

## Summary

**Total Tasks**: 39
**Total Estimated Time**: 75 hours
**Phases**: 6
**Timeline**: 3-4 weeks

**Critical Path**:
1. Data structure (Phase 1) → Carousel (Phase 2) → Critique integration (Phase 3) → Content migration (Phase 4)

**Parallel Work Opportunities**:
- Tasks 2.1-2.6 (Carousel) can be developed while Task 1.5 (docs) is written
- Tasks 4.2-4.5 (content migration) can be parallelized (different artworks)
- Testing (Phase 5) can start as soon as Phase 3 completes

**Risk Mitigation**:
- Backward compatibility ensures existing artworks work throughout migration
- Gradual content migration reduces deployment risk
- Validation utilities catch data errors early
- Comprehensive testing phase catches issues before launch
