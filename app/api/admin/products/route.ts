import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import { Product } from "@/lib/models/Product";
import { ApiError, withErrorHandler } from "@/lib/api-error";

export const dynamic = "force-dynamic";

const FALLBACK_PRODUCTS = [
  {
    _id: "64a1b2c3d4e5f60000000001",
    name: "Acoustic Prime Headset",
    slug: "acoustic-prime-headset",
    category: "Audio",
    price: 299,
    description: "Premium wireless audio with 3D spatial sound technology.",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80",
    tags: ["wireless", "audio", "premium"],
    stock: 50,
  },
  {
    _id: "64a1b2c3d4e5f60000000002",
    name: "Nebula Mechanical Keyboard",
    slug: "nebula-mechanical-keyboard",
    category: "Accessories",
    price: 189,
    description: "Aircraft-grade aluminum body, tactile switches, and per-key RGB.",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80",
    tags: ["keyboard", "mechanical", "rgb"],
    stock: 120,
  },
  {
    _id: "64a1b2c3d4e5f60000000003",
    name: "Quantum 4K Monitor",
    slug: "quantum-4k-monitor",
    category: "Displays",
    price: 899,
    description: "32-inch 4K OLED display with 144Hz refresh rate.",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    tags: ["monitor", "4k", "oled"],
    stock: 25,
  },
  {
    _id: "64a1b2c3d4e5f60000000004",
    name: "Zenith Studio Microphone",
    slug: "zenith-studio-microphone",
    category: "Audio",
    price: 149,
    description: "Studio-quality condenser microphone.",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80",
    tags: ["audio", "microphone", "studio"],
    stock: 80,
  },
  {
    _id: "64a1b2c3d4e5f60000000005",
    name: "Ergo Pro Mouse",
    slug: "ergo-pro-mouse",
    category: "Accessories",
    price: 99,
    description: "Ergonomic wireless mouse with ultra-low latency.",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
    tags: ["mouse", "wireless", "ergonomic"],
    stock: 200,
  },
  {
    _id: "64a1b2c3d4e5f60000000006",
    name: "Lumina Desk Lamp",
    slug: "lumina-desk-lamp",
    category: "Accessories",
    price: 79,
    description: "Smart LED desk lamp with adjustable color temperature.",
    image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&w=800&q=80",
    tags: ["lighting", "desk", "smart"],
    stock: 150,
  }
];

export const POST = withErrorHandler(async (req: Request) => {
  const body = await req.json();
  const { name, price, description, category, image, stock, modelPath, modelSize } = body;

  if (!name || !price || !category || !image) {
    throw new ApiError("Missing required product fields", 400);
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  try {
    const conn = await connectDB();
    if (conn) {
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
    }
  } catch (err) {
    console.warn("[Admin Product POST] Saving to memory store", (err as Error).message);
  }

  const mockProduct = {
    _id: "prod_" + Math.random().toString(36).substring(2, 9),
    name,
    slug,
    price,
    description,
    category,
    image,
    stock: stock || 0,
    tags: (body.tags as string[]) || ["hardware"],
    modelPath,
    modelSize,
    optimizationStatus: modelPath ? "draco-pending" : "untracked",
  };

  FALLBACK_PRODUCTS.unshift(mockProduct);
  return NextResponse.json({ success: true, product: mockProduct }, { status: 201 });
});

export const GET = withErrorHandler(async () => {
  try {
    const conn = await connectDB();
    if (conn) {
      const products = await Product.find({}).sort({ createdAt: -1 });
      if (products.length > 0) {
        return NextResponse.json(products);
      }
    }
  } catch (err) {
    console.warn("[Admin Product GET] Falling back to default catalog", (err as Error).message);
  }

  return NextResponse.json(FALLBACK_PRODUCTS);
});
