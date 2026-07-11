export const metadata = {
  title: "Shipping Policy | The Lux Basket",
  description: "Learn about our shipping and delivery policies.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-ivory min-h-screen">
      <section className="relative bg-emerald-dark py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-dark via-emerald-dark/90 to-transparent" />
        <div className="container-luxury relative z-10 text-center">
          <span className="section-tag text-gold">Support</span>
          <h1 className="font-heading text-4xl md:text-5xl font-light text-ivory mt-3 leading-tight">
            Shipping Policy
          </h1>
          <div className="w-20 h-px bg-gold mx-auto my-8" />
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-luxury max-w-4xl mx-auto">
          <div className="space-y-6 font-body text-charcoal/70 leading-relaxed">
            <h2 className="text-2xl font-heading text-charcoal">Delivery Timelines</h2>
            <p>Standard delivery takes 5-7 business days across India. For orders above ₹5,000, we offer free express delivery (2-3 days) to major cities. Corporate bulk orders are discussed case-by-case based on the order volume.</p>
            
            <h2 className="text-2xl font-heading text-charcoal mt-8">Shipping Charges</h2>
            <p>Shipping charges are calculated based on the delivery location and the size of the order. These will be displayed during the checkout process.</p>
            
            <h2 className="text-2xl font-heading text-charcoal mt-8">International Shipping</h2>
            <p>Currently, we ship pan-India only. International shipping is available for select countries — please contact us directly for more details and specific shipping rates.</p>
            
            <h2 className="text-2xl font-heading text-charcoal mt-8">Order Tracking</h2>
            <p>Once your order has been dispatched, you will receive a tracking link via email and WhatsApp to monitor the delivery status.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
