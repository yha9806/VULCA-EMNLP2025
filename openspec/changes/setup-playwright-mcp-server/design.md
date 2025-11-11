# Design: Setup Playwright MCP Server

**Change ID:** `setup-playwright-mcp-server`

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Claude Code                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  MCP Client (Built-in)                               │  │
│  │  - Manages MCP server lifecycle                      │  │
│  │  - Exposes tools as functions                        │  │
│  │  - Handles stdio/JSON-RPC communication              │  │
│  └────────────────┬─────────────────────────────────────┘  │
└───────────────────┼─────────────────────────────────────────┘
                    │ JSON-RPC over stdio
                    ▼
┌─────────────────────────────────────────────────────────────┐
│              Playwright MCP Server                          │
│              (npx @playwright/mcp)                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  MCP Protocol Handler                                │  │
│  │  - Exposes 20+ browser automation tools              │  │
│  │  - Manages Playwright browser instances              │  │
│  │  - Provides accessibility tree snapshots             │  │
│  └────────────────┬─────────────────────────────────────┘  │
└───────────────────┼─────────────────────────────────────────┘
                    │ Playwright API
                    ▼
┌─────────────────────────────────────────────────────────────┐
│              Browser (Chromium/Firefox/WebKit)              │
│  - Renders web pages                                        │
│  - Executes JavaScript                                      │
│  - Provides accessibility tree                              │
│  - Handles user interactions                                │
└─────────────────────────────────────────────────────────────┘
```

## Design Decisions

### Decision 1: Global vs Project-Specific Configuration

**Options Considered:**

**A. Global Configuration (Current)**
- MCP server defined in `~/.claude/settings.json`
- Available to all Claude Code projects
- Single source of truth

**B. Project-Specific Configuration**
- MCP server defined in `<project>/.claude.json`
- Only available in this project
- Can override global settings

**C. Hybrid Approach**
- Global for basic setup
- Project-specific for customizations

**Decision: Keep Global Configuration (Option A)**

**Rationale:**
- ✅ Playwright MCP is useful across multiple projects
- ✅ No project-specific customizations needed currently
- ✅ Simpler maintenance (single config file)
- ✅ Already working perfectly
- ⚠️ Can switch to Option C later if custom browser profiles needed

### Decision 2: MCP Server Version Strategy

**Options Considered:**

**A. Latest Version (`@playwright/mcp@latest`)**
- Always gets newest features
- May introduce breaking changes
- Used in `~/.claude/claude_desktop_config.json`

**B. Pinned Version (`@playwright/mcp@1.0.0`)**
- Stable, predictable behavior
- Requires manual updates
- Used in `~/.claude/settings.json`

**C. Version Range (`@playwright/mcp@^1.0.0`)**
- Balance between stability and updates
- Compatible updates only

**Decision: Use Unpinned Latest (Option A/Current Setup)**

**Rationale:**
- ✅ MCP protocol is stable (v1.0+)
- ✅ Playwright team maintains backward compatibility
- ✅ Get bug fixes and new features automatically
- ✅ `-y` flag in settings.json ensures auto-installation
- ⚠️ Monitor for breaking changes in release notes

### Decision 3: Browser Launch Mode

**Options Considered:**

**A. Headless Mode**
- No visible browser window
- Faster execution
- Lower resource usage
- Default for CI/CD

**B. Headed Mode (Current Default)**
- Visible browser window
- Better debugging experience
- User can see what's happening
- Default for local development

**C. Configurable Mode**
- Environment variable control
- Different modes for different scenarios

**Decision: Keep Headed Mode Default (Option B)**

**Rationale:**
- ✅ Better developer experience (can see browser actions)
- ✅ Easier troubleshooting
- ✅ Matches Claude Code's interactive nature
- ✅ Playwright MCP defaults to headed mode
- ⚠️ Can switch to headless with config if needed

### Decision 4: Browser Context Management

**Options Considered:**

**A. Single Persistent Context**
- One browser instance per session
- Maintains cookies/storage across interactions
- Lower overhead

**B. Fresh Context Per Task**
- Clean slate for each test
- No state pollution
- Higher overhead

**C. Smart Context Reuse**
- Reuse context for related tasks
- Reset on explicit command
- Balance between Options A & B

**Decision: Accept Playwright MCP Default (Option A)**

**Rationale:**
- ✅ Playwright MCP manages context lifecycle automatically
- ✅ Persistent context useful for testing authenticated flows
- ✅ Can manually close browser with `mcp__playwright__browser_close`
- ✅ Lower latency for multiple interactions
- ⚠️ User can reset state by closing and reopening browser

### Decision 5: Integration with VULCA Website Testing

**Options Considered:**

**A. Manual Testing Only**
- Use MCP tools ad-hoc via Claude Code
- No automation scripts
- Maximum flexibility

**B. Automated Test Scripts**
- Create Playwright test files in `/tests`
- Run with `npx playwright test`
- Separate from MCP

**C. Hybrid: MCP + Test Scripts**
- Use MCP for exploratory testing
- Create scripts for regression tests
- Best of both worlds

**Decision: Start with Manual Testing (Option A), Evolve to Hybrid (Option C)**

**Rationale:**
- ✅ Phase 1: Use MCP for immediate interactive testing
- ✅ Phase 2: Document common scenarios in this proposal
- ✅ Phase 3: Create automated scripts for critical paths if needed
- ✅ Matches current project phase (nearing completion)
- ⚠️ Can add automated tests in future OpenSpec change

## Technical Constraints

### MCP Server Requirements
- **Node.js**: 16+ (for `npx` command)
- **Network**: Internet access for first-time package download
- **Browser**: Chromium/Firefox binaries (auto-installed by Playwright)

### Claude Code Integration
- **MCP Protocol**: v1.0+ (JSON-RPC over stdio)
- **Tool Permission Model**: User approval required for some actions
- **Timeout Limits**: Long-running browser sessions may timeout

### VULCA Website Constraints
- **Static Site**: No backend server required
- **Local Development**: Can test with `python -m http.server 9999`
- **Deployment**: GitHub Pages at https://vulcaart.art
- **Responsive Design**: Must test multiple viewport sizes

## Configuration Reference

### Current Configuration Files

#### `~/.claude/settings.json`
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

#### `~/.claude/claude_desktop_config.json`
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

**Note**: Two config files exist due to Claude Code evolution. The `settings.json` version is currently active.

### Optional Project-Specific Configuration (Not Currently Used)

If customizations are needed in the future:

**`I:\VULCA-EMNLP2025\.claude.json`** (create if needed)
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp"],
      "env": {
        "PLAYWRIGHT_BROWSER": "chromium",
        "PLAYWRIGHT_HEADLESS": "false",
        "PLAYWRIGHT_VIEWPORT_WIDTH": "1920",
        "PLAYWRIGHT_VIEWPORT_HEIGHT": "1080"
      }
    }
  }
}
```

