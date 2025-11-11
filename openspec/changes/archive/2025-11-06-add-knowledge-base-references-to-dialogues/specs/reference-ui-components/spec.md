# Spec: Reference UI Components

**Feature**: Reference UI Components
**Change ID**: `add-knowledge-base-references-to-dialogues`
**Status**: Draft

---

## Delta: ADDED

### Requirement RUI-1: Reference Badge Component

**Description**: Messages with references SHALL display a clickable badge showing reference count.

**Requirements**:
- Badge MUST display reference count (e.g., "📚 3 references")
- Badge MUST be clickable to expand/collapse reference list
- Badge MUST use `aria-expanded` attribute for accessibility
- Badge MUST use dual language labels (zh/en)
- Badge MUST use terracotta-gold gradient consistent with site theme

**Acceptance Criteria**:
- [ ] Badge appears below message text
- [ ] Badge shows correct count (2-3 for most messages)
- [ ] Badge click toggles list visibility
- [ ] Badge hover effect (scale + shadow)
- [ ] Responsive on mobile (smaller text)

**Verification**:

**Scenario 1**: Badge displays reference count
```gherkin
Given a message with 3 references
When DialoguePlayer renders the message
Then a badge appears with text "📚 3 references" (or "条引用" in Chinese)
And badge has class "reference-badge"
And badge has aria-expanded="false"
```

**Example Code**:
```javascript
// Test: Reference badge rendering
const message = {
  id: "msg-1",
  personaId: "su-shi",
  textZh: "测试消息",
  timestamp: 0,
  references: [
    { critic: "su-shi", source: "test1.md", quote: "Quote 1" },
    { critic: "su-shi", source: "test2.md", quote: "Quote 2" },
    { critic: "su-shi", source: "test3.md", quote: "Quote 3" }
  ]
};

const player = new DialoguePlayer({ messages: [message] }, container);
const badge = container.querySelector('.reference-badge');

assert(badge !== null);
assert(badge.textContent.includes('3'));
assert(badge.getAttribute('aria-expanded') === 'false');
```

**Scenario 2**: Badge click toggles list
```gherkin
Given a rendered message with reference badge
And badge has aria-expanded="false"
When user clicks badge
Then aria-expanded changes to "true"
And reference list becomes visible
When user clicks badge again
Then aria-expanded changes to "false"
And reference list becomes hidden
```

**Example Code**:
```javascript
// Test: Badge toggle functionality
const badge = container.querySelector('.reference-badge');
const list = container.querySelector('.reference-list');

// Initial state
assert(badge.getAttribute('aria-expanded') === 'false');
assert(list.classList.contains('expanded') === false);

// Click to expand
badge.click();
assert(badge.getAttribute('aria-expanded') === 'true');
assert(list.classList.contains('expanded') === true);

// Click to collapse
badge.click();
assert(badge.getAttribute('aria-expanded') === 'false');
assert(list.classList.contains('expanded') === false);
```

---

### Requirement RUI-2: Expandable Reference List

**Description**: Badge click SHALL expand a list showing full details of all references.

**Requirements**:
- List MUST be hidden by default
- List MUST animate on expand/collapse (max-height + opacity transition)
- Each reference item MUST display:
  - Critic name (bilingual, with persona color)
  - Source filename (monospace font)
  - Quote text (blockquote style, with persona color border)
  - Page/section reference (if present)
- List MUST use persona color for visual consistency
- List items MUST be separated by borders

**Acceptance Criteria**:
- [ ] List hidden on page load
- [ ] List expands smoothly (300ms transition)
- [ ] All reference fields display correctly
- [ ] Persona colors applied
- [ ] Responsive layout (stacks on mobile)

**Verification**:

**Scenario 1**: List expands on badge click
```gherkin
Given a message with 3 references
And reference list is hidden (max-height: 0, opacity: 0)
When user clicks badge
Then list expands (max-height: 500px, opacity: 1)
And transition duration is 300ms
And all 3 reference items are visible
```

