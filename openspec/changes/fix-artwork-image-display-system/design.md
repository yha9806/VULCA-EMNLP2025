# Design Document: Artwork Image Display System

## Problem Analysis

### Current State
- **Data Layer**: `js/data.js` contains 4 artwork objects with `imageUrl: "/assets/artwork-X.jpg"`
- **Rendering Layer**: `js/gallery-hero.js` line 273 sets `img.src = artwork.imageUrl`
- **Asset Layer**: `/assets/` directory is empty (only README.md exists)
- **Result**: Browser attempts to load non-existent images, displays broken image icons

### Why Images Are Missing
According to `/assets/README.md`:
- Images require copyright clearance from artist Sougwen Chung
- Recommended sources: official website, V&A Museum, Artsy.net
- Specific requirements: 1200×800px, <500KB, 85% JPG quality
- No placeholders were created during development

### User Impact
1. **Homepage**: Carousel shows broken images
2. **Console**: 404 errors for 4 image requests
3. **Performance**: Wasted bandwidth on failed requests
4. **Development**: Cannot validate responsive layout without images

## Architectural Decisions

### Decision 1: Placeholder Strategy

**Options Considered**:

A. **CSS Gradient Placeholders** (CHOSEN)
```css
.artwork-placeholder {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  aspect-ratio: 3/2;
}
```
**Pros**: No external assets, instant load, customizable per artwork
**Cons**: Not semantic for images

B. **Base64 Inline SVG**
```html
<img src="data:image/svg+xml;base64,..." />
```
**Pros**: Semantic img element, scalable
**Cons**: Larger HTML payload, harder to maintain

C. **External Placeholder Service** (unsplash.it, placehold.co)
```html
<img src="https://placehold.co/1200x800/667eea/white?text=Artwork+1" />
```
**Pros**: Real images, variety
**Cons**: External dependency, privacy concerns, network required

**Decision**: Use CSS gradient placeholders (Option A) because:
- Zero dependencies (works offline)
- Instant rendering (no network delay)
- Customizable (can assign unique colors per artwork)
- Fallback-friendly (CSS always available)

### Decision 2: Error Handling Approach

**Options Considered**:

A. **Graceful Degradation** (CHOSEN)
```javascript
img.onerror = () => {
  container.classList.add('image-failed');
  // Show placeholder div instead
};
```
**Pros**: User sees something useful, dev sees console error
**Cons**: Requires placeholder infrastructure

B. **Retry Mechanism**
```javascript
img.onerror = () => {
  if (retries < 3) {
    setTimeout(() => img.src = artwork.imageUrl, 1000);
  }
};
```
**Pros**: Handles transient network issues
**Cons**: Wasted bandwidth, doesn't solve missing file problem

C. **Silent Failure**
```javascript
img.onerror = () => { /* do nothing */ };
```
**Pros**: Simple
**Cons**: Poor UX, no debugging info

**Decision**: Use graceful degradation (Option A) because:
- Provides immediate user value (show artwork metadata)
- Preserves developer visibility (console logging)
- Aligns with progressive enhancement philosophy
- Easier to validate responsive layout

### Decision 3: Image Sourcing Strategy

**Options Considered**:

A. **Direct Artist Contact** (RECOMMENDED)
- Email Sougwen Chung's studio for official images
- Request web-optimized versions
- Obtain explicit usage rights

B. **Museum Archives** (V&A has "Memory" in collection)
- Download from museum website
- Check Creative Commons licensing
- May have watermarks

C. **Web Scraping** (NOT RECOMMENDED)
- Find images via Google Images
- High copyright risk
- Potential quality issues

D. **AI-Generated Placeholders**
- Use DALL-E/Midjourney to create similar artworks
- No copyright issues
- Ethically questionable for representing real artworks

**Decision**: Pursue Option A (Direct Artist Contact) because:
- Ensures legal compliance
- Highest quality images
- Supports artist-researcher relationship
- Aligns with academic integrity standards

**Fallback**: If Option A fails, use Option B (V&A Museum) with proper attribution.

### Decision 4: Image Optimization Pipeline

**Options Considered**:

A. **Manual ImageMagick** (CHOSEN for Phase 2)
```bash
magick input.jpg -resize 1200x800 -quality 85 output.jpg
```
**Pros**: Full control, widely available, scriptable
**Cons**: Manual process, requires installation

B. **Sharp (Node.js)**
```javascript
sharp('input.jpg')
  .resize(1200, 800)
  .jpeg({ quality: 85 })
  .toFile('output.jpg');
```
**Pros**: Automated, fast, integrates with build
**Cons**: Requires Node.js setup, overkill for 4 images

C. **Squoosh Web App**
- https://squoosh.app/
- Drag-and-drop interface
- Visual quality preview

**Pros**: No installation, visual feedback
**Cons**: Manual, not scriptable

**Decision**: Use ImageMagick (Option A) for initial batch, document in `/assets/README.md` because:
- One-time process for 4 images
- Already documented in README
- Consistent with existing project conventions
- Enables future automation if needed

### Decision 5: Data Structure Enhancement

**Current Structure**:
```javascript
{
  id: "artwork-1",
  titleZh: "记忆（绘画操作单元：第二代）",
  titleEn: "Memory (Painting Operation Unit: Second Generation)",
  year: 2022,
  imageUrl: "/assets/artwork-1.jpg",
  artist: "Sougwen Chung",
  context: "..."
}
```

