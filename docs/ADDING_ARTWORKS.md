# Guide: Adding New Artworks to VULCA

Complete workflow for adding artworks with multi-image support to the VULCA exhibition platform.

**Last Updated**: 2025-11-02
**For**: Content editors, curators, developers

---

## Overview

This guide covers:
1. Preparing artwork images
2. Creating artwork metadata
3. Adding data to `js/data.js`
4. Validation and testing
5. Deployment

---

## Prerequisites

- [ ] Access to artwork images (5-10 images per artwork)
- [ ] Artwork metadata (titles, artist, year, context)
- [ ] Local development environment set up
- [ ] Node.js installed (for image optimization)

---

## Step 1: Prepare Artwork Images

### 1.1 Source Images

Collect 5-10 images that tell the complete story of the artwork:

| Category | Purpose | Example |
|----------|---------|---------|
| **Sketch** | Initial concepts, preliminary studies | Hand-drawn sketches, digital mockups |
| **Process** | Work-in-progress, creation documentation | Artist working, fabrication steps |
| **Installation** | Exhibition setup, environmental context | Gallery views, installation shots |
| **Detail** | Close-ups, technical details | Mechanisms, textures, materials |
| **Final** | Completed artwork, primary presentation | Main hero image |
| **Context** | Supplementary materials | Artist statements, diagrams |

### 1.2 Optimize Images

**Target Specifications**:
- **Dimensions**: 1200 × 800 px (3:2 aspect ratio)
- **Format**: JPEG (.jpg)
- **Quality**: 85% compression
- **File Size**: < 500 KB (ideal: 100-200 KB)

**Automated Optimization**:

1. Place original images in a temporary folder
2. Run the optimization script:
   ```bash
   node optimize-images.js
   ```

**Manual Optimization** (using Sharp):

```javascript
const sharp = require('sharp');

sharp('original-image.jpg')
  .resize(1200, 800, { fit: 'cover', position: 'center' })
  .jpeg({ quality: 85, progressive: true })
  .toFile('optimized-image.jpg');
```

### 1.3 Organize Files

Create directory for the artwork:

```bash
mkdir -p assets/artworks/artwork-5
```

Move optimized images with proper naming:

```bash
# Format: {sequence}-{category}-{slug}.jpg
cp optimized-1.jpg assets/artworks/artwork-5/01-sketch-initial-concept.jpg
cp optimized-2.jpg assets/artworks/artwork-5/02-process-fabrication.jpg
cp optimized-3.jpg assets/artworks/artwork-5/03-process-assembly.jpg
cp optimized-4.jpg assets/artworks/artwork-5/04-detail-mechanism.jpg
cp optimized-5.jpg assets/artworks/artwork-5/05-final-exhibition.jpg
cp optimized-6.jpg assets/artworks/artwork-5/06-installation-gallery.jpg
```

**Naming Rules**:
- Sequence: `01`, `02`, `03` (two digits)
- Category: `sketch`, `process`, `installation`, `detail`, `final`, `context`
- Slug: lowercase, hyphen-separated, 1-3 words

---

## Step 2: Create Artwork Metadata

Prepare the following information:

### Required Fields

```javascript
{
  // Unique identifier (increment from last artwork)
  id: "artwork-5",

  // Bilingual titles
  titleZh: "作品中文标题",
  titleEn: "Artwork English Title",

  // Year of creation
  year: 2024,

  // Artist name
  artist: "Artist Name",

  // Background context (1-2 paragraphs)
  context: "Description of the artwork, its significance, and context...",

  // Primary image ID (usually the "final" image)
  primaryImageId: "img-5-5",

  // Images array (detailed in Step 3)
  images: [...]
}
```

### Image Metadata Template

For each image, prepare:

```javascript
{
  // Unique ID format: img-{artwork-num}-{sequence}
  id: "img-5-1",

  // Absolute path to image file
  url: "/assets/artworks/artwork-5/01-sketch-initial-concept.jpg",

  // Category (use IMAGE_CATEGORIES constant)
  category: IMAGE_CATEGORIES.SKETCH,

  // Display order (1, 2, 3, ...)
  sequence: 1,

  // Bilingual image titles
  titleZh: "初步概念草图",
  titleEn: "Initial Concept Sketch",

  // Image description/caption (50-100 words)
  caption: "Early exploration of the artistic concept, showing preliminary ideas about form, interaction, and materiality...",

  // Optional metadata
  metadata: {
    year: 2023,
    dimensions: "1200x800",
    medium: "Digital sketch",
    location: "Artist studio"  // For installation images
  }
}
```

---

## Step 3: Add Data to `js/data.js`

### 3.1 Open `js/data.js`

Locate the `artworks` array (around line 20).

### 3.2 Add Artwork Object

Insert new artwork at the end of the array:

