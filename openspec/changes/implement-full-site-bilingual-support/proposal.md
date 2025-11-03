# Proposal: Implement Full-Site Bilingual Support

**Status**: Proposed
**Created**: 2025-11-03
**Change ID**: implement-full-site-bilingual-support

---

## Problem Statement

### Current State

VULCA网站已经实现了**部分双语支持**：

**✅ 已实现的双语功能**:
1. **语言切换机制**: 右上角 `lang-toggle` 按钮可以切换 `data-lang` 属性（'zh' ↔ 'en'）
2. **动态内容双语化**:
   - 主页面（index.html）的作品标题使用 `titleZh` / `titleEn`
   - 评论内容使用 `textZh` / `textEn`
   - 评论家姓名使用 `nameZh` / `nameEn`
3. **数据层双语支持**: `js/data.js` 中所有核心数据都有中英文版本
4. **CSS语言切换**: `[data-lang="zh"]` 和 `[data-lang="en"]` 选择器控制部分内容显示

**❌ 缺失的双语内容**:
1. **静态页面文字**（全部为中文）:
   - **pages/about.html**: 关于VULCA、RPAIT评论框架、研究目标、系统架构、研究意义（~800字）
   - **pages/critics.html**: 评论家页面标题、构成说明、RPAIT维度说明（~300字）
   - **pages/process.html**: 系统开发过程7个步骤详细说明（~1000字）
   - **index.html**: 部分UI文本
2. **导航菜单**: 主画廊、评论家、关于、过程（仅中文）
3. **UI元素**: 按钮、标签、提示文字（仅中文）
4. **Meta标签**: 部分页面的 description、og:description 仅中文

### User Impact

**当前问题**:
- ❌ 英语用户点击语言切换按钮后，页面内容大部分仍为中文
- ❌ 导航菜单始终显示中文，无法切换
- ❌ 详细页面（about/critics/process）完全不支持英文
- ❌ 用户体验不一致：主页面部分双语，子页面完全中文

**影响范围**:
- **学术受众**: 国际学术界无法完整理解VULCA系统的研究价值
- **展览访问者**: 英语观众无法阅读展览背景和评论框架说明
- **SEO影响**: 英文搜索引擎无法索引英文内容
- **专业形象**: 语言支持不完整影响项目的国际专业形象

---

## Proposed Solution

### What Changes

建立**完整的双语网站系统**，使所有内容在中英文两种语言下都能完整呈现。

#### 1. 静态内容双语化（HTML属性标记方案）

**方案**: 为每段文字添加 `lang="zh"` 和 `lang="en"` 两个版本，用CSS `[data-lang]` 选择器控制显示。

**示例**:
```html
<!-- Before: 单语内容 -->
<h1>关于VULCA</h1>
<p>VULCA是一个基于人工智能的艺术评论实验系统...</p>

<!-- After: 双语内容 -->
<h1>
  <span lang="zh">关于VULCA</span>
  <span lang="en">About VULCA</span>
</h1>
<p>
  <span lang="zh">VULCA（跨时代艺术评论视角）是一个基于人工智能的艺术评论实验系统...</span>
  <span lang="en">VULCA (Cross-Temporal Art Criticism Perspectives) is an AI-powered art criticism experimental system...</span>
</p>
```

**CSS规则扩展**:
```css
/* Hide inactive language */
[data-lang="zh"] [lang="en"],
[data-lang="en"] [lang="zh"] {
  display: none;
}

/* Show active language */
[data-lang="zh"] [lang="zh"],
[data-lang="en"] [lang="en"] {
  display: inline;
}
```

#### 2. 导航菜单双语化（JavaScript动态渲染）

**方案**: 建立翻译数据对象，用JS根据 `data-lang` 动态更新菜单文字。

**实现**:
```javascript
// navigation-i18n.js
const NAV_I18N = {
  'menu-home': { zh: '主画廊', en: 'Gallery' },
  'menu-critics': { zh: '评论家', en: 'Critics' },
  'menu-about': { zh: '关于', en: 'About' },
  'menu-process': { zh: '过程', en: 'Process' }
};

function updateMenuLanguage(lang) {
  Object.keys(NAV_I18N).forEach(key => {
    const element = document.querySelector(`.${key} .menu-label`);
    if (element) {
      element.textContent = NAV_I18N[key][lang];
    }
  });
}
```

#### 3. URL语言参数支持

**方案**: 支持 `?lang=en` 或 `?lang=zh` URL参数，方便分享特定语言版本。

