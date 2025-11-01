# OpenSpec Tasks: simplify-exhibition-focus

**Change ID:** `simplify-exhibition-focus`

**Total Tasks:** 8

**Estimated Duration:** 2-3 hours

**Dependencies:** Phase 1 implementation (design system, layouts complete)

---

## Phase 1: Content Analysis & Planning (30 min)

### Task 1.1: Identify all HTML sections to delete
**Description:** Audit index.html to locate all exhibition planning sections
**Acceptance Criteria:**
- [ ] Locate "展览方案 · 实施规划" section and mark for deletion
- [ ] Locate budget table markup and mark for deletion
- [ ] Locate timeline section (4周实施时间线) and mark for deletion
- [ ] Locate upgrade path sections and mark for deletion
- [ ] Locate risk control section and mark for deletion
- [ ] Document all affected HTML element IDs and classes in a checklist

**Validation:** Review HTML file, create deletion checklist (can be Markdown file or inline comments)

---

## Phase 2: Content Deletion (45 min)

### Task 2.1: Delete exhibition plan HTML section
**Description:** Remove entire "展览方案" section from index.html
**Acceptance Criteria:**
- [ ] Locate `<section id="exhibition-plan">` (or similar)
- [ ] Delete entire section and children
- [ ] Remove any related CSS classes from stylesheet
- [ ] Verify no orphaned styles remain for this section
- [ ] Test: HTML validates without errors

**Files Modified:**
- `vulca-exhibition/index.html` (main deletion)
- `vulca-exhibition/styles/layout.css` (cleanup if necessary)
- `vulca-exhibition/styles/components.css` (cleanup if necessary)

**Validation:** `npx html-validate index.html` or manual check

---

### Task 2.2: Delete budget and financial content
**Description:** Remove budget table, cost breakdown, and financial details
**Acceptance Criteria:**
- [ ] Delete budget table markup (thead/tbody)
- [ ] Delete all `<td>` cells containing prices (¥, CNY)
- [ ] Delete "详细预算明细" heading and container
- [ ] Remove any styles targeting .budget, .price, .cost classes
- [ ] Verify table-related CSS is no longer used

**Files Modified:**
- `vulca-exhibition/index.html`
- `vulca-exhibition/styles/components.css` (table styles)

**Validation:** No table elements remain in exhibition plan area

---

### Task 2.3: Delete timeline section
**Description:** Remove "4周实施时间线" section with all timeline content
**Acceptance Criteria:**
- [ ] Locate timeline section (4-week plan container)
- [ ] Delete entire section including:
  - All 4 timeline phase cards
  - Timeline layout containers
  - Timeline-specific CSS classes
- [ ] Remove timeline-related styles from CSS
- [ ] Verify no broken layout remains

**Files Modified:**
- `vulca-exhibition/index.html`
- `vulca-exhibition/styles/layout.css` (grid/flex for timeline)

**Validation:** Page renders correctly without white space gaps

---

### Task 2.4: Delete upgrade paths section
**Description:** Remove "升级路径" with all 3 upgrade phases
**Acceptance Criteria:**
- [ ] Delete "升级路径" heading
- [ ] Delete all 3 phase boxes (第一阶段升级, 第二阶段升级, 终极版本)
- [ ] Remove upgrade-path CSS classes
- [ ] Clean up any orphaned container styles

**Files Modified:**
- `vulca-exhibition/index.html`
- `vulca-exhibition/styles/layout.css`
- `vulca-exhibition/styles/components.css`

**Validation:** No upgrade-related text or containers visible

---

### Task 2.5: Delete risk control section
**Description:** Remove "风险控制" with all risk matrix content
**Acceptance Criteria:**
- [ ] Delete "风险控制" heading
- [ ] Delete all 4 risk cards (印刷色差, API超额, 网站崩溃, 现场网络)
- [ ] Remove risk-related CSS
- [ ] Verify layout integrity

**Files Modified:**
- `vulca-exhibition/index.html`
- `vulca-exhibition/styles/layout.css`
- `vulca-exhibition/styles/components.css`

