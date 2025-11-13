# Tasks: Expand Exhibition with Real Artworks

**Change ID:** `expand-exhibition-with-real-artworks`
**Status:** Draft
**Total Estimated Time:** 24-32 hours

---

## Phase 1: Data Migration & Preparation (6.5-8.5 hours)

### Task 1.1: Backup Original Data (5 minutes)

**Objective:** Preserve demo artworks before deletion

**Steps:**
- [ ] Copy `exhibitions/negative-space-of-the-tide/data.json` to `data.json.backup-2025-11-12`
- [ ] Verify backup file exists and is readable
- [ ] Git commit backup: `git add . && git commit -m "backup: Preserve demo artworks before migration"`

**Success Criteria:**
- Backup file created
- Git commit successful
- Can restore from backup if needed

**Dependencies:** None

---

### Task 1.2: Delete Demo Artworks & Critiques (15 minutes)

**Objective:** Remove 4 Sougwen Chung artworks and 24 critiques from data.json

**Steps:**
- [ ] Read `exhibitions/negative-space-of-the-tide/data.json`
- [ ] Delete artworks with IDs: `artwork-1`, `artwork-2`, `artwork-3`, `artwork-4`
- [ ] Delete all 24 critiques (where `artworkId` in `artwork-1` through `artwork-4`)
- [ ] Keep `personas` array unchanged (6 critics)
- [ ] Save data.json

**Success Criteria:**
- `artworks` array is empty `[]`
- `critiques` array is empty `[]`
- `personas` array still has 6 items
- JSON is valid

**Dependencies:** Task 1.1 (backup must complete first)

**Validation:**
```bash
# Check array lengths
node -e "const d=require('./exhibitions/negative-space-of-the-tide/data.json'); console.log('Artworks:', d.artworks.length, 'Critiques:', d.critiques.length, 'Personas:', d.personas.length)"
# Expected: Artworks: 0 Critiques: 0 Personas: 6
```

---

### Task 1.3: Migrate 5 Completed Artworks from congsheng-2025 (1 hour)

**Objective:** Transfer 5 AI/tech artworks already created in Phase 1

**Source:** `exhibitions/congsheng-2025/data.json`
**Target:** `exhibitions/negative-space-of-the-tide/data.json`

**Steps:**
- [ ] Read congsheng-2025/data.json
- [ ] Extract 5 artworks: `artwork-84`, `artwork-80`, `artwork-82`, `artwork-65`, `artwork-60`
- [ ] Renumber IDs: `artwork-84` → `artwork-1`, `artwork-80` → `artwork-2`, etc.
- [ ] Remove extra fields: `artistEn`, `institution`, `medium`, `contextZh`
- [ ] Keep only: `id`, `titleZh`, `titleEn`, `year`, `artist`, `imageUrl`, `primaryImageId`, `context`, `images[]`
- [ ] Update image paths: `./assets/artworks/` → `/assets/artworks/`
- [ ] Update image IDs: `img-84-1` → `img-1-1`, etc.
- [ ] Append to negative-space-of-the-tide/data.json `artworks` array
- [ ] Save data.json

**Success Criteria:**
- 5 artworks in `artworks` array
- All artwork IDs are `artwork-1` through `artwork-5`
- All image paths start with `/assets/`
- JSON is valid

**Dependencies:** Task 1.2 (demo data must be deleted first)

**Validation:**
```bash
# Check artwork count
node -e "const d=require('./exhibitions/negative-space-of-the-tide/data.json'); console.log('Artworks:', d.artworks.length)"
# Expected: Artworks: 5

# Check first artwork ID
node -e "const d=require('./exhibitions/negative-space-of-the-tide/data.json'); console.log('First ID:', d.artworks[0].id)"
# Expected: First ID: artwork-1
```

---

### Task 1.4: Add Artwork 6-13 (New Media/Installation) (2 hours)

**Objective:** Add 8 new media/installation artworks

**Source:** `scripts/exhibition-artworks-structured.json`

**Artworks:**
1. 张瑞航 - 无序共识
2. 李索、张恺麟 - Upload
3. 魏云佳 - X博物馆
4. 向诗雨 陈晨 王思莹 - 双生界
5. 刘铁源 - 归原.共生
6. 杨锋 - 环形虚无
7. 宋佳益 - 我永远在你的背后
8. 王博 - 逐日计划

