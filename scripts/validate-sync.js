/**
 * Validate sync-exhibition-with-ppt-final-version
 * Phase 6.1: Data Validation
 */

const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../exhibitions/negative-space-of-the-tide/data.json');

console.log('='.repeat(70));
console.log('Phase 6.1: Data Validation - sync-exhibition-with-ppt-final-version');
console.log('='.repeat(70));

let passed = true;
let errors = [];
let warnings = [];

function addError(msg) {
  errors.push(msg);
  passed = false;
  console.error('❌', msg);
}

function addWarning(msg) {
  warnings.push(msg);
  console.warn('⚠️ ', msg);
}

function checkPassed(msg) {
  console.log('✅', msg);
}

// Load data
console.log('\n[1] Loading data.json...');
let data;
try {
  data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  checkPassed('data.json loaded successfully');
} catch (error) {
  addError(`Failed to load data.json: ${error.message}`);
  process.exit(1);
}

// Check artwork count
console.log('\n[2] Validating artwork count...');
const artworkCount = data.artworks.length;
if (artworkCount === 43) {
  checkPassed(`Artwork count: ${artworkCount} (expected: 43)`);
} else {
  addError(`Artwork count: ${artworkCount} (expected: 43)`);
}

// Check confirmed vs pending
const confirmedArtworks = data.artworks.filter(a => a.status === 'confirmed' || !a.status);
const pendingArtworks = data.artworks.filter(a => a.status === 'pending');

console.log('\n[3] Validating artwork status distribution...');
if (confirmedArtworks.length === 40) {
  checkPassed(`Confirmed artworks: ${confirmedArtworks.length}`);
} else {
  addError(`Confirmed artworks: ${confirmedArtworks.length} (expected: 40)`);
}

if (pendingArtworks.length === 3) {
  checkPassed(`Pending artworks: ${pendingArtworks.length}`);
} else {
  addError(`Pending artworks: ${pendingArtworks.length} (expected: 3)`);
}

// Check new artworks present
console.log('\n[4] Validating new artworks present...');
const newArtworkIds = ['artwork-39', 'artwork-40', 'artwork-41', 'artwork-42', 'artwork-43', 'artwork-44', 'artwork-45', 'artwork-46'];
const artworkIds = data.artworks.map(a => a.id);

newArtworkIds.forEach(id => {
  if (artworkIds.includes(id)) {
    checkPassed(`${id} present`);
  } else {
    addError(`${id} missing`);
  }
});

// Check withdrawn artworks removed
console.log('\n[5] Validating withdrawn artworks removed...');
const withdrawnArtworkIds = ['artwork-10', 'artwork-17', 'artwork-30'];

withdrawnArtworkIds.forEach(id => {
  if (!artworkIds.includes(id)) {
    checkPassed(`${id} removed`);
  } else {
    addError(`${id} still present (should be removed)`);
  }
});

// Check critique count
console.log('\n[6] Validating critique count...');
const critiqueCount = data.critiques.length;
if (critiqueCount === 258) {
  checkPassed(`Total critiques: ${critiqueCount} (expected: 258)`);
} else {
  addWarning(`Total critiques: ${critiqueCount} (expected: 258)`);
}

// Check new artworks have critiques
console.log('\n[7] Validating critiques for new confirmed artworks...');
const newConfirmedIds = ['artwork-39', 'artwork-41', 'artwork-43', 'artwork-45', 'artwork-46'];

newConfirmedIds.forEach(artworkId => {
  const critiques = data.critiques.filter(c => c.artworkId === artworkId);
  if (critiques.length === 6) {
    checkPassed(`${artworkId}: ${critiques.length} critiques`);
  } else {
    addError(`${artworkId}: ${critiques.length} critiques (expected: 6)`);
  }
});

// Check pending artworks have NO critiques
console.log('\n[8] Validating pending artworks have no critiques...');
const pendingIds = ['artwork-40', 'artwork-42', 'artwork-44'];

