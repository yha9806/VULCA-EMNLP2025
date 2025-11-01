# VULCA 艺术展览 - 技术实施指南
**开发周期**: 7周
**目标**: 从网站升级为沉浸式数据艺术装置

---

## 第一阶段：Week 1-2 - 基础架构

### Task 1.1: PixiJS集成与初始化

```javascript
// js/exhibition/PixiRenderer.js

import * as PIXI from 'pixi.js';

class PixiRenderer {
  constructor(containerElement) {
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0xFAFAF8,  // 极浅米色
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    containerElement.appendChild(this.app.view);

    // 优化：使用 ParticleContainer 以支持100K+粒子
    this.particleContainer = new PIXI.ParticleContainer(
      100000,  // 最大粒子数
      {
        scale: true,
        position: true,
        rotation: true,
        uvs: false,
        tint: true,  // 支持颜色变化
      }
    );

    this.app.stage.addChild(this.particleContainer);

    // 响应式重设大小
    window.addEventListener('resize', () => this.resize());

    // 启动渲染循环
    this.app.ticker.add(() => this.update());
  }

  resize() {
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
  }

  update(delta) {
    // 每帧更新所有粒子系统
    // 详见 ParticleSystem.js
  }
}
```

### Task 1.2: 4个展览区域的网格布局

```javascript
// js/exhibition/ExhibitionLayout.js

class ExhibitionLayout {
  constructor(containerElement) {
    // HTML Canvas全屏
    this.canvas = containerElement;

    // 4个区域的位置和大小
    this.regions = {
      artwork_1: { x: 0,   y: 0,   w: 0.5, h: 0.5 },  // 左上
      artwork_2: { x: 0.5, y: 0,   w: 0.5, h: 0.5 },  // 右上
      artwork_3: { x: 0,   y: 0.5, w: 0.5, h: 0.5 },  // 左下
      artwork_4: { x: 0.5, y: 0.5, w: 0.5, h: 0.5 },  // 右下
    };

    this.containerWidth = window.innerWidth;
    this.containerHeight = window.innerHeight * 0.7;  // 70% 是展览区

    // 为每个区域创建粒子系统容器
    this.createRegions();
  }

  createRegions() {
    Object.entries(this.regions).forEach(([key, region]) => {
      const regionContainer = new PIXI.Container();
      const bounds = this.calculateBounds(region);

      regionContainer.position.set(bounds.x, bounds.y);
      regionContainer.hitArea = new PIXI.Rectangle(0, 0, bounds.w, bounds.h);

      // 添加边框（开发时，生产隐藏）
      if (process.env.DEV_MODE) {
        const border = new PIXI.Graphics();
        border.lineStyle(1, 0xCCCCCC);
        border.drawRect(0, 0, bounds.w, bounds.h);
        regionContainer.addChild(border);
      }

      this.app.stage.addChild(regionContainer);
      this.regions[key].container = regionContainer;
    });
  }

  calculateBounds(region) {
    return {
      x: region.x * this.containerWidth,
      y: region.y * this.containerHeight,
      w: region.w * this.containerWidth,
      h: region.h * this.containerHeight,
    };
  }
}
```

### Task 1.3: 24个粒子系统的框架

