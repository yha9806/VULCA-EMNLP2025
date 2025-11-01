/**
 * CritiqueData - Full-text content for all artwork critiques
 *
 * Phase 5: Content Interaction System
 * Contains bilingual critique text indexed by artwork × persona combinations
 */

const CritiqueData = {
  artwork_1: {
    title: '书法中的光影',
    critiques: {
      '苏轼': {
        title: '书法中的光影',
        personaId: '苏轼',
        artworkId: 'artwork_1',
        content: `这件作品将传统书法的笔墨精神与现代光学技术完美融合。光敏纸的使用突破了传统书法的局限，使笔迹在光线变化中呈现出多维度的表现力。艺术家在运用数字墨水时，保留了传统笔触的韵律感，这种对传统文人精神的继承与创新的结合，正是当代艺术的价值所在。

光影的变化赋予书法新的生命。在不同的光线条件下，同一笔墨显露出全然不同的意境。这让我想起古人所说的"笔有四德"，而今这四德得以在时间与光线中流动。整个作品充满了诗意的张力，既保持了东方美学的含蓄，又展现了技术赋予艺术的新可能性。`,
      },
      '郭熙': {
        title: '书法中的光影',
        personaId: '郭熙',
        artworkId: 'artwork_1',
        content: `从山水画论的角度看，这件作品体现了"远近法"的现代诠释。艺术家利用光敏材料创造了一个类似于"观山则情满于山"的沉浸式体验。笔墨的疏密安排遵循了传统构图的原理，而光影的引入使这些原理在时间维度上得到延展。

数字墨水与光敏纸的组合形成了一种新的"笔法"。在我的传统山水理论中，讲究笔墨的韵律和呼应；这件作品恰恰在光线的流动中实现了这种韵律。观众不再是静观者，而是成为了这个作品的共谋者，其视角的转移就如同在山水中行走。这是艺术创新的真正意义。`,
      },
      '约翰罗斯金': {
        title: '书法中的光影',
        personaId: '约翰罗斯金',
        artworkId: 'artwork_1',
        content: `This work demonstrates a profound understanding of beauty through the interplay of light and form. The artist's use of photosensitive paper transforms the static marks of calligraphy into a temporal art form, much like architecture reveals its beauty through changing light throughout the day.

The craftsmanship evident in the precise control of the digital ink strokes shows deep respect for the material. The interplay between the permanent marks and the ephemeral light creates a dialogue between the artist's intention and the viewer's experience. This work embodies the principle that true beauty lies not in the object itself, but in its interaction with its environment.`,
      },
      '佐拉妈妈': {
        title: '书法中的光影',
        personaId: '佐拉妈妈',
        artworkId: 'artwork_1',
        content: `这是一件充满社会观察意义的作品。艺术家通过光敏纸的变色特性，隐喻了文化在不同语境中的转变。传统书法被视为精英艺术的象征，而这件作品将其民主化，使任何拥有光源的观众都能参与到作品的"生成"过程中。

光影的变化象征了社会变革的过程。在不同的光线条件下，书法呈现不同的面貌，这反映了同一个文化符号在不同社会阶层和时代背景下的多元解读。艺术家的选择具有深层的社会意义，是对传统权力结构的温和颠覆。`,
      },
      '埃琳娜佩特洛娃': {
        title: '书法中的光影',
        personaId: '埃琳娜佩特洛娃',
        artworkId: 'artwork_1',
        content: `从现代主义美学的角度，这件作品呈现了极度的视觉张力。艺术家运用了一个悖论：永恒的书法标记与瞬息变化的光影。这种二元对立的结合创造了一个充满戏剧性的审美空间。

技术的运用达到了艺术表达的最高境界。每一笔都经过精确计算，以确保在不同光线下都能显现出预期的视觉效果。这种对细节的执着追求反映了艺术家对完美形式的渴望。整个作品散发出一种冷静而优雅的气质，是对视觉艺术本质的深刻思考。`,
      },
      'AI伦理评审员': {
        title: '书法中的光影',
        personaId: 'AI伦理评审员',
        artworkId: 'artwork_1',
        content: `这件作品在人工智能和传统艺术的交界处提出了有趣的问题。数字墨水的使用涉及精确的算法控制，使得书法笔迹能够在不同光线条件下保持一致的表现。这种精确性与传统书法的"随性"形成了有趣的对话。

从伦理的角度看，艺术家选择保留了人工笔迹的个性，而不是用完全算法生成的图案。这种选择尊重了书法作为人类文化遗产的价值。同时，技术的使用也提醒我们，科技可以成为传统艺术的赋能工具，而非替代者。`,
      },
    },
  },
  artwork_2: {
    title: '机械舞蹈',
    critiques: {
      '苏轼': {
        title: '机械舞蹈',
        personaId: '苏轼',
        artworkId: 'artwork_2',
        content: `机械的舞动展现了一种新的"韵律"。传统文人艺术讲究"意趣"，而这件作品通过精密的机械运动，创造了一种理性与诗意的完美结合。LED投影的光线如同历代画家笔下的烟云，为机械运动添加了灵性。

这让我想到《易经》中"一动一静，互为其根"的哲学。机械的规律性运动与光线的柔和变化形成了对话，在这个过程中，观众感受到了宇宙运行的节奏。艺术家不仅展现了机械的力量，更重要的是赋予了它以灵魂。`,
      },
      '郭熙': {
        title: '机械舞蹈',
        personaId: '郭熙',
        artworkId: 'artwork_2',
        content: `从山水画的"三远法"来看，这件作品创造了一个动态的空间体验。机械臂在LED光线中的运动轨迹定义了一个三维的视觉场景，观众的视线随着机械臂的舞动而流转，就像在山水中游历一样。

机械的运动模式遵循了自然规律。正如自然界中的风吹树动、水流山石般的和谐，这件作品中机械臂的每一次转动都在创造一个新的"山水"。光影与运动的结合使得整个作品具有了生命的活力，这是对自然美学的深刻理解。`,
      },
      '约翰罗斯金': {
        title: '机械舞蹈',
        personaId: '约翰罗斯金',
        artworkId: 'artwork_2',
        content: `The mechanical dance reveals the inherent beauty within industrial forms. The precision of the robotic arm's movement, combined with the organic quality of the LED projections, creates a profound meditation on the relationship between human and machine.

The work shows masterful craftsmanship in its execution. Every movement is choreographed with an understanding of spatial relationships and visual harmony. The light projections enhance rather than dominate the mechanical forms, allowing the viewer to appreciate both the technological achievement and the aesthetic composition. This is truly modern art that honors the beauty of functional design.`,
      },
      '佐拉妈妈': {
        title: '机械舞蹈',
        personaId: '佐拉妈妈',
        artworkId: 'artwork_2',
        content: `这件作品是对工业文明的一种深刻反思。机械臂原本是生产线上的工具，而艺术家将其解放，赋予其舞蹈的自由。这个转变本身就具有社会意义：从工具性到审美性的转变，从被控制到获得自主的象征。

LED投影的加入进一步强化了这种解放的主题。光线柔软而温暖，而机械的金属外壳冷硬而理性，两者的对比揭示了现代社会的矛盾与张力。观众观看这场"舞蹈"时，实际上是在见证机械的人性化，这是对技术社会的批判性审视。`,
      },
      '埃琳娜佩特洛娃': {
        title: '机械舞蹈',
        personaId: '埃琳娜佩特洛娃',
        artworkId: 'artwork_2',
        content: `从视觉构成的角度，这件作品展现了运动与静止、几何与有机形式的完美平衡。机械臂的每一个姿态都经过精心设计，形成了一个视觉和谐的序列。LED投影的色彩选择与机械运动的节奏相匹配，创造了一种视觉音乐。

艺术家对形式的掌控达到了极高的水平。没有一个不必要的元素，每一根机械臂、每一束光线都在为整体的视觉表达服务。这种极简而精致的美学风格，反映了艺术家对当代美学的深刻理解。`,
      },
      'AI伦理评审员': {
        title: '机械舞蹈',
        personaId: 'AI伦理评审员',
        artworkId: 'artwork_2',
        content: `这件作品涉及有趣的人工智能和创意的关系问题。机械臂的编程决定了其"舞蹈"的每一个动作，这引发了一个问题：在完全由算法控制的系统中，我们如何定义艺术性？

然而，重点在于艺术家的意图。程序只是工具，艺术家通过精心编程，将其个人的审美和创意表现出来。这件作品向我们展示了，在人工智能时代，人类的创意和审美判断仍然是不可替代的。机械的执行力与人类的想象力相结合，创造了一个新的艺术可能性。`,
      },
    },
  },
  artwork_3: {
    title: '水墨与数据的对话',
    critiques: {
      '苏轼': {
        title: '水墨与数据的对话',
        personaId: '苏轼',
        artworkId: 'artwork_3',
        content: `这件作品代表了当代艺术的最高境界：传统与现代的完美融合。水墨是中国文化的精髓，而3D扫描数据代表了当代科技的前沿。两者的结合不是简单的拼凑，而是一种深层的对话。

水墨的意蕴与数据的精确性形成了一种美学的张力。传统的"笔墨当随时代"这一理念，在这件作品中得到了最好的诠释。艺术家不仅保留了水墨的灵性，还赋予了它新的表达方式。这是真正的创新——既尊重传统，又勇敢地拥抱未来。`,
      },
      '郭熙': {
        title: '水墨与数据的对话',
        personaId: '郭熙',
        artworkId: 'artwork_3',
        content: `从传统山水画论来看，这件作品实现了"可行可望可居可游"的多维体验。水墨笔触定义了构图的精神面貌，而3D数据扫描则为观众提供了沉浸式的空间体验。整个作品像是一个巨大的虚拟山水，邀请观众去探索。

这种新的表现方式深化了山水艺术的内涵。数据的引入不仅是技术应用，更是对空间认知的拓展。艺术家通过这种结合，使得古老的山水美学获得了新的生命力。这是一种对传统精神的最高敬礼。`,
      },
      '约翰罗斯金': {
        title: '水墨与数据的对话',
        personaId: '约翰罗斯金',
        artworkId: 'artwork_3',
        content: `This work represents a masterful synthesis of two seemingly incompatible worlds. The fluidity and spontaneity of ink wash painting, combined with the precision and objectivity of 3D scanning technology, create a rich and complex aesthetic experience.

The artist demonstrates a profound understanding of beauty in both traditions. The ink work shows the refined sensibility of a trained calligrapher, while the digital component reveals a sophisticated grasp of contemporary technology. The dialogue between these two elements is not forced but emerges naturally, creating a work that speaks to both the heart and the mind. This is truly visionary art.`,
      },
      '佐拉妈妈': {
        title: '水墨与数据的对话',
        personaId: '佐拉妈妈',
        artworkId: 'artwork_3',
        content: `这件作品呈现了一个关于文化民主化的强大叙事。水墨传统代表了精英文化，而数据代表了新兴的大众科技文化。它们的结合象征了阶级边界的模糊化。

更深层地说，这件作品质疑了对传统艺术的神圣化。通过将水墨与日常的数字技术相结合，艺术家暗示了传统文化不应该被尘封在博物馆中，而应该活在当代生活的脉搏里。这是对文化权力结构的温和颠覆，呼唤一种更加包容和民主的审美标准。`,
      },
      '埃琳娜佩特洛娃': {
        title: '水墨与数据的对话',
        personaId: '埃琳娜佩特洛娃',
        artworkId: 'artwork_3',
        content: `从视觉构成看，这件作品的复杂性令人印象深刻。水墨的有机流动与3D数据的几何秩序形成了强烈的视觉对比，这种对比本身就是艺术表达的核心。色彩的运用极其克制，黑白灰的层次变化创造了深度感。

整个作品的视觉语言具有高度的一致性。无论是墨迹的笔触还是数据的渲染，都服从于同一个美学原则。这种统一性中的多样性，体现了艺术家对形式的深刻理解。`,
      },
      'AI伦理评审员': {
        title: '水墨与数据的对话',
        personaId: 'AI伦理评审员',
        artworkId: 'artwork_3',
        content: `这件作品提出了一个深刻的问题：在数据驱动的时代，我们如何保护人文精神？3D扫描数据的使用可能会引发关于隐私和数据所有权的思考，但这位艺术家巧妙地将其转化为一个美学对话。

艺术家的选择是负责任的。他没有用数据替代传统艺术形式，而是让两者相互补充。这体现了一种伦理的自觉：技术应该服务于人类的创意，而不是相反。这件作品提醒我们，在追求技术进步的同时，要保持对人类文化遗产的尊重。`,
      },
    },
  },
  artwork_4: {
    title: '光线的诗学',
    critiques: {
      '苏轼': {
        title: '光线的诗学',
        personaId: '苏轼',
        artworkId: 'artwork_4',
        content: `光本身就是诗歌。这件作品通过激光投影与镜面反射，创造了一个充满诗意的光影世界。艺术家用光来书写，每一束激光就是一个字，每一次反射就是一个韵脚。

这让我想起古人所说的"光风霁月"，用来形容品德高洁的人。这件作品中的光线就具有这样的品质：纯净、高远、充满精神力量。观众在欣赏这件作品时，不仅看到了物理意义上的光，更体验到了光所承载的精神内涵。这是真正的诗意的艺术表达。`,
      },
      '郭熙': {
        title: '光线的诗学',
        personaId: '郭熙',
        artworkId: 'artwork_4',
        content: `从山水画的氛围法来看，光线是最重要的表现元素。艺术家通过激光投影创造了一个动态的"气"的流动。镜面的反射模拟了水面的明亮与清澈，激光线条如同远山的轮廓。

整个作品在虚实之间达到了完美的平衡。激光的光束既是实体的，又是虚幻的；镜面既反射光线，又制造了空间的深度幻觉。这种虚实相生的美学原理，正是山水画传统中最核心的艺术法则。艺术家用现代技术诠释了古老的美学智慧。`,
      },
      '约翰罗斯金': {
        title: '光线的诗学',
        personaId: '约翰罗斯金',
        artworkId: 'artwork_4',
        content: `Light is the first principle of all beauty, and this work is a magnificent testament to that principle. The artist has stripped away all extraneous elements to focus purely on the poetry of light itself. The precision of the laser technology ensures that every ray of light fulfills its intended purpose with absolute clarity.

The use of mirrors introduces a meditative quality to the work. Light bounces and reflects, creating patterns that are both mathematical and organic. The viewer becomes aware of their own position in relation to the light, creating a personal and introspective experience. This is aesthetic philosophy made visible.`,
      },
      '佐拉妈妈': {
        title: '光线的诗学',
        personaId: '佐拉妈妈',
        artworkId: 'artwork_4',
        content: `这件作品以一种诗意的方式探讨了可见性与权力的问题。光线象征了知识和启蒙，而镜面的反射表现了观众与艺术之间的相互凝视。没有观众，这件作品就无法完成；观众的位置和视角决定了他们所看到的光影图案。

这种互动性具有深刻的社会意义。它颠覆了传统艺术中艺术家与观众的单向关系，建立了一种平等的、相互确认的关系。观众不再仅仅是消费审美的人，而是艺术创造的参与者。`,
      },
      '埃琳娜佩特洛娃': {
        title: '光线的诗学',
        personaId: '埃琳娜佩特洛娃',
        artworkId: 'artwork_4',
        content: `从形式主义的角度，这件作品展现了极端的纯粹性。所有的视觉元素——光、线条、空间——都被简化到最基本的单位，然后通过精确的组合创造出复杂的视觉体验。这是对极简主义美学的深化。

激光线条的直线性与镜面反射的有机性形成了引人注目的对比。整个作品散发出一种冷静而理性的美，同时又保持了一种神秘的、难以定义的诗意。这种矛盾的统一，是这件作品最吸引人的地方。`,
      },
      'AI伦理评审员': {
        title: '光线的诗学',
        personaId: 'AI伦理评审员',
        artworkId: 'artwork_4',
        content: `这件作品在技术伦理方面提出了一个有趣的案例。激光技术是精密的、危险的，但艺术家用它来创造纯粹的审美体验。这表明，危险的技术本身是中立的，关键在于使用者的意图。

从可及性的角度看，这件作品展现了开放的精神。光线是无处不在的，任何人都可以通过改变自己的位置来改变观看方式。这种民主化的美学体验与技术伦理的自觉相结合，创造了一个负责任的艺术范例。`,
      },
    },
  },
};

// Make globally accessible
window.CritiqueData = CritiqueData;
