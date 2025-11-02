# Guide: Writing Critiques with Image References

Complete guide for writing critiques that reference specific images in multi-image artworks using the `[img:id]` syntax.

**Last Updated**: 2025-11-02
**For**: Content editors, curators, critique authors

---

## Overview

The VULCA platform now supports **hybrid critiques** that can reference specific images within an artwork's image series. This allows critics to point readers to specific visual elements while discussing the artwork, creating a richer, more interactive reading experience.

---

## Quick Reference

### Basic Syntax

```
[img:image-id]
```

### Example

```
如[img:img-1-3]所示，机械臂的动作充满诗意，展现了人机协作的独特魅力。
```

**Renders as**:
> 如<a href="#">图片3</a>所示，机械臂的动作充满诗意，展现了人机协作的独特魅力。

*(Clicking "图片3" navigates the carousel to that image)*

---

## Image Reference Syntax

### Format

The image reference syntax follows this pattern:

```
[img:{artwork-id}-{sequence}]
```

**Components**:
- `[img:` - Opening tag
- `{artwork-id}` - Number matching the artwork (1, 2, 3, etc.)
- `-{sequence}` - Image sequence number (1, 2, 3, etc.)
- `]` - Closing tag

### Valid Examples

```
[img:img-1-1]  ✅ Artwork 1, Image 1
[img:img-1-5]  ✅ Artwork 1, Image 5
[img:img-2-3]  ✅ Artwork 2, Image 3
[img:img-4-7]  ✅ Artwork 4, Image 7
```

### Invalid Examples

```
[img:1-3]      ❌ Missing "img-" prefix
[img:img1-3]   ❌ Missing hyphen after "img"
[img:img-1]    ❌ Missing sequence number
img-1-3        ❌ Missing brackets
[image:img-1-3] ❌ Wrong keyword (must be "img")
```

---

## Finding Image IDs

### Method 1: Check `data.js`

Open `js/data.js` and look for the artwork's `images` array:

```javascript
{
  id: "artwork-1",
  titleZh: "记忆（绘画操作单元：第二代）",
  images: [
    {
      id: "img-1-1",  // ← Use this ID
      titleZh: "初步概念草图",
      category: "sketch",
      sequence: 1
    },
    {
      id: "img-1-2",  // ← Or this ID
      titleZh: "机器学习训练过程",
      category: "process",
      sequence: 2
    }
    // ... more images
  ]
}
```

### Method 2: Use the Image Count

If artwork has 6 images, valid IDs are:
- `img-{artwork-num}-1` through `img-{artwork-num}-6`

Example for artwork-1 with 6 images:
- `img-1-1`, `img-1-2`, `img-1-3`, `img-1-4`, `img-1-5`, `img-1-6`

---

## Writing Effective Critiques

### Best Practices

#### ✅ DO

1. **Reference at key moments**
   ```
   如[img:img-1-3]所示，艺术家与机械臂的协作展现了一种新的创作可能性。
   ```

2. **Provide context before referencing**
   ```
   在创作过程中，机器学习系统需要大量训练。[img:img-1-2]记录了这个训练过程，
   展示了机械臂如何逐步学习艺术家的笔触风格。
   ```

3. **Reference multiple images to tell a story**
   ```
   从[img:img-1-1]的初步概念，到[img:img-1-5]的最终作品，我们可以看到
   人机协作创作的完整演变过程。
   ```

4. **Use sparingly** (2-4 references per critique is ideal)

#### ❌ DON'T

1. **Don't overuse references**
   ```
   ❌ [img:img-1-1]展示了[img:img-1-2]与[img:img-1-3]的关系，而[img:img-1-4]...
   ```
   *Too many references make text hard to read*

2. **Don't reference non-existent images**
   ```
   ❌ 如[img:img-1-99]所示...
   ```
   *This will trigger a console warning and display as plain text*

3. **Don't use references as a substitute for description**
   ```
   ❌ 见[img:img-1-3]。
   ```
   *Always provide context and commentary*

4. **Don't break the reading flow**
   ```
   ❌ 此作品[img:img-1-1]展现了[img:img-1-2]的特点...
   ```
   *References should feel natural, not disruptive*

---

## Complete Example

### Sample Critique (Chinese)

```
如[img:img-1-1]所示，此作品展现了笔墨与机器的对话。机械臂如同现代文人画家之手，
却失却了心意的指引。观此作，我感悟到真正的艺术不在技法之精妙，而在意趣之深邃。

我曾言，笔墨之道源于心意。书画本为心志的映照，每一笔的顿挫、轻重、疾徐都承载着
书者的精神境界。[img:img-1-1]虽以机械成就，其灵魂却在问一个古老的问题：艺术的
本质究竟是什么？是神妙的手法，抑或深邃的心境？

从[img:img-1-2]的训练过程到[img:img-1-5]的最终呈现，我们看到了一个探索的历程。
这种关于记忆、意趣与创作的思辨，值得我们最深刻的沉思。
```

**Extracted References**: `["img-1-1", "img-1-2", "img-1-5"]`

**Rendered Result**:
> 如<a href="#">图片1</a>所示，此作品展现了笔墨与机器的对话...

---

## Validation and Testing

### Automatic Validation

The system automatically validates all image references when the page loads:

**Valid Reference**:
```
✓ Reference found: img-1-3 → "Human-Machine Collaborative Drawing"
✓ Link created successfully
```

