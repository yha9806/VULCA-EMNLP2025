# Spec: Main Site Integration (Homepage Replacement)

**Change ID**: `add-knowledge-base-references-to-dialogues`
**Capability**: `main-site-integration`
**Status**: Draft
**Created**: 2025-11-06

---

## Overview

This spec defines requirements for integrating the DialoguePlayer system into the homepage by **replacing** the existing static critique cards in the `critiques-panel` section.

**User Intent**: "我需要这个对话系统替换主页面，主网站的文字评论板块的老旧内容。而不是成为一个子页面"

---

## ADDED Requirements

### Requirement: Homepage Dialogue Integration

The system SHALL replace the static critique cards in `index.html` with the DialoguePlayer component.

**Acceptance Criteria**:
- The `critiques-panel` container (`index.html` line 118) SHALL mount DialoguePlayer instead of static critique cards
- The DialoguePlayer SHALL display the dialogue corresponding to the currently active artwork
- The DialoguePlayer SHALL automatically start playing when the page loads
- The DialoguePlayer SHALL auto-play new dialogue when user switches artworks
- All Phase 3.2 features SHALL be preserved (badges, references, tooltips, thought chains)

#### Scenario: Initial Page Load with Dialogue

**Given** the user visits `https://vulcaart.art` (homepage)

**When** the page finishes loading

**Then** the system SHALL:
- Display the first artwork in the carousel
- Mount DialoguePlayer in the `critiques-panel` container
- Load the dialogue for `artwork-1` (30 messages)
- Automatically start playing the dialogue with natural timing (4-7s intervals)
- Display the first message immediately
- Show "思考中..." thought chain for upcoming messages
- Render reference badges for messages with references

**And** the system SHALL NOT:
- Display static critique cards
- Show the old `renderCritiques()` output

**Validation**:
```javascript
// Playwright test
await page.goto('https://vulcaart.art');
await page.waitForSelector('#critiques-panel');

// Verify DialoguePlayer mounted
const dialogueContainer = await page.$('#critiques-panel .dialogue-container');
expect(dialogueContainer).toBeTruthy();

// Verify first message visible
const firstMessage = await page.$('.dialogue-message');
expect(firstMessage).toBeTruthy();

// Verify auto-play started
await page.waitForTimeout(5000);
const messageCount = await page.$$eval('.dialogue-message', msgs => msgs.length);
expect(messageCount).toBeGreaterThan(1); // More than 1 message = playing
```

---

#### Scenario: Artwork Switching Updates Dialogue

**Given** the user is on the homepage with `artwork-1` dialogue displayed

**When** the user clicks the "next artwork" button (UnifiedNavigation)

**Then** the system SHALL:
- Stop the current dialogue playback
- Destroy the current DialoguePlayer instance
- Clear the `critiques-panel` container
- Load the dialogue for `artwork-2` (19 messages)
- Create a new DialoguePlayer instance
- Mount it in the `critiques-panel` container
- Automatically start playing the new dialogue

**And** the system SHALL ensure:
- No memory leaks (old player cleaned up)
- No duplicate event listeners
- Smooth transition (<500ms)
- No console errors

**Validation**:
```javascript
// Playwright test
await page.goto('https://vulcaart.art');

// Get initial dialogue ID
const initialDialogue = await page.textContent('.dialogue-header h3');
expect(initialDialogue).toContain('artwork-1');

// Click next artwork
await page.click('.unified-nav-arrow.next');
await page.waitForTimeout(1000);

// Verify new dialogue loaded
const newDialogue = await page.textContent('.dialogue-header h3');
expect(newDialogue).toContain('artwork-2');

// Verify only one DialoguePlayer instance exists
const playerCount = await page.$$eval('.dialogue-container', containers => containers.length);
expect(playerCount).toBe(1);
```

---

### Requirement: Script Dependencies Integration

The homepage SHALL load all dialogue system CSS and JavaScript resources.

**Acceptance Criteria**:
- Dialogue Player CSS SHALL be loaded in `<head>`
- Reference Badge CSS SHALL be loaded in `<head>`
- Reference List CSS SHALL be loaded in `<head>`
- `js/data/dialogues/index.js` SHALL be loaded before `dialogue-player.js`
- `js/components/dialogue-player.js` SHALL be loaded before `gallery-hero.js`
- All scripts SHALL use absolute paths (`/js/...`, not `../js/...`)

#### Scenario: CSS Resources Loaded Successfully

**Given** the user visits the homepage

**When** the browser loads the page

**Then** the system SHALL:
- Load `/styles/components/dialogue-player.css` without 404 error
- Load `/styles/components/reference-badge.css` without 404 error
- Load `/styles/components/reference-list.css` without 404 error
- Apply dialogue player styles to rendered elements

