import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

const publicPages = [
  "/",
  "/collections",
  "/about",
  "/corporate",
  "/contact",
  "/faq",
  "/shipping",
  "/returns",
  "/privacy",
  "/terms",
];

export default async function sitemap() {
  const staticEntries = publicPages.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "/" || path === "/collections" ? "daily" : "monthly",
    priority: path === "/" ? 1 : path === "/collections" ? 0.9 : 0.6,
  }));

  try {
    await connectDB();
    const products = await Product.find({ isActive: true }).select("slug updatedAt createdAt").lean();
    return [
      ...staticEntries,
      ...products.map((product) => ({
        url: `${SITE_URL}/product/${product.slug}`,
        lastModified: product.updatedAt || product.createdAt,
        changeFrequency: "weekly",
        priority: 0.8,
      })),
    ];
  } catch (error) {
    console.error("Could not add product URLs to sitemap:", error);
    return staticEntries;
  }
}
