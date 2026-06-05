const fs = require('fs');
const path = require('path');

const calculatorsDir = path.join(__dirname, 'src/components/calculators');
const seoDataDir = path.join(__dirname, 'src/lib/seo-data');
const pageFile = path.join(__dirname, 'src/app/calculators/[slug]/page.tsx');

if (!fs.existsSync(seoDataDir)) {
  fs.mkdirSync(seoDataDir, { recursive: true });
}

// Extract component map from page.tsx to get the slug for each component
const pageContent = fs.readFileSync(pageFile, 'utf8');
const componentMapMatch = pageContent.match(/const componentMap: Record<string, React\.ComponentType> = {([\s\S]*?)};/);
const slugMap = {};
if (componentMapMatch) {
  const lines = componentMapMatch[1].split('\n');
  for (const line of lines) {
    const match = line.match(/'([^']+)':\s*([a-zA-Z0-9_]+)/);
    if (match) {
      slugMap[match[2]] = match[1]; // component name -> slug
    }
  }
}

const files = fs.readdirSync(calculatorsDir).filter(f => f.endsWith('Calculator.tsx') && f !== 'WagesCalculator.tsx');

let successCount = 0;

for (const file of files) {
  const filePath = path.join(calculatorsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  const componentName = file.replace('.tsx', '');
  const slug = slugMap[componentName];
  
  if (!slug) {
    console.log(`Skipping ${file} - no slug found in page.tsx.`);
    continue;
  }
  
  // Extract SEO content using resilient regex that finds the SEO variables rather than relying on comment blocks
  const seoRegex = /((?:(?:\/\/[^\n]*\n)+\s*)?const\s+(?:breadcrumbs|tableOfContents|howToSteps)\s*=\s*[\s\S]*?)(?:(?:\/\/[^\n]*\n)+\s*)?return\s*\(\s*(?:<CalculatorLayout|\n\s*<CalculatorLayout)/;
  const seoMatch = content.match(seoRegex);
  
  if (!seoMatch) {
    console.log(`Skipping ${file} - no SEO content section found.`);
    continue;
  }
  
  const seoContentStr = seoMatch[1];
  
  // Create SEO data file, using default export
  const seoDataContent = `const seoData = {
  ${seoContentStr.replace(/const (\w+)\s*=/g, '$1:').replace(/;/g, ',')}
};

export default seoData;
`;
  
  fs.writeFileSync(path.join(seoDataDir, `${slug}.ts`), seoDataContent);
  
  // Remove SEO content from component
  content = content.replace(seoMatch[1], '');
  
  // Replace <CalculatorLayout ...> with <div className="w-full">
  const layoutIdx = content.indexOf('<CalculatorLayout');
  if (layoutIdx !== -1) {
    let openCount = 0;
    let endIdx = -1;
    let inQuote = false;
    let quoteChar = '';
    
    for (let i = layoutIdx; i < content.length; i++) {
      const char = content[i];
      if (inQuote) {
        if (char === quoteChar) inQuote = false;
        continue;
      }
      
      if (char === '"' || char === "'") {
        inQuote = true;
        quoteChar = char;
        continue;
      }
      
      if (char === '<') openCount++;
      if (char === '>') {
        openCount--;
        if (openCount === 0) {
          endIdx = i;
          break;
        }
      }
    }
    
    if (endIdx !== -1) {
      content = content.substring(0, layoutIdx) + '<div className="w-full">' + content.substring(endIdx + 1);
    }
  }
  
  // Replace closing </CalculatorLayout> with </div>
  content = content.replace(/<\/CalculatorLayout>/g, '</div>');
  
  // Remove CalculatorLayout import
  content = content.replace(/import\s+CalculatorLayout\s+from\s+['"]@\/components\/calculators\/CalculatorLayout['"];?\r?\n/g, '');
  
  fs.writeFileSync(filePath, content);
  console.log(`Successfully extracted SEO data to ${slug}.ts and refactored ${file}`);
  successCount++;
}

console.log(`\nCompleted! Successfully refactored ${successCount} calculators.`);
