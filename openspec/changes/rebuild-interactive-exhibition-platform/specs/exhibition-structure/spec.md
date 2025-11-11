# Spec: Exhibition Structure and Configuration System

**Change ID**: `rebuild-interactive-exhibition-platform`
**Capability**: `exhibition-structure`
**Status**: Draft
**Created**: 2025-11-10

---

## Overview

This spec defines the directory structure, configuration schema, and data organization for individual exhibitions in the VULCA platform.

**User Intent**: "每个展览应该有自己的文件夹，包含配置文件、数据文件和资源。我可以复制这个结构来快速创建新展览。"

---

## ADDED Requirements

### Requirement: Exhibition Directory Structure

The system SHALL organize each exhibition in a self-contained directory under `/exhibitions/[slug]/`.

**Acceptance Criteria**:
- Each exhibition SHALL have a unique slug (URL-safe identifier)
- Exhibition directory SHALL contain all necessary files for rendering
- Exhibition SHALL be portable (can be moved/copied independently)
- Directory structure SHALL be consistent across all exhibitions

**Directory Template**:
```
/exhibitions/[slug]/
├── index.html              # Exhibition page (uses template)
├── config.json             # Exhibition metadata and settings
├── data.json               # Artworks, personas, critiques data
├── dialogues.json          # Dialogue messages
├── assets/                 # Exhibition-specific media
│   ├── cover.jpg          # Homepage card cover image
│   ├── og-image.jpg       # Social sharing image
│   └── artwork-*.jpg      # Artwork images
└── README.md              # Optional: Exhibition documentation
```

#### Scenario: Exhibition Directory Contains Required Files

**Given** a new exhibition is created with slug `negative-space-of-the-tide`

**When** inspecting the directory `/exhibitions/negative-space-of-the-tide/`

**Then** the system SHALL contain:
- File: `index.html` (HTML page)
- File: `config.json` (valid JSON)
- File: `data.json` (valid JSON)
- File: `dialogues.json` (valid JSON)
- Directory: `assets/` (contains at least `cover.jpg`)

**And** all files SHALL be valid and parseable:
- HTML validates against HTML5 spec
- JSON files parse without errors
- Images are valid JPG/PNG format

**Validation**:
```bash
# Bash script to validate exhibition structure
#!/bin/bash

EXHIBITION_DIR="./exhibitions/negative-space-of-the-tide"

# Check required files exist
test -f "$EXHIBITION_DIR/index.html" || exit 1
test -f "$EXHIBITION_DIR/config.json" || exit 1
test -f "$EXHIBITION_DIR/data.json" || exit 1
test -f "$EXHIBITION_DIR/dialogues.json" || exit 1
test -d "$EXHIBITION_DIR/assets" || exit 1
test -f "$EXHIBITION_DIR/assets/cover.jpg" || exit 1

# Validate JSON files
jq empty "$EXHIBITION_DIR/config.json" || exit 1
jq empty "$EXHIBITION_DIR/data.json" || exit 1
jq empty "$EXHIBITION_DIR/dialogues.json" || exit 1

# Validate images
file "$EXHIBITION_DIR/assets/cover.jpg" | grep -q "JPEG\|PNG" || exit 1

echo "✓ Exhibition structure valid"
```

---

### Requirement: Exhibition Config Schema

The `config.json` file SHALL define exhibition metadata using a standardized schema.

**Acceptance Criteria**:
- Config SHALL be valid JSON
- Config SHALL include all required fields
- Config SHALL validate against JSON Schema
- Config SHALL support optional fields for extensibility

