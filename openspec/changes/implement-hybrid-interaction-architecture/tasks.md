# OpenSpec Tasks: Implement Hybrid Interaction Architecture

**Change ID:** `implement-hybrid-interaction-architecture`
**Total Effort:** 21-25 days across 4 weeks
**Success Metric:** 60fps with 1920 particles, all three layers functional

---

## Phase 1: Week 3 - Layer 1 (Gallery Walk) + Layer 3 (Auto-Play)

**Duration:** 6-9 hours
**Deliverable:** Auto-cycling regions with sequential particle fade-in/out

### P1.1 ParticleSystem.js - Add Fade Animation Properties
**Status:** ☐ Pending
**Estimated:** 1 hour

**Tasks:**
- [ ] Add `fadeAlpha: 0` property (initial)
- [ ] Add `sequenceIndex: 0` property
- [ ] Add `regionFocused: false` property
- [ ] Add `prominenceLevel: 0.05` property
- [ ] Add `baseProminence: 0.05` (constant)
- [ ] Verify all properties initialize in constructor

**Code Changes:**
```javascript
// In ParticleSystem constructor
this.fadeAlpha = 0;
this.sequenceIndex = 0;
this.regionFocused = false;
this.prominenceLevel = 0.05;
this.baseProminence = 0.05;
```

**Validation:**
- [ ] No errors on instantiation
- [ ] Properties accessible via `system.fadeAlpha` etc.
- [ ] 24 systems created with correct initial values

**Git Commit:** `feat: Add fade and prominence properties to ParticleSystem`

---

### P1.2 ParticleSystem.js - Update render() with finalAlpha
**Status:** ☐ Pending
**Estimated:** 1.5 hours

**Tasks:**
- [ ] Calculate `finalAlpha = fadeAlpha × (baseProminence + prominenceLevel × 0.95)`
- [ ] Modify `render()` to use `finalAlpha` instead of direct alpha
- [ ] Add early return if `finalAlpha < 0.01` (skip rendering)
- [ ] Apply `finalAlpha` to each particle's alpha in graphics rendering
- [ ] Modify `renderWithGlow()` to use same `finalAlpha` calculation
- [ ] Test with varying fadeAlpha (0, 0.5, 1.0)

**Code Changes:**
```javascript
render() {
  // Calculate final alpha for this frame
  this.finalAlpha = this.fadeAlpha *
    (this.baseProminence + this.prominenceLevel * 0.95);

  if (this.finalAlpha < 0.01) {
    this.displayContainer.removeChildren();
    return;
  }

  // ... existing code ...

  this.particles.forEach(particle => {
    const alpha = particle.alpha * particle.lifespan * this.finalAlpha;  // ← Use finalAlpha
    // ... render particle ...
  });
}
```

**Validation:**
- [ ] Particles visible when fadeAlpha=1, prominence=1 (100%)
- [ ] Particles at baseline when fadeAlpha=0 (5% baseline)
- [ ] Smooth alpha transition with sequential updates
- [ ] No visual artifacts or popping

**Git Commit:** `feat: Implement finalAlpha blending in ParticleSystem render()`

---

### P1.3 ExhibitionLayout.js - Add Region Tracking
**Status:** ☐ Pending
**Estimated:** 1 hour

**Tasks:**
- [ ] Add `hoveredRegion: null` property
- [ ] Add `regionSystems: Map` to store 6 systems per region
- [ ] Create `handleRegionHover(regionKey, isHovering)` method
- [ ] Map all 24 particle systems to their regions (6 per region)
- [ ] Hook hitArea events to call `handleRegionHover()`
- [ ] Test region detection with cursor movement

**Code Changes:**
```javascript
class ExhibitionLayout {
  constructor(renderer) {
    // ... existing ...
    this.hoveredRegion = null;
    this.regionSystems = {
      'artwork_1': [],
      'artwork_2': [],
      'artwork_3': [],
      'artwork_4': []
    };
  }

  handleRegionHover(regionKey, isHovering) {
    this.hoveredRegion = isHovering ? regionKey : null;

    const systems = this.regionSystems[regionKey];
    if (systems) {
      systems.forEach(system => {
        system.regionFocused = isHovering;
      });
    }
  }

  addSystemToRegion(regionKey, system) {
    if (this.regionSystems[regionKey]) {
      this.regionSystems[regionKey].push(system);
    }
  }
}
```

