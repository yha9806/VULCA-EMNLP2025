# 混合方案实施清单

## 🎯 核心架构（三层递进式）

```
Layer 3: Auto-Play (自动导览)
  ↓ 当用户交互时
Layer 2: Interaction (光标交互)
  ↓ 底层基础
Layer 1: Base Gallery Walk (空间聚焦)
```

### 快速概览

| 层级 | 触发条件 | 行为 | 优先级 |
|-----|--------|------|-------|
| Layer 1 | 页面加载/悬停区域 | 聚焦区域，6个评论家顺序淡入 | P0 |
| Layer 2 | 光标在区域内移动 | 粒子被吸引，形成磁场+尾迹 | P1 |
| Layer 3 | 无交互≥3秒 | 自动切换区域，导览循环 | P2 |
| 爆炸 | 点击区域 | 粒子爆发，RPAIT值显示 | P3 |

---

## 📋 Week 3 实施计划 (Phase 1: Layer 1 + Layer 3)

### Task 1.1: ParticleSystem.js 扩展
**文件**: `vulca-exhibition/js/exhibition/ParticleSystem.js`

```javascript
// 在构造函数中添加
this.fadeAlpha = 0;              // 0-1，淡入淡出动画
this.sequenceIndex = 0;          // 0-5，进入顺序
this.regionFocused = false;      // 该区域是否被聚焦

// Layer 3 权重相关
this.prominenceLevel = 0.05;     // 0-1，权重（初始5%）
this.baseProminence = 0.05;      // 静默时的最小可见度

// 更新render()方法中的alpha计算
// finalAlpha = fadeAlpha × (baseProminence + prominenceLevel * 0.95)
```

**验收标准**:
- [ ] fadeAlpha 能从0平滑过渡到1
- [ ] 最终alpha在5%-100%范围内
- [ ] render()中条件判断正确

---

### Task 1.2: ExhibitionLayout.js 区域追踪
**文件**: `vulca-exhibition/js/exhibition/ExhibitionLayout.js`

```javascript
// 添加属性
this.hoveredRegion = null;
this.regionSystems = {
  'artwork_1': [],  // 4个系统
  'artwork_2': [],
  'artwork_3': [],
  'artwork_4': []
};

// 添加方法
handleRegionHover(regionKey, isHovering) {
  this.hoveredRegion = isHovering ? regionKey : null;

  // 通知该区域的粒子系统
  if (this.regionSystems[regionKey]) {
    this.regionSystems[regionKey].forEach(system => {
      system.regionFocused = isHovering;
    });
  }
}

// 在hitArea事件中调用此方法
```

**验收标准**:
- [ ] 悬停时hoveredRegion更新正确
- [ ] regionFocused标志能正确传播
- [ ] 不同区域间可正确切换

---

### Task 1.3: AutoPlayManager 实现
**新文件**: `vulca-exhibition/js/exhibition/AutoPlayManager.js`

```javascript
class AutoPlayManager {
  constructor(layout, particleSystems) {
    this.regions = ['artwork_1', 'artwork_2', 'artwork_3', 'artwork_4'];
    this.currentIndex = 0;
    this.timer = 0;
    this.phaseTime = 15000;  // 每个区域15秒
    this.isEnabled = true;
    this.layout = layout;
    this.particleSystems = particleSystems;
  }

  update(delta) {
    if (!this.isEnabled) return;

    this.timer += delta;

    if (this.timer >= this.phaseTime) {
      this.advanceRegion();
    }

    this.updateProminence();
  }

  advanceRegion() {
    this.currentIndex = (this.currentIndex + 1) % this.regions.length;
    this.timer = 0;
    this.layout.handleRegionHover(this.regions[this.currentIndex], true);
  }

  updateProminence() {
    // 当前区域权重升至100%
    // 其他区域权重降至5%
    this.regions.forEach((region, idx) => {
      const systems = this.layout.regionSystems[region];
      if (!systems) return;

      systems.forEach(system => {
        if (idx === this.currentIndex) {
          system.prominenceLevel = Math.min(1, system.prominenceLevel + 0.02);
        } else {
          system.prominenceLevel = Math.max(0.05, system.prominenceLevel - 0.02);
        }
      });
    });
  }

  pause() {
    this.isEnabled = false;
    this.timer = 0;
  }

  resume() {
    this.isEnabled = true;
  }
}

// 在app.js中：
const autoPlayManager = new AutoPlayManager(layout, particleSystems);
// 在animation loop中：
autoPlayManager.update(1);  // delta=1
```

**验收标准**:
- [ ] 每15秒自动切换一个区域
- [ ] 权重逐渐升降（不突兀）
- [ ] pause/resume能正确控制

---

### Task 1.4: 动画循环集成
**文件**: `vulca-exhibition/js/app.js`

