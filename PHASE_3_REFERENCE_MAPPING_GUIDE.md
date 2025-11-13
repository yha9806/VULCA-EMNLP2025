# Phase 3.1 Reference Mapping Guide

**Created**: 2025-11-06
**Purpose**: Strategy document for adding knowledge base references to 85 dialogue messages

---

## Knowledge Base Overview

### Available Critics and Files

| Critic | Files | Total Size | Key Sources |
|--------|-------|------------|-------------|
| **Su Shi (苏轼)** | 4 files | 44KB | poetry-and-theory.md, key-concepts.md |
| **Guo Xi (郭熙)** | 4 files | 76KB | landscape-theory.md, key-concepts.md |
| **John Ruskin** | 4 files | 40KB | art-and-morality.md, key-concepts.md |
| **Mama Zola** | 4 files | 52KB | griot-aesthetics-oral-tradition.md, key-concepts.md |
| **Professor Petrova** | 4 files | 12KB | formalism-and-device.md, key-concepts.md |
| **AI Ethics Reviewer** | 4 files | 12KB | algorithmic-justice-and-power.md, key-concepts.md |

### File Types Per Critic

Each critic has:
1. `README.md` - Biography + Core Philosophy + Voice Characteristics
2. `key-concepts.md` - 5 core concepts with detailed explanations
3. `[topic].md` - Main theoretical work (~50 references)
4. `references.md` - Bibliography

---

## Reference Mapping Strategy

### Primary Sources Priority

**For each message, prioritize in this order:**

1. **key-concepts.md** (Most Common)
   - Use for core philosophical arguments
   - Example: Su Shi's "意境 (Yijing)", "笔墨当随时代"

2. **[topic].md** (Deep Theory)
   - Use for specific technical/theoretical claims
   - Example: Guo Xi's "三远法", Petrova's "Defamiliarization"

3. **README.md** (Voice/Biography)
   - Use when message references critic's personal experience
   - Example: Ruskin's "Gothic craftsmen" references

4. **references.md** (Rarely)
   - Use only for direct source citations
   - Example: "《东坡诗集》卷三"

---

## Common Themes Identified

Based on initial analysis of dialogue content:

### Theme 1: Brush/Technique and Technology
**Messages**: Artwork 1 Thread 1 (Su Shi, Guo Xi, Ruskin)
**Key Concepts**:
- Su Shi: "笔墨当随时代" (Brush follows the times)
- Guo Xi: "势" (Momentum), "林泉高致"
- Ruskin: "Truth to nature", "Craftsmanship"

### Theme 2: Creative Agency & Authorship
**Messages**: Artwork 1 Thread 2 (AI Ethics, Petrova, Su Shi)
**Key Concepts**:
- AI Ethics: "Distributed agency", "System vs individual"
- Petrova: "Device" (Прием), "Literariness"
- Su Shi: "人法地，地法天" (Daoist natural laws)

### Theme 3: Aesthetic Experience & Perception
**Messages**: All artworks
**Key Concepts**:
- Guo Xi: "气韵生动" (Vivid spirit resonance)
- Ruskin: "Moral dimension of art"
- Petrova: "Defamiliarization" (Остранение)

### Theme 4: Cultural Identity & Tradition
**Messages**: Artworks with Mama Zola participation
**Key Concepts**:
- Mama Zola: "Ubuntu", "Call-and-Response", "Sankofa"
- Su Shi: "师法造化" (Learning from nature)
- Ruskin: "Gothic vs Classical" aesthetics

### Theme 5: Algorithmic Logic & Form
**Messages**: Technical discussions
**Key Concepts**:
- AI Ethics: "Algorithmic bias", "Power structures"
- Petrova: "Structural analysis", "Automatization"
- Guo Xi: "法度" (Compositional principles)

---

## Reference Template

### Standard 3-Reference Pattern

For most messages, use this structure:

```javascript
references: [
  {
    // 1. PRIMARY: Core concept directly mentioned in message
    critic: "su-shi",
    source: "key-concepts.md",
    quote: "意境 (Yijing - Artistic Conception): The spiritual resonance beyond physical form",
    page: "Core Concept #2"
  },
  {
    // 2. SUPPORTING: Theoretical elaboration
    critic: "su-shi",
    source: "poetry-and-theory.md",
    quote: "笔墨当随时代",
    page: "Section: 论画以形似"
  },
  {
    // 3. CONTEXTUAL: Historical/philosophical background (optional)
    critic: "su-shi",
    source: "README.md",
    quote: "Blending Confucian ethics with Daoist spontaneity",
    page: "Core Philosophy"
  }
]
```

### 2-Reference Pattern (Simpler Messages)

```javascript
references: [
  {
    // 1. PRIMARY concept
    critic: "guo-xi",
    source: "key-concepts.md",
    quote: "三远法 (Three Distances): High, Deep, and Level perspectives",
    page: "Core Concept #3"
  },
  {
    // 2. SUPPORTING theory
    critic: "guo-xi",
    source: "landscape-theory.md",
    quote: "山水畫之法，在乎三远",
    page: "Section: 山水画论"
  }
]
```

---

## Quality Guidelines

### DO

✅ Match quote language to message language (mostly Chinese)
✅ Keep quotes concise (10-30 words)
✅ Verify critic ID matches message personaId
✅ Use exact file names from knowledge-base/critics/[id]/
✅ Include section/page reference when available
✅ Prioritize philosophical concepts over biographical facts

### DON'T

❌ Create fake quotes not in knowledge base
❌ Mix languages unnecessarily (e.g., English quote for Chinese message)
❌ Reference other critics' knowledge bases (cross-reference only if message explicitly discusses them)
❌ Use generic quotes without relevance to message content
❌ Exceed 3 references per message (keep it focused)

---

## Workflow Checklist

For each message:

1. [ ] Read message textZh and textEn
2. [ ] Identify 1-2 core concepts mentioned
3. [ ] Open critic's knowledge-base/critics/[personaId]/
4. [ ] Search key-concepts.md first
5. [ ] Search [topic].md if needed for deeper theory
6. [ ] Copy exact quotes (no paraphrasing)
7. [ ] Record source filename and section
8. [ ] Add 2-3 references to message
9. [ ] Verify reference structure (critic, source, quote, page)

---

## Progress Tracking

| Artwork | Messages | Status | Est. Time | Actual Time |
|---------|----------|--------|-----------|-------------|
| Artwork 1 | 30 | ⏳ Pending | 3-5h | - |
| Artwork 2 | 19 | ⏳ Pending | 2-3h | - |
| Artwork 3 | 18 | ⏳ Pending | 2-3h | - |
| Artwork 4 | 18 | ⏳ Pending | 1.5-3h | - |
| **Total** | **85** | - | **12.5-20h** | - |

---

## Example: Completed Message

### Before
```javascript
{
  id: "msg-artwork-1-1-1",
  personaId: "su-shi",
  textZh: "观此作，机械臂之运动轨迹呈现出一种独特的韵律感。笔触的起承转合，虽由程序控制，却仿佛蕴含着某种"天然之气"。我常言"笔墨当随时代"，而今日之时代，已然包含了人工智能与算法...",
  timestamp: 0
}
```

### After
```javascript
{
  id: "msg-artwork-1-1-1",
  personaId: "su-shi",
  textZh: "观此作，机械臂之运动轨迹呈现出一种独特的韵律感。笔触的起承转合，虽由程序控制，却仿佛蕴含着某种"天然之气"。我常言"笔墨当随时代"，而今日之时代，已然包含了人工智能与算法...",
  timestamp: 0,
  references: [
    {
      critic: "su-shi",
      source: "poetry-and-theory.md",
      quote: "笔墨当随时代",
      page: "Section: 论画以形似"
    },
    {
      critic: "su-shi",
      source: "key-concepts.md",
      quote: "意境 (Yijing - Artistic Conception): The spiritual resonance beyond physical form, where technique serves expressive intent",
      page: "Core Concept #2"
    },
    {
      critic: "su-shi",
      source: "key-concepts.md",
      quote: "天人合一 (Heaven-Human Unity): The unity of nature and humanity, where external forms reflect internal spirit",
      page: "Core Concept #1"
    }
  ]
}
```

---

**Next Step**: Begin Task 3.1.2 (Artwork 1 reference addition)
