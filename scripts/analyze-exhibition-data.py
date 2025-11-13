#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
分析展览数据脚本
从提取的PPT内容中识别艺术家和作品信息
"""

import json
import re
from collections import defaultdict

def extract_artwork_info(text):
    """
    从文本中提取作品信息
    格式: 艺术家姓名《作品名称》
    """
    # 匹配模式: 姓名《作品名》 或 姓名、姓名《作品名》
    patterns = [
        r'([^《]+)《([^》]+)》',  # 基本模式
        r'([^《]+)、([^《]+)《([^》]+)》',  # 两位艺术家
        r'([^《]+)、([^《]+)、([^《]+)《([^》]+)》',  # 三位艺术家
    ]

    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            groups = match.groups()
            if len(groups) == 2:
                return {
                    'artists': [groups[0].strip()],
                    'title': groups[1].strip()
                }
            elif len(groups) == 3:
                return {
                    'artists': [groups[0].strip(), groups[1].strip()],
                    'title': groups[2].strip()
                }
            elif len(groups) == 4:
                return {
                    'artists': [groups[0].strip(), groups[1].strip(), groups[2].strip()],
                    'title': groups[3].strip()
                }
    return None

def main():
    json_path = r"I:\VULCA-EMNLP2025\scripts\ppt-extracted-content.json"

    print("正在分析展览数据...\n")

    with open(json_path, 'r', encoding='utf-8') as f:
        slides = json.load(f)

    # 提取展览标题
    exhibition_title = None
    if slides[0]['content']['texts']:
        exhibition_title = slides[0]['content']['texts'][0]

    print(f"展览名称: {exhibition_title}\n")
    print("=" * 80)

    # 提取所有作品信息
    artworks = []
    institutions = {}
    current_institution = None

    for slide in slides:
        texts = slide['content']['texts']
        if not texts:
            continue

        for text in texts:
            # 检查是否是学院名称（通常单独成行）
            if '学院' in text or '大学' in text:
                if len(text.strip()) < 20 and '\n' not in text:
                    current_institution = text.strip()
                    if current_institution not in institutions:
                        institutions[current_institution] = []
                continue

            # 提取作品信息
            artwork_info = extract_artwork_info(text)
            if artwork_info:
                artwork_info['institution'] = current_institution
                artwork_info['slide_number'] = slide['slide_number']
                artwork_info['has_images'] = len(slide['content']['images']) > 0
                artwork_info['image_count'] = len(slide['content']['images'])
                artworks.append(artwork_info)

                if current_institution:
                    institutions[current_institution].append(artwork_info)

    # 输出结果
    print(f"\n共找到 {len(artworks)} 件作品\n")

    # 按学院分组输出
    for institution, works in institutions.items():
        if works:
            print(f"\n【{institution}】 ({len(works)} 件作品)")
            print("-" * 80)
            for work in works:
                artists_str = "、".join(work['artists'])
                print(f"  - {artists_str}: {work['title']}")
                print(f"    Slide #{work['slide_number']} | Images: {work['image_count']}")

    # 输出独立艺术家
    independent_works = [w for w in artworks if not w['institution']]
    if independent_works:
        print(f"\n【独立艺术家】 ({len(independent_works)} 件作品)")
        print("-" * 80)
        for work in independent_works:
            artists_str = "、".join(work['artists'])
            print(f"  - {artists_str}: {work['title']}")
            print(f"    Slide #{work['slide_number']} | Images: {work['image_count']}")

    # 保存结构化数据
    output_data = {
        'exhibition_title': exhibition_title,
        'total_artworks': len(artworks),
        'institutions': {inst: [
            {
                'artists': w['artists'],
                'title': w['title'],
                'slide_number': w['slide_number'],
                'image_count': w['image_count']
            }
            for w in works
        ] for inst, works in institutions.items() if works},
        'independent_artworks': [
            {
                'artists': w['artists'],
                'title': w['title'],
                'slide_number': w['slide_number'],
                'image_count': w['image_count']
            }
            for w in independent_works
        ]
    }

    output_path = r"I:\VULCA-EMNLP2025\scripts\exhibition-artworks-structured.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"\n\n[OK] 结构化数据已保存到: {output_path}")

    # 输出统计信息
    print("\n" + "=" * 80)
    print("统计信息:")
    print(f"  参展学院/机构: {len([i for i, w in institutions.items() if w])} 个")
    print(f"  参展艺术家: {len(set([a for w in artworks for a in w['artists']]))} 位")
    print(f"  作品总数: {len(artworks)} 件")
    print(f"  有图片的作品: {len([w for w in artworks if w['has_images']])} 件")

if __name__ == "__main__":
    main()
