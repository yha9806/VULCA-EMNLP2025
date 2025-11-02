# Spec: Artwork Carousel Interaction System

## Overview

Defines the carousel controller that manages artwork navigation, input handling, and state management for the homepage gallery.

---

## ADDED Requirements

### Requirement: Carousel Controller Module

**Definition:**
A JavaScript module that tracks which artwork is currently displayed and provides navigation methods.

#### Scenario: Initialize carousel on page load

Given the page loads
When `ArtworkCarousel` is instantiated with artwork data
Then the carousel is ready with:
- Current index set to 0 (first artwork)
- All 4 artworks loaded in memory
- Navigation methods available

**Acceptance Criteria:**
- No errors in console
- `carousel.getCurrentArtwork()` returns artwork-1
- `carousel.currentIndex` equals 0

#### Scenario: Navigate to next artwork

Given the carousel is initialized
When `carousel.next()` is called
Then:
- Current index increments by 1
- If at last artwork (index 3), wrap to first (index 0)
- `getCurrentArtwork()` returns the new artwork object
- Navigation event is emitted (for DOM update)

**Acceptance Criteria:**
- Method returns cleanly
- Index wraps correctly (3 → 0)
- Event listener can detect change
- Multiple consecutive calls work correctly

#### Scenario: Navigate to previous artwork

Given the carousel is initialized
When `carousel.prev()` is called
Then:
- Current index decrements by 1
- If at first artwork (index 0), wrap to last (index 3)
- `getCurrentArtwork()` returns the new artwork object
- Navigation event is emitted

**Acceptance Criteria:**
- Method returns cleanly
- Index wraps correctly (0 → 3)
- Event listener can detect change

#### Scenario: Jump to specific artwork

Given the carousel is initialized
When `carousel.goTo(index)` is called with a valid index (0-3)
Then:
- Current index is set directly to that index
- `getCurrentArtwork()` returns artwork at that index
- Navigation event is emitted

**Acceptance Criteria:**
- Works for all indices 0-3
- Returns cleanly for in-bounds indices
- Error handling for out-of-bounds indices

#### Scenario: Get critics for current artwork

Given the carousel is initialized and points to artwork N
When `carousel.getArtworkCritics()` is called
Then:
- Returns array of 6 critique objects for that artwork
- Each critique includes persona info, text, and RPAIT scores

**Acceptance Criteria:**
- Always returns 6 items (or as many as exist in data)
- Data is correctly filtered by current artwork ID
- No data corruption or missing fields

### Requirement: Navigation Event System

**Definition:**
The carousel emits events when navigation occurs, allowing UI components to listen and respond.

#### Scenario: Listen to artwork change event

Given a UI component (e.g., hero renderer) is loaded
When `carousel` emits a navigation event
Then the component can:
- Detect which artwork is now active
- Update DOM with new artwork data
- Animate transitions smoothly

**Acceptance Criteria:**
- Event is emitted after index changes
- Event includes artwork data (not just index)
- Multiple listeners can subscribe to same event
- Event fires reliably on every navigation

### Requirement: State Persistence

**Definition:**
The carousel maintains state through navigation operations and handles edge cases gracefully.

#### Scenario: Rapid navigation

Given the carousel receives rapid successive navigation calls
When multiple `next()` or `prev()` calls occur in quick succession
Then:
- State remains consistent (no data loss)
- Final artwork displayed is correct
- No race conditions or async issues

**Acceptance Criteria:**
- 10 consecutive next() calls = index 0 (loops twice)
- Mix of next/prev calls results in correct final index
- No errors in console

#### Scenario: Invalid navigation

Given the carousel is initialized
When `carousel.goTo(999)` is called (out of bounds)
Then:
- Method handles gracefully (no error thrown)
- Index remains unchanged OR wraps safely
- Optional: logs warning to console

**Acceptance Criteria:**
- No crash or error
- Predictable behavior documented

---

## ADDED Requirements

### Requirement: Button Click Handler Integration

**Definition:**
Buttons in the UI are wired to carousel navigation methods.

#### Scenario: User clicks Previous button

Given the Previous button is visible
When the user clicks the button
Then:
- `carousel.prev()` is called
- Event listener detects navigation
- DOM is updated with new artwork

