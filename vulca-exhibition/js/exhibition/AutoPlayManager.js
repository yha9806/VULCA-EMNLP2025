/**
 * AutoPlayManager - Automatic region cycling for Layer 3
 *
 * Cycles through 4 artwork regions every 15 seconds when no user interaction detected.
 * Manages prominence weighting to highlight current region while fading others to baseline.
 */

class AutoPlayManager {
  constructor(layout) {
    this.layout = layout;

    // Region cycling
    this.regions = ['artwork_1', 'artwork_2', 'artwork_3', 'artwork_4'];
    this.currentIndex = 0;
    this.timer = 0;
    this.phaseTime = 15000;  // 15 seconds per region (milliseconds)
    this.isEnabled = true;

    console.log('✅ AutoPlayManager initialized');
  }

  /**
   * Update auto-play state (called every frame)
   */
  update(delta) {
    if (!this.isEnabled) return;

    this.timer += delta;

    // Check if time to advance to next region
    if (this.timer >= this.phaseTime) {
      this.advanceRegion();
    }

    // Update prominence levels
    this.updateProminence();
  }

  /**
   * Advance to next region
   */
  advanceRegion() {
    this.currentIndex = (this.currentIndex + 1) % this.regions.length;
    this.timer = 0;

    const nextRegion = this.regions[this.currentIndex];
    this.layout.handleRegionHover(nextRegion, true);

    console.log(`🎬 Advanced to region: ${nextRegion}`);
  }

  /**
   * Update prominence levels for all regions
   * Current region fades in (5% -> 100%), others fade out (-> 5%)
   */
  updateProminence() {
    this.regions.forEach((region, idx) => {
      const systems = this.layout.regionSystems[region];
      if (!systems) return;

      systems.forEach(system => {
        if (idx === this.currentIndex) {
          // Current region: fade prominence up to 100%
          system.prominenceLevel = Math.min(1.0, system.prominenceLevel + 0.02);
        } else {
          // Other regions: fade prominence down to 5% baseline
          system.prominenceLevel = Math.max(0.05, system.prominenceLevel - 0.02);
        }
      });
    });
  }

  /**
   * Pause auto-play (called when user starts interacting)
   */
  pause() {
    this.isEnabled = false;
    this.timer = 0;
  }

  /**
   * Resume auto-play (called when user stops interacting for 3+ seconds)
   */
  resume() {
    this.isEnabled = true;
  }

  /**
   * Get current region
   */
  getCurrentRegion() {
    return this.regions[this.currentIndex];
  }

  /**
   * Get manager status for debugging
   */
  getStatus() {
    return {
      enabled: this.isEnabled,
      currentRegion: this.getCurrentRegion(),
      timer: this.timer,
      phaseTime: this.phaseTime,
      currentIndex: this.currentIndex,
    };
  }
}

// Make globally accessible
window.AutoPlayManager = AutoPlayManager;