**Validation:** No risk-related content visible; page flows naturally to next section

---

## Phase 3: Content Simplification (60 min)

### Task 3.1: Condense "创作过程" section
**Description:** Reduce Process section text by ~60% while retaining artistic value
**Acceptance Criteria:**
- [ ] Current text identified (4 subsections: Conceptual, Design, Research, Technology)
- [ ] Each subsection reduced to 1-2 sentences max (from current 3-4)
- [ ] Key concepts retained (explain "why" not "what")
- [ ] Artistic/meta value preserved
- [ ] Target word count: ~200 words (from ~500 words)

**Content Changes Example:**
- Before: "从初始想法到完整框架的演变。如何将"潮汐的负形"这一主题转化为互动体验。" (25 words)
- After: "从想法到框架的演变与转化过程。" (12 words)

**Acceptance Criteria (Additional):**
- [ ] All 4 process concepts still mentioned
- [ ] Metaphorical language maintained
- [ ] No change to HTML structure (only text content)

**Files Modified:**
- `vulca-exhibition/index.html` (text nodes only)

**Validation:** Read condensed text - flows naturally, retains meaning

---

### Task 3.2: Simplify "关于这个项目" section
**Description:** Reduce About section from 4 paragraphs to 2 key paragraphs
**Acceptance Criteria:**
- [ ] Paragraph 1: What is VULCA + what is vulcaart.art (combined)
- [ ] Paragraph 2: The aesthetic philosophy + meaning (核心概念)
- [ ] Remove: Background explanation of "潮汐的负形" breakdown (redundant)
- [ ] Remove: "设计上，我们以Sougwen Chung..." design explanation
- [ ] Retain: "通过AI、艺术和文化的交集..." closing statement
- [ ] Target length: ~150-180 words (from ~280 words)

**Files Modified:**
- `vulca-exhibition/index.html` (text only)

**Validation:** About section still provides context without excessive explanation

---

## Phase 4: Validation & Testing (30 min)

### Task 4.1: Verify page structure and layout
**Description:** Ensure page renders correctly after all deletions
**Acceptance Criteria:**
- [ ] Page loads without console errors
- [ ] No broken sections or orphaned styles
- [ ] Navigation still works (all links functional)
- [ ] Responsive design maintains integrity on mobile/tablet/desktop
- [ ] Visual spacing looks intentional (no awkward gaps)

