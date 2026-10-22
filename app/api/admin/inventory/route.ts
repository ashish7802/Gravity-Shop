import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import { Product } from "@/lib/models/Product";
import { ApiError, withErrorHandler } from "@/lib/api-error";

export const dynamic = "force-dynamic";

const FALLBACK_INVENTORY = [
  { _id: "64a1b2c3d4e5f60000000001", name: "Acoustic Prime Headset", stock: 50, price: 299, category: "Audio", modelPath: "/models/headset.glb", modelSize: 4500000, optimizationStatus: "optimized" },
  { _id: "64a1b2c3d4e5f60000000002", name: "Nebula Mechanical Keyboard", stock: 120, price: 189, category: "Accessories", modelPath: "", modelSize: 0, optimizationStatus: "untracked" },
  { _id: "64a1b2c3d4e5f60000000003", name: "Quantum 4K Monitor", stock: 4, price: 899, category: "Displays", modelPath: "", modelSize: 0, optimizationStatus: "untracked" },
  { _id: "64a1b2c3d4e5f60000000004", name: "Zenith Studio Microphone", stock: 80, price: 149, category: "Audio", modelPath: "", modelSize: 0, optimizationStatus: "untracked" },
  { _id: "64a1b2c3d4e5f60000000005", name: "Ergo Pro Mouse", stock: 2, price: 99, category: "Accessories", modelPath: "", modelSize: 0, optimizationStatus: "untracked" },
  { _id: "64a1b2c3d4e5f60000000006", name: "Lumina Desk Lamp", stock: 0, price: 79, category: "Accessories", modelPath: "", modelSize: 0, optimizationStatus: "untracked" },
];

export const GET = withErrorHandler(async () => {
  try {
    const conn = await connectDB();
    if (conn) {
      const inventory = await Product.find({}).select("name stock price category modelPath modelSize optimizationStatus");
      if (inventory.length > 0) {
        return NextResponse.json(inventory);
      }
    }
  } catch (err) {
    console.warn("[Admin Inventory GET] DB offline", (err as Error).message);
  }

  return NextResponse.json(FALLBACK_INVENTORY);
});

export const PATCH = withErrorHandler(async (req: Request) => {
  const updates = await req.json();

  if (!Array.isArray(updates)) {
    throw new ApiError("Payload must be an array of updates", 400);
  }

  try {
    const conn = await connectDB();
    if (conn) {
      const bulkOps = updates.map((update) => ({
        updateOne: {
          filter: { _id: update.id },
          update: { $set: { stock: update.stock } },
        },
      }));

      await Product.bulkWrite(bulkOps);
      return NextResponse.json({ success: true }, { status: 200 });
    }
  } catch (err) {
    console.warn("[Admin Inventory PATCH] In-memory update", (err as Error).message);
  }

  // Update in-memory fallback
  updates.forEach((u) => {
    const item = FALLBACK_INVENTORY.find((i) => i._id === u.id);
    if (item) item.stock = u.stock;
  });

  return NextResponse.json({ success: true }, { status: 200 });
});
