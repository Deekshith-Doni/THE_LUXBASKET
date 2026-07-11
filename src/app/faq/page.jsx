import FAQSection from "@/components/home/FAQSection";

export const metadata = {
  title: "FAQs | The Lux Basket",
  description: "Frequently asked questions about our luxury gifting services.",
};

export default function FAQPage() {
  return (
    <div className="bg-ivory min-h-screen">
      {/* Hero */}
      <section className="relative bg-emerald-dark py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1600&q=80')] bg-cover bg-center opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-dark via-emerald-dark/90 to-transparent" />
        <div className="container-luxury relative z-10 text-center">
          <span className="section-tag text-gold">Support</span>
          <h1 className="font-heading text-4xl md:text-5xl font-light text-ivory mt-3 leading-tight">
            Frequently Asked Questions
          </h1>
          <div className="w-20 h-px bg-gold mx-auto my-8" />
        </div>
      </section>

      {/* Content */}
      <FAQSection />
    </div>
  );
}
