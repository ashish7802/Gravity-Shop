"use client";

import { motion } from "framer-motion";
import { ProductCard3D, Product } from "./ProductCard3D";

interface ProductGridProps {
  products: Product[];
}

const containerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.06
    }
  }
};

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <motion.div 
      variants={containerVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-50px" }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-white/5 border border-white/5"
    >
      {products.map((product) => (
        <ProductCard3D key={product.id} product={product} />
      ))}
    </motion.div>
  );
}
