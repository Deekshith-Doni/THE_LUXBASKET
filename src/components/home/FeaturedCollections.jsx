"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const collections = [
  {
    id: 1,
    title: "Luxury Hampers",
    subtitle: "Curated opulence",
    href: "/collections?category=luxury-hampers",
    image:
      "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&q=80",
    tag: "Most Popular",
  },
  {
    id: 2,
    title: "Corporate Gifts",
    subtitle: "Impress every client",
    href: "/collections?category=corporate",
    image:
      "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=600&q=80",
    tag: "Bulk Orders",
  },
  {
    id: 3,
    title: "Wedding Gifts",
    subtitle: "Return with elegance",
    href: "/collections?category=wedding",
    image:
      "https://images.unsplash.com/photo-1510076857177-7470076d4098?w=600&q=80",
    tag: "Customizable",
  },
  {
    id: 4,
    title: "Festive Hampers",
    subtitle: "Celebrate every occasion",
    href: "/collections?category=festive",
    image:
      "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600&q=80",
    tag: "Seasonal",
  },
];

export default function FeaturedCollections() {
  return (
    <section className="section-padding bg-ivory">
      <div className="container-luxury">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-tag"
          >
            Our Collections
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-title mt-3"
          >
            Gifting Made Extraordinary
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="gold-divider mt-5"
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((col, i) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link
                href={col.href}
                className="group block relative overflow-hidden aspect-[3/4] bg-beige-light"
              >
                {/* Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${col.image})` }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-dark/90 via-emerald/30 to-transparent" />

                {/* Tag */}
                <div className="absolute top-4 left-4">
                  <span className="badge-gold text-xs">{col.tag}</span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-xs font-body text-gold tracking-widest uppercase mb-1">
                    {col.subtitle}
                  </p>
                  <h3 className="font-heading text-2xl text-ivory font-medium leading-tight">
                    {col.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-3 text-ivory/70 group-hover:text-gold transition-colors duration-300">
                    <span className="text-xs font-body tracking-widest uppercase">
                      Explore
                    </span>
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link href="/collections" className="btn-outline">
            View All Collections
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
