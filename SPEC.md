# VULCA 项目规范 (SPEC)

**最后更新**: 2025-11-01
**版本**: 2.3.0
**状态**: 生产环境

---

## 项目概述

**VULCA** (Visual Understanding and Language with Cultural Adaptation) 是一个展示AI驱动的多角度艺术评论的交互式平台。

**网址**: https://vulcaart.art
**中文名**: 潮汐的负形
**副标题**: 一场关于艺术评论的视角之旅

---

## 核心内容结构

### 1. Hero Section（英雄区）
- **标题**: 潮汐的负形
- **描述**: 一场关于艺术评论的视角之旅。通过不同文化评论家的眼睛，探索同一件作品的多维解读。
- **CTA按钮**: "进入展览" → #exhibition

### 2. Exhibition Section（展览区）
**ID**: `#exhibition`

展示4件精选艺术作品：
- 记忆（绘画操作单元：第二代） - 2022
- 绘画操作单元：第一代（模仿） - 2015
- 万物于万物 - 2018
- 精美对话：花萼、花瓣、刺 - 2020

每件作品配有缩略图、标题和年份。

### 3. Personas Section（评论家区）
**ID**: `#personas`

6位文化评论家：
1. **苏轼 (Su Shi)** - 北宋文人 (1037-1101)
2. **郭熙 (Guo Xi)** - 北宋山水画家 (1020-1100)
3. **约翰·罗斯金 (John Ruskin)** - 维多利亚时期评论家 (1819-1900)
4. **佐拉妈妈 (Mama Zola)** - 西非传统文化
5. **埃琳娜·佩特洛娃教授 (Professor Elena Petrova)** - 俄罗斯形式主义
6. **AI伦理评审员 (AI Ethics Reviewer)** - 数字时代

每位评论家有：
- 简介文本
- RPAIT评论维度得分 (R, P, A, I, T)

### 4. Process Section（创作过程）
**ID**: `#process`

标题：创作过程 · 负形关注

4个子区块：
1. **概念发展** - 从想法到框架的演变与转化
2. **设计迭代** - 界面设计的迭代和决策思考
3. **研究阶段** - 评论家选择与艺术策展研究
4. **技术实现** - 从架构设计到功能开发的技术选择

### 5. About Section（关于）
**ID**: `#about`

项目背景和理念说明。

---

## 技术栈

### 前端
- **HTML5**: 语义化标记
- **CSS3**: 模块化样式 (`/styles/main.css`)
- **Vanilla JavaScript**: 交互逻辑

### 外部库
- **Chart.js 4.4.0**: 数据可视化
- **Sparticles**: 粒子效果
- **Google Fonts**: Crimson Text + Inter

### 部署
- **GitHub Pages**: 静态站点托管
- **CNAME**: vulcaart.art
- **Branch**: master

---

## 文件结构

```
/
├── index.html                     # 主页面（286行）
├── styles/
│   └── main.css                   # 所有样式（单一文件）
├── assets/
│   ├── favicon.svg
│   ├── favicon.ico
│   └── og-image.jpg               # Social media preview
├── js/
│   ├── data.js                    # 展览数据
│   ├── app.js                     # 交互逻辑
│   └── 其他模块...
├── SPEC.md                        # 本文档（规范）
├── CLAUDE.md                      # Claude Code指南
└── 项目文档/*.md                   # 其他文档
```

---

## SEO 和元数据

```html
<title>潮汐的负形 | vulcaart.art</title>

<meta name="description" content="潮汐的负形 - VULCA艺术装置交互展览平台。探索4件精选艺术作品与6位文化评论家的视角碰撞。">

<meta property="og:title" content="潮汐的负形 | vulcaart.art">
<meta property="og:description" content="交互式艺术展览平台 - 体验AI驱动的多角度艺术评论">
<meta property="og:image" content="https://vulcaart.art/assets/og-image.jpg">
<meta property="og:locale" content="zh_CN">
```

---

## 样式指南

### 调色板
- **主色**: 品牌色（来自main.css）
- **文本**: 高对比度，易读性优先
- **字体**:
  - 标题: Crimson Text (serif)
  - 正文: Inter (sans-serif)

### 响应式设计
- 移动优先方法
- 汉堡菜单在小屏幕上
- 桌面导航在大屏幕上

---

## 内容管理

### 更新流程
1. 修改 `index.html` 内容或 `styles/main.css`
2. 测试本地版本
3. `git add .`
4. `git commit -m "描述变更"`
5. `git push origin master`
6. GitHub Pages 自动部署（通常在几秒内）

### 缓存处理
- 如需绕过浏览器缓存：`https://vulcaart.art?nocache=1`

---

## 性能指标

- **目标加载时间**: < 3秒
- **Lighthouse 评分**: > 90
- **移动设备**: 优化的视口和字体大小

---

## 浏览器支持

- **最新版 Chrome / Edge / Firefox / Safari**
- **移动浏览器**: iOS Safari 12+, Chrome Mobile 90+
- **IE 11**: 不支持

---

## 合规性

- ✅ WCAG 2.1 级别 A 无障碍标准
- ✅ 中英文双语支持
- ✅ SEO 优化
- ✅ 隐私政策齐全

---

## 联系与反馈

**Email**: yuhaorui48@gmail.com
**Repository**: https://github.com/yha9806/VULCA-EMNLP2025

---

## 变更历史

| 版本 | 日期 | 更改 |
|------|------|------|
| 2.3.0 | 2025-11-01 | 删除页脚信用行，规范化文档 |
| 2.2.0 | 2025-10-31 | 添加评论家详情卡片 |
| 2.1.0 | 2025-10-15 | 优化响应式设计 |
| 1.0.0 | 2025-09-15 | 初始发布 |

---

**本规范文档与 CLAUDE.md 保持同步。**
