"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Building2, Users, Package, Award, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Building2,
    title: "Bulk Orders",
    desc: "50 to 50,000+ units with volume pricing",
  },
  {
    icon: Users,
    title: "Custom Branding",
    desc: "Your logo on every gift, every packaging",
  },
  {
    icon: Package,
    title: "Premium Packaging",
    desc: "Bespoke boxes with tissue, ribbon & card",
  },
  {
    icon: Award,
    title: "Pan-India Delivery",
    desc: "Guaranteed delivery to all pin codes",
  },
];

const clients = [
  "TATA",
  "Wipro",
  "Infosys",
  "HDFC",
  "Reliance",
  "Mahindra",
  "Flipkart",
  "Amazon India",
];

export default function CorporateSection() {
  return (
    <section className="section-padding bg-emerald-dark relative overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4AF37' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container-luxury relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="section-tag text-gold"
            >
              Corporate Gifting
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-light text-ivory mt-3 leading-tight"
            >
              Elevate Your
              <br />
              <span className="italic text-gold font-medium">
                Brand Presence
              </span>
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="w-16 h-px bg-gold my-6 origin-left"
            />

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-ivory/70 font-body leading-relaxed text-lg mb-8"
            >
              From Diwali hampers to employee appreciation kits — we help
              India's top corporations make gifting a strategic touchpoint.
              Fully customized, beautifully packaged, always on time.
            </motion.p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i + 0.3 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-9 h-9 flex-shrink-0 bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <f.icon size={16} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-body font-semibold text-ivory">
                      {f.title}
                    </p>
                    <p className="text-xs font-body text-ivory/50 mt-0.5 leading-snug">
                      {f.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/corporate" className="btn-gold">
                Get a Quote
                <ArrowRight size={16} />
              </Link>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^0-9]/g, "")}?text=Hi! I'm interested in corporate gifting.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-gold"
              >
                WhatsApp Us
              </a>
            </motion.div>
          </div>

          {/* Right — Client logos + visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative bg-emerald-light/20 border border-gold/10 p-10">
              <p className="text-xs font-body text-gold tracking-[0.3em] uppercase mb-6 text-center">
                Trusted by India's Leading Brands
              </p>
              <div className="grid grid-cols-4 gap-4">
                {clients.map((client) => (
                  <div
                    key={client}
                    className="h-12 border border-ivory/10 flex items-center justify-center hover:border-gold/30 transition-colors duration-300"
                  >
                    <span className="text-xs font-body font-bold text-ivory/40 tracking-widest">
                      {client}
                    </span>
                  </div>
                ))}
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-ivory/10">
                {[
                  { v: "₹2Cr+", l: "Orders Delivered" },
                  { v: "500+", l: "Corporate Clients" },
                  { v: "100%", l: "On-Time Delivery" },
                ].map((s) => (
                  <div key={s.l} className="text-center">
                    <p className="font-heading text-2xl text-gold">{s.v}</p>
                    <p className="text-xs font-body text-ivory/50 mt-1">
                      {s.l}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
