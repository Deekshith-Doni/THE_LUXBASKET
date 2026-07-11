"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What is the minimum order quantity for corporate gifting?",
    a: "We accept corporate orders starting from just 25 units. For bulk orders above 500 units, we offer customized pricing and dedicated account management.",
  },
  {
    q: "Can I customize the packaging with my brand logo?",
    a: "Absolutely! We offer full branding customization — your logo on the box, ribbon, sticker, and even the tissue paper. We provide a proof before production.",
  },
  {
    q: "How long does delivery take?",
    a: "Standard delivery takes 5-7 business days across India. For orders above ₹5,000, we offer free express delivery (2-3 days) to major cities. Corporate bulk orders are discussed case-by-case.",
  },
  {
    q: "Do you offer customized gift messages?",
    a: "Yes! Every order can include a custom handwritten-style message card. For corporate orders, we can print premium branded cards.",
  },
  {
    q: "Can I return or exchange a product?",
    a: "We have a 7-day return policy for damaged or defective products. Customized items are non-returnable unless there's a manufacturing defect.",
  },
  {
    q: "Do you ship internationally?",
    a: "Currently we ship pan-India only. International shipping is available for select countries — please contact us on WhatsApp for details.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="section-padding bg-ivory">
      <div className="container-luxury">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-tag"
            >
              FAQ
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="section-title mt-3"
            >
              Questions & Answers
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="gold-divider mt-5"
            />
          </div>

          {/* Accordion */}
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="border border-beige-dark bg-white overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-body font-medium text-charcoal text-sm md:text-base pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`flex-shrink-0 text-gold transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""
                      }`}
                  />
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 font-body text-sm text-charcoal/60 leading-relaxed border-t border-beige">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Still have questions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-10 p-8 bg-beige-light border border-beige"
          >
            <p className="font-heading text-2xl text-charcoal mb-2">
              Still have questions?
            </p>
            <p className="font-body text-sm text-charcoal/60 mb-5">
              Our gifting experts are here to help — reach out anytime
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^0-9]/g, "")}?text=Hi! I have a question about The Lux Basket.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                WhatsApp Us
              </a>
              <a href="/contact" className="btn-outline">
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
