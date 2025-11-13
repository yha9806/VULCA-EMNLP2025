# 展览扩展策略文档

**日期**: 2025-11-12
**目标**: 将PPT中的38件真实作品添加到"潮汐的负形"展览
**策略**: 扩展现有展览（不创建新展览）

---

## ✅ 正确理解

**用户意图**:
- ✅ "潮汐的负形" = **技术验证模板**（当前4件Sougwen Chung作品是演示数据）
- ✅ PPT的38件作品 = **真正的展览内容**
- ✅ 直接扩展 `/exhibitions/negative-space-of-the-tide/data.json`
- ✅ 保留现有架构和组件（已验证可行）

---

## 📊 现有数据分析

### 当前"潮汐的负形"展览数据

```json
{
  "artworks": [4],        // 4件Sougwen Chung作品（演示数据）
  "personas": [6],        // 6位评论家（真实数据，可复用）
  "critiques": [24]       // 24条评论（4作品×6评论家）
}
```

### Artwork对象结构

```json
{
  "id": "artwork-1",
  "titleZh": "记忆（绘画操作单元：第二代）",
  "titleEn": "Memory (Painting Operation Unit: Second Generation)",
  "year": 2022,
  "imageUrl": "/assets/artwork-1.jpg",       // Legacy字段
  "artist": "Sougwen Chung",
  "context": "Contemporary digital-robotic...",
  "primaryImageId": "img-1-5",
  "images": [                                 // 多图片系统
    {
      "id": "img-1-1",
      "url": "/assets/artworks/artwork-1/01-concept-sketch.jpg",
      "sequence": 1,
      "titleZh": "初步概念草图",
      "titleEn": "Initial Concept Sketch",
      "caption": "Early conceptual sketches...",
      "metadata": {
        "year": 2021,
        "dimensions": "1200x800",
        "medium": "Pencil and ink on paper"
      }
    }
    // ... 更多图片
  ]
}
```

### Critique对象结构

```json
{
  "artworkId": "artwork-1",
  "personaId": "su-shi",
  "textZh": "此作品呈现出笔墨与机械的对话...",  // 1000+字深度评论
  "textEn": "This work presents a dialogue...", // 1000+字英文评论
  "rpait": {
    "R": 7,  // Representation
    "P": 9,  // Philosophicality
    "A": 8,  // Aesthetics
    "I": 8,  // Identity
    "T": 6   // Tradition
  }
}
```

---

## 🎯 实施策略

### 方案A: 替换演示数据 ⭐ **推荐**

**概念**: 删除4件Sougwen作品，添加38件真实作品

**优势**:
- ✅ 展览内容完全是真实作品
- ✅ 数据结构干净、一致
- ✅ 避免演示数据混淆

**工作量**:
- 数据准备：6-8小时
- Critique生成：15-20小时（38×6=228条评论）
- 总计：**21-28小时**

### 方案B: 保留演示数据+添加真实作品

**概念**: 保留4件Sougwen作品，追加38件真实作品（共42件）

**优势**:
- ✅ 保留技术演示案例
- ✅ 展示多样性

**劣势**:
- ⚠️ 数据混杂（演示+真实）
- ⚠️ 展览主题不清晰
- ⚠️ 总作品数过多（42件）

**工作量**: 同方案A

---

## 📋 详细实施计划（方案A）

### Phase 1: 数据准备（6-8小时）

#### Task 1.1: 迁移已创建的作品数据
**来源**: `/exhibitions/congsheng-2025/data.json`（已有5件作品数据）
**目标**: 迁移到 `/exhibitions/negative-space-of-the-tide/data.json`
**工作量**: 1小时

**步骤**:
1. 读取 `congsheng-2025/data.json` 的5件作品
2. 调整ID编号（artwork-1 → artwork-5）
3. 调整图片路径（相对路径 → 绝对路径）
4. 删除多余字段（artistEn, institution等）
5. 统一context字段（仅英文）
6. 添加到 `negative-space-of-the-tide/data.json`

#### Task 1.2: 添加剩余33件作品数据
**来源**: `scripts/exhibition-artworks-structured.json`
**工作量**: 5-7小时

**分批执行**:
- Batch 1: 8件新媒体/装置（2小时）
- Batch 2: 10件绘画/传统媒介（2-3小时）
- Batch 3: 10件台湾艺术家（2小时）
- Batch 4: 5件剩余作品（1小时）

#### Task 1.3: 迁移图片资源
**来源**: `/exhibitions/congsheng-2025/assets/artworks/`（97张图片）
**目标**: `/assets/artworks/`（根目录）
**工作量**: 30分钟

**步骤**:
1. 移动 `congsheng-2025/assets/artworks/*` → `/assets/artworks/`
2. 更新所有artwork对象中的图片路径
3. 验证图片链接

### Phase 2: Critique生成（15-20小时）

#### 任务量计算
```
38件作品 × 6位评论家 = 228条评论
每条评论：1000-1500字（中文） + 1000-1500字（英文）
每条生成时间：5-7分钟（使用LLM + 知识库）
总时间：228 × 6分钟 ≈ 23小时
```

#### 使用LLM辅助生成
**工具**: Claude/GPT-4 + Knowledge Base
**流程**:
1. 读取作品元数据（标题、媒介、描述）
2. 读取评论家知识库（`knowledge-base/critics/[critic-id]/`）
3. 构建Prompt（模板 + 作品信息 + 评论家风格）
4. 生成中文评论（1000-1500字）
5. 生成英文评论（翻译或独立生成）
6. 人工审查RPAIT分数
7. 保存到data.json

