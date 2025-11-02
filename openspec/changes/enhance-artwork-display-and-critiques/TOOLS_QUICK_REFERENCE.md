# Claude Code 工具快速参考卡片

## 9大工具速查表

### 1️⃣ Read - 读取文件
```
用途: 理解现有代码/数据
频率: 中等 (5-7次)

语法:
  Read /js/data.js

参数:
  file_path (必需): 绝对路径
  offset: 行号 (可选)
  limit: 读取行数 (可选)

何时使用:
  ✓ 理解现有评论结构
  ✓ 查看角色传记
  ✓ 验证文件内容

何时NOT:
  ✗ 修改内容 → 用Edit
  ✗ 搜索文本 → 用Grep
```

---

### 2️⃣ Edit - 修改文件
```
用途: 修改代码/数据内容
频率: 最高 (30次!)

语法:
  Edit /js/data.js
    old_string: "要替换的文本"
    new_string: "新文本"

最佳实践:
  1. old_string必须唯一
  2. 包含充分的上下文
  3. 先用Read确保匹配
  4. 一次Edit一个修改

何时使用:
  ✓ 修改评论内容 (24次)
  ✓ 扩展角色传记 (6次)

何时NOT:
  ✗ 创建新文件 → 用Write
  ✗ 批量搜索 → 用Grep
```

---

### 3️⃣ WebSearch - 搜索网络
```
用途: 搜索艺术历史、哲学背景
频率: 常见 (10-14次)

语法:
  WebSearch "Su Shi literati painting"

参数:
  query (必需): 搜索关键词
  allowed_domains: 限制域名
  blocked_domains: 排除域名

关键搜索词:
  • "Sougwen Chung robotic art"
  • "literati painting philosophy"
  • "landscape painting composition theory"
  • "Victorian art criticism morality"
  • "West African oral traditions"
  • "Russian formalism structural analysis"
  • "machine learning creativity ethics"

何时使用:
  ✓ 获取艺术历史背景
  ✓ 补充理论参考
  ✓ 验证历史事实

何时NOT:
  ✗ 需要特定页面 → 用WebFetch
  ✗ 本地文件 → 用Read
```

---

### 4️⃣ WebFetch - 获取页面内容
```
用途: 从特定URL获取详细内容
频率: 少见 (1-2次)

语法:
  WebFetch
    url: "https://example.com"
    prompt: "查找什么内容"

使用场景:
  1. Sougwen Chung官方网站
  2. 艺术展览目录
  3. 学术数据库

何时使用:
  ✓ 获取特定作品信息
  ✓ 获取高质量图片来源

何时NOT:
  ✗ 广泛搜索 → 用WebSearch
  ✗ 本地文件 → 用Read
```

---

### 5️⃣ Bash - 系统命令
```
用途: 文件操作、系统管理、git
频率: 中等 (5-7次)

常用命令:
  # 创建目录
  mkdir -p /assets

  # 列出文件
  ls -lh /assets/

  # 图片优化 (ImageMagick)
  magick input.jpg -resize 1200x800 -quality 85 output.jpg

  # 启动HTTP服务器
  python -m http.server 9999

  # 查看git状态
  git status

  # 提交更改
  git add .
  git commit -m "描述"
  git push origin master

何时使用:
  ✓ 创建目录结构
  ✓ 优化图片
  ✓ 启动测试服务器
  ✓ git操作

何时NOT:
  ✗ 文件编辑 → 用Edit
  ✗ 搜索文本 → 用Grep
```

---

### 6️⃣ Playwright (浏览器测试)
```
用途: 浏览器自动化测试
频率: 高 (20-28次)

常用方法:

browser_navigate(url)
  → 打开页面
  例: browser_navigate("http://localhost:9999")

browser_resize(width, height)
  → 调整窗口大小 (响应式测试)
  例: browser_resize(375, 667)  // 移动

browser_snapshot()
  → 获取当前页面状态的可访问性树
  例: 查看DOM结构和内容

browser_take_screenshot()
  → 截图 (可视验证)
  例: browser_take_screenshot("mobile.png")

browser_click(element, ref)
  → 点击元素
  例: browser_click("#nav-next")

browser_evaluate(function)
  → 执行JavaScript获取信息
  例: 检查图片是否加载、计数评论等

browser_network_requests()
  → 获取网络请求
  例: 检查404错误、加载时间

browser_console_messages(onlyErrors: true)
  → 获取控制台消息
  例: 检查JavaScript错误

测试清单:
  ☑ 4张图片加载
  ☑ 无404错误
  ☑ 响应式布局 (3个断点)
  ☑ 24条评论显示 (3条/屏)
  ☑ 导航功能正常
  ☑ 性能<2秒

何时使用:
  ✓ 验证页面显示
  ✓ 测试响应式设计
  ✓ 验证交互功能
  ✓ 检查性能和错误
```

