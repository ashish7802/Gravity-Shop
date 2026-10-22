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
      redis: "in_memory_active",
      cloudinary: "unverified",
      stripe: "unverified"
    },
    mode: "operational",
    healthy: true
  };

  try {
    // 1. Verify MongoDB
    try {
      await connectDB();
      if (mongoose.connection.readyState === 1) {
        status.services.database = "connected";
      } else {
        status.services.database = "in_memory_fallback";
      }
    } catch {
      status.services.database = "in_memory_fallback";
    }

    // 2. Verify Rate Limiter
    try {
      const { success } = await ratelimit.limit("health-check-ping");
      status.services.redis = typeof success === "boolean" ? "active" : "error";
    } catch {
      status.services.redis = "error";
    }

    // 3. Verify Cloudinary Configs
    const hasCloudinary = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
    status.services.cloudinary = hasCloudinary ? "configured" : "fallback_data_uri";

    // 4. Verify Stripe Configs
    const hasStripe = !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET);
    status.services.stripe = hasStripe ? "configured" : "simulation_mode";

    return NextResponse.json(status, { status: 200 });
  } catch (error) {
    console.error("Health Check Error:", error);
    return NextResponse.json({ ...status, healthy: false, error: String(error) }, { status: 200 });
  }
}
