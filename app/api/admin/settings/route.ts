import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import { Setting } from "@/lib/models/Setting";
import { withErrorHandler } from "@/lib/api-error";

export const GET = withErrorHandler(async () => {
  await connectDB();
  const settings = await Setting.find({});
  // Transform to a key-value object for the frontend
  const settingsMap = settings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {});

  return NextResponse.json(settingsMap);
});

export const PUT = withErrorHandler(async (req: Request) => {
  await connectDB();
  const updates = await req.json();

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

  return NextResponse.json({ success: true });
});
