const fs = require('fs');
const path = require('path');

const dir = 'src/content/blog';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

for (const f of files) {
  const p = path.join(dir, f);
  let content = fs.readFileSync(p, 'utf8');
  content = content.replace(/author:\s*"QuickBizCalc Team"/, 'author: "Sarah Jenkins, HR Specialist"');
  fs.writeFileSync(p, content);
  console.log(`Updated ${p}`);
}
