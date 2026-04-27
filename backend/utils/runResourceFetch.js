/**
 * Shared logic for fetching external resources and saving to DB.
 * Used by both the API controller and the daily cron.
 */
import Resource from '../models/Resource.js';
import User from '../models/User.js';
import { fetchAllExternalResources } from '../services/resourceFetchService.js';

/**
 * Fetch resources from Dev.to, freeCodeCamp, Hashnode, YouTube, Medium, Hacker News.
 * All saved with Super Admin as postedBy.
 */
export async function runExternalResourceFetch(opts = {}) {
  const superAdmin = await User.findOne({ role: 'super_admin' });
  if (!superAdmin) {
    throw new Error('Super Admin user not found. Run npm run seed first.');
  }

  const results = await fetchAllExternalResources(opts);
  let created = 0;
  let skipped = 0;

  const all = [
    ...results.devto,
    ...results.myDevto,
    ...results.medium,
  ];

  const syncErrors = [...(results.errors || [])];

  for (const raw of all) {
    try {
      const { externalId, source, ...data } = raw;
      if (!data.link || !data.title) continue;

      // external records: match by source+externalId; manual/no-id: match by link
      const dupQuery = externalId
        ? { source, externalId }
        : { link: data.link };

      const exists = await Resource.findOne(dupQuery);
      if (exists) {
        // Backfill bodyHtml for existing records that were fetched before this field existed
        if (data.bodyHtml && !exists.bodyHtml) {
          await Resource.updateOne({ _id: exists._id }, { $set: { bodyHtml: data.bodyHtml } });
        }
        skipped++;
        continue;
      }

      await Resource.create({
        ...data,
        postedBy: superAdmin._id,
        source,
        externalId,
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

  return {
    created,
    skipped,
    devtoFetched: results.devto.length,
    mediumFetched: results.medium.length,
    errors: syncErrors,
  };
}
