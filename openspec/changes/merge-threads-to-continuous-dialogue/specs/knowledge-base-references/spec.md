# Specification: Knowledge Base References

**Capability**: `knowledge-base-references`
**Change**: `merge-threads-to-continuous-dialogue`
**Status**: Draft
**Last Updated**: 2025-11-06

---

## Overview

Extend message data structure to link dialogue messages to source texts from critic knowledge bases (Phase 1A), enabling scholarly grounding and future UI enhancements.

---

## ADDED Requirements

### Requirement KBR-1: Optional References Field

**Message objects MAY include an optional `references` array** linking to knowledge base source texts.

**Context**: Field is optional for backward compatibility. Can be added gradually during Phase 3 content generation.

#### Scenario: References field structure
**Given** a message object
**When** the message includes knowledge base references
**Then** the message MAY have a `references` property
**And** the `references` property SHALL be an array
**And** each reference object SHALL have the following structure:
```typescript
{
  critic: string,    // Critic ID (e.g., "su-shi")
  source: string,    // Source filename (e.g., "poetry-and-theory.md")
  quote: string,     // Quoted text from source
  page?: string      // Optional: page/section reference
}
```

**Validation**:
```javascript
const msg = {
  id: "msg-artwork-1-1",
  personaId: "su-shi",
  // ... other fields
  references: [
    {
      critic: "su-shi",
      source: "poetry-and-theory.md",
      quote: "笔墨当随时代",
      page: "Section: 论画以形似"
    }
  ]
};

// Validate structure
if (msg.references) {
  assert(Array.isArray(msg.references));
  msg.references.forEach(ref => {
    assert(typeof ref.critic === 'string');
    assert(typeof ref.source === 'string');
    assert(typeof ref.quote === 'string');
    assert(ref.page === undefined || typeof ref.page === 'string');
  });
}
```

---

### Requirement KBR-2: Critic ID Validity

**Each reference's `critic` field SHALL match an existing critic ID** from the knowledge base.

**Context**: Ensures references point to valid critics with knowledge bases.

**Valid Critic IDs** (from Phase 1A):
- `su-shi`
- `guo-xi`
- `john-ruskin`
- `mama-zola`
- `professor-petrova`
- `ai-ethics-reviewer`

#### Scenario: Critic ID validation
**Given** a message with references
**When** the reference includes `critic: "su-shi"`
**Then** the critic ID SHALL be one of the 6 valid critic IDs
**And** the critic SHALL have a corresponding directory in `knowledge-base/critics/[critic-id]/`

**Validation**:
```javascript
const VALID_CRITICS = [
  'su-shi', 'guo-xi', 'john-ruskin',
  'mama-zola', 'professor-petrova', 'ai-ethics-reviewer'
];

msg.references?.forEach(ref => {
  assert(VALID_CRITICS.includes(ref.critic),
    `Invalid critic ID: ${ref.critic}`
  );

  // Check directory exists
  const criticDir = `knowledge-base/critics/${ref.critic}`;
  assert(fs.existsSync(criticDir),
    `Critic directory not found: ${criticDir}`
  );
});
```

---

### Requirement KBR-3: Source File Validity

**Each reference's `source` field SHALL point to an existing markdown file** in the critic's knowledge base.

**Context**: Ensures references link to real source documents.

#### Scenario: Source file validation
**Given** a reference with `{ critic: "su-shi", source: "poetry-and-theory.md" }`
**When** the source file is checked
**Then** the file SHALL exist at `knowledge-base/critics/su-shi/poetry-and-theory.md`
**And** the file SHALL be a markdown file (`.md` extension)

**Validation**:
```javascript
msg.references?.forEach(ref => {
  const sourcePath = `knowledge-base/critics/${ref.critic}/${ref.source}`;

  assert(fs.existsSync(sourcePath),
    `Source file not found: ${sourcePath}`
  );

  assert(ref.source.endsWith('.md'),
    `Source must be markdown file: ${ref.source}`
  );
});
```

---

### Requirement KBR-4: Non-Empty Quote Text

**Each reference's `quote` field SHALL be a non-empty string** with meaningful content.

**Context**: Empty quotes provide no value and indicate incomplete data.

#### Scenario: Quote validation
**Given** a reference object
**When** the quote field is validated
**Then** the quote SHALL NOT be an empty string
**And** the quote SHALL NOT be only whitespace
**And** the quote SHOULD be at least 5 characters (meaningful text)

**Validation**:
```javascript
msg.references?.forEach(ref => {
  assert(ref.quote.trim().length > 0,
    `Empty quote in reference: ${JSON.stringify(ref)}`
  );

  assert(ref.quote.length >= 5,
    `Quote too short (${ref.quote.length} chars): "${ref.quote}"`
  );
});
```

---

### Requirement KBR-5: Persona-Reference Consistency

**A message's references SHOULD primarily cite sources from the message author's knowledge base**.

**Context**: Su Shi quoting John Ruskin is unusual but allowed. Primary expectation is self-citation.

#### Scenario: Primary self-citation
**Given** a message with `personaId: "su-shi"`
**When** the message includes references
**Then** at least one reference SHOULD have `critic: "su-shi"`
**And** references to other critics MAY be included (cross-citation allowed)

**Validation** (warning, not error):
```javascript
msg.references?.forEach((ref, index) => {
  if (index === 0 && ref.critic !== msg.personaId) {
    console.warn(
      `⚠ Message ${msg.id} (author: ${msg.personaId}) ` +
      `cites ${ref.critic} as primary reference. ` +
      `Expected self-citation.`
    );
  }
});
```

---

