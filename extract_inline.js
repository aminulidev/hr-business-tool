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

const remaining = [
  'BillableHoursCalculator.tsx',
  'CostPerHireCalculator.tsx',
  'EmployeeTurnoverCalculator.tsx',
  'FicaTaxCalculator.tsx',
  'PostTaxBonusCalculator.tsx',
  'ProRataSalaryCalculator.tsx',
  'RevenuePerEmployeeCalculator.tsx',
  'ROICalculator.tsx',
  'SalaryIncreaseCalculator.tsx',
  'SeverancePayCalculator.tsx',
  'TimeAndAHalfCalculator.tsx',
  'WorkersCompCalculator.tsx'
];

let successCount = 0;

for (const file of remaining) {
  const filePath = path.join(calculatorsDir, file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');
  const componentName = file.replace('.tsx', '');
  const slug = slugMap[componentName];
  if (!slug) continue;

  const layoutStartIdx = content.indexOf('<CalculatorLayout');
  if (layoutStartIdx === -1) continue;

  let openCount = 0;
  let layoutEndIdx = -1;
  let inQuote = false;
  let quoteChar = '';

  let escapeNext = false;

  for (let i = layoutStartIdx; i < content.length; i++) {
    const char = content[i];
    
    if (escapeNext) {
      escapeNext = false;
      continue;
    }
    
    if (char === '\\') {
      escapeNext = true;
      continue;
    }
    
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
        layoutEndIdx = i;
        break;
      }
    }
  }

  if (layoutEndIdx !== -1) {
    let layoutPropsStr = content.substring(layoutStartIdx, layoutEndIdx + 1);
    
    // We only want to extract the SEO props.
    // Let's remove title, description, icon
    layoutPropsStr = layoutPropsStr.replace(/<CalculatorLayout\s+/, '');
    layoutPropsStr = layoutPropsStr.replace(/title="[^"]*"\s*/, '');
    layoutPropsStr = layoutPropsStr.replace(/description="[^"]*"\s*/, '');
    layoutPropsStr = layoutPropsStr.replace(/icon=\{[^}]*\}\s*/, '');
    layoutPropsStr = layoutPropsStr.replace(/>$/, '');
    
    // Now layoutPropsStr contains things like: breadcrumbs={...} tableOfContents={...}
    // We need to convert `prop={val}` to `prop: val,`
    // And `prop="val"` to `prop: "val",`
    
    let seoDataStr = 'const seoData = {\n';
    
    // Simple parser to split by top-level props
    let currentPropName = '';
    let currentValue = '';
    let state = 'FIND_PROP'; // FIND_PROP, IN_PROP_NAME, FIND_EQUALS, FIND_VALUE, IN_VALUE
    let braceCount = 0;
    
    let escapeNext2 = false;
    
    for (let i = 0; i < layoutPropsStr.length; i++) {
      const char = layoutPropsStr[i];
      
      if (escapeNext2) {
        escapeNext2 = false;
        if (state === 'IN_VALUE_BRACE' || state === 'IN_VALUE_QUOTE' || state === 'IN_VALUE_UNQUOTED') {
          currentValue += char;
        }
        continue;
      }
      
      if (char === '\\') {
        escapeNext2 = true;
        if (state === 'IN_VALUE_BRACE' || state === 'IN_VALUE_QUOTE' || state === 'IN_VALUE_UNQUOTED') {
          currentValue += char;
        }
        continue;
      }
      
      if (state === 'FIND_PROP') {
        if (/[a-zA-Z]/.test(char)) {
          state = 'IN_PROP_NAME';
          currentPropName = char;
        }
      } else if (state === 'IN_PROP_NAME') {
        if (/[a-zA-Z0-9]/.test(char)) {
          currentPropName += char;
        } else if (char === '=') {
          state = 'FIND_VALUE';
        } else if (/\s/.test(char)) {
          state = 'FIND_EQUALS';
        }
      } else if (state === 'FIND_EQUALS') {
        if (char === '=') {
          state = 'FIND_VALUE';
        }
      } else if (state === 'FIND_VALUE') {
        if (/\s/.test(char)) continue;
        if (char === '{') {
          state = 'IN_VALUE_BRACE';
          braceCount = 1;
          currentValue = '';
        } else if (char === '"' || char === "'") {
          state = 'IN_VALUE_QUOTE';
          quoteChar = char;
          currentValue = char;
        } else {
          // Unquoted value?
          state = 'IN_VALUE_UNQUOTED';
          currentValue = char;
        }
      } else if (state === 'IN_VALUE_BRACE') {
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
        
        if (braceCount === 0) {
          seoDataStr += `  ${currentPropName}: ${currentValue},\n`;
          state = 'FIND_PROP';
          currentPropName = '';
        } else {
          currentValue += char;
        }
      } else if (state === 'IN_VALUE_QUOTE') {
        currentValue += char;
        if (char === quoteChar) {
          seoDataStr += `  ${currentPropName}: ${currentValue},\n`;
          state = 'FIND_PROP';
          currentPropName = '';
        }
      } else if (state === 'IN_VALUE_UNQUOTED') {
        if (/\s/.test(char)) {
          seoDataStr += `  ${currentPropName}: ${currentValue},\n`;
          state = 'FIND_PROP';
          currentPropName = '';
        } else {
          currentValue += char;
        }
      }
    }
    
    // Add last unquoted if any
    if (state === 'IN_VALUE_UNQUOTED') {
      seoDataStr += `  ${currentPropName}: ${currentValue},\n`;
    }
    
    seoDataStr += '};\n\nexport default seoData;\n';
    
    fs.writeFileSync(path.join(seoDataDir, `${slug}.ts`), seoDataStr);
    
    // Now replace <CalculatorLayout ...> with <div className="w-full">
    content = content.substring(0, layoutStartIdx) + '<div className="w-full">' + content.substring(layoutEndIdx + 1);
    
    // Replace closing </CalculatorLayout> with </div>
    content = content.replace(/<\/CalculatorLayout>/g, '</div>');
    
    // Remove CalculatorLayout import
    content = content.replace(/import\s+CalculatorLayout\s+from\s+['"]@\/components\/calculators\/CalculatorLayout['"];?\r?\n/g, '');
    
    fs.writeFileSync(filePath, content);
    console.log(`Successfully extracted SEO data to ${slug}.ts and refactored ${file}`);
    successCount++;
  }
}

console.log(`\nCompleted! Successfully refactored ${successCount} inline calculators.`);