---

### 7️⃣ Task (启动Agent)
```
用途: 深度研究和分析任务
频率: 少见 (1次主要)

语法:
  Task
    subagent_type: "Explore" 或 "general-purpose"
    description: "短描述"
    prompt: "详细指令"
    model: "haiku" 或 "sonnet"

Agent类型:
  • Explore: 快速代码库探索
  • general-purpose: 复杂任务和研究

主要使用:
  Task (Explore Agent)
    - 研究6位评论家的哲学框架
    - 输出: 背景知识、参考资料、论证框架

何时使用:
  ✓ 需要深度研究
  ✓ 复杂的分析任务
  ✓ 多轮信息收集

何时NOT:
  ✗ 简单搜索 → 用WebSearch
  ✗ 特定页面 → 用WebFetch
```

---

### 8️⃣ AskUserQuestion - 获取用户反馈
```
用途: 获取用户决策和确认
频率: 少见 (2-3次)

语法:
  AskUserQuestion
    questions: [
      {
        question: "问题?",
        header: "分类标签",
        multiSelect: false,
        options: [
          { label: "选项A", description: "描述" },
          { label: "选项B", description: "描述" }
        ]
      }
    ]

使用场景:
  1. Phase 1: 确认图片来源
  2. Phase 2: 确认评论扩展风格
  3. Phase 4: 最终部署批准

何时使用:
  ✓ 需要用户选择
  ✓ 验证关键决策
  ✓ 获取最终批准
```

---

### 9️⃣ TodoWrite - 任务追踪
```
用途: 管理和跟踪项目进度
频率: 定期 (7次)

语法:
  TodoWrite
    todos: [
      {
        content: "做什么",
        status: "pending" | "in_progress" | "completed",
        activeForm: "正在做什么"
      }
    ]

任务状态:
  • pending: 未开始
  • in_progress: 进行中
  • completed: 已完成

使用时机:
  1. 项目开始 → 创建全部任务列表
  2. 每个Phase开始 → 设某些为in_progress
  3. 每个Phase完成 → 更新状态为completed
  4. 最后 → 所有任务都是completed

何时使用:
  ✓ 跟踪长期项目进度
  ✓ 明确任务状态
  ✓ 确保完成所有工作
```

---

## 工具调用顺序优化

### Phase 1: 图片 (顺序重要)
```
1. AskUserQuestion  ← 确认方向
2. WebSearch × 2-3  ← 搜索图片
3. WebFetch × 1-2   ← 获取源
4. Bash × 3-4       ← 创建+优化+部署
5. Playwright × 5-8 ← 验证加载
6. TodoWrite × 1    ← 记录完成
```

### Phase 2: 评论 (可以并行)
```
Task × 1            ← 深度研究 (可并行)
┌─ WebSearch × 2-3  ← 补充搜索 (可并行)
├─ Read × 1         ← 理解原文
├─ Edit × 24        ← 修改评论 (顺序)
└─ Playwright × 验证 ← 定期验证
TodoWrite × 进度    ← 跟踪
```

### Phase 3: 角色 (简单)
```
Read × 1          ← 理解原文
WebSearch × 3     ← 补充背景
Edit × 6          ← 修改传记
TodoWrite × 1     ← 记录
```

### Phase 4: 测试 (详细)
```
Playwright × 15-20 ← 详细测试 (所有断点、交互)
Bash × 2           ← 启服务器、提交git
AskUserQuestion × 1 ← 最终批准
TodoWrite × 1      ← 完成标记
```

---

## 常见问题解答

### Q1: Edit说old_string不唯一？
```
A: 增加上下文

不推荐:
  old_string: "此作品展现了笔墨与机器"

推荐:
  old_string: "
    {
      artworkId: \"artwork-1\",
      personaId: \"su-shi\",
      textZh: \"此作品展现了笔墨与机器的对话。...\"
    }"
```

