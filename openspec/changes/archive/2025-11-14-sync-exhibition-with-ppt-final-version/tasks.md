# Tasks: Sync Exhibition with PPT Final Version

**Change ID**: `sync-exhibition-with-ppt-final-version`
**Total Estimated Time**: 10 hours
**Created**: 2025-11-14

---

## Phase 1: Data Extraction & Preparation (2 hours)

### Task 1.1: Extract Artwork Metadata from PPT
**Time**: 30 minutes
**Dependencies**: PPT final version file
**Assignee**: TBD

**Steps**:
1. Run Python script to extract all artwork data from slides
2. Map slide numbers to artwork IDs (39-46)
3. Extract artist names, titles, years, schools
4. Generate initial JSON structure

**Success Criteria**:
- [ ] JSON file with 8 artwork entries created
- [ ] All required fields populated
- [ ] Schools correctly identified
- [ ] Status field set correctly (5 confirmed, 3 pending)

**Validation**:
```bash
python scripts/extract-ppt-artworks.py --slides 97-100 --output temp/new-artworks.json
jq '. | length' temp/new-artworks.json  # Should output: 8
```

---

### Task 1.2: Merge New Artworks into data.json
**Time**: 30 minutes
**Dependencies**: Task 1.1

**Steps**:
1. Back up current `data.json` to `data.json.backup-2025-11-14`
2. Merge 8 new artwork entries into artworks array
3. Assign artwork IDs (artwork-39 to artwork-46)
4. Update exhibition metadata (artwork count, date updated)

**Success Criteria**:
- [ ] `data.json` contains 46 artworks total
- [ ] No duplicate IDs
- [ ] JSON syntax valid
- [ ] Backup file created

**Validation**:
```bash
# Backup
cp exhibitions/negative-space-of-the-tide/data.json exhibitions/negative-space-of-the-tide/data.json.backup-2025-11-14

# Validate after merge
jq '.artworks | length' exhibitions/negative-space-of-the-tide/data.json  # Should be 46
jq -e . exhibitions/negative-space-of-the-tide/data.json  # Check syntax
```

---

### Task 1.3: Remove Withdrawn Artists
**Time**: 15 minutes
**Dependencies**: Task 1.2

**Steps**:
1. Search `data.json` for 李鹏飞, 陈筱薇, 龍暐翔
2. Remove any artworks by these artists
3. Update indexes if needed
4. Document removal in changelog

**Success Criteria**:
- [ ] No artworks by removed artists remain
- [ ] Artwork IDs remain sequential
- [ ] No broken references

**Validation**:
```bash
jq '.artworks[] | select(.artist | contains("李鹏飞"))' exhibitions/negative-space-of-the-tide/data.json
# Should return empty

jq '.artworks[] | select(.artist | contains("陈筱薇"))' exhibitions/negative-space-of-the-tide/data.json
# Should return empty
```

---

### Task 1.4: Create Placeholder Images
**Time**: 45 minutes
**Dependencies**: None

**Steps**:
1. Create SVG placeholder template
2. Generate 3 pending artwork placeholders
3. Create 5 temporary images for confirmed artworks (if needed)
4. Place in `/assets/placeholders/` directory

**Success Criteria**:
- [ ] `pending-artwork.svg` created
- [ ] SVG includes "Coming Soon" text
- [ ] SVG has 3:2 aspect ratio (1200x800)
- [ ] At least 3 placeholder files exist

**Files Created**:
```
/assets/placeholders/pending-artwork.svg
/assets/placeholders/artwork-40-pending.svg  (金钛锆)
/assets/placeholders/artwork-42-pending.svg  (一名奇怪的鸟类观察员)
/assets/placeholders/artwork-44-pending.svg  (罗薇)
```

---

## Phase 2: Dialogue Generation (3 hours)

### Task 2.1: Generate Critiques for Confirmed Artists
**Time**: 1 hour
**Dependencies**: Task 1.2 (data.json updated)

**Steps**:
1. Add 6 critique entries per confirmed artwork (5 artworks × 6 = 30 critiques)
2. Use existing critique templates or generate with LLM
3. Include RPAIT scores for each critique
4. Add knowledge base references

