import Resource from '../models/Resource.js';
import User from '../models/User.js';
import { runExternalResourceFetch } from '../utils/runResourceFetch.js';

const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const RESOURCE_CATEGORY_KEYS = [
  'Software Notes',
  'Interview Notes',
  'Tools & Technology',
  'Trending Technology',
  'Video Resources',
  'Software Project',
  'Hardware Project',
];

// Helper: Extract Medium article full HTML via live RSS fetch
async function fetchMediumBodyHtmlLive(articleLink) {
  try {
    const url = new URL(articleLink);
    let feedUrl;
    if (url.hostname !== 'medium.com' && url.hostname.endsWith('.medium.com')) {
      feedUrl = `https://${url.hostname}/feed`;
    } else {
      const parts = url.pathname.replace(/^\//, '').split('/');
      if (!parts[0]) return null;
      feedUrl = `https://medium.com/feed/${parts[0]}`;
    }
    const res = await fetch(feedUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; EduLumix/1.0 RSS reader)' },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const xml = await res.text();
    const normalLink = articleLink.split('?')[0].replace(/\/$/, '');
    const slug = normalLink.split('/').pop();
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
      const item = match[1];
      if (!item.includes(slug)) continue;
      const contentMatch = item.match(/<content:encoded>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content:encoded>/);
      if (contentMatch) return contentMatch[1].trim();
    }
    return null;
  } catch (_) {
    return null;
  }
}