**Validation:**
- [ ] `regionSystems` has exactly 24 systems (6×4)
- [ ] Hovering region A sets that region's systems to `regionFocused=true`
- [ ] Leaving region A sets `regionFocused=false`
- [ ] Only one region's systems have `regionFocused=true` at a time

**Git Commit:** `feat: Add region tracking and hover detection to ExhibitionLayout`

---

### P1.4 AutoPlayManager.js - New File Creation
**Status:** ☐ Pending
**Estimated:** 1.5 hours

**Tasks:**
- [ ] Create `vulca-exhibition/js/exhibition/AutoPlayManager.js`
- [ ] Implement constructor with regions, currentIndex, timer, phaseTime, isEnabled
- [ ] Implement `update(delta)` method for timer management
- [ ] Implement `advanceRegion()` for cycling to next region
- [ ] Implement `updateProminence()` to fade prominence up/down
- [ ] Implement `pause()` and `resume()` methods
- [ ] Test progression through all 4 regions

**Code Changes:**
```javascript
class AutoPlayManager {
  constructor(layout) {
    this.regions = ['artwork_1', 'artwork_2', 'artwork_3', 'artwork_4'];
    this.currentIndex = 0;
    this.timer = 0;
    this.phaseTime = 15000;  // 15 seconds per region
    this.isEnabled = true;
    this.layout = layout;
  }

  update(delta) {
    if (!this.isEnabled) return;

    this.timer += delta;

    if (this.timer >= this.phaseTime) {
      this.advanceRegion();
    }

    this.updateProminence();
  }

  advanceRegion() {
    this.currentIndex = (this.currentIndex + 1) % this.regions.length;
    this.timer = 0;
    this.layout.handleRegionHover(this.regions[this.currentIndex], true);
  }

  updateProminence() {
    this.regions.forEach((region, idx) => {
      const systems = this.layout.regionSystems[region];
      if (!systems) return;

      systems.forEach(system => {
        if (idx === this.currentIndex) {
          system.prominenceLevel = Math.min(1, system.prominenceLevel + 0.02);
        } else {
          system.prominenceLevel = Math.max(0.05, system.prominenceLevel - 0.02);
        }
      });
    });
  }

  pause() {
    this.isEnabled = false;
    this.timer = 0;
  }

  resume() {
    this.isEnabled = true;
  }
}

window.AutoPlayManager = AutoPlayManager;
```

**Validation:**
- [ ] Constructor initializes all properties
- [ ] Timer increments correctly
- [ ] Region advances every 15 seconds
- [ ] Prominence values stay in [0.05, 1.0] range
- [ ] pause() stops cycling, resume() restarts
- [ ] No console errors

**Git Commit:** `feat: Create AutoPlayManager for automatic region cycling`

---

### P1.5 index.html - Load AutoPlayManager
**Status:** ☐ Pending
**Estimated:** 30 minutes

**Tasks:**
- [ ] Add `<script src="./js/exhibition/AutoPlayManager.js"></script>` before `app.js`
- [ ] Verify script loads (check network tab)
- [ ] Test instantiation: `new AutoPlayManager(layout)` works

**Validation:**
- [ ] Network request for AutoPlayManager.js returns [200]
- [ ] No "AutoPlayManager is not defined" errors
- [ ] Accessible as `window.AutoPlayManager`

**Git Commit:** `feat: Load AutoPlayManager in HTML`

---

### P1.6 app.js - Initialize and Integrate AutoPlayManager
**Status:** ☐ Pending
**Estimated:** 2 hours

**Tasks:**
- [ ] In `VulcaExhibition.init()`, after creating layout:
  - [ ] Instantiate `this.autoPlayManager = new AutoPlayManager(this.layout)`
  - [ ] Call `layout.addSystemToRegion()` for each of 24 systems
- [ ] In `startAnimationLoop()`, replace current rendering logic:
  - [ ] Add `this.autoPlayManager.update(1)` at frame start
  - [ ] Implement Layer 1 fade logic:
    - [ ] If `system.regionFocused && fadeAlpha < 1`:  `fadeAlpha += 0.02`
    - [ ] If `!system.regionFocused && fadeAlpha > 0`: `fadeAlpha -= 0.01`
