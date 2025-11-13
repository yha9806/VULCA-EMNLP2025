# Master 分支剩余任务总结

**生成时间**: 2025-11-04
**分支**: master
**已归档**: 6 个变更

---

## 📊 活跃变更概览

| 变更 ID | 状态 | 预估时间 | 优先级 |
|---------|------|---------|--------|
| `implement-full-site-bilingual-support` | 9/128 tasks (7%) | 17.5 小时 | 高 |
| `localize-critics-page-and-optimize-layout` | 0/42 tasks (0%) | 6 小时 | 中 |
| `add-critic-dialogue-and-thought-chain` | 在 feature 分支开发 | - | 高 |

---

## 1️⃣ implement-full-site-bilingual-support

**目标**: 建立完整的双语网站系统

**当前状态**: 9/128 tasks (7% 完成)
**预估时间**: 17.5 小时
**优先级**: 高

### 问题描述

网站已经实现了**部分双语支持**：
- ✅ 语言切换按钮
- ✅ 动态内容（作品标题、评论、评论家姓名）
- ✅ 数据层双语支持
- ✅ 主页 Hero 标题和图表标签（已归档）

**缺失的内容**：
- ❌ **静态页面文字**（全部中文）:
  - `pages/about.html` - 关于 VULCA、RPAIT 框架说明（~800字）
  - `pages/critics.html` - 评论家页面说明（~300字）
  - `pages/process.html` - 系统开发过程 7 个步骤（~1000字）
- ❌ **导航菜单**: 主画廊、评论家、关于、过程
- ❌ **UI 元素**: 按钮、标签、提示文字
- ❌ **Meta 标签**: 部分页面的 SEO 描述

### 主要任务阶段

#### Phase 1: 核心基础设施（2小时）
- [ ] 创建翻译术语表 (TRANSLATION_GLOSSARY.md)
- [ ] 扩展 CSS 语言切换规则
- [ ] 创建导航 i18n 模块
- [ ] 验证语言持久化

#### Phase 2: index.html 双语化（2小时）
- [ ] Hero 部分 UI 文本
- [ ] 数据洞察部分
- [ ] 评论家选择器
- [ ] 导航提示文字

#### Phase 3: about.html 双语化（3小时）
- [ ] 页面标题和描述
- [ ] 关于 VULCA 章节（~400字）
- [ ] RPAIT 框架详解（~400字）
- [ ] Meta 标签和 OG 标签

#### Phase 4: critics.html 双语化（2.5小时）
- [ ] 页面标题
- [ ] RPAIT 维度说明
- [ ] 卡片结构说明
- [ ] 动态生成的卡片标题

#### Phase 5: process.html 双语化（4小时）
- [ ] 页面标题
- [ ] 7 个开发步骤详细说明（~1000字）
- [ ] 技术栈说明
- [ ] Meta 标签

#### Phase 6: 导航菜单双语化（2小时）
- [ ] 汉堡菜单项
- [ ] 页面标题
- [ ] 返回按钮
- [ ] 语言切换按钮文本

#### Phase 7: Meta 标签和 SEO（2小时）
- [ ] 所有页面的 description
- [ ] OG tags (og:title, og:description)
- [ ] Twitter cards
- [ ] 语言元数据 (hreflang)

### 影响范围

- **学术受众**: 国际学术界无法完整理解 VULCA 系统的研究价值
- **展览访问者**: 英语观众无法阅读展览背景和评论框架说明
- **SEO 影响**: 英文搜索引擎无法索引英文内容
- **专业形象**: 语言支持不完整影响项目的国际专业形象

---

## 2️⃣ localize-critics-page-and-optimize-layout

**目标**: 评论家页面本地化 + 卡片布局优化

**当前状态**: 0/42 tasks (0% 未开始)
**预估时间**: 6 小时
**优先级**: 中

### 问题描述

评论家页面 (critics.html) 存在的问题：

1. **全英文传记内容** - 所有 6 位评论家的传记 (`bio` 字段) 只有英文
   - 苏轼: "Northern Song literati master, poet, calligrapher..."
   - 郭熙: "Northern Song landscape master who systematized..."
   - 约翰·罗斯金: "Preeminent Victorian art critic..."
   - 佐拉妈妈: "Keeper of West African oral tradition..."
   - 埃琳娜·佩特洛娃教授: "Contemporary Russian formalist scholar..."
   - AI 伦理评审员: "Contemporary philosopher of technology..."

2. **虚构角色身份未标注** - 虚构的 AI 角色（佐拉妈妈、埃琳娜·佩特洛娃教授）未明确标记

