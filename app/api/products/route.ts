import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import { Product } from "@/lib/models/Product";
import { withErrorHandler } from "@/lib/api-error";

export const GET = withErrorHandler(async (req: Request) => {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  const query = category ? { category } : {};
  const products = await Product.find(query).sort({ createdAt: -1 });

  return NextResponse.json(products);
});