**Schema Definition**:
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "slug", "titleZh", "titleEn", "year", "status", "stats"],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^[a-z0-9-]+$",
      "description": "Unique exhibition identifier (kebab-case)"
    },
    "slug": {
      "type": "string",
      "pattern": "^[a-z0-9-]+$",
      "description": "URL slug (usually same as id)"
    },
    "titleZh": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100,
      "description": "Chinese title"
    },
    "titleEn": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100,
      "description": "English title"
    },
    "year": {
      "type": "integer",
      "minimum": 2020,
      "maximum": 2100,
      "description": "Exhibition year"
    },
    "status": {
      "type": "string",
      "enum": ["live", "archived", "upcoming"],
      "description": "Exhibition status"
    },
    "venue": {
      "type": "object",
      "properties": {
        "name": {"type": "string"},
        "url": {"type": "string", "format": "uri"}
      },
      "description": "Exhibition venue information"
    },
    "descriptionZh": {
      "type": "string",
      "maxLength": 500,
      "description": "Chinese description for homepage card"
    },
    "descriptionEn": {
      "type": "string",
      "maxLength": 500,
      "description": "English description for homepage card"
    },
    "stats": {
      "type": "object",
      "required": ["artworks", "personas"],
      "properties": {
        "artworks": {"type": "integer", "minimum": 1},
        "personas": {"type": "integer", "minimum": 1},
        "messages": {"type": "integer", "minimum": 0},
        "dialogues": {"type": "integer", "minimum": 0}
      },
      "description": "Exhibition statistics"
    },
    "features": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "dialogue-player",
          "image-carousel",
          "knowledge-base-references",
          "thought-chain-visualization",
          "rpait-radar",
          "persona-matrix"
        ]
      },
      "description": "Enabled features for this exhibition"
    },
    "theme": {
      "type": "object",
      "properties": {
        "primaryColor": {"type": "string", "pattern": "^#[0-9a-fA-F]{6}$"},
        "accentColor": {"type": "string", "pattern": "^#[0-9a-fA-F]{6}$"}
      },
      "description": "Theme colors"
    },
    "assets": {
      "type": "object",
      "properties": {
        "cover": {"type": "string"},
        "ogImage": {"type": "string"}
      },
      "description": "Asset paths (relative to exhibition directory)"
    }
  }
}
```

#### Scenario: Config File Validates Against Schema

**Given** a `config.json` file with the following content:
```json
{
  "id": "negative-space-of-the-tide",
  "slug": "negative-space-of-the-tide",
  "titleZh": "潮汐的负形",
  "titleEn": "Negative Space of the Tide",
  "year": 2025,
  "status": "live",
  "venue": {
    "name": "EMNLP 2025 Findings",
    "url": "https://aclanthology.org/2025.findings-emnlp.103/"
  },
  "descriptionZh": "探索AI如何从6种文化视角理解艺术：从北宋文人画到维多利亚道德批评，从俄国形式主义到西非Griot传统。",
  "descriptionEn": "Exploring how AI understands art from 6 cultural perspectives: from Song Dynasty literati painting to Victorian moral criticism, from Russian Formalism to West African Griot traditions.",
  "stats": {
    "artworks": 4,
    "personas": 6,
    "messages": 30,
    "dialogues": 4
  },
  "features": [
    "dialogue-player",
    "image-carousel",
    "knowledge-base-references",
    "thought-chain-visualization"
  ],
  "theme": {
    "primaryColor": "#B85C3C",
    "accentColor": "#D4A574"
  },
  "assets": {
    "cover": "./assets/cover.jpg",
    "ogImage": "./assets/og-image.jpg"
  }
}
```

**When** validating against the JSON Schema

**Then** the system SHALL:
- Return validation success (no errors)
- Confirm all required fields present
- Confirm all field types match schema
- Confirm all enum values valid
- Confirm all pattern constraints satisfied

**Validation**:
```javascript
// Node.js with Ajv validator
const Ajv = require('ajv');
const fs = require('fs');

const ajv = new Ajv();
const schema = JSON.parse(fs.readFileSync('./schemas/exhibition-config.schema.json', 'utf8'));
const config = JSON.parse(fs.readFileSync('./exhibitions/negative-space-of-the-tide/config.json', 'utf8'));

const validate = ajv.compile(schema);
const valid = validate(config);

if (!valid) {
  console.error('Validation errors:', validate.errors);
  process.exit(1);
}

console.log('✓ Config validates against schema');

