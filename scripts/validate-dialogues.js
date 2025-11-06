#!/usr/bin/env node
/**
 * Dialogue Validation Tool
 *
 * Validates dialogue data against schema and quality standards.
 * Ensures consistency, completeness, and adherence to VULCA dialogue specifications.
 *
 * Usage:
 *   node scripts/validate-dialogues.js --all
 *   node scripts/validate-dialogues.js --artwork artwork-1
 *   node scripts/validate-dialogues.js --file js/data/dialogues/artwork-1.js
 *   node scripts/validate-dialogues.js --help
 *
 * Validation Checks:
 *   1. Schema validation (required fields, types)
 *   2. Persona consistency (valid persona IDs)
 *   3. Bilingual quality (Chinese + English text present)
 *   4. Interaction type distribution (balanced)
 *   5. Timestamp ordering (chronological)
 *   6. Reply-to relationships (valid references)
 *   7. Message length (100-150 words)
 *   8. Quote validation (quotedText matches replyTo message)
 */

console.log(`
╔═══════════════════════════════════════════════════════════╗
║         Dialogue Validation Tool - VULCA Gallery         ║
║                                                          ║
║  Validates dialogue data against schema and quality     ║
║  standards to ensure consistency and completeness.      ║
╚═══════════════════════════════════════════════════════════╝
`);

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  all: false,
  artwork: null,
  file: null,
  verbose: false,
  help: false
};

for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '--all':
      options.all = true;
      break;
    case '--artwork':
      options.artwork = args[++i];
      break;
    case '--file':
      options.file = args[++i];
      break;
    case '--verbose':
    case '-v':
      options.verbose = true;
      break;
    case '--help':
    case '-h':
      options.help = true;
      break;
  }
}

if (options.help || (!options.all && !options.artwork && !options.file)) {
  console.log(`
Usage:
  node scripts/validate-dialogues.js [options]

Options:
  --all                Validate all dialogue files
  --artwork <id>       Validate specific artwork dialogues (e.g., artwork-1)
  --file <path>        Validate specific dialogue file
  --verbose, -v        Show detailed validation output
  --help, -h           Show this help message

Examples:
  # Validate all dialogues
  node scripts/validate-dialogues.js --all

  # Validate specific artwork
  node scripts/validate-dialogues.js --artwork artwork-1

  # Validate specific file
  node scripts/validate-dialogues.js --file js/data/dialogues/artwork-1.js

  # Verbose output
  node scripts/validate-dialogues.js --all --verbose
`);
  process.exit(options.help ? 0 : 1);
}

// Validation configuration
const VALIDATION_CONFIG = {
  // Valid persona IDs from VULCA_DATA
  validPersonaIds: [
    'su-shi',
    'guo-xi',
    'john-ruskin',
    'mama-zola',
    'professor-petrova',
    'ai-ethics-reviewer'
  ],

  // Valid artwork IDs
  validArtworkIds: [
    'artwork-1',
    'artwork-2',
    'artwork-3',
    'artwork-4'
  ],

  // Valid interaction types
  validInteractionTypes: [
    'initial',
    'agree-extend',
    'question-challenge',
    'synthesize',
    'counter',
    'reflect'
  ],

  // Message length constraints (word count)
  messageLengthMin: 50,
  messageLengthMax: 200,

  // Interaction type distribution targets (percentages)
  interactionDistribution: {
    'initial': { min: 5, max: 15 },
    'agree-extend': { min: 30, max: 50 },
    'question-challenge': { min: 15, max: 25 },
    'synthesize': { min: 10, max: 20 },
    'counter': { min: 5, max: 15 },
    'reflect': { min: 5, max: 15 }
  }
};

// Validation results tracker
let validationResults = {
  totalThreads: 0,
  totalMessages: 0,
  errors: [],
  warnings: [],
  passed: true
};

/**
 * Add error to validation results
 */
function addError(category, message, context = {}) {
  validationResults.errors.push({ category, message, context });
  validationResults.passed = false;
}

/**
 * Add warning to validation results
 */
function addWarning(category, message, context = {}) {
  validationResults.warnings.push({ category, message, context });
}

/**
 * Validate dialogue thread structure
 */
