# Spec: Scroll-Reveal Animations

## Overview
Enable scroll-based navigation with progressive content reveal animations using Intersection Observer API.

## ADDED Requirements

### Requirement: Homepage SHALL allow vertical scrolling
The homepage (index.html) SHALL allow users to scroll vertically using mouse wheel, keyboard, and touch gestures to access all content beyond the initial viewport.

#### Scenario: User scrolls with mouse wheel
```gherkin
Given the user is on the homepage
When the user scrolls down with the mouse wheel
Then the page scrolls vertically
And all critique cards become visible
And the RPAIT visualization becomes visible
```

#### Scenario: User scrolls with keyboard
```gherkin
Given the user is on the homepage
When the user presses the down arrow key
Then the page scrolls down
When the user presses the space bar
Then the page scrolls down one viewport height
When the user presses Page Down
Then the page scrolls down one viewport height
```

#### Scenario: User scrolls on mobile device
```gherkin
Given the user is on the homepage on a mobile device
When the user swipes up on the screen
Then the page scrolls down
And touch scroll gestures work smoothly
```

### Requirement: Elements SHALL fade in when entering viewport
Content elements (critique cards, RPAIT visualization) SHALL fade in with a slide-up animation when they enter the viewport during scrolling.

#### Scenario: Critique card fades in on scroll
```gherkin
Given a critique card is below the viewport
And the card has the data-reveal attribute
When the user scrolls down
And the card enters the viewport (10% visible)
Then the card transitions from opacity 0 to opacity 1
And the card transitions from translateY(30px) to translateY(0)
And the transition duration is 600ms
And the transition uses ease-out timing
```

#### Scenario: Multiple cards fade in with stagger
```gherkin
Given 6 critique cards are below the viewport
When the user scrolls down
And the cards enter the viewport
Then card 1 starts fading in immediately
And card 2 starts fading in 100ms later
And card 3 starts fading in 150ms later
And card 4 starts fading in 200ms later
And card 5 starts fading in 250ms later
And card 6 starts fading in 300ms later
```

### Requirement: Intersection Observer SHALL manage reveal animations
A JavaScript module using Intersection Observer API SHALL detect when elements enter the viewport and trigger reveal animations.

#### Scenario: Observer initializes on page load
```gherkin
Given the homepage has loaded
When the scroll-reveal module initializes
Then an Intersection Observer is created
And all elements with data-reveal attribute are observed
And the observer threshold is set to 0.1 (10% visibility)
And the observer root margin includes -10% bottom offset
```

#### Scenario: Observer reveals element
```gherkin
Given an element with data-reveal attribute
And the element has class "reveal-pending"
When the element enters the viewport
Then the Intersection Observer callback fires
And the "reveal-pending" class is removed
And the "revealed" class is added
And the element is unobserved (performance optimization)
```

### Requirement: CSS SHALL define animation styles
CSS SHALL define transition properties and animation states for reveal effects.

#### Scenario: CSS classes control animation state
```gherkin
Given an element with data-reveal attribute
Then the element has transition properties for opacity and transform
And the transition duration is 600ms
And the transition timing function is cubic-bezier(0.4, 0, 0.2, 1)

When the element has class "reveal-pending"
Then its opacity is 0
And its transform is translateY(30px)

When the element has class "revealed"
Then its opacity is 1
And its transform is translateY(0)
```

### Requirement: Animations SHALL respect reduced-motion preference
Users who have enabled "prefers-reduced-motion" in their operating system SHALL see no animations.

#### Scenario: User has reduced-motion enabled
```gherkin
Given the user has enabled "prefers-reduced-motion" in their OS
When the homepage loads
Then all CSS transitions are disabled
And all animation delays are set to 0
And elements with class "reveal-pending" have opacity 1
And elements with class "reveal-pending" have no transform
And content is immediately visible without animation
```

## ADDED Requirements (Configuration)

### Requirement: IMMERSIVE_MODE SHALL be disabled on homepage
The global `window.IMMERSIVE_MODE` flag SHALL be set to `false` on the homepage to allow scrolling.

**Previous behavior**:
```javascript
// index.html
window.IMMERSIVE_MODE = true; // Disabled scrolling
```