```javascript
window.VULCA_DATA = {
  artworks: [
    // ... existing artworks (artwork-1 through artwork-4)

    // NEW ARTWORK
    {
      id: "artwork-5",
      titleZh: "机械诗意：协作绘画实验",
      titleEn: "Mechanical Poetry: Collaborative Drawing Experiment",
      year: 2024,
      artist: "Example Artist",
      context: "This artwork explores the intersection of human creativity and machine learning through a collaborative drawing system where artist and algorithm co-create visual narratives.",

      // Designate primary image (usually the "final" category)
      primaryImageId: "img-5-5",

      // Images array (5-10 images)
      images: [
        {
          id: "img-5-1",
          url: "/assets/artworks/artwork-5/01-sketch-initial-concept.jpg",
          category: IMAGE_CATEGORIES.SKETCH,
          sequence: 1,
          titleZh: "初步概念草图",
          titleEn: "Initial Concept Sketch",
          caption: "Early exploration of human-machine collaboration through drawing, showing preliminary ideas about the robotic drawing mechanism and interaction design.",
          metadata: {
            year: 2023,
            dimensions: "1200x800",
            medium: "Digital sketch"
          }
        },
        {
          id: "img-5-2",
          url: "/assets/artworks/artwork-5/02-process-fabrication.jpg",
          category: IMAGE_CATEGORIES.PROCESS,
          sequence: 2,
          titleZh: "制作过程：机械臂组装",
          titleEn: "Fabrication Process: Robotic Arm Assembly",
          caption: "Documentation of the custom robotic drawing arm being assembled in the studio, showing the technical development process.",
          metadata: {
            year: 2024,
            dimensions: "1200x800",
            medium: "Documentary photography"
          }
        },
        // ... continue for images 3-6
        {
          id: "img-5-5",
          url: "/assets/artworks/artwork-5/05-final-exhibition.jpg",
          category: IMAGE_CATEGORIES.FINAL,
          sequence: 5,
          titleZh: "最终作品：展览呈现",
          titleEn: "Final Artwork: Exhibition Presentation",
          caption: "The completed collaborative drawing as presented in the gallery, showcasing the visual outcome of human-machine creative dialogue.",
          metadata: {
            year: 2024,
            dimensions: "1200x800",
            medium: "Mixed media on paper",
            size: "150 x 100 cm"
          }
        }
      ]
    }
  ],
  // ... rest of data.js
};
```

### 3.3 Important Notes

**ID Format Rules**:
- Artwork ID: `artwork-{number}` (increment from last artwork)
- Image ID: `img-{artwork-num}-{sequence}` (e.g., `img-5-1`, `img-5-2`)

**Category Constants**:
Always use the `IMAGE_CATEGORIES` constant:
```javascript
IMAGE_CATEGORIES.SKETCH
IMAGE_CATEGORIES.PROCESS
IMAGE_CATEGORIES.INSTALLATION
IMAGE_CATEGORIES.DETAIL
IMAGE_CATEGORIES.FINAL
IMAGE_CATEGORIES.CONTEXT
```

**Primary Image**:
- Usually the "final" category image
- Must match one of the image IDs in the `images` array
- Used for thumbnails and social sharing

---

## Step 4: Add Critiques (Optional for Now)

If you have critiques ready, add them to the `critiques` array (around line 300):

```javascript
critiques: [
  // ... existing critiques

  // NEW CRITIQUES for artwork-5
  {
    artworkId: "artwork-5",
    personaId: "su-shi",  // Use existing persona IDs
    textZh: "评论中文内容...",
    textEn: "Critique English content...",
    rpait: { R: 8, P: 9, A: 7, I: 8, T: 6 }
  },
  // ... repeat for other personas
]
```

**Note**: You need critiques from all 6 personas for the artwork to appear complete.

---

## Step 5: Validation

### 5.1 Syntax Check

1. Save `js/data.js`
2. Open browser console
3. Check for JavaScript syntax errors

### 5.2 Data Validation

Create a validation test page (or use existing `test-image-compat.html`):

```javascript
// Validate artwork
const artwork = VULCA_DATA.artworks.find(a => a.id === 'artwork-5');

// Check required fields
console.assert(artwork.id, 'Artwork ID missing');
console.assert(artwork.titleZh && artwork.titleEn, 'Bilingual titles missing');
console.assert(artwork.year, 'Year missing');
console.assert(artwork.artist, 'Artist missing');

// Check images array
console.assert(Array.isArray(artwork.images), 'Images must be array');
console.assert(artwork.images.length >= 1 && artwork.images.length <= 10, 'Must have 1-10 images');

// Check each image
artwork.images.forEach((img, index) => {
  console.assert(img.id && img.id.match(/^img-\d+-\d+$/), `Image ${index}: Invalid ID format`);
  console.assert(img.url && img.url.startsWith('/assets/'), `Image ${index}: Invalid URL`);
  console.assert(['sketch','process','installation','detail','final','context'].includes(img.category), `Image ${index}: Invalid category`);
  console.assert(Number.isInteger(img.sequence), `Image ${index}: Sequence must be integer`);
  console.assert(img.titleZh && img.titleEn, `Image ${index}: Missing titles`);
});

// Check primary image
const primaryImg = artwork.images.find(img => img.id === artwork.primaryImageId);
console.assert(primaryImg, 'Primary image ID not found in images array');

console.log('✅ Validation passed for artwork-5');
```

