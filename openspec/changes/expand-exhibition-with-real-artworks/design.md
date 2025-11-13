# Design Document: Expand Exhibition with Real Artworks

**Change ID:** `expand-exhibition-with-real-artworks`
**Author:** Yu Haorui
**Date:** 2025-11-12

---

## Design Overview

This change transforms the "Negative Space of the Tide" exhibition from a technical demo with 4 sample artworks to a full-scale exhibition with 38 real artworks from the "Congsheng Cross-Strait Education Biennial."

**Core Design Principle:** Preserve existing architecture and components, only replace data content.

---

## Architectural Decisions

### 1. Expand Existing Exhibition vs. Create New Exhibition

**Decision:** Expand existing `negative-space-of-the-tide` exhibition.

**Alternatives Considered:**
- **Option A:** Create new `congsheng-2025` exhibition (already started in Phase 1)
- **Option B:** Expand existing `negative-space-of-the-tide` exhibition (chosen)

**Rationale:**
- User explicitly clarified in Message 4: "直接在潮汐负形的数据库里面添加这些作品的数据"
- `negative-space-of-the-tide` uses battle-tested standalone HTML architecture (467 lines, 30+ JS files)
- `congsheng-2025` uses unfinished template-driven architecture (exhibition-loader.js not fully implemented)
- Avoids architecture mismatch issues identified in audit
- Simpler deployment (no new exhibition setup needed)

**Trade-offs:**
- ✅ **Pros:** Stable architecture, faster implementation, proven components
- ❌ **Cons:** Lose "Negative Space" branding, URL slug stays the same

---

### 2. Delete Demo Artworks vs. Append Real Artworks

**Decision:** Delete all 4 Sougwen Chung artworks and replace with 38 real artworks.

**Alternatives Considered:**
- **Option A:** Delete demo data, add real data (chosen)
- **Option B:** Keep demo data, append real data (42 total artworks)

**Rationale:**
- Demo artworks are explicitly labeled as "template/validation data" by user
- Real exhibition deserves its own identity
- 42 artworks would be excessive for single exhibition
- Mixing demo + real data causes content confusion
- Cleaner data structure

**Trade-offs:**
- ✅ **Pros:** Clean data, focused exhibition, clear identity
- ❌ **Cons:** Lose Sougwen demo data (can backup)

---

### 3. Image Migration Strategy

**Decision:** Move all images from `exhibitions/congsheng-2025/assets/` to root `/assets/artworks/`.

**Alternatives Considered:**
- **Option A:** Keep images in congsheng-2025, use relative paths
- **Option B:** Move to root `/assets/artworks/` (chosen)
- **Option C:** Duplicate images in both locations

**Rationale:**
- Root `/assets/` is standard location for exhibition-independent resources
- `negative-space-of-the-tide` expects images at `/assets/artworks/artwork-[id]/`
- Avoids cross-exhibition path dependencies
- Placeholder system already supports root paths

**Implementation Details:**
```
Source: /exhibitions/congsheng-2025/assets/artworks/artwork-[slide]-[artist]/[序号].[ext]
Target: /assets/artworks/artwork-[id]/[序号].[ext]

Renaming:
  artwork-84-于浩睿/ → artwork-1/
  artwork-80-王歆童/ → artwork-2/
  artwork-82-电子果酱/ → artwork-3/
  artwork-65-李國嘉/ → artwork-4/
  artwork-60-程佳瑜/ → artwork-5/
  ...
```

**Trade-offs:**
- ✅ **Pros:** Standard location, independent paths, works with placeholder system
- ❌ **Cons:** Image duplication during transition (delete congsheng copy after migration)

---

### 4. Critique Generation Method

**Decision:** Use LLM (Claude 3.5 Sonnet) + existing knowledge base for critique generation.

**Alternatives Considered:**
- **Option A:** Manual writing (too time-consuming)
- **Option B:** Template-based generation (lacks depth)
- **Option C:** LLM + knowledge base (chosen)
- **Option D:** Fine-tuned model (overkill for this use case)

