# VULCA 混合设计方案 - 三层交互架构

**策略**: 结合三个方案的优势，创建多层递进式体验

---

## 核心概念：三层架构

### 层级结构图

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 3: Auto-Play (自动导览)                              │
│  ├─ 无交互时激活                                             │
│  ├─ 时间驱动（每5秒切换）                                    │
│  └─ 权重突出不同评论家                                       │
├─────────────────────────────────────────────────────────────┤
│  Layer 2: Interaction (光标交互)                            │
│  ├─ 用户输入驱动                                             │
│  ├─ 光标影响粒子位置（吸引/排斥）                            │
│  └─ 创建"尾迹"效果                                          │
├─────────────────────────────────────────────────────────────┤
│  Layer 1: Base (基础空间聚焦)                               │
│  ├─ 悬停区域激活该区域的6个系统                             │
│  ├─ 顺序淡入（250ms间隔）                                   │
│  └─ 负形为默认状态                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 详细行为定义

### 状态1: 初始状态（无交互）

```
视觉外观：
┌──────────────────────────────────────┐
│  ░░░░░░░░░░░░  ░░░░░░░░░░░░         │
│  (Artwork 1)    (Artwork 2)          │
│                                      │
│  ░░░░░░░░░░░░  ░░░░░░░░░░░░         │
│  (Artwork 3)    (Artwork 4)          │
└──────────────────────────────────────┘

行为：
- 所有区域处于"静默"状态（粒子极其稀疏，alpha ~0.05）
- Layer 3 自动激活：每5秒自动选择一个区域
- 该区域的评论家逐个淡入（Gallery Walk效果）
- 6个评论家全部出现后，维持3秒
- 然后逐个淡出，切换到下一个区域

自动播放顺序：
  T=0-8s:   区域1亮起 (6个评论家顺序出现)
  T=8-11s:  区域1维持 (全部可见)
  T=11-15s: 区域1淡出
  T=15-23s: 区域2亮起
  ... 循环 ...

设计意图：
- 像美术馆自动导览，引导观众注意力
- 无压力，可随时中断
```

### 状态2: 用户悬停（交互开始）

```
时间线：
T=0ms:    光标进入 Artwork 1 区域
T=0-500ms: 停止自动播放，改为该区域focus
          -> 如果当前是其他区域，淡出其他，淡入此区域
          -> 如果当前已是此区域，保持
T=500ms+: Layer 2激活（光标交互）
          -> 光标周围 ~150px 内的粒子被吸引
          -> 创建"尾迹"效果（光标历史记录）
          -> 粒子围绕光标舞动，形成"磁场"

视觉效果：
┌──────────────────────────────────────┐
│  ◆◆◆◆◆◆(Artwork 1)◆◆◆◆◆◆ ← 明亮   │
│  ↑ 粒子被光标吸引 ↑                 │
│  ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~             │
│  (尾迹效果)                          │
│                                      │
│  ░░░░░░░░(Artwork 3)░░░░░░░░        │
│  ░░░░░░░░(Artwork 4)░░░░░░░░        │
└──────────────────────────────────────┘

粒子行为编码：
- 粒子颜色 = 评论家身份（6种独特颜色）
- 粒子运动模式 = P维度（哲学性：0-10）
  - 苏轼: 笔触波动
  - 郭熙: 透视深度
  - 约翰罗斯金: 螺旋上升
  - 佐拉妈妈: 圆形同步
  - 埃琳娜佩特洛娃: 几何结构
  - AI伦理评审员: 分形算法

用户可发现：
- 不同评论家的独特视角（颜色 + 运动）
- RPAIT维度如何编码为视觉属性
- 自己与艺术品的"对话"（光标引导）
```

### 状态3: 点击区域（加深交互）

```
触发：用户在区域内点击

效果：
1. 爆炸动画：所有粒子从点击点向外扩散
   - 速度 = T维度的函数（技巧：高T = 快速精确爆炸）
   - 持续时间 ~500ms

2. 沉降回归：粒子逐渐返回原始位置
   - 曲线类型 = I维度的函数（解读深度）
   - I高 = 复杂回归路径（曲线运动）
   - I低 = 直线回归（快速落下）

3. 交互反馈：显示该区域的RPAIT值（可选UI）
   - 显示6个评论家各自的R/P/A/I/T评分
   - 2秒后自动隐藏

视觉效果：
时间序列：
  T=0ms:    点击处 (x, y)
  T=0-100ms: 粒子向外爆发（爆炸半径扩大）
  T=100-200ms: 爆炸到达最大范围
  T=200-500ms: 粒子开始返回
  T=500-1500ms: 粒子沉降回归，逐渐稳定

设计意图：
- 让用户感受到RPAIT维度的含义
- T维度：技巧决定爆炸的速度和精确度
- I维度：解读深度决定返回路径的复杂性
- 使数据可感知，而非抽象
```

