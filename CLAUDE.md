# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# CLAUDE.md - Claude Code 工作指南

**最后更新**: 2025-11-04
**项目**: VULCA - 艺术评论展览平台（沉浸式艺术评论展览）
**网址**: https://vulcaart.art
**GitHub**: https://github.com/yha9806/VULCA-EMNLP2025

---

## ⚡ 快速开始

本项目是一个**静态网站**，部署在 GitHub Pages。采用沉浸式设计，主页面禁用滚动，提供三个详细内容页面。

### 核心文件结构
- **`index.html`** - 主沉浸式画廊（4件艺术作品 × 6位评论家 = 24条评论）
- **`pages/critics.html`** - 评论家介绍页面（可滚动）
- **`pages/about.html`** - 项目愿景与RPAIT框架说明
- **`pages/process.html`** - 创作流程与展览策划（7个步骤）
- **`styles/main.css`** - 所有样式（包括幽灵UI美学、响应式设计）
- **`js/data.js`** - 展览数据 + RPAIT分数计算
- **`js/scroll-prevention.js`** - 主页面滚动禁用逻辑
- **`js/navigation.js`** - 汉堡菜单与页面导航
- **`js/critics-page.js`** - 评论家卡片动态生成

### 本地开发
```bash
# 在项目根目录运行本地服务器
python -m http.server 9999

# 访问
http://localhost:9999
```

---

## 📋 项目结构与架构

```
VULCA-EMNLP2025/
├── index.html              # 主沉浸式画廊 (IMMERSIVE_MODE=true, 禁用滚动)
├── pages/                  # 详细内容页面 (可滚动)
│   ├── critics.html       # 6位评论家卡片 + RPAIT可视化
│   ├── about.html         # 项目愿景 & RPAIT框架详解
│   └── process.html       # 创作流程 (7步骤)
├── styles/main.css         # 所有样式 (1000+ 行)
├── js/                     # JavaScript 模块
│   ├── data.js            # 展览数据 + RPAIT分数计算函数
│   ├── scroll-prevention.js # 禁用滚动 (仅在IMMERSIVE_MODE=true时)
│   ├── navigation.js      # 汉堡菜单管理
│   ├── critics-page.js    # 评论家卡片生成器
│   ├── app.js             # 主应用逻辑
│   └── ...
├── assets/                 # 媒体资源
│   ├── favicon.svg
│   ├── favicon.ico
│   └── og-image.jpg
├── SPEC.md                 # 项目规范（必读）
├── CLAUDE.md               # 本文档
├── openspec/               # OpenSpec规范管理
│   └── changes/           # 已提案的功能变更
└── 项目文档/
    ├── PHASE_5_FINAL_SUMMARY.md
    ├── FINAL_AUDIT_REPORT.md
    └── ...
```

### 架构设计原则

1. **沉浸式/细节分离**
   - 主页面 (index.html): 完全沉浸，无滚动，自动播放
   - 详细页面 (pages/): 可滚动，提供背景信息
   - 用户选择查看深度：留在画廊或探索详细内容

2. **导航系统**
   - 汉堡菜单 (☰): 所有页面可访问
   - 链接: 主画廊 → 评论家 → 关于 → 过程
   - 返回按钮 (←): 所有详细页面都有

3. **数据流**
   ```
   js/data.js (VULCA_DATA)
      ↓
      ├─ artworks[4]: 艺术作品元数据
      ├─ personas[6]: 评论家信息
      └─ critiques[24]: 评论文本 + RPAIT维度评分
      ↓
   RPAIT计算 (data.js内置函数)
      ↓
   persona.rpait: { R, P, A, I, T } (平均分数)
      ↓
   critics-page.js (读取并渲染)
      ↓
   HTML卡片 + 维度条形图
   ```

---

## 🎯 编辑规则

### ✅ 允许的操作

1. **修改内容**
   - 编辑 `index.html` 的文本内容
   - 修改评论家信息、作品描述
   - 更新 SEO 元数据

2. **修改样式**
   - 编辑 `styles/main.css`
   - 调整颜色、排版、布局
   - 调整响应式断点

3. **修改数据**
   - 编辑 `js/data.js`
   - 添加或删除评论家
   - 更新作品信息

