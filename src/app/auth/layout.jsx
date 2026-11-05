import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Account Access",
  description: "Sign in or create a customer account with The Lux Basket.",
  path: "/auth/login",
  noIndex: true,
});

export default function AuthLayout({ children }) {
  return children;
}
