# Proposal: Refocus Subpages on VULCA Experimental System

## Why

### Problem Statement

The three subpages (critics.html, about.html, process.html) currently suffer from three critical issues that dilute the focus on the VULCA experimental system:

1. **Mixed Chinese-English Content**
   - **critics.html**: RPAIT dimensions display as `R (Representation) - 代表性`, `P (Philosophy) - 哲学性`, etc.
   - **about.html**: Framework cards show `R - 代表性 (Representation)`, mixing languages
   - **Inconsistency**: Main gallery is pure Chinese, but detail pages mix languages
   - **User requirement**: "内容要全部为中文" (all content should be in Chinese)

2. **Excessive Website Design Descriptions**
   - **about.html** Section "展览特色":
     - "沉浸式设计 - 自动播放的艺术作品展示，防止滚动打断"
     - "幽灵UI美学 - 高透明度、模糊效果的界面设计"
     - "浮动实验布局 - 图片占主导，评论和数据在周围浮动"
     - "响应式体验 - 从手机到桌面的无缝适配"

   - **process.html** Sections 4, 5, 6, 7:
     - Section 4: "沉浸式设计", "自动播放逻辑", "幽灵UI美学", "信息层级"
     - Section 5: "详细内容页面" (describes website structure)
     - Section 6: "技术实现" (pure web technology: 响应式设计, 性能优化, 可访问性, 跨浏览器兼容)
     - Section 7: "观众体验设计" (website UX design)

   - **User feedback**: "去掉过多的冗余解释，而是专注于vulca实验的系统设计与开发，而不是网站设计等无意义的内容描述"

3. **Lack of System-Focused Content**
   - Current content describes *what the website looks like*, not *what VULCA system is*
   - Missing depth on:
     - Research objectives and methodology
     - AI critic role modeling approach
     - RPAIT framework design rationale
     - Critique generation pipeline
     - System validation and evaluation
   - **User requirement**: "专注于vulca实验的系统设计与开发" (focus on VULCA experimental system design and development)
   - **Purpose**: "目的是为了让观众看明白" (so the audience understands)

### Impact

**Audience Confusion**:
- ❌ Visitors cannot understand what VULCA system actually is
- ❌ Content reads like a website portfolio, not an experimental system documentation
- ❌ Mixed languages create cognitive friction

**Misaligned Focus**:
- ❌ 60% of process.html content describes website implementation
- ❌ about.html "展览特色" lists UI design features, not research features
- ❌ Missing critical information: How are AI critics modeled? How is critique generated? What's the research value?

**Scope**:
- Affects: 3 HTML subpages (pages/critics.html, pages/about.html, pages/process.html)
- Lines: ~400 lines of content need rewriting
- Sections: 10+ sections need restructuring or removal

---

## What Changes

Refocus all three subpages on the VULCA experimental system itself, removing website design descriptions and fully localizing to Chinese.

### Before vs. After Structure

#### critics.html (评论家)

**Before**:
- Page title: "评论家"
- RPAIT dimensions: `R (Representation) - 代表性` (mixed language)

**After**:
- Page title: "评论家" (unchanged)
- RPAIT dimensions: `R - 代表性` (pure Chinese)
- Keep structure, only localize content

#### about.html (关于)

**Before**:
```
1. 项目愿景 (generic description)
2. RPAIT 评论框架 (OK, but mixed language)
3. 展览特色 (website design features) ❌
4. 联系我们 (contact)
```

**After**:
```
1. VULCA 系统简介 (What is VULCA system?)
2. 研究目标 (Research objectives)
3. 系统架构 (System architecture: AI critics, RPAIT framework, generation pipeline)
4. 研究意义 (Academic value and significance)
```

#### process.html (过程)

**Before**:
```
1. 艺术作品创作 (OK)
2. 评论家选择与框架设计 (OK)
3. 评论生成 (OK, but too brief)
4. 展览策划与设计 (website design) ❌
5. 详细内容页面 (website structure) ❌
6. 技术实现 (web technology) ❌
7. 观众体验设计 (website UX) ❌
```

**After**:
```
1. 研究设计 (Research design and RPAIT framework)
2. 评论家角色建模 (AI critic persona modeling)
3. 评论生成系统 (Critique generation pipeline)
4. 数据标注与验证 (Data labeling and validation)
5. 系统实验与分析 (System experiments and findings)
```

