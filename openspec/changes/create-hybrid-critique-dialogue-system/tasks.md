# Tasks: Create Hybrid Critique-Dialogue System

**Change ID:** `create-hybrid-critique-dialogue-system`
**Status:** Draft
**Total Estimated Time:** 9-13 hours
**Depends On:** `expand-exhibition-with-real-artworks` Phase 2 completion

---

## Phase 1: Fix Missing English Translations (3-4 hours)

### Task 1.1: Create Translation Script (30 minutes)

**Objective:** Build automated English translation generator using Claude API

**Steps:**
- [ ] Create `scripts/generate-missing-english.js`
- [ ] Import Anthropic SDK and data.json
- [ ] Implement `translateCritique(critique)` function with context-aware prompt
- [ ] Implement `generateAllMissingEnglish()` batch processor
- [ ] Add progress saving (every 10 translations)
- [ ] Add error handling and retry logic

**Success Criteria:**
- Script runs without errors
- Generates translation prompt with critic context
- Saves progress incrementally
- Handles API errors gracefully

**Dependencies:** None

**Validation:**
```bash
node scripts/generate-missing-english.js --dry-run
# Should print: "Found 92 critiques missing English text"
```

---

### Task 1.2: Generate 92 Missing English Translations (3-3.5 hours)

**Objective:** Translate all critiques lacking `textEn` using LLM

**Steps:**
- [ ] Set ANTHROPIC_API_KEY environment variable
- [ ] Run `node scripts/generate-missing-english.js`
- [ ] Monitor progress (should save every 10 critiques)
- [ ] Manually review 3-5 sample translations for quality
- [ ] If quality issues, adjust prompt and re-run problematic critiques

**Success Criteria:**
- All 228 critiques now have `textEn` field
- English text length 1000-1500 characters
- Maintains critic's voice and philosophical depth
- No missing or truncated translations

**Dependencies:** Task 1.1 (script must be created)

**Validation:**
```bash
# Check completeness
node -e "const d=require('./exhibitions/negative-space-of-the-tide/data.json'); const missing = d.critiques.filter(c => !c.textEn); console.log('Missing English:', missing.length, 'Expected: 0')"

# Check length distribution
node scripts/check-data-status.js
# Should show: English text: Min ~1000, Max ~1500, Avg ~1250
```

**Time Breakdown:**
- API calls: ~2-2.5 hours (92 translations × ~80-100 seconds each)
- Review: 30-60 minutes

---

## Phase 2: Build Automated Conversion Tool (2-3 hours)

### Task 2.1: Create Conversion Script Framework (45 minutes)

**Objective:** Build foundation for critique → dialogue converter

**Steps:**
- [ ] Create `scripts/convert-critiques-to-dialogues.js`
- [ ] Import data.json and file system utilities
- [ ] Define conversion configuration constants:
  - [ ] `INTERACTION_KEYWORDS` (for type detection)
  - [ ] `REPLY_STRATEGIES` (for chain construction)
  - [ ] `SEGMENTATION_RULES` (for text splitting)
- [ ] Implement `convertArtworkToDialogue(artworkId)` main function
- [ ] Implement `generateDialogueFileContent(dialogue)` template generator

**Success Criteria:**
- Script structure is complete
- Main function defined with clear steps
- Configuration constants are comprehensive
- Can be invoked: `node scripts/convert-critiques-to-dialogues.js --artwork artwork-5`

**Dependencies:** Task 1.2 (all critiques must have English)

---

### Task 2.2: Implement Text Segmentation (30 minutes)

**Objective:** Split long critiques into 2-3 shorter messages

**Steps:**
- [ ] Implement `segmentCritique(critique)` function
- [ ] Split at natural paragraph breaks (。 or .)
- [ ] Aim for 200-600 characters per segment
- [ ] Label segments: initial → analysis → reflection
- [ ] Preserve both Chinese and English segmentation alignment

**Success Criteria:**
- 800-character critique → 2 messages (~400 each)
- 1500-character critique → 3 messages (~500 each)
- Segments have logical breaks (complete thoughts)
- Chinese and English split at same positions

