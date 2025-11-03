# Tasks: Refocus Subpages on VULCA System

## Overview

Rewrite content in 3 HTML subpages to focus on VULCA experimental system, remove website design descriptions, and fully localize to Chinese.

**Total Estimated Time**: 4-6 hours

---

## Phase 1: Localization (30 minutes)

### Task 1.1: Localize RPAIT Dimensions in critics.html
**File**: `pages/critics.html`
**Lines**: 111-115

**Change**:
- `R (Representation) - 代表性` → `R - 代表性`
- `P (Philosophy) - 哲学性` → `P - 哲学性`
- Similar for A, I, T

**Validation**:
- [ ] No English in RPAIT dimension labels
- [ ] Descriptions remain unchanged

**Time**: 15 min

---

### Task 1.2: Localize RPAIT Framework Cards in about.html
**File**: `pages/about.html`
**Lines**: 56-79

**Change**: Remove English from `<h3>` tags in framework cards

**Validation**:
- [ ] All 5 framework cards use pure Chinese headers
- [ ] Card content remains descriptive

**Time**: 15 min

---

## Phase 2: Remove Website Design Content (30 minutes)

### Task 2.1: Delete "展览特色" Section from about.html
**File**: `pages/about.html`
**Lines**: 83-92

**Action**: Delete entire `<section class="content-section">` with h2 "展览特色"

**Validation**:
- [ ] Section removed
- [ ] No orphan HTML tags
- [ ] Page structure intact

**Time**: 10 min

---

### Task 2.2: Delete Sections 4-7 from process.html
**File**: `pages/process.html`
**Lines**: 77-118

**Action**: Delete 4 sections:
- Section 4: 展览策划与设计
- Section 5: 详细内容页面
- Section 6: 技术实现
- Section 7: 观众体验设计

**Validation**:
- [ ] 4 sections removed
- [ ] Only Sections 1-3 remain
- [ ] Footer intact

**Time**: 20 min

---

## Phase 3: Add System-Focused Content (3-4 hours)

### Task 3.1: Rewrite about.html with System Focus
**File**: `pages/about.html`

**New Sections to Write**:

1. **VULCA 系统简介**
   - What is VULCA (AI art critique experimental system)
   - Research approach (AI role-playing historical critics)
   - Scale (6 critics × 4 artworks × 5 dimensions)

2. **研究目标**
   - Cross-temporal art critique exploration
   - RPAIT framework validation
   - AI persona fidelity research

3. **系统架构**
   - AI评论家角色系统 (critic persona modeling)
   - RPAIT评论框架 (5-dimensional framework)
   - 评论生成管道 (generation pipeline)

4. **研究意义**
   - Academic contributions
   - Application scenarios

**Validation**:
- [ ] 4 new sections added
- [ ] Content focuses on system, not website
- [ ] Pure Chinese throughout

**Time**: 2 hours

---

### Task 3.2: Rewrite process.html with System Development Focus
**File**: `pages/process.html`

**Sections to Rewrite** (replace current Sections 1-3):

1. **研究设计**
   - RPAIT framework design rationale
   - Critic selection methodology
   - Artwork curation approach

2. **评论家角色建模**
   - Historical text analysis
   - Persona characteristic extraction
   - AI role-playing implementation

3. **评论生成系统**
   - AI generation pipeline (expand current Section 3)
   - Human-in-the-loop editing process
   - RPAIT scoring methodology

4. **数据标注与验证**
   - Historical accuracy verification
   - Inter-rater reliability testing
   - Expert review process

5. **系统实验与分析** (optional)
   - Experimental findings (if available)
   - System performance metrics

**Validation**:
- [ ] 5 sections with system development focus
- [ ] No website design descriptions
- [ ] Pure Chinese

**Time**: 2 hours

---

## Phase 4: Review and Polish (1 hour)

### Task 4.1: Cross-Page Consistency Check

**Validation**:
- [ ] Consistent terminology (评论家角色, RPAIT框架, 生成系统)
- [ ] No contradictions between pages
- [ ] Logical flow: critics (who) → about (what) → process (how)

**Time**: 30 min

---

### Task 4.2: Final Content Review

**Validation**:
- [ ] No English except VULCA/RPAIT
- [ ] No website design keywords (幽灵UI, 响应式, 性能优化, etc.)
- [ ] Content helps audience understand VULCA system
- [ ] Grammar and readability check

**Time**: 30 min

---

## Summary

**Total Tasks**: 8 tasks
**Total Time**: 4-6 hours
**Risk**: Low (HTML content only, no code changes)

---

**Tasks Status**: Draft
**Created**: 2025-11-03
