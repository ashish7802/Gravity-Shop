import { MetadataRoute } from "next";
import connectDB from "@/lib/db/connect";
import { Product } from "@/lib/models/Product";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://gravity-shop.com";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let productUrls: any[] = [];

  try {
    await connectDB();
    const products = await Product.find({}).select("_id updatedAt").lean();

    productUrls = products.map((product) => ({
      url: `${baseUrl}/product/${product._id.toString()}`,
      lastModified: product.updatedAt || new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));
  } catch {
    console.log("Sitemap DB connection skipped during build");
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
    ...productUrls,
  ];
}