3. **英文名字显示过于突出** - 英文名字 (`nameEn`) 与中文名字字号相同，造成视觉混乱

4. **卡片布局可优化** - 传记位置、RPAIT 条形图位置可改进

### 主要任务

#### Phase 1: 添加中文传记（3小时）
- [ ] 为每位评论家添加 `bioZh` 字段
- [ ] 苏轼中文传记（~200字，基于历史研究）
- [ ] 郭熙中文传记（~200字，基于历史研究）
- [ ] 约翰·罗斯金中文传记（~200字，基于历史研究）
- [ ] 佐拉妈妈中文传记（~200字，**标记为虚构**）
- [ ] 埃琳娜·佩特洛娃教授中文传记（~200字，**标记为虚构**）
- [ ] AI 伦理评审员中文传记（~200字，基于 Kate Crawford 研究）

#### Phase 2: 优化卡片布局（2小时）
- [ ] 调整英文名字样式（缩小字号，淡化显示）
- [ ] 优化传记文本布局
- [ ] 改进 RPAIT 条形图位置
- [ ] 响应式布局优化

#### Phase 3: 集成和测试（1小时）
- [ ] 更新 `critics-page.js` 渲染逻辑
- [ ] 测试中英文切换
- [ ] 验证虚构角色标记显示
- [ ] 跨浏览器测试

### 影响范围

- **受众可访问性**: 中文用户无法理解评论家背景
- **学术诚信**: 虚构角色未明确标识
- **视觉层次**: 英文名字与中文名字争夺注意力
- **信息架构**: 卡片布局不利于阅读流程

---

## 3️⃣ add-critic-dialogue-and-thought-chain

**目标**: 评论家对话系统和思维链可视化

**当前状态**: 在 `feature/critic-dialogue-system` 分支开发中
**预估时间**: 22-30 小时（UI 层）
**优先级**: 高

### 说明

这个变更正在另一个 session 的 feature 分支上开发，**不在 master 分支的剩余任务中**。

**已完成**（在 feature 分支）:
- ✅ Phase 0: 基础设施（数据结构、CLI 工具）
- ✅ Phase 1: 对话内容生成（24 个线程，85 条消息）

**待完成**（在 feature 分支）:
- ⏳ Phase 2-7: UI 组件、可视化、集成

**Note**: 此任务与 master 分支的其他任务独立，不应在 master 上处理。

---

## 📋 推荐工作顺序

### 高优先级（影响用户体验）

1. **implement-full-site-bilingual-support**
   - 先完成 Phase 1（基础设施）
   - 然后并行处理 Phase 2-5（各页面双语化）
   - 最后完成 Phase 6-7（导航和 SEO）

### 中优先级（改善内容质量）

2. **localize-critics-page-and-optimize-layout**
   - 独立任务，可以在双语支持之后或并行处理
   - 需要撰写高质量的中文传记内容

---

## 🔧 开发建议

### implement-full-site-bilingual-support

**分解策略**:
- 可以将不同页面的双语化拆分为独立的小任务
- 每个页面完成后可以增量部署和测试
- 优先完成用户访问量最大的页面（about.html）

**依赖关系**:
- Phase 1（基础设施）必须首先完成
- 其他 Phase 可以并行开发

### localize-critics-page-and-optimize-layout

**注意事项**:
- 中文传记需要保持学术准确性
- 虚构角色必须明确标记，避免误导
- 英文名字样式调整不应影响可访问性（ARIA 标签）

---

## 📊 总预估工作量

| 任务 | 预估时间 | 优先级 |
|------|---------|--------|
| implement-full-site-bilingual-support | 17.5 小时 | 高 |
| localize-critics-page-and-optimize-layout | 6 小时 | 中 |
| **总计（Master 分支）** | **23.5 小时** | - |

---

## 🎯 已归档的变更（今天完成）

为了参考，这些是今天已归档的变更：

1. ✅ fix-hero-title-bilingual-support - Hero 标题双语化
2. ✅ fix-chart-labels-bilingual-support - 图表标签双语化
3. ✅ document-openspec-validation-workaround - OpenSpec CLI bug 文档
4. ✅ add-glassmorphism-to-navigation-buttons - 毛玻璃效果
5. ✅ unify-navigation-to-image-area - 统一导航系统
6. ✅ fix-navigation-alignment-and-text - 导航对齐和文本

---

**最后更新**: 2025-11-04
**分支**: master
**活跃变更**: 2 个（不包括 feature 分支的对话系统）
