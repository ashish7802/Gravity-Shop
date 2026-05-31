import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db/connect";
import { ratelimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET() {
  const status = {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    services: {
      database: "disconnected",
      redis: "unverified",
      cloudinary: "unverified",
      stripe: "unverified"
    },
    healthy: false
  };

  try {
    // 1. Verify MongoDB
    await connectDB();
    if (mongoose.connection.readyState === 1) {
      status.services.database = "connected";
    }

    // 2. Verify Redis via Upstash
    try {
      // Just a lightweight ping by checking rate limit for localhost
      const { success } = await ratelimit.limit("health-check-ping");
      status.services.redis = typeof success === "boolean" ? "connected" : "error";
    } catch {
      status.services.redis = "error";
    }

    // 3. Verify Cloudinary Configs
    const hasCloudinary = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
    status.services.cloudinary = hasCloudinary ? "configured" : "missing";

    // 4. Verify Stripe Configs
    const hasStripe = !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET);
    status.services.stripe = hasStripe ? "configured" : "missing";

    // Overall Health
    const isHealthy = 
      status.services.database === "connected" &&
      status.services.redis === "connected" &&
      status.services.cloudinary === "configured" &&
      status.services.stripe === "configured";

    status.healthy = isHealthy;

    return NextResponse.json(status, { status: isHealthy ? 200 : 503 });
  } catch (error) {
    console.error("Health Check Error:", error);
    return NextResponse.json({ ...status, error: "Critical Health Failure", details: String(error) }, { status: 503 });
  }
}
