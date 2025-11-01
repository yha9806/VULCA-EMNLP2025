# 🚀 VULCA展览网站 - 4周密集执行计划

**项目**: VULCA艺术装置展览网站
**时间**: 4周（28天）密集开发
**目标**: 上线完整的后现代主义粒子艺术展览网站
**预算**: ¥10,700
**美学**: 暖灰 + 金属 + 动态粒子 + 沉浸式体验

---

## 📋 项目核心信息

### 作品清单
1. **Sougwen Chung - BODY MACHINE (MERIDIANS) - 装置视图** (2024)
2. **Sougwen Chung - BODY MACHINE (MERIDIANS) - 细节特写** (2024)
3. **Lauren McCarthy - AUTO - 算法监视** (2023)
4. **Lauren McCarthy - MEMORY - 绘画生成单位** (2021)

### 网站URL
- **生产环境**: https://vulca.art (自定义域名)
- **备用URL**: https://[username].github.io/vulca-exhibition

### 技术栈
```
前端: HTML5 + CSS3 + Vanilla JS ES6+
3D粒子: Three.js r160+
动画: GSAP 3
部署: GitHub Pages
域名: .art 顶级域名
```

---

## 📅 **第1周：美学定稿 + 架构搭建 (36小时)**

### Day 1-2: 色彩系统 & 设计定稿 (8小时)

**Monday Morning (4h)**
```
☑ 色彩RGB值最终确认
  ├─ 深灰背景: #1a1a1a ✓
  ├─ 暖金强调: #d4af37 ✓
  ├─ 银白次强调: #c0c0c0 ✓
  ├─ 土色灰文本: #c0bbb5 ✓
  └─ 创建 docs/css/_colors.css

☑ 设计规范文档 (DESIGN_SPEC.md)
  ├─ 色卡展示
  ├─ 字体系统 (Helvetica Neue + Georgia)
  ├─ 间距规范
  └─ 声明获得确认签字

☑ Figma原型验证
  └─ 确保设计稿中所有颜色精确匹配RGB值
```

**Monday Afternoon (4h)**
```
☑ GitHub仓库初始化
  ├─ 创建: vulca-exhibition
  ├─ 初始化 docs/ 目录结构
  │  ├─ docs/index.html
  │  ├─ docs/detail.html
  │  ├─ docs/css/
  │  ├─ docs/js/
  │  ├─ docs/data/
  │  └─ docs/images/
  ├─ 配置 .gitignore
  ├─ 第一次 commit: "Initial: project scaffold"
  └─ git push -u origin main

☑ 美学方向最终确认
  └─ 与stakeholder会议，签署DESIGN_SPEC.md
```

**Tuesday (8h) - 技术验证 + 粒子原型**

```
Upper Half (4h):
☑ Three.js基础环境
  ├─ 创建 docs/js/engine.js
  ├─ Scene, Camera, Renderer 初始化
  ├─ 测试WebGL工作正常
  └─ 记录基础FPS数据

☑ 粒子系统PoC (Proof of Concept)
  ├─ 创建 docs/js/particles.js
  ├─ 1500个粒子初始化
  ├─ 应用暖灰+金属色
  ├─ 测试FPS（目标60fps）
  └─ 如果<50fps，优化粒子算法

Lower Half (4h):
☑ 性能基准建立
  ├─ 测试首屏加载时间
  ├─ 创建 PERF_BASELINE.md
  ├─ 记录初始指标
  └─ 设定优化目标

☑ 项目文档初稿
  ├─ 更新 README.md
  ├─ 记录技术选择理由
  └─ 配置文件创建 (config.json)
```

### Day 3-5: 数据准备 + 前期优化 (8小时)

**Wednesday (8h) - 数据与资源准备**

