import {
  ArrowRight,
  Building2,
  Users,
  Gift,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
} from "lucide-react";
import CorporateInquiryForm from "@/components/corporate/CorporateInquiryForm";

export const metadata = {
  title: "Corporate Gifting | The Lux Basket",
  description:
    "Premium corporate gifting solutions. Bulk orders, custom branding, Diwali hampers, employee gifts. 500+ corporate clients across India.",
};

const workflowSteps = [
  {
    step: "01",
    title: "Submit Inquiry",
    desc: "Share your requirements — quantity, budget, occasion",
  },
  {
    step: "02",
    title: "Custom Proposal",
    desc: "We send a tailored catalogue & pricing within 24 hrs",
  },
  {
    step: "03",
    title: "Design & Approve",
    desc: "Review packaging design, branding mockups & samples",
  },
  {
    step: "04",
    title: "Production & Delivery",
    desc: "We manufacture & deliver to your doorstep on time",
  },
];

const useCases = [
  {
    icon: Gift,
    title: "Diwali Hampers",
    desc: "Premium festive hampers for employees & clients",
  },
  {
    icon: Users,
    title: "Employee Appreciation",
    desc: "Work anniversaries, onboarding kits, farewell gifts",
  },
  {
    icon: Building2,
    title: "Client Gifting",
    desc: "Impress key clients with branded luxury baskets",
  },
  {
    icon: Clock,
    title: "Event Gifting",
    desc: "Product launches, conferences, AGMs & seminars",
  },
];

