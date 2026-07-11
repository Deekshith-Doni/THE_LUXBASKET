export const metadata = {
  title: "Return Policy | The Lux Basket",
  description: "Information regarding our return and exchange policies.",
};

export default function ReturnPolicyPage() {
  return (
    <div className="bg-ivory min-h-screen">
      <section className="relative bg-emerald-dark py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-dark via-emerald-dark/90 to-transparent" />
        <div className="container-luxury relative z-10 text-center">
          <span className="section-tag text-gold">Support</span>
          <h1 className="font-heading text-4xl md:text-5xl font-light text-ivory mt-3 leading-tight">
            Return Policy
          </h1>
          <div className="w-20 h-px bg-gold mx-auto my-8" />
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-luxury max-w-4xl mx-auto">
          <div className="space-y-6 font-body text-charcoal/70 leading-relaxed">
            <h2 className="text-2xl font-heading text-charcoal">Returns and Exchanges</h2>
            <p>We take immense pride in the quality of our luxury hampers. However, if you receive a damaged or defective product, we have a 7-day return policy. Please contact our support team within 7 days of receiving the order.</p>
            
            <h2 className="text-2xl font-heading text-charcoal mt-8">Customized Items</h2>
            <p>Because customized items are made specifically to order (e.g., custom branding, personalized message cards), they are non-returnable unless there is a manufacturing defect or damage during transit.</p>
            
            <h2 className="text-2xl font-heading text-charcoal mt-8">Refund Process</h2>
            <p>Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, the refund will be processed and applied to your original method of payment within 5-7 business days.</p>
            
            <h2 className="text-2xl font-heading text-charcoal mt-8">Need Help?</h2>
            <p>If you have any questions regarding your return, please reach out to us at hello@theluxbasket.com or contact us via WhatsApp.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
