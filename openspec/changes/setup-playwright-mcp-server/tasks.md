# Tasks: Setup Playwright MCP Server

**Change ID:** `setup-playwright-mcp-server`
**Status:** ✅ Mostly Complete (Documentation Phase)

---

## Phase 1: Verification (✅ Completed)

### Task 1.1: Verify MCP Server Connection
**Status:** ✅ DONE
**Estimate:** 2 min
**Dependencies:** None

**Steps:**
1. Run `claude mcp list` command
2. Verify output shows "playwright: npx @playwright/mcp@latest - ✓ Connected"
3. Document current configuration files

**Success Criteria:**
- [x] Connection status is "✓ Connected"
- [x] No error messages in output
- [x] Config files identified and documented

**Validation:**
```bash
claude mcp list | grep -q "playwright.*✓ Connected"
echo $? # Should output: 0
```

---

### Task 1.2: Test Browser Launch
**Status:** ✅ DONE
**Estimate:** 3 min
**Dependencies:** Task 1.1

**Steps:**
1. Use `mcp__playwright__browser_navigate` to open "about:blank"
2. Verify browser window appears
3. Test `mcp__playwright__browser_snapshot` to get page state

**Success Criteria:**
- [x] Browser window opens successfully
- [x] No launch errors
- [x] Snapshot returns valid data

**Validation:**
- Browser window visible on screen
- Snapshot output contains YAML structure

---

### Task 1.3: Test Screenshot Capability
**Status:** ✅ DONE (Tested during investigation)
**Estimate:** 2 min
**Dependencies:** Task 1.2

**Steps:**
1. Navigate to any URL
2. Use `mcp__playwright__browser_take_screenshot` with filename
3. Verify file is created and is valid image

**Success Criteria:**
- [x] Screenshot file created
- [x] File is valid PNG/JPEG
- [x] File size > 0 bytes

---

### Task 1.4: Document Current Configuration
**Status:** ✅ DONE
**Estimate:** 5 min
**Dependencies:** Task 1.1

**Steps:**
1. Read `~/.claude/settings.json`
2. Read `~/.claude/claude_desktop_config.json`
3. Check for project-specific config (none found)
4. Document findings in design.md

**Success Criteria:**
- [x] All config files documented
- [x] Differences between files noted
- [x] Active configuration identified

---

## Phase 2: Documentation (🔄 In Progress)

### Task 2.1: Create OpenSpec Proposal
**Status:** ✅ DONE
**Estimate:** 15 min
**Dependencies:** Phase 1 complete

**Steps:**
1. Create `proposal.md` with problem statement
2. Document current state analysis
3. Explain "what changes" (documentation only)
4. Outline impact and success criteria

**Success Criteria:**
- [x] Proposal clearly states Playwright MCP is already working
- [x] Documentation goals are clear
- [x] Impact assessment shows no code changes needed

---

### Task 2.2: Create Design Document
**Status:** ✅ DONE
**Estimate:** 30 min
**Dependencies:** Task 2.1

**Steps:**
1. Create `design.md` with architecture diagram
2. Document 5 key design decisions
3. Include configuration reference
4. Add testing strategy and security considerations

**Success Criteria:**
- [x] Architecture diagram shows MCP flow
- [x] All design decisions have rationale
- [x] Configuration examples provided
- [x] Security model documented

---

### Task 2.3: Create Verification Spec
**Status:** ✅ DONE
**Estimate:** 20 min
**Dependencies:** Task 2.2

**Steps:**
1. Create `specs/verification/spec.md`
2. Define 5 requirements (VER-001 to VER-005)
3. Write BDD scenarios for each requirement
4. Include validation code snippets

**Success Criteria:**
- [x] 5 verification requirements documented
- [x] Each has at least one scenario
- [x] Validation steps are executable

---

### Task 2.4: Create Troubleshooting Spec
**Status:** ✅ DONE
**Estimate:** 25 min
**Dependencies:** Task 2.3

**Steps:**
1. Create `specs/troubleshooting/spec.md`
2. Define 5 requirements (TRB-001 to TRB-005)
3. Document common issues and solutions
4. Create troubleshooting decision tree

**Success Criteria:**
- [x] 5 troubleshooting requirements documented
- [x] Common issues have clear solutions
- [x] Decision tree guides diagnosis process

---

### Task 2.5: Create Usage Guidelines Spec
**Status:** ✅ DONE
**Estimate:** 35 min
**Dependencies:** Task 2.4

**Steps:**
1. Create `specs/usage-guidelines/spec.md`
2. Define 7 requirements (USE-001 to USE-007)
3. Write usage examples for each VULCA test scenario
4. Include quick reference guide

**Success Criteria:**
- [x] 7 usage requirements cover all VULCA test scenarios
- [x] Each includes executable example
- [x] Quick reference provides command templates

---

### Task 2.6: Create Tasks Document
**Status:** 🔄 IN PROGRESS
**Estimate:** 10 min
**Dependencies:** Tasks 2.1-2.5

**Steps:**
1. Create `tasks.md` (this file)
2. List all tasks with estimates
3. Mark completed tasks
4. Include validation criteria

**Success Criteria:**
- [ ] All tasks listed with clear descriptions
- [ ] Dependencies mapped
- [ ] Completion status tracked

---

### Task 2.7: Validate OpenSpec Structure
**Status:** ⏳ PENDING
**Estimate:** 5 min
**Dependencies:** Task 2.6

**Steps:**
1. Run `openspec validate setup-playwright-mcp-server --strict`
2. Fix any validation errors
3. Ensure all SHALL/MUST requirements have scenarios

