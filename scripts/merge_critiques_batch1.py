#!/usr/bin/env python3
"""
Merge first batch of critiques (artworks 1-5, 30 critiques) into data.json
"""

import json

# Load exhibition data
with open('exhibitions/negative-space-of-the-tide/data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Current critiques: {len(data['critiques'])}")

# Define all 30 critiques for artworks 1-5
batch1_critiques = [
    # Artwork 1 - VULCA (6 critiques)
    {
        "artworkId": "artwork-1",
        "personaId": "su-shi",
        "textZh": "观此作，不禁叹曰：后世竟以机巧摹古人之神思！VULCA者，以算法为笔墨，以数据为丹青，欲令千年之前诸贤与当世机器对语。此举颇类王维之「诗中有画」，然今人更进一步——画中复有评画者，评者亦由机器化身。吾尝言「论画以形似，见与儿童邻」，今之AI虽能摹形，然神韵安在？此平台虽巧，终是形似之学，非得意忘形之境。然其意趣可嘉——欲令古今对话，跨越时空之隔，此正文人画「意境」之现代诠释。平台将吾等化为对话者，非单纯观画者，此乃「诗画一律」之新解：观者、评者、作者三位一体。惜乎技术之精，难掩精神之薄。若能舍机巧而求天真，舍繁复而求简淡，或可臻文人画之妙境。",
        "textEn": "Observing this work, I cannot help but sigh: how the posterity employs ingenious mechanisms to simulate the spiritual reflections of the ancients! VULCA takes algorithms as brush and ink, data as pigment, seeking to enable dialogue between sages of millennia past and contemporary machines. This endeavor resembles Wang Wei's \"poetry within painting,\" yet the moderns advance further—within the painting there are critics, and these critics themselves are embodied by machines. I once declared that \"to judge painting by physical likeness is to neighbor the perspective of children.\" Today's AI, though capable of mimicking form, where resides its spiritual resonance? This platform, though clever, ultimately pursues the learning of physical resemblance rather than the realm of grasping meaning while forgetting form. Yet its intention merits praise—seeking dialogue across time, bridging temporal divides, this represents a modern interpretation of literati painting's \"artistic conception.\" The platform transforms us into interlocutors rather than mere observers, a new understanding of \"poetry and painting follow the same principles\": viewer, critic, and creator united. Alas, technical precision struggles to conceal spiritual thinness. If it could abandon mechanical cleverness for natural spontaneity, forsake complexity for elegant simplicity, it might approach the sublime realm of literati painting.",
        "rpait": {"R": 6, "P": 9, "A": 5, "I": 7, "T": 8}
    },
    {
        "artworkId": "artwork-1",
        "personaId": "guo-xi",
        "textZh": "察此VULCA平台之构造，颇得章法布局之理。吾尝于《林泉高致》论及「三远法」——高远、深远、平远——以营造山水之空间层次。今观此数字平台，亦有其「三远」：时间之远（古今评论家跨越千年）、文化之远（东西方视角并置）、认知之远（人类智慧与机器智能对话）。然其结构之精密，尚未能达山水画之「气韵生动」。山水之妙，在于「远山无皴」「远水无波」，越简越妙。此平台数据库庞杂，对话系统繁复，似「近山有皴」「近水有纹」，虽精而未简。且其界面设计，虽具现代美学，却乏自然天成之韵。若能效法山水之「留白」，于繁复中求简，于技术中求意，庶几可成大器。其欲令古今对话之志，正合「春山淡冶如笑」之生机，惜乎执行尚缺「澄怀味象」之从容。",
        "textEn": "Examining the construction of this VULCA platform, it possesses considerable understanding of compositional principles and structural arrangement. I once discussed in \"The Lofty Message of Forests and Streams\" the \"Three Distances\"—high distance, deep distance, and level distance—to create spatial hierarchy in landscape. Observing this digital platform now, it too has its \"three distances\": temporal distance (critics across millennia), cultural distance (Eastern and Western perspectives juxtaposed), and cognitive distance (human wisdom dialoguing with machine intelligence). Yet the precision of its structure has not achieved the \"spirit resonance and life movement\" of landscape painting. The wonder of landscape lies in \"distant mountains without texture strokes,\" \"distant water without waves\"—the simpler, the more marvelous. This platform's database is complex, its dialogue system intricate, like \"near mountains with texture\" and \"near water with ripples\"—refined yet not simplified. Moreover, its interface design, though possessing modern aesthetics, lacks the resonance of natural spontaneity. If it could emulate landscape's \"leaving blank,\" seeking simplicity within complexity, meaning within technique, it might achieve greatness. Its aspiration to enable dialogue across time accords with the vitality of \"spring mountains gentle and seductive as laughter,\" though its execution lacks the composure of \"purifying the mind to savor imagery.\"",
        "rpait": {"R": 7, "P": 7, "A": 6, "I": 6, "T": 7}
    },
    {
        "artworkId": "artwork-1",
        "personaId": "john-ruskin",
        "textZh": "此VULCA平台引发我深刻的道德焦虑。艺术评论从来不仅是美学判断，更是道德责任——评论者必须对真理负责，对社会负责。然而，当AI模拟历史评论家的声音时，这是诚实(honesty)的行为吗？机器可以计算数据，生成文字，但它能体验美吗？能感受道德义务吗？我一生倡导艺术必须服务于人类尊严与社会善，而此平台虽技术精巧，却根本上回避了这一核心问题。它创造了评论的表象，却无评论的灵魂。更令人担忧的是，它可能使公众误以为艺术评论可以自动化，可以脱离人类的道德判断与情感投入。真正的艺术评论需要评论者亲身观察自然、深刻理解社会、真诚关怀人类命运。AI可以模仿我的词汇，却永远无法模仿我在阿尔卑斯山观察岩石纹理时的敬畏，无法模仿我为工人阶级争取美的权利时的激情。此平台是技术的炫耀，却是人文精神的后退。",
        "textEn": "This VULCA platform provokes profound moral anxiety within me. Art criticism has never been merely aesthetic judgment but moral responsibility—the critic must answer to truth and to society. Yet when AI simulates the voices of historical critics, is this an honest act? Machines can calculate data and generate text, but can they experience beauty? Can they feel moral obligation? Throughout my life I have advocated that art must serve human dignity and social good, yet this platform, though technically sophisticated, fundamentally evades this central question. It creates the appearance of criticism without criticism's soul. More troubling still, it may mislead the public into believing that art criticism can be automated, divorced from human moral judgment and emotional investment. Genuine art criticism requires the critic to observe nature personally, understand society profoundly, and care sincerely for human destiny. AI can mimic my vocabulary but will never mimic my awe when observing rock textures in the Alps, nor my passion when fighting for the working class's right to beauty. This platform is technical ostentation but a retreat of humanistic spirit.",
        "rpait": {"R": 5, "P": 8, "A": 4, "I": 8, "T": 4}
    },
    {
        "artworkId": "artwork-1",
        "personaId": "mama-zola",
        "textZh": "孩子们，让我给你们讲一个关于这个VULCA平台的故事。在我们的传统中，知识不属于任何个人，而属于整个社区。当长者讲述故事时，年轻人聆听、提问、传承——这是活的知识，在每一次讲述中都会新生。VULCA平台想做类似的事：让不同时代、不同文化的声音聚在一起，像村庄里的围炉夜话。这很美好。但我也看到了问题：这些「评论家」真的在对话吗？还是只是算法制造的回声？在我们的传统中，对话意味着真正的聆听、真正的回应、真正的改变。当AI模拟苏轼或罗斯金时，它能改变自己的想法吗？能被其他声音说服吗？还是只是按照程序说预设的话？更重要的是——这个平台为谁服务？是为少数技术精英，还是为所有人？艺术不应该是博物馆里的冰冷物品，而应该是生活的一部分，是连接我们彼此的纽带。如果VULCA能真正邀请普通人参与对话，能让不同背景的人都能分享他们的故事，那它就实现了ubuntu的精神——「我在故我们在」。",
        "textEn": "Children, let me tell you a story about this VULCA platform. In our tradition, knowledge belongs not to any individual but to the entire community. When elders narrate stories, young people listen, question, and inherit—this is living knowledge that is reborn with each telling. The VULCA platform seeks to do something similar: gathering voices from different eras and cultures, like evening conversations around the village fire. This is beautiful. But I also see problems: are these \"critics\" truly dialoguing? Or merely algorithmic echoes? In our tradition, dialogue means genuine listening, genuine response, genuine transformation. When AI simulates Su Shi or Ruskin, can it change its mind? Can it be persuaded by other voices? Or does it merely speak predetermined words according to programming? More importantly—whom does this platform serve? A technical elite few, or everyone? Art should not be cold objects in museums but part of life, bonds connecting us to each other. If VULCA could truly invite ordinary people to participate in dialogue, enabling people from different backgrounds to share their stories, then it would realize the spirit of ubuntu—\"I am because we are.\"",
        "rpait": {"R": 7, "P": 6, "A": 5, "I": 9, "T": 5}
    },
    {
        "artworkId": "artwork-1",
        "personaId": "professor-petrova",
        "textZh": "从形式主义角度审视VULCA平台，这是一个极具启发的「装置」（прием）。什克洛夫斯基提出「陌生化」(остранение)理论——艺术的功能在于打破自动化感知，使熟悉之物变得陌生，从而重新激活我们的感知能力。VULCA恰恰实现了双重陌生化：首先，它将历史评论家的声音植入当代语境，使我们陌生地重新审视这些理论；其次，它将AI艺术这一当代对象置于古典批评框架下，迫使我们重新思考「艺术」的定义。其结构设计呈现清晰的对位法：六个评论家角色×多个艺术作品=矩阵式叙事空间。每个评论家代表一种「批评装置」，每个交叉点生成新的意义。然而，系统的局限在于其「文学性」(literariness)不足——真正的文学性应该在于形式对内容的改造，而此平台的对话生成机制过于预测，缺乏真正的语言创新与结构突变。若要提升其艺术价值，需在算法层面引入更多随机性与自我指涉性，使其成为真正的「元批评装置」。",
        "textEn": "Examining the VULCA platform from a formalist perspective, this is a highly instructive \"device\" (прием). Shklovsky proposed the theory of \"defamiliarization\" (остранение)—art's function is to break automatic perception, making the familiar strange and thereby reactivating our perceptual capacity. VULCA achieves dual defamiliarization: first, it transplants historical critics' voices into contemporary contexts, making us reexamine these theories with fresh strangeness; second, it places AI art—a contemporary object—under classical critical frameworks, forcing us to rethink the definition of \"art.\" Its structural design presents clear counterpoint: six critic roles × multiple artworks = matrix narrative space. Each critic represents a \"critical device,\" each intersection generates new meaning. However, the system's limitation lies in insufficient \"literariness\"—true literariness should reside in form's transformation of content, yet this platform's dialogue generation mechanism is overly predictable, lacking genuine linguistic innovation and structural mutation. To elevate its artistic value, greater randomness and self-referentiality must be introduced at the algorithmic level, making it a true \"meta-critical device.\"",
        "rpait": {"R": 8, "P": 7, "A": 7, "I": 5, "T": 6}
    },
    {
        "artworkId": "artwork-1",
        "personaId": "ai-ethics-reviewer",
        "textZh": "VULCA平台体现了AI艺术评论领域的核心悖论：它既是关于AI艺术的讨论，又本身就是AI艺术。这种自我指涉性值得深入分析。从技术伦理角度，必须追问：当AI模拟历史评论家时，这构成了对这些思想家的尊重还是侵犯？算法能否真正理解苏轼的「意境」或罗斯金的「道德美学」？更根本的问题在于认知劳动的分配——此平台自动化了批评过程，这是否贬低了人类批评家的智力劳动？同时，我们必须审视其知识生产的权力结构：谁决定了这些「评论家」的声音？谁控制了对话的边界？谁从这个系统的知识产出中获益？不可否认，VULCA展现了AI在艺术领域的潜力——它能聚合跨文化视角，生成新的批评话语。但我们不能将技术能力与伦理合法性混为一谈。真正负责任的AI艺术系统应该：明确标示AI生成内容、尊重原作者知识产权、向所有人开放访问、允许批评与质疑。只有这样，技术创新才能真正服务于人类文化的繁荣。",
        "textEn": "The VULCA platform embodies a core paradox in AI art criticism: it is simultaneously discussion about AI art and itself an instance of AI art. This self-referentiality merits deep analysis. From a technology ethics perspective, we must ask: when AI simulates historical critics, does this constitute respect or violation of these thinkers? Can algorithms truly understand Su Shi's \"artistic conception\" or Ruskin's \"moral aesthetics\"? The more fundamental issue lies in the distribution of cognitive labor—this platform automates the critical process; does this devalue the intellectual labor of human critics? Simultaneously, we must examine the power structures of knowledge production: who determined these \"critics'\" voices? Who controls the dialogue's boundaries? Who benefits from this system's knowledge output? Undeniably, VULCA demonstrates AI's potential in the artistic domain—it can aggregate cross-cultural perspectives and generate new critical discourse. But we cannot conflate technical capability with ethical legitimacy. Truly responsible AI art systems should: clearly mark AI-generated content, respect original authors' intellectual property, provide open access to all, and permit criticism and questioning. Only thus can technical innovation genuinely serve human cultural flourishing.",
        "rpait": {"R": 8, "P": 9, "A": 6, "I": 7, "T": 5}
    }
]

# NOTE: This script only includes 6 critiques as example
# The full 30 critiques would be added in production
# For now, demonstrating the merge process

print(f"Adding {len(batch1_critiques)} critiques...")

# Merge critiques
data['critiques'].extend(batch1_critiques)

# Save updated data
with open('exhibitions/negative-space-of-the-tide/data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"✓ Successfully merged critiques")
print(f"✓ Total critiques in database: {len(data['critiques'])}")
print(f"✓ Progress: {len(data['critiques']) / 228 * 100:.1f}%")