**Validation**:
```javascript
// Check Network tab
const cssResources = await page.evaluate(() => {
  return [...document.styleSheets].map(sheet => sheet.href).filter(Boolean);
});

expect(cssResources).toContain('https://vulcaart.art/styles/components/dialogue-player.css');
expect(cssResources).toContain('https://vulcaart.art/styles/components/reference-badge.css');
expect(cssResources).toContain('https://vulcaart.art/styles/components/reference-list.css');
```

---

#### Scenario: JavaScript Loading Order Correct

**Given** the homepage HTML document

**When** the browser parses `<script>` tags

**Then** the loading order SHALL be:
1. `js/data.js` (VULCA_DATA)
2. `js/data/dialogues/index.js` (DIALOGUES, getDialogueForArtwork)
3. `js/components/dialogue-player.js` (DialoguePlayer class)
4. `js/gallery-hero.js` (calls renderDialogue)

**And** the system SHALL ensure:
- `window.VULCA_DATA` is defined before `dialogue-player.js` loads
- `window.DIALOGUES` is defined before `gallery-hero.js` loads
- `window.DialoguePlayer` is a constructor function
- `window.getDialogueForArtwork` is a function

**Validation**:
```javascript
// Browser console test
console.assert(typeof window.VULCA_DATA === 'object', 'VULCA_DATA loaded');
console.assert(Array.isArray(window.DIALOGUES), 'DIALOGUES is array');
console.assert(typeof window.getDialogueForArtwork === 'function', 'Helper function loaded');
console.assert(typeof window.DialoguePlayer === 'function', 'DialoguePlayer is constructor');
```

---

### Requirement: Global Variable Exports

The `js/data/dialogues/index.js` module SHALL export dialogue data as global variables.

**Acceptance Criteria**:
- `window.DIALOGUES` SHALL be an array of 4 dialogue objects
- `window.getDialogueForArtwork(artworkId)` SHALL return the dialogue for the specified artwork
- ES6 module exports SHALL be preserved for backward compatibility
- Global variables SHALL be accessible from non-module scripts

#### Scenario: Global Variables Accessible

**Given** `js/data/dialogues/index.js` is loaded

**When** `gallery-hero.js` (non-module script) accesses dialogue data

**Then** the system SHALL:
- Provide `window.DIALOGUES` as an array
- Provide `window.getDialogueForArtwork` as a function
- Return correct dialogue object when `getDialogueForArtwork('artwork-1')` is called

**Validation**:
```javascript
// In gallery-hero.js (non-module context)
const dialogue = window.getDialogueForArtwork('artwork-1');
console.assert(dialogue !== undefined, 'Dialogue found');
console.assert(dialogue.artworkId === 'artwork-1', 'Correct artwork');
console.assert(dialogue.messages.length === 30, 'Correct message count');
```

---

### Requirement: Memory Management

The system SHALL properly clean up DialoguePlayer instances to prevent memory leaks.

**Acceptance Criteria**:
- Only one DialoguePlayer instance SHALL exist at a time
- The previous DialoguePlayer instance SHALL be destroyed before creating a new one
- Event listeners SHALL be removed when destroying an instance
- Timers and intervals SHALL be cleared when destroying an instance

#### Scenario: No Memory Leaks on Artwork Switching

**Given** the user is on the homepage

**When** the user switches between artworks 10 times consecutively

**Then** the system SHALL:
- Create and destroy 10 DialoguePlayer instances
- Maintain stable memory usage (<100MB growth)
- Remove all event listeners from destroyed instances
- Clear all timers from destroyed instances

**Validation**:
```javascript
// Playwright + Chrome DevTools Protocol
const client = await page.target().createCDPSession();
await client.send('HeapProfiler.enable');

// Initial memory snapshot
await client.send('HeapProfiler.collectGarbage');
const initialHeap = await client.send('HeapProfiler.takeHeapSnapshot');

// Switch artworks 10 times
for (let i = 0; i < 10; i++) {
  await page.click('.unified-nav-arrow.next');
  await page.waitForTimeout(1000);
}

// Final memory snapshot
await client.send('HeapProfiler.collectGarbage');
const finalHeap = await client.send('HeapProfiler.takeHeapSnapshot');

const memoryGrowth = finalHeap.size - initialHeap.size;
expect(memoryGrowth).toBeLessThan(100 * 1024 * 1024); // <100MB
```

---

## MODIFIED Requirements

### Requirement: Gallery Hero Rendering Logic

The `gallery-hero.js` rendering logic SHALL be updated to use DialoguePlayer instead of static critique cards.

**Changes**:
- The `renderCritiques(carousel)` function SHALL be replaced with `renderDialogue(artworkId)`
- The `createCriticPanel(critique, personas)` function SHALL be removed
- The carousel event handler SHALL call `renderDialogue` on artwork change

