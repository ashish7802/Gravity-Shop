import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "gravity_super_secret_key";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string; name?: string; email?: string };
    return NextResponse.json({
      authenticated: true,
      user: {
        id: decoded.userId,
        name: decoded.name || (decoded.role === "admin" ? "System Admin" : "Verified Operator"),
        email: decoded.email || `${decoded.role}@gravityshop.com`,
        role: decoded.role,
      },
    });
  } catch {
    return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
  }
}