```javascript
// js/exhibition/ParticleSystem.js

class ParticleSystem {
  constructor(options = {}) {
    this.artworkId = options.artworkId;    // 1-4
    this.personaId = options.personaId;    // 苏轼, 郭熙, ...
    this.region = options.region;          // { x, y, w, h }

    // 粒子池
    this.particles = [];
    this.particleCount = 80;  // 默认，会被RPAIT权重动态修改

    // 状态
    this.enabled = true;
    this.rpait = options.rpait || { R: 5, P: 5, A: 5, I: 5, T: 5 };

    // 颜色与运动身份
    this.colorIdentity = this.getPersonaColorIdentity(personaId);
    this.motionLanguage = this.getMotionLanguage(personaId);

    // 初始化粒子
    this.initParticles();
  }

  initParticles() {
    // 生成初始粒子
    for (let i = 0; i < this.particleCount; i++) {
      const particle = {
        x: Math.random() * this.region.w,
        y: Math.random() * this.region.h,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: 2 + Math.random() * 3,
        alpha: 0.1 + Math.random() * 0.2,
        color: this.colorIdentity.primary,
      };
      this.particles.push(particle);
    }
  }

  updateRPAIT(rpait) {
    // 响应RPAIT权重变化
    this.rpait = rpait;

    // 更新粒子属性
    this.particleCount = Math.round(80 + (rpait.R * 20));

    // 添加或移除粒子以达到目标数量
    while (this.particles.length < this.particleCount) {
      this.particles.push(this.createNewParticle());
    }
    while (this.particles.length > this.particleCount) {
      this.particles.pop();
    }

    // 更新其他参数（详见第二阶段）
    this.updateMotionParameters();
    this.updateColorParameters();
  }

  update(delta) {
    // 更新每个粒子的位置
    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // 边界检测
      if (particle.x < 0 || particle.x > this.region.w) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.region.h) particle.vy *= -1;
    });
  }

  render(pixiContainer) {
    // 绘制粒子到PixiJS容器
    this.particles.forEach(particle => {
      // 创建或重用PixiJS Sprite
      // 详见 PixiJS 集成部分
    });
  }

  getPersonaColorIdentity(personaId) {
    const colorMap = {
      苏轼: { primary: 0x2F2E2C, accent: 0x8B7D6B, glow: 0xD4D2CE },
      郭熙: { primary: 0x2D5016, accent: 0x6B8E23, glow: 0xB4D96F },
      // ... 其他评论家
    };
    return colorMap[personaId];
  }

  getMotionLanguage(personaId) {
    // 返回该评论家的运动模式
  }
}
```

### Task 1.4: RPAIT数据结构

```javascript
// js/data/RPAIT.js

export const RPAITData = {
  artwork_1: {
    苏轼: { R: 7, P: 9, A: 8, I: 8, T: 7 },
    郭熙: { R: 8, P: 7, A: 9, I: 7, T: 8 },
    约翰罗斯金: { R: 6, P: 8, A: 8, I: 9, T: 6 },
    佐拉妈妈: { R: 7, P: 6, A: 7, I: 8, T: 7 },
    埃琳娜佩特洛娃: { R: 9, P: 7, A: 9, I: 6, T: 9 },
    AI伦理评审员: { R: 7, P: 8, A: 7, I: 8, T: 8 },
  },
  // ... artwork_2, 3, 4
};
```

### Task 1.5: 基础交互事件系统

```javascript
// js/exhibition/InteractionManager.js

class InteractionManager {
  constructor(pixiApp, exhibitionLayout) {
    this.app = pixiApp;
    this.layout = exhibitionLayout;

    // 启用交互
    this.app.stage.interactive = true;
    this.app.stage.hitArea = new PIXI.Rectangle(0, 0, window.innerWidth, window.innerHeight);

    // 绑定事件
    this.app.stage.on('pointermove', (e) => this.onHover(e));
    this.app.stage.on('pointerdown', (e) => this.onClick(e));
    this.app.stage.on('pointermove', (e) => this.onDrag(e));
  }

  onHover(event) {
    const { x, y } = event.global;

    // 检查悬停在哪个区域
    const region = this.getRegionAtPoint(x, y);

    if (region) {
      // 触发该区域的粒子系统
      // 详见第三阶段 (交互系统完善)
    }
  }

  onClick(event) {
    const { x, y } = event.global;
    const region = this.getRegionAtPoint(x, y);

    if (region) {
      // 触发爆裂效果
    }
  }

  onDrag(event) {
    // 拖动时的风场效果
  }

  getRegionAtPoint(x, y) {
    // 返回点击位置所在的区域
    for (const [key, region] of Object.entries(this.layout.regions)) {
      const bounds = region.container.getBounds();
      if (x >= bounds.x && x <= bounds.x + bounds.width &&
          y >= bounds.y && y <= bounds.y + bounds.height) {
        return region;
      }
    }
    return null;
  }
}
```

---

## 第二阶段：Week 2-3 - RPAIT映射引擎

### Task 2.1: RPAITToVisuals 映射函数

