# Spec: critical-css

## ADDED Requirements

### Requirement: Critical CSS Inlining
First-screen critical CSS MUST be inlined in the HTML document head.

#### Scenario: Critical CSS is inlined
- Given an HTML page with critical CSS
- When the page source is inspected
- Then a `<style>` block containing critical CSS MUST exist in `<head>`
- And the critical CSS MUST include styles for navigation and hero sections

#### Scenario: Critical CSS size limit
- Given inlined critical CSS
- When the CSS size is measured
- Then the inlined CSS SHOULD NOT exceed 15KB
- And the CSS MUST cover above-the-fold content rendering

### Requirement: Non-Critical CSS Async Loading
Non-critical CSS MUST be loaded asynchronously to prevent render blocking.

#### Scenario: Async CSS loading pattern
- Given a non-critical stylesheet reference
- When the HTML source is inspected
- Then the link element MUST use `media="print" onload="this.media='all'"` pattern
- Or the link element MUST use `rel="preload" as="style"` with onload handler

#### Scenario: No Flash of Unstyled Content
- Given a page with async CSS loading
- When the page is loaded on a slow connection
- Then critical CSS MUST render immediately
- And non-critical styles MUST apply without visible flash

### Requirement: CSS Loading Fallback
A noscript fallback MUST exist for async-loaded CSS.

#### Scenario: Noscript fallback
- Given async-loaded CSS
- When JavaScript is disabled
- Then a `<noscript>` block MUST load the CSS synchronously
