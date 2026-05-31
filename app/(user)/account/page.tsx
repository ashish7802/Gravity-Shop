import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db/connect";
import { Order } from "@/lib/models/Order";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";

const JWT_SECRET = process.env.JWT_SECRET || "gravity_super_secret_key";

async function getUserOrders(userId: string) {
  try {
    await connectDB();
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();
    return orders;
  } catch {
    return [];
  }
}

export default async function AccountPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  let decoded: { userId: string } | null = null;

  try {
    decoded = jwt.verify(token!, JWT_SECRET) as { userId: string };
  } catch {
    return null; // layout handles redirect
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orders = await getUserOrders(decoded.userId) as any[];

  return (
    <div className="container mx-auto px-6 max-w-5xl">
      <h1 className="font-display font-bold text-4xl mb-2 text-white uppercase tracking-wider">Secure Protocol Active</h1>
      <p className="font-mono text-neon-cyan mb-12">User Identity: {decoded.userId}</p>

      <div className="glass-panel p-8 rounded-3xl border border-white/10">
        <h2 className="font-display font-bold text-2xl mb-8 flex items-center gap-3">
          <Package className="w-6 h-6 text-neon-magenta" /> 
          TRANSACTION LEDGER
        </h2>

        {orders.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-xl">
            <p className="text-gray-400 font-mono text-sm">NO TRANSACTIONS FOUND</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id.toString()} className="bg-black/40 border border-white/5 rounded-xl p-6 relative overflow-hidden group hover:border-white/20 transition-colors">
                <div className="absolute top-0 left-0 w-1 h-full bg-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-xs font-mono text-gray-500 mb-1">Order ID</p>
                    <p className="font-mono text-sm text-gray-300">{order._id.toString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono text-gray-500 mb-1">Status</p>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase
                      ${order.status === 'paid' ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30' : ''}
                      ${order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : ''}
                      ${order.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : ''}
                    `}>
                      {order.status === 'paid' && <CheckCircle className="w-3 h-3" />}
                      {order.status === 'pending' && <Clock className="w-3 h-3" />}
                      {order.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {order.items.map((item: any) => (
                    <div key={item.productId.toString()} className="flex items-center gap-4 bg-white/5 p-3 rounded-lg">
                      <div className="w-12 h-12 relative bg-black rounded border border-white/10 overflow-hidden">
                        <Image src={item.image} alt={item.name} fill className="object-cover opacity-80" sizes="48px" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white">{item.name}</p>
                        <p className="text-xs font-mono text-gray-400">QTY: {item.quantity}</p>
                      </div>
                      <p className="font-mono text-sm font-bold">${item.price * item.quantity}.00</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
                  <p className="text-xs font-mono text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="font-display font-bold text-xl text-white">
                    TOTAL: <span className="text-neon-cyan">${order.totalAmount}.00</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
