# Tasks: Add Critic Dialogue and Thought Chain Visualization

**Change ID**: `add-critic-dialogue-and-thought-chain`
**Total Estimated Time**: 27-35 hours

---

## Phase 1: Dialogue Content Generation (3-4 hours)

### Task 1.1: Generate Artwork-1 Dialogue Threads
**Estimated Time**: 45 minutes
**Files**: New - `dialogues-artwork-1.json` (temporary)

**Steps**:
1. Read artwork-1 data and all 6 existing critiques
2. Use Claude Code to generate 6 dialogue threads:
   - Thread 1: "笔法与机械运动 / Brushwork and Mechanical Movement" (Su Shi, Guo Xi, AI Ethics)
   - Thread 2: "心性与程序性 / Spirit vs. Programmatic Nature" (Su Shi, John Ruskin, Mama Zola)
   - Thread 3: "人机协作的未来 / Future of Human-Machine Collaboration" (AI Ethics, Professor Petrova, Guo Xi)
   - Thread 4: "传统与技术的对话 / Dialogue Between Tradition and Technology" (Guo Xi, John Ruskin, Professor Petrova)
   - Thread 5: "美学自主性问题 / Question of Aesthetic Autonomy" (Su Shi, AI Ethics, John Ruskin)
   - Thread 6: "文化传承的新形式 / New Forms of Cultural Transmission" (Mama Zola, Guo Xi, Su Shi)
3. Each thread: 5-6 messages, ~400-500 words
4. Save to temporary JSON file

**Success Criteria**:
- [ ] 6 threads generated
- [ ] Each thread has 5-6 messages
- [ ] All personas maintain voice consistency
- [ ] Bilingual content (Chinese + English)

**Validation**:
```bash
# Check word count
cat dialogues-artwork-1.json | jq '.[] | .messages | length'
# Should output: 5, 6, 5, 6, 5, 6 (or similar)
```

---

### Task 1.2: Generate Artwork-2 Dialogue Threads
**Estimated Time**: 45 minutes
**Files**: New - `dialogues-artwork-2.json` (temporary)

**Steps**:
1. Read artwork-2 data and critiques
2. Generate 6 dialogue threads (topics adapted to artwork-2)
3. Save to temporary JSON file

---

### Task 1.3: Generate Artwork-3 Dialogue Threads
**Estimated Time**: 45 minutes
**Files**: New - `dialogues-artwork-3.json` (temporary)

---

### Task 1.4: Generate Artwork-4 Dialogue Threads
**Estimated Time**: 45 minutes
**Files**: New - `dialogues-artwork-4.json` (temporary)

---

### Task 1.5: Quality Review and Consolidation
**Estimated Time**: 30 minutes
**Files**: All temporary JSON files

**Steps**:
1. Review all 24 threads for:
   - Persona voice consistency
   - Conversation flow (natural progression)
   - Bilingual quality (no translation artifacts)
   - Interaction type accuracy
2. Make manual edits as needed
3. Consolidate into single data structure

**Success Criteria**:
- [ ] All threads reviewed
- [ ] No voice inconsistencies
- [ ] All timestamps ascending
- [ ] All `replyTo` fields valid

---

## Phase 2: Core Data Structure Implementation (1 hour)

### Task 2.1: Create Dialogue Data Module
**Estimated Time**: 30 minutes
**Files**: New - `js/data/dialogues.js`

**Steps**:
1. Create ES6 module file
2. Define TypeScript-style JSDoc interfaces
3. Import consolidated dialogue data
4. Export `DIALOGUE_THREADS` array
5. Add data validation function

**Code**:
```javascript
/**
 * @typedef {Object} DialogueMessage
 * @property {string} id
 * @property {string} personaId
 * @property {string} textZh
 * @property {string} textEn
 * @property {number} timestamp
 * @property {string|null} replyTo
 * @property {string} interactionType
 * @property {string} [quotedText]
 */

/**
 * @typedef {Object} DialogueThread
 * @property {string} id
 * @property {string} artworkId
 * @property {string} topic
 * @property {string} topicEn
 * @property {string[]} participants
 * @property {DialogueMessage[]} messages
 */

/** @type {DialogueThread[]} */
export const DIALOGUE_THREADS = [
  // ... paste generated data
];
```

**Success Criteria**:
- [ ] File created with proper structure
- [ ] JSDoc types defined
- [ ] Data exports correctly
- [ ] No syntax errors

