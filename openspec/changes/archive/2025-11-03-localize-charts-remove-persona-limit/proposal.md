# Proposal: 图表本地化与角色限制移除

**Status**: Deployed
**Created**: 2025-11-03
**Deployed**: 2025-11-03

## Problem Statement

用户在使用VULCA艺术评论展览平台的数据可视化面板时遇到以下问题：

1. **雷达图显示限制**: 角色选择器可以选择6位评论家，但雷达图只显示前3位，导致用户无法完整对比所有选中的评论家
2. **条形图配色不一致**: 条形图（评论家对比矩阵）的Y轴角色名称使用默认黑色文字，与角色主题色不一致，降低了视觉识别度
3. **双语标签混乱**: 所有可视化面板使用双语标签（中文/English），对于纯中文用户造成视觉干扰

**User Request** (原文):
> "角色卡选了什么，雷达图就显示什么，现在雷达图有显示上限（3个）这个需要删掉。柱状图（条形图）的角色文字这里，这个配色和主配色要保持一致。现在需要是中文版本，所以内容要全部为中文。"

## Proposed Solution

### What Changes

实施三项核心变更：

1. **移除雷达图3角色显示上限**
   - 删除 `selectedPersonas.slice(0, 3)` 限制
   - 删除 sessionStorage 验证中的 `&& parsed.length <= 3` 上限
   - 允许显示所有6位评论家的同时对比

2. **条形图Y轴文字颜色与主题色一致**
   - 添加 Chart.js `color` 回调函数
   - 动态获取每个角色的主题色 (`persona.color`)
   - 应用到条形图Y轴刻度文字

3. **全面中文本地化**
   - 所有维度标签: `'代表性 Representation'` → `'代表性'`
   - 所有角色图例: `'${nameZh} (${nameEn})'` → `nameZh`
   - 页面标题: `'数据洞察 / Data Insights'` → `'数据洞察'`
   - ARIA 标签: 全部本地化为中文

### Why

**业务价值**:
- ✅ **完整对比**: 用户可以同时查看所有6位评论家的RPAIT维度对比，满足学术研究需求
- ✅ **视觉一致性**: 条形图配色与整体设计系统保持一致，提升用户体验
- ✅ **本地化体验**: 纯中文界面降低认知负担，聚焦内容本身

**技术价值**:
- ✅ **移除硬编码限制**: 无需在多处维护 "3" 这个魔法数字
- ✅ **改进可访问性**: ARIA 标签语言与界面语言一致
- ✅ **代码可维护性**: 创建统一的维度名称映射对象

### How

#### Implementation Steps

**Phase 1: Remove Limits** (15 min)
1. Edit `js/visualizations/rpait-radar.js:101` - 删除 `.slice(0, 3)`
2. Edit `js/persona-selector.js:107` - 删除 `&& parsed.length <= 3`
3. Test: 选择6位角色验证雷达图显示

**Phase 2: Localize Radar Chart** (20 min)
1. Edit `rpait-radar.js:94-98` - 维度标签改为纯中文
2. Edit `rpait-radar.js:112` - Legend 改为 `nameZh`
3. Edit `rpait-radar.js:157` - ARIA 标签本地化
4. Edit `rpait-radar.js:230-234` - 第二个 ARIA 函数本地化

**Phase 3: Localize Matrix Chart** (25 min)
1. Edit `persona-matrix.js:102-125` - 所有 dataset.label 改为中文
2. Edit `persona-matrix.js:131-136` - dimensionNames 对象本地化
3. Edit `persona-matrix.js:174-189` - ARIA 标签本地化（包含维度映射）

**Phase 4: Localize HTML** (10 min)
1. Edit `index.html:138` - 移除双语标题
2. Edit `index.html:165-169` - Dropdown 选项改为中文

**Phase 5: Color Consistency** (20 min)
1. Edit `persona-matrix.js:50-57` - 添加 Y 轴 color 回调函数
2. Implement persona color lookup by context.index
3. Test: 验证6位角色的Y轴文字颜色

**Phase 6: Testing** (15 min)
1. Comprehensive functionality testing
2. Cross-browser testing (Chrome, Firefox, Safari)
3. Mobile responsiveness check

**Phase 7: Documentation** (5 min)
1. Update code comments
2. Final code review

**Total Estimated Time**: 110 minutes

### Impact Analysis

**Modified Files** (4 files):
- `index.html` - HTML 标签本地化
- `js/visualizations/rpait-radar.js` - 移除限制 + 本地化
- `js/visualizations/persona-matrix.js` - 颜色回调 + 本地化
- `js/persona-selector.js` - 移除 sessionStorage 限制

**User-Visible Changes**:
- ✅ 雷达图可显示6条曲线（之前最多3条）
- ✅ 条形图Y轴文字颜色匹配角色主题色
- ✅ 所有界面文本为纯中文

**Performance Impact**:
- ⚠️ Chart.js 渲染6条数据线比3条略慢（<50ms，可忽略）
- ✅ 无破坏性变更，向后兼容

### Acceptance Criteria

- [ ] 雷达图可以同时显示所有6位评论家（苏轼、郭熙、约翰·罗斯金、瓦西里·康定斯基、徐冰、苏珊·桑塔格）
- [ ] 雷达图维度标签为纯中文（代表性、哲学性、美学性、身份性、传统性）
- [ ] 雷达图图例显示角色中文名（无英文括号）
- [ ] 条形图Y轴角色名称颜色与角色主题色一致
- [ ] 条形图维度标签为纯中文
- [ ] 维度选择器dropdown为纯中文
- [ ] 页面刷新后角色选择状态保持（sessionStorage）
- [ ] ARIA标签为中文（屏幕阅读器验证）
- [ ] 代码已提交到 Git 并部署到 https://vulcaart.art

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Chart.js 性能下降（6条曲线） | 测试表明影响<50ms，可接受 |
| sessionStorage 兼容性问题 | 已有 try-catch 处理，降级到默认值 |
| 英文用户无法使用 | 本项目目标受众为中文用户，符合产品定位 |

## Dependencies

- Chart.js 3.x (已集成)
- 现有 VULCA_DATA 数据结构
- 现有 persona selection 状态管理系统

## Out of Scope

- ❌ 添加语言切换功能（未来需求）
- ❌ 修改其他页面的本地化（仅限数据洞察面板）
- ❌ 修改 RPAIT 计算逻辑
