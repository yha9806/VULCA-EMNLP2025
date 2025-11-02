# Claude Code 工具使用工作流

## 完整工作流程图

```
┌─────────────────────────────────────────────────────────────────────┐
│            PHASE 1: 图片基础 (2-3小时)                              │
│                                                                     │
│  [AskUserQuestion]                                                  │
│        ↓ 确认图片来源                                               │
│  ┌─────────────────────────────────────┐                          │
│  │ [WebSearch] × 2-3                   │                          │
│  │ 搜索Sougwen Chung作品图片             │                          │
│  └─────────────────────────────────────┘                          │
│        ↓                                                             │
│  ┌─────────────────────────────────────┐                          │
│  │ [WebFetch] × 1-2                    │                          │
│  │ 从官方来源获取图片信息                 │                          │
│  └─────────────────────────────────────┘                          │
│        ↓                                                             │
│  ┌─────────────────────────────────────┐                          │
│  │ [Bash]                              │                          │
│  │ 1. mkdir /assets                    │                          │
│  │ 2. ImageMagick优化: 1200px, Q85%    │                          │
│  │ 3. cp图片到/assets/                 │                          │
│  └─────────────────────────────────────┘                          │
│        ↓                                                             │
│  ┌─────────────────────────────────────┐                          │
│  │ [Playwright] × 5-8                  │                          │
│  │ 1. browser_navigate(localhost:9999) │                          │
│  │ 2. browser_resize(各断点)           │                          │
│  │ 3. browser_snapshot()               │                          │
│  │ 4. browser_evaluate(检查图片)        │                          │
│  │ 5. browser_network_requests()       │                          │
│  └─────────────────────────────────────┘                          │
│        ↓                                                             │
│  [TodoWrite] 更新任务状态 → Phase 1 ✓                              │
└─────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────┐
│           PHASE 2: 评论充实 (4-6小时)                               │
│                                                                     │
│  ┌─────────────────────────────────────┐                          │
│  │ [Task: Explore Agent] × 1           │                          │
│  │ 深度研究6位评论家的哲学框架            │                          │
│  │ 输出: 背景知识 + 参考资料              │                          │
│  └─────────────────────────────────────┘                          │
│        ↓                                                             │
│  ┌─────────────────────────────────────┐                          │
│  │ [WebSearch] × 5-8                   │                          │
│  │ 补充搜索:                            │                          │
│  │ - Su Shi 文人画哲学                  │                          │
│  │ - Guo Xi 山水画法度                  │                          │
│  │ - John Ruskin 道德美学               │                          │
│  │ - West African oral tradition       │                          │
│  │ - Russian formalism                 │                          │
│  │ - AI ethics & creativity            │                          │
│  └─────────────────────────────────────┘                          │
│        ↓                                                             │
│  ┌─────────────────────────────────────┐                          │
│  │ [Read] /js/data.js                  │                          │
│  │ 理解现有评论结构和内容                │                          │
│  └─────────────────────────────────────┘                          │
│        ↓                                                             │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │ [Edit] × 24 (逐个修改24条评论)                            │     │
│  │                                                          │     │
│  │ For each artwork (4):                                    │     │
│  │   For each persona (6):                                  │     │
│  │     Edit /js/data.js                                     │     │
│  │       old_string: "现有评论 (~120字)"                     │     │
│  │       new_string: "扩展评论 (~180字)"                     │     │
│  │                                                          │     │
│  │ 迭代顺序:                                                │     │
│  │  1. Artwork 1 - Memory (6 × Edit)                       │     │
│  │  2. Artwork 2 - First Generation (6 × Edit)             │     │
│  │  3. Artwork 3 - All Things in All Things (6 × Edit)     │     │
│  │  4. Artwork 4 - Exquisite Dialogue (6 × Edit)           │     │
│  └──────────────────────────────────────────────────────────┘     │
│        ↓                                                             │
│  [TodoWrite] × 4 更新进度 (每个作品后)                             │
│        ↓                                                             │
│  [TodoWrite] 标记 Phase 2 ✓                                        │
└─────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────┐
│           PHASE 3: 角色增强 (1-2小时)                               │
│                                                                     │
│  ┌─────────────────────────────────────┐                          │
│  │ [Read] /js/data.js                  │                          │
│  │ 读取现有的6个角色传记                │                          │
│  └─────────────────────────────────────┘                          │
│        ↓                                                             │
│  ┌─────────────────────────────────────┐                          │
│  │ [WebSearch] × 3                     │                          │
│  │ 补充历史和哲学背景信息                │                          │
│  └─────────────────────────────────────┘                          │
│        ↓                                                             │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │ [Edit] × 6 (扩展6个角色传记)                              │     │
│  │                                                          │     │
│  │ For each persona (6):                                    │     │
│  │   Edit /js/data.js                                       │     │
│  │     old_string: "现有传记 (~50字)"                        │     │
│  │     new_string: "扩展传记 (~120字) + 框架描述"             │     │
│  │                                                          │     │
│  │ 顺序:                                                    │     │
│  │  1. Su Shi                                               │     │
│  │  2. Guo Xi                                               │     │
│  │  3. John Ruskin                                          │     │
│  │  4. Mama Zola                                            │     │
│  │  5. Professor Petrova                                    │     │
│  │  6. AI Ethics Expert                                     │     │
│  └──────────────────────────────────────────────────────────┘     │
│        ↓                                                             │
│  [TodoWrite] 标记 Phase 3 ✓                                        │
└─────────────────────────────────────────────────────────────────────┘
```

