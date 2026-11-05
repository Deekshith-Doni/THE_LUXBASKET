"use client";
import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics";
import { getWhatsAppNumber, getWhatsAppUrl } from "@/lib/utils";

const budgetOptions = [
  "Under ₹500/unit",
  "₹500–₹1000/unit",
  "₹1000–₹2000/unit",
  "₹2000–₹5000/unit",
  "₹5000+/unit",
  "Flexible",
];

export default function CorporateInquiryForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    type: "corporate",
    quantity: "",
    budget: "",
    eventDate: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const website = new FormData(e.currentTarget).get("website");
    setIsLoading(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          website,
          quantity: form.quantity ? parseInt(form.quantity) : undefined,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        trackEvent("enquiry_submit", { section: "corporate", enquiry_type: "corporate" });
        toast.success("Inquiry submitted! We'll respond within 24 hours.");
        router.push("/thank-you?type=corporate");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to submit. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-16 bg-white border border-beige">
        <CheckCircle2 size={56} className="text-emerald mx-auto mb-4" />
        <h3 className="font-heading text-3xl text-charcoal mb-3">Thank You!</h3>
        <p className="font-body text-charcoal/60 max-w-sm mx-auto">
          Your inquiry has been received. Our corporate team will contact you
          within 24 hours with a custom proposal.
        </p>
        <div className="mt-6 text-sm font-body text-charcoal/50">
          For urgent requirements, WhatsApp us directly:{" "}
          <a href={getWhatsAppUrl(getWhatsAppNumber(), "Hi! I have a question about my corporate gifting inquiry.")} onClick={() => trackEvent("contact_click", { section: "corporate_confirmation", channel: "whatsapp" })} className="text-gold underline">
            {getWhatsAppNumber()}
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-beige p-8 space-y-6"
    >
      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label htmlFor="corporate-website">Leave this field empty</label>
        <input id="corporate-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="corporate-name" className="luxury-label">Your Name *</label>
          <input
            id="corporate-name"
            type="text"
            required
            minLength={2}
            maxLength={100}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="luxury-input"
            placeholder="Full name"
          />
        </div>
        <div>
          <label htmlFor="corporate-company" className="luxury-label">Company Name</label>
          <input
            id="corporate-company"
            type="text"
            maxLength={120}
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="luxury-input"
            placeholder="Your company"
          />
        </div>
        <div>
          <label htmlFor="corporate-email" className="luxury-label">Email Address *</label>
          <input
            id="corporate-email"
            type="email"
            required
            maxLength={254}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="luxury-input"
            placeholder="your@company.com"
          />
        </div>
        <div>
          <label htmlFor="corporate-phone" className="luxury-label">Phone Number *</label>
          <input
            id="corporate-phone"
            type="tel"
            required
            pattern="[+0-9 ()-]{10,18}"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="luxury-input"
            placeholder="+91 XXXXX XXXXX"
          />
        </div>
        <div>
          <label htmlFor="corporate-quantity" className="luxury-label">Quantity Required *</label>
          <input
            id="corporate-quantity"
            type="number"
            required
            min="25"
            max="100000"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            className="luxury-input"
            placeholder="Min. 25 units"
          />
        </div>
        <div>
          <label htmlFor="corporate-date" className="luxury-label">Event / Delivery Date</label>
          <input
            id="corporate-date"
            type="date"
            value={form.eventDate}
            onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
            className="luxury-input"
          />
        </div>
      </div>

      <div>
        <fieldset>
        <legend className="luxury-label">Budget per Unit</legend>
        <div className="flex flex-wrap gap-2 mt-1">
          {budgetOptions.map((b) => (
            <button
              type="button"
              key={b}
              onClick={() => setForm({ ...form, budget: b })}
              className={`px-4 py-2 text-xs font-body border transition-all ${
                form.budget === b
                  ? "bg-emerald text-ivory border-emerald"
                  : "bg-white text-charcoal border-beige-dark hover:border-emerald"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
        </fieldset>
      </div>

      <div>
        <label htmlFor="corporate-message" className="luxury-label">Tell Us More *</label>
        <textarea
          id="corporate-message"
          required
          minLength={10}
          maxLength={3000}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="luxury-input h-32 resize-none"
          placeholder="Describe your gifting needs — occasion, preferences, branding requirements, deadline..."
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full justify-center"
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          "Submit Corporate Inquiry"
        )}
      </button>

      <p className="text-xs font-body text-charcoal/40 text-center">
        We respond within 24 hours. For urgent needs, WhatsApp us directly.
      </p>
    </form>
  );
}
