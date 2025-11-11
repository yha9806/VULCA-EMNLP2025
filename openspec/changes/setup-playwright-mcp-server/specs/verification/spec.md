# Spec: Playwright MCP Verification

**Capability:** `verification`
**Change:** `setup-playwright-mcp-server`

## ADDED Requirements

### Requirement: System SHALL Verify MCP Server Connection
**ID:** `VER-001`

The system SHALL provide a mechanism to verify Playwright MCP server connection status.

#### Scenario: Check MCP server is running and connected
**Given** Claude Code is running
**When** user executes `claude mcp list` command
**Then** output includes "playwright: npx @playwright/mcp@latest - ✓ Connected"
**And** exit code is 0

**Validation:**
```bash
# Test command
claude mcp list | grep -q "playwright.*✓ Connected" && echo "PASS" || echo "FAIL"
```

### Requirement: System SHALL Verify Browser Launch Capability
**ID:** `VER-002`

The system SHALL be able to launch a browser instance via Playwright MCP.

#### Scenario: Launch browser and navigate to blank page
**Given** Playwright MCP server is connected
**When** user invokes `mcp__playwright__browser_navigate` with URL "about:blank"
**Then** browser window opens successfully
**And** browser displays blank page
**And** no error messages are logged

**Validation:**
```javascript
// Ask Claude Code to run:
// "Use Playwright MCP to navigate to about:blank"
// Expected: Browser window opens showing blank page
```

### Requirement: System SHALL Verify Accessibility Snapshot Capability
**ID:** `VER-003`

The system SHALL be able to capture page accessibility tree snapshots.

#### Scenario: Capture snapshot of blank page
**Given** browser is open at "about:blank"
**When** user invokes `mcp__playwright__browser_snapshot`
**Then** function returns YAML representation of accessibility tree
**And** snapshot includes page URL and title
**And** no errors are thrown

**Validation:**
```javascript
// Ask Claude Code to run:
// "Take a snapshot of the current page using Playwright MCP"
// Expected: Returns YAML data structure with page info
```

### Requirement: System SHALL Verify Screenshot Capability
**ID:** `VER-004`

The system SHALL be able to capture screenshots of web pages.

#### Scenario: Take screenshot and save to file
**Given** browser is open at a URL
**When** user invokes `mcp__playwright__browser_take_screenshot` with filename
**Then** screenshot file is created in specified location
**And** file is valid PNG/JPEG image
**And** file size is greater than 0 bytes

**Validation:**
```javascript
// Ask Claude Code to run:
// "Navigate to https://vulcaart.art and take a screenshot"
// Expected: Creates screenshot file, confirms file path
```

### Requirement: System SHALL Verify Browser Interaction Capability
**ID:** `VER-005`

The system SHALL be able to interact with page elements (click, type, etc.).

#### Scenario: Click on a button element
**Given** browser is open at a page with interactive elements
**And** page snapshot has been captured
**When** user invokes `mcp__playwright__browser_click` with element reference
**Then** click action is executed successfully
**And** expected UI state change occurs
**And** no errors are thrown

**Validation:**
```javascript
// Ask Claude Code to run:
// "Navigate to https://vulcaart.art, take a snapshot,
//  and click the hamburger menu button"
// Expected: Menu opens, no errors
```

## MODIFIED Requirements

None (new capability)

## REMOVED Requirements

None (new capability)

## Dependencies

- **External**: Node.js 16+, npx command available
- **External**: Playwright browser binaries installed
- **External**: Claude Code with MCP support enabled

## Notes

- All verification tests should be run after fresh installation or configuration changes
- Tests should be run on both local development (localhost) and production (vulcaart.art) environments
- Verification checklist can be automated in future OpenSpec change
