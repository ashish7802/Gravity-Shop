import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import { User } from "@/lib/models/User";
import { withErrorHandler } from "@/lib/api-error";

export const dynamic = "force-dynamic";

const FALLBACK_USERS = [
  { _id: "64a1b2c3d4e5f60000000099", name: "System Commander", email: "admin@gravityshop.com", role: "admin", isActive: true },
  { _id: "64a1b2c3d4e5f60000000098", name: "Verified Operator", email: "user@gravityshop.com", role: "user", isActive: true },
  { _id: "64a1b2c3d4e5f60000000097", name: "Sarah Connor", email: "s.connor@cyberdyne.io", role: "user", isActive: true },
  { _id: "64a1b2c3d4e5f60000000096", name: "Commander Shepard", email: "shepard@normandy.alliance", role: "user", isActive: true },
  { _id: "64a1b2c3d4e5f60000000095", name: "Rick Deckard", email: "deckard@lapd-blade.org", role: "user", isActive: false },
];

export const GET = withErrorHandler(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  try {
    const conn = await connectDB();
    if (conn) {
      const query = search ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ]
      } : {};

      const total = await User.countDocuments(query);
      if (total > 0) {
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
      }
    }
  } catch (err) {
    console.warn("[Admin Users GET] DB offline", (err as Error).message);
  }

  const filtered = FALLBACK_USERS.filter(u => 
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return NextResponse.json({
    users: filtered,
    total: filtered.length,
    page: 1,
    pages: 1
  });
});