**Steps:**
- [ ] For each artwork:
  - [ ] Extract title, artist, year, institution from structured.json
  - [ ] Assign ID: `artwork-6` through `artwork-13`
  - [ ] Write English context (2-3 sentences describing the work)
  - [ ] List images from `congsheng-2025/assets/artworks/artwork-[slide]-[artist]/`
  - [ ] Assign image IDs: `img-6-1`, `img-6-2`, etc.
  - [ ] Set primaryImageId to first image
  - [ ] Append to `artworks` array
- [ ] Save data.json after each batch of 2-3 artworks

**Success Criteria:**
- 13 artworks in `artworks` array (5 existing + 8 new)
- All artwork IDs unique
- All have English context
- All have at least 1 image
- JSON is valid

**Dependencies:** Task 1.3 (first 5 artworks must be added)

**Validation:**
```bash
node -e "const d=require('./exhibitions/negative-space-of-the-tide/data.json'); console.log('Artworks:', d.artworks.length, 'Expected: 13')"
```

---

### Task 1.5: Add Artwork 14-23 (Painting/Traditional Media) (2.5 hours)

**Objective:** Add 10 painting/traditional media artworks

**Source:** `scripts/exhibition-artworks-structured.json`

**Steps:** Same as Task 1.4, but for next batch of artworks

**Success Criteria:**
- 23 artworks in `artworks` array
- IDs `artwork-14` through `artwork-23` added
- JSON is valid

**Dependencies:** Task 1.4

---

### Task 1.6: Add Artwork 24-33 (Taiwan Artists) (2 hours)

**Objective:** Add 10 Taiwan artist artworks

**Source:** `scripts/exhibition-artworks-structured.json`

**Steps:** Same as Task 1.4

**Success Criteria:**
- 33 artworks in `artworks` array
- IDs `artwork-24` through `artwork-33` added
- JSON is valid

**Dependencies:** Task 1.5

---

### Task 1.7: Add Artwork 34-38 (Remaining Artworks) (1 hour)

**Objective:** Add final 5 artworks

**Source:** `scripts/exhibition-artworks-structured.json`

**Steps:** Same as Task 1.4

**Success Criteria:**
- 38 artworks in `artworks` array
- IDs `artwork-34` through `artwork-38` added
- All artworks have complete metadata
- JSON is valid

**Dependencies:** Task 1.6

---

### Task 1.8: Migrate Images to Root Assets (30 minutes)

**Objective:** Move 97 images from congsheng-2025 to root assets directory

**Source:** `/exhibitions/congsheng-2025/assets/artworks/`
**Target:** `/assets/artworks/`

**Steps:**
- [ ] Create target directories: `/assets/artworks/artwork-1/` through `artwork-38/`
- [ ] Copy images from source to target
- [ ] Rename directories to match new artwork IDs:
  - `artwork-84-于浩睿/` → `artwork-1/`
  - `artwork-80-王歆童/` → `artwork-2/`
  - ... (follow ID mapping)
- [ ] Verify all 97 images copied successfully
- [ ] Update `images[].url` paths in data.json if needed (should already be correct)

**Success Criteria:**
- All 38 artwork directories exist in `/assets/artworks/`
- Total 97 images copied
- No duplicate images
- All image paths in data.json resolve correctly

**Dependencies:** Task 1.7 (all artworks must be added to data.json first)

**Validation:**
```bash
# Count artwork directories
ls assets/artworks | wc -l
# Expected: 38

# Count total images
find assets/artworks -type f | wc -l
# Expected: 97
```

---

### Task 1.9: Validate Image Paths (15 minutes)

**Objective:** Ensure all image URLs in data.json resolve correctly

**Steps:**
- [ ] Read negative-space-of-the-tide/data.json
- [ ] For each artwork:
  - [ ] For each image in `images[]`:
    - [ ] Check if file exists at `image.url`
    - [ ] If not found, log warning
- [ ] Generate validation report

**Success Criteria:**
- All images resolve (or placeholder system covers missing ones)
- No broken image references
- Validation report generated

**Dependencies:** Task 1.8 (images must be migrated first)

**Validation Script:**
```javascript
const fs = require('fs');
const path = require('path');
const data = require('./exhibitions/negative-space-of-the-tide/data.json');

let missingCount = 0;
data.artworks.forEach(artwork => {
  artwork.images.forEach(img => {
    const imgPath = path.join(__dirname, img.url);
    if (!fs.existsSync(imgPath)) {
      console.warn(`⚠ Missing image: ${img.url} (${artwork.id})`);
      missingCount++;
    }
  });
});

console.log(`\n✓ Validation complete: ${missingCount} missing images (placeholder will display)`);
```