pendingIds.forEach(artworkId => {
  const critiques = data.critiques.filter(c => c.artworkId === artworkId);
  if (critiques.length === 0) {
    checkPassed(`${artworkId}: ${critiques.length} critiques (correct for pending)`);
  } else {
    addWarning(`${artworkId}: ${critiques.length} critiques (pending should have 0)`);
  }
});

// Check dialogue files exist
console.log('\n[9] Validating dialogue files exist...');
const DIALOGUES_DIR = path.join(__dirname, '../js/data/dialogues');

newArtworkIds.forEach(id => {
  const filePath = path.join(DIALOGUES_DIR, `${id}.js`);
  if (fs.existsSync(filePath)) {
    checkPassed(`${id}.js exists`);
  } else {
    addError(`${id}.js missing`);
  }
});

// Check withdrawn dialogue files removed
console.log('\n[10] Checking withdrawn dialogue files...');
withdrawnArtworkIds.forEach(id => {
  const filePath = path.join(DIALOGUES_DIR, `${id}.js`);
  if (fs.existsSync(filePath)) {
    addWarning(`${id}.js still exists (dialogue file not removed, but excluded from index)`);
  } else {
    checkPassed(`${id}.js removed`);
  }
});

// Check placeholder images exist
console.log('\n[11] Validating placeholder images...');
const PLACEHOLDERS_DIR = path.join(__dirname, '../assets/placeholders');

pendingIds.forEach(id => {
  const filename = `pending-${id}.svg`;
  const filePath = path.join(PLACEHOLDERS_DIR, filename);
  if (fs.existsSync(filePath)) {
    checkPassed(`${filename} exists`);
  } else {
    addError(`${filename} missing`);
  }
});

// Check metadata updated
console.log('\n[12] Validating exhibition metadata...');
if (data.metadata) {
  if (data.metadata.artworkCount === 43) {
    checkPassed(`metadata.artworkCount: ${data.metadata.artworkCount}`);
  } else {
    addWarning(`metadata.artworkCount: ${data.metadata.artworkCount} (expected: 43)`);
  }

  if (data.metadata.confirmedArtworks === 40) {
    checkPassed(`metadata.confirmedArtworks: ${data.metadata.confirmedArtworks}`);
  } else {
    addWarning(`metadata.confirmedArtworks: ${data.metadata.confirmedArtworks} (expected: 40)`);
  }

  if (data.metadata.pendingArtworks === 3) {
    checkPassed(`metadata.pendingArtworks: ${data.metadata.pendingArtworks}`);
  } else {
    addWarning(`metadata.pendingArtworks: ${data.metadata.pendingArtworks} (expected: 3)`);
  }
} else {
  addWarning('metadata object not found in data.json');
}

// Final summary
console.log('\n' + '='.repeat(70));
console.log('VALIDATION SUMMARY');
console.log('='.repeat(70));

console.log(`\n✅ Passed checks: ${errors.length === 0 && warnings.length === 0 ? 'ALL' : 'Some'}`);
console.log(`❌ Errors: ${errors.length}`);
console.log(`⚠️  Warnings: ${warnings.length}`);

if (errors.length > 0) {
  console.log('\n❌ ERRORS:');
  errors.forEach((err, i) => console.log(`  ${i + 1}. ${err}`));
}

if (warnings.length > 0) {
  console.log('\n⚠️  WARNINGS:');
  warnings.forEach((warn, i) => console.log(`  ${i + 1}. ${warn}`));
}

console.log('\n' + '='.repeat(70));

if (passed && warnings.length === 0) {
  console.log('✅ VALIDATION PASSED - Ready for deployment!');
  process.exit(0);
} else if (passed) {
  console.log('⚠️  VALIDATION PASSED WITH WARNINGS - Review warnings before deployment');
  process.exit(0);
} else {
  console.log('❌ VALIDATION FAILED - Fix errors before deployment');
  process.exit(1);
}
