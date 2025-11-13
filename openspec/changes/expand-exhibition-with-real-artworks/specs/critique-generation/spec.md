# Spec: Critique Generation

**Capability:** `critique-generation`
**Change:** `expand-exhibition-with-real-artworks`
**Status:** Draft

---

## ADDED Requirements

### Requirement 1: LLM-Assisted Critique Generation

The system SHALL generate 228 art critiques (38 artworks × 6 critics) using Large Language Models and existing knowledge base.

**Rationale:** Leverage LLM capabilities and cultural knowledge base to produce high-quality, culturally-informed critiques at scale.

#### Scenario: Generate critique using LLM and knowledge base

**Given** an artwork with complete metadata exists
**And** a critic persona with knowledge base exists
**When** the critique generation process is executed for that artwork-critic pair
**Then** the system SHALL read the artwork metadata (title, artist, year, context)
**And** the system SHALL read the critic's knowledge base from `knowledge-base/critics/[critic-id]/`
**And** the system SHALL construct a prompt combining artwork info and critic style
**And** the system SHALL generate a Chinese critique of 1000-1500 characters
**And** the system SHALL generate an English critique of 1000-1500 characters
**And** the system SHALL assign RPAIT scores for all 5 dimensions
**And** the system SHALL validate the output matches the critique schema

**Verification:**
```javascript
const critique = await generateCritique(artwork, critic);

expect(critique.textZh).toBeDefined();
expect(critique.textZh.length).toBeGreaterThanOrEqual(1000);
expect(critique.textZh.length).toBeLessThanOrEqual(1500);

expect(critique.textEn).toBeDefined();
expect(critique.textEn.length).toBeGreaterThanOrEqual(1000);
expect(critique.textEn.length).toBeLessThanOrEqual(1500);

expect(critique.rpait).toEqual({
  R: expect.any(Number),
  P: expect.any(Number),
  A: expect.any(Number),
  I: expect.any(Number),
  T: expect.any(Number)
});

Object.values(critique.rpait).forEach(score => {
  expect(score).toBeGreaterThanOrEqual(1);
  expect(score).toBeLessThanOrEqual(10);
});
```

---

#### Scenario: Batch process multiple critiques for one artwork

**Given** an artwork exists
**And** 6 critic personas exist
**When** batch critique generation is executed for that artwork
**Then** the system SHALL generate 6 critiques (one per critic)
**And** all critiques SHALL reference the same artworkId
**And** each critique SHALL reference a different personaId
**And** the batch process SHALL complete within 10 minutes
**And** the system SHALL save all 6 critiques to a temporary file for review

**Verification:**
```javascript
const critiques = await generateCritiquesForArtwork(artwork, critics);

expect(critiques).toHaveLength(6);

const artworkIds = critiques.map(c => c.artworkId);
expect(new Set(artworkIds).size).toBe(1);

const personaIds = critiques.map(c => c.personaId);
expect(new Set(personaIds).size).toBe(6);
```

---

### Requirement 2: Critique Quality Assurance

The system SHALL enforce quality standards for all generated critiques through validation and human review.

**Rationale:** Ensure critiques meet length, content, and scoring requirements before publication.

#### Scenario: Validate critique length

**Given** a critique has been generated
**When** the validation process is executed
**Then** the Chinese text SHALL be between 1000-1500 characters
**And** the English text SHALL be between 1000-1500 characters
**And** critiques failing length validation SHALL be flagged for regeneration

**Verification:**
```javascript
function validateCritiqueLength(critique) {
  const zhLength = critique.textZh.length;
  const enLength = critique.textEn.length;

  return {
    zhValid: zhLength >= 1000 && zhLength <= 1500,
    enValid: enLength >= 1000 && enLength <= 1500,
    zhLength,
    enLength
  };
}

const result = validateCritiqueLength(critique);
expect(result.zhValid).toBe(true);
expect(result.enValid).toBe(true);
```

---

#### Scenario: Validate RPAIT scores

