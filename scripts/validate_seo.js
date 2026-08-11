import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const topicsPath = path.join(__dirname, '..', 'src', 'data', 'topicsData.ts');
const seoContentPath = path.join(__dirname, '..', 'src', 'data', 'seoContentData.ts');
const robotsPath = path.join(__dirname, '..', 'public', 'robots.txt');
const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');

// 1. Read files
const topicsContent = fs.readFileSync(topicsPath, 'utf8');
const seoContent = fs.readFileSync(seoContentPath, 'utf8');
const robotsContent = fs.readFileSync(robotsPath, 'utf8');
const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

console.log('--- RUNNING TECHNICAL SEO VALIDATION ---');
let errors = 0;

// Test robots.txt presence & allow directive
if (!robotsContent.includes('Allow: /')) {
  console.error('[FAIL] robots.txt is missing allow directive!');
  errors++;
} else {
  console.log('[PASS] robots.txt permits full crawling.');
}

// Test sitemap
if (!sitemapContent.includes('<loc>https://aptitude-problem-solver.vercel.app/</loc>')) {
  console.error('[FAIL] sitemap.xml is missing home page loc!');
  errors++;
} else {
  console.log('[PASS] sitemap.xml contains primary canonical URLs.');
}

// Check category coverage
const expectedCategories = ['finance', 'word-problems', 'logical', 'math-logic', 'reasoning', 'company-wise', 'verbal-ability', 'data-interpretation'];
expectedCategories.forEach(cat => {
  if (!seoContent.includes(`"${cat}":`) && !seoContent.includes(`'${cat}':`)) {
    console.error(`[FAIL] seoContentData.ts is missing configuration for category: ${cat}`);
    errors++;
  } else {
    console.log(`[PASS] Category "${cat}" content verified.`);
  }
});

// Check if hash routes are in sitemap
if (sitemapContent.includes('#/')) {
  console.error('[FAIL] sitemap.xml contains hash fragment URLs!');
  errors++;
} else {
  console.log('[PASS] No fragment URLs in sitemap.');
}

// Verify GSC required URLs are in the sitemap
const requiredGscUrls = [
  'https://aptitude-problem-solver.vercel.app/about',
  'https://aptitude-problem-solver.vercel.app/calculators',
  'https://aptitude-problem-solver.vercel.app/categories/company-wise',
  'https://aptitude-problem-solver.vercel.app/categories/finance',
  'https://aptitude-problem-solver.vercel.app/categories/logical',
  'https://aptitude-problem-solver.vercel.app/categories/math-logic',
  'https://aptitude-problem-solver.vercel.app/categories/reasoning',
  'https://aptitude-problem-solver.vercel.app/categories/word-problems',
  'https://aptitude-problem-solver.vercel.app/question/area-and-perimeter',
  'https://aptitude-problem-solver.vercel.app/question/basics-and-streams',
  'https://aptitude-problem-solver.vercel.app/question/calendars',
  'https://aptitude-problem-solver.vercel.app/question/clocks',
  'https://aptitude-problem-solver.vercel.app/question/compound-interest',
  'https://aptitude-problem-solver.vercel.app/question/mixtures-and-combinations',
  'https://aptitude-problem-solver.vercel.app/question/probability',
  'https://aptitude-problem-solver.vercel.app/question/profit-and-loss',
  'https://aptitude-problem-solver.vercel.app/question/ratio-and-proportion',
  'https://aptitude-problem-solver.vercel.app/question/time-and-distance',
  'https://aptitude-problem-solver.vercel.app/question/time-and-work',
  'https://aptitude-problem-solver.vercel.app/question/volume-and-surface-area',
  'https://aptitude-problem-solver.vercel.app/tests'
];

requiredGscUrls.forEach(url => {
  if (!sitemapContent.includes(`<loc>${url}</loc>`)) {
    console.error(`[FAIL] sitemap.xml is missing required GSC URL: ${url}`);
    errors++;
  } else {
    console.log(`[PASS] GSC URL indexable entry verified: ${url}`);
  }
});

if (errors > 0) {
  console.error(`\nValidation complete. Found ${errors} error(s).`);
  process.exit(1);
} else {
  console.log('\n[SUCCESS] All Technical SEO checks passed!');
  process.exit(0);
}
