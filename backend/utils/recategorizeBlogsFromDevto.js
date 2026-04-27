/**
 * One-time script: Re-fetch Dev.to tag_list for existing blogs and re-assign categories.
 * Run: node backend/utils/recategorizeBlogsFromDevto.js
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

import Blog from '../models/Blog.js';

const CAREER_TAGS = ['career', 'job', 'jobs', 'resume', 'job-hunting', 'job-search', 'employment', 'productivity', 'work', 'soft-skills', 'leadership', 'freelancing'];
const INTERVIEW_TAGS = ['interview', 'interview-prep', 'interviews', 'coding-interview', 'system-design', 'leetcode', 'dsa', 'algorithms', 'data-structures'];
const TUTORIAL_TAGS = ['tutorial', 'beginners', 'howto', 'how-to', 'guide', 'learn', 'learning', 'project', 'build', 'codenewbie', '100daysofcode'];
const NEWS_TAGS = ['news', 'announcement', 'release', 'opensource', 'community', 'devops', 'ai', 'machinelearning', 'showdev'];

function mapTagsToCategory(tags = []) {
  const lower = tags.map(t => t.toLowerCase().replace(/\s+/g, '-'));
  if (lower.some(t => INTERVIEW_TAGS.includes(t))) return 'Interview Guide';
  if (lower.some(t => CAREER_TAGS.includes(t))) return 'Career Tips';
  if (lower.some(t => TUTORIAL_TAGS.includes(t))) return 'Tutorial';
  if (lower.some(t => NEWS_TAGS.includes(t))) return 'News';
  return 'Tech Blog';
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Get all devto blogs
  const blogs = await Blog.find({ source: 'devto', externalId: { $exists: true, $ne: '' } });
  console.log(`Found ${blogs.length} Dev.to blogs`);

  let updated = 0;
  let failed = 0;

  // Process in batches of 10 to avoid rate limit
  const BATCH = 10;
  for (let i = 0; i < blogs.length; i += BATCH) {
    const batch = blogs.slice(i, i + BATCH);
    await Promise.all(batch.map(async (blog) => {
      try {
        const res = await fetch(`https://dev.to/api/articles/${blog.externalId}`);
        if (!res.ok) { failed++; return; }
        const data = await res.json();
        const tagList = Array.isArray(data.tag_list) ? data.tag_list : [];
        const category = mapTagsToCategory(tagList);
        if (category !== blog.category) {
          await Blog.updateOne({ _id: blog._id }, { $set: { category, tags: [blog.source === 'devto' ? 'Dev.to' : 'Medium', ...tagList].filter(Boolean) } });
          updated++;
          console.log(`Updated [${category}]: ${blog.title.slice(0, 60)}`);
        }
      } catch (_) {
        failed++;
      }
    }));
    // Small delay between batches
    if (i + BATCH < blogs.length) await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\nDone. Updated: ${updated}, Failed/skipped: ${failed}`);
  await mongoose.disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