**Dependencies:** Task 2.1 (framework must exist)

**Validation:**
```bash
# Test segmentation
node -e "const {segmentCritique} = require('./scripts/convert-critiques-to-dialogues.js'); const d = require('./exhibitions/negative-space-of-the-tide/data.json'); const critique = d.critiques.find(c => c.artworkId === 'artwork-5' && c.personaId === 'su-shi'); const segments = segmentCritique(critique); console.log('Segments:', segments.length, 'Lengths:', segments.map(s => s.textZh.length))"
```

---

### Task 2.3: Implement Reply Chain Builder (30 minutes)

**Objective:** Create reply relationships between messages

**Steps:**
- [ ] Implement `determineReplyTo(msgIndex, prevPersona, interactionType)` function
- [ ] Strategy:
  - [ ] `initial`: replyTo = null
  - [ ] `agree-extend`, `question-challenge`, `counter`: replyTo = prevPersona
  - [ ] `synthesize`, `reflect`: replyTo = null
- [ ] Handle edge cases (first message, no previous persona)

**Success Criteria:**
- Every non-initial message has valid `replyTo`
- Reply chains are logically consistent
- Synthesize/reflect messages address whole conversation (replyTo = null)

**Dependencies:** Task 2.2 (segmentation must work)

---

### Task 2.4: Implement Quote Extractor (30 minutes)

**Objective:** Extract key sentences from previous messages for `quotedText`

**Steps:**
- [ ] Implement `extractQuotedText(messageText, maxLength)` function
- [ ] Use keyword matching strategy:
  - [ ] Keywords: 艺术, 技术, 创作, 表达, art, technology, creation, expression
  - [ ] Find sentence containing keywords
  - [ ] Length constraint: 15-50 characters
- [ ] Fallback to first sentence if no keyword match

**Success Criteria:**
- Quoted text is meaningful (contains key concepts)
- Length is appropriate (15-50 characters)
- No truncated sentences mid-word

**Dependencies:** Task 2.3 (reply chain must exist to have quotable messages)

**Validation:**
```bash
# Test quote extraction
node -e "const {extractQuotedText} = require('./scripts/convert-critiques-to-dialogues.js'); const text = '机械的精确性与艺术的随机性，在此作中形成了奇妙的对话。'; const quote = extractQuotedText(text); console.log('Quote:', quote, 'Length:', quote.length)"
```

---

### Task 2.5: Implement Interaction Type Detector (30 minutes)

**Objective:** Assign interaction types based on message content

**Steps:**
- [ ] Implement `detectInteractionType(textZh, textEn, position)` function
- [ ] Keyword matching for each type:
  - [ ] `agree-extend`: 正如, 同意, I agree, As mentioned
  - [ ] `question-challenge`: 但是, 然而, However, But, Question
  - [ ] `counter`: 不对, 反驳, Incorrect, Disagree
  - [ ] `synthesize`: 综合, 总结, Overall, In summary
  - [ ] `reflect`: 反思, 重新思考, Reflection, Reconsider
- [ ] Default to `agree-extend` if no match
- [ ] First message is always `initial`

**Success Criteria:**
- At least 50% of messages have correct type (keyword match)
- No messages with undefined/invalid types
- Initial message always detected correctly

**Dependencies:** Task 2.2 (segmentation provides message content)

---

### Task 2.6: Implement Reference Matcher (30 minutes)

**Objective:** Link messages to knowledge base sources

**Steps:**
- [ ] Implement `matchReferences(personaId, messageText)` function
- [ ] Load critic's knowledge base from `knowledge-base/critics/${personaId}/`
- [ ] Parse `key-concepts.md` or `README.md` for references
- [ ] Select 2-3 random references (simple strategy)
- [ ] Format as: `{ critic, source, quote, page }`

**Success Criteria:**
- Every message has 2-3 references
- References link to valid knowledge base files
- Reference structure matches existing dialogues (artwork-1 to 4)

**Dependencies:** Task 2.1 (framework must exist)