**Invalid Reference**:
```
⚠ Invalid image reference: img-1-99 not found in artwork-1
⚠ Displaying original syntax without link
```

### Manual Testing

1. **Add your critique** to `js/data.js`:
   ```javascript
   {
     artworkId: "artwork-1",
     personaId: "your-persona-id",
     textZh: "如[img:img-1-3]所示，作品展现了...",
     textEn: "As shown in [img:img-1-3], the work demonstrates...",
     rpait: { R: 8, P: 9, A: 7, I: 8, T: 6 }
   }
   ```

2. **Load the test page**: `http://localhost:9999/test-data-enrichment.html`

3. **Check console** for validation results:
   ```
   [Data] ✓ your-persona-id → artwork-1: 1 reference(s) ["img-1-3"]
   ```

4. **Verify on main page**: References should render as clickable links

---

## Advanced Usage

### Referencing the Same Image Multiple Times

It's okay to reference the same image multiple times:

```
如[img:img-1-1]所示，此作品...
...
再观[img:img-1-1]，我们发现...
```

The system will deduplicate automatically:
```javascript
critique.imageReferences = ["img-1-1"]  // Only stored once
```

### Bilingual References

You can use different references in Chinese and English text:

```javascript
{
  textZh: "如[img:img-1-3]所示，机械臂的动作...",
  textEn: "As shown in [img:img-1-5], the robotic motion..."
}
```

**Result**: Both `img-1-3` and `img-1-5` will be in `imageReferences` array.

### Conditional References

Only reference images that truly enhance understanding:

**Good**:
```
在创作的关键时刻，[img:img-1-3]捕捉到了艺术家与机械臂同步绘画的瞬间，
这个画面完美诠释了人机协作的本质。
```

**Not necessary**:
```
这件作品很有趣。[img:img-1-1]。
```

---

## Troubleshooting

### Problem: Reference not rendering as link

**Possible Causes**:
1. Image ID doesn't exist in artwork
2. Syntax error (missing brackets, wrong format)
3. `critique-parser.js` not loaded

**Solution**:
1. Check image ID in `data.js`
2. Verify syntax: `[img:img-X-Y]`
3. Load test page to see console errors

### Problem: Console warning about invalid reference

**Example Warning**:
```
⚠ Invalid image reference: img-1-99 not found in artwork artwork-1
```

**Solution**:
1. Check available images in `data.js`
2. Update reference to valid ID
3. Reload page to clear warning

### Problem: imageReferences array is empty

**Possible Causes**:
1. No `[img:id]` syntax in text
2. All references are invalid
3. `CritiqueParser` not loaded before `data.js`

**Solution**:
1. Add `[img:id]` to critique text
2. Validate image IDs
3. Check script load order in HTML

---

## Quick Checklist

Before submitting a critique with image references:

- [ ] All `[img:id]` syntax is correct (no typos)
- [ ] All referenced image IDs exist in the artwork
- [ ] References enhance understanding (not excessive)
- [ ] Tested on local server (`http://localhost:9999`)
- [ ] No console warnings about invalid references
- [ ] Links render correctly and navigate carousel
- [ ] Both Chinese and English text use appropriate references

---

## Reference Images by Category

When writing critiques, consider referencing images by their category:

| Category | When to Reference | Example |
|----------|-------------------|---------|
| **Sketch** | Discussing initial concepts, artistic vision | "从[img:X-1]的草图可见，艺术家最初的构思..." |
| **Process** | Explaining creation methodology, development | "在[img:X-2]的创作过程中，我们看到..." |
| **Installation** | Describing exhibition context, spatial relationships | "[img:X-6]展示了作品在展览空间的呈现..." |
| **Detail** | Analyzing technical aspects, close examination | "细看[img:X-4]，我们能观察到精密的机械结构..." |
| **Final** | Overall impression, completed work | "最终作品[img:X-5]完美地实现了..." |
| **Context** | Supplementary information, background | "[img:X-7]的艺术家陈述揭示了..." |

---

## Related Documentation

- **Technical Spec**: `openspec/changes/implement-multi-image-artwork-series/specs/hybrid-critique-system/spec.md`
- **Data Entry Guide**: `docs/ADDING_ARTWORKS.md`
- **Developer Guide**: `CLAUDE.md`
- **Project Overview**: `README.md`

---

## Examples from Existing Critiques

### Su Shi on Artwork-1

```
如[img:img-1-1]所示，此作品展现了笔墨与机器的对话。机械臂如同现代文人画家之手，
却失却了心意的指引。

...

[img:img-1-1]虽以机械成就，其灵魂却在问一个古老的问题：艺术的本质究竟是什么？
```

**imageReferences**: `["img-1-1"]`

### Guo Xi on Artwork-1

```
从山水画的传统审视，[img:img-1-1]以现代技术重新诠释了笔墨线条的本质。

...

观[img:img-1-1]，我发现机械系统虽然初衷并非山水创作，却在无意中阐释了线条的基本原理。
```

**imageReferences**: `["img-1-1"]`

---

## Need Help?

- Check existing critiques in `js/data.js` for examples
- Use test pages: `test-critique-parser.html`, `test-data-enrichment.html`
- See `CLAUDE.md` for developer guidance
- Contact: info@vulcaart.art

---

**Happy critiquing! 📝**
