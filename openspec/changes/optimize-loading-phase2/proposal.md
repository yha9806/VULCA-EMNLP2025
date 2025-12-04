# Proposal: optimize-loading-phase2

## Why

Phase 1 性能优化已完成（图片WebP、懒加载、JS defer、数据拆分），但仍有进一步优化空间：

1. **CDN 预连接缺失** - jsdelivr CDN 没有 preconnect，导致额外 DNS 查询延迟
2. **CSS/JS 未压缩** - 当前 CSS 137KB、JS 345KB 均为未压缩状态
3. **首屏渲染阻塞** - 所有 CSS 同步加载，阻塞首屏渲染
4. **无离线支持** - 重复访问仍需完整加载所有资源

## What Changes

### 1. CDN 预连接 (cdn-preconnect)
- 为 jsdelivr CDN 添加 preconnect 和 dns-prefetch
- 预期收益：减少 100-300ms 连接延迟

### 2. CSS/JS 压缩 (asset-minification)
- 使用构建脚本压缩 CSS 和 JS 文件
- 预期收益：CSS -34%、JS -48%

### 3. 关键 CSS 内联 (critical-css)
- 提取首屏关键 CSS 内联到 HTML
- 非关键 CSS 异步加载
- 预期收益：消除渲染阻塞

### 4. Service Worker 缓存 (service-worker)
- 实现离线缓存策略
- 静态资源缓存优先
- 预期收益：重复访问秒开

## Scope

- 展览页面：`exhibitions/negative-space-of-the-tide/index.html`
- 主页：`index.html`
- 构建脚本：`scripts/`

## Success Criteria

- Lighthouse Performance 分数提升 10+
- 首屏渲染时间 (FCP) < 1.5s
- 重复访问可离线浏览
