/**
 * Dialogue Thread Template
 *
 * This is a template for creating dialogue threads.
 * Replace placeholders with actual content:
 * - [ARTWORK_ID]: e.g., "artwork-1"
 * - [THREAD_NUMBER]: e.g., 1, 2, 3
 * - [TOPIC_ZH]: Chinese topic title
 * - [TOPIC_EN]: English topic title
 * - [PERSONA_IDS]: Array of persona IDs, e.g., ["su-shi", "guo-xi", "john-ruskin"]
 *
 * Message placeholders:
 * - [MSG_NUMBER]: Message sequence number (1, 2, 3...)
 * - [PERSONA_ID]: Persona ID of the speaker
 * - [TEXT_ZH]: Chinese message text (100-150 words)
 * - [TEXT_EN]: English message text (100-150 words)
 * - [TIMESTAMP]: Milliseconds from thread start (0, 3000, 6000...)
 * - [REPLY_TO]: Persona ID being replied to, or null
 * - [INTERACTION_TYPE]: One of: initial, agree-extend, question-challenge, synthesize, counter, reflect
 * - [QUOTED_TEXT]: Optional: specific phrase being quoted
 */

export const [ARTWORK_ID_CAMELCASE]Dialogue[THREAD_NUMBER] = {
  id: "[ARTWORK_ID]-thread-[THREAD_NUMBER]",
  artworkId: "[ARTWORK_ID]",
  topic: "[TOPIC_ZH]",
  topicEn: "[TOPIC_EN]",
  participants: [PERSONA_IDS],
  messages: [
    // ============================================================
    // Message 1: Initial observation (sets the topic)
    // ============================================================
    {
      id: "msg-[ARTWORK_ID]-[THREAD_NUMBER]-1",
      personaId: "[PERSONA_ID_1]",
      textZh: `[TEXT_ZH]

这段文字应该：
- 提出一个具体的观察点或问题
- 引用作品的具体视觉元素
- 体现该评论家的独特视角和 RPAIT 特征
- 100-150 字

示例（苏轼谈技法）：
"这幅作品中，机械臂的运动轨迹呈现出一种独特的韵律感。笔触的起承转合，虽由程序控制，却仿佛蕴含着某种'天然之气'。古人论书画，讲究'笔墨当随时代'，而今日之'时代'，已然包含了人工智能与算法。这种技术介入，是否能诞生新的美学范式？"`,
      textEn: `[TEXT_EN]

This text should:
- Raise a specific observation or question
- Reference specific visual elements from the artwork
- Reflect the critic's unique perspective and RPAIT characteristics
- 100-150 words

Example (Su Shi on technique):
"In this artwork, the mechanical arm's movement trajectory exhibits a unique sense of rhythm. The brushstrokes' progression—rising,承, turning, and closing—though controlled by programming, seem to contain a certain 'natural spirit.' Ancient scholars discussing calligraphy and painting emphasized that 'brush and ink should follow the times,' and today's 'times' inherently include artificial intelligence and algorithms. Can this technological intervention give birth to a new aesthetic paradigm?"`,
      timestamp: 0,
      replyTo: null,
      interactionType: "initial"
    },

    // ============================================================
    // Message 2: Agree-Extend (builds on previous message)
    // ============================================================
    {
      id: "msg-[ARTWORK_ID]-[THREAD_NUMBER]-2",
      personaId: "[PERSONA_ID_2]",
      textZh: `[TEXT_ZH]

这段文字应该：
- 明确同意前一条消息的观点
- 引用前一条消息的具体内容（使用 quotedText）
- 提出新的补充观点或延伸思考
- 80-120 字

示例（郭熙回应苏轼）：
"正如先生所言'程序控制却蕴含天然之气'，我观此作，深以为然。《林泉高致》有云：'画之为用大矣'，不论工具为何，关键在于'意境'之营造。此机械臂虽无人手温度，然其运动轨迹所形成的墨迹，却有一种超越技巧的'势'。这种'势'来自算法的精确性，反而更接近自然规律。"`,
      textEn: `[TEXT_EN]

This text should:
- Clearly agree with the previous message
- Quote specific content from previous message (use quotedText)
- Offer new supplementary insight or extended reflection
- 80-120 words

Example (Guo Xi responding to Su Shi):
"As you noted, 'though controlled by programming, it contains natural spirit'—I observe this work and deeply concur. 'The Lofty Message of Forests and Streams' states: 'The use of painting is vast'—regardless of tools, what matters is the creation of 'artistic conception.' Though this mechanical arm lacks human warmth, the ink traces formed by its movement trajectory possess a 'momentum' that transcends mere technique. This 'momentum' comes from algorithmic precision, yet paradoxically brings it closer to natural laws."`,
      timestamp: 3000,
      replyTo: "[PERSONA_ID_1]",
      interactionType: "agree-extend",
      quotedText: "程序控制却蕴含天然之气"
    },

    // ============================================================
    // Message 3: Question-Challenge (raises doubt or counterpoint)
    // ============================================================
    {
      id: "msg-[ARTWORK_ID]-[THREAD_NUMBER]-3",
      personaId: "[PERSONA_ID_3]",
      textZh: `[TEXT_ZH]

这段文字应该：
- 提出质疑或挑战前面的观点
- 指出潜在问题或矛盾
- 引入新的视角或批判性思考
- 80-100 字

示例（鲁斯金质疑）：
"但我必须提出一个疑问：算法的'精确性'真能等同于艺术的'真实性'吗？真正的艺术源于人类的情感、经验与不完美。机械臂再精准，也不过是执行预设指令。它能理解'苍茫'吗？能感受'萧瑟'吗？若答案是否，那这'势'不过是表象，缺乏灵魂。"`,
      textEn: `[TEXT_EN]

This text should:
- Raise questions or challenge previous views
- Point out potential problems or contradictions
- Introduce new perspective or critical thinking
- 80-100 words

Example (Ruskin questioning):
"But I must raise a question: Can algorithmic 'precision' truly equate to artistic 'authenticity'? True art arises from human emotion, experience, and imperfection. No matter how precise, a mechanical arm merely executes preset instructions. Can it understand 'vastness'? Can it feel 'bleakness'? If the answer is no, then this 'momentum' is merely superficial, lacking soul."`,
      timestamp: 6000,
      replyTo: "[PERSONA_ID_2]",
      interactionType: "question-challenge",
      quotedText: "算法的精确性"
    },

    // ============================================================
    // Message 4: Counter (disagrees with reasoning)
    // ============================================================
    {
      id: "msg-[ARTWORK_ID]-[THREAD_NUMBER]-4",
      personaId: "[PERSONA_ID_4]",
      textZh: `[TEXT_ZH]

这段文字应该：
- 明确反驳前一条消息的逻辑或结论
- 提供相反的证据或论据
- 展示不同的理论框架或文化视角
- 90-130 字

示例（AI Ethics Reviewer 反驳）：
"我不同意'缺乏灵魂'的论断。这种二元对立——人类有灵魂，机器无灵魂——本身就是一种过时的形而上学假设。当代认知科学表明，'理解'和'感受'并非人类独有。机器学习模型通过训练数据习得模式，这与人类通过经验学习并无本质区别。我们应该问：这个作品是否引发了观者的情感共鸣？如果是，灵魂的来源重要吗？"`,
      textEn: `[TEXT_EN]

This text should:
- Clearly refute the logic or conclusion of previous message
- Provide contrary evidence or arguments
- Display different theoretical framework or cultural perspective
- 90-130 words

Example (AI Ethics Reviewer countering):
"I disagree with the 'lacking soul' verdict. This binary opposition—humans have souls, machines don't—is itself an outdated metaphysical assumption. Contemporary cognitive science shows that 'understanding' and 'feeling' are not exclusively human. Machine learning models acquire patterns through training data, fundamentally no different from humans learning through experience. We should ask: Does this artwork evoke emotional resonance in viewers? If so, does the source of soul matter?"`,
      timestamp: 9000,
      replyTo: "[PERSONA_ID_3]",
      interactionType: "counter",
      quotedText: "缺乏灵魂"
    },

    // ============================================================
    // Message 5: Synthesize (brings together different viewpoints)
    // ============================================================
    {
      id: "msg-[ARTWORK_ID]-[THREAD_NUMBER]-5",
      personaId: "[PERSONA_ID_5]",
      textZh: `[TEXT_ZH]

这段文字应该：
- 综合前面多个评论家的观点
- 找出共同点或互补性
- 提出更高层次的理解
- 100-140 字

示例（Petrova 教授综合）：
"我们的讨论触及了艺术本质的核心问题。苏轼和郭熙强调'意境'，鲁斯金关注'真实性'，AI伦理审查者提出'观者共鸣'。这三个维度其实并不矛盾。或许，真正的问题不是'机器能否创作艺术'，而是'我们如何定义创作者身份'。这幅作品的创作者是谁？是程序员、艺术家、机械臂，还是它们的共同体？也许，艺术创作正在从'个人天才'模式转向'混合智能'模式。"`,
      textEn: `[TEXT_EN]

This text should:
- Synthesize viewpoints from multiple previous critics
- Identify common ground or complementarity
- Propose higher-level understanding
- 100-140 words

Example (Professor Petrova synthesizing):
"Our discussion touches the core question of art's essence. Su Shi and Guo Xi emphasize 'artistic conception,' Ruskin focuses on 'authenticity,' and the AI Ethics Reviewer proposes 'viewer resonance.' These three dimensions are not contradictory. Perhaps the real question isn't 'Can machines create art?' but 'How do we define creator identity?' Who is the creator of this work? The programmer, artist, mechanical arm, or their collective? Perhaps artistic creation is transitioning from an 'individual genius' model to a 'hybrid intelligence' model."`,
      timestamp: 12000,
      replyTo: null, // Synthesizes multiple messages, no single replyTo
      interactionType: "synthesize"
    },

    // ============================================================
    // Message 6: Reflect (personal reflection inspired by dialogue)
    // ============================================================
    {
      id: "msg-[ARTWORK_ID]-[THREAD_NUMBER]-6",
      personaId: "[PERSONA_ID_6]",
      textZh: `[TEXT_ZH]

这段文字应该：
- 表达个人的深层思考或感悟
- 连接讨论与更广泛的文化/历史语境
- 可以是诗意的、哲学性的反思
- 80-120 字

示例（Mama Zola 反思）：
"听你们的讨论，我想起故乡的织布机。祖母说，织布时要'用心听'——听经线与纬线的对话。或许，艺术从来不在于工具，而在于'对话'本身。人与机器、传统与现代、东方与西方，这些对话编织出新的文化图景。这幅作品让我看到：未来的艺术，将是一场跨越边界的永恒对话。"`,
      textEn: `[TEXT_EN]

This text should:
- Express deep personal reflection or insight
- Connect discussion to broader cultural/historical context
- Can be poetic, philosophical reflection
- 80-120 words

Example (Mama Zola reflecting):
"Listening to your discussion, I remember my homeland's looms. Grandmother said weaving requires 'listening with your heart'—hearing the dialogue between warp and weft. Perhaps art has never been about tools, but about 'dialogue' itself. Human and machine, tradition and modernity, East and West—these dialogues weave new cultural tapestries. This artwork shows me: future art will be an eternal dialogue transcending boundaries."`,
      timestamp: 15000,
      replyTo: "[PERSONA_ID_5]",
      interactionType: "reflect"
    }

    // Add more messages as needed (typically 5-8 per thread)
  ]
};