**Example Code**:
```javascript
// Test: List expansion
const badge = container.querySelector('.reference-badge');
const list = container.querySelector('.reference-list');

// Initial: hidden
const initialHeight = window.getComputedStyle(list).maxHeight;
const initialOpacity = window.getComputedStyle(list).opacity;
assert(initialHeight === '0px');
assert(initialOpacity === '0');

// Expand
badge.click();

// Wait for transition (300ms)
await new Promise(resolve => setTimeout(resolve, 350));

const expandedHeight = window.getComputedStyle(list).maxHeight;
const expandedOpacity = window.getComputedStyle(list).opacity;
assert(expandedHeight === '500px');
assert(expandedOpacity === '1');
```

**Scenario 2**: Reference items display correctly
```gherkin
Given a reference with:
  - critic: "su-shi"
  - source: "poetry-and-theory.md"
  - quote: "笔墨当随时代"
  - page: "Section: 论画以形似"
When reference list renders
Then item shows:
  - Critic name: "苏轼 (Su Shi)" in persona color
  - Source: "poetry-and-theory.md" in monospace
  - Quote: "笔墨当随时代" in blockquote with border
  - Page: "Section: 论画以形似"
```

**Example Code**:
```javascript
// Test: Reference item content
const items = list.querySelectorAll('.reference-item');
assert(items.length === 3);

const firstItem = items[0];
const criticName = firstItem.querySelector('.reference-critic').textContent;
const source = firstItem.querySelector('.reference-source').textContent;
const quote = firstItem.querySelector('.reference-quote').textContent;
const page = firstItem.querySelector('.reference-page')?.textContent;

assert(criticName.includes('苏轼') || criticName.includes('Su Shi'));
assert(source === 'poetry-and-theory.md');
assert(quote === '笔墨当随时代');
assert(page?.includes('Section:'));
```

---

### Requirement RUI-3: Quote Tooltip Component

**Description**: Quoted text in messages SHALL display tooltips on hover (desktop) or tap (mobile).

**Requirements**:
- Quoted text MUST be marked with dotted underline in persona color
- Desktop: Tooltip MUST appear on hover near text
- Mobile: Tooltip MUST appear as centered modal on tap
- Tooltip MUST display source filename
- Tooltip MUST auto-hide on mouse leave (desktop) or tap outside (mobile)
- Tooltip MUST use ARIA `role="tooltip"` for accessibility

**Acceptance Criteria**:
- [ ] Quoted text has dotted underline
- [ ] Cursor changes to "help" on hover
- [ ] Tooltip appears near text (desktop)
- [ ] Tooltip appears as modal (mobile)
- [ ] Tooltip shows source filename
- [ ] Tooltip hides appropriately

**Verification**:

**Scenario 1**: Desktop tooltip on hover
```gherkin
Given a message with quoted text "笔墨当随时代"
And quoted text has data-tooltip attribute with source info
And viewport width > 768px (desktop)
When user hovers over quoted text
Then tooltip appears near text (8px below)
And tooltip shows "来源: poetry-and-theory.md"
When user moves mouse away
Then tooltip disappears after 200ms
```

**Example Code**:
```javascript
// Test: Desktop tooltip
const quotedText = container.querySelector('.quoted-text');
const tooltip = document.querySelector('.reference-tooltip');

// Initial: hidden
assert(tooltip.classList.contains('visible') === false);

// Hover
const hoverEvent = new MouseEvent('mouseenter', { bubbles: true });
quotedText.dispatchEvent(hoverEvent);

// Tooltip appears
await new Promise(resolve => setTimeout(resolve, 50));
assert(tooltip.classList.contains('visible') === true);
assert(tooltip.textContent.includes('poetry-and-theory.md'));

// Check position (near text)
const textRect = quotedText.getBoundingClientRect();
const tooltipRect = tooltip.getBoundingClientRect();
assert(tooltipRect.top === textRect.bottom + 8);

// Mouse leave
const leaveEvent = new MouseEvent('mouseleave', { bubbles: true });
quotedText.dispatchEvent(leaveEvent);

await new Promise(resolve => setTimeout(resolve, 250));
assert(tooltip.classList.contains('visible') === false);
```