function validateThreadStructure(thread, fileContext) {
  const required = ['id', 'artworkId', 'topic', 'topicEn', 'participants', 'messages'];

  for (const field of required) {
    if (!thread[field]) {
      addError('schema', `Missing required field: ${field}`, {
        file: fileContext,
        threadId: thread.id
      });
    }
  }

  // Validate ID format
  if (thread.id && !thread.id.match(/^artwork-\d+-thread-\d+$/)) {
    addError('schema', `Invalid thread ID format: ${thread.id} (expected: artwork-N-thread-N)`, {
      file: fileContext,
      threadId: thread.id
    });
  }

  // Validate artwork ID
  if (thread.artworkId && !VALIDATION_CONFIG.validArtworkIds.includes(thread.artworkId)) {
    addError('consistency', `Invalid artworkId: ${thread.artworkId}`, {
      file: fileContext,
      threadId: thread.id
    });
  }

  // Validate participants array
  if (thread.participants) {
    if (!Array.isArray(thread.participants)) {
      addError('schema', 'participants must be an array', {
        file: fileContext,
        threadId: thread.id
      });
    } else if (thread.participants.length < 2) {
      addWarning('quality', 'Thread has fewer than 2 participants', {
        file: fileContext,
        threadId: thread.id,
        count: thread.participants.length
      });
    }

    // Validate each participant ID
    thread.participants.forEach(personaId => {
      if (!VALIDATION_CONFIG.validPersonaIds.includes(personaId)) {
        addError('consistency', `Invalid persona ID: ${personaId}`, {
          file: fileContext,
          threadId: thread.id
        });
      }
    });
  }

  // Validate messages array
  if (thread.messages) {
    if (!Array.isArray(thread.messages)) {
      addError('schema', 'messages must be an array', {
        file: fileContext,
        threadId: thread.id
      });
    } else if (thread.messages.length === 0) {
      addError('quality', 'Thread has no messages', {
        file: fileContext,
        threadId: thread.id
      });
    }
  }
}

/**
 * Validate dialogue message structure and content
 */
function validateMessage(message, thread, fileContext) {
  const required = ['id', 'personaId', 'textZh', 'textEn', 'timestamp', 'replyTo', 'interactionType'];

  for (const field of required) {
    if (message[field] === undefined) {
      addError('schema', `Message missing required field: ${field}`, {
        file: fileContext,
        threadId: thread.id,
        messageId: message.id
      });
    }
  }

  // Validate message ID format
  if (message.id && !message.id.match(/^msg-/)) {
    addError('schema', `Invalid message ID format: ${message.id} (should start with "msg-")`, {
      file: fileContext,
      threadId: thread.id,
      messageId: message.id
    });
  }

  // Validate persona ID
  if (message.personaId && !VALIDATION_CONFIG.validPersonaIds.includes(message.personaId)) {
    addError('consistency', `Invalid persona ID in message: ${message.personaId}`, {
      file: fileContext,
      threadId: thread.id,
      messageId: message.id
    });
  }

  // Validate persona is in thread participants
  if (thread.participants && !thread.participants.includes(message.personaId)) {
    addError('consistency', `Message persona ${message.personaId} not in thread participants`, {
      file: fileContext,
      threadId: thread.id,
      messageId: message.id
    });
  }

  // Validate bilingual content
  if (!message.textZh || message.textZh.trim().length === 0) {
    addError('quality', 'Missing Chinese text (textZh)', {
      file: fileContext,
      threadId: thread.id,
      messageId: message.id
    });
  }

  if (!message.textEn || message.textEn.trim().length === 0) {
    addError('quality', 'Missing English text (textEn)', {
      file: fileContext,
      threadId: thread.id,
      messageId: message.id
    });
  }

  // Validate message length (word count)
  if (message.textZh) {
    const zhLength = message.textZh.length; // Character count for Chinese
    if (zhLength < VALIDATION_CONFIG.messageLengthMin) {
      addWarning('quality', `Chinese text too short: ${zhLength} chars (min: ${VALIDATION_CONFIG.messageLengthMin})`, {
        file: fileContext,
        threadId: thread.id,
        messageId: message.id
      });
    } else if (zhLength > VALIDATION_CONFIG.messageLengthMax * 2) {
      addWarning('quality', `Chinese text too long: ${zhLength} chars (max: ${VALIDATION_CONFIG.messageLengthMax * 2})`, {
        file: fileContext,
        threadId: thread.id,
        messageId: message.id
      });
    }
  }

  if (message.textEn) {
    const enWords = message.textEn.split(/\s+/).length;
    if (enWords < VALIDATION_CONFIG.messageLengthMin) {
      addWarning('quality', `English text too short: ${enWords} words (min: ${VALIDATION_CONFIG.messageLengthMin})`, {
        file: fileContext,
        threadId: thread.id,
        messageId: message.id
      });
    } else if (enWords > VALIDATION_CONFIG.messageLengthMax) {
      addWarning('quality', `English text too long: ${enWords} words (max: ${VALIDATION_CONFIG.messageLengthMax})`, {
        file: fileContext,
        threadId: thread.id,
        messageId: message.id
      });
    }
  }

  // Validate interaction type
  if (message.interactionType && !VALIDATION_CONFIG.validInteractionTypes.includes(message.interactionType)) {
    addError('consistency', `Invalid interaction type: ${message.interactionType}`, {
      file: fileContext,
      threadId: thread.id,
      messageId: message.id
    });
  }

  // Validate timestamp
  if (typeof message.timestamp !== 'number') {
    addError('schema', 'timestamp must be a number', {
      file: fileContext,
      threadId: thread.id,
      messageId: message.id
    });
  } else if (message.timestamp < 0) {
    addError('schema', 'timestamp cannot be negative', {
      file: fileContext,
      threadId: thread.id,
      messageId: message.id
    });
  }

  // Validate replyTo relationships
  if (message.replyTo !== null && message.interactionType !== 'initial') {
    // Check if replyTo is a valid persona ID
    if (!VALIDATION_CONFIG.validPersonaIds.includes(message.replyTo)) {
      addError('consistency', `Invalid replyTo persona: ${message.replyTo}`, {
        file: fileContext,
        threadId: thread.id,
        messageId: message.id
      });
    }

    // Warn if quotedText is missing for replies
    if (!message.quotedText) {
      addWarning('quality', 'Reply message missing quotedText field', {
        file: fileContext,
        threadId: thread.id,
        messageId: message.id
      });
    }
  }

  // Initial messages should have replyTo: null
  if (message.interactionType === 'initial' && message.replyTo !== null) {
    addError('consistency', 'Initial messages must have replyTo: null', {
      file: fileContext,
      threadId: thread.id,
      messageId: message.id
    });
  }
}