---

### Task 2.2: Integrate Dialogue Data into Main Data Module
**Estimated Time**: 15 minutes
**Files**: `js/data.js`

**Steps**:
1. Import `dialogues.js`
2. Add to `window.VULCA_DATA` object:
   ```javascript
   window.VULCA_DATA.dialogues = DIALOGUE_THREADS;
   ```
3. Add helper functions:
   ```javascript
   function getDialoguesForArtwork(artworkId) {
     return DIALOGUE_THREADS.filter(t => t.artworkId === artworkId);
   }
   ```

**Success Criteria**:
- [ ] Dialogues accessible via `window.VULCA_DATA.dialogues`
- [ ] Helper functions work correctly
- [ ] No console errors on page load

---

### Task 2.3: Data Validation Script
**Estimated Time**: 15 minutes
**Files**: New - `scripts/validate-dialogues.js`

**Steps**:
1. Create Node.js validation script
2. Check all required fields present
3. Verify timestamps ascending
4. Validate `replyTo` references
5. Check interaction types are valid

**Success Criteria**:
- [ ] Script runs without errors
- [ ] All validation checks pass
- [ ] Can be run in CI/CD pipeline

---

## Phase 3: Dialogue Player Component (6-8 hours)

### Task 3.1: Create DialoguePlayer Class Skeleton
**Estimated Time**: 1 hour
**Files**: New - `js/components/dialogue-player.js`

**Steps**:
1. Create ES6 class `DialoguePlayer`
2. Constructor accepts `(dialogueThread, container, options)`
3. Define state properties:
   ```javascript
   this.thread = dialogueThread;
   this.currentTime = 0;
   this.speed = 1.0;
   this.isPlaying = false;
   this.lastFrameTime = 0;
   ```
4. Add method stubs: `play()`, `pause()`, `setSpeed()`, `scrubTo()`, `reset()`

**Success Criteria**:
- [ ] Class defined with constructor
- [ ] All method stubs present
- [ ] Can instantiate without errors

---

### Task 3.2: Implement Timeline Management
**Estimated Time**: 1.5 hours
**Files**: `js/components/dialogue-player.js`

**Steps**:
1. Implement `animate()` method using `requestAnimationFrame`
2. Calculate elapsed time based on `speed`
3. Implement `checkTimeline()` to trigger message rendering
4. Add `play()`, `pause()`, `resume()` logic

**Code**:
```javascript
animate() {
  if (!this.isPlaying) return;

  const now = performance.now();
  const deltaTime = now - this.lastFrameTime;
  this.currentTime += deltaTime * this.speed;

  this.checkTimeline(this.currentTime);
  this.updateProgressBar();

  this.lastFrameTime = now;
  this.rafId = requestAnimationFrame(() => this.animate());
}

checkTimeline(time) {
  this.thread.messages.forEach(msg => {
    if (msg.timestamp <= time && !msg.rendered) {
      this.renderMessage(msg);
      msg.rendered = true;
    }
  });
}
```

**Success Criteria**:
- [ ] Timeline advances at correct speed
- [ ] Messages appear at correct timestamps
- [ ] Play/pause works correctly

---

### Task 3.3: Implement Message Rendering
**Estimated Time**: 2 hours
**Files**: `js/components/dialogue-player.js`

**Steps**:
1. Implement `renderMessage(message)` method
2. Create message DOM element
3. Add typing animation CSS class
4. Handle bilingual text (check current language)
5. Add interaction badge
6. Auto-scroll to latest message

**Code**:
```javascript
renderMessage(message) {
  const persona = this.getPersona(message.personaId);
  const lang = document.documentElement.getAttribute('data-lang') || 'zh';

  const msgEl = document.createElement('div');
  msgEl.className = 'dialogue-message';
  msgEl.dataset.messageId = message.id;
  msgEl.dataset.personaId = message.personaId;

  msgEl.innerHTML = `
    <div class="message-header">
      <span class="message-author" style="color: ${persona.color}">
        ${lang === 'en' ? persona.nameEn : persona.nameZh}
      </span>
      <span class="interaction-badge ${message.interactionType}">
        ${this.getInteractionLabel(message.interactionType, lang)}
      </span>
    </div>
    <div class="message-content">
      ${lang === 'en' ? message.textEn : message.textZh}
    </div>
  `;

  // Add quote block if present
  if (message.quotedText) {
    const quoteEl = this.createQuoteBlock(message);
    msgEl.querySelector('.message-content').prepend(quoteEl);
  }

  // Animate in
  msgEl.classList.add('appearing');
  this.container.appendChild(msgEl);

  setTimeout(() => {
    msgEl.classList.remove('appearing');
    msgEl.classList.add('visible');
  }, 10);

  // Auto-scroll
  msgEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
```

