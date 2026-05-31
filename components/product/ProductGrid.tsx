"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ProductCard3D, Product } from "./ProductCard3D";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <AnimatePresence mode="popLayout">
        {products.map((product, idx) => (
          <ProductCard3D key={product.id} product={product} index={idx} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
