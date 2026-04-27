/**
 * Resource Fetch Service - Fetches resources from Dev.to, freeCodeCamp, Hashnode, YouTube,
 * Medium, Hacker News. All posts saved with Super Admin credentials.
 */

import Parser from 'rss-parser';

const MAX_DESC = 1000;

// Map tags/labels to Resource category enum
const mapCategory = (tags, title = '') => {
  const t = `${(tags || '').toLowerCase()} ${(title || '').toLowerCase()}`;
  if (/interview|job|hiring/.test(t)) return 'Interview Notes';
  if (/tool|vscode|api|docker|git/.test(t)) return 'Tools & Technology';
  if (/ai|blockchain|cloud|trend/.test(t)) return 'Trending Technology';
  if (/video|tutorial|course|learn/.test(t)) return 'Video Resources';
  if (/project|portfolio|build/.test(t)) return 'Software Project';
  if (/hardware|iot|arduino/.test(t)) return 'Hardware Project';
  return 'Software Notes';
};

const truncate = (s, max = MAX_DESC) => {
  if (!s || typeof s !== 'string') return '';
  const clean = s.replace(/\s+/g, ' ').trim();
  return clean.length <= max ? clean : clean.slice(0, max - 3) + '...';
};

/**
 * Fetch articles from Dev.to public feed
 */
export async function fetchFromDevTo(limit = 400) {
  const topics = [
    'javascript', 'python', 'webdev', 'programming', 'react',
    'node', 'typescript', 'css', 'html', 'beginners',
    'tutorial', 'career', 'productivity', 'opensource', 'devops',
    'docker', 'aws', 'database', 'sql', 'api',
    'git', 'linux', 'security', 'testing', 'ai',
  ];
  const seen = new Set();
  const resources = [];
  const perPage = 30;

  for (const tag of topics) {
    if (resources.length >= limit) break;
    for (let page = 1; page <= 3; page++) {
      if (resources.length >= limit) break;
      try {
        const url = `https://dev.to/api/articles?tag=${tag}&per_page=${perPage}&page=${page}&state=fresh`;
        const res = await fetch(url);
        if (!res.ok) break;
        const articles = await res.json();
        if (!articles || articles.length === 0) break;

        for (const a of articles) {
          if (resources.length >= limit) break;
          const eid = String(a.id);
          if (seen.has(eid)) continue;
          seen.add(eid);
          const tags = Array.isArray(a.tag_list) ? a.tag_list.join(', ') : (a.tags || '');
          resources.push({
            externalId: eid,
            source: 'devto',
            title: (a.title || '').trim().slice(0, 150) || 'Untitled',
            category: mapCategory(tags, a.title),
            subcategory: 'Dev.to',
            link: a.url || a.canonical_url || '',
            description: truncate(a.description || a.title),
            thumbnail: a.cover_image || a.social_image || '',
            isVideo: false,
          });
        }
        if (articles.length < perPage) break;
      } catch (_) { break; }
    }
  }
  return resources;
}

/**
 * Fetch MY OWN published articles from Dev.to using personal API key.
 * Returns all published posts by the authenticated user.
 */
export async function fetchMyDevToPosts(apiKey) {
  if (!apiKey) throw new Error('DEVTO_API_KEY not set');
  const resources = [];
  let page = 1;
  const perPage = 30;

  while (true) {
    const url = `https://dev.to/api/articles/me/published?per_page=${perPage}&page=${page}`;
    const res = await fetch(url, {
      headers: { 'api-key': apiKey, 'Accept': 'application/vnd.forem.api-v1+json' },
    });
    if (!res.ok) throw new Error(`Dev.to personal API error: ${res.status}`);

    const articles = await res.json();
    if (!articles || articles.length === 0) break;

    for (const a of articles) {
      const tags = Array.isArray(a.tag_list) ? a.tag_list.join(', ') : (a.tags || '');
      resources.push({
        externalId: String(a.id),
        source: 'devto',
        title: (a.title || '').trim().slice(0, 150) || 'Untitled',
        category: mapCategory(tags, a.title),
        subcategory: 'Dev.to',
        link: a.url || a.canonical_url || '',
        description: truncate(a.description || a.title),
        thumbnail: a.cover_image || a.social_image || '',
        isVideo: false,
      });
    }

    if (articles.length < perPage) break; // last page
    page++;
  }

  return resources;
}

