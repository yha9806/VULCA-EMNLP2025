# Proposal: Localize Critics Page and Optimize Card Layout

## Why

### Problem Statement

The critics.html page currently displays all critic biographies in English, creating a language inconsistency with the rest of the VULCA system and preventing Chinese-speaking audiences from fully understanding the critics' backgrounds and theoretical positions.

**Current Issues**:

1. **全英文传记内容** - All 6 critics have English-only biographies in `data.js` (`bio` field)
   - 苏轼: "Northern Song literati master, poet, calligrapher..."
   - 郭熙: "Northern Song landscape master who systematized..."
   - 约翰·罗斯金: "Preeminent Victorian art critic..."
   - 佐拉妈妈: "Keeper of West African oral tradition..."
   - 埃琳娜·佩特洛娃教授: "Contemporary Russian formalist scholar..."
   - AI伦理评审员: "Contemporary philosopher of technology..."

2. **虚构角色身份未标注** - Fictional AI personas (佐拉妈妈, 埃琳娜·佩特洛娃教授) are not clearly identified as fictional in the biography text

3. **英文名字显示过于突出** - English names (`nameEn`) are displayed with same font size as Chinese names, creating visual clutter

4. **卡片布局可优化** - Card internal layout (biography placement, RPAIT bar positioning) could be improved for better readability

### Impact

- **Audience Accessibility**: Chinese-speaking users cannot understand critic backgrounds
- **Academic Integrity**: Fictional personas not clearly identified
- **Visual Hierarchy**: English names compete with Chinese names for attention
- **Information Architecture**: Card layout doesn't optimize for reading flow

---

## What Changes

Add Chinese biographies for all 6 critics, adjust English name styling, optimize card layout, and clearly mark fictional personas.

### 1. Add Chinese Biographies (`bioZh` field)

Add `bioZh` field to each persona in `data.js`, with content based on:
- Historical research (for real critics: 苏轼, 郭熙, 约翰·罗斯金, AI伦理评审员)
- Theoretical traditions (for fictional personas: 佐拉妈妈, 埃琳娜·佩特洛娃教授)
- Existing project content
- Clear marking of fictional personas

**Chinese Biography Drafts**:

**苏轼** (Real historical figure):
```
北宋文人画理论的奠基者，诗人、书法家和哲学思想家。他倡导"文人画"（士人画）理念，强调个人表达和内在意境超越技术精湛性。苏轼提出"诗画一律"理论，认为艺术的最高目的在于传达精神深度和哲学真理，而非单纯的视觉再现。他反对"论画以形似"的肤浅观点，主张"以形写神"。作为一位杰出的诗人，苏轼将道家、佛家和儒家哲学融入艺术视野，提出"诗中有画，画中有诗"的著名论断，成为文人美学的基石，影响了东亚艺术数百年。
```

**郭熙** (Real historical figure):
```
北宋山水画大师，将宏伟山水画的原则系统化为理论框架。他的代表作《林泉高致》阐述了革命性的"三远法"理论——高远、深远、平远——展示了构图结构如何创造空间幻觉和哲学意义。郭熙的绘画结合精密的技术执行与深刻的哲学深度，将山水视为宇宙秩序和精神真理的体现。他提出"春山淡冶如笑，夏山苍翠如滴，秋山明净如妆，冬山惨淡如睡"的四季山水观。郭熙的形式与意义融合的方法——每一笔既服务于美学又服务于象征目的——确立了山水画作为至高艺术形式的地位，影响了中国山水画传统数百年。
```

**约翰·罗斯金** (Real historical figure):
```
维多利亚时期最杰出的艺术评论家和社会改革家，通过坚持艺术价值与道德和社会真理不可分离而革新了美学话语。罗斯金的核心原则是艺术中的"诚实"（真理），要求艺术家直接观察自然并诚实地表现它，而非遵循人为的惯例。他对拉斐尔前派画家的热情倡导和对自然的细致研究确立了视觉真实性和伦理承诺的新标准。除美学外，罗斯金成为激烈的社会批评家，将艺术美与社会正义联系起来，认为社会的艺术反映其道德品格。他的信念——所有创造性努力必须服务于人类尊严和社会善——使他不仅是艺术理论家，更是一位道德哲学家，影响远超维多利亚英国，塑造了几代人对艺术责任的理解。
```

**佐拉妈妈** (Fictional AI persona - MUST mark as fictional):
```
西非口述传统和社区智慧的守护者，她的视角将集体意义建构置于个人创作之上。在西非认识论中，知识和文化通过代际对话流动，长者传递的不是僵化的事实，而是适应每个新语境的活的智慧。佐拉妈妈体现了griot传统——她将艺术理解为人类联结和共享意义网络中的节点，而非孤立的物体。她的诠释方法优先考虑社区体验、个人叙事和维系社区的集体记忆。对佐拉妈妈而言，艺术的最深价值不在于技术精湛或形式创新，而在于将人们聚集在一起、传递文化价值、尊重维系所有人类生活的相互依存的能力。

*注：此为AI创建的虚构角色，代表西非griot口述传统和集体诠释范式。*
```

