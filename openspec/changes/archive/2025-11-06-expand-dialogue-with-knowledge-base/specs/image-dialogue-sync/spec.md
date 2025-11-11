# Specification: Image-Dialogue Synchronization

**Capability**: `image-dialogue-sync`
**Change**: `expand-dialogue-with-knowledge-base`
**Status**: Draft
**Version**: 1.0.0

---

## Overview

This specification defines how artwork images are synchronized with dialogue progression, automatically highlighting relevant visual details as critics discuss them.

---

## ADDED Requirements

### Requirement: IS-001 - Message-Driven Image Highlighting

Messages **SHALL** specify which image to display using the `highlightImage` field, triggering automatic image switching when the message is revealed.

**Message Data Structure Extension**:
```javascript
{
  id: "msg-artwork-5-1-8",
  personaId: "guo-xi",
  textZh: "观察左下角的笔触细节...",
  textEn: "Observe the brushwork detail in the lower-left...",
  chapterNumber: 2,

  // NEW: Image synchronization fields
  highlightImage: "artwork-5-detail-b.jpg",  // Image filename to display
  imageAnnotation: {  // Optional overlay text
    zh: "细节：笔触的提按变化",
    en: "Detail: Lift-and-press brushwork variation"
  },

  // ... other fields
}
```

#### Scenario: Message triggers image switch

**Given** user is viewing dialogue for artwork-5
**And** current displayed image is "artwork-5-overview.jpg"
**When** `DialoguePlayer` reveals message "msg-artwork-5-1-8" with `highlightImage`: "artwork-5-detail-b.jpg"
**Then** the system **SHALL** emit `message-revealed` event with image data
**And** `ImageGallery` component **SHALL** switch to "artwork-5-detail-b.jpg" within 500ms
**And** previous image **SHALL** fade out while new image fades in (crossfade transition)

---

### Requirement: IS-002 - Artwork Image Collection

Each artwork **SHALL** provide 4-8 images organized by category, with each image linked to specific dialogue chapters.

**Artwork Data Structure Extension**:
```javascript
{
  id: "artwork-5",
  titleZh: "...",
  titleEn: "...",
  artist: "...",
  year: 2023,

  // NEW: Image array
  images: [
    {
      id: "artwork-5-overview",
      url: "/assets/artwork-5/overview.jpg",
      category: "overview",  // overview | detail | process | context
      titleZh: "作品全景",
      titleEn: "Full View",
      dimensions: { width: 1200, height: 800 },
      relatedChapter: 1,  // Chapter 1: First Impressions
      relatedMessages: ["msg-artwork-5-1-1", "msg-artwork-5-1-2"]
    },
    {
      id: "artwork-5-detail-a",
      url: "/assets/artwork-5/detail-a.jpg",
      category: "detail",
      titleZh: "细节 A：上方构图",
      titleEn: "Detail A: Upper Composition",
      dimensions: { width: 1200, height: 800 },
      relatedChapter: 2,  // Chapter 2: Technical Analysis
      relatedMessages: ["msg-artwork-5-1-5"]
    },
    // ... 4-6 more images
  ]
}
```

#### Scenario: Artwork has required image categories

**Given** artwork-8 data is being validated
**When** checking the `images` array
**Then** it **SHALL** contain 4-8 image objects

**And** at least 1 image **SHALL** have `category`: "overview"
**And** at least 2 images **SHALL** have `category`: "detail"
**And** all images **SHALL** have `relatedChapter` field set to 1, 2, 3, 4, or 5

---

### Requirement: IS-003 - ImageGallery Component

A new `ImageGallery` component **SHALL** be created to display artwork images with smooth transitions, thumbnail navigation, and annotation overlays.

**Component API**:
```javascript
class ImageGallery {
  constructor(artwork, container, options) {
    // artwork: Artwork object with images array
    // container: DOM element to render into
    // options: { autoTransition: true, transitionDuration: 500 }
  }

  switchToImage(imageId, annotation) {
    // Switch to specified image with optional annotation
    // Returns Promise that resolves when transition complete
  }

  showAnnotation(annotation) {
    // Display annotation overlay on current image
  }

  hideAnnotation() {
    // Remove annotation overlay
  }

  destroy() {
    // Clean up event listeners and DOM
  }
}
```

