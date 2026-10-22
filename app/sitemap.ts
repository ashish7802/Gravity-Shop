import { MetadataRoute } from "next";
export const dynamic = "force-dynamic";
import connectDB from "@/lib/db/connect";
import { Product } from "@/lib/models/Product";

const FALLBACK_PRODUCT_IDS = [
  "64a1b2c3d4e5f60000000001",
  "64a1b2c3d4e5f60000000002",
  "64a1b2c3d4e5f60000000003",
  "64a1b2c3d4e5f60000000004",
  "64a1b2c3d4e5f60000000005",
  "64a1b2c3d4e5f60000000006",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://gravity-shop.com";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let productUrls: any[] = [];

  try {
    const conn = await connectDB();
    if (conn) {
      const products = await Product.find({}).select("_id updatedAt").lean();
      if (products.length > 0) {
        productUrls = products.map((product) => ({
          url: `${baseUrl}/product/${product._id.toString()}`,
          lastModified: product.updatedAt || new Date(),
          changeFrequency: "daily" as const,
          priority: 0.8,
        }));
      }
    }
  } catch {
    console.log("Sitemap DB connection skipped during build");
  }

  if (productUrls.length === 0) {
    productUrls = FALLBACK_PRODUCT_IDS.map((id) => ({
      url: `${baseUrl}/product/${id}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/account`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    ...productUrls,
  ];
}