4. **添加功能**
   - 在 `js/app.js` 中添加交互
   - 添加新的 JavaScript 模块
   - 集成第三方库

### ❌ 禁止的操作

1. **删除关键文件**
   - ❌ 不要删除 `index.html`
   - ❌ 不要删除 `styles/main.css`
   - ❌ 不要删除 `js/data.js`

2. **改变目录结构**
   - ❌ 不要重组 `js/` 或 `styles/` 目录（除非协调）
   - ❌ 不要移动文件到不同的路径

3. **破坏部署**
   - ❌ 不要使用相对路径如 `../` 或 `./`（使用绝对路径 `/`）
   - ❌ 不要更改 `CNAME` 文件

---

## 💾 数据格式与关键实现

### 展览数据结构 (js/data.js)

```javascript
window.VULCA_DATA = {
  artworks: [
    {
      id: "artwork-1",
      titleZh: "记忆（绘画操作单元：第二代）",
      titleEn: "Memory (Painting Operation Unit: Second Generation)",
      year: 2022,
      imageUrl: "/assets/artwork-1.jpg",
      artist: "Sougwen Chung",
      context: "..."
    },
    // ... 共4件作品
  ],

  personas: [
    {
      id: "su-shi",
      nameZh: "苏轼",
      nameEn: "Su Shi",
      period: "北宋文人 (1037-1101)",
      bio: "...",
      color: "#B85C3C",
      // rpait 由下面的计算函数自动填充
      rpait: { R: 7, P: 9, A: 8, I: 8, T: 7 }
    },
    // ... 共6位评论家
  ],

  critiques: [
    {
      artworkId: "artwork-1",
      personaId: "su-shi",
      textZh: "...",
      textEn: "...",
      rpait: { R: 7, P: 9, A: 8, I: 8, T: 6 }  // 每位评论家对每件作品的评分
    },
    // ... 共24条评论 (4 artworks × 6 personas)
  ]
}

// 🔧 RPAIT计算: data.js 在加载时自动计算每位评论家的平均RPAIT分数
// 这个计算函数 (lines 297-351) 遍历所有critiques，
// 为每位persona计算其4条评论的平均分数，
// 这样critics-page.js 就能用 persona.rpait 来渲染卡片
```

### 关键实现细节

#### 1. 滚动禁用 (scroll-prevention.js)
```javascript
// 仅在主页面启用滚动禁用
window.IMMERSIVE_MODE = true  // 在 index.html 设置
window.IMMERSIVE_MODE = false // 在 pages/*.html 设置

// 多向量滚动禁用:
// - wheel 事件 (鼠标滚轮)
// - keydown 事件 (Space, Arrow, Page 按键)
// - touchmove 事件 (移动设备)
```

#### 2. 导航系统 (navigation.js)
- **汉堡菜单**: `<button id="menu-toggle">` 切换菜单可见性
- **菜单项**: 4个链接 (主画廊、评论家、关于、过程) + 2个按钮 (语言、关闭)
- **当前页面高亮**: 根据 `window.location.pathname` 自动标记活跃项
- **自动关闭**: 手机端点击链接后自动关闭菜单

#### 3. RPAIT维度计算 (data.js)
```javascript
// 计算平均RPAIT分数 (在data.js末尾自动运行)
const avgRpait = {
  R: Math.round(sum / count),  // 对所有评论求平均
  P: Math.round(sum / count),
  A: Math.round(sum / count),
  I: Math.round(sum / count),
  T: Math.round(sum / count)
};
persona.rpait = avgRpait;

// 结果: 每位评论家在R/P/A/I/T五个维度上各有1-10的分数
```

#### 4. 评论家页面生成 (critics-page.js)
```javascript
// 动态生成评论家卡片:
// 1. 读取 VULCA_DATA.personas
// 2. 验证 persona.rpait 存在
// 3. 为每个维度创建进度条 (width = score/10 × 100%)
// 4. 设置背景色 = persona.color
// 5. 附加传记文本
```

