# Spec: cdn-preconnect

## ADDED Requirements

### Requirement: Preconnect to External CDNs
All HTML pages MUST include preconnect hints for external CDN domains used by the application.

#### Scenario: jsdelivr CDN preconnect
- Given an HTML page that loads resources from jsdelivr
- When the page is loaded
- Then a `<link rel="preconnect" href="https://cdn.jsdelivr.net">` element MUST exist in `<head>`
- And a `<link rel="dns-prefetch" href="https://cdn.jsdelivr.net">` element MUST exist as fallback

#### Scenario: Preconnect placement
- Given an HTML page with preconnect hints
- When the page source is inspected
- Then preconnect links MUST appear before any external script or stylesheet references
- And preconnect links SHOULD appear within the first 10 elements of `<head>`

### Requirement: Google Fonts Preconnect Maintained
Existing preconnect hints for Google Fonts MUST be preserved.

#### Scenario: Google Fonts preconnect exists
- Given the exhibition page index.html
- When the page is loaded
- Then `<link rel="preconnect" href="https://fonts.googleapis.com">` MUST exist
- And `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` MUST exist