**埃琳娜·佩特洛娃教授** (Fictional AI persona - MUST mark as fictional):
```
当代俄罗斯形式主义学者，承袭20世纪初俄罗斯形式主义的激进遗产。佩特洛娃教授直接继承维克多·什克洛夫斯基的革命性"陌生化"（остранение）概念——艺术的本质功能是使熟悉的变得陌生，迫使观众以全新方式感知物体和语言。她的分析方法解码创造美学效果的隐藏结构和"装置"（приём），将艺术形式视为意义本身而非装饰。佩特洛娃坚持认为艺术的力量不来自内容或情感，而来自形式元素的精确编排——材料如何被塑造、元素如何关联、结构如何惊讶和挑战感知。她的严格结构分析揭示艺术作为复杂系统，其中每个元素在更大的形式关系中服务于特定功能。

*注：此为AI创建的虚构角色，代表俄罗斯形式主义结构分析传统。*
```

**AI伦理评审员** (Real person - Kate Crawford):
```
当代技术哲学家和人工智能伦理学研究者，研究算法如何重塑数字时代的创造力、真实性和人类能动性。AI伦理评审员以批判性清晰度而非技术乌托邦主义的态度看待算法艺术，关注其变革潜力和严重局限。借鉴机器伦理、计算美学和技术哲学等新兴领域，这一视角提出根本问题：当美学判断被算法中介时会发生什么？当机器参与时，创造力是什么？当算法日益塑造文化时，我们如何维护人类尊严？AI伦理评审员坚持技术从不中立——每个算法都嵌入关于价值、美和人性的假设。这一视角代表凯特·克劳福德（Kate Crawford）等学者的研究，不是抵制技术变革，而是以道德严肃性导航它，确保人类繁荣和真实创造力仍是社会评价和创造艺术的核心。
```

### 2. Adjust English Name Styling

**Before** (critics-page.js line 125):
```javascript
const nameEn = document.createElement('h3');
nameEn.className = 'critic-name-en';
nameEn.textContent = persona.nameEn || '';
```

**After**:
```javascript
const nameEn = document.createElement('p');  // Changed from h3 to p
nameEn.className = 'critic-name-en';
nameEn.textContent = persona.nameEn || '';
```

Add CSS styling:
```css
.critic-name-en {
  font-size: 0.9rem;
  color: #666;
  font-style: italic;
  margin-top: 0.25rem;
}
```

### 3. Optimize Card Layout

**Improvements**:
- Biography section: Better line spacing and padding
- RPAIT grid: Adjust spacing between bars
- Card overall: Improve visual hierarchy

### 4. Update critics-page.js to Use Chinese Biography

**Before**:
```javascript
if (persona.bio) {
  const bio = document.createElement('p');
  bio.className = 'critic-bio';
  bio.textContent = persona.bio;
  body.appendChild(bio);
}
```

**After**:
```javascript
// Prefer Chinese bio, fallback to English
const bioText = persona.bioZh || persona.bio;
if (bioText) {
  const bio = document.createElement('p');
  bio.className = 'critic-bio';
  bio.textContent = bioText;
  body.appendChild(bio);
}
```

---

## How to Implement

### Phase 1: Add Chinese Biographies to Data (1 hour)

1. Add `bioZh` field to all 6 personas in `js/data.js`
2. Include fictional persona markers ("*注：此为AI创建的虚构角色...*")
3. Validate Chinese text encoding

### Phase 2: Update JavaScript Rendering (30 min)

1. Modify `js/critics-page.js` to prioritize `bioZh` over `bio`
2. Change English name element from `h3` to `p`
3. Test rendering with all 6 critics

### Phase 3: Optimize CSS Layout (30 min)

1. Add `.critic-name-en` styling for smaller, italicized English names
2. Improve `.critic-bio` line height and spacing
3. Adjust `.rpait-grid` spacing
4. Test responsive behavior

### Phase 4: Validation (30 min)

1. Verify all 6 biographies display in Chinese
2. Verify fictional personas show disclaimer
3. Verify English names are visually de-emphasized
4. Test on mobile/tablet/desktop

**Total Time**: ~2.5 hours

---

## Dependencies & Sequencing

**Prerequisites**: None - standalone content and styling changes

**Validation**:
- [ ] All biographies display in Chinese
- [ ] Fictional personas clearly marked
- [ ] English names de-emphasized but still visible
- [ ] Card layout improved for readability
- [ ] No breaking changes to existing functionality

---

## Alternatives Considered

### Alternative 1: Remove English names entirely
**Verdict**: ❌ Rejected - User chose option B (keep but de-emphasize)

### Alternative 2: Machine translation of biographies
**Verdict**: ❌ Rejected - User requested manual writing based on research + local content

### Alternative 3: Separate fictional personas to different section
**Verdict**: ❌ Rejected - Current mixed display is intentional research design, just needs clear marking

---

**Proposal Status**: Draft
**Created**: 2025-11-03
**Estimated Effort**: 2.5 hours
**Priority**: High (P1 - User-requested localization)
