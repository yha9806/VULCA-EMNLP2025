# CLAUDE.md - Claude Code 工作指南

**最后更新**: 2025-11-01
**项目**: VULCA - 艺术评论展览平台
**网址**: https://vulcaart.art

---

## ⚡ 快速开始

本项目是一个**静态网站**，部署在 GitHub Pages。

### 核心文件
- `index.html` - 主页面（286行）
- `styles/main.css` - 所有样式
- `js/data.js` + `js/app.js` - 交互逻辑

### 本地开发
```bash
# 在项目根目录运行本地服务器
python -m http.server 8080

# 访问
http://localhost:8080
```

---

## 📋 项目结构

```
VULCA-EMNLP2025/
├── index.html              # 主页面
├── styles/main.css         # 主样式表
├── js/                     # JavaScript 模块
│   ├── data.js            # 展览和评论家数据
│   ├── app.js             # 应用逻辑
│   └── ...
├── assets/                 # 媒体资源
│   ├── favicon.svg
│   ├── favicon.ico
│   └── og-image.jpg
├── SPEC.md                 # 项目规范（必读）
├── CLAUDE.md               # 本文档
└── 项目文档/
    ├── PHASE_5_FINAL_SUMMARY.md
    ├── PHASE_5_PROGRESS.md
    └── ...
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

## 💾 数据格式

### 展览数据结构 (js/data.js)

```javascript
{
  artworks: [
    {
      id: "artwork_1",
      titleZh: "记忆（绘画操作单元：第二代）",
      titleEn: "Memory (Painting Operation Unit: Second Generation)",
      year: 2022,
      image: "/assets/artwork1.jpg",
      description: "..."
    },
    // ... 更多作品
  ],

  personas: [
    {
      id: "suShi",
      nameZh: "苏轼",
      nameEn: "Su Shi",
      period: "北宋文人(1037-1101)",
      bio: "...",
      rpait: { R: 7, P: 9, A: 8, I: 8, T: 7 },
      colors: { rgb: "...", hex: "#..." }
    },
    // ... 更多评论家
  ]
}
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

- [ ] ✅ 本地测试成功 (`http://localhost:8080`)
- [ ] ✅ HTML 验证通过（无语法错误）
- [ ] ✅ 所有链接有效（#exhibition 等）
- [ ] ✅ 响应式设计测试 (375px, 768px, 1024px)
- [ ] ✅ 图片加载正常
- [ ] ✅ 中英文显示正确
- [ ] ✅ 跨浏览器测试 (Chrome, Firefox, Safari)

---

## 🐛 常见问题

### Q1: 样式未加载？
**A**: 检查 CSS 文件路径是否使用绝对路径 `/styles/main.css` 而不是相对路径。

### Q2: JavaScript 不工作？
**A**: 检查 `js/data.js` 是否在 `js/app.js` 之前加载。查看浏览器控制台的错误信息。

### Q3: 部署后显示旧版本？
**A**: 这是 CDN 缓存。等待 10-30 分钟，或在 URL 加 `?nocache=1`。

### Q4: 图片不显示？
**A**: 确保图片文件在 `/assets/` 目录中，HTML 中的路径是 `/assets/image.jpg`（绝对路径）。

### Q5: 汉字显示乱码？
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
