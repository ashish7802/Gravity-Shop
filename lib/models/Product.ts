import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    image: { type: String, required: true },
    description: { type: String, required: true },
    stock: { type: Number, required: true, default: 10 },
    tags: [{ type: String }],
    // Future expansion
    colors: [{ type: String }],
    sizes: [{ type: String }],
    modelPath: { type: String }, // Path to .glb file
    // Operational 3D Asset Metadata
    modelSize: { type: Number, default: 0 }, // Bytes
    polyCount: { type: Number, default: 0 }, // If extracted later
    optimizationStatus: { type: String, enum: ["pending", "optimized", "failed", "untracked"], default: "untracked" },
  },
  { timestamps: true }
);

// Indexing for search
productSchema.index({ name: 'text', description: 'text', category: 'text' });

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