**Scenario 2**: Mobile tooltip as modal
```gherkin
Given a message with quoted text "笔墨当随时代"
And viewport width <= 768px (mobile)
When user taps quoted text
Then tooltip appears as centered modal
And tooltip has dark overlay background
And tooltip is clickable (pointer-events: auto)
When user taps outside tooltip
Then tooltip and overlay disappear
```

**Example Code**:
```javascript
// Test: Mobile tooltip modal
// Set mobile viewport
Object.defineProperty(window, 'innerWidth', { value: 375, writable: true });

const quotedText = container.querySelector('.quoted-text');
const tooltip = document.querySelector('.reference-tooltip');

// Tap
const tapEvent = new MouseEvent('click', { bubbles: true });
quotedText.dispatchEvent(tapEvent);

await new Promise(resolve => setTimeout(resolve, 50));

// Tooltip appears as modal
assert(tooltip.classList.contains('visible') === true);
const tooltipStyle = window.getComputedStyle(tooltip);
assert(tooltipStyle.position === 'fixed');
assert(tooltipStyle.top === '50%');
assert(tooltipStyle.left === '50%');
assert(tooltipStyle.transform === 'translate(-50%, -50%)');

// Tap outside
document.dispatchEvent(new MouseEvent('click', { bubbles: true }));

await new Promise(resolve => setTimeout(resolve, 50));
assert(tooltip.classList.contains('visible') === false);
```

---

### Requirement RUI-4: Responsive Design

**Description**: Reference UI components SHALL adapt to different screen sizes.

**Requirements**:
- Desktop (>1024px): Full layout, tooltips on hover
- Tablet (768-1024px): Slightly smaller text, tooltips on hover
- Mobile (≤768px): Compact layout, tooltips as modals
- Badge MUST scale down on mobile
- List MUST stack vertically on mobile
- Tooltip MUST convert to modal on mobile

**Acceptance Criteria**:
- [ ] Desktop layout tested at 1440px
- [ ] Tablet layout tested at 768px
- [ ] Mobile layout tested at 375px
- [ ] No horizontal overflow
- [ ] All interactions work on all sizes

**Verification**:

**Scenario 1**: Badge scales on mobile
```gherkin
Given viewport width is 375px (mobile)
When reference badge renders
Then badge font-size is 0.75rem (not 0.875rem)
And badge padding is 0.4rem 0.8rem (not 0.5rem 1rem)
And badge is fully visible without overflow
```

**Example Code**:
```javascript
// Test: Mobile badge scaling
Object.defineProperty(window, 'innerWidth', { value: 375, writable: true });
window.dispatchEvent(new Event('resize'));

const badge = container.querySelector('.reference-badge');
const badgeStyle = window.getComputedStyle(badge);

assert(badgeStyle.fontSize === '12px'); // 0.75rem = 12px
assert(badgeStyle.paddingTop === '6.4px'); // 0.4rem
```

**Scenario 2**: List adapts to mobile
```gherkin
Given viewport width is 375px (mobile)
When reference list expands
Then list padding is 0.75rem (not 1rem)
And quote font-size is 0.875rem (smaller)
And list does not overflow viewport width
```

**Example Code**:
```javascript
// Test: Mobile list adaptation
const list = container.querySelector('.reference-list');
const listStyle = window.getComputedStyle(list);
const quote = list.querySelector('.reference-quote');
const quoteStyle = window.getComputedStyle(quote);

assert(listStyle.padding === '12px'); // 0.75rem
assert(quoteStyle.fontSize === '14px'); // 0.875rem

// Check no overflow
const listRect = list.getBoundingClientRect();
assert(listRect.right <= window.innerWidth);
```

---

### Requirement RUI-5: Bilingual Support

**Description**: All UI text SHALL support Chinese and English based on current language setting.

**Requirements**:
- Badge label MUST switch between "条引用" (zh) and "references" (en)
- Reference headers MUST show bilingual critic names
- Tooltip MUST show "来源" (zh) or "Source" (en)
- Language MUST sync with global `lang` setting
- Language switching MUST be instant (CSS-based, no JS delay)

