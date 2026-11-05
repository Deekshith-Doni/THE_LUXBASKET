"use client";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "HR Director",
    company: "TechCorp India",
    content:
      "The Lux Basket transformed our Diwali gifting completely. Every employee was absolutely delighted — the quality and presentation exceeded all expectations. Will definitely order again!",
  },
  {
    id: 2,
    name: "Rahul Mehta",
    role: "Founder",
    company: "StartupHub",
    content:
      "We ordered 200 custom hampers for our investor meet. The branding was perfect, packaging was immaculate, and delivery was on time. Truly premium experience.",
  },
  {
    id: 3,
    name: "Sneha Patel",
    role: "Wedding Planner",
    company: "Dream Weddings",
    content:
      "My clients loved the wedding return gifts from The Lux Basket. The customization options are incredible and every guest mentioned how beautiful the packaging was.",
  },
  {
    id: 4,
    name: "Arjun Nair",
    role: "CEO",
    company: "Nair & Sons",
    content:
      "We've been using The Lux Basket for all our corporate gifting needs for 2 years. The consistency in quality and the luxury feel of every hamper keeps us coming back.",
  },
];

export default function Testimonials() {
  return (
    <section className="section-padding bg-beige-light">
      <div className="container-luxury">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-tag"
          >
            Client Love
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-title mt-3"
          >
            Words from Our Patrons
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="gold-divider mt-5"
          />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 border border-beige hover:border-gold/30 transition-all duration-300 hover:shadow-card relative group"
            >
              <Quote
                size={36}
                className="text-gold/20 absolute top-6 right-6 group-hover:text-gold/30 transition-colors"
              />

              <p className="font-body text-charcoal/70 leading-relaxed italic">
                &ldquo;{t.content}&rdquo;
              </p>

              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-beige">
                <div className="w-10 h-10 bg-emerald rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-ivory font-heading text-base font-medium">
                    {t.name[0]}
                  </span>
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-charcoal">
                    {t.name}
                  </p>
                  <p className="text-xs font-body text-charcoal/50">
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
