# Dialogue Topic Templates

This document provides topic templates for generating dialogue threads. Each template includes recommended participants, discussion focus, and example topics.

---

## Template 1: Technique Focus (技法探讨)

**Focus**: Technical aspects, execution methods, craftsmanship

**Recommended Participants**:
- Guo Xi (郭熙) - Traditional technique expert
- Professor Petrova - Contemporary technique analysis
- John Ruskin - Craft and execution standards

**Discussion Structure**:
1. Initial observation on specific technique
2. Comparison with traditional methods
3. Technical innovation analysis
4. Quality and skill assessment

**Example Topics**:
```javascript
{
  topic: "笔法与机械运动的对话",
  topicEn: "Dialogue Between Brushwork and Mechanical Movement",
  participants: ["guo-xi", "professor-petrova", "ai-ethics-reviewer"]
}

{
  topic: "数字工具下的传统技艺",
  topicEn: "Traditional Craftsmanship in Digital Tools",
  participants: ["guo-xi", "john-ruskin", "professor-petrova"]
}

{
  topic: "算法生成的笔触质感",
  topicEn: "Algorithmic Brushstroke Texture",
  participants: ["professor-petrova", "guo-xi", "ai-ethics-reviewer"]
}
```

---

## Template 2: Philosophy & Concept (哲学思考)

**Focus**: Deeper meaning, philosophical implications, conceptual frameworks

**Recommended Participants**:
- Su Shi (苏轼) - Philosophical aesthetics
- John Ruskin - Moral and spiritual dimensions
- AI Ethics Reviewer - Contemporary philosophy

**Discussion Structure**:
1. Philosophical question or paradox
2. Different theoretical frameworks
3. Conceptual analysis
4. Synthesis of perspectives

**Example Topics**:
```javascript
{
  topic: "心性与程序性的矛盾",
  topicEn: "The Paradox of Spirit and Programming",
  participants: ["su-shi", "john-ruskin", "ai-ethics-reviewer"]
}

{
  topic: "人工智能时代的创作主体",
  topicEn: "Creative Agency in the Age of AI",
  participants: ["ai-ethics-reviewer", "su-shi", "professor-petrova"]
}

{
  topic: "技术介入与艺术真实性",
  topicEn: "Technological Intervention and Artistic Authenticity",
  participants: ["john-ruskin", "ai-ethics-reviewer", "su-shi"]
}
```

---

## Template 3: Cultural Dialogue (文化对话)

**Focus**: Cross-cultural perspectives, tradition vs modernity, cultural identity

**Recommended Participants**:
- Mama Zola - Non-Western perspective, oral tradition
- Su Shi - Chinese classical aesthetics
- John Ruskin - Western art tradition
- Professor Petrova - Contemporary globalization

**Discussion Structure**:
1. Cultural lens observation
2. Comparison of cultural frameworks
3. Hybridization and exchange
4. Reflection on cultural identity

**Example Topics**:
```javascript
{
  topic: "东西方美学的交融",
  topicEn: "Fusion of Eastern and Western Aesthetics",
  participants: ["su-shi", "john-ruskin", "mama-zola"]
}

{
  topic: "传统叙事在数字时代的转译",
  topicEn: "Traditional Narratives Translated in Digital Age",
  participants: ["mama-zola", "professor-petrova", "su-shi"]
}

{
  topic: "文化符号的跨界传播",
  topicEn: "Cross-Border Transmission of Cultural Symbols",
  participants: ["mama-zola", "john-ruskin", "ai-ethics-reviewer"]
}
```

---

## Template 4: Contemporary Relevance (当代性)

**Focus**: Modern context, social issues, technological impact, future implications

**Recommended Participants**:
- AI Ethics Reviewer - Ethics and technology
- Professor Petrova - Contemporary theory
- Mama Zola - Social justice perspective
- Su Shi (optional) - Historical continuity

**Discussion Structure**:
1. Contemporary context framing
2. Social/technological implications
3. Ethical considerations
4. Future directions

**Example Topics**:
```javascript
{
  topic: "人机协作的未来图景",
  topicEn: "Future Landscape of Human-Machine Collaboration",
  participants: ["ai-ethics-reviewer", "professor-petrova", "mama-zola"]
}

{
  topic: "艺术创作的民主化与去中心化",
  topicEn: "Democratization and Decentralization of Art Creation",
  participants: ["professor-petrova", "ai-ethics-reviewer", "mama-zola"]
}

{
  topic: "技术伦理与创作责任",
  topicEn: "Technological Ethics and Creative Responsibility",
  participants: ["ai-ethics-reviewer", "john-ruskin", "professor-petrova"]
}
```

---

## Template 5: Tradition vs Innovation (传统与创新)

**Focus**: Continuity and rupture, preservation and transformation

**Recommended Participants**:
- Su Shi - Traditional values
- Guo Xi - Classical standards
- Professor Petrova - Contemporary innovation
- AI Ethics Reviewer - Technological change

**Discussion Structure**:
1. Traditional foundation identification
2. Innovation/departure analysis
3. Tension and synthesis
4. New paradigm emergence