### Content Transformation Examples

#### Example 1: RPAIT Dimensions (critics.html + about.html)

**Before**:
```html
<li><strong>R (Representation)</strong> - 代表性：作品对现实或观念的呈现方式</li>
```

**After**:
```html
<li><strong>R - 代表性</strong>：作品对现实或观念的呈现方式</li>
```

#### Example 2: About Page "展览特色" Section (about.html)

**Before** (Section 3, ~8 items about website design):
```html
<section class="content-section">
  <h2>展览特色</h2>
  <ul class="feature-list">
    <li><strong>沉浸式设计</strong> - 自动播放的艺术作品展示，防止滚动打断，创造完全沉浸的视觉体验</li>
    <li><strong>幽灵UI美学</strong> - 高透明度、模糊效果的界面设计，让艺术作品成为绝对主体</li>
    <li><strong>响应式体验</strong> - 从手机到桌面的无缝适配，随处随时可访问</li>
    ...
  </ul>
</section>
```

**After** (Replace with system-focused content):
```html
<section class="content-section">
  <h2>系统架构</h2>
  <div class="system-architecture">
    <h3>AI评论家角色系统</h3>
    <p>VULCA使用基于历史评论家的AI角色模型，每位评论家根据其历史背景、理论传统和美学观点生成评论。系统包含6位跨越千年的评论家，从北宋美学家到当代AI伦理学家。</p>

    <h3>RPAIT评论框架</h3>
    <p>五维评论框架为评论提供结构化分析：代表性、哲学性、美学性、诠释性、技巧性。每个维度使用1-10分量化评分，确保评论的系统性和可比性。</p>

    <h3>评论生成管道</h3>
    <p>系统通过AI语言模型生成初始评论，结合评论家的历史文本和理论框架，再经过人工审核和编辑，确保历史准确性和理论严谨性。</p>
  </div>
</section>
```

#### Example 3: Process Page Section 6 "技术实现" (process.html)

**Before** (Pure web technology):
```html
<section class="content-section">
  <h2>6. 技术实现</h2>
  <p>VULCA采用现代Web技术，实现跨平台的无缝体验。</p>
  <ul class="process-list">
    <li><strong>响应式设计</strong> - 从375px手机到2560px超宽屏的完美适配</li>
    <li><strong>性能优化</strong> - 快速加载、流畅动画、无缝交互</li>
    <li><strong>可访问性</strong> - WCAG 2.1 AA标准，确保所有用户都能使用</li>
    <li><strong>跨浏览器兼容</strong> - 支持Chrome、Firefox、Safari、Edge等主流浏览器</li>
  </ul>
</section>
```

**After** (System validation):
```html
<section class="content-section">
  <h2>4. 数据标注与验证</h2>
  <p>为确保VULCA系统生成的评论质量，我们采用多层验证机制。</p>
  <ul class="process-list">
    <li><strong>历史准确性验证</strong> - 对比评论家的历史文本和理论著作，确保AI生成的评论符合其思想传统</li>
    <li><strong>RPAIT评分一致性</strong> - 多位研究人员独立评分，计算评分者间信度，确保评分标准的一致性</li>
    <li><strong>专家审核</strong> - 艺术史和美学专家审核评论内容，确保学术严谨性</li>
    <li><strong>系统性能评估</strong> - 评估生成速度、评论质量、框架覆盖度等系统性能指标</li>
  </ul>
</section>
```

### Success Criteria

**Must Have (P0)**:
- ✅ All English content removed, pure Chinese throughout all subpages
- ✅ All website design descriptions removed (沉浸式设计, 幽灵UI, 响应式体验, etc.)
- ✅ All web technology descriptions removed (性能优化, 跨浏览器兼容, etc.)
- ✅ New system-focused content added (系统架构, 评论生成管道, 数据验证, etc.)
- ✅ Content helps audience understand "what VULCA system is" and "how it works"

**Should Have (P1)**:
- ✅ Consistent terminology across all pages (e.g., "评论家角色建模", "RPAIT框架", "评论生成系统")
- ✅ Logical information architecture: critics.html (who), about.html (what), process.html (how)
- ✅ Reduced redundancy: don't repeat RPAIT explanations multiple times