## Testing Strategy

### Verification Tests
1. **Connection Test**: `claude mcp list` shows "✓ Connected"
2. **Browser Launch Test**: `mcp__playwright__browser_navigate("about:blank")`
3. **Snapshot Test**: `mcp__playwright__browser_snapshot()`
4. **Screenshot Test**: `mcp__playwright__browser_take_screenshot()`

### VULCA Website Test Scenarios
1. **Homepage Load**: Navigate to https://vulcaart.art, verify no errors
2. **Responsive Design**: Test viewports (375px, 768px, 1024px, 1440px)
3. **Navigation**: Test hamburger menu, links, back buttons
4. **Language Switch**: Toggle ZH/EN, verify content updates
5. **Artwork Display**: Verify placeholder system for missing images
6. **RPAIT Charts**: Verify radar charts and matrix render correctly

## Security Considerations

### MCP Security Model
- **Sandbox**: Playwright runs in isolated browser context
- **File System**: Limited access (screenshots only to designated folders)
- **Network**: Can access any URL (be cautious with sensitive sites)
- **Permissions**: Claude Code prompts user for sensitive actions

### VULCA Project Specifics
- ✅ Public website (no authentication required)
- ✅ Static content (no sensitive data exposure risk)
- ✅ Local testing safe (localhost:9999)
- ⚠️ Production testing (vulcaart.art) is also safe (public site)

## Performance Considerations

### Browser Resource Usage
- **Memory**: ~200-300MB per browser instance
- **CPU**: Minimal when idle, spikes during page load/interaction
- **Disk**: ~500MB for Chromium binaries (one-time download)

### Optimization Tips
1. Close browser when not in use: `mcp__playwright__browser_close()`
2. Use headless mode for batch testing (if needed)
3. Limit concurrent browser tabs
4. Clear cache/cookies periodically

## Monitoring & Debugging

### Health Check
```bash
# Check MCP server status
claude mcp list

# Should show:
# playwright: npx @playwright/mcp@latest - ✓ Connected
```

### Debug Logs
- **MCP Server Logs**: Check `~/.claude/debug/` directory
- **Browser Console**: Use `mcp__playwright__browser_console_messages()`
- **Network Requests**: Use `mcp__playwright__browser_network_requests()`

### Common Issues & Solutions
See `specs/troubleshooting/spec.md` for detailed troubleshooting guide.

## Future Enhancements

### Phase 2: Automated Test Suite (Optional)
- Create `/tests` directory with Playwright test files
- Add npm scripts for test execution
- Integrate with CI/CD (GitHub Actions)

### Phase 3: Visual Regression Testing (Optional)
- Take baseline screenshots of key pages
- Compare against baseline on changes
- Store in `/tests/visual-regression`

### Phase 4: Performance Monitoring (Optional)
- Measure page load times
- Track Core Web Vitals
- Generate performance reports

## References

- [Playwright Documentation](https://playwright.dev)
- [MCP Protocol Specification](https://spec.modelcontextprotocol.io)
- [Claude Code MCP Guide](https://docs.claude.com/en/docs/claude-code/mcp)
- [VULCA Project Structure](../../CLAUDE.md)