**Success Criteria**:
- [ ] Messages render with correct persona styling
- [ ] Animation plays smoothly
- [ ] Bilingual switching works
- [ ] Auto-scroll keeps latest message visible

---

### Task 3.4: Implement Playback Controls UI
**Estimated Time**: 1.5 hours
**Files**: `js/components/dialogue-player.js`, `styles/components/dialogue-player.css`

**Steps**:
1. Create controls HTML structure
2. Add Play/Pause button with toggle icon
3. Add speed selector (1x, 1.5x, 2x dropdown)
4. Add timeline scrubber (range input)
5. Add current/total time display
6. Wire up event listeners

**HTML Structure**:
```html
<div class="dialogue-controls">
  <button class="play-pause-btn" aria-label="Play dialogue">
    <svg class="icon-play">...</svg>
    <svg class="icon-pause" hidden>...</svg>
  </button>
  <div class="timeline-container">
    <input type="range" class="timeline-scrubber" min="0" max="100" value="0" />
    <div class="timeline-progress"></div>
  </div>
  <select class="speed-selector" aria-label="Playback speed">
    <option value="1.0">1x</option>
    <option value="1.5">1.5x</option>
    <option value="2.0">2x</option>
  </select>
  <div class="time-display">
    <span class="current-time">0:00</span> / <span class="total-time">0:30</span>
  </div>
  <button class="replay-btn" aria-label="Replay dialogue">
    <svg class="icon-replay">...</svg>
  </button>
</div>
```

**Success Criteria**:
- [ ] All controls functional
- [ ] Play/pause toggles icon
- [ ] Speed selector changes playback speed
- [ ] Scrubber updates during playback
- [ ] Scrubbing jumps to correct position

---

### Task 3.5: Implement Keyboard Shortcuts
**Estimated Time**: 1 hour
**Files**: `js/components/dialogue-player.js`

**Steps**:
1. Add `keydown` event listener on container
2. Implement shortcuts:
   - Space: play/pause
   - Left/Right Arrow: scrub ±5s
   - Home/End: jump to start/end
   - 1/2/3: set speed
   - Escape: exit dialogue mode

**Code**:
```javascript
handleKeydown(e) {
  switch(e.code) {
    case 'Space':
      e.preventDefault();
      this.togglePlayPause();
      break;
    case 'ArrowLeft':
      e.preventDefault();
      this.scrubBy(-5000);
      break;
    case 'ArrowRight':
      e.preventDefault();
      this.scrubBy(5000);
      break;
    case 'Home':
      this.scrubTo(0);
      break;
    case 'End':
      this.scrubTo(this.getTotalDuration());
      break;
    case 'Digit1':
      this.setSpeed(1.0);
      break;
    case 'Digit2':
      this.setSpeed(1.5);
      break;
    case 'Digit3':
      this.setSpeed(2.0);
      break;
    case 'Escape':
      this.exitDialogueMode();
      break;
  }
}
```

**Success Criteria**:
- [ ] All shortcuts work
- [ ] No conflicts with browser shortcuts
- [ ] Shortcuts only active when player focused

---

## Phase 4: Thought Chain Visualization (8-10 hours)

### Task 4.1: Create ThoughtChainVisualizer Class
**Estimated Time**: 1 hour
**Files**: New - `js/components/thought-chain-visualizer.js`

**Steps**:
1. Create ES6 class
2. Constructor accepts `(dialogueThread, critiqueContainer)`
3. Initialize SVG overlay for connection lines
4. Define interaction type color map

**Success Criteria**:
- [ ] Class instantiates correctly
- [ ] SVG overlay created
- [ ] Color map defined

---

### Task 4.2: Implement Connection Line Drawing
**Estimated Time**: 3 hours
**Files**: `js/components/thought-chain-visualizer.js`

**Steps**:
1. Calculate positions of source and target critic cards
2. Generate SVG path (use quadratic bezier curve for smooth curves)
3. Add arrow markers
4. Animate stroke-dashoffset for draw-in effect
5. Color-code by interaction type