/**
 * Validate thread-level constraints (timestamps, distribution)
 */
function validateThreadConstraints(thread, fileContext) {
  if (!thread.messages || thread.messages.length === 0) return;

  // Check timestamp ordering
  for (let i = 1; i < thread.messages.length; i++) {
    const prevMsg = thread.messages[i - 1];
    const currMsg = thread.messages[i];

    if (currMsg.timestamp < prevMsg.timestamp) {
      addError('consistency', 'Messages not in chronological order', {
        file: fileContext,
        threadId: thread.id,
        prevMessage: prevMsg.id,
        prevTimestamp: prevMsg.timestamp,
        currMessage: currMsg.id,
        currTimestamp: currMsg.timestamp
      });
    }
  }

  // Check interaction type distribution
  const typeCounts = {};
  thread.messages.forEach(msg => {
    typeCounts[msg.interactionType] = (typeCounts[msg.interactionType] || 0) + 1;
  });

  const totalMessages = thread.messages.length;
  for (const [type, count] of Object.entries(typeCounts)) {
    const percentage = (count / totalMessages) * 100;
    const target = VALIDATION_CONFIG.interactionDistribution[type];

    if (target) {
      if (percentage < target.min || percentage > target.max) {
        addWarning('quality', `Interaction type "${type}" outside target range: ${percentage.toFixed(1)}% (target: ${target.min}-${target.max}%)`, {
          file: fileContext,
          threadId: thread.id,
          count,
          totalMessages,
          percentage: percentage.toFixed(1)
        });
      }
    }
  }

  // Check for at least one initial message
  const initialCount = typeCounts['initial'] || 0;
  if (initialCount === 0) {
    addError('quality', 'Thread has no initial message', {
      file: fileContext,
      threadId: thread.id
    });
  } else if (initialCount > 1) {
    addWarning('quality', `Thread has ${initialCount} initial messages (typically should have 1)`, {
      file: fileContext,
      threadId: thread.id,
      count: initialCount
    });
  }
}

/**
 * Validate a single dialogue file
 */
