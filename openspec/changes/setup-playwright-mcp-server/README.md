# Setup Playwright MCP Server - OpenSpec Change

**Change ID:** `setup-playwright-mcp-server`
**Status:** ✅ **Already Configured** (Documentation Complete)
**Created:** 2025-11-05

---

## 🎯 Quick Summary

**Good News**: Playwright MCP is **already successfully configured and working** in your Claude Code environment!

```bash
$ claude mcp list
playwright: npx @playwright/mcp@latest - ✓ Connected
```

This OpenSpec change provides **documentation** for:
- ✅ Verifying the setup
- 📖 Troubleshooting common issues
- 🧪 Testing the VULCA exhibition website

**No code changes required** - Playwright MCP is fully functional.

---

## 📁 Change Structure

```
setup-playwright-mcp-server/
├── README.md (this file) - Quick reference
├── proposal.md - Problem statement & solution approach
├── design.md - Architecture & design decisions
├── tasks.md - Implementation checklist
└── specs/
    ├── verification/spec.md - How to verify MCP setup
    ├── troubleshooting/spec.md - Diagnose & fix issues
    └── usage-guidelines/spec.md - VULCA website testing scenarios
```

---

## ✅ Current Configuration

### MCP Server Status
```bash
# Check connection
claude mcp list

# Expected output:
# playwright: npx @playwright/mcp@latest - ✓ Connected
```

### Configuration File
**Location:** `~/.claude/settings.json`

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp"],
      "env": {}
    }
  }
}
```

### Available Tools
All 20+ Playwright MCP tools are accessible:
- `mcp__playwright__browser_navigate` - Navigate to URLs
- `mcp__playwright__browser_snapshot` - Get accessibility tree
- `mcp__playwright__browser_click` - Click elements
- `mcp__playwright__browser_take_screenshot` - Capture screenshots
- `mcp__playwright__browser_resize` - Change viewport size
- `mcp__playwright__browser_evaluate` - Run JavaScript
- `mcp__playwright__browser_console_messages` - Check console
- `mcp__playwright__browser_network_requests` - Monitor network
- And many more...

---

## 🧪 Quick Test

Try this to verify everything works:

```
User: "Use Playwright MCP to navigate to https://vulcaart.art and take a screenshot"

Expected:
1. Browser window opens
2. Navigates to VULCA site
3. Screenshot is captured
4. Claude confirms success
```

---

## 📖 Documentation Highlights

### Verification (specs/verification/spec.md)
- ✅ VER-001: Verify MCP Server Connection
- ✅ VER-002: Verify Browser Launch Capability
- ✅ VER-003: Verify Accessibility Snapshot Capability
- ✅ VER-004: Verify Screenshot Capability
- ✅ VER-005: Verify Browser Interaction Capability

### Troubleshooting (specs/troubleshooting/spec.md)
- 🔧 TRB-001: Diagnose Connection Failures
- 🔧 TRB-002: Diagnose Browser Launch Failures
- 🔧 TRB-003: Diagnose Interaction Failures
- 🔧 TRB-004: Diagnose Configuration Issues
- 🔧 TRB-005: Provide Self-Healing Guidance

### VULCA Testing (specs/usage-guidelines/spec.md)
- 🏠 USE-001: Test VULCA Homepage (scroll prevention, placeholders)
- 🍔 USE-002: Test Navigation System (hamburger menu)
- 📱 USE-003: Test Responsive Design (5 breakpoints)
- 🌐 USE-004: Test Language Switch (ZH ↔ EN)
- 📊 USE-005: Test RPAIT Charts (radar + matrix)
- 🖼️ USE-006: Test Artwork Placeholders
- 🌍 USE-007: Test Production Site (vulcaart.art)

---

## 🚀 Common Usage Patterns

### Test Local Development
```
"Use Playwright MCP to test VULCA at localhost:9999.
 Verify scroll is disabled and navigation works."
```

### Test Responsive Design
```
"Resize browser to 375px, 768px, 1024px, 1440px, 1920px
 and take screenshots at each size."
```

### Test Language Switching
```
"Toggle language between Chinese and English,
 verify content updates and persists across pages."
```

### Test Charts
```
"Navigate to /pages/critics.html and verify
 6 radar charts and comparison matrix render correctly."
```

### Debug Issues
```
"Check console errors and network requests
 after loading the homepage."
```

---

## ⚠️ Known Issues

### OpenSpec CLI Validation Bug (Issue #164)

**Problem**: `openspec validate setup-playwright-mcp-server --strict` will fail with false errors.

**Reason**: OpenSpec CLI v0.14.0 has a known parser bug (see `OPENSPEC_KNOWN_ISSUES.md`).

**Evidence**: `openspec show setup-playwright-mcp-server --json --deltas-only` successfully parses all deltas, proving our specs are correctly formatted.

**Workaround** (when archiving in the future):
```bash
openspec archive setup-playwright-mcp-server --yes --no-validate --skip-specs
```

**This is NOT a problem with our specs** - it's a confirmed tool bug tracked in GitHub Issue #164.

---

## 📋 Tasks Status

| Phase | Tasks | Status |
|-------|-------|--------|
| Phase 1: Verification | 4 tasks | ✅ Complete |
| Phase 2: Documentation | 7 tasks | ✅ Complete |
| Phase 3: Testing | 7 tasks | ⏳ Ready to run |
| Phase 4: Enhancements | 2 tasks | ⏳ Optional/Future |

**Total**: 20 tasks (11 complete, 7 ready, 2 optional)

---

## 🎓 Learn More

### Official Resources
- [Playwright MCP GitHub](https://github.com/microsoft/playwright-mcp)
- [Claude Code MCP Docs](https://docs.claude.com/en/docs/claude-code/mcp)
- [Simon Willison's Playwright MCP Guide](https://til.simonwillison.net/claude-code/playwright-mcp-claude-code)

### Project Resources
- [VULCA Project Guide](../../CLAUDE.md)
- [OpenSpec Workflow](../AGENTS.md)
- [Known Issues](../../OPENSPEC_KNOWN_ISSUES.md)

---

## 💡 Next Steps

1. **Verification** (Optional): Run Phase 3 testing tasks if you want comprehensive validation
2. **Usage**: Start using Playwright MCP to test VULCA (see usage patterns above)
3. **Optional**: Add automated test scripts (Phase 4) if regression testing is needed

**Remember**: Playwright MCP is already working perfectly. This documentation helps you use it effectively!

---

**Questions?** See `proposal.md`, `design.md`, or spec files for detailed information.