#### 5. 艺术作品图片 Placeholder 系统 (gallery-hero.js)
```javascript
// 🖼️ 图片占位符系统 (Phase 1: fix-artwork-image-display-system)
// 当艺术作品图片文件不存在时，自动显示彩色渐变占位符
//
// 工作原理:
// 1. 尝试加载 artwork.imageUrl (例如: /assets/artwork-1.jpg)
// 2. 如果图片加载失败 (404), img.onerror 触发
// 3. 生成 placeholder div，显示作品元数据:
//    - 中文标题 (titleZh)
//    - 英文标题 (titleEn)
//    - 艺术家姓名 (artist)
//    - 创作年份 (year)
//    - "🖼️ Image Pending Acquisition" 状态消息
// 4. 每个作品有独特的渐变背景色:
//    - artwork-1: 蓝紫渐变 (#667eea → #764ba2)
//    - artwork-2: 绿青渐变 (#11998e → #38ef7d)
//    - artwork-3: 橙红渐变 (#eb3349 → #f45c43)
//    - artwork-4: 粉紫渐变 (#d66d75 → #e29587)
// 5. 控制台记录警告: "⚠ Image not found: /assets/artwork-X.jpg"

// 关键函数:
function createPlaceholder(artwork) {
  // 创建带有 ARIA 属性的占位符 DOM
  // 支持屏幕阅读器，维持 3:2 宽高比
}

// 错误处理器 (在 renderArtworkImage 函数中):
img.onerror = () => {
  console.warn(`⚠ Image not found: ${artwork.imageUrl} (${artwork.id})`);
  container.innerHTML = '';
  const placeholder = createPlaceholder(artwork);
  container.appendChild(placeholder);
  console.log(`✓ Displaying placeholder for: ${artwork.titleZh}`);
};
```

**重要说明**:
- ✅ **无需真实图片即可开发**: 现在可以添加新作品到 `js/data.js`，即使没有图片文件，系统也会显示美观的占位符
- ✅ **响应式设计**: Placeholder 保持 3:2 宽高比，在所有断点 (375/768/1024/1440/1920px) 正常显示
- ✅ **可访问性**: 包含 `role="img"` 和完整的 `aria-label`，支持屏幕阅读器
- ⚠️ **未来计划**: Phase 2 将联系艺术家获取真实图片，Phase 3 将添加 lazy loading 和 srcset

**相关文件**:
- `js/gallery-hero.js` (lines 277-314): Error handler + createPlaceholder 函数
- `styles/main.css` (lines 1638-1760): Placeholder CSS 样式
- `openspec/changes/fix-artwork-image-display-system/`: 完整的 OpenSpec 提案

---

## 🎨 样式约定

### CSS 文件组织

```css
/* main.css 包含所有样式：*/
1. CSS 变量（颜色、字体、间距）
2. Reset 和基础样式
3. Layout（响应式网格）
4. Components（卡片、按钮、模态框）
5. Utilities（flex、text、spacing）
6. Responsive（移动优先）
```

### 颜色系统

```css
:root {
  /* 品牌色 */
  --color-primary: #...;
  --color-secondary: #...;

  /* 文本 */
  --color-text: #2d2d2d;
  --color-text-light: #666;

  /* 背景 */
  --color-bg: #fff;
  --color-bg-alt: #f9f9f9;

  /* 边框 */
  --color-border: #e0e0e0;
}
```

### 响应式断点

```css
/* 移动优先 */
@media (min-width: 768px) { /* tablet */ }
@media (min-width: 1024px) { /* desktop */ }
@media (min-width: 1440px) { /* large desktop */ }
```

---

## 🔧 常见任务

### 任务1: 添加新作品

**重要提示**: 现在系统支持 Placeholder，无需真实图片即可添加作品！

1. 在 `js/data.js` 的 `artworks` 数组中添加对象:
   ```javascript
   {
     id: "artwork-5",  // 使用唯一ID
     titleZh: "作品中文标题",
     titleEn: "Artwork English Title",
     year: 2024,
     imageUrl: "/assets/artwork-5.jpg",  // 即使文件不存在也可以
     artist: "艺术家姓名",
     context: "作品背景描述..."
   }
   ```
