# 测试展览 / Test Exhibition

**Exhibition ID**: `test-exhibit`
**Year**: 2025
**Status**: Upcoming

## Overview

(Add exhibition overview here)

## Contents

- **Artworks**: 3
- **Personas**: 4

## Files

- `config.json` - Exhibition configuration and metadata
- `data.json` - Artworks, personas, and critiques data
- `dialogues.json` - Dialogue messages
- `assets/` - Exhibition-specific media files

## Next Steps

1. Add cover image to `assets/cover.jpg` (1200x800px, <500KB)
2. Add OG image to `assets/og-image.jpg` (1200x630px)
3. Fill in artwork data in `data.json`
4. Fill in persona data in `data.json`
5. Fill in critique data in `data.json`
6. Create dialogue messages in `dialogues.json`
7. Run validation: `npm run validate-exhibition test-exhibit`
8. Update API: `npm run generate-api`

## Validation

```bash
npm run validate-exhibition test-exhibit
```

## Documentation

See `/CLAUDE.md` for complete exhibition management guide.
