import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import { Product } from "@/lib/models/Product";
import { ratelimit } from "@/lib/rate-limit";
import { ApiError, withErrorHandler } from "@/lib/api-error";

export const GET = withErrorHandler(async (req: Request) => {
  // Extract client IP (Vercel headers or fallback)
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

  const { success, limit, remaining, reset } = await ratelimit.limit(ip);

  if (!success) {
    throw new ApiError("Rate limit exceeded. Please try again later.", 429, { limit, remaining, reset });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json([], { status: 200 });
  }

  await connectDB();

  const results = await Product.find(
    { $text: { $search: query } },
    { score: { $meta: "textScore" } }
  )
  .sort({ score: { $meta: "textScore" } })
  .limit(10)
  .select("name price category image");

  return NextResponse.json(results, {
    status: 200,
    headers: {
      "X-RateLimit-Limit": limit.toString(),
      "X-RateLimit-Remaining": remaining.toString(),
      "X-RateLimit-Reset": reset.toString(),
    },
  });
});