2. **可选**: 提供图片文件到 `/assets/` (如果暂时没有图片，系统会显示彩色渐变 placeholder)
3. 添加对应的评论数据 (6位评论家 × 1件作品 = 6条 critiques)
4. 测试本地显示 (`http://localhost:9999`)
5. 验证:
   - 如果有图片: 图片正常显示
   - 如果无图片: 显示带有作品元数据的彩色 placeholder
   - 控制台会记录: `⚠ Image not found: /assets/artwork-5.jpg`

### 任务2: 修改评论家信息

1. 找到 `js/data.js` 中的对应评论家对象
2. 修改 `bio`, `rpait` 得分, 或其他字段
3. 更新 `index.html` 中的评论家卡片
4. 本地测试

### 任务3: 调整样式

1. 打开 `styles/main.css`
2. 修改相关的 CSS 规则
3. 在浏览器中实时查看（F12 刷新）
4. 提交更改

### 任务4: 添加交互功能

1. 在 `js/app.js` 中添加事件监听
2. 或创建新的 JavaScript 文件
3. 在 `index.html` 中加载脚本
4. 测试功能

---

## 🔄 OpenSpec 工作流 (功能变更管理)

本项目使用 **OpenSpec** 规范管理所有功能变更。这是一个严格的提案-设计-实施-归档流程。

### OpenSpec 命令

```bash
# 1. 创建新功能提案
/openspec:proposal
# 描述问题和解决方案，系统会生成 proposal.md, design.md, specs/, tasks.md

# 2. 验证提案
openspec validate <change-name> --strict
# 检查 SHALL/MUST 关键词、场景完整性、依赖关系

# 3. 实施变更
/openspec:apply
# 根据 tasks.md 逐步实施，更新进度

# 4. 归档已完成的变更
/openspec:archive <change-name>
# 标记为已部署，移动到归档目录
```

### OpenSpec 文件结构

```
openspec/changes/<change-name>/
├── proposal.md              # 提案概述 (问题、解决方案、影响范围)
├── design.md                # 设计决策 (架构选择、技术选型、权衡分析)
├── specs/                   # 需求规范
│   └── <feature>/
│       └── spec.md         # ADDED/MODIFIED/REMOVED 需求 + BDD 场景
└── tasks.md                # 可执行任务清单 (带时间估计和验证标准)
```

### OpenSpec 最佳实践

1. **提案阶段**: 完整描述问题和解决方案，包括 3 个关键部分:
   - **What Changes**: 具体变更内容
   - **Why**: 问题分析和动机
   - **How**: 实施步骤和验证方法

2. **设计阶段**: 记录所有架构决策和技术选型:
   - 列出所有考虑的方案 (A/B/C)
   - 说明每个方案的优缺点
   - 明确选择理由

3. **规范阶段**: 使用严格的 BDD 格式:
   - 每个需求必须包含 SHALL 或 MUST
   - 每个场景包含 Given/When/Then
   - 提供验证代码示例

4. **任务阶段**: 分解为可执行的小任务:
   - 每个任务 15-45 分钟
   - 包含成功标准 ([ ] checklist)
   - 明确依赖关系

### 示例: fix-artwork-image-display-system

这是本项目第一个完整的 OpenSpec 变更，包含:
- **Proposal**: 3阶段解决方案 (Placeholder → Asset Acquisition → Enhancements)
- **Design**: 5个架构决策 (CSS vs SVG, 错误处理策略, 图片获取策略等)
- **Specs**: 5个需求，11个验证场景
- **Tasks**: 77个任务，分为 Phase 1/2/3 + 验证

参考此示例创建新的功能变更提案。

---

## 📤 部署流程

### 本地开发
```bash
# 1. 修改文件
# 2. 本地测试
python -m http.server 8080
# http://localhost:8080 检查

# 3. 提交到 Git
git add .
git commit -m "描述你的更改"
git push origin master

# 4. GitHub Pages 自动部署
# https://vulcaart.art 在几秒内更新
```

### 缓存绕过

如果线上网站未显示最新内容，可能是 CDN 缓存。

使用查询参数绕过：
```
https://vulcaart.art?nocache=1
```

---

## 🧪 测试检查清单

在部署前，确保：

