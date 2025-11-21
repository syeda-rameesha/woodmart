// woodmart-api/src/db/mongo.js
import mongoose from "mongoose";

export async function connectMongo(uriFromArgs) {
  const uri = uriFromArgs || process.env.MONGODB_URI;
  if (!uri) throw new Error("❌ Missing MONGODB_URI");

  // If env provides an explicit DB name, force it; otherwise use name in the URI
  const dbName = process.env.MONGODB_DBNAME || undefined;

  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(uri, {
      dbName, // will be "woodmart" if set above, else Mongo uses the db name in the URI
    });

    const { host } = mongoose.connection;
    // Pull the db name mongoose actually connected to
    const currentDb = mongoose.connection.name;
    console.log(`✅ MongoDB connected: ${host} / ${currentDb}`);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err?.message || err);
    throw err;
  }
}