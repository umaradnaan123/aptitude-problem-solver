import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '..', 'src', 'data', 'topicsData.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Update interface Category Type definition
content = content.replace(
  "category: 'quantitative-aptitude' | 'logical-reasoning' | 'verbal-ability' | 'data-interpretation';",
  "category: 'finance' | 'word-problems' | 'logical' | 'math-logic' | 'reasoning' | 'company-wise' | 'verbal-ability' | 'data-interpretation';"
);

// Map of topic id -> new category
const categoryMap = {
  'simple-interest': 'finance',
  'compound-interest': 'finance',
  'profit-and-loss': 'finance',
  'ratio-and-proportion': 'finance',
  'partnership': 'finance',
  'percentage': 'finance',
  'problems-on-ages': 'finance',
  
  'problems-on-trains': 'word-problems',
  'time-and-distance': 'word-problems',
  'time-and-work': 'word-problems',
  'basics-and-streams': 'word-problems',
  'pipes-and-cisterns': 'word-problems',
  'area-and-perimeter': 'word-problems',
  'volume-and-surface-area': 'word-problems',
  
  'probability': 'logical',
  'mixtures-and-combinations': 'logical',
  
  'logarithms': 'math-logic',
  'hcf-and-lcm': 'math-logic',
  'surds-and-indices': 'math-logic',
  
  'clocks': 'reasoning',
  'calendars': 'reasoning',
  
  'grammar': 'verbal-ability',
  'synonyms-antonyms': 'verbal-ability',
  'reading-comprehension': 'verbal-ability',
  
  'tables': 'data-interpretation',
  'bar-graphs': 'data-interpretation',
  'pie-charts': 'data-interpretation'
};

// Split by topic object separator
const parts = content.split('id: "');
for (let i = 1; i < parts.length; i++) {
  const endIdIndex = parts[i].indexOf('"');
  const topicId = parts[i].substring(0, endIdIndex);
  const targetCategory = categoryMap[topicId];
  
  if (targetCategory) {
    // Find next category field in this part before the next topic object
    // Usually category is nearby. Let's find "category: "
    parts[i] = parts[i].replace(/category:\s*"[^"]+"/, `category: "${targetCategory}"`);
  }
}

content = parts.join('id: "');
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully completed robust topics update!');
