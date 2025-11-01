# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains two main components:

1. **VULCA Framework** (Python): A comprehensive evaluation framework for assessing MLLMs' cultural understanding through Chinese art critique (EMNLP 2025)
2. **Interactive Exhibition Platform** (Web): A bilingual art exhibition website showcasing Sougwen Chung's artworks with multi-perspective critiques from 6 cultural critic personas

## Repository Structure

```
I:\VULCA-EMNLP2025\
├── src/                    # Core Python VULCA framework
├── data/
│   ├── personas/           # 8 persona definitions (Markdown)
│   └── knowledge/          # Knowledge base (JSON)
├── configs/                # YAML configuration files
├── experiments/            # Evaluation scripts
├── vulca-exhibition/       # Interactive web platform (GitHub Pages)
│   ├── index.html         # Main landing page
│   ├── js/
│   │   ├── app.js         # Core application logic
│   │   └── data.js        # Embedded artwork/critique data
│   ├── styles/            # CSS modules
│   ├── data/              # Static JSON data (personas)
│   └── assets/            # Images and media
├── openspec/              # Specification-driven development docs
└── requirements.txt       # Python dependencies
```

## Key Architecture Patterns

### VULCA Framework (Python)
- **Facade Pattern**: Main `VULCA` class provides simplified interface to complex subsystems
- **Configuration-Driven Design**: All parameters in YAML/JSON for reproducibility
- **Modular Pipeline**: Preprocessing → Evaluation → Analysis → Reporting
- **API Abstraction Layer**: `MLLMInterface` base class with specific implementations (Qwen, Llama, Gemini)

### Exhibition Platform (Web)
- **Client-Side JavaScript**: No backend required, deployed on GitHub Pages
- **Embedded Data Architecture**: Artwork and critique data hardcoded in `js/data.js` to avoid CDN caching issues
- **State Management**: `AppState` object in `app.js` manages personas, artworks, critiques
- **CSS Modularization**: Separate stylesheets for variables, reset, layout, components, aesthetics, and responsive design
- **Bilingual Support**: All content duplicated with `_zh` suffix for Chinese versions

## Important Development Context

### Exhibition Platform Critical Notes

1. **Data Loading Strategy**:
   - Originally used JSON files, but GitHub Pages CDN caching (24+ hours) caused issues
   - **Solution**: All data embedded in `js/data.js` as `ExhibitionData` object
   - `app.js` loads from `ExhibitionData` instead of fetching JSON
   - `index.html` must load `data.js` BEFORE `app.js`

2. **Personas System**:
   - 6 personas with bilingual profiles (not 8 like Python framework)
   - Each persona has RPAIT weights: Representation (R), Philosophy (P), Aesthetics (A), Interpretation (I), Technique (T)
   - Currently hardcoded in `data/personas.json`

3. **Artworks & Critiques**:
   - 4 Sougwen Chung artworks showcased
   - 24 bilingual critiques (6 personas × 4 artworks)
   - Embedded in `js/data.js` as `ExhibitionData.critiques`

4. **Design Inspiration**:
   - Sougwen Chung aesthetic: minimalism, generous whitespace, organic animations
   - "潮汐的负形" (Tides of Negative Space) theme emphasizes process visibility

### Deployment Pipeline

1. **Local Development**:
   - Edit files in `vulca-exhibition/` directory
   - Use Playwright MCP for testing interactive features

2. **GitHub Push**:
   ```bash
   git add .
   git commit -m "..."
   git push
   ```

3. **GitHub Pages Deployment**:
   - Automatically deploys to https://vulcaart.art/ (CNAME configured)
   - Uses `main` branch (not `gh-pages`)

## Coding Conventions

### Python Code
- **Naming**: snake_case for functions, bilingual for domain-specific elements (e.g., `Su_Shi.md`)
- **Type Hints**: Used for clarity
- **Docstrings**: All public functions documented
- **Line Length**: ~100 characters target

### JavaScript Code
- **Naming**: camelCase for variables/functions, PascalCase for objects (AppState, ExhibitionData)
- **Modules**: Keep functionality separated by concern (data, rendering, state management)
- **Comments**: Document non-obvious logic, especially for DOM manipulation

