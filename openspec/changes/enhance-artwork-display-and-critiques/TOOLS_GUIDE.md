# Claude Code 工具使用指南

本文档说明使用 Claude Code 完成本 OpenSpec 变更所需的所有内置工具及其具体应用。

---

## 工具清单及用途对应

### 1. Read 工具 - 读取和理解现有代码

**用途**: 读取现有的数据、代码和文本，理解当前状态

**应用场景**:

#### Phase 2a: 理解现有评论结构
```
用途：读取 js/data.js 中的现有评论文本
工具命令：
  Read /js/data.js (offset: 115, limit: 200)

输出示例：
  - 理解24条评论的当前长度
  - 提取每个角色对每件作品的评论
  - 识别模式和风格
```

**具体应用**:
- [ ] 读取所有24条现有评论（每条100-120字）
- [ ] 分析每个角色的当前风格
- [ ] 识别评论的结构和论点
- [ ] 获取准确的RPAIT得分上下文

#### Phase 3a: 理解角色背景
```
用途：读取和分析6位角色的传记
工具命令：
  Read /js/data.js (offset: 50, limit: 100)

输出：
  - 当前的角色传记文本
  - 角色信息字段结构
  - 区域/时代背景
```

---

### 2. Edit 工具 - 修改文本和代码

**用途**: 直接修改 `js/data.js` 中的评论和角色信息

**应用场景**:

#### Phase 2b: 扩展评论文本
```
用途：将原评论替换为扩展版本
工具命令：
  Edit /js/data.js
    old_string: "原始评论文本（100-120字）"
    new_string: "扩展评论文本（160-180字）"

示例：
  old_string: "此作品展现了笔墨与机器的对话。机械臂如同现代文人画家之手...值得沉思。"
  new_string: "此作品展现了笔墨与机器的对话。机械臂如同现代文人画家之手...

             在我看来，艺术的真谛不在于笔的精确，而在于心的表达。...

             The robotic arm moves with mechanical precision..."
```

**具体应用** (24次Edit操作):
- [ ] 编辑 Artwork 1, Su Shi 的评论
- [ ] 编辑 Artwork 1, Guo Xi 的评论
- [ ] ... (重复所有6个角色 × 4件作品 = 24次)

#### Phase 3b: 扩展角色传记
```
用途：增强角色背景信息
工具命令：
  Edit /js/data.js
    old_string: "现有的角色传记（50字）"
    new_string: "扩展的角色传记（120字）+ 新字段"

示例：
  old_string: "Literati painter, poet, and philosophical thinker..."
  new_string: "Su Shi (1037-1101) was a towering figure in Northern Song literati culture...
              [更多详细内容]"
```

**具体应用** (6次Edit操作):
- [ ] 编辑 Su Shi 传记
- [ ] 编辑 Guo Xi 传记
- [ ] 编辑 John Ruskin 传记
- [ ] 编辑 Mama Zola 传记
- [ ] 编辑 Professor Petrova 传记
- [ ] 编辑 AI Ethics 专家传记

---

### 3. WebSearch 工具 - 搜索艺术历史和背景信息

**用途**: 获取艺术历史、哲学背景和参考资料来充实评论

**应用场景**:

#### Phase 2c: 研究艺术历史背景
```
用途：为每个角色收集相关的艺术历史信息
工具命令：
  WebSearch "Sougwen Chung robotic painting art"
  WebSearch "literati painting philosophy Su Shi"
  WebSearch "Russian formalism Elena Petrova"
  WebSearch "Victorian art criticism John Ruskin"
  WebSearch "West African oral tradition art interpretation"
  WebSearch "landscape painting theory Guo Xi"

返回结果：
  - 艺术历史背景
  - 哲学框架参考
  - 相关的艺术运动
  - 批评理论资源
```