**Proposed Enhancement**:
```javascript
{
  id: "artwork-1",
  titleZh: "记忆（绘画操作单元：第二代）",
  titleEn: "Memory (Painting Operation Unit: Second Generation)",
  year: 2022,

  // Enhanced image data
  image: {
    url: "/assets/artwork-1.jpg",
    alt: "Memory (Painting Operation Unit: Second Generation) by Sougwen Chung, 2022",
    width: 1200,
    height: 800,
    fallbackColor: "#667eea",  // For placeholder
    credit: "Courtesy of the artist",
    source: "Victoria and Albert Museum"
  },

  artist: "Sougwen Chung",
  context: "..."
}
```

**Decision**: Keep current structure for Phase 1, enhance in Phase 3 because:
- Backward compatible (imageUrl still works)
- Allows gradual migration
- Avoids breaking existing code
- Can be introduced after placeholders proven

## Implementation Strategy

### Phase 1: Immediate Placeholder System

**File Changes**:
1. **`js/gallery-hero.js`** (lines 257-281)
   - Add onerror handler to img element
   - Create fallback placeholder rendering function
   - Log missing images to console

2. **`styles/main.css`** (new section)
   - Add `.artwork-placeholder` class
   - Define gradient backgrounds per artwork
   - Ensure responsive sizing

**Placeholder Content**:
- Artwork title (Chinese + English)
- Artist name
- Year
- "Image Pending Acquisition" message
- Icon or decorative element

**Code Example**:
```javascript
function renderArtworkImage(carousel) {
  const container = document.getElementById('artwork-image-container');
  const artwork = carousel.getCurrentArtwork();

  container.innerHTML = '';

  const img = document.createElement('img');
  img.src = artwork.imageUrl;
  img.alt = `${artwork.titleZh} ${artwork.titleEn}`;

  // Error handler for missing images
  img.onerror = () => {
    console.warn(`⚠ Image not found: ${artwork.imageUrl}`);
    container.innerHTML = '';
    const placeholder = createPlaceholder(artwork);
    container.appendChild(placeholder);
  };

  container.appendChild(img);
}

function createPlaceholder(artwork) {
  const div = document.createElement('div');
  div.className = `artwork-placeholder artwork-${artwork.id}`;
  div.innerHTML = `
    <div class="placeholder-content">
      <h3 class="placeholder-title">${artwork.titleZh}</h3>
      <p class="placeholder-title-en">${artwork.titleEn}</p>
      <p class="placeholder-meta">${artwork.artist} • ${artwork.year}</p>
      <p class="placeholder-status">🖼️ Image Pending Acquisition</p>
    </div>
  `;
  return div;
}
```

### Phase 2: Asset Acquisition

**Action Items**:
1. Email Sougwen Chung's studio (contact via sougwen.com)
2. Request 4 specific artworks listed in `/assets/README.md`
3. Request web-optimized versions (1200×800px, <500KB)
4. Obtain written permission for academic/exhibition use
5. Process images with ImageMagick
6. Place in `/assets/` directory
7. Test loading in all browsers
8. Document copyright attribution

**Fallback Plan**:
- If artist contact fails, use V&A Museum archive
- Ensure proper Creative Commons compliance
- Add watermark removal if necessary
- Document source clearly

### Phase 3: System Enhancements

**Loading States**:
```javascript
// Before image loads
<div class="artwork-skeleton">
  <div class="skeleton-shimmer"></div>
</div>

// Image loaded
<img src="..." class="fade-in" />
```

**Responsive Images**:
```html
<img
  src="/assets/artwork-1-800.jpg"
  srcset="
    /assets/artwork-1-400.jpg 400w,
    /assets/artwork-1-800.jpg 800w,
    /assets/artwork-1-1200.jpg 1200w
  "
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 70vw, 1200px"
/>
```

**Lazy Loading**:
```html
<img src="..." loading="lazy" />
```

## Testing Strategy

### Phase 1 Testing
1. **Visual Regression**: Placeholders display correctly on all breakpoints
2. **Console Logging**: Missing images logged with clear warnings
3. **Network Tab**: No 404 errors once placeholders active
4. **Accessibility**: Placeholders readable by screen readers

### Phase 2 Testing
1. **Image Loading**: All 4 images load successfully
2. **File Size**: Each image < 500KB
3. **Aspect Ratio**: Images maintain 3:2 ratio
4. **Browser Compatibility**: Test in Chrome, Firefox, Safari, Edge
5. **Mobile**: Test on actual devices (iOS, Android)

### Phase 3 Testing
1. **Performance**: Lighthouse score > 90
2. **Lazy Loading**: Images below fold don't load until scroll
3. **Responsive**: Correct srcset image loaded per viewport
4. **Cache**: Images cached correctly (check Network panel)

## Rollback Plan

If Phase 1 placeholders cause issues:
- Remove onerror handler from gallery-hero.js
- Revert to broken image icons (previous behavior)
- No data loss (no data structure changes)

If Phase 2 images cause performance issues:
- Reduce image quality (85% → 70%)
- Resize images (1200×800 → 800×533)
- Implement lazy loading immediately

## Future Considerations

### Image CDN
If the site scales:
- Use Cloudflare Images or imgix
- Automatic format conversion (WebP, AVIF)
- On-the-fly resizing
- Global edge caching

### Dynamic Data Addition
For future artworks:
1. Define image naming convention (artwork-{id}.jpg)
2. Create image upload workflow
3. Automate optimization pipeline
4. Validate image metadata on upload

### Accessibility
- Add detailed alt text descriptions
- Provide text-only version of gallery
- Support high-contrast mode
- Ensure keyboard navigation works with placeholders