- [ ] Replace `enableDemoMode()` call with AutoPlayManager initialization
- [ ] Update `handleParticleInteraction()` to pause auto-play
- [ ] Add 3-second inactivity timer to resume auto-play

**Code Changes:**
```javascript
// In init()
this.autoPlayManager = new AutoPlayManager(this.layout);

// In startAnimationLoop()
const animate = () => {
  this.time += 1;

  // Layer 3: Update auto-play
  this.autoPlayManager.update(1);

  // Layer 1: Update fade animations
  Object.values(this.particleSystems).forEach(system => {
    if (system.regionFocused && !system.isActive) {
      system.fadeAlpha = Math.min(1, system.fadeAlpha + 0.02);
      system.isActive = true;
    } else if (!system.regionFocused && system.fadeAlpha > 0) {
      system.fadeAlpha = Math.max(0, system.fadeAlpha - 0.01);
      if (system.fadeAlpha === 0) {
        system.isActive = false;
      }
    }

    // Render
    if (system.isActive) {
      system.render();
    }
  });

  this.animationFrameId = requestAnimationFrame(animate);
};
```

**Validation:**
- [ ] AutoPlayManager instantiated without errors
- [ ] Page load → Artwork 1 auto-fades in
- [ ] 15 seconds → auto-advances to Artwork 2
- [ ] FPS remains ≥60
- [ ] No memory leaks (DevTools memory profiler)

**Git Commit:** `feat: Integrate AutoPlayManager and Layer 1 fade logic in animation loop`

---

### P1.7 InteractionManager.js - Pause/Resume on Hover
**Status:** ☐ Pending
**Estimated:** 1 hour

**Tasks:**
- [ ] In `handleMouseMove()`, call `app.autoPlayManager.pause()` when hovering
- [ ] Track last interaction time
- [ ] Implement 3-second inactivity timer
- [ ] Resume auto-play after 3 seconds of no interaction
- [ ] Test pause/resume cycle

**Code Changes:**
```javascript
class InteractionManager {
  constructor(app, layout) {
    this.app = app;
    this.lastInteractionTime = Date.now();
  }

  handleMouseMove(x, y) {
    const region = this.getRegionAtPoint(x, y);

    if (region) {
      this.app.autoPlayManager.pause();
      this.lastInteractionTime = Date.now();
      // ... rest of hover logic ...
    }
  }

  checkResumeAutoPlay() {
    const now = Date.now();
    if (now - this.lastInteractionTime >= 3000) {
      this.app.autoPlayManager.resume();
    }
  }
}

// In animation loop
this.interactionManager.checkResumeAutoPlay();
```

**Validation:**
- [ ] Hovering pauses auto-play
- [ ] 3 seconds without hover → resumes auto-play
- [ ] No jarring transitions when resuming

**Git Commit:** `feat: Add pause/resume logic for auto-play on hover`

---

### P1.8 CSS - Interaction Feedback
**Status:** ☐ Pending
**Estimated:** 1 hour

**Tasks:**
- [ ] Add hover cursor change (pointer on regions)
- [ ] Add subtle visual feedback on region hover (border/glow)
- [ ] Update region hitArea CSS visibility (if needed)
- [ ] Test on 3+ screen sizes

**Code Changes:**
```css
.exhibition-region {
  cursor: pointer;
  transition: opacity 0.3s ease-out;
}

.exhibition-region:hover {
  opacity: 1.1;  /* or filter: drop-shadow */
}
```

**Validation:**
- [ ] Cursor changes to pointer on hover
- [ ] Visual feedback is clear but subtle
- [ ] No layout shift

**Git Commit:** `feat: Add CSS hover feedback for exhibition regions`

---

### P1.9 Playwright MCP Verification
**Status:** ☐ Pending
**Estimated:** 2 hours

**Tests to Run:**

**Test 1.1: Auto-Play Cycling**
```javascript
// Navigate to local or deployed site
await page.goto('http://localhost:8080/vulca-exhibition/');

// Wait 2 seconds, take screenshot (T=0s)
await page.waitForTimeout(2000);
let screenshot1 = await page.screenshot();  // Artwork 1 visible

// Wait 15 seconds
await page.waitForTimeout(15000);
let screenshot2 = await page.screenshot();  // Artwork 2 visible, 1 fading out

// Wait 30 seconds more
await page.waitForTimeout(30000);
let screenshot3 = await page.screenshot();  // Back to Artwork 1 or 3 visible
```

