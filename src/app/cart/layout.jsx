import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Your Basket",
  description: "Review the gifts in your basket before checkout.",
  path: "/cart",
  noIndex: true,
});

export default function CartLayout({ children }) {
  return children;
}
