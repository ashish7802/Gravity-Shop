import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import { Product } from "@/lib/models/Product";
import { ApiError, withErrorHandler } from "@/lib/api-error";

export const POST = withErrorHandler(async (req: Request) => {
  await connectDB();
  const body = await req.json();

  const { name, price, description, category, image, stock, modelPath, modelSize } = body;

  if (!name || !price || !category || !image) {
    throw new ApiError("Missing required product fields", 400);
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const product = await Product.create({
    name,
    slug,
    price,
    description,
    category,
    image,
    stock: stock || 0,
    modelPath,
    modelSize,
    optimizationStatus: modelPath ? "draco-pending" : "untracked",
  });

  return NextResponse.json({ success: true, product }, { status: 201 });
});

export const GET = withErrorHandler(async () => {
  await connectDB();
  const products = await Product.find({}).sort({ createdAt: -1 });
  return NextResponse.json(products);
});