---

## Phase 2: Critique Generation (15-20 hours)

### Task 2.1: Setup LLM Critique Generation System (1 hour) ✅ COMPLETED

**Objective:** Create scripts and templates for automated critique generation

**Steps:**
- [x] Create `scripts/generate-critiques.js` script
- [x] Define prompt template for each critic type
- [x] Setup Claude API or GPT-4 API connection
- [x] Create batch processing function (1 artwork × 6 critics)
- [x] Add RPAIT score validation function
- [x] Add output formatter (JSON)

**Success Criteria:**
- ✅ Script can generate 1 artwork × 6 critiques
- ✅ Output matches expected JSON structure
- ✅ RPAIT scores in valid range (1-10)

**Dependencies:** None (parallel to Phase 1)

**Template Structure:**
```javascript
const promptTemplate = (artwork, critic) => `
You are ${critic.nameZh} (${critic.nameEn}), a ${critic.period} art critic.

Core Philosophy:
${critic.keyPrinciples.join('\n')}

Artwork:
- Title: ${artwork.titleZh} / ${artwork.titleEn}
- Artist: ${artwork.artist}
- Year: ${artwork.year}
- Context: ${artwork.context}

Task:
Generate a 1000-1500 character critique in Chinese and English.

RPAIT Framework:
- R (Representation): How well does the work represent its subject/concept?
- P (Philosophicality): What deeper meanings or philosophical questions does it raise?
- A (Aesthetics): How does it achieve beauty or visual impact?
- I (Identity): How does it reflect cultural, personal, or collective identity?
- T (Tradition): How does it relate to or depart from artistic traditions?

Output JSON:
{
  "textZh": "...",
  "textEn": "...",
  "rpait": {"R": 7, "P": 9, "A": 8, "I": 8, "T": 6}
}
`;
```

---

### Task 2.2: Generate Critiques for Artwork 1-5 (2 hours) ✅ COMPLETED

**Objective:** Generate 30 critiques (5 artworks × 6 critics)

**Steps:**
- [x] For each of 5 artworks:
  - [x] For each of 6 critics:
    - [x] Read artwork metadata
    - [x] Read critic knowledge base
    - [x] Generate Chinese critique (800-1800 chars)
    - [x] Generate English critique (800-1800 chars)
    - [x] Assign RPAIT scores
    - [x] Save to `critiques-artwork-1-5-regenerated.json`
- [x] Human review of all 30 critiques
- [x] Adjust RPAIT scores if needed
- [x] Append to negative-space-of-the-tide/data.json `critiques` array

**Success Criteria:**
- ✅ 30 critiques generated
- ✅ All critiques 800-1800 characters
- ✅ All RPAIT scores in valid range
- ✅ Human review complete
- ✅ Appended to data.json

**Dependencies:** Task 1.3 (artworks 1-5 must exist), Task 2.1 (generation system ready)

---

### Task 2.3: Generate Critiques for Artwork 6-13 (4 hours) ✅ COMPLETED

**Objective:** Generate 48 critiques (8 artworks × 6 critics)

**Steps:** Same as Task 2.2

**Success Criteria:**
- ✅ 78 total critiques in data.json (30 + 48)
- ✅ All critiques reviewed
- ✅ JSON is valid

**Dependencies:** Task 1.4 (artworks 6-13 must exist), Task 2.2

---

### Task 2.4: Generate Critiques for Artwork 14-23 (5 hours) ✅ COMPLETED

**Objective:** Generate 60 critiques (10 artworks × 6 critics)

**Steps:** Same as Task 2.2

**Success Criteria:**
- ✅ 138 total critiques in data.json (78 + 60)

**Dependencies:** Task 1.5, Task 2.3

---

### Task 2.5: Generate Critiques for Artwork 24-33 (4 hours) ✅ COMPLETED

**Objective:** Generate 60 critiques (10 artworks × 6 critics)

**Steps:** Same as Task 2.2

**Success Criteria:**
- ✅ 198 total critiques in data.json (138 + 60)

**Dependencies:** Task 1.6, Task 2.4

---

### Task 2.6: Generate Critiques for Artwork 34-38 (2 hours) ✅ COMPLETED

**Objective:** Generate 30 critiques (5 artworks × 6 critics)

**Steps:** Same as Task 2.2