**New behavior**:
```javascript
// index.html
window.IMMERSIVE_MODE = false; // Enables scrolling
```

#### Scenario: IMMERSIVE_MODE controls scroll-prevention
```gherkin
Given the homepage has window.IMMERSIVE_MODE = false
When scroll-prevention.js loads
Then scroll event listeners are not added
And body overflow is not set to hidden
And scrolling is fully enabled
```

### Requirement: scroll-prevention.js SHALL respect IMMERSIVE_MODE flag
The scroll-prevention module SHALL check the IMMERSIVE_MODE flag and only disable scrolling when explicitly set to `true`.

**Previous behavior**:
- Always disabled scrolling on index.html

**New behavior**:
- Checks `window.IMMERSIVE_MODE` before disabling scrolling
- If `false`, does not add event listeners or CSS overrides

#### Scenario: scroll-prevention respects disabled mode
```gherkin
Given window.IMMERSIVE_MODE is false
When scroll-prevention.js executes
Then the scrollPreventionHandler.enable() method is not called
And wheel events are not prevented
And keyboard scroll events are not prevented
And touch scroll events are not prevented
```

## Performance Requirements

### Requirement: Animations SHALL maintain 60fps
Scroll-reveal animations SHALL not cause frame drops or jank.

#### Scenario: Animation performance is smooth
```gherkin
Given the user is scrolling the homepage
When critique cards are animating into view
Then the animation frame rate is at least 60fps
And the animation uses only GPU-accelerated properties (opacity, transform)
And no layout recalculations occur during animation
```

### Requirement: Observer SHALL unobserve after reveal
To optimize performance, the Intersection Observer SHALL stop observing elements after they have been revealed.

#### Scenario: Element is unobserved after reveal
```gherkin
Given an element has been revealed
And the "revealed" class has been added
When the scroll-reveal callback completes
Then the element is removed from the Intersection Observer
And the observer no longer tracks this element
And memory is freed
```

## Accessibility Requirements

### Requirement: Keyboard navigation SHALL work
All scroll functionality SHALL be accessible via keyboard.

#### Scenario: Keyboard shortcuts work
```gherkin
Given the user is using keyboard navigation
Then Arrow Up/Down keys scroll the page
And Page Up/Down keys scroll by viewport height
And Space bar scrolls down
And Shift+Space scrolls up
And Home key scrolls to top
And End key scrolls to bottom
```

### Requirement: Screen readers SHALL access all content
Content SHALL be accessible to screen readers without requiring visual scrolling.

#### Scenario: Screen reader announces all content
```gherkin
Given a user is using a screen reader
When navigating the homepage
Then all critique cards are announced
And all RPAIT data is announced
And no content is hidden or skipped
And the reveal animation does not interfere with screen reader navigation
```

## Browser Compatibility

### Requirement: SHALL support modern browsers
The implementation SHALL work in all browsers that support Intersection Observer natively (no polyfill).

#### Scenario: Browser support matrix
```gherkin
Then the feature works in Chrome 51+
And the feature works in Firefox 55+
And the feature works in Safari 12.1+
And the feature works in Edge 15+
And the feature works in iOS Safari 12.2+
And the feature works in Android Chrome 51+
```

## Testing Requirements

### Requirement: Manual testing across devices SHALL be performed
The scroll-reveal feature SHALL be manually tested on multiple devices and browsers.

#### Scenario: Cross-device testing
```gherkin
Given the scroll-reveal feature is implemented
Then it is tested on Windows desktop (Chrome, Firefox, Edge)
And it is tested on Mac desktop (Chrome, Firefox, Safari)
And it is tested on iPhone (Safari)
And it is tested on Android phone (Chrome)
And all tests pass without errors
```

## Dependencies

- **Intersection Observer API**: Native browser API (no external dependencies)
- **CSS Transitions**: Standard CSS feature
- **prefers-reduced-motion**: Standard CSS media query

## Success Metrics

- ✅ All critique cards are visible when scrolling
- ✅ Animations play smoothly at 60fps
- ✅ No console errors or warnings
- ✅ Works on mobile and desktop
- ✅ Respects user motion preferences
- ✅ Page load time < 2 seconds
- ✅ Lighthouse accessibility score >= 95