### CSS
- **CSS Variables**: Defined in `styles/variables.css` for consistent theming
- **Methodology**: BEM-inspired naming with utilities in separate modules
- **Responsive**: Mobile-first approach, breakpoints defined in `responsive.css`
- **Bilingual Text**: Use `lang` attribute for proper typography

## Common Development Tasks

### Working with the Exhibition Platform

**Test Website Locally**:
- Use Playwright MCP to navigate and test: `await page.goto('https://vulcaart.art')`
- Check console messages with `browser_console_messages()`
- Take screenshots with `browser_take_screenshot()`

**Add New Artwork**:
1. Add artwork entry to `ExhibitionData.artworks` in `js/data.js`
2. Add 6 critique entries (one per persona) to `ExhibitionData.critiques`
3. Update persona weightings if needed

**Modify Design**:
- Update CSS variables in `styles/variables.css` (spacing, colors, fonts)
- Component styles in `styles/components.css`
- Layout in `styles/layout.css`

**Bilingual Content Updates**:
- Always provide both English and Chinese (with `_zh` suffix)
- Use language-appropriate typography for Chinese characters

### Working with the VULCA Framework

**Run Evaluation**:
```bash
python -c "
from src.vulca import VULCA
evaluator = VULCA('configs/model_config.yaml')
result = evaluator.evaluate_with_persona('image.jpg', 'Su_Shi')
print(result['critique'])
"
```

**Configure Models**:
- Edit YAML files in `configs/`
- Supports: Qwen2.5-VL-7B-Instruct (default), Llama, Gemini
- vLLM server must be running for local models

## Tools & Technologies

### Web Platform
- **Framework**: Vanilla JavaScript (no build step)
- **Deployment**: GitHub Pages
- **Testing**: Playwright MCP (browser automation)
- **Hosting**: Custom domain (vulcaart.art)

### Python Framework
- **Deep Learning**: PyTorch, Transformers, vLLM
- **Vision Language Models**: Qwen2.5-VL-7B, Llama, Gemini
- **Semantic Analysis**: sentence-transformers (BAAI/bge-large-zh-v1.5)
- **Image Processing**: OpenCV, scikit-image, Pillow
- **Data Processing**: pandas, numpy, scipy

## Critical Files

| File | Purpose |
|------|---------|
| `vulca-exhibition/js/data.js` | Embedded artwork/critique data (must load before app.js) |
| `vulca-exhibition/js/app.js` | Core application logic and state management |
| `vulca-exhibition/index.html` | Landing page and structure |
| `vulca-exhibition/styles/variables.css` | Global design tokens (colors, spacing, fonts) |
| `src/vulca.py` | Main VULCA framework facade |
| `configs/model_config.yaml` | Model configuration and hyperparameters |
| `data/personas/` | Persona definitions (8 personas) |

## GitHub Pages Deployment Notes

- **CDN Caching**: GitHub Pages caches files for 24+ hours
- **Workaround Used**: Embedded data in JavaScript instead of separate JSON files
- **Domain**: CNAME file points to vulcaart.art
- **Branch**: Uses `main` branch (not traditional `gh-pages`)

## OpenSpec Integration

This project uses OpenSpec for specification-driven development. When planning significant changes:
- Check `/openspec/AGENTS.md` for proposal format
- Review existing change proposals in `/openspec/changes/`
- Follow the structured change proposal process for major features

### Recent Changes

**Phase 1 Completion: Interactive Exhibition Platform Rebuild** (archived)
- Built complete vulcaart.art website with artwork-critique interaction
- Implemented 6 cultural critic personas with RPAIT analysis dimensions
- Deployed to GitHub Pages with custom domain
- Status: `rebuild-interactive-exhibition-platform` (archived via OpenSpec)

**Phase 2 Active: Exhibition Platform Content Simplification** (in-progress)
- **Change ID**: `simplify-exhibition-focus`
- **Status**: Implementation complete, deployed to production
- **Strategic Direction**: Transform from hybrid proposal-document to pure art exhibition platform
- **Key Changes**:
  - ✅ Removed all project planning documentation (budget tables, 4-week timeline, upgrade paths, risk control matrix)
  - ✅ Condensed "创作过程" (Creative Process) section by 60% (500 → 200 words)
  - ✅ Simplified "关于这个项目" (About) section from 4 paragraphs to 2 focused paragraphs
  - ✅ Embodied Sougwen Chung's "负形" (negative space) aesthetic through intentional content deletion
  - ✅ Maintained 5-section user journey: Hero → Exhibition → Personas → Process → About
  - ✅ Deployed and verified via Playwright MCP at https://vulcaart.art

