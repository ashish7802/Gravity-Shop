import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db/connect";
import { User } from "@/lib/models/User";
import { ApiError, withErrorHandler } from "@/lib/api-error";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "gravity_super_secret_key";

export const dynamic = "force-dynamic";

export const POST = withErrorHandler(async (req: Request) => {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    throw new ApiError("Missing required fields", 400);
  }

  const normalizedEmail = email.toLowerCase().trim();
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  let userId = "user_" + Math.random().toString(36).substring(2, 9);
  let userRole = "user";

  try {
    const conn = await connectDB();
    if (conn) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        throw new ApiError("User already exists", 400);
      }

      const isFirstUser = (await User.countDocuments({})) === 0;
      userRole = isFirstUser ? "admin" : "user";

      const created = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: userRole,
      });
      userId = created._id.toString();
    }
  } catch (err: unknown) {
    if (err instanceof ApiError) throw err;
    console.warn("[Auth] Registering with session-only user mode", (err as Error).message);
  }

  const token = jwt.sign(
    { userId, role: userRole, name, email: normalizedEmail },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

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
      id: userId,
      name,
      email: normalizedEmail,
      role: userRole,
    },
  }, { status: 201 });
});
