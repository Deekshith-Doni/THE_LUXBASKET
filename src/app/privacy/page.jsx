export const metadata = {
  title: "Privacy Policy | The Lux Basket",
  description: "How we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-ivory min-h-screen">
      <section className="relative bg-emerald-dark py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-dark via-emerald-dark/90 to-transparent" />
        <div className="container-luxury relative z-10 text-center">
          <span className="section-tag text-gold">Support</span>
          <h1 className="font-heading text-4xl md:text-5xl font-light text-ivory mt-3 leading-tight">
            Privacy Policy
          </h1>
          <div className="w-20 h-px bg-gold mx-auto my-8" />
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-luxury max-w-4xl mx-auto">
          <div className="space-y-6 font-body text-charcoal/70 leading-relaxed">
            <h2 className="text-2xl font-heading text-charcoal">Information Collection</h2>
            <p>We collect information you provide directly to us when you make a purchase, create an account, or contact us. This may include your name, email address, phone number, shipping address, and payment information.</p>
            
            <h2 className="text-2xl font-heading text-charcoal mt-8">How We Use Your Information</h2>
            <p>Your information is used to process orders, provide customer support, and communicate with you about promotions or updates related to The Lux Basket. We do not sell your personal data to third parties.</p>
            
            <h2 className="text-2xl font-heading text-charcoal mt-8">Data Security</h2>
            <p>We implement a variety of security measures to maintain the safety of your personal information. All sensitive payment data is transmitted via Secure Socket Layer (SSL) technology and encrypted into our payment gateway providers' database.</p>
            
            <h2 className="text-2xl font-heading text-charcoal mt-8">Cookies</h2>
            <p>We use cookies to enhance your shopping experience, remember your preferences, and analyze site traffic. You can choose to disable cookies through your browser settings, though some features of our site may not function properly.</p>
            
            <h2 className="text-2xl font-heading text-charcoal mt-8">Changes to this Policy</h2>
            <p>We may update this privacy policy from time to time. Any changes will be posted on this page with an updated revision date.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
