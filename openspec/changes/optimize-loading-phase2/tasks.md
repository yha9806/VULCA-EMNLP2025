# Tasks: optimize-loading-phase2

## Phase 1: CDN 预连接 (优先级: 高, 复杂度: 低)

- [x] 1.1 在展览页 index.html 添加 jsdelivr preconnect
- [x] 1.2 在主页 index.html 添加 jsdelivr preconnect
- [x] 1.3 验证 DevTools Network 面板显示预连接生效

## Phase 2: 资源压缩 (优先级: 高, 复杂度: 中)

- [x] 2.1 安装 csso 和 terser 依赖
- [x] 2.2 创建 scripts/minify-assets.js 压缩脚本
- [x] 2.3 压缩 styles/*.css 文件
- [x] 2.4 压缩 js/*.js 文件（排除第三方库）
- [x] 2.5 更新 HTML 引用压缩后的文件（添加版本号）
- [x] 2.6 验证压缩后功能正常

## Phase 3: 关键 CSS 内联 (优先级: 中, 复杂度: 中)

- [x] 3.1 分析首屏渲染所需最小 CSS
- [x] 3.2 提取关键 CSS 到 styles/critical.css
- [x] 3.3 在 HTML head 内联关键 CSS
- [x] 3.4 将非关键 CSS 改为异步加载
- [x] 3.5 验证首屏无样式闪烁 (FOUC)

## Phase 4: Service Worker (优先级: 中, 复杂度: 高)

- [x] 4.1 创建 sw.js Service Worker 文件
- [x] 4.2 实现静态资源缓存列表
- [x] 4.3 实现 Cache-First 策略（静态资源）
- [x] 4.4 实现 Network-First 策略（HTML/JSON）
- [x] 4.5 在 HTML 中注册 Service Worker
- [x] 4.6 实现版本更新和缓存清理
- [x] 4.7 测试离线访问功能
- [x] 4.8 测试缓存更新机制

## Phase 5: 验证与部署 (优先级: 高, 复杂度: 低)

- [x] 5.1 运行 Lighthouse 性能测试
- [x] 5.2 对比优化前后分数
- [x] 5.3 本地完整功能测试
- [x] 5.4 提交并推送到 GitHub
- [x] 5.5 验证线上部署效果

## Dependencies

- Phase 2 依赖 npm 安装
- Phase 3 可与 Phase 2 并行
- Phase 4 依赖 Phase 2 完成（缓存压缩后文件）
- Phase 5 依赖所有 Phase 完成

## Implementation Summary

### Phase 1 完成
- 添加 jsdelivr CDN preconnect 到展览页和主页
- preconnect 放置在 head 最前面位置

### Phase 2 完成
- 安装 csso + terser
- 创建 scripts/minify-assets.js
- CSS: 9 files, 133.6 KB → 73.5 KB (-45.0%)
- JS: 79 files, 1006.3 KB → 759.1 KB (-24.6%)
- Total: 1.11 MB → 832.6 KB (-27.0%)

### Phase 3 完成
- 创建 styles/critical.css 关键样式
- 内联首屏关键 CSS 到展览页 head
- 非关键 CSS 使用 media="print" onload="this.media='all'" 异步加载
- 添加 noscript 回退

### Phase 4 完成
- 创建 sw.js Service Worker
- 实现 Cache-First（静态资源）和 Network-First（HTML/JSON）策略
- 实现离线回退页面
- 在主页和展览页注册 Service Worker
