# Design: optimize-loading-phase2

## Overview

Phase 2 性能优化聚焦于网络延迟、资源体积、渲染阻塞和缓存策略四个维度。

## Architecture Decisions

### 1. CDN 预连接策略

**决策**: 在 `<head>` 最前面添加 preconnect

```html
<link rel="preconnect" href="https://cdn.jsdelivr.net">
<link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
```

**理由**:
- preconnect 提前建立完整连接（DNS + TCP + TLS）
- dns-prefetch 作为回退，兼容旧浏览器

### 2. 资源压缩方案

**决策**: 使用 Node.js 构建脚本，不引入构建工具链

```
scripts/minify-assets.js
  ├─ csso (CSS 压缩)
  ├─ terser (JS 压缩)
  └─ 输出到 dist/ 或原地替换
```

**理由**:
- 保持项目简单，无需 webpack/vite
- 一次性运行，部署前执行
- 保留源文件可读性

**替代方案（不采用）**:
- webpack/vite 构建：过度工程化
- 在线压缩服务：不可控

### 3. 关键 CSS 策略

**决策**: 手动提取 + 内联

```html
<style>
  /* 首屏关键样式 - 导航、hero区域 */
  .gallery-hero { ... }
  .unified-nav { ... }
</style>
<link rel="stylesheet" href="/styles/main.css" media="print" onload="this.media='all'">
```

**理由**:
- 自动提取工具（critical）配置复杂
- 首屏样式相对固定，手动维护可控
- media="print" + onload 实现异步加载

### 4. Service Worker 策略

**决策**: Cache-First 策略 + 版本控制

```javascript
// sw.js
const CACHE_VERSION = 'v1';
const STATIC_CACHE = [
  '/styles/main.css',
  '/js/app.js',
  '/assets/artworks-optimized/**'
];

// 策略: 静态资源缓存优先，API请求网络优先
```

**缓存策略**:
| 资源类型 | 策略 | 理由 |
|---------|------|------|
| CSS/JS | Cache First | 版本号控制更新 |
| 图片 | Cache First | 内容不变 |
| data.json | Network First | 可能更新 |
| HTML | Network First | 确保最新 |

## File Changes

```
新增:
  scripts/minify-assets.js      # 压缩脚本
  sw.js                         # Service Worker
  styles/critical.css           # 关键CSS（可选）

修改:
  exhibitions/.../index.html    # preconnect + critical CSS + SW注册
  index.html                    # 同上
```

## Dependencies

```json
{
  "devDependencies": {
    "csso": "^5.0.5",
    "terser": "^5.31.0"
  }
}
```

## Risks & Mitigations

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| SW 缓存导致更新延迟 | 中 | 版本号 + skipWaiting |
| 关键CSS遗漏 | 低 | 异步CSS兜底 |
| 压缩破坏代码 | 低 | 保留source map |