**Validation Method:**
- [ ] Open DevTools, check for errors
- [ ] Test responsive viewports (375px, 768px, 1024px, 1440px)
- [ ] Verify anchor links (#exhibition, #personas, #process, #about) work

**Files to Check:**
- `vulca-exhibition/index.html`
- `vulca-exhibition/styles/main.css` (compiled from all CSS files)
- Browser console (F12)

---

### Task 4.2: Verify content hierarchy and flow
**Description:** Confirm remaining sections create coherent user journey
**Acceptance Criteria:**
- [ ] Hero section invites user to experience
- [ ] Exhibition section leads naturally to artwork selection
- [ ] Personas section provides critic context
- [ ] Process section (shortened) offers meta-artistic reflection
- [ ] About section concludes with project meaning
- [ ] Each section is roughly proportional to time user will spend there

**Validation:** Read through page as first-time user - does it flow logically?

---

### Task 4.3: Verify CSS cleanup (no orphaned styles)
**Description:** Ensure deleted sections don't leave orphaned CSS rules
**Acceptance Criteria:**
- [ ] Search CSS files for class names from deleted sections
- [ ] Remove any unused CSS classes (e.g., .budget-table, .timeline, .upgrade-path, .risk-control)
- [ ] Verify no empty style rules remain
- [ ] Test CSS file compiles without errors (if using build tool)

**Files to Check:**
- `vulca-exhibition/styles/variables.css`
- `vulca-exhibition/styles/layout.css`
- `vulca-exhibition/styles/components.css`
- `vulca-exhibition/styles/aesthetic.css`
- `vulca-exhibition/styles/responsive.css`

**Validation:** Grep for class names, confirm no matches after cleanup

---

### Task 4.4: Test on live site
**Description:** Deploy changes and verify vulcaart.art displays correctly
**Acceptance Criteria:**
- [ ] Push git commit with all deletions
- [ ] GitHub Pages rebuilds (2-5 min)
- [ ] Visit https://vulcaart.art in browser
- [ ] All sections load and render correctly
- [ ] Mobile version responsive (test on actual device or DevTools)
- [ ] No 404 errors or missing assets

**Validation:** Visual inspection of deployed site

---

## Phase 5: Git Commit (15 min)

### Task 5.1: Create atomic git commit
**Description:** Stage and commit all changes with clear message
**Acceptance Criteria:**
- [ ] Stage all modified files: `git add .`
- [ ] Commit message captures scope (content simplification, section deletions)
- [ ] Commit includes reference to this proposal
- [ ] Push to remote: `git push origin main`
- [ ] Verify GitHub shows new commit in main branch

**Commit Message Template:**
```
Content Simplification: Remove Exhibition Planning Sections

- Delete "展览方案 · 实施规划" section entirely
- Remove budget table, timeline, upgrade paths, risk control
- Condense "创作过程" section by 60%
- Simplify "关于这个项目" to 2 key paragraphs
- Maintain core artwork + critique experience
- Embody "负形" aesthetic through content deletion

Implements proposal: simplify-exhibition-focus

Change ID: simplify-exhibition-focus
```

**Files Affected:**
- `vulca-exhibition/index.html` (-2000+ chars of content, -500 lines of HTML)
- `vulca-exhibition/styles/components.css` (cleanup of budget/timeline styles)
- `vulca-exhibition/styles/layout.css` (cleanup of timeline/upgrade grid layouts)

---

## Parallel vs Sequential

**Can be done in parallel:**
- Task 2.1-2.5 (all deletions) - independent, any order
- Task 3.1-3.2 (simplifications) - independent, after Task 2 complete
- Task 4.1-4.3 (validation) - after Task 3 complete
- Task 4.4 (live testing) - after Task 5.1 (deploy)

**Must be sequential:**
1. Phase 1 Planning (informational, 1 task)
2. Phase 2 Deletions (5 tasks, can be parallel)
3. Phase 3 Simplification (2 tasks, can be parallel)
4. Phase 4 Validation (4 tasks, should be sequential for clarity)
5. Phase 5 Commit (1 task, final step)

---

## Suggested Execution Timeline

**Option A: Single Session (2-3 hours)**
```
30 min - Planning (Task 1.1)
45 min - Deletions (Tasks 2.1-2.5 in parallel)
60 min - Simplification + Validation (Tasks 3.1-4.4)
15 min - Git + Deploy (Task 5.1)
```

**Option B: Split Over 2 Sessions**
```
Session 1 (60 min): Planning + Deletions (Tasks 1.1-2.5)
Session 2 (60 min): Simplification + Validation + Deploy (Tasks 3.1-5.1)
```

---

## Validation Checklist (After All Tasks Complete)

- [ ] No console errors in DevTools
- [ ] All 5 remaining sections visible and well-spaced
- [ ] Mobile responsive (375px viewport)
- [ ] Tablet responsive (768px viewport)
- [ ] Desktop responsive (1024px viewport)
- [ ] Ultra-wide responsive (1440px viewport)
- [ ] All navigation links work
- [ ] No orphaned CSS classes
- [ ] Page loads <2s on 3G connection
- [ ] vulcaart.art displays correctly (live deployment)
- [ ] Git commit pushed successfully

---

**Total Story Point Estimate:** 13 (1 point = 15-20 min)
- Planning: 2 pts
- Deletions: 4 pts
- Simplification: 3 pts
- Validation: 3 pts
- Git/Deploy: 1 pt

**Effort:** 2-3 hours for experienced developer, 3-4 hours for first-time

---

**Document Version:** 1.0
**Created:** 2025-11-01
**Status:** Ready for Execution