```
Morning (4h):
☑ 作品图片处理
  ├─ 下载/准备4幅高清作品图片
  ├─ 尺寸: 3000×2000px+
  ├─ 格式: PNG (高质)
  ├─ TinyPNG压缩至<2MB/幅
  ├─ 保存: docs/images/artworks/
  └─ 验证色彩还原

☑ 元数据编写
  ├─ 创建 docs/data/artworks.json
  ├─ 4幅作品的中英文案
  ├─ 作品背景、艺术家简介
  └─ JSON验证无误

Afternoon (4h):
☑ 二维码生成
  ├─ 用qrcode.js生成4个二维码
  ├─ 指向首页URL: https://vulca.art
  ├─ 尺寸: 200×200px
  ├─ 色彩: #d4af37 + #1a1a1a配色
  ├─ 保存: docs/images/qrcodes/
  └─ 测试扫码功能

☑ 配置文件完善
  └─ 更新 docs/data/config.json 所有参数
```

**Thursday (8h) - 粒子效果微调**

```
Morning (4h):
☑ 粒子视觉优化
  ├─ 调整粒子大小 (目标: 2-5px)
  ├─ 调整粒子颜色分布
  │  ├─ 暖金 #d4af37: 30%
  │  ├─ 银白 #c0c0c0: 40%
  │  ├─ 棕灰 #5c5450: 30%
  ├─ 调整运动速度 (3-5秒循环)
  ├─ 调整透明度 (20-40%)
  └─ 实际屏幕验证视觉效果

Afternoon (4h):
☑ 第一次完整测试
  ├─ 打开首页: 粒子加载? ✓
  ├─ 浏览器控制台: 无错误? ✓
  ├─ FPS稳定性: ≥55fps? ✓
  ├─ 跨浏览器: Chrome/Firefox/Safari? ✓
  └─ 记录任何问题

☑ 第1周总结提交
  ├─ git add .
  ├─ git commit -m "W1: design system + particle foundation"
  └─ 更新 README.md 进度
```

**Friday (4h) - 最后检查**

```
☑ 美学最终确认
  ├─ 色彩RGB值是否精确? ✓
  ├─ 粒子效果符合设计稿? ✓
  ├─ 整体氛围符合预期? ✓
  └─ 获得stakeholder确认

☑ 第1周交付物检查
  ├─ GitHub仓库运行正常? ✓
  ├─ 所有设计文档完成? ✓
  ├─ 所有作品数据准备好? ✓
  └─ 粒子系统可用? ✓
```

**第1周成果清单**:
```
✅ 完整的色彩系统 (RGB精确)
✅ 设计规范文档 (DESIGN_SPEC.md)
✅ GitHub仓库初始化完成
✅ 4幅作品高清图片+文案就绪
✅ 粒子系统基础可用
✅ 性能基准建立
✅ Stakeholder确认签字
```

---

## 📅 **第2周：前端UI + 交互逻辑 (36小时)**

### Day 6-7: 首页HTML + CSS完成 (8小时)

**Monday (8h)**

```
Morning (4h):
☑ 首页HTML结构 (docs/index.html)
  ├─ <!DOCTYPE html> + Meta标签
  ├─ <header> 导航栏
  │  ├─ Logo: "VULCA"
  │  └─ 副标题: "潮汐的负形"
  ├─ <main id="exhibition">
  │  ├─ <canvas id="webgl-canvas"></canvas>
  │  └─ <div id="artworks-container"></div>
  ├─ <div id="info-panel" class="hidden">
  │  ├─ 标题、描述、二维码
  │  └─ 关闭按钮
  └─ <footer>

Afternoon (4h):
☑ 首页CSS完成 (docs/css/main.css)
  ├─ 全屏布局 (height: 100vh)
  ├─ Canvas全屏背景
  ├─ 信息面板样式
  │  ├─ 背景: rgba(26,26,26,0.9)
  │  ├─ 边框: 1px solid #d4af37
  │  ├─ 阴影: 0 8px 32px rgba(212,175,55,0.2)
  │  └─ 宽度: 500px (desktop) / 90% (mobile)
  ├─ 响应式断点 (desktop/tablet/mobile)
  └─ 测试样式应用
```

### Day 8-9: Three.js场景 + 粒子集成 (8小时)

