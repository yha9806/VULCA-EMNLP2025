# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

# CLAUDE.md - Claude Code 工作指南

**最后更新**: 2025-11-01
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

1. 在 `js/data.js` 的 `artworks` 数组中添加对象
2. 提供图片文件到 `assets/`
3. 在 `index.html` 中添加对应的卡片 HTML（如果需要）
4. 测试本地显示

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

### Q7: 图片不显示？
**A**: 确保图片文件在 `/assets/` 目录中，HTML 中的路径是 `/assets/image.jpg`（绝对路径）。

### Q8: 汉字显示乱码？
**A**: 确保 HTML 头部有 `<meta charset="UTF-8">`，文件编码为 UTF-8。

---

## 📖 相关文档

- **SPEC.md** - 项目规范和结构（必读）
- **PHASE_5_FINAL_SUMMARY.md** - Phase 5 功能总结
- **PHASE_5_PROGRESS.md** - 详细开发进度

---

## 🔗 关键链接

| 资源 | URL |
|------|-----|
| 线上网站 | https://vulcaart.art |
| GitHub 仓库 | https://github.com/yha9806/VULCA-EMNLP2025 |
| 联系邮箱 | info@vulcaart.art |

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

**最后同步**: 2025-11-01

---

**开始编辑前，请完整阅读本文档和 SPEC.md！**
