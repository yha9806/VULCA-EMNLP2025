/**
 * Test dialogue loading
 * Phase 6.2: Local Testing
 */

async function testDialogues() {
  console.log('='.repeat(70));
  console.log('Phase 6.2: Testing Dialogue Loading');
  console.log('='.repeat(70));

  console.log('\n[1] Importing dialogue index...');
  const { DIALOGUES, getDialogueStats } = await import('../js/data/dialogues/index.js');

  console.log('✅ Import successful');

  console.log('\n[2] Checking dialogue count...');
  console.log(`   Total dialogues: ${DIALOGUES.length}`);

  if (DIALOGUES.length === 43) {
    console.log('✅ Dialogue count correct (43)');
  } else {
    console.error('❌ Dialogue count incorrect (expected 43, got', DIALOGUES.length, ')');
    process.exit(1);
  }

  console.log('\n[3] Checking new artwork dialogues...');
  const newIds = ['artwork-39', 'artwork-40', 'artwork-41', 'artwork-42', 'artwork-43', 'artwork-44', 'artwork-45', 'artwork-46'];

  newIds.forEach(id => {
    const dialogue = DIALOGUES.find(d => d.artworkId === id);
    if (dialogue) {
      console.log(`✅ ${id}: ${dialogue.messages.length} messages`);
    } else {
      console.error(`❌ ${id}: NOT FOUND`);
      process.exit(1);
    }
  });

  console.log('\n[4] Checking withdrawn artworks removed...');
  const withdrawnIds = ['artwork-10', 'artwork-17', 'artwork-30'];

  withdrawnIds.forEach(id => {
    const dialogue = DIALOGUES.find(d => d.artworkId === id);
    if (!dialogue) {
      console.log(`✅ ${id}: correctly excluded`);
    } else {
      console.error(`❌ ${id}: still present (should be excluded)`);
      process.exit(1);
    }
  });

  console.log('\n[5] Getting dialogue statistics...');
  const stats = getDialogueStats();
  console.log('   Statistics:');
  console.log('   - Total dialogues:', stats.totalDialogues);
  console.log('   - Total messages:', stats.totalMessages);
  console.log('   - Artwork count:', stats.artworkCount);
  console.log('   - Persona count:', stats.personaCount);
  console.log('   - Avg messages/dialogue:', stats.averageMessagesPerDialogue);

  console.log('\n' + '='.repeat(70));
  console.log('✅ ALL DIALOGUE TESTS PASSED');
  console.log('='.repeat(70));
}

testDialogues().catch(err => {
  console.error('❌ Test failed:', err.message);
  console.error(err.stack);
  process.exit(1);
});