**Success Criteria**:
- [ ] 30 new critique entries in `data.json`
- [ ] Each critique has all 6 personas
- [ ] RPAIT scores are valid (1-10)
- [ ] References field populated

**Validation**:
```bash
# Count critiques for artwork-39
jq '.critiques[] | select(.artworkId == "artwork-39") | .personaId' exhibitions/negative-space-of-the-tide/data.json
# Should list 6 personas
```

---

### Task 2.2: Run Dialogue Conversion Script
**Time**: 30 minutes
**Dependencies**: Task 2.1

**Steps**:
1. Run `scripts/convert-critiques-to-dialogues.js --batch 39-46`
2. Generate 8 dialogue files
3. Verify file structure and exports

**Success Criteria**:
- [ ] 8 files created: `artwork-39.js` to `artwork-46.js`
- [ ] Each file exports correct dialogue object
- [ ] Pending artworks have placeholder dialogues
- [ ] Confirmed artworks have 6+ messages each

**Validation**:
```bash
node scripts/convert-critiques-to-dialogues.js --batch 39-46

# Check files created
ls js/data/dialogues/artwork-{39,40,41,42,43,44,45,46}.js
# Should list 8 files

# Check exports
node -e "import('./js/data/dialogues/artwork-39.js').then(m => console.log('Messages:', m.artwork39Dialogue.messages.length))"
# Should output: Messages: 6 (or more)
```

---

### Task 2.3: Manual Review & Enhancement
**Time**: 1 hour
**Dependencies**: Task 2.2

**Steps**:
1. Read through 2-3 messages per dialogue
2. Check persona voice consistency
3. Enhance 1-2 key messages per artwork (add poetic language, deeper analysis)
4. Verify knowledge base references are accurate

**Success Criteria**:
- [ ] At least 15 messages manually reviewed
- [ ] At least 10 messages enhanced
- [ ] No persona voice inconsistencies found
- [ ] All references valid

**Review Checklist** (per message):
- [ ] Su Shi uses classical Chinese literary references
- [ ] Guo Xi discusses landscape/nature principles
- [ ] John Ruskin emphasizes moral/social dimensions
- [ ] Mama Zola centers community/decolonial perspective
- [ ] Professor Petrova focuses on formal/structural analysis
- [ ] AI Ethics Reviewer questions power dynamics

---

### Task 2.4: Update Dialogue Index
**Time**: 30 minutes
**Dependencies**: Task 2.2

**Steps**:
1. Edit `js/data/dialogues/index.js`
2. Add 8 import statements (artwork-39 to artwork-46)
3. Add 8 entries to DIALOGUES array
4. Update version parameters (?v=4 → ?v=5)
5. Update statistics comment

**Success Criteria**:
- [ ] 8 new imports added
- [ ] DIALOGUES array has 46 entries
- [ ] All imports use ?v=5
- [ ] Statistics comment updated

**Validation**:
```javascript
import { DIALOGUES } from '/js/data/dialogues/index.js?v=5';
console.log('Total dialogues:', DIALOGUES.length);  // Should be 46
console.log('Last dialogue ID:', DIALOGUES[45].artworkId);  // Should be 'artwork-46'
```

---

## Phase 3: Artist Roster Page (2 hours)

### Task 3.1: Create Artist Roster HTML
**Time**: 45 minutes
**Dependencies**: Task 1.2 (data.json complete)

**Steps**:
1. Create `/pages/artists.html` file
2. Add header with title "艺术家名单 / Artist Roster"
3. Create filter controls (school, status, search)
4. Create grid container for artist cards
5. Add return to homepage button

**Success Criteria**:
- [ ] File exists at correct path
- [ ] HTML validates
- [ ] Includes all navigation elements
- [ ] Responsive meta tags present

**File Structure**:
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>艺术家名单 | VULCA</title>
  <link rel="stylesheet" href="/styles/main.css?v=6">
  <link rel="stylesheet" href="/styles/pages/artists.css?v=1">
</head>
<body>
  <header>
    <h1 lang="zh">艺术家名单</h1>
    <h1 lang="en">Artist Roster</h1>
  </header>

  <div class="filters">...</div>
  <div class="artist-grid"></div>

  <script src="/js/pages/artists.js?v=1"></script>
