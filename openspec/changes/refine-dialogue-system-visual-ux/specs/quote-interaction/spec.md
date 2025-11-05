# Spec: Quote Interaction Enhancement

**Change ID**: `refine-dialogue-system-visual-ux`
**Capability**: Quote Interaction Enhancement
**Status**: Proposed

---

## Overview

Replace always-visible quote blocks with interactive quote references: hover to show on desktop, click to show popup on mobile.

**User Request**:
> "引文可以再减小一点，pc端可以鼠标悬停，然后展示，手机端可以点击出现小窗气泡展示"

---

## Requirements

### ADDED

#### REQ-QUOTE-001: Inline Quote Reference Indicator
**Priority**: P0

Messages that reference previous quotes SHALL display an inline reference indicator instead of the full quote block.

**Specification**:
- Indicator format: `"↩ Reply to [Persona Name]"`
- Position: Before message content, or as first line
- Style: Italic, 0.875rem, subtle gray color
- Clickable/hoverable area

**Validation**:
```html
<!-- Old (always visible) -->
<blockquote class="message-quote">
  <cite>Su Shi 苏轼</cite>
  <p>机械与自然的对话...</p>
</blockquote>

<!-- New (hidden, with reference) -->
<div class="quote-ref" data-quote-id="quote-1">
  ↩ Reply to <span class="quote-ref-author">Su Shi 苏轼</span>
</div>
```

**CSS**:
```css
.quote-ref {
  display: inline-block;
  font-size: 0.875rem;
  font-style: italic;
  color: #6b7280;
  cursor: pointer;
  margin-bottom: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.quote-ref:hover {
  background-color: #f3f4f6;
}

.quote-ref-author {
  font-weight: 600;
  /* color set inline via persona.color */
}
```

**Acceptance Criteria**:
- [ ] Quote blocks replaced with inline "↩ Reply to..." indicator
- [ ] Author name uses persona color for visual connection
- [ ] Indicator is visually distinct but not intrusive

---

#### REQ-QUOTE-002: Desktop Hover Tooltip
**Priority**: P0

On desktop (hover-capable devices), hovering over the quote reference SHALL display a tooltip with the full quote content.

**Specification**:
- Trigger: CSS `:hover` pseudo-class
- Positioning: Absolute, above reference (or below if space insufficient)
- Max-width: 400px
- Background: White with shadow
- Animation: Fade in 200ms

**Validation**:
```css
/* Desktop hover tooltip */
@media (hover: hover) and (pointer: fine) {
  .quote-ref {
    position: relative;
  }

  .quote-ref-tooltip {
    display: none;
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 8px;
    padding: 12px 16px;
    max-width: 400px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 100;
    white-space: normal;
  }

  .quote-ref:hover .quote-ref-tooltip {
    display: block;
    animation: fadeIn 200ms ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateX(-50%) translateY(4px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }

  /* Arrow */
  .quote-ref-tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: #ffffff;
  }
}
```

**HTML Structure**:
```html
<div class="quote-ref" data-quote-id="quote-1">
  ↩ Reply to <span class="quote-ref-author">Su Shi 苏轼</span>

  <div class="quote-ref-tooltip">
    <cite class="quote-tooltip-author" style="color: #B85C3C;">Su Shi 苏轼</cite>
    <p class="quote-tooltip-text">机械与自然的对话，恰似书法中的收放自如。</p>
  </div>
</div>
```

**Acceptance Criteria**:
- [ ] Tooltip appears on hover within 200ms
- [ ] Tooltip positioned above reference (or below if space insufficient)
- [ ] Tooltip has white background with shadow and arrow
- [ ] Tooltip disappears when hover ends
- [ ] Max-width prevents tooltip from being too wide

---

#### REQ-QUOTE-003: Mobile Click Modal
**Priority**: P0

On mobile (touch devices), tapping the quote reference SHALL open a modal with the full quote content.

**Specification**:
- Trigger: JavaScript click event
- Modal style: Centered overlay with backdrop
- Dismiss: Tap backdrop, tap close button, or tap outside
- Animation: Fade in backdrop + slide up modal (300ms)

**Validation**:
```css
/* Mobile click modal */
@media (hover: none) or (pointer: coarse) {
  .quote-modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: none;
    animation: fadeIn 300ms ease-out;
  }

  .quote-modal-backdrop.active {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .quote-modal {
    background: #ffffff;
    border-radius: 12px;
    padding: 24px;
    max-width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    animation: slideUp 300ms ease-out;
  }

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .quote-modal-close {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 32px;
    height: 32px;
    background: #f3f4f6;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
```