**具体应用** (6-10次WebSearch操作):
- [ ] Su Shi 和文人画哲学
- [ ] Guo Xi 山水画法度理论
- [ ] John Ruskin 道德美学
- [ ] 西非口头传统和艺术解释
- [ ] 俄罗斯形式主义
- [ ] AI和创意伦理
- [ ] Sougwen Chung 作品的技术背景

**关键搜索词**:
- "Sougwen Chung artist robotic painting"
- "literati painting ink wash philosophy"
- "formal composition landscape painting principles"
- "moral aesthetics Victorian art criticism"
- "collective meaning-making oral traditions"
- "formalism structural analysis art theory"
- "machine learning creativity authenticity ethics"

---

### 4. WebFetch 工具 - 获取特定网页内容

**用途**: 从特定URL获取详细信息（比WebSearch更精确）

**应用场景**:

#### Phase 1a: 获取Sougwen Chung艺术家信息
```
用途：从官方来源获取作品信息和图片来源
工具命令：
  WebFetch
    url: "https://www.sougwen.com" (如果存在)
    prompt: "Find high-resolution images of Memory, Painting Operation Unit,
             All Things in All Things, and Exquisite Dialogue artworks"

返回：
  - 作品描述
  - 图片链接
  - 版权信息
  - 创作背景
```

#### Phase 2c: 获取学术资源
```
用途：从学术数据库或论文获取批评理论
工具命令：
  WebFetch
    url: "https://en.wikipedia.org/wiki/Literati_painting"
    prompt: "Extract key concepts about literati painting philosophy
             and Su Shi's contributions"

返回：
  - 文人画的定义
  - 苏轼的哲学贡献
  - 关键美学原则
```

**具体应用** (3-5次WebFetch操作):
- [ ] Sougwen Chung 官方信息
- [ ] 艺术展览目录
- [ ] 学术论文或数据库条目
- [ ] 美学理论资源

---

### 5. Bash 工具 - 执行系统命令

**用途**: 创建目录、处理图片、运行服务器、提交git

**应用场景**:

#### Phase 1b: 创建assets目录
```
用途：创建文件系统目录结构
命令：
  mkdir -p /assets
  或在Windows：
  mkdir assets (使用PowerShell)

验证：
  ls -la assets/
```

#### Phase 1c: 优化图片（使用ImageMagick）
```
用途：将高分辨率图片调整为web最优大小
命令：
  # 调整大小并压缩
  magick artwork-1.jpg -resize 1200x800 -quality 85 /assets/artwork-1.jpg

  # 批处理所有图片
  for file in *.jpg; do
    magick "$file" -resize 1200x800 -quality 85 "/assets/${file}"
  done

检查文件大小：
  ls -lh /assets/
```

#### Phase 1d: 运行本地测试服务器
```
用途：在本地测试图片加载和页面显示
命令：
  cd /I:/VULCA-EMNLP2025
  python -m http.server 9999

验证：
  在浏览器访问 http://localhost:9999
```

#### Phase 4: 提交更改到git
```
用途：保存完成的工作
命令：
  git add js/data.js
  git add /assets/
  git commit -m "feat: Add artwork images and enrich critical commentary"
  git push origin master

验证：
  git status
  git log --oneline -5
```

**具体应用**:
- [ ] 创建 /assets 目录
- [ ] 优化和转换图片文件
- [ ] 启动本地服务器用于测试
- [ ] 运行git命令提交更改

---

### 6. Playwright MCP 工具 - 浏览器自动化测试

**用途**: 自动化测试图片加载、响应式布局、交互功能

**应用场景**:

#### Phase 1e: 测试图片加载
```
用途：验证所有4张图片加载正确
工具命令：
  mcp__playwright__browser_navigate
    url: "http://localhost:9999"

  mcp__playwright__browser_snapshot
    (获取页面当前状态)

期望结果：
  - 第一件作品的图片可见
  - 图片显示正确的纵横比
  - 无404错误
```