</body>
</html>
```

---

### Task 3.2: Implement Artist Card Rendering
**Time**: 45 minutes
**Dependencies**: Task 3.1

**Steps**:
1. Create `js/pages/artists.js`
2. Fetch artwork data from `data.json`
3. Render 46 artist cards dynamically
4. Add click handlers to navigate to artwork detail
5. Apply status badges (confirmed/pending)

**Success Criteria**:
- [ ] All 46 cards render
- [ ] Cards have correct artist name, school, thumbnail
- [ ] Status badges show correctly
- [ ] Click navigates to artwork page
- [ ] Navigation state saved to sessionStorage

**Implementation**:
```javascript
async function renderArtistGrid() {
  const response = await fetch('/exhibitions/negative-space-of-the-tide/data.json');
  const data = await response.json();

  const grid = document.querySelector('.artist-grid');

  data.artworks.forEach(artwork => {
    const card = createArtistCard(artwork);
    grid.appendChild(card);
  });
}

function createArtistCard(artwork) {
  const card = document.createElement('div');
  card.className = 'artist-card';
  card.dataset.id = artwork.id;
  card.dataset.status = artwork.status || 'confirmed';
  card.dataset.school = artwork.metadata?.school || '';

  card.innerHTML = `
    <img src="${artwork.imageUrl}" alt="${artwork.artist}">
    <h3>${artwork.artist}</h3>
    <p class="school">${artwork.metadata?.school || ''}</p>
    <span class="status-badge ${artwork.status || 'confirmed'}">
      ${artwork.status === 'pending' ? '⏳ Coming Soon' : '✓ Confirmed'}
    </span>
  `;

  card.addEventListener('click', () => navigateToArtwork(artwork.id));

  return card;
}
```

---

### Task 3.3: Implement Filter Functionality
**Time**: 30 minutes
**Dependencies**: Task 3.2

**Steps**:
1. Add event listeners to filter controls
2. Implement school filter (dropdown)
3. Implement status filter (dropdown)
4. Implement search (input with debounce)
5. Update URL query parameters

**Success Criteria**:
- [ ] School filter works
- [ ] Status filter works
- [ ] Search works with 300ms debounce
- [ ] Multiple filters combine (AND logic)
- [ ] URL updates with query params
- [ ] Filters persist on page reload

**Implementation**:
```javascript
function applyFilters() {
  const school = document.querySelector('select[name="school"]').value;
  const status = document.querySelector('select[name="status"]').value;
  const search = document.querySelector('input[name="search"]').value.toLowerCase();

  document.querySelectorAll('.artist-card').forEach(card => {
    const matchSchool = !school || card.dataset.school === school;
    const matchStatus = !status || card.dataset.status === status;
    const matchSearch = !search || card.textContent.toLowerCase().includes(search);

    card.style.display = (matchSchool && matchStatus && matchSearch) ? 'block' : 'none';
  });

  // Update URL
  const params = new URLSearchParams({ school, status, search });
  history.replaceState(null, '', `?${params.toString()}`);
}
```

---

## Phase 4: Navigation Integration (1 hour)

### Task 4.1: Add Return to List Button
**Time**: 30 minutes
**Dependencies**: Task 3.1 (artist roster page exists)

**Steps**:
1. Add button HTML to exhibition index.html
2. Style button (top-left corner, hover effects)
3. Implement click handler with scroll restoration
4. Show/hide based on navigation state

**Success Criteria**:
- [ ] Button visible on artwork pages
- [ ] Button positioned correctly
- [ ] Click navigates to `/pages/artists.html`
- [ ] Scroll position restored
- [ ] Button hidden if no navigation state (graceful degradation)

**Implementation**:
```html
<!-- In exhibitions/negative-space-of-the-tide/index.html -->
<button class="return-to-list-btn" id="returnToListBtn" style="display: none;">
  <span lang="zh">← 返回名单</span>
  <span lang="en">← Return to List</span>
</button>

<script>
// Show button if came from artist roster
const navState = JSON.parse(sessionStorage.getItem('nav_state') || '{}');
if (navState.from === 'artist-roster') {
  document.getElementById('returnToListBtn').style.display = 'block';
}

