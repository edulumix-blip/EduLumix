/**
 * Job Fetch Service - Fetches jobs from Adzuna (India) and JSearch APIs
 * and returns normalized job objects for MongoDB storage.
 */

// Map Adzuna/JSearch category labels to our schema
const mapCategory = (label) => {
  if (!label) return 'Non IT Job';
  const l = String(label).toLowerCase();
  if (l.includes('it') || l.includes('tech') || l.includes('software') || l.includes('developer')) return 'IT Job';
  if (l.includes('government') || l.includes('govt') || l.includes('gov')) return 'Govt Job';
  if (l.includes('remote') || l.includes('work from home')) return 'Remote Job';
  if (l.includes('intern') || l.includes('trainee')) return 'Internship';
  if (l.includes('part') || l.includes('contract') || l.includes('temporary')) return 'Part Time Job';
  if (l.includes('walk') || l.includes('walk-in') || l.includes('drive')) return 'Walk In Drive';
  return 'Non IT Job';
};

const JOB_SEARCH_QUERY = process.env.JOB_FETCH_QUERY || 'jobs in India';

const bucketFromYears = (years) => {
  if (!Number.isFinite(years) || years <= 0) return 'Fresher';
  if (years <= 1) return '1 Year';
  if (years <= 2) return '2 Years';
  if (years <= 3) return '3 Years';
  if (years <= 4) return '4 Years';
  return '5+ Years';
};

const inferExperienceFromText = (...parts) => {
  const text = parts
    .filter(Boolean)
    .map((p) => String(p).toLowerCase())
    .join(' ')
    .replace(/\s+/g, ' ');

  if (!text) return 'Fresher';

  if (/(freshers?|entry[ -]?level|no experience|0\s*(?:-|to)\s*1\s*(years?|yrs?))/i.test(text)) {
    return 'Fresher';
  }

  const yearCandidates = [];

  for (const m of text.matchAll(/(\d{1,2})\s*[-to]{1,3}\s*(\d{1,2})\s*\+?\s*(years?|yrs?|y)\b/g)) {
    yearCandidates.push(Number.parseInt(m[2], 10));
  }
  for (const m of text.matchAll(/(\d{1,2})\s*\+\s*(years?|yrs?|y)\b/g)) {
    yearCandidates.push(Number.parseInt(m[1], 10));
  }
  for (const m of text.matchAll(/(?:minimum|min)\s*(\d{1,2})\s*(years?|yrs?|y)\b/g)) {
    yearCandidates.push(Number.parseInt(m[1], 10));
  }
  for (const m of text.matchAll(/(?:experience|exp)\s*(?:of|:)?\s*(\d{1,2})\s*(years?|yrs?|y)?\b/g)) {
    yearCandidates.push(Number.parseInt(m[1], 10));
  }

  const maxYears = yearCandidates
    .filter((n) => Number.isFinite(n) && n >= 0)
    .reduce((max, n) => Math.max(max, n), -1);

  return bucketFromYears(maxYears);
};

const inferJSearchExperience = (record) => {
  const months = Number.parseFloat(record?.job_required_experience?.required_experience_in_months);
  if (Number.isFinite(months) && months >= 0) {
    return bucketFromYears(Math.ceil(months / 12));
  }
  return inferExperienceFromText(
    record?.job_title,
    record?.job_description,
    record?.job_highlights?.Qualifications,
    record?.job_employment_type
  );
};

/**
 * Fetch jobs from Adzuna India API
 * @param {number} resultsPerPage
 * @returns {Promise<Array>} Normalized job objects
 */
export async function fetchFromAdzuna(resultsPerPage = 20) {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    throw new Error('ADZUNA_APP_ID and ADZUNA_APP_KEY must be set in .env');
  }

  const jobs = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const url = `https://api.adzuna.com/v1/api/jobs/in/search/${page}?app_id=${appId}&app_key=${appKey}&results_per_page=${resultsPerPage}&content-type=application/json`;
    const res = await fetch(url);

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Adzuna API error: ${res.status} - ${errText}`);
    }

    const data = await res.json();
    const results = data.results || [];

    for (const r of results) {
      jobs.push({
        externalId: r.id,
        source: 'adzuna',
        title: r.title?.trim() || 'Untitled',
        company: r.company?.display_name?.trim() || r.company?.trim() || 'Unknown Company',
        location: r.location?.display_name?.trim() || r.location?.area?.join(', ') || 'India',
        category: mapCategory(r.category?.label || r.category?.tag),
        experience: inferExperienceFromText(r.title, r.description, r.category?.label),
        salary: r.salary_min || r.salary_max ? `${r.salary_min || '?'} - ${r.salary_max || '?'}` : 'Not Disclosed',
        status: 'Open',
        companyLogo: r.company?.logo || '',
        applyLink: r.redirect_url || r.link || '',
        description: r.description?.trim() || r.title || 'Apply via link',
      });
    }

    const count = data.count ?? 0;
    const returned = results.length;
    hasMore = returned > 0 && jobs.length < count && page < 5; // Max 5 pages to avoid rate limits
    page++;
  }

  return jobs;
}

/**
 * Fetch jobs from JSearch API (RapidAPI) - India only
 * @param {number} numPages
 * @returns {Promise<Array>} Normalized job objects
 */
export async function fetchFromJSearch(numPages = 2) {
  const apiKey = process.env.RAPIDAPI_KEY;
  const host = process.env.RAPIDAPI_JSEARCH_HOST || 'jsearch.p.rapidapi.com';

  if (!apiKey) {
    throw new Error('RAPIDAPI_KEY must be set in .env');
  }

  const jobs = [];
  const query = JOB_SEARCH_QUERY;

  for (let page = 1; page <= numPages; page++) {
    const url = `https://${host}/search?query=${encodeURIComponent(query)}&page=${page}&num_pages=1`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': host,
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`JSearch API error: ${res.status} - ${errText}`);
    }

    const data = await res.json();
    const results = data.data || [];

    for (const r of results) {
      const employer = r.employer_name || 'Unknown Company';
      const jobId = r.job_id || r.job_publisher + (r.job_id || '') + r.job_title;

      jobs.push({
        externalId: jobId,
        source: 'jsearch',
        title: r.job_title?.trim() || 'Untitled',
        company: employer,
        location: r.job_city && r.job_country
          ? `${r.job_city}, ${r.job_country}`
          : r.job_country || 'India',
        category: mapCategory(r.job_title || r.job_employment_type),
        experience: inferJSearchExperience(r),
        salary: r.job_min_salary || r.job_max_salary
          ? `${r.job_min_salary || '?'} - ${r.job_max_salary || '?'} ${r.job_salary_currency || 'INR'}`
          : 'Not Disclosed',
        status: 'Open',
        companyLogo: r.employer_logo || '',
        applyLink: r.job_apply_link || r.job_google_link || '',
        description: r.job_description?.trim() || r.job_title || 'Apply via link',
      });
    }
  }

  return jobs;
}

/**
 * Fetch from both APIs and return combined list
 */
export async function fetchAllExternalJobs(adzunaLimit = 20, jsearchPages = 2) {
  const results = { adzuna: [], jsearch: [], errors: [] };

  try {
    results.adzuna = await fetchFromAdzuna(adzunaLimit);
  } catch (e) {
    results.errors.push({ source: 'adzuna', message: e.message });
  }

  try {
    results.jsearch = await fetchFromJSearch(jsearchPages);
  } catch (e) {
    results.errors.push({ source: 'jsearch', message: e.message });
  }

  return results;
}