// Additional checks
assert(config.id === config.slug);  // ID should match slug
assert(config.stats.artworks > 0);  // At least 1 artwork
assert(config.assets.cover.startsWith('./'));  // Relative path
```

---

#### Scenario: Invalid Config Fails Validation

**Given** a `config.json` file with missing required fields:
```json
{
  "id": "test-exhibit",
  "titleZh": "测试展览"
  // Missing: slug, titleEn, year, status, stats
}
```

**When** validating against the JSON Schema

**Then** the system SHALL:
- Return validation error
- List missing required fields
- Provide error messages for each violation
- Prevent exhibition from loading

**Validation**:
```javascript
const valid = validate(invalidConfig);
expect(valid).toBe(false);
expect(validate.errors).toContainEqual({
  keyword: 'required',
  params: { missingProperty: 'slug' }
});
expect(validate.errors).toContainEqual({
  keyword: 'required',
  params: { missingProperty: 'year' }
});
```

---

### Requirement: Exhibition Data Schema

The `data.json` file SHALL contain artworks, personas, and critiques in normalized format.

**Acceptance Criteria**:
- Data SHALL match existing `VULCA_DATA` structure (backward compatible)
- Data SHALL use normalized relational format (IDs reference entities)
- Data SHALL validate against JSON Schema
- Data SHALL support bilingual content (Chinese/English)

**Schema Definition**:
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["artworks", "personas", "critiques"],
  "properties": {
    "artworks": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["id", "titleZh", "titleEn", "year", "artist"],
        "properties": {
          "id": {"type": "string"},
          "titleZh": {"type": "string"},
          "titleEn": {"type": "string"},
          "year": {"type": "integer"},
          "artist": {"type": "string"},
          "images": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["id", "title", "url"],
              "properties": {
                "id": {"type": "string"},
                "title": {"type": "string"},
                "url": {"type": "string"},
                "captionZh": {"type": "string"},
                "captionEn": {"type": "string"}
              }
            }
          },
          "context": {"type": "string"}
        }
      }
    },
    "personas": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["id", "nameZh", "nameEn", "period", "bio", "color"],
        "properties": {
          "id": {"type": "string"},
          "nameZh": {"type": "string"},
          "nameEn": {"type": "string"},
          "period": {"type": "string"},
          "bio": {"type": "string"},
          "color": {"type": "string", "pattern": "^#[0-9a-fA-F]{6}$"},
          "rpait": {
            "type": "object",
            "properties": {
              "R": {"type": "integer", "minimum": 1, "maximum": 10},
              "P": {"type": "integer", "minimum": 1, "maximum": 10},
              "A": {"type": "integer", "minimum": 1, "maximum": 10},
              "I": {"type": "integer", "minimum": 1, "maximum": 10},
              "T": {"type": "integer", "minimum": 1, "maximum": 10}
            }
          }
        }
      }
    },
    "critiques": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["artworkId", "personaId", "textZh", "textEn"],
        "properties": {
          "artworkId": {"type": "string"},
          "personaId": {"type": "string"},
          "textZh": {"type": "string"},
          "textEn": {"type": "string"},
          "rpait": {
            "type": "object",
            "properties": {
              "R": {"type": "integer", "minimum": 1, "maximum": 10},
              "P": {"type": "integer", "minimum": 1, "maximum": 10},
              "A": {"type": "integer", "minimum": 1, "maximum": 10},
              "I": {"type": "integer", "minimum": 1, "maximum": 10},
              "T": {"type": "integer", "minimum": 1, "maximum": 10}
            }
          }
        }
      }
    }
  }
}
```

#### Scenario: Data File Contains Valid Exhibition Data

**Given** a `data.json` file extracted from existing `VULCA_DATA`

**When** loading the data for rendering

**Then** the system SHALL:
- Parse JSON without errors
- Find all artworks with valid IDs
- Find all personas with valid IDs
- Find all critiques with valid artwork/persona references
- Calculate RPAIT averages for personas if missing

**Validation**:
```javascript
const data = JSON.parse(fs.readFileSync('./exhibitions/negative-space-of-the-tide/data.json', 'utf8'));

// Validate structure
expect(data).toHaveProperty('artworks');
expect(data).toHaveProperty('personas');
expect(data).toHaveProperty('critiques');

// Validate arrays
expect(Array.isArray(data.artworks)).toBe(true);
expect(Array.isArray(data.personas)).toBe(true);
expect(Array.isArray(data.critiques)).toBe(true);

// Validate counts match config
const config = JSON.parse(fs.readFileSync('./exhibitions/negative-space-of-the-tide/config.json', 'utf8'));
expect(data.artworks.length).toBe(config.stats.artworks);
expect(data.personas.length).toBe(config.stats.personas);

// Validate referential integrity
const artworkIds = data.artworks.map(a => a.id);
const personaIds = data.personas.map(p => p.id);

data.critiques.forEach(critique => {
  expect(artworkIds).toContain(critique.artworkId);
  expect(personaIds).toContain(critique.personaId);
});

// Validate required fields
data.artworks.forEach(artwork => {
  expect(artwork).toHaveProperty('id');
  expect(artwork).toHaveProperty('titleZh');
  expect(artwork).toHaveProperty('titleEn');
  expect(artwork.year).toBeGreaterThan(1900);
});
```