**Tuesday (8h)**

```
Morning (4h):
☑ Three.js场景搭建 (docs/js/scene.js)
  ├─ 初始化 Scene, Camera, Renderer
  ├─ 配置光源 (环境光 + 定向光)
  ├─ 加载4幅作品图片为texture
  ├─ 创建4个Plane mesh
  ├─ 排列成2×2 grid
  ├─ 配置摄像机视角
  └─ 测试基础渲染

☑ 作品点击检测 (Raycaster)
  ├─ mousemove事件监听
  ├─ 点击时触发showInfoPanel()
  ├─ cursor变化提示可交互
  └─ 测试响应

Afternoon (4h):
☑ 粒子系统集成
  ├─ 粒子系统初始化 (1500个)
  ├─ 使用Perlin噪声流场
  ├─ 应用暖灰+金属色
  ├─ 每帧更新粒子位置
  ├─ 粒子边界检测
  └─ FPS验证 (≥55fps)

☑ 完整场景测试
  ├─ 粒子加载? ✓
  ├─ 作品显示清晰? ✓
  ├─ 布局合理? ✓
  ├─ 无JS错误? ✓
  └─ 记录任何问题
```

### Day 10: 交互逻辑 + 响应式设计 (8小时)

**Wednesday (8h)**

```
Morning (4h):
☑ JavaScript主逻辑 (docs/js/main.js)
  ├─ 应用全局状态管理
  ├─ 页面初始化函数
  ├─ 数据加载 (artworks.json)
  ├─ 事件监听器设置
  └─ 错误处理

☑ 信息面板功能
  ├─ showInfoPanel(artworkId) 实现
  ├─ 从JSON读取数据
  ├─ 填充标题、描述、二维码
  ├─ 面板淡入动画
  └─ ESC键/外部点击关闭

Afternoon (4h):
☑ 响应式设计 (docs/css/responsive.css)
  ├─ 平板断点 (768px)
  │  ├─ 粒子减少至1000
  │  ├─ 字体缩小20%
  │  └─ 间距调整
  ├─ 手机断点 (320-480px)
  │  ├─ 粒子进一步减少至500
  │  ├─ 全宽面板
  │  └─ 更大触摸目标
  └─ 测试各断点

☑ 浏览器兼容性快速扫
  ├─ Chrome ✓
  ├─ Firefox ✓
  ├─ Safari ✓
  └─ Edge ✓
```

### Day 11-12: 作品晕光 + 完整集成 (8小时)

**Thursday (8h)**

```
Morning (4h):
☑ 作品周围晕光效果
  ├─ 在作品周围生成粒子环绕 (500个)
  ├─ 粒子颜色: 暖金 #d4af37
  ├─ 密度调整
  └─ 视觉效果优化

☑ Bloom后期处理
  ├─ EffectComposer 配置
  ├─ BloomPass参数
  │  ├─ threshold: 0.5
  │  ├─ strength: 1.5
  │  └─ radius: 1.0
  ├─ 应用到粒子
  └─ 测试效果

Afternoon (4h):
☑ 完整集成测试
  ├─ 首页完整流程
  │  ├─ 打开 → 粒子+作品显示
  │  ├─ 点击作品 → 面板显示
  │  ├─ 浏览器控制台无错误
  │  └─ FPS≥55
  ├─ 浏览器兼容性测试 (完整)
  └─ 移动设备测试 (DevTools)

☑ 第2周总结提交
  ├─ git commit -m "W2: UI + interactions complete"
  └─ 代码review
```

**第2周成果清单**:
```
✅ 完整首页UI开发完成
✅ Three.js场景正确显示4幅作品
✅ 粒子系统完全集成
✅ 作品晕光效果
✅ 信息面板功能完成
✅ 响应式设计就绪
✅ 基本交互逻辑完成
✅ 浏览器兼容性验证
```

---

## 📅 **第3周：性能优化 + 详情页 (36小时)**

### Day 13-14: 性能优化 (8小时)

**Monday (8h)**