**实现**:
```javascript
// 1. 读取URL参数
const urlParams = new URLSearchParams(window.location.search);
const urlLang = urlParams.get('lang');

// 2. 优先级: URL > localStorage > 默认值
const preferredLang = urlLang || localStorage.getItem('preferred-lang') || 'zh';

// 3. 设置语言
document.documentElement.setAttribute('data-lang', preferredLang);
if (!urlLang) {
  localStorage.setItem('preferred-lang', preferredLang);
}
```

#### 4. Meta标签双语化

**方案**: 为每个页面添加中英文 description 和 og:description，根据语言切换。

**实现**:
```html
<meta name="description" content="关于VULCA - AI艺术评论实验系统..." data-i18n-key="meta-description">
<meta property="og:description" content="了解VULCA系统、研究目标..." data-i18n-key="og-description">

<script>
// 动态更新meta标签
function updateMetaTags(lang) {
  const descriptions = {
    'meta-description': {
      zh: '关于VULCA - AI艺术评论实验系统...',
      en: 'About VULCA - AI-powered art criticism system...'
    },
    'og-description': {
      zh: '了解VULCA系统、研究目标...',
      en: 'Learn about VULCA system, research goals...'
    }
  };

  document.querySelectorAll('[data-i18n-key]').forEach(el => {
    const key = el.getAttribute('data-i18n-key');
    if (descriptions[key]) {
      el.setAttribute('content', descriptions[key][lang]);
    }
  });
}
</script>
```

---

### Why

**Business Value**:
- ✅ **国际化受众**: 英语用户可以完整访问所有内容
- ✅ **学术传播**: 国际学术界可以完整理解VULCA研究
- ✅ **SEO优化**: 支持英文搜索引擎索引
- ✅ **专业形象**: 完整的双语支持提升国际专业形象

**Technical Value**:
- ✅ **系统完整性**: 完善现有的语言切换机制
- ✅ **可维护性**: HTML属性标记方案易于维护和扩展
- ✅ **SEO友好**: 内容在HTML中，搜索引擎可索引
- ✅ **用户体验**: 语言切换即时生效，无需刷新

**Academic Value**:
- ✅ **研究可及性**: 国际研究者可以引用和讨论VULCA系统
- ✅ **跨文化对话**: 促进中英文学术社区的交流
- ✅ **学术标准**: 符合国际学术项目的双语标准

---

### How

#### Translation Quality Standards

**学术级翻译原则**:
1. **准确性**: 专业术语准确（RPAIT, griot, defamiliarization等）
2. **流畅性**: 符合英语学术写作规范
3. **一致性**: 术语翻译前后一致
4. **完整性**: 保留所有语义信息，不简化或改写

**翻译流程**:
1. 使用AI辅助翻译初稿（Claude Sonnet 4.5）
2. 人工审核和润色（确保学术准确性）
3. 对照原文验证（确保无遗漏）
4. 术语一致性检查

#### Implementation Phases

##### Phase 1: Core Infrastructure (2 hours)

**Tasks**:
1. 扩展CSS语言切换规则（支持所有HTML元素）
2. 创建 `js/navigation-i18n.js`（导航菜单翻译）
3. 更新语言切换逻辑（支持URL参数）
4. 建立翻译术语表（关键术语的标准翻译）

**Deliverables**:
- [ ] `styles/main.css` - 添加通用语言切换规则
- [ ] `js/navigation-i18n.js` - 导航菜单国际化脚本
- [ ] `js/lang-manager.js` - 语言管理器（URL参数支持）
- [ ] `TRANSLATION_GLOSSARY.md` - 术语表（RPAIT, griot, defamiliarization等）

##### Phase 2: Navigation & UI Elements (1.5 hours)

**Content**:
- 导航菜单: 主画廊、评论家、关于、过程
- UI按钮: 切换语言、返回、关闭等
- 状态消息: 加载中、错误提示等

**Deliverables**:
- [ ] 所有导航菜单支持双语切换
- [ ] 所有UI元素支持双语
- [ ] Meta标签动态更新

##### Phase 3: About Page (pages/about.html) (4 hours)

**Content Sections** (~800 words):
1. **Page Header**: 关于VULCA、AI艺术评论实验系统
2. **VULCA系统简介** (~150 words): 系统定义、研究问题
3. **RPAIT评论框架** (~250 words): 5个维度详细说明（R/P/A/I/T）
4. **研究目标** (~150 words): 3个核心目标
5. **系统架构** (~150 words): AI评论家、RPAIT框架、评论生成管道
6. **研究意义** (~100 words): 学术贡献、应用场景