**Validation:**
```bash
# Verify knowledge base files exist
ls knowledge-base/critics/su-shi/
ls knowledge-base/critics/guo-xi/
# etc.
```

---

### Task 2.7: Implement Timestamp Generator (15 minutes)

**Objective:** Create natural dialogue pacing with random intervals

**Steps:**
- [ ] Implement `generateTimestamps(messageCount)` function
- [ ] First message at t=0
- [ ] Each subsequent message: previous + random(4000, 7000) milliseconds
- [ ] Round to integers

**Success Criteria:**
- Intervals range 4-7 seconds
- First timestamp is 0
- Timestamps are monotonically increasing

**Dependencies:** None (standalone utility)

**Validation:**
```bash
# Test timestamp generation
node -e "const {generateTimestamps} = require('./scripts/convert-critiques-to-dialogues.js'); const ts = generateTimestamps(15); console.log('Timestamps:', ts); console.log('Intervals:', ts.slice(1).map((t, i) => t - ts[i]))"
# Expected: Intervals all between 4000-7000
```

---

## Phase 3: Generate 34 New Dialogues (2-3 hours)

### Task 3.1: Test Conversion on Sample Artwork (30 minutes)

**Objective:** Validate conversion tool on artwork-5 before batch processing

**Steps:**
- [ ] Run: `node scripts/convert-critiques-to-dialogues.js --artwork artwork-5`
- [ ] Inspect generated file: `js/data/dialogues/artwork-5.js`
- [ ] Check structure:
  - [ ] Dialogue object has id, artworkId, participants, messages
  - [ ] All messages have required fields
  - [ ] Reply chains are valid
  - [ ] Quotes are present (non-initial messages)
  - [ ] References link to knowledge base
  - [ ] Timestamps are reasonable
- [ ] Manually load in test page: `test-quote-interaction.html`
- [ ] Verify visual display and interaction

**Success Criteria:**
- artwork-5.js file created (12-18 messages)
- All validation checks pass
- Dialogue displays correctly in test page
- No console errors

**Dependencies:** All Phase 2 tasks (conversion tool must be complete)

**Validation:**
```bash
# Validate generated dialogue
node scripts/validate-dialogue-data.js --dialogue js/data/dialogues/artwork-5.js
# Should report: ✅ All checks passed
```

---

### Task 3.2: Batch Convert artwork-6 to artwork-38 (1.5-2 hours)

**Objective:** Generate remaining 33 dialogue files

**Steps:**
- [ ] Run: `node scripts/convert-critiques-to-dialogues.js --batch 6-38`
- [ ] Monitor console output for progress
- [ ] Check for errors or warnings
- [ ] Verify all 33 files created in `js/data/dialogues/`

**Success Criteria:**
- 33 new files: artwork-6.js through artwork-38.js
- Total file count: 38 dialogues (4 old + 34 new)
- No script errors or crashes

**Dependencies:** Task 3.1 (sample test must pass)

**Validation:**
```bash
# Check file count
ls js/data/dialogues/artwork-*.js | wc -l
# Expected: 38

# Check each file has content
for f in js/data/dialogues/artwork-{6..38}.js; do
  if [ ! -s "$f" ]; then
    echo "Empty file: $f"
  fi
done
# Expected: No output (all files non-empty)
```

**Time Breakdown:**
- Script execution: ~1 hour (34 artworks × ~2 minutes each)
- Monitoring and verification: 30-60 minutes

---

### Task 3.3: Quality Review of Sample Dialogues (30 minutes)

**Objective:** Manually inspect 3 representative dialogues for quality

**Steps:**
- [ ] Review artwork-5 (beginning)
- [ ] Review artwork-20 (middle)
- [ ] Review artwork-38 (end)
- [ ] For each dialogue:
  - [ ] Check message count (12-18 expected)
  - [ ] Read 2-3 messages for content quality
  - [ ] Verify reply chains make sense
  - [ ] Verify quotes are relevant
  - [ ] Check interaction types match content
- [ ] If quality issues, document and report

**Success Criteria:**
- All 3 samples have 12-18 messages
- Content is coherent and flows naturally
- Reply relationships are logical
- Quotes accurately reflect previous messages
- No obvious errors or inconsistencies

