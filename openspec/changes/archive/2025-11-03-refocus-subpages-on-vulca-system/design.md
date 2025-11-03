# Design: Refocus Subpages on VULCA System

## Overview

This is a content-focused change with no architectural or code modifications. We are rewriting HTML content in three subpages to:
1. Remove all English (pure Chinese)
2. Remove website design descriptions
3. Focus on VULCA experimental system

---

## Key Design Decisions

### Decision 1: Complete Content Replacement vs. Incremental Edits

**Options**:
- A. Edit existing sections incrementally
- **B. Replace sections wholesale with new system-focused content**

**Decision**: **B. Replace wholesale** ✅

**Rationale**:
- Current "展览特色" and "技术实现" sections are 100% about website design
- Cannot salvage this content - needs complete rewrite
- Cleaner to delete and rewrite than try to patch

---

### Decision 2: Page Roles

**Critics Page (critics.html)**:
- Role: "Who are the critics?"
- Keep structure, only localize (R (Representation) → R - 代表性)

**About Page (about.html)**:
- **Before**: Generic "about the exhibition"
- **After**: "What is VULCA system?" (system introduction)
- New sections: 系统简介, 研究目标, 系统架构, 研究意义

**Process Page (process.html)**:
- **Before**: "Creation to exhibition" (mixed system + website)
- **After**: "How was the system developed?" (pure system development)
- New sections: 研究设计, 角色建模, 生成系统, 数据验证, 系统实验

---

### Decision 3: Content Depth vs. Brevity

**Challenge**: User wants "详细但是同时要整合到一起，去掉过多的冗余解释"

**Strategy**:
- **Detail where it matters**: System architecture, critique generation pipeline, validation methodology
- **Remove redundancy**: Don't re-explain RPAIT in every page, link back to primary explanation
- **Consolidate**: Merge "艺术作品创作" + "评论家选择" → "研究设计"

---

## Content Structure

### about.html (New Structure)

```
1. VULCA 系统简介
   - What: AI-powered multi-perspective art critique system
   - Why: Research on historical critics' perspectives via AI
   - How: 6 AI critics × 4 artworks × 5 RPAIT dimensions

2. 研究目标
   - Explore cross-temporal art critique
   - Validate RPAIT framework for structured critique
   - Study AI role-playing fidelity to historical personas

3. 系统架构
   - AI评论家角色系统
   - RPAIT评论框架
   - 评论生成管道

4. 研究意义
   - Academic contribution
   - Application scenarios
```

### process.html (New Structure)

```
1. 研究设计
   - RPAIT framework design
   - Critic selection methodology
   - Artwork curation

2. 评论家角色建模
   - Historical text analysis
   - Persona characteristics
   - AI role-playing approach

3. 评论生成系统
   - AI generation pipeline
   - Human-in-the-loop editing
   - RPAIT scoring process

4. 数据标注与验证
   - Historical accuracy check
   - Inter-rater reliability
   - Expert review

5. 系统实验与分析
   - (Optional, if research findings available)
```

---

## Implementation Notes

- **No CSS changes**: Only HTML content
- **No JS changes**: No code modifications
- **Pure HTML text replacement**: Safe, low-risk change

---

**Design Status**: Draft
**Created**: 2025-11-03
