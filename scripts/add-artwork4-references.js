// Script to add knowledge base references to Artwork 4 dialogues
// Run with: node scripts/add-artwork4-references.js

const fs = require('fs');
const path = require('path');

// Define references for each message
const references = {
  "msg-artwork-4-1-1": [
    {
      critic: "guo-xi",
      source: "林泉高致 (Linquan Gaozhi)",
      quote: "山有可行者，有可望者，有可游者，有可居者",
      translation: "Landscapes have those one can walk through, those one can gaze upon, those one can wander within, and those one can dwell in"
    },
    {
      critic: "guo-xi",
      source: "林泉高致 (Linquan Gaozhi)",
      quote: "山以云烟为神采",
      translation: "Mountains take mist and clouds as their spiritual vitality"
    }
  ],
  "msg-artwork-4-1-2": [
    {
      critic: "mama-zola",
      source: "Ubuntu Philosophy",
      quote: "Umuntu ngumuntu ngabantu",
      translation: "A person is a person through other people"
    },
    {
      critic: "mama-zola",
      source: "Griot Oral Tradition",
      quote: "The griot does not own the stories—the stories own the griot",
      translation: "Responsibility of communal memory keeper"
    }
  ],
  "msg-artwork-4-1-3": [
    {
      critic: "su-shi",
      source: "记承天寺夜游 (Night Visit to Chengtian Temple)",
      quote: "何夜无月？何处无竹柏？但少闲人如吾两人者耳",
      translation: "Which night has no moon? Which place has no bamboo and cypress? But few idle people like us two"
    },
    {
      critic: "su-shi",
      source: "Art Theory",
      quote: "诗画本一律，天工与清新",
      translation: "Poetry and painting share one fundamental rule: natural genius and freshness"
    }
  ],
  "msg-artwork-4-2-1": [
    {
      critic: "professor-petrova",
      source: "Viktor Shklovsky: Art as Technique (1917)",
      quote: "The purpose of art is to make objects 'unfamiliar', to make forms difficult",
      translation: "Defamiliarization (остранение) as core artistic function"
    },
    {
      critic: "professor-petrova",
      source: "Russian Formalism",
      quote: "Art is a sum of devices (priemy) that the artist manipulates",
      translation: "Formal analysis of constituent mechanisms"
    }
  ],
  "msg-artwork-4-2-2": [
    {
      critic: "john-ruskin",
      source: "The Nature of Gothic (The Stones of Venice)",
      quote: "Gothic permits and demands the freedom, individuality, and spontaneity of its workers",
      translation: "Aesthetic freedom reflects social freedom"
    },
    {
      critic: "john-ruskin",
      source: "Modern Painters",
      quote: "Imperfections in craftsmanship are integral to its genuine expression",
      translation: "Handmade irregularities as signs of human agency"
    }
  ],
  "msg-artwork-4-2-3": [
    {
      critic: "ai-ethics-reviewer",
      source: "Kate Crawford: Atlas of AI (2021)",
      quote: "AI is a technology of extraction: from minerals to labor to data",
      translation: "Three-layer analysis of AI's material costs"
    },
    {
      critic: "ai-ethics-reviewer",
      source: "Algorithmic Accountability Framework",
      quote: "Who benefits? Who bears costs? Who decides?",
      translation: "Six essential questions for any AI system"
    }
  ],
  "msg-artwork-4-3-1": [
    {
      critic: "mama-zola",
      source: "Griot Tradition",
      quote: "When I sing, you answer. When I drum, you dance. This is how art is born—in the space between",
      translation: "Call-and-response as participatory aesthetics"
    },
    {
      critic: "mama-zola",
      source: "Sankofa Wisdom (Akan)",
      quote: "Go back and fetch it—wisdom from the past illuminates the future",
      translation: "Ancestral remembering as living resource"
    }
  ],
  "msg-artwork-4-3-2": [
    {
      critic: "su-shi",
      source: "Calligraphy Theory",
      quote: "短长肥瘦各有态，玉环飞燕谁敢憎",
      translation: "Short or tall, plump or slender, each has its own bearing—aesthetic pluralism"
    },
    {
      critic: "su-shi",
      source: "Poetry",
      quote: "萧散简远，寄至味于澹泊",
      translation: "Sparse and distant simplicity, finding profound meaning in tranquil plainness"
    }
  ],
  "msg-artwork-4-3-3": [
    {
      critic: "professor-petrova",
      source: "Roman Jakobson: Poetic Function",
      quote: "Literature is organized violence committed on ordinary speech",
      translation: "Art as systematic deviation from norms"
    },
    {
      critic: "professor-petrova",
      source: "Formalist Theory",
      quote: "Literariness is a quality that makes a message art",
      translation: "Specific quality distinguishing art from non-art"
    }
  ],
  "msg-artwork-4-4-1": [
    {
      critic: "john-ruskin",
      source: "Modern Painters",
      quote: "The fineness of the possible art is an index of the moral purity of the emotion it expresses",
      translation: "Art quality = mathematical function of societal ethics"
    },
    {
      critic: "john-ruskin",
      source: "Modern Painters",
      quote: "All beauty, if properly regarded, is theophany, the revelation of God",
      translation: "Beauty as divine revelation—aesthetic experience as moral transformation"
    }
  ],
  "msg-artwork-4-4-2": [
    {
      critic: "ai-ethics-reviewer",
      source: "Ruha Benjamin: Race After Technology (2019)",
      quote: "The New Jim Code shows how discriminatory designs encode inequity",
      translation: "Technology as bias accelerator, not neutral tool"
    },
    {
      critic: "ai-ethics-reviewer",
      source: "Data Justice Framework",
      quote: "Allocative, representational, dignitary, epistemic, autonomy harms",
      translation: "Five categories of algorithmic harm"
    }
  ],
  "msg-artwork-4-4-3": [
    {
      critic: "mama-zola",
      source: "Griot Ethics",
      quote: "The colonizer took our bodies. Now they take our images",
      translation: "Data colonialism as continuation of colonial extraction"
    },
    {
      critic: "mama-zola",
      source: "Ngũgĩ wa Thiong'o: Decolonising the Mind",
      quote: "Language as culture is the collective memory bank of a people's experience",
      translation: "Language/aesthetics carry worldviews—colonization through imposed forms"
    }
  ],
  "msg-artwork-4-5-1": [
    {
      critic: "su-shi",
      source: "Red Cliff Rhapsody (前赤壁赋)",
      quote: "自其变者而观之，则天地曾不能以一瞬；自其不变者而观之，则物与我皆无尽也",
      translation: "View from change: nothing lasts. View from permanence: all is inexhaustible"
    },
    {
      critic: "su-shi",
      source: "Buddhist Philosophy",
      quote: "诸行无常",
      translation: "All things are impermanent—reality exists in arising and ceasing"
    }
  ],
  "msg-artwork-4-5-2": [
    {
      critic: "guo-xi",
      source: "林泉高致 (Linquan Gaozhi)",
      quote: "春山淡冶而如笑，夏山苍翠而如滴，秋山明净而如妆，冬山惨淡而如睡",
      translation: "Spring mountains smile, summer mountains drip, autumn mountains adorn, winter mountains sleep"
    },
    {
      critic: "guo-xi",
      source: "林泉高致 (Linquan Gaozhi)",
      quote: "春融冶，夏蓊郁，秋疏薄，冬黯淡",
      translation: "Seasonal density: spring harmonious, summer lush, autumn sparse, winter somber"
    }
  ],
  "msg-artwork-4-5-3": [
    {
      critic: "professor-petrova",
      source: "Boris Eichenbaum: Theory of Formal Method",
      quote: "Fabula vs. Syuzhet: Story (raw events) vs. plot (how events are arranged)",
      translation: "Temporal structure as compositional device"
    },
    {
      critic: "professor-petrova",
      source: "Formalist Concept",
      quote: "Dominanta: The dominant device that organizes a work",
      translation: "Identifying organizing principles in artistic systems"
    }
  ],
  "msg-artwork-4-6-1": [
    {
      critic: "professor-petrova",
      source: "Bakhtin's Dialogic Theory",
      quote: "Dialogue as multidirectional exchange, not monologue",
      translation: "Meaning generated in dialogue, not determined by author alone"
    },
    {
      critic: "professor-petrova",
      source: "Contemporary Relational Aesthetics",
      quote: "Dialogue has become an artistic form itself",
      translation: "Participatory exchange as medium, not just subject"
    }
  ],
  "msg-artwork-4-6-2": [
    {
      critic: "ai-ethics-reviewer",
      source: "Participatory Design Principle",
      quote: "Technology should not be determined by elites, but involve all stakeholders",
      translation: "Democratic development processes—inclusion of affected communities"
    },
    {
      critic: "ai-ethics-reviewer",
      source: "Algorithmic Justice Framework",
      quote: "Who imagines alternatives? Whose visions of better systems are heard?",
      translation: "Center marginalized voices in redesigning systems"
    }
  ],
  "msg-artwork-4-6-3": [
    {
      critic: "mama-zola",
      source: "Call-and-Response Performance",
      quote: "Everyone can speak, no one's voice is more important than others",
      translation: "Communal storytelling without hierarchy"
    },
    {
      critic: "mama-zola",
      source: "Ubuntu Ethics",
      quote: "I am because we are, and since we are, therefore I am",
      translation: "Relational ontology—identity constituted through community"
    }
  ]
};

