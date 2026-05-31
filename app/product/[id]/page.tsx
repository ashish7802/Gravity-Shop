import { Metadata } from "next";
import { notFound } from "next/navigation";
import connectDB from "@/lib/db/connect";
import { Product } from "@/lib/models/Product";
import { Navbar } from "@/components/ui/Navbar";
import { ProductDetails } from "@/components/product/ProductDetails";

export const revalidate = 60; // ISR every 60 seconds

async function getProduct(id: string) {
  try {
    await connectDB();
    const product = await Product.findById(id).lean();
    return product;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const product = await getProduct(params.id) as any;
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

  const relatedQuery = await Product.find({
    category: product.category,
    _id: { $ne: product._id }
  }).limit(4).lean();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const relatedProducts = relatedQuery.map((p: any) => ({
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
    <main className="min-h-screen bg-[#030014] text-white selection:bg-neon-cyan/30">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <div className="pt-32 pb-24">
        <ProductDetails product={safeProduct} related={relatedProducts} />
      </div>
    </main>
  );
}
