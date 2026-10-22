import mongoose from "mongoose";
import { validateEnv } from "@/lib/env";

validateEnv();

mongoose.set("bufferCommands", false); // CRITICAL: fail fast, don't hang

const MONGODB_URI = process.env.MONGODB_URI;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached = (global as any).mongoose;

if (!cached) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    console.warn("[AI Studio] MongoDB not connected (MONGODB_URI not provided) — in-memory / mock fallbacks active");
    return null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 3000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((m) => {
        console.log("MongoDB Connected!");
        return m;
      })
      .catch((err) => {
        console.warn("[AI Studio] MongoDB connection failed:", err.message);
        cached.promise = null;
        return null;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.warn("[AI Studio] Error connecting to MongoDB:", (e as Error).message);
    return null;
  }

  return cached.conn;
}

export default connectDB;