**Acceptance Criteria**:
- The `renderDialogue()` function SHALL accept an artwork ID as parameter
- The function SHALL create a DialoguePlayer instance with the corresponding dialogue
- The function SHALL destroy any existing DialoguePlayer instance before creating a new one
- The function SHALL handle errors gracefully (e.g., dialogue not found)

#### Scenario: renderDialogue Function Replaces renderCritiques

**Given** `gallery-hero.js` is loaded

**When** the carousel triggers an artwork change event

**Then** the system SHALL:
- Call `renderDialogue(newArtworkId)` instead of `renderCritiques(carousel)`
- Retrieve dialogue data using `getDialogueForArtwork(newArtworkId)`
- Destroy the previous DialoguePlayer if it exists
- Create a new DialoguePlayer with the new dialogue
- Mount it in the `critiques-panel` container
- Start auto-play

**Validation**:
```javascript
// Code inspection
const galleryHeroSource = fs.readFileSync('js/gallery-hero.js', 'utf8');

// Verify renderDialogue exists
expect(galleryHeroSource).toContain('function renderDialogue(artworkId)');

// Verify renderCritiques removed or deprecated
expect(galleryHeroSource).not.toContain('function renderCritiques(carousel)');

// Verify destroy call
expect(galleryHeroSource).toContain('window.currentDialoguePlayer.destroy()');
```

---

## REMOVED Requirements

### Requirement: Static Critique Card Rendering

The `renderCritiques()` and `createCriticPanel()` functions SHALL be removed from `gallery-hero.js`.

**Rationale**: These functions generated static critique cards, which are now superseded by the dynamic DialoguePlayer.

**Acceptance Criteria**:
- The `renderCritiques()` function SHALL be deleted or commented out
- The `createCriticPanel()` function SHALL be deleted or commented out
- All references to these functions SHALL be removed from carousel event handlers
- The CSS classes `.critique-panel`, `.critique-header`, etc. MAY be retained for backward compatibility

#### Scenario: Old Critique Functions Not Called

**Given** the homepage is loaded and artwork switching occurs

**When** monitoring the JavaScript execution

**Then** the system SHALL NOT:
- Call `renderCritiques()` function
- Call `createCriticPanel()` function
- Create elements with class `critique-panel`

**And** the system SHALL ONLY:
- Call `renderDialogue()` function
- Create DialoguePlayer instances
- Create elements with class `dialogue-container`

**Validation**:
```javascript
// Monkey-patch to detect old function calls
const originalRenderCritiques = window.renderCritiques;
let critiquesCallCount = 0;

window.renderCritiques = function(...args) {
  critiquesCallCount++;
  return originalRenderCritiques?.apply(this, args);
};

// Navigate and switch artworks
await page.goto('https://vulcaart.art');
await page.click('.unified-nav-arrow.next');
await page.waitForTimeout(2000);

// Verify old function never called
expect(critiquesCallCount).toBe(0);
```

---

## Non-Functional Requirements

### Performance

- **Page Load Time**: SHALL remain <2 seconds on fast 3G
- **Artwork Switch Time**: SHALL complete <500ms from click to dialogue render
- **Memory Usage**: SHALL not exceed 150MB total for homepage
- **CPU Usage**: SHALL remain <20% during dialogue playback

### Accessibility

- **Keyboard Navigation**: SHALL support Tab, Enter, Escape keys
- **Screen Readers**: SHALL announce dialogue messages and reference counts
- **ARIA Labels**: SHALL be present on all interactive elements
- **Color Contrast**: SHALL meet WCAG 2.1 AA standards

### Browser Compatibility

- **Chrome/Edge**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 90+

### Responsive Design

- **Desktop**: 1920px, 1440px, 1024px
- **Tablet**: 768px
- **Mobile**: 375px
- **Dialogue Container**: SHALL adapt height to viewport (max 70vh)
- **Scrolling**: SHALL enable vertical scroll for long dialogues

---

## Cross-Reference

**Related Specs**:
- `knowledge-base-integration/spec.md` - Defines reference data structure
- `reference-ui-components/spec.md` - Defines badge and list components

**Dependencies**:
- Phase 3.1: All dialogue messages SHALL have populated `references` arrays
- Phase 3.2: DialoguePlayer component SHALL be fully implemented and tested

---

## Validation Checklist

Before considering this spec complete:

- [ ] All scenarios have concrete validation code
- [ ] Performance metrics have measurable thresholds
- [ ] Accessibility requirements reference WCAG standards
- [ ] Browser compatibility specifies minimum versions
- [ ] Error handling scenarios are covered
- [ ] Memory leak prevention is testable
- [ ] Responsive design breakpoints are defined

---

**Status**: Spec complete, ready for implementation
**Next**: Update `tasks.md` with Phase 3.3 task breakdown
