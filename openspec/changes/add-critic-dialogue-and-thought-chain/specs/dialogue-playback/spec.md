# Spec: Dialogue Playback System

**Capability**: `dialogue-playback`
**Change**: `add-critic-dialogue-and-thought-chain`
**Version**: 1.0.0

---

## ADDED Requirements

### Requirement: Dialogue Player Component

The system SHALL provide an animated dialogue playback component that renders critic conversations with timeline control.

**Acceptance Criteria**:
- [ ] DialoguePlayer class exists in `js/components/dialogue-player.js`
- [ ] Supports play, pause, resume, and replay actions
- [ ] Supports 3 playback speeds: 1x, 1.5x, 2x
- [ ] Timeline scrubber for navigation
- [ ] Respects `prefers-reduced-motion` CSS media query

#### Scenario: Basic Dialogue Playback

**Given** a dialogue thread with 5 messages for artwork-1
**When** the user clicks "Play" button
**Then** messages SHALL appear sequentially with typing animation
**And** each message SHALL appear at its designated timestamp
**And** the timeline progress bar SHALL update in real-time

**Validation**:
```javascript
const player = new DialoguePlayer(dialogueThread, container);
player.play();

// After 3 seconds
setTimeout(() => {
  const renderedMessages = container.querySelectorAll('.dialogue-message');
  console.assert(renderedMessages.length >= 2, 'At least 2 messages should be visible after 3s');
}, 3000);
```

#### Scenario: Speed Control

**Given** dialogue playback is in progress at 1x speed
**When** user selects 2x speed
**Then** playback speed SHALL double immediately
**And** timeline SHALL progress twice as fast
**And** animation durations SHALL be halved

**Validation**:
```javascript
player.setSpeed(2.0);
const startTime = player.currentTime;
setTimeout(() => {
  const elapsed = player.currentTime - startTime;
  console.assert(Math.abs(elapsed - 2000) < 100, 'Should advance ~2000ms in 1 second at 2x speed');
}, 1000);
```

#### Scenario: Timeline Scrubbing

**Given** a dialogue thread with 8 messages spanning 30 seconds
**When** user drags timeline scrubber to 50% position
**Then** dialogue SHALL jump to 15-second mark
**And** all messages with timestamp ≤15s SHALL be immediately visible
**And** future messages SHALL remain hidden

**Validation**:
```javascript
player.scrubTo(15000); // 15 seconds
const visibleMsgs = container.querySelectorAll('.dialogue-message.visible');
const allMsgs = dialogueThread.messages;
const expectedVisible = allMsgs.filter(msg => msg.timestamp <= 15000).length;
console.assert(visibleMsgs.length === expectedVisible, 'Scrubbing should show correct message count');
```

---

### Requirement: Typing Animation Effect

Messages SHALL appear with a typewriter-style animation that simulates natural conversation flow.

**Acceptance Criteria**:
- [ ] Messages fade in with `opacity` transition
- [ ] Messages slide up with `translateY` transform
- [ ] Animation duration: 300-500ms
- [ ] Respects `prefers-reduced-motion` (instant display if reduced motion preferred)

#### Scenario: Message Appearance Animation

**Given** a new message is scheduled to appear
**When** the timeline reaches the message's timestamp
**Then** the message SHALL fade in from opacity 0 to 1
**And** the message SHALL slide up from `translateY(20px)` to `translateY(0)`
**And** animation SHALL complete within 500ms

**Validation**:
```javascript
// CSS validation
const msgElement = document.querySelector('.dialogue-message:last-child');
const styles = window.getComputedStyle(msgElement);
console.assert(styles.opacity === '1', 'Message should be fully visible');
console.assert(styles.transform.includes('translateY(0'), 'Message should be at final position');
```

---

### Requirement: Playback Controls UI

The system SHALL provide intuitive playback controls with accessibility support.

**Acceptance Criteria**:
- [ ] Play/Pause button with icon toggle
- [ ] Speed selector dropdown (1x, 1.5x, 2x)
- [ ] Timeline scrubber (range input)
- [ ] Replay button
- [ ] Current time / Total time display
- [ ] All controls keyboard accessible
- [ ] ARIA labels on all interactive elements

#### Scenario: Keyboard Navigation

**Given** dialogue player is focused
**When** user presses Space key
**Then** playback SHALL toggle between play and pause
**When** user presses Left Arrow
**Then** timeline SHALL rewind 5 seconds
**When** user presses Right Arrow
**Then** timeline SHALL advance 5 seconds

**Validation**:
```javascript
player.container.focus();
player.container.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
console.assert(player.isPlaying === true, 'Space should start playback');

player.container.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowLeft' }));
console.assert(player.currentTime < previousTime - 4000, 'Left arrow should rewind ~5s');
```

---

### Requirement: Responsive Small Window Mode

