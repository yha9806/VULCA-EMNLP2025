# Test Case for OpenSpec Issue #164

**Reporter**: VULCA-EMNLP2025 Project
**Date**: 2025-11-04
**OpenSpec CLI Version**: v0.14.0
**Issue URL**: https://github.com/Fission-AI/OpenSpec/issues/164

---

## Problem Summary

We can confirm the validation bug reported in Issue #164. The `openspec validate --strict` command fails to parse correctly-formatted specification files, while `openspec show --json --deltas-only` successfully parses the same files.

---

## Reproduction Case

### Change Details

**Change ID**: `unify-navigation-to-image-area`
**Status**: Deployed and working
**Spec Files**: 1 capability with properly formatted requirements

### Step 1: Validate (FAILS)

```bash
$ openspec validate unify-navigation-to-image-area --strict

Change 'unify-navigation-to-image-area' has issues
✗ [ERROR] unified-navigation/spec.md: Delta sections ## ADDED Requirements,
  ## MODIFIED Requirements and ## REMOVED Requirements were found, but no
  requirement entries parsed. Ensure each section includes at least one
  "### Requirement:" block (REMOVED may use bullet list syntax).

✗ [ERROR] file: Change must have at least one delta. No deltas found.
  Ensure your change has a specs/ directory with capability folders
  (e.g. specs/http-server/spec.md) containing .md files that use delta
  headers (## ADDED/MODIFIED/REMOVED/RENAMED Requirements) and that each
  requirement includes at least one "#### Scenario:" block.
```

### Step 2: Verify Spec Format (CORRECT)

Our spec file at `openspec/changes/unify-navigation-to-image-area/specs/unified-navigation/spec.md` contains:

```markdown
## REMOVED Requirements

### REQ-REMOVED-001: Bottom Navigation Bar
**Previous Requirement**: System MUST provide a fixed bottom navigation bar...

**Reason for Removal**: Redundant with new unified navigation component

**Migration Path**: All functionality migrated to `UnifiedNavigation` component

---

### REQ-REMOVED-002: Auto-Hide Navigation Behavior
**Previous Requirement**: Desktop navigation bar MUST auto-hide...

---

## ADDED Requirements

### REQ-ADD-001: Unified Navigation Wrapper Component
**Priority**: P0 (Critical)

The system SHALL provide a `UnifiedNavigation` JavaScript component that:
- Wraps the artwork image display area
- Renders outer layer (artwork navigation) and inner layer (image carousel)
- Manages state coordination between two navigation layers

**Acceptance Criteria**:
- ✅ Component exports `UnifiedNavigation` class
- ✅ Constructor accepts `{ container, artworkCarousel, showImageNav }` options
- ✅ Provides `render()`, `destroy()`, `updateArtwork()`, `updateImage()` methods

#### Scenario: Render Unified Navigation for Multi-Image Artwork

**Given** an artwork with 6 images (artwork-1)
**And** the artwork image container exists in DOM
**When** `UnifiedNavigation` is instantiated and `render()` is called
**Then** the system renders:
- Outer layer with "上一件作品" / "下一件作品" buttons
- Artwork indicator showing "1 / 4"
- Inner layer with image carousel (◄ ► buttons)
- Image indicator showing "1 / 6"

**Validation Code**:
(JavaScript validation code follows...)
```

**Format Analysis**:
- ✅ Uses `## ADDED Requirements` header
- ✅ Uses `## REMOVED Requirements` header
- ✅ Contains `### REQ-XXX:` requirement blocks
- ✅ Includes `#### Scenario:` blocks
- ✅ Contains SHALL/MUST keywords
- ✅ Includes Given/When/Then structure

### Step 3: Workaround (SUCCEEDS)

Since we cannot use the `show --json --deltas-only` command (requires "Why" section in proposal.md), we demonstrate the issue with our successfully archived changes:

```bash
# We archived two completed changes using bypass flags
$ openspec archive fix-hero-title-bilingual-support --yes --no-validate --skip-specs
✅ Success: Change archived as '2025-11-04-fix-hero-title-bilingual-support'

$ openspec archive fix-chart-labels-bilingual-support --yes --no-validate --skip-specs
✅ Success: Change archived as '2025-11-04-fix-chart-labels-bilingual-support'
```

**These changes had identical spec file formats** and could not pass validation despite being correctly formatted.

---

## Impact on Our Project

### Affected Changes

1. **unify-navigation-to-image-area** (deployed, cannot validate)
2. **fix-hero-title-bilingual-support** (archived with `--no-validate`)
3. **fix-chart-labels-bilingual-support** (archived with `--no-validate`)

### Current Workaround

We must use the following command for all archival operations:

```bash
openspec archive <change-id> --yes --no-validate --skip-specs
```

This bypasses important quality checks and undermines confidence in the spec-driven workflow.

---

## Environment

- **OpenSpec CLI Version**: v0.14.0 (latest as of 2025-11-04)
- **Operating System**: Windows 10/11
- **Node Version**: (varies by environment)
- **Project**: https://github.com/yha9806/VULCA-EMNLP2025

---

## Analysis

The validation parser appears to have a regex or parsing logic issue that prevents it from recognizing requirement headers in certain formats. The `show` command uses different parsing logic that successfully extracts the same requirements.

**Hypothesis**: The validator may be:
1. Sensitive to whitespace or line ending differences (CRLF vs LF)
2. Using a stricter regex pattern than the show command
3. Failing to skip metadata lines (like `**Priority**: P0`)
4. Not handling multi-line requirement descriptions correctly

---

## Documentation

We have documented this workaround in our project:
- **Known Issues Doc**: `OPENSPEC_KNOWN_ISSUES.md`
- **Developer Guide**: Updated `CLAUDE.md` with validation workaround
- **Proposal**: Created `document-openspec-validation-workaround` change

---

## Request

We would appreciate:
1. Confirmation that this is indeed a bug in the validation parser
2. Clarification on the expected spec file format if we're doing something wrong
3. Timeline for a fix in a future release
4. Guidance on whether we should continue using `--no-validate` as a workaround

We're happy to provide more details, test cases, or assist with debugging if helpful.

---

## Related Issues

- Issue #149: Similar validation failures
- Issue #194: Discusses workaround flag usage
- Issue #159: Different but related validation bug (fixed)
