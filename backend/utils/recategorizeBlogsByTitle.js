/**
 * Re-categorize all fetched blogs (devto + medium) using title + description keywords.
 * No external API calls needed.
 * Run: node backend/utils/recategorizeBlogsByTitle.js
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

import Blog from '../models/Blog.js';

const INTERVIEW_KEYWORDS = [
  'interview', 'interview prep', 'coding interview', 'system design', 'leetcode',
  'dsa', 'data structure', 'algorithm', 'cracking', 'faang', 'maang', 'big tech',
  'technical round', 'placement', 'aptitude',
];
const CAREER_KEYWORDS = [
  'career', 'job hunt', 'job search', 'resume', 'cv ', 'cover letter', 'linkedin',
  'salary', 'negotiate', 'negotiation', 'promotion', 'layoff', 'freelanc',
  'remote work', 'work life', 'soft skill', 'productivity', 'leadership',
  'junior developer', 'senior developer', 'developer journey', 'self-taught',
];
const TUTORIAL_KEYWORDS = [
  'tutorial', 'how to ', 'how-to', 'build a ', 'build an ', 'getting started',
  'beginner', 'step by step', 'step-by-step', 'introduction to', 'learn ',
  'guide to', 'complete guide', 'crash course', 'hands-on', 'from scratch',
  'project ', 'implement', '100 days',
];
const NEWS_KEYWORDS = [
  'release', 'launched', 'announcing', 'announcement', 'new in ', 'update ',
  'changelog', 'version ', 'v2.', 'v3.', 'open source', 'github ', 'news',
  'trend', 'state of ', 'survey', 'report ', '2024', '2025', '2026',
];

function mapToCategory(title = '', description = '') {
  const text = (title + ' ' + description).toLowerCase();
  if (INTERVIEW_KEYWORDS.some(k => text.includes(k))) return 'Interview Guide';
  if (CAREER_KEYWORDS.some(k => text.includes(k))) return 'Career Tips';
  if (TUTORIAL_KEYWORDS.some(k => text.includes(k))) return 'Tutorial';
  if (NEWS_KEYWORDS.some(k => text.includes(k))) return 'News';
  return 'Tech Blog';
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const blogs = await Blog.find({ source: { $in: ['devto', 'medium'] } });
  console.log(`Found ${blogs.length} fetched blogs to re-categorize`);

  const counts = { 'Tech Blog': 0, 'Tutorial': 0, 'Career Tips': 0, 'Interview Guide': 0, 'News': 0 };
  let updated = 0;

  const bulkOps = [];
  for (const blog of blogs) {
    const category = mapToCategory(blog.title, blog.excerpt || blog.shortDescription || '');
    counts[category] = (counts[category] || 0) + 1;
    if (category !== blog.category) {
      bulkOps.push({
        updateOne: { filter: { _id: blog._id }, update: { $set: { category } } }
      });
      updated++;
    }
  }

  if (bulkOps.length > 0) {
    await Blog.bulkWrite(bulkOps);
  }

  console.log(`\nDone. Updated: ${updated} / ${blogs.length}`);
  console.log('\nCategory breakdown:');
  Object.entries(counts).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`);
  });

  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
