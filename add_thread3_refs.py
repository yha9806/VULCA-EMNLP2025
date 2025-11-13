#!/usr/bin/env python3
"""
Script to add knowledge base references to Thread 3 messages in artwork-1.js
"""

import re

# Read the file
with open('js/data/dialogues/artwork-1.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Define references for each message
refs = {
    "msg-artwork-1-3-1": '''        references: [
          {
            critic: "guo-xi",
            source: "landscape-theory.md",
            quote: "笔简形具",
            page: "Quote 25: Spontaneity and Control"
          },
          {
            critic: "guo-xi",
            source: "landscape-theory.md",
            quote: "饱游饫看，历历罗列于胸中，而目不见绢素，手不知笔墨",
            page: "Quote 24: Learning from Nature"
          },
          {
            critic: "guo-xi",
            source: "landscape-theory.md",
            quote: "若能会心远至，则画无微不妙",
            page: "Quote 23: Observation Before Painting"
          }
        ]''',

    "msg-artwork-1-3-2": '''        references: [
          {
            critic: "john-ruskin",
            source: "art-and-morality.md",
            quote: "The Gothic style permits and even demands the freedom, individuality, and spontaneity of its workers",
            page: "Quote 6: The Nature of Gothic"
          },
          {
            critic: "john-ruskin",
            source: "art-and-morality.md",
            quote: "Imperfections in craftsmanship are integral to its genuine expression",
            page: "Quote 8: Imperfections as Integrity"
          }
        ]''',

    "msg-artwork-1-3-3": '''        references: [
          {
            critic: "mama-zola",
            source: "griot-aesthetics-oral-tradition.md",
            quote: "Through listening and memorization, griots in training must learn the knowledge, stories, and repertoire of their people",
            page: "Reference 7: Training Through Memorization and Listening"
          },
          {
            critic: "mama-zola",
            source: "griot-aesthetics-oral-tradition.md",
            quote: "Spiral time refers to curved and recurrent temporalities materialized in Black corporealities in which the body is the place of the inscription of memory and knowledge",
            page: "Reference 12: Spiral Time"
          },
          {
            critic: "mama-zola",
            source: "griot-aesthetics-oral-tradition.md",
            quote: "Our bodies remember what our minds forget. The artist's hand carries grandmother's hand",
            page: "Reference 13: Ancestral Memory and Epigenetics"
          }
        ]''',

    "msg-artwork-1-3-4": '''        references: [
          {
            critic: "guo-xi",
            source: "landscape-theory.md",
            quote: "山水之境，即心之境",
            page: "Quote 22: Landscape as Mirror of the Heart"
          },
          {
            critic: "guo-xi",
            source: "landscape-theory.md",
            quote: "山水之道，化工也",
            page: "Quote 26: Dao and Nature"
          }
        ]''',

    "msg-artwork-1-3-5": '''        references: [
          {
            critic: "john-ruskin",
            source: "art-and-morality.md",
            quote: "The artist has a moral duty to display the actual truth",
            page: "Quote 1: The Artist's Moral Duty"
          },
          {
            critic: "john-ruskin",
            source: "art-and-morality.md",
            quote: "Art should present things not as they are in themselves but as they appear to mankind",
            page: "Quote 12: Phenomenological Truth"
          },
          {
            critic: "john-ruskin",
            source: "art-and-morality.md",
            quote: "Do not lie. Architecture must honestly express its structure and materials",
            page: "Quote 16: The Lamp of Truth"
          }
        ]'''
}

# For each message, add references before the closing brace
for msg_id, ref_block in refs.items():
    # Pattern: find the message ID, then find its interactionType line, and add references after it
    pattern = r'(id: "' + msg_id + r'".*?interactionType: "[^"]+")(\s*\})'

    def replacer(match):
        return match.group(1) + ',\n' + ref_block + '\n      }'

    content = re.sub(pattern, replacer, content, flags=re.DOTALL)

# Write back
with open('js/data/dialogues/artwork-1.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("[OK] Successfully added references to Thread 3 messages")
print("  - msg-artwork-1-3-1: 3 references (Guo Xi)")
print("  - msg-artwork-1-3-2: 2 references (Ruskin)")
print("  - msg-artwork-1-3-3: 3 references (Mama Zola)")
print("  - msg-artwork-1-3-4: 2 references (Guo Xi)")
print("  - msg-artwork-1-3-5: 3 references (Ruskin)")