// @desc    Get full article content from source (Dev.to / Medium proxy)
// @route   GET /api/resources/:id/full-content
// @access  Public
export const getFullContent = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).lean();
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
    if (resource.isDeleted) return res.status(404).json({ success: false, message: 'Resource not found' });

    // Dev.to — fetch full article HTML live via externalId (always fresh)
    if (resource.source === 'devto' && resource.externalId) {
      const apiKey = process.env.DEVTO_API_KEY;
      const headers = { 'Accept': 'application/vnd.forem.api-v1+json' };
      if (apiKey) headers['api-key'] = apiKey;

      const r = await fetch(`https://dev.to/api/articles/${resource.externalId}`, { headers });
      if (!r.ok) throw new Error(`Dev.to API error: ${r.status}`);
      const article = await r.json();

      return res.json({
        success: true,
        data: {
          bodyHtml: article.body_html || '',
          readingTimeMinutes: article.reading_time_minutes || null,
          tags: article.tag_list || [],
          reactions: article.positive_reactions_count || 0,
          commentsCount: article.comments_count || 0,
          publishedAt: article.published_at || null,
          author: {
            name: article.user?.name || '',
            username: article.user?.username || '',
            avatar: article.user?.profile_image || '',
          },
        },
      });
    }

    // Medium — always try live RSS fetch from author's feed for full content
    // (tag-feed RSS only stores a truncated preview, author-feed usually has more)
    if (resource.source === 'medium') {
      const liveHtml = await fetchMediumBodyHtmlLive(resource.link);

      if (liveHtml) {
        // If live content is better than what's stored, update DB in background
        if (!resource.bodyHtml || liveHtml.length > resource.bodyHtml.length) {
          Resource.updateOne({ _id: resource._id }, { $set: { bodyHtml: liveHtml } }).catch(() => {});
        }
        return res.json({
          success: true,
          data: {
            bodyHtml: liveHtml,
            readingTimeMinutes: null,
            tags: resource.tags || [],
            reactions: 0,
            commentsCount: 0,
            publishedAt: resource.createdAt || null,
            author: null,
          },
        });
      }

      // Live fetch failed — fall back to whatever is stored in DB
      if (resource.bodyHtml) {
        return res.json({
          success: true,
          data: {
            bodyHtml: resource.bodyHtml,
            readingTimeMinutes: null,
            tags: resource.tags || [],
            reactions: 0,
            commentsCount: 0,
            publishedAt: resource.createdAt || null,
            author: null,
          },
        });
      }

      // Nothing available — return null so frontend shows description + Read on Medium CTA
      return res.json({ success: true, data: null });
    }

    // manual / other — no full content available
    return res.json({ success: true, data: null });
  } catch (error) {
    console.error('getFullContent error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Fetch resources from Dev.to, freeCodeCamp, Hashnode, YouTube (Super Admin only)
// @route   POST /api/resources/fetch-external
// @access  Private (super_admin only)
export const fetchExternalResources = async (req, res) => {
  try {
    const opts = req.body || {};
    const data = await runExternalResourceFetch(opts);
    res.status(200).json({
      success: true,
      message: 'External resources fetched and stored',
      data,
    });
  } catch (error) {
    console.error('fetchExternalResources error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all resources (public, super_admin sees all including deleted)
// @route   GET /api/resources
// @access  Public (optionalAuth for super_admin)
export const getResources = async (req, res) => {
  try {
    const {
      category,
      subcategory,
      search,
      page = 1,
      limit = 12,
      source,
      isVideo,
      postedBy,
    } = req.query;

    const query = {};

    // Public/contributors should not see soft-deleted resources
    // Super admin can see all resources (including soft-deleted)
    if (!req.user || req.user.role !== 'super_admin') {
      query.isDeleted = { $ne: true }; // Show posts where isDeleted is false OR doesn't exist
    }

    if (category && category !== 'All') query.category = category;
    const subTrim = subcategory && String(subcategory).trim();
    if (subTrim && subTrim !== 'All') query.subcategory = subTrim;
    if (source && source !== 'All') query.source = source;
    if (postedBy && req.user?.role === 'super_admin') query.postedBy = postedBy;
    if (isVideo === 'true') query.isVideo = true;
    if (isVideo === 'false') query.isVideo = false;

    const searchTrim = search && String(search).trim().slice(0, 120);
    if (searchTrim) {
      const rx = new RegExp(escapeRegex(searchTrim), 'i');
      query.$or = [{ title: { $regex: rx } }, { description: { $regex: rx } }];
    }

    const lim = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 100);
    const pg = Math.max(parseInt(page, 10) || 1, 1);

    const resources = await Resource.find(query)
      .populate('postedBy', 'name email avatar role')
      .sort({ createdAt: -1 })
      .limit(lim)
      .skip((pg - 1) * lim);

    const total = await Resource.countDocuments(query);

    res.status(200).json({
      success: true,
      count: resources.length,
      total,
      totalPages: Math.ceil(total / lim) || 1,
      currentPage: pg,
      data: resources,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Distinct values for resource listing filters
// @route   GET /api/resources/filter-options
// @access  Public
export const getResourceFilterOptions = async (req, res) => {
  try {
    const base =
      !req.user || req.user.role !== 'super_admin' ? { isDeleted: { $ne: true } } : {};

    const [rawSubs, sourcesInDb] = await Promise.all([
      Resource.distinct('subcategory', base),
      Resource.distinct('source', base),
    ]);

    const subSet = new Set();
    for (const s of rawSubs) {
      const t = String(s || '').trim();
      if (t) subSet.add(t);
    }
    const subcategories = [...subSet].sort((a, b) => a.localeCompare(b, 'en')).slice(0, 200);

    const sourceOrder = [
      'manual',
      'youtube',
      'devto',
      'freecodecamp',
      'hashnode',
      'medium',
      'hackernews',
    ];
    const sources = sourceOrder.filter((s) => sourcesInDb.includes(s));
    for (const s of sourcesInDb.sort()) {
      if (!sources.includes(s)) sources.push(s);
    }

    res.status(200).json({
      success: true,
      data: {
        categories: RESOURCE_CATEGORY_KEYS,
        subcategories,
        sources,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get resources grouped by category
// @route   GET /api/resources/grouped
// @access  Public
export const getResourcesGrouped = async (req, res) => {
  try {
    const categories = [
      'Software Notes',
      'Interview Notes',
      'Tools & Technology',
      'Trending Technology',
      'Video Resources',
      'Software Project',
      'Hardware Project',
    ];

    const groupedResources = {};

    const baseQuery = { isDeleted: { $ne: true } };
    for (const category of categories) {
      const resources = await Resource.find({ ...baseQuery, category })
        .populate('postedBy', 'name email avatar role')
        .sort({ createdAt: -1 })
        .limit(8);

      if (resources.length > 0) {
        groupedResources[category] = {
          resources,
          total: await Resource.countDocuments({ ...baseQuery, category }),
        };
      }
    }

    res.status(200).json({
      success: true,
      data: groupedResources,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single resource
// @route   GET /api/resources/:id
// @access  Public
export const getResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).populate('postedBy', 'name email avatar role');
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    if (resource.isDeleted && (!req.user || req.user.role !== 'super_admin')) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    res.status(200).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    // Handle invalid MongoDB ObjectId format
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create resource
// @route   POST /api/resources
// @access  Private (resource_poster, super_admin)
export const createResource = async (req, res) => {
  try {
    // Check if link is YouTube
    const link = req.body.link || '';
    const isVideo = link.includes('youtube.com') || link.includes('youtu.be');

    const resourceData = {
      ...req.body,
      isVideo,
      postedBy: req.user.id,
    };

    const resource = await Resource.create(resourceData);

    // Add 1 point to user (except super_admin)
    if (req.user.role !== 'super_admin') {
      try {
        const updatedUser = await User.findByIdAndUpdate(
          req.user.id, 
          { $inc: { points: 1 } },
          { new: true, runValidators: true }
        );
        console.log(`Points updated for user ${req.user.id}: ${updatedUser.points}`);
      } catch (pointsError) {
        console.error('Error updating points:', pointsError);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Resource uploaded successfully. You earned 1 point!',
      data: resource,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update resource
// @route   PUT /api/resources/:id
// @access  Private (owner or super_admin)
export const updateResource = async (req, res) => {
  try {
    let resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    // Check ownership
    if (resource.postedBy.toString() !== req.user.id && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this resource',
      });
    }

    // Whitelist updatable fields (prevent override of postedBy, likes, downloads, etc.)
    const allowedFields = ['title', 'category', 'subcategory', 'link', 'description', 'thumbnail'];
    const updateData = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    }
    if (updateData.link) {
      updateData.isVideo = updateData.link.includes('youtube.com') || updateData.link.includes('youtu.be');
    }

    resource = await Resource.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Resource updated successfully',
      data: resource,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete resource
// @route   DELETE /api/resources/:id
// @access  Private (owner or super_admin)
export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    // Check ownership
    if (resource.postedBy.toString() !== req.user.id && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this resource',
      });
    }

    // Super admin: Permanently delete
    if (req.user.role === 'super_admin') {
      await Resource.findByIdAndDelete(req.params.id);
      
      return res.status(200).json({
        success: true,
        message: 'Resource permanently deleted',
      });
    }

    // Contributor: Soft delete (mark as deleted)
    resource.isDeleted = true;
    resource.deletedAt = new Date();
    await resource.save();

    // Deduct 1 point from user (except super_admin)
    if (req.user.role !== 'super_admin') {
      try {
        const updatedUser = await User.findByIdAndUpdate(
          resource.postedBy, 
          { $inc: { points: -1 } },
          { new: true, runValidators: true }
        );
        // Ensure points don't go below 0
        if (updatedUser.points < 0) {
          await User.findByIdAndUpdate(resource.postedBy, { points: 0 });
        }
        console.log(`Points deducted for user ${resource.postedBy}: ${updatedUser.points}`);
      } catch (pointsError) {
        console.error('Error updating points:', pointsError);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Resource deleted successfully. 1 point deducted.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Like resource
// @route   PUT /api/resources/:id/like
// @access  Public
export const likeResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    resource.likes += 1;
    await resource.save();

    res.status(200).json({
      success: true,
      likes: resource.likes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Increment download count
// @route   PUT /api/resources/:id/download
// @access  Public
export const incrementDownload = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    resource.downloads += 1;
    await resource.save();

    res.status(200).json({
      success: true,
      downloads: resource.downloads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get my posted resources
// @route   GET /api/resources/my-resources
// @access  Private
export const getMyResources = async (req, res) => {
  try {
    // Contributors should not see their soft-deleted resources
    const resources = await Resource.find({ postedBy: req.user.id, isDeleted: { $ne: true } })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: resources.length,
      data: resources,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