**批量生成策略**:
- 每次生成1件作品的6条评论（6×6分钟 = 36分钟）
- 分8个批次执行（每批次4-5件作品，~2.5小时）
- 总时间：8批次 × 2.5小时 = **20小时**

### Phase 3: 配置更新（30分钟）

#### Task 3.1: 更新config.json
```json
{
  "titleZh": "丛生：两岸教育双年展——沉思之胃",  // 更新标题
  "titleEn": "Congsheng: Cross-Strait Education Biennial",
  "stats": {
    "artworks": 38,    // 更新统计
    "personas": 6,
    "messages": 0,     // 待Phase 4
    "dialogues": 0
  }
}
```

#### Task 3.2: 更新API注册
更新 `/api/exhibitions.json` 中的展览信息

#### Task 3.3: 创建封面图
从38件作品中选择代表性图片制作封面

### Phase 4: 对话生成（可选，8-10小时）

**目标**: 为38件作品生成对话数据
**数量**: 38个对话 × 平均20条消息 = 760条消息
**工作量**: 估计8-10小时

**可延后**: Phase 4可以在Phase 1-3完成后再执行

---

## 🔢 工作量估算

| Phase | 任务 | 时间 | 优先级 |
|-------|------|------|--------|
| Phase 1.1 | 迁移已创建的5件作品 | 1小时 | P0 |
| Phase 1.2 | 添加剩余33件作品数据 | 5-7小时 | P0 |
| Phase 1.3 | 迁移图片资源 | 30分钟 | P0 |
| **Phase 1 小计** | **数据准备** | **6.5-8.5小时** | **P0** |
| Phase 2 | 生成228条critiques | 15-20小时 | P1 |
| Phase 3 | 配置更新 | 30分钟 | P0 |
| **Phase 1-3 小计** | **核心功能** | **22-29小时** | — |
| Phase 4 | 对话生成（可选） | 8-10小时 | P2 |
| **总计** | **完整展览** | **30-39小时** | — |

---

## 📊 分阶段里程碑

### 里程碑1: 数据完整（Phase 1完成）
**目标**: 38件作品数据 + 图片资源
**时间**: 6.5-8.5小时
**可展示**: ✅ 可以显示作品卡片和图片

### 里程碑2: 评论完整（Phase 2完成）
**目标**: 228条critiques数据
**时间**: +15-20小时
**可展示**: ✅ 可以显示评论家评论和RPAIT可视化

### 里程碑3: 配置更新（Phase 3完成）
**目标**: 展览元数据完整
**时间**: +30分钟
**可展示**: ✅ 展览完全可用

### 里程碑4: 对话完整（Phase 4完成，可选）
**目标**: 760条对话消息
**时间**: +8-10小时
**可展示**: ✅ 对话系统完全可用

---

## 🎯 推荐执行路径

### 路径1: 快速上线（推荐）⭐
```
Week 1: Phase 1 (6.5-8.5小时) → 立即可展示作品
Week 2-3: Phase 2 (15-20小时) → 添加评论
Week 3: Phase 3 (30分钟) → 更新配置
Week 4+: Phase 4 (8-10小时) → 添加对话（可选）
```

### 路径2: 完整实施
```
连续工作：Phase 1 → 2 → 3 → 4
总时间：30-39小时（4-5天全职工作）
```

---

## 🔧 技术实施细节

### 数据文件修改
**文件**: `/exhibitions/negative-space-of-the-tide/data.json`
**修改方式**: 直接编辑JSON（或使用脚本批量生成）

**结构**:
```json
{
  "artworks": [
    // 删除artwork-1 ~ artwork-4（Sougwen作品）
    // 添加artwork-1 ~ artwork-38（真实作品）
  ],
  "personas": [
    // 保持不变（6位评论家）
  ],
  "critiques": [
    // 删除现有24条（Sougwen作品的评论）
    // 添加228条新评论（38×6）
  ]
}
```

### 图片路径规范
**当前潮汐架构**: `/assets/artworks/artwork-[id]/[序号]-[描述].jpg`
**丛生已提取**: `/exhibitions/congsheng-2025/assets/artworks/artwork-[slide]-[艺术家]/[序号].[ext]`

**需要统一为**:
```
/assets/artworks/artwork-1/01.jpg
/assets/artworks/artwork-1/02.jpg
/assets/artworks/artwork-2/01.png
...
```

---

## ❓ 决策点

### 决策1: 是否保留Sougwen作品？
**选项A**: 完全替换（推荐）✅
**选项B**: 保留并追加

**我的建议**: **选项A** - 展览应该专注于真实作品，避免混淆

### 决策2: 是否重命名展览？
**选项A**: 重命名为"丛生：两岸教育双年展"（推荐）✅
**选项B**: 保留"潮汐的负形"标题

**我的建议**: **选项A** - 使用真实展览名称

### 决策3: Phase 4对话是否必需？
**选项A**: 暂时跳过，先完成Phase 1-3 ✅
**选项B**: 一次性完成所有功能

**我的建议**: **选项A** - 分阶段实施，先保证核心功能可用

---

## 🚀 下一步行动

### 立即执行（本次会话）

**确认决策**:
1. 是否删除Sougwen作品？（推荐：是）
2. 是否重命名展览为"丛生"？（推荐：是）
3. 从哪个Phase开始？（推荐：Phase 1.1）

**准备就绪后，我将**:
1. 删除现有4件Sougwen作品
2. 迁移已创建的5件作品数据
3. 开始批量添加剩余33件作品

---

**等待您的确认指令！**
