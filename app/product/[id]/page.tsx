import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { ProductDetails } from "@/components/product/ProductDetails";

export const revalidate = 60; // ISR every 60 seconds

const MOCK_PRODUCTS = [
  {
    _id: "64a1b2c3d4e5f60000000001",
    name: "Acoustic Prime Headset",
    category: "Audio",
    price: 299,
    description: "Premium wireless audio with 3D spatial sound technology. Crafted from aerospace-grade materials.",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80",
    tags: ["wireless", "audio", "premium"],
    stock: 50,
  },
  {
    _id: "64a1b2c3d4e5f60000000002",
    name: "Nebula Mechanical Keyboard",
    category: "Accessories",
    price: 189,
    description: "Aircraft-grade aluminum body, tactile switches, and per-key RGB illumination.",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80",
    tags: ["keyboard", "mechanical", "rgb"],
    stock: 120,
  },
  {
    _id: "64a1b2c3d4e5f60000000003",
    name: "Quantum 4K Monitor",
    category: "Displays",
    price: 899,
    description: "32-inch 4K OLED display with 144Hz refresh rate and true HDR capability.",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    tags: ["monitor", "4k", "oled"],
    stock: 25,
  },
  {
    _id: "64a1b2c3d4e5f60000000004",
    name: "Zenith Studio Microphone",
    category: "Audio",
    price: 149,
    description: "Studio-quality condenser microphone for crystal clear recordings.",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80",
    tags: ["audio", "microphone", "studio"],
    stock: 80,
  },
  {
    _id: "64a1b2c3d4e5f60000000005",
    name: "Ergo Pro Mouse",
    category: "Accessories",
    price: 99,
    description: "Ergonomic wireless mouse with ultra-low latency and programmable buttons.",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
    tags: ["mouse", "wireless", "ergonomic"],
    stock: 200,
  },
  {
    _id: "64a1b2c3d4e5f60000000006",
    name: "Lumina Desk Lamp",
    category: "Accessories",
    price: 79,
    description: "Smart LED desk lamp with adjustable color temperature and brightness.",
    image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&w=800&q=80",
    tags: ["lighting", "desk", "smart"],
    stock: 150,
  }
];

async function getProduct(id: string) {
  return MOCK_PRODUCTS.find(p => p._id === id) || null;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProduct(params.id);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | Gravity Shop`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Gravity Shop`,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const product = await getProduct(params.id) as any;
  if (!product) {
    notFound();
  }

  // Convert ObjectIds to strings for client components
  const safeProduct = {
    ...product,
    _id: product._id.toString(),
  };

  const relatedQuery = MOCK_PRODUCTS.filter(
    (p) => p.category === product.category && p._id !== product._id
  ).slice(0, 4);

  const relatedProducts = relatedQuery.map((p) => ({
    ...p,
    id: p._id.toString(),
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: safeProduct.name,
    image: safeProduct.image,
    description: safeProduct.description,
    offers: {
      "@type": "Offer",
      price: safeProduct.price,
      priceCurrency: "USD",
      availability: safeProduct.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <main className="min-h-screen bg-[#08080a] text-[#e2e8f0] selection:bg-[#bbf3ff]/30 selection:text-[#bbf3ff]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <div className="pt-32 pb-24">
        <ProductDetails product={safeProduct} related={relatedProducts} />
      </div>
    </main>
  );
}