// Click handler
document.getElementById('returnToListBtn').addEventListener('click', () => {
  sessionStorage.setItem('nav_scroll', window.scrollY);
  window.location.href = '/pages/artists.html';
});
</script>
```

---

### Task 4.2: Update Global Navigation Menu
**Time**: 30 minutes
**Dependencies**: Task 3.1

**Steps**:
1. Edit navigation menu component
2. Add "艺术家名单" menu item
3. Position between "主页" and "展览归档"
4. Update active state detection

**Success Criteria**:
- [ ] Menu item visible in hamburger menu
- [ ] Link navigates to `/pages/artists.html`
- [ ] Menu item highlighted when on artist page
- [ ] Mobile: Menu closes after click

**Implementation**:
```html
<!-- In navigation component -->
<nav class="navigation-menu">
  <a href="/">主页 / Home</a>
  <a href="/pages/artists.html" class="artists-link">艺术家名单 / Artist Roster</a>
  <a href="/pages/exhibitions-archive.html">展览归档 / Exhibitions</a>
  <a href="/pages/critics.html">评论家 / Critics</a>
  <a href="/pages/about.html">关于 / About</a>
</nav>

<script>
// Highlight active page
if (window.location.pathname.includes('artists.html')) {
  document.querySelector('.artists-link').classList.add('active');
}
</script>
```

---

## Phase 5: UI Enhancements (1 hour)

### Task 5.1: Create Pending Artwork Overlay Component
**Time**: 30 minutes
**Dependencies**: None

**Steps**:
1. Create CSS for pending overlay
2. Add overlay HTML structure
3. Implement show/hide logic based on status
4. Add hover tooltips explaining pending status

**Success Criteria**:
- [ ] Overlay displays on pending artworks
- [ ] Overlay shows "⏳ Coming Soon" text
- [ ] Background is semi-transparent
- [ ] Tooltip explains expected date

**CSS**:
```css
.pending-artwork {
  position: relative;
  opacity: 0.7;
}

.pending-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  pointer-events: none;
}

