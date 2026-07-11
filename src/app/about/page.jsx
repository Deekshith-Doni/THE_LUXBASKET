import { Award, Heart, Leaf, Star } from "lucide-react";

export const metadata = {
  title: "About Us | The Lux Basket",
  description:
    "Discover the story behind The Lux Basket — India's premium luxury gifting brand. Our mission, values, and commitment to excellence.",
};

const values = [
  {
    icon: Award,
    title: "Uncompromising Quality",
    desc: "Every product is handpicked for its premium quality, sourced from India's finest artisans and makers.",
  },
  {
    icon: Heart,
    title: "Gifted with Love",
    desc: "Every basket is assembled with care, ensuring each gift feels personal, thoughtful, and truly special.",
  },
  {
    icon: Leaf,
    title: "Sustainable Practices",
    desc: "We use eco-friendly packaging wherever possible and partner with responsible local suppliers.",
  },
  {
    icon: Star,
    title: "Pursuit of Excellence",
    desc: "From production to delivery, we hold ourselves to the highest standard so you never have to worry.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-ivory min-h-screen">
      {/* Hero */}
      <section className="relative bg-emerald-dark py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1600&q=80')] bg-cover bg-center opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-dark via-emerald-dark/90 to-transparent" />
        <div className="container-luxury relative z-10 text-center">
          <span className="section-tag text-gold">Our Story</span>
          <h1 className="font-heading text-5xl md:text-7xl font-light text-ivory mt-3 leading-tight">
            Crafted in India,
            <br />
            <span className="italic text-gold font-medium">
              Gifted with Love
            </span>
          </h1>
          <div className="w-20 h-px bg-gold mx-auto my-8" />
          <p className="font-body text-ivory/70 text-xl max-w-2xl mx-auto leading-relaxed">
            We believe gifting is an art form — a language of appreciation that
            deserves to be spoken beautifully.
          </p>
        </div>
      </section>

      {/* Founder Story */}
      <section className="section-padding bg-white">
        <div className="container-luxury">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div
                className="aspect-square bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80')",
                }}
              />
            </div>
            <div>
              <span className="section-tag">Founder&apos;s Letter</span>
              <h2 className="section-title mt-3">
                The Vision Behind The Lux Basket
              </h2>
              <div className="w-16 h-px bg-gold my-6" />
              <div className="space-y-4 font-body text-charcoal/70 leading-relaxed">
                <p>
                  The Lux Basket was born from a simple frustration: India
                  deserved a gifting brand that truly understood luxury. Not
                  just expensive — but thoughtful, elegant, and memorable.
                </p>
                <p>
                  What started as personalized Diwali hampers for friends and
                  family grew into something far bigger. Today, we serve India's
                  top corporations, hundreds of weddings, and thousands of
                  individuals who believe that the best gifts come wrapped in
                  intention.
                </p>
                <p>
                  Our promise is simple: every basket that leaves our hands
                  should feel like it was made just for the person receiving it.
                  Because that&apos;s what real luxury means.
                </p>
              </div>
              <div className="mt-8">
                <p className="font-heading text-2xl text-charcoal italic">
                  — The Lux Basket Team
                </p>
                <p className="font-body text-sm text-charcoal/50 mt-1">
                  Mumbai, India
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-beige-light">
        <div className="container-luxury">
          <div className="text-center mb-14">
            <span className="section-tag">Our Values</span>
            <h2 className="section-title mt-3">What We Stand For</h2>
            <div className="gold-divider mt-5" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white p-8 border border-beige text-center group hover:border-gold hover:shadow-card transition-all duration-300"
              >
                <div className="w-14 h-14 bg-emerald/5 border border-emerald/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-emerald group-hover:border-emerald transition-all duration-300">
                  <v.icon
                    size={22}
                    className="text-emerald group-hover:text-ivory transition-colors"
                  />
                </div>
                <h3 className="font-heading text-xl text-charcoal mb-3">
                  {v.title}
                </h3>
                <p className="font-body text-sm text-charcoal/60 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-emerald-dark py-20">
        <div className="container-luxury">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { v: "2021", l: "Founded In" },
              { v: "10,000+", l: "Happy Clients" },
              { v: "500+", l: "Corporate Partners" },
              { v: "4.9★", l: "Average Rating" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <p className="font-heading text-4xl md:text-5xl font-medium text-gold">
                  {s.v}
                </p>
                <p className="text-sm font-body text-ivory/50 mt-2 tracking-wide">
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
