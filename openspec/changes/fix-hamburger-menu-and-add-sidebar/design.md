# Design: Fix Hamburger Menu and Add Sidebar Navigation

## Architecture Decisions

### ADR-1: Centralized Event Handling vs Distributed Scripts

**Decision**: 移除所有子页面内联脚本，由 `navigation.js` 统一管理事件。

**Alternatives Considered**:
- **Option A**: 移除内联脚本，中心化管理 (selected)
- **Option B**: 保留内联脚本，添加去重逻辑 (rejected)
- **Option C**: 使用事件委托模式 (rejected)

**Rationale**:
- Option A 最符合 DRY 原则（Don't Repeat Yourself）
- `NavigationHandler` 类已完整实现所需功能
- 减少代码重复，降低维护成本
- 避免事件监听器冲突导致的难以调试的问题

**Evidence of Current Duplication**:
```javascript
// js/navigation.js (lines 29-32)
this.menuToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  this.toggleMenu();
});

// pages/about.html (lines 151-155) - DUPLICATE
menuToggle.addEventListener('click', () => {
  const isOpen = !floatingMenu.hasAttribute('hidden');
  floatingMenu[isOpen ? 'setAttribute' : 'removeAttribute']('hidden', '');
  menuToggle.setAttribute('aria-expanded', !isOpen);
});
```

**Consequences**:
- ✅ Single source of truth for navigation logic
- ✅ Easier to debug and maintain
- ✅ Consistent behavior across all pages
- ⚠️ Requires removing 80+ lines of duplicate code from 3 files

---

### ADR-2: Sidebar Animation Technique

**Decision**: 使用 `transform: translateX()` 而非 `left` 属性实现滑出动画。

**Alternatives Considered**:
- **Option A**: `transform: translateX()` (selected)
- **Option B**: `left: -300px` → `left: 0` (rejected)
- **Option C**: `margin-left: -300px` → `margin-left: 0` (rejected)

**Rationale**:
- Option A 触发 GPU 加速，性能最优
- `transform` 只影响 composite 层，不触发 reflow/repaint
- `left` 和 `margin` 会触发 layout，导致性能问题

**Performance Comparison**:
| Property | Triggers | 60fps at | GPU Accelerated |
|----------|----------|----------|-----------------|
| transform | Composite | ✅ Yes | ✅ Yes |
| left | Layout → Paint → Composite | ❌ No | ❌ No |
| margin | Layout → Paint → Composite | ❌ No | ❌ No |

**Implementation**:
```css
.floating-menu {
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.floating-menu:not([hidden]) {
  transform: translateX(0);
}
```

**Consequences**:
- ✅ 60fps 流畅动画
- ✅ 移动设备性能优化
- ✅ 符合 Material Design 动画曲线

---

### ADR-3: Overlay Implementation Strategy

**Decision**: 添加独立的 `.menu-overlay` 元素而非使用伪元素 `::before`。

**Alternatives Considered**:
- **Option A**: 独立 `<div class="menu-overlay"></div>` (selected)
- **Option B**: `.floating-menu::before` 伪元素 (rejected)
- **Option C**: `<body>` 直接添加背景遮罩 (rejected)

**Rationale**:
- Option A 提供更好的控制和可访问性
- 伪元素难以管理点击事件
- 独立元素可以正确处理 z-index 层级

**HTML Structure**:
```html
<!-- Hamburger button -->
<button class="hamburger" id="menu-toggle">...</button>

<!-- Overlay (behind sidebar) -->
<div class="menu-overlay" id="menu-overlay"></div>

<!-- Sidebar (above overlay) -->
<nav class="floating-menu" id="floating-menu">...</nav>
```

**Z-Index Stack**:
```
Content:          z-index: 1
Overlay:          z-index: var(--z-menu) - 1 = 999
Sidebar:          z-index: var(--z-menu) = 1000
```

**Consequences**:
- ✅ 清晰的层级关系
- ✅ 容易管理点击事件
- ✅ 更好的可访问性（overlay 可以有 ARIA 属性）
- ⚠️ 需要在所有页面添加 overlay 元素

---

### ADR-4: Sidebar Width Sizing Strategy

**Decision**: 使用固定宽度 `300px`，移动端使用 `min(300px, 90vw)`。

