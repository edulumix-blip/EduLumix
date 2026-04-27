/**
 * Shared logic for fetching external jobs and saving to DB.
 * Used by both the API controller and the daily cron.
 */
import Job from '../models/Job.js';
import User from '../models/User.js';
import { fetchAllExternalJobs } from '../services/jobFetchService.js';

const STALE_CLOSE_DAYS_RAW = Number.parseInt(process.env.JOB_STALE_CLOSE_DAYS || '7', 10);
const STALE_CLOSE_DAYS = Number.isFinite(STALE_CLOSE_DAYS_RAW) && STALE_CLOSE_DAYS_RAW > 0
  ? STALE_CLOSE_DAYS_RAW
  : 7;

/**
 * Fetch jobs from Adzuna + JSearch and save new ones to DB.
 * @param {number} adzunaLimit - Results per page for Adzuna
 * @param {number} jsearchPages - Number of pages for JSearch
 * @returns {Promise<{created: number, skipped: number, adzunaFetched: number, jsearchFetched: number, errors: Array}>}
 */
export async function runExternalJobFetch(adzunaLimit = 20, jsearchPages = 2) {
  const superAdmin = await User.findOne({ role: 'super_admin' });
  if (!superAdmin) {
    throw new Error('Super Admin user not found. Run npm run seed first.');
  }

  const results = await fetchAllExternalJobs(adzunaLimit, jsearchPages);
  const syncErrors = [...(results.errors || [])];
  let created = 0;
  let skipped = 0;
  let reopened = 0;
  let autoClosed = 0;
  const now = new Date();
  const staleBefore = new Date(now.getTime() - STALE_CLOSE_DAYS * 24 * 60 * 60 * 1000);

  const allJobs = [...results.adzuna, ...results.jsearch];
  const errorSources = new Set((results.errors || []).map((err) => err.source));
  const successfulSources = ['adzuna', 'jsearch'].filter((source) => !errorSources.has(source));

  for (const raw of allJobs) {
    try {
      const { externalId, source, ...jobData } = raw;
      if (!jobData.applyLink || !jobData.title || !jobData.company) continue;

      const exists = await Job.findOne({
        source,
        externalId,
      });

      if (exists) {
        const wasClosed = exists.status === 'Closed';
        Object.assign(exists, {
          ...jobData,
          status: 'Open',
          closedSyncedAt: null,
          lastSeenAt: now,
        });
        await exists.save();
        if (wasClosed) reopened++;
        skipped++;
        continue;
      }

      await Job.create({
        ...jobData,
        status: 'Open',
        postedBy: superAdmin._id,
        source,
        externalId,
        lastSeenAt: now,
      });
      created++;
    } catch (error) {
      syncErrors.push({
        source: raw?.source || 'unknown',
        message: error.message,
        externalId: raw?.externalId || null,
      });
    }
  }

  if (successfulSources.length > 0) {
    const closeResult = await Job.updateMany(
      {
        source: { $in: successfulSources },
        externalId: { $exists: true, $ne: null },
        isDeleted: { $ne: true },
        status: 'Open',
        lastSeenAt: { $ne: null, $lt: staleBefore },
      },
      {
        $set: {
          status: 'Closed',
          closedSyncedAt: now,
        },
      }
    );
    autoClosed = closeResult.modifiedCount || 0;
  }

  return {
    created,
    skipped,
    reopened,
    autoClosed,
    staleCloseDays: STALE_CLOSE_DAYS,
    adzunaFetched: results.adzuna.length,
    jsearchFetched: results.jsearch.length,
    errors: syncErrors,
  };
}
