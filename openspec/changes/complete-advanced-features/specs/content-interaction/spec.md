# Content Interaction & Discovery - Specification

**Capability:** Search, filtering, bookmarking, sharing, and comparison of art critiques

---

## ADDED Requirements

### R1: Full-Text Search
The system SHALL search critiques by keywords, personas, and artworks.

#### Scenario: User searches for philosophy critiques
```gherkin
Given user types "philosophy" in search box
When search executes
Then results include all critiques mentioning "philosophy" in text
And results sorted by relevance
And top 20 results displayed
And result shows: Artwork | Persona | Preview text
```

**Acceptance Criteria:**
- Search is case-insensitive
- Tokenizes on spaces and punctuation
- Results ranked by match count (more matches = higher rank)
- Searches in: critique text, persona names, artwork titles
- Fuzzy matching optional (handle typos)
- Real-time results (type-ahead)
- Shows result count ("Showing 5 of 12 results")

**Search Examples:**
```
"Su Shi" → finds all Su Shi critiques
"Aesthetics" → finds critiques mentioning aesthetics
"high technique" → finds critiques with both words
"记忆" → finds critiques mentioning memory artwork
```

---

### R2: Multi-Dimension Filtering
The system SHALL filter critiques by persona, artwork, and RPAIT dimension.

#### Scenario: User filters by dimension
```gherkin
Given user selects "Aesthetics" dimension filter
When filter applied
Then only critiques with high Aesthetics scores (≥7) shown
And count updates dynamically
```

**Acceptance Criteria:**
- Persona filter: select one or more personas
- Artwork filter: select one or more artworks
- Dimension filter: select one or more dimensions
- Score range: slider for 0-10 range
- Filters combine with AND logic
- Clear all filters button
- Live preview: show how many match before clicking
- Remember filters in session

**Filter Examples:**
```
Persona: Su Shi + Guo Xi
= Show critiques from both personas

Artwork: 万物于万物
Dimension: Aesthetics, Technique
= Show Aesthetics and Technique scores for this artwork

Score: 8-10
= Show only high-scoring critiques
```

---

### R3: Bookmarking System
The system SHALL allow users to save favorite critiques locally.

#### Scenario: User bookmarks critique
```gherkin
Given user reads Su Shi's critique of "万物于万物"
When user clicks "Bookmark" button
Then bookmark saved locally
And button shows "★ Bookmarked" (filled star)
And bookmark appears in "My Bookmarks" list
```

**Acceptance Criteria:**
- Bookmark stored in localStorage
- Bookmarks persist across sessions
- Visual indicator: filled/unfilled star
- Bookmark list shows: Artwork | Persona | Date
- Edit bookmark: add personal notes/tags
- Delete bookmark: remove with confirmation
- Export bookmarks: download as JSON
- Search within bookmarks: "Show me philosophy-related bookmarks"
- Max bookmarks: suggest user at 100

---

### R4: Comparison View
The system SHALL display two critiques side-by-side for direct comparison.

#### Scenario: User compares two critiques
```gherkin
Given user opens "万物于万物" by Su Shi
When user clicks "Compare with..." dropdown
And selects "Guo Xi"
Then split view shows:
  [Su Shi | Guo Xi]
  [Critique text | Critique text]
  [R:7 P:9 A:8 I:8 T:6] | [R:8 P:7 A:9 I:7 T:8]
And differences highlighted (e.g., Aesthetics: 8 vs 9)
```

**Acceptance Criteria:**
- Side-by-side layout (responsive to device width)
- Both critiques visible simultaneously
- Scores displayed below each critique
- Differences highlighted in color
- "Previous/Next" to compare other personas
- "Compare another artwork" option
- Mobile: scroll horizontally or alternate view
- Keyboard navigation: arrow keys move between personas

---

### R5: Sharing System
The system SHALL generate reproducible links to share selections.

#### Scenario: User shares comparison
```gherkin
Given user has 3 persona comparison displayed
When user clicks "Share this comparison"
Then link copied: "https://vulcaart.art?view=ABC123..."
And user can paste link to friend
When friend opens link
Then exact same 3 personas' radars load automatically
```

**Acceptance Criteria:**
- State encoded in URL (base64 or similar)
- Share URL length: <150 characters
- URL includes: artwork, personas, filters, bookmarks
- "Copy to clipboard" button
- QR code generator (optional)
- Share templates for social media
- Link opens to same view (state restored perfectly)
- No backend needed (stateless)

**Shareable States:**
```
?view=eyJhcnR3b3JrIjoid...  (single critique)
?view=eyJhcnR3b3JrcyI6WyIw...  (multiple artworks)
?view=eyJjb21wYXJpIjoiew...  (comparison)
?view=eyJmaWx0ZXJzIjoiew...  (filtered search results)
```

---

### R6: Content Navigation
The system SHALL provide clear paths to discover content.

