import HeroSection from "@/components/home/HeroSection";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import CorporateSection from "@/components/home/CorporateSection";

import FAQSection from "@/components/home/FAQSection";
import WeddingSection from "@/components/home/WeddingSection";
import BestSellers from "@/components/home/BestSellers";
import MarqueeBanner from "@/components/home/MarqueeBanner";

export const metadata = {
  title: "The Lux Basket | Premium Luxury Gifting in India",
  description:
    "Shop India's finest luxury gift hampers. Corporate gifting, wedding return gifts, festive hampers & customized gifts. Premium quality, elegant packaging, pan-India delivery.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeBanner />
      <FeaturedCollections />
      <BestSellers />
      <CorporateSection />
      <WeddingSection />

      <FAQSection />
    </>
  );
}
