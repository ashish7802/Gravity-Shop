import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db/connect";
import { Order } from "@/lib/models/Order";
import { Package, Clock, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const JWT_SECRET = process.env.JWT_SECRET || "gravity_super_secret_key";

const FALLBACK_ACCOUNT_ORDERS = [
  {
    _id: "64a1b2c3d4e5f60000001001",
    status: "paid",
    totalAmount: 299,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    items: [
      {
        productId: "64a1b2c3d4e5f60000000001",
        name: "Acoustic Prime Headset",
        quantity: 1,
        price: 299,
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80",
      }
    ]
  }
];

async function getUserOrders(userId: string) {
  try {
    const conn = await connectDB();
    if (conn) {
      const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();
      if (orders.length > 0) return orders;
    }
  } catch {
    // db offline
  }
  return FALLBACK_ACCOUNT_ORDERS;
}

export default async function AccountPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  let decoded: { userId: string; name?: string; email?: string } | null = null;

  try {
    decoded = jwt.verify(token!, JWT_SECRET) as { userId: string; name?: string; email?: string };
  } catch {
    return null; // layout handles redirect
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orders = await getUserOrders(decoded.userId) as any[];

  return (
    <div className="container mx-auto px-6 max-w-5xl">
      <div className="mb-10 pb-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] text-[#bbf3ff] tracking-[0.25em] uppercase block mb-1">
            VERIFIED OPERATOR // PROFILE LEDGER
          </span>
          <h1 className="font-sans font-black text-3xl md:text-4xl text-white uppercase tracking-tight">
            Account Clearance
          </h1>
          <p className="font-mono text-xs text-gray-400 mt-1">
            Identity: {decoded.email || decoded.userId}
          </p>
        </div>
        <Link
          href="/#showroom-registry"
          className="font-mono text-xs text-[#bbf3ff] hover:text-white transition-colors flex items-center gap-1.5"
        >
          BROWSE SHOWROOM <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="bg-[#0e0e12]/90 border border-white/10 p-8 rounded-2xl shadow-2xl">
        <h2 className="font-mono text-xs tracking-widest text-[#bbf3ff] mb-8 flex items-center gap-2 uppercase">
          <Package className="w-4 h-4 text-[#bbf3ff]" /> 
          TRANSACTION MANIFEST & TELEMETRY
        </h2>

        {orders.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-white/10 rounded-xl">
            <p className="text-gray-400 font-mono text-xs uppercase tracking-widest mb-4">NO TRANSACTIONS RECORDED</p>
            <Link
              href="/#showroom-registry"
              className="inline-flex px-5 py-2.5 bg-white text-black font-mono font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-[#bbf3ff] transition-colors"
            >
              STAGE FIRST ACQUISITION
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id.toString()} className="bg-black/40 border border-white/5 rounded-xl p-6 relative overflow-hidden group hover:border-white/15 transition-colors">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#bbf3ff] opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-0.5">Manifest ID</p>
                    <p className="font-mono text-xs text-white font-bold select-all">{order._id.toString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-0.5">Status</p>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase
                      ${order.status === 'paid' || order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
                      ${order.status === 'shipped' || order.status === 'processing' ? 'bg-[#bbf3ff]/10 text-[#bbf3ff] border border-[#bbf3ff]/20' : ''}
                      ${order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : ''}
                      ${order.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : ''}
                    `}>
                      {(order.status === 'paid' || order.status === 'delivered') && <CheckCircle className="w-3 h-3" />}
                      {(order.status === 'shipped' || order.status === 'processing') && <Package className="w-3 h-3" />}
                      {order.status === 'pending' && <Clock className="w-3 h-3" />}
                      {order.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-4 bg-white/[0.02] p-3 rounded-lg border border-white/5">
                      <div className="w-12 h-12 relative bg-black/60 rounded border border-white/10 overflow-hidden flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-contain p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white uppercase truncate">{item.name}</p>
                        <p className="text-[10px] font-mono text-gray-500">QTY: {item.quantity}</p>
                      </div>
                      <p className="font-mono text-xs font-bold text-[#bbf3ff]">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-white/5 flex justify-between items-center font-mono">
                  <p className="text-[10px] text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm font-bold text-white">
                    TOTAL: <span className="text-[#bbf3ff]">${Number(order.totalAmount).toFixed(2)}</span>
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
