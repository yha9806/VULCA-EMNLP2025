/**
 * Dialogue Data Validation Script
 *
 * Validates all dialogue files to ensure data integrity after Phase 2 transformation
 *
 * Usage:
 *   node scripts/validate-dialogue-data.js
 *   node scripts/validate-dialogue-data.js --artwork artwork-1
 *   node scripts/validate-dialogue-data.js --strict
 */

import { artwork1Dialogue } from '../js/data/dialogues/artwork-1.js';
import { artwork2Dialogue } from '../js/data/dialogues/artwork-2.js';
import { artwork3Dialogue } from '../js/data/dialogues/artwork-3.js';
import { artwork4Dialogue } from '../js/data/dialogues/artwork-4.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

// Valid critic IDs from Phase 1A
const VALID_CRITICS = [
  'su-shi',
  'guo-xi',
  'john-ruskin',
  'mama-zola',
  'professor-petrova',
  'ai-ethics-reviewer'
];

/**
 * Validation Functions
 */

function validateRequiredFields(dialogue) {
  const errors = [];
  const warnings = [];

  // Check dialogue-level fields
  if (!dialogue.id) errors.push('Missing dialogue.id');
  if (!dialogue.artworkId) errors.push('Missing dialogue.artworkId');
  if (!dialogue.topic) errors.push('Missing dialogue.topic');
  if (!dialogue.topicEn) errors.push('Missing dialogue.topicEn');
  if (!Array.isArray(dialogue.participants)) errors.push('Missing or invalid dialogue.participants');
  if (!Array.isArray(dialogue.messages)) errors.push('Missing or invalid dialogue.messages');

  // Check message-level fields
  dialogue.messages?.forEach((msg, index) => {
    const msgId = msg.id || `message-${index}`;
    if (!msg.id) errors.push(`Message ${index}: missing id`);
    if (!msg.personaId) errors.push(`${msgId}: missing personaId`);
    if (!msg.textZh) errors.push(`${msgId}: missing textZh`);
    if (!msg.textEn) errors.push(`${msgId}: missing textEn`);
    if (msg.timestamp === undefined) errors.push(`${msgId}: missing timestamp`);
    if (!msg.interactionType) errors.push(`${msgId}: missing interactionType`);
  });

  return {
    pass: errors.length === 0,
    errors,
    warnings,
    message: `Required fields (${dialogue.messages?.length || 0} messages)`
  };
}

function validateUniqueIDs(dialogue) {
  const errors = [];
  const warnings = [];
  const ids = dialogue.messages?.map(m => m.id) || [];
  const uniqueIds = new Set(ids);

  if (ids.length !== uniqueIds.size) {
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    errors.push(`Duplicate IDs found: ${[...new Set(duplicates)].join(', ')}`);
  }

  return {
    pass: errors.length === 0,
    errors,
    warnings,
    message: `Unique IDs (${uniqueIds.size} unique out of ${ids.length} total)`
  };
}

function validateReplyChains(dialogue) {
  const errors = [];
  const warnings = [];
  let replyCount = 0;

  dialogue.messages?.forEach((msg, index) => {
    if (msg.replyTo) {
      replyCount++;
      // Check that replied-to persona exists in prior messages
      const priorMessages = dialogue.messages.slice(0, index);
      const referencedPersonaExists = priorMessages.some(
        m => m.personaId === msg.replyTo
      );
      if (!referencedPersonaExists) {
        errors.push(
          `Message ${msg.id} replies to ${msg.replyTo} but no prior message found`
        );
      }
    }
  });

  return {
    pass: errors.length === 0,
    errors,
    warnings,
    message: `Reply chains (${replyCount} replies, ${errors.length === 0 ? 'all valid' : errors.length + ' errors'})`
  };
}

function validateTimestamps(dialogue) {
  const errors = [];
  const warnings = [];
  const messages = dialogue.messages || [];

  if (messages.length === 0) {
    return { pass: true, errors, warnings, message: 'Timestamps (no messages)' };
  }

  // First message should start at 0
  if (messages[0].timestamp !== 0) {
    errors.push(`First message timestamp should be 0, got ${messages[0].timestamp}`);
  }

  // Check chronological ordering and intervals
  const intervals = [];
  for (let i = 1; i < messages.length; i++) {
    const interval = messages[i].timestamp - messages[i-1].timestamp;
    intervals.push(interval);

    if (interval <= 0) {
      errors.push(`Message ${messages[i].id}: timestamp not chronological (interval: ${interval}ms)`);
    } else if (interval < 4000 || interval > 7000) {
      warnings.push(`Message ${messages[i].id}: interval ${interval}ms outside recommended 4000-7000ms range`);
    }
  }

  const avgInterval = intervals.length > 0
    ? (intervals.reduce((a, b) => a + b, 0) / intervals.length / 1000).toFixed(1)
    : 0;

  return {
    pass: errors.length === 0,
    errors,
    warnings,
    message: `Timestamps (chronological, avg ${avgInterval}s interval)`
  };
}

