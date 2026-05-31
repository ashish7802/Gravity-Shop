"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, Package, CheckCircle, Clock, XCircle, RefreshCcw } from "lucide-react";

export default function AdminOrdersPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
      if (res.ok) fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid": return <CheckCircle className="w-4 h-4 text-neon-cyan" />;
      case "shipped": return <Package className="w-4 h-4 text-neon-magenta" />;
      case "delivered": return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "cancelled": case "refunded": return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-yellow-400" />;
    }
  };

  const filteredOrders = orders.filter(o => 
    o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.userId?.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="font-display font-bold text-4xl tracking-wider text-white uppercase"
          >
            Order Operations
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="text-gray-400 font-mono mt-2"
          >
            Monitor fulfillment pipelines and transaction status.
          </motion.p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative"
      >
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search ID or Customer Email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan transition-all"
            />
          </div>
          <button onClick={fetchOrders} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
            <RefreshCcw className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-xs font-mono uppercase tracking-widest text-gray-500">
                <th className="p-4 font-normal">Order ID</th>
                <th className="p-4 font-normal">Customer</th>
                <th className="p-4 font-normal">Amount</th>
                <th className="p-4 font-normal">Status</th>
                <th className="p-4 font-normal">Date</th>
                <th className="p-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <Loader2 className="w-6 h-6 text-neon-cyan animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 font-mono">No telemetry found.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="p-4 font-mono text-xs text-gray-400">{order._id.slice(-8)}</td>
                    <td className="p-4">
                      <p className="text-sm font-bold text-white">{order.userId?.name || "Unknown Entity"}</p>
                      <p className="text-xs font-mono text-gray-500">{order.userId?.email || "N/A"}</p>
                    </td>
                    <td className="p-4 font-mono text-sm text-neon-cyan">${order.totalAmount.toFixed(2)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className="text-xs font-mono uppercase text-gray-300">{order.status}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <select 
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="bg-black border border-white/10 rounded-lg p-2 text-xs font-mono text-gray-300 focus:border-neon-cyan outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="refunded">Refunded</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
