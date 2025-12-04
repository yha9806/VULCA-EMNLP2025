# Spec: Lazy Loading

## Overview

实现图片懒加载，确保首屏只加载必要资源。

## ADDED Requirements

### Requirement: 首屏图片优先加载

首屏可见的图片 MUST 立即加载，不使用懒加载。

#### Scenario: 首个作品图片加载

**Given** 用户打开展览页面
**When** 页面开始加载
**Then** 第一件作品的图片使用 `loading="eager"`
**And** 添加 `fetchpriority="high"` 属性
**And** 图片在其他资源之前开始加载

### Requirement: 非首屏图片懒加载

所有非首屏图片 MUST 延迟加载。

#### Scenario: 滚动时加载图片

**Given** 用户在展览页面
**And** 有 43 件作品图片
**When** 页面初始加载完成
**Then** 只有首屏图片被加载
**And** 其他图片显示占位符
**When** 用户滚动页面或切换作品
**Then** 进入视口的图片开始加载

#### Scenario: 使用原生 lazy loading

**Given** 非首屏图片元素
**When** 渲染图片标签
**Then** 添加 `loading="lazy"` 属性
```html
<img src="placeholder.svg"
     data-src="artwork-2/medium.webp"
     loading="lazy"
     alt="作品标题">
```

### Requirement: 图片预加载

用户可能即将查看的图片 MUST 预加载。

#### Scenario: 轮播预加载相邻图片

**Given** 用户正在查看作品 N
**When** 作品 N 的图片加载完成
**Then** 预加载作品 N+1 的图片
**And** 预加载作品 N-1 的图片（如果存在）

#### Scenario: IntersectionObserver 预加载

**Given** 使用 IntersectionObserver 监控图片
**When** 图片距离视口 200px 以内
**Then** 开始加载该图片
**And** 图片进入视口时已完成加载（理想情况）

### Requirement: 占位符防止布局抖动

图片加载前 MUST 显示占位符，保持布局稳定。

#### Scenario: 固定宽高比占位符

**Given** 作品图片的宽高比为 4:3
**When** 图片尚未加载
**Then** 显示相同宽高比的 SVG 占位符
**And** 占位符使用品牌色或灰色背景
**And** 页面布局不因图片加载而抖动

#### Scenario: 加载状态指示

**Given** 图片正在加载中
**When** 用户查看该区域
**Then** 可显示加载动画（可选）
**And** 加载完成后平滑过渡显示图片

## MODIFIED Requirements

### Requirement: gallery-hero.js 渲染逻辑

gallery-hero.js MUST 支持懒加载机制。

#### Scenario: 动态切换作品时加载图片

**Given** 用户点击下一件作品按钮
**When** 切换到新作品
**Then** 如果图片未加载，触发加载
**And** 显示加载状态
**And** 加载完成后更新显示

## Implementation Notes

- 使用原生 `loading="lazy"` 属性（浏览器支持率 >95%）
- IntersectionObserver 用于预加载控制
- 占位符使用内联 SVG 或 data URI（避免额外请求）
- 工具模块位置: `js/utils/lazy-loader.js`