```javascript
// 在startAnimationLoop()中修改渲染逻辑

const animate = () => {
  this.time += 1;

  // ========== Layer 3: 权重更新 ==========
  this.autoPlayManager.update(1);

  // ========== Layer 1: 淡入淡出 ==========
  Object.values(this.particleSystems).forEach(system => {
    if (system.regionFocused && !system.isActive) {
      // 开始淡入
      system.fadeAlpha = Math.min(1, system.fadeAlpha + 0.02);  // ~1000ms
      system.isActive = true;
    } else if (!system.regionFocused && system.fadeAlpha > 0) {
      // 淡出
      system.fadeAlpha = Math.max(0, system.fadeAlpha - 0.01);  // ~1500ms
      if (system.fadeAlpha === 0) {
        system.isActive = false;
      }
    }

    // 计算最终alpha
    system.finalAlpha = system.fadeAlpha *
      (system.baseProminence + system.prominenceLevel * 0.95);

    // 渲染
    if (system.isActive) {
      if (system.rpait?.A >= 7) {
        system.renderWithGlow();
      } else {
        system.render();
      }
    }
  });

  this.animationFrameId = requestAnimationFrame(animate);
};
```

**验收标准**:
- [ ] 粒子按时间平滑淡入淡出
- [ ] 最终alpha值在合理范围
- [ ] 渲染性能无明显下降

---

### Task 1.5: ParticleSystem.render() 修改
**文件**: `vulca-exhibition/js/exhibition/ParticleSystem.js`

```javascript
render() {
  if (!this.enabled) {
    this.displayContainer.removeChildren();
    return;
  }

  if (this.finalAlpha < 0.01) {  // 改为finalAlpha而非isActive
    this.displayContainer.removeChildren();
    return;
  }

  this.displayContainer.removeChildren();

  if (this.particles.length === 0) return;

  const graphics = new PIXI.Graphics();

  this.particles.forEach(particle => {
    const alpha = particle.alpha * particle.lifespan * this.finalAlpha;  // ← 使用finalAlpha

    if (alpha < 0.01) return;

    const color = particle.color;
    graphics.beginFill(color, alpha);
    const radius = particle.size / 2;
    graphics.drawCircle(particle.x, particle.y, radius);
    graphics.endFill();
  });

  this.displayContainer.addChild(graphics);
}

renderWithGlow() {
  if (!this.enabled) return;

  if (this.finalAlpha < 0.01) {  // ← 改为finalAlpha
    this.displayContainer.removeChildren();
    return;
  }

  this.displayContainer.removeChildren();

  const glowIntensity = this.currentVisuals?.glowIntensity || 0.1;

  this.particles.forEach(particle => {
    const alpha = particle.alpha * particle.lifespan * this.finalAlpha;  // ← 使用finalAlpha

    if (glowIntensity > 0.05) {
      const glow = new PIXI.Graphics();
      const color = particle.color;
      const glowColor = ColorUtils.blendColors(color, 0xFFFFFF, 0.3);

      glow.beginFill(glowColor, alpha * glowIntensity * 0.5);
      glow.drawCircle(particle.x, particle.y, particle.size);
      glow.endFill();

      this.displayContainer.addChild(glow);
    }

    const graphics = new PIXI.Graphics();
    graphics.beginFill(particle.color, alpha);
    graphics.drawCircle(particle.x, particle.y, particle.size / 2);
    graphics.endFill();

    this.displayContainer.addChild(graphics);
  });
}
```

**验收标准**:
- [ ] 粒子opacity与finalAlpha相乘正确
- [ ] finalAlpha=0时粒子完全消失
- [ ] renderWithGlow中alpha计算一致

---

### Task 1.6: HTML中加载AutoPlayManager
**文件**: `vulca-exhibition/index.html`

```html
<!-- 在加载app.js之前添加 -->
<script src="./js/exhibition/AutoPlayManager.js"></script>

<!-- 在app.js中，VulcaExhibition构造函数内初始化 -->
<!-- 或在init()方法内 -->
```

**验收标准**:
- [ ] AutoPlayManager正确加载
- [ ] 无控制台错误

---

## 📊 Week 3 验收清单

**Day 1-2: 代码实现**
- [ ] Task 1.1-1.6 全部完成
- [ ] 无TypeErrors或undefined引用

**Day 3-4: 功能验证 (Playwright MCP)**
```bash
# 在浏览器控制台验证
window.vulcaExhibition.autoPlayManager.regions  # 应输出4个区域
window.vulcaExhibition.particleSystems[Object.keys(window.vulcaExhibition.particleSystems)[0]].fadeAlpha  # 应输出0-1
```

- [ ] 页面加载，自动播放启动
- [ ] Artwork 1 粒子逐个淡入（250ms间隔）
- [ ] 15秒后自动切换到Artwork 2
- [ ] 权重从5%逐渐升到100%（smooth）
- [ ] 无性能下降（60fps）

**Day 5: 截图验收**
```
T=0s:   页面加载
T=1s:   Artwork 1 淡入中
T=3s:   Artwork 1 完全显示
T=15s:  Artwork 2 淡入中
```

- [ ] 4张截图对应上述时间点
- [ ] 粒子透明度变化符合预期

---

## 🔄 Week 4 计划 (Phase 2: Layer 2 光标交互)