/**
 * Fetch articles from freeCodeCamp News (via Hashnode - freeCodeCamp migrated from Ghost)
 */
export async function fetchFromFreeCodeCamp(first = 15) {
  const query = `query GetPosts($host: String!, $first: Int!) {
    publication(host: $host) {
      posts(first: $first) {
        edges {
          node {
            id
            title
            url
            brief
            coverImage { url }
          }
        }
      }
    }
  }`;

  const res = await fetch('https://gql.hashnode.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      variables: { host: 'freecodecamp.org', first },
    }),
  });

  if (!res.ok) throw new Error(`freeCodeCamp (Hashnode) API error: ${res.status}`);

  const json = await res.json();
  const edges = json?.data?.publication?.posts?.edges || [];
  const resources = [];

  for (const { node } of edges) {
    if (!node?.id || !node?.url) continue;
    resources.push({
      externalId: node.id,
      source: 'freecodecamp',
      title: (node.title || '').trim().slice(0, 150) || 'Untitled',
      category: mapCategory('', node.title),
      subcategory: 'freeCodeCamp',
      link: node.url,
      description: truncate(node.brief || node.title),
      thumbnail: node.coverImage?.url || '',
      isVideo: false,
    });
  }

  return resources;
}

/**
 * Fetch posts from Hashnode (GraphQL)
 */
export async function fetchFromHashnode(first = 15) {
  const query = `query GetPosts($host: String!, $first: Int!) {
    publication(host: $host) {
      posts(first: $first) {
        edges {
          node {
            id
            title
            url
            brief
            coverImage { url }
          }
        }
      }
    }
  }`;

  const res = await fetch('https://gql.hashnode.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      variables: { host: 'hashnode.dev', first },
    }),
  });

  if (!res.ok) throw new Error(`Hashnode API error: ${res.status}`);

  const json = await res.json();
  const edges = json?.data?.publication?.posts?.edges || [];
  const resources = [];

  for (const { node } of edges) {
    if (!node?.id || !node?.url) continue;
    resources.push({
      externalId: node.id,
      source: 'hashnode',
      title: (node.title || '').trim().slice(0, 150) || 'Untitled',
      category: mapCategory('', node.title),
      subcategory: 'Hashnode',
      link: node.url,
      description: truncate(node.brief || node.title),
      thumbnail: node.coverImage?.url || '',
      isVideo: false,
    });
  }

  return resources;
}

/**
 * Fetch educational videos from YouTube Data API v3
 */
export async function fetchFromYouTube(maxResults = 10) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return [];

  const queries = ['programming tutorial', 'web development tutorial', 'coding interview'];
  const seen = new Set();
  const resources = [];

  for (const q of queries) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(q)}&maxResults=${Math.min(5, maxResults)}&key=${apiKey}&order=date&relevanceLanguage=en`;
    const res = await fetch(url);
    if (!res.ok) {
      continue;
    }

    const data = await res.json();
    const items = data.items || [];

    for (const item of items) {
      const vid = item.id?.videoId;
      if (!vid || seen.has(vid)) continue;
      seen.add(vid);

      const s = item.snippet || {};
      const videoUrl = `https://www.youtube.com/watch?v=${vid}`;
      const thumb = s.thumbnails?.maxres?.url || s.thumbnails?.high?.url || s.thumbnails?.default?.url || '';

      resources.push({
        externalId: vid,
        source: 'youtube',
        title: (s.title || '').trim().slice(0, 150) || 'Untitled',
        category: 'Video Resources',
        subcategory: 'YouTube',
        link: videoUrl,
        description: truncate(s.description || s.title),
        thumbnail: thumb,
        isVideo: true,
      });
    }
  }

  return resources.slice(0, maxResults);
}

