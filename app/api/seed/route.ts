import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import { Product } from "@/lib/models/Product";
import { User } from "@/lib/models/User";
import { Order } from "@/lib/models/Order";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

const mockProducts = [
  {
    name: "Acoustic Prime Headset",
    slug: "acoustic-prime-headset",
    category: "Audio",
    price: 299,
    description: "Premium wireless audio with 3D spatial sound technology. Crafted from aerospace-grade materials.",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80",
    tags: ["wireless", "audio", "premium"],
    stock: 50,
  },
  {
    name: "Nebula Mechanical Keyboard",
    slug: "nebula-mechanical-keyboard",
    category: "Accessories",
    price: 189,
    description: "Aircraft-grade aluminum body, tactile switches, and per-key RGB illumination.",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80",
    tags: ["keyboard", "mechanical", "rgb"],
    stock: 120,
  },
  {
    name: "Quantum 4K Monitor",
    slug: "quantum-4k-monitor",
    category: "Displays",
    price: 899,
    description: "32-inch 4K OLED display with 144Hz refresh rate and true HDR capability.",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    tags: ["monitor", "4k", "oled"],
    stock: 25,
  },
  {
    name: "Zenith Studio Microphone",
    slug: "zenith-studio-microphone",
    category: "Audio",
    price: 149,
    description: "Studio-quality condenser microphone for crystal clear recordings.",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80",
    tags: ["audio", "microphone", "studio"],
    stock: 80,
  },
  {
    name: "Ergo Pro Mouse",
    slug: "ergo-pro-mouse",
    category: "Accessories",
    price: 99,
    description: "Ergonomic wireless mouse with ultra-low latency and programmable buttons.",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
    tags: ["mouse", "wireless", "ergonomic"],
    stock: 200,
  },
  {
    name: "Lumina Desk Lamp",
    slug: "lumina-desk-lamp",
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
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({
        success: true,
        message: "Operated in in-memory mode (MongoDB unconfigured). Demo products, users, and orders are active.",
        products: mockProducts.length,
      });
    }
    
    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    
    // Insert mock products
    const inserted = await Product.insertMany(mockProducts);

    // Create default admin and demo user
    const adminPassword = await bcrypt.hash("admin123", 10);
    const userPassword = await bcrypt.hash("user123", 10);

    await User.create({
      name: "System Commander",
      email: "admin@gravityshop.com",
      password: adminPassword,
      role: "admin",
      isActive: true,
    });

    const user = await User.create({
      name: "Verified Operator",
      email: "user@gravityshop.com",
      password: userPassword,
      role: "user",
      isActive: true,
    });

    // Create sample orders for telemetry
    await Order.create({
      userId: user._id,
      items: [
        {
          productId: inserted[0]._id,
          name: inserted[0].name,
          quantity: 1,
          price: inserted[0].price,
          image: inserted[0].image,
        },
        {
          productId: inserted[1]._id,
          name: inserted[1].name,
          quantity: 2,
          price: inserted[1].price,
          image: inserted[1].image,
        }
      ],
      totalAmount: inserted[0].price + inserted[1].price * 2,
      status: "delivered",
    });

    await Order.create({
      userId: user._id,
      items: [
        {
          productId: inserted[2]._id,
          name: inserted[2].name,
          quantity: 1,
          price: inserted[2].price,
          image: inserted[2].image,
        }
      ],
      totalAmount: inserted[2].price,
      status: "paid",
    });
    
    return NextResponse.json({ 
      success: true, 
      message: "Database seeded successfully with products, admin, demo user, and telemetry orders!",
      products: inserted.length,
      users: 2,
      orders: 2,
      adminCredentials: { email: "admin@gravityshop.com", password: "admin123" }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
