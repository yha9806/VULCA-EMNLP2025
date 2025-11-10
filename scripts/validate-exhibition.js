#!/usr/bin/env node

/**
 * Exhibition Validation Tool
 * Validates exhibition JSON files against schemas and checks data integrity
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

// Initialize AJV with formats
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

// Get exhibition slug from command line arguments
const exhibitionSlug = process.argv[2];

if (!exhibitionSlug) {
  console.error('❌ Usage: npm run validate-exhibition <exhibition-slug>');
  console.error('   Example: npm run validate-exhibition negative-space-of-the-tide');
  process.exit(1);
}

// Paths
const exhibitionDir = path.join(process.cwd(), 'exhibitions', exhibitionSlug);
const configPath = path.join(exhibitionDir, 'config.json');
const dataPath = path.join(exhibitionDir, 'data.json');
const dialoguesPath = path.join(exhibitionDir, 'dialogues.json');
const assetsDir = path.join(exhibitionDir, 'assets');

// Schema paths
const configSchemaPath = path.join(process.cwd(), 'schemas', 'exhibition-config.schema.json');
const dataSchemaPath = path.join(process.cwd(), 'schemas', 'exhibition-data.schema.json');
const dialogueSchemaPath = path.join(process.cwd(), 'schemas', 'dialogue-data.schema.json');

// Error tracking
let errors = [];
let warnings = [];

// Helper function to add error
function addError(message) {
  errors.push(message);
  console.error(`❌ ${message}`);
}

// Helper function to add warning
function addWarning(message) {
  warnings.push(message);
  console.warn(`⚠️  ${message}`);
}

// Validation function
async function validateExhibition() {
  console.log(`\n🔍 Validating exhibition: ${exhibitionSlug}\n`);

  // Check if exhibition directory exists
  if (!fs.existsSync(exhibitionDir)) {
    addError(`Exhibition directory not found: ${exhibitionDir}`);
    process.exit(1);
  }

  // 1. Validate config.json
  console.log('1️⃣  Validating config.json...');
  if (!fs.existsSync(configPath)) {
    addError('config.json not found');
  } else {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      const schema = JSON.parse(fs.readFileSync(configSchemaPath, 'utf8'));
      const validate = ajv.compile(schema);
      const valid = validate(config);

      if (!valid) {
        addError('config.json validation failed:');
        validate.errors.forEach(err => {
          addError(`  ${err.instancePath} ${err.message}`);
        });
      } else {
        console.log('   ✓ config.json validates against schema');
      }

      // Check if id matches slug
      if (config.id !== exhibitionSlug) {
        addWarning(`config.id (${config.id}) doesn't match directory slug (${exhibitionSlug})`);
      }
    } catch (error) {
      addError(`Error parsing config.json: ${error.message}`);
    }
  }

  // 2. Validate data.json
  console.log('\n2️⃣  Validating data.json...');
  let data = null;
  if (!fs.existsSync(dataPath)) {
    addError('data.json not found');
  } else {
    try {
      data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      const schema = JSON.parse(fs.readFileSync(dataSchemaPath, 'utf8'));
      const validate = ajv.compile(schema);
      const valid = validate(data);

      if (!valid) {
        addError('data.json validation failed:');
        validate.errors.forEach(err => {
          addError(`  ${err.instancePath} ${err.message}`);
        });
      } else {
        console.log('   ✓ data.json validates against schema');

        // Check array lengths
        console.log(`   ✓ ${data.artworks.length} artwork(s) found`);
        console.log(`   ✓ ${data.personas.length} persona(s) found`);
        console.log(`   ✓ ${data.critiques.length} critique(s) found`);

        // Verify expected counts match config
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        if (config.stats) {
          if (data.artworks.length !== config.stats.artworks) {
            addWarning(`Artwork count mismatch: data has ${data.artworks.length}, config expects ${config.stats.artworks}`);
          }
          if (data.personas.length !== config.stats.personas) {
            addWarning(`Persona count mismatch: data has ${data.personas.length}, config expects ${config.stats.personas}`);
          }
        }
      }
    } catch (error) {
      addError(`Error parsing data.json: ${error.message}`);
    }
  }

  // 3. Validate dialogues.json
  console.log('\n3️⃣  Validating dialogues.json...');
  let dialogues = null;
  if (!fs.existsSync(dialoguesPath)) {
    addError('dialogues.json not found');
  } else {
    try {
      dialogues = JSON.parse(fs.readFileSync(dialoguesPath, 'utf8'));
      const schema = JSON.parse(fs.readFileSync(dialogueSchemaPath, 'utf8'));
      const validate = ajv.compile(schema);
      const valid = validate(dialogues);

      if (!valid) {
        addError('dialogues.json validation failed:');
        validate.errors.forEach(err => {
          addError(`  ${err.instancePath} ${err.message}`);
        });
      } else {
        console.log('   ✓ dialogues.json validates against schema');
        console.log(`   ✓ ${dialogues.dialogues.length} dialogue(s) found`);

        // Count total messages
        const totalMessages = dialogues.dialogues.reduce((sum, d) => sum + d.messages.length, 0);
        console.log(`   ✓ ${totalMessages} total message(s)`);
      }
    } catch (error) {
      addError(`Error parsing dialogues.json: ${error.message}`);
    }
  }

  // 4. Validate referential integrity
  if (data && dialogues) {
    console.log('\n4️⃣  Checking referential integrity...');

    const artworkIds = data.artworks.map(a => a.id);
    const personaIds = data.personas.map(p => p.id);

    // Check critiques reference valid artworks and personas
    let validCritiques = 0;
    data.critiques.forEach((critique, idx) => {
      if (!artworkIds.includes(critique.artworkId)) {
        addError(`Critique ${idx}: Invalid artworkId "${critique.artworkId}"`);
      }
      if (!personaIds.includes(critique.personaId)) {
        addError(`Critique ${idx}: Invalid personaId "${critique.personaId}"`);
      }
      if (artworkIds.includes(critique.artworkId) && personaIds.includes(critique.personaId)) {
        validCritiques++;
      }
    });
    console.log(`   ✓ ${validCritiques}/${data.critiques.length} critique(s) have valid references`);

    // Check dialogues reference valid artworks and personas
    dialogues.dialogues.forEach((dialogue, dIdx) => {
      if (!artworkIds.includes(dialogue.artworkId)) {
        addError(`Dialogue ${dIdx}: Invalid artworkId "${dialogue.artworkId}"`);
      }

      dialogue.messages.forEach((message, mIdx) => {
        if (!personaIds.includes(message.personaId)) {
          addError(`Dialogue ${dIdx}, Message ${mIdx}: Invalid personaId "${message.personaId}"`);
        }
        if (message.replyTo && !personaIds.includes(message.replyTo)) {
          addError(`Dialogue ${dIdx}, Message ${mIdx}: Invalid replyTo "${message.replyTo}"`);
        }
      });
    });
    console.log(`   ✓ All dialogue references validated`);
  }

  // 5. Validate assets exist
  console.log('\n5️⃣  Checking assets...');
  if (!fs.existsSync(assetsDir)) {
    addWarning('assets/ directory not found');
  } else {
    const coverPath = path.join(assetsDir, 'cover.jpg');
    if (fs.existsSync(coverPath)) {
      const stats = fs.statSync(coverPath);
      const sizeKB = Math.round(stats.size / 1024);
      console.log(`   ✓ Cover image exists: ${sizeKB}KB`);
      if (sizeKB > 500) {
        addWarning(`Cover image is large (${sizeKB}KB), recommend <500KB`);
      }
    } else {
      addWarning('Cover image not found: assets/cover.jpg');
    }

    const ogPath = path.join(assetsDir, 'og-image.jpg');
    if (fs.existsSync(ogPath)) {
      const stats = fs.statSync(ogPath);
      const sizeKB = Math.round(stats.size / 1024);
      console.log(`   ✓ OG image exists: ${sizeKB}KB`);
    } else {
      addWarning('OG image not found: assets/og-image.jpg');
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ Validation passed with no errors or warnings!');
    process.exit(0);
  } else {
    if (errors.length > 0) {
      console.log(`❌ ${errors.length} error(s) found`);
    }
    if (warnings.length > 0) {
      console.log(`⚠️  ${warnings.length} warning(s) found`);
    }

    if (errors.length > 0) {
      console.log('\nPlease fix errors before deploying this exhibition.');
      process.exit(1);
    } else {
      console.log('\n✅ Validation passed (with warnings)');
      process.exit(0);
    }
  }
}

// Run validation
validateExhibition().catch(error => {
  console.error(`\n❌ Unexpected error: ${error.message}`);
  process.exit(1);
});
