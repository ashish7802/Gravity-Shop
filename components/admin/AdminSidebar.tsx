"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Sparkles
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Inventory", href: "/admin/inventory", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout, setHoveringInteractive } = useAppStore();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-space-900/80 backdrop-blur-3xl border-r border-white/10 z-[100] flex flex-col pointer-events-auto">
      {/* Cinematic Edge Lighting */}
      <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-neon-cyan/50 via-neon-magenta/20 to-transparent" />
      
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-white/5 relative overflow-hidden group">
        <div className="absolute -inset-10 bg-neon-cyan/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
        <Sparkles className="w-6 h-6 text-neon-cyan relative z-10" />
        <h1 className="font-display font-bold text-xl text-white tracking-widest uppercase relative z-10">Gravity OS</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link 
              key={item.name} 
              href={item.href}
              onMouseEnter={() => setHoveringInteractive(true)}
              onMouseLeave={() => setHoveringInteractive(false)}
              className="relative block"
            >
              <div className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                {isActive && (
                  <motion.div
                    layoutId="admin-sidebar-active"
                    className="absolute inset-0 bg-white/10 rounded-xl border border-white/10 backdrop-blur-md"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-neon-cyan drop-shadow-[0_0_8px_#00f0ff]' : ''}`} />
                <span className="font-mono text-sm tracking-wide relative z-10">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-white/5">
        <button 
          onClick={logout}
          onMouseEnter={() => setHoveringInteractive(true)}
          onMouseLeave={() => setHoveringInteractive(false)}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-mono text-sm tracking-wide">Disconnect</span>
        </button>
      </div>
    </aside>
  );
}
