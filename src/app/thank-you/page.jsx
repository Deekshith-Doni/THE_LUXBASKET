import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { getWhatsAppNumber, getWhatsAppUrl } from "@/lib/utils";

export const metadata = {
  title: "Thank You",
  description: "Your message has been received by The Lux Basket team.",
  robots: { index: false, follow: false },
};

export default async function ThankYouPage({ searchParams }) {
  const { type } = (await searchParams) || {};
  const isCorporate = type === "corporate";

  return (
    <section className="flex min-h-[65vh] items-center justify-center bg-ivory px-5 py-20 text-center">
      <div className="max-w-xl">
        <CheckCircle2 size={60} className="mx-auto text-emerald" aria-hidden="true" />
        <p className="section-tag mt-6 text-emerald">Message received</p>
        <h1 className="mt-3 font-heading text-4xl font-light leading-tight text-charcoal sm:text-5xl">
          {isCorporate ? "Thank you for your corporate inquiry" : "Thank you for getting in touch"}
        </h1>
        <p className="mx-auto mt-5 max-w-md font-body leading-relaxed text-charcoal/70">
          {isCorporate
            ? "Our corporate gifting team will review your requirements and contact you with next steps."
            : "Your message is with our team. We will get back to you as soon as we can."}
        </p>
        <a
          href={getWhatsAppUrl(getWhatsAppNumber(), "Hi! I have a question about my recent inquiry.")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 text-sm font-medium text-emerald underline underline-offset-4 hover:text-emerald-dark"
        >
          <MessageCircle size={17} /> Need a quick answer? Message us
        </a>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/collections" className="btn-primary justify-center">Shop collections</Link>
          <Link href="/" className="btn-outline justify-center">Back to homepage</Link>
        </div>
      </div>
    </section>
  );
}
