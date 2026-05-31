import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import { Product } from "@/lib/models/Product";
import { ApiError, withErrorHandler } from "@/lib/api-error";

export const dynamic = "force-dynamic";

export const GET = withErrorHandler(async () => {
  await connectDB();
  const inventory = await Product.find({}).select("name stock price category modelPath modelSize optimizationStatus");
  return NextResponse.json(inventory);
});

export const PATCH = withErrorHandler(async (req: Request) => {
  await connectDB();
  const updates = await req.json(); // Expected: [{ id: "...", stock: 10 }, ...]

  if (!Array.isArray(updates)) {
    throw new ApiError("Payload must be an array of updates", 400);
  }

  const bulkOps = updates.map((update) => ({
    updateOne: {
      filter: { _id: update.id },
      update: { $set: { stock: update.stock } },
    },
  }));

  await Product.bulkWrite(bulkOps);

  return NextResponse.json({ success: true }, { status: 200 });
});
