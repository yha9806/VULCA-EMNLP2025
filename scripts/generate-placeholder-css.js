/**
 * Generate placeholder CSS for artwork-5 to artwork-38
 * Creates unique gradient backgrounds for each artwork
 */

// Beautiful gradient color pairs (34 unique gradients for artwork-5 to artwork-38)
const gradients = [
  // artwork-5
  ['#f093fb', '#f5576c'], // Pink to Red
  // artwork-6
  ['#4facfe', '#00f2fe'], // Blue to Cyan
  // artwork-7
  ['#43e97b', '#38f9d7'], // Green to Turquoise
  // artwork-8
  ['#fa709a', '#fee140'], // Pink to Yellow
  // artwork-9
  ['#30cfd0', '#330867'], // Cyan to Purple
  // artwork-10
  ['#a8edea', '#fed6e3'], // Mint to Pink
  // artwork-11
  ['#ff9a9e', '#fecfef'], // Coral to Pink
  // artwork-12
  ['#ffecd2', '#fcb69f'], // Peach to Coral
  // artwork-13
  ['#ff6e7f', '#bfe9ff'], // Red to Blue
  // artwork-14
  ['#e0c3fc', '#8ec5fc'], // Purple to Blue
  // artwork-15
  ['#f093fb', '#f5576c'], // Pink to Red
  // artwork-16
  ['#fccb90', '#d57eeb'], // Orange to Purple
  // artwork-17
  ['#e0c3fc', '#8ec5fc'], // Purple to Blue
  // artwork-18
  ['#a8edea', '#fed6e3'], // Mint to Pink
  // artwork-19
  ['#fad0c4', '#ffd1ff'], // Peach to Pink
  // artwork-20
  ['#a1c4fd', '#c2e9fb'], // Blue to Light Blue
  // artwork-21
  ['#d4fc79', '#96e6a1'], // Yellow to Green
  // artwork-22
  ['#cfd9df', '#e2ebf0'], // Gray to Light Gray
  // artwork-23
  ['#f6d365', '#fda085'], // Yellow to Orange
  // artwork-24
  ['#96fbc4', '#f9f586'], // Green to Yellow
  // artwork-25
  ['#fbc2eb', '#a6c1ee'], // Pink to Blue
  // artwork-26
  ['#fdcbf1', '#e6dee9'], // Pink to Purple
  // artwork-27
  ['#f77062', '#fe5196'], // Red to Pink
  // artwork-28
  ['#f5af19', '#f12711'], // Orange to Red
  // artwork-29
  ['#667eea', '#764ba2'], // Blue to Purple (same as artwork-1)
  // artwork-30
  ['#fccb90', '#d57eeb'], // Orange to Purple
  // artwork-31
  ['#2d2d2d', '#555555'], // Dark Gray to Gray
  // artwork-32
  ['#434343', '#000000'], // Gray to Black
  // artwork-33
  ['#fa8bff', '#2bd2ff'], // Pink to Cyan
  // artwork-34
  ['#ffecd2', '#fcb69f'], // Peach to Coral
  // artwork-35
  ['#e6e9f0', '#eef1f5'], // Light Gray to White
  // artwork-36
  ['#fa709a', '#fee140'], // Pink to Yellow
  // artwork-37
  ['#30cfd0', '#330867'], // Cyan to Purple
  // artwork-38
  ['#a8edea', '#fed6e3']  // Mint to Pink
];

// Generate CSS rules
let css = '\n/* Placeholder gradients for artwork-5 to artwork-38 */\n';

for (let i = 0; i < gradients.length; i++) {
  const artworkNum = i + 5; // Start from artwork-5
  const [color1, color2] = gradients[i];

  css += `.artwork-placeholder.artwork-${artworkNum} {\n`;
  css += `  background: linear-gradient(135deg, ${color1} 0%, ${color2} 100%);\n`;
  css += `}\n\n`;
}

// Output
console.log(css);
console.log(`\n✓ Generated CSS for 34 artworks (artwork-5 to artwork-38)`);
console.log('✓ Copy the above CSS to styles/main.css after the artwork-1 to artwork-4 placeholders');
