# Spec: Exhibition Metadata

**Capability:** `exhibition-metadata`
**Change:** `expand-exhibition-with-real-artworks`
**Status:** Draft

---

## ADDED Requirements

None. This change modifies existing metadata, does not add new capabilities.

---

## MODIFIED Requirements

### Requirement 1: Exhibition Title and Identity

The exhibition title and descriptive metadata SHALL be updated to reflect the real exhibition content.

**Rationale:** Align exhibition identity with actual content (Congsheng biennial, not "Negative Space").

#### Scenario: Update exhibition config title

**Given** the exhibition config file exists at `exhibitions/negative-space-of-the-tide/config.json`
**When** the metadata update process is executed
**Then** the `titleZh` field SHALL be updated to "丛生：两岸教育双年展——沉思之胃"
**And** the `titleEn` field SHALL be updated to "Congsheng: Cross-Strait Education Biennial - Stomach of Contemplation"
**And** the `id` and `slug` fields SHALL remain "negative-space-of-the-tide" (URL stability)
**And** the config SHALL remain valid JSON

**Verification:**
```javascript
const config = require('./exhibitions/negative-space-of-the-tide/config.json');

expect(config.titleZh).toBe('丛生：两岸教育双年展——沉思之胃');
expect(config.titleEn).toBe('Congsheng: Cross-Strait Education Biennial - Stomach of Contemplation');
expect(config.id).toBe('negative-space-of-the-tide'); // Unchanged
expect(config.slug).toBe('negative-space-of-the-tide'); // Unchanged
```

---

#### Scenario: Update API registration

**Given** the API registration exists at `api/exhibitions.json`
**When** the metadata update process is executed
**Then** the exhibition with id "negative-space-of-the-tide" SHALL have updated titleZh
**And** the exhibition SHALL have updated titleEn
**And** the exhibition id SHALL remain unchanged
**And** the updated timestamp SHALL be set to current date

**Verification:**
```javascript
const api = require('./api/exhibitions.json');
const exhibition = api.exhibitions.find(e => e.id === 'negative-space-of-the-tide');

expect(exhibition.titleZh).toBe('丛生：两岸教育双年展——沉思之胃');
expect(exhibition.titleEn).toBe('Congsheng: Cross-Strait Education Biennial - Stomach of Contemplation');
expect(exhibition.id).toBe('negative-space-of-the-tide');
expect(new Date(api.updated)).toBeInstanceOf(Date);
```

---

### Requirement 2: Exhibition Statistics

The exhibition statistics SHALL accurately reflect the migrated data (artworks, personas, messages, dialogues).

**Rationale:** Provide accurate counts for UI display and data integrity.

#### Scenario: Update artwork count in config

**Given** 38 artworks have been migrated to the exhibition
**When** the statistics update process is executed
**Then** the `stats.artworks` field in config.json SHALL be 38
**And** the `stats.personas` field SHALL be 6
**And** the `stats.messages` field SHALL be 0 (dialogues not yet generated)
**And** the `stats.dialogues` field SHALL be 0

**Verification:**
```javascript
const config = require('./exhibitions/negative-space-of-the-tide/config.json');
const data = require('./exhibitions/negative-space-of-the-tide/data.json');

expect(config.stats.artworks).toBe(38);
expect(config.stats.personas).toBe(6);
expect(config.stats.messages).toBe(0);
expect(config.stats.dialogues).toBe(0);

// Verify consistency with actual data
expect(data.artworks.length).toBe(config.stats.artworks);
expect(data.personas.length).toBe(config.stats.personas);
```

---

#### Scenario: Update artwork count in API

**Given** the exhibition metadata has been updated in config.json
**When** the API registration is updated
**Then** the `stats.artworks` field in api/exhibitions.json SHALL match config.json
**And** the `stats.personas` field SHALL match config.json
**And** other stats fields SHALL match config.json

**Verification:**
```javascript
const api = require('./api/exhibitions.json');
const config = require('./exhibitions/negative-space-of-the-tide/config.json');

const apiExhibition = api.exhibitions.find(e => e.id === 'negative-space-of-the-tide');

expect(apiExhibition.stats.artworks).toBe(config.stats.artworks);
expect(apiExhibition.stats.personas).toBe(config.stats.personas);
```

---

### Requirement 3: Exhibition Description

The exhibition description SHALL accurately describe the real exhibition content and scope.

**Rationale:** Inform users about the exhibition's focus on cross-strait education and contemporary art.

#### Scenario: Update description in config

**Given** the exhibition config file exists
**When** the description update process is executed
**Then** the `descriptionZh` field SHALL describe the Congsheng biennial
**And** the description SHALL mention 38 artworks, cross-strait collaboration, AI art, new media
**And** the `descriptionEn` field SHALL provide English translation
**And** both descriptions SHALL be 2-3 sentences

**Verification:**
```javascript
const config = require('./exhibitions/negative-space-of-the-tide/config.json');

expect(config.descriptionZh).toContain('38');
expect(config.descriptionZh).toContain('两岸');
expect(config.descriptionZh.length).toBeGreaterThan(50);
expect(config.descriptionZh.length).toBeLessThan(300);

expect(config.descriptionEn).toContain('38');
expect(config.descriptionEn).toContain('Taiwan Strait');
expect(config.descriptionEn.length).toBeGreaterThan(50);
expect(config.descriptionEn.length).toBeLessThan(300);
```

