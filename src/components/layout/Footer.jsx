"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { getAlternateWhatsAppNumber, getWhatsAppNumber, getWhatsAppUrl } from "@/lib/utils";
import { CONTACT_EMAILS } from "@/lib/contact";

const footerLinks = {
  company: [
    { href: "/about", label: "About Us" },
    { href: "/corporate", label: "Corporate Gifting" },
    { href: "/contact", label: "Contact Us" },
    { href: "/collections", label: "Collections" },
  ],
  categories: [],
  support: [
    { href: "/faq", label: "FAQs" },
    { href: "/shipping", label: "Shipping Policy" },
    { href: "/returns", label: "Return Policy" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Conditions" },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [dynamicCategories, setDynamicCategories] = useState([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          setDynamicCategories(
            data.categories.map((c) => ({
              href: `/collections?category=${c.slug}`,
              label: c.name,
            }))
          );
        }
      })
      .catch(console.error);
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const website = new FormData(e.currentTarget).get("website");
    if (!email) return toast.error("Please enter your email address");

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to subscribe");

      toast.success("Thank you for subscribing!");
      setEmail("");
    } catch (error) {
      toast.error(error.message || "Failed to subscribe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-emerald-dark text-ivory/80">
      {/* Newsletter Strip */}
      <div className="bg-gold/10 border-y border-gold/20">
        <div className="container-luxury py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-heading text-2xl text-ivory font-medium">
              Stay in the luxury loop
            </p>
            <p className="text-sm font-body text-ivory/60 mt-1">
              Exclusive offers, new arrivals & gifting inspirations
            </p>
          </div>
          <form
            className="flex gap-0 w-full md:w-auto"
            onSubmit={handleSubscribe}
          >
            <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
              <label htmlFor="newsletter-website">Leave this field empty</label>
              <input id="newsletter-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>
            <input
              type="email"
              aria-label="Email address for newsletter"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              className="px-5 py-3.5 bg-white/10 border border-gold/30 text-ivory placeholder:text-ivory/40 text-sm font-body flex-1 md:w-72 focus:outline-none focus:border-gold disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 bg-gold text-emerald-dark text-xs font-body font-bold tracking-widest uppercase hover:bg-gold-light transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-luxury py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex flex-col items-start mb-5">
              <span className="font-heading text-3xl font-medium text-ivory tracking-wide">
                The Lux Basket
              </span>
              <span className="text-[9px] tracking-[0.35em] uppercase text-gold font-body">
                The Finer Way to Gifting
              </span>
            </Link>
            <p className="text-sm font-body text-ivory/60 leading-relaxed max-w-xs">
              Crafting moments of luxury and elegance through thoughtfully
              curated gift hampers. Each basket tells a story of premium quality
              and heartfelt gifting.
            </p>

            {/* Contact Info */}
            <div className="mt-6 space-y-2.5">
              <div className="flex items-center gap-3 text-sm font-body text-ivory/60">
                <Phone size={14} className="text-gold flex-shrink-0" />
                <div className="flex flex-wrap gap-2">
                  <a
                    href={getWhatsAppUrl(getWhatsAppNumber(), "Hi! I would like to know more about The Lux Basket.")}
                    onClick={() => trackEvent("contact_click", { section: "footer", channel: "whatsapp" })}
                    className="hover:text-gold transition-colors"
                  >
                    {getWhatsAppNumber()}
                  </a>
                  <span className="text-ivory/30">/</span>
                  <a
                    href={getWhatsAppUrl(getAlternateWhatsAppNumber(), "Hi! I would like to know more about The Lux Basket.")}
                    onClick={() => trackEvent("contact_click", { section: "footer", channel: "whatsapp" })}
                    className="hover:text-gold transition-colors"
                  >
                    {getAlternateWhatsAppNumber()}
                  </a>
                </div>
              </div>
              <div className="space-y-2">
                {CONTACT_EMAILS.map((email) => (
                  <a
                    key={email}
                    href={`mailto:${email}`}
                    onClick={() => trackEvent("contact_click", { section: "footer", channel: "email" })}
                    className="flex items-center gap-3 text-sm font-body text-ivory/60 hover:text-gold transition-colors"
                  >
                    <Mail size={14} className="text-gold flex-shrink-0" />
                    {email}
                  </a>
                ))}
              </div>
              <a 
                href="https://share.google/GtPJZ4jH28vCTJ8bp" 
                  onClick={() => trackEvent("outbound_click", { section: "footer", destination: "maps" })}
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-start gap-3 text-sm font-body text-ivory/60 hover:text-gold transition-colors"
              >
                <MapPin size={14} className="text-gold flex-shrink-0 mt-0.5" />
                #101,185, AECS Layout, C Block,8th Cross, Singasandra, Bengaluru - 560068
              </a>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-4 mt-6">
              {[
                { href: "https://www.instagram.com/theluxbasketgift/?utm_source=ig_web_button_share_sheet", icon: Instagram, label: "Instagram" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-none border border-ivory/20 flex items-center justify-center text-ivory/60 hover:text-gold hover:border-gold transition-all duration-200"
                  onClick={() => href !== "#" && trackEvent("outbound_click", { section: "footer_social", destination: label.toLowerCase() })}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-body text-xs font-bold tracking-[0.2em] uppercase text-gold mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-body text-ivory/60 hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-body text-xs font-bold tracking-[0.2em] uppercase text-gold mb-5">
              Collections
            </h4>
            <ul className="space-y-3">
              {dynamicCategories.length > 0 ? (
                dynamicCategories.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm font-body text-ivory/60 hover:text-gold transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-sm font-body text-ivory/60">Loading...</li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-body text-xs font-bold tracking-[0.2em] uppercase text-gold mb-5">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-body text-ivory/60 hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-ivory/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <p className="text-xs font-body text-ivory/40 text-center">
              © {new Date().getFullYear()} The Lux Basket. All rights reserved.
            </p>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("luxbasket:open-cookie-settings"))}
              className="text-xs font-body text-ivory/50 underline underline-offset-2 hover:text-gold"
            >
              Cookie settings
            </button>
          </div>
          <div className="flex items-center gap-2">
            {["VISA", "Mastercard", "UPI", "Netbanking"].map((method) => (
              <span
                key={method}
                className="px-3 py-1 border border-ivory/20 text-[10px] font-body text-ivory/40 tracking-wider"
              >
                {method}
              </span>
            ))}
          </div>
          <p className="text-xs font-body text-ivory/30">
            Crafted with ♥ in India
          </p>
        </div>
      </div>
    </footer>
  );
}
