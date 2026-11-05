import HeroSection from "@/components/home/HeroSection";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import CorporateSection from "@/components/home/CorporateSection";

import FAQSection from "@/components/home/FAQSection";

import BestSellers from "@/components/home/BestSellers";
import MarqueeBanner from "@/components/home/MarqueeBanner";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = {
  ...createPageMetadata({
    title: { absolute: "The Lux Basket | Premium Luxury Gifting in India" },
    description: "Shop India's finest luxury gift hampers. Corporate gifting, wedding return gifts, festive hampers and customized gifts, with elegant pan-India delivery.",
    path: "/",
  }),
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BestSellers />
      <FeaturedCollections />
      <MarqueeBanner />
      <CorporateSection />


      <FAQSection />
    </>
  );
}