### 状态4: 光标离开（交互结束）

```
触发：光标离开艺术品区域

行为：
1. 如果离开后≥3秒无新交互
   -> 当前区域逐渐淡出
   -> 自动播放恢复（回到状态1）

2. 如果在3秒内进入其他区域
   -> 直接切换（淡出旧区域，淡入新区域）
   -> Layer 2交互立即适配新区域

淡出动画：
- 粒子alpha从当前值逐渐→0
- 时间 ~1500ms（缓慢，给用户反应时间）
- 缓动函数 = easeOut（先快后慢）

设计意图：
- 不突兀，给用户"收尾"的感觉
- 回到宁静的负形状态
- 为下一个区域做准备
```

---

## 交互决策树

```
┌─ 展览开始
│
├─ [等待用户交互 5秒+]
│  └─ Layer 3: 自动播放当前区域
│     └─ 每个区域：淡入→展示→淡出 (耗时15秒)
│     └─ 循环访问4个区域
│
├─ [光标进入区域]
│  └─ 停止自动播放
│  └─ 激活 Layer 1: Gallery Walk
│     ├─ 如果首次进入该区域
│     │  └─ 6个评论家顺序淡入 (250ms间隔)
│     │  └─ 总时长 ~1500ms
│     │
│     └─ Layer 2: 准备就绪
│        └─ 光标在区域内移动 → 粒子跟随
│        └─ 吸引半径 ~150px
│        └─ 尾迹衰减 ~1秒
│
├─ [光标在区域内移动]
│  └─ 粒子被吸引，形成磁场效果
│  └─ 尾迹记录光标路径
│  └─ 持续直到光标离开或点击
│
├─ [点击该区域]
│  └─ Layer 2+ 触发爆炸动画
│  └─ 显示RPAIT值（2秒）
│  └─ 粒子根据I维度沉降回归
│  └─ 交互计数器重置
│
└─ [光标离开区域≥3秒无新交互]
   └─ 当前区域淡出 (~1500ms)
   └─ 回到 Layer 3: 自动播放恢复
      └─ 从下一个区域开始循环
```

---

## 实现技术细节

### ParticleSystem.js 新增属性

```javascript
// Layer 1: 空间聚焦
this.isVisible = false;
this.fadeAlpha = 0;
this.sequenceIndex = 0;  // 0-5，决定进入顺序

// Layer 2: 交互响应
this.cursorDistance = Infinity;
this.attractionForce = 0;
this.trailHistory = [];  // 光标尾迹

// Layer 3: 权重
this.prominenceLevel = 0.05;  // 0-1，默认5%
this.isProminent = false;

// 统合
this.finalAlpha = 0;  // = fadeAlpha * prominenceLevel
```

### 运动方程

```javascript
// Layer 1: 淡入淡出
if (regionFocused && !isVisible) {
  fadeAlpha += 0.02;  // 50ms per increment = 1500ms total
}

// Layer 2: 光标吸引
const distanceToCursor = Math.hypot(
  particle.x - cursorX,
  particle.y - cursorY
);

if (distanceToCursor < 150) {
  const angle = Math.atan2(cursorY - particle.y, cursorX - particle.x);
  const force = (150 - distanceToCursor) / 150;  // 0-1

  particle.vx += Math.cos(angle) * force * 0.5;
  particle.vy += Math.sin(angle) * force * 0.5;
}

// Layer 3: 权重影响
finalAlpha = fadeAlpha * (0.05 + prominenceLevel * 0.95);
// 最小5%，最大100%

// 爆炸动画（点击时）
if (burstActive) {
  const angle = Math.atan2(particle.y - burstY, particle.x - burstX);
  const distance = Math.hypot(
    particle.x - burstX,
    particle.y - burstY
  );

  const burstForce = (100 - Math.min(distance, 100)) / 100;  // 衰减
  particle.vx = Math.cos(angle) * burstForce * 10 * (rpait.T / 5);  // T驱动速度
}
```

### 自动播放逻辑 (Layer 3)

```javascript
class AutoPlayManager {
  constructor() {
    this.regions = ['artwork_1', 'artwork_2', 'artwork_3', 'artwork_4'];
    this.currentIndex = 0;
    this.timer = 0;
    this.phaseTime = 15000;  // 15秒 per region
    this.isEnabled = true;
  }

  update(delta) {
    if (!this.isEnabled) return;

    this.timer += delta;

    if (this.timer >= this.phaseTime) {
      this.currentIndex = (this.currentIndex + 1) % this.regions.length;
      this.timer = 0;

      // 触发新区域的Layer 1激活
      this.activateRegion(this.regions[this.currentIndex]);
    }

    // 更新权重（prominence）
    this.regions.forEach((region, idx) => {
      if (idx === this.currentIndex) {
        // 当前区域：权重逐渐升到100%
        prominenceLevel[region] = Math.min(1, prominence[region] + 0.02);
      } else {
        // 其他区域：权重降到5%
        prominenceLevel[region] = Math.max(0.05, prominence[region] - 0.02);
      }
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
```

