"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export default function FeaturedCollections() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          const defaultImages = [
            "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&q=80",
            "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=600&q=80",
            "https://images.unsplash.com/photo-1510076857177-7470076d4098?w=600&q=80",
            "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600&q=80",
          ];

          const mapped = data.categories.slice(0, 4).map((c, i) => ({
            id: c._id || i,
            title: c.name,
            href: `/collections?category=${c.slug}`,
            image: c.image || defaultImages[i % defaultImages.length],
          }));
          setCollections(mapped);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="category-section bg-ivory">
      <div className="container-luxury">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
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
        <div className="category-strip" role="region" aria-label="Gift categories" tabIndex={0}>
          {collections.map((col, i) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="collection-card group relative overflow-hidden aspect-square bg-beige-light">
                {/* Image */}
                <div
                  className="collection-card-image absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${col.image})` }}
                />

                <Link
                  href={col.href}
                  onClick={() => trackEvent("category_click", { item_name: col.title, section: "home_categories", position: i + 1 })}
                  className="collection-title-link"
                  aria-label={`Open ${col.title} collection`}
                >
                  <span className="collection-title-text">{col.title}</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 md:mt-10"
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
