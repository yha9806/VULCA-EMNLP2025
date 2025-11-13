# Spec: Display State Fixes

**Feature**: Display State Fixes
**Change**: `integrate-dialogue-system-into-exhibition`
**Last Updated**: 2025-11-12

## MODIFIED Requirements

### Requirement: Knowledge Base References Collapsed by Default
**ID**: DISPLAY-001
**Priority**: MUST

Knowledge base references SHALL be collapsed by default on page load and only expand when the user clicks the reference badge.

**Previous Behavior**: References displayed with `expanded` class, showing full content immediately.

**New Behavior**: References start collapsed, require user click to expand.

**Acceptance Criteria**:
- References have `max-height: 0` on load (collapsed state)
- Badge shows "📚 X 个引用" with click affordance
- First click adds `expanded` class → animates to `max-height: 2000px`
- Second click removes `expanded` class → animates back to `max-height: 0`
- Aria labels update to reflect expanded/collapsed state

#### Scenario: User loads dialogue with references
**Given** artwork-5 dialogue has messages with 2+ references each
**When** the user loads the dialogue page
**Then** all reference lists SHALL be collapsed (not visible)
**And** reference badges SHALL show "📚 2 个引用" text
**And** clicking a badge SHALL expand only that message's references

**Test Code**:
```javascript
// Load dialogue
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/dialogues.html?artwork=artwork-5');

// Wait for first message
await page.waitForSelector('.dialogue-message', { timeout: 5000 });

// Get first reference list
const firstRefList = await page.locator('.kb-references-list').first();

// Verify collapsed on load
const initialHeight = await firstRefList.evaluate(el =>
  window.getComputedStyle(el).maxHeight
);
assert(initialHeight === '0px' || parseInt(initialHeight) === 0,
       'References should be collapsed (max-height: 0)');

// Verify not visible
const isVisible = await firstRefList.boundingBox().then(box => box !== null && box.height > 0);
assert(!isVisible, 'References should not be visible');
```

#### Scenario: User expands references
**Given** references are collapsed
**When** the user clicks the reference badge
**Then** the reference list SHALL expand with smooth animation
**And** the full reference content SHALL become visible

**Test Code**:
```javascript
// Load dialogue and wait for message
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/dialogues.html?artwork=artwork-5');
await page.waitForSelector('.dialogue-message');

// Click first reference badge
const firstBadge = await page.locator('.kb-ref-badge').first();
await firstBadge.click();

// Wait for expansion animation
await page.waitForTimeout(500);

// Verify expanded
const refList = await page.locator('.kb-references-list').first();
const expandedHeight = await refList.evaluate(el =>
  window.getComputedStyle(el).maxHeight
);
assert(parseInt(expandedHeight) > 100, 'References should be expanded (max-height > 100px)');

// Verify visible
const box = await refList.boundingBox();
assert(box !== null && box.height > 50, 'References should be visible with content');

// Verify expanded class
const hasExpanded = await refList.evaluate(el => el.classList.contains('expanded'));
assert(hasExpanded, 'Should have "expanded" class');
```

#### Scenario: User collapses references
**Given** references are expanded
**When** the user clicks the reference badge again
**Then** the reference list SHALL collapse with smooth animation
**And** the reference content SHALL become hidden

**Test Code**:
```javascript
// Load and expand
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/dialogues.html?artwork=artwork-5');
await page.waitForSelector('.dialogue-message');

const badge = await page.locator('.kb-ref-badge').first();
const refList = await page.locator('.kb-references-list').first();

// Expand
await badge.click();
await page.waitForTimeout(500);
assert(await refList.evaluate(el => el.classList.contains('expanded')));

// Collapse
await badge.click();
await page.waitForTimeout(500);

// Verify collapsed
const hasExpanded = await refList.evaluate(el => el.classList.contains('expanded'));
assert(!hasExpanded, 'Should not have "expanded" class');

const height = await refList.evaluate(el => window.getComputedStyle(el).maxHeight);
assert(height === '0px', 'Should be collapsed (max-height: 0)');
```

---

### Requirement: Future Messages Hidden Until Revealed
**ID**: DISPLAY-002
**Priority**: MUST

Future messages SHALL be completely hidden (not visible at any opacity) until their timestamp is reached and they are revealed in sequence.

**Previous Behavior**: Future messages displayed with `opacity: 0.4`, showing as semi-transparent placeholders.

**New Behavior**: Future messages use `display: none`, completely hidden until revealed.

**Acceptance Criteria**:
- Future messages have `display: none` (not in layout)
- No semi-transparent placeholders visible
- Messages appear only when timestamp reached
- Fade-in animation when transitioning from `.future` to `.current`
- Past messages remain dimmed for context (`opacity: 0.4`)

