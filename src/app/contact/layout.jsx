import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Contact The Lux Basket",
  description: "Contact The Lux Basket for order support, custom gifts, wedding hampers, and corporate gifting inquiries.",
  path: "/contact",
});

export default function ContactLayout({ children }) {
  return children;
}
