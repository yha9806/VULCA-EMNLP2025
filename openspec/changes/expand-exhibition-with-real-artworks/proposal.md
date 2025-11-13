# Proposal: Expand Exhibition with Real Artworks

**Change ID:** `expand-exhibition-with-real-artworks`
**Status:** Draft
**Author:** Yu Haorui
**Date:** 2025-11-12
**Target Version:** 4.0.0

---

## What Changes

Replace the 4 demo artworks (Sougwen Chung works) in the "Negative Space of the Tide" exhibition with 38 real artworks from the "Congsheng Cross-Strait Education Biennial" exhibition, rename the exhibition, and generate corresponding critique data.

**Key Changes:**
1. **Delete demo content**: Remove 4 Sougwen Chung artworks and 24 associated critiques from `/exhibitions/negative-space-of-the-tide/data.json`
2. **Rename exhibition**: Update exhibition title from "潮汐的负形" (Negative Space of the Tide) to "丛生：两岸教育双年展——沉思之胃" (Congsheng: Cross-Strait Education Biennial - Stomach of Contemplation)
3. **Add real artworks**: Integrate 38 artworks from the PPT file `丛生--沉思之胃 人员作品.pptx` (5 already extracted in congsheng-2025, 33 new)
4. **Migrate images**: Move 97 images from `/exhibitions/congsheng-2025/assets/artworks/` to `/assets/artworks/`
5. **Generate critiques**: Create 228 critiques (38 artworks × 6 critics) using LLM + knowledge base
6. **Update metadata**: Update config.json, API registration, and cover images

**Affected Files:**
- `/exhibitions/negative-space-of-the-tide/config.json`
- `/exhibitions/negative-space-of-the-tide/data.json` (major rewrite)
- `/api/exhibitions.json`
- `/assets/artworks/` (97 new images)
- `/exhibitions/congsheng-2025/` (deprecate after migration)

---

## Why

### Problem Statement

The current "Negative Space of the Tide" exhibition contains **demo/template data** that was created for technical validation:
- 4 artworks by Sougwen Chung (AI-robotic art)
- 24 critiques (4 artworks × 6 critics)
- Placeholder content waiting for real exhibition data

**User's Intent (from Message 4):**
> "其实目前这个展览的内容就是一个模板和技术验证，正在等着正式的作品添加进来，这个ppt就是我们的作品。"

The PPT file `丛生--沉思之胃 人员作品.pptx` contains the **real exhibition content**:
- 38 artworks from 10 institutions (中央美术学院, 台湾师范大学, etc.)
- 36 artists
- 97 images
- Complete artwork metadata (titles, artists, institutions, media)

### Context

**Previous Work:**
- **Phase 1 (Session 1):** Created new exhibition `congsheng-2025` with 5 AI/tech artworks
- **Audit (Session 1):** Identified architecture mismatch between exhibitions
- **Strategy Shift (Message 4):** User clarified should **expand existing exhibition**, not create new one

**Current State:**
- `negative-space-of-the-tide/data.json`: 4 demo artworks, 24 critiques
- `congsheng-2025/data.json`: 5 real artworks (extracted, needs migration)
- `scripts/exhibition-artworks-structured.json`: 33 artworks pending data entry
- `exhibitions/congsheng-2025/assets/artworks/`: 97 images extracted

**Why Replace vs. Append:**
- Keeps exhibition content clean and focused
- Avoids mixing demo data with real artworks
- Real exhibition deserves its own identity (not labeled as "Negative Space")
- 38 artworks is sufficient for a complete exhibition (42 would be excessive)

### Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Data loss** (deleting Sougwen works) | Medium | Backup original data.json before deletion |
| **Image path conflicts** | Medium | Validate all image URLs before deployment |
| **Critique quality** (LLM-generated) | High | Manual review of generated critiques, validate RPAIT scores |
| **Exhibition identity confusion** | Low | Clear documentation of the rename and migration |
| **Architecture mismatch** (congsheng uses template-driven HTML) | Low | congsheng-2025 will be deprecated, use negative-space architecture |

---

## How

### High-Level Approach

**3-Phase Implementation:**

1. **Phase 1: Data Migration (6.5-8.5 hours)**
   - Backup original data
   - Delete demo artworks and critiques
   - Migrate 5 completed artworks from congsheng-2025
   - Add remaining 33 artworks data
   - Move 97 images to root assets directory

2. **Phase 2: Critique Generation (15-20 hours)**
   - Generate 228 critiques using LLM + knowledge base
   - Apply consistent RPAIT scoring
   - Human review and adjustment

3. **Phase 3: Configuration & Metadata (30 minutes)**
   - Update config.json with new title and stats
   - Update API registration
   - Create new cover image

### Data Structure Preservation

**Artwork Object (unchanged structure):**
```json
{
  "id": "artwork-1",
  "titleZh": "作品中文标题",
  "titleEn": "Artwork English Title",
  "year": 2024,
  "artist": "艺术家姓名",
  "imageUrl": "/assets/artwork-1.jpg",
  "primaryImageId": "img-1-1",
  "context": "English context description...",
  "images": [
    {
      "id": "img-1-1",
      "url": "/assets/artworks/artwork-1/01.jpg",
      "sequence": 1,
      "titleZh": "图片标题",
      "titleEn": "Image Title"
    }
  ]
}
```

**Critique Object (unchanged structure):**
```json
{
  "artworkId": "artwork-1",
  "personaId": "su-shi",
  "textZh": "评论中文内容...",
  "textEn": "Critique English text...",
  "rpait": {
    "R": 7,
    "P": 9,
    "A": 8,
    "I": 8,
    "T": 6
  }
}
```

