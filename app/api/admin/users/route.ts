import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import { User } from "@/lib/models/User";
import { withErrorHandler } from "@/lib/api-error";

export const GET = withErrorHandler(async (req: Request) => {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const query = search ? {
    $or: [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ]
  } : {};

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .select("-password")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return NextResponse.json({
    users,
    total,
    page,
    pages: Math.ceil(total / limit)
  });
});