**Nice to Have (P2)**:
- ✅ Add visual diagrams (system architecture, generation pipeline)
- ✅ Add research metrics or findings (if available)

---

## Dependencies & Sequencing

### Prerequisites

**None** - This is a pure content rewrite with no code dependencies.

### Validation

**Content Review Checklist**:
- [ ] No English words remain (except proper nouns: VULCA, RPAIT)
- [ ] No website design descriptions (UI, UX, responsive, performance)
- [ ] All content focuses on VULCA system, not website implementation
- [ ] Audience can understand: What is VULCA? How does it work? Why is it important?

---

## How to Implement

### Phase 1: Localization (Pure Chinese)

#### Task 1.1: Localize critics.html
**File**: `pages/critics.html`
**Lines**: 111-115 (RPAIT dimension list)

**Change**:
```html
<!-- Before -->
<li><strong>R (Representation)</strong> - 代表性：...</li>
<li><strong>P (Philosophy)</strong> - 哲学性：...</li>

<!-- After -->
<li><strong>R - 代表性</strong>：...</li>
<li><strong>P - 哲学性</strong>：...</li>
```

#### Task 1.2: Localize about.html
**File**: `pages/about.html`
**Lines**: 56-79 (Framework cards)

**Change**: Remove English from `<h3>` tags

---

### Phase 2: Remove Website Design Content

#### Task 2.1: Delete "展览特色" section (about.html)
**File**: `pages/about.html`
**Lines**: 83-92

**Action**: Delete entire section

#### Task 2.2: Delete sections 4-7 (process.html)
**File**: `pages/process.html`
**Lines**: 77-118

**Action**: Delete 4 sections:
- Section 4: 展览策划与设计
- Section 5: 详细内容页面
- Section 6: 技术实现
- Section 7: 观众体验设计

---

### Phase 3: Add System-Focused Content

#### Task 3.1: Rewrite about.html with system focus
**Sections to add**:
1. VULCA 系统简介
2. 研究目标
3. 系统架构
4. 研究意义

#### Task 3.2: Rewrite process.html with system development focus
**Sections to replace**:
1. 研究设计 (replace Section 1-2, consolidate)
2. 评论家角色建模 (new content)
3. 评论生成系统 (expand Section 3)
4. 数据标注与验证 (replace Section 6)
5. 系统实验与分析 (new content, replace Section 7)

---

## Timeline Estimate

**Total Time**: 4-6 hours

| Phase | Tasks | Time | Notes |
|-------|-------|------|-------|
| Phase 1: Localization | 2 tasks | 30 min | Simple text replacement |
| Phase 2: Remove website content | 2 tasks | 30 min | Deletion only |
| Phase 3: Rewrite with system focus | 2 tasks | 3-4 hours | Content creation |
| Testing & Review | - | 1 hour | Read-through, consistency check |

---

## Alternatives Considered

### Alternative 1: Keep mixed language

**Description**: Keep `R (Representation) - 代表性` format for international audience

**Verdict**: ❌ Rejected - User explicitly requested pure Chinese, main gallery is already pure Chinese

### Alternative 2: Keep website design content

**Description**: Keep UI/UX descriptions as part of "project features"

**Verdict**: ❌ Rejected - User explicitly requested removing "网站设计等无意义的内容描述"

### Alternative 3: Separate "system" and "website" pages

**Description**: Create new pages for system documentation, keep current pages for website info

**Verdict**: ❌ Rejected - Over-complicated, current 3-page structure is good, just need refocusing

---

## Related Work

**User Request**:
- "现在要优化一下'主页面'以外的'子页面'的内容"
- "首先是内容要全部为中文"
- "去掉过多的冗余解释，而是专注于vulca实验的系统设计与开发，而不是网站设计等无意义的内容描述"
- "目的是为了让观众看明白"

**Impact**: This refocusing will make VULCA's research value and system design clear to the audience, rather than appearing as a website portfolio.

---

**Proposal Status**: Draft
**Created**: 2025-11-03
**Author**: Claude (via user request with "ultrathink" mode)
**Complexity**: Medium (Content rewriting, no code changes)
**Priority**: High (P0 - User-requested improvement for audience understanding)