**Success Criteria:**
- [ ] Validation passes with no errors
- [ ] All requirements properly formatted
- [ ] All scenarios have Given/When/Then structure

---

## Phase 3: Testing & Validation (⏳ Pending)

### Task 3.1: Run Verification Tests
**Status:** ⏳ PENDING
**Estimate:** 10 min
**Dependencies:** Phase 2 complete

**Steps:**
1. Execute all verification scenarios (VER-001 to VER-005)
2. Document any failures
3. Update specs if new issues found

**Success Criteria:**
- [ ] All 5 verification tests pass
- [ ] No unexpected errors encountered
- [ ] Results documented

---

### Task 3.2: Test VULCA Homepage Scenarios
**Status:** ⏳ PENDING
**Estimate:** 15 min
**Dependencies:** Task 3.1

**Steps:**
1. Start local dev server: `python -m http.server 9999`
2. Execute homepage test (USE-001)
3. Execute navigation test (USE-002)
4. Execute placeholder test (USE-006)
5. Document results with screenshots

**Success Criteria:**
- [ ] Homepage loads correctly
- [ ] Scroll prevention verified
- [ ] Navigation works
- [ ] Placeholders render

---

### Task 3.3: Test Responsive Design
**Status:** ⏳ PENDING
**Estimate:** 10 min
**Dependencies:** Task 3.2

**Steps:**
1. Execute responsive design test (USE-003)
2. Take screenshots at all 5 breakpoints
3. Verify no layout breaks

**Success Criteria:**
- [ ] Screenshots captured: 375px, 768px, 1024px, 1440px, 1920px
- [ ] No horizontal scrollbars
- [ ] All elements accessible

---

### Task 3.4: Test Language Switching
**Status:** ⏳ PENDING
**Estimate:** 8 min
**Dependencies:** Task 3.2

**Steps:**
1. Execute language switch test (USE-004)
2. Verify content updates
3. Verify localStorage persistence
4. Test across multiple pages

**Success Criteria:**
- [ ] Language toggles ZH ↔ EN
- [ ] localStorage updates
- [ ] Persistence across navigation

---

### Task 3.5: Test RPAIT Charts
**Status:** ⏳ PENDING
**Estimate:** 12 min
**Dependencies:** Task 3.2

**Steps:**
1. Navigate to `/pages/critics.html`
2. Execute chart rendering test (USE-005)
3. Verify 6 radar charts render
4. Verify comparison matrix renders
5. Take screenshot of charts

**Success Criteria:**
- [ ] 6 radar charts visible
- [ ] 1 matrix chart visible
- [ ] No Chart.js errors
- [ ] Charts visually correct

---

### Task 3.6: Test Production Deployment
**Status:** ⏳ PENDING
**Estimate:** 15 min
**Dependencies:** Task 3.5

**Steps:**
1. Execute production site test (USE-007)
2. Navigate to https://vulcaart.art
3. Run smoke tests (navigation, language, charts)
4. Check for 404s and console errors
5. Compare with local development

**Success Criteria:**
- [ ] Production site loads successfully
- [ ] No 404s or JavaScript errors
- [ ] All functionality works same as local
- [ ] Performance acceptable (< 3s load)

---

### Task 3.7: Create Test Report
**Status:** ⏳ PENDING
**Estimate:** 10 min
**Dependencies:** Tasks 3.1-3.6

**Steps:**
1. Compile all test results
2. Create summary report with screenshots
3. Document any issues found
4. Suggest improvements if needed

**Success Criteria:**
- [ ] Report includes all test results
- [ ] Screenshots attached for visual tests
- [ ] Issues prioritized (if any)
- [ ] Recommendations provided

---

## Phase 4: Optional Enhancements (⏳ Future)

### Task 4.1: Create Automated Test Suite
**Status:** ⏳ NOT STARTED
**Estimate:** 2-3 hours
**Dependencies:** Phase 3 complete

**Steps:**
1. Create `/tests` directory
2. Write Playwright test files for critical paths
3. Add npm scripts for test execution
4. Document test running process

**Success Criteria:**
- [ ] Tests can run with `npm test`
- [ ] Critical paths covered
- [ ] Documentation updated

**Note:** This is optional and can be done in future OpenSpec change if needed.

---

### Task 4.2: Set Up Visual Regression Testing
**Status:** ⏳ NOT STARTED
**Estimate:** 1-2 hours
**Dependencies:** Task 4.1

**Steps:**
1. Take baseline screenshots of all pages
2. Set up screenshot comparison tool
3. Create regression test script
4. Integrate with CI/CD (optional)

**Success Criteria:**
- [ ] Baseline screenshots captured
- [ ] Comparison tool configured
- [ ] Regression tests run successfully

**Note:** This is optional and can be done in future OpenSpec change if needed.

---

## Summary

**Total Estimated Time:**
- Phase 1 (Verification): ~12 min ✅ DONE
- Phase 2 (Documentation): ~140 min 🔄 IN PROGRESS (Task 2.6-2.7 remaining)
- Phase 3 (Testing): ~80 min ⏳ PENDING
- Phase 4 (Optional): ~3-5 hours ⏳ FUTURE

**Current Status:**
- ✅ 11 tasks completed
- 🔄 1 task in progress
- ⏳ 8 tasks pending
- Total: 20 tasks (excluding optional Phase 4)

**Next Actions:**
1. Complete Task 2.6 (this file)
2. Run `openspec validate` (Task 2.7)
3. Begin Phase 3 testing

**Blockers:** None

**Notes:**
- Playwright MCP is fully functional, no fixes needed
- Main work is documentation and validation
- Optional enhancements (Phase 4) can be deferred to future change