**Success Criteria:**
- ✅ 228 total critiques in data.json (198 + 30)
- ✅ All artworks have 6 critiques

**Dependencies:** Task 1.7, Task 2.5

---

### Task 2.7: Final Critique Review & Adjustment (2 hours) ⏸️ PENDING

**Objective:** Quality assurance for all 228 critiques

**Steps:**
- [ ] Review critique length distribution (should be 800-1800 chars)
- [ ] Review RPAIT score distribution (should vary across critics)
- [ ] Check for repetitive language or generic phrases
- [ ] Adjust 10-20 critiques for quality if needed
- [ ] Verify all critiques have valid `artworkId` and `personaId`
- [ ] Final save of data.json

**Success Criteria:**
- All critiques meet quality standards
- RPAIT scores validated
- No duplicate or template-like content
- All references valid

**Current Status:** All 228 critiques have been generated and merged. Human review pending.

**Dependencies:** Task 2.6 (all critiques generated) ✅

**Validation:**
```bash
# Check critique count
node -e "const d=require('./exhibitions/negative-space-of-the-tide/data.json'); console.log('Critiques:', d.critiques.length, 'Expected: 228')"

# Check critique length distribution
node -e "const d=require('./exhibitions/negative-space-of-the-tide/data.json'); const lengths = d.critiques.map(c => c.textZh.length); console.log('Min:', Math.min(...lengths), 'Max:', Math.max(...lengths), 'Avg:', Math.round(lengths.reduce((a,b)=>a+b,0)/lengths.length))"
```

---

## Phase 3: Configuration & Metadata (30 minutes)

### Task 3.1: Update Exhibition Config (10 minutes)

**Objective:** Update config.json with new exhibition metadata

**File:** `exhibitions/negative-space-of-the-tide/config.json`

**Steps:**
- [ ] Update `titleZh` to "丛生：两岸教育双年展——沉思之胃"
- [ ] Update `titleEn` to "Congsheng: Cross-Strait Education Biennial - Stomach of Contemplation"
- [ ] Update `stats.artworks` to 38
- [ ] Update `stats.personas` to 6 (unchanged)
- [ ] Update `stats.messages` to 0 (dialogues not yet generated)
- [ ] Add curator information:
  ```json
  "curator": {
    "nameZh": "于浩睿",
    "nameEn": "Yu Haorui",
    "role": "策展人"
  }
  ```
- [ ] Update `descriptionZh` and `descriptionEn`
- [ ] Save config.json

**Success Criteria:**
- Title updated
- Stats accurate
- Curator added
- JSON is valid

**Dependencies:** Task 1.7 (all artworks added), Task 2.7 (all critiques added)

---

### Task 3.2: Update API Registration (10 minutes)

**Objective:** Update exhibitions API with new metadata

**File:** `/api/exhibitions.json`

**Steps:**
- [ ] Find exhibition with `id: "negative-space-of-the-tide"`
- [ ] Update `titleZh` to "丛生：两岸教育双年展——沉思之胃"
- [ ] Update `titleEn` to "Congsheng: Cross-Strait Education Biennial - Stomach of Contemplation"
- [ ] Update `stats.artworks` to 38
- [ ] Add curator field
- [ ] Update `descriptionZh` and `descriptionEn`
- [ ] Update `updated` timestamp
- [ ] Save api/exhibitions.json

**Success Criteria:**
- API registration updated
- Stats match config.json
- JSON is valid

**Dependencies:** Task 3.1 (config.json updated)

---

### Task 3.3: Create Cover Image (10 minutes)

**Objective:** Create exhibition cover image

**File:** `/exhibitions/negative-space-of-the-tide/assets/cover.jpg`

**Steps:**
- [ ] Select representative artwork (recommend: artwork-1 / VULCA platform)
- [ ] Resize to 1200×630px (OpenGraph standard)
- [ ] Optimize for web (<300KB)
- [ ] Save as `cover.jpg`
- [ ] Copy to `og-image.jpg` (same image)
- [ ] Update config.json `assets.cover` path (should already be correct)

**Success Criteria:**
- cover.jpg exists
- og-image.jpg exists
- Images display correctly
- File size <300KB

**Dependencies:** Task 1.8 (artwork images migrated)

**Alternative (Temporary):**
```bash
# Use placeholder if image not ready
cp assets/artworks/artwork-1/01.jpg exhibitions/negative-space-of-the-tide/assets/cover.jpg
```

---

