import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import { Setting } from "@/lib/models/Setting";
import { withErrorHandler } from "@/lib/api-error";

export const dynamic = "force-dynamic";

const DEFAULT_SETTINGS: Record<string, string> = {
  storeName: "Gravity Shop",
  storeCurrency: "USD",
  storeEmail: "contact@gravityshop.com",
  stripeTestMode: "true",
  cloudinaryFolder: "gravity_shop_assets",
  smtpHost: "smtp.gravityshop.com",
  smtpPort: "587"
};

export const GET = withErrorHandler(async () => {
  try {
    const conn = await connectDB();
    if (conn) {
      const settings = await Setting.find({});
      if (settings.length > 0) {
        // Transform to a key-value object for the frontend
        const settingsMap = settings.reduce((acc: Record<string, unknown>, s) => {
          acc[s.key] = s.value;
          return acc;
        }, {});
        return NextResponse.json({ ...DEFAULT_SETTINGS, ...settingsMap });
      }
    }
  } catch (err) {
    console.warn("[Admin Settings GET] DB offline", (err as Error).message);
  }

  return NextResponse.json(DEFAULT_SETTINGS);
});

export const PUT = withErrorHandler(async (req: Request) => {
  const updates = await req.json();

  try {
    const conn = await connectDB();
    if (conn) {
      const operations = Object.keys(updates).map(key => {
        return {
          updateOne: {
            filter: { key },
            update: { $set: { value: updates[key] } },
            upsert: true
          }
        };
      });

      if (operations.length > 0) {
        await Setting.bulkWrite(operations);
      }
    }
  } catch (err) {
    console.warn("[Admin Settings PUT] Updating in-memory settings", (err as Error).message);
  }

  Object.assign(DEFAULT_SETTINGS, updates);
  return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS });
});
