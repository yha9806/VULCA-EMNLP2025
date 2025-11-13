# Spec: Data Migration

**Capability:** `data-migration`
**Change:** `expand-exhibition-with-real-artworks`
**Status:** Draft

---

## ADDED Requirements

### Requirement 1: Demo Data Removal

The system SHALL remove all demo artworks and associated critiques from the negative-space-of-the-tide exhibition before adding real artworks.

**Rationale:** Prevents mixing demo data with real exhibition content, ensures clean data structure.

#### Scenario: Delete demo artworks successfully

**Given** the exhibition data file contains 4 Sougwen Chung demo artworks
**When** the demo data removal process is executed
**Then** all 4 artworks (artwork-1 through artwork-4) SHALL be deleted from the artworks array
**And** all 24 associated critiques SHALL be deleted from the critiques array
**And** the personas array SHALL remain unchanged with 6 critics
**And** the resulting JSON SHALL be valid

**Verification:**
```javascript
const data = require('./exhibitions/negative-space-of-the-tide/data.json');
expect(data.artworks.length).toBe(0);
expect(data.critiques.length).toBe(0);
expect(data.personas.length).toBe(6);
```

---

#### Scenario: Backup is created before deletion

**Given** the exhibition data file exists
**When** the demo data removal process is initiated
**Then** a backup file SHALL be created at `data.json.backup-YYYY-MM-DD`
**And** the backup SHALL contain the original demo data
**And** the backup SHALL be git-committed before proceeding with deletion

**Verification:**
```bash
# Backup file exists
test -f exhibitions/negative-space-of-the-tide/data.json.backup-2025-11-12

# Backup is in git history
git log --oneline | grep "backup: Preserve demo artworks"
```

---

### Requirement 2: Artwork Data Migration

The system SHALL migrate 38 artworks from congsheng-2025 and structured data sources to negative-space-of-the-tide exhibition.

**Rationale:** Populate exhibition with real artwork content from the Congsheng biennial.

#### Scenario: Migrate completed artworks from congsheng-2025

**Given** 5 artworks exist in `exhibitions/congsheng-2025/data.json`
**When** the artwork migration process is executed
**Then** all 5 artworks SHALL be copied to `exhibitions/negative-space-of-the-tide/data.json`
**And** artwork IDs SHALL be renumbered from artwork-84/80/82/65/60 to artwork-1/2/3/4/5
**And** extra fields (artistEn, institution, medium, contextZh) SHALL be removed
**And** image paths SHALL be updated from relative to absolute paths
**And** image IDs SHALL be updated to match new artwork IDs

**Verification:**
```javascript
const data = require('./exhibitions/negative-space-of-the-tide/data.json');
expect(data.artworks).toHaveLength(5);
expect(data.artworks[0].id).toBe('artwork-1');
expect(data.artworks[0].images[0].url).toMatch(/^\/assets\/artworks\//);
expect(data.artworks[0].images[0].id).toBe('img-1-1');
```

---

#### Scenario: Add new artworks from structured data

**Given** 33 artworks are defined in `scripts/exhibition-artworks-structured.json`
**When** the new artwork addition process is executed for each batch
**Then** each artwork SHALL have a unique ID from artwork-6 to artwork-38
**And** each artwork SHALL have required fields: id, titleZh, titleEn, year, artist, context
**And** each artwork SHALL have at least 1 image in the images array
**And** each artwork SHALL have a valid primaryImageId referencing an image in its images array
**And** the context field SHALL be in English only

**Verification:**
```javascript
const data = require('./exhibitions/negative-space-of-the-tide/data.json');
expect(data.artworks).toHaveLength(38);

data.artworks.forEach(artwork => {
  expect(artwork.id).toMatch(/^artwork-\d+$/);
  expect(artwork.titleZh).toBeDefined();
  expect(artwork.titleEn).toBeDefined();
  expect(artwork.year).toBeGreaterThan(2000);
  expect(artwork.artist).toBeDefined();
  expect(artwork.context).toBeDefined();
  expect(artwork.images.length).toBeGreaterThan(0);
  expect(artwork.images.some(img => img.id === artwork.primaryImageId)).toBe(true);
});
```

---

### Requirement 3: Image Asset Migration

The system SHALL migrate 97 image files from congsheng-2025 assets to root assets directory with proper organization.

**Rationale:** Consolidate exhibition images in standard location, enable placeholder system to work correctly.

#### Scenario: Move images to root assets directory