**Acceptance Criteria:**
- Single click triggers single navigation
- Works on all devices (mouse, touch, keyboard)
- No double-navigation

#### Scenario: User clicks Next button

Given the Next button is visible
When the user clicks the button
Then:
- `carousel.next()` is called
- Event listener detects navigation
- DOM is updated with new artwork

**Acceptance Criteria:**
- Single click triggers single navigation
- Button responds with visual feedback

#### Scenario: User clicks dot indicator

Given 4 dot indicators are visible (one per artwork)
When the user clicks dot at index N
Then:
- `carousel.goTo(N)` is called
- DOM updates to show artwork N
- Dot indicator highlights to show current selection

**Acceptance Criteria:**
- All 4 dots are clickable
- Clicking same dot (already selected) is safe (no-op)
- Clicking different dot navigates correctly

---

## ADDED Requirements

### Requirement: Keyboard Navigation Integration

**Definition:**
Keyboard arrow keys navigate between artworks.

#### Scenario: User presses ArrowRight

Given the page has focus
When the user presses the ArrowRight key
Then it SHALL:
- Call `carousel.next()`
- Advance artwork to next
- Not interfere with other key handlers

**Acceptance Criteria:**
- Works in input fields (unless textarea focused)
- Works with modifier keys (Shift, Alt, Ctrl)
- Prevents default page scroll if applicable

#### Scenario: User presses ArrowLeft

Given the page has focus
When the user presses the ArrowLeft key
Then it SHALL:
- Call `carousel.prev()`
- Go to previous artwork
- Not interfere with other key handlers

**Acceptance Criteria:**
- Works reliably
- Doesn't conflict with other shortcuts
- User can hold key for continuous navigation

---

## ADDED Requirements

### Requirement: Swipe Gesture Integration SHALL Support Gestures

**Definition:**
Touch swipe gestures SHALL navigate artworks on mobile/tablet.

#### Scenario: User swipes left

Given the user is on a mobile/tablet device
When the user performs a left swipe (> 50px horizontal movement)
Then it SHALL:
- Call `carousel.next()`
- Advance artwork
- Provide visual feedback confirming gesture was detected

**Acceptance Criteria:**
- Swipe requires > 50px horizontal movement
- Vertical swiping (vertical > horizontal) doesn't trigger
- Works on touch and mouse drag
- No navigation if vertical scroll is interrupted

#### Scenario: User swipes right

Given the user is on a mobile/tablet device
When the user performs a right swipe (> 50px horizontal movement)
Then it SHALL:
- Call `carousel.prev()`
- Go to previous artwork
- Play animation smoothly

**Acceptance Criteria:**
- Swipe detection works reliably
- Triggers correctly for all swipe speeds
- Doesn't interfere with other gestures (pinch, etc.)

---

## Implementation Notes

### Module Interface (Expected API)

```javascript
class ArtworkCarousel {
  // Constructor
  constructor(artworks, critiques, personas);

  // Navigation methods
  next();              // Go to next artwork
  prev();              // Go to previous artwork
  goTo(index);         // Jump to specific index

  // State getters
  getCurrentArtwork();        // Returns current artwork object
  getArtworkCritics();        // Returns array of 6 critique objects
  getCurrentIndex();          // Returns current index (0-3)

  // Event system
  on(eventName, callback);    // Listen to events
  off(eventName, callback);   // Remove listener
  // Emitted events: 'navigate' with { artwork, index, critics }

  // Utility
  getArtworkCount();          // Returns 4
  getCriticForArtwork(index, criticIndex); // Get specific critique
}
```

### External Dependencies
- `VULCA_DATA` (global object from data.js)
- No external libraries required (vanilla JS)

### Error Handling
- Graceful handling of out-of-bounds indices
- Null checks for artwork data
- Console warnings for invalid states (dev mode)

### Browser Support
- All modern browsers (ES6 required)
- No polyfills needed

### Performance Considerations
- Carousel logic is O(1) for all operations (constant time)
- No DOM manipulation in carousel itself
- Event system uses simple callbacks (no heavy framework)
- Memory: ~100KB for carousel + data

### Testing Requirements
- Unit tests for all navigation methods
- Unit tests for event emission
- Integration tests with button/swipe handlers
- Edge case tests (rapid navigation, invalid indices)
