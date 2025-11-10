#!/usr/bin/env node

/**
 * Fix Persona ID Inconsistency
 *
 * Standardize persona IDs to use "ai-ethics-reviewer" instead of "ai-ethics"
 * - Remove duplicate "ai-ethics" persona from personas array
 * - Update all critiques to use "ai-ethics-reviewer"
 */

const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'exhibitions', 'negative-space-of-the-tide', 'data.json');

console.log('\n🔧 Fixing persona ID inconsistency...\n');

// Read data.json
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Remove "ai-ethics" persona (keep only "ai-ethics-reviewer")
const beforeCount = data.personas.length;
data.personas = data.personas.filter(p => p.id !== 'ai-ethics');
const afterCount = data.personas.length;

console.log(`   ✓ Removed "ai-ethics" persona (${beforeCount} -> ${afterCount} personas)`);

// Update critiques to use "ai-ethics-reviewer"
let updatedCritiques = 0;
data.critiques = data.critiques.map(c => {
  if (c.personaId === 'ai-ethics') {
    updatedCritiques++;
    return { ...c, personaId: 'ai-ethics-reviewer' };
  }
  return c;
});

console.log(`   ✓ Updated ${updatedCritiques} critique(s) to use "ai-ethics-reviewer"`);

// Write back to file
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');

console.log(`   ✓ Wrote updated data.json\n`);
console.log('✅ Persona ID consistency fixed!\n');
console.log(`Final persona count: ${data.personas.length}\n`);