```javascript
// js/exhibition/RPAITMapper.js

export class RPAITMapper {
  /**
   * 将RPAIT权重映射到粒子系统视觉参数
   */
  static mapToVisuals(rpait, personaId) {
    return {
      // R (表现力) → 粒子数量、大小、亮度
      particleCount: 80 + (rpait.R * 20),
      particleSize: 2 + (rpait.R * 0.8),
      luminosity: 0.5 + (rpait.R * 0.05),
      saturation: 100 + (rpait.R * 10),

      // P (哲学性) → 运动模式、节奏
      driftIntensity: 1 + (rpait.P * 0.3),
      driftFrequency: 0.5 + (rpait.P * 0.15),
      periodicity: 2000 + (rpait.P * 500),

      // A (美学) → 颜色、光晕
      hue: this.generateHue(rpait.A, personaId),
      colorScheme: this.mapToPersonaColor(rpait.A, personaId),
      glowIntensity: 0.1 + (rpait.A * 0.15),

      // I (解读) → 淡出模式、消散速度
      alphaSpeed: 5 + (rpait.I * 10),
      alphaMin: 0.05 + (rpait.I * 0.05),
      alphaMax: 0.3 + (rpait.I * 0.2),
      fadeComplexity: this.generateFadeCurve(rpait.I),

      // T (技巧) → 速度、精确度
      speed: 1.5 + (rpait.T * 0.8),
      acceleration: 0.1 + (rpait.T * 0.05),
      precision: 0.5 + (rpait.T * 0.5),
    };
  }

  static generateHue(weight, personaId) {
    // 基于权重和评论家身份生成色调
    const baseHues = {
      苏轼: 0,       // 灰色基调
      郭熙: 120,     // 绿色基调
      约翰罗斯金: 280,   // 紫色基调
      佐拉妈妈: 20,  // 橙色基调
      埃琳娜佩特洛娃: 0,  // 红色基调
      AI伦理评审员: 200,  // 青色基调
    };

    const baseHue = baseHues[personaId];
    const variation = (weight - 5) * 10;  // ±50度范围

    return (baseHue + variation + 360) % 360;
  }

  static mapToPersonaColor(weight, personaId) {
    const colorSchemes = {
      苏轼: 'monochromatic',
      郭熙: 'analogous',
      约翰罗斯金: 'complementary',
      佐拉妈妈: 'warm',
      埃琳娜佩特洛娃: 'formal',
      AI伦理评审员: 'digital',
    };

    return colorSchemes[personaId];
  }

  static generateFadeCurve(weight) {
    // 生成淡出曲线函数
    if (weight < 3) return 'linear';
    if (weight < 7) return 'sinusoidal';
    return 'complex';  // 复杂的非线性淡出
  }
}
```

### Task 2.2: 颜色生成与管理

```javascript
// js/utils/ColorUtils.js

export class ColorUtils {
  /**
   * 评论家的色彩身份定义
   */
  static getPersonaColorIdentity(personaId) {
    const identities = {
      苏轼: {
        primary: 0x2F2E2C,      // #2F2E2C
        accent: 0x8B7D6B,
        glow: 0xD4D2CE,
        colorScheme: 'monochromatic',
        rhyme: 'brush_stroke',
      },
      郭熙: {
        primary: 0x2D5016,      // #2D5016
        accent: 0x6B8E23,
        glow: 0xB4D96F,
        colorScheme: 'analogous',
        rhyme: 'perspective_depth',
      },
      约翰罗斯金: {
        primary: 0x6B4C9A,      // #6B4C9A
        accent: 0xC77DFF,
        glow: 0xE0AAFF,
        colorScheme: 'complementary',
        rhyme: 'ascending_narrative',
      },
      佐拉妈妈: {
        primary: 0x8B6F47,      // #8B6F47
        accent: 0xD2691E,
        glow: 0xF4A460,
        colorScheme: 'warm',
        rhyme: 'circular_synchrony',
      },
      埃琳娜佩特洛娃: {
        primary: 0xB22234,      // #B22234
        accent: 0xD9534F,
        glow: 0xF5C6C6,
        colorScheme: 'formal',
        rhyme: 'geometric_structure',
      },
      AI伦理评审员: {
        primary: 0x0066CC,      // #0066CC
        accent: 0x00CCFF,
        glow: 0x00FFFF,
        colorScheme: 'digital',
        rhyme: 'algorithmic_fractal',
      },
    };

    return identities[personaId];
  }

  /**
   * HSL → RGB 转换，用于动态颜色生成
   */
  static hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) {
      r = c; g = x; b = 0;
    } else if (h >= 60 && h < 120) {
      r = x; g = c; b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0; g = c; b = x;
    } else if (h >= 180 && h < 240) {
      r = 0; g = x; b = c;
    } else if (h >= 240 && h < 300) {
      r = x; g = 0; b = c;
    } else if (h >= 300 && h < 360) {
      r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return (r << 16) | (g << 8) | b;
  }

  /**
   * 生成基于权重的颜色变体
   */
  static generateVariant(baseColor, weight) {
    // weight: 0-10
    // 返回更明亮或更暗的变体
    const brightness = weight * 10;  // 0-100
    return this.adjustBrightness(baseColor, brightness);
  }

  static adjustBrightness(color, amount) {
    // 调整颜色亮度
    // amount: -100 (黑) ~ 100 (白)
  }
}
```