**Deliverables**:
- [ ] 所有标题（h1, h2, h3）双语化
- [ ] 所有段落文字双语化
- [ ] Framework cards 双语化
- [ ] 术语一致性验证

##### Phase 4: Critics Page (pages/critics.html) (2 hours)

**Content Sections** (~300 words):
1. **Page Header**: 评论家、认识6位跨越时代的艺术评论家
2. **评论家构成说明** (~150 words): 真实历史人物vs虚构AI角色
3. **RPAIT评论维度** (~100 words): 5个维度简要说明
4. **Loading Message**: 加载中...

**Note**: 评论家卡片（传记）由已有的 `localize-critics-page-and-optimize-layout` change负责，本提案不包含。

**Deliverables**:
- [ ] 页面标题和副标题双语化
- [ ] 评论家构成说明双语化
- [ ] RPAIT维度列表双语化
- [ ] 加载消息双语化

##### Phase 5: Process Page (pages/process.html) (5 hours)

**Content Sections** (~1000 words):
1. **Page Header**: 系统开发过程
2. **研究设计** (~150 words): 研究问题、框架选择、数据设计
3. **评论家角色建模** (~150 words): 角色选择、理论立场、虚构角色设计
4. **评论生成系统** (~150 words): Prompt工程、质量控制、迭代优化
5. **数据标注与验证** (~150 words): 人工审核、交叉验证、质量保证
6. **系统展示与应用** (~150 words): 网站开发、交互设计、响应式优化

**Deliverables**:
- [ ] 所有标题双语化
- [ ] 7个开发步骤完整翻译
- [ ] 列表项双语化
- [ ] 术语一致性验证

##### Phase 6: Main Page (index.html) (1 hour)

**Content**:
- Scroll indicator text（如有）
- Loading messages
- Error messages
- Tooltip text

**Deliverables**:
- [ ] 主页面所有静态文字双语化
- [ ] 动态内容验证（已有双语支持）

##### Phase 7: Validation & Testing (2 hours)

**Tasks**:
1. **语言切换测试**: 所有页面切换语言后内容完整显示
2. **URL参数测试**: `?lang=en` 和 `?lang=zh` 正确工作
3. **术语一致性**: 所有页面使用相同的术语翻译
4. **翻译质量审核**: 人工检查所有英文内容的准确性和流畅性
5. **响应式测试**: 英文内容在不同屏幕尺寸下正常显示
6. **SEO验证**: Meta标签正确切换

**Deliverables**:
- [ ] 所有页面语言切换功能正常
- [ ] 术语表完整（所有关键术语已标准化）
- [ ] 翻译质量审核报告
- [ ] 跨浏览器测试通过（Chrome, Firefox, Safari, Edge）

**Total Estimated Time**: 17.5 hours

---

## Impact Analysis

### Modified Files

**HTML Files** (4 files):
- `index.html` - 添加英文UI文本、Meta标签双语化
- `pages/about.html` - 所有内容双语化（~800 words）
- `pages/critics.html` - 页面文字双语化（~300 words）
- `pages/process.html` - 所有内容双语化（~1000 words）

**CSS Files** (1 file):
- `styles/main.css` - 扩展语言切换规则（~30行）

**JavaScript Files** (3 files):
- `js/navigation-i18n.js` - 新建（导航菜单翻译，~50行）
- `js/lang-manager.js` - 新建（语言管理器，~80行）
- `js/navigation.js` - 更新（集成语言切换，~10行）

**New Files** (2 files):
- `TRANSLATION_GLOSSARY.md` - 术语表
- `openspec/changes/implement-full-site-bilingual-support/` - OpenSpec文档

**Total Lines of Code**: ~200 lines (JS + CSS)
**Total Translation Content**: ~2100 words

### User-Visible Changes

**✅ After Implementation**:
1. **完整的语言切换**: 点击语言按钮后，所有内容（导航、标题、正文、UI）都切换为英文
2. **URL分享**: 可以通过 `?lang=en` 分享英文版本链接
3. **语言记忆**: 用户的语言偏好被记住，下次访问时自动应用
4. **一致的体验**: 主页面和所有子页面的语言支持一致
5. **SEO改进**: 英文搜索引擎可以索引英文内容

**⚠️ Breaking Changes**: None - 完全向后兼容

---

## Dependencies & Sequencing

**Prerequisites**: None - 基于现有的 `data-lang` 机制扩展

