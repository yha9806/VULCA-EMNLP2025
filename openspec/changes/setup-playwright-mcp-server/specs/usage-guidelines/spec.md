# Spec: Playwright MCP Usage Guidelines

**Capability:** `usage-guidelines`
**Change:** `setup-playwright-mcp-server`

## ADDED Requirements

### Requirement: Users SHALL Test VULCA Homepage
**ID:** `USE-001`

Users SHALL be able to test VULCA homepage immersive gallery using Playwright MCP.

#### Scenario: Navigate to homepage and verify scroll prevention
**Given** VULCA local dev server is running at `http://localhost:9999`
**When** user navigates browser to homepage
**Then** page loads without errors
**And** scroll is disabled (immersive mode active)
**And** 4 artwork placeholders are visible

**Usage Example:**
```
User: "Use Playwright MCP to test the VULCA homepage at localhost:9999.
       Verify scroll is disabled and all artwork placeholders render correctly."

Claude Code Steps:
1. mcp__playwright__browser_navigate("http://localhost:9999")
2. mcp__playwright__browser_snapshot() → Check page structure
3. mcp__playwright__browser_evaluate("() => {
     return window.IMMERSIVE_MODE === true
   }") → Verify immersive mode
4. mcp__playwright__browser_console_messages() → Check for errors
5. Report findings
```

**Validation:**
- Page title is "VULCA"
- `window.IMMERSIVE_MODE` is `true`
- No JavaScript errors in console
- 4 artwork elements present in DOM

### Requirement: Users SHALL Test Navigation System
**ID:** `USE-002`

Users SHALL be able to test VULCA navigation menu functionality.

#### Scenario: Test hamburger menu open/close
**Given** browser is at VULCA homepage
**When** user clicks hamburger menu button (☰)
**Then** menu opens with 4 links + 2 buttons visible
**And** clicking any link navigates to correct page
**And** back button (←) returns to homepage

**Usage Example:**
```
User: "Test the VULCA hamburger menu navigation flow."

Claude Code Steps:
1. mcp__playwright__browser_snapshot() → Get initial state
2. mcp__playwright__browser_click(element="hamburger menu", ref="...")
3. mcp__playwright__browser_snapshot() → Verify menu opened
4. mcp__playwright__browser_click(element="Critics link", ref="...")
5. mcp__playwright__browser_wait_for(text="评论家")
6. Verify URL changed to /pages/critics.html
7. mcp__playwright__browser_click(element="back button", ref="...")
8. Verify returned to homepage
```

**Validation:**
- Menu toggles open/closed on button click
- All navigation links work
- Back button returns to previous page
- Menu auto-closes on mobile after clicking link

### Requirement: Users SHALL Test Responsive Design
**ID:** `USE-003`

Users SHALL be able to test VULCA site across multiple viewport sizes.

#### Scenario: Test responsive breakpoints
**Given** browser is at VULCA homepage
**When** user resizes viewport to standard breakpoints
**Then** layout adapts correctly without breaking
**And** all interactive elements remain accessible

**Standard Breakpoints:**
- Mobile: 375px width
- Tablet: 768px width
- Desktop: 1024px width
- Large Desktop: 1440px width
- Extra Large: 1920px width

**Usage Example:**
```
User: "Test VULCA responsive design at all breakpoints."

Claude Code Steps:
1. For each breakpoint (375, 768, 1024, 1440, 1920):
   a. mcp__playwright__browser_resize(width=X, height=800)
   b. mcp__playwright__browser_take_screenshot(filename=`vulca-${X}px.png`)
   c. mcp__playwright__browser_snapshot() → Check layout
   d. Verify no overflow/broken layout
2. Report findings with screenshots
```

**Validation:**
- No horizontal scrollbars appear
- Text remains readable (no overflow)
- Interactive elements remain clickable
- Images/placeholders maintain aspect ratio

### Requirement: Users SHALL Test Language Switch
**ID:** `USE-004`

Users SHALL be able to test VULCA bilingual content switching.

#### Scenario: Toggle between Chinese and English
**Given** browser is at any VULCA page
**When** user clicks language toggle button
**Then** content switches between ZH/EN
**And** language preference persists across page navigation
**And** `localStorage` contains `preferredLanguage` setting

**Usage Example:**
```
User: "Test VULCA language switching functionality."

Claude Code Steps:
1. mcp__playwright__browser_navigate("http://localhost:9999")
2. mcp__playwright__browser_snapshot() → Check initial language
3. mcp__playwright__browser_click(element="language toggle", ref="...")
4. mcp__playwright__browser_wait_for(textGone="中文内容示例")
5. mcp__playwright__browser_evaluate("() => localStorage.getItem('preferredLanguage')")
6. Navigate to critics page, verify language persists
7. Report findings
```

**Validation:**
- Initial language is Chinese (default)
- Toggle switches to English
- `localStorage.preferredLanguage` updates
- Language persists across page navigation
- Hero titles, chart labels, persona names all switch

### Requirement: Users SHALL Test RPAIT Charts
**ID:** `USE-005`

Users SHALL be able to test RPAIT radar chart and matrix rendering.

#### Scenario: Verify charts render on critics page
**Given** browser navigates to `/pages/critics.html`
**When** page loads completely
**Then** 6 critic cards are visible
**And** each card contains radar chart with 5 dimensions
**And** comparison matrix renders below cards

