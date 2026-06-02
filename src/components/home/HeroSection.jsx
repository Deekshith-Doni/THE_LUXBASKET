"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-emerald-dark">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1920&q=80')] bg-cover bg-center opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-dark via-emerald-dark/80 to-emerald/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-dark via-transparent to-transparent" />
      </div>

      {/* Floating decorative elements */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-10 w-64 h-64 rounded-full bg-gold/5 blur-3xl"
      />

      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -3, 0] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-gold/5 blur-3xl"
      />

      {/* Content */}
      <div className="container-luxury relative z-10 py-24 lg:py-0">
        <div className="max-w-3xl">
          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-6"
          >
            <Sparkles size={14} className="text-gold" />
            <span className="section-tag text-gold">
              Premium Luxury Gifting
            </span>
            <Sparkles size={14} className="text-gold" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-heading text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-ivory leading-[1.05] text-balance"
          >
            Gift the{" "}
            <span className="italic text-gradient-gold font-medium">Art</span>
            <br />
            of Luxury
          </motion.h1>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-24 h-px bg-gold mt-8 mb-6 origin-left"
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg md:text-xl font-body font-light text-ivory/70 max-w-xl leading-relaxed"
          >
            Thoughtfully curated luxury hampers for corporate gifting, weddings,
            festive celebrations & customized moments that last forever.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap gap-4 mt-10"
          >
            <Link href="/collections" className="btn-gold">
              Explore Collections
              <ArrowRight size={16} />
            </Link>
            <Link href="/corporate" className="btn-outline-gold">
              Corporate Gifting
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex items-center gap-10 mt-16 pt-10 border-t border-ivory/10"
          >
            {[
              { value: "10,000+", label: "Happy Clients" },
              { value: "500+", label: "Gift Options" },
              { value: "50+", label: "Corporate Partners" },
              { value: "4.9★", label: "Average Rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-heading text-2xl md:text-3xl font-medium text-gold">
                  {stat.value}
                </p>
                <p className="text-xs font-body text-ivory/50 tracking-wide mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs font-body text-ivory/30 tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-12 bg-gradient-to-b from-ivory/30 to-transparent"
        />
      </motion.div>
    </section>
  );
}