**Alternatives Considered**:
- **Option A**: Fixed 300px + responsive `min()` (selected)
- **Option B**: Fixed 25vw (rejected)
- **Option C**: Fixed 280px (rejected)
- **Option D**: Variable width based on content (rejected)

**Rationale**:
- 300px 符合用户选择的"中等侧边栏（280-320px）"
- `min(300px, 90vw)` 确保小屏幕不溢出
- 固定宽度提供一致的用户体验
- 可预测的布局计算

**Responsive Breakpoints**:
```css
.floating-menu {
  width: min(300px, 90vw);
}

/* Mobile (< 768px): 90vw (最大 300px) */
@media (max-width: 767px) {
  .floating-menu {
    width: min(300px, 90vw);
  }
}

/* Tablet & Desktop (>= 768px): 固定 300px */
@media (min-width: 768px) {
  .floating-menu {
    width: 300px;
  }
}
```

**Consequences**:
- ✅ 小屏幕留出 10vw 空间给遮罩
- ✅ 一致的视觉宽度
- ⚠️ 未来如果菜单项增多可能需要调整

---

### ADR-5: Menu Close Interaction Pattern

**Decision**: 保持现有的多种关闭方式（点击外部、Escape 键、点击菜单项）。

**Alternatives Considered**:
- **Option A**: 多种关闭方式（点击外部 + Escape + 菜单项） (selected)
- **Option B**: 仅点击关闭按钮 (rejected)
- **Option C**: 仅点击外部 (rejected)

**Rationale**:
- 提供多种关闭方式符合用户习惯
- 现有代码已实现所有交互
- 符合 WCAG 2.1 可访问性最佳实践

**Interaction Map**:
```
用户操作                    → 触发函数           → 结果
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
点击汉堡按钮                → toggleMenu()       → 切换菜单状态
点击遮罩 (overlay)          → closeMenu()        → 关闭菜单
点击菜单外部 (document)     → closeMenu()        → 关闭菜单
按 Escape 键                → closeMenu()        → 关闭菜单
点击菜单项链接 (mobile)     → closeMenu()        → 关闭菜单 + 导航
```

**Code Implementation**:
```javascript
// Overlay click
this.menuOverlay.addEventListener('click', () => {
  this.closeMenu();
});

// Document click (outside menu)
document.addEventListener('click', (e) => {
  if (!this.menuDrawer.contains(e.target) &&
      !this.menuToggle.contains(e.target)) {
    this.closeMenu();
  }
});

// Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !this.menuDrawer.hasAttribute('hidden')) {
    this.closeMenu();
  }
});
```

**Consequences**:
- ✅ 用户体验友好
- ✅ 符合可访问性标准
- ✅ 代码已实现，只需添加 overlay 监听

---

## Technical Design

### Component Architecture

```
┌─────────────────────────────────────────┐
│          Page Container                 │
│  ┌───────────────────────────────────┐  │
│  │  Hamburger Button (#menu-toggle)  │  │ z-index: auto
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │     Content Area                  │  │ z-index: 1
│  │  (Gallery, Critics, etc.)         │  │
│  └───────────────────────────────────┘  │
│                                         │
│  When menu opens:                       │
│  ┌───────────────────────────────────┐  │
│  │  Overlay (.menu-overlay)          │  │ z-index: 999
│  │  - Semi-transparent black         │  │
│  │  - Full viewport coverage         │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌─────────────────┐                    │
│  │  Sidebar        │                    │ z-index: 1000
│  │  (.floating     │                    │
│  │   -menu)        │                    │
│  │  - 300px wide   │                    │
│  │  - Full height  │                    │
│  │  - Slides from  │                    │
│  │    left         │                    │
│  └─────────────────┘                    │
└─────────────────────────────────────────┘
```

---

### State Machine

```
┌──────────────┐
│ Menu Closed  │ ◄──────────────┐
│ (Initial)    │                │
└──────┬───────┘                │
       │                        │
       │ Click hamburger        │
       │ button                 │
       ▼                        │
┌──────────────┐                │
│ Menu Opening │                │
│ (Animating)  │                │
└──────┬───────┘                │
       │                        │
       │ 300ms transition       │
       ▼                        │
┌──────────────┐                │
│  Menu Open   │                │
│  (Visible)   │                │
└──────┬───────┘                │
       │                        │
       │ Click overlay          │
       │ OR Escape key          │
       │ OR click outside       │
       │ OR click menu item     │
       ▼                        │
┌──────────────┐                │
│ Menu Closing │                │
│ (Animating)  │────────────────┘
└──────────────┘
   300ms transition
```

