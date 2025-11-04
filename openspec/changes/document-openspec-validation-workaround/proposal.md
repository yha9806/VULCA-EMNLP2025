# Document OpenSpec Validation Workaround

**Status**: Proposed
**Priority**: Medium
**Estimated Effort**: 2 hours
**Created**: 2025-11-04
**Author**: Development Team

---

## Why

### Problem: OpenSpec CLI Validation Bug

The OpenSpec CLI tool (v0.14.0) has a **known validation bug** that prevents properly formatted specification files from passing strict validation:

**Symptom**:
```bash
openspec validate <change-id> --strict
```

**Error Output**:
```
✗ [ERROR] Delta sections ## ADDED Requirements, ## MODIFIED Requirements
  and ## REMOVED Requirements were found, but no requirement entries parsed.
✗ [ERROR] Change must have at least one delta. No deltas found.
```

**Reality**:
- Running `openspec show <change-id> --json --deltas-only` successfully parses deltas
- The spec files are correctly formatted with proper headers
- This is a **CLI tool bug, not a specification format issue**

### Evidence from GitHub Issues

This is a **confirmed bug** in the OpenSpec CLI repository:

1. **Issue #164** (OPEN): "Error: Change 'my-task' has issues"
   - URL: https://github.com/Fission-AI/OpenSpec/issues/164
   - Description: Validation command fails but show command succeeds with same data
   - Status: Unresolved, maintainers acknowledge re-work is needed

2. **Issue #149** (OPEN): "[FIXED with better Workflow] Bug: Validation Error"
   - URL: https://github.com/Fission-AI/OpenSpec/issues/149
   - Description: Similar validation failures requiring workflow workarounds
   - Status: Open, resolved through better workflows but root issue persists

3. **Issue #194** (OPEN): "Model tends to cheat around 'no deltas found error'"
   - URL: https://github.com/Fission-AI/OpenSpec/issues/194
   - Description: AI models bypass validation using --skip-specs flag
   - Status: Open, proposes removing escape hatches

### Impact on Our Project

**Affected Changes**:
- `unify-navigation-to-image-area` (already deployed, cannot validate)
- `fix-hero-title-bilingual-support` (archived with --no-validate)
- `fix-chart-labels-bilingual-support` (archived with --no-validate)

**Current Situation**:
- We cannot use `openspec archive --yes` without flags
- Must use `--no-validate --skip-specs` to archive completed changes
- This bypasses important quality checks

---

## What Changes

### 1. Document Known Limitation

Create documentation explaining:
- The validation bug exists in OpenSpec CLI v0.14.0
- Our specifications are correctly formatted
- We must use workaround flags until official fix

### 2. Provide Workaround Commands

Document the temporary solution:
```bash
# Workaround for archiving completed changes
openspec archive <change-id> --yes --no-validate --skip-specs
```

### 3. Track Upstream Issue

- Report our test case to GitHub Issue #164
- Monitor for official fix in future releases
- Update our workflow when fix is released

### 4. Update CLAUDE.md

Add section explaining:
- OpenSpec validation limitation
- Required workaround flags
- Link to GitHub issues

---

## What Stays the Same

- Spec file format (no changes needed)
- Change proposal structure (already correct)
- Task breakdown methodology (working well)
- Overall OpenSpec workflow (effective aside from validation)

---

## Success Criteria

1. ✅ Documentation clearly explains the validation bug
2. ✅ Workaround commands are provided and tested
3. ✅ Test case contributed to GitHub Issue #164
4. ✅ CLAUDE.md updated with limitation notes
5. ✅ Team understands this is temporary until official fix

---

## Future Actions

When OpenSpec CLI releases a fix:
1. Upgrade to new version
2. Re-validate all archived changes
3. Remove workaround documentation
4. Resume using standard validation workflow