## Phase 4: Testing & Validation (2-3 hours)

### Task 4.1: Local Server Testing (30 minutes)

**Objective:** Verify exhibition loads correctly on local server

**Steps:**
- [ ] Start local server: `python -m http.server 9999`
- [ ] Visit `http://localhost:9999/exhibitions/negative-space-of-the-tide/`
- [ ] Check page loads without errors
- [ ] Check artwork grid displays 38 artworks
- [ ] Check image carousel works
- [ ] Check critique panel displays
- [ ] Check RPAIT radar chart renders
- [ ] Check language switch works (中/EN)
- [ ] Check browser console for errors

**Success Criteria:**
- Page loads successfully
- All components render
- No console errors
- No 404 image errors (or placeholders display)

**Dependencies:** All previous tasks complete

---

### Task 4.2: Responsive Design Testing (30 minutes)

**Objective:** Verify responsive design on multiple screen sizes

**Steps:**
- [ ] Test on mobile (375px width)
- [ ] Test on tablet (768px width)
- [ ] Test on desktop (1024px width)
- [ ] Test on large desktop (1440px width)
- [ ] Check layout doesn't break
- [ ] Check images scale correctly
- [ ] Check text is readable
- [ ] Check navigation works

**Success Criteria:**
- All breakpoints tested
- No layout issues
- All content accessible

**Dependencies:** Task 4.1

---

### Task 4.3: Data Integrity Validation (30 minutes)

**Objective:** Validate all data structures and references

**Steps:**
- [ ] Run automated validation script
- [ ] Check all artwork IDs unique
- [ ] Check all critique artworkId references valid
- [ ] Check all critique personaId references valid
- [ ] Check all primaryImageId references exist
- [ ] Check all RPAIT scores in range 1-10
- [ ] Check all text fields non-empty
- [ ] Generate validation report

**Success Criteria:**
- All validation checks pass
- No broken references
- No missing data

**Dependencies:** Task 4.1

**Validation Script:**
```javascript
const fs = require('fs');
const data = require('./exhibitions/negative-space-of-the-tide/data.json');

// Check artwork ID uniqueness
const artworkIds = data.artworks.map(a => a.id);
const uniqueIds = new Set(artworkIds);
console.assert(artworkIds.length === uniqueIds.size, 'Duplicate artwork IDs found');

// Check critique references
data.critiques.forEach((critique, i) => {
  const artworkExists = data.artworks.some(a => a.id === critique.artworkId);
  console.assert(artworkExists, `Critique ${i}: Invalid artworkId ${critique.artworkId}`);

  const personaExists = data.personas.some(p => p.id === critique.personaId);
  console.assert(personaExists, `Critique ${i}: Invalid personaId ${critique.personaId}`);

  // Check RPAIT scores
  Object.values(critique.rpait).forEach(score => {
    console.assert(score >= 1 && score <= 10, `Critique ${i}: Invalid RPAIT score ${score}`);
  });
});

console.log('✓ Validation complete');
```

---

### Task 4.4: Cross-Browser Testing (30 minutes)

**Objective:** Test on major browsers

**Steps:**
- [ ] Test on Chrome/Edge 90+
- [ ] Test on Firefox 88+
- [ ] Test on Safari 14+ (if available)
- [ ] Check all features work
- [ ] Check no browser-specific bugs

**Success Criteria:**
- Works on all tested browsers
- No browser-specific issues

**Dependencies:** Task 4.1

---

### Task 4.5: Performance Testing (30 minutes)

**Objective:** Verify performance is acceptable

**Steps:**
- [ ] Measure page load time (<3 seconds)
- [ ] Check data.json file size (<500KB)
- [ ] Check total asset size (<100MB)
- [ ] Check image loading (lazy load working)
- [ ] Check JavaScript execution time
- [ ] Check memory usage (no leaks)

**Success Criteria:**
- Page loads in <3 seconds
- No performance issues
- No memory leaks

**Dependencies:** Task 4.1

---

## Phase 5: Deployment & Documentation (30 minutes)

### Task 5.1: Git Commit & Push (10 minutes)

**Objective:** Commit all changes to Git

**Steps:**
- [ ] Git add all changed files
- [ ] Git commit with descriptive message
- [ ] Git push to GitHub
- [ ] Verify GitHub Actions builds successfully

**Success Criteria:**
- All changes committed
- Pushed to GitHub
- Build succeeds

**Dependencies:** All testing complete

