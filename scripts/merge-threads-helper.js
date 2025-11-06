/**
 * Helper script to merge dialogue threads into single continuous dialogue
 * This is a helper function that can be used in artwork data files
 */

/**
 * Merge multiple threads into a single continuous dialogue
 * @param {Array} threads - Array of thread objects
 * @returns {Object} - Single dialogue object with merged messages
 */
export function mergeThreads(threads) {
  if (!threads || threads.length === 0) {
    throw new Error('No threads provided for merging');
  }

  // 1. Extract artwork metadata from first thread
  const firstThread = threads[0];
  const artworkId = firstThread.artworkId;

  // 2. Concatenate all messages from all threads
  const allMessages = threads.flatMap(t => t.messages);

  // 3. Regenerate timestamps with natural intervals (4-7 seconds)
  let currentTime = 0;
  const messagesWithTimestamps = allMessages.map((msg, index) => {
    if (index > 0) {
      // Random interval between 4000-7000ms (4-7 seconds)
      const interval = Math.floor(Math.random() * 3000) + 4000;
      currentTime += interval;
    }
    return { ...msg, timestamp: currentTime };
  });

  // 4. Extract unique participants from all messages
  const participants = [...new Set(allMessages.map(m => m.personaId))];

  // 5. Create single dialogue object
  return {
    id: `${artworkId}-dialogue`,
    artworkId: artworkId,
    topic: `Complete Dialogue on ${artworkId}`,
    topicEn: `Complete Dialogue on ${artworkId}`,
    participants: participants,
    messages: messagesWithTimestamps
  };
}
