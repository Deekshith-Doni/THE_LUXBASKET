"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";

export default function WeddingSection() {
  const items = [
    {
      image:
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&q=80",
      title: "Classic Elegance",
      price: "From ₹799",
    },
    {
      image:
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80",
      title: "Royal Gold",
      price: "From ₹1,299",
    },
    {
      image:
        "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&q=80",
      title: "Floral Bliss",
      price: "From ₹999",
    },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-luxury">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Images collage */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div
                  className="h-56 bg-cover bg-center"
                  style={{ backgroundImage: `url(${items[0].image})` }}
                />

                <div
                  className="h-40 bg-cover bg-center"
                  style={{ backgroundImage: `url(${items[2].image})` }}
                />
              </div>
              <div className="pt-8">
                <div
                  className="h-80 bg-cover bg-center"
                  style={{ backgroundImage: `url(${items[1].image})` }}
                />
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-5 -right-5 bg-gold p-5 shadow-gold">
              <Heart size={20} className="text-emerald-dark mx-auto mb-1" />
              <p className="text-emerald-dark font-heading text-xl font-bold text-center">
                2500+
              </p>
              <p className="text-emerald-dark text-xs font-body tracking-wide text-center">
                Weddings Gifted
              </p>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="section-tag">Wedding Gifting</span>
            <h2 className="section-title mt-3">
              Return Gifts That
              <br />
              <span className="italic text-gold">Leave an Impression</span>
            </h2>
            <div className="w-16 h-px bg-gold my-6" />
            <p className="text-charcoal/60 font-body leading-relaxed text-lg mb-8">
              Make your wedding unforgettable with thoughtfully curated return
              gifts. Personalize every basket with your names, wedding date, and
              a heartfelt message. Minimum 50 units, endless customizations.
            </p>

            {/* Feature list */}
            <ul className="space-y-3 mb-8">
              {[
                "Custom name & date printing on packaging",
                "Minimum order: 50 units",
                "Mix & match gift combinations",
                "Complimentary gift cards included",
                "Dedicated wedding gifting consultant",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm font-body text-charcoal/70"
                >
                  <span className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/collections?category=wedding"
                className="btn-primary"
              >
                Browse Wedding Gifts
                <ArrowRight size={16} />
              </Link>
              <Link href="/contact?type=wedding" className="btn-outline">
                Get Custom Quote
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
