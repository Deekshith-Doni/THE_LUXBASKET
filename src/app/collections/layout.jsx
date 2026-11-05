import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Shop Gift Hampers and Collections",
  description: "Browse premium gift hampers, wedding gifts, corporate gifting, and festive collections from The Lux Basket.",
  path: "/collections",
});

export default function CollectionsLayout({ children }) {
  return children;
}