---

### Requirement: Dialogue Data Schema

The `dialogues.json` file SHALL contain dialogue messages for the DialoguePlayer component.

**Acceptance Criteria**:
- Dialogues SHALL match existing dialogue data structure
- Dialogues SHALL reference artworks by ID
- Dialogues SHALL include message metadata (timestamp, replyTo, references)
- Dialogues SHALL support bilingual content

**Schema Definition**:
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["dialogues"],
  "properties": {
    "dialogues": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["id", "artworkId", "messages"],
        "properties": {
          "id": {"type": "string"},
          "artworkId": {"type": "string"},
          "topicZh": {"type": "string"},
          "topicEn": {"type": "string"},
          "participants": {
            "type": "array",
            "items": {"type": "string"}
          },
          "messages": {
            "type": "array",
            "minItems": 1,
            "items": {
              "type": "object",
              "required": ["id", "personaId", "textZh", "textEn", "timestamp"],
              "properties": {
                "id": {"type": "string"},
                "personaId": {"type": "string"},
                "textZh": {"type": "string"},
                "textEn": {"type": "string"},
                "timestamp": {"type": "integer", "minimum": 0},
                "replyTo": {"type": "string"},
                "interactionType": {"type": "string"},
                "quotedText": {"type": "string"},
                "references": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "required": ["critic", "source", "quote"],
                    "properties": {
                      "critic": {"type": "string"},
                      "source": {"type": "string"},
                      "quote": {"type": "string"},
                      "page": {"type": "string"}
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

#### Scenario: Dialogue Data References Valid Personas

**Given** a `dialogues.json` file with dialogue messages

**When** validating dialogue data

**Then** the system SHALL ensure:
- All `personaId` values exist in `data.json` personas
- All `replyTo` values reference valid persona IDs
- All `artworkId` values exist in `data.json` artworks
- All `participants` are valid persona IDs
- Timestamps are chronologically ordered within each dialogue

**Validation**:
```javascript
const dialogues = JSON.parse(fs.readFileSync('./exhibitions/negative-space-of-the-tide/dialogues.json', 'utf8'));
const data = JSON.parse(fs.readFileSync('./exhibitions/negative-space-of-the-tide/data.json', 'utf8'));

const personaIds = data.personas.map(p => p.id);
const artworkIds = data.artworks.map(a => a.id);

dialogues.dialogues.forEach(dialogue => {
  // Validate artwork reference
  expect(artworkIds).toContain(dialogue.artworkId);

  // Validate participants
  dialogue.participants.forEach(participantId => {
    expect(personaIds).toContain(participantId);
  });

  // Validate messages
  let lastTimestamp = -1;
  dialogue.messages.forEach(message => {
    // Validate persona
    expect(personaIds).toContain(message.personaId);

    // Validate replyTo (if present)
    if (message.replyTo) {
      expect(personaIds).toContain(message.replyTo);
    }

    // Validate chronological order
    expect(message.timestamp).toBeGreaterThanOrEqual(lastTimestamp);
    lastTimestamp = message.timestamp;
  });
});
```

---

## ADDED Requirements (Tools)

### Requirement: Exhibition Scaffolding Tool

The system SHALL provide a CLI tool to scaffold new exhibition directories.

**Acceptance Criteria**:
- Tool SHALL create all required files and directories
- Tool SHALL generate template files with placeholders
- Tool SHALL validate exhibition slug is unique
- Tool SHALL provide helpful prompts for required fields

**Tool Interface**:
```bash
# Usage:
npm run scaffold-exhibition

# Interactive prompts:
? Exhibition slug (kebab-case): my-new-exhibition
? Chinese title: 我的新展览
? English title: My New Exhibition
? Year: 2025
? Number of artworks: 3
? Number of personas: 4

# Output:
✓ Created /exhibitions/my-new-exhibition/
✓ Created config.json (template)
✓ Created data.json (template)
✓ Created dialogues.json (template)
✓ Created assets/ directory
✓ Created README.md (template)

Next steps:
1. Add cover image to assets/cover.jpg
2. Edit data.json with artworks, personas, critiques
3. Edit dialogues.json with dialogue messages
4. Run: npm run validate-exhibition my-new-exhibition
```

#### Scenario: Scaffolding Tool Creates Valid Directory

**Given** the user runs the scaffolding tool with slug `test-exhibit`

**When** the tool completes

**Then** the system SHALL create:
- Directory: `/exhibitions/test-exhibit/`
- File: `config.json` (valid JSON with placeholder values)
- File: `data.json` (valid JSON with empty arrays)
- File: `dialogues.json` (valid JSON with empty dialogues array)
- Directory: `assets/`
- File: `README.md` (markdown template)

**And** all JSON files SHALL validate against their schemas

**Validation**:
```bash
#!/bin/bash
# Test scaffolding tool
npm run scaffold-exhibition -- --slug test-exhibit --non-interactive

# Verify structure created
test -d "./exhibitions/test-exhibit" || exit 1
test -f "./exhibitions/test-exhibit/config.json" || exit 1
test -f "./exhibitions/test-exhibit/data.json" || exit 1
test -f "./exhibitions/test-exhibit/dialogues.json" || exit 1
test -d "./exhibitions/test-exhibit/assets" || exit 1

# Validate JSON
jq empty "./exhibitions/test-exhibit/config.json" || exit 1
jq empty "./exhibitions/test-exhibit/data.json" || exit 1
jq empty "./exhibitions/test-exhibit/dialogues.json" || exit 1

echo "✓ Scaffolding tool works correctly"
```

---

### Requirement: Exhibition Validation Tool

The system SHALL provide a validation tool to check exhibition data integrity.

**Acceptance Criteria**:
- Tool SHALL validate all JSON files against schemas
- Tool SHALL check referential integrity (ID references)
- Tool SHALL verify required assets exist
- Tool SHALL report all errors with clear messages

**Tool Interface**:
```bash
# Usage:
npm run validate-exhibition negative-space-of-the-tide

# Output:
Validating exhibition: negative-space-of-the-tide
✓ config.json validates against schema
✓ data.json validates against schema
✓ dialogues.json validates against schema
✓ All artwork IDs referenced in critiques exist
✓ All persona IDs referenced in critiques exist
✓ All persona IDs referenced in dialogues exist
✓ Cover image exists: assets/cover.jpg (425KB, 1200x800px)
✓ OG image exists: assets/og-image.jpg (315KB, 1200x630px)

Exhibition is valid ✓
```

#### Scenario: Validation Tool Catches Missing References

**Given** a dialogue message references a persona ID that doesn't exist in `data.json`

**When** running the validation tool

**Then** the system SHALL:
- Detect the invalid persona ID reference
- Report the error with file name and line number
- List the invalid ID and valid IDs available
- Exit with non-zero status code

**Validation**:
```bash
# Create invalid data
cat > ./exhibitions/test-exhibit/dialogues.json <<EOF
{
  "dialogues": [{
    "id": "test",
    "artworkId": "artwork-1",
    "messages": [{
      "id": "msg-1",
      "personaId": "invalid-persona-id",
      "textZh": "测试",
      "textEn": "Test",
      "timestamp": 0
    }]
  }]
}
EOF

# Run validation (should fail)
npm run validate-exhibition test-exhibit && exit 1 || true

# Verify error message
npm run validate-exhibition test-exhibit 2>&1 | grep -q "invalid-persona-id not found" || exit 1
```

---

## Non-Functional Requirements

### Data Integrity

- **Atomic Operations**: All exhibition files SHALL be created/updated atomically
- **Backup Strategy**: Before migration, existing data SHALL be backed up
- **Rollback Support**: Changes SHALL be reversible if validation fails

### Documentation

- **Schema Documentation**: Each schema SHALL have inline descriptions
- **Example Files**: Template files SHALL include commented examples
- **Migration Guide**: Documentation SHALL explain how to convert existing data

### Developer Experience

- **Fast Validation**: Validation SHALL complete in <5 seconds
- **Clear Errors**: Error messages SHALL include file, line, and fix suggestion
- **IDE Support**: JSON schemas SHALL enable autocomplete in VSCode

---

## Cross-Reference

**Related Specs**:
- `portfolio-homepage/spec.md` - Uses exhibition configs for homepage cards
- `template-system/spec.md` - Loads and renders exhibition data
- `data-migration/spec.md` - Migrates current exhibition to this structure

**Dependencies**:
- JSON Schema validator (Ajv library)
- JSON parsing library (native Node.js)
- File system utilities (fs module)

---

**Status**: Spec Complete, Ready for Implementation
**Estimated Effort**: 4-6 hours