### 5.3 Image Loading Check

1. Start local server:
   ```bash
   python -m http.server 9999
   ```

2. Open browser: `http://localhost:9999`

3. Check browser console for:
   - ✅ No 404 errors for images
   - ✅ `[Image Compat] Using images array for artwork-5 (X images)`
   - ✅ Artwork displays correctly

---

## Step 6: Testing

### 6.1 Visual Check

- [ ] All images load without errors
- [ ] Image sequence is correct
- [ ] Titles display in both languages
- [ ] Category badges show correct colors
- [ ] Metadata (artist, year) is accurate

### 6.2 Responsive Check

Test on multiple screen sizes:
- [ ] Mobile (375px width)
- [ ] Tablet (768px width)
- [ ] Desktop (1024px, 1440px width)

### 6.3 Cross-Browser Check

- [ ] Chrome/Edge 90+
- [ ] Firefox 88+
- [ ] Safari 14+

---

## Step 7: Deployment

### 7.1 Commit Changes

```bash
# Stage files
git add assets/artworks/artwork-5/
git add js/data.js

# Commit
git commit -m "feat: Add artwork-5 with 6-image series

- Artist: Example Artist
- Title: Mechanical Poetry: Collaborative Drawing Experiment
- Year: 2024
- Images: 6 (sketch → process → final → installation)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to GitHub
git push origin master
```

### 7.2 Verify Deployment

1. Wait 1-2 minutes for GitHub Pages to rebuild
2. Visit: `https://vulcaart.art`
3. Verify artwork displays correctly
4. Check browser console for errors

### 7.3 Cache Bypass (if needed)

If changes don't appear immediately:
```
https://vulcaart.art?nocache=1
```

---

## Troubleshooting

### Problem: Images not loading (404 errors)

**Solution**:
1. Check file paths match exactly (case-sensitive on Linux servers)
2. Verify files are in `assets/artworks/artwork-X/` directory
3. Ensure URLs in `data.js` start with `/assets/`
4. Check file names follow naming convention

### Problem: Artwork not appearing in gallery

**Solution**:
1. Check `data.js` syntax (no trailing commas, quotes matched)
2. Verify artwork object is inside `artworks` array
3. Check browser console for JavaScript errors
4. Ensure at least 1 image in `images` array

### Problem: Images displaying in wrong order

**Solution**:
1. Check `sequence` field values (should be 1, 2, 3, ...)
2. Verify no duplicate sequence numbers
3. Ensure sequences are integers, not strings

### Problem: Primary image not working

**Solution**:
1. Verify `primaryImageId` matches an image's `id` field exactly
2. Check for typos in image ID
3. If omitted, first image (lowest sequence) is used

---

## Quick Reference

### File Naming Pattern
```
{sequence}-{category}-{slug}.jpg

Examples:
01-sketch-initial-concept.jpg
02-process-fabrication.jpg
05-final-exhibition.jpg
```

### Image Categories
```javascript
IMAGE_CATEGORIES.SKETCH       // Conceptual drawings
IMAGE_CATEGORIES.PROCESS      // Work-in-progress
IMAGE_CATEGORIES.INSTALLATION // Exhibition setup
IMAGE_CATEGORIES.DETAIL       // Close-ups
IMAGE_CATEGORIES.FINAL        // Completed artwork
IMAGE_CATEGORIES.CONTEXT      // Supplementary materials
```

### ID Format
```javascript
// Artwork ID
id: "artwork-5"

// Image IDs
id: "img-5-1"  // artwork 5, image 1
id: "img-5-2"  // artwork 5, image 2
```

---

## Related Documentation

- **Technical Spec**: `openspec/changes/implement-multi-image-artwork-series/specs/multi-image-data-structure/spec.md`
- **File Organization**: `assets/artworks/README.md`
- **Developer Guide**: `CLAUDE.md`
- **Project Overview**: `README.md`

---

## Need Help?

- Check `CLAUDE.md` for developer guidance
- Review existing artworks in `js/data.js` as examples
- See `openspec/` for detailed specifications
- Contact: yuhaorui48@gmail.com

---

**Happy curating! 🎨**