#### Scenario: User loads dialogue page
**Given** artwork-5 dialogue has 6 messages
**When** the page loads
**Then** only the first message SHALL be visible
**And** future messages (2-6) SHALL be completely hidden
**And** no semi-transparent message placeholders SHALL be visible

**Test Code**:
```javascript
// Load dialogue
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/dialogues.html?artwork=artwork-5');

// Wait for first message
await page.waitForSelector('.dialogue-message.current', { timeout: 5000 });

// Count visible messages
const visibleMessages = await page.locator('.dialogue-message').evaluateAll(messages =>
  messages.filter(msg => {
    const style = window.getComputedStyle(msg);
    return style.display !== 'none' && style.opacity !== '0';
  }).length
);

assert(visibleMessages === 1, 'Only first message should be visible');

// Verify future messages are hidden
const futureMessages = await page.locator('.dialogue-message.future');
const futureCount = await futureMessages.count();
assert(futureCount > 0, 'Should have future messages');

const futureDisplay = await futureMessages.first().evaluate(el =>
  window.getComputedStyle(el).display
);
assert(futureDisplay === 'none', 'Future messages should have display: none');
```

#### Scenario: User waits for message reveal
**Given** the first message is visible
**When** 8 seconds pass (timestamp interval)
**Then** the second message SHALL appear with fade-in animation
**And** the first message SHALL transition to `.past` state (dimmed)

**Test Code**:
```javascript
// Load dialogue
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/dialogues.html?artwork=artwork-5');
await page.waitForSelector('.dialogue-message.current');

// Wait for second message to appear (6-8 seconds)
await page.waitForSelector('.dialogue-message.current:nth-child(2)', { timeout: 10000 });

// Verify second message visible
const secondMessage = await page.locator('.dialogue-message').nth(1);
const display = await secondMessage.evaluate(el => window.getComputedStyle(el).display);
assert(display !== 'none', 'Second message should be visible');

const hasCurrent = await secondMessage.evaluate(el => el.classList.contains('current'));
assert(hasCurrent, 'Second message should have .current class');

// Verify first message now dimmed (.past)
const firstMessage = await page.locator('.dialogue-message').first();
const hasPast = await firstMessage.evaluate(el => el.classList.contains('past'));
assert(hasPast, 'First message should have .past class');

const opacity = await firstMessage.evaluate(el => window.getComputedStyle(el).opacity);
assert(parseFloat(opacity) < 1, 'Past message should be dimmed');
```

#### Scenario: User observes sequential message reveal
**Given** the dialogue has 6 messages
**When** the user waits for the full dialogue to play
**Then** messages SHALL appear one at a time
**And** each message SHALL transition from hidden → current → past
**And** no future messages SHALL be visible before their timestamp

**Test Code**:
```javascript
// Load dialogue with auto-play
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/dialogues.html?artwork=artwork-5');

// Track message reveals
const revealOrder = [];

for (let i = 0; i < 3; i++) { // Test first 3 messages
  // Wait for current message to change
  await page.waitForFunction((index) => {
    const messages = Array.from(document.querySelectorAll('.dialogue-message'));
    return messages[index]?.classList.contains('current');
  }, {}, i, { timeout: 12000 });

  // Record which message is current
  const currentIndex = await page.locator('.dialogue-message.current').evaluate(el => {
    const messages = Array.from(document.querySelectorAll('.dialogue-message'));
    return messages.indexOf(el);
  });

  revealOrder.push(currentIndex);

  // Verify only one current message
  const currentCount = await page.locator('.dialogue-message.current').count();
  assert(currentCount === 1, 'Should only have one current message at a time');

  // Verify future messages still hidden
  const futureCount = await page.locator('.dialogue-message.future').count();
  assert(futureCount === 6 - i - 1, `Should have ${6 - i - 1} future messages`);
}

// Verify sequential order
assert(revealOrder[0] === 0 && revealOrder[1] === 1 && revealOrder[2] === 2,
       'Messages should reveal in order: 0, 1, 2');
```

---

### Requirement: Thought Chain Visibility During Reveal
**ID**: DISPLAY-003
**Priority**: MUST

Thought chains SHALL only be visible for future messages that are actively being "generated" (next message to appear), not for all future messages.

**Acceptance Criteria**:
- Only the immediately-next future message shows thought chain
- Thought chain visible for 3-4 seconds before message reveal
- Other future messages remain completely hidden (no thought chain)
- Thought chain removed when message content revealed