```
┌─────────────────────────────────────────────────────────────────────┐
│          PHASE 4: 验证和打磨 (1-2小时)                              │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────┐     │
│  │ [Playwright] × 15-20 (响应式测试)                         │     │
│  │                                                          │     │
│  │ 测试流程:                                                │     │
│  │ 1. browser_navigate(localhost:9999)                     │     │
│  │ 2. For each breakpoint:                                 │     │
│  │    - browser_resize(width, height)                      │     │
│  │    - browser_snapshot()                                 │     │
│  │    - browser_evaluate(check_content)                    │     │
│  │    - browser_click(navigation) [可选]                   │     │
│  │                                                          │     │
│  │ 测试的断点:                                              │     │
│  │ - Mobile: 375×667                                        │     │
│  │ - Tablet: 768×1024                                       │     │
│  │ - Desktop: 1440×900                                      │     │
│  │ - Large: 2560×1440                                       │     │
│  │                                                          │     │
│  │ 验证项:                                                  │     │
│  │ ☑ 4张图片加载成功                                        │     │
│  │ ☑ 无404错误                                              │     │
│  │ ☑ 24条评论显示(每屏3条)                                 │     │
│  │ ☑ 评论长度160-180字                                     │     │
│  │ ☑ 布局自适应各屏幕                                       │     │
│  │ ☑ 导航按钮功能正常                                       │     │
│  └──────────────────────────────────────────────────────────┘     │
│        ↓                                                             │
│  ┌─────────────────────────────────────┐                          │
│  │ [Bash] × 2                          │                          │
│  │ 1. python -m http.server 启服务器    │                          │
│  │ 2. git add/commit/push               │                          │
│  └─────────────────────────────────────┘                          │
│        ↓                                                             │
│  ┌─────────────────────────────────────┐                          │
│  │ [AskUserQuestion] × 1               │                          │
│  │ 最终批准: 是否部署?                  │                          │
│  └─────────────────────────────────────┘                          │
│        ↓                                                             │
│  [TodoWrite] 标记所有任务 Phase 4 ✓ 和总体 ✓                        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 工具使用矩阵

### 按阶段的工具分布

```
                Phase 1   Phase 2   Phase 3   Phase 4   总计