On mobile devices, dialogue SHALL display in a compact scrollable window occupying ≤30% of viewport height.

**Acceptance Criteria**:
- [ ] Mobile window max-height: 30vh
- [ ] Font size: 0.8rem (smaller than desktop)
- [ ] Auto-scroll to latest message
- [ ] Minimal controls (play/pause, speed only)
- [ ] Swipe gestures for timeline control

#### Scenario: Mobile Compact Layout

**Given** viewport width is 375px (mobile)
**When** dialogue mode is activated
**Then** dialogue window height SHALL be ≤30vh
**And** message font-size SHALL be 0.8rem
**And** only essential controls SHALL be visible (play/pause, speed)
**And** window SHALL auto-scroll to show latest message

**Validation**:
```javascript
// Simulate mobile viewport
window.resizeTo(375, 667);

const dialogueWindow = document.querySelector('.dialogue-window');
const height = dialogueWindow.offsetHeight;
const vh30 = window.innerHeight * 0.3;

console.assert(height <= vh30, `Dialogue window ${height}px should be ≤30vh (${vh30}px)`);

const messageStyle = window.getComputedStyle(dialogueWindow.querySelector('.dialogue-message'));
const fontSize = parseFloat(messageStyle.fontSize);
console.assert(fontSize <= 13, 'Font size should be ~0.8rem (12.8px)');
```

---

## MODIFIED Requirements

_None_ - This is an additive feature.

---

## REMOVED Requirements

_None_ - This is an additive feature.

---

## Cross-Capability Dependencies

### Depends On:
- `dialogue-data` - Dialogue thread data structure and content
- `gallery-hero` - Existing critique display system for integration

### Used By:
- `thought-chain-visualization` - Visualizes connections between dialogue messages

---

## Test Coverage Matrix

| Requirement | Unit Test | Integration Test | Visual Test | A11y Test | Perf Test |
|-------------|-----------|------------------|-------------|-----------|-----------|
| Dialogue Player | ✅ Timeline | ✅ Full playback | ✅ Screenshots | ✅ Keyboard | ✅ 60fps |
| Typing Animation | ✅ CSS | ✅ Sequence | ✅ Screenshots | ✅ Reduced motion | N/A |
| Playback Controls | ✅ Buttons | ✅ Interaction | ✅ Mobile/desktop | ✅ ARIA labels | N/A |
| Small Window Mode | N/A | ✅ Mobile viewport | ✅ 375px width | ✅ Touch targets | N/A |

---

## Browser Compatibility

**Supported Browsers**:
- Chrome/Edge 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Mobile Safari 14+ ✅
- Chrome Android 90+ ✅

**CSS Features**:
- CSS transforms (`translateY`) - universal support
- CSS transitions - universal support
- CSS custom properties - universal support
- `prefers-reduced-motion` - universal support in target browsers

**JavaScript Features**:
- `requestAnimationFrame` - universal support
- ES6 classes - universal support
- Async/await - universal support in target browsers

---

## Performance Requirements

- **Frame Rate**: 60fps (16ms per frame) during animation playback
- **Timeline Scrubbing**: <50ms response time
- **Mode Switch**: <200ms from static to dialogue mode
- **Memory**: <30MB increase for dialogue data and player
- **Page Load**: <100ms increase for lazy-loaded modules

---

## Accessibility Requirements

- **WCAG 2.1 AA Compliance**: All interactive controls
- **Keyboard Navigation**: Full functionality without mouse
- **Screen Reader**: All controls announced with ARIA labels
- **Reduced Motion**: Animations disabled if `prefers-reduced-motion: reduce`
- **Color Contrast**: All text meets 4.5:1 ratio
- **Touch Targets**: Minimum 44×44px on mobile

---

## Validation Checklist

### Manual QA:
- [ ] Play/pause toggles correctly
- [ ] Speed control affects playback speed
- [ ] Timeline scrubber jumps to correct position
- [ ] Keyboard shortcuts work (Space, Arrow keys)
- [ ] Mobile window stays within 30vh
- [ ] Auto-scroll keeps latest message visible
- [ ] Animations smooth (no jank)

### Automated Testing:
```bash
# Run dialogue playback tests
npm run test:dialogue-player

# Run accessibility tests
npm run test:a11y -- dialogue-player

# Run performance tests
npm run test:perf -- dialogue-player
```

---

## Rollback Criteria

**Trigger Rollback If**:
1. Animation frame rate drops below 30fps
2. Timeline scrubbing response time >200ms
3. Memory usage increase >100MB
4. Critical accessibility violations (WCAG failures)
5. Playback state bugs (infinite loops, stuck states)

**Rollback Steps**:
1. Disable dialogue mode toggle
2. Remove dialogue-player.js module
3. Revert gallery-hero.js integration
4. Clear localStorage dialogue preferences
