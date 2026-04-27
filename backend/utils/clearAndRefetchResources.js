/**
 * clearAndRefetchResources.js
 *
 * Deletes all auto-fetched resources (source != 'manual') from the DB,
 * then re-fetches fresh data from Dev.to (public + personal) and Medium.
 *
 * Usage:
 *   node backend/utils/clearAndRefetchResources.js
 *
 * Run from the root EduLumix directory (where backend/.env lives).
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

import Resource from '../models/Resource.js';
import User from '../models/User.js';
import { fetchAllExternalResources } from '../services/resourceFetchService.js';

const MANUAL_SOURCES = ['manual'];

async function main() {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error('❌  MONGO_URI not set in .env');
    process.exit(1);
  }

  console.log('🔌  Connecting to MongoDB…');
  await mongoose.connect(MONGO_URI);
  console.log('✅  Connected.\n');

  // ── 1. Count what we're about to delete ──────────────────────────────
  const toDelete = await Resource.countDocuments({
    source: { $nin: MANUAL_SOURCES },
  });
  console.log(`🗑️   Found ${toDelete} auto-fetched resources (non-manual). Deleting…`);

  const del = await Resource.deleteMany({ source: { $nin: MANUAL_SOURCES } });
  console.log(`✅  Deleted ${del.deletedCount} resources.\n`);

  // ── 2. Find Super Admin ───────────────────────────────────────────────
  const superAdmin = await User.findOne({ role: 'super_admin' });
  if (!superAdmin) {
    console.error('❌  Super Admin not found. Run: node backend/utils/seedSuperAdmin.js first.');
    await mongoose.disconnect();
    process.exit(1);
  }
  console.log(`👤  Using Super Admin: ${superAdmin.email}\n`);

  // ── 3. Fetch fresh resources ──────────────────────────────────────────
  console.log('📡  Fetching resources from Dev.to (public + personal) and Medium…');
  const results = await fetchAllExternalResources({
    devtoLimit: 30,
    myDevtoEnabled: true,
    mediumLimit: 30,
  });

  const all = [
    ...(results.devto || []),
    ...(results.myDevto || []),
    ...(results.medium || []),
  ];

  console.log(`   Dev.to public:   ${results.devto?.length || 0} articles`);
  console.log(`   Dev.to personal: ${results.myDevto?.length || 0} articles`);
  console.log(`   Medium:          ${results.medium?.length || 0} articles`);
  if (results.errors?.length > 0) {
    console.warn(`   ⚠️  Fetch errors: ${results.errors.length}`);
    results.errors.forEach((e) => console.warn(`      – [${e.source}] ${e.message}`));
  }
  console.log(`\n💾  Saving ${all.length} resources to DB…`);

  // ── 4. Upsert into DB ─────────────────────────────────────────────────
  let created = 0;
  let skipped = 0;
  const saveErrors = [];

  for (const raw of all) {
    try {
      const { externalId, source, ...data } = raw;
      if (!data.link || !data.title) { skipped++; continue; }

      const dupQuery = externalId
        ? { source, externalId }
        : { link: data.link };

      const exists = await Resource.findOne(dupQuery);
      if (exists) {
        // Backfill bodyHtml for medium records saved without it
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
    } catch (err) {
      saveErrors.push({ source: raw?.source, title: raw?.title, error: err.message });
    }
  }

  console.log(`\n✅  Done!`);
  console.log(`   Created: ${created}`);
  console.log(`   Skipped: ${skipped}`);
  if (saveErrors.length > 0) {
    console.warn(`   Save errors: ${saveErrors.length}`);
    saveErrors.forEach((e) => console.warn(`      – [${e.source}] "${e.title}": ${e.error}`));
  }

  const total = await Resource.countDocuments({ isDeleted: { $ne: true } });
  console.log(`\n📊  Total resources in DB now: ${total}`);

  await mongoose.disconnect();
  console.log('🔌  Disconnected. All done!');
}

main().catch((err) => {
  console.error('❌  Fatal error:', err);
  mongoose.disconnect().finally(() => process.exit(1));
});
