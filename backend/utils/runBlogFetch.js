/**
 * Fetch tech blogs from Dev.to and Medium only. Save to Blog (Tech Blog page).
 * Super Admin as author. Cover image required - shown on each blog.
 */
import Blog from '../models/Blog.js';
import User from '../models/User.js';
import { fetchAllBlogSources } from '../services/blogFetchService.js';

// Map title + description → EduLumix category
const INTERVIEW_KEYWORDS = ['interview', 'coding interview', 'system design', 'leetcode', 'dsa', 'data structure', 'algorithm', 'cracking', 'faang', 'placement'];
const CAREER_KEYWORDS = ['career', 'job hunt', 'job search', 'resume', 'cv ', 'cover letter', 'linkedin', 'salary', 'negotiat', 'promotion', 'freelanc', 'remote work', 'soft skill', 'productivity', 'self-taught'];
const TUTORIAL_KEYWORDS = ['tutorial', 'how to ', 'how-to', 'build a ', 'build an ', 'getting started', 'beginner', 'step by step', 'introduction to', 'learn ', 'guide to', 'complete guide', 'crash course', 'from scratch', '100 days'];
const NEWS_KEYWORDS = ['release', 'launched', 'announcing', 'announcement', 'new in ', 'changelog', 'version ', 'open source', 'news', 'trend', 'state of ', 'survey', '2024', '2025', '2026'];

function mapTagsToCategory(tags = [], title = '', description = '') {
  const text = (title + ' ' + description).toLowerCase();
  if (INTERVIEW_KEYWORDS.some(k => text.includes(k))) return 'Interview Guide';
  if (CAREER_KEYWORDS.some(k => text.includes(k))) return 'Career Tips';
  if (TUTORIAL_KEYWORDS.some(k => text.includes(k))) return 'Tutorial';
  if (NEWS_KEYWORDS.some(k => text.includes(k))) return 'News';
  return 'Tech Blog';
}

export async function runExternalBlogFetch(opts = {}) {
  const superAdmin = await User.findOne({ role: 'super_admin' });
  if (!superAdmin) throw new Error('Super Admin user not found. Run npm run seed first.');

  const results = await fetchAllBlogSources(opts);
  const all = [...results.devto, ...results.medium];

  let created = 0;
  let skipped = 0;

  for (const raw of all) {
    const exists = await Blog.findOne({ source: raw.source, externalId: raw.externalId });
    if (exists) { skipped++; continue; }
    if (!raw.link || !raw.title) continue;

    const content = (raw.description || raw.title) + `\n\n**Read full article:** [${raw.link}](${raw.link})`;
    const category = mapTagsToCategory(raw.tags || [], raw.title, raw.description || '');
    await Blog.create({
      title: raw.title.slice(0, 200),
      content,
      excerpt: (raw.description || raw.title).slice(0, 300),
      shortDescription: (raw.description || raw.title).slice(0, 500),
      category,
      coverImage: raw.coverImage || '',
      tags: [raw.subcategory].filter(Boolean),
      author: superAdmin._id,
      isPublished: true,
      source: raw.source,
      externalId: raw.externalId,
      externalLink: raw.link,
    });
    created++;
  }

  return {
    created,
    skipped,
    totalFetched: all.length,
    errors: results.errors,
  };
}

/**
 * Delete all previously fetched blogs (only devto, medium) - keeps manual blogs
 */
export async function deleteFetchedBlogs() {
  const result = await Blog.deleteMany({ source: { $in: ['devto', 'medium'] } });
  return { deleted: result.deletedCount };
}