Read            2-3       2-3       1         -         5-7
Edit            -         24        6         -         30
WebSearch       2-3       5-8       3         -         10-14
WebFetch        1-2       -         -         -         1-2
Bash            3-4       -         -         2-3       5-7
Playwright      5-8       -         -         15-20     20-28
Task (Agent)    -         1         -         -         1
AskUserQuestion 1         -         -         1         2
TodoWrite       1         4         1         1         7
─────────────────────────────────────────────────────────────
总调用次数        15-24     36-38     10-11    18-25     79-98
```

### 按工具类型分类

```
┌─────────────────────────────────────┐
│       文件和代码修改工具             │
├─────────────────────────────────────┤
│ Read      × 5-7      (理解现有内容) │
│ Edit      × 30       (修改评论/传记)│
├─────────────────────────────────────┤
│       数据和信息获取工具             │
├─────────────────────────────────────┤
│ WebSearch × 10-14    (搜索背景)    │
│ WebFetch  × 1-2      (获取特定资源) │
│ Task      × 1        (深度研究)    │
├─────────────────────────────────────┤
│       测试和验证工具                 │
├─────────────────────────────────────┤
│ Playwright × 20-28   (浏览器测试)  │
│ Bash      × 5-7      (系统操作)    │
├─────────────────────────────────────┤
│       项目管理工具                   │
├─────────────────────────────────────┤
│ TodoWrite × 7        (任务跟踪)    │
│ AskUser   × 2        (用户确认)    │
└─────────────────────────────────────┘
```

---

## 具体执行序列示例

### Phase 2a: 扩展作品1的所有评论

```
第1条评论 (Su Shi):
  1. [Task: Explore] 研究Su Shi文人画哲学
  2. [Read] 获取现有评论文本
  3. [WebSearch] "literati painting philosophy"
  4. [Edit] 修改js/data.js
     old: "此作品展现了笔墨与机器的对话。...值得沉思。"
     new: "[原文] + [新段落1: 哲学深化] + [新段落2: 艺术历史参考]"
  5. [Playwright] 验证新文本加载
  6. [TodoWrite] 标记完成

第2条评论 (Guo Xi):
  1. [WebSearch] "landscape painting composition principles"
  2. [Read] 获取现有评论
  3. [Edit] 修改评论
  4. [Playwright] 验证
  5. [TodoWrite] 标记完成

... (重复4条)

第5条评论 (Professor Petrova):
  1. [WebSearch] "Russian formalism structural analysis"
  2. [Read] 获取现有评论
  3. [Edit] 修改评论
  4. [Playwright] 验证
  5. [TodoWrite] 标记完成

第6条评论 (AI Ethics):
  1. [WebSearch] "machine learning creativity ethics"
  2. [Read] 获取现有评论
  3. [Edit] 修改评论
  4. [Playwright] 验证
  5. [TodoWrite] 标记"Artwork 1"阶段完成

结果: 作品1的6条评论全部扩展
```

### Phase 4: 完整响应式测试

```
准备:
  1. [Bash] python -m http.server 9999
  2. [Playwright] browser_navigate("http://localhost:9999")

移动测试(375×667):
  1. browser_resize(375, 667)
  2. browser_snapshot() → screenshot-mobile.png
  3. browser_evaluate(verify_images_loaded())
  4. browser_evaluate(check_critique_length())
  5. browser_click("#nav-next") → 验证导航
  6. browser_snapshot() → 验证第2作品显示

平板测试(768×1024):
  1. browser_resize(768, 1024)
  2. browser_snapshot()
  3. browser_evaluate(verify_layout_2column())
  4. browser_evaluate(check_image_width_40percent())

桌面测试(1440×900):
  1. browser_resize(1440, 900)
  2. browser_snapshot()
  3. browser_evaluate(verify_all_responsive())

性能测试:
  1. browser_network_requests() → 检查加载时间
  2. browser_console_messages(onlyErrors: true) → 检查错误

最终验证:
  1. [Bash] git status → 确认所有文件已修改
  2. [Bash] git add/commit/push → 提交更改
  3. [AskUserQuestion] → 获取部署批准

完成:
  1. [TodoWrite] 标记Phase 4 ✓
  2. [TodoWrite] 标记整个项目 ✓
```

---

## 常见工具组合

### 组合1: 单条评论编辑和验证

```
WebSearch → Read → Edit → Playwright → TodoWrite
  │        │     │     │      │
  研究    理解   修改  验证   记录
  背景    原文   内容  显示   进度
```

### 组合2: 完整的图片部署

```
WebFetch → Bash → Bash → Bash → Playwright
   │        │      │      │        │
 获取      创建   优化   部署    测试
 源文件    目录   转换   文件    加载
```

### 组合3: 深度研究和应用

```
Task → WebSearch → Read → Edit → Playwright → TodoWrite
 │        │        │      │        │          │
