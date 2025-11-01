# VULCA B+C Immediate Action Plan
## Design Approval + Preparation Execution

**Status:** 🟢 Ready to Execute
**Timeline:** 3 Days (Before Week 1 Monday)
**Parallel Execution:** Both B and C run simultaneously

---

## Overview

You have selected:
- **Option B:** Design specification review & approval
- **Option C:** Pre-Week 1 preparation (images, domain, files)

This plan coordinates both activities to occur in parallel over 3 days, then transition to Week 1 execution.

---

## Day 1: Foundation Setup (2-3 hours)

### Morning (90 minutes)

**Task B: Specification Review - Part 1**
- [ ] Print or open `SPEC_REVIEW_CHECKLIST.md`
- [ ] Review Section 1: Color System (15 min)
  - Primary warm gray palette: approve or modify
  - Metal accents: assess gold/silver balance
- [ ] Review Section 2: Typography (10 min)
  - Font selections
  - Type scale
- [ ] Document decisions in checklist

**Time allocation:** 25 minutes
**Output:** Sections 1-2 completed in SPEC_REVIEW_CHECKLIST.md

---

**Task C: Infrastructure Setup - Part 1**
- [ ] Register domain: vulca.art (20 min)
  - Choose registrar (Namecheap recommended)
  - Complete purchase
  - Save credentials
- [ ] Create GitHub repository (20 min)
  - Name: `vulca-exhibition`
  - Initialize with README
  - Clone locally
- [ ] First commit: scaffold (10 min)

**Time allocation:** 50 minutes
**Output:** Domain registered + GitHub repo ready

---

### Afternoon (60 minutes)

**Task C: Image Acquisition - Part 1**
- [ ] Begin PDF extraction from Sougwen Chung PDF (60 min)
  - Extract page 2 (MERIDIANS installation view)
  - Extract page 5 (detail composition)
  - Verify resolution ≥3000×2000px
  - Save as temp files

**Time allocation:** 60 minutes
**Output:** 2 Sougwen images extracted to temporary folder

---

### End of Day 1 Checklist
```
[ ] Color system (Section 1) reviewed
[ ] Typography (Section 2) reviewed
[ ] Domain vulca.art registered
[ ] GitHub repo created & cloned
[ ] Initial scaffold commit ready to push
[ ] 2 Sougwen Chung images extracted
[ ] Document decisions for tomorrow
```

---

## Day 2: Design Approval + Image Processing (4-5 hours)

### Morning (120 minutes)

**Task B: Specification Review - Part 2**
- [ ] Review Section 3: Particle System (15 min)
  - Particle counts (1500/800/300)
  - Motion parameters
- [ ] Review Section 4: Layout (15 min)
  - Breakpoints and grid
- [ ] Review Section 5: Accessibility (15 min)
  - Color contrast ratios
  - WCAG AA compliance
- [ ] Complete form decisions

**Time allocation:** 45 minutes
**Output:** Sections 3-5 completed

---

**Task C: Image Processing - Part 1**
- [ ] Download Lauren McCarthy images from web (20 min)
  - Use URLs from IMAGE_ACQUISITION_GUIDE.md
  - Save both images locally
  - Verify file integrity
- [ ] Verify all 4 images: resolution, color space (25 min)
  - Check dimensions ≥3000×2000px
  - Confirm RGB color space
  - Visual quality inspection
- [ ] Create temporary organized folder (10 min)

**Time allocation:** 55 minutes
**Output:** All 4 images extracted, verified, staged for compression

---

### Afternoon (180 minutes)

**Task B: Specification Review - Part 3**
- [ ] Review Section 6: Animation Effects (10 min)
- [ ] Review Section 7: Theme Alignment (10 min)
- [ ] Complete Section 8: Final Sign-Off (10 min)
- [ ] **KEY DECISION:** Approve or request modifications

**Time allocation:** 30 minutes
**Output:** SPEC_REVIEW_CHECKLIST.md 100% complete

**Approval Decision Matrix:**
```
SPEC STATUS:
☐ APPROVED → Continue to Week 1 as-is
☐ APPROVED WITH MODIFICATIONS → Update DESIGN_SPEC.md with new values
☐ NEEDS REVISION → Schedule follow-up design review

Next step depends on this decision.
```

---

**Task C: Image Compression**
- [ ] Visit tinypng.com (5 min)
- [ ] Upload all 4 images (5 min)
  - Monitor compression ratio
  - Target final size: <2.2 MB each
