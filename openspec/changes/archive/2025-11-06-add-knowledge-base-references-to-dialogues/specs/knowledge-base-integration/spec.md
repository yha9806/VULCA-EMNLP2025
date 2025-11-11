# Spec: Knowledge Base References Integration

**Feature**: Knowledge Base References Integration
**Change ID**: `add-knowledge-base-references-to-dialogues`
**Status**: Draft

---

## Delta: ADDED

### Requirement KBI-1: Reference Data Population

**Description**: All dialogue messages SHALL support optional knowledge base references linking to source philosophy.

**Requirements**:
- Each message MAY have a `references` array (optional field)
- Each reference MUST include: `critic`, `source`, `quote`, `page` (optional)
- Messages without references MUST remain valid (backward compatibility)
- Total reference count SHOULD be 170-255 (2-3 per message × 85 messages)

**Acceptance Criteria**:
- [ ] 85 messages support `references` field
- [ ] All 4 dialogues validate successfully with references
- [ ] Messages without references still validate
- [ ] Validation script checks reference structure

**Verification**:

**Scenario 1**: Add references to message
```gherkin
Given a dialogue message without references
When I add 2-3 reference objects to message.references array
Then validation passes
And reference count displays correctly in UI
```

**Example Code**:
```javascript
// Test: Add references to message
import { artwork1Dialogue } from './js/data/dialogues/artwork-1.js';

const message = artwork1Dialogue.messages[0];
message.references = [
  {
    critic: "su-shi",
    source: "poetry-and-theory.md",
    quote: "笔墨当随时代",
    page: "Section: 论画以形似"
  },
  {
    critic: "su-shi",
    source: "key-concepts.md",
    quote: "意境 (Yijing - Artistic Conception)",
    page: "Core Concept #2"
  }
];

// Validate
import { validateDialogue } from './scripts/validate-dialogue-data.js';
const result = validateDialogue(artwork1Dialogue);
assert(result.passed === true);
assert(message.references.length === 2);
```

**Scenario 2**: Validate reference structure
```gherkin
Given a message with references array
When validation runs
Then all references MUST have critic, source, quote fields
And critic ID MUST exist in VULCA_DATA.personas
And source file MUST exist in knowledge-base/critics/[critic-id]/
And quote text MUST be non-empty
```

**Example Code**:
```javascript
// Test: Validate reference structure
const ref = {
  critic: "su-shi",
  source: "poetry-and-theory.md",
  quote: "笔墨当随时代",
  page: "Section: 论画以形似"
};

// Check required fields
assert(ref.critic !== undefined);
assert(ref.source !== undefined);
assert(ref.quote !== undefined);
assert(ref.quote.trim().length > 0);

// Check critic ID valid
const validCritics = VULCA_DATA.personas.map(p => p.id);
assert(validCritics.includes(ref.critic));

// Check source file exists
const sourcePath = `knowledge-base/critics/${ref.critic}/${ref.source}`;
assert(fs.existsSync(sourcePath));
```

---

### Requirement KBI-2: Critic ID Validation

**Description**: All reference critic IDs MUST be valid persona IDs from VULCA_DATA.

**Requirements**:
- Critic ID MUST exist in `VULCA_DATA.personas` array
- Critic ID MUST match message.personaId for consistency (warning if mismatch)
- Invalid critic IDs MUST cause validation failure

**Acceptance Criteria**:
- [ ] Validation script checks critic ID validity
- [ ] Invalid IDs rejected with clear error message
- [ ] Cross-references warned (e.g., Su Shi message referencing Ruskin)

**Verification**:

**Scenario 1**: Valid critic ID passes
```gherkin
Given a reference with critic ID "su-shi"
And "su-shi" exists in VULCA_DATA.personas
When validation runs
Then reference is accepted
```

**Scenario 2**: Invalid critic ID fails
```gherkin
Given a reference with critic ID "invalid-critic"
And "invalid-critic" does not exist in VULCA_DATA.personas
When validation runs
Then validation fails with error "Invalid critic ID: invalid-critic"
```

**Example Code**:
```javascript
// Test: Critic ID validation
function validateCriticId(ref, message) {
  const validCritics = VULCA_DATA.personas.map(p => p.id);

  // Check existence
  if (!validCritics.includes(ref.critic)) {
    throw new Error(`Invalid critic ID: ${ref.critic}`);
  }

  // Warn if cross-reference
  if (ref.critic !== message.personaId) {
    console.warn(`Cross-reference: ${message.personaId} references ${ref.critic}`);
  }
}

// Valid case
validateCriticId({ critic: "su-shi" }, { personaId: "su-shi" });
// Pass, no warning

// Cross-reference case
validateCriticId({ critic: "john-ruskin" }, { personaId: "su-shi" });
// Pass, but warns

// Invalid case
try {
  validateCriticId({ critic: "fake-critic" }, { personaId: "su-shi" });
  assert.fail("Should have thrown error");
} catch (e) {
  assert(e.message === "Invalid critic ID: fake-critic");
}
```

---

### Requirement KBI-3: Source File Validation

