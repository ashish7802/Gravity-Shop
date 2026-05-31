"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { ProductDataGrid } from "@/components/admin/ProductDataGrid";
import dynamic from "next/dynamic";

const ProductUploadModal = dynamic(
  () => import("@/components/admin/ProductUploadModal").then((mod) => mod.ProductUploadModal),
  { ssr: false }
);

export default function AdminProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="font-display font-bold text-4xl tracking-wider text-white uppercase"
          >
            Asset Management
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="text-gray-400 font-mono mt-2"
          >
            Initialize and configure holographic product payloads.
          </motion.p>
        </div>
        
        <motion.button 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-white text-space-900 font-bold tracking-widest rounded-lg hover:bg-neon-cyan transition-colors"
        >
          <Plus className="w-5 h-5" />
          NEW ASSET
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      >
        <ProductDataGrid />
      </motion.div>

      <ProductUploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