### Q2: Playwright找不到元素？
```
A: 先用browser_snapshot查看DOM

browser_snapshot()
  → 获取可访问性树
  → 查看实际的class/id/role
  → 确认正确的选择器
```

### Q3: WebSearch没有相关结果？
```
A: 优化搜索词

差:
  WebSearch "艺术"

好:
  WebSearch "Sougwen Chung robotic art"
  WebSearch "literati painting philosophy Su Shi"
```

### Q4: Bash命令返回权限错误？
```
A: 使用完整绝对路径

错误:
  mkdir assets

正确:
  mkdir -p /I:/VULCA-EMNLP2025/assets
```

### Q5: TodoWrite更新频率？
```
A: 在每个主要里程碑更新

推荐:
  - Phase 1 完成后 → 更新一次
  - 每个Artwork后 → 更新一次 (Phase 2)
  - Phase 3, 4 完成后 → 各更新一次

不推荐:
  - 每次修改都更新 (太频繁)
  - 集中在最后更新 (无法跟踪进度)
```

---

## 工具选择决策树 (快速版)

```
需要做什么?

├─ 修改代码/数据?
│  └─ Edit
│
├─ 搜索信息?
│  ├─ 广泛搜索?
│  │  └─ WebSearch
│  └─ 特定页面?
│     └─ WebFetch
│
├─ 系统操作 (创建目录、优化文件、git)?
│  └─ Bash
│
├─ 浏览器测试?
│  └─ Playwright
│
├─ 深度研究?
│  └─ Task (Agent)
│
├─ 用户决策?
│  └─ AskUserQuestion
│
└─ 其他
   ├─ 理解现有内容?
   │  └─ Read
   └─ 追踪进度?
      └─ TodoWrite
```

---

## 实战示例

### 场景: 修改一条评论

```
Step 1: 理解原文
  Read /js/data.js (offset: 120, limit: 10)
  → 找到Su Shi的评论

Step 2: 研究背景
  WebSearch "literati painting philosophy"
  → 获取理论背景

Step 3: 修改内容
  Edit /js/data.js
    old_string: "[原评论 + 足够的上下文]"
    new_string: "[原评论 + 新段落]"

Step 4: 验证显示
  Playwright:
    browser_navigate()
    browser_click("#nav-next") × 3
    browser_snapshot()
    browser_evaluate("count critiques")

Step 5: 记录进度
  TodoWrite
    content: "Expand Su Shi - Artwork 1"
    status: "completed"
```

### 场景: 部署和测试

```
Step 1: 启服务器
  Bash: python -m http.server 9999

Step 2: 测试所有断点
  Playwright × 3 (375px, 768px, 1440px)
    browser_resize()
    browser_snapshot()
    browser_evaluate()

Step 3: 验证内容
  Playwright:
    browser_evaluate("check word count")
    browser_network_requests()
    browser_console_messages()

Step 4: 获取批准
  AskUserQuestion: "Ready to deploy?"

Step 5: 提交代码
  Bash: git add/commit/push

Step 6: 完成记录
  TodoWrite: Phase 4 ✓
```

---

## 工具调用成本估算

```
工具          调用数   估计时间    说明
────────────────────────────────────────
Read          5-7     5分钟      快速读取
Edit          30      90分钟     最耗时 (写作)
WebSearch     10-14   30分钟     知识积累
WebFetch      1-2     10分钟     精确获取
Bash          5-7     20分钟     系统操作
Playwright    20-28   60分钟     详细测试
Task          1       15分钟     深度研究
AskUserQuestion 2     5分钟      快速确认
TodoWrite     7       5分钟      简单更新
────────────────────────────────────────
总计          79-98   240分钟    4小时

(不包括手工思考和创意写作时间)
```

---

## 最后的建议

✅ **DO**
- 按阶段使用工具，而不是随意
- 批量操作而不是逐个
- 充分利用Playwright进行验证
- 定期用TodoWrite跟踪进度

❌ **DON'T**
- 频繁Read同一文件
- Edit前不验证old_string
- 忽视Playwright测试
- 忘记提交git

---

**记住**: 工具是为了让工作更高效，不是增加复杂性。选择最直接的工具完成任务。