### 核心功能
- [ ] ✅ 本地测试成功 (`http://localhost:9999`)
- [ ] ✅ HTML 验证通过（无语法错误）
- [ ] ✅ 主页面滚动被禁用（不能用鼠标滚轮/键盘）
- [ ] ✅ 详细页面可滚动（critics.html, about.html, process.html）

### 导航系统
- [ ] ✅ 汉堡菜单按钮 (☰) 可点击
- [ ] ✅ 菜单显示 4 个导航链接 + 2 个按钮
- [ ] ✅ "评论家" 链接打开 `/pages/critics.html`
- [ ] ✅ "关于" 链接打开 `/pages/about.html`
- [ ] ✅ "过程" 链接打开 `/pages/process.html`
- [ ] ✅ 返回按钮 (←) 返回主页面
- [ ] ✅ 汉堡菜单自动关闭（点击链接或外部）

### RPAIT评论家页面
- [ ] ✅ 6位评论家卡片正确渲染
- [ ] ✅ 每位评论家显示传记文本
- [ ] ✅ 每位评论家显示 5 个 RPAIT 维度 (R/P/A/I/T)
- [ ] ✅ 维度条形图宽度正确 (1-10 分)
- [ ] ✅ 条形图颜色匹配评论家的主题色

### 响应式设计
- [ ] ✅ 响应式设计测试 (375px, 768px, 1024px, 1440px)
- [ ] ✅ 图片加载正常
- [ ] ✅ 中英文显示正确

### 跨浏览器测试
- [ ] ✅ Chrome/Edge 90+
- [ ] ✅ Firefox 88+
- [ ] ✅ Safari 14+

---

## 🐛 常见问题

### Q1: 菜单按钮不工作？
**A**: 检查:
1. `index.html` 中是否有 `<button id="menu-toggle">`
2. `js/navigation.js` 是否被正确加载
3. 浏览器控制台是否有 `[Navigation] Handler initialized` 消息
4. 菜单元素是否有 `hidden` 属性 (查看 DOM 树)

### Q2: 评论家页面不显示卡片？
**A**: 最常见原因是 RPAIT 分数计算失败:
1. 验证 `js/data.js` 中 critiques 数组有 24 条评论
2. 确认每条 critique 都有 `rpait: { R, P, A, I, T }` 字段
3. 浏览器控制台检查是否有 `Missing or invalid rpait` 错误
4. 确保 `data.js` 在 `critics-page.js` **之前** 加载

**修复**: data.js 在加载时会自动为每个 persona 计算平均 RPAIT 分数 (lines 297-351)

### Q3: 详细页面无法滚动？
**A**: 检查:
1. `pages/*.html` 顶部是否设置了 `window.IMMERSIVE_MODE = false;` 脚本
2. 主页面应该设置 `window.IMMERSIVE_MODE = true;`
3. `scroll-prevention.js` 会根据这个标志启用/禁用滚动禁止

### Q4: 样式未加载？
**A**: 检查 CSS 文件路径是否使用绝对路径 `/styles/main.css` 而不是相对路径。

### Q5: JavaScript 不工作？
**A**: 检查脚本加载顺序（在 index.html 中）:
```html
<!-- 必须按此顺序加载 -->
<script>window.IMMERSIVE_MODE = true;</script>
<script src="/js/data.js?v=3"></script>        <!-- 必须第一个 -->
<script src="/js/scroll-prevention.js?v=1"></script>
<script src="/js/navigation.js?v=1"></script>
<script src="/js/critics-page.js?v=1"></script> <!-- critics 页面才需要 -->
```

### Q6: 部署后显示旧版本？
**A**: 这是 CDN 缓存。等待 10-30 分钟，或在 URL 加 `?nocache=1`。

### Q7: 图片显示为彩色渐变块 (Placeholder)？
**A**: 这是**正常行为**！系统实施了 Placeholder 系统 (Phase 1: fix-artwork-image-display-system)。

**原因**: 图片文件暂未获取或路径错误

**Placeholder 功能**:
- 显示作品完整元数据（中英文标题、艺术家、年份）
- 每个作品有独特的渐变背景色用于区分
- 保持 3:2 宽高比，响应式设计
- 支持屏幕阅读器 (ARIA 属性)
- 控制台记录警告消息