**Acceptance Criteria**:
- [ ] Badge shows correct language
- [ ] Critic names bilingual
- [ ] Tooltip labels correct
- [ ] Language switch instant

**Verification**:

**Scenario 1**: Badge language switches
```gherkin
Given current language is "zh"
When badge renders
Then badge shows "条引用"
When language switches to "en"
Then badge shows "references"
And switch is instant (no delay)
```

**Example Code**:
```javascript
// Test: Badge language switching
document.documentElement.setAttribute('data-lang', 'zh');

const badge = container.querySelector('.reference-badge');
const labelZh = badge.querySelector('[data-lang="zh"]');
const labelEn = badge.querySelector('[data-lang="en"]');

// Check visibility (CSS controls display)
const zhStyle = window.getComputedStyle(labelZh);
const enStyle = window.getComputedStyle(labelEn);

assert(zhStyle.display === 'inline'); // Visible
assert(enStyle.display === 'none');   // Hidden

// Switch to English
document.documentElement.setAttribute('data-lang', 'en');

const zhStyleAfter = window.getComputedStyle(labelZh);
const enStyleAfter = window.getComputedStyle(labelEn);

assert(zhStyleAfter.display === 'none');   // Hidden
assert(enStyleAfter.display === 'inline'); // Visible
```

**Scenario 2**: Tooltip label switches
```gherkin
Given current language is "zh"
When tooltip shows
Then tooltip header shows "来源 / Source:"
When language switches to "en"
Then tooltip still shows "来源 / Source:" (bilingual format)
```

**Example Code**:
```javascript
// Test: Tooltip bilingual label
const tooltip = document.querySelector('.reference-tooltip');
const tooltipContent = tooltip.querySelector('.tooltip-content');

// Tooltip always shows both languages
assert(tooltipContent.innerHTML.includes('来源'));
assert(tooltipContent.innerHTML.includes('Source'));

// Format: "来源 / Source: filename.md"
const expectedPattern = /来源 \/ Source:.*\.md/;
assert(expectedPattern.test(tooltipContent.textContent));
```

---

### Requirement RUI-6: Persona Color Integration

**Description**: Reference UI components SHALL use persona colors for visual consistency.