- [ ] Download compressed images (10 min)
- [ ] Verify quality maintained (30 min)
  - Visual inspection
  - File size confirmation
  - Compare original vs compressed
- [ ] WebP conversion (optional) (60-90 min)
  - Visit squoosh.app
  - Convert all 4 images
  - Verify quality/size trade-off
- [ ] Organize all files (20 min)

**Time allocation:** 130-160 minutes
**Output:** All images compressed, organized, ready to commit

---

### End of Day 2 Checklist
```
[ ] Sections 3-7 of SPEC_REVIEW_CHECKLIST.md reviewed
[ ] Design approval decision made (Approved/Modified/Needs revision)
[ ] All 4 images downloaded & verified
[ ] All 4 images compressed via TinyPNG <2.2 MB
[ ] WebP versions created (optional)
[ ] Compressed images organized in temp folder
[ ] Ready for Week 1 implementation
```

---

## Day 3: Finalization + Git Preparation (3-4 hours)

### Morning (90 minutes)

**Task B: Final Approval & Documentation**
- [ ] Review final approval decision from Day 2 (10 min)
- [ ] If modifications needed:
  - [ ] Update DESIGN_SPEC.md with new color values (20 min)
  - [ ] Verify new contrast ratios (WCAG AA) (10 min)
  - [ ] Document all changes in DESIGN_SPEC.md (10 min)
- [ ] If needs revision:
  - [ ] Schedule design review meeting (5 min)
  - [ ] Document feedback (15 min)

**Time allocation:** 30-60 minutes
**Output:** Design system finalized with approval

---

**Task C: QR Code Generation & Verification**
- [ ] Visit qrcode.com or qr-code-generator.com (5 min)
- [ ] Generate 4 QR codes (20 min)
  - URL: https://vulca.art/detail/[artwork-id]
  - Size: 200×200px
  - Colors: #1a1613 + #f5f2ed
  - Export: PNG with transparency
- [ ] Test all 4 codes on phone (20 min)
  - Scan each code
  - Verify link structure works
  - Note: Link won't resolve until Week 4 deployment
- [ ] Save QR codes with proper naming (10 min)

**Time allocation:** 55 minutes
**Output:** 4 QR codes generated, tested, ready for deployment

---

### Afternoon (90-120 minutes)

**Task C: Final File Organization & Git Commit**

**Step 1: Directory Structure (20 min)**
```bash
cd vulca-exhibition

# Create final structure
mkdir -p docs/images/artworks
mkdir -p docs/images/qrcodes
mkdir -p docs/data

# Copy files
cp [compressed images] docs/images/artworks/
cp [qr codes] docs/images/qrcodes/
cp openspec/ARTWORKS_DATA.json docs/data/artworks.json

# Verify structure
tree docs/
```

**Step 2: Image Path Verification (20 min)**
- [ ] Check ARTWORKS_DATA.json image paths match files
  - Expected: `/images/artworks/001_sougwen_meridians_installation.jpg`
  - Verify files exist at `docs/images/artworks/001_...`
- [ ] Verify QR code paths
  - Expected: `/images/qrcodes/001.png`
  - Verify files exist at `docs/images/qrcodes/001.png`

**Step 3: Second Git Commit (30 min)**
```bash
git add docs/images/
git add docs/data/artworks.json
git status  # Review what's being committed

git commit -m "Add: Artwork images and QR codes

- 4 high-resolution artwork images (3000×2000px+)
- Compressed to 1.85-2.15 MB via TinyPNG
- 4 QR codes linked to detail pages
- ARTWORKS_DATA.json with bilingual metadata
- Ready for Week 1 CSS/Three.js implementation"

# Don't push yet - review locally first
```

**Step 4: Pre-push Verification (20 min)**
```bash
git log --oneline  # Should show 2 commits: scaffold + images
git status        # Should show: "On branch main, nothing to commit"

# Final quality check
ls -lh docs/images/artworks/     # Verify file sizes
ls -lh docs/images/qrcodes/      # Verify QR codes exist
cat docs/data/artworks.json      # Verify structure
```

**Time allocation:** 90 minutes
**Output:** All files committed, ready to push on Week 1 Monday

---

