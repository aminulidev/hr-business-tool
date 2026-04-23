const fs = require('fs');
const path = require('path');
const dir = 'src/components/calculators';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('result-display') && !content.includes('aria-live')) {
    content = content.replace(/className=\"([^\"]*result-display[^\"]*)\"/g, 'className="$1" aria-live="polite"');
    fs.writeFileSync(filePath, content);
    console.log('Updated ' + file);
  }
});
