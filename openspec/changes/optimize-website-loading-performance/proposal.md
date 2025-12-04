# Proposal: Optimize Website Loading Performance

## Problem Statement

当前网站加载速度过慢，严重影响用户体验。经分析，主要问题包括：

| 问题类型 | 当前状态 | 商业标准 | 差距 |
|----------|----------|----------|------|
| 图片总大小 | 103 MB | <10 MB | **10倍** |
| 最大单图 | 12 MB (6000×4500 PNG) | <500 KB | **24倍** |
| JS 请求数 | ~30个独立文件 | 3-5个 | **6-10倍** |
| 首屏数据 | 820 KB JSON | <100 KB | **8倍** |
| 图片懒加载 | 仅2处 | 全部非首屏 | 严重缺失 |

这些问题导致：
- 首屏加载时间过长（预估 10-30秒，取决于网络）
- 移动端体验极差
- 服务器带宽消耗大
- GitHub Pages CDN 缓存效率低

## Proposed Solution

实施四阶段性能优化：

### Phase 1: 图片优化（最高优先级）
- 压缩现有 PNG/JPG 图片（目标：减少 70%）
- 生成 WebP 格式备用（进一步减少 30%）
- 生成响应式图片（多尺寸 srcset）
- 限制最大尺寸为 2000px 宽

### Phase 2: 图片懒加载
- 所有非首屏图片添加 `loading="lazy"`
- 使用 IntersectionObserver 实现预加载
- 添加图片占位符（防止布局抖动）

### Phase 3: JavaScript 优化
- 合并核心 JS 文件为 2-3 个 bundle
- 对话文件按需加载（仅加载当前作品的对话）
- 非关键 JS 延迟加载（defer/async）

### Phase 4: 数据拆分
- 将 critiques 从 data.json 拆分出来
- 实现按作品 ID 按需加载评论
- 首屏只加载 artwork 基础信息（~35KB）

## Success Metrics

| 指标 | 当前 | 目标 | 验收标准 |
|------|------|------|----------|
| 图片总大小 | 103 MB | <15 MB | ✓ 减少85%+ |
| 首屏加载数据 | 820 KB | <100 KB | ✓ 减少85%+ |
| JS 请求数 | 30+ | <10 | ✓ 减少70%+ |
| Lighthouse Performance | TBD | >70 | ✓ 可量化 |
| 首屏 LCP | TBD | <3s (4G) | ✓ 可量化 |

## Scope

### In Scope
- 展览页面 (`exhibitions/negative-space-of-the-tide/`)
- 主页 (`index.html`)
- 作品图片资源 (`assets/artworks/`)
- 核心 JS/CSS 文件

### Out of Scope
- 后端 API 或服务器优化（静态站点）
- 第三方 CDN 库的替换（Chart.js、D3 等保持不变）
- 功能变更（仅优化加载，不改变功能）

## Risks & Mitigations

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 图片压缩后质量下降 | 中 | 使用 85% 质量，提供原图下载链接 |
| WebP 兼容性 | 低 | 使用 `<picture>` fallback 到 JPG |
| 懒加载导致闪烁 | 低 | 添加骨架屏/占位符 |
| JS 打包复杂度 | 中 | 分阶段实施，先手动合并关键文件 |

## Dependencies

- 图片处理工具：sharp (Node.js) 或 ImageMagick
- 无需构建工具（保持静态站点架构）
- 无需修改部署流程

## Timeline Priority

1. **Phase 1 (图片优化)** - 最大收益，应立即执行
2. **Phase 2 (懒加载)** - 配合图片优化
3. **Phase 3 (JS优化)** - 中等收益
4. **Phase 4 (数据拆分)** - 可选，收益相对较小
