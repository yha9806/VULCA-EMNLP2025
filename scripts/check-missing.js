const data = require('../exhibitions/negative-space-of-the-tide/data.json');
const missing = data.critiques.filter(c => !c.textEn || c.textEn.trim() === '');
console.log('Missing English translations:', missing.length);
console.log('Total critiques:', data.critiques.length);
console.log('Progress:', ((data.critiques.length - missing.length) / data.critiques.length * 100).toFixed(1) + '%');
