const fs = require('fs');

// Fix TimeCardCalculator.tsx
let content = fs.readFileSync('src/components/calculators/TimeCardCalculator.tsx', 'utf8');
const layoutIdx = content.indexOf('<CalculatorLayout');
let endIdx = content.indexOf('<div className="p-4 sm:p-6 space-y-6">');
if (layoutIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, layoutIdx) + '<div className="w-full">\n      ' + content.substring(endIdx);
  fs.writeFileSync('src/components/calculators/TimeCardCalculator.tsx', content);
  console.log('Fixed TimeCardCalculator.tsx');
}