**Example Topics**:
```javascript
{
  topic: "传统美学原则在AI艺术中的延续",
  topicEn: "Continuity of Traditional Aesthetic Principles in AI Art",
  participants: ["su-shi", "guo-xi", "ai-ethics-reviewer"]
}

{
  topic: "文化传承的新形式",
  topicEn: "New Forms of Cultural Transmission",
  participants: ["mama-zola", "su-shi", "professor-petrova"]
}

{
  topic: "创新是背叛还是致敬？",
  topicEn: "Innovation: Betrayal or Tribute?",
  participants: ["guo-xi", "john-ruskin", "professor-petrova"]
}
```

---

## Interaction Type Patterns

For each topic template, aim for this distribution across 5-8 messages:

| Interaction Type | Target % | Typical Count (6 msgs) |
|------------------|----------|------------------------|
| initial | 5-15% | 1 |
| agree-extend | 30-50% | 2-3 |
| question-challenge | 15-25% | 1 |
| synthesize | 10-20% | 1 |
| counter | 5-15% | 0-1 |
| reflect | 5-15% | 1 |

**Flow Patterns**:

1. **Basic Pattern** (6 messages):
   - initial → agree-extend → question-challenge → counter → synthesize → reflect

2. **Collaborative Pattern** (7 messages):
   - initial → agree-extend → agree-extend → question-challenge → synthesize → agree-extend → reflect

3. **Debate Pattern** (8 messages):
   - initial → agree-extend → question-challenge → counter → counter → synthesize → agree-extend → reflect

---

## Quality Guidelines

### 1. Persona Voice Consistency
- **Su Shi**: Poetic, philosophical, references classical Chinese aesthetics
- **Guo Xi**: Technical precision, landscape painting theory, classical standards
- **John Ruskin**: Moral dimension, truth to nature, craftsmanship emphasis
- **Mama Zola**: Storytelling approach, communal perspective, cultural preservation
- **Professor Petrova**: Academic rigor, contemporary theory, global art history
- **AI Ethics Reviewer**: Systems thinking, ethical frameworks, technological literacy

### 2. Bilingual Quality
- Not literal translation—adapt to cultural context
- Chinese: More poetic, classical references acceptable
- English: Clear, accessible, theoretical references acceptable
- Equal sophistication in both languages

### 3. Reference Specific Visual Elements
Always ground discussion in the actual artwork:
- Colors, composition, texture
- Scale, materials, execution
- Movement, rhythm, pattern
- Spatial relationships

### 4. Build Conversation Flow
- Reference previous messages explicitly
- Use `quotedText` when replying
- Create logical progression of ideas
- Allow for disagreement and synthesis

### 5. Message Length
- Chinese: 100-150 characters (general guideline)
- English: 80-120 words (for most messages)
- Initial/Synthesize: Can be slightly longer (up to 150 words)
- Question/Counter: Can be shorter (70-100 words)

---

## Example: Complete Thread Structure

```javascript
{
  id: "artwork-1-thread-1",
  artworkId: "artwork-1",
  topic: "机械笔触中的自然韵律",
  topicEn: "Natural Rhythm in Mechanical Brushstrokes",
  participants: ["su-shi", "guo-xi", "john-ruskin"],
  messages: [
    {
      // Su Shi - Initial (150 chars)
      // Observes rhythmic quality in mechanical movement
      interactionType: "initial",
      timestamp: 0
    },
    {
      // Guo Xi - Agree-Extend (120 chars)
      // Agrees, adds technical analysis of 'shi' (momentum)
      interactionType: "agree-extend",
      timestamp: 3000,
      replyTo: "su-shi",
      quotedText: "机械运动中的韵律感"
    },
    {
      // Ruskin - Question-Challenge (100 chars)
      // Questions whether mechanical precision can embody natural rhythm
      interactionType: "question-challenge",
      timestamp: 6000,
      replyTo: "guo-xi"
    },
    {
      // Su Shi - Counter (110 chars)
      // Argues that natural patterns are themselves algorithmic
      interactionType: "counter",
      timestamp: 9000,
      replyTo: "john-ruskin",
      quotedText: "机械精确性"
    },
    {
      // Guo Xi - Synthesize (130 chars)
      // Brings together technique and philosophy
      interactionType: "synthesize",
      timestamp: 12000
    },
    {
      // Ruskin - Reflect (100 chars)
      // Personal reflection on evolving definitions of craft
      interactionType: "reflect",
      timestamp: 15000,
      replyTo: "guo-xi"
    }
  ]
}
```

---

## Usage Workflow

1. **Choose Template**: Select topic template based on artwork characteristics
2. **Select Participants**: Choose 2-4 personas matching the topic focus
3. **Plan Message Flow**: Decide on 5-8 message structure using interaction patterns
4. **Write Initial Message**: Ground in specific visual observation
5. **Build Conversation**: Each message responds to and extends previous ones
6. **Maintain Voice**: Ensure each persona's unique perspective is clear
7. **Validate**: Run `node scripts/validate-dialogues.js` before finalizing

---

**Related Files**:
- `scripts/generate-dialogue.js` - CLI tool using these templates
- `scripts/templates/dialogue-thread-template.js` - Code template
- `js/data/dialogues/types.js` - Interaction type definitions
