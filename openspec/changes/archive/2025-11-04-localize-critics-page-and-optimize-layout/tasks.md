# Tasks: Localize Critics Page and Optimize Card Layout

## Overview

Add Chinese biographies for all 6 critics, adjust English name styling, and optimize card layout for better readability.

**Total Estimated Time**: 2.5 hours

---

## Phase 1: Add Chinese Biographies to Data (1 hour)

### Task 1.1: Add `bioZh` for Real Historical Critics (30 min)

**File**: `js/data.js`

**Action**: Add `bioZh` field to 4 real historical personas:

1. **苏轼** (id: "su-shi", lines ~252-260)
2. **郭熙** (id: "guo-xi", lines ~261-270)
3. **约翰·罗斯金** (id: "john-ruskin", lines ~271-280)
4. **AI伦理评审员** (id: "ai-ethics", lines ~301-310)

**Content**: Use biographies from proposal.md

**Validation**:
- [ ] bioZh field added after bio field
- [ ] Chinese text properly encoded (UTF-8)
- [ ] No syntax errors in data.js
- [ ] Content accurately reflects historical research

**Time**: 30 min

---

### Task 1.2: Add `bioZh` for Fictional AI Personas with Disclaimers (30 min)

**File**: `js/data.js`

**Action**: Add `bioZh` field to 2 fictional personas:

1. **佐拉妈妈** (id: "mama-zola", lines ~281-290)
2. **埃琳娜·佩特洛娃教授** (id: "professor-petrova", lines ~291-300)

**IMPORTANT**: Each biography MUST end with:
```
*注：此为AI创建的虚构角色，代表[理论传统名称]。*
```

**Content**: Use biographies from proposal.md

**Validation**:
- [ ] bioZh field added
- [ ] Fictional persona disclaimer present
- [ ] Disclaimer uses italic markdown formatting
- [ ] No syntax errors

**Time**: 30 min

---

## Phase 2: Update JavaScript Rendering (30 min)

### Task 2.1: Modify Biography Rendering Logic (15 min)

**File**: `js/critics-page.js`
**Lines**: 159-165

**Change**:
```javascript
// Before
if (persona.bio) {
  const bio = document.createElement('p');
  bio.className = 'critic-bio';
  bio.textContent = persona.bio;
  body.appendChild(bio);
}

// After
// Prefer Chinese bio, fallback to English
const bioText = persona.bioZh || persona.bio;
if (bioText) {
  const bio = document.createElement('p');
  bio.className = 'critic-bio';
  bio.textContent = bioText;
  body.appendChild(bio);
}
```

**Validation**:
- [ ] Chinese bio displays when available
- [ ] Falls back to English bio if bioZh missing
- [ ] No console errors
- [ ] All 6 critics display biography

**Time**: 15 min

---

### Task 2.2: Adjust English Name Element Type (15 min)

**File**: `js/critics-page.js`
**Lines**: 124-128

**Change**:
```javascript
// Before
const nameEn = document.createElement('h3');
nameEn.className = 'critic-name-en';
nameEn.textContent = persona.nameEn || '';

// After
const nameEn = document.createElement('p');  // Changed from h3 to p
nameEn.className = 'critic-name-en';
nameEn.textContent = persona.nameEn || '';
```

**Validation**:
- [ ] English name still displays
- [ ] No layout breaks
- [ ] Proper DOM structure

**Time**: 15 min

---

## Phase 3: Optimize CSS Layout (30 min)

### Task 3.1: Style English Name (De-emphasized) (10 min)

**File**: `styles/main.css`
**Location**: Find `.critic-name-en` or add new rule in critics section

**Add/Update**:
```css
.critic-name-en {
  font-size: 0.9rem;
  color: #666;
  font-style: italic;
  margin-top: 0.25rem;
  font-weight: 400;
}
```

**Validation**:
- [ ] English name smaller than Chinese name
- [ ] Italicized style applied
- [ ] Gray color (#666) applied
- [ ] Proper spacing from Chinese name

**Time**: 10 min

---

### Task 3.2: Improve Biography Readability (10 min)

**File**: `styles/main.css`
**Location**: Find `.critic-bio` rule

**Update**:
```css
.critic-bio {
  line-height: 1.7;        /* Improved line spacing */
  margin-bottom: 1.5rem;   /* More space before RPAIT grid */
  color: #333;             /* Darker for readability */
}
```

**Validation**:
- [ ] Biography text more readable
- [ ] Better spacing before RPAIT grid
- [ ] Consistent with overall design

**Time**: 10 min

---

### Task 3.3: Adjust RPAIT Grid Spacing (10 min)

**File**: `styles/main.css`
**Location**: Find `.rpait-grid` or `.rpait-bar` rule

**Update**:
```css
.rpait-bar {
  margin-bottom: 0.75rem;  /* Spacing between bars */
}

.rpait-grid {
  margin-top: 1.5rem;      /* Space from biography */
}
```

**Validation**:
- [ ] RPAIT bars properly spaced
- [ ] Grid separated from biography
- [ ] Responsive layout maintained

**Time**: 10 min

---

## Phase 4: Validation & Testing (30 min)

### Task 4.1: Verify Chinese Biographies Display (10 min)

**Actions**:
1. Open `http://localhost:9999/pages/critics.html`
2. Verify all 6 critic cards show Chinese biographies
3. Check fictional personas show disclaimers ("*注：此为AI创建的虚构角色...*")
4. Verify no English bio appears

**Validation Checklist**:
- [ ] 苏轼 - Chinese bio displays
- [ ] 郭熙 - Chinese bio displays
- [ ] 约翰·罗斯金 - Chinese bio displays
- [ ] 佐拉妈妈 - Chinese bio + fictional disclaimer displays
- [ ] 埃琳娜·佩特洛娃教授 - Chinese bio + fictional disclaimer displays
- [ ] AI伦理评审员 - Chinese bio displays
- [ ] No console errors

**Time**: 10 min

---

### Task 4.2: Verify English Name Styling (5 min)

**Actions**:
1. Check all 6 cards
2. Verify English names are smaller, italicized, gray
3. Verify Chinese names remain prominent

**Validation Checklist**:
- [ ] English names de-emphasized (smaller, italic, gray)
- [ ] Chinese names still prominent
- [ ] Visual hierarchy clear

**Time**: 5 min

---

### Task 4.3: Test Responsive Layout (10 min)

**Actions**:
1. Test on desktop (1440px+)
2. Test on tablet (768px)
3. Test on mobile (375px)

**Validation Checklist**:
- [ ] Cards stack properly on mobile
- [ ] Biography text readable on all sizes
- [ ] RPAIT bars render correctly
- [ ] No horizontal scrolling

**Time**: 10 min

---

### Task 4.4: Cross-Browser Testing (5 min)

**Browsers**:
- Chrome/Edge
- Firefox
- Safari (if available)

**Validation Checklist**:
- [ ] Chinese characters display correctly
- [ ] Layout consistent across browsers
- [ ] No rendering issues

**Time**: 5 min

---

## Summary

**Total Tasks**: 12 tasks across 4 phases
**Total Time**: 2.5 hours
**Risk**: Low (content and styling only, no breaking changes)

---

**Tasks Status**: Draft
**Created**: 2025-11-03
