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
  LogOut
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

const navItems = [
  { name: "CONSOLE", href: "/admin", icon: LayoutDashboard },
  { name: "PRODUCTS", href: "/admin/products", icon: Package },
  { name: "INVENTORY", href: "/admin/inventory", icon: Package },
  { name: "ORDERS", href: "/admin/orders", icon: ShoppingCart },
  { name: "USERS", href: "/admin/users", icon: Users },
  { name: "ANALYTICS", href: "/admin/analytics", icon: BarChart3 },
  { name: "SETTINGS", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout, setHoveringInteractive } = useAppStore();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#0e0e12] border-r border-white/5 z-[100] flex flex-col pointer-events-auto">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/5 font-mono text-xs tracking-[0.25em] text-white">
        GRAVITY // OS
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar font-mono text-[11px] tracking-wide">
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
              <div className={`relative flex items-center gap-3 px-4 py-3 rounded-none transition-all duration-300 ${isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                {isActive && (
                  <motion.div
                    layoutId="admin-sidebar-active"
                    className="absolute inset-0 bg-white/5 border border-white/10 rounded-sm"
                    transition={{ type: "spring", stiffness: 80, damping: 24 }}
                  />
                )}
                <Icon className="w-4 h-4 relative z-10" />
                <span className="relative z-10">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-white/5 font-mono text-[11px]">
        <button 
          onClick={logout}
          onMouseEnter={() => setHoveringInteractive(true)}
          onMouseLeave={() => setHoveringInteractive(false)}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-none text-gray-500 hover:text-[#ffa000] border border-transparent hover:border-white/5 hover:bg-white/5 transition-all duration-300"
        >
          <LogOut className="w-4 h-4" />
          <span>TERMINATE // OUT</span>
        </button>
      </div>
    </aside>
  );
}
