# Tasks: Website Loading Performance Optimization

## Phase 1: 图片优化 (Priority: Critical) ✅ COMPLETE

### 1.1 创建图片优化脚本 ✅
- [x] 安装 sharp 依赖 (`npm install sharp`)
- [x] 创建 `scripts/optimize-images-perf.js` 脚本
- [x] 实现 WebP 转换功能
- [x] 实现多尺寸生成 (thumb: 400px, medium: 1200px, large: 2000px)
- [x] 添加质量压缩 (85%)
- [x] 添加进度显示和错误处理

### 1.2 执行图片优化 ✅
- [x] 运行优化脚本处理所有 106 张图片
- [x] 验证生成的 WebP 文件可正常显示
- [x] 记录优化前后大小对比: **103MB → 35MB (-66%)**

### 1.3 更新图片引用 ✅
- [x] 创建 `scripts/update-image-refs.js` 脚本
- [x] 更新 `data.json` 中的 imageUrl 指向优化后的图片
- [x] 更新多图系统 (images 数组) 的 URL
- [x] 共更新 **122 个图片引用**

## Phase 2: 图片懒加载 (Priority: High) ✅ COMPLETE

### 2.1 实现懒加载基础设施 ✅
- [x] 创建 `js/utils/lazy-loader.js` 工具模块
- [x] 实现 IntersectionObserver 预加载逻辑
- [x] 创建 SVG 占位符模板（固定宽高比）

### 2.2 修改 unified-navigation.js ✅
- [x] 首屏图片保持 `loading="eager"`
- [x] 添加 `_preloadAdjacentArtworks()` 预加载相邻作品图片

### 2.3 更新 HTML 引用 ✅
- [x] 在展览页添加 lazy-loader.js 脚本引用

## Phase 3: JavaScript 优化 (Priority: Medium) ✅ COMPLETE (简化版)

### 3.1 分析 JS 依赖关系 ✅
- [x] 确定核心文件（必须同步加载）
- [x] 确定可延迟加载的文件（11个脚本）

### 3.2 添加 defer 属性 ✅
- [x] performanceMonitor.js, testFramework.js, templates.js
- [x] eventDelegation.js, particles-config.js
- [x] analysis.js, persona-selector.js
- [x] rpait-radar.js, persona-matrix.js
- [x] navigation-autohide.js
- [x] D3.js CDN 资源

### 3.3 Bundle 创建 (SKIPPED)
- [ ] ~~创建 `js/bundles/core.bundle.js`~~ (保持现有架构)
- [ ] ~~创建 `js/bundles/visualizations.bundle.js`~~ (使用 defer 替代)

### 3.4 对话模块优化 (DEFERRED)
- [ ] ~~修改 `js/data/dialogues/index.js` 实现动态 import~~ (复杂度较高，延后)

## Phase 4: 数据拆分 (Priority: Low) ✅ COMPLETE

### 4.1 拆分 data.json ✅
- [x] 创建 `scripts/split-exhibition-data.js`
- [x] 生成 `data/artworks.json` (53KB)
- [x] 生成 `data/personas.json` (12KB)
- [x] 生成 `data/critiques/artwork-*.json` (43个文件，共756KB)
- [x] **首屏数据: 820KB → 65KB (-92%)**

### 4.2 修改 data-loader.js ✅
- [x] 修改为分阶段加载
- [x] 首屏加载 artworks + personas
- [x] 按需加载 critiques (getCritiques API)
- [x] 添加缓存机制

## Phase 5: 验证与监控 (Priority: Required) ⏳ PENDING

### 5.1 性能测试
- [ ] 本地服务器测试功能正常
- [ ] Chrome DevTools 分析网络瀑布图
- [ ] 模拟 4G 网络测试首屏时间

### 5.2 兼容性测试
- [ ] Chrome/Edge 测试
- [ ] Firefox 测试

### 5.3 部署验证
- [ ] 本地测试通过
- [ ] 推送到 GitHub
- [ ] 验证线上站点正常

---

## 📊 Optimization Results Summary

| 指标 | 优化前 | 优化后 | 改进 |
|------|--------|--------|------|
| **图片总大小** | 103 MB | 35 MB | **-66%** |
| **首屏数据** | 820 KB | 65 KB | **-92%** |
| **图片格式** | PNG/JPG | WebP | 更高效 |
| **JS defer** | 0 | 11 脚本 | 首屏更快 |
| **预加载** | 无 | 相邻作品 | 切换更流畅 |

### 新增文件
- `scripts/optimize-images-perf.js` - 图片优化脚本
- `scripts/update-image-refs.js` - 图片引用更新脚本
- `scripts/split-exhibition-data.js` - 数据拆分脚本
- `js/utils/lazy-loader.js` - 懒加载工具
- `assets/artworks-optimized/` - 优化后的图片目录
- `exhibitions/.../data/` - 拆分后的数据文件

### 修改文件
- `exhibitions/.../data.json` - 图片URL更新
- `exhibitions/.../js/data-loader.js` - 分阶段加载
- `exhibitions/.../index.html` - defer属性、lazy-loader引用
- `js/components/unified-navigation.js` - 预加载功能
