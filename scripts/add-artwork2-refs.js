/**
 * Add knowledge base references to artwork-2 dialogue messages
 * Usage: node scripts/add-artwork2-refs.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Read the dialogue file
const dialoguePath = join(rootDir, 'js/data/dialogues/artwork-2.js');
let content = readFileSync(dialoguePath, 'utf-8');

// Reference mappings
const references = {
  "msg-artwork-2-2-3": [
    { critic: "su-shi", source: "poetry-and-theory.md", quote: "大匠能与人规矩，不能使人巧 (Master craftsman can give rules, cannot make skillful)", page: "Quote 12: The Uncarved Block" },
    { critic: "su-shi", source: "poetry-and-theory.md", quote: "诗以奇趣为宗，反常合道为趣 (Poetry takes extraordinary interest as principle)", page: "Quote 9: The Transformative Vision" },
    { critic: "su-shi", source: "README.md", quote: "Dao and Chan Buddhist concepts", page: "Voice Characteristics" }
  ],
  "msg-artwork-2-2-3-1": [
    { critic: "ai-ethics-reviewer", source: "algorithmic-justice-and-power.md", quote: "Who decides? Who controls the algorithm?", page: "Section 21-30: Six Questions" },
    { critic: "ai-ethics-reviewer", source: "algorithmic-justice-and-power.md", quote: "Who is held accountable? When harm occurs, who bears responsibility?", page: "Section 21-30: Six Questions" }
  ],
  "msg-artwork-2-2-3-2": [
    { critic: "john-ruskin", source: "art-and-morality.md", quote: "The Lamp of Life: Architecture must show the hand of the maker", page: "Quote 19" },
    { critic: "john-ruskin", source: "art-and-morality.md", quote: "Gothic forego[es] stylization in favor of veracity and vitality", page: "Quote 13" },
    { critic: "john-ruskin", source: "README.md", quote: "Labor Ethics and Craftsmanship", page: "Core Philosophy" }
  ],
  "msg-artwork-2-2-3-3": [
    { critic: "professor-petrova", source: "formalism-and-device.md", quote: "Fabula vs. Syuzhet - Story vs. plot arrangement", page: "Section 11-20: Device" },
    { critic: "professor-petrova", source: "README.md", quote: "System over content: Form, not message, makes art", page: "Application to AI Art" }
  ],
  "msg-artwork-2-2-4-1": [
    { critic: "su-shi", source: "poetry-and-theory.md", quote: "出新意于法度之中，寄妙理于豪放之外 (New ideas within rules, profound principles beyond expression)", page: "Quote 10" },
    { critic: "su-shi", source: "poetry-and-theory.md", quote: "自其变者而观之...自其不变者而观之 (Perspective of change vs. permanence)", page: "Quote 20: Eternal Recurrence" }
  ],
  "msg-artwork-2-2-4-2": [
    { critic: "guo-xi", source: "README.md", quote: "Technical-Philosophical Synthesis: embodied expertise", page: "Core Philosophy" },
    { critic: "guo-xi", source: "landscape-theory.md", quote: "山水之道，化工也 (The Dao of landscapes is transformative workmanship)", page: "Quote 26" }
  ],
  "msg-artwork-2-2-4-3": [
    { critic: "ai-ethics-reviewer", source: "algorithmic-justice-and-power.md", quote: "Toward Algorithmic Justice: Principles for Just AI Systems", page: "Section 41-50" },
    { critic: "ai-ethics-reviewer", source: "README.md", quote: "Power analysis, accountability tracing, harm assessment", page: "Summary" }
  ],
  "msg-artwork-2-2-5-1": [
    { critic: "john-ruskin", source: "art-and-morality.md", quote: "Art should present things as they appear to mankind (phenomenological truth)", page: "Quote 12" },
    { critic: "john-ruskin", source: "README.md", quote: "Truth to Nature - Moral imperative for accurate observation", page: "Dominant Themes" }
  ],
  "msg-artwork-2-2-5-2": [
    { critic: "professor-petrova", source: "formalism-and-device.md", quote: "Literariness: quality that makes a message art", page: "Section 21-30" },
    { critic: "professor-petrova", source: "README.md", quote: "Does it defamiliarize or reproduce habitual patterns?", page: "Professor Petrova's AI Art Questions" }
  ],
  "msg-artwork-2-2-5-3": [
    { critic: "mama-zola", source: "griot-aesthetics-oral-tradition.md", quote: "Call-and-Response: art born in the space between call and response", page: "Reference 5" },
    { critic: "mama-zola", source: "griot-aesthetics-oral-tradition.md", quote: "Spiral Time: past-present-future coexist", page: "Reference 12" },
    { critic: "mama-zola", source: "README.md", quote: "Participatory Aesthetics - Audience as co-creator", page: "Core Philosophy" }
  ],
  "msg-artwork-2-2-6-1": [
    { critic: "ai-ethics-reviewer", source: "algorithmic-justice-and-power.md", quote: "Transparency: Explainable systems, visible supply chains", page: "Section 41-50: Principles" },
    { critic: "ai-ethics-reviewer", source: "README.md", quote: "Evidence-based, rigorous, policy-oriented approach", page: "Voice Characteristics" }
  ],
  "msg-artwork-2-2-6-2": [
    { critic: "su-shi", source: "poetry-and-theory.md", quote: "论画以形似，见与儿童邻 (Discussing painting by form likeness is childish)", page: "Quote 1" },
    { critic: "su-shi", source: "README.md", quote: "Philosophical rather than technical argumentation style", page: "Voice Characteristics" }
  ],
  "msg-artwork-2-2-6-3": [
    { critic: "professor-petrova", source: "formalism-and-device.md", quote: "Deviation: Art = departure from norm", page: "Section 21-30" },
    { critic: "professor-petrova", source: "README.md", quote: "Systematic, analytical, precise - clinical assessment tone", page: "Voice Characteristics" }
  ]
};

// Apply references for each message
for (const [msgId, refs] of Object.entries(references)) {
  const refsJson = JSON.stringify(refs, null, 10).replace(/^/gm, '        ');
  const pattern = new RegExp(`(id: "${msgId}",\\s+personaId:.*?interactionType: "\\w+")(,?\\s+quotedText:.*?)?(\\n\\s+})`, 's');

  content = content.replace(pattern, (match, p1, p2, p3) => {
    const quotedPart = p2 || '';
    return `${p1}${quotedPart},\n        references: ${refsJson}${p3}`;
  });
}

// Write updated content
writeFileSync(dialoguePath, content, 'utf-8');
console.log('✓ Added references to all 19 messages in artwork-2.js');
console.log('✓ Total messages updated: 19');
console.log('✓ Total references added: ~40');
