"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, UserCog, Ban, CheckCircle } from "lucide-react";

export default function AdminUsersPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?search=${search}&page=${page}`);
      const data = await res.json();
      setUsers(data.users || []);
      setTotalPages(data.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page]);

  const toggleRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole })
    });
    fetchUsers();
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !currentStatus })
    });
    fetchUsers();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="font-display font-bold text-4xl tracking-wider text-white uppercase"
        >
          Identity Access Management
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="text-gray-400 font-mono mt-2"
        >
          Manage user accounts, roles, and system access.
        </motion.p>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
          <div className="relative w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-neon-cyan transition-colors" />
            <input 
              type="text" 
              placeholder="Search identities..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white text-sm focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan outline-none transition-all placeholder:text-gray-600 font-mono"
            />
          </div>
        </div>

        {/* Grid Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 text-xs font-mono text-gray-500 uppercase tracking-wider bg-black/40">
          <div className="col-span-4">Operator Name</div>
          <div className="col-span-3">Email Access Token</div>
          <div className="col-span-2">Clearance Role</div>
          <div className="col-span-2">System Status</div>
          <div className="col-span-1 text-right">Overrides</div>
        </div>

        {/* Grid Body */}
        <div className="divide-y divide-white/5">
          {loading ? (
            <div className="p-8 text-center font-mono text-neon-cyan animate-pulse">FETCHING IDENTITIES...</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center font-mono text-gray-500">No identities found.</div>
          ) : (
            users.map((user, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={user._id} 
                className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors group relative overflow-hidden ${!user.isActive ? 'opacity-50' : ''}`}
              >
                <div className="col-span-4 flex items-center gap-3 relative z-10">
                  <div>
                    <p className="font-bold text-white text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500 font-mono">ID: {user._id.substring(0, 8)}</p>
                  </div>
                </div>
                
                <div className="col-span-3 relative z-10">
                  <span className="text-sm text-gray-300 font-mono">{user.email}</span>
                </div>
                
                <div className="col-span-2 relative z-10">
                  <span className={`text-xs px-2 py-1 rounded font-mono ${
                    user.role === "admin" ? "bg-neon-magenta/10 text-neon-magenta border border-neon-magenta/20" :
                    "bg-white/5 text-gray-400 border border-white/10"
                  }`}>
                    {user.role.toUpperCase()}
                  </span>
                </div>
                
                <div className="col-span-2 relative z-10">
                  <span className={`text-xs px-2 py-1 rounded font-mono flex items-center gap-1 w-max ${
                    user.isActive !== false ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20" :
                    "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}>
                    {user.isActive !== false ? <><CheckCircle className="w-3 h-3"/> ACTIVE</> : <><Ban className="w-3 h-3"/> SUSPENDED</>}
                  </span>
                </div>
                
                <div className="col-span-1 flex justify-end gap-2 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => toggleRole(user._id, user.role)}
                    className="p-1.5 text-gray-400 hover:text-neon-magenta hover:bg-neon-magenta/10 rounded transition-colors"
                    title="Toggle Role"
                  >
                    <UserCog className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => toggleStatus(user._id, user.isActive !== false)}
                    className={`p-1.5 rounded transition-colors ${
                      user.isActive !== false ? "text-gray-400 hover:text-red-400 hover:bg-red-500/10" : "text-gray-400 hover:text-neon-cyan hover:bg-neon-cyan/10"
                    }`}
                    title="Toggle Access"
                  >
                    <Ban className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-white/5 flex justify-center gap-2">
            <button 
              disabled={page === 1} 
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1 bg-white/5 disabled:opacity-50 text-xs font-mono text-gray-300 rounded hover:bg-white/10"
            >
              PREV
            </button>
            <span className="px-3 py-1 text-xs font-mono text-neon-cyan">
              {page} / {totalPages}
            </span>
            <button 
              disabled={page === totalPages} 
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 bg-white/5 disabled:opacity-50 text-xs font-mono text-gray-300 rounded hover:bg-white/10"
            >
              NEXT
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