/**
 * Fetch tech articles from Medium via RSS (no API key)
 */
export async function fetchFromMedium(limit = 120) {
  const parser = new Parser();
  const tags = [
    'javascript', 'programming', 'web-development', 'software-development', 'react',
    'python', 'nodejs', 'typescript', 'css', 'html',
    'machine-learning', 'artificial-intelligence', 'data-science', 'cloud-computing', 'devops',
    'docker', 'kubernetes', 'api', 'database', 'security',
    'career', 'productivity', 'open-source', 'git', 'interview',
  ];
  const seen = new Set();
  const resources = [];

  for (const tag of tags) {
    if (resources.length >= limit) break;
    try {
      const feed = await parser.parseURL(`https://medium.com/feed/tag/${tag}`);
      const items = feed?.items || [];
      for (const item of items) {
        if (resources.length >= limit) break;
        const guid = item.guid || item.link;
        if (!guid || seen.has(guid)) continue;
        seen.add(guid);
        const link = item.link || item.guid || '';
        if (!link || !item.title) continue;
        resources.push({
          externalId: (guid || link).slice(0, 200),
          source: 'medium',
          title: (item.title || '').trim().slice(0, 150) || 'Untitled',
          category: mapCategory(item.categories?.join?.() || '', item.title),
          subcategory: 'Medium',
          link,
          description: truncate(item.contentSnippet || item.title),
          bodyHtml: typeof item.content === 'string' ? item.content : '',
          thumbnail: item.enclosure?.url || item.thumbnail || '',
          isVideo: false,
        });
      }
    } catch (_) {}
  }
  return resources;
}

/**
 * Fetch top stories from Hacker News (no API key)
 */
export async function fetchFromHackerNews(limit = 15) {
  const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
  if (!res.ok) throw new Error(`Hacker News API error: ${res.status}`);

  const ids = await res.json();
  const resources = [];
  const techKeywords = /javascript|python|react|node|api|code|programming|developer|software|startup|tech|web|ai|ml|data/i;

  for (let i = 0; i < Math.min(ids.length, 50) && resources.length < limit; i++) {
    try {
      const itemRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${ids[i]}.json`);
      if (!itemRes.ok) continue;
      const item = await itemRes.json();
      if (!item || item.deleted || item.type !== 'story' || !item.url) continue;
      if (!techKeywords.test((item.title || '') + (item.url || ''))) continue;

      resources.push({
        externalId: String(item.id),
        source: 'hackernews',
        title: (item.title || '').trim().slice(0, 150) || 'Untitled',
        category: mapCategory('', item.title),
        subcategory: 'Hacker News',
        link: item.url,
        description: truncate(item.title),
        thumbnail: '',
        isVideo: false,
      });
    } catch (_) {}
  }
  return resources;
}

/**
 * Fetch from all sources
 */
/**
 * Only Dev.to and Medium are active sources.
 * My personal Dev.to posts are also included via API key.
 * freecodecamp, hashnode, youtube, hackernews have been disabled.
 */
export async function fetchAllExternalResources(opts = {}) {
  const apiKey = process.env.DEVTO_API_KEY;

  const results = {
    devto: [],
    myDevto: [],
    medium: [],
    errors: [],
  };

  try {
    results.devto = await fetchFromDevTo(400);
  } catch (e) {
    results.errors.push({ source: 'devto', message: e.message });
  }

  if (apiKey) {
    try {
      results.myDevto = await fetchMyDevToPosts(apiKey);
    } catch (e) {
      results.errors.push({ source: 'myDevto', message: e.message });
    }
  }

  try {
    results.medium = await fetchFromMedium(120);
  } catch (e) {
    results.errors.push({ source: 'medium', message: e.message });
  }

  return results;
}