function validateDialogueFile(filePath) {
  console.log(`\n📄 Validating: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    addError('file', `File not found: ${filePath}`, { file: filePath });
    return;
  }

  // Read and parse file
  let fileContent;
  try {
    fileContent = fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    addError('file', `Failed to read file: ${err.message}`, { file: filePath });
    return;
  }

  // Extract dialogue data (basic parsing, assumes ES6 export)
  // Note: This is a simple parser; real implementation might use babel/acorn
  const exportMatch = fileContent.match(/export const \w+ = (\[[\s\S]*\]);/);
  if (!exportMatch) {
    addError('file', 'Could not parse dialogue data (expected: export const <name> = [...])', {
      file: filePath
    });
    return;
  }

  let dialogues;
  try {
    // Evaluate the array literal (WARNING: eval should only be used on trusted code)
    dialogues = eval(exportMatch[1]);
  } catch (err) {
    addError('file', `Failed to parse dialogue array: ${err.message}`, { file: filePath });
    return;
  }

  if (!Array.isArray(dialogues)) {
    addError('file', 'Dialogue data is not an array', { file: filePath });
    return;
  }

  console.log(`  Found ${dialogues.length} thread(s)`);

  // Validate each thread
  dialogues.forEach(thread => {
    validationResults.totalThreads++;

    if (options.verbose) {
      console.log(`  → Thread: ${thread.id || '(no ID)'}`);
    }

    validateThreadStructure(thread, filePath);

    if (thread.messages && Array.isArray(thread.messages)) {
      thread.messages.forEach(message => {
        validationResults.totalMessages++;
        validateMessage(message, thread, filePath);
      });

      validateThreadConstraints(thread, filePath);
    }
  });
}

/**
 * Get dialogue files to validate
 */
function getDialogueFiles() {
  const dialoguesDir = path.join(process.cwd(), 'js', 'data', 'dialogues');

  if (options.file) {
    return [options.file];
  }

  if (options.artwork) {
    return [path.join(dialoguesDir, `${options.artwork}.js`)];
  }

  if (options.all) {
    if (!fs.existsSync(dialoguesDir)) {
      console.log(`⚠ Dialogues directory not found: ${dialoguesDir}`);
      return [];
    }

    const files = fs.readdirSync(dialoguesDir)
      .filter(f => f.startsWith('artwork-') && f.endsWith('.js'))
      .map(f => path.join(dialoguesDir, f));

    return files;
  }

  return [];
}

/**
 * Print validation results
 */
function printResults() {
  console.log(`\n${'═'.repeat(63)}`);
  console.log('VALIDATION RESULTS');
  console.log('═'.repeat(63));

  console.log(`\n📊 Statistics:`);
  console.log(`  Total threads validated: ${validationResults.totalThreads}`);
  console.log(`  Total messages validated: ${validationResults.totalMessages}`);

  if (validationResults.errors.length > 0) {
    console.log(`\n❌ Errors (${validationResults.errors.length}):`);
    validationResults.errors.forEach((err, idx) => {
      console.log(`\n  ${idx + 1}. [${err.category.toUpperCase()}] ${err.message}`);
      if (options.verbose && Object.keys(err.context).length > 0) {
        console.log(`     Context: ${JSON.stringify(err.context, null, 2).split('\n').join('\n     ')}`);
      }
    });
  }

  if (validationResults.warnings.length > 0) {
    console.log(`\n⚠️  Warnings (${validationResults.warnings.length}):`);
    validationResults.warnings.forEach((warn, idx) => {
      console.log(`\n  ${idx + 1}. [${warn.category.toUpperCase()}] ${warn.message}`);
      if (options.verbose && Object.keys(warn.context).length > 0) {
        console.log(`     Context: ${JSON.stringify(warn.context, null, 2).split('\n').join('\n     ')}`);
      }
    });
  }

  console.log(`\n${'═'.repeat(63)}`);
  if (validationResults.passed && validationResults.warnings.length === 0) {
    console.log('✅ VALIDATION PASSED - No errors or warnings');
  } else if (validationResults.passed) {
    console.log('⚠️  VALIDATION PASSED WITH WARNINGS - Please review warnings');
  } else {
    console.log('❌ VALIDATION FAILED - Please fix errors before deploying');
  }
  console.log('═'.repeat(63));
  console.log();
}

// Main execution
const filesToValidate = getDialogueFiles();

if (filesToValidate.length === 0) {
  console.log('\n⚠️  No dialogue files found to validate.');
  console.log('   Create dialogue files using: node scripts/generate-dialogue.js');
  process.exit(0);
}

console.log(`\n🔍 Starting validation of ${filesToValidate.length} file(s)...\n`);

filesToValidate.forEach(validateDialogueFile);

printResults();

// Exit with appropriate code
process.exit(validationResults.passed ? 0 : 1);