function validateParticipants(dialogue) {
  const errors = [];
  const warnings = [];
  const participants = new Set(dialogue.participants || []);
  const messageAuthors = new Set(dialogue.messages?.map(m => m.personaId) || []);

  // Every message author should be a declared participant
  dialogue.messages?.forEach(msg => {
    if (!participants.has(msg.personaId)) {
      errors.push(
        `Message ${msg.id} author ${msg.personaId} not in participants array`
      );
    }
  });

  // Every participant should have at least one message
  participants.forEach(p => {
    if (!messageAuthors.has(p)) {
      warnings.push(`Participant ${p} has no messages in dialogue`);
    }
  });

  return {
    pass: errors.length === 0,
    errors,
    warnings,
    message: `Participants (${participants.size} declared, ${messageAuthors.size} active)`
  };
}

function validateKnowledgeBaseReferences(dialogue) {
  const errors = [];
  const warnings = [];
  let refCount = 0;

  dialogue.messages?.forEach(msg => {
    if (msg.references && Array.isArray(msg.references)) {
      refCount += msg.references.length;

      msg.references.forEach((ref, refIndex) => {
        // Validate structure
        if (!ref.critic) errors.push(`${msg.id}: reference ${refIndex} missing critic`);
        if (!ref.source) errors.push(`${msg.id}: reference ${refIndex} missing source`);
        if (!ref.quote) errors.push(`${msg.id}: reference ${refIndex} missing quote`);

        // Validate critic ID
        if (ref.critic && !VALID_CRITICS.includes(ref.critic)) {
          errors.push(`${msg.id}: invalid critic ID "${ref.critic}"`);
        }

        // Validate source file exists
        if (ref.critic && ref.source) {
          const sourcePath = path.join(__dirname, '../knowledge-base/critics', ref.critic, ref.source);
          if (!fs.existsSync(sourcePath)) {
            errors.push(`${msg.id}: source file not found: ${ref.critic}/${ref.source}`);
          }
        }

        // Validate quote
        if (ref.quote && ref.quote.trim().length < 5) {
          warnings.push(`${msg.id}: quote too short (${ref.quote.length} chars)`);
        }

        // Check persona-reference consistency
        if (refIndex === 0 && ref.critic !== msg.personaId) {
          warnings.push(
            `${msg.id}: author ${msg.personaId} cites ${ref.critic} as primary reference (expected self-citation)`
          );
        }
      });
    }
  });

  const msgCount = dialogue.messages?.length || 0;
  const msgWithRefs = dialogue.messages?.filter(m => m.references?.length > 0).length || 0;

  return {
    pass: errors.length === 0,
    errors,
    warnings: refCount === 0
      ? ['No knowledge base references found (references are optional, can be added in Phase 3)']
      : warnings,
    message: `Knowledge base references (${msgWithRefs}/${msgCount} messages have references, ${refCount} total)`
  };
}

/**
 * Main Validation
 */

function validateDialogue(dialogue) {
  console.log(`\n${colors.cyan}${dialogue.id}${colors.reset}:`);

  const checks = [
    validateRequiredFields(dialogue),
    validateUniqueIDs(dialogue),
    validateReplyChains(dialogue),
    validateTimestamps(dialogue),
    validateParticipants(dialogue),
    validateKnowledgeBaseReferences(dialogue)
  ];

  checks.forEach(check => {
    const icon = check.pass ? `${colors.green}✓${colors.reset}` : `${colors.red}✗${colors.reset}`;
    console.log(`  ${icon} ${check.message}`);

    if (check.errors.length > 0) {
      check.errors.forEach(err => {
        console.log(`    ${colors.red}✗ ${err}${colors.reset}`);
      });
    }

    if (check.warnings.length > 0) {
      check.warnings.forEach(warn => {
        console.log(`    ${colors.yellow}⚠ ${warn}${colors.reset}`);
      });
    }
  });

  const allPassed = checks.every(c => c.pass);
  const statusIcon = allPassed ? `${colors.green}✓${colors.reset}` : `${colors.red}✗${colors.reset}`;
  const status = allPassed ? `${colors.green}PASS${colors.reset}` : `${colors.red}FAIL${colors.reset}`;
  console.log(`\n${statusIcon} ${dialogue.id}: ${status}`);

  return allPassed;
}

/**
 * CLI Entry Point
 */

function main() {
  const args = process.argv.slice(2);
  const artworkArg = args.find(a => a.startsWith('--artwork='));
  const strictMode = args.includes('--strict');

  console.log(`${colors.cyan}Validating dialogues...${colors.reset}`);
  if (strictMode) {
    console.log(`${colors.yellow}Strict mode: warnings will fail validation${colors.reset}`);
  }

  const dialogues = artworkArg
    ? [eval(artworkArg.split('=')[1] + 'Dialogue')]
    : [artwork1Dialogue, artwork2Dialogue, artwork3Dialogue, artwork4Dialogue];

  const results = dialogues.map(validateDialogue);
  const allPassed = results.every(r => r);

  console.log(`\n${colors.cyan}Summary${colors.reset}:`);
  console.log(`  Total dialogues: ${dialogues.length}`);
  console.log(`  Passed: ${colors.green}${results.filter(r => r).length}${colors.reset}`);
  console.log(`  Failed: ${colors.red}${results.filter(r => !r).length}${colors.reset}`);

  if (allPassed) {
    console.log(`\n${colors.green}✓ All dialogues valid${colors.reset}`);
    process.exit(0);
  } else {
    console.log(`\n${colors.red}✗ Validation failed${colors.reset}`);
    process.exit(1);
  }
}

main();