#### Phase 4a: 测试响应式设计
```
用途：在不同屏幕大小测试图片和布局
工具命令：
  # 测试移动(375px)
  mcp__playwright__browser_resize
    width: 375
    height: 667

  mcp__playwright__browser_take_screenshot
    filename: "mobile-375px.png"

  # 测试平板(768px)
  mcp__playwright__browser_resize
    width: 768
    height: 1024

  mcp__playwright__browser_take_screenshot
    filename: "tablet-768px.png"

  # 测试桌面(1440px)
  mcp__playwright__browser_resize
    width: 1440
    height: 900

  mcp__playwright__browser_take_screenshot
    filename: "desktop-1440px.png"
```

#### Phase 4b: 测试导航和交互
```
用途：验证轮播图和导航功能
工具命令：
  mcp__playwright__browser_click
    element: "Next button"
    ref: "#nav-next"

  mcp__playwright__browser_snapshot
    (验证第二件作品显示)

  mcp__playwright__browser_click
    element: "Artwork indicator dot 3"
    ref: "[data-index='2']"

  mcp__playwright__browser_snapshot
    (验证第三件作品显示)
```

#### Phase 4c: 验证内容加载
```
用途：验证评论文本正确加载和显示
工具命令：
  mcp__playwright__browser_evaluate
    function: "() => {
      const critiques = document.querySelectorAll('.critique-text');
      return {
        count: critiques.length,
        firstText: critiques[0].textContent.substring(0, 100),
        wordCounts: Array.from(critiques).map(c => c.textContent.split(' ').length)
      };
    }"

期望结果：
  - count: 3 (每个作品显示3个评论)
  - 每条评论包含150+字

返回示例：
  {
    count: 3,
    firstText: "此作品展现了笔墨与机器的对话。机械臂如同现代文人画家之手...",
    wordCounts: [180, 175, 178]
  }
```

#### Phase 4d: 性能测试
```
用途：检查页面加载时间和性能
工具命令：
  mcp__playwright__browser_network_requests
    (获取所有网络请求)

  mcp__playwright__browser_console_messages
    onlyErrors: true
    (检查是否有JavaScript错误)

期望结果：
  - 图片加载<2秒
  - 无404错误
  - 无console错误
```

**具体应用** (10-15次Playwright操作):
- [ ] 验证4张图片都加载成功
- [ ] 测试3个响应式断点(mobile/tablet/desktop)
- [ ] 测试轮播导航(previous/next/dots)
- [ ] 验证评论文本长度和内容
- [ ] 检查性能和错误

---

### 7. TodoWrite 工具 - 任务跟踪

**用途**: 跟踪项目进度，管理多个任务

**应用场景**:

```
用途：创建和维护任务清单
工具命令：
  TodoWrite
    todos: [
      {
        content: "Research and download Sougwen Chung artwork images",
        status: "pending",
        activeForm: "Researching artwork images"
      },
      {
        content: "Optimize images for web (resize, compress)",
        status: "pending",
        activeForm: "Optimizing images"
      },
      {
        content: "Create /assets directory and deploy images",
        status: "pending",
        activeForm: "Deploying images to assets"
      },
      {
        content: "Test image loading on all responsive breakpoints",
        status: "pending",
        activeForm: "Testing image display"
      },
      ...
    ]

更新示例（Phase 1完成后）：
  {
    content: "Research and download Sougwen Chung artwork images",
    status: "completed",  // ← 改为completed
    activeForm: "Researching artwork images"
  }
```

**使用时机**:
- [ ] 项目开始时：创建完整任务列表
- [ ] 完成每个阶段时：更新任务状态
- [ ] Phase 2开始时：添加24条评论扩展的子任务
- [ ] 最后：所有任务标记为completed

---

### 8. Task 工具 - 启动专门的代理

**用途**: 用专门的Agent处理复杂的研究或代码任务

**应用场景**:

#### Phase 2a: 研究艺术历史背景
```
用途：让Explore Agent深入理解艺术历史和哲学框架
工具命令：
  Task
    subagent_type: "Explore"
    description: "Research art history and philosophy"
    prompt: "
      I need to enrich critical commentary about Sougwen Chung artworks
      from the perspectives of 6 different art critics/philosophers:

      1. Su Shi (Northern Song literati): Find key concepts about
         文人画 (literati painting) philosophy, Daoist aesthetics,
         and the emphasis on 意趣 (philosophical intent) over technique

      2. Guo Xi (Northern Song landscape): Research 山水画 (landscape painting)
         compositional principles, especially 高远 (high distance) perspective
         and 《林泉高致》 (A Lofty Message of Forests and Streams)

      3. John Ruskin (Victorian): Study his moral aesthetics, emphasis on
         truthfulness in art, and social responsibility of artists

      4. Mama Zola (West African): Research oral traditions and collective
         meaning-making in art interpretation from African perspectives

      5. Professor Petrova (Russian Formalist): Find concepts about
         defamiliarization, device-based analysis, and formal elements

      6. AI Ethics expert: Research authenticity, creativity definitions,
         and human-machine boundaries in contemporary philosophy

      For each perspective, provide:
      - Key philosophical concepts
      - Historical context and influences
      - Relevant examples or references
      - Distinctive vocabulary and phrasing
      - How each framework might analyze robotic art
    "
    model: "sonnet"  // 较复杂的任务用Sonnet

期望输出：
  - 每个角色的哲学框架详细说明
  - 相关的艺术史背景
  - 可用于扩展评论的参考资料
```

#### Phase 2b: 理解RPAIT框架与评论的关系
```
用途：理解RPAIT得分与评论内容的关联
工具命令：
  Task
    subagent_type: "general-purpose"
    description: "Analyze RPAIT framework"
    prompt: "
      Analyze the RPAIT framework and how it relates to art criticism:

      R (Representational): How well does the artwork represent/depict things?
      P (Procedural): What about the process/technique/method?
      A (Aesthetic): How aesthetically beautiful or coherent?
      I (Interpretive): How rich in meaning and interpretation?
      T (Thematic): How well-developed are the themes?

      For each Sougwen Chung artwork:
      1. Memory (2022) - Second Generation
      2. Painting Operation Unit: First Generation (2015)
      3. All Things in All Things (2018)
      4. Exquisite Dialogue: Sepals, Petals, Thorns (2020)

      Explain why different critics might score these differently on RPAIT,
      and how those scores should be reflected in expanded critique text.

      Provide examples of how to strengthen RPAIT dimensions:
      - If R is low (non-representational), how to write about that?
      - If I is high (interpretively rich), what language to use?
      - Etc.
    "
    model: "haiku"  // 分析任务可用Haiku

期望输出：
  - RPAIT各维度的解释
  - 每件作品的RPAIT得分合理性
  - 如何在评论中反映这些维度
```

---

### 9. AskUserQuestion 工具 - 获取用户反馈

**用途**: 在关键决策点向用户征询意见

**应用场景**:

#### Phase 1a: 图片来源确认
```
用途：在下载前确认用户的图片来源偏好
工具命令：
  AskUserQuestion
    questions: [
      {
        question: "Which image sources do you prefer?",
        header: "Image Source",
        multiSelect: false,
        options: [
          {
            label: "Official artist portfolio",
            description: "High quality, authorized images from Sougwen Chung's website"
          },
          {
            label: "Museum/gallery documentation",
            description: "Exhibition photos from institutions"
          },
          {
            label: "Academic sources",
            description: "Images from research papers or catalogs"
          },
          {
            label: "No preference - use best available",
            description: "Find highest quality regardless of source"
          }
        ]
      }
    ]

用户答案：将影响图片搜索策略
```