**Code**:
```javascript
drawConnectionLine(fromPersonaId, toPersonaId, interactionType) {
  const fromCard = document.querySelector(`.critique-panel[data-persona-id="${fromPersonaId}"]`);
  const toCard = document.querySelector(`.critique-panel[data-persona-id="${toPersonaId}"]`);

  const fromRect = fromCard.getBoundingClientRect();
  const toRect = toCard.getBoundingClientRect();

  // Calculate center points
  const x1 = fromRect.left + fromRect.width / 2;
  const y1 = fromRect.bottom;
  const x2 = toRect.left + toRect.width / 2;
  const y2 = toRect.top;

  // Control point for quadratic bezier
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', `M ${x1},${y1} Q ${cx},${cy} ${x2},${y2}`);
  path.setAttribute('class', `connection-line ${interactionType}`);
  path.setAttribute('stroke', this.getColorForType(interactionType));
  path.setAttribute('data-from', fromPersonaId);
  path.setAttribute('data-to', toPersonaId);

  this.svgOverlay.appendChild(path);

  // Trigger animation
  setTimeout(() => path.classList.add('drawn'), 10);
}
```

**Success Criteria**:
- [ ] Lines connect correct cards
- [ ] Curves look smooth
- [ ] Animation plays correctly
- [ ] Color-coding works

---

### Task 4.3: Implement Quote Block Rendering
**Estimated Time**: 2 hours
**Files**: `js/components/thought-chain-visualizer.js`

**Steps**:
1. Detect `quotedText` in messages
2. Create `<blockquote>` element
3. Add source attribution with `<cite>`
4. Style with source persona's color
5. Add click handler to scroll to original

**Code**:
```javascript
createQuoteBlock(message) {
  const sourcePersona = this.getPersona(message.replyTo);
  const lang = document.documentElement.getAttribute('data-lang') || 'zh';

  const blockquote = document.createElement('blockquote');
  blockquote.className = 'quoted-text';
  blockquote.style.borderLeftColor = sourcePersona.color;

  const cite = document.createElement('cite');
  cite.textContent = lang === 'en' ? `${sourcePersona.nameEn}:` : `${sourcePersona.nameZh}：`;

  blockquote.appendChild(cite);
  blockquote.appendChild(document.createTextNode(` "${message.quotedText}"`));

  // Click to scroll to original
  blockquote.style.cursor = 'pointer';
  blockquote.addEventListener('click', () => {
    this.scrollToPersonaMessage(message.replyTo);
  });

  return blockquote;
}
```

**Success Criteria**:
- [ ] Quote blocks appear correctly
- [ ] Border color matches source persona
- [ ] Click navigation works

---

### Task 4.4: Implement Interaction Tags/Badges
**Estimated Time**: 2 hours
**Files**: `js/components/thought-chain-visualizer.js`, `styles/components/dialogue-badges.css`

**Steps**:
1. Create badge element for each interaction type
2. Add bilingual text
3. Style with interaction type color
4. Add hover tooltips
5. Add click handler to jump to referenced message

**Code**:
```javascript
createInteractionBadge(message) {
  const lang = document.documentElement.getAttribute('data-lang') || 'zh';
  const badge = document.createElement('span');
  badge.className = `interaction-badge ${message.interactionType}`;
  badge.textContent = this.getInteractionLabel(message.interactionType, lang);
  badge.setAttribute('title', this.getInteractionTooltip(message.interactionType, lang));

  // Click to jump to referenced message
  if (message.replyTo) {
    badge.style.cursor = 'pointer';
    badge.addEventListener('click', () => {
      this.scrollToPersonaMessage(message.replyTo);
    });
  }

  return badge;
}

getInteractionLabel(type, lang) {
  const labels = {
    'initial': { zh: '开启', en: 'Initial' },
    'agree-extend': { zh: '赞同', en: 'Agrees' },
    'question-challenge': { zh: '质疑', en: 'Questions' },
    'synthesize': { zh: '综合', en: 'Synthesizes' },
    'counter': { zh: '反驳', en: 'Counters' },
    'reflect': { zh: '反思', en: 'Reflects' }
  };
  return labels[type][lang];
}
```

**Success Criteria**:
- [ ] Badges appear on all messages
- [ ] Colors match interaction types
- [ ] Tooltips show explanations
- [ ] Click navigation works

---

