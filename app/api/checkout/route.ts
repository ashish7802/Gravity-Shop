import { NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/db/connect";
import { Order } from "@/lib/models/Order";
import { Product } from "@/lib/models/Product";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import { ApiError, withErrorHandler } from "@/lib/api-error";

const JWT_SECRET = process.env.JWT_SECRET || "gravity_super_secret_key";

export const POST = withErrorHandler(async (req: Request) => {
  const getStripeKey = () => {
    if (process.env.STRIPE_SECRET_KEY) return process.env.STRIPE_SECRET_KEY;
    if (process.env.NODE_ENV !== "production") return "dev_dummy_key";
    throw new Error("FATAL: STRIPE_SECRET_KEY is missing in production environment.");
  };

  const stripe = new Stripe(getStripeKey(), {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiVersion: "2026-05-27.dahlia" as any,
  });

  await connectDB();
  const { items } = await req.json(); // Array of { id, quantity }

  if (!items || items.length === 0) {
    throw new ApiError("Cart is empty", 400);
  }

  // Authenticate user
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    throw new ApiError("Unauthorized. Please authenticate.", 401);
  }

  const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
  const userId = decoded.userId;

  // Fetch real product prices from DB to prevent tampering
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const orderItems = [];
  let totalAmount = 0;

  for (const item of items) {
    const product = await Product.findById(item.id);
    if (!product) continue;

    if (product.stock < item.quantity) {
      throw new ApiError(`Insufficient inventory for ${product.name}. Only ${product.stock} remaining.`, 400);
    }

    const amount = product.price * 100; // Stripe expects cents
    totalAmount += product.price * item.quantity;

    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
          images: [product.image],
        },
        unit_amount: amount,
      },
      quantity: item.quantity,
    });

    orderItems.push({
      productId: product._id,
      name: product.name,
      quantity: item.quantity,
      price: product.price,
      image: product.image,
    });
  }

  if (lineItems.length === 0) {
    throw new ApiError("Invalid items", 400);
  }

  const origin = req.headers.get("origin") || "http://localhost:3000";

  // Create Stripe Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cart`,
    metadata: {
      userId,
    },
  });

  // Create Pending Order
  await Order.create({
    userId,
    items: orderItems,
    totalAmount,
    status: "pending",
    stripeSessionId: session.id,
  });

  return NextResponse.json({ url: session.url }, { status: 200 });
});