```
Morning (4h):
☑ 粒子系统优化
  ├─ 使用BufferGeometry
  ├─ InstancedBufferGeometry优化
  ├─ 减少shader计算复杂度
  ├─ FPS测试: 目标≥55fps
  └─ 记录优化结果

☑ 图片优化
  ├─ TinyPNG压缩每幅作品
  ├─ 目标: <1.5MB/幅
  ├─ WebP格式 (后备jpg)
  ├─ 懒加载实现
  └─ 测试加载速度

Afternoon (4h):
☑ JavaScript优化
  ├─ 压缩CSS/JS (.min文件)
  ├─ 删除console.log
  ├─ 合并CSS文件
  ├─ 异步加载非关键JS
  └─ 性能测试

☑ 性能基准测试
  ├─ Lighthouse评分
  ├─ 首屏加载时间 (目标<2s)
  ├─ 创建 PERF_REPORT.md
  └─ 记录基准数据
```

### Day 15-16: 详情页开发 (8小时)

**Tuesday (8h)**

```
Morning (4h):
☑ 详情页HTML (docs/detail.html)
  ├─ 返回首页按钮
  ├─ 大幅作品图片 (center)
  ├─ 作品标题、描述 (200字)
  ├─ 创作背景说明
  ├─ 二维码显示
  └─ Footer

☑ 详情页样式 (docs/css/detail.css)
  ├─ 单列布局
  ├─ 图片max-width: 800px
  ├─ 文本居中对齐
  ├─ 响应式缩放
  └─ 暖灰主题色保持

Afternoon (4h):
☑ 详情页逻辑 (docs/js/detail.js)
  ├─ 从URL参数读取artwork id
  ├─ 从artworks.json读取数据
  ├─ 填充页面内容
  ├─ 导航逻辑 (返回首页)
  ├─ 错误处理
  └─ 浏览器前进/后退支持

☑ 二维码集成
  ├─ qrcode.js库集成
  ├─ 生成首页URL二维码
  ├─ 显示在首页和详情页
  └─ 测试扫码
```

### Day 17-18: 动画与优化 (8小时)

**Wednesday (8h)**

```
Morning (4h):
☑ 页面加载动画 (GSAP)
  ├─ 粒子逐渐出现 (0.5s)
  ├─ 作品逐个淡入 (1s delay)
  ├─ UI逐渐可见
  └─ 总时间<3s

☑ 交互动画
  ├─ 作品点击 → 面板淡入
  ├─ 作品hover → 略微放大 (scale: 1.02)
  ├─ 面板关闭 → 淡出
  └─ 所有动画<0.3s

Afternoon (4h):
☑ 缓存与SEO
  ├─ Meta标签完善
  ├─ OG标签配置 (社交分享)
  ├─ Viewport设置
  ├─ 浏览器缓存配置
  └─ 离线support (可选)

☑ 第3周总结提交
  ├─ git commit -m "W3: optimization + detail page"
  └─ Final review & testing
```

**第3周成果清单**:
```
✅ 性能优化完成 (60fps)
✅ 首屏加载<2s
✅ 详情页完成
✅ 动画与过渡完成
✅ 浏览器兼容性完整验证
✅ 所有核心功能可用
✅ SEO基础配置
```

---

## 📅 **第4周：部署 + 现场测试 (36小时)**

### Day 19-20: GitHub Pages部署 (8小时)

**Monday (8h)**

```
Morning (4h):
☑ GitHub Pages启用
  ├─ Settings → Pages
  ├─ Source: docs/
  ├─ Branch: main
  ├─ 等待部署 (<1分钟)
  └─ 访问临时URL验证

☑ 临时URL测试
  ├─ https://[username].github.io/vulca-exhibition
  ├─ 首页加载? ✓
  ├─ 粒子显示? ✓
  ├─ 作品显示? ✓
  ├─ 交互功能? ✓
  └─ 修复任何部署问题

Afternoon (4h):
☑ 自定义域名配置
  ├─ 购买 vulca.art 域名
  ├─ 登录域名管理后台
  ├─ 添加CNAME记录
  │  ├─ Name: @
  │  ├─ Value: [username].github.io
  │  └─ TTL: 3600
  ├─ GitHub Pages自定义域设置
  ├─ 等待DNS生效 (10分钟-2小时)
  └─ HTTPS自动启用

☑ 部署验证
  ├─ 访问 https://vulca.art
  ├─ 确认🔒标志
  ├─ 检查所有功能
  └─ 确认部署成功
```