#### Scenario: User observes thought chain for next message
**Given** the first message is currently visible
**And** the second message is the next to be revealed
**When** the second message's delay period starts
**Then** the second message SHALL show a thought chain animation
**And** the third, fourth, fifth messages SHALL remain hidden (no thought chain)

**Test Code**:
```javascript
// Load dialogue
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/dialogues.html?artwork=artwork-5');
await page.waitForSelector('.dialogue-message.current');

// Wait for thought chain to appear (should be on message 2)
await page.waitForSelector('.thought-chain', { timeout: 8000 });

// Verify thought chain is for message 2
const thoughtChain = await page.locator('.thought-chain');
const parentMessage = await thoughtChain.locator('..').evaluate(el => {
  const messages = Array.from(document.querySelectorAll('.dialogue-message'));
  return messages.indexOf(el);
});

assert(parentMessage === 1, 'Thought chain should be on message 2 (index 1)');

// Verify other messages have no thought chain
const thoughtChainCount = await page.locator('.thought-chain').count();
assert(thoughtChainCount === 1, 'Should only have one thought chain visible');

// Verify messages 3+ are completely hidden
const thirdMessage = await page.locator('.dialogue-message').nth(2);
const display = await thirdMessage.evaluate(el => window.getComputedStyle(el).display);
assert(display === 'none', 'Third message should be completely hidden');
```

#### Scenario: Thought chain removed when message revealed
**Given** a message is showing thought chain animation
**When** the message's timestamp is reached
**Then** the thought chain SHALL be removed
**And** the message content SHALL be revealed with fade-in animation

**Test Code**:
```javascript
// Load dialogue
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/dialogues.html?artwork=artwork-5');

// Wait for second message thought chain
await page.waitForSelector('.thought-chain', { timeout: 8000 });
assert(await page.locator('.thought-chain').isVisible());

// Wait for message reveal
await page.waitForSelector('.dialogue-message.current:nth-child(2)', { timeout: 8000 });

// Verify thought chain removed
const thoughtChainVisible = await page.locator('.thought-chain').isVisible().catch(() => false);
assert(!thoughtChainVisible, 'Thought chain should be removed after reveal');

// Verify message content visible
const secondMessage = await page.locator('.dialogue-message').nth(1);
const content = await secondMessage.locator('.message-content');
assert(await content.isVisible(), 'Message content should be visible');
```

---

## ADDED Requirements

### Requirement: Fade-in Animation for Message Reveal
**ID**: DISPLAY-004
**Priority**: SHOULD

When a message transitions from `.future` to `.current`, it SHALL animate with a fade-in and slight upward slide effect.

**Acceptance Criteria**:
- Animation duration: 500ms
- Opacity: 0 → 1
- Transform: translateY(10px) → translateY(0)
- Easing: ease-out
- No animation for messages already in `.past` state

#### Scenario: User observes smooth message reveal
**Given** the first message is visible
**When** the second message is revealed
**Then** the second message SHALL fade in smoothly
**And** the animation SHALL complete within 500ms

**Test Code**:
```javascript
// Load dialogue
await page.goto('http://localhost:9999/exhibitions/negative-space-of-the-tide/dialogues.html?artwork=artwork-5');
await page.waitForSelector('.dialogue-message.current');

// Record time before reveal
const startTime = Date.now();

// Wait for second message
await page.waitForSelector('.dialogue-message.current:nth-child(2)', { timeout: 12000 });

// Verify animation property exists
const secondMessage = await page.locator('.dialogue-message.current');
const animation = await secondMessage.evaluate(el => {
  const style = window.getComputedStyle(el);
  return {
    animationName: style.animationName,
    animationDuration: style.animationDuration
  };
});

assert(animation.animationName !== 'none', 'Should have animation');
assert(animation.animationDuration !== '0s', 'Animation duration should be > 0');
```

---

## REMOVED Requirements

None.

---

## Cross-References

- **Depends On**: `dialogue-player.js` component logic
- **Depends On**: `dialogue-player.css` styling
- **Related**: `exhibition-integration` spec (page context)
- **Related**: User feedback from test session (2025-11-12)

---

## Validation Checklist

- [ ] References collapsed on load (all artworks tested)
- [ ] References expand/collapse with smooth animation
- [ ] Only one reference list expanded at a time (per user action)
- [ ] Future messages completely hidden (display: none verified)
- [ ] Messages reveal sequentially without visible placeholders
- [ ] Thought chain only visible for next message
- [ ] Fade-in animation smooth and consistent
- [ ] Past messages remain visible but dimmed
- [ ] No visual glitches during state transitions
- [ ] Mobile and desktop behavior consistent
- [ ] Language switching preserves state correctly
