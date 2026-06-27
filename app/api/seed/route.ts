import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import { Product } from "@/lib/models/Product";

const mockProducts = [
  {
    name: "Acoustic Prime Headset",
    category: "Audio",
    price: 299,
    description: "Premium wireless audio with 3D spatial sound technology. Crafted from aerospace-grade materials.",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80",
    tags: ["wireless", "audio", "premium"],
    stock: 50,
  },
  {
    name: "Nebula Mechanical Keyboard",
    category: "Accessories",
    price: 189,
    description: "Aircraft-grade aluminum body, tactile switches, and per-key RGB illumination.",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80",
    tags: ["keyboard", "mechanical", "rgb"],
    stock: 120,
  },
  {
    name: "Quantum 4K Monitor",
    category: "Displays",
    price: 899,
    description: "32-inch 4K OLED display with 144Hz refresh rate and true HDR capability.",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    tags: ["monitor", "4k", "oled"],
    stock: 25,
  },
  {
    name: "Zenith Studio Microphone",
    category: "Audio",
    price: 149,
    description: "Studio-quality condenser microphone for crystal clear recordings.",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80",
    tags: ["audio", "microphone", "studio"],
    stock: 80,
  },
  {
    name: "Ergo Pro Mouse",
    category: "Accessories",
    price: 99,
    description: "Ergonomic wireless mouse with ultra-low latency and programmable buttons.",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
    tags: ["mouse", "wireless", "ergonomic"],
    stock: 200,
  },
  {
    name: "Lumina Desk Lamp",
    category: "Accessories",
    price: 79,
    description: "Smart LED desk lamp with adjustable color temperature and brightness.",
    image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&w=800&q=80",
    tags: ["lighting", "desk", "smart"],
    stock: 150,
  }
];

export async function GET() {
  try {
    await connectDB();
    
    // Clear existing data
    await Product.deleteMany({});
    
    // Insert mock products
    const inserted = await Product.insertMany(mockProducts);
    
    return NextResponse.json({ 
      success: true, 
      message: "Database seeded successfully!",
      products: inserted.length
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