**Given** a critique has been generated
**When** the RPAIT validation process is executed
**Then** all 5 dimensions (R, P, A, I, T) SHALL have scores between 1-10
**And** scores SHALL be integers (no decimals)
**And** critiques with invalid scores SHALL be flagged for adjustment

**Verification:**
```javascript
function validateRPAIT(critique) {
  const scores = critique.rpait;
  const dimensions = ['R', 'P', 'A', 'I', 'T'];

  const errors = [];
  dimensions.forEach(dim => {
    const score = scores[dim];
    if (score < 1 || score > 10) {
      errors.push(`${dim} score ${score} out of range`);
    }
    if (!Number.isInteger(score)) {
      errors.push(`${dim} score ${score} is not an integer`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

const result = validateRPAIT(critique);
expect(result.valid).toBe(true);
expect(result.errors).toHaveLength(0);
```

---

#### Scenario: Human review of generated critiques

**Given** a batch of critiques has been generated for one artwork
**When** the human review process is initiated
**Then** all 6 critiques SHALL be displayed for review
**And** the reviewer SHALL be able to adjust RPAIT scores
**And** the reviewer SHALL be able to flag critiques for regeneration
**And** approved critiques SHALL be marked as ready for data.json
**And** the system SHALL track review status for all 228 critiques

**Verification:**
```javascript
// Review tracking structure
const reviewStatus = {
  total: 228,
  reviewed: 0,
  approved: 0,
  flagged: 0,
  remaining: 228
};

function markCritiqueReviewed(critiqueId, status) {
  reviewStatus.reviewed++;
  if (status === 'approved') {
    reviewStatus.approved++;
  } else if (status === 'flagged') {
    reviewStatus.flagged++;
  }
  reviewStatus.remaining = reviewStatus.total - reviewStatus.reviewed;
}
```

---

### Requirement 3: Critique Data Structure Compliance

The system SHALL generate critiques that match the existing data structure used by visualization components.

**Rationale:** Ensure generated critiques work with existing RPAIT radar, persona matrix, and critique panel components.

#### Scenario: Critique matches expected schema

**Given** a critique has been generated
**When** the schema validation is executed
**Then** the critique SHALL have exactly these fields: artworkId, personaId, textZh, textEn, rpait
**And** artworkId SHALL reference an existing artwork
**And** personaId SHALL reference an existing persona
**And** rpait SHALL be an object with R, P, A, I, T keys
**And** no extra fields SHALL be present

**Verification:**
```javascript
const expectedFields = ['artworkId', 'personaId', 'textZh', 'textEn', 'rpait'];
const critiqueFields = Object.keys(critique);

expect(critiqueFields.sort()).toEqual(expectedFields.sort());

const data = require('./exhibitions/negative-space-of-the-tide/data.json');
expect(data.artworks.some(a => a.id === critique.artworkId)).toBe(true);
expect(data.personas.some(p => p.id === critique.personaId)).toBe(true);

expect(Object.keys(critique.rpait)).toEqual(['R', 'P', 'A', 'I', 'T']);
```

---

### Requirement 4: Batch Processing and Progress Tracking

The system SHALL support batch processing of critique generation with progress tracking.

**Rationale:** Enable efficient generation of 228 critiques with visibility into progress.

#### Scenario: Process artworks in batches

**Given** 38 artworks need critiques generated
**When** the batch processing is initiated
**Then** artworks SHALL be processed in groups of 4-5 (8 batches total)
**And** each batch SHALL generate 6 critiques per artwork (24-30 critiques per batch)
**And** the system SHALL log progress after each batch
**And** the system SHALL allow pausing between batches
**And** the system SHALL support resuming from the last completed batch

**Verification:**
```javascript
const batchConfig = {
  batchSize: 5,
  totalArtworks: 38,
  criticsPerArtwork: 6
};

const batches = Math.ceil(batchConfig.totalArtworks / batchConfig.batchSize);
expect(batches).toBe(8);

const critiquesPerBatch = batchConfig.batchSize * batchConfig.criticsPerArtwork;
expect(critiquesPerBatch).toBe(30);
```