**JavaScript**:
```javascript
// In DialoguePlayer class
_attachQuoteClickHandlers() {
  const quoteRefs = document.querySelectorAll('.quote-ref');

  quoteRefs.forEach(ref => {
    ref.addEventListener('click', (e) => {
      if (window.matchMedia('(hover: none)').matches) {
        e.preventDefault();
        const quoteId = ref.dataset.quoteId;
        this._showQuoteModal(quoteId);
      }
    });
  });
}

_showQuoteModal(quoteId) {
  const quote = this._getQuoteById(quoteId);
  const backdrop = document.createElement('div');
  backdrop.className = 'quote-modal-backdrop active';

  const modal = document.createElement('div');
  modal.className = 'quote-modal';
  modal.innerHTML = `
    <button class="quote-modal-close" aria-label="Close">&times;</button>
    <cite style="color: ${quote.persona.color};">${quote.persona.name}</cite>
    <p>${quote.text}</p>
  `;

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  // Dismiss handlers
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      this._closeQuoteModal(backdrop);
    }
  });

  modal.querySelector('.quote-modal-close').addEventListener('click', () => {
    this._closeQuoteModal(backdrop);
  });
}

_closeQuoteModal(backdrop) {
  backdrop.classList.remove('active');
  setTimeout(() => backdrop.remove(), 300); // After animation
}
```

**Acceptance Criteria**:
- [ ] Tap on quote reference opens modal on mobile
- [ ] Modal displays full quote with author name and text
- [ ] Modal is centered with backdrop overlay
- [ ] Tap backdrop or close button dismisses modal
- [ ] Animations are smooth (300ms fade + slide)

---

#### REQ-QUOTE-004: Keyboard Accessibility
**Priority**: P1

Quote references SHALL be keyboard-accessible, allowing users to reveal quotes using keyboard navigation.

**Specification**:
- Tab: Focus on quote reference
- Enter/Space: Trigger tooltip (desktop) or modal (mobile)
- Escape: Close tooltip/modal
- ARIA attributes: `role="button"`, `aria-haspopup="true"`, `aria-expanded`

**Validation**:
```html
<div class="quote-ref"
     role="button"
     tabindex="0"
     aria-haspopup="true"
     aria-expanded="false"
     data-quote-id="quote-1">
  ↩ Reply to <span class="quote-ref-author">Su Shi 苏轼</span>
</div>
```

```javascript
// Keyboard handler
_attachQuoteKeyboardHandlers() {
  const quoteRefs = document.querySelectorAll('.quote-ref');

  quoteRefs.forEach(ref => {
    ref.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        ref.click(); // Reuse click handler
      } else if (e.key === 'Escape') {
        this._closeAllQuoteModals();
      }
    });

    ref.addEventListener('focus', () => {
      ref.setAttribute('aria-expanded', 'true');
    });

    ref.addEventListener('blur', () => {
      ref.setAttribute('aria-expanded', 'false');
    });
  });
}
```

**Acceptance Criteria**:
- [ ] Tab key focuses on quote reference
- [ ] Enter/Space triggers tooltip/modal
- [ ] Escape closes tooltip/modal
- [ ] Focus indicator visible (outline)
- [ ] Screen reader announces "Reply to [Name], button, press Enter to view quote"

---

#### REQ-QUOTE-005: Quote Data Structure
**Priority**: P0

Messages with quotes SHALL store quote data in a structured format for retrieval.

**Specification**:
- Each message in `thread.messages` has optional `quote` property
- Quote object: `{ messageId, personaId, text }`
- On render, generate `quote-ref` element with `data-quote-id`

**Validation**:
```javascript
// In js/data.js (dialogue data structure)
const dialogueThread = {
  id: "thread-1",
  topic: "...",
  messages: [
    {
      id: "msg-1",
      personaId: "su-shi",
      text: "机械与自然的对话...",
      quote: null // Initial message, no quote
    },
    {
      id: "msg-2",
      personaId: "wang-yangming",
      text: "苏轼所言极是...",
      quote: {
        messageId: "msg-1",
        personaId: "su-shi",
        text: "机械与自然的对话..."
      }
    }
  ]
};
```