**如何添加真实图片**:
1. 将图片文件放入 `/assets/` 目录
2. 确保文件名与 `js/data.js` 中的 `imageUrl` 匹配
3. 图片规格: 1200×800px (3:2), <500KB, JPG 85% 质量
4. 刷新浏览器，图片会自动替换 placeholder

**如何自定义 Placeholder 颜色**:
编辑 `styles/main.css` 中的渐变定义:
```css
.artwork-placeholder.artwork-5 {
  background: linear-gradient(135deg, #颜色1 0%, #颜色2 100%);
}
```

### Q8: 汉字显示乱码？
**A**: 确保 HTML 头部有 `<meta charset="UTF-8">`，文件编码为 UTF-8。

### Q9: 如何验证 Placeholder 系统是否正常工作？
**A**: 按以下步骤检查:

1. **打开浏览器开发者工具** (F12)
2. **访问** `http://localhost:9999`
3. **检查控制台**，应该看到:
   ```
   ⚠ Image not found: /assets/artwork-1.jpg (artwork-1)
   ✓ Displaying placeholder for: 记忆（绘画操作单元：第二代）
   ⚠ Image not found: /assets/artwork-2.jpg (artwork-2)
   ✓ Displaying placeholder for: 绘画操作单元（第一代）
   ...
   ```
4. **检查 DOM 结构**，应该看到:
   ```html
   <div class="artwork-placeholder artwork-1" role="img" aria-label="...">
     <div class="placeholder-content">
       <h3 class="placeholder-title" lang="zh">记忆（绘画操作单元：第二代）</h3>
       <p class="placeholder-title-en" lang="en">Memory (Painting Operation Unit: Second Generation)</p>
       <p class="placeholder-meta">Sougwen Chung • 2022</p>
       <p class="placeholder-status">🖼️ Image Pending Acquisition</p>
     </div>
   </div>
   ```
5. **视觉验证**: 每个作品应显示不同颜色的渐变背景
6. **响应式测试**: 在不同设备宽度下 (375/768/1024px)，placeholder 应保持 3:2 宽高比

---

## 📖 相关文档

