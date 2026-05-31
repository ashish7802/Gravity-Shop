"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Save, AlertTriangle, Box } from "lucide-react";

export default function AdminInventoryPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [inventory, setInventory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editedStock, setEditedStock] = useState<Record<string, number>>({});

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/inventory");
      const data = await res.json();
      if (Array.isArray(data)) setInventory(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStockChange = (id: string, value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0) {
      setEditedStock((prev) => ({ ...prev, [id]: num }));
    }
  };

  const handleBulkSave = async () => {
    setIsSaving(true);
    try {
      const updates = Object.entries(editedStock).map(([id, stock]) => ({ id, stock }));
      const res = await fetch("/api/admin/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        setEditedStock({});
        await fetchInventory();
        alert("Stock updated successfully");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update stock");
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = Object.keys(editedStock).length > 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="font-display font-bold text-4xl tracking-wider text-white uppercase"
          >
            Inventory & Asset Health
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="text-gray-400 font-mono mt-2"
          >
            Bulk monitor physical stock and 3D digital asset integrity.
          </motion.p>
        </div>
        
        <motion.button 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          onClick={handleBulkSave}
          disabled={!hasChanges || isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-neon-cyan text-black font-bold tracking-widest rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          SYNC CHANGES
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* KPI Cards */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <p className="text-gray-400 font-mono text-xs uppercase mb-2">Total Assets</p>
          <p className="text-3xl font-display font-bold text-white">{inventory.length}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <p className="text-gray-400 font-mono text-xs uppercase mb-2">Missing 3D Models</p>
          <p className="text-3xl font-display font-bold text-yellow-400">
            {inventory.filter(i => !i.modelPath).length}
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <p className="text-gray-400 font-mono text-xs uppercase mb-2">Low Stock Alerts (&lt; 5)</p>
          <p className="text-3xl font-display font-bold text-red-400">
            {inventory.filter(i => i.stock < 5 && i.stock > 0).length}
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <p className="text-gray-400 font-mono text-xs uppercase mb-2">Out of Stock</p>
          <p className="text-3xl font-display font-bold text-gray-500">
            {inventory.filter(i => i.stock === 0).length}
          </p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-xs font-mono uppercase tracking-widest text-gray-500">
                <th className="p-4 font-normal">Asset Name</th>
                <th className="p-4 font-normal">Category</th>
                <th className="p-4 font-normal">3D Payload Size</th>
                <th className="p-4 font-normal">Health</th>
                <th className="p-4 font-normal text-right">Physical Stock</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <Loader2 className="w-6 h-6 text-neon-cyan animate-spin mx-auto" />
                  </td>
                </tr>
              ) : inventory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 font-mono">No telemetry found.</td>
                </tr>
              ) : (
                inventory.map((item) => {
                  const currentStock = editedStock[item._id] !== undefined ? editedStock[item._id] : item.stock;
                  const isLowStock = currentStock < 5;
                  const isMissingModel = !item.modelPath;

                  return (
                    <tr key={item._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold text-white text-sm">{item.name}</td>
                      <td className="p-4 font-mono text-xs text-neon-cyan">{item.category}</td>
                      <td className="p-4 font-mono text-xs text-gray-400">
                        {item.modelSize ? `${(item.modelSize / 1024 / 1024).toFixed(2)} MB` : "N/A"}
                      </td>
                      <td className="p-4">
                        {isMissingModel ? (
                          <div className="flex items-center gap-1 text-yellow-400 text-xs font-mono">
                            <AlertTriangle className="w-3 h-3" /> MISSING GLB
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-green-400 text-xs font-mono">
                            <Box className="w-3 h-3" /> ACTIVE
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className={`inline-flex items-center gap-2 border rounded-lg px-2 py-1 ${isLowStock ? 'border-red-500/50 bg-red-500/10' : 'border-white/10 bg-black'}`}>
                          <input 
                            type="number" 
                            min="0"
                            value={currentStock}
                            onChange={(e) => handleStockChange(item._id, e.target.value)}
                            className="w-16 bg-transparent text-right text-sm font-mono text-white focus:outline-none"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