**Rationale:**
- Knowledge base already complete (6 critics, ~300 references)
- LLM can generate high-quality, culturally-informed critiques
- Consistent with existing critique style and length (1000-1500 characters)
- Human review ensures RPAIT score accuracy

**Prompt Template Structure:**
```
System: You are [评论家名字], a [时代/背景] art critic.

Context:
- Artwork: [标题] by [艺术家], [年份]
- Medium: [媒介]
- Description: [描述]

Your Style:
[从知识库读取评论家风格特征]

Your Core Principles:
[从知识库读取5个核心原则]

Task:
Generate a 1000-1500 character critique in Chinese and English.
Apply RPAIT dimensions:
- R (Representation): [定义]
- P (Philosophicality): [定义]
- A (Aesthetics): [定义]
- I (Identity): [定义]
- T (Tradition): [定义]

Output Format:
{
  "textZh": "...",
  "textEn": "...",
  "rpait": {
    "R": 7,
    "P": 9,
    "A": 8,
    "I": 8,
    "T": 6
  }
}
```

**Quality Control:**
- Generate in batches (1 artwork × 6 critics at a time)
- Human review of RPAIT scores
- Consistency check across critiques
- Length validation (1000-1500 chars)

**Trade-offs:**
- ✅ **Pros:** Fast, scalable, high quality, leverages existing knowledge base
- ❌ **Cons:** Requires LLM API access, manual review needed

---

### 5. Exhibition Renaming Strategy

**Decision:** Update title/metadata but keep slug `negative-space-of-the-tide`.

**Alternatives Considered:**
- **Option A:** Change slug to `congsheng-2025` (breaks URLs)
- **Option B:** Keep slug, update title/metadata (chosen)

**Rationale:**
- URL stability (slug change breaks existing links)
- Simpler migration (no directory rename)
- Slug is internal identifier, title is user-facing
- GitHub Pages deployment simpler

**Changes Required:**
```json
// config.json
{
  "titleZh": "丛生：两岸教育双年展——沉思之胃",
  "titleEn": "Congsheng: Cross-Strait Education Biennial - Stomach of Contemplation",
  "stats": {
    "artworks": 38,
    "personas": 6
  }
}

// api/exhibitions.json
{
  "id": "negative-space-of-the-tide",
  "titleZh": "丛生：两岸教育双年展——沉思之胃",
  "titleEn": "Congsheng: Cross-Strait Education Biennial - Stomach of Contemplation",
  "stats": {
    "artworks": 38
  }
}
```

**Trade-offs:**
- ✅ **Pros:** URL stability, simpler migration, no link breakage
- ❌ **Cons:** Slug-title mismatch (acceptable in this context)

---

### 6. Data Structure Preservation

**Decision:** Use existing artwork and critique schemas without modification.

**Rationale:**
- Existing components expect specific data structure
- No need to change schema for content update
- Reduces risk of breaking existing features
- Proven structure works with all visualization components

**Preserved Structures:**
```json
// Artwork schema (unchanged)
{
  "id": "artwork-1",
  "titleZh": "...",
  "titleEn": "...",
  "year": 2024,
  "artist": "...",
  "imageUrl": "...",
  "primaryImageId": "...",
  "context": "...",
  "images": [...]
}

// Critique schema (unchanged)
{
  "artworkId": "artwork-1",
  "personaId": "su-shi",
  "textZh": "...",
  "textEn": "...",
  "rpait": {
    "R": 7,
    "P": 9,
    "A": 8,
    "I": 8,
    "T": 6
  }
}
```

**Excluded Fields from congsheng-2025:**
- `artistEn` (not in original schema)
- `institution` (not in original schema)
- `medium` (not in original schema)
- `contextZh` (original uses English-only context)

**Trade-offs:**
- ✅ **Pros:** Zero component changes, guaranteed compatibility
- ❌ **Cons:** Lose some metadata fields (acceptable, can add later if needed)

---

### 7. Phased Implementation

**Decision:** 3-phase implementation with clear milestones.

