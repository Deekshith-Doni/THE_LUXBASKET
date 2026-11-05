"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_URL } from "@/lib/site";

const LABELS = {
  about: "About Us",
  corporate: "Corporate Gifting",
  contact: "Contact Us",
  collections: "Collections",
  faq: "FAQs",
  shipping: "Shipping Policy",
  returns: "Returns",
  privacy: "Privacy Policy",
  terms: "Terms & Conditions",
};

const HIDDEN_PREFIXES = ["/admin", "/api", "/auth", "/cart", "/checkout", "/dashboard", "/product", "/thank-you"];

export default function Breadcrumbs() {
  const pathname = usePathname();
  if (!pathname || pathname === "/" || HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return null;

  const segments = pathname.split("/").filter(Boolean);
  if (!segments.length) return null;

  const crumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const label = LABELS[segment] || decodeURIComponent(segment).replace(/[-_]/g, " ");
    return { href, label: label.replace(/\b\w/g, (char) => char.toUpperCase()) };
  });
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      ...crumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: crumb.label,
        item: `${SITE_URL}${crumb.href}`,
      })),
    ],
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className="border-b border-beige/70 bg-ivory">
        <ol className="container-luxury flex min-h-11 items-center gap-2 overflow-x-auto whitespace-nowrap text-xs font-body text-charcoal/60">
          <li><Link href="/" className="hover:text-emerald">Home</Link></li>
          {crumbs.map((crumb, index) => (
            <li key={crumb.href} className="flex items-center gap-2">
              <span aria-hidden="true" className="text-charcoal/30">/</span>
              {index === crumbs.length - 1 ? (
                <span aria-current="page" className="font-medium text-charcoal">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="hover:text-emerald">{crumb.label}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