**Test 1.2: Region Hover**
```javascript
// Move cursor to Artwork 2 region
await page.mouse.move(900, 300);  // Center of Artwork 2
await page.waitForTimeout(1000);
let screenshotHover = await page.screenshot();  // Only Artwork 2 bright

// Check that auto-play is paused
// (Can verify via internal state if accessible)
```

**Test 1.3: Console Verification**
```javascript
// Check no errors
let errors = await page.evaluate(() => {
  let logs = window.errorLogs || [];
  return logs.filter(e => e.level === 'error');
});
expect(errors.length).toBe(0);

// Check particle counts
let particleCounts = await page.evaluate(() => {
  return Object.keys(window.vulcaExhibition.particleSystems).length;
});
expect(particleCounts).toBe(24);
```

**Validation Checklist:**
- [ ] Page loads without console errors
- [ ] 24 particle systems initialized
- [ ] Artwork 1 visible at T=0s
- [ ] Artwork 2 visible at T=15s
- [ ] Artwork 3 visible at T=30s
- [ ] Artwork 4 visible at T=45s
- [ ] All particles alpha values in [0.05, 1.0]
- [ ] FPS ≥60 (check via DevTools)
- [ ] Hovering stops cycling
- [ ] 3 seconds idle resumes cycling

**Git Commit:** `test: Add Playwright MCP verification for Layer 1+3`

---

## Phase 2: Week 4 - Layer 2 (Cursor Interaction)

**Duration:** 6-8 hours
**Deliverable:** Cursor-responsive particle physics

### P2.1 InteractionManager.js - Cursor Tracking
- [ ] Track cursor position within region
- [ ] Calculate distance from cursor to each particle
- [ ] Implement attraction force: `force = (150 - distance) / 150`
- [ ] Test with console logging

**Git Commit:** `feat: Add cursor tracking and distance calculation`

### P2.2 InteractionManager.js - Particle Attraction Physics
- [ ] Apply force to particle velocity
- [ ] Implement angle calculation: `atan2(y - py, x - px)`
- [ ] Update vx, vy based on angle and force
- [ ] Test particle movement

**Git Commit:** `feat: Implement particle attraction physics`

### P2.3 InteractionManager.js - Trail Effect
- [ ] Record cursor history (last 20 positions)
- [ ] Render trail as fading line between points
- [ ] Implement trail decay (1 second fade out)
- [ ] Test trail visibility

**Git Commit:** `feat: Add cursor trail effect rendering`

### P2.4 CSS - Visual Feedback
- [ ] Add visual indicator for interaction zone
- [ ] Style cursor with custom icon if possible
- [ ] Add glow or highlight on particle proximity

**Git Commit:** `feat: Add visual feedback for cursor interaction`

### P2.5 Playwright MCP Verification
- [ ] Test cursor movement triggers particle response
- [ ] Screenshot trail effect
- [ ] Verify Layer 1 still works with Layer 2 active

**Git Commit:** `test: Add Playwright verification for Layer 2`

---

## Phase 3: Week 5 - Burst Animation + RPAIT Display

**Duration:** 6-8 hours
**Deliverable:** Click interactions with RPAIT visualization

### P3.1 InteractionManager.js - Click Detection & Burst
- [ ] Detect click within region
- [ ] Calculate burst center from click position
- [ ] Trigger burst animation on all particles
- [ ] Implement velocity scaling by T dimension

**Git Commit:** `feat: Add click-triggered burst animation`

### P3.2 ParticleSystem.js - Sedimentation Logic
- [ ] Implement return-to-rest behavior
- [ ] Use I dimension to determine curve type (linear/sinusoidal/polynomial/complex)
- [ ] Gradually decrease outward velocity
- [ ] Return particles to original positions

**Git Commit:** `feat: Implement sedimentation curves driven by I dimension`

### P3.3 RPAIT Panel UI - HTML/CSS
- [ ] Create panel element with 6 critic evaluations
- [ ] Display R/P/A/I/T values as bars or numbers
- [ ] Position panel near click location
- [ ] Add auto-hide timer (2 seconds)

