"use client";
import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
import { getAlternateWhatsAppNumber, getWhatsAppNumber, getWhatsAppUrl } from "@/lib/utils";
import { CONTACT_EMAILS } from "@/lib/contact";

export default function ContactPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    type: "general",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const website = new FormData(e.currentTarget).get("website");
    setIsLoading(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        trackEvent("enquiry_submit", { section: "contact", enquiry_type: form.type });
        toast.success("Message sent! We'll get back to you soon.");
        router.push("/thank-you?type=contact");
      } else {
        toast.error(data.error || "Failed to send message. Please try again.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-ivory min-h-screen">
      {/* Header */}
      <div className="bg-emerald-dark py-20">
        <div className="container-luxury text-center">
          <span className="section-tag text-gold">Get in Touch</span>
          <h1 className="font-heading text-5xl md:text-6xl font-light text-ivory mt-3">
            Contact Us
          </h1>
          <div className="w-16 h-px bg-gold mx-auto mt-6" />
        </div>
      </div>

      <div className="container-luxury py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h2 className="font-heading text-2xl text-charcoal mb-5">
                Reach Out
              </h2>
              <div className="space-y-4">
                {[
                  {
                    icon: Phone,
                    label: "Phone / WhatsApp",
                    isMultiLink: true,
                    links: [
                      {
                        value: getWhatsAppNumber(),
                        href: getWhatsAppUrl(getWhatsAppNumber(), "Hi! I have a question about The Lux Basket."),
                      },
                      {
                        value: getAlternateWhatsAppNumber(),
                        href: getWhatsAppUrl(getAlternateWhatsAppNumber(), "Hi! I have a question about The Lux Basket."),
                      },
                    ],
                  },
                  {
                    icon: Mail,
                    label: "Email",
                    isMultiLink: true,
                    links: CONTACT_EMAILS.map((email) => ({
                      value: email,
                      href: `mailto:${email}`,
                      channel: "email",
                    })),
                  },
                  {
                    icon: MapPin,
                    label: "Location",
                    value: "#101,185, AECS Layout, C Block,8th Cross, Singasandra, Bengaluru - 560068",
                    href: "https://share.google/GtPJZ4jH28vCTJ8bp",
                  },
                ].map((item, index) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-10 h-10 bg-emerald/5 border border-emerald/10 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald group-hover:border-emerald transition-all">
                      <item.icon
                        size={16}
                        className="text-emerald group-hover:text-ivory transition-colors"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-body font-bold tracking-widest uppercase text-charcoal/40 mb-0.5">
                        {item.label}
                      </p>
                      {item.isMultiLink ? (
                        <div className="flex flex-wrap gap-2 text-sm font-body text-charcoal">
                          {item.links.map((link, i) => (
                            <span key={i} className="flex gap-2">
                              <a href={link.href} onClick={() => trackEvent("contact_click", { section: "contact_details", channel: link.channel || "whatsapp" })} className="hover:text-emerald transition-colors">
                                {link.value}
                              </a>
                              {i < item.links.length - 1 && <span className="text-charcoal/30">/</span>}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <a 
                          href={item.href} 
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          onClick={() => trackEvent(item.href.startsWith("http") ? "outbound_click" : "contact_click", { section: "contact_details", channel: item.href.startsWith("mailto:") ? "email" : "location" })}
                          className="font-body text-sm text-charcoal hover:text-emerald transition-colors block"
                        >
                          {item.value}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={getWhatsAppUrl(getWhatsAppNumber(), "Hi! I'd like to know more about The Lux Basket.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-[#25D366]/10 border border-[#25D366]/30 text-[#128C7E] font-body text-sm font-medium hover:bg-[#25D366]/20 transition-colors"
              onClick={() => trackEvent("contact_click", { section: "contact", channel: "whatsapp" })}
            >
              <MessageCircle size={20} />
              Chat on WhatsApp — we respond fast!
            </a>

            {/* Business Hours */}
            <div className="bg-white border border-beige p-5">
              <h3 className="font-body text-xs font-bold tracking-widest uppercase text-charcoal/60 mb-3">
                Business Hours
              </h3>
              <div className="space-y-2 text-sm font-body text-charcoal/70">
                <div className="flex justify-between">
                  <span>Monday – Friday</span>
                  <span className="font-medium">10 AM – 5 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-medium">10 AM – 3 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="text-center py-20 bg-white border border-beige">
                <CheckCircle2 size={56} className="text-emerald mx-auto mb-4" />
                <h3 className="font-heading text-3xl text-charcoal mb-3">
                  Message Sent!
                </h3>
                <p className="font-body text-charcoal/60">
                  We&apos;ll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white border border-beige p-8 space-y-6"
              >
                <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
                  <label htmlFor="contact-website">Leave this field empty</label>
                  <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>
                <h2 className="font-heading text-2xl text-charcoal">
                  Send us a Message
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-name" className="luxury-label">Your Name *</label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      minLength={2}
                      maxLength={100}
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="luxury-input"
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="luxury-label">Email *</label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      maxLength={254}
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="luxury-input"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="luxury-label">Phone *</label>
                    <input
                      id="contact-phone"
                      type="tel"
                      required
                      pattern="[+0-9 ()-]{10,18}"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="luxury-input"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-type" className="luxury-label">Inquiry Type</label>
                    <select
                      id="contact-type"
                      value={form.type}
                      onChange={(e) =>
                        setForm({ ...form, type: e.target.value })
                      }
                      className="luxury-input"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="corporate">Corporate Gifting</option>
                      <option value="wedding">Wedding Gifts</option>
                      <option value="bulk">Bulk Order</option>
                      <option value="custom">Custom Gift</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-message" className="luxury-label">Message *</label>
                  <textarea
                    id="contact-message"
                    required
                    minLength={10}
                    maxLength={3000}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className="luxury-input h-36 resize-none"
                    placeholder="Tell us about your gifting needs..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            )}

            {/* Map embed */}
            <div className="mt-6 h-64 bg-beige-light border border-beige w-full">
              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                style={{ border: 0 }}
                src="https://maps.google.com/maps?q=Begur,%20Bengaluru,%20Karnataka,%20India&t=&z=13&ie=UTF8&iwloc=&output=embed"
                title="The Lux Basket location in Bengaluru"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