**Implementation Details**
- **Files Modified**:
  - `vulca-exhibition/index.html` (main content deletions, ~2000+ chars removed)
  - `vulca-exhibition/styles/components.css` (cleanup of orphaned styles)
  - `vulca-exhibition/styles/layout.css` (cleanup of deleted section layouts)

- **Content Reduction**:
  - Overall page word count: -30% to -40%
  - HTML size: ~45 KB → ~28 KB (-38%)
  - Sections: 8 → 5 (major planning sections removed)

- **Aesthetic Philosophy**:
  - Deletion IS design: absence communicates intent
  - Negative space principle: what's *not* shown defines what *is* important
  - User experience: linear, undistracted, meditative flow

## Development Workflow for Future Changes

When implementing new features or changes:

1. **Proposal Phase**: Create `/openspec/changes/[change-id]/proposal.md`
   - Strategic rationale
   - Problem statement
   - What changes (detailed list)
   - Success criteria
   - Risk mitigation

2. **Specification Phase**: Create `/openspec/changes/[change-id]/specs/`
   - Technical requirements with MUST/SHALL keywords
   - Scenarios with Given/When/Then structure
   - Acceptance criteria

3. **Design Phase**: Create `/openspec/changes/[change-id]/design.md`
   - Design philosophy alignment
   - Visual/interaction changes
   - Accessibility considerations
   - Performance impact

4. **Task Breakdown**: Create `/openspec/changes/[change-id]/tasks.md`
   - Phased task structure
   - Numbered checkpoints
   - Validation methods per task
   - Git commit strategy

5. **Implementation**: Execute tasks.md in order
   - Mark tasks complete as work progresses
   - Create atomic git commits per phase
   - Push to GitHub for deployment

6. **Verification**: Use Playwright MCP for live site testing
   - Navigate to https://vulcaart.art?nocache=1 (cache-busting parameter)
   - Verify DOM structure via JavaScript evaluation
   - Screenshot key sections
   - Test responsive design (375px, 768px, 1024px, 1440px+)

## Known Constraints & Solutions

### GitHub Pages CDN Caching
- **Issue**: Changes may take 10-30 minutes to appear on live site
- **Solution**: Use `?nocache=1` query parameter when testing: `https://vulcaart.art?nocache=1`
- **Verification**: Playwright MCP can confirm changes deployed even before cache updates

### Data Loading Architecture
- **Current Approach**: All exhibition data embedded in `js/data.js` as `ExhibitionData` object
- **Reason**: GitHub Pages CDN caching made separate JSON files unreliable (24+ hour delays)
- **To Update**: Edit `ExhibitionData` object in `js/data.js`, never separate JSON files

### Bilingual Content Strategy
- **Method**: All content provided in both English and Chinese
- **HTML Structure**: Chinese text uses appropriate `lang="zh-CN"` attributes
- **CSS Typography**: Language-specific font stacks ensure proper character rendering

## Performance Optimization Patterns Implemented

The codebase includes several performance optimizations:

- **O(1) Data Lookups**: Map-indexed artworks, personas, critiques (dataIndexes.js)
- **Event Delegation**: Single listeners for button and card interactions
- **Template System**: Centralized HTML generation to avoid DOM manipulation duplication
- **Memory Optimization**: Consolidated state management in AppState object
- **Test Framework**: Built-in unit testing for core modules (testFramework.js)

## Deployment Checklist

Before pushing changes to production:

- [ ] All tasks in proposal completed and validated
- [ ] HTML validates without errors
- [ ] CSS cleanup complete (no orphaned classes)
- [ ] Responsive design tested on multiple viewports
- [ ] Playwright MCP verification passed
- [ ] Git commits create atomic, meaningful history
- [ ] Commit messages reference OpenSpec change ID
- [ ] GitHub push successful (`git log` shows new commit on remote)

For larger changes, create corresponding OpenSpec proposal first to document rationale and ensure alignment with project vision.
