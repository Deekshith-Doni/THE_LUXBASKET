export const metadata = {
  title: "Terms & Conditions | The Lux Basket",
  description: "Terms and conditions for using our website and services.",
};

export default function TermsPage() {
  return (
    <div className="bg-ivory min-h-screen">
      <section className="relative bg-emerald-dark py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-dark via-emerald-dark/90 to-transparent" />
        <div className="container-luxury relative z-10 text-center">
          <span className="section-tag text-gold">Support</span>
          <h1 className="font-heading text-4xl md:text-5xl font-light text-ivory mt-3 leading-tight">
            Terms & Conditions
          </h1>
          <div className="w-20 h-px bg-gold mx-auto my-8" />
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-luxury max-w-4xl mx-auto">
          <div className="space-y-6 font-body text-charcoal/70 leading-relaxed">
            <h2 className="text-2xl font-heading text-charcoal">Agreement to Terms</h2>
            <p>By accessing or using our website, you agree to be bound by these Terms & Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
            
            <h2 className="text-2xl font-heading text-charcoal mt-8">Use License</h2>
            <p>Permission is granted to temporarily download one copy of the materials (information or software) on The Lux Basket's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
            
            <h2 className="text-2xl font-heading text-charcoal mt-8">Products and Pricing</h2>
            <p>All descriptions of products and product pricing are subject to change at any time without notice, at the sole discretion of us. We reserve the right to discontinue any product at any time.</p>
            
            <h2 className="text-2xl font-heading text-charcoal mt-8">User Accounts</h2>
            <p>If you create an account on our website, you are responsible for maintaining the security of your account and for all activities that occur under the account. We reserve the right to terminate accounts or cancel orders at our sole discretion.</p>
            
            <h2 className="text-2xl font-heading text-charcoal mt-8">Governing Law</h2>
            <p>These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