### 交互管理器整合

```javascript
class InteractionManager {
  handleMouseMove(x, y) {
    const region = this.getRegionAtPoint(x, y);

    if (region !== this.currentRegion) {
      this.switchRegion(region);
      this.autoPlay.pause();  // 停止自动播放
    }

    // Layer 2: 更新吸引力
    if (region) {
      this.updateCursorAttraction(region, x, y);
    }
  }

  handleClick(x, y) {
    const region = this.getRegionAtPoint(x, y);
    if (region) {
      this.triggerBurst(region, x, y);

      // 显示RPAIT面板 (2秒)
      this.showRPAITPanel(region, 2000);
    }
  }

  handleMouseLeave() {
    this.lastInteractionTime = Date.now();

    // 检查是否应该恢复自动播放 (3秒无交互)
    setTimeout(() => {
      if (Date.now() - this.lastInteractionTime >= 3000) {
        this.autoPlay.resume();
      }
    }, 3000);
  }
}
```

---

## 体验流程示例

### 场景：用户首次访问

```
T=0s:     页面加载
          -> Layer 3 启动，选择Artwork 1
          -> 所有区域处于静默状态 (alpha ~0.05)

T=0-2s:   Artwork 1 自动淡入过程
          -> 苏轼 (灰色) 粒子淡入
          -> 郭熙 (绿色) 粒子淡入
          -> 约翰罗斯金 (紫色) 粒子淡入
          -> 佐拉妈妈 (棕色) 粒子淡入
          -> 埃琳娜佩特洛娃 (红色) 粒子淡入
          -> AI伦理评审员 (蓝色) 粒子淡入

T=2-5s:   Artwork 1 完全显示
          -> 所有6个评论家的粒子在该区域可见
          -> 用户观察不同颜色和运动模式
          -> 粒子自然运动（P维度驱动）

T=5-8s:   Artwork 1 淡出
          -> 所有粒子alpha逐渐返回0.05

T=8-23s:  Artwork 2 循环
          -> 重复同样的自动播放流程

[ 用户可随时打断：]

T=10s:    用户将光标移到 Artwork 3 上
          -> Layer 3 暂停 (自动播放停止)
          -> Layer 1 激活 (当前区域Gallery Walk效果)
          -> Artwork 2 淡出，Artwork 3 淡入
          -> 6个评论家按顺序出现

T=12s:    用户在 Artwork 3 内移动光标
          -> Layer 2 激活 (光标交互)
          -> 粒子被吸引，形成磁场
          -> 尾迹效果显示光标路径

T=14s:    用户点击 Artwork 3
          -> 爆炸动画 (粒子向外扩散)
          -> RPAIT面板显示该区域的6个评论家评分
          -> 粒子根据I维度的沉降回归

T=16s:    用户光标离开
          -> 3秒倒计时开始

T=19s:    3秒已过，无新交互
          -> Artwork 3 淡出
          -> Layer 3 恢复 (自动播放从Artwork 4开始)
          -> 循环继续...
```

---

## 设计原则对应

| 设计原则 | 实现方式 | 对应层级 |
|---------|--------|--------|
| 负形美学 | 初始状态为空，交互才显现 | Layer 1 基础 |
| 时间节奏 | 评论家顺序淡入，不同维度驱动速度 | Layer 1, 3 |
| 用户共创 | 光标吸引粒子，点击触发爆炸 | Layer 2 |
| 声音清晰 | 单时间只突出1个区域 | Layer 1, 3 |
| 自导览 | 自动播放引导，可随时中断 | Layer 3 |
| 深度发现 | RPAIT值逐层显现 | Layer 2 爆炸显示 |

---

## 权重公式详细说明

### 最终Alpha计算

```
finalAlpha = fadeAlpha × (baseProminence + promAlpha)

其中：
- fadeAlpha ∈ [0, 1]
  - Gallery Walk 的淡入淡出（250ms顺序）

- baseProminence = 0.05
  - 静默状态的背景可见性（负形原则）

- promAlpha ∈ [0, 0.95]
  - 权重范围，从5%（最小）到100%（最大）
  - 由自动播放或用户交互控制

例子：
- 非焦点区域 + 非突出：0.05 × 1.0 = 5%
- 焦点区域 + 非突出：0.5 × 1.0 = 50%
- 焦点区域 + 突出：1.0 × 1.95 = 195% → clip to 100%
```

