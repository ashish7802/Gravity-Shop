import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import { User } from "@/lib/models/User";
import { withErrorHandler } from "@/lib/api-error";

export const dynamic = "force-dynamic";

export const PATCH = withErrorHandler(async (req: Request, { params }: { params: { id: string } }) => {
  const body = await req.json();
  const { role, isActive } = body;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: any = {};
  if (role !== undefined) updateData.role = role;
  if (isActive !== undefined) updateData.isActive = isActive;

  try {
    const conn = await connectDB();
    if (conn) {
      const user = await User.findByIdAndUpdate(params.id, updateData, { new: true }).select("-password");
      if (user) {
        return NextResponse.json({ success: true, user });
      }
    }
  } catch (err) {
    console.warn("[Admin Users ID PATCH] DB offline", (err as Error).message);
  }

  return NextResponse.json({
    success: true,
    user: { _id: params.id, ...updateData }
  });
});