**State Properties**:
| State | `hidden` attribute | `transform` | Overlay visible | `aria-expanded` |
|-------|-------------------|-------------|-----------------|-----------------|
| Closed | present | `translateX(-100%)` | No | `false` |
| Opening | removed | animating | Fading in | `true` |
| Open | absent | `translateX(0)` | Yes | `true` |
| Closing | added | animating | Fading out | `false` |

---

### CSS Implementation Details

#### Sidebar Base Styles
```css
.floating-menu {
  /* Positioning */
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: min(300px, 90vw);

  /* Layering */
  z-index: var(--z-menu);

  /* Appearance */
  background: white;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.15);

  /* Animation */
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* Layout */
  overflow-y: auto;
  padding: var(--spacing-lg) 0;
}

/* Open state */
.floating-menu:not([hidden]) {
  transform: translateX(0);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .floating-menu {
    background: #2a2a2a;
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.3);
  }
}
```

#### Overlay Styles
```css
.menu-overlay {
  /* Positioning */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  /* Layering */
  z-index: calc(var(--z-menu) - 1);

  /* Appearance */
  background: rgba(0, 0, 0, 0.5);

  /* Animation */
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

/* Active state (when menu is open) */
.menu-overlay.active {
  opacity: 1;
  pointer-events: all;
}
```

#### Menu Content Layout
```css
.menu-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: 0 var(--spacing-md);
}

.menu-item {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.menu-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.menu-item.active {
  background: var(--color-primary);
  color: white;
}
```

---

### JavaScript Implementation Plan

#### Updated NavigationHandler Class

```javascript
class NavigationHandler {
  constructor() {
    this.menuToggle = document.getElementById('menu-toggle');
    this.menuDrawer = document.getElementById('floating-menu');
    this.menuOverlay = document.getElementById('menu-overlay'); // NEW
    this.menuItems = document.querySelectorAll('.menu-item');
  }

  init() {
    if (!this.menuToggle || !this.menuDrawer || !this.menuOverlay) {
      console.warn('[Navigation] Required elements not found');
      return;
    }

    this.bindEvents();
    this.highlightCurrentPage();
    console.log('[Navigation] Handler initialized');
  }

  bindEvents() {
    // Hamburger button
    this.menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMenu();
    });

    // Overlay click
    this.menuOverlay.addEventListener('click', () => {
      this.closeMenu();
    });

    // Menu items
    this.menuItems.forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth < 768) {
          this.closeMenu();
        }
      });
    });

    // Click outside
    document.addEventListener('click', (e) => {
      if (this.menuDrawer.hasAttribute('hidden')) return;
      if (!this.menuDrawer.contains(e.target) &&
          !this.menuToggle.contains(e.target)) {
        this.closeMenu();
      }
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    if (this.menuDrawer.hasAttribute('hidden')) {
      this.openMenu();
    } else {
      this.closeMenu();
    }
  }

  openMenu() {
    this.menuDrawer.removeAttribute('hidden');
    this.menuOverlay.classList.add('active'); // NEW
    this.menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Prevent scroll (optional)
  }

  closeMenu() {
    this.menuDrawer.setAttribute('hidden', '');
    this.menuOverlay.classList.remove('active'); // NEW
    this.menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = ''; // Restore scroll
  }

  // ... existing highlightCurrentPage() and isCurrentPage() methods
}
```

---

### Accessibility Enhancements

#### ARIA Attributes

```html
<!-- Hamburger Button -->
<button
  class="hamburger"
  id="menu-toggle"
  aria-label="打开菜单"
  aria-expanded="false"
  aria-controls="floating-menu">
  <span></span>
  <span></span>
  <span></span>
</button>

<!-- Overlay -->
<div
  class="menu-overlay"
  id="menu-overlay"
  aria-hidden="true">
</div>

<!-- Sidebar -->
<nav
  class="floating-menu"
  id="floating-menu"
  role="navigation"
  aria-label="主导航菜单"
  hidden>
  <ul class="menu-items">
    <li>
      <a href="/" class="menu-item" aria-current="page">
        主画廊
      </a>
    </li>
    <!-- ... -->
  </ul>
</nav>
```

#### Focus Management

