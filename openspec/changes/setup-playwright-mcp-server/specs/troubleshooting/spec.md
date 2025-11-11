# Spec: Playwright MCP Troubleshooting

**Capability:** `troubleshooting`
**Change:** `setup-playwright-mcp-server`

## ADDED Requirements

### Requirement: System SHALL Diagnose Connection Failures
**ID:** `TRB-001`

The system SHALL provide clear diagnostic information when MCP server connection fails.

#### Scenario: MCP server fails to connect
**Given** user runs `claude mcp list`
**When** Playwright MCP shows "✗ Failed" or "⚠ Warning" status
**Then** user can identify root cause from error message
**And** user has clear remediation steps

**Common Causes & Solutions:**

1. **Node.js not installed**
   - Error: `npx: command not found`
   - Solution: Install Node.js 16+ from https://nodejs.org

2. **Network connectivity issue**
   - Error: `npm ERR! network`
   - Solution: Check internet connection, retry with `npm cache clean --force`

3. **Playwright browser not installed**
   - Error: `Browser executable not found`
   - Solution: Run `npx playwright install chromium`

4. **Port conflict**
   - Error: `Address already in use`
   - Solution: Kill conflicting process or restart system

5. **Configuration file syntax error**
   - Error: `Failed to parse config`
   - Solution: Validate JSON syntax in `~/.claude/settings.json`

**Validation:**
```bash
# Test each scenario by simulating failure condition
# Verify error messages are actionable
```

### Requirement: System SHALL Diagnose Browser Launch Failures
**ID:** `TRB-002`

The system SHALL provide diagnostic information when browser fails to launch.

#### Scenario: Browser window doesn't appear
**Given** MCP server is connected
**When** user attempts browser navigation
**Then** system logs include browser launch error details
**And** user can identify whether issue is with:
- Missing browser binaries
- Display server (on Linux)
- Permissions
- Resource constraints (memory/disk)

**Common Causes & Solutions:**

1. **Missing browser binaries**
   - Error: `Executable doesn't exist at /path/to/browser`
   - Solution: Run `npx playwright install chromium`

2. **Insufficient permissions**
   - Error: `Permission denied`
   - Solution: Check file permissions on browser executables

3. **Insufficient memory**
   - Error: `Cannot allocate memory`
   - Solution: Close other applications, increase system memory

4. **Display server issue (Linux/WSL)**
   - Error: `Could not connect to display`
   - Solution: Set `DISPLAY` environment variable or use headless mode

**Validation:**
```bash
# Test browser launch under constrained conditions
# Verify error messages guide user to solution
```

### Requirement: System SHALL Diagnose Interaction Failures
**ID:** `TRB-003`

The system SHALL provide diagnostic information when page interactions fail.

#### Scenario: Click action fails on page element
**Given** browser is open at a page
**When** user attempts to click an element
**And** click fails
**Then** error message indicates whether:
- Element reference is invalid
- Element is not visible/enabled
- Element is obscured by another element
- Page is still loading

**Common Causes & Solutions:**

1. **Invalid element reference**
   - Error: `Element not found`
   - Solution: Retake snapshot to get fresh element references

2. **Element not visible**
   - Error: `Element is not visible`
   - Solution: Wait for element to appear, scroll into view

3. **Element obscured**
   - Error: `Element is covered by another element`
   - Solution: Close overlay/modal, or target correct element

4. **Page not fully loaded**
   - Error: `Navigation timeout`
   - Solution: Use `mcp__playwright__browser_wait_for` to wait for content

**Validation:**
```javascript
// Test each failure mode on VULCA website
// Verify error messages are clear and actionable
```

### Requirement: System SHALL Diagnose Configuration Issues
**ID:** `TRB-004`

The system SHALL detect and report configuration file issues.

#### Scenario: Invalid JSON in settings file
**Given** `~/.claude/settings.json` contains syntax errors
**When** Claude Code attempts to load MCP configuration
**Then** user receives clear error message indicating:
- Which file has the error
- Line/column number of syntax error
- Suggestion to validate JSON syntax

**Validation:**
```bash
# Intentionally break settings.json
# Verify error message is helpful
# Restore valid configuration
```

### Requirement: System SHALL Provide Self-Healing Guidance
**ID:** `TRB-005`

The system SHALL provide step-by-step remediation for common issues.

#### Scenario: User follows troubleshooting guide to fix issue
**Given** user encounters an error with Playwright MCP
**When** user consults troubleshooting documentation
**Then** documentation includes:
- Symptom description
- Root cause diagnosis steps
- Step-by-step fix instructions
- Verification test to confirm fix

**Troubleshooting Workflow:**

```
1. Verify Connection
   └─ FAIL → Check Node.js installation
             └─ FAIL → Install Node.js 16+
             └─ PASS → Check network connectivity
                       └─ FAIL → Retry with clean npm cache
                       └─ PASS → Check config file syntax
                                 └─ FAIL → Fix JSON errors
                                 └─ PASS → Reinstall Playwright
   └─ PASS → Test Browser Launch
             └─ FAIL → Install browser binaries
                       └─ FAIL → Check disk space/permissions
                       └─ PASS → Retry launch
             └─ PASS → Test Page Interaction
                       └─ FAIL → Retake snapshot for fresh refs
                       └─ PASS → ✓ All tests pass
```

**Validation:**
- Document SHALL include decision tree for troubleshooting
- Each step SHALL have clear pass/fail criteria
- Each failure SHALL have remediation action

## MODIFIED Requirements

None (new capability)

## REMOVED Requirements

None (new capability)

## Dependencies

- **Internal**: Verification capability (`VER-*` requirements)
- **External**: Access to system logs and error messages

## Notes

- Troubleshooting guide should be updated as new issues are discovered
- Consider creating automated diagnostic script in future
- Link to official Playwright troubleshooting docs for advanced issues