### End of Day 3 Checklist
```
DESIGN APPROVAL
[ ] Final design approval decision documented
[ ] If modified: DESIGN_SPEC.md updated with new values
[ ] Approval form signed in SPEC_REVIEW_CHECKLIST.md
[ ] Ready for Week 1 CSS implementation

IMAGE PREPARATION
[ ] 4 QR codes generated & tested
[ ] All files organized in docs/images/
[ ] ARTWORKS_DATA.json copied to docs/data/
[ ] Image paths verified in JSON
[ ] No missing or misnamed files

GIT PREPARATION
[ ] Second commit created (images + QR codes)
[ ] All files staged correctly
[ ] Commit message clear and descriptive
[ ] Ready to push on Monday morning
[ ] Git log shows clean history

OVERALL STATUS
[ ] All 3-day preparation complete
[ ] Ready for Week 1 Monday execution
[ ] No blockers identified
[ ] Domain registered (planning to configure DNS in Week 4)
```

---

## Detailed Task Breakdown

### Option B Tasks (Design Review)

| Section | Duration | Decision | Deadline |
|---------|----------|----------|----------|
| 1. Color System | 15 min | Warm gray palette approval | Day 1 AM |
| 2. Typography | 10 min | Font stack approval | Day 1 AM |
| 3. Particles | 15 min | Particle count/motion | Day 2 AM |
| 4. Layout | 15 min | Breakpoints & grid | Day 2 AM |
| 5. Accessibility | 15 min | WCAG compliance | Day 2 AM |
| 6. Animation | 10 min | Bloom/GSAP settings | Day 2 PM |
| 7. Theme | 10 min | Tidal Negation alignment | Day 2 PM |
| 8. Sign-Off | 10 min | Final approval | Day 2 PM |
| **Total B** | **100 min** | **Approval form complete** | **Day 2 PM** |

### Option C Tasks (Preparation)

| Phase | Duration | Deliverable | Deadline |
|-------|----------|-------------|----------|
| Domain + GitHub | 90 min | Repo created, 1st commit | Day 1 PM |
| PDF extraction | 60 min | 2 Sougwen images | Day 1 PM |
| Web download | 20 min | 2 Lauren images | Day 2 AM |
| Verification | 25 min | All 4 images verified | Day 2 AM |
| Compression | 130-160 min | All 4 compressed <2.2 MB | Day 2 PM |
| QR generation | 55 min | 4 QR codes tested | Day 3 AM |
| File organization | 20 min | docs/ structure ready | Day 3 PM |
| Path verification | 20 min | JSON paths correct | Day 3 PM |
| Git commit | 30 min | 2nd commit prepared | Day 3 PM |
| **Total C** | **490-520 min** | **All assets ready** | **Day 3 PM** |

---

## Success Criteria

### By End of Day 3, All Should Be Complete:

**✅ Specification (B):**
- [ ] SPEC_REVIEW_CHECKLIST.md 100% filled out
- [ ] Design approval decision documented
- [ ] Any modifications applied to DESIGN_SPEC.md
- [ ] RGB color system finalized

**✅ Preparation (C):**
- [ ] vulca.art domain registered
- [ ] GitHub repository created & initialized
- [ ] 4 artwork images: extracted, verified, compressed
- [ ] 4 QR codes: generated, tested, verified
- [ ] All files organized in correct directory structure
- [ ] Git commit prepared (not pushed)
- [ ] Ready to push on Monday morning

**✅ Combined (B+C):**
- [ ] Zero blockers for Week 1 Monday
- [ ] All planning documents complete
- [ ] All assets prepared and staged
- [ ] Approval clear and documented
- [ ] Team ready to execute Week 1 tasks

---

## Parallel Execution Timeline

```
DAY 1 (2-3 hours total)
│
├─ MORNING (90 min)
│  ├─ Task B: Spec review Sections 1-2 (25 min)
│  └─ Task C: Domain + GitHub setup (50 min)
│
└─ AFTERNOON (60 min)
   └─ Task C: PDF image extraction (60 min)

═══════════════════════════════════════════════════════════

DAY 2 (4-5 hours total)
│
├─ MORNING (120 min)
│  ├─ Task B: Spec review Sections 3-5 (45 min)
│  └─ Task C: Download images + verify (55 min)
│
└─ AFTERNOON (180 min)
   ├─ Task B: Spec review Sections 6-8 + sign-off (30 min)
   └─ Task C: Compression + WebP (130-160 min)

═══════════════════════════════════════════════════════════

DAY 3 (3-4 hours total)
│
├─ MORNING (90 min)
│  ├─ Task B: Final approval & documentation (30-60 min)
│  └─ Task C: QR code generation & testing (55 min)
│
└─ AFTERNOON (90-120 min)
   └─ Task C: File organization + git commit (90 min)

═══════════════════════════════════════════════════════════

TOTAL: ~10-12 hours over 3 days
PACE: Sustainable (3-4 hours/day)
READY: Monday morning for Week 1 execution
```

