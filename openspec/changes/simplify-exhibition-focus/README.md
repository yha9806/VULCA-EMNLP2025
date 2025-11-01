# Proposal: Simplify Exhibition Platform - Pure Art Focus

## Quick Summary

**Status:** ✅ Proposal Complete & Ready for Review

**Change ID:** `simplify-exhibition-focus`

**Core Change:** Remove all exhibition planning documentation (budget tables, timelines, risk matrices, upgrade paths) and simplify process/about sections. Transform the website from a hybrid document into a pure art exhibition platform.

**Implementation Time:** 2-3 hours

**Files Modified:**
- `vulca-exhibition/index.html` (content deletions & simplifications)
- `vulca-exhibition/styles/components.css` (cleanup)
- `vulca-exhibition/styles/layout.css` (cleanup)

---

## What Gets Deleted

### Complete Removal
- ❌ "展览方案 · 实施规划" section (entire)
- ❌ Budget breakdown table (¥10,700 with itemized costs)
- ❌ "4周实施时间线" (4-week timeline)
- ❌ "升级路径" (3-phase upgrade options)
- ❌ "风险控制" (risk matrix)

### Substantial Condensing (60% reduction)
- ⚠️ "创作过程 · 负形关注" (500 → 200 words)
- ⚠️ "关于这个项目" (280 → 150-180 words)

### Unchanged (Core Experience)
- ✅ Hero section
- ✅ Exhibition experience (artwork + critique selection)
- ✅ 6 Cultural critics profiles
- ✅ All interaction elements

---

## Why This Change

### Problem Statement

The website currently serves **two conflicting purposes**:

1. **Art Exhibition Platform** (core identity)
   - User focus: 80% on artwork + critiques
   - Aesthetic: Minimalist, poetic, atmospheric

2. **Project Proposal Document** (competing content)
   - User focus: 0% (visitors ignore planning sections)
   - Aesthetic: Corporate, bureaucratic, distracting

### Artistic Philosophy

Sougwen Chung's aesthetic emphasizes:
- **Negative Space** (负形) - what's *hidden* is meaningful
- **Minimalism** - only essentials remain
- **Process Over Proposal** - show creativity, not logistics

Deleting planning documentation IS the design. Absence communicates intent.

---

## Implementation Checklist

See `tasks.md` for detailed task breakdown. Quick summary:

### Phase 1: Planning (30 min)
- [ ] Identify all HTML sections to delete
- [ ] Document affected CSS classes

### Phase 2: Content Deletion (45 min)
- [ ] Delete "展览方案" section
- [ ] Delete budget table
- [ ] Delete timeline
- [ ] Delete upgrade paths
- [ ] Delete risk control

### Phase 3: Simplification (60 min)
- [ ] Condense "创作过程" section (60%)
- [ ] Simplify "关于这个项目" section (40%)

### Phase 4: Validation (30 min)
- [ ] Test layout integrity
- [ ] Verify CSS cleanup
- [ ] Test responsive design
- [ ] Deploy and verify

### Phase 5: Git (15 min)
- [ ] Commit changes
- [ ] Push to GitHub

---

## Files in This Proposal

1. **proposal.md** - Executive summary & strategic rationale
2. **tasks.md** - Detailed implementation tasks (8 tasks, 82 total sub-items)
3. **design.md** - Design philosophy & aesthetic principles
4. **specs/exhibition-content/spec.md** - Technical requirements & scenarios
5. **README.md** - This file

---

## Success Criteria

After implementation, the website MUST satisfy:

1. **Completeness**
   - [ ] All planning documentation deleted (100%)
   - [ ] Process section condensed by 60%
   - [ ] About section simplified to 2 paragraphs

2. **Coherence**
   - [ ] Page flows naturally (Hero → Exhibition → Personas → Process → About)
   - [ ] No orphaned HTML or CSS
   - [ ] No broken links

3. **Aesthetics**
   - [ ] Embodied "负形" through content deletion
   - [ ] Generous spacing between sections
   - [ ] User experience feels meditative, not hurried

4. **UX Metrics**
   - [ ] User can engage with core experience in <30 seconds of landing
   - [ ] 30-40% overall word count reduction
   - [ ] Page loads <2 seconds on 3G

---

## Technical Notes

### No CSS Changes Required
- Design system already supports minimalist aesthetic
- No new breakpoints needed
- No new components required
- Only content deletions and text edits

### Responsive Design (Unchanged)
- Mobile (375px): Works with reduced content
- Tablet (768px): Enhanced breathing room
- Desktop (1024px): Clean, spacious layout
- Ultra-wide (1440px): Generous negative space

### Browser Compatibility (Unchanged)
- All major browsers supported
- No new CSS features introduced
- Existing polyfills apply

---

## Related Changes

**Archive:** Previous proposal (`rebuild-interactive-exhibition-platform`) - Phase 1 of initial exhibition platform build. This proposal refines the artistic vision by removing planning documentation.

**Status Transition:**
- Archive: Proposal → Implementation → Deployed
- New: Proposal (ready for stakeholder approval)

---

## Stakeholder Questions & Answers

**Q: Will we lose the project planning details?**
A: Details are archived in the OpenSpec proposal and git history. The website itself focuses on art. For stakeholder access, we can maintain a separate `/docs` page or offline documentation.

**Q: What if we need to communicate the budget to visitors?**
A: The budget was never relevant to art visitors. For stakeholders/sponsors, provide separate materials (PDF, email, internal docs).

**Q: Does this reduce SEO?**
A: Intentionally—this is an art platform, not a marketing site. Content focus improves search relevance for "art exhibition" over "exhibition planning."

**Q: Can we add the planning sections back later?**
A: Yes—Git history preserves all deleted content. If requirements change, restoration is straightforward.

---

## Next Steps

1. **Stakeholder Review** - Present this proposal to decision-makers
2. **Approval** - Confirm alignment with artistic vision
3. **Implementation** - Execute tasks.md (2-3 hours)
4. **Testing** - Validate on https://vulcaart.art
5. **Deployment** - Push to GitHub Pages

---

## Document Status

**Version:** 1.0
**Created:** 2025-11-01
**Status:** Ready for Stakeholder Approval

**Next Action:** Review with user, obtain approval, begin Phase 1 implementation

---

*This proposal represents a strategic shift from treating vulcaart.art as a project documentation site to treating it as an art experience itself. The changes embody Sougwen Chung's aesthetic philosophy of negative space and intentional absence.*