**Git Commit:** `feat: Add RPAIT display panel UI`

### P3.4 RPAIT Panel - JavaScript Logic
- [ ] Query RPAIT values for clicked region
- [ ] Populate panel with 6 critic evaluations
- [ ] Show panel on click, hide after 2 seconds
- [ ] Test data population

**Git Commit:** `feat: Implement RPAIT panel population and display logic`

### P3.5 Playwright MCP Verification
- [ ] Test burst animation
- [ ] Screenshot RPAIT panel
- [ ] Verify sedimentation behavior
- [ ] Test Layer 1+2+3 all working together

**Git Commit:** `test: Add Playwright verification for burst and RPAIT`

---

## Phase 4: Week 6-7 - Optimization & Polish

**Duration:** 6-8 hours
**Deliverable:** Production-ready implementation

### P4.1 Performance Profiling
- [ ] Record FPS with DevTools
- [ ] Identify bottlenecks
- [ ] Profile per-frame CPU/GPU usage
- [ ] Document baseline metrics

**Git Commit:** `perf: Profile and document performance baseline`

### P4.2 Alpha Blending Optimization
- [ ] Verify GPU-accelerated alpha calculations
- [ ] Batch alpha calculations where possible
- [ ] Test with 2000+ particles

**Git Commit:** `perf: Optimize alpha calculation efficiency`

### P4.3 Rendering Optimization
- [ ] Ensure PixiJS batching is effective
- [ ] Reduce draw calls where possible
- [ ] Profile and optimize hot paths

**Git Commit:** `perf: Optimize rendering pipeline`

### P4.4 CSS Animations & Transitions
- [ ] Add smooth transitions to panels
- [ ] Add fade-in/fade-out curves for layers
- [ ] Test on 3+ browsers

**Git Commit:** `feat: Add smooth CSS transitions and animations`

### P4.5 Responsive Design
- [ ] Test on 375px (mobile)
- [ ] Test on 768px (tablet)
- [ ] Test on 1024px (laptop)
- [ ] Test on 1440px+ (desktop)
- [ ] Adjust hitAreas for touch devices

**Git Commit:** `feat: Add responsive design support`

### P4.6 Accessibility
- [ ] Add ARIA labels to regions
- [ ] Add keyboard navigation (arrow keys)
- [ ] Test with screen reader
- [ ] Verify contrast ratios

**Git Commit:** `feat: Add accessibility enhancements`

### P4.7 Browser Compatibility
- [ ] Test on Chrome 90+
- [ ] Test on Firefox 88+
- [ ] Test on Safari 14+
- [ ] Document any polyfills needed

**Git Commit:** `feat: Ensure cross-browser compatibility`

### P4.8 Documentation
- [ ] Update README with new features
- [ ] Add usage guide for three layers
- [ ] Document RPAIT dimension mappings
- [ ] Add troubleshooting guide

**Git Commit:** `docs: Update documentation for hybrid interaction architecture`

### P4.9 Final Playwright Verification
- [ ] Run full test suite
- [ ] Screenshot key user journeys
- [ ] Performance benchmark (FPS, memory)
- [ ] Cross-browser verification

**Git Commit:** `test: Final comprehensive verification (all platforms)`

---

## Summary Checklist

### Completion Criteria

**All Phases Complete When:**
- [ ] 60fps maintained with 1920 particles
- [ ] Memory usage <50MB
- [ ] All 3 layers functional
- [ ] Playwright verification passed
- [ ] Cross-browser tested
- [ ] Accessibility verified
- [ ] Documentation complete

**Definition of Done Per Task:**
- [ ] Code written and reviewed
- [ ] Tests passing
- [ ] No console errors
- [ ] Git commit created
- [ ] Documentation updated

---

## Notes for Implementer

1. **Test Early, Test Often**: Run Playwright verification after each phase, not just at the end
2. **Git Hygiene**: Create atomic commits, one feature per commit
3. **Performance**: Monitor FPS during development; don't wait until end
4. **Communication**: If you hit blockers, document them and move to next task
5. **Code Quality**: Keep code simple; complex optimizations come later

---

**Status:** Ready for Implementation (Awaiting Approval)
**Created:** 2025-11-01
