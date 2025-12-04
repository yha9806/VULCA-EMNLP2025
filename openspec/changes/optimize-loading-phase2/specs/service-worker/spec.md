# Spec: service-worker

## ADDED Requirements

### Requirement: Service Worker Registration
A Service Worker MUST be registered on page load for caching support.

#### Scenario: SW registration
- Given an HTML page with SW support
- When the page loads in a supporting browser
- Then the Service Worker MUST be registered from `/sw.js`
- And registration errors MUST be logged but not block page function

#### Scenario: SW scope
- Given a registered Service Worker
- When the SW scope is inspected
- Then the scope MUST cover the entire site (`/`)

### Requirement: Static Asset Caching
Static assets MUST be cached for offline access and faster repeat visits.

#### Scenario: Cache-First for static assets
- Given a request for CSS, JS, or image files
- When the Service Worker intercepts the request
- Then the SW MUST serve from cache if available
- And fall back to network if not cached
- And cache the network response for future use

#### Scenario: Cached asset types
- Given the Service Worker cache
- When cache contents are inspected
- Then CSS files from `/styles/` MUST be cacheable
- And JS files from `/js/` MUST be cacheable
- And images from `/assets/` MUST be cacheable

### Requirement: Dynamic Content Strategy
HTML and JSON data MUST use network-first caching strategy.

#### Scenario: Network-First for HTML
- Given a request for an HTML page
- When the Service Worker intercepts the request
- Then the SW MUST attempt network fetch first
- And fall back to cache if network fails
- And update cache with successful network response

#### Scenario: Network-First for JSON
- Given a request for data.json or API endpoints
- When the Service Worker intercepts the request
- Then the SW MUST use network-first strategy
- And cached data MUST be served when offline

### Requirement: Cache Versioning
The Service Worker MUST support cache versioning for updates.

#### Scenario: Cache version update
- Given a new version of sw.js is deployed
- When the browser detects the update
- Then old caches MUST be deleted
- And new assets MUST be re-cached

#### Scenario: Skip waiting
- Given a waiting Service Worker
- When the user refreshes the page
- Then the new SW SHOULD activate immediately (skipWaiting)

### Requirement: Offline Fallback
An offline fallback page MUST be shown when network and cache both fail.

#### Scenario: Offline page
- Given complete network failure and empty cache
- When user navigates to any page
- Then an offline fallback message SHOULD be displayed
- And the message SHOULD indicate offline status
