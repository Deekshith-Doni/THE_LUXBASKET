"use client";
export default function MarqueeBanner() {
  const items = [
    "✦ Free Shipping Above ₹1,999",
    "✦ Custom Branding Available",
    "✦ Corporate Gifting Experts",
    "✦ Pan-India Delivery",
    "✦ Bulk Orders Welcome",
    "✦ Premium Packaging",
    "✦ Customized Gift Messages",
    "✦ 10,000+ Happy Clients",
  ];

  return (
    <div className="bg-gold overflow-hidden py-3">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="inline-block px-8 text-emerald-dark text-xs font-body font-bold tracking-[0.2em] uppercase"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