### Day 21-22: 现场网络测试 (8小时)

**Tuesday (8h)**

```
Morning (4h):
☑ 展览现场网络测试
  ├─ 用速度测试工具检测
  ├─ 记录下载/上传速度
  ├─ 测试网络延迟
  ├─ 在展位多个位置测试
  ├─ 验证稳定性
  └─ 记录在 SITE_TEST_REPORT.md

☑ 高延迟模拟
  ├─ DevTools限制网络 (Slow 3G)
  ├─ 测试首页加载体验
  ├─ 测试粒子加载时间
  ├─ 验证加载提示清晰
  └─ 截图记录

Afternoon (4h):
☑ 多设备实际测试
  ├─ 在展览大屏幕上运行
  │  ├─ 粒子效果美观? ✓
  │  ├─ 色彩准确? ✓
  │  └─ 分辨率适配? ✓
  ├─ 用iPhone扫码测试
  │  ├─ 加载速度? ✓
  │  └─ 触摸交互? ✓
  ├─ 用Android扫码测试
  │  ├─ 加载速度? ✓
  │  └─ 触摸交互? ✓
  └─ 拍照记录
```

### Day 23-24: 配色验证 + 最终调整 (8小时)

**Wednesday (8h)**

```
Morning (4h):
☑ 在实际展示环境验证颜色
  ├─ 展位照明下的显示
  ├─ 大屏幕的色彩还原
  ├─ 与设计稿对比
  ├─ 如有偏差进行微调
  │  ├─ 调整RGB值
  │  ├─ 重新部署 (git push)
  │  └─ 重新验证
  └─ 最终拍照确认

☑ 粒子效果最后验证
  ├─ 粒子密度是否合适? ✓
  ├─ 速度是否优雅? ✓
  ├─ 颜色组合是否和谐? ✓
  ├─ 整体氛围? ✓
  └─ 记录在 AESTHETIC_VERIFICATION.md

Afternoon (4h):
☑ 极端情况测试
  ├─ 快速点击作品多次
  ├─ 快速切换页面
  ├─ 长时间观看 (内存泄漏?)
  ├─ 调整窗口大小
  ├─ 旋转设备 (移动端)
  └─ 记录任何问题

☑ 控制台检查
  ├─ DevTools Console: 无错误? ✓
  ├─ 无警告信息? ✓
  ├─ 修复所有错误
  └─ 控制台清洁
```

### Day 25-26: 文档与团队交接 (8小时)

**Thursday (8h)**

```
Morning (4h):
☑ README.md最终编写
  ├─ 项目介绍
  ├─ 展览链接: https://vulca.art
  ├─ 技术栈说明
  ├─ 视觉设计说明
  ├─ 开发者指南
  └─ 联系方式

☑ 备用方案准备
  ├─ 简化版本 (无粒子)
  ├─ 本地部署指南
  ├─ 应急快速修复步骤
  └─ 打印备用方案清单

Afternoon (4h):
☑ 最终代码提交
  ├─ git add .
  ├─ git commit -m "Final: deployment + site verification"
  ├─ git push
  └─ 打tag: v1.0.0

☑ 团队培训
  ├─ 展示人员:  如何打开首页
  ├─ 演示交互流程
  ├─ 常见问题解决
  ├─ 应急联系方式
  └─ 提供快速参考指南
```

### Day 27-28: 最后检查 + 上线 (8小时)

**Friday (8h)**

