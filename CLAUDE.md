# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

---

**最后更新**: 2025-01-15
**项目**: VULCA - 潮汐的负形 艺术评论展览平台
**网址**: https://vulcaart.art
**GitHub**: https://github.com/yha9806/VULCA-EMNLP2025

---

## ⚡ 快速开始

### 本地开发服务器

```bash
# 在项目根目录运行
python -m http.server 8000

# 访问
http://localhost:8000
http://localhost:8000/exhibitions/negative-space-of-the-tide/
```

### 关键命令

```bash
# 验证数据同步
node scripts/validate-sync.js

# 测试对话加载
node scripts/test-dialogues-loading.js

# 生成QR码展签PDF（A3尺寸，4页，43个标签）
node scripts/generate-qr-codes-pdf.js

# Git 提交
git add .
git commit -m "type: description"
git push origin master

# 查看部署状态
gh api repos/yha9806/VULCA-EMNLP2025/pages/builds --jq '.[0] | "\(.status) | \(.updated_at)"'
```

---

## 📋 项目架构

### 核心概念

这是一个**静态网站**，部署在 GitHub Pages，采用**多展览平台架构**：

```
主页 (index.html)
  ├─ Portfolio 主页（展览入口）
  └─ 链接到各个展览

展览页面 (exhibitions/negative-space-of-the-tide/index.html)
  ├─ Hero 轮播区域（每次显示一件作品）
  ├─ 数据可视化区域（RPAIT 雷达图 + 对比矩阵）
  └─ Full Gallery（完整作品列表，默认隐藏）
```

### 关键架构决策

**1. 展览页面双模式系统**

展览页面包含两个内容展示区域：

```javascript
// Hero 轮播模式（主要展示方式）
<section class="gallery-hero" id="gallery-hero">
  <!-- 由 gallery-hero.js 动态渲染 -->
  <!-- 每次显示一件作品 + 评论 -->
</section>

// Full Gallery 列表模式（备用/辅助）
<section class="gallery" id="gallery" style="display: none !important;">
  <!-- 显示所有作品的静态列表 -->
  <!-- 通常被隐藏，仅在需要时显示 -->
</section>
```

**为什么有两个区域？**
- **Hero**: 沉浸式体验，适合艺术作品展示
- **Gallery**: 完整浏览，适合快速查看所有内容
- 通过 CSS `display: none` 控制显示哪个区域

**2. 数据加载架构**

```
data.json (展览数据)
    ↓
data-loader.js (异步加载)
    ↓
window.VULCA_DATA (全局对象)
    ↓
触发 'vulca-data-ready' 事件
    ↓
gallery-hero.js / carousel.js / 其他模块初始化
```

**关键文件**：
- `exhibitions/negative-space-of-the-tide/js/data-loader.js`: 数据加载器
- `js/gallery-hero.js`: Hero 区域渲染
- `js/carousel.js`: 轮播控制

**3. 多图像系统**

每件作品可以有多张图片：

```javascript
{
  "id": "artwork-1",
  "imageUrl": "/assets/artworks/artwork-1/01.png",  // 主图（向后兼容）
  "primaryImageId": "img-1-1",                      // 主图ID
  "images": [                                       // 多图数组
    { "id": "img-1-1", "url": "...", "sequence": 1 },
    { "id": "img-1-2", "url": "...", "sequence": 2 }
  ]
}
```

**处理逻辑**：
- `js/utils/image-compat.js`: 向后兼容处理
- `js/components/artwork-carousel.js`: 多图轮播组件

**4. QR码展签生成系统**

使用 Node.js 生成可打印的PDF展签，包含作品信息和QR码：

```
scripts/generate-qr-codes-pdf.js
    ↓
读取 data.json (展览数据)
    ↓
使用 pdfkit + qrcode 库
    ↓
生成 qr-codes-labels-ae-a3.pdf
    ↓
A3尺寸，3列×4行=12个标签/页，共4页
```

**配置文件**: `scripts/generate-qr-codes-pdf.js`
- **页面尺寸**: A3 (297mm × 420mm)
- **标签布局**: 3列×4行 = 12个/页
- **标签尺寸**: 90mm × 97.5mm
- **配色方案**: A+E组合（赤陶暖色调 + 极简美术馆）
- **字体**: 支持中文（SimHei黑体），自动检测系统字体

