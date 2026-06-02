"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  Package,
  Heart,
  MapPin,
  Settings,
  ChevronRight,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: Package, label: "My Orders" },
  { href: "/dashboard/wishlist", icon: Heart, label: "Wishlist" },
  { href: "/dashboard/addresses", icon: MapPin, label: "Addresses" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function DashboardLayout({ children }) {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-ivory">
      <div className="bg-emerald-dark py-12">
        <div className="container-luxury">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gold rounded-full flex items-center justify-center">
              <span className="font-heading text-2xl text-emerald-dark font-medium">
                {session?.user?.name?.[0] || "U"}
              </span>
            </div>
            <div>
              <h1 className="font-heading text-3xl text-ivory">
                Welcome back,
              </h1>
              <p className="font-body text-gold text-lg">
                {session?.user?.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-luxury py-10">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="bg-white border border-beige p-4 h-fit">
            <div className="flex items-center gap-3 px-3 py-4 border-b border-beige mb-3">
              <User size={16} className="text-charcoal/40" />
              <div>
                <p className="font-body text-sm font-medium text-charcoal truncate">
                  {session?.user?.name}
                </p>
                <p className="font-body text-xs text-charcoal/50 truncate">
                  {session?.user?.email}
                </p>
              </div>
            </div>
            <nav className="space-y-1">
              {navItems.map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center justify-between px-3 py-3 text-sm font-body font-medium transition-all",
                    pathname === href
                      ? "bg-emerald text-ivory"
                      : "text-charcoal/70 hover:bg-beige-light hover:text-emerald",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} />
                    {label}
                  </div>
                  <ChevronRight size={14} />
                </Link>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
