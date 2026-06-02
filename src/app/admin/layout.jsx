"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  MessageSquare,
  Image,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/categories", icon: Tag, label: "Categories" },
  { href: "/admin/inquiries", icon: MessageSquare, label: "Inquiries" },
  { href: "/admin/banners", icon: Image, label: "Banners" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-charcoal/5">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-dark flex-shrink-0 flex flex-col">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-ivory/10">
          <Link href="/admin">
            <span className="font-heading text-2xl font-medium text-ivory">
              The LuxBasket
            </span>
            <span className="block text-[10px] tracking-[0.3em] uppercase text-gold font-body mt-0.5">
              Admin Panel
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center justify-between px-3 py-3 text-sm font-body font-medium transition-all",
                pathname === href
                  ? "bg-gold text-emerald-dark"
                  : "text-ivory/70 hover:bg-ivory/10 hover:text-ivory",
              )}
            >
              <div className="flex items-center gap-3">
                <Icon size={16} />
                {label}
              </div>
              {pathname === href && <ChevronRight size={14} />}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-6">
          <Link
            href="/"
            target="_blank"
            className="block px-3 py-2.5 text-xs font-body text-ivory/50 hover:text-ivory transition-colors"
          >
            ← View Store
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 px-3 py-2.5 text-xs font-body text-red-400 hover:text-red-300 transition-colors w-full"
          >
            <LogOut size={13} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
