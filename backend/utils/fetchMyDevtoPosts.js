/**
 * Fetch ALL posts from your Dev.to account using DEVTO_API_KEY,
 * save to EduLumix Blog collection, and mark them all as isFeatured=true.
 * Run: node backend/utils/fetchMyDevtoPosts.js
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

import Blog from '../models/Blog.js';
import User from '../models/User.js';

const DEVTO_API_KEY = process.env.DEVTO_API_KEY;
if (!DEVTO_API_KEY) { console.error('DEVTO_API_KEY not found in .env'); process.exit(1); }

const INTERVIEW_KEYWORDS = ['interview', 'coding interview', 'system design', 'leetcode', 'dsa', 'data structure', 'algorithm', 'cracking', 'faang', 'placement'];
const CAREER_KEYWORDS = ['career', 'job hunt', 'job search', 'resume', 'cv ', 'cover letter', 'linkedin', 'salary', 'negotiat', 'promotion', 'freelanc', 'remote work', 'soft skill', 'productivity', 'self-taught'];
const TUTORIAL_KEYWORDS = ['tutorial', 'how to ', 'how-to', 'build a ', 'build an ', 'getting started', 'beginner', 'step by step', 'introduction to', 'learn ', 'guide to', 'complete guide', 'crash course', 'from scratch', '100 days'];
const NEWS_KEYWORDS = ['release', 'launched', 'announcing', 'announcement', 'new in ', 'changelog', 'version ', 'open source', 'news', 'trend', 'state of ', 'survey', '2024', '2025', '2026'];

function mapToCategory(title = '', description = '') {
  const text = (title + ' ' + description).toLowerCase();
  if (INTERVIEW_KEYWORDS.some(k => text.includes(k))) return 'Interview Guide';
  if (CAREER_KEYWORDS.some(k => text.includes(k))) return 'Career Tips';
  if (TUTORIAL_KEYWORDS.some(k => text.includes(k))) return 'Tutorial';
  if (NEWS_KEYWORDS.some(k => text.includes(k))) return 'News';
  return 'Tech Blog';
}

async function fetchAllMyArticles() {
  const articles = [];
  let page = 1;
  while (true) {
    const res = await fetch(`https://dev.to/api/articles/me/published?per_page=100&page=${page}`, {
      headers: { 'api-key': DEVTO_API_KEY },
    });
    if (!res.ok) throw new Error(`Dev.to API error: ${res.status} ${await res.text()}`);
    const batch = await res.json();
    if (!batch.length) break;
    articles.push(...batch);
    if (batch.length < 100) break;
    page++;
  }
  return articles;
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const superAdmin = await User.findOne({ role: 'super_admin' });
  if (!superAdmin) { console.error('Super admin not found'); process.exit(1); }

  const articles = await fetchAllMyArticles();
  console.log(`Fetched ${articles.length} published articles from your Dev.to account`);

  let created = 0;
  let updated = 0;

  for (const a of articles) {
    const externalId = String(a.id);
    const title = (a.title || '').trim().slice(0, 200);
    const description = (a.description || '').trim();
    const link = a.url || a.canonical_url || '';
    const coverImage = a.cover_image || a.social_image || '';
    const tags = Array.isArray(a.tag_list) ? a.tag_list : [];
    const category = mapToCategory(title, description);
    const content = description + `\n\n**Read full article:** [${link}](${link})`;

    const existing = await Blog.findOne({ source: 'devto', externalId });
    if (existing) {
      // Update and mark featured
      await Blog.updateOne(
        { _id: existing._id },
        {
          $set: {
            title,
            excerpt: description.slice(0, 300),
            shortDescription: description.slice(0, 500),
            category,
            coverImage: coverImage || existing.coverImage,
            tags: ['Dev.to', ...tags].filter(Boolean),
            isFeatured: true,
            isPublished: true,
            externalLink: link,
          },
        }
      );
      updated++;
      console.log(`Updated [featured] [${category}]: ${title.slice(0, 60)}`);
    } else {
      await Blog.create({
        title,
        content,
        excerpt: description.slice(0, 300),
        shortDescription: description.slice(0, 500),
        category,
        coverImage,
        tags: ['Dev.to', ...tags].filter(Boolean),
        author: superAdmin._id,
        isPublished: true,
        isFeatured: true,
        source: 'devto',
        externalId,
        externalLink: link,
      });
      created++;
      console.log(`Created [featured] [${category}]: ${title.slice(0, 60)}`);
    }
  }

  console.log(`\nDone! Created: ${created} | Updated/Featured: ${updated} | Total: ${articles.length}`);
  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
