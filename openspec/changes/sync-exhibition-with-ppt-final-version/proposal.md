# Proposal: Sync Exhibition with PPT Final Version

**Change ID**: `sync-exhibition-with-ppt-final-version`
**Created**: 2025-11-14
**Status**: Proposed
**Priority**: High
**Estimated Effort**: 7-11 hours

---

## Problem Statement

### Current State
- Exhibition website displays **38 artworks** from old PPT version
- PPT final version contains **45+ artists** with 8 new additions
- Website missing 5 confirmed new artists + 3 pending artists
- Navigation system lacks "Return to Artist List" feature present in PPT
- Data misalignment between website and official exhibition materials

### Impact
- ❌ **Incomplete Exhibition**: 7-8 artworks missing from public display
- ❌ **Outdated Information**: Removed artists still showing (李鹏飞, 陈筱薇, 龍暐翔)
- ❌ **Poor UX**: No artist list page, difficult to navigate between artworks
- ❌ **Credibility Issue**: Website doesn't match official PPT documentation

### Evidence
From `PPT_COMPARISON_FINAL_REPORT.md`:
- Old PPT: 96 slides, 43 artists
- New PPT: 100 slides, 45 artists
- 89/96 slides modified to add "返回名单" navigation
- 5 new artists added to roster (凌筱薇, 郭缤禧, 林杨彬, 邢辰力德, 周妤蓉)
- 3 new artist pages (金钛锆, 一名奇怪的鸟类观察员, 罗薇)

---

## Proposed Solution

### Strategy: Phased Incremental Sync (Plan A)

Implement immediate sync for confirmed artists while creating placeholders for pending works.

### Phase 1: Confirmed Artists (5 artists)
Add complete data for artists with confirmed artwork information:
1. **凌筱薇** (Ling Xiaowei) - 中央美术学院
2. **郭缤禧** (Guo Binxi) - 四川美术学院
3. **林杨彬** (Lin Yangbin) - 广东美术学院
4. **邢辰力德** (Xing Chenlidé) - 湖北美术学院区域
5. **周妤蓉** (Zhou Yurong) - 台湾师范大学

### Phase 2: Pending Artists (3 artists)
Create placeholder entries with "Coming Soon" status:
1. **金钛锆** - Work title TBD
2. **一名奇怪的鸟类观察员** - Documentary/Literature display
3. **罗薇** - AI video work (in production)

### Phase 3: Navigation Enhancement
Implement "Return to Artist List" feature:
- Create artist roster page (`/pages/artists.html`)
- Add navigation buttons to artwork detail pages
- Update global navigation menu

### Phase 4: Data Cleanup
Remove outdated artist entries:
- Remove 李鹏飞 (Li Pengfei) if present
- Remove 陈筱薇 (Chen Xiaowei) if present
- Remove 龍暐翔 (Long Weixiang) if present

---

## Why

### User Pain Points
1. **Incomplete Exhibition**: Users visiting the website see only 38 artworks, missing 8 new artists from the official exhibition materials
2. **Outdated Information**: Website doesn't reflect the latest curatorial decisions (artist additions/removals)
3. **Poor Navigation**: No way to browse all artists at once or return to artist list after viewing artwork
4. **Lost Users**: Visitors can't tell which artworks are ready vs. pending, leading to confusion

### Business Impact
- **Credibility Gap**: Website out of sync with official PPT reduces professional credibility
- **Missed Content**: 8 new artworks (17% growth) not showcased to visitors
- **User Experience**: Difficult navigation frustrates users, increases bounce rate
- **Exhibition Quality**: Pending artworks shown without context looks unprofessional

### Technical Debt
- Manual data entry → error-prone, doesn't scale
- No status differentiation → can't handle works-in-progress
- Navigation hardcoded → difficult to add new pages

---

## What Changes

### 1. Data Layer (`exhibitions/negative-space-of-the-tide/data.json`)

**ADDED**:
- 8 new artwork entries (artwork-39 to artwork-46)
- Artist metadata for 8 new artists
- Placeholder image URLs for pending works
- Status field: `"status": "confirmed" | "pending"`

**MODIFIED**:
- Update artwork count: 38 → 46
- Update exhibition metadata

**REMOVED**:
- 3 removed artists (if present in current data)

### 2. Dialogue System (`js/data/dialogues/`)

**ADDED**:
- `artwork-39.js` to `artwork-46.js` (8 new dialogue files)
- Critiques from 6 personas for each new artwork
- Knowledge base references for new dialogues

**MODIFIED**:
- `index.js`: Import and export 8 new dialogue modules
- Update dialogue count statistics

### 3. Navigation System

**ADDED**:
- `/pages/artists.html` - Artist roster page
- "Return to List" button component
- Artist filtering/sorting functionality

**MODIFIED**:
- `index.html`: Add link to artist roster
- Global navigation menu: Add "Artists" item

### 4. UI Components

**ADDED**:
- Artist grid layout component
- Pending artwork badge/indicator
- "Coming Soon" overlay for pending works

**MODIFIED**:
- Artwork carousel: Support pending status
- Image tooltip: Handle placeholder images

---

## Why This Approach

### Benefits
✅ **Immediate Value**: 5 confirmed artists go live quickly
✅ **Transparent Communication**: Pending status clearly indicated
✅ **Scalable**: Easy to promote pending → confirmed later
✅ **Professional**: Shows active exhibition development
✅ **User-Friendly**: Artist roster improves navigation

### Alternatives Considered

#### Alternative 1: Wait for All Confirmations
- ❌ Delays entire update (weeks)
- ❌ Website remains outdated
- ✅ Complete launch

#### Alternative 2: Add Only Confirmed Data
- ✅ Clean, no placeholders
- ❌ Missing 3 artists entirely
- ❌ Incomplete exhibition representation

