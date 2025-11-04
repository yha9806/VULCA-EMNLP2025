# Tasks: Document OpenSpec Validation Workaround

**Change ID**: `document-openspec-validation-workaround`
**Total Estimated Time**: 2 hours
**Status**: Proposed

---

## Task Summary

| Phase | Tasks | Time | Status |
|-------|-------|------|--------|
| 1. Documentation | 3 tasks | 1 hour | Pending |
| 2. GitHub Contribution | 2 tasks | 30 min | Pending |
| 3. Validation | 1 task | 30 min | Pending |
| **Total** | **6 tasks** | **2 hours** | **Pending** |

---

## Phase 1: Documentation (1 hour)

### Task 1.1: Create OPENSPEC_KNOWN_ISSUES.md
**Estimated Time**: 20 minutes

**Steps**:
1. Create new file `OPENSPEC_KNOWN_ISSUES.md` in project root
2. Document the validation bug with clear examples
3. Provide workaround commands
4. Link to relevant GitHub issues

**Success Criteria**:
- [ ] File created with clear problem description
- [ ] Workaround commands provided
- [ ] Links to GitHub issues included
- [ ] Examples show both failing and workaround commands

---

### Task 1.2: Update CLAUDE.md
**Estimated Time**: 20 minutes

**Steps**:
1. Add section "🐛 OpenSpec Known Issues"
2. Summarize validation bug
3. Reference OPENSPEC_KNOWN_ISSUES.md for details
4. Update archival workflow instructions

**Success Criteria**:
- [ ] New section added to CLAUDE.md
- [ ] Clear reference to known issues document
- [ ] Archival workflow updated with workaround flags
- [ ] Expected fix timeline mentioned (when available)

---

### Task 1.3: Create .github/OPENSPEC_WORKAROUND.md
**Estimated Time**: 20 minutes

**Steps**:
1. Create workflow guide in `.github/` directory
2. Document step-by-step archival process
3. Provide troubleshooting tips
4. Add examples from our project

**Success Criteria**:
- [ ] Workflow guide created
- [ ] Step-by-step instructions provided
- [ ] Real examples from our archived changes included
- [ ] Troubleshooting section included

---

## Phase 2: GitHub Contribution (30 minutes)

### Task 2.1: Prepare Test Case for Issue #164
**Estimated Time**: 15 minutes

**Steps**:
1. Gather our validation error logs
2. Document our spec file structure
3. Show `openspec show --json --deltas-only` output
4. Compare with `openspec validate --strict` output
5. Prepare markdown-formatted comment

**Success Criteria**:
- [ ] Validation error captured with full output
- [ ] Show command output captured
- [ ] Spec file structure documented
- [ ] Comment prepared in markdown format

---

### Task 2.2: Submit Comment to Issue #164
**Estimated Time**: 15 minutes

**Steps**:
1. Review existing comments on Issue #164
2. Post our test case using `gh issue comment`
3. Mention our project as additional reproduction case
4. Offer to provide more details if needed

**Success Criteria**:
- [ ] Comment submitted to Issue #164
- [ ] Test case clearly presented
- [ ] Context about our project provided
- [ ] Offer to help with debugging made

---

## Phase 3: Validation (30 minutes)

### Task 3.1: Test and Validate Documentation
**Estimated Time**: 30 minutes

**Steps**:
1. Test workaround commands on a new change
2. Verify documentation accuracy
3. Check all links work correctly
4. Proofread all documents

**Success Criteria**:
- [ ] Workaround commands tested successfully
- [ ] All links verified working
- [ ] Documentation reviewed for clarity
- [ ] No spelling/grammar errors

---

## Dependencies

### Prerequisites
- [x] OpenSpec CLI v0.14.0 installed
- [x] GitHub CLI (`gh`) installed
- [x] Access to project repository
- [x] Validation bug confirmed

### Blockers
None

---

## Rollback Plan

If documentation creates confusion:
1. Move files to `docs/archive/` directory
2. Revert CLAUDE.md changes
3. Use simple inline comments in existing docs

Rollback time: < 5 minutes

---

## Completion Checklist

- [ ] OPENSPEC_KNOWN_ISSUES.md created
- [ ] CLAUDE.md updated with known issues section
- [ ] Workflow guide created in .github/
- [ ] Test case prepared
- [ ] Comment submitted to GitHub Issue #164
- [ ] All documentation validated

---

## Notes

- This is a **workaround**, not a permanent solution
- Monitor Issue #164 for official fix
- Plan to remove documentation when CLI is fixed
- Keep workaround commands simple and well-documented
