# Issue #001: 数据可视化内容丢失

## 问题描述

性能优化后，"数据洞察：探索评论家视角与作品之间的多维关系" 部分的数据可视化内容丢失。

## 发现时间

2025-12-04

## 影响范围

- 展览页面: `/exhibitions/negative-space-of-the-tide/`
- 数据可视化区域 (RPAIT 雷达图、对比矩阵等)

## 可能原因

1. **defer 属性导致加载顺序问题**
   - 可视化脚本 (rpait-radar.js, persona-matrix.js) 添加了 defer
   - 可能在数据准备好之前就尝试渲染

2. **数据拆分导致 critiques 为空**
   - 优化后首屏不加载 critiques
   - 可视化可能依赖 critiques 数据

3. **依赖顺序问题**
   - D3.js 添加了 defer
   - persona-selector.js 添加了 defer
   - 可能破坏了依赖链

## 调查步骤

- [ ] 检查浏览器控制台错误
- [ ] 检查可视化组件的数据依赖
- [ ] 检查 defer 脚本的执行顺序
- [ ] 验证 critiques 数据是否可用

## 根本原因

**数据拆分导致 critiques 初始为空**

优化后的 data-loader.js 首屏只加载 `artworks.json` + `personas.json`，`critiques` 初始为空数组。

可视化组件依赖链：
```
rpait-radar.js / persona-matrix.js
  → VULCA_ANALYSIS.getPersonaArtworkRPAIT()
    → VULCA_DATA.critiques (空!)
      → 无法构建矩阵 → 可视化失败
```

## 解决方案

1. **data-loader.js**: 首屏加载后，后台异步加载所有 critiques
2. **data-loader.js**: 加载完成后触发 `vulca-critiques-ready` 事件
3. **data-loader.js**: 重新调用 `VULCA_ANALYSIS.init()` 重建矩阵
4. **rpait-radar.js**: 监听 `vulca-critiques-ready` 事件，重新初始化
5. **persona-matrix.js**: 监听 `vulca-critiques-ready` 事件，重新初始化

## 修改的文件

- `exhibitions/.../js/data-loader.js` - 添加后台加载所有 critiques
- `js/visualizations/rpait-radar.js` - 添加事件监听
- `js/visualizations/persona-matrix.js` - 添加事件监听

## 状态

🟢 已修复
