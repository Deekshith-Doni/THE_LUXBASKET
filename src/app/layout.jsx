import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import CartDrawer from "@/components/cart/CartDrawer";
import SessionProvider from "@/components/providers/SessionProvider";
import AnalyticsConsent from "@/components/analytics/AnalyticsConsent";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import BackToTop from "@/components/layout/BackToTop";
import { auth } from "@/lib/auth";
import { SITE_URL } from "@/lib/site";
import { getWhatsAppNumber } from "@/lib/utils";
import { CONTACT_EMAILS } from "@/lib/contact";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  title: {
    default: "The Lux Basket | The Finer Way to Gifting",
    template: "%s | The Lux Basket",
  },
  description:
    "India's most premium gifting brand. Luxury hampers, corporate gifts, wedding return gifts, festive hampers & customized gifts. Crafted with love, delivered with elegance.",
  keywords: [
    "luxury gifts",
    "premium hampers",
    "corporate gifting",
    "wedding return gifts",
    "festive hampers",
    "customized gifts",
    "gift baskets India",
    "The Lux Basket",
  ],
  authors: [{ name: "The Lux Basket" }],
  creator: "The Lux Basket",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "The Lux Basket",
    title: "The Lux Basket | Premium Luxury Gifting",
    description:
      "India's most premium gifting brand. Luxury hampers, corporate gifts, wedding return gifts & customized gifts.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "The Lux Basket — luxury gifting" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Lux Basket | Premium Luxury Gifting",
    description: "India's most premium gifting brand.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-ivory font-body antialiased">
        <SessionProvider session={session}>
          <a href="#main-content" className="skip-link">Skip to content</a>
          <Navbar />
          <Breadcrumbs />
          <CartDrawer />
          <main id="main-content" tabIndex={-1} className="min-h-screen">{children}</main>
          <Footer />
          <WhatsAppButton />
          <BackToTop />
          <AnalyticsConsent />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                name: "The Lux Basket",
                url: SITE_URL,
                image: `${SITE_URL}/og-image.png`,
                description: "Luxury gift hampers, corporate gifts, wedding return gifts, and customized gifts.",
                email: CONTACT_EMAILS,
                telephone: getWhatsAppNumber(),
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "#101, 185, AECS Layout, C Block, 8th Cross, Singasandra",
                  addressLocality: "Bengaluru",
                  addressRegion: "Karnataka",
                  postalCode: "560068",
                  addressCountry: "IN",
                },
                areaServed: "IN",
                sameAs: ["https://www.instagram.com/theluxbasketgift/"],
              }).replace(/</g, "\\u003c"),
            }}
          />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: "#2B2B2B",
                color: "#F8F5F0",
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                borderRadius: "0",
                border: "1px solid #D4AF37",
              },
              success: {
                iconTheme: { primary: "#D4AF37", secondary: "#2B2B2B" },
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
