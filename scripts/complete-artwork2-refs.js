/**
 * Complete adding all remaining references to artwork-2 dialogue
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const filepath = join(__dirname, '../js/data/dialogues/artwork-2.js');
let content = readFileSync(filepath, 'utf-8');

const edits = [
  // msg-artwork-2-2-3-3
  {
    find: /"msg-artwork-2-2-3-3",[^}]+timestamp: 6000,\s+replyTo: null,\s+interactionType: "synthesize"/,
    replace: (match) => match + `,
        references: [
          { critic: "professor-petrova", source: "formalism-and-device.md", quote: "Fabula vs. Syuzhet - Story vs. plot arrangement", page: "Section 11-20: Device" },
          { critic: "professor-petrova", source: "README.md", quote: "System over content: Form, not message, makes art", page: "Application to AI Art" }
        ]`
  },
  // msg-artwork-2-2-4-1
  {
    find: /"msg-artwork-2-2-4-1",[^}]+timestamp: 0,\s+replyTo: null,\s+interactionType: "initial"/,
    replace: (match) => match + `,
        references: [
          { critic: "su-shi", source: "poetry-and-theory.md", quote: "出新意于法度之中，寄妙理于豪放之外 (New ideas within rules, profound principles beyond expression)", page: "Quote 10" },
          { critic: "su-shi", source: "poetry-and-theory.md", quote: "自其变者而观之...自其不变者而观之 (Perspective of change vs. permanence)", page: "Quote 20: Eternal Recurrence" }
        ]`
  },
  // msg-artwork-2-2-4-2
  {
    find: /"msg-artwork-2-2-4-2",[^}]+quotedText: "代际演化"/,
    replace: (match) => match + `,
        references: [
          { critic: "guo-xi", source: "README.md", quote: "Technical-Philosophical Synthesis: embodied expertise", page: "Core Philosophy" },
          { critic: "guo-xi", source: "landscape-theory.md", quote: "山水之道，化工也 (The Dao of landscapes is transformative workmanship)", page: "Quote 26" }
        ]`
  },
  // msg-artwork-2-2-4-3
  {
    find: /"msg-artwork-2-2-4-3",[^}]+timestamp: 6000,\s+replyTo: null,\s+interactionType: "synthesize"/,
    replace: (match) => match + `,
        references: [
          { critic: "ai-ethics-reviewer", source: "algorithmic-justice-and-power.md", quote: "Toward Algorithmic Justice: Principles for Just AI Systems", page: "Section 41-50" },
          { critic: "ai-ethics-reviewer", source: "README.md", quote: "Power analysis, accountability tracing, harm assessment", page: "Summary" }
        ]`
  },
  // msg-artwork-2-2-5-1
  {
    find: /"msg-artwork-2-2-5-1",[^}]+timestamp: 0,\s+replyTo: null,\s+interactionType: "initial"/,
    replace: (match) => match + `,
        references: [
          { critic: "john-ruskin", source: "art-and-morality.md", quote: "Art should present things as they appear to mankind (phenomenological truth)", page: "Quote 12" },
          { critic: "john-ruskin", source: "README.md", quote: "Truth to Nature - Moral imperative for accurate observation", page: "Dominant Themes" }
        ]`
  },
  // msg-artwork-2-2-5-2
  {
    find: /"msg-artwork-2-2-5-2",[^}]+quotedText: "机械复制是否消解了真实性"/,
    replace: (match) => match + `,
        references: [
          { critic: "professor-petrova", source: "formalism-and-device.md", quote: "Literariness: quality that makes a message art", page: "Section 21-30" },
          { critic: "professor-petrova", source: "README.md", quote: "Does it defamiliarize or reproduce habitual patterns?", page: "Professor Petrova's AI Art Questions" }
        ]`
  },
  // msg-artwork-2-2-5-3
  {
    find: /"msg-artwork-2-2-5-3",[^}]+timestamp: 6000,\s+replyTo: null,\s+interactionType: "synthesize"/,
    replace: (match) => match + `,
        references: [
          { critic: "mama-zola", source: "griot-aesthetics-oral-tradition.md", quote: "Call-and-Response: art born in the space between call and response", page: "Reference 5" },
          { critic: "mama-zola", source: "griot-aesthetics-oral-tradition.md", quote: "Spiral Time: past-present-future coexist", page: "Reference 12" },
          { critic: "mama-zola", source: "README.md", quote: "Participatory Aesthetics - Audience as co-creator", page: "Core Philosophy" }
        ]`
  },
  // msg-artwork-2-2-6-1
  {
    find: /"msg-artwork-2-2-6-1",[^}]+timestamp: 0,\s+replyTo: null,\s+interactionType: "initial"/,
    replace: (match) => match + `,
        references: [
          { critic: "ai-ethics-reviewer", source: "algorithmic-justice-and-power.md", quote: "Transparency: Explainable systems, visible supply chains", page: "Section 41-50: Principles" },
          { critic: "ai-ethics-reviewer", source: "README.md", quote: "Evidence-based, rigorous, policy-oriented approach", page: "Voice Characteristics" }
        ]`
  },
  // msg-artwork-2-2-6-2
  {
    find: /"msg-artwork-2-2-6-2",[^}]+quotedText: "伦理责任"/,
    replace: (match) => match + `,
        references: [
          { critic: "su-shi", source: "poetry-and-theory.md", quote: "论画以形似，见与儿童邻 (Discussing painting by form likeness is childish)", page: "Quote 1" },
          { critic: "su-shi", source: "README.md", quote: "Philosophical rather than technical argumentation style", page: "Voice Characteristics" }
        ]`
  },
  // msg-artwork-2-2-6-3
  {
    find: /"msg-artwork-2-2-6-3",[^}]+timestamp: 6000,\s+replyTo: null,\s+interactionType: "synthesize"/,
    replace: (match) => match + `,
        references: [
          { critic: "professor-petrova", source: "formalism-and-device.md", quote: "Deviation: Art = departure from norm", page: "Section 21-30" },
          { critic: "professor-petrova", source: "README.md", quote: "Systematic, analytical, precise - clinical assessment tone", page: "Voice Characteristics" }
        ]`
  }
];

let count = 0;
for (const edit of edits) {
  if (content.match(edit.find)) {
    content = content.replace(edit.find, edit.replace);
    count++;
  }
}

writeFileSync(filepath, content, 'utf-8');
console.log(`✓ Added references to ${count} more messages`);
console.log('✓ Artwork 2 reference addition complete!');
