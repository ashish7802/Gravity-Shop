import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import { User } from "@/lib/models/User";
import { ApiError, withErrorHandler } from "@/lib/api-error";

export const PATCH = withErrorHandler(async (req: Request, { params }: { params: { id: string } }) => {
  await connectDB();
  const body = await req.json();
  const { role, isActive } = body;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: any = {};
  if (role !== undefined) updateData.role = role;
  if (isActive !== undefined) updateData.isActive = isActive;

  const user = await User.findByIdAndUpdate(params.id, updateData, { new: true }).select("-password");
  
  if (!user) {
    throw new ApiError("User not found", 404);
  }

  return NextResponse.json({ success: true, user });
});