**关键特性**：
- 米黄色背景 (#FFF8F0) + 赤陶色品牌 (#B85C3C)
- QR码链接到线上作品页面
- 支持"待定"作品标记（金色标签）
- 微妙阴影效果 + 金色分割线
- 多平台字体支持（Windows/macOS/Linux）

---

## 🗂️ 核心数据结构

### 展览数据 (data.json)

```javascript
{
  "metadata": {
    "exhibitionId": "negative-space-of-the-tide",
    "artworkCount": 43,
    "confirmedArtworks": 40,
    "pendingArtworks": 3
  },
  "artworks": [
    {
      "id": "artwork-1",
      "titleZh": "中文标题",
      "titleEn": "English Title",
      "year": 2024,
      "artist": "艺术家 (Artist Name)",
      "imageUrl": "/assets/artworks/artwork-1/01.png",
      "status": "confirmed",  // "confirmed" | "pending"
      "images": [...],        // 多图数组
      "metadata": {
        "descriptionZh": "中文描述...",
        "descriptionEn": "English description...",
        "school": "学校/机构"
      }
    }
  ],
  "personas": [
    {
      "id": "su-shi",
      "nameZh": "苏轼",
      "nameEn": "Su Shi",
      "bio": "...",
      "color": "#B85C3C",
      "rpait": { "R": 7, "P": 9, "A": 8, "I": 8, "T": 7 }
    }
  ],
  "critiques": [
    {
      "artworkId": "artwork-1",
      "personaId": "su-shi",
      "textZh": "评论文本...",
      "textEn": "Critique text...",
      "rpait": { "R": 7, "P": 9, "A": 8, "I": 8, "T": 6 }
    }
  ]
}
```

### 对话数据 (js/data/dialogues/)

```javascript
// artwork-1.js
export const artwork1Dialogue = {
  id: 'dialogue-artwork-1',
  artworkId: 'artwork-1',
  topic: '对话主题',
  topicEn: 'Dialogue Topic',
  participants: ['su-shi', 'guo-xi', 'john-ruskin', ...],
  messages: [
    {
      id: 'msg-1',
      personaId: 'su-shi',
      textZh: '中文内容...',
      textEn: 'English content...',
      timestamp: 0,           // 显示时间（毫秒）
      replyTo: null,          // 回复的评论家ID
      interactionType: 'initial',
      quotedText: '引用文本'  // 可选
    }
  ]
};
```

---

## 🚨 关键约束和已知问题

### ⚠️ Gallery 隐藏机制

**问题**: 展览页面包含一个强制隐藏 Gallery 的脚本：

```javascript
// exhibitions/negative-space-of-the-tide/index.html (lines 287-322)
function enforceGalleryHidden() {
  const gallery = document.getElementById('gallery');
  if (gallery && window.getComputedStyle(gallery).display !== 'none') {
    gallery.style.display = 'none !important';
    gallery.setAttribute('aria-hidden', 'true');
  }
}

// MutationObserver 持续监视并强制隐藏
```

**目的**: 确保展览页面优先显示 Hero 轮播模式，而不是 Gallery 列表。

**HTML inline style**:
```html
<section class="gallery" id="gallery" style="display: none !important;">
```

**重要**：
- ✅ 这是**有意的设计**，不是 bug
- ✅ 确保 Hero 区域正常渲染后再考虑修改
- ❌ 不要轻易删除这段代码，除非明确知道后果
- ❌ 不要删除 HTML 的 inline style

### ⚠️ 缓存问题

GitHub Pages 使用 CDN 缓存，缓存时间可能长达 10-30 分钟。

**解决方法**：
1. 版本查询参数：`?v=1`, `?v=2` (推荐)
2. 时间戳参数：`?nocache=timestamp`
3. 等待 CDN 自动刷新

**示例**：
```html
<link rel="stylesheet" href="/styles/main.css?v=5">
<script src="/js/app.js?v=6"></script>
```

### ⚠️ QR码PDF生成注意事项

**字体问题**：
- PDFKit 不支持 `.ttc` 格式字体，只支持 `.ttf` 格式
- 中文显示需要显式指定中文字体路径
- 脚本会自动检测系统字体（Windows/macOS/Linux）

**布局调整原则**：
- 信息区和QR码区域的垂直空间需要平衡
- QR码位置通过 `y + height - X` 控制（X越大，位置越靠上）
- 当前最佳配置：分割线 `y + height - 155`，QR码底部边距 `50pt`
- 修改布局时需要考虑长标题作品（如artwork-35）的换行情况

**版本历史**：
- A+E原版：紫色品牌色，A4尺寸
- A+E-fixed：赤陶色，A4尺寸，字号优化
- A+E-compact：超紧凑布局，A4尺寸
- **A+E-A3（当前）**: A3尺寸，QR码位置优化（向上25pt）

---

## 📝 常见开发任务

### 添加新作品

**重要**: 系统支持 Placeholder + 状态追踪，可添加确认或待定作品。

1. **编辑 `data.json`**:
```javascript
{
  "id": "artwork-47",
  "status": "confirmed",  // 或 "pending"
  "titleZh": "...",
  "titleEn": "...",
  "imageUrl": "/assets/artworks/artwork-47/01.jpg",
  // ...
}
```

2. **添加评论** (仅确认作品):
```javascript
// 6条评论（6位评论家）
{
  "artworkId": "artwork-47",
  "personaId": "su-shi",
  "textZh": "...",
  "textEn": "...",
  "rpait": { "R": 7, "P": 8, "A": 9, "I": 7, "T": 8 }
}
```

3. **创建对话文件** (`js/data/dialogues/artwork-47.js`):
```javascript
export const artwork47Dialogue = {
  id: 'dialogue-artwork-47',
  artworkId: 'artwork-47',
  // ...
  messages: [...]
};
```

4. **更新对话索引** (`js/data/dialogues/index.js`):
```javascript
import { artwork47Dialogue } from './artwork-47.js';
export const DIALOGUES = [..., artwork47Dialogue];
```

5. **运行验证**:
```bash
node scripts/validate-sync.js
node scripts/test-dialogues-loading.js
```

6. **重新生成QR码PDF**（如果需要打印展签）:
```bash
node scripts/generate-qr-codes-pdf.js
```

### 修改QR码PDF布局

如需调整标签布局，编辑 `scripts/generate-qr-codes-pdf.js` 中的 `CONFIG` 对象：

```javascript
// 调整页面尺寸（A3/A4）
page: {
  width: 841.89,   // A3宽度 (A4: 595.28)
  height: 1190.55, // A3高度 (A4: 841.89)
  margin: 28.35
},

// 调整标签布局
label: {
  cols: 3,         // 列数
  rows: 4,         // 行数
  width: 255.12,   // 标签宽度
  height: 275.91,  // 标签高度
  gap: 14.17       // 间距
},

// 调整字号
typography: {
  logo: 20,        // VULCA logo
  titleZh: 14,     // 中文标题
  titleEn: 10,     // 英文标题
  artist: 9,       // 艺术家
  year: 9,         // 年份
  badge: 8         // 待定标签
}
```

**QR码位置调整**（在 `drawLabel` 函数中）：
```javascript
// 分割线位置（数值越大，分割线越靠上）
const dividerY = y + height - 155;

// QR码底部边距（数值越大，QR码越靠上）
const qrY = y + height - qrSize - 50;
```

### Git 提交规范

```bash
# 格式: <type>: <description>
# type: feat, fix, docs, style, refactor, perf, test, chore

git commit -m "feat: Add new artwork artwork-47 (艺术家姓名)"
git commit -m "fix: Correct artwork-23 metadata"
git commit -m "docs: Update CLAUDE.md with deployment notes"
git commit -m "chore: Update QR code PDF layout"
```

---

## 🔧 OpenSpec 工作流

本项目使用 OpenSpec 管理所有功能变更。

### 核心命令

```bash
# 创建新提案
/openspec:proposal

# 应用已批准的提案
/openspec:apply

# 归档已部署的变更
/openspec:archive <change-name>
```

### 已知问题: OpenSpec CLI Bug

**问题**: `openspec validate` 存在验证 bug，即使 spec 正确也会报错。

**临时解决方案**:
```bash
# 归档时跳过验证
openspec archive <change-id> --yes --no-validate --skip-specs
```

**何时使用 `--skip-specs`**:
- ✅ 工具/文档类变更（无功能需求）
- ✅ UI 双语支持（不改变功能逻辑）
- ❌ 新功能开发（需要更新 specs）

详见：`OPENSPEC_KNOWN_ISSUES.md`

---

## 🧪 测试与验证

### 数据验证脚本

```bash
# 验证展览数据同步（12项检查）
node scripts/validate-sync.js

# 预期输出:
# ✅ Artwork count: 43
# ✅ Confirmed artworks: 40
# ✅ Pending artworks: 3
# ✅ Critiques count: 258
```

### 对话加载测试

```bash
# 测试对话系统 ES6 模块加载
node scripts/test-dialogues-loading.js

# 预期输出:
# ✅ Dialogue count correct (43)
# ✅ Total messages: 268
# ✅ All dialogues loaded successfully
```

### QR码PDF生成测试

```bash
# 生成PDF
node scripts/generate-qr-codes-pdf.js

# 预期输出:
# ✅ 找到中文字体: C:\Windows\Fonts\simhei.ttf
# ✅ 加载了 43 件作品
# ✅ PDF生成成功！
# 📍 文件位置: I:\VULCA-EMNLP2025\qr-codes-labels-ae-a3.pdf
# 📊 总页数: 4 页A3, 总标签数: 43 个
```

**手动验证清单**:
- [ ] 所有中文文字正常显示（无乱码）
- [ ] QR码可正常扫描，链接正确
- [ ] 长标题作品（如artwork-35）无截断
- [ ] "待定"标签正确显示在待定作品上
- [ ] 标签布局整齐，间距合理

### 手动测试清单

**核心功能**:
- [ ] Hero 轮播区域正常显示
- [ ] 可以点击左右箭头切换作品
- [ ] 数据可视化（雷达图 + 矩阵）正常
- [ ] 语言切换正常（中文 ↔ 英文）

**响应式设计**:
- [ ] 375px (移动端)
- [ ] 768px (平板)
- [ ] 1024px (桌面)

**浏览器兼容性**:
- [ ] Chrome/Edge 90+
- [ ] Firefox 88+
- [ ] Safari 14+

---

## 📤 部署流程

### GitHub Pages 自动部署

```bash
# 1. 本地修改和测试
python -m http.server 8000

# 2. 提交到 Git
git add .
git commit -m "描述"
git push origin master

# 3. GitHub Pages 自动部署
# 访问 https://vulcaart.art 检查结果（等待 1-2 分钟）
```

### 检查部署状态

```bash
# 使用 GitHub CLI
gh api repos/yha9806/VULCA-EMNLP2025/pages/builds --jq '.[0] | "\(.status) | \(.commit[0:7]) | \(.updated_at)"'

# 预期输出:
# built | a42f468 | 2025-11-15T00:15:13Z
```

### 强制刷新缓存

如果线上未显示最新内容：

```bash
# 方法1: 更新版本号
# 编辑 index.html，修改 ?v=5 → ?v=6

# 方法2: URL 参数
https://vulcaart.art/?nocache=123456

# 方法3: 用户清除浏览器缓存
# Ctrl+Shift+Delete → 缓存图片和文件 → 清除
```

---

## 🚫 禁止的操作

### 绝对不要做的事

1. **❌ 删除关键文件**
   - `index.html`, `exhibitions/*/index.html`
   - `data.json`
   - `js/data-loader.js`, `js/gallery-hero.js`
   - `scripts/generate-qr-codes-pdf.js`

2. **❌ 改变目录结构**
   - 不要重组 `js/`, `styles/`, `exhibitions/`, `scripts/` 目录
   - 不要移动文件到不同路径

3. **❌ 破坏部署**
   - 不要使用相对路径 `../` 或 `./`（使用绝对路径 `/`）
   - 不要更改 `CNAME` 文件

4. **❌ 删除 enforceGalleryHidden**
   - 不要删除展览页面的 `enforceGalleryHidden()` 函数
   - 不要删除 `<section class="gallery">` 的 inline style
   - 这些是**有意的设计**，确保 Hero 模式优先显示

5. **❌ 强制推送到 main/master**
   - 除非回滚错误，否则不使用 `git push --force`
   - 使用 `git push --force-with-lease` 更安全

6. **❌ 修改QR码PDF生成的核心参数而不测试**
   - 修改字号、布局、QR码位置后必须生成并检查PDF
   - 确保长标题作品不会截断
   - 确保中文字体路径正确

---

## 📚 关键文档

- **SPEC.md** - 项目规范（必读）
- **README.md** - 项目概览
- **openspec/AGENTS.md** - OpenSpec 工作流
- **OPENSPEC_KNOWN_ISSUES.md** - OpenSpec CLI 已知问题

---

## 🎯 项目统计（当前版本）

| 维度 | 数量 |
|------|------|
| **作品总数** | 43件 (40确认 + 3待定) |
| **评论家** | 6位 |
| **评论总数** | 258条 (43作品 × 6评论家) |
| **对话总数** | 43个 |
| **总消息数** | 268条 |
| **图片资源** | ~130张（含多图系统）|
| **QR码展签** | A3尺寸，4页，12标签/页 |

---

## ⚠️ 重要提醒

### 开始编辑前必读

1. **阅读 SPEC.md** - 了解项目规范和约束
2. **运行本地服务器** - 验证修改效果
3. **运行验证脚本** - 确保数据完整性
4. **检查 OpenSpec** - 大功能需要提案

### 遇到问题时

1. **检查控制台** - F12 查看 JavaScript 错误
2. **检查网络请求** - F12 Network 面板查看资源加载
3. **清除缓存** - Ctrl+Shift+R 硬刷新
4. **查看文档** - 本文档 + SPEC.md + OpenSpec

### QR码PDF问题排查

1. **中文乱码**: 检查字体路径是否正确，确认使用 `.ttf` 格式
2. **内容截断**: 检查分割线位置和QR码位置参数，确保留有足够垂直空间
3. **布局错乱**: 确认页面尺寸、标签尺寸、列行数配置正确
4. **文件锁定**: 关闭已打开的PDF文件，或修改输出文件名

### 联系方式

- **Email**: yuhaorui48@gmail.com
- **GitHub Issues**: https://github.com/yha9806/VULCA-EMNLP2025/issues

---

**最后更新**: 2025-01-15
**稳定版本**: QR码PDF生成系统已集成（A3尺寸，A+E配色方案）
**下次更新**: 当有重大架构变更或新功能时