### Task 2.1: InteractionManager 光标吸引
- 计算光标距离与粒子位置关系
- 在150px范围内的粒子被吸引（力度基于距离）
- 尾迹记录光标历史位置

### Task 2.2: 尾迹效果实现
- 记录光标路径（最多20个点）
- 尾迹逐渐衰减（1秒消失）
- 视觉反馈：淡蓝色线条跟随光标

### Task 2.3: 响应式反馈
- 粒子靠近光标时发光（颜色更亮）
- 吸引强度随P维度变化

---

## 🎬 Week 5 计划 (Phase 3: 爆炸动画 + RPAIT显示)

### Task 3.1: 点击爆炸
- 检测点击位置
- 粒子从点击中心向外扩散
- 速度基于T维度（技巧）

### Task 3.2: 沉降回归
- 粒子逐渐返回原始位置
- 轨迹复杂度基于I维度（解读深度）

### Task 3.3: RPAIT UI面板
- 点击时显示该区域的6个评论家评分
- 2秒后自动隐藏
- 显示R/P/A/I/T五维图表

---

## 📁 文件结构确认

```
vulca-exhibition/
├── index.html                    ← 加载顺序：
│                                   1. PixiJS
│                                   2. data/RPAIT.js
│                                   3. utils/*.js
│                                   4. exhibition/*.js
│                                   5. AutoPlayManager.js ← 新增
│                                   6. app.js
│
├── js/
│   ├── exhibition/
│   │   ├── PixiRenderer.js
│   │   ├── ExhibitionLayout.js   ← 修改：添加regionSystems, handleRegionHover
│   │   ├── ParticleSystem.js      ← 修改：添加fade/prominence, 修改render()
│   │   ├── RPAITMapper.js
│   │   ├── InteractionManager.js
│   │   └── AutoPlayManager.js     ← 新增文件
│   │
│   ├── utils/
│   │   ├── ColorUtils.js
│   │   └── MotionLanguage.js
│   │
│   └── app.js                    ← 修改：集成AutoPlayManager, 修改animation loop
│
└── styles/
    └── *.css                     ← 无需修改（功能完整）
```

---

## 🧪 测试场景

### Scenario 1: 自动播放循环
```
操作：页面加载，什么都不做，观看3分钟
预期：
  - 每15秒区域切换
  - 粒子按顺序淡入淡出
  - 权重平滑过渡
  - 流畅无卡顿
```

### Scenario 2: 用户打断自动播放
```
操作：
  1. 等待Artwork 2自动播放
  2. 在Artwork 1上悬停
  3. 观察Artwork 2淡出，Artwork 1淡入
  4. 等待3秒，观察自动播放是否恢复
预期：
  - Artwork 1立即获得焦点
  - Artwork 2平滑淡出
  - 3秒后自动播放从Artwork 3开始
```

### Scenario 3: 快速区域切换
```
操作：
  1. 快速在Artwork 1-4之间移动光标
  2. 每个区域停留<1秒
预期：
  - 区域切换流畅，无突兀
  - 淡入淡出动画叠加正确
  - 权重平滑变化（无抖动）
```

---

## 性能目标

| 指标 | 目标 | 预期 |
|-----|------|------|
| FPS | ≥60 | 24系统×80粒子，应轻松达到 |
| Alpha计算 | <1ms | 简单乘法，极快 |
| 内存 | <50MB | 粒子数据固定 |
| 启动时间 | <2s | PixiJS初始化 |

---

## Git提交策略 (Week 3)

```bash
commit 1: "feat: Add ParticleSystem fade animation properties"
          (Task 1.1)

commit 2: "feat: Add ExhibitionLayout region hover tracking"
          (Task 1.2)

commit 3: "feat: Implement AutoPlayManager for automatic region cycling"
          (Task 1.3)

commit 4: "feat: Integrate AutoPlay and fade animation in main loop"
          (Task 1.4-1.5)

commit 5: "feat: Add Gallery Walk with prominence weighting (Layer 1+3)"
          (Task 1.6 + 验收)
```

每个commit应该：
- 对应单一功能
- 能独立运行（不留broken state）
- 包含相关的代码+测试验证

---

## ⚠️ 风险与缓解

| 风险 | 影响 | 缓解方案 |
|-----|------|--------|
| 动画帧率下降 | 体验不流畅 | 减少粒子数，or使用GPU instancing |
| Alpha计算错误 | 粒子不可见/过亮 | 单元测试alpha范围 |
| 自动播放循环错误 | 无法切换区域 | 添加日志，验证currentIndex |
| 内存泄漏（PIXI） | 性能衰减 | 确保displayContainer正确清理 |

---

## 完成后的样子

🎉 **Week 3 完成后**：
- ✅ 混合方案 Layer 1 + Layer 3 完全实现
- ✅ 自动导览功能运行
- ✅ 负形美学初步体现
- ✅ 用户可感受到"艺术装置"而非"网站"

📊 **性能**：60fps稳定，内存<50MB
🎨 **体验**：宁静→主动，自动→交互，选择权在用户
📈 **代码质量**：简洁、模块化、可扩展

**下一步**：Week 4开始Phase 2（光标交互Layer 2）
