import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import connectDB from "@/lib/db/connect";
import { Order } from "@/lib/models/Order";
import { Product } from "@/lib/models/Product";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { ApiError, withErrorHandler } from "@/lib/api-error";

const JWT_SECRET = process.env.JWT_SECRET || "gravity_super_secret_key";

export const dynamic = "force-dynamic";

const CATALOG_FALLBACK = [
  {
    _id: "64a1b2c3d4e5f60000000001",
    name: "Acoustic Prime Headset",
    category: "Audio",
    price: 299,
    description: "Premium wireless audio with 3D spatial sound technology.",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80",
    stock: 50,
  },
  {
    _id: "64a1b2c3d4e5f60000000002",
    name: "Nebula Mechanical Keyboard",
    category: "Accessories",
    price: 189,
    description: "Aircraft-grade aluminum body, tactile switches, and per-key RGB.",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80",
    stock: 120,
  },
  {
    _id: "64a1b2c3d4e5f60000000003",
    name: "Quantum 4K Monitor",
    category: "Displays",
    price: 899,
    description: "32-inch 4K OLED display with 144Hz refresh rate.",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    stock: 25,
  },
  {
    _id: "64a1b2c3d4e5f60000000004",
    name: "Zenith Studio Microphone",
    category: "Audio",
    price: 149,
    description: "Studio-quality condenser microphone.",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80",
    stock: 80,
  },
  {
    _id: "64a1b2c3d4e5f60000000005",
    name: "Ergo Pro Mouse",
    category: "Accessories",
    price: 99,
    description: "Ergonomic wireless mouse with ultra-low latency.",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
    stock: 200,
  },
  {
    _id: "64a1b2c3d4e5f60000000006",
    name: "Lumina Desk Lamp",
    category: "Accessories",
    price: 79,
    description: "Smart LED desk lamp with adjustable color temperature.",
    image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&w=800&q=80",
    stock: 150,
  },
];

export const POST = withErrorHandler(async (req: Request) => {
  const { items } = await req.json();

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ApiError("Cart is empty", 400);
  }

  // Authenticate user or fallback to guest
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  let userId = "64a1b2c3d4e5f60000000098"; // default demo user

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      userId = decoded.userId;
    } catch {
      // invalid token, use fallback
    }
  }

  try {
    await connectDB();
  } catch {
    // DB offline fallback
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const orderItems = [];
  let totalAmount = 0;

  for (const item of items) {
    let product: { _id?: unknown; name: string; price: number; image: string; stock?: number } | null = null;
    
    try {
      product = await Product.findById(item.id);
    } catch {
      // not in mongo or mongo offline
    }

    if (!product) {
      const fallback = CATALOG_FALLBACK.find((p) => p._id === item.id || p.name === item.name);
      if (fallback) {
        product = fallback;
      } else if (item.name && item.price) {
        product = {
          _id: item.id,
          name: item.name,
          price: item.price,
          image: item.image || "/headset.png",
          stock: 99,
        };
      }
    }

    if (!product) continue;

    const unitPrice = Number(product.price);
    const qty = Number(item.quantity) || 1;
    totalAmount += unitPrice * qty;

    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
          images: [product.image],
        },
        unit_amount: Math.round(unitPrice * 100),
      },
      quantity: qty,
    });

    orderItems.push({
      productId: product._id ? product._id.toString() : item.id,
      name: product.name,
      quantity: qty,
      price: unitPrice,
      image: product.image,
    });
  }

  if (orderItems.length === 0) {
    throw new ApiError("Invalid items in cart", 400);
  }

  const origin = req.headers.get("origin") || "http://localhost:3000";
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const isRealStripe = stripeSecret && !stripeSecret.includes("dummy") && !stripeSecret.includes("placeholder");

  if (isRealStripe) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/cart`,
        metadata: { userId },
      });

      try {
        await Order.create({
          userId,
          items: orderItems,
          totalAmount,
          status: "pending",
          stripeSessionId: session.id,
        });
      } catch {
        // order saved in stripe
      }

      return NextResponse.json({ url: session.url }, { status: 200 });
    } catch (stripeErr: unknown) {
      console.warn("[Stripe] Gateway error, falling back to instant fulfillment simulation:", (stripeErr as Error).message);
    }
  }

  // Instant fulfillment / Demo checkout
  const demoSessionId = "demo_cs_" + Math.random().toString(36).substring(2, 12);
  try {
    await Order.create({
      userId,
      items: orderItems,
      totalAmount,
      status: "paid",
      stripeSessionId: demoSessionId,
    });
  } catch {
    // Mongo offline
  }

  return NextResponse.json({
    url: `${origin}/success?session_id=${demoSessionId}&total=${totalAmount}`,
  }, { status: 200 });
});