**Commit Message:**
```
feat: Expand exhibition with 38 real artworks

Replace demo Sougwen Chung artworks with 38 real artworks from
Congsheng Cross-Strait Education Biennial. Rename exhibition and
generate 228 critiques using LLM + knowledge base.

Changes:
- Delete 4 demo artworks and 24 critiques
- Add 38 real artworks with metadata
- Generate 228 critiques (38 × 6 critics)
- Migrate 97 images to root assets
- Update exhibition title and config
- Update API registration

Closes #[issue-number]
```

---

### Task 5.2: Update Documentation (10 minutes)

**Objective:** Update project documentation

**Steps:**
- [ ] Update README.md (if needed)
- [ ] Update CLAUDE.md with new exhibition info
- [ ] Archive strategy documents (mark as COMPLETED)
- [ ] Create `EXHIBITION_EXPANSION_COMPLETE.md` summary

**Success Criteria:**
- Documentation updated
- Strategy documents archived

**Dependencies:** Task 5.1

---

### Task 5.3: Deprecate congsheng-2025 Exhibition (10 minutes)

**Objective:** Mark congsheng-2025 as deprecated

**Steps:**
- [ ] Update `exhibitions/congsheng-2025/README.md` with deprecation notice
- [ ] Remove from active exhibitions in API (set status to "archived")
- [ ] Keep directory intact (for reference)
- [ ] Document migration in README

**Success Criteria:**
- Deprecation notice added
- API updated
- Directory preserved

**Dependencies:** Task 5.1

**Deprecation Notice:**
```markdown
# ⚠️ DEPRECATED

This exhibition was created during Phase 1 as a temporary workspace.

All content has been migrated to:
`/exhibitions/negative-space-of-the-tide/`

This directory is preserved for reference and extraction scripts.

**Migration Date:** 2025-11-12
**Replacement Exhibition:** "丛生：两岸教育双年展——沉思之胃"
```

---

## Task Summary

| Phase | Tasks | Time | Priority |
|-------|-------|------|----------|
| **Phase 1** | 1.1-1.9 Data Migration | 6.5-8.5h | P0 |
| **Phase 2** | 2.1-2.7 Critique Generation | 15-20h | P1 |
| **Phase 3** | 3.1-3.3 Configuration | 30min | P0 |
| **Phase 4** | 4.1-4.5 Testing | 2-3h | P0 |
| **Phase 5** | 5.1-5.3 Deployment | 30min | P0 |
| **Total** | 32 tasks | **24-32h** | — |

---

## Dependencies Graph

```
Phase 1 (Data Migration)
  1.1 (Backup) → 1.2 (Delete) → 1.3 (Migrate 5) → 1.4-1.7 (Add 33) → 1.8 (Move Images) → 1.9 (Validate)

Phase 2 (Critique Generation)
  2.1 (Setup) → 2.2-2.6 (Generate) → 2.7 (Review)
  ↑ depends on corresponding Phase 1 tasks

Phase 3 (Configuration)
  3.1 (Config) → 3.2 (API) → 3.3 (Cover)
  ↑ depends on Phase 1 + Phase 2 complete

Phase 4 (Testing)
  4.1 (Server) → 4.2-4.5 (All tests)
  ↑ depends on Phase 3 complete

Phase 5 (Deployment)
  5.1 (Git) → 5.2 (Docs) → 5.3 (Deprecate)
  ↑ depends on Phase 4 complete
```

---

## Parallelization Opportunities

Tasks that can run in parallel:
- Phase 1 Tasks 1.4-1.7 (can be split among multiple people)
- Phase 2 Task 2.1 (can start while Phase 1 in progress)
- Phase 2 Tasks 2.2-2.6 (each artwork batch independent)

---

## Success Metrics

**Quantitative:**
- [ ] 38 artworks in data.json
- [ ] 228 critiques in data.json
- [ ] 97 images in /assets/artworks/
- [ ] 0 console errors on page load
- [ ] <3 second page load time
- [ ] 100% responsive test pass rate

**Qualitative:**
- [ ] Exhibition content feels cohesive
- [ ] Critiques are culturally informed and high quality
- [ ] Visual design is polished
- [ ] User experience is smooth

---

## Risk Mitigation Checklist

- [ ] Backup created before deletion
- [ ] Git commit before destructive operations
- [ ] Validation scripts run after each phase
- [ ] Human review of LLM-generated content
- [ ] Cross-browser testing complete
- [ ] Rollback plan documented and tested