#### Phase 2a: 评论扩展风格确认
```
用途：确认评论扩展的方向和风格
工具命令：
  AskUserQuestion
    questions: [
      {
        question: "How should we expand the critiques?",
        header: "Expansion Style",
        multiSelect: false,
        options: [
          {
            label: "Add more detail to existing ideas",
            description: "Deepen current arguments with more examples and context"
          },
          {
            label: "Add new analytical frameworks",
            description: "Introduce additional perspectives and theories"
          },
          {
            label: "Both",
            description: "Deepen existing + add new frameworks"
          }
        ]
      },
      {
        question: "Should persona voices be more distinct?",
        header: "Voice Differentiation",
        multiSelect: false,
        options: [
          {
            label: "Much more distinct",
            description: "Make each persona's perspective very unique"
          },
          {
            label: "Slightly more distinct",
            description: "Subtly strengthen existing voice differences"
          },
          {
            label: "Keep similar",
            description: "Maintain current similarity level"
          }
        ]
      }
    ]

用户答案：将指导评论扩展策略
```

#### Phase 4: 最终审查和批准
```
用途：获得最终批准和反馈
工具命令：
  AskUserQuestion
    questions: [
      {
        question: "Is the enriched content ready to deploy?",
        header: "Deployment Approval",
        multiSelect: false,
        options: [
          {
            label: "Yes, deploy to production",
            description: "Content quality meets standards, ready for live site"
          },
          {
            label: "Needs revisions",
            description: "Good progress but some adjustments needed"
          },
          {
            label: "Major revisions needed",
            description: "Significant changes required before deployment"
          }
        ]
      }
    ]

用户答案：决定是否提交到git和部署
```

---

## 工具使用时间表

### Phase 1: 图片基础 (2-3 hours)

| 工具 | 任务 | 次数 | 时间 |
|------|------|------|------|
| AskUserQuestion | 确认图片来源 | 1 | 5min |
| WebSearch | 搜索Sougwen Chung | 2-3 | 20min |
| WebFetch | 获取官方信息 | 1-2 | 15min |
| Bash | 创建目录、优化图片 | 3-4 | 30min |
| mcp__playwright__browser_* | 测试加载 | 5-8 | 30min |
| TodoWrite | 更新任务 | 1 | 10min |

### Phase 2: 评论充实 (4-6 hours)

| 工具 | 任务 | 次数 | 时间 |
|------|------|------|------|
| Task (Explore) | 研究艺术历史 | 1 | 1h |
| WebSearch | 补充研究资料 | 5-8 | 40min |
| Read | 理解现有评论 | 2-3 | 20min |
| Edit | 扩展24条评论 | 24 | 3-4h |
| TodoWrite | 追踪进度 | 4 | 10min |

### Phase 3: 角色增强 (1-2 hours)

| 工具 | 任务 | 次数 | 时间 |
|------|------|------|------|
| Read | 读取现有传记 | 1 | 10min |
| Edit | 扩展6个传记 | 6 | 30min |
| WebSearch | 补充历史背景 | 3 | 20min |
| TodoWrite | 更新任务 | 1 | 5min |

### Phase 4: 验证和打磨 (1-2 hours)

| 工具 | 任务 | 次数 | 时间 |
|------|------|------|------|
| mcp__playwright__browser_* | 响应式测试 | 15-20 | 45min |
| Bash | 启动服务器、提交git | 2-3 | 15min |
| AskUserQuestion | 获取反馈 | 2 | 10min |
| TodoWrite | 完成所有任务 | 1 | 5min |

---

## 工具组合示例

### 场景1: 扩展Su Shi对作品1的评论

**步骤流程**:

```
1. Read /js/data.js
   → 获取当前的Su Shi评论文本

2. WebSearch "Su Shi literati painting philosophy"
   → 获取背景知识

3. Edit /js/data.js
   → 替换为扩展版本（120字 → 180字）

4. mcp__playwright__browser_navigate + mcp__playwright__browser_evaluate
   → 验证修改后的文本加载正确

5. TodoWrite
   → 标记"Expand Su Shi - Artwork 1" 为completed
```

### 场景2: 优化和部署图片

**步骤流程**:

```
1. WebFetch
   → 从官方源获取高质量图片

2. Bash: ImageMagick
   → 调整大小为1200px，质量85%

3. Bash: mkdir
   → 创建/assets目录

4. Bash: cp
   → 放置图片到/assets/

5. Bash: python -m http.server
   → 启动本地测试服务器

6. mcp__playwright__browser_*
   → 测试所有响应式断点

7. Bash: git add/commit/push
   → 提交更改到GitHub

8. TodoWrite
   → 标记Phase 1为完成
```

### 场景3: 验证最终质量

**步骤流程**:

```
1. mcp__playwright__browser_resize (375px)
   → 测试移动设备显示

2. mcp__playwright__browser_evaluate
   → 检查评论长度和内容

3. mcp__playwright__browser_snapshot
   → 截图验证布局

4. mcp__playwright__browser_network_requests
   → 验证无404错误

5. mcp__playwright__browser_console_messages (onlyErrors: true)
   → 检查是否有JavaScript错误

6. AskUserQuestion
   → 获取用户最终批准

7. TodoWrite
   → 标记所有任务为completed
```

---

## 工具选择决策树

```
需要完成什么任务?

├─ 读取现有文件?
│  └─ Read 工具
│
├─ 修改代码/数据?
│  └─ Edit 工具
│
├─ 搜索信息?
│  ├─ 广泛搜索?
│  │  └─ WebSearch
│  └─ 特定页面?
│     └─ WebFetch
│
├─ 执行系统操作?
│  ├─ 文件操作、优化、git?
│  │  └─ Bash
│  └─ 浏览器测试?
│     └─ mcp__playwright__browser_*
│
├─ 复杂的研究/分析?
│  └─ Task (Explore/general-purpose)
│
├─ 需要用户决策?
│  └─ AskUserQuestion
│
└─ 跟踪进度?
   └─ TodoWrite
```

---

## 工具调用频率统计

| 工具 | 总调用数 | 主要用途 |
|------|---------|---------|
| Edit | 30+ | 修改评论和传记 |
| mcp__playwright__browser_* | 20+ | 测试和验证 |
| WebSearch | 10+ | 研究背景信息 |
| TodoWrite | 8-10 | 任务跟踪 |
| Bash | 8-10 | 系统操作 |
| Read | 5-8 | 理解现有内容 |
| Task | 2-3 | 深度研究 |
| WebFetch | 2-3 | 获取特定资源 |
| AskUserQuestion | 2-3 | 用户确认 |

---

## 性能和最佳实践

### Bash 优化
- 批处理图片而不是逐个处理
- 使用管道链接命令
- 避免不必要的文件操作

### Edit 优化
- 尽可能确保old_string唯一
- 如果不唯一，提供更多上下文
- 考虑提供3-5行上下文

### Playwright 优化
- 一次性获取多个信息（snapshot vs individual clicks）
- 批量测试多个屏幕尺寸
- 重用browser实例避免重复启动

### WebSearch 优化
- 使用具体关键词（如"Sougwen Chung"）
- 每次搜索清晰的意图
- 限制搜索结果数量

---

## 故障排除

### 常见问题

**Q: Edit工具说old_string不唯一？**
A: 增加上下文行数，包括前后的代码行

**Q: Playwright找不到元素？**
A: 使用browser_snapshot先查看当前页面状态，确认选择器正确

**Q: WebSearch没有找到我需要的信息？**
A: 尝试WebFetch具体URL，或改进搜索关键词

**Q: Bash命令返回权限错误？**
A: 使用完整的绝对路径，确保目录存在

---

## 总结

完成这个 OpenSpec 变更需要大约 **35-45 次工具调用**，分布如下：

- **Edit**: 最频繁（30+ 次修改评论和传记）
- **Playwright**: 测试验证（20+ 次）
- **WebSearch**: 研究支持（10+ 次）
- **其他**: 辅助操作（5-10 次）

所有工具配合使用，构建一个完整的开发 → 测试 → 验证 → 部署流程。
