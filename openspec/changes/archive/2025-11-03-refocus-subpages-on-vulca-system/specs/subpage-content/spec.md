# Spec: Subpage Content Refocusing

## MODIFIED Requirements

### Requirement: Pure Chinese Localization

**Identifier**: `subpage-content-localization`

All subpage content SHALL be in pure Chinese, with no English text except proper nouns (VULCA, RPAIT).

#### Scenario: RPAIT Dimensions Display in Chinese Only

**Given** the user visits critics.html or about.html
**When** viewing the RPAIT framework explanation
**Then** dimension labels SHALL display as "R - 代表性" not "R (Representation) - 代表性"
**And** no English words appear in dimension descriptions

**Validation**:
```bash
# Check for English in RPAIT sections
rg "\(Representation\)|\(Philosophy\)|\(Aesthetics\)|\(Interpretation\)|\(Technique\)" pages/*.html
# Expected: No matches
```

---

### Requirement: System-Focused Content

**Identifier**: `subpage-content-system-focus`

All subpage content SHALL focus on the VULCA experimental system design and development, not website implementation.

#### Scenario: About Page Describes System, Not Website

**Given** the user visits pages/about.html
**When** reading the page content
**Then** sections SHALL describe:
  - VULCA系统简介 (system introduction)
  - 研究目标 (research objectives)
  - 系统架构 (system architecture)
**And** sections SHALL NOT describe:
  - 沉浸式设计 (immersive design)
  - 幽灵UI美学 (ghost UI aesthetics)
  - 响应式体验 (responsive experience)

**Validation**:
```bash
# Check for website design keywords
rg "幽灵UI|响应式|性能优化|跨浏览器|WCAG|可访问性" pages/about.html pages/process.html
# Expected: No matches
```

---

### Requirement: Process Page Describes System Development

**Identifier**: `subpage-content-process-system`

The process.html page SHALL describe the VULCA system development process, not website creation process.

#### Scenario: Process Page Focuses on Research and Development

**Given** the user visits pages/process.html
**When** reading section headings
**Then** headings SHALL include:
  - 研究设计
  - 评论家角色建模
  - 评论生成系统
  - 数据标注与验证
**And** headings SHALL NOT include:
  - 展览策划与设计
  - 技术实现
  - 观众体验设计

---

## REMOVED Requirements

### Requirement: Website Design Descriptions

**Identifier**: `subpage-content-website-descriptions`

Subpages SHALL NOT contain descriptions of website design, UI/UX, or web technology.

**Removed Content Examples**:
- "自动播放的艺术作品展示，防止滚动打断"
- "高透明度、模糊效果的界面设计"
- "从375px手机到2560px超宽屏的完美适配"
- "快速加载、流畅动画、无缝交互"

---

**Spec Status**: Draft
**Created**: 2025-11-03