---

## What Happens After Day 3

### Monday Morning (Week 1, Day 1)

**Assuming B+C complete:**

1. **Push Git Commit** (5 min)
   ```bash
   git push origin main
   # Second commit now public: images + QR codes
   ```

2. **Review & Approval Confirmation** (5 min)
   - Confirm SPEC_REVIEW_CHECKLIST.md approval
   - Confirm PREPARATION_CHECKLIST.md complete

3. **Begin Week 1 Tasks** (8 hours)
   - Create `docs/css/_colors.css` with finalized RGB values
   - Create DESIGN_SPEC.md summary in CSS comments
   - GitHub Pages configuration (prep only)

4. **Daily Standup** (15 min)
   - Review Week 1 tasks
   - Identify any blocking issues
   - Plan rest of week

---

## Emergency Plan: If Not Complete by Sunday

**If B or C incomplete by end of Day 3:**

**Priority 1 (Must be done before Monday):**
- [ ] Design approval (either approved OR defer with notes)
- [ ] All 4 images compressed and verified
- [ ] Git repo ready (with or without images pushed)

**Priority 2 (Can extend to Monday morning):**
- [ ] QR codes (non-blocking, can add later in Week 1)
- [ ] WebP conversion (optional, nice-to-have)

**Priority 3 (Can defer to Week 2):**
- [ ] Advanced image optimization
- [ ] Fine-tuning design parameters

**Recovery Path:**
- Week 1 starts with core tasks
- Non-blocking items added during Week 2-3
- No impact to overall 4-week timeline

---

## Support & Questions

**During Days 1-3 Preparation:**

- **Image Quality Issues?**
  - Reference: IMAGE_ACQUISITION_GUIDE.md (detailed troubleshooting)
  - Upscaling: Use ImageMagick or Python PIL

- **Design Questions?**
  - Reference: DESIGN_SPEC.md (complete spec)
  - Reference: SPEC_REVIEW_CHECKLIST.md (decision form)

- **Git Issues?**
  - GitHub Help: https://docs.github.com/
  - Local git setup: `git config --global user.name "Your Name"`

- **Technical Blockers?**
  - Document in this plan's "Troubleshooting" section
  - May require adjustment to timeline

---

## Final Status Checklist

### Ready for Week 1 Monday Morning?

```
═══════════════════════════════════════════════════════════

DESIGN SPECIFICATION (Option B)
══════════════════════════════════════════════════════════

[ ] SPEC_REVIEW_CHECKLIST.md completely filled
[ ] All 8 sections reviewed and decisions made
[ ] Design approval form signed
[ ] RGB color values finalized: #_______
[ ] Modifications (if any) applied to DESIGN_SPEC.md
[ ] Contrast ratios verified (WCAG AA)

Status: [ ] COMPLETE [ ] NEEDS ATTENTION


PREPARATION & ASSETS (Option C)
══════════════════════════════════════════════════════════

Domain & Infrastructure:
[ ] vulca.art registered
[ ] GitHub repo created (vulca-exhibition)
[ ] Repo cloned locally
[ ] Initial scaffold commit pushed

Images:
[ ] 4 images extracted/downloaded
[ ] All ≥3000×2000px, RGB color space
[ ] All compressed to <2.2 MB
[ ] WebP versions created (optional)
[ ] Total size: ~7.8 MB
[ ] Files organized in docs/images/artworks/

QR Codes:
[ ] 4 QR codes generated
[ ] All tested and scannable
[ ] Correct colors (#1a1613 + #f5f2ed)
[ ] Files in docs/images/qrcodes/

Git:
[ ] Second commit prepared (images + QR codes)
[ ] All files staged correctly
[ ] Commit message ready
[ ] Ready to push Monday morning

Status: [ ] COMPLETE [ ] NEEDS ATTENTION


OVERALL PROJECT STATUS
══════════════════════════════════════════════════════════

[ ] Zero blockers identified
[ ] All prerequisites met
[ ] Team ready for Week 1 Monday
[ ] APPROVED TO PROCEED with FINAL_4WEEK_EXECUTION_PLAN.md

Date completed: __________________
Completed by: __________________
```

---

**🟢 Status:** Ready to execute B+C across 3 days
**⏰ Timeline:** 10-12 hours distributed over 3 days
**✅ Outcome:** Week 1 ready to launch Monday morning

Start **now** with Day 1 morning tasks! 🚀