### Task 4.5: Implement Hover Previews on Connection Lines
**Estimated Time**: 1 hour
**Files**: `js/components/thought-chain-visualizer.js`, `styles/components/dialogue-lines.css`

**Steps**:
1. Add `mouseenter` listener on SVG paths
2. Show tooltip with message snippet
3. Position tooltip near cursor
4. Hide on `mouseleave`

**Success Criteria**:
- [ ] Hover shows preview
- [ ] Preview positioned correctly
- [ ] No flickering

---

## Phase 5: Responsive Dialogue Window (4-5 hours)

### Task 5.1: Create DialogueWindow Component
**Estimated Time**: 1.5 hours
**Files**: New - `js/components/dialogue-window.js`

**Steps**:
1. Create wrapper component for dialogue player
2. Handle desktop vs mobile layouts
3. Add mode toggle functionality
4. Implement auto-scroll for small window

**Success Criteria**:
- [ ] Component wraps dialogue player
- [ ] Responsive to viewport size
- [ ] Toggle button works

---

### Task 5.2: Desktop Layout Styling
**Estimated Time**: 1 hour
**Files**: `styles/components/dialogue-window.css`

**Steps**:
1. Side-by-side layout (artwork 60% | dialogue 40%)
2. Full-height dialogue panel
3. Sticky controls at bottom
4. Smooth transitions

**CSS**:
```css
@media (min-width: 1024px) {
  .dialogue-mode .gallery-hero {
    display: grid;
    grid-template-columns: 60% 40%;
    gap: var(--spacing-lg);
  }

  .dialogue-window {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
  }
}
```

**Success Criteria**:
- [ ] Layout correct on desktop (≥1024px)
- [ ] Dialogue scrollable independently
- [ ] No layout shifts

---

### Task 5.3: Mobile Compact Layout Styling
**Estimated Time**: 1.5 hours
**Files**: `styles/components/dialogue-window.css`

**Steps**:
1. Small window (max-height: 30vh)
2. Smaller font (0.8rem)
3. Minimal controls (play/pause, speed only)
4. Auto-scrolling stream
5. Swipe gestures for timeline control

**CSS**:
```css
@media (max-width: 767px) {
  .dialogue-window {
    max-height: 30vh;
    font-size: 0.8rem;
    overflow-y: auto;
  }

  .dialogue-controls {
    padding: 4px 8px;
  }

  .timeline-container,
  .time-display,
  .replay-btn {
    display: none; /* Hide on mobile */
  }
}
```

**Success Criteria**:
- [ ] Window ≤30vh on mobile
- [ ] Font size 0.8rem
- [ ] Minimal controls visible
- [ ] Touch-friendly

---

### Task 5.4: Implement Swipe Gestures (Mobile)
**Estimated Time**: 1 hour
**Files**: `js/components/dialogue-window.js`

**Steps**:
1. Add `touchstart`, `touchmove`, `touchend` listeners
2. Detect swipe left/right
3. Trigger scrub forward/backward
4. Prevent default scroll during swipe

**Success Criteria**:
- [ ] Swipe left advances timeline
- [ ] Swipe right rewinds timeline
- [ ] No conflict with scroll

---

## Phase 6: Integration & Testing (3-4 hours)

### Task 6.1: Integrate Dialogue Player into Gallery Hero
**Estimated Time**: 1 hour
**Files**: `js/gallery-hero.js`

**Steps**:
1. Import dialogue components
2. Add "💬 Try Dialogue Mode" button
3. Implement mode toggle logic
4. Hide/show critique cards based on mode
5. Save preference to `localStorage`

**Code**:
```javascript
function initDialogueMode(artwork) {
  const dialogues = getDialoguesForArtwork(artwork.id);
  if (dialogues.length === 0) return;

  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = '💬 Try Dialogue Mode';
  toggleBtn.className = 'dialogue-mode-toggle';

  toggleBtn.addEventListener('click', () => {
    const currentMode = document.body.dataset.viewMode || 'static';
    const newMode = currentMode === 'static' ? 'dialogue' : 'static';
    setViewMode(newMode);
  });

  container.appendChild(toggleBtn);
}

function setViewMode(mode) {
  document.body.dataset.viewMode = mode;
  localStorage.setItem('critique-view-mode', mode);

  if (mode === 'dialogue') {
    renderDialogueView();
  } else {
    renderStaticCritiques();
  }
}
```