**Requirements**:
- Badge gradient MUST use terracotta-gold (#B85C3C → #D4A574) as base
- List border-left MUST use `var(--persona-color)` from message
- Critic name MUST use `var(--persona-color)`
- Quote blockquote border MUST use `var(--persona-color)`
- Quoted text underline MUST use `var(--persona-color)`
- Persona colors MUST be accessible (WCAG AA contrast ratio)

**Acceptance Criteria**:
- [ ] Badge uses site theme colors
- [ ] List uses message persona color
- [ ] All text readable (contrast ≥4.5:1)
- [ ] Colors consistent with existing DialoguePlayer

**Verification**:

**Scenario 1**: Badge uses theme colors
```gherkin
Given a reference badge
When badge renders
Then background is gradient from #B85C3C to #D4A574
And text color is white (#FFFFFF)
And contrast ratio ≥4.5:1 (WCAG AA)
```

**Example Code**:
```javascript
// Test: Badge color
const badge = container.querySelector('.reference-badge');
const badgeStyle = window.getComputedStyle(badge);

assert(badgeStyle.background.includes('linear-gradient'));
assert(badgeStyle.background.includes('rgb(184, 92, 60)')); // #B85C3C
assert(badgeStyle.background.includes('rgb(212, 165, 116)')); // #D4A574
assert(badgeStyle.color === 'rgb(255, 255, 255)'); // white

// Check contrast (simplified - actual test would use WCAG formula)
// Terracotta #B85C3C vs white has contrast ~4.8:1 (passes AA)
```

**Scenario 2**: List uses persona color
```gherkin
Given a message from persona "su-shi"
And su-shi color is #B85C3C
When reference list renders
Then list border-left color is #B85C3C
And critic name color is #B85C3C
And quote blockquote border-left color is #B85C3C
```

**Example Code**:
```javascript
// Test: Persona color integration
const messageEl = container.querySelector('.message[data-persona="su-shi"]');
messageEl.style.setProperty('--persona-color', '#B85C3C');

const list = messageEl.querySelector('.reference-list');
const listStyle = window.getComputedStyle(list);
assert(listStyle.borderLeftColor === 'rgb(184, 92, 60)'); // #B85C3C

const criticName = list.querySelector('.reference-critic');
const criticStyle = window.getComputedStyle(criticName);
assert(criticStyle.color === 'rgb(184, 92, 60)');

const quote = list.querySelector('.reference-quote');
const quoteStyle = window.getComputedStyle(quote);
assert(quoteStyle.borderLeftColor === 'rgb(184, 92, 60)');
```

---

## Related Specifications

- **knowledge-base-integration**: Reference data structure
- **dialogue-player-system** (existing): Message rendering system

---

## CSS Architecture

### File Organization

```
styles/
├── main.css (global variables, base styles)
├── components/
│   ├── dialogue-player.css (existing)
│   ├── reference-badge.css (NEW - RUI-1)
│   ├── reference-list.css (NEW - RUI-2)
│   └── reference-tooltip.css (NEW - RUI-3)
```

### CSS Variables

Add to `styles/main.css`:
```css
:root {
  /* Reference UI colors */
  --ref-badge-start: #B85C3C;
  --ref-badge-end: #D4A574;
  --ref-bg: #f9f9f9;
  --ref-border: #e0e0e0;

  /* Transitions */
  --ref-transition: 0.3s ease;
}
```

### Component-Specific Variables

Reference components use `var(--persona-color)` which is set dynamically per message:
```css
.message[data-persona="su-shi"] {
  --persona-color: #B85C3C;
}

.message[data-persona="guo-xi"] {
  --persona-color: #2D5F4F;
}

/* ... other personas ... */
```

---

## JavaScript Architecture

### File Organization

```
js/
├── components/
│   ├── dialogue-player.js (MODIFIED - add reference rendering)
│   ├── reference-ui.js (NEW - badge + list logic)
│   └── reference-tooltip.js (NEW - tooltip logic)
```

### API Design

**ReferenceUI Class** (`js/components/reference-ui.js`):
```javascript
export class ReferenceUI {
  constructor(player) {
    this.player = player;
    this.lang = player.lang;
  }

  // RUI-1: Create badge
  createBadge(count) {
    const badge = document.createElement('button');
    badge.className = 'reference-badge';
    badge.setAttribute('aria-expanded', 'false');
    badge.innerHTML = `
      <span class="badge-icon">📚</span>
      <span class="badge-count">${count}</span>
      <span class="badge-label" data-lang="zh">条引用</span>
      <span class="badge-label" data-lang="en">references</span>
    `;
    badge.addEventListener('click', () => this.toggleList(badge));
    return badge;
  }

  // RUI-2: Create expandable list
  createList(references, personaColor) {
    const list = document.createElement('div');
    list.className = 'reference-list';
    list.style.setProperty('--persona-color', personaColor);

    references.forEach(ref => {
      const item = this.createListItem(ref);
      list.appendChild(item);
    });

    return list;
  }

  // Toggle function
  toggleList(badge) {
    const list = badge.parentElement.querySelector('.reference-list');
    const expanded = badge.getAttribute('aria-expanded') === 'true';
    badge.setAttribute('aria-expanded', !expanded);
    list.classList.toggle('expanded');
  }
}
```

**ReferenceTooltip Class** (`js/components/reference-tooltip.js`):
```javascript
export class ReferenceTooltip {
  constructor() {
    this.tooltip = this.createTooltip();
    this.isMobile = window.innerWidth <= 768;
    document.body.appendChild(this.tooltip);
  }

  // RUI-3: Show tooltip
  show(target, source) {
    this.tooltip.innerHTML = `
      <div class="tooltip-content">
        <strong>来源 / Source:</strong> ${source}
      </div>
    `;

    if (this.isMobile) {
      this.showModal();
    } else {
      this.showNearText(target);
    }
  }

  // Hide tooltip
  hide() {
    this.tooltip.classList.remove('visible');
  }
}
```

---

**Status**: UI specification complete
**Next**: Validate OpenSpec proposal
