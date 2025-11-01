/**
 * VULCA Art Exhibition Data
 * Version 3.0.0 - Art-Centric Immersive Redesign
 *
 * Complete dataset for 4 artworks × 6 personas = 24 critiques
 */

window.VULCA_DATA = {
  // ==================== ARTWORKS ====================
  artworks: [
    {
      id: "artwork-1",
      titleZh: "记忆（绘画操作单元：第二代）",
      titleEn: "Memory (Painting Operation Unit: Second Generation)",
      year: 2022,
      imageUrl: "/assets/artwork-1.jpg",
      artist: "Sougwen Chung",
      context: "Contemporary digital-robotic hybrid artwork exploring memory and artistic agency"
    },
    {
      id: "artwork-2",
      titleZh: "绘画操作单元：第一代（模仿）",
      titleEn: "Painting Operation Unit: First Generation (Imitation)",
      year: 2015,
      imageUrl: "/assets/artwork-2.jpg",
      artist: "Sougwen Chung",
      context: "Early exploration of robotic painting as cultural commentary"
    },
    {
      id: "artwork-3",
      titleZh: "万物于万物",
      titleEn: "All Things in All Things",
      year: 2018,
      imageUrl: "/assets/artwork-3.jpg",
      artist: "Sougwen Chung",
      context: "Interconnected systems of art, technology, and nature"
    },
    {
      id: "artwork-4",
      titleZh: "精美对话：花萼、花瓣、刺",
      titleEn: "Exquisite Dialogue: Sepals, Petals, Thorns",
      year: 2020,
      imageUrl: "/assets/artwork-4.jpg",
      artist: "Sougwen Chung",
      context: "Botanical metaphors intersecting with artistic creation and destruction"
    }
  ],

  // ==================== PERSONAS ====================
  personas: [
    {
      id: "su-shi",
      nameZh: "苏轼",
      nameEn: "Su Shi",
      period: "北宋文人 (1037-1101)",
      era: "Northern Song Dynasty",
      bio: "Literati painter, poet, and philosophical thinker who championed expressive painting over technical precision",
      color: "#B85C3C",
      bias: "Aesthetic idealism, personal expression, philosophical depth"
    },
    {
      id: "guo-xi",
      nameZh: "郭熙",
      nameEn: "Guo Xi",
      period: "北宋山水画家 (1020-1100)",
      era: "Northern Song Dynasty",
      bio: "Master landscape painter known for systematic compositional analysis and formal techniques",
      color: "#2D5F4F",
      bias: "Formal composition, technical mastery, landscape principles"
    },
    {
      id: "john-ruskin",
      nameZh: "约翰·罗斯金",
      nameEn: "John Ruskin",
      period: "维多利亚时期评论家 (1819-1900)",
      era: "Victorian England",
      bio: "Influential art critic who emphasized moral and social dimensions of aesthetics",
      color: "#6B4C8A",
      bias: "Moral aesthetics, nature observation, social responsibility"
    },
    {
      id: "mama-zola",
      nameZh: "佐拉妈妈",
      nameEn: "Mama Zola",
      period: "西非传统文化",
      era: "Contemporary African",
      bio: "Community elder representing oral traditions and collective meaning-making in art interpretation",
      color: "#D4A574",
      bias: "Community engagement, oral traditions, collective interpretation"
    },
    {
      id: "professor-petrova",
      nameZh: "埃琳娜·佩特洛娃教授",
      nameEn: "Professor Elena Petrova",
      period: "俄罗斯形式主义",
      era: "Contemporary Russian",
      bio: "Formalist scholar analyzing visual elements, structure, and artistic language",
      color: "#4A5568",
      bias: "Structural analysis, visual language, formal elements"
    },
    {
      id: "ai-ethics",
      nameZh: "AI伦理评审员",
      nameEn: "AI Ethics Reviewer",
      period: "数字时代",
      era: "Contemporary Digital",
      bio: "Digital-era perspective on algorithmic aesthetics, machine creativity, and technological art",
      color: "#808080",
      bias: "Technical innovation, algorithmic thinking, human-machine collaboration"
    }
  ],

  // ==================== CRITIQUES ====================
  // 24 total critiques (4 artworks × 6 personas)
  // Note: These are sample critiques for demonstration
  // In production, these would be AI-generated or curated by domain experts

  critiques: [
    // -------- ARTWORK 1: Memory (绘画操作单元：第二代) --------
    {
      artworkId: "artwork-1",
      personaId: "su-shi",
      textZh: "此作品展现了笔墨与机器的对话。机械臂如同现代文人画家之手，却失却了心意的指引。观此作，我感悟到真正的艺术不在技法之精妙，而在意趣之深邃。作品虽以机械成就，其精神却探讨着人与非人的界限。这种关于记忆与创作的思辨，值得沉思。",
      textEn: "This work presents a dialogue between ink and machine. The robotic arm moves like a contemporary literati painter's hand, yet lacks the guidance of human intention. Observing this, I realize that true art lies not in technical precision, but in subtle philosophical depth. Though executed by mechanism, its spirit explores the boundaries between human and non-human. This meditation on memory and creation merits contemplation.",
      rpait: { R: 7, P: 9, A: 8, I: 8, T: 6 }
    },
    {
      artworkId: "artwork-1",
      personaId: "guo-xi",
      textZh: "从山水画的传统审视，此作品以现代技术重新诠释了笔墨线条的本质。机械臂的运动轨迹体现了几何的美感，而笔触的随机性则保留了偶然之妙。整体构图颇具张力，虽非传统山水，却有其独特的形式语言。机械与艺术的结合，打破了既有的创作边界。",
      textEn: "From the perspective of landscape painting tradition, this work reinterprets the essence of brushstrokes through modern technology. The robotic arm's trajectory reveals geometric beauty, while the randomness of marks preserves the charm of chance. The overall composition has considerable tension. Though not traditional landscape, it possesses unique formal language. The fusion of machine and art transcends conventional creative boundaries.",
      rpait: { R: 8, P: 7, A: 8, I: 7, T: 8 }
    },
    {
      artworkId: "artwork-1",
      personaId: "john-ruskin",
      textZh: "当机器取代人手时，艺术是否失去了灵魂？此作引发深刻的伦理思考。虽然技术令人惊叹，但我担忧：它是否破坏了创作过程中的道德承诺？然而，作品也许正在问一个更深层的问题：记忆可以被机械化吗？这种对人性的质疑，恰是艺术最可贵之处。",
      textEn: "When machines replace human hands, does art lose its soul? This work provokes profound ethical reflection. While technology is astounding, I worry whether it severs the moral covenant inherent in creation. Yet perhaps the work poses a deeper question: Can memory be mechanized? This interrogation of humanity is art's greatest value.",
      rpait: { R: 6, P: 8, A: 7, I: 9, T: 5 }
    },
    {
      artworkId: "artwork-1",
      personaId: "mama-zola",
      textZh: "机器与艺术的相遇，让我想起我们祖先用手绘制的故事。每一笔都承载着传统与信念。看这部作品，我看到了一种新的叙事方式，虽然是机器驱动，但它在问：我们如何记住过去，如何将文化传承给下一代？这是一个社区应该共同思考的问题。",
      textEn: "The encounter between machine and art reminds me of how our ancestors drew stories by hand. Each stroke carried tradition and belief. Witnessing this work, I see a new form of narrative, though machine-driven, asking: How do we remember the past? How do we pass culture to the next generation? This is a question our community must contemplate together.",
      rpait: { R: 7, P: 6, A: 8, I: 8, T: 6 }
    },
    {
      artworkId: "artwork-1",
      personaId: "professor-petrova",
      textZh: "从形式主义的角度，此作在视觉层面达成了卓越的平衡。线条的变异性与重复性形成对立统一，创造出动态的视觉节奏。色彩的运用虽然克制，却恰好突显了线条本身的力量。结构上，作品展现了机械系统与艺术表现之间的深层对话，这种对立与统一的关系，正是形式美学的核心。",
      textEn: "From a formalist perspective, this work achieves excellent visual balance. The variation and repetition of lines create dynamic visual rhythm through dialectical opposition. Color use, though restrained, precisely emphasizes the power of line itself. Structurally, the work manifests deep dialogue between mechanical systems and artistic expression. This relationship of opposition and unity is central to formal aesthetics.",
      rpait: { R: 8, P: 7, A: 9, I: 6, T: 8 }
    },
    {
      artworkId: "artwork-1",
      personaId: "ai-ethics",
      textZh: "这是人工创意的一个引人注目的案例。机器学习系统被训练来模仿艺术创作，这引发了关键问题：创意的本质是什么？这件作品通过展示机器也能参与创意过程，挑战了我们关于人类独特性的假设。从技术伦理的角度，它也提示我们思考算法与美学的交点，以及我们如何定义艺术的真实性。",
      textEn: "This is a notable case of artificial creativity. Machine learning systems trained to mimic artistic creation raise key questions: What is the essence of creativity? By demonstrating that machines can participate in creative processes, it challenges our assumptions about human uniqueness. From a technology ethics perspective, it prompts reflection on the intersection of algorithms and aesthetics, and how we define artistic authenticity.",
      rpait: { R: 8, P: 8, A: 7, I: 9, T: 7 }
    },

    // -------- ARTWORK 2: Painting Operation Unit: First Generation --------
    {
      artworkId: "artwork-2",
      personaId: "su-shi",
      textZh: "机器的初次尝试，蕴含着对艺术本质的根本性思考。这件早期作品少了成熟的精妙，却多了探索的真诚。我看到的是艺术家对\"道\"的追求——通过机械之手去触及艺术的原点。虽然笔迹粗粝，却有其独特的禅意。这正如初学者的笔墨，虽不完美，却充满生机。",
      textEn: "The machine's first attempt embodies fundamental inquiry into art's essence. This early work lacks mature sophistication but gains sincere exploration. I see the artist's pursuit of 'Dao'—using mechanical hands to touch art's origins. Though the brushwork is rough, it carries unique zen quality. Like a beginner's strokes, imperfect yet vital.",
      rpait: { R: 6, P: 8, A: 7, I: 7, T: 5 }
    },
    {
      artworkId: "artwork-2",
      personaId: "guo-xi",
      textZh: "这件作品展现了形式上的实验精神，但在技法上尚显稚嫩。机械臂的运动控制不够精确，线条的质量起伏不定。从山水画的严格标准看，它缺乏必要的笔法韵味。然而，正是这种不完美，反映了艺术家对新可能性的探索。作为第一代，它更多地是一个问题的提出，而非答案的给出。",
      textEn: "This work demonstrates experimental spirit in form but appears immature in technique. The robotic arm's motion control lacks precision, and line quality fluctuates inconsistently. By strict landscape painting standards, it lacks necessary brushwork charm. Yet this imperfection reflects the artist's exploration of new possibilities. As a first generation, it poses questions more than providing answers.",
      rpait: { R: 6, P: 6, A: 6, I: 8, T: 5 }
    },
    {
      artworkId: "artwork-2",
      personaId: "john-ruskin",
      textZh: "初代作品往往最坦诚。这件作品没有隐藏其机械的本质，反而直言不讳地展示了人与机器的关系。作为第一次尝试，它缺乏完成度，但这种未完成本身成为了一种诚实的表达。它问：艺术可以被自动化吗？答案显然是：不完全可以。这种不可能本身，就是艺术的证明。",
      textEn: "Early works are often most candid. This work doesn't hide its mechanical nature but frankly displays the human-machine relationship. As a first attempt, it lacks completion, yet this incompleteness itself becomes honest expression. It asks: Can art be automated? The answer is clearly no, not completely. This very impossibility proves art's existence.",
      rpait: { R: 5, P: 7, A: 5, I: 8, T: 4 }
    },
    {
      artworkId: "artwork-2",
      personaId: "mama-zola",
      textZh: "看这个年轻的实验，我想起我们如何教孩子学习传统工艺。第一次尝试总是充满错误与失误，但正是这些失误教会我们最深刻的东西。这件作品的不完美，其实是一种更真实的对话——艺术家在和机器一起学习。对于社区来说，看到这个学习过程本身，比看到完成品更有价值。",
      textEn: "Witnessing this young experiment, I recall how we teach children traditional crafts. First attempts are always full of errors, yet these errors teach us most profoundly. This work's imperfection is a more genuine dialogue—the artist learning with the machine. For our community, observing the learning process itself holds more value than viewing finished works.",
      rpait: { R: 6, P: 5, A: 6, I: 7, T: 5 }
    },
    {
      artworkId: "artwork-2",
      personaId: "professor-petrova",
      textZh: "从结构上看，这件作品的形式实验颇具意义。它尝试用简单的几何形状和重复的线条来构建视觉语言。虽然执行层面存在不精确，但这种不精确反而凸显了形式本身的重要性。机械系统的局限性强制艺术家去思考最本质的视觉元素，这种局限反而成为了创意的驱动力。",
      textEn: "Structurally, this work's formal experiments carry significance. It attempts to construct visual language through simple geometric shapes and repetitive lines. Though execution lacks precision, this imprecision highlights form's fundamental importance. The mechanical system's limitations forced the artist to consider essential visual elements; constraint became creative catalyst.",
      rpait: { R: 6, P: 6, A: 7, I: 7, T: 6 }
    },
    {
      artworkId: "artwork-2",
      personaId: "ai-ethics",
      textZh: "这是算法艺术演进的一个重要里程碑。第一代系统的局限性清晰可见，但正是这些局限定义了该阶段的美学。它展示了机器学习在创意任务中的早期探索——充满失败却充满希望。从技术伦理的视角，这种透明的失败比虚假的成功更有价值。它诚实地显示了机器能做什么，不能做什么。",
      textEn: "This marks an important milestone in algorithmic art's evolution. First-generation system limitations are starkly visible, yet these constraints defined that era's aesthetics. It demonstrates machine learning's early exploration in creative tasks—full of failures yet hopeful. From technology ethics, transparent failure proves more valuable than false success. It honestly shows what machines can and cannot do.",
      rpait: { R: 7, P: 7, A: 6, I: 8, T: 6 }
    },

    // -------- ARTWORK 3: All Things in All Things --------
    {
      artworkId: "artwork-3",
      personaId: "su-shi",
      textZh: "\"万物于万物\"，此题名已臻艺术之道。当观此作品，我感受到的是一种宇宙观念的呈现——所有事物相互联系、相互渗透的哲学。作品的线条网络如同自然的脉络，无处不在，无处不连。这恰是我所追求的：通过艺术作品，展现世界的本质联系。机械手和人的精神在此统一。",
      textEn: "\"All Things in All Things\"—this very title achieves artistic Dao. Observing this work, I perceive a cosmic vision—philosophy of mutual connection and interpenetration. The network of lines resembles nature's veins, omnipresent and interconnected. This precisely embodies what I pursued: revealing the world's essential connections through art. Here, mechanical hand and human spirit unite.",
      rpait: { R: 8, P: 9, A: 9, I: 9, T: 7 }
    },
    {
      artworkId: "artwork-3",
      personaId: "guo-xi",
      textZh: "这件作品在形式上达到了成熟。错综复杂的线条网络展现了高度的控制力和精妙的视觉平衡。从山水画的传统看，这是对\"繁而不乱，密而有致\"的现代诠释。整体构图的深度感通过线条的密度变化得以实现。作品证明了机械系统可以达到传统艺术的复杂性。",
      textEn: "This work achieves formal maturity. The intricate network of lines demonstrates high control and subtle visual balance. From landscape tradition, this is a modern interpretation of 'complexity without chaos, density with purpose.' Compositional depth is achieved through line density variation. The work proves mechanical systems can attain traditional art's complexity.",
      rpait: { R: 9, P: 8, A: 8, I: 8, T: 8 }
    },
    {
      artworkId: "artwork-3",
      personaId: "john-ruskin",
      textZh: "自然的相互关联通常激发了我最深刻的思考。这件作品似乎在探讨自然、艺术和技术之间的内在联系。虽然作品本身是人工的，但它指向的是有机世界的网络性特质。这种对生命的互联本质的思考，展现了艺术对道德和社会责任的承诺。作品提醒我们，所有事物都相互联系。",
      textEn: "Nature's interconnectedness has always inspired my deepest thoughts. This work explores inherent connections between nature, art, and technology. Though artificial, it points toward organic world's networked qualities. This meditation on life's interdependent nature shows art's commitment to moral and social responsibility. It reminds us that all things are interconnected.",
      rpait: { R: 8, P: 8, A: 8, I: 8, T: 7 }
    },
    {
      artworkId: "artwork-3",
      personaId: "mama-zola",
      textZh: "我们的传统一直教导我们：万物相连。看这件作品，我看到了这一哲学的现代诠释。密密麻麻的线条像我们社区中的每一个人，独立却又相互依赖。没有一个人能独自存在，就像这网络中没有一条孤立的线。这种对相互联系的艺术表达，对我们的社区具有深刻的意义。",
      textEn: "Our traditions have always taught that all things are connected. Witnessing this work, I see a modern interpretation of this philosophy. Countless threads resemble each person in our community—independent yet interdependent. No one exists alone, just as no isolated lines exist in this network. This artistic expression of interconnection carries profound meaning for our community.",
      rpait: { R: 8, P: 7, A: 8, I: 8, T: 8 }
    },
    {
      artworkId: "artwork-3",
      personaId: "professor-petrova",
      textZh: "从结构主义的角度，这件作品达到了杰出的成就。线条网络形成了一个自我引用的系统，其中每个元素都与整体保持着确定的关系。作品的美学源于这种严格的结构逻辑——无序表面下的有序法则。这是形式美学的顶峰：用最简洁的元素（线条）创造最复杂的视觉体验。",
      textEn: "From structuralist perspective, this work achieves outstanding accomplishment. The line network forms a self-referential system where each element maintains determined relationship with the whole. Aesthetic beauty derives from this rigorous structural logic—order beneath disorder's surface. This is formal aesthetics' pinnacle: creating complex visual experience with simplest elements.",
      rpait: { R: 9, P: 8, A: 9, I: 8, T: 8 }
    },
    {
      artworkId: "artwork-3",
      personaId: "ai-ethics",
      textZh: "这件作品展示了算法与艺术的完美融合。机器学习系统被用来生成这种复杂的网络结构，体现了人工智能在创意领域的深层潜能。从伦理的角度，这引发了关于算法创意本质的重要问题：当系统能生成如此复杂且美丽的作品时，我们如何定义创意的真实性？这不是用机器取代艺术家，而是人与机器的真正对话。",
      textEn: "This work demonstrates perfect fusion of algorithm and art. Machine learning systems generated this complex network, embodying AI's deep potential in creative domains. Ethically, it raises crucial questions about algorithmic creativity's nature: When systems generate such complex and beautiful works, how do we define creative authenticity? This isn't replacing artists with machines but genuine human-machine dialogue.",
      rpait: { R: 9, P: 9, A: 8, I: 8, T: 8 }
    },

    // -------- ARTWORK 4: Exquisite Dialogue: Sepals, Petals, Thorns --------
    {
      artworkId: "artwork-4",
      personaId: "su-shi",
      textZh: "生与死、美与刺的辩证法。这件作品通过花的三个部分隐喻了艺术创作的三重性：保护（花萼）、表达（花瓣）、防御（刺）。深层上，它问：艺术的目的是什么？是美的呈现，还是对脆弱的保护？观此作，我陷入深思。作品的诗意，正在于它保持了这种张力——不追求和解，而保持问题的开放性。",
      textEn: "The dialectic of life and death, beauty and thorn. This work uses three flower parts as metaphor for art's trinity: protection (sepals), expression (petals), defense (thorns). Deeply, it asks: What is art's purpose? To present beauty or protect fragility? Observing this, I contemplate deeply. The work's poetry lies in maintaining this tension—not seeking resolution but preserving question's openness.",
      rpait: { R: 7, P: 9, A: 9, I: 9, T: 6 }
    },
    {
      artworkId: "artwork-4",
      personaId: "guo-xi",
      textZh: "花的三个要素在此找到了完美的视觉表达。每个部分的比例、色彩、质地都精心考量，形成了一个和谐而不单调的整体。这种对细节的关注，让我想起传统绘画中对自然的观察与诠释。作品展现了机械精确性和美学敏感性的结合。复杂的形态在此显得自然流畅。",
      textEn: "The three elements of flower find perfect visual expression here. Each part's proportion, color, texture are carefully considered, forming a harmonious yet non-monotonous whole. Such attention to detail reminds me of traditional painting's observation and interpretation of nature. The work demonstrates combination of mechanical precision and aesthetic sensitivity. Complex forms appear natural and fluid.",
      rpait: { R: 8, P: 8, A: 9, I: 8, T: 9 }
    },
    {
      artworkId: "artwork-4",
      personaId: "john-ruskin",
      textZh: "自然中的美与痛并存——刺的存在正是对这一真理的证明。这件作品以其诚实的视角触动了我。它不将自然理想化，而是承认自然的完整性，包括其防御和攻击性。这种对自然真实性的尊重，同时也是对艺术道德责任的体现。花既能吸引，也能伤害——这种二元性在作品中得到了完美的表达。",
      textEn: "In nature, beauty and pain coexist—the thorn's presence proves this truth. This work's honest perspective moves me. It doesn't idealize nature but acknowledges its completeness, including defensive and aggressive aspects. This respect for nature's authenticity simultaneously embodies art's moral responsibility. Flowers attract and wound—this duality finds perfect expression here.",
      rpait: { R: 8, P: 9, A: 9, I: 9, T: 8 }
    },
    {
      artworkId: "artwork-4",
      personaId: "mama-zola",
      textZh: "我们社区的妇女用花编织故事已有几代。花萼、花瓣、刺，每个部分都有其在我们文化中的意义。看这件作品，我看到了对自然的深刻理解——不仅是美，还有保护、危险和力量。这是一件教人的作品，它告诉我们如何尊重自然的所有面向，如何从生活的全部真相中学习。",
      textEn: "Women in our community have woven flower stories for generations. Sepals, petals, thorns—each carries meaning in our culture. Witnessing this work, I see profound nature understanding—not just beauty but protection, danger, and strength. This is a teaching work, showing how to respect all aspects of nature, how to learn from life's complete truth.",
      rpait: { R: 8, P: 8, A: 9, I: 8, T: 8 }
    },
    {
      artworkId: "artwork-4",
      personaId: "professor-petrova",
      textZh: "结构上，这件作品展现了卓越的平衡。三个元素以对称而非相同的方式呈现，创造了动态的视觉和谐。色彩的运用避免了单调，线条的变化体现了形态的复杂性。从形式主义看，这是一件成熟的作品，其中所有视觉元素都服从于整体的艺术逻辑。机械的精确性在此成为了美学的基础。",
      textEn: "Structurally, this work demonstrates excellent balance. Three elements are presented symmetrically rather than identically, creating dynamic visual harmony. Color use avoids monotony; line variation reflects form complexity. From formalist view, this is a mature work where all visual elements obey overall artistic logic. Mechanical precision here becomes aesthetic foundation.",
      rpait: { R: 9, P: 8, A: 9, I: 8, T: 9 }
    },
    {
      artworkId: "artwork-4",
      personaId: "ai-ethics",
      textZh: "这件作品展现了机器在处理复杂有机形态时的能力。从一条刺到完整的花，系统必须理解并调和相互冲突的属性：保护与表达、美与伤害。从伦理角度看，这引发了关于AI审美的深层问题。机器能理解美吗？它能感受花的脆弱性吗？这件作品通过展示精妙的视觉结果，反而增强了我对这些基本问题的疑问。",
      textEn: "This work demonstrates machine capability in handling complex organic forms. From single thorn to complete flower, the system must understand and reconcile conflicting attributes: protection and expression, beauty and injury. Ethically, it raises deep questions about AI aesthetics. Can machines understand beauty? Can they feel flower's fragility? By showing sophisticated visual results, the work deepens my questions about these fundamental issues.",
      rpait: { R: 9, P: 8, A: 9, I: 9, T: 8 }
    }
  ]
};