### Requirement KBR-6: Backward Compatibility

**Messages without `references` field SHALL be valid** and SHALL render correctly in DialoguePlayer.

**Context**: Existing 120-144 messages have no references. Field is optional.

#### Scenario: Missing references field
**Given** a message without `references` field:
```javascript
{
  id: "msg-artwork-1-1",
  personaId: "su-shi",
  textZh: "...",
  textEn: "...",
  // NO references field
}
```
**When** the message is rendered
**Then** DialoguePlayer SHALL render the message normally
**And** NO errors or warnings SHALL be logged
**And** the message SHALL be considered valid

**Validation**:
```javascript
// Both are valid
const msgWithRefs = { id: "msg-1", references: [...] };
const msgWithoutRefs = { id: "msg-2" };

assert(validateMessage(msgWithRefs) === true);
assert(validateMessage(msgWithoutRefs) === true);  // Also valid
```

---

## MODIFIED Requirements

_None - this is a pure addition with no modifications to existing requirements._

---

## REMOVED Requirements

_None - no features are being removed._

---

## Related Capabilities

- **dialogue-structure** - Core dialogue merge transformation
- **knowledge-base** (Phase 1A, complete) - Provides source texts for references

---

## Validation Strategy

### Optional Validation Check

**Location**: `scripts/validate-dialogue-data.js`

**Validation Level**: **WARNING** (not failure)

**Rationale**: References are optional. Their absence should not fail validation.

**Checks**:
1. ⚠️ If `references` present, validate structure (array of objects)
2. ⚠️ If `references` present, validate critic IDs (must be in VALID_CRITICS)
3. ⚠️ If `references` present, validate source files (must exist)
4. ⚠️ If `references` present, validate quote text (non-empty)
5. ⚠️ If `references` present, check persona-reference consistency (warning only)
6. ✅ Messages without `references` are valid (no warning)

**Output Example**:
```
Validating artwork-1-dialogue...
  ✓ Required fields (30/30 messages)
  ✓ Unique IDs (30 messages, 0 duplicates)
  ✓ Reply chains (18 replies, all valid)
  ✓ Timestamps (chronological, avg 5.2s interval)
  ✓ Participants (6/6 critics, all active)
  ⚠ Knowledge base references (0/30 messages have references)
    ℹ References are optional. Can be added in Phase 3.

✓ artwork-1-dialogue: PASS (warnings don't fail validation)
```

---

## Implementation Notes

### Type Definition (Already Completed)

**Location**: `js/data/dialogues/types.js` (lines 11-18)

```javascript
/**
 * Knowledge base reference for a message
 * @typedef {Object} KnowledgeReference
 * @property {string} critic - Critic ID (e.g., "su-shi")
 * @property {string} source - Source document name (e.g., "poetry-and-theory.md")
 * @property {string} quote - Quoted text from the source
 * @property {string} [page] - Optional: page number or section reference
 */
```

**DialogueMessage typedef** (lines 27-44):
```javascript
/**
 * @property {Array<KnowledgeReference>} [references] - Knowledge base references for this message
 */
```

**Status**: ✅ Type definitions already added in previous session.

---

### Example Usage (Phase 3)

**When generating new dialogue content**:

```javascript
// Phase 3: Generate message with knowledge base references
{
  id: "msg-artwork-5-1-8",
  personaId: "john-ruskin",
  textZh: `这让我想起《现代画家》第一卷中的论述："伟大艺术的目的不在于欺骗眼睛，而在于唤醒心灵。"此作虽借助算法，但它确实唤醒了我们对创作本质的思考——这便是它的道德价值所在。`,
  textEn: `This reminds me of my argument in "Modern Painters" Volume I: "The purpose of great art is not to deceive the eye, but to awaken the soul." Though this work employs algorithms, it indeed awakens our reflection on the nature of creation—therein lies its moral value.`,
  timestamp: 21000,
  replyTo: "professor-petrova",
  interactionType: "reflect",
  quotedText: "道德价值",

  // Link to knowledge base
  references: [
    {
      critic: "john-ruskin",
      source: "README.md",
      quote: "The purpose of great art is not to deceive the eye, but to awaken the soul.",
      page: "Core Philosophy: Truth to Nature"
    }
  ]
}
```

---

## Future Enhancements (Out of Scope)

1. **UI Display** - Show references as tooltips, expandable sections, or citations
2. **Quote Highlighting** - Highlight quoted text in source documents
3. **Reference Links** - Clickable links to view full source documents
4. **Citation Export** - Generate academic citations from references
5. **Reference Analytics** - Track which sources are most frequently cited

---

## Success Criteria

- ✅ `KnowledgeReference` typedef defined in types.js
- ✅ Validation script checks references structure (when present)
- ✅ Validation script validates critic IDs and source files
- ✅ Messages without references are considered valid
- ✅ No breaking changes to existing dialogues (all 120-144 messages still valid)

---

## Dependencies

- ✅ **Phase 1A Knowledge Base** - 6 critic knowledge bases complete
  - `knowledge-base/critics/su-shi/`
  - `knowledge-base/critics/guo-xi/`
  - `knowledge-base/critics/john-ruskin/`
  - `knowledge-base/critics/mama-zola/`
  - `knowledge-base/critics/professor-petrova/`
  - `knowledge-base/critics/ai-ethics-reviewer/`
- ✅ **types.js** - KnowledgeReference typedef already added
- ⏳ **Validation script** - To be created in Task 2.4

---

## Approval

| Role | Name | Status | Date |
|------|------|--------|------|
| Author | Claude | Approved | 2025-11-06 |
| Reviewer | User | Pending | - |