### RPAIT 维度映射强度

```javascript
// 爆炸速度 = T维度函数
burstVelocity = (rpait.T / 10) × 10;  // 0-10 pixels/frame

// 沉降复杂度 = I维度函数
if (rpait.I < 3) {
  sedimentCurve = 'linear';      // 直线下降
} else if (rpait.I < 6) {
  sedimentCurve = 'sinusoidal';  // 波动下降
} else if (rpait.I < 8) {
  sedimentCurve = 'polynomial';  // 多项式轨迹
} else {
  sedimentCurve = 'complex';     // 复杂分形轨迹
}

// 吸引强度 = P维度函数
attractionStrength = (rpait.P / 10);  // 0-1倍系数

// 颜色 = A维度函数
hue = baseHue + (rpait.A - 5) × 8;  // ±40°范围
saturation = 40 + rpait.A × 6;      // 40-100%
```

---

## 预期视觉流程 (3分钟体验)

```
[0:00] 页面加载，自动播放开始 (Artwork 1)
       ░░░░░░░░ ░░░░░░░░
       ░░░░░░░░ ░░░░░░░░

[0:15] Artwork 2 自动切换
       ░░░░░░░░ ◆◆◆◆◆◆
       ░░░░░░░░ ░░░░░░░░

[0:30] Artwork 3 自动切换
       ░░░░░░░░ ░░░░░░░░
       ◆◆◆◆◆◆ ░░░░░░░░

[用户交互开始]

[0:45] 用户将光标移到 Artwork 1
       自动播放停止
       ◆◆◆◆◆◆ ░░░░░░░░  ← 淡入 (Gallery Walk)
       ░░░░░░░░ ░░░░░░░░

[1:00] 用户在 Artwork 1 内移动光标
       ◇◇◇◇◇◇  ░░░░░░░░  ← 粒子被吸引
        ︵︵︵ (尾迹)
       ░░░░░░░░ ░░░░░░░░

[1:15] 用户点击
       💥 爆炸 RPAIT值显示
       ◆◆◆◆◆◆  ░░░░░░░░
       ░░░░░░░░ ░░░░░░░░

[1:20] 粒子沉降回归
       ◆◆◆◆◆◆  ░░░░░░░░
       ░░░░░░░░ ░░░░░░░░

[1:30] 光标离开 3秒无交互后
       ░░░░░░░░ ░░░░░░░░  ← 淡出
       ░░░░░░░░ ░░░░░░░░

[1:33] 自动播放恢复 (Artwork 2)
       ░░░░░░░░ ◆◆◆◆◆◆  ← 自动循环
       ░░░░░░░░ ░░░░░░░░

[1:48-3:00] 循环继续...
```

---

## 实现顺序

### Phase 1 (Week 3): Layer 1 + Layer 3 基础
1. ParticleSystem: 添加fadeAlpha, prominenceLevel
2. ExhibitionLayout: 追踪hovered region
3. AutoPlayManager: 实现5区域轮播
4. 渲染逻辑：多alpha通道计算

### Phase 2 (Week 4): Layer 2 光标交互
1. InteractionManager: 光标吸引计算
2. 尾迹记录与衰减
3. 视觉反馈（磁场效果）

### Phase 3 (Week 5): 爆炸与RPAIT显示
1. 点击爆炸动画
2. 沉降回归逻辑（I维度驱动）
3. RPAIT面板UI

### Phase 4 (Week 6-7): 抛光与优化
1. 曲线调优（缓动函数）
2. 性能优化（粒子数量动态调整）
3. 响应式设计（移动端适配）

---

## 优势总结

✅ **Layer 1 优势** (Gallery Walk)
- 清晰的空间聚焦
- 负形原则实现
- 易于理解

✅ **Layer 2 优势** (Data Constellation)
- 深层交互体验
- 用户共创感
- 发现RPAIT含义

✅ **Layer 3 优势** (Prominence)
- 自动导览
- 无压力浏览
- 展示所有内容

✅ **混合优势**
- 新手：自动播放 (Layer 3)
- 探索者：交互实验 (Layer 2)
- 深度：RPAIT理解 (爆炸显示)
- 随时退出：无强制，随意浏览

---

## 预期效果

**技术**: ✅ 完美（24系统，RPAIT驱动，零错误）
**概念**: ✅ 优秀（负形+时序+交互）
**体验**: ✅ 卓越（多层递进，自动+手动并行）

这个混合方案整合了三个方案的核心优势，创造出既有艺术装置的宁静沉思，又有交互探索的深度，还有自动导览的亲和力的体验。
