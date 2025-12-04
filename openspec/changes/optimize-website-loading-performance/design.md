# Design: Website Loading Performance Optimization

## Architecture Overview

当前网站是静态站点（GitHub Pages），无构建流程。优化策略必须：
1. 保持静态部署兼容性
2. 不引入复杂构建工具链
3. 可增量实施

```
当前架构:
┌─────────────────────────────────────────────────────────┐
│                    GitHub Pages                          │
├─────────────────────────────────────────────────────────┤
│  index.html                                              │
│  exhibitions/negative-space-of-the-tide/index.html       │
│  ├── data.json (820KB)                                  │
│  ├── js/*.js (30+ files, 1.1MB total)                   │
│  └── assets/artworks/ (103MB, 111 images)               │
└─────────────────────────────────────────────────────────┘

优化后架构:
┌─────────────────────────────────────────────────────────┐
│                    GitHub Pages                          │
├─────────────────────────────────────────────────────────┤
│  index.html                                              │
│  exhibitions/negative-space-of-the-tide/index.html       │
│  ├── data/                                               │
│  │   ├── artworks.json (~35KB, 基础信息)                │
│  │   └── critiques/*.json (按需加载)                    │
│  ├── js/                                                 │
│  │   ├── core.bundle.js (核心功能)                      │
│  │   ├── visualizations.bundle.js (图表，延迟加载)      │
│  │   └── dialogues/*.js (按需加载)                      │
│  └── assets/artworks/                                    │
│      ├── */thumb.webp (缩略图，<50KB each)              │
│      ├── */medium.webp (中等尺寸，<200KB each)          │
│      └── */original.jpg (原图，按需加载)                │
└─────────────────────────────────────────────────────────┘
```

## Technical Decisions

### 1. Image Optimization Strategy

**决策**: 使用 Node.js sharp 库进行图片处理

**理由**:
- 项目已有 Node.js 环境（用于 QR 码生成等）
- sharp 性能优秀，支持 WebP/AVIF
- 可本地一次性处理，无需 CI/CD

**图片尺寸规格**:
| 类型 | 宽度 | 用途 | 格式 |
|------|------|------|------|
| thumb | 400px | 列表预览 | WebP |
| medium | 1200px | 正常浏览 | WebP |
| large | 2000px | 高清查看 | WebP + JPG fallback |

**质量设置**:
- WebP: 85% 质量
- JPG fallback: 85% 质量
- PNG→JPG 转换（除非需要透明度）

### 2. Lazy Loading Implementation

**决策**: 原生 `loading="lazy"` + IntersectionObserver 预加载

**理由**:
- 原生 lazy loading 浏览器支持率 >95%
- IntersectionObserver 用于更精细的预加载控制
- 无需第三方库

**实现方式**:
```html
<!-- 首屏图片：立即加载 -->
<img src="artwork-1/medium.webp" loading="eager" fetchpriority="high">

<!-- 非首屏图片：懒加载 -->
<img src="placeholder.svg"
     data-src="artwork-2/medium.webp"
     loading="lazy"
     class="lazy-image">
```

**占位符策略**:
- 使用低质量模糊预览图（LQIP）或
- 使用固定宽高比的 SVG 占位符（防止布局抖动）

### 3. JavaScript Bundling Strategy

**决策**: 手动合并为 3 个 bundle，不使用构建工具

**理由**:
- 避免引入 Webpack/Vite 复杂度
- 保持静态部署兼容
- 30 个文件 → 3 个文件已是显著改进

**Bundle 结构**:
```
js/
├── core.bundle.js          # 核心功能（必须同步加载）
│   ├── lang-manager.js
│   ├── data-loader.js
│   ├── gallery-hero.js
│   ├── carousel.js
│   └── image-compat.js
│
├── visualizations.bundle.js # 数据可视化（延迟加载）
│   ├── persona-matrix.js
│   ├── rpait-radar.js
│   └── analysis.js
│
└── dialogues/              # 对话模块（按需加载）
    ├── index.js            # 动态 import 入口
    └── artwork-*.js        # 单独文件，按需加载
```

### 4. Data Splitting Strategy

**决策**: 分离 artworks 和 critiques

**当前 data.json 结构**:
```json
{
  "metadata": { ... },           // ~1KB
  "artworks": [ ... ],           // ~35KB (43件作品基础信息)
  "personas": [ ... ],           // ~9KB (6位评论家)
  "critiques": [ ... ]           // ~519KB (258条评论) ← 问题所在
}
```

**优化后结构**:
```
exhibitions/negative-space-of-the-tide/data/
├── artworks.json              # ~35KB (首屏必须)
├── personas.json              # ~9KB (首屏必须)
└── critiques/
    ├── artwork-1.json         # ~12KB (按需)
    ├── artwork-2.json
    └── ...
```

**加载策略**:
1. 首屏：加载 artworks.json + personas.json (~44KB)
2. 用户浏览作品时：按需加载对应 critiques

## Alternative Approaches Considered

### 图片优化
| 方案 | 优点 | 缺点 | 决策 |
|------|------|------|------|
| CDN 图片服务 (Cloudinary) | 自动优化 | 需要迁移、成本 | ❌ 放弃 |
| 本地 sharp 处理 | 一次性、可控 | 需要手动运行 | ✅ 采用 |
| 保持原图 + CDN 缓存 | 最简单 | 无法解决根本问题 | ❌ 放弃 |

### JS 优化
| 方案 | 优点 | 缺点 | 决策 |
|------|------|------|------|
| Webpack/Vite 构建 | 自动化、Tree-shaking | 复杂度高 | ❌ 放弃 |
| 手动合并文件 | 简单、可控 | 需要维护 | ✅ 采用 |
| 保持现状 | 无额外工作 | 问题未解决 | ❌ 放弃 |

### 数据优化
| 方案 | 优点 | 缺点 | 决策 |
|------|------|------|------|
| 分离为多个 JSON | 按需加载 | 需要修改加载逻辑 | ✅ 采用 |
| 压缩 JSON (gzip) | GitHub Pages 自动 | 已启用，收益有限 | 已有 |
| IndexedDB 缓存 | 离线支持 | 复杂度高 | ❌ 放弃 |

## Implementation Phases

### Phase 1: 图片优化（独立，可立即执行）
- 创建 `scripts/optimize-images.js`
- 处理所有作品图片
- 更新 data.json 中的 imageUrl 引用
- **预期收益**: 图片从 103MB → ~15MB

### Phase 2: 懒加载（依赖 Phase 1 完成）
- 修改 `gallery-hero.js` 添加懒加载逻辑
- 添加占位符系统
- **预期收益**: 首屏加载时间显著减少

### Phase 3: JS 合并（独立，可并行）
- 创建 bundle 文件
- 更新 HTML 引用
- **预期收益**: 请求数从 30+ → <10

### Phase 4: 数据拆分（依赖 Phase 3）
- 拆分 data.json
- 修改 data-loader.js
- **预期收益**: 首屏数据从 820KB → ~50KB

## Backward Compatibility

- 所有优化保持向后兼容
- 原有 imageUrl 字段保留（指向 medium 尺寸）
- 未优化的图片仍可正常显示
- 无构建步骤，直接部署

## Testing Strategy

1. **本地测试**: `python -m http.server 8000` 验证功能
2. **性能测试**: Chrome DevTools Network 面板
3. **Lighthouse 测试**: 优化前后对比
4. **移动端测试**: 模拟 4G 网络
