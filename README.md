# VULCA - 潮汐的负形

**An Immersive Art Exhibition Platform for AI-Generated Art Criticism**

🌐 **Live Site**: [vulcaart.art](https://vulcaart.art)
📄 **Repository**: [github.com/yha9806/VULCA-EMNLP2025](https://github.com/yha9806/VULCA-EMNLP2025)
📧 **Contact**: info@vulcaart.art

---

## 🎨 About the Project

VULCA (Visual Understanding and Language's Cultural Adaptation) is an interactive digital exhibition platform exploring how AI systems understand and critique artworks from diverse cultural perspectives.

**"潮汐的负形" (Tidal Negative Form)** emphasizes:
- **Tidal Nature** — Art criticism shifts like tides as perspectives change
- **Negative Space** — Focus on process, drafts, and iteration, not just final results
- **Multidimensionality** — Same artwork holds different meanings for different critics

### Exhibition Content
- **4 Artworks** by Sougwen Chung
- **6 AI Personas** representing different cultural critics (Su Shi, Walter Benjamin, Susan Sontag, etc.)
- **24 Generated Critiques** analyzing works through the RPAIT framework
- **5 Dimensions** of art criticism: Representation, Philosophy, Aesthetics, Interpretation, Technique

---

## 🚀 Quick Start

This is a **static website** deployed on GitHub Pages.

### Local Development
```bash
# Clone repository
git clone https://github.com/yha9806/VULCA-EMNLP2025.git
cd VULCA-EMNLP2025

# Start local server
python -m http.server 9999
# OR
npx http-server -p 9999 -c-1 --cors

# Visit
# http://localhost:9999
```

### Project Structure
```
VULCA-EMNLP2025/
├── index.html              # Immersive gallery homepage (carousel interface)
├── pages/                  # Detail pages (scrollable)
│   ├── critics.html       # 6 critic personas + RPAIT visualization
│   ├── about.html         # Project vision & RPAIT framework
│   └── process.html       # Creative workflow (7 steps)
├── styles/main.css         # All styles (responsive design)
├── js/                     # JavaScript modules
│   ├── data.js            # Exhibition data + RPAIT scoring
│   ├── carousel.js        # Artwork navigation controller
│   ├── gallery-hero.js    # Homepage display renderer
│   ├── scroll-prevention.js # Immersive mode (disable scroll)
│   └── ...
├── assets/                 # Media resources
├── SPEC.md                 # Project specification
├── CLAUDE.md               # Development guide for Claude Code
└── openspec/               # OpenSpec change management
```

---

## 🎯 Key Features

### Version 3.0.0 - Immersive Carousel Design
- **Click-based Navigation**: Previous/Next buttons + dot indicators
- **Responsive Layout**: 5 breakpoint optimization (375/768/1280/1440/1920px)
- **Ghost UI Aesthetic**: Minimal header with hamburger menu
- **RPAIT Visualization**: Bar chart displays for 5 critical dimensions
- **Multi-page Architecture**: Homepage (immersive) + 3 detail pages (scrollable)
- **Language Toggle**: Chinese/English content switching

### Architecture Principles
1. **Immersive/Detail Separation**
   - Homepage: Fully immersive, no scroll, carousel navigation
   - Detail pages: Scrollable, background information
   - User chooses depth: stay in gallery or explore details

2. **Navigation System**
   - Hamburger menu (☰): Accessible on all pages
   - Links: Main Gallery → Critics → About → Process
   - Back button (←): All detail pages return to homepage

3. **Data Flow**
   ```
   js/data.js (VULCA_DATA)
      ↓
   artworks[4] + personas[6] + critiques[24]
      ↓
   RPAIT calculation (built-in functions)
      ↓
   persona.rpait: { R, P, A, I, T } (averaged scores)
      ↓
   critics-page.js (read & render)
      ↓
   HTML cards + dimension bar charts
   ```

---

## 📖 Documentation

- **[SPEC.md](./SPEC.md)** - Project specification and structure (must-read)
- **[CLAUDE.md](./CLAUDE.md)** - Development guide for Claude Code
- **[MIGRATION_RECORD_2025-11-02.md](./MIGRATION_RECORD_2025-11-02.md)** - Domain migration documentation
- **[openspec/](./openspec/)** - OpenSpec change management framework

---

## 🔧 Development

### Core Technologies
- **HTML5** + **CSS3** (custom properties, flexbox, grid)
- **Vanilla JavaScript** (ES6+, modular architecture)
- **GitHub Pages** (static site hosting)
- **Chart.js** (RPAIT visualization)
- **Sparticles** (particle effects)

### Responsive Design
```css
/* Mobile-first breakpoints */
@media (min-width: 375px)  { /* Mobile */ }
@media (min-width: 768px)  { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1440px) { /* Large Desktop */ }
@media (min-width: 1920px) { /* Ultra-wide */ }
```

### OpenSpec Integration
This project follows the [OpenSpec](./openspec/) specification-driven development workflow:
- All feature changes go through proposal → approval → implementation → archival
- Changes documented in `openspec/changes/`
- Strict validation and compatibility checks

---

## 🚢 Deployment

### Automatic Deployment
```bash
# 1. Modify files locally
# 2. Test locally (http://localhost:9999)
# 3. Commit and push
git add .
git commit -m "Your change description"
git push origin master

# 4. GitHub Pages auto-deploys
# https://vulcaart.art updates in seconds
```

### Manual Deployment via GitHub CLI
```bash
# Enable GitHub Pages
gh api repos/yha9806/VULCA-EMNLP2025/pages -X POST --input - <<'EOF'
{
  "source": {
    "branch": "master",
    "path": "/"
  }
}
EOF

# Set custom domain
gh api repos/yha9806/VULCA-EMNLP2025/pages --method PUT --input - <<'EOF'
{
  "cname": "vulcaart.art",
  "source": {
    "branch": "master",
    "path": "/"
  }
}
EOF
```

### DNS Configuration (Namecheap)
```
A Records:
  @ → 185.199.108.153
  @ → 185.199.109.153
  @ → 185.199.110.153
  @ → 185.199.111.153

CNAME Record:
  www → yha9806.github.io
```

### CDN Cache Bypass
GitHub Pages uses Fastly CDN with 10-minute cache:
```
https://vulcaart.art?nocache=1
```

---

## 📊 Version History

### Version 3.0.0 (Current) - Immersive Carousel
- **Design**: Immersive carousel gallery with click navigation
- **Interaction**: Previous/Next buttons + dot indicators
- **File Size**: 14,321 bytes (~280 lines HTML)
- **Architecture**: Modular (carousel, gallery-hero, data)
- **Responsive**: 5 breakpoint optimization
- **Features**: Homepage immersive + 3 detail pages

### Version 2.1.0 (Archived) - Selector Interface
- **Design**: Traditional selector + comparison view
- **Interaction**: Dropdown menu selection
- **File Size**: 17,875 bytes (447 lines HTML)
- **Architecture**: Monolithic (plan.js + single app.js)
- **Repository**: vulca-exhibition (archived)

**Migration Date**: 2025-11-02
**See**: [MIGRATION_RECORD_2025-11-02.md](./MIGRATION_RECORD_2025-11-02.md) for full details

---

## 🐛 Troubleshooting

### Menu button not working?
1. Check `<button id="menu-toggle">` exists in HTML
2. Verify `js/navigation.js` is loaded
3. Browser console should show `[Navigation] Handler initialized`

### Critics page not showing cards?
1. Verify `js/data.js` has 24 critiques with `rpait: { R, P, A, I, T }`
2. Ensure `data.js` loads **before** `critics-page.js`
3. Check browser console for `Missing or invalid rpait` errors

### Detail pages can't scroll?
1. Check `pages/*.html` has `window.IMMERSIVE_MODE = false;` script
2. Homepage should have `window.IMMERSIVE_MODE = true;`
3. `scroll-prevention.js` uses this flag to enable/disable scroll lock

### Deployment shows old version?
CDN cache. Wait 10-30 minutes or use `?nocache=1` query parameter.

---

## 🤝 Contributing

This is a research project for EMNLP 2025. Contributions are welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow OpenSpec workflow (see `openspec/README.md`)
4. Commit changes (`git commit -m 'feat: add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Commit Message Format
```
<type>: <short description>

<detailed explanation (optional)>

Closes #<issue> (if applicable)
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`

---

## 📄 License

© 2025 VULCA. All rights reserved.

This project is part of academic research for EMNLP 2025.

---

## 🔗 Links

- **Live Exhibition**: [vulcaart.art](https://vulcaart.art)
- **GitHub Repository**: [yha9806/VULCA-EMNLP2025](https://github.com/yha9806/VULCA-EMNLP2025)
- **Old Repository** (archived): [yha9806/vulca-exhibition](https://github.com/yha9806/vulca-exhibition)
- **Contact**: info@vulcaart.art

---

## 🙏 Acknowledgments

- **Artist**: Sougwen Chung - Artwork from "Memory (Painting Operation Unit: Second Generation)" series
- **Framework**: RPAIT (Representation, Philosophy, Aesthetics, Interpretation, Technique)
- **Development**: Claude Code - AI-assisted development
- **Hosting**: GitHub Pages - Free static site hosting

---

**Start exploring: [vulcaart.art](https://vulcaart.art)**

🤖 Generated with [Claude Code](https://claude.com/claude-code)
