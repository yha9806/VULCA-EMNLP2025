# Spec: Data Splitting

## Overview

拆分大型 data.json 文件，实现按需加载，减少首屏数据量。

## ADDED Requirements

### Requirement: 数据文件拆分

单一 data.json MUST 拆分为多个小文件。

#### Scenario: 拆分后文件结构

**Given** 当前 data.json (820KB) 包含所有数据
**When** 拆分完成后
**Then** 生成以下文件结构：
```
exhibitions/negative-space-of-the-tide/data/
├── artworks.json       # ~35KB (43件作品基础信息)
├── personas.json       # ~9KB (6位评论家信息)
└── critiques/
    ├── artwork-1.json  # ~12KB (6条评论)
    ├── artwork-2.json
    ├── ...
    └── artwork-43.json
```

### Requirement: artworks.json 结构

artworks.json MUST 包含首屏渲染必需的作品信息。

#### Scenario: 作品基础信息

**Given** artworks.json 文件
**When** 加载并解析
**Then** 每件作品包含：
```json
{
  "id": "artwork-1",
  "titleZh": "中文标题",
  "titleEn": "English Title",
  "year": 2024,
  "artist": "艺术家",
  "imageUrl": "/assets/artworks/artwork-1/01/medium.webp",
  "status": "confirmed",
  "images": [...],
  "metadata": {
    "descriptionZh": "...",
    "descriptionEn": "...",
    "school": "..."
  }
}
```
**And** 不包含评论内容

### Requirement: 按需加载评论

评论数据 MUST 在用户查看具体作品时按需加载。

#### Scenario: 首次查看作品评论

**Given** 用户切换到作品 artwork-5
**And** artwork-5 的评论尚未加载
**When** 需要显示评论
**Then** 请求 `/data/critiques/artwork-5.json`
**And** 解析并显示评论
**And** 缓存到内存避免重复请求

#### Scenario: 已缓存的评论

**Given** 用户之前查看过作品 artwork-5
**And** 评论已缓存
**When** 再次查看 artwork-5
**Then** 直接从缓存读取
**And** 不发起网络请求

### Requirement: 分阶段加载策略

data-loader.js MUST 实现分阶段加载。

#### Scenario: 首屏加载流程

**Given** 用户打开展览页面
**When** data-loader.js 初始化
**Then** 并行加载：
  1. artworks.json
  2. personas.json
**And** 触发 `vulca-artworks-ready` 事件
**And** gallery-hero 可以开始渲染
**And** 总数据量 < 50KB

#### Scenario: 按需加载评论流程

**Given** 首屏已渲染
**When** 用户切换到需要评论的作品
**Then** 加载对应评论文件
**And** 触发 `vulca-critiques-ready` 事件
**And** 更新评论显示区域

## MODIFIED Requirements

### Requirement: data-loader.js API

data-loader.js MUST 提供新的加载 API。

#### Scenario: 获取评论 API

**Given** 需要获取作品评论
**When** 调用 `window.VULCA_DATA.getCritiques(artworkId)`
**Then** 返回 Promise
**And** 如果已缓存，立即 resolve
**And** 如果未缓存，加载后 resolve

#### Scenario: 向后兼容

**Given** 现有代码使用 `window.VULCA_DATA.critiques`
**When** 访问该属性
**Then** 返回已加载的评论（可能不完整）
**Or** 触发警告并返回空数组
**And** 推荐使用 `getCritiques()` API

## Implementation Notes

- 拆分脚本位置: `scripts/split-exhibition-data.js`
- 保留原 data.json 作为备份
- 缓存使用简单对象，无需 IndexedDB
- 预加载策略：加载当前作品的同时预加载相邻作品评论
