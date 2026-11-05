const SOCIAL_IMAGE = "/og-image.png";

export function createPageMetadata({ title, description, path, noIndex = false }) {
  const socialTitle = typeof title === "string" ? title : title?.absolute || title?.default || "The Lux Basket";
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: "The Lux Basket",
      title: socialTitle,
      description,
      url: path,
      images: [{ url: SOCIAL_IMAGE, width: 1200, height: 630, alt: "The Lux Basket — luxury gifting" }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [SOCIAL_IMAGE],
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