**Success Criteria**:
- [ ] Toggle button appears
- [ ] Mode switching works
- [ ] Preference persists

---

### Task 6.2: Cross-Browser Testing
**Estimated Time**: 1 hour

**Browsers to Test**:
- Chrome 120+ (Windows/Mac)
- Firefox 120+ (Windows/Mac)
- Safari 17+ (Mac/iOS)
- Edge 120+ (Windows)
- Chrome Android (Mobile)

**Test Cases**:
- [ ] Dialogue playback works on all browsers
- [ ] SVG connections render correctly
- [ ] Animations smooth (60fps)
- [ ] Keyboard shortcuts work
- [ ] Mobile layout correct

---

### Task 6.3: Performance Optimization
**Estimated Time**: 1 hour
**Files**: Various

**Steps**:
1. Use Chrome DevTools Performance panel
2. Identify bottlenecks
3. Optimize:
   - Use `will-change` on animated elements
   - Debounce scroll events
   - Virtual scrolling for long dialogues
4. Measure frame rate during animation

**Target Metrics**:
- [ ] 60fps during animation
- [ ] <200ms mode switch
- [ ] <50ms scrubbing response

---

### Task 6.4: Accessibility Testing
**Estimated Time**: 1 hour

**Tools**: VoiceOver (Mac), NVDA (Windows), axe DevTools

**Test Cases**:
- [ ] All controls keyboard accessible
- [ ] Screen reader announces messages
- [ ] ARIA labels correct
- [ ] Color contrast ≥4.5:1
- [ ] Reduced motion respected
- [ ] Touch targets ≥44px on mobile

---

## Phase 7: Content Refinement and Polish (2-3 hours)

### Task 7.1: Dialogue Quality Review
**Estimated Time**: 1 hour

**Steps**:
1. Read through all 24 dialogue threads
2. Check persona voice consistency
3. Verify conversation flow
4. Fix any awkward transitions
5. Ensure bilingual quality

**Success Criteria**:
- [ ] All dialogues sound natural
- [ ] No voice inconsistencies
- [ ] No translation artifacts

---

### Task 7.2: Visual Polish
**Estimated Time**: 1 hour
**Files**: CSS files

**Steps**:
1. Refine animations (timing, easing)
2. Adjust colors for better contrast
3. Polish interaction badges
4. Improve mobile layout spacing
5. Add loading states

**Success Criteria**:
- [ ] Animations feel smooth
- [ ] Visual hierarchy clear
- [ ] Mobile layout comfortable

---

### Task 7.3: Documentation
**Estimated Time**: 30 minutes
**Files**: `CLAUDE.md`, `README.md`

**Steps**:
1. Update `CLAUDE.md` with dialogue system documentation
2. Add usage guide for dialogue mode
3. Document keyboard shortcuts
4. Add troubleshooting section

---

### Task 7.4: Final Testing and Validation
**Estimated Time**: 30 minutes

**Steps**:
1. Run `openspec validate add-critic-dialogue-and-thought-chain --strict`
2. Test all features end-to-end
3. Check console for errors
4. Verify all acceptance criteria met

**Success Criteria**:
- [ ] OpenSpec validation passes
- [ ] No console errors
- [ ] All features work as specified

---

## Task Dependencies

```
Phase 1 (Content Gen) → Phase 2 (Data Structure)
                              ↓
                        Phase 3 (Player) + Phase 4 (Visualization)
                              ↓
                        Phase 5 (Responsive Window)
                              ↓
                        Phase 6 (Integration)
                              ↓
                        Phase 7 (Polish)
```

**Parallelizable Tasks**:
- Phase 3 (Player) and Phase 4 (Visualization) can be developed in parallel
- Content generation tasks (1.1-1.4) can be done concurrently
- Browser testing (6.2) can be distributed across multiple people

---

## Definition of Done

- [ ] All 7 phases completed
- [ ] 20-24 dialogue threads generated and validated
- [ ] Dialogue player works with play/pause/speed/scrub
- [ ] Connection lines, quotes, and badges render correctly
- [ ] Responsive layouts work on desktop and mobile
- [ ] All keyboard shortcuts functional
- [ ] Accessibility tests pass (WCAG 2.1 AA)
- [ ] Performance targets met (60fps, <200ms switch)
- [ ] Cross-browser testing complete (5 browsers)
- [ ] Documentation updated
- [ ] OpenSpec validation passes with `--strict`
