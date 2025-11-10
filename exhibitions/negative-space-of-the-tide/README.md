# 潮汐的负形 / Negative Space of the Tide

**Exhibition ID**: `negative-space-of-the-tide`
**Year**: 2025
**Status**: live

## Overview

一场关于人工智能与艺术创作的深度对话，通过6位来自不同文化背景的评论家视角，探索机器创造力的本质。

An in-depth dialogue on AI and artistic creation, exploring the nature of machine creativity through the perspectives of 6 critics from diverse cultural backgrounds.

## Contents

- **Artworks**: 4
- **Personas**: 7
- **Dialogues**: 4
- **Messages**: 4

## Features

- dialogue-player
- image-carousel
- rpait-visualization
- knowledge-base-references

## Theme

- **Primary Color**: `#B85C3C`
- **Accent Color**: `#D4A574`

## Files

- `config.json` - Exhibition configuration and metadata
- `data.json` - Artworks, personas, and critiques data
- `dialogues.json` - Dialogue messages (⚠️ currently placeholder data)
- `index.html` - Exhibition page
- `assets/` - Exhibition-specific media files

## Validation

```bash
npm run validate-exhibition negative-space-of-the-tide
```

## Assets Needed

- [ ] `assets/cover.jpg` (1200x800px, <500KB)
- [ ] `assets/og-image.jpg` (1200x630px)
- [ ] Copy artwork images from `/assets/artworks/`

## Next Steps

1. **Update dialogues.json** with actual dialogue data from:
   - `js/data/dialogues/artwork-1.js`
   - `js/data/dialogues/artwork-2.js`
   - `js/data/dialogues/artwork-3.js`
   - `js/data/dialogues/artwork-4.js`

2. **Copy assets**:
   ```bash
   cp assets/og-image.jpg exhibitions/negative-space-of-the-tide/assets/
   # Create or copy cover image
   ```

3. **Validate**:
   ```bash
   npm run validate-exhibition negative-space-of-the-tide
   ```

4. **Test locally**:
   ```bash
   python -m http.server 9999
   # Visit http://localhost:9999/exhibitions/negative-space-of-the-tide/
   ```

## Migration Notes

This exhibition was migrated from the original single-page structure on 2025-11-10T21:43:00.384Z.

Original files:
- `index.html` (root)
- `js/data.js`
- `js/data/dialogues/*.js`

Migration script: `scripts/migrate-current-exhibition.js`