**Phase Breakdown:**

**Phase 1: Data Migration (Milestone 1)**
- Delete demo artworks
- Migrate 5 completed artworks from congsheng-2025
- Add 33 new artworks data
- Move 97 images to root assets
- **Deliverable:** Artworks visible with placeholder system

**Phase 2: Critique Generation (Milestone 2)**
- Generate 228 critiques using LLM
- Human review and adjustment
- **Deliverable:** Full critique system functional

**Phase 3: Configuration (Milestone 3)**
- Update config.json and API
- Create cover image
- **Deliverable:** Exhibition fully functional

**Rationale:**
- Incremental delivery provides visible progress
- Each phase independently testable
- Can pause between phases if needed
- User can validate each milestone

**Trade-offs:**
- ✅ **Pros:** Clear progress tracking, flexible scheduling, early validation
- ❌ **Cons:** More coordination overhead (minimal in this case)

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Source Data                                                  │
├─────────────────────────────────────────────────────────────┤
│ 1. exhibitions/congsheng-2025/data.json (5 artworks)       │
│ 2. scripts/exhibition-artworks-structured.json (33 more)   │
│ 3. exhibitions/congsheng-2025/assets/ (97 images)          │
│ 4. knowledge-base/critics/ (6 critics, 300+ references)    │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ Phase 1: Data Migration                                      │
├─────────────────────────────────────────────────────────────┤
│ 1. Backup negative-space-of-the-tide/data.json             │
│ 2. Delete 4 demo artworks + 24 critiques                   │
│ 3. Transform & merge artwork data                          │
│ 4. Move images to /assets/artworks/                        │
│ 5. Update image paths in artwork objects                   │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ Phase 2: Critique Generation                                 │
├─────────────────────────────────────────────────────────────┤
│ For each artwork (38):                                      │
│   For each critic (6):                                      │
│     1. Read artwork metadata                                │
│     2. Read critic knowledge base                           │
│     3. Construct LLM prompt                                 │
│     4. Generate Chinese critique (1000-1500 chars)         │
│     5. Generate English critique (1000-1500 chars)         │
│     6. Assign RPAIT scores                                  │
│     7. Human review                                         │
│     8. Append to critiques array                           │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ Phase 3: Configuration & Metadata                            │
├─────────────────────────────────────────────────────────────┤
│ 1. Update config.json (title, stats)                       │
│ 2. Update api/exhibitions.json                              │
│ 3. Create cover image                                       │
│ 4. Update README if needed                                  │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ Final Output                                                 │
├─────────────────────────────────────────────────────────────┤
│ exhibitions/negative-space-of-the-tide/                     │
│ ├── config.json (updated)                                   │
│ ├── data.json (38 artworks, 228 critiques)                 │
│ ├── dialogues.json (empty, Phase 4 later)                  │
│ └── index.html (unchanged)                                  │
│                                                              │
│ assets/artworks/                                             │
│ ├── artwork-1/ (2 images)                                   │
│ ├── artwork-2/ (5 images)                                   │
│ └── ... (artwork-38)                                        │
│                                                              │
│ api/exhibitions.json (updated)                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Compatibility

### Unchanged Components

These components continue to work without modification:

1. **Gallery Hero (js/gallery-hero.js)**
   - Reads `artworks[]` array
   - Displays artwork image carousel
   - Placeholder system handles missing images

2. **RPAIT Radar (js/visualizations/rpait-radar.js)**
   - Reads `critiques[]` array
   - Calculates average RPAIT scores per critic
   - Renders radar chart

3. **Persona Matrix (js/visualizations/persona-matrix.js)**
   - Reads `critiques[]` array grouped by persona
   - Displays comparison matrix

4. **Dialogue Player (js/components/dialogue-player.js)**
   - Reads `dialogues.json`
   - Empty file is valid (no errors)

5. **Language System (shared/js/language-manager.js)**
   - Switches between `textZh` and `textEn` fields
   - Works with any data structure containing these fields

### Validation Points

