import mongoose from 'mongoose';

const connectDB = async (retries = 5) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`❌ MongoDB Connection Error (attempt ${attempt}/${retries}): ${error.message}`);
      if (attempt === retries) {
        console.error('All connection attempts failed, exiting...');
        process.exit(1);
      }
      const delay = 3000 * attempt;
      console.log(`⏳ Retrying in ${delay / 1000}s...`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};

export default connectDB;