---

#### Scenario: Update description in API

**Given** the description has been updated in config.json
**When** the API registration is updated
**Then** the `descriptionZh` field in api/exhibitions.json SHALL match config.json
**And** the `descriptionEn` field SHALL match config.json

**Verification:**
```javascript
const api = require('./api/exhibitions.json');
const config = require('./exhibitions/negative-space-of-the-tide/config.json');

const apiExhibition = api.exhibitions.find(e => e.id === 'negative-space-of-the-tide');

expect(apiExhibition.descriptionZh).toBe(config.descriptionZh);
expect(apiExhibition.descriptionEn).toBe(config.descriptionEn);
```

---

### Requirement 4: Curator Information

The exhibition metadata SHALL include curator information for proper attribution.

**Rationale:** Credit the curator (Yu Haorui) who organized the Congsheng biennial.

#### Scenario: Add curator field to config

**Given** the exhibition config file exists
**When** the curator information is added
**Then** a `curator` object SHALL be added to config.json
**And** the curator object SHALL have fields: nameZh, nameEn, role
**And** nameZh SHALL be "于浩睿"
**And** nameEn SHALL be "Yu Haorui"
**And** role SHALL be "策展人"

**Verification:**
```javascript
const config = require('./exhibitions/negative-space-of-the-tide/config.json');

expect(config.curator).toBeDefined();
expect(config.curator.nameZh).toBe('于浩睿');
expect(config.curator.nameEn).toBe('Yu Haorui');
expect(config.curator.role).toBe('策展人');
```

---

#### Scenario: Add curator field to API

**Given** the curator field has been added to config.json
**When** the API registration is updated
**Then** the curator object SHALL be copied to api/exhibitions.json
**And** all curator fields SHALL match config.json

**Verification:**
```javascript
const api = require('./api/exhibitions.json');
const config = require('./exhibitions/negative-space-of-the-tide/config.json');

const apiExhibition = api.exhibitions.find(e => e.id === 'negative-space-of-the-tide');

expect(apiExhibition.curator).toEqual(config.curator);
```

---

### Requirement 5: Cover Image Asset

The exhibition SHALL have a cover image for display on the portfolio homepage and social sharing.

**Rationale:** Provide visual representation of the exhibition for cards and OpenGraph metadata.

#### Scenario: Create cover image file

**Given** artworks have been migrated with images
**When** the cover image creation process is executed
**Then** a cover.jpg file SHALL exist at `exhibitions/negative-space-of-the-tide/assets/cover.jpg`
**And** the image SHALL be 1200×630px (OpenGraph standard)
**And** the image file size SHALL be less than 300KB
**And** an identical og-image.jpg file SHALL exist at `exhibitions/negative-space-of-the-tide/assets/og-image.jpg`

**Verification:**
```bash
# Check files exist
test -f exhibitions/negative-space-of-the-tide/assets/cover.jpg
test -f exhibitions/negative-space-of-the-tide/assets/og-image.jpg

# Check file sizes
ls -lh exhibitions/negative-space-of-the-tide/assets/cover.jpg | awk '{print $5}'
# Should be <300K

# Check dimensions (requires ImageMagick)
identify exhibitions/negative-space-of-the-tide/assets/cover.jpg
# Should output: cover.jpg JPEG 1200x630 ...
```

---

#### Scenario: Cover image path in config

**Given** the cover image files have been created
**When** the config validation is performed
**Then** the `assets.cover` field SHALL point to "./assets/cover.jpg"
**And** the `assets.ogImage` field SHALL point to "./assets/og-image.jpg"
**And** both paths SHALL resolve to existing files

**Verification:**
```javascript
const fs = require('fs');
const path = require('path');
const config = require('./exhibitions/negative-space-of-the-tide/config.json');

const coverPath = path.join('exhibitions/negative-space-of-the-tide', config.assets.cover);
const ogImagePath = path.join('exhibitions/negative-space-of-the-tide', config.assets.ogImage);

expect(fs.existsSync(coverPath)).toBe(true);
expect(fs.existsSync(ogImagePath)).toBe(true);
```

---

## REMOVED Requirements

None. All original metadata fields are preserved.

---

## Related Capabilities

- `data-migration`: Metadata can only be updated after artworks are migrated
- `critique-generation`: Stats should include critique count after generation completes

---

## Verification Summary

**Automated Tests:**
- Config JSON validation
- API JSON validation
- Field value checks
- File existence checks
- Image dimension validation
- Consistency checks between config and API

**Manual Tests:**
- Exhibition card display on portfolio homepage
- Cover image visual quality
- Description readability (Chinese and English)
- Curator information display

**Success Criteria:**
- Exhibition title updated
- Stats reflect 38 artworks, 6 personas
- Description accurately describes content
- Curator information present
- Cover images exist and meet specifications
- Config and API are synchronized