深度     补充     理解   应用    验证       记录
研究    搜索    现有   到代码   显示       进度
```

---

## 优化策略

### 批量操作优化

**不推荐**: 逐个处理每条评论
```
for i in 1..24:
  WebSearch(topic)      [24次]
  Read(file)            [24次]
  Edit(content)         [24次]
  Playwright(verify)    [24次]
```

**推荐**: 按阶段批量处理
```
WebSearch(all_topics)   [5-8次] ✓ 一次性研究
Task(deep_research)     [1次]   ✓ 深度理解

For Artwork 1:
  Read(file)            [1次]   ✓ 读一次
  Edit(6_critiques)     [6次]   ✓ 批量编辑
  Playwright(verify)    [5-8次] ✓ 一起验证

For Artwork 2:
  ... (repeat)
```

### 工具调用优化建议

| 工具 | 优化方式 |
|------|---------|
| Read | 一次性读取整个文件，而不是多次partial read |
| Edit | 如果修改多个位置，逐个Edit而不是Read-Edit-Edit |
| WebSearch | 组合多个搜索词，一次搜索多个概念 |
| Playwright | 一个session中执行多个操作，避免重复启动 |
| Bash | 使用管道和脚本链接命令 |
| TodoWrite | 在每个主要里程碑更新，不要频繁调用 |

---

## 工具选择快速参考

### "我想... 应该用什么工具?"

| 想要做的事 | 推荐工具 | 备选方案 |
|-----------|---------|---------|
| 理解现有评论 | Read | Task(Explore) |
| 修改评论文本 | Edit | - |
| 查找艺术背景 | WebSearch | WebFetch + Task |
| 获取特定资源 | WebFetch | WebSearch |
| 批量优化图片 | Bash | - |
| 测试页面显示 | Playwright | - |
| 深度研究理论 | Task | WebSearch |
| 获取用户反馈 | AskUserQuestion | - |
| 追踪进度 | TodoWrite | - |

---

## 预期工具调用统计

```
总工具调用: 79-98次

按频度:
  最频繁(10+次):
    - Edit      ████████████████████ 30
    - Playwright █████████████████ 20-28
    - WebSearch ██████████ 10-14

  常见(5-9次):
    - TodoWrite ███ 7
    - Bash      ███ 5-7
    - Read      ███ 5-7

  中等(2-4次):
    - WebFetch  ██ 1-2
    - AskUserQuestion ██ 2

  少见(1次):
    - Task      █ 1

按类型分布:
  修改代码:        30 (Edit)
  测试验证:        20-28 (Playwright)
  研究信息:        11-16 (WebSearch + WebFetch + Task)
  系统操作:        5-7 (Bash)
  项目管理:        7 (TodoWrite)
  用户交互:        2 (AskUserQuestion)
```

---

## 执行清单

使用本指南时，按以下步骤进行:

### ☑ 项目启动
- [ ] 阅读本工作流文档
- [ ] 理解每个Phase的工具流程
- [ ] 准备工具调用的顺序

### ☑ Phase 1执行
- [ ] AskUserQuestion 确认图片来源
- [ ] WebSearch 搜索图片
- [ ] WebFetch 获取官方资源
- [ ] Bash 创建目录和优化图片
- [ ] Playwright 测试图片加载

### ☑ Phase 2执行
- [ ] Task 深度研究角色框架
- [ ] WebSearch 补充背景资料
- [ ] Read 理解现有评论
- [ ] Edit × 24 扩展所有评论
- [ ] Playwright 定期验证

### ☑ Phase 3执行
- [ ] Read 理解现有传记
- [ ] WebSearch 补充历史背景
- [ ] Edit × 6 扩展所有传记

### ☑ Phase 4执行
- [ ] Playwright × 15-20 响应式测试
- [ ] Bash 启动服务器和提交git
- [ ] AskUserQuestion 获取最终批准
- [ ] TodoWrite 标记完成

---

## 下一步

完成阅读本指南后：

1. **开始Phase 1** → 按工作流顺序调用工具
2. **使用快速参考** → 当不确定该用什么工具时查看表格
3. **参考具体示例** → 在执行具体任务时回顾示例代码
4. **跟踪进度** → 用TodoWrite标记每个里程碑
5. **遇到问题** → 查看"常见问题"或工具选择决策树
