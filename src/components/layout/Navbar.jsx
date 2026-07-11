"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Search,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  {
    href: "/collections",
    label: "Collections",
    children: [
      { href: "/collections?category=luxury-hampers", label: "Luxury Hampers" },
      { href: "/collections?category=corporate", label: "Corporate Gifts" },
      { href: "/collections?category=wedding", label: "Wedding Gifts" },
      { href: "/collections?category=festive", label: "Festive Hampers" },
      { href: "/collections?category=customized", label: "Customized Gifts" },
    ],
  },
  { href: "/corporate", label: "Corporate" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const { data: session } = useSession();
  const { itemCount, openCart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const dropdownRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cartCount = itemCount();

  return (
    <>


      {/* Main Navbar */}
      <nav
        className={cn(
          "sticky top-0 z-50 transition-all duration-400",
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-card border-b border-beige"
            : "bg-ivory border-b border-beige/50",
        )}
      >
        <div className="container-luxury">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex flex-col items-start group">
              <span className="font-heading text-2xl font-medium text-emerald tracking-wide leading-none group-hover:text-gold transition-colors duration-300">
                The Lux Basket
              </span>
              <span className="text-[9px] tracking-[0.35em] uppercase text-gold font-body font-medium">
                The Finer Way to Gifting
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div
              ref={dropdownRef}
              className="hidden lg:flex items-center gap-8"
            >
              {navLinks.map((link) => (
                <div key={link.href} className="relative">
                  {link.children ? (
                    <button
                      className="flex items-center gap-1 text-sm font-body font-medium text-charcoal/80 hover:text-emerald transition-colors duration-200 tracking-wide"
                      onMouseEnter={() => setActiveDropdown(link.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {link.label}
                      <ChevronDown
                        size={14}
                        className={cn(
                          "transition-transform duration-200",
                          activeDropdown === link.label ? "rotate-180" : "",
                        )}
                      />
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm font-body font-medium text-charcoal/80 hover:text-emerald transition-colors duration-200 tracking-wide relative group"
                    >
                      {link.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
                    </Link>
                  )}

                  {/* Dropdown */}
                  {link.children && (
                    <AnimatePresence>
                      {activeDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white border border-beige shadow-card-hover z-50"
                          onMouseEnter={() => setActiveDropdown(link.label)}
                          onMouseLeave={() => setActiveDropdown(null)}
                        >
                          <div className="py-2">
                            {link.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className="block px-5 py-3 text-sm font-body text-charcoal/80 hover:text-emerald hover:bg-beige-light transition-colors duration-150 border-l-2 border-transparent hover:border-gold"
                                onClick={() => setActiveDropdown(null)}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-charcoal/70 hover:text-emerald transition-colors duration-200"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Wishlist */}
              <Link
                href="/dashboard/wishlist"
                className="relative p-2 text-charcoal/70 hover:text-emerald transition-colors duration-200"
                aria-label="Wishlist"
              >
                <Heart size={20} />
                {isMounted && wishlistItems.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-emerald-dark text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-2 text-charcoal/70 hover:text-emerald transition-colors duration-200"
                aria-label="Shopping cart"
              >
                <ShoppingBag size={20} />
                {isMounted && cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 1.4 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald text-ivory text-[9px] font-bold rounded-full flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>

              {/* User */}
              {session ? (
                <div className="relative group hidden lg:block">
                  <button className="flex items-center gap-2 p-2 text-charcoal/70 hover:text-emerald transition-colors duration-200">
                    <User size={20} />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-beige shadow-card-hover opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <p className="px-4 py-2 text-xs text-charcoal/50 font-body border-b border-beige truncate">
                        {session.user?.email}
                      </p>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2.5 text-sm font-body text-charcoal hover:bg-beige-light hover:text-emerald transition-colors"
                      >
                        My Orders
                      </Link>
                      <Link
                        href="/dashboard/wishlist"
                        className="block px-4 py-2.5 text-sm font-body text-charcoal hover:bg-beige-light hover:text-emerald transition-colors"
                      >
                        Wishlist
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        className="block px-4 py-2.5 text-sm font-body text-charcoal hover:bg-beige-light hover:text-emerald transition-colors"
                      >
                        Settings
                      </Link>
                      {session.user?.role === "admin" && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2.5 text-sm font-body text-gold hover:bg-gold/10 transition-colors"
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="block w-full text-left px-4 py-2.5 text-sm font-body text-red-500 hover:bg-red-50 transition-colors border-t border-beige mt-1"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="hidden lg:flex btn-primary py-2.5 px-5 text-xs"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden p-2 text-charcoal/70 hover:text-emerald transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-beige overflow-hidden"
            >
              <div className="container-luxury py-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) {
                      window.location.href = `/collections?search=${encodeURIComponent(searchQuery)}`;
                    }
                  }}
                  className="flex gap-3"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search luxury hampers, corporate gifts..."
                    className="luxury-input flex-1"
                    autoFocus
                  />

                  <button type="submit" className="btn-primary py-3 px-6">
                    <Search size={16} />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-beige bg-white overflow-hidden"
            >
              <div className="container-luxury py-4 space-y-1">
                {navLinks.map((link) => (
                  <div key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      className="block py-3 text-sm font-body font-medium text-charcoal/80 hover:text-emerald border-b border-beige/50 transition-colors"
                    >
                      {link.label}
                    </Link>
                    {link.children && (
                      <div className="pl-4 space-y-1 pb-2">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setIsMobileOpen(false)}
                            className="block py-2 text-xs font-body text-charcoal/60 hover:text-gold transition-colors"
                          >
                            → {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="pt-2 space-y-2">
                  {session ? (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMobileOpen(false)}
                        className="block btn-outline w-full text-center py-3"
                      >
                        My Account
                      </Link>
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="block w-full btn-primary text-center py-3"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/auth/login"
                      onClick={() => setIsMobileOpen(false)}
                      className="block btn-primary w-full text-center py-3"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