export default function CorporatePage() {
  return (
    <div className="bg-ivory min-h-screen">
      {/* Hero */}
      <section className="bg-emerald-dark py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=1600&q=80')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-dark to-emerald-dark/80" />
        <div className="container-luxury relative z-10">
          <div className="max-w-3xl">
            <span className="section-tag text-gold">Corporate Gifting</span>
            <h1 className="font-heading text-5xl md:text-7xl font-light text-ivory mt-3 leading-tight">
              India&apos;s Most
              <br />
              <span className="italic text-gold font-medium">Trusted</span>{" "}
              Corporate
              <br />
              Gifting Partner
            </h1>
            <div className="w-20 h-px bg-gold my-8" />
            <p className="font-body text-ivory/70 text-xl leading-relaxed max-w-xl">
              From 25 to 25,000 units — we handle every detail so you can focus
              on what matters. Custom branding, premium packaging, guaranteed
              delivery.
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <a href="#inquiry" className="btn-gold">
                Get a Free Quote <ArrowRight size={16} />
              </a>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^0-9]/g, "")}?text=Hi! I'm interested in corporate gifting for my company.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-gold"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="bg-gold">
        <div className="container-luxury py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { v: "500+", l: "Corporate Clients" },
              { v: "₹2Cr+", l: "Gifts Delivered" },
              { v: "100%", l: "On-Time Delivery" },
              { v: "48hrs", l: "Turnaround Time" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <p className="font-heading text-3xl md:text-4xl font-bold text-emerald-dark">
                  {s.v}
                </p>
                <p className="font-body text-sm text-emerald-dark/70 mt-1">
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <section className="section-padding bg-white">
        <div className="container-luxury">
          <div className="text-center mb-14">
            <span className="section-tag">Solutions</span>
            <h2 className="section-title mt-3">Perfect For Every Occasion</h2>
            <div className="gold-divider mt-5" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((uc, i) => (
              <div
                key={uc.title}
                className="group p-8 border border-beige hover:border-gold hover:shadow-card-hover transition-all duration-300"
              >
                <div className="w-12 h-12 bg-emerald/5 border border-emerald/10 flex items-center justify-center mb-5 group-hover:bg-emerald group-hover:border-emerald transition-all duration-300">
                  <uc.icon
                    size={20}
                    className="text-emerald group-hover:text-ivory transition-colors"
                  />
                </div>
                <h3 className="font-heading text-xl text-charcoal mb-2">
                  {uc.title}
                </h3>
                <p className="font-body text-sm text-charcoal/60 leading-relaxed">
                  {uc.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-beige-light">
        <div className="container-luxury">
          <div className="text-center mb-14">
            <span className="section-tag">Our Process</span>
            <h2 className="section-title mt-3">How It Works</h2>
            <div className="gold-divider mt-5" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflowSteps.map((step, i) => (
              <div key={step.step} className="relative">
                {i < workflowSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-gold/20 z-0" />
                )}
                <div className="relative z-10">
                  <span className="font-heading text-5xl font-medium text-gold/20">
                    {step.step}
                  </span>
                  <div className="w-10 h-px bg-gold my-3" />
                  <h3 className="font-heading text-xl text-charcoal mb-2">
                    {step.title}
                  </h3>
                  <p className="font-body text-sm text-charcoal/60 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="section-padding bg-emerald-dark text-ivory">
        <div className="container-luxury">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="section-tag text-gold">What We Offer</span>
              <h2 className="font-heading text-4xl md:text-5xl font-light text-ivory mt-3 leading-tight">
                Everything Included, <br />
                <span className="italic text-gold">Nothing Compromised</span>
              </h2>
              <div className="w-16 h-px bg-gold my-6" />
              <div className="space-y-4">
                {[
                  "Custom logo printing on box, ribbon & tissue",
                  "Mix & match product selection",
                  "Dedicated corporate account manager",
                  "Bulk pricing from 25 units onwards",
                  "Free design consultation",
                  "Pan-India delivery coordination",
                  "Real-time order tracking",
                  "Free samples before production",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2
                      size={16}
                      className="text-gold flex-shrink-0"
                    />
                    <span className="font-body text-sm text-ivory/80">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: "Starting From",
                  value: "₹299/unit",
                  sub: "For orders 100+",
                },
                {
                  label: "Minimum Order",
                  value: "25 units",
                  sub: "No upper limit",
                },
                {
                  label: "Turnaround",
                  value: "5-7 days",
                  sub: "After approval",
                },
                {
                  label: "Customization",
                  value: "100%",
                  sub: "Brand flexibility",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-emerald-light/20 border border-gold/10 p-6"
                >
                  <p className="text-xs font-body text-gold/70 tracking-widest uppercase mb-2">
                    {stat.label}
                  </p>
                  <p className="font-heading text-3xl text-ivory font-medium">
                    {stat.value}
                  </p>
                  <p className="text-xs font-body text-ivory/50 mt-1">
                    {stat.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section id="inquiry" className="section-padding bg-ivory">
        <div className="container-luxury">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="section-tag">Get in Touch</span>
              <h2 className="section-title mt-3">Request a Corporate Quote</h2>
              <div className="gold-divider mt-5" />
              <p className="section-subtitle mt-5 mx-auto">
                Fill in your details and our team will get back to you within 24
                hours with a custom proposal.
              </p>
            </div>
            <CorporateInquiryForm />
          </div>
        </div>
      </section>

      {/* Contact strip */}
      <div className="bg-emerald py-8">
        <div className="container-luxury flex flex-col md:flex-row items-center justify-center gap-8">
          <a
            href="tel:+919999999999"
            className="flex items-center gap-3 text-ivory hover:text-gold transition-colors"
          >
            <Phone size={18} className="text-gold" />
            <span className="font-body text-sm">+91 99999 99999</span>
          </a>
          <span className="hidden md:block w-px h-6 bg-ivory/20" />
          <a
            href="mailto:corporate@theluxbasket.com"
            className="flex items-center gap-3 text-ivory hover:text-gold transition-colors"
          >
            <Mail size={18} className="text-gold" />
            <span className="font-body text-sm">
              corporate@theluxbasket.com
            </span>
          </a>
          <span className="hidden md:block w-px h-6 bg-ivory/20" />
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^0-9]/g, "")}?text=Hi! Corporate gifting inquiry`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold py-2.5 px-6 text-xs"
          >
            WhatsApp Now
          </a>
        </div>
      </div>
    </div>
  );
}