---

#### Scenario: Track generation progress

**Given** critique generation is in progress
**When** progress tracking is queried
**Then** the system SHALL report:
  - Total critiques to generate (228)
  - Critiques generated so far
  - Critiques reviewed
  - Critiques approved
  - Estimated time remaining
**And** progress SHALL be saved to allow resuming after interruption

**Verification:**
```javascript
const progress = {
  total: 228,
  generated: 120,
  reviewed: 90,
  approved: 85,
  flagged: 5,
  remaining: 108,
  estimatedMinutesRemaining: 54 // (108 / 228) * 120 minutes
};

expect(progress.generated + progress.remaining).toBe(progress.total);
expect(progress.approved + progress.flagged).toBeLessThanOrEqual(progress.reviewed);
```

---

### Requirement 5: Knowledge Base Integration

The system SHALL integrate existing critic knowledge bases to inform critique generation.

**Rationale:** Leverage existing cultural knowledge to generate authentic, culturally-informed critiques.

#### Scenario: Read critic knowledge base

**Given** a critic persona with ID exists
**When** the knowledge base loading process is executed
**Then** the system SHALL read `knowledge-base/critics/[critic-id]/README.md`
**And** the system SHALL extract core principles (5 items)
**And** the system SHALL extract voice characteristics
**And** the system SHALL extract key concepts from `key-concepts.md`
**And** the system SHALL include this information in the LLM prompt

**Verification:**
```javascript
const knowledgeBase = await loadCriticKnowledgeBase('su-shi');

expect(knowledgeBase.biography).toBeDefined();
expect(knowledgeBase.corePrinciples).toHaveLength(5);
expect(knowledgeBase.voiceCharacteristics).toBeDefined();
expect(knowledgeBase.keyConcepts).toHaveLength(5);

// Verify prompt includes knowledge base
const prompt = constructPrompt(artwork, critic, knowledgeBase);
expect(prompt).toContain(knowledgeBase.corePrinciples[0]);
expect(prompt).toContain(knowledgeBase.voiceCharacteristics);
```

---

#### Scenario: Apply critic style consistency

**Given** multiple critiques by the same critic exist
**When** style consistency check is performed
**Then** all critiques by that critic SHALL reflect consistent voice characteristics
**And** all critiques SHALL reference the critic's core principles
**And** no critique SHALL contradict the critic's established perspective

**Verification:**
```javascript
const suShiCritiques = critiques.filter(c => c.personaId === 'su-shi');

// Check for consistent philosophical themes
const philosophicalKeywords = ['道', '气', '意境', 'spirit', 'essence'];
suShiCritiques.forEach(critique => {
  const hasPhilosophicalContent = philosophicalKeywords.some(
    keyword => critique.textZh.includes(keyword) || critique.textEn.includes(keyword)
  );
  expect(hasPhilosophicalContent).toBe(true);
});

// Su Shi typically scores high on P (Philosophicality)
const avgPhilosophy = suShiCritiques.reduce((sum, c) => sum + c.rpait.P, 0) / suShiCritiques.length;
expect(avgPhilosophy).toBeGreaterThan(7);
```

---

## MODIFIED Requirements

None. This is a new capability.

---

## REMOVED Requirements

None.

---

## Related Capabilities

- `data-migration`: Critiques can only be generated after artworks are migrated
- `exhibition-metadata`: Stats must be updated after critiques are generated

---

## Verification Summary

**Automated Tests:**
- Critique schema validation
- Length validation (1000-1500 chars)
- RPAIT score validation (1-10 range)
- Reference integrity (artworkId, personaId)
- Batch processing logic
- Progress tracking

**Manual Tests:**
- Critique quality review (readability, depth)
- Cultural authenticity check
- Style consistency across same critic
- RPAIT score reasonableness

**Success Criteria:**
- 228 critiques generated (38 artworks × 6 critics)
- All critiques pass validation
- Human review complete with <5% regeneration rate
- Average critique quality score >4/5
- Zero schema violations