**Render Logic**:
```javascript
_renderMessage(message) {
  const messageEl = document.createElement('div');
  messageEl.className = 'dialogue-message';

  // If message has quote, render quote reference
  if (message.quote) {
    const quoteRef = this._renderQuoteRef(message.quote);
    messageEl.appendChild(quoteRef);
  }

  // Render message content
  const content = this._renderMessageContent(message.text);
  messageEl.appendChild(content);

  return messageEl;
}

_renderQuoteRef(quote) {
  const persona = VULCA_DATA.personas.find(p => p.id === quote.personaId);
  const ref = document.createElement('div');
  ref.className = 'quote-ref';
  ref.dataset.quoteId = `${quote.messageId}-quote`;
  ref.setAttribute('role', 'button');
  ref.setAttribute('tabindex', '0');
  ref.setAttribute('aria-haspopup', 'true');
  ref.setAttribute('aria-expanded', 'false');

  ref.innerHTML = `
    ↩ Reply to <span class="quote-ref-author" style="color: ${persona.color};">${persona.nameZh} ${persona.nameEn}</span>

    <div class="quote-ref-tooltip">
      <cite class="quote-tooltip-author" style="color: ${persona.color};">${persona.nameZh} ${persona.nameEn}</cite>
      <p class="quote-tooltip-text">${quote.text}</p>
    </div>
  `;

  return ref;
}
```

**Acceptance Criteria**:
- [ ] Messages with quotes have structured `quote` property
- [ ] Quote references generated from `quote` data
- [ ] Quote tooltip/modal displays correct author and text
- [ ] Quote ID matches message ID for lookup

---

### MODIFIED

None (new feature, replaces old always-visible quote blocks)

---

### REMOVED

#### REQ-QUOTE-REMOVED-001: Always-Visible Quote Blocks
**Element**: `.message-quote` (blockquote)

**Before**:
```html
<blockquote class="message-quote">
  <cite>Su Shi 苏轼</cite>
  <p>机械与自然的对话...</p>
</blockquote>
```

**After**: Replaced with `.quote-ref` + tooltip/modal system

**Migration**: Existing quote blocks converted to quote references during data migration.

---

## Scenarios

### Scenario 1: Desktop User Hovers Over Quote Reference

**Given** the user is on a desktop device (hover-capable)
**And** a message has a quote reference "↩ Reply to Su Shi 苏轼"
**When** the user hovers over the quote reference
**Then** a tooltip MUST appear within 200ms
**And** the tooltip MUST display the full quoted text
**And** the tooltip MUST be positioned above the reference
**And** the tooltip MUST have a white background with shadow

**Validation**:
```javascript
const quoteRef = document.querySelector('.quote-ref');
const tooltip = quoteRef.querySelector('.quote-ref-tooltip');

// Simulate hover
quoteRef.dispatchEvent(new MouseEvent('mouseenter'));

setTimeout(() => {
  const tooltipStyle = window.getComputedStyle(tooltip);
  assert(tooltipStyle.display === 'block', 'Tooltip visible on hover');
  assert(tooltipStyle.backgroundColor === 'rgb(255, 255, 255)', 'White background');
}, 250); // After 200ms fade-in
```

---

### Scenario 2: Mobile User Taps Quote Reference

**Given** the user is on a mobile device (touch-capable)
**And** a message has a quote reference "↩ Reply to Su Shi 苏轼"
**When** the user taps the quote reference
**Then** a modal MUST open with the full quoted text
**And** the modal MUST be centered with a backdrop overlay
**And** the modal MUST have a close button (×)

**Validation**:
```javascript
// Simulate mobile environment
Object.defineProperty(window, 'matchMedia', {
  value: jest.fn().mockImplementation(query => ({
    matches: query === '(hover: none)',
    media: query
  }))
});

const quoteRef = document.querySelector('.quote-ref');
quoteRef.click();

setTimeout(() => {
  const backdrop = document.querySelector('.quote-modal-backdrop.active');
  const modal = document.querySelector('.quote-modal');

  assert(backdrop !== null, 'Backdrop visible');
  assert(modal !== null, 'Modal visible');

  const closeBtn = modal.querySelector('.quote-modal-close');
  assert(closeBtn !== null, 'Close button exists');
}, 350); // After 300ms animation
```

---

### Scenario 3: Keyboard User Navigates to Quote

**Given** a message has a quote reference
**When** the user presses Tab to focus on the quote reference
**And** presses Enter
**Then** the tooltip/modal MUST open (depending on device)
**And** the screen reader MUST announce "Reply to Su Shi, button, press Enter to view quote"

**Validation**:
```javascript
const quoteRef = document.querySelector('.quote-ref');

// Simulate Tab focus
quoteRef.focus();
assert(document.activeElement === quoteRef, 'Quote ref focused');

// Check ARIA attributes
assert(quoteRef.getAttribute('role') === 'button', 'Role is button');
assert(quoteRef.getAttribute('aria-haspopup') === 'true', 'Has popup');

// Simulate Enter key
const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
quoteRef.dispatchEvent(enterEvent);

// On desktop: tooltip visible
// On mobile: modal opens
```

