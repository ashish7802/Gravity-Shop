import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db/connect";
import { User } from "@/lib/models/User";
import { ApiError, withErrorHandler } from "@/lib/api-error";

export const POST = withErrorHandler(async (req: Request) => {
  await connectDB();
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    throw new ApiError("Missing required fields", 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError("User already exists", 400);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const isFirstUser = (await User.countDocuments({})) === 0;

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: isFirstUser ? "admin" : "user",
  });

  const JWT_SECRET = process.env.JWT_SECRET || "gravity_super_secret_key";
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  const { cookies } = await import("next/headers");
  cookies().set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return NextResponse.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  }, { status: 201 });
});