#### Alternative 3: Full Immediate Sync (Our Choice)
- ✅ Fast deployment (5 confirmed artists)
- ✅ Maintains exhibition completeness (placeholders for 3)
- ✅ Flexible for future updates
- ⚠️ Requires placeholder UI

---

## How to Implement

### Stage 1: Data Extraction (2 hours)
1. Extract artwork metadata from PPT final version
2. Map to `data.json` schema
3. Generate placeholder entries for pending works
4. Validate JSON schema compliance

### Stage 2: Dialogue Generation (3 hours)
1. Use existing critiques if available
2. Generate placeholder dialogues for pending works
3. Run `scripts/convert-critiques-to-dialogues.js --batch 39-46`
4. Validate dialogue quality

### Stage 3: Navigation Implementation (2 hours)
1. Create `/pages/artists.html` page
2. Implement artist grid with filtering
3. Add "Return to List" button to artwork pages
4. Update global navigation menu

### Stage 4: UI Enhancements (1 hour)
1. Create "Pending" badge component
2. Add "Coming Soon" overlay
3. Update artwork carousel to handle status
4. Style pending artwork cards

### Stage 5: Testing & Deployment (2 hours)
1. Local testing: All 46 artworks display correctly
2. Dialogue playback testing
3. Navigation flow testing
4. Deploy to GitHub Pages
5. Cache invalidation

**Total Estimated Time**: 10 hours

---

## Success Criteria

### Functional Requirements
- [ ] All 5 confirmed artists display with complete data
- [ ] All 3 pending artists show placeholder cards
- [ ] Artist roster page lists all 46 artworks
- [ ] "Return to List" navigation works from all artwork pages
- [ ] Dialogues load for all confirmed artworks
- [ ] Pending artworks show "Coming Soon" indicator

### Quality Requirements
- [ ] No broken images (placeholders for pending)
- [ ] No JavaScript errors in console
- [ ] All dialogues have valid knowledge base references
- [ ] Responsive design works at all breakpoints
- [ ] SEO metadata updated (artwork count)

### User Experience
- [ ] Users can browse artist roster
- [ ] Clear distinction between confirmed/pending works
- [ ] Smooth navigation between list and detail views
- [ ] Loading states for dialogues

---

## Risks & Mitigation

### Risk 1: Pending Artists Never Confirm
**Probability**: Medium
**Impact**: High
**Mitigation**:
- Set 2-week deadline for confirmation
- Remove placeholder if no response
- Communicate status in artist card

### Risk 2: Artwork Data Incomplete
**Probability**: Low
**Impact**: Medium
**Mitigation**:
- Use PPT text as fallback for descriptions
- Contact artists directly for missing info
- Use placeholder images temporarily

### Risk 3: Dialogue Quality Issues
**Probability**: Low
**Impact**: Low
**Mitigation**:
- Manual review of generated dialogues
- Use existing critique templates
- A/B test with sample users

---

## Dependencies

### Data Dependencies
- PPT final version (`丛生--沉思之胃 人员作品最终.pptx`) ✅
- Artist contact information (for confirmations) ⏳
- Artwork images (or placeholders) ✅

### Technical Dependencies
- `scripts/convert-critiques-to-dialogues.js` ✅
- `data.json` schema ✅
- Dialogue player component ✅
- Artwork carousel component ✅

### External Dependencies
- Artist confirmations (3 pending) ⏳
- Artwork image acquisition ⏳

---

## Rollback Plan

If critical issues arise:

1. **Immediate Rollback** (< 5 minutes):
   - Revert `data.json` to 38 artworks
   - Revert `js/data/dialogues/index.js`
   - Clear browser cache

2. **Partial Rollback** (< 15 minutes):
   - Keep confirmed artists, remove pending
   - Disable artist roster page
   - Revert navigation changes

3. **Data Preservation**:
   - Backup current `data.json` before changes
   - Tag Git commit: `pre-ppt-sync-backup`
   - Store new dialogues in separate branch

---

## Related Work

### Builds Upon
- `enrich-artwork-metadata-from-ppt-source`: PPT parsing infrastructure
- `expand-exhibition-with-real-artworks`: Multi-artwork support
- `refine-dialogue-system-visual-ux`: Dialogue UI components

### Enables
- Future: Dynamic artist filtering
- Future: Artwork comparison views
- Future: Personalized exhibition tours

### Conflicts With
- None identified

---

## Appendix

### Confirmed New Artists Details

| Artist | School | Artwork Status | Priority |
|--------|--------|---------------|----------|
| 凌筱薇 | 中央美术学院 | ✅ Confirmed | High |
| 郭缤禧 | 四川美术学院 | ✅ Confirmed | High |
| 林杨彬 | 广东美术学院 | ✅ Confirmed | High |
| 邢辰力德 | 湖北美术学院 | ✅ Confirmed | High |
| 周妤蓉 | 台湾师范大学 | ✅ Confirmed | High |

### Pending Artists Details

| Artist | Artwork | Status | Blocker |
|--------|---------|--------|---------|
| 金钛锆 | TBD | 🟡 Pending | Need artwork title |
| 一名奇怪的鸟类观察员 | Literature | 🟢 In Progress | Need final materials |
| 罗薇 | AI Video | 🟡 In Production | Waiting for completion |

### Removed Artists

| Artist | School | Reason |
|--------|--------|--------|
| 李鹏飞 | 鲁迅美术学院 | Withdrawn/Not Ready |
| 陈筱薇 | 中央美术学院 | Withdrawn/Not Ready |
| 龍暐翔 | 台湾艺术大学 | Withdrawn/Not Ready |

---

**Proposal Owner**: @yuhaorui
**Reviewers**: N/A
**Target Completion**: 2025-11-15