```javascript
openMenu() {
  this.menuDrawer.removeAttribute('hidden');
  this.menuOverlay.classList.add('active');
  this.menuToggle.setAttribute('aria-expanded', 'true');

  // Focus first menu item
  const firstMenuItem = this.menuDrawer.querySelector('.menu-item');
  if (firstMenuItem) {
    firstMenuItem.focus();
  }
}

closeMenu() {
  this.menuDrawer.setAttribute('hidden', '');
  this.menuOverlay.classList.remove('active');
  this.menuToggle.setAttribute('aria-expanded', 'false');

  // Return focus to hamburger button
  this.menuToggle.focus();
}
```

---

## Performance Considerations

### Animation Performance

**Target**: 60fps (16.67ms per frame)

**Optimizations**:
1. **Use GPU-accelerated properties**:
   - `transform: translateX()`
   - `opacity`
   - Avoid `left`, `margin`, `width` during animation

2. **will-change hint** (optional):
   ```css
   .floating-menu {
     will-change: transform;
   }
   ```
   注意：只在动画开始时添加，结束后移除

3. **Reduce repaints**:
   - Use `transform` for positioning
   - Avoid changing layout properties

**Measurement**:
```javascript
// Performance monitoring
const startTime = performance.now();
this.openMenu();
requestAnimationFrame(() => {
  const endTime = performance.now();
  console.log(`Menu animation: ${endTime - startTime}ms`);
});
```

---

### Memory Management

**Prevent Memory Leaks**:
1. 不要在动画回调中创建新对象
2. 使用 `addEventListener` 的 `{ once: true }` 选项（如需）
3. 避免在循环中创建闭包

**Event Listener Cleanup** (if needed for SPA migration):
```javascript
destroy() {
  // Remove all event listeners
  this.menuToggle.removeEventListener('click', this.handleToggle);
  this.menuOverlay.removeEventListener('click', this.handleOverlayClick);
  document.removeEventListener('click', this.handleOutsideClick);
  document.removeEventListener('keydown', this.handleEscape);
}
```

---

## Testing Strategy

### Unit Tests (Manual)

1. **Event Binding**:
   - Verify no duplicate listeners after page load
   - Check console for errors

2. **State Transitions**:
   - Closed → Opening → Open
   - Open → Closing → Closed

3. **ARIA Attributes**:
   - `aria-expanded` syncs with menu state
   - `aria-hidden` on overlay

### Integration Tests

1. **Cross-Page Navigation**:
   - Open menu on page A
   - Click link to page B
   - Verify menu works on page B

2. **Responsive Behavior**:
   - Test sidebar width at 375px, 768px, 1024px, 1440px
   - Verify overlay coverage

### Accessibility Tests

1. **Keyboard Navigation**:
   - Tab through all menu items
   - Press Escape to close

2. **Screen Reader**:
   - Test with NVDA (Windows)
   - Test with VoiceOver (Mac)

3. **Focus Management**:
   - Opening menu focuses first item
   - Closing menu returns focus to button

---

## Migration Path

### Rollout Plan

**Phase 1: Fix Duplication** (Low Risk)
- Remove inline scripts from subpages
- Test menu functionality
- Deploy to production

**Phase 2: Add Sidebar Styles** (Medium Risk)
- Update CSS for sidebar layout
- Add overlay element to HTML
- Test animations and interactions

**Phase 3: Polish & Optimize** (Low Risk)
- Fine-tune animation timing
- Add accessibility enhancements
- Performance optimization

### Rollback Strategy

If issues arise, revert by:
1. Restore inline scripts in subpages (temporary fix)
2. Revert CSS changes (restore floating menu styles)
3. Remove overlay elements from HTML

**Rollback Time**: < 10 minutes

---

## Future Enhancements

### Phase 2: Desktop Fixed Sidebar (Optional)

```css
@media (min-width: 1440px) {
  .floating-menu {
    transform: translateX(0);
    position: relative;
    height: auto;
  }

  .menu-overlay {
    display: none;
  }

  .hamburger {
    display: none;
  }

  .page-content {
    margin-left: 300px;
  }
}
```

### Phase 3: Sidebar Theming

Support custom themes:
- Light theme (default)
- Dark theme
- High contrast theme

### Phase 4: Menu Animation Variants

- Slide from right
- Fade + scale
- Push content (rather than overlay)