**Before Deployment:**
- [ ] All artwork IDs unique (artwork-1 through artwork-38)
- [ ] All primaryImageId references exist in images[] array
- [ ] All image URLs resolve (or placeholder displays)
- [ ] All critiques have valid artworkId references
- [ ] All critiques have valid personaId references
- [ ] All RPAIT scores in range 1-10
- [ ] All textZh fields 1000-1500 characters
- [ ] All textEn fields 1000-1500 characters
- [ ] config.json stats.artworks = 38
- [ ] config.json stats.personas = 6

---

## Risk Mitigation

### Data Loss Prevention

1. **Backup Strategy:**
   ```bash
   cp exhibitions/negative-space-of-the-tide/data.json \
      exhibitions/negative-space-of-the-tide/data.json.backup-2025-11-12
   ```

2. **Git Commit Before Deletion:**
   ```bash
   git add exhibitions/negative-space-of-the-tide/data.json
   git commit -m "backup: Preserve demo artworks before migration"
   ```

3. **Keep congsheng-2025 intact until migration complete**

### Quality Assurance

1. **Automated Validation:**
   - JSON schema validation
   - Required field checks
   - ID uniqueness checks
   - Reference integrity checks

2. **Manual Review:**
   - Visual inspection of artwork grid
   - Spot-check 5 artworks × 6 critiques = 30 critiques
   - RPAIT score reasonableness
   - Language quality (grammar, coherence)

3. **Regression Testing:**
   - All existing features still work
   - No console errors
   - No 404 image errors (or placeholders display)
   - Responsive design intact

### Rollback Plan

**If critical issues found:**
1. Restore `data.json.backup-2025-11-12`
2. Revert config.json changes
3. Revert API registration changes
4. Keep exhibition in demo state temporarily
5. Debug issues offline
6. Retry migration when ready

---

## Performance Considerations

### Data Size

**Before:**
- data.json: ~63KB (4 artworks, 24 critiques)
- Images: 0 (using external URLs)

**After:**
- data.json: ~350KB estimated (38 artworks, 228 critiques)
- Images: ~67MB (97 images, ~700KB average)

**Impact:**
- Minimal impact on load time (JSON gzipped, images lazy-loaded)
- GitHub Pages handles up to 1GB per site (well within limit)

### LLM Generation Cost

**Estimated API Costs:**
- 228 critiques × 2 (Chinese + English) = 456 generations
- Average prompt: ~1000 tokens
- Average output: ~1500 tokens
- Total tokens: ~1,140,000 tokens
- Estimated cost: $10-20 (Claude 3.5 Sonnet)

---

## Security Considerations

### Content Safety

- All artwork data from trusted source (official exhibition PPT)
- No user-generated content
- No external API calls in production
- Images stored locally (no external dependencies)

### Data Privacy

- No personal data collected
- No tracking cookies
- Static site (no database, no server-side processing)

---

## Future Considerations

### Dialogue Data Generation (Phase 4)

**Deferred to separate change:**
- 38 artworks × ~20 messages = ~760 messages
- Estimated effort: 8-10 hours
- Can be implemented after core exhibition functional

**Design note:**
- Same LLM + knowledge base approach
- Message structure already defined
- Continuous dialogue format (Phase 2 transformation)

### Knowledge Base References

**Deferred to separate change:**
- Add `references[]` field to critique objects
- Link critiques to specific knowledge base sources
- Requires additional metadata extraction

### Multi-Exhibition Platform

**Already supported:**
- `/api/exhibitions.json` manages multiple exhibitions
- Portfolio homepage displays all exhibitions
- This change demonstrates scalability

---

## Conclusion

This design balances:
- **Speed:** Reuse existing architecture, minimal changes
- **Quality:** LLM + knowledge base ensures high-quality critiques
- **Safety:** Backup strategy, phased implementation, rollback plan
- **Scalability:** Proven architecture supports 38 artworks (9.5× increase)

The approach is conservative (preserve architecture) while achieving the user's goal (replace demo with real content).