```
Morning (4h):
☑ 最后完整验证
  ├─ 打开 https://vulca.art
  ├─ 完整浏览首页
  │  ├─ 粒子显示? ✓
  │  ├─ 作品清晰? ✓
  │  ├─ 交互工作? ✓
  │  └─ 无错误? ✓
  ├─ 点击作品查看详情
  ├─ 扫码进入详情页
  └─ 所有功能正常

☑ 性能最后检查
  ├─ Lighthouse最后评分
  ├─ 记录最终指标
  └─ 创建 FINAL_PERFORMANCE.md

Afternoon (4h):
☑ 上线公告
  ├─ 发送上线通知
  ├─ 社交媒体发布
  ├─ 分享网址给观众
  └─ 欢迎反馈

☑ 监控系统启动
  ├─ 监控访问统计
  ├─ 监控粒子系统稳定性
  ├─ 监控错误日志
  └─ 建立支持渠道

🎉 **项目正式上线!**
```

**第4周成果清单**:
```
✅ 网站正式上线 https://vulca.art
✅ HTTPS安全连接工作
✅ 所有浏览器兼容通过
✅ 现场测试完毕
✅ 团队培训完成
✅ 完整文档交接
✅ 应急预案就位
✅ 监控系统运行
```

---

## 📊 **时间总体统计**

```
第1周 (W1): 36小时 = 9天工作量
  ├─ 美学定稿: 12h
  ├─ 技术架构: 12h
  ├─ 数据准备: 8h
  └─ 粒子基础: 4h

第2周 (W2): 36小时 = 9天工作量
  ├─ 前端UI: 12h
  ├─ Three.js: 12h
  ├─ 交互逻辑: 8h
  └─ 响应式: 4h

第3周 (W3): 36小时 = 9天工作量
  ├─ 性能优化: 8h
  ├─ 详情页: 8h
  ├─ 动画: 8h
  ├─ 测试: 8h
  └─ SEO: 4h

第4周 (W4): 36小时 = 9天工作量
  ├─ 部署: 8h
  ├─ 现场测试: 8h
  ├─ 配色验证: 4h
  ├─ 文档交接: 8h
  └─ 应急准备: 8h

总计: 144小时 = 36天工作量
实际周期: 4周 (每周6天, 每天6小时)
```

---

## ✅ **成功标准 (Acceptance Criteria)**

```
D级 (MVP - Minimum Viable Product):
✅ 首页可访问，粒子系统运行
✅ 4幅作品清晰显示
✅ 点击作品显示信息面板
✅ 二维码可扫描
✅ 所有浏览器基本兼容

C级 (Good):
✅ 粒子效果美观符合设计稿
✅ 色彩准确 (RGB值精确)
✅ 动画流畅 (60fps稳定)
✅ 首屏加载<2秒
✅ 移动端体验良好

B级 (Excellent):
✅ 现场展示效果满意
✅ 所有浏览器完美兼容
✅ 无console错误或警告
✅ 充分的备用方案
✅ 团队培训完成

A级 (Perfect):
✅ Lighthouse评分>90
✅ 用户反馈积极
✅ 技术文档完整
✅ 监控系统运行
✅ 可扩展性好

目标: 达到 B级 以上
```

---

## 🚨 **关键风险与应对**

| 风险 | 概率 | 影响 | 应对 |
|------|------|------|------|
| 粒子FPS不足 | 中 | 高 | W1末做性能基准，W3重点优化 |
| 色彩偏差 | 中 | 中 | W4现场验证，快速调整RGB值 |
| 浏览器兼容 | 低 | 中 | W3完整测试，提前发现 |
| 网络延迟 | 低 | 中 | 准备简化离线版本 |
| 部署失败 | 很低 | 高 | GitHub Pages备份方案 |

---

## 📞 **联系与支持**

```
技术支持: claude-code-support@anthropic.com
设计反馈: [stakeholder email]
现场问题: [on-site contact]

应急热线: 24/7 ready
```

---

**项目启动日期**: [开始日期]
**预期上线日期**: [开始日期 + 28天]
**最后更新**: 2025年1月

---
