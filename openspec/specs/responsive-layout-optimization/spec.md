# responsive-layout-optimization Specification

## Purpose
TBD - created by archiving change fix-responsive-layout-issues. Update Purpose after archive.
## Requirements
### Requirement: Mobile layout SHALL display all content without truncation
The gallery hero section on mobile devices (≤599px) SHALL allow full vertical scrolling to access all critique content.

#### Scenario: User scrolls through all critiques on mobile
```gherkin
Given the user is on the homepage on a mobile device (375x667)
When the user scrolls down the page
Then all 6 critique cards are visible and accessible
And no content is hidden by max-height constraints
And the critiques panel has max-height: none
And the page scrolls naturally without artificial limits
```

### Requirement: Artwork images SHALL maintain aspect ratio across all viewports
Artwork images SHALL preserve their aspect ratio without distortion across all screen sizes using CSS aspect-ratio property.

#### Scenario: Artwork image scales proportionally
```gherkin
Given an artwork image is displayed in the gallery
When the viewport width changes from 375px to 1920px
Then the image maintains its original aspect ratio (16:9 or 4/3)
And the image uses object-fit: contain
And the image is centered using object-position: center
And no part of the image is cropped or distorted
```

#### Scenario: Fallback for browsers without aspect-ratio support
```gherkin
Given a browser that doesn't support CSS aspect-ratio property
When the page loads
Then the aspect ratio is maintained using padding-bottom percentage hack
And the image container has position: relative
And the image container has padding-bottom: 56.25% for 16:9 ratio
And the image is absolutely positioned within the container
```

### Requirement: Layout SHALL be constrained on large screens for readability
Content SHALL be constrained to a maximum width of 1600px on screens wider than 1920px to maintain optimal reading line length.

#### Scenario: Content is centered on ultra-wide displays
```gherkin
Given the user is viewing the page on a 4K display (3840x2160)
When the page loads
Then the gallery hero container has max-width: 1600px
And the container is horizontally centered with margin: 0 auto
And side margins are calculated as max(60px, calc((100vw - 1600px) / 2))
And content remains readable with line lengths < 80 characters
```

### Requirement: Critique grid SHALL adapt to viewport width with appropriate columns
The critique grid SHALL display 1, 2, 3, or 4 columns depending on viewport width for optimal content density.

#### Scenario: Mobile displays single column
```gherkin
Given the viewport width is 375px
When the critiques panel renders
Then the grid displays 1 column
And each critique card spans full width
And gap between cards is 16px
```

#### Scenario: Tablet displays two columns
```gherkin
Given the viewport width is 768px
When the critiques panel renders
Then the grid displays 2 columns
And grid-template-columns is repeat(2, 1fr)
And gap between columns is 20px
```

#### Scenario: Desktop displays three columns
```gherkin
Given the viewport width is 1024px
When the critiques panel renders
Then the grid displays 3 columns
And grid-template-columns is repeat(3, 1fr)
And gap between columns is 24px
```

#### Scenario: Large desktop displays four columns
```gherkin
Given the viewport width is 1366px or greater
When the critiques panel renders
Then the grid displays 4 columns
And grid-template-columns is repeat(4, 1fr)
And gap between columns is 28px
```

### Requirement: Responsive breakpoints SHALL follow mobile-first strategy
All responsive styles SHALL be defined using mobile-first approach with min-width media queries except where max-width is semantically clearer.

#### Scenario: Breakpoints are defined correctly
```gherkin
Given the CSS stylesheet is loaded
Then breakpoints are defined as follows:
  | Breakpoint | Media Query                              | Target Devices      |
  | Mobile     | max-width: 599px                         | Phones              |
  | Tablet     | min-width: 600px and max-width: 1023px   | Tablets             |
  | Desktop    | min-width: 1024px and max-width: 1365px  | Laptops             |
  | Large      | min-width: 1366px and max-width: 1919px  | Large displays      |
  | Ultra-wide | min-width: 1920px                        | 4K and ultra-wide   |
```

### Requirement: Image-to-critique ratio SHALL be optimized per breakpoint
The flex ratio between artwork image and critique panel SHALL adjust per breakpoint for optimal balance.

#### Scenario: Tablet uses 35:65 ratio
```gherkin
Given the viewport width is between 600px and 1023px
When the artwork display renders
Then the image container has flex: 0 0 35%
And the critiques panel has flex: 0 0 65%
And both containers are displayed side-by-side
```

#### Scenario: Desktop uses 40:60 ratio
```gherkin
Given the viewport width is between 1024px and 1365px
When the artwork display renders
Then the image container has flex: 0 0 40%
And the critiques panel has flex: 0 0 60%
```

#### Scenario: Large desktop uses 35:65 ratio
```gherkin
Given the viewport width is 1366px or greater
When the artwork display renders
Then the image container has flex: 0 0 35%
And the critiques panel has flex: 0 0 65%
```

### Requirement: Gallery hero SHALL NOT use fixed viewport height on mobile
The gallery hero section SHALL use dynamic height on mobile devices rather than min-height: 100vh to prevent content truncation.

#### Scenario: Mobile gallery height adapts to content
```gherkin
Given the user is on a mobile device (375x667)
When the gallery hero section renders
Then the section does NOT have min-height: 100vh
And the section height is determined by its content
And all content (artwork + critiques + navigation) is accessible via scrolling
```

