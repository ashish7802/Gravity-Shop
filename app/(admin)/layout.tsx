import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

const JWT_SECRET = process.env.JWT_SECRET || "gravity_super_secret_key";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    if (decoded.role !== "admin") {
      redirect("/");
    }
  } catch {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-space-900 text-white flex overflow-hidden">
      {/* Background Holographic Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          transform: 'perspective(1000px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
        }}
      />
      
      {/* Main Ambient Glow */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-neon-cyan/20 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-neon-purple/20 blur-[150px] rounded-full pointer-events-none z-0" />

      <AdminSidebar />
      
      <main className="flex-1 ml-64 relative z-10 p-8 h-screen overflow-y-auto custom-scrollbar pointer-events-auto">
        {children}
      </main>
    </div>
  );
}
