# Unify Homepage Navigation Style with Exhibition Pages

**Status:** Draft
**Created:** 2025-11-11
**Author:** Claude (based on user requirements)

---

## Why

The current navigation system is inconsistent across the site:
- **Homepage** (`/`): Uses right-side horizontal navigation bar with visible links on desktop
- **Exhibition pages** (`/exhibitions/*`): Uses left-side hamburger menu with collapsible floating menu

This inconsistency creates a fragmented user experience. Users must learn two different navigation patterns when moving between pages.

**User Impact**: Unifying the navigation to use the hamburger menu style across all pages will provide a consistent, recognizable interaction pattern throughout the site.

---

## Problem Statement

### Current State

**Homepage Navigation** (`GlobalNavigation` component):
```
┌─────────────────────────────────────────────┐
│ VULCA          [Home][Archive][Critics]... │ ← Horizontal nav bar (right)
└─────────────────────────────────────────────┘
```
- Navigation links visible on desktop
- Hamburger menu only on mobile
- Located in right side of header

**Exhibition Page Navigation** (`header-minimal` + `floating-menu`):
```
┌─────────────────────────────────────────────┐
│ ☰ (hamburger)                   EN/中 │ ← Left hamburger + Right lang
└─────────────────────────────────────────────┘
```
- Hamburger menu on all screen sizes
- Located in left side of header
- Collapsible floating menu overlay

### User Requirements

User explicitly requested: "把主页面的右上角的导航栏，换成和子页面一致的左上角的汉堡折叠导航栏"
- Replace homepage's right-side navigation bar with exhibition page's left-side hamburger menu
- Maintain consistent navigation UX across all pages

---

## Proposed Solution

### Unified Navigation System

Replace `GlobalNavigation` component with `MinimalHeader` + `FloatingMenu` pattern on homepage:

```
All Pages (Homepage + Exhibition Pages):
┌─────────────────────────────────────────────┐
│ ☰                               EN/中 │
└─────────────────────────────────────────────┘
    ↓ (click hamburger)
┌─────────────────┐
│ 🏠 主页         │
│ 📚 展览归档     │
│ 👥 评论家       │
│ ℹ️ 关于         │
│ 🎨 过程         │
└─────────────────┘
```

**Key Design Decisions:**
1. **Reuse Existing Components**: Use `header-minimal` and `floating-menu` HTML/CSS from exhibition pages (no new components needed)
2. **Consistent Positioning**: Hamburger button always in top-left, language toggle in top-right
3. **Shared Styles**: Use existing CSS from exhibition pages (`styles/main.css`)
4. **Deprecate GlobalNavigation**: Remove `shared/js/global-navigation.js` and `shared/styles/global-navigation.css` (no longer needed)

---

## What Changes

### Modified Files

1. **`index.html`** (~30 lines changed)
   - Remove: `<link>` to `shared/styles/global-navigation.css`
   - Remove: `<script>` to `shared/js/global-navigation.js`
   - Add: `<link>` to `styles/main.css` (contains `header-minimal` and `floating-menu` styles)
   - Add: `<header class="header-minimal">` with hamburger button and language toggle
   - Add: `<nav class="floating-menu">` with navigation links
   - Add: Inline `<script>` for hamburger menu toggle (same as exhibition pages)

2. **`styles/main.css`** (no changes needed)
   - Already contains `.header-minimal`, `.floating-menu`, `.hamburger` styles
   - Already contains responsive breakpoints and animations

### Deprecated Files (Optional Cleanup)

These files will no longer be used after the change:
- `shared/js/global-navigation.js` (replaced by inline script in `index.html`)
- `shared/styles/global-navigation.css` (replaced by `styles/main.css`)

**Note**: We won't delete these files immediately to avoid breaking other pages that might still reference them. They can be removed in a future cleanup task.

---

## Why This Approach

### Alternative 1: Update GlobalNavigation Component

**Rejected** - Overengineering. The hamburger menu is simple enough to implement inline (15 lines of JavaScript). Creating a shared component adds unnecessary abstraction.

### Alternative 2: Keep Different Navigation Styles

**Rejected** - Violates user's explicit requirement for consistency. Multiple navigation patterns confuse users.

### Alternative 3: Make Exhibition Pages Use Horizontal Nav

**Rejected** - Hamburger menu is better for exhibition pages (minimal UI, more screen space for content). Horizontal nav would clutter the immersive exhibition experience.

---

## Success Criteria

1. ✅ Homepage displays hamburger menu in top-left corner
2. ✅ Clicking hamburger opens floating menu with 5 navigation links
3. ✅ Language toggle remains in top-right corner
4. ✅ Navigation behavior identical to exhibition pages
5. ✅ No console errors or broken functionality
6. ✅ Responsive design works on mobile/tablet/desktop
7. ✅ Visual consistency between homepage and exhibition pages

---

## Migration Path

**For Developers:**
1. Pull latest changes
2. Test homepage: hamburger menu should work identically to exhibition pages
3. Verify language toggle still functions correctly
4. Test on mobile, tablet, desktop viewports

**For Users:**
- No action needed - navigation pattern becomes more consistent and predictable

---

## Open Questions

None - This is a straightforward UI consistency fix with clear requirements.

---

## Related Changes

- Depends on: None
- Blocks: None
- Related to: `rebuild-interactive-exhibition-platform` (broader navigation system, but different scope)
