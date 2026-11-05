import { cache } from "react";
import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { SITE_URL } from "@/lib/site";
import ProductDetailClient from "./ProductDetailClient";

const getProduct = cache(async (slug) => {
  try {
    await connectDB();
    const product = await Product.findOne({ slug, isActive: true })
      .populate("category", "name slug")
      .lean();
    return { product: product ? JSON.parse(JSON.stringify(product)) : null, unavailable: false };
  } catch (error) {
    console.error("Could not load product for page metadata:", error);
    return { product: null, unavailable: true };
  }
});

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const result = await getProduct(slug);
  const product = result.product;
  const path = `/product/${encodeURIComponent(slug)}`;

  if (!product) {
    return {
      title: result.unavailable ? "Gift Hampers" : "Gift Not Found",
      description: "Explore luxury gift hampers and thoughtful gifts from The Lux Basket.",
      alternates: { canonical: path },
      robots: { index: false, follow: true },
    };
  }

  const description = (product.shortDescription || product.description || "Luxury gift hamper from The Lux Basket")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
  const image = product.images?.[0] || "/og-image.png";
  const title = product.name;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: "The Lux Basket",
      title,
      description,
      url: path,
      images: [{ url: image, alt: product.name }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

function ProductStructuredData({ product, slug }) {
  const price = Number(product.discountPrice || product.price);
  const productUrl = `${SITE_URL}/product/${encodeURIComponent(slug)}`;
  const images = (product.images || []).filter((image) => typeof image === "string" && image.length > 0);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: (product.shortDescription || product.description || "").replace(/\s+/g, " ").trim(),
    image: images.length ? images : [`${SITE_URL}/og-image.png`],
    sku: product.sku || undefined,
    category: typeof product.category === "object" ? product.category?.name : undefined,
    brand: { "@type": "Brand", name: "The Lux Basket" },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "INR",
      price: price.toFixed(2),
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "The Lux Basket" },
    },
    ...(product.numReviews > 0 && product.rating > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(product.rating).toFixed(1),
            reviewCount: Number(product.numReviews),
          },
        }
      : {}),
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Collections", item: `${SITE_URL}/collections` },
      { "@type": "ListItem", position: 3, name: product.name, item: productUrl },
    ],
  };

  return (
    <>
      {[schema, breadcrumbs].map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const result = await getProduct(slug);

  if (!result.unavailable && !result.product) notFound();

  return (
    <>
      {result.product && <ProductStructuredData product={result.product} slug={slug} />}
      <ProductDetailClient initialProduct={result.product} />
    </>
  );
}