#### Scenario: User browses systematically
```gherkin
Given user navigates to "Artworks > 万物于万物"
When breadcrumb shows: Home > Artworks > 万物于万物
Then clicking each level navigates back

And "Related Content" suggests:
- Other personas' critiques of same artwork
- Other artworks by same RPAIT profile
- High-scoring Aesthetics critiques (if browsing aesthetics)
```

**Acceptance Criteria:**
- Breadcrumb trail visible (Home > Section > Item)
- "Back" button works
- "Related Content" card shows 3-5 suggestions
- Content map: visual grid of all art × persona combos
- Browse history: sidebar shows last 10 viewed
- Clear history button
- Current selection highlighted in map/history

---

## MODIFIED Requirements

### R7: InteractionManager - Selection Tracking
The InteractionManager SHALL track user selections for state serialization.

**New Methods:**
```javascript
getCurrentSelection(): {
  selectedArtwork: string | null,
  selectedPersonas: string[],
  selectedDimensions: string[],
  filters: FilterState,
  comparison: { personas: string[], artwork: string },
  bookmarks: string[]
}

restoreSelection(state: SelectionState): void
```

---

### R8: Data Index - Search Support
The data indexing system SHALL pre-compute search indexes.

**New Methods:**
```javascript
indexForSearch(): SearchIndex {
  byKeyword: Map<string, CritiqueId[]>,
  byPersona: Map<PersonaId, CritiqueId[]>,
  byArtwork: Map<ArtworkId, CritiqueId[]>,
  byDimension: Map<Dimension, CritiqueId[]>,
  fullText: Map<string, CritiqueId[]>  // Tokenized words
}
```

---

## Performance Requirements

### R9: Search Performance
- Search <50ms for any query
- Index pre-computed at load
- Results paginated (20 per page)
- Debounce typing (wait 100ms before searching)

### R10: Filter Performance
- Applying filters <10ms
- Clearing filters <5ms
- Combining multiple filters <50ms total

### R11: Bookmark Performance
- Add bookmark: <5ms
- Load bookmarks: <10ms (localStorage)
- Bookmark list renders: <50ms
- Delete bookmark: <5ms

### R12: Share Link Generation
- Generate link: <5ms
- Parse link on load: <10ms
- Restore state: <50ms

---

## Accessibility Requirements

### R13: Search Accessibility
- Label: "Search critiques"
- Results announced to screen readers
- Keyboard: Tab to search, Enter to search, arrow to select result

### R14: Filter Accessibility
- Each filter has label
- Sliders are keyboard accessible
- Checkboxes labeled
- Changes announced (e.g., "Updated: 15 results")

### R15: Comparison Accessibility
- Both critiques have headings
- Differences announced: "Aesthetics differs by 1 point"
- Keyboard: Tab through elements, arrow to switch personas

---

## Testing Requirements

### R16: Search Tests
```javascript
test('search finds critiques by keyword', () => {
  const results = search('philosophy');
  expect(results.length).toBeGreaterThan(0);
  expect(results[0].text).toContain('philosophy');
});

test('search is case-insensitive', () => {
  const results1 = search('Representation');
  const results2 = search('representation');
  expect(results1).toEqual(results2);
});

test('search results ranked by relevance', () => {
  const results = search('technique technique');  // repeated word
  expect(results[0].text).toContain('technique');
  // First result has more matches
});
```

### R17: Filter Tests
```javascript
test('single persona filter works', () => {
  const filtered = filterBy({ personas: ['Su Shi'] });
  expect(filtered.every(c => c.persona === 'Su Shi')).toBe(true);
});

test('multiple filters combine with AND', () => {
  const filtered = filterBy({
    personas: ['Su Shi'],
    artworks: ['万物于万物'],
    dimensions: ['Aesthetics']
  });
  expect(filtered.length).toBeLessThanOrEqual(1);
  expect(filtered[0].persona).toBe('Su Shi');
  expect(filtered[0].artwork).toBe('万物于万物');
});
```

### R18: Bookmark Tests
```javascript
test('bookmark persists in localStorage', () => {
  const critique = getCritique('万物于万物', 'Su Shi');
  bookmarkManager.add(critique);

  // Simulate page refresh
  const reloaded = JSON.parse(localStorage.getItem('bookmarks'));
  expect(reloaded[0].id).toBe(critique.id);
});

test('max 100 bookmarks enforced', () => {
  for (let i = 0; i < 101; i++) {
    bookmarkManager.add(createMockCritique());
  }
  expect(bookmarkManager.bookmarks.length).toBe(100);
  // Least recently bookmarked removed
});
```

### R19: Share Link Tests
```javascript
test('share link encodes state accurately', () => {
  const state = {
    artwork: '万物于万物',
    personas: ['Su Shi', 'Guo Xi'],
    comparison: true
  };

  const link = generateShareLink(state);
  const decoded = decodeShareLink(link);

  expect(decoded).toEqual(state);
});

test('shared link opens to identical view', () => {
  const link = generateShareLink(currentState);

  // Simulate friend opening link
  const restoredState = loadFromURL(link);
  expect(render(currentState)).toEqual(render(restoredState));
});
```