**Usage Example:**
```
User: "Test RPAIT charts on the critics page."

Claude Code Steps:
1. mcp__playwright__browser_navigate("http://localhost:9999/pages/critics.html")
2. mcp__playwright__browser_wait_for(time=2) → Wait for Chart.js
3. mcp__playwright__browser_snapshot() → Check structure
4. mcp__playwright__browser_evaluate("() => {
     const canvases = document.querySelectorAll('canvas');
     return { count: canvases.length,
              hasRadar: !!document.querySelector('.radar-chart'),
              hasMatrix: !!document.querySelector('.matrix-chart') };
   }")
5. mcp__playwright__browser_take_screenshot(filename="rpait-charts.png")
6. Report findings
```

**Validation:**
- 6 radar charts render (one per critic)
- 1 comparison matrix renders
- No JavaScript errors related to Chart.js
- Charts are visually correct (no empty/broken charts)

### Requirement: Users SHALL Test Artwork Placeholders
**ID:** `USE-006`

Users SHALL be able to verify artwork placeholder system works correctly.

#### Scenario: Verify placeholders display when images missing
**Given** artwork image files do not exist in `/assets`
**When** browser loads homepage
**Then** colored gradient placeholders appear
**And** each placeholder shows artwork metadata
**And** console logs "⚠ Image not found" warnings

**Usage Example:**
```
User: "Verify the artwork placeholder system is working."

Claude Code Steps:
1. mcp__playwright__browser_navigate("http://localhost:9999")
2. mcp__playwright__browser_console_messages() → Check for "Image not found" warnings
3. mcp__playwright__browser_snapshot() → Check for .artwork-placeholder elements
4. mcp__playwright__browser_evaluate("() => {
     const placeholders = document.querySelectorAll('.artwork-placeholder');
     return Array.from(placeholders).map(p => ({
       id: p.className.match(/artwork-\\d/)[0],
       hasTitle: !!p.querySelector('.placeholder-title'),
       hasArtist: !!p.querySelector('.placeholder-meta')
     }));
   }")
5. mcp__playwright__browser_take_screenshot(filename="placeholders.png")
6. Report findings
```

**Validation:**
- 4 placeholders present (one per artwork)
- Each has unique gradient background
- Each displays: titleZh, titleEn, artist, year
- Console warnings logged for missing images
- Placeholders maintain 3:2 aspect ratio

### Requirement: Users SHALL Test Production Site
**ID:** `USE-007`

Users SHALL be able to test deployed production site at vulcaart.art.

#### Scenario: Verify production deployment works correctly
**Given** site is deployed to https://vulcaart.art
**When** user navigates browser to production URL
**Then** site loads without errors
**And** all functionality works same as local development
**And** assets load from correct CDN/GitHub Pages paths

**Usage Example:**
```
User: "Test the production VULCA site at vulcaart.art."

Claude Code Steps:
1. mcp__playwright__browser_navigate("https://vulcaart.art")
2. mcp__playwright__browser_wait_for(text="VULCA")
3. mcp__playwright__browser_network_requests() → Check for 404s
4. mcp__playwright__browser_console_messages(onlyErrors=true)
5. Perform smoke tests:
   - Click hamburger menu
   - Navigate to critics page
   - Toggle language
   - Take screenshots
6. Report findings
```

**Validation:**
- No 404 errors for CSS/JS/assets
- No JavaScript errors
- Page load time < 3 seconds
- All links work (no broken links)
- Site matches local development behavior

## MODIFIED Requirements

None (new capability)

## REMOVED Requirements

None (new capability)

## Dependencies

- **Internal**: Verification capability (browser must be functional)
- **Internal**: VULCA site running (either localhost:9999 or vulcaart.art)
- **External**: Network connectivity for production testing

## Best Practices

### Efficient Testing Workflow

1. **Start with Snapshot**: Always take snapshot before interactions
2. **Wait for Stability**: Use `wait_for` before assertions
3. **Check Console**: Always check for JavaScript errors
4. **Take Screenshots**: Capture visual evidence of issues
5. **Clean Up**: Close browser between test sessions

### Error Handling

- If interaction fails, retake snapshot (references expire)
- If page doesn't load, check network requests for 404s/500s
- If charts don't render, wait 2-3 seconds for Chart.js
- If language switch fails, check localStorage and `langchange` event

### Performance Tips

- Use headed mode for debugging (see browser)
- Use headless mode for batch testing (faster)
- Close browser between unrelated test sessions
- Limit concurrent tabs to 1-3

## Common Tasks Quick Reference

```bash
# Basic navigation
"Navigate to VULCA homepage using Playwright"

# Interactive testing
"Click the hamburger menu and verify it opens"

# Visual testing
"Take screenshots at all responsive breakpoints"

# Debugging
"Show console errors and network requests"

# Language testing
"Switch language to English and verify content updates"

# Chart testing
"Navigate to critics page and verify all charts render"

# Full smoke test
"Run a full smoke test of VULCA: homepage, navigation,
 critics page, language switch, responsive design"
```

## Notes

- All examples assume VULCA site is running (local or production)
- Playwright MCP tools are prefixed with `mcp__playwright__`
- Element references from snapshots expire after DOM changes
- Screenshots are saved to current directory unless path specified
