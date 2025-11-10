// Script to add references to Thread 6 messages in artwork-1.js
// This script will be manually run to avoid file locking issues

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../js/data/dialogues/artwork-1.js');

// Read the file
let content = fs.readFileSync(filePath, 'utf-8');

// References for each message
const references = {
  'msg-artwork-1-6-1': [
    {
      critic: "john-ruskin",
      source: "art-and-morality.md",
      quote: "Imperfections in craftsmanship are integral to its genuine expression. The demand for perfection degrades the workman, making him a tool rather than a creator.",
      page: "Quote 8: Imperfections as Integrity"
    },
    {
      critic: "john-ruskin",
      source: "art-and-morality.md",
      quote: "The fineness of the possible art is an index of the moral purity and majesty of the emotion it expresses... so that with mathematical precision... the art of a nation... is an exponent of its ethical state.",
      page: "Quote 4: Art Reflects Ethical State"
    },
    {
      critic: "john-ruskin",
      source: "art-and-morality.md",
      quote: "The artist has a moral duty to display the actual truth, so as not to deceive or mislead the citizen.",
      page: "Quote 1: The Artist's Moral Duty"
    }
  ],
  'msg-artwork-1-6-2': [
    {
      critic: "ai-ethics-reviewer",
      source: "algorithmic-justice-and-power.md",
      quote: "The New Jim Code shows how discriminatory designs encode inequity: by amplifying racial hierarchies, ignoring but replicating social divisions, or aiming to fix bias but ultimately doing quite the opposite.",
      page: "Section 11-20: The New Jim Code"
    },
    {
      critic: "ai-ethics-reviewer",
      source: "algorithmic-justice-and-power.md",
      quote: "Transparency: Explainable systems, visible supply chains. Accountability: Clear responsibility when harm occurs. Participation: Affected communities involved in design.",
      page: "Section 41-50: Toward Algorithmic Justice"
    },
    {
      critic: "ai-ethics-reviewer",
      source: "algorithmic-justice-and-power.md",
      quote: "Technology as Bias Accelerator: Not neutral tools—encode existing power structures. Appear objective but hide discrimination. Scale bias faster than human systems.",
      page: "Section 11-20: The New Jim Code"
    }
  ],
  'msg-artwork-1-6-3': [
    {
      critic: "mama-zola",
      source: "griot-aesthetics-oral-tradition.md",
      quote: "Umuntu ngumuntu ngabantu — A person is a person through other people.",
      page: "Section 1: Ubuntu Philosophy"
    },
    {
      critic: "mama-zola",
      source: "griot-aesthetics-oral-tradition.md",
      quote: "African performance blurs boundaries between audience and performers, emphasizing participatory communalism. The audience completes the performance. No art without participation.",
      page: "Section 5: Participatory Aesthetics"
    },
    {
      critic: "mama-zola",
      source: "griot-aesthetics-oral-tradition.md",
      quote: "Western epistemology says: 'If it's not peer-reviewed, it's not real. If it's not quantified, it's not knowledge.' But the griot's knowledge is in the body, the breath, the rhythm.",
      page: "Section 7: Epistemic Justice"
    }
  ],
  'msg-artwork-1-6-4': [
    {
      critic: "su-shi",
      source: "key-concepts.md",
      quote: "反常合道 (Departing from Convention While Aligning with the Dao): Artistic creation must break conventional rules while simultaneously adhering to deeper cosmic principles and aesthetic truths.",
      page: "Concept 5: 反常合道"
    },
    {
      critic: "su-shi",
      source: "poetry-and-theory.md",
      quote: "诗以奇趣为宗，反常合道为趣 (Poetry takes extraordinary interest as its principle; departing from convention while aligning with the Dao is what creates interest)",
      page: "Quote 9: The Transformative Vision"
    },
    {
      critic: "su-shi",
      source: "poetry-and-theory.md",
      quote: "出新意于法度之中，寄妙理于豪放之外 (Bring forth new ideas within established rules; lodge profound principles beyond unbridled expression)",
      page: "Quote 10: The Boundless Creativity"
    }
  ],
  'msg-artwork-1-6-5': [
    {
      critic: "john-ruskin",
      source: "art-and-morality.md",
      quote: "All beauty, if properly regarded, is theophany, the revelation of God; contemplating beauty, like contemplating the Bible, God's other revelation, is a moral and religious act.",
      page: "Quote 5: Beauty as Theophany"
    },
    {
      critic: "john-ruskin",
      source: "art-and-morality.md",
      quote: "The Gothic style permits and even demands the freedom, individuality, and spontaneity of its workers; it both represents a finer, more moral society and means of production.",
      page: "Quote 6: The Nature of Gothic"
    }
  ]
};

// Add references to each message
Object.keys(references).forEach(msgId => {
  const pattern = new RegExp(
    `(id: "${msgId}",\\s+personaId:.*?interactionType: "\\w+")(\\s*)(?=\\s*})`,
    's'
  );

  const referencesStr = ',\n        references: ' + JSON.stringify(references[msgId], null, 10).replace(/^/gm, '        ');

  content = content.replace(pattern, `$1${referencesStr}$2`);
});

// Write back
fs.writeFileSync(filePath, content, 'utf-8');
console.log('✓ References added to Thread 6 (5 messages)');
