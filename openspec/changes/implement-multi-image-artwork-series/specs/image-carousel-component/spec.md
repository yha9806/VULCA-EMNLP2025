# Spec: Image Carousel Component

## Overview

Interactive carousel component for displaying artwork image series with smooth navigation and responsive design.

---

## ADDED Requirements

### Requirement: Carousel Navigation

**Identifier**: `carousel-001`

The carousel SHALL support prev/next navigation with keyboard shortcuts, touch gestures, and click controls.

**Priority**: P0

#### Scenario: Keyboard Navigation

**Given** carousel is focused
**When** user presses Right Arrow key
**Then** carousel advances to next image
**When** user presses Left Arrow key
**Then** carousel goes to previous image

#### Scenario: Touch Swipe

**Given** carousel on touch device
**When** user swipes left
**Then** carousel advances to next image
**When** user swipes right
**Then** carousel goes to previous image

---

### Requirement: Image Metadata Display

**Identifier**: `carousel-002`

Each image SHALL display titleZh, titleEn, category badge, and sequence indicator (e.g., "3 of 6").

**Priority**: P1

#### Scenario: Metadata Rendering

**Given** image with category "sketch"
**When** carousel displays image
**Then** blue "Sketch" badge appears in corner
**And** title displays in both languages
**And** indicator shows "1 of 6"

---

### Requirement: Lazy Loading

**Identifier**: `carousel-003`

Carousel SHALL load current image plus adjacent images (prev/next) on demand.

**Priority**: P1

#### Scenario: Adjacent Preloading

**Given** carousel on image 3 of 6
**When** carousel renders
**Then** images 2, 3, 4 are loaded
**And** images 1, 5, 6 remain unloaded until needed

---

## MODIFIED Requirements

None

---

## REMOVED Requirements

None