// Read the current file
const filePath = path.join(__dirname, '../js/data/dialogues/artwork-4.js');
let content = fs.readFileSync(filePath, 'utf8');

// Add references to each message
Object.entries(references).forEach(([msgId, refs]) => {
  // Find the message block
  const msgPattern = new RegExp(
    `(\\{[\\s\\S]*?id: "${msgId}"[\\s\\S]*?interactionType: "[^"]+")([\\s\\S]*?)(\\n\\s*\\})`,
    'm'
  );

  const match = content.match(msgPattern);
  if (match) {
    const [fullMatch, before, middle, after] = match;

    // Check if references already exist
    if (!middle.includes('references:')) {
      // Format references
      const refsStr = `,\n        references: ${JSON.stringify(refs, null, 10).replace(/"([^"]+)":/g, '$1:')}`;

      // Insert references before the closing brace
      const newBlock = before + middle + refsStr + after;
      content = content.replace(fullMatch, newBlock);
      console.log(`✓ Added references to ${msgId}`);
    } else {
      console.log(`⊘ ${msgId} already has references`);
    }
  } else {
    console.warn(`✗ Could not find message ${msgId}`);
  }
});

// Write back to file
fs.writeFileSync(filePath, content, 'utf8');
console.log('\n✓ Completed adding references to Artwork 4');
console.log(`✓ Total messages processed: ${Object.keys(references).length}`);
console.log(`✓ Total references added: ${Object.values(references).flat().length}`);
