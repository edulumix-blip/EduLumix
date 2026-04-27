/**
 * One-time cleanup: Remove all resources from freecodecamp, hashnode, youtube, hackernews.
 * Run once: node backend/utils/removeUnwantedSources.js
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Resource from '../models/Resource.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const SOURCES_TO_REMOVE = ['freecodecamp', 'hashnode', 'youtube', 'hackernews'];

async function cleanup() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  for (const source of SOURCES_TO_REMOVE) {
    const count = await Resource.countDocuments({ source });
    const result = await Resource.deleteMany({ source });
    console.log(`✅ ${source}: ${result.deletedCount} / ${count} deleted`);
  }

  const remaining = await Resource.countDocuments({});
  console.log(`\nDone. Total resources remaining: ${remaining}`);
  await mongoose.disconnect();
}

cleanup().catch((err) => {
  console.error('Cleanup failed:', err.message);
  process.exit(1);
});
