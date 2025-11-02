# Tasks: Fix Artwork Image Display System

## Phase 1: Immediate Placeholder System (P0 - Critical)

### Task 1.1: Add Placeholder CSS Styles
**Estimated Time**: 15 minutes
**Dependencies**: None
**Validation**: Visual inspection of placeholder in browser

**Steps**:
1. Open `styles/main.css`
2. Add new section "/* Artwork Image Placeholders */" after responsive layout section
3. Define base `.artwork-placeholder` class with:
   - `aspect-ratio: 3/2`
   - `display: flex` with centering
   - `border-radius: 8px`
   - `color: white`
   - `padding: 2rem`
4. Define 4 artwork-specific classes with unique gradients:
   - `.artwork-placeholder.artwork-1`: Blue-purple (#667eea → #764ba2)
   - `.artwork-placeholder.artwork-2`: Green-teal (#11998e → #38ef7d)
   - `.artwork-placeholder.artwork-3`: Orange-red (#eb3349 → #f45c43)
   - `.artwork-placeholder.artwork-4`: Pink-purple (#d66d75 → #e29587)
5. Add `.placeholder-content`, `.placeholder-title`, `.placeholder-title-en`, `.placeholder-meta`, `.placeholder-status` styles
6. Ensure responsive sizing matches image containers

**Success Criteria**:
- [ ] CSS validates without errors
- [ ] Gradients render smoothly in browser
- [ ] Aspect ratio maintained at 3:2
- [ ] Text is readable (white on colored background)

---

### Task 1.2: Create Placeholder Generator Function
**Estimated Time**: 20 minutes
**Dependencies**: Task 1.1 (CSS must exist first)
**Validation**: Unit test in browser console

**Steps**:
1. Open `js/gallery-hero.js`
2. Add new function `createPlaceholder(artwork)` after `renderArtworkImage` function (around line 282)
3. Function creates `<div class="artwork-placeholder {artwork.id}">`
4. Set `role="img"` for accessibility
5. Generate `aria-label` with full artwork info
6. Create inner HTML with:
   - `<div class="placeholder-content">`
   - `<h3>` with Chinese title + `lang="zh"`
   - `<p>` with English title + `lang="en"`
   - `<p>` with artist and year
   - `<p>` with "🖼️ Image Pending Acquisition" status
7. Return the constructed placeholder element

**Success Criteria**:
- [ ] Function returns valid DOM element
- [ ] All artwork metadata displayed correctly
- [ ] ARIA attributes set properly
- [ ] Console test: `createPlaceholder(VULCA_DATA.artworks[0])` returns expected element

---

### Task 1.3: Add Error Handler to Image Rendering
**Estimated Time**: 15 minutes
**Dependencies**: Task 1.2 (placeholder function must exist)
**Validation**: Test with non-existent image URL

**Steps**:
1. Open `js/gallery-hero.js`
2. Locate `renderArtworkImage` function (line 257)
3. After creating `img` element (line 272), add `img.onerror` handler
4. In handler:
   - Log warning to console: `⚠ Image not found: ${artwork.imageUrl} (${artwork.id})`
   - Clear `container.innerHTML`
   - Call `createPlaceholder(artwork)`
   - Append placeholder to container
5. Ensure error handler doesn't interfere with successful image loads

**Success Criteria**:
- [ ] Missing image triggers placeholder display
- [ ] Console warning logged with image URL and ID
- [ ] Placeholder replaces broken image icon
- [ ] Successful image loads bypass error handler

---

### Task 1.4: Test Placeholder System Locally
**Estimated Time**: 15 minutes
**Dependencies**: Tasks 1.1, 1.2, 1.3 (full implementation)
**Validation**: Manual testing in http://localhost:9999

**Steps**:
1. Start local server: `npx http-server -p 9999 -c-1 --cors`
2. Open http://localhost:9999 in browser
3. Open browser dev tools (F12)
4. Navigate through all 4 artworks using Previous/Next buttons
5. Verify for each artwork:
   - Placeholder displays (no broken image icons)
   - Correct gradient color shown
   - Artwork metadata visible (title, artist, year)
   - Console warning logged
   - Aspect ratio maintained (3:2)
6. Test responsive behavior:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1024px, 1440px, 1920px)
7. Test accessibility:
   - Tab navigation reaches placeholder
   - Screen reader announces content (test with NVDA/VoiceOver)

**Success Criteria**:
- [ ] All 4 artworks show placeholders
- [ ] All placeholders have unique colors
- [ ] No broken image icons visible
- [ ] Console shows 4 warnings (one per artwork)
- [ ] Responsive layout maintained across breakpoints
- [ ] Screen reader reads placeholder content

---

## Phase 2: Asset Acquisition (P1 - High)

### Task 2.1: Contact Artist for Image Permissions
**Estimated Time**: 2-3 days (waiting time)
**Dependencies**: None (can start in parallel with Phase 1)
**Validation**: Received email confirmation or images from artist

**Steps**:
1. Visit https://sougwen.com/ to find contact information
2. Draft email requesting images:
   - Introduce VULCA project (EMNLP 2025 research)
   - List 4 specific artworks needed (from assets/README.md)
   - Request web-optimized versions (1200×800px, <500KB)
   - Ask for usage permissions (academic/non-commercial)
   - Offer to provide proper attribution
3. Send email to artist's studio
4. Follow up after 3-5 business days if no response
5. If no response after 2 weeks, proceed to Task 2.2 (museum archive)

**Success Criteria**:
- [ ] Email sent to artist
- [ ] Artist responds with images or permission
- [ ] Usage rights clarified (academic use approved)
- [ ] Images received in appropriate format/size

---

### Task 2.2: Acquire Images from V&A Museum (Fallback)
**Estimated Time**: 1-2 hours
**Dependencies**: Task 2.1 failed or no response
**Validation**: Downloaded high-res images with proper licensing

**Steps**:
1. Visit V&A Museum online collection: https://collections.vam.ac.uk/
2. Search for "Sougwen Chung Memory Drawing Operations"
3. Check image licensing (Creative Commons, public domain, or request permission)
4. Download highest resolution available
5. Document source, license, and attribution requirements
6. If V&A images unavailable, try:
   - Artsy.net (https://www.artsy.net/artist/sougwen-chung)
   - Gillian Jason Gallery
   - MIT Media Lab archives

**Success Criteria**:
- [ ] Images downloaded in high resolution (>1000px width)
- [ ] License allows academic/non-commercial use
- [ ] Attribution requirements documented
- [ ] Source URL saved for reference

---

### Task 2.3: Optimize Images for Web Performance
**Estimated Time**: 30 minutes
**Dependencies**: Task 2.1 or 2.2 (images acquired)
**Validation**: File sizes <500KB, aspect ratio 3:2

**Steps**:
1. Install ImageMagick (if not already): https://imagemagick.org/
2. For each acquired image (4 total):
   ```bash
   magick input.jpg -resize 1200x800^ -gravity center -extent 1200x800 -quality 85 assets/artwork-1.jpg
   ```
3. Verify output:
   - Dimensions: exactly 1200×800px
   - File size: <500KB each
   - Quality: visually acceptable at 85%
4. Create backup of original images in `backups/original-images/`
5. Place optimized images in `/assets/` directory:
   - `artwork-1.jpg` (Memory - 2022)
   - `artwork-2.jpg` (Painting Operation Unit - 2015)
   - `artwork-3.jpg` (All Things in All Things - 2018)
   - `artwork-4.jpg` (Exquisite Dialogue - 2020)

**Success Criteria**:
- [ ] All 4 images in `/assets/` directory
- [ ] Each image exactly 1200×800px
- [ ] Each image <500KB file size
- [ ] Aspect ratio exactly 3:2
- [ ] Visual quality acceptable (no excessive artifacts)

---

### Task 2.4: Test Real Images Locally
**Estimated Time**: 15 minutes
**Dependencies**: Task 2.3 (optimized images in /assets/)
**Validation**: Images load successfully without placeholders

**Steps**:
1. Ensure local server running: `npx http-server -p 9999 -c-1 --cors`
2. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
3. Open http://localhost:9999
4. Navigate through all 4 artworks
5. Verify for each:
   - Image loads successfully (no placeholder)
   - No console errors or 404s
   - Aspect ratio maintained
   - Responsive sizing works
   - Image quality acceptable
6. Test on multiple browsers:
   - Chrome/Edge
   - Firefox
   - Safari (if available)

**Success Criteria**:
- [ ] All 4 images load without errors
- [ ] No placeholders shown (images present)
- [ ] No console warnings about missing images
- [ ] Images maintain aspect ratio across breakpoints
- [ ] Loading time acceptable (<2 seconds on broadband)

---

### Task 2.5: Document Image Attribution
**Estimated Time**: 20 minutes
**Dependencies**: Task 2.1 or 2.2 (image source known)
**Validation**: Attribution documented in code and assets/README.md

**Steps**:
1. Update `/assets/README.md`:
   - Add "## Image Credits" section
   - List each artwork with source, license, and attribution
   - Example:
     ```markdown
     ### artwork-1.jpg - Memory (2022)
     - Source: [Artist's website / V&A Museum / etc.]
     - License: [CC BY-SA 4.0 / Permission granted / etc.]
     - Attribution: "Courtesy of Sougwen Chung"
     ```
2. Add inline HTML comments in `index.html`:
   ```html
   <!-- Artwork images courtesy of Sougwen Chung -->
   <!-- Source: [URL] | License: [Type] -->
   ```
3. Add attribution to footer or about page if required by license

**Success Criteria**:
- [ ] assets/README.md updated with full credits
- [ ] Source URLs documented
- [ ] License type specified
- [ ] Attribution text matches artist/museum requirements

---

## Phase 3: System Enhancements (P2 - Nice to Have)

### Task 3.1: Implement Loading Skeleton Screens
**Estimated Time**: 30 minutes
**Dependencies**: Phase 2 complete (real images exist)
**Validation**: Smooth transition from skeleton to image

**Steps**:
1. Add skeleton CSS to `styles/main.css`:
   ```css
   .artwork-skeleton {
     aspect-ratio: 3/2;
     background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
     background-size: 200% 100%;
     animation: shimmer 1.5s infinite;
   }
   @keyframes shimmer {
     0% { background-position: 200% 0; }
     100% { background-position: -200% 0; }
   }
   ```
2. Modify `renderArtworkImage` in `js/gallery-hero.js`:
   - Show skeleton before image loads
   - Hide skeleton on `img.onload`
   - Add fade-in animation when image loads
3. Add CSS for smooth fade-in:
   ```css
   .artwork-image img {
     opacity: 0;
     transition: opacity 0.3s ease-in;
   }
   .artwork-image img.loaded {
     opacity: 1;
   }
   ```

**Success Criteria**:
- [ ] Skeleton appears while image loading
- [ ] Shimmer animation smooth (60fps)
- [ ] Image fades in smoothly when loaded
- [ ] No layout shift during transition

---

### Task 3.2: Add Responsive srcset for Images
**Estimated Time**: 45 minutes
**Dependencies**: Task 2.3 (base images exist)
**Validation**: Correct image size loaded per viewport

**Steps**:
1. Generate multiple image sizes using ImageMagick:
   ```bash
   # For each artwork
   magick assets/artwork-1.jpg -resize 400x267 assets/artwork-1-400.jpg
   magick assets/artwork-1.jpg -resize 800x533 assets/artwork-1-800.jpg
   # (1200x800 already exists)
   ```
2. Modify `renderArtworkImage` to use srcset:
   ```javascript
   img.src = artwork.imageUrl; // 800px default
   img.srcset = `
     /assets/${artwork.id}-400.jpg 400w,
     /assets/${artwork.id}-800.jpg 800w,
     /assets/${artwork.id}-1200.jpg 1200w
   `;
   img.sizes = `
     (max-width: 768px) 100vw,
     (max-width: 1024px) 70vw,
     1200px
   `;
   ```
3. Test browser selects correct image size

**Success Criteria**:
- [ ] 3 sizes per artwork (400/800/1200px)
- [ ] Mobile loads 400px version
- [ ] Tablet loads 800px version
- [ ] Desktop loads 1200px version
- [ ] Total file sizes reduced vs loading 1200px everywhere

---

### Task 3.3: Implement Lazy Loading
**Estimated Time**: 10 minutes
**Dependencies**: Phase 2 complete
**Validation**: Images below fold don't load until scroll

**Steps**:
1. Add `loading="lazy"` attribute to img elements in `js/gallery-hero.js`:
   ```javascript
   img.loading = 'lazy';
   ```
2. Test that images only load when approaching viewport
3. Verify works in supported browsers (Chrome, Firefox, Edge, Safari 15.4+)

**Success Criteria**:
- [ ] Images below fold defer loading
- [ ] Loading triggered when image near viewport
- [ ] No performance regression
- [ ] Works across supported browsers

---

### Task 3.4: Add Performance Monitoring
**Estimated Time**: 20 minutes
**Dependencies**: Phase 2 or 3 complete
**Validation**: Lighthouse score >90

**Steps**:
1. Run Lighthouse audit in Chrome DevTools
2. Note scores for:
   - Performance
   - Accessibility
   - Best Practices
   - SEO
3. Address any warnings related to images:
   - Properly sized images
   - Next-gen formats (WebP conversion if needed)
   - Cache policies
4. Re-run Lighthouse to verify improvements

**Success Criteria**:
- [ ] Performance score ≥90
- [ ] Accessibility score ≥95
- [ ] No image-related warnings
- [ ] Images properly sized for viewport

---

## Validation & Testing (All Phases)

### Task V.1: Cross-Browser Testing
**Estimated Time**: 30 minutes
**Dependencies**: Phase 1 or 2 complete
**Validation**: Works identically across browsers

**Test Matrix**:
- [ ] Chrome 90+ (Windows/Mac)
- [ ] Firefox 88+ (Windows/Mac)
- [ ] Safari 14+ (Mac/iOS)
- [ ] Edge 90+ (Windows)
- [ ] Mobile Safari (iOS 14+)
- [ ] Chrome Mobile (Android 10+)

**Per browser**:
- [ ] Images load correctly (or placeholders display)
- [ ] Aspect ratio maintained
- [ ] No console errors
- [ ] Responsive breakpoints work

---

### Task V.2: Accessibility Audit
**Estimated Time**: 20 minutes
**Dependencies**: Phase 1 complete
**Validation**: WCAG 2.1 AA compliance

**Checks**:
- [ ] All images have alt text
- [ ] Placeholders have role="img"
- [ ] ARIA labels descriptive
- [ ] Color contrast sufficient (4.5:1 for text)
- [ ] Keyboard navigation works
- [ ] Screen reader testing (NVDA/VoiceOver):
  - [ ] Announces artwork titles
  - [ ] Announces artist and year
  - [ ] Announces "Image Pending" status

---

### Task V.3: Performance Testing
**Estimated Time**: 15 minutes
**Dependencies**: Phase 2 or 3 complete
**Validation**: Images load efficiently

**Metrics to Measure**:
- [ ] LCP (Largest Contentful Paint) <2.5s
- [ ] Total image load time <3s on 4G
- [ ] No layout shift (CLS <0.1)
- [ ] Images cached correctly (check Network tab)

**Tools**:
- Lighthouse (Chrome DevTools)
- WebPageTest.org
- Browser Network panel

---

## Summary

**Total Estimated Time**:
- Phase 1: ~1 hour (critical path)
- Phase 2: 2-3 days waiting + 2 hours active work
- Phase 3: ~2 hours (optional enhancements)

**Dependencies Graph**:
```
Task 1.1 (CSS) → Task 1.2 (Placeholder Function) → Task 1.3 (Error Handler) → Task 1.4 (Test)
                                                                                      ↓
Task 2.1/2.2 (Acquire) → Task 2.3 (Optimize) → Task 2.4 (Test) → Task 2.5 (Document)
                                                                         ↓
                                    Task 3.1/3.2/3.3/3.4 (Enhancements) → V.1/V.2/V.3 (Validation)
```

**Parallelizable Work**:
- Task 2.1 (artist contact) can start immediately, in parallel with Phase 1
- Task 3.1, 3.2, 3.3 are independent and can be done in any order

**Critical Path**:
Phase 1 (1 hour) → Phase 2 asset acquisition (2-3 days) → Phase 2 optimization (1 hour) → Validation (1 hour)
**Total: ~3-4 days elapsed** (mostly waiting for artist response)
