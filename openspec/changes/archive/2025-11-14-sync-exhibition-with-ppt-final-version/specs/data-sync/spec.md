# Spec: Data Synchronization

**Capability**: `data-sync`
**Change**: `sync-exhibition-with-ppt-final-version`
**Created**: 2025-11-14

---

## ADDED Requirements

### Requirement 1: Add 8 New Artwork Entries

The system SHALL add 8 new artwork entries to `exhibitions/negative-space-of-the-tide/data.json` with complete metadata matching PPT final version.

**Priority**: P0 (Critical)
**Dependencies**: PPT comparison analysis

#### Scenario: Add Confirmed Artist Artwork

**Given** the PPT final version contains artwork for artist "凌筱薇"
**When** the data sync script processes the PPT
**Then** `data.json` SHALL contain an entry for artwork-39
**And** the entry SHALL include:
- `id`: "artwork-39"
- `titleZh`: "渴望说出难以忘怀的事物 III"
- `titleEn`: "Longing to Speak of Unforgettable Things III"
- `artist`: "凌筱薇 (Ling Xiaowei)"
- `status`: "confirmed"
- `metadata.school`: "中央美术学院"

**Validation**:
```bash
# Check artwork count
jq '.artworks | length' exhibitions/negative-space-of-the-tide/data.json
# Expected: 46

# Check artwork-39 exists
jq '.artworks[] | select(.id == "artwork-39")' exhibitions/negative-space-of-the-tide/data.json
# Expected: Non-empty object with correct fields
```

#### Scenario: Add Pending Artist Artwork with Placeholder

**Given** the PPT final version lists artist "金钛锆" with status "作品待定"
**When** the data sync script processes the PPT
**Then** `data.json` SHALL contain an entry for artwork-40
**And** the entry SHALL include:
- `status`: "pending"
- `titleZh`: "作品待定"
- `imageUrl`: "/assets/placeholders/pending-artwork.svg"
- `metadata.expectedDate`: ISO date string

**Validation**:
```bash
# Check pending artwork
jq '.artworks[] | select(.status == "pending")' exhibitions/negative-space-of-the-tide/data.json
# Expected: 3 objects (金钛锆, 一名奇怪的鸟类观察员, 罗薇)
```

#### Scenario: Remove Withdrawn Artist

**Given** artist "李鹏飞" was removed in PPT final version
**When** the data sync script processes the removal list
**Then** `data.json` SHALL NOT contain any artwork by "李鹏飞"
**And** the exhibition metadata SHALL be updated to reflect the change

**Validation**:
```bash
# Check removed artists
jq '.artworks[] | select(.artist | contains("李鹏飞"))' exhibitions/negative-space-of-the-tide/data.json
# Expected: Empty (no results)
```

---

### Requirement 2: Extend Data Schema with Status Field

The system SHALL extend the artwork data schema to support pending/confirmed status differentiation.

**Priority**: P0 (Critical)
**Dependencies**: None

#### Scenario: Confirmed Artwork Has Valid Status

**Given** an artwork entry is added from confirmed PPT data
**When** the entry is validated against the schema
**Then** the `status` field SHALL be set to "confirmed"
**And** all required fields SHALL be populated
**And** the `imageUrl` SHALL point to an actual image file

**Validation**:
```javascript
// Schema validation
const artwork = {
  id: "artwork-39",
  status: "confirmed",
  imageUrl: "/assets/artworks/artwork-39/01.jpg",
  // ... other required fields
};

expect(artwork.status).toBe("confirmed");
expect(artwork.imageUrl).toMatch(/^\/assets\/artworks\//);
```

#### Scenario: Pending Artwork Has Placeholder Data

**Given** an artwork entry is added for a pending artist
**When** the entry is validated against the schema
**Then** the `status` field SHALL be set to "pending"
**And** the `imageUrl` SHALL point to a placeholder image
**And** the `metadata.expectedDate` field SHALL be present

**Validation**:
```javascript
const artwork = {
  id: "artwork-40",
  status: "pending",
  imageUrl: "/assets/placeholders/pending-artwork.svg",
  metadata: {
    expectedDate: "2025-12-01"
  }
};

expect(artwork.status).toBe("pending");
expect(artwork.imageUrl).toContain("placeholder");
expect(artwork.metadata.expectedDate).toMatch(/\d{4}-\d{2}-\d{2}/);
```

---

### Requirement 3: Generate Dialogues for New Artworks

The system SHALL generate dialogue files for all 8 new artworks using the existing critique-to-dialogue conversion pipeline.

**Priority**: P0 (Critical)
**Dependencies**: Critique data in `data.json`, `scripts/convert-critiques-to-dialogues.js`

#### Scenario: Generate Dialogue for Confirmed Artwork

**Given** artwork-39 has 6 critiques in `data.json`
**When** the dialogue generation script runs with `--batch 39-46`
**Then** a file `js/data/dialogues/artwork-39.js` SHALL be created
**And** the file SHALL export an `artwork39Dialogue` object
**And** the object SHALL contain 6+ messages from all 6 personas
**And** each message SHALL have valid knowledge base references