- **SPEC.md** - 项目规范和结构（必读）
- **README.md** - 项目概览与快速开始
- **PHASE_5_FINAL_SUMMARY.md** - Phase 5 功能总结
- **PHASE_5_PROGRESS.md** - 详细开发进度
- **openspec/changes/fix-artwork-image-display-system/** - 图片占位符系统完整规范
  - `proposal.md` - 问题分析与3阶段解决方案
  - `design.md` - 架构决策与技术选型
  - `specs/placeholder-system/spec.md` - 5个需求规范 + 11个验证场景
  - `tasks.md` - 77个可执行任务清单

---

## 🔗 关键链接

| 资源 | URL |
|------|-----|
| 线上网站 | https://vulcaart.art |
| GitHub 仓库 | https://github.com/yha9806/VULCA-EMNLP2025 |
| 联系邮箱 | yuhaorui48@gmail.com |

---

## 📝 提交信息格式

遵循约定格式：

```
<类型>: <简短描述>

<详细说明（可选）>

Closes #<issue>（如果适用）
```

**类型**:
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 样式调整
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试

**示例**:
```
feat: 添加新评论家简介

在评论家卡片中添加李清照相关信息和RPAIT得分。
确保样式与现有卡片一致。

Closes #42
```

---

## ✅ 本文档维护

- **本文档与 SPEC.md 必须保持同步**
- 每当项目结构或规则变更时，同时更新两个文档
- 定期审查过时内容

**最后同步**: 2025-11-02

---

## 🎉 最新更新

### ✅ Hero 标题双语支持 (2025-11-04)

**解决的问题**:
- ❌ 之前: 主页 Hero 标题和副标题只显示中文，语言切换时不更新
- ✅ 现在: 显示双语结构，语言切换时实时更新

**实施内容**:
1. **Hero 标题双语化** (`js/gallery-hero.js` +17行, -4行)
   - 标题: "潮汐的负形" / "Negative Space of the Tide"
   - 副标题: "一场关于艺术评论的视角之旅" / "A Perspective Journey Through Art Critiques"
   - 使用 `<span lang="zh">` / `<span lang="en">` 结构
   - 利用现有 CSS `[data-lang]` 选择器控制显示/隐藏

2. **事件驱动更新**
   - 监听 `langchange` 事件自动重新渲染
   - 支持语言持久化（localStorage）
   - 支持 URL 参数 (`?lang=en`)

**开发者体验提升**:
- 🚀 **即时切换**: CSS 控制显示，无 JavaScript 延迟
- 🎨 **一致模式**: 与评论文本、评论家姓名使用相同的双语结构
- ♿ **完全可访问**: `lang` 属性支持屏幕阅读器

**相关文档**: 参见 `openspec/changes/fix-hero-title-bilingual-support/`

---

### ✅ 图表标签双语支持 (2025-11-04)

**解决的问题**:
- ❌ 之前: RPAIT雷达图和评论家对比矩阵的标签只显示中文，语言切换时不更新
- ✅ 现在: 所有图表标签（维度名称、评论家姓名、Legend）实时响应语言切换

**实施内容**:
1. **RPAIT 雷达图双语化** (`js/visualizations/rpait-radar.js` +45行)
   - 维度标签: ["代表性", "哲学性", "美学性", "身份性", "传统性"] / ["Representation", "Philosophicality", "Aesthetics", "Identity", "Tradition"]
   - 评论家姓名: 根据当前语言显示 `nameZh` 或 `nameEn`
   - ARIA 标签: 支持双语无障碍访问
   - 添加 `langchange` 事件监听器，实时更新图表数据

2. **评论家对比矩阵双语化** (`js/visualizations/persona-matrix.js` +43行)
   - 单维度标签: { R: "代表性"/"Representation", P: "哲学性"/"Philosophicality", ... }
   - 全维度标签: "所有RPAIT维度" / "All RPAIT Dimensions"
   - Y轴标签（评论家姓名）: 根据当前语言动态更新
   - 维度选择器保持正常工作

3. **技术实现模式**:
   - 集中式翻译常量对象 (`CHART_LABELS`)
   - `getCurrentLang()` 辅助函数读取当前语言
   - `getPersonaName(persona, lang)` 辅助函数选择正确姓名
   - Chart.js 热数据更新（无需重建图表实例）
   - 事件驱动: 所有图表监听 `langchange` 事件

**开发者体验提升**:
- ⚡ **即时响应**: 语言切换后图表在 100ms 内更新
- 🎯 **一致模式**: 与 Hero 标题使用相同的翻译管理模式
- ♿ **完全可访问**: ARIA 标签也支持双语
- 🔧 **易于维护**: 翻译常量集中管理，易于扩展

**相关文档**: 参见 `openspec/changes/fix-chart-labels-bilingual-support/`

---

### ✅ Phase 1: 艺术作品图片 Placeholder 系统已实施 (2025-11-02)

**解决的问题**:
- ❌ 之前: 画廊显示破损图片图标 (broken image icons)，控制台显示 404 错误
- ✅ 现在: 显示美观的彩色渐变占位符，包含完整的作品元数据

**实施内容**:
1. **CSS 渐变背景** (`styles/main.css` +123行)
   - 4个独特的渐变色，每个作品一个
   - 响应式设计，支持 3 个断点 (768/480px)
   - 保持 3:2 宽高比

2. **JavaScript 错误处理** (`js/gallery-hero.js` +33行)
   - `createPlaceholder()` 函数生成占位符 DOM
   - `img.onerror` 处理器捕获图片加载失败
   - 控制台警告日志

3. **可访问性支持**
   - ARIA 属性 (`role="img"`, `aria-label`)
   - 多语言支持 (`lang="zh"`, `lang="en"`)
   - 屏幕阅读器兼容

**开发者体验提升**:
- 🚀 **无需真实图片即可开发**: 添加新作品到 `js/data.js`，立即看到效果
- 🎨 **视觉区分度高**: 每个作品有独特的渐变背景色
- 📱 **响应式验证**: 可以在没有图片的情况下验证布局
- ♿ **完全可访问**: 符合 WCAG 2.1 AA 标准

**相关文档**: 参见 `openspec/changes/fix-artwork-image-display-system/`

---

**开始编辑前，请完整阅读本文档和 SPEC.md！**
- to memorize 记住这个问题