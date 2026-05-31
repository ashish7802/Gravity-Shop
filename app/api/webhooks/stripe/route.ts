import { NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/db/connect";
import { Order } from "@/lib/models/Order";
import { Product } from "@/lib/models/Product";
import { logger } from "@/lib/logger";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiVersion: "2026-05-27.dahlia" as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  // Note: We intentionally do NOT use withErrorHandler here because Stripe requires 
  // raw body processing and extremely specific signature validation errors.
  
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      logger.warn("Stripe webhook received without signature");
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: unknown) {
      logger.error("Stripe signature validation failed", err);
      return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
    }

    await connectDB();

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Idempotency Check
      const existingOrder = await Order.findOne({ stripeSessionId: session.id });
      if (existingOrder && existingOrder.status !== "pending") {
        logger.info(`Idempotency caught duplicate processing for session ${session.id}`);
        return NextResponse.json({ success: true, message: "Already processed" }, { status: 200 });
      }

      // Decrement Inventory and Transition Order using Transactions
      const orderToProcess = existingOrder || await Order.findOne({ stripeSessionId: session.id });

      if (orderToProcess && orderToProcess.status === "pending") {
        const mongoose = (await import("mongoose")).default;
        const dbSession = await mongoose.startSession();
        
        try {
          await dbSession.withTransaction(async () => {
            logger.info(`Starting inventory decrement for Order ${orderToProcess._id}`);
            for (const item of orderToProcess.items) {
              await Product.findByIdAndUpdate(
                item.productId, 
                { $inc: { stock: -item.quantity } },
                { session: dbSession }
              );
            }
            orderToProcess.status = "paid";
            await orderToProcess.save({ session: dbSession });
          });
          logger.info(`Order ${orderToProcess._id} fulfilled successfully.`);
        } finally {
          await dbSession.endSession();
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: unknown) {
    logger.error("Stripe Webhook critical failure", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