.pending-overlay::before {
  content: '⏳';
  font-size: 3rem;
  margin-bottom: 0.5rem;
}
```

---

### Task 5.2: Update Artwork Carousel Component
**Time**: 30 minutes
**Dependencies**: Task 5.1

**Steps**:
1. Modify carousel rendering to check status field
2. Add status badge to pending artwork cards
3. Disable dialogue playback for pending artworks
4. Add visual indicator (reduced opacity)

**Success Criteria**:
- [ ] Carousel displays status badges
- [ ] Pending artworks have 70% opacity
- [ ] Clicking pending artwork shows message instead of dialogue
- [ ] Confirmed artworks work normally

**Implementation**:
```javascript
// In js/components/artwork-carousel.js
function renderArtworkCard(artwork) {
  const isPending = artwork.status === 'pending';

  const card = document.createElement('div');
  card.className = 'artwork-card';
  card.dataset.status = artwork.status || 'confirmed';

  if (isPending) {
    card.innerHTML = `
      <div class="pending-artwork">
        <img src="${artwork.imageUrl}" alt="Coming Soon">
        <div class="pending-overlay">
          <span>⏳ Coming Soon</span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      alert('This artwork is still being created. Check back soon!');
    });
  } else {
    card.innerHTML = `<img src="${artwork.imageUrl}" alt="${artwork.titleZh}">`;
    card.addEventListener('click', () => loadDialogue(artwork.id));
  }

  return card;
}
```

---

## Phase 6: Testing & Deployment (2 hours)

### Task 6.1: Data Validation
**Time**: 30 minutes
**Dependencies**: All Phase 1-2 tasks complete

**Steps**:
1. Run JSON schema validation
2. Run dialogue validation script
3. Check for orphaned references
4. Validate all image URLs

**Success Criteria**:
- [ ] No JSON syntax errors
- [ ] All 46 artworks validate
- [ ] All 46 dialogues validate
- [ ] No 404 errors for images
- [ ] No orphaned persona/artwork references

**Validation Commands**:
```bash
# Validate JSON syntax
jq -e . exhibitions/negative-space-of-the-tide/data.json

# Validate dialogues
node scripts/validate-dialogue-data.js --artworks 39-46

# Check image URLs
node scripts/check-image-urls.js

# Check cross-references
node scripts/validate-cross-references.js
```

---

### Task 6.2: Local Testing
**Time**: 45 minutes
**Dependencies**: All Phase 1-5 tasks complete

**Steps**:
1. Start local server: `python -m http.server 9999`
2. Test artist roster page (/pages/artists.html)
3. Test filters (school, status, search)
4. Test navigation flow (roster → detail → back)
5. Test dialogue playback for confirmed artworks
6. Test pending artwork indicators
7. Test responsive design (3 breakpoints)

**Testing Checklist**:
- [ ] Artist roster loads with 46 cards
- [ ] School filter works
- [ ] Status filter works
- [ ] Search works
- [ ] Card click navigates correctly
- [ ] Return button works
- [ ] Scroll restoration works
- [ ] Dialogues load for confirmed artworks
- [ ] Pending artworks show overlay
- [ ] Responsive on 375px, 768px, 1200px

---

### Task 6.3: Playwright E2E Tests
**Time**: 30 minutes
**Dependencies**: Task 6.2

**Steps**:
1. Write Playwright tests for artist roster
2. Write tests for navigation flow
3. Write tests for filter functionality
4. Run all tests

**Test Files**:
```bash
# Create test file
touch tests/artist-roster.spec.js

# Run tests
npx playwright test tests/artist-roster.spec.js
```

**Test Coverage**:
- [ ] Artist roster page loads
- [ ] 46 cards render
- [ ] Filters work
- [ ] Navigation works
- [ ] Return button works
- [ ] Dialogues load correctly
- [ ] Pending artworks handled correctly

---

### Task 6.4: Deploy to GitHub Pages
**Time**: 15 minutes
**Dependencies**: All tests pass

**Steps**:
1. Commit all changes with descriptive message
2. Push to master branch
3. Wait for GitHub Actions deployment
4. Verify deployment successful
5. Test live site

**Commands**:
```bash
# Commit
git add .
git commit -m "feat: Sync exhibition with PPT final version

- Add 8 new artworks (5 confirmed, 3 pending)
- Create artist roster page with filters
- Add return to list navigation
- Update dialogues (38→46)
- Add pending artwork indicators

Implements: sync-exhibition-with-ppt-final-version
Closes: #PPT-SYNC-001"

# Push
git push origin master

# Check deployment status
gh run list --limit 1

# Open live site
open https://vulcaart.art/pages/artists.html
```

**Deployment Checklist**:
- [ ] Git push successful
- [ ] GitHub Actions workflow passes
- [ ] Site builds successfully
- [ ] Changes visible on live site
- [ ] Cache invalidation successful
- [ ] No 404 errors

---

### Task 6.5: Post-Deployment Verification
**Time**: 15 minutes
**Dependencies**: Task 6.4

**Steps**:
1. Visit live site: https://vulcaart.art
2. Navigate to artist roster
3. Test 3-5 random artworks
4. Verify dialogues load
5. Check browser console for errors
6. Test on mobile device

**Verification Checklist**:
- [ ] Homepage loads correctly
- [ ] Artist roster accessible from menu
- [ ] Artist roster shows 46 artworks
- [ ] Filters work on live site
- [ ] Navigation works
- [ ] Dialogues load correctly
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Images load correctly (or placeholders show)

---

## Summary

**Total Tasks**: 19
**Estimated Time**: 10 hours
**Critical Path**: Phase 1 → Phase 2 → Phase 3 → Phase 6

**Milestones**:
1. **Data Complete** (End of Phase 2): 46 artworks + 46 dialogues ready
2. **UI Complete** (End of Phase 5): Artist roster + navigation fully functional
3. **Deployed** (End of Phase 6): Live on vulcaart.art

**Risks**:
- Image acquisition delays → Use placeholders (mitigation: already planned)
- Dialogue quality issues → Manual review + enhancement (mitigation: Task 2.3)
- Navigation state bugs → Graceful degradation (mitigation: button hidden if no state)

**Dependencies**:
- PPT final version ✅
- Existing scripts (`convert-critiques-to-dialogues.js`) ✅
- Data schema ✅
- UI components (carousel, dialogue player) ✅

**Blockers**: None identified