**Given** 97 images exist in `exhibitions/congsheng-2025/assets/artworks/`
**When** the image migration process is executed
**Then** 38 artwork directories SHALL be created in `/assets/artworks/`
**And** each directory SHALL be named `artwork-[id]/` where id is 1-38
**And** images SHALL be copied from source directories to corresponding target directories
**And** directory names SHALL be updated to match new artwork IDs
**And** all 97 images SHALL be accessible at their new paths

**Verification:**
```bash
# Count artwork directories
ls assets/artworks | wc -l
# Expected: 38

# Count total images
find assets/artworks -type f -name "*.jpg" -o -name "*.png" | wc -l
# Expected: 97

# Verify paths match data.json
node -e "
const fs = require('fs');
const data = require('./exhibitions/negative-space-of-the-tide/data.json');
let missing = 0;
data.artworks.forEach(artwork => {
  artwork.images.forEach(img => {
    if (!fs.existsSync('.' + img.url)) {
      console.log('Missing:', img.url);
      missing++;
    }
  });
});
console.log('Missing images:', missing);
"
```

---

#### Scenario: Image paths are updated in data.json

**Given** images have been moved to root assets directory
**When** image path update process is executed
**Then** all `images[].url` fields SHALL use absolute paths starting with `/assets/artworks/`
**And** all image URLs SHALL resolve to existing files or display placeholders
**And** no image URL SHALL contain relative paths like `./` or `../`

**Verification:**
```javascript
const data = require('./exhibitions/negative-space-of-the-tide/data.json');

data.artworks.forEach(artwork => {
  artwork.images.forEach(img => {
    expect(img.url).toMatch(/^\/assets\/artworks\//);
    expect(img.url).not.toContain('./');
  });
});
```

---

### Requirement 4: Data Structure Preservation

The system SHALL preserve existing data schemas for artworks and critiques without modification.

**Rationale:** Ensure compatibility with existing visualization components and avoid breaking changes.

#### Scenario: Artwork objects follow existing schema

**Given** the original exhibition uses a specific artwork schema
**When** new artworks are added
**Then** each artwork SHALL have exactly these fields: id, titleZh, titleEn, year, artist, imageUrl, primaryImageId, context, images
**And** the images array SHALL contain objects with: id, url, sequence, titleZh, titleEn, caption (optional), metadata (optional)
**And** no extra fields from congsheng-2025 (artistEn, institution, medium, contextZh) SHALL be included

**Verification:**
```javascript
const data = require('./exhibitions/negative-space-of-the-tide/data.json');

const requiredFields = ['id', 'titleZh', 'titleEn', 'year', 'artist', 'imageUrl', 'primaryImageId', 'context', 'images'];
const forbiddenFields = ['artistEn', 'institution', 'medium', 'contextZh'];

data.artworks.forEach(artwork => {
  requiredFields.forEach(field => {
    expect(artwork[field]).toBeDefined();
  });

  forbiddenFields.forEach(field => {
    expect(artwork[field]).toBeUndefined();
  });

  artwork.images.forEach(img => {
    expect(img.id).toBeDefined();
    expect(img.url).toBeDefined();
    expect(img.sequence).toBeGreaterThan(0);
  });
});
```

---

#### Scenario: Artwork IDs are unique and sequential

**Given** multiple artworks are being added
**When** ID assignment process is executed
**Then** all artwork IDs SHALL be unique
**And** IDs SHALL follow the pattern `artwork-[number]` where number is 1-38
**And** IDs SHALL be sequential without gaps

**Verification:**
```javascript
const data = require('./exhibitions/negative-space-of-the-tide/data.json');

const ids = data.artworks.map(a => a.id);
const expectedIds = Array.from({length: 38}, (_, i) => `artwork-${i + 1}`);

expect(ids).toEqual(expectedIds);
expect(new Set(ids).size).toBe(38); // All unique
```

---

## MODIFIED Requirements

None. This change adds new data without modifying existing requirements.

---

## REMOVED Requirements

None. This change is additive only.

---

## Related Capabilities

- `critique-generation`: Depends on data-migration (artworks must exist before generating critiques)
- `exhibition-metadata`: Depends on data-migration (stats must reflect migrated data)

---

## Verification Summary

**Automated Tests:**
- JSON schema validation
- ID uniqueness check
- Required field verification
- Image path resolution check
- Backup creation verification

**Manual Tests:**
- Visual inspection of artwork grid
- Image loading verification (or placeholder display)
- Data structure comparison (before/after)

**Success Criteria:**
- All 38 artworks migrated successfully
- All 97 images accessible
- Zero data structure violations
- Backup created and committed
- No console errors during testing