/**
 * Compute average RPAIT scores for each persona from their critiques
 * This allows the critics page to display overall RPAIT dimensions
 */
(function() {
  // Create a map to store RPAIT scores for each persona
  const personaRpaitMap = {};

  // Initialize the map with empty arrays
  window.VULCA_DATA.personas.forEach(persona => {
    personaRpaitMap[persona.id] = [];
  });

  // Collect all RPAIT scores for each persona
  window.VULCA_DATA.critiques.forEach(critique => {
    if (critique.personaId && critique.rpait) {
      personaRpaitMap[critique.personaId].push(critique.rpait);
    }
  });

  // Compute average RPAIT for each persona and add to persona object
  window.VULCA_DATA.personas.forEach(persona => {
    const rpaitScores = personaRpaitMap[persona.id];

    if (rpaitScores && rpaitScores.length > 0) {
      // Calculate average for each dimension
      const avgRpait = {
        R: 0,
        P: 0,
        A: 0,
        I: 0,
        T: 0
      };

      rpaitScores.forEach(score => {
        avgRpait.R += score.R || 0;
        avgRpait.P += score.P || 0;
        avgRpait.A += score.A || 0;
        avgRpait.I += score.I || 0;
        avgRpait.T += score.T || 0;
      });

      // Divide by number of critiques to get average
      const count = rpaitScores.length;
      avgRpait.R = Math.round(avgRpait.R / count);
      avgRpait.P = Math.round(avgRpait.P / count);
      avgRpait.A = Math.round(avgRpait.A / count);
      avgRpait.I = Math.round(avgRpait.I / count);
      avgRpait.T = Math.round(avgRpait.T / count);

      // Add to persona object
      persona.rpait = avgRpait;
    }
  });
})();

/**
 * Export for Node.js environments
 * (Not used in browser, but included for compatibility)
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.VULCA_DATA;
}
