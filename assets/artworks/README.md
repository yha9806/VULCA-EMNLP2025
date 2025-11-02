# Artwork Images Organization

This directory contains all artwork images organized by artwork ID.

## Directory Structure

```
assets/artworks/
├── artwork-1/
│   ├── 01-final-drawing.jpg
│   ├── 02-process-collaboration.jpg
│   └── ...
├── artwork-2/
│   ├── 01-final-installation.jpg
│   └── ...
└── README.md (this file)
```

## File Naming Convention

All image files MUST follow this pattern:

```
{sequence}-{category}-{slug}.jpg
```

### Components

1. **Sequence**: Two-digit number (01, 02, 03, etc.)
   - Determines display order in carousel
   - Must start from 01
   - Must be unique within artwork

2. **Category**: One of the following:
   - `sketch` - Conceptual drawings, preliminary studies
   - `process` - Work-in-progress, creation documentation
   - `installation` - Exhibition setup, environmental context
   - `detail` - Close-up views, technical details
   - `final` - Completed artwork, final presentation
   - `context` - Supplementary materials, artist statements

3. **Slug**: Short descriptive name in kebab-case
   - Use lowercase letters
   - Separate words with hyphens
   - Keep it concise (1-3 words)

### Examples

✅ **Good**:
- `01-sketch-initial-concept.jpg`
- `02-process-robotic-training.jpg`
- `03-process-collaboration.jpg`
- `04-detail-mechanism.jpg`
- `05-final-drawing.jpg`
- `06-installation-vam.jpg`

❌ **Bad**:
- `1-sketch.jpg` (sequence must be two digits)
- `02_process_training.jpg` (use hyphens, not underscores)
- `03-Process-Collaboration.jpg` (use lowercase)
- `final-image.jpg` (missing sequence number)

## Image Specifications

All images SHOULD meet these requirements:

| Property | Requirement |
|----------|-------------|
| **Dimensions** | 1200 × 800 px (3:2 aspect ratio) |
| **Format** | JPEG (.jpg) |
| **Quality** | 85% compression |
| **File Size** | < 500 KB (target: 100-200 KB) |
| **Color Space** | sRGB |

### Optimization

Use the provided optimization script:

```bash
node optimize-images.js
```

Or manually with Sharp:

```javascript
const sharp = require('sharp');

sharp('input.jpg')
  .resize(1200, 800, { fit: 'cover', position: 'center' })
  .jpeg({ quality: 85, progressive: true })
  .toFile('output.jpg');
```

## Adding New Images

1. **Place image in correct directory**:
   ```bash
   cp new-image.jpg assets/artworks/artwork-1/03-process-training.jpg
   ```

2. **Optimize if needed**:
   ```bash
   node optimize-images.js
   ```

3. **Update data.js**:
   ```javascript
   {
     id: "img-1-3",
     url: "/assets/artworks/artwork-1/03-process-training.jpg",
     category: IMAGE_CATEGORIES.PROCESS,
     sequence: 3,
     titleZh: "机器学习训练过程",
     titleEn: "Machine Learning Training Process",
     caption: "Training the robotic arm to learn the artist's drawing gestures...",
     metadata: {
       year: 2022,
       dimensions: "1200x800",
       medium: "Digital photography"
     }
   }
   ```

4. **Test locally**:
   ```bash
   python -m http.server 9999
   # Visit http://localhost:9999
   ```

## Migration from Legacy Format

Images in `/assets/artwork-*.jpg` are the old single-image format.
They will be gradually migrated to this organized structure.

**Migration Checklist** per artwork:
- [ ] Create directory: `assets/artworks/artwork-X/`
- [ ] Copy legacy image: `assets/artwork-X.jpg` → `assets/artworks/artwork-X/01-final-{slug}.jpg`
- [ ] Add new images (02, 03, etc.)
- [ ] Update `data.js` to use `images` array
- [ ] Verify carousel displays correctly
- [ ] (Optional) Remove legacy `assets/artwork-X.jpg` after confirming

## Reference

For complete documentation, see:
- `docs/ADDING_ARTWORKS.md` - Full workflow guide
- `openspec/changes/implement-multi-image-artwork-series/specs/multi-image-data-structure/spec.md` - Technical specification
- `CLAUDE.md` - Developer guide

---

**Last Updated**: 2025-11-02
**Maintained By**: VULCA Project Team
