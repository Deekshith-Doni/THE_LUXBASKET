"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
          const defaultTags = ["Featured", "Popular", "New", "Trending"];
          
          const mapped = data.categories.slice(0, 4).map((c, i) => ({
            id: c._id || i,
            title: c.name,
            subtitle: c.description || "Discover more",
            href: `/collections?category=${c.slug}`,
            image: c.image || defaultImages[i % defaultImages.length],
            tag: defaultTags[i % defaultTags.length],
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
                className="group block relative overflow-hidden aspect-square bg-beige-light rounded-sm shadow-sm"
              >
                {/* Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                  style={{ backgroundImage: `url(${col.image})` }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-700" />

                {/* Tag */}
                <div className="absolute top-0 left-0">
                  <span className="inline-block bg-white/95 text-charcoal px-4 py-1.5 text-[10px] font-body font-bold tracking-widest uppercase rounded-br-lg shadow-sm">
                    {col.tag}
                  </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end">
                  <div className="transition-transform duration-700 ease-out">
                    <h3 className="font-heading text-2xl md:text-3xl text-white font-medium leading-tight drop-shadow-md">
                      {col.title}
                    </h3>
                    
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out max-h-0 group-hover:max-h-32 overflow-hidden">
                      <p className="text-sm font-body text-white/90 mb-4 line-clamp-2 mt-2">
                        {col.subtitle}
                      </p>
                      <div className="flex items-center gap-2 text-gold">
                        <span className="text-xs font-body tracking-widest uppercase font-bold">
                          Show More
                        </span>
                        <ArrowRight
                          size={14}
                          className="transition-transform group-hover:translate-x-2"
                        />
                      </div>
                    </div>
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
