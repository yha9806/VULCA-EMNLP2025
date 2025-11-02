# Proposal: Enhance Artwork Display with Images and Enriched Critical Commentary

## Why

The exhibition platform currently lacks key visual and textual elements:

1. **Missing Artwork Images**: Referenced in data.js but not present in assets/
   - Users cannot see the actual artworks they're reading critiques about
   - Visual engagement is critical for immersive art experience
   - All 4 Sougwen Chung works need proper high-quality images

2. **Underdeveloped Critique Text**:
   - Current critiques are adequate but lack depth and nuance
   - Different personas need more distinctive voices and perspectives
   - Need stronger art-historical and philosophical argumentation
   - RPAIT dimensions could be better reflected in text

3. **Incomplete Art Context**:
   - Artist bios and work descriptions are minimal
   - Persona backgrounds lack sufficient context for readers
   - Cross-references between artworks missing

## Summary

Obtain high-quality images of 4 Sougwen Chung artworks and significantly expand/improve the 24 critique texts to deepen cultural analysis while maintaining distinct persona voices and strengthening philosophical argumentation.

**Change ID:** `enhance-artwork-display-and-critiques`

**Scope:**
- Acquire/verify artwork images for 4 Sougwen Chung pieces
- Create `/assets/` directory structure
- Expand existing 24 critiques by 40-60% in length
- Enhance quality: deeper analysis, stronger argumentation, persona-specific voices
- Improve persona biographies for better context

---

## What Changes

### Files Created
- `/assets/artwork-1.jpg` - Memory (Painting Operation Unit: Second Generation) - 2022
- `/assets/artwork-2.jpg` - Painting Operation Unit: First Generation (Imitation) - 2015
- `/assets/artwork-3.jpg` - All Things in All Things - 2018
- `/assets/artwork-4.jpg` - Exquisite Dialogue: Sepals, Petals, Thorns - 2020

### Files Modified
- `js/data.js`:
  - Expand all 24 critique texts (textZh + textEn)
  - Enhance persona bios with more context
  - Possibly adjust RPAIT scores to better reflect enriched analysis
  - Add artwork artist notes and contextual metadata

### Expected Changes
- Each critique expands from ~100-150 words to ~200-250 words
- Persona voices become more distinctive and authentic
- Philosophical depth increases
- Art-historical references become more specific

---

## Success Criteria

- ✅ All 4 artwork images display correctly in gallery
- ✅ Each critique expanded by 40-60% with maintained quality
- ✅ 6 distinct persona voices clearly evident across all critiques
- ✅ Enhanced philosophical and analytical depth
- ✅ Art-historical references grounded in each persona's tradition
- ✅ Persona bios provide sufficient context for understanding perspective
- ✅ RPAIT dimensions reflected in textual analysis when relevant
- ✅ No visual artifacts or loading errors
- ✅ Page layout adapts properly to image sizes

---

## Architectural Decisions

See `design.md` for discussion on:
- Image acquisition strategy (original artworks vs. documentation)
- Persona voice differentiation approach
- Expansion strategy for critique texts
- RPAIT score alignment with enriched text
- Responsive image sizing across breakpoints

---

## Dependencies & Sequencing

**Phase 1** (Images & Content Foundation):
1. Locate/acquire high-quality images of 4 Sougwen Chung artworks
2. Create `/assets/` directory and place images
3. Test image loading in carousel

**Phase 2** (Content Enrichment):
1. Expand each critique by 40-60%
2. Strengthen persona voices
3. Add deeper art-historical analysis

**Phase 3** (Polish & Validation):
1. Refine language and flow
2. Ensure consistency across personas
3. Validate against RPAIT framework
4. Test responsive display

---

## Related Changes

- `fix-homepage-display-and-interaction` - Provides the carousel infrastructure for displaying enhanced content
- `immersive-autoplay-with-details` - Earlier attempt at detailed artwork presentation

---

## Technical Notes

### Image Requirements
- Format: JPG or PNG
- Resolution: 1200x800px minimum for desktop, optimized for responsive display
- File size: <500KB each for web performance
- Aspect ratio: Landscape oriented (3:2 or 16:10)

### Content Expansion Strategy
- Phase 2a: Expand with persona-specific analytical frameworks
  - Su Shi: Literati painting philosophy + poetic observation
  - Guo Xi: Formal composition principles + landscape theory
  - John Ruskin: Moral aesthetics + social commentary
  - Mama Zola: Community narrative + oral tradition framing
  - Professor Petrova: Formalist analysis + structural critique
  - AI Ethics: Technological + philosophical implications

### Expected Output
- 24 critiques (4 artworks × 6 personas)
- Average length increase: 100 → 150-160 words
- Total text volume increase: ~2,400 → ~3,600 words (50% growth)

---

## Questions for Stakeholder Review

1. Should we use official Sougwen Chung artwork images or documentation photographs?
2. Are there specific art-historical sources you want referenced in expanded critiques?
3. Should RPAIT scores be adjusted after enriching the analysis?
4. Priority: image quality vs. quick turnaround?
5. Any specific tone/perspective adjustments desired for any persona?
