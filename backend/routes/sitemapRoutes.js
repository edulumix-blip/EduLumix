import express from 'express';
import Blog from '../models/Blog.js';
import Job from '../models/Job.js';
import Resource from '../models/Resource.js';
import Course from '../models/Course.js';
import MockTest from '../models/MockTest.js';
import DigitalProduct from '../models/DigitalProduct.js';

const router = express.Router();

const BASE = 'https://edulumix.in';

// Static pages
const STATIC_PAGES = [
  { loc: '/', changefreq: 'daily', priority: '1.0' },
  { loc: '/jobs', changefreq: 'daily', priority: '0.9' },
  { loc: '/resources', changefreq: 'daily', priority: '0.9' },
  { loc: '/blog', changefreq: 'daily', priority: '0.9' },
  { loc: '/courses', changefreq: 'weekly', priority: '0.8' },
  { loc: '/mock-test', changefreq: 'weekly', priority: '0.8' },
  { loc: '/digital-products', changefreq: 'weekly', priority: '0.7' },
  { loc: '/about', changefreq: 'monthly', priority: '0.5' },
  { loc: '/contact', changefreq: 'monthly', priority: '0.5' },
  { loc: '/privacy-policy', changefreq: 'yearly', priority: '0.3' },
  { loc: '/terms-of-service', changefreq: 'yearly', priority: '0.3' },
  { loc: '/cookie-policy', changefreq: 'yearly', priority: '0.3' },
  { loc: '/refund-policy', changefreq: 'yearly', priority: '0.3' },
];

function toW3C(date) {
  return date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
}

function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

router.get('/sitemap.xml', async (req, res) => {
  try {
    const [blogs, jobs, resources, courses, mockTests, products] = await Promise.all([
      Blog.find({ isPublished: true, isDeleted: { $ne: true } }, 'slug updatedAt').lean(),
      Job.find({ status: 'Open', isDeleted: { $ne: true } }, '_id updatedAt').lean(),
      Resource.find({ isDeleted: { $ne: true } }, '_id updatedAt').lean(),
      Course.find({ isPublished: true }, 'slug updatedAt').lean(),
      MockTest.find({ isPublished: true }, 'slug updatedAt').lean(),
      DigitalProduct.find({ isAvailable: true }, '_id updatedAt').lean(),
    ]);

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static pages
    for (const p of STATIC_PAGES) {
      xml += `  <url>\n    <loc>${BASE}${p.loc}</loc>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>\n`;
    }

    // Blogs
    for (const b of blogs) {
      if (!b.slug) continue;
      xml += `  <url>\n    <loc>${BASE}/blog/${escapeXml(b.slug)}</loc>\n    <lastmod>${toW3C(b.updatedAt)}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    }

    // Jobs (use _id — frontend route is /jobs/:id)
    for (const j of jobs) {
      xml += `  <url>\n    <loc>${BASE}/jobs/${j._id}</loc>\n    <lastmod>${toW3C(j.updatedAt)}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    }

    // Resources
    for (const r of resources) {
      xml += `  <url>\n    <loc>${BASE}/resources/${r._id}</loc>\n    <lastmod>${toW3C(r.updatedAt)}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
    }

    // Courses
    for (const c of courses) {
      if (!c.slug) continue;
      xml += `  <url>\n    <loc>${BASE}/courses/${escapeXml(c.slug)}</loc>\n    <lastmod>${toW3C(c.updatedAt)}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    }

    // Mock Tests
    for (const m of mockTests) {
      if (!m.slug) continue;
      xml += `  <url>\n    <loc>${BASE}/mock-test/${escapeXml(m.slug)}</loc>\n    <lastmod>${toW3C(m.updatedAt)}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
    }

    // Digital Products
    for (const p of products) {
      xml += `  <url>\n    <loc>${BASE}/digital-products/${p._id}</loc>\n    <lastmod>${toW3C(p.updatedAt)}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.5</priority>\n  </url>\n`;
    }

    xml += `</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.set('Cache-Control', 'public, max-age=3600'); // 1 hour cache
    res.send(xml);
  } catch (error) {
    console.error('Sitemap generation error:', error.message);
    res.status(500).send('Error generating sitemap');
  }
});

export default router;