**Dependencies:** Task 3.2 (files must exist)

---

## Phase 4: Integration & Validation (1-2 hours)

### Task 4.1: Update dialogues/index.js (15 minutes)

**Objective:** Export all 38 dialogues from central index file

**Steps:**
- [ ] Open `js/data/dialogues/index.js`
- [ ] Add imports for artwork-5 through artwork-38:
  ```javascript
  import { artwork5Dialogue } from './artwork-5.js';
  import { artwork6Dialogue } from './artwork-6.js';
  // ... through artwork-38
  ```
- [ ] Add to DIALOGUES array:
  ```javascript
  export const DIALOGUES = [
    artwork1Dialogue, artwork2Dialogue, artwork3Dialogue, artwork4Dialogue,
    artwork5Dialogue, artwork6Dialogue, // ... through artwork38Dialogue
  ];
  ```
- [ ] Save file

**Success Criteria:**
- 38 import statements present
- 38 dialogues in DIALOGUES array
- No syntax errors

**Dependencies:** Task 3.2 (all dialogue files must exist)

**Validation:**
```bash
# Test import
node -e "const {DIALOGUES} = require('./js/data/dialogues/index.js'); console.log('Total dialogues:', DIALOGUES.length, 'Expected: 38')"
```

---

### Task 4.2: Run Full Validation Suite (30 minutes)

**Objective:** Validate all 38 dialogues for structural correctness

**Steps:**
- [ ] Run: `node scripts/validate-dialogue-data.js`
- [ ] Check validation results:
  - [ ] Required fields present
  - [ ] Reply chains valid (no broken replyTo references)
  - [ ] Timestamps monotonically increasing
  - [ ] Participants match message personaIds
  - [ ] Unique message IDs
- [ ] If errors found, document which dialogues have issues
- [ ] Fix critical errors (broken reply chains, missing fields)

**Success Criteria:**
- All 38 dialogues pass validation
- Total message count: 580-680 (85 old + 495-595 new)
- No critical errors (may have warnings)

**Dependencies:** Task 4.1 (index.js must export all dialogues)

**Validation Output:**
```
=== Dialogue Data Validation ===
Total dialogues: 38
Total messages: 632

✅ artwork-1-dialogue: 30 messages, 34 reply relationships
✅ artwork-2-dialogue: 19 messages, 17 reply relationships
...
✅ artwork-38-dialogue: 16 messages, 14 reply relationships

=== Validation Summary ===
✅ All required fields present
✅ All reply chains valid
✅ All timestamps valid
✅ All participants consistent
✅ All message IDs unique

🎉 Validation complete: 38 dialogues, 632 messages
```

---

### Task 4.3: Test Dialogue Player with New Dialogues (30 minutes)

**Objective:** Verify dialogue player UI works with generated dialogues

**Steps:**
- [ ] Start local server: `python -m http.server 9999`
- [ ] Open `http://localhost:9999/test-quote-interaction.html`
- [ ] Test artwork-5 dialogue:
  - [ ] Messages display sequentially
  - [ ] Auto-play animation works
  - [ ] Reply indicators show ("↩ 回复 [name]")
  - [ ] Quoted text appears on hover (desktop) or click (mobile)
  - [ ] References are present (visible in data)
  - [ ] Interaction type labels display
  - [ ] Thought chain carousel works
- [ ] Test artwork-20 dialogue (same checks)
- [ ] Test artwork-38 dialogue (same checks)

**Success Criteria:**
- All 3 test dialogues display correctly
- No console errors
- All interactive features work
- Messages render in correct order
- Timing feels natural (4-7 second intervals)

**Dependencies:** Task 4.2 (validation must pass)

---

### Task 4.4: Update Documentation (15 minutes)

**Objective:** Document the hybrid system architecture

**Steps:**
- [ ] Update `CLAUDE.md`:
  - [ ] Add section: "混合数据系统 (Hybrid Data System)"
  - [ ] Document: data.json (static) vs dialogues/ (interactive)
  - [ ] Document: conversion process (critique → dialogue)
  - [ ] Update file structure diagram
