const fs = require('fs');
const file = 'f:/Personal Work/Nexjts/TOOL WEB/hr-business-tool/src/components/calculators/CalculatorLayoutServer.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/'use client';\r?\n/, '');

// Remove react hooks
content = content.replace(/import React, \{ useCallback, useEffect, useState \} from 'react';/, "import React from 'react';");

// Remove framer-motion imports
content = content.replace(/import \{ motion \} from 'framer-motion';\r?\n/, '');
content = content.replace(/import \{ Variants \} from 'framer-motion';\r?\n/, '');

// Remove Accordion imports (we'll replace with HTML details)
content = content.replace(/import \{\r?\n\s*Accordion,\r?\n\s*AccordionContent,\r?\n\s*AccordionItem,\r?\n\s*AccordionTrigger,\r?\n\} from '@\/components\/ui\/accordion';\r?\n/, '');

// Remove motion variants
content = content.replace(/const containerVariants: Variants = [\s\S]*?};\r?\n\r?\n/g, '');
content = content.replace(/const itemVariants: Variants = [\s\S]*?};\r?\n\r?\n/g, '');
content = content.replace(/const fadeInUp: Variants = [\s\S]*?};\r?\n\r?\n/g, '');

// Replace motion.* with normal HTML tags
content = content.replace(/<motion\.div/g, '<div');
content = content.replace(/<\/motion\.div>/g, '</div>');
content = content.replace(/<motion\.nav/g, '<nav');
content = content.replace(/<\/motion\.nav>/g, '</nav>');
content = content.replace(/<motion\.li/g, '<li');
content = content.replace(/<\/motion\.li>/g, '</li>');
content = content.replace(/<motion\.h2/g, '<h2');
content = content.replace(/<\/motion\.h2>/g, '</h2>');
content = content.replace(/<motion\.section/g, '<section');
content = content.replace(/<\/motion\.section>/g, '</section>');

// Remove variants and initial/animate attributes
content = content.replace(/\s+variants=\{[^}]+\}/g, '');
content = content.replace(/\s+initial="[^"]+"/g, '');
content = content.replace(/\s+initial=\{\{[^\}]+\}\}/g, '');
content = content.replace(/\s+animate="[^"]+"/g, '');
content = content.replace(/\s+animate=\{\{[^\}]+\}\}/g, '');
content = content.replace(/\s+whileInView="[^"]+"/g, '');
content = content.replace(/\s+viewport=\{\{[^\}]+\}\}/g, '');
content = content.replace(/\s+transition=\{\{[^\}]+\}\}/g, '');
content = content.replace(/\s+whileHover=\{\{[^\}]+\}\}/g, '');
content = content.replace(/\s+whileTap=\{\{[^\}]+\}\}/g, '');

// Replace Accordion with details/summary
const accordionRegex = /<Card className="overflow-hidden">\s*<CardContent className="p-0">\s*<Accordion type="single" collapsible className="w-full">\s*\{faqs!\.map\(\(faq, idx\) => \(\s*<AccordionItem\s*key=\{idx\}\s*value=\{\`faq-\$\{idx\}\`\}\s*className="px-5"\s*>\s*<AccordionTrigger className="text-left text-sm sm:text-base">\s*\{faq\.question\}\s*<\/AccordionTrigger>\s*<AccordionContent className="text-sm text-muted-foreground leading-relaxed">\s*\{faq\.answer\}\s*<\/AccordionContent>\s*<\/AccordionItem>\s*\)\)\}\s*<\/Accordion>\s*<\/CardContent>\s*<\/Card>/;
const detailsReplacement = `<Card className="overflow-hidden">
  <CardContent className="p-0">
    <div className="w-full divide-y divide-border">
      {faqs!.map((faq, idx) => (
        <details key={idx} className="group px-5 py-4">
          <summary className="flex items-center justify-between cursor-pointer list-none text-left text-sm sm:text-base font-medium [&::-webkit-details-marker]:hidden">
            {faq.question}
            <span className="transition group-open:rotate-180">
              <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
            </span>
          </summary>
          <p className="text-sm text-muted-foreground leading-relaxed mt-3">
            {faq.answer}
          </p>
        </details>
      ))}
    </div>
  </CardContent>
</Card>`;
content = content.replace(accordionRegex, detailsReplacement);

// Remove hooks logic
const hooksLogicRegex = /  const \[activeTocId, setActiveTocId\] = useState<string \| null>\(null\);\s*\/\/ ---- Scroll TOC item into view ----\s*const scrollToSection = useCallback\(\(id: string\) => \{\s*const el = document\.getElementById\(id\);\s*if \(el\) \{\s*el\.scrollIntoView\(\{ behavior: 'smooth', block: 'start' \}\);\s*\}\s*\}, \[\]\);\s*\/\/ ---- Track active TOC heading via IntersectionObserver ----\s*useEffect\(\(\) => \{\s*if \(\!tableOfContents\?\.length\) return;\s*const ids = tableOfContents\.map\(\(t\) => t\.id\);\s*const observers: IntersectionObserver\[\] = \[\];\s*ids\.forEach\(\(id\) => \{\s*const el = document\.getElementById\(id\);\s*if \(\!el\) return;\s*const observer = new IntersectionObserver\(\s*\(\[entry\]\) => \{\s*if \(entry\.isIntersecting\) \{\s*setActiveTocId\(id\);\s*\}\s*\},\s*\{ rootMargin: '-80px 0px -60% 0px', threshold: 0 \}\s*\);\s*observer\.observe\(el\);\s*observers\.push\(observer\);\s*\}\);\s*return \(\) => \{\s*observers\.forEach\(\(o\) => o\.disconnect\(\)\);\s*\};\s*\}, \[tableOfContents\]\);/;
content = content.replace(hooksLogicRegex, '');

// Simplify TOC logic (remove onClick and dynamic class)
content = content.replace(/<button\s*type="button"\s*onClick=\{\(\) => scrollToSection\(item\.id\)\}\s*className=\{\`[^`]+\`\s*\?\s*'[^']+'\s*:\s*'[^']+'\s*\}\s*>/g, '<a href={`#${item.id}`} className="block w-full text-left text-xs leading-relaxed py-1.5 px-2.5 rounded-lg border-l-2 transition-all duration-150 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border-l-transparent text-muted-foreground hover:text-foreground">');
content = content.replace(/<\/button>/g, '</a>');

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully refactored CalculatorLayoutServer');