**Description**: All reference source files MUST exist in the knowledge base directory structure.

**Requirements**:
- Source file MUST exist at `knowledge-base/critics/[critic-id]/[source]`
- Source file name MUST be valid filename (no path traversal)
- Missing source files MUST cause validation failure

**Acceptance Criteria**:
- [ ] Validation checks file existence
- [ ] Path traversal attempts rejected (e.g., "../../secret.md")
- [ ] Clear error message for missing files

**Verification**:

**Scenario 1**: Existing source file passes
```gherkin
Given a reference with source "poetry-and-theory.md"
And critic ID is "su-shi"
And file "knowledge-base/critics/su-shi/poetry-and-theory.md" exists
When validation runs
Then reference is accepted
```

**Scenario 2**: Missing source file fails
```gherkin
Given a reference with source "nonexistent.md"
And critic ID is "su-shi"
And file "knowledge-base/critics/su-shi/nonexistent.md" does not exist
When validation runs
Then validation fails with error "Source file not found: knowledge-base/critics/su-shi/nonexistent.md"
```

**Example Code**:
```javascript
// Test: Source file validation
import fs from 'fs';
import path from 'path';

function validateSourceFile(ref) {
  // Prevent path traversal
  if (ref.source.includes('..') || ref.source.includes('/')) {
    throw new Error(`Invalid source filename: ${ref.source}`);
  }

  const sourcePath = path.join('knowledge-base', 'critics', ref.critic, ref.source);

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source file not found: ${sourcePath}`);
  }
}

// Valid case
validateSourceFile({ critic: "su-shi", source: "poetry-and-theory.md" });
// Pass

// Missing file case
try {
  validateSourceFile({ critic: "su-shi", source: "nonexistent.md" });
  assert.fail("Should have thrown error");
} catch (e) {
  assert(e.message.includes("Source file not found"));
}

// Path traversal case
try {
  validateSourceFile({ critic: "su-shi", source: "../../../secret.md" });
  assert.fail("Should have thrown error");
} catch (e) {
  assert(e.message.includes("Invalid source filename"));
}
```

---

### Requirement KBI-4: Quote Text Validation

**Description**: All reference quotes MUST contain non-empty text.

**Requirements**:
- Quote text MUST be non-empty string
- Quote text SHOULD accurately reflect source content (manual verification)
- Empty or whitespace-only quotes MUST cause validation failure

**Acceptance Criteria**:
- [ ] Validation checks quote non-empty
- [ ] Trimmed quotes validated
- [ ] Clear error message for empty quotes

**Verification**:

**Scenario 1**: Non-empty quote passes
```gherkin
Given a reference with quote "笔墨当随时代"
When validation runs
Then reference is accepted
```

**Scenario 2**: Empty quote fails
```gherkin
Given a reference with quote ""
When validation runs
Then validation fails with error "Empty quote in reference"
```

**Scenario 3**: Whitespace-only quote fails
```gherkin
Given a reference with quote "   "
When validation runs
Then validation fails with error "Empty quote in reference"
```

**Example Code**:
```javascript
// Test: Quote text validation
function validateQuote(ref) {
  if (!ref.quote || ref.quote.trim().length === 0) {
    throw new Error("Empty quote in reference");
  }
}

// Valid case
validateQuote({ quote: "笔墨当随时代" });
// Pass

// Empty case
try {
  validateQuote({ quote: "" });
  assert.fail("Should have thrown error");
} catch (e) {
  assert(e.message === "Empty quote in reference");
}

// Whitespace case
try {
  validateQuote({ quote: "   " });
  assert.fail("Should have thrown error");
} catch (e) {
  assert(e.message === "Empty quote in reference");
}
```

---

### Requirement KBI-5: Reference Coverage Reporting

**Description**: Validation MUST report reference coverage statistics.

**Requirements**:
- Report total messages with references
- Report total reference count
- Report average references per message
- Report coverage percentage (messages with refs / total messages)

**Acceptance Criteria**:
- [ ] Validation output includes coverage stats
- [ ] Stats accurate for all 4 dialogues
- [ ] Coverage goal: 100% (85/85 messages)

**Verification**:

**Scenario 1**: Calculate coverage statistics
```gherkin
Given 4 dialogues with 85 total messages
And 170-255 total references
When validation runs
Then report shows:
  - Total messages: 85
  - Messages with references: 85 (100%)
  - Total references: 170-255
  - Avg references/message: 2-3
```

**Example Code**:
```javascript
// Test: Coverage statistics
function calculateCoverageStats(dialogues) {
  const totalMessages = dialogues.reduce((sum, d) => sum + d.messages.length, 0);
  const messagesWithRefs = dialogues.reduce((sum, d) =>
    sum + d.messages.filter(m => m.references && m.references.length > 0).length, 0
  );
  const totalRefs = dialogues.reduce((sum, d) =>
    sum + d.messages.reduce((msgSum, m) => msgSum + (m.references?.length || 0), 0), 0
  );

  return {
    totalMessages,
    messagesWithRefs,
    coveragePercent: (messagesWithRefs / totalMessages * 100).toFixed(1),
    totalReferences: totalRefs,
    avgRefsPerMessage: (totalRefs / totalMessages).toFixed(1)
  };
}

