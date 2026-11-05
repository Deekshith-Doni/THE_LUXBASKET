import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Secure Checkout",
  description: "Enter your delivery details and complete your order securely.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutLayout({ children }) {
  return children;
}
