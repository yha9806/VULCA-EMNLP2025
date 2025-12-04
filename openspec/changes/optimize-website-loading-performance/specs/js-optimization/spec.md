# Spec: JavaScript Optimization

## Overview

合并和优化 JavaScript 文件，减少请求数量和加载时间。

## ADDED Requirements

### Requirement: 核心 Bundle

关键功能 MUST 合并为单个核心 bundle 文件。

#### Scenario: 核心功能同步加载

**Given** 展览页面加载
**When** HTML 解析完成
**Then** 加载 `js/bundles/core.bundle.js`
**And** bundle 包含以下模块（按顺序）：
  1. lang-manager.js
  2. utils/image-compat.js
  3. data-loader.js
  4. gallery-hero.js
  5. carousel.js
**And** 使用 `<script>` 标签（非 defer/async）

### Requirement: 可视化 Bundle

数据可视化相关代码 MUST 延迟加载。

#### Scenario: 图表延迟加载

**Given** 展览页面加载
**When** 核心内容渲染完成
**Then** 延迟加载 `js/bundles/visualizations.bundle.js`
**And** bundle 包含：
  - persona-matrix.js
  - rpait-radar.js
  - analysis.js
**And** 使用 `<script defer>` 属性

### Requirement: 对话模块按需加载

对话数据 MUST 按作品 ID 按需加载，不一次性加载全部。

#### Scenario: 当前作品对话加载

**Given** 用户正在查看作品 artwork-5
**When** 需要显示对话内容
**Then** 动态加载 `js/data/dialogues/artwork-5.js`
**And** 不加载其他作品的对话文件

#### Scenario: 动态 import 实现

**Given** dialogues/index.js 作为入口
**When** 需要加载特定作品对话
**Then** 使用动态 import：
```javascript
async function loadDialogue(artworkId) {
  const module = await import(`./artwork-${artworkId}.js`);
  return module.default || module[`artwork${artworkId}Dialogue`];
}
```

### Requirement: 非关键脚本延迟

非首屏渲染必需的脚本 MUST 延迟加载。

#### Scenario: 性能监控延迟加载

**Given** performanceMonitor.js 是非关键功能
**When** 页面加载
**Then** 使用 `<script defer>` 延迟加载
**Or** 在 `DOMContentLoaded` 后动态加载

#### Scenario: 粒子效果延迟加载

**Given** particles-config.js 是装饰性功能
**When** 页面加载
**Then** 延迟到空闲时间加载
**And** 使用 `requestIdleCallback` 或延时加载

## MODIFIED Requirements

### Requirement: HTML 脚本引用

展览页面的脚本引用 MUST 更新为使用 bundle。

#### Scenario: 更新 index.html

**Given** 当前 index.html 有约 30 个 `<script>` 标签
**When** 优化完成后
**Then** 减少为约 5-7 个 `<script>` 标签：
  1. Chart.js (CDN, 保持不变)
  2. Sparticles (CDN, defer)
  3. D3 (CDN, defer)
  4. core.bundle.js (同步)
  5. visualizations.bundle.js (defer)
  6. dialogues/index.js (type="module")

## Implementation Notes

- 手动合并文件，不使用构建工具
- 保持模块顺序，避免依赖问题
- Bundle 文件位置: `js/bundles/`
- 使用 IIFE 包装避免全局污染
- 保留源文件用于调试（生产可删除）
