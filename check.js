const fs = require('fs');
const path = require('path');
const calculatorsDir = path.join(__dirname, 'src/components/calculators');
const files = fs.readdirSync(calculatorsDir).filter(f => f.endsWith('Calculator.tsx'));
for (const file of files) {
  const content = fs.readFileSync(path.join(calculatorsDir, file), 'utf8');
  if (!content.includes('export default function')) {
    console.log(file);
  }
}