### Task 2.3: 运动模式生成

```javascript
// js/exhibition/MotionLanguage.js

export class MotionLanguage {
  static getMotionPattern(personaId, rpait) {
    const patterns = {
      苏轼: this.brushStroke(rpait),
      郭熙: this.perspectiveDepth(rpait),
      约翰罗斯金: this.ascendingNarrative(rpait),
      佐拉妈妈: this.circularSynchrony(rpait),
      埃琳娜佩特洛娃: this.geometricStructure(rpait),
      AI伦理评审员: this.algorithmicFractal(rpait),
    };

    return patterns[personaId];
  }

  static brushStroke(rpait) {
    return {
      pattern: 'wave',
      amplitude: 2 + rpait.P,
      frequency: 0.5 + rpait.A * 0.1,
      easing: 'sine',
      directionVector: (t) => ({
        x: Math.sin(t * 0.5) * 2,
        y: Math.cos(t * 0.3) * 2,
      }),
    };
  }

  static perspectiveDepth(rpait) {
    return {
      pattern: 'receding_planes',
      depth: rpait.I / 10,
      scale: (distance) => Math.pow(0.8, distance / 100),
      easing: 'exponential',
    };
  }

  // ... 其他运动模式
}
```

---

## 第三阶段：Week 3-4 - 交互系统完善

（详细代码省略，原理同上）

**Task 3.1**: 悬停 → 粒子吸引/排斥
**Task 3.2**: 点击 → 爆裂与重聚
**Task 3.3**: 拖动 → 风场效果
**Task 3.4**: 触摸手势识别
**Task 3.5**: 自动闲置行为

---

## 第四阶段：Week 4-5 - UI面板与可视化

（HTML/CSS + Canvas渲染）

**Task 4.1**: 顶部信息面板
**Task 4.2**: RPAIT权重雷达图
**Task 4.3**: 底部互动面板
**Task 4.4**: 评论详情面板

---

## 第五阶段：Week 5-6 - 视觉细节与优化

**Task 5.1**: 过渡动画
**Task 5.2**: 微交互与反馈
**Task 5.3**: 颜色细调
**Task 5.4**: 性能优化
**Task 5.5**: 着色器效果

---

## 第六阶段：Week 6-7 - 测试与部署

**Task 6.1**: 浏览器兼容性测试
**Task 6.2**: 响应式设计验证
**Task 6.3**: Playwright自动化测试
**Task 6.4**: 性能审计
**Task 6.5**: 生产部署

---

## 性能优化要点

```javascript
// 关键优化

1. ParticleContainer 而非 Sprite
   - 支持 100K+ 粒子
   - 单个 drawcall

2. 对象池 (Object Pooling)
   - 复用粒子对象，减少GC压力

3. 批处理 (Batching)
   - 相同颜色的粒子合并渲染

4. LOD (Level of Detail)
   - 远离摄像机的粒子降低质量

5. 请求帧速率 (requestAnimationFrame)
   - 与浏览器刷新率同步
```

---

## 开发检查清单

```
Week 1-2:
□ PixiJS 初始化成功
□ 4 个区域显示
□ 24 个粒子系统创建
□ 60fps @ 1440p

Week 2-3:
□ RPAIT 映射函数实现
□ 颜色生成算法验证
□ 运动模式生成
□ 粒子参数动态响应

Week 3-4:
□ 悬停交互工作
□ 点击交互工作
□ 拖动交互工作
□ 手触交互工作

Week 4-5:
□ 顶部面板显示
□ RPAIT 图表更新
□ 评论详情面板
□ UI 响应式

Week 5-6:
□ 动画流畅
□ 无视觉跳跃
□ 60fps 稳定
□ 渲染质量高

Week 6-7:
□ 全浏览器兼容
□ 移动端完美
□ 所有测试通过
□ 文档完整
```

---

这个实施指南可以直接指导开发。建议按周进行开发，每周末进行Demo验证。
