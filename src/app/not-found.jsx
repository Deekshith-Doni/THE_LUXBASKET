import Link from "next/link";

export const metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="flex min-h-[65vh] items-center justify-center bg-ivory px-5 py-20 text-center">
      <div className="max-w-xl">
        <p className="section-tag text-emerald">404 · Page not found</p>
        <h1 className="mt-4 font-heading text-5xl font-light leading-tight text-charcoal sm:text-6xl">
          This gift page has moved
        </h1>
        <p className="mx-auto mt-5 max-w-md font-body text-charcoal/65">
          The link may be out of date. Browse our current collections or return to the home page.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/collections" className="btn-primary justify-center">Shop collections</Link>
          <Link href="/" className="btn-outline justify-center">Go to homepage</Link>
        </div>
      </div>
    </section>
  );
}