### LLM-Assisted Critique Generation

**Workflow:**
1. Read artwork metadata (title, artist, medium, year)
2. Read critic knowledge base (`knowledge-base/critics/[critic-id]/`)
3. Construct prompt with artwork info + critic style
4. Generate Chinese critique (1000-1500 characters)
5. Generate English critique (1000-1500 characters)
6. Assign RPAIT scores (manual review)
7. Validate and save to data.json

**Tools:**
- Claude 3.5 Sonnet or GPT-4
- Existing knowledge base (6 critics, ~300 references)
- Batch processing (1 artwork × 6 critics at a time)

### Image Migration Strategy

**Source:** `/exhibitions/congsheng-2025/assets/artworks/artwork-[slide]-[artist]/[序号].[ext]`
**Target:** `/assets/artworks/artwork-[id]/[序号].[ext]`

**Steps:**
1. Create target directories: `/assets/artworks/artwork-1/` through `artwork-38/`
2. Copy images from congsheng-2025 to target directories
3. Rename directories to match new artwork IDs (artwork-84 → artwork-1, etc.)
4. Update all `images[].url` fields in data.json
5. Validate all image paths exist

### Rollback Plan

**If issues occur:**
1. Restore backup of `negative-space-of-the-tide/data.json`
2. Revert config.json and API changes
3. Keep congsheng-2025 exhibition intact (no deletion until migration complete)

---

## Success Criteria

### Functional Requirements

- [ ] All 4 Sougwen artworks deleted from data.json
- [ ] All 24 Sougwen critiques deleted from data.json
- [ ] 38 new artworks added with complete metadata
- [ ] 228 new critiques generated (38 × 6 critics)
- [ ] All 97 images accessible at correct paths
- [ ] Exhibition title updated to "丛生：两岸教育双年展——沉思之胃"
- [ ] API registration updated with new stats

### Quality Requirements

- [ ] All artwork objects follow existing structure (no schema changes)
- [ ] All critique objects follow existing structure
- [ ] All RPAIT scores in valid range (1-10)
- [ ] Chinese critiques: 1000-1500 characters each
- [ ] English critiques: 1000-1500 characters each
- [ ] All image URLs resolve (no 404 errors)
- [ ] Placeholder system works for missing images

### Testing Requirements

- [ ] Local server test: `http://localhost:9999/exhibitions/negative-space-of-the-tide/`
- [ ] Artwork grid displays 38 artworks
- [ ] Image carousel loads for each artwork
- [ ] Critique panel shows 6 critics per artwork
- [ ] RPAIT radar chart renders correctly
- [ ] Language switch (中/EN) works for all text
- [ ] Responsive design verified (375px, 768px, 1024px)

---

## Open Questions

1. **Dialogue data**: Should we generate dialogue data (Phase 4) or leave dialogues.json empty?
   - **Recommendation:** Leave empty, implement in separate change
   - **Reason:** 760 messages (38 × ~20) is ~8-10 hours additional work

2. **Cover image**: Which artwork should be featured on the cover?
   - **Recommendation:** Use artwork-84 (VULCA platform) as it's meta and well-documented
   - **Alternative:** User selects preferred artwork

3. **Congsheng-2025 directory**: Delete after migration or keep as archive?
   - **Recommendation:** Keep as archive, mark as deprecated in README
   - **Reason:** Preserves extraction work and scripts

4. **Exhibition slug**: Keep `negative-space-of-the-tide` slug or change to `congsheng-2025`?
   - **Recommendation:** Keep slug (URL stability), only change title/metadata
   - **Reason:** Avoids breaking existing links, simpler migration

---

## Dependencies

**Depends On:**
- Knowledge base system (already complete: 6 critics, ~300 references)
- Placeholder image system (already implemented)
- Multi-image support system (already implemented)

**Blocks:**
- Dialogue data generation (can be done later)
- Exhibition cover image creation (can use placeholder initially)

**Related Changes:**
- None (this is first major data expansion)

---

## Estimated Effort

| Phase | Tasks | Estimated Time |
|-------|-------|---------------|
| **Phase 1: Data Migration** | Delete demo data, migrate 5 artworks, add 33 artworks, move images | 6.5-8.5 hours |
| **Phase 2: Critique Generation** | Generate 228 critiques using LLM + knowledge base | 15-20 hours |
| **Phase 3: Configuration** | Update config, API, cover image | 30 minutes |
| **Testing & Validation** | Full system test, responsive test, QA | 2-3 hours |
| **Total** | | **24-32 hours** |

**Phased Delivery:**
- **Milestone 1 (Phase 1):** Artworks visible, placeholders for missing images (~8 hours)
- **Milestone 2 (Phase 2):** Critiques complete, RPAIT visualization works (~20 hours)
- **Milestone 3 (Phase 3):** Metadata finalized, exhibition fully functional (~30 min)

---

## References

- **Strategy Document:** `EXHIBITION_EXPANSION_STRATEGY.md`
- **Audit Report:** `CONGSHENG_EXHIBITION_AUDIT_REPORT.md`
- **Phase 1 Summary:** `CONGSHENG_PHASE1_COMPLETE.md`
- **Extracted Data:** `scripts/exhibition-artworks-structured.json` (38 artworks)
- **Extracted Images:** `exhibitions/congsheng-2025/assets/artworks/` (97 images)
- **Original PPT:** `丛生--沉思之胃 人员作品.pptx`
