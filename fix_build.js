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

// Fix WorkersCompCalculator.tsx
let wcContent = fs.readFileSync('src/components/calculators/WorkersCompCalculator.tsx', 'utf8');
const wcLayoutIdx = wcContent.indexOf('<CalculatorLayout');
const wcEndIdx = wcContent.indexOf('<div className="p-4 sm:p-6 space-y-6">');
if (wcLayoutIdx !== -1 && wcEndIdx !== -1) {
  wcContent = wcContent.substring(0, wcLayoutIdx) + '<div className="w-full">\n      ' + wcContent.substring(wcEndIdx);
  fs.writeFileSync('src/components/calculators/WorkersCompCalculator.tsx', wcContent);
  console.log('Fixed WorkersCompCalculator.tsx');
} else {
  // Try fixing the {(() => const rows... issue
  wcContent = wcContent.replace('<div className="w-full"> {\n        const rows: CompareRow[]', '<div className="w-full">\n      {compareA && compareB && (() => {\n        const rows: CompareRow[]');
  fs.writeFileSync('src/components/calculators/WorkersCompCalculator.tsx', wcContent);
  console.log('Fixed WorkersCompCalculator.tsx ComparePanel');
}

// Fix seo-data/overtime-calculator.ts
let otSeo = fs.readFileSync('src/lib/seo-data/overtime-calculator.ts', 'utf8');
otSeo = otSeo.replace(/export default function OvertimeCalculator\(\) \{[\s\S]*?(?=return \()/m, '');
otSeo = otSeo.replace(/return \([\s\S]*?(?=export default seoData;)/m, '');
fs.writeFileSync('src/lib/seo-data/overtime-calculator.ts', otSeo);
console.log('Fixed seo-data/overtime-calculator.ts');

// Fix seo-data/workers-comp-calculator.ts
let wcSeo = fs.readFileSync('src/lib/seo-data/workers-comp-calculator.ts', 'utf8');
// remove the bad lines
wcSeo = wcSeo.replace(/SelectTrigger:[ \s\S]*?ccode:.*?,/g, '');
fs.writeFileSync('src/lib/seo-data/workers-comp-calculator.ts', wcSeo);
console.log('Fixed seo-data/workers-comp-calculator.ts');