---

### Scenario 4: User Dismisses Modal by Tapping Backdrop

**Given** a quote modal is open on mobile
**When** the user taps the backdrop (outside the modal)
**Then** the modal MUST close with a fade-out animation
**And** the backdrop MUST be removed from the DOM after 300ms

**Validation**:
```javascript
const backdrop = document.querySelector('.quote-modal-backdrop.active');

// Simulate backdrop click (not modal click)
backdrop.click();

// Check animation removal
setTimeout(() => {
  assert(!backdrop.classList.contains('active'), 'Active class removed');
}, 50);

setTimeout(() => {
  assert(document.querySelector('.quote-modal-backdrop') === null, 'Backdrop removed from DOM');
}, 350); // After 300ms animation
```

---

### Scenario 5: Tooltip Repositions When Near Viewport Edge

**Given** a quote reference is near the bottom of the viewport
**When** the user hovers over the reference
**Then** the tooltip MUST appear below the reference (not above)
**And** the arrow MUST point upward

**Validation**:
```javascript
// Position quote ref near bottom
const quoteRef = document.querySelector('.quote-ref');
quoteRef.style.position = 'fixed';
quoteRef.style.bottom = '20px';

// Hover
quoteRef.dispatchEvent(new MouseEvent('mouseenter'));

setTimeout(() => {
  const tooltip = quoteRef.querySelector('.quote-ref-tooltip');
  const tooltipStyle = window.getComputedStyle(tooltip);

  // Check if positioned below (top > 100%)
  assert(tooltipStyle.bottom === 'auto' || tooltipStyle.top !== '', 'Tooltip below reference');
}, 250);
```

---

## Dependencies

- **Upstream**: Progressive focus spec (quote interactions must not interfere with message focus)
- **Downstream**: None

---

## Testing Strategy

### Manual Testing
1. **Desktop Hover**: Hover over quote references, verify tooltip appears/disappears smoothly
2. **Mobile Tap**: Tap quote references on mobile, verify modal opens/closes
3. **Keyboard**: Tab to quote ref, press Enter, verify tooltip/modal opens
4. **Positioning**: Test quote refs at top/bottom of viewport, verify tooltip repositioning

### Automated Testing
1. **Unit Tests**: Test `_renderQuoteRef()` logic, modal show/hide methods
2. **Integration Tests**: Simulate hover/click events, verify DOM changes
3. **Accessibility Tests**: Validate ARIA attributes, keyboard navigation, screen reader announcements

---

## Accessibility

### ARIA Attributes
```html
<div class="quote-ref"
     role="button"
     tabindex="0"
     aria-haspopup="true"
     aria-expanded="false"
     aria-label="Reply to Su Shi, press Enter to view quoted text">
  ↩ Reply to <span class="quote-ref-author">Su Shi 苏轼</span>
</div>
```

### Screen Reader Behavior
- **On focus**: "Reply to Su Shi, button, press Enter to view quoted text"
- **On activate**: "Opening quote from Su Shi: [quoted text]"
- **On dismiss**: "Quote closed"

---

## Performance

### Optimization
- Lazy-load tooltips (don't render until hover)
- Use CSS transforms for animations (GPU-accelerated)
- Debounce modal creation (prevent multiple modals on rapid taps)

---

## Migration Notes

### Data Migration
Convert existing always-visible quote blocks to quote references:

```javascript
// Migration script (run once on data)
function migrateQuoteBlocks(thread) {
  thread.messages.forEach((msg, idx) => {
    // Find blockquote in message HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = msg.text;
    const blockquote = tempDiv.querySelector('.message-quote');

    if (blockquote) {
      // Extract quote data
      const cite = blockquote.querySelector('cite').textContent;
      const quoteText = blockquote.querySelector('p').textContent;
      const personaId = findPersonaIdByName(cite);

      // Add quote property
      msg.quote = {
        messageId: thread.messages[idx - 1].id, // Assume previous message
        personaId: personaId,
        text: quoteText
      };

      // Remove blockquote from text
      blockquote.remove();
      msg.text = tempDiv.innerHTML;
    }
  });
}
```

### Rollback
Revert to always-visible quote blocks by re-rendering `<blockquote>` from `message.quote` data.

---

## Success Metrics

- [ ] All quote blocks replaced with inline references
- [ ] Desktop hover shows tooltips within 200ms
- [ ] Mobile tap opens modal with smooth animation
- [ ] Keyboard navigation fully functional
- [ ] Zero accessibility violations (axe-core scan)
- [ ] User feedback confirms improved readability