#### Scenario: ImageGallery initialization

**Given** artwork-10 has 6 images in its `images` array
**When** `new ImageGallery(artwork10, container)` is instantiated
**Then** the component **SHALL** render:
- Main image viewport displaying first image (id: "artwork-10-overview")
- Thumbnail strip showing all 6 images
- Image title (bilingual, based on current language)

**And** the first thumbnail **SHALL** have active/selected state

#### Scenario: Image transition triggered by dialogue

**Given** `ImageGallery` is listening to `DialoguePlayer` events
**When** `DialoguePlayer` emits `message-revealed` with:
```javascript
{
  messageId: "msg-artwork-10-1-7",
  highlightImage: "artwork-10-detail-c.jpg",
  imageAnnotation: { zh: "细节：色彩过渡", en: "Detail: Color transition" }
}
```
**Then** `ImageGallery` **SHALL**:
1. Call `switchToImage("artwork-10-detail-c.jpg", annotation)`
2. Fade out current image (opacity 1 → 0 over 250ms)
3. Fade in new image (opacity 0 → 1 over 250ms)
4. Update active thumbnail to "artwork-10-detail-c.jpg"
5. Display annotation overlay with text based on current language

---

### Requirement: IS-004 - Image Annotation Overlay

When a message specifies `imageAnnotation`, the system **SHALL** display a semi-transparent text overlay on the image explaining what to observe.

**Annotation Styling**:
- Position: Bottom-left corner of image
- Background: `rgba(0, 0, 0, 0.7)` (70% opaque black)
- Text color: `#fff` (white)
- Padding: 16px
- Font size: 14px
- Max width: 40% of image width
- Animation: Fade in over 300ms

#### Scenario: Annotation display and removal

**Given** image "artwork-12-detail-b.jpg" is currently displayed
**When** a message with `imageAnnotation` is revealed
**Then** an annotation overlay **SHALL** appear within 300ms

**When** the next message is revealed and it has NO `imageAnnotation`
**Then** the previous annotation **SHALL** fade out over 300ms

---

### Requirement: IS-005 - Mobile Responsive Layout

On mobile devices (viewport width <768px), images and dialogue **SHALL** stack vertically with images displayed above dialogue.

**Layout Requirements**:

**Desktop (≥1024px)**: Side-by-side
```
┌──────────────────┬────────────────────┐
│  ImageGallery    │  DialoguePlayer    │
│  (50% width)     │  (50% width)       │
└──────────────────┴────────────────────┘
```

**Mobile (<768px)**: Stacked
```
┌─────────────────────────┐
│  ImageGallery (100%)    │
├─────────────────────────┤
│  DialoguePlayer (100%)  │
└─────────────────────────┘
```

#### Scenario: Mobile layout image size

**Given** user views artwork page on mobile (viewport 375px)
**When** page renders
**Then** `ImageGallery` **SHALL**:
- Take full viewport width (100%)
- Maintain 3:2 aspect ratio
- Display above `DialoguePlayer`
- Show thumbnail strip as horizontal scrollable row

---

## MODIFIED Requirements

_No existing requirements are modified._

---

## REMOVED Requirements

_No existing requirements are removed._

---

## Dependencies

- **deep-dialogue-structure**: Messages provide `highlightImage` and `imageAnnotation` fields
- **DialoguePlayer component**: Emits `message-revealed` events
- **Existing artwork data**: Extended with `images` array

---

## Validation Criteria

```javascript
// Check artwork has images
artwork.images.length >= 4 && artwork.images.length <= 8

// Check each image has required fields
artwork.images.every(img =>
  img.id && img.url && img.category && img.relatedChapter
)

// Check messages reference valid images
dialogue.messages
  .filter(m => m.highlightImage)
  .every(m =>
    artwork.images.some(img => img.id === m.highlightImage)
  )
```

---

## Related Specifications

- `deep-dialogue-structure` - Provides message data with image references
- `content-generation-workflow` - Describes assigning images to messages

---

## Change History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-11-05 | Claude | Initial specification |