// Example output
const stats = calculateCoverageStats(DIALOGUES);
console.log(stats);
// {
//   totalMessages: 85,
//   messagesWithRefs: 85,
//   coveragePercent: "100.0",
//   totalReferences: 212,
//   avgRefsPerMessage: "2.5"
// }

assert(stats.coveragePercent === "100.0");
assert(stats.totalReferences >= 170 && stats.totalReferences <= 255);
```

---

### Requirement KBI-6: Backward Compatibility

**Description**: Dialogue system MUST support both messages with and without references.

**Requirements**:
- DialoguePlayer MUST render messages without references normally
- Validation MUST pass for dialogues without references
- UI components MUST gracefully handle missing references field

**Acceptance Criteria**:
- [ ] Messages without references display normally
- [ ] No console errors for missing references
- [ ] Validation passes for both old and new formats

**Verification**:

**Scenario 1**: Message without references displays
```gherkin
Given a message without references field
When DialoguePlayer renders the message
Then message bubble displays normally
And no reference badge appears
And no console errors occur
```

**Scenario 2**: Mixed dialogue validates
```gherkin
Given a dialogue with 10 messages
And 5 messages have references
And 5 messages have no references field
When validation runs
Then validation passes
And coverage report shows 50% (5/10)
```

**Example Code**:
```javascript
// Test: Backward compatibility
const mixedDialogue = {
  id: "test-dialogue",
  artworkId: "test",
  participants: ["su-shi", "guo-xi"],
  messages: [
    {
      id: "msg-1",
      personaId: "su-shi",
      textZh: "消息1",
      timestamp: 0
      // No references field
    },
    {
      id: "msg-2",
      personaId: "guo-xi",
      textZh: "消息2",
      timestamp: 5000,
      references: [
        {
          critic: "guo-xi",
          source: "landscape-theory.md",
          quote: "三远法",
          page: "Section: 山水画论"
        }
      ]
    }
  ]
};

// Validate
const result = validateDialogue(mixedDialogue);
assert(result.passed === true);

// Render
const player = new DialoguePlayer(mixedDialogue, container);
// Should render both messages without errors

// Coverage stats
const stats = calculateCoverageStats([mixedDialogue]);
assert(stats.messagesWithRefs === 1);
assert(stats.coveragePercent === "50.0");
```

---

## Related Specifications

- **dialogue-structure** (Phase 2): Continuous dialogue format
- **knowledge-base-system** (Phase 1A): Critic knowledge base structure

---

## Implementation Notes

### Validation Script Extension

Update `scripts/validate-dialogue-data.js` to add reference validation:

```javascript
// Add to validation checks
function validateReferences(dialogue) {
  const errors = [];
  const warnings = [];

  dialogue.messages.forEach(msg => {
    if (!msg.references) return; // Optional field

    if (!Array.isArray(msg.references)) {
      errors.push(`${msg.id}: references must be array`);
      return;
    }

    msg.references.forEach((ref, idx) => {
      // KBI-1: Required fields
      if (!ref.critic || !ref.source || !ref.quote) {
        errors.push(`${msg.id} ref[${idx}]: Missing required fields`);
      }

      // KBI-2: Critic ID valid
      const validCritics = VULCA_DATA.personas.map(p => p.id);
      if (!validCritics.includes(ref.critic)) {
        errors.push(`${msg.id} ref[${idx}]: Invalid critic ID: ${ref.critic}`);
      }

      // KBI-2: Cross-reference warning
      if (ref.critic !== msg.personaId) {
        warnings.push(`${msg.id}: Cross-references ${ref.critic}`);
      }

      // KBI-3: Source file exists
      const sourcePath = `knowledge-base/critics/${ref.critic}/${ref.source}`;
      if (!fs.existsSync(sourcePath)) {
        errors.push(`${msg.id} ref[${idx}]: Source not found: ${sourcePath}`);
      }

      // KBI-4: Quote non-empty
      if (!ref.quote || ref.quote.trim().length === 0) {
        errors.push(`${msg.id} ref[${idx}]: Empty quote`);
      }
    });
  });

  return { errors, warnings };
}
```

### DialoguePlayer Extension

Update `js/components/dialogue-player.js` to render references:

```javascript
renderMessage(message) {
  const messageEl = document.createElement('div');
  messageEl.className = 'message';

  // ... existing message rendering ...

  // KBI-6: Gracefully handle missing references
  if (message.references && message.references.length > 0) {
    const refUI = this.renderReferences(message.references);
    messageEl.appendChild(refUI);
  }

  return messageEl;
}

renderReferences(references) {
  const container = document.createElement('div');
  container.className = 'message-references';

  // Badge
  const badge = this.createReferenceBadge(references.length);
  container.appendChild(badge);

  // List (hidden by default)
  const list = this.createReferenceList(references);
  container.appendChild(list);

  return container;
}
```

---

**Status**: Specification complete
**Next**: Create reference-ui-components spec
