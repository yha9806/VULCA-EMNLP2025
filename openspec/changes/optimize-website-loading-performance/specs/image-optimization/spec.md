# Spec: Image Optimization

## Overview

优化作品图片大小和格式，减少总体积约 85%。

## ADDED Requirements

### Requirement: 多尺寸图片生成

系统 MUST 为每张作品图片生成三种尺寸：

| 尺寸名 | 宽度 | 用途 | 格式 |
|--------|------|------|------|
| thumb | 400px | 列表预览、缩略图 | WebP |
| medium | 1200px | 正常浏览 | WebP |
| large | 2000px | 高清查看 | WebP + JPG fallback |

#### Scenario: 处理大尺寸 PNG 图片

**Given** 一张 6000×4500 的 PNG 图片 (12MB)
**When** 运行图片优化脚本
**Then** 生成三个尺寸的 WebP 文件：
  - thumb.webp (400px 宽, <30KB)
  - medium.webp (1200px 宽, <150KB)
  - large.webp (2000px 宽, <300KB)
**And** 生成 large.jpg 作为 fallback (<400KB)

#### Scenario: 处理 JPG 图片

**Given** 一张 2560×1439 的 JPG 图片 (4MB)
**When** 运行图片优化脚本
**Then** 生成对应尺寸的 WebP 和 JPG 文件
**And** 如果原图小于目标尺寸，不进行放大

### Requirement: 图片质量控制

所有压缩后的图片 MUST 保持可接受的视觉质量。

#### Scenario: WebP 质量设置

**Given** 任意原始图片
**When** 转换为 WebP 格式
**Then** 使用 85% 质量设置
**And** 视觉上无明显失真

#### Scenario: JPG fallback 质量

**Given** 需要生成 JPG fallback 的图片
**When** 转换为 JPG 格式
**Then** 使用 85% 质量设置
**And** 渐进式加载 (progressive: true)

### Requirement: 目录结构保持

优化后的图片 MUST 保持原有目录结构。

#### Scenario: 多图作品目录

**Given** 作品目录 `assets/artworks/artwork-5/` 包含 `01.png`, `02.png`, `03.png`
**When** 运行图片优化脚本
**Then** 生成:
```
assets/artworks/artwork-5/
├── 01/
│   ├── thumb.webp
│   ├── medium.webp
│   ├── large.webp
│   └── large.jpg
├── 02/
│   ├── thumb.webp
│   ├── medium.webp
│   ├── large.webp
│   └── large.jpg
└── 03/
    ├── thumb.webp
    ├── medium.webp
    ├── large.webp
    └── large.jpg
```

## MODIFIED Requirements

### Requirement: imageUrl 字段兼容性

data.json 中的 imageUrl 字段 MUST 指向可用的图片。

#### Scenario: 向后兼容现有引用

**Given** data.json 中 `imageUrl: "/assets/artworks/artwork-1/01.png"`
**When** 图片优化完成后
**Then** imageUrl 更新为 `"/assets/artworks/artwork-1/01/medium.webp"`
**And** 原始 PNG 文件可选保留或删除

## Implementation Notes

- 使用 Node.js sharp 库处理图片
- 脚本位置: `scripts/optimize-images.js`
- 运行命令: `node scripts/optimize-images.js`
- 支持增量处理（跳过已处理的图片）