- [ ] Update `SPEC.md` if needed
- [ ] Commit changes: `git add . && git commit -m "docs: Document hybrid critique-dialogue system"`

**Success Criteria:**
- Documentation is clear and accurate
- Developers understand when to use critiques vs dialogues
- Conversion process is documented for future reference

**Dependencies:** Task 4.3 (system must be tested)

---

## Phase 5: Optional Enhancements (If Time Permits)

### Task 5.1: Improve Quote Extraction with Semantic Matching (1 hour)

**Objective:** Upgrade quote extractor to use sentence similarity

**Steps:**
- [ ] Install sentence-transformers: `pip install sentence-transformers`
- [ ] Implement semantic quote extraction:
  ```javascript
  function semanticQuoteExtraction(currentMessage, previousMessages) {
    // Calculate similarity between current message and each previous sentence
    // Select sentence with highest similarity as quote
  }
  ```
- [ ] Compare quality with keyword-based extraction
- [ ] If better, update conversion script

**Success Criteria:**
- Quotes are more contextually relevant
- No performance degradation (acceptable speed)

**Dependencies:** Task 4.4 (basic system must be complete)

---

### Task 5.2: Generate Custom Thought Chains (1 hour)

**Objective:** Create artwork-specific thought chains instead of reusing generic templates

**Steps:**
- [ ] For each artwork, extract key themes
- [ ] Generate 3-4 thought steps specific to artwork context
- [ ] Update `THOUGHT_CHAINS` in dialogue-player.js
- [ ] Test visual display

**Success Criteria:**
- Thought chains are specific to each artwork
- Display correctly in dialogue player

**Dependencies:** Task 4.4 (basic system must be complete)

---

## Rollback Plan

**If critical issues occur:**

1. **Phase 1 Rollback:**
   - Restore `data.json` from backup before English translation
   - Re-run translation script with improved prompt

2. **Phase 3 Rollback:**
   - Delete generated dialogue files: `rm js/data/dialogues/artwork-{5..38}.js`
   - Revert `index.js` changes: `git checkout js/data/dialogues/index.js`
   - Fix conversion script issues
   - Re-run batch conversion

3. **Phase 4 Rollback:**
   - Revert index.js to only export artwork-1 to 4
   - System falls back to original 4 dialogues

---

## Success Checklist

**Data Completeness:**
- [ ] All 228 critiques have `textEn`
- [ ] 34 new dialogue files exist (artwork-5 to artwork-38)
- [ ] ~500-600 new messages generated
- [ ] All messages have required fields

**Data Quality:**
- [ ] English translations maintain critic voices
- [ ] Reply chains are logically consistent
- [ ] Quotes accurately reflect previous messages
- [ ] References link to knowledge base
- [ ] Interaction types match content

**System Integration:**
- [ ] `dialogues/index.js` exports all 38 dialogues
- [ ] Validation script passes all checks
- [ ] Test page displays dialogues correctly
- [ ] No console errors

**Documentation:**
- [ ] CLAUDE.md updated with hybrid system architecture
- [ ] SPEC.md updated if needed
- [ ] Conversion process documented

---

## Time Tracking

| Phase | Estimated | Actual | Notes |
|-------|-----------|--------|-------|
| Phase 1: English Translations | 3-4 hours | | |
| Phase 2: Conversion Tool | 2-3 hours | | |
| Phase 3: Generate Dialogues | 2-3 hours | | |
| Phase 4: Integration | 1-2 hours | | |
| Phase 5: Enhancements (Optional) | 2 hours | | |
| **Total** | **9-13 hours** | | |

---

## Next Steps After Completion

1. **Integrate dialogue page into main site**
   - Create `pages/dialogues.html`
   - Add navigation menu link
   - Test full user journey

2. **Deploy to production**
   - Push to GitHub
   - Verify GitHub Pages build
   - Test live site

3. **User feedback**
   - Gather feedback on dialogue experience
   - Iterate on quote extraction quality
   - Improve reference relevance if needed
