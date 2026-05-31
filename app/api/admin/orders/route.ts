import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import { Order } from "@/lib/models/Order";
import { User } from "@/lib/models/User";
import { ApiError, withErrorHandler } from "@/lib/api-error";

export const dynamic = "force-dynamic";

export const GET = withErrorHandler(async () => {
  await connectDB();
  const orders = await Order.find({}).populate({
    path: "userId",
    model: User,
    select: "name email",
  }).sort({ createdAt: -1 });

  return NextResponse.json(orders);
});

export const PATCH = withErrorHandler(async (req: Request) => {
  await connectDB();
  const { orderId, status } = await req.json();

  if (!orderId || !status) {
    throw new ApiError("Missing orderId or status", 400);
  }

  const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
  
  if (!order) {
    throw new ApiError("Order not found", 404);
  }

  return NextResponse.json({ success: true, order }, { status: 200 });
});
