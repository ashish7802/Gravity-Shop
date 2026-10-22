import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import { Product } from "@/lib/models/Product";
import { ratelimit } from "@/lib/rate-limit";
import { ApiError, withErrorHandler } from "@/lib/api-error";

export const dynamic = "force-dynamic";

const CATALOG_DATA = [
  {
    _id: "64a1b2c3d4e5f60000000001",
    name: "Acoustic Prime Headset",
    category: "Audio",
    price: 299,
    description: "Premium wireless audio with 3D spatial sound technology. Crafted from aerospace-grade materials.",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80",
    tags: ["wireless", "audio", "premium"],
  },
  {
    _id: "64a1b2c3d4e5f60000000002",
    name: "Nebula Mechanical Keyboard",
    category: "Accessories",
    price: 189,
    description: "Aircraft-grade aluminum body, tactile switches, and per-key RGB illumination.",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80",
    tags: ["keyboard", "mechanical", "rgb"],
  },
  {
    _id: "64a1b2c3d4e5f60000000003",
    name: "Quantum 4K Monitor",
    category: "Displays",
    price: 899,
    description: "32-inch 4K OLED display with 144Hz refresh rate and true HDR capability.",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    tags: ["monitor", "4k", "oled"],
  },
  {
    _id: "64a1b2c3d4e5f60000000004",
    name: "Zenith Studio Microphone",
    category: "Audio",
    price: 149,
    description: "Studio-quality condenser microphone for crystal clear recordings.",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80",
    tags: ["audio", "microphone", "studio"],
  },
  {
    _id: "64a1b2c3d4e5f60000000005",
    name: "Ergo Pro Mouse",
    category: "Accessories",
    price: 99,
    description: "Ergonomic wireless mouse with ultra-low latency and programmable buttons.",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
    tags: ["mouse", "wireless", "ergonomic"],
  },
  {
    _id: "64a1b2c3d4e5f60000000006",
    name: "Lumina Desk Lamp",
    category: "Accessories",
    price: 79,
    description: "Smart LED desk lamp with adjustable color temperature and brightness.",
    image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&w=800&q=80",
    tags: ["lighting", "desk", "smart"],
  }
];

export const GET = withErrorHandler(async (req: Request) => {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  const { success, limit, remaining, reset } = await ratelimit.limit(ip);

  if (!success) {
    throw new ApiError("Rate limit exceeded. Please try again later.", 429, { limit, remaining, reset });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json([], { status: 200 });
  }

  const regex = new RegExp(query, "i");

  try {
    const conn = await connectDB();
    if (conn) {
      const dbResults = await Product.find({
        $or: [
          { name: { $regex: regex } },
          { category: { $regex: regex } },
          { description: { $regex: regex } }
        ]
      })
      .limit(10)
      .select("name price category image");

      if (dbResults.length > 0) {
        return NextResponse.json(dbResults, {
          status: 200,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        });
      }
    }
  } catch (err) {
    console.warn("[Search GET] DB offline or query error, searching catalog fallback", (err as Error).message);
  }

  // Fallback memory search
  const filtered = CATALOG_DATA.filter(
    (item) =>
      regex.test(item.name) ||
      regex.test(item.category) ||
      regex.test(item.description) ||
      item.tags?.some((t) => regex.test(t))
  );

  return NextResponse.json(filtered, {
    status: 200,
    headers: {
      "X-RateLimit-Limit": limit.toString(),
      "X-RateLimit-Remaining": remaining.toString(),
      "X-RateLimit-Reset": reset.toString(),
    },
  });
});