**Parallel Work**:
- ✅ Phase 1 (Infrastructure) 必须先完成
- ⏸️ Phase 2-6 (Content Translation) 可以并行进行
- ⏸️ Phase 7 (Validation) 必须在所有内容完成后进行

**Related Changes**:
- `localize-critics-page-and-optimize-layout` - 评论家传记双语化（独立进行）

---

## Alternatives Considered

### Alternative 1: JavaScript动态渲染方案

**Approach**: 建立 `i18n.js` 翻译文件，用JS根据语言动态替换所有文本。

**Rejected Reasons**:
- ❌ **SEO不友好**: 搜索引擎无法索引JS生成的内容
- ❌ **首屏性能**: 需要等待JS加载和执行才能显示内容
- ❌ **可维护性差**: 内容和结构分离，难以维护
- ❌ **无障碍性**: 屏幕阅读器可能无法正确读取动态内容

### Alternative 2: 分离的中英文页面

**Approach**: 创建独立的英文页面（如 `about-en.html`）。

**Rejected Reasons**:
- ❌ **维护成本高**: 需要维护两套完全独立的HTML文件
- ❌ **内容同步困难**: 更新内容时容易遗漏某一语言版本
- ❌ **URL管理复杂**: 需要额外的重定向逻辑

### Alternative 3: 机器翻译占位

**Approach**: 使用AI快速翻译所有内容，后续逐步润色。

**Rejected Reasons**:
- ✅ 用户明确要求**学术级翻译**
- ❌ 机器翻译质量无法达到学术标准
- ❌ 后续润色工作量可能更大（需要重新翻译）

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| 翻译质量不达标 | 高 | 采用AI辅助+人工审核的两阶段翻译流程；建立术语表确保一致性 |
| 英文内容过长导致布局问题 | 中 | 在响应式测试阶段验证所有布局；CSS使用`word-break`处理长单词 |
| URL参数与localStorage冲突 | 低 | 明确优先级：URL > localStorage；添加清晰的文档说明 |
| 术语翻译不一致 | 中 | 建立 `TRANSLATION_GLOSSARY.md`；在验证阶段进行一致性检查 |
| SEO元标签更新失败 | 低 | 添加自动化测试验证meta标签切换；使用`MutationObserver`监控 |

---

## Out of Scope

以下功能**不在本提案范围内**，可在未来单独实施：

- ❌ 评论家传记双语化（由 `localize-critics-page-and-optimize-layout` 负责）
- ❌ 其他语言支持（如日语、法语）
- ❌ 自动语言检测（根据浏览器语言自动切换）
- ❌ 翻译缓存优化
- ❌ 右键翻译插件集成

---

## Success Criteria

**Functional Requirements**:
- [ ] 所有页面支持中英文双语切换
- [ ] 语言切换按钮正常工作（所有内容切换）
- [ ] URL参数 `?lang=en` 和 `?lang=zh` 正确工作
- [ ] localStorage正确保存用户语言偏好
- [ ] Meta标签根据语言动态更新

**Content Quality**:
- [ ] 所有英文翻译准确、流畅、符合学术标准
- [ ] 专业术语翻译一致（RPAIT, griot, defamiliarization等）
- [ ] 无遗漏内容（所有中文内容都有对应英文）
- [ ] 无明显语法错误或拼写错误

**Technical Requirements**:
- [ ] 所有浏览器（Chrome, Firefox, Safari, Edge）语言切换正常
- [ ] 所有设备（手机、平板、桌面）布局正常
- [ ] 页面加载性能无明显下降（< 100ms）
- [ ] SEO元标签正确切换

**Academic Standards**:
- [ ] 英文翻译符合学术写作规范
- [ ] 专业术语准确无误
- [ ] 语言风格与中文原文保持一致的专业性

---

## Future Enhancements

以下功能可在后续迭代中考虑：

1. **自动语言检测**: 根据浏览器 `navigator.language` 自动选择语言
2. **多语言支持**: 添加日语、法语等其他语言
3. **翻译API集成**: 集成专业翻译服务（如DeepL API）
4. **内容管理系统**: 建立双语内容管理后台
5. **A/B测试**: 测试不同翻译版本的用户接受度
6. **语音朗读**: 支持中英文语音朗读功能

这些功能需要单独的OpenSpec提案和设计评审。

---

**Proposal Status**: Draft
**Estimated Effort**: 17.5 hours
**Priority**: High (P1 - 用户明确要求)
**Assigned**: TBD
