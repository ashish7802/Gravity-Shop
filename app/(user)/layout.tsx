import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { Navbar } from "@/components/ui/Navbar";

const JWT_SECRET = process.env.JWT_SECRET || "gravity_super_secret_key";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/");
  }

  try {
    jwt.verify(token, JWT_SECRET);
  } catch {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#030014] text-white">
      <Navbar />
      <div className="pt-32 pb-24">
        {children}
      </div>
    </div>
  );
}