**Validation**:
```bash
# Check dialogue file exists
ls js/data/dialogues/artwork-39.js

# Check dialogue structure
node -e "
import('./js/data/dialogues/artwork-39.js').then(m => {
  console.log('Messages:', m.artwork39Dialogue.messages.length);
  console.log('Personas:', new Set(m.artwork39Dialogue.messages.map(msg => msg.personaId)).size);
});
"
# Expected: Messages: 6+, Personas: 6
```

#### Scenario: Generate Placeholder Dialogue for Pending Artwork

**Given** artwork-40 has pending status
**When** the dialogue generation script runs
**Then** a file `js/data/dialogues/artwork-40.js` SHALL be created
**And** the file SHALL contain placeholder messages
**And** each message SHALL indicate the artwork is "coming soon"

**Validation**:
```bash
# Check placeholder dialogue
grep -i "coming soon\|即将推出" js/data/dialogues/artwork-40.js
# Expected: Found
```

---

### Requirement 4: Update Dialogue Index Module

The system SHALL update `js/data/dialogues/index.js` to import and export all 8 new dialogue modules.

**Priority**: P0 (Critical)
**Dependencies**: Dialogue files artwork-39 to artwork-46

#### Scenario: Import All New Dialogues

**Given** dialogue files artwork-39.js to artwork-46.js exist
**When** the index module is loaded
**Then** index.js SHALL import all 8 new modules
**And** the DIALOGUES array SHALL contain 46 entries
**And** the module SHALL export DIALOGUES correctly

**Validation**:
```javascript
import { DIALOGUES } from '/js/data/dialogues/index.js';

expect(DIALOGUES.length).toBe(46);
expect(DIALOGUES[38].artworkId).toBe('artwork-39');
expect(DIALOGUES[45].artworkId).toBe('artwork-46');
```

#### Scenario: Handle Version Cache Busting

**Given** new dialogue files are deployed
**When** the index.js import statements are updated
**Then** each import SHALL include a version parameter `?v=5`
**And** the version SHALL be different from previous deployment

**Validation**:
```bash
grep "artwork-39.js?v=" js/data/dialogues/index.js
# Expected: import { artwork39Dialogue } from './artwork-39.js?v=5';
```

---

### Requirement 5: Validate Data Integrity

The system SHALL validate all new artwork entries to ensure schema compliance and prevent broken references.

**Priority**: P0 (Critical)
**Dependencies**: `scripts/validate-exhibition.js` or equivalent

#### Scenario: Validate Required Fields

**Given** a new artwork entry is added
**When** the validation script runs
**Then** the script SHALL check all required fields are present
**And** the script SHALL fail if any required field is missing
**And** the script SHALL output clear error messages

**Validation**:
```bash
node scripts/validate-exhibition.js --artworks 39-46

# Expected output (if valid):
# ✓ All 8 artworks validated successfully
# ✓ All required fields present
# ✓ All image URLs valid

# Expected output (if invalid):
# ✗ artwork-40: Missing field 'titleEn'
# ✗ artwork-41: Invalid year: 1999
```

#### Scenario: Validate Cross-References

**Given** dialogue files reference artwork IDs
**When** the validation script runs
**Then** the script SHALL verify all dialogue artworkId fields match actual artwork entries
**And** the script SHALL verify all persona IDs exist in VULCA_DATA.personas
**And** the script SHALL fail if any orphaned references are found

**Validation**:
```bash
# Check for orphaned dialogue references
node -e "
import { DIALOGUES } from './js/data/dialogues/index.js';
import data from './exhibitions/negative-space-of-the-tide/data.json' assert { type: 'json' };

const artworkIds = new Set(data.artworks.map(a => a.id));
const orphaned = DIALOGUES.filter(d => !artworkIds.has(d.artworkId));

console.log('Orphaned dialogues:', orphaned.length);
"
# Expected: Orphaned dialogues: 0
```

---

## MODIFIED Requirements

### Requirement 6: Update Exhibition Metadata

The system SHALL update exhibition-level metadata to reflect the new artwork count and artist roster.

**Priority**: P1 (High)
**Dependencies**: Artwork count finalized

#### Scenario: Update Artwork Count in SEO Metadata

**Given** the exhibition now contains 46 artworks
**When** the HTML meta tags are updated
**Then** the description meta tag SHALL mention "46 artworks"
**And** the Open Graph description SHALL be updated
**And** the Twitter Card metadata SHALL be updated

**Validation**:
```bash
grep -i "46.*artwork\|46件作品" exhibitions/negative-space-of-the-tide/index.html
# Expected: Found in <meta name="description"> tag
```

#### Scenario: Update Internal Statistics

**Given** the data.json now has 46 artworks
**When** the statistics comment is updated
**Then** the comment SHALL accurately reflect:
- Total artworks: 46
- Confirmed: 43
- Pending: 3
- Total dialogues: 46

**Validation**:
```bash
# Check data.json header comments
head -20 exhibitions/negative-space-of-the-tide/data.json | grep -i "46\|43\|pending"
# Expected: Found statistics
```

---

## Testing Checklist

- [ ] All 8 new artwork entries validate successfully
- [ ] No JSON syntax errors in data.json
- [ ] All 8 dialogue files generated
- [ ] Dialogue index imports all 46 dialogues
- [ ] No orphaned references
- [ ] Version cache parameters updated
- [ ] Removed artists no longer present
- [ ] Exhibition metadata updated
- [ ] SEO tags updated
- [ ] Manual spot-check of 3 random new artworks
