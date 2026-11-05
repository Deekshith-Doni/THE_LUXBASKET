"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { trackEvent } from "@/lib/analytics";

const CAROUSEL_TITLE = "Featured Gifts";

function ProductCarousel({ items }) {
  const trackRef = useRef(null);
  const mobileTrackRef = useRef(null);
  const scrollTimer = useRef(null);
  const mobileScrollTimer = useRef(null);
  const dotCount = Math.min(5, Math.max(1, Math.ceil(items.length / 4)));
  const mobilePageCount = Math.ceil(items.length / 4);
  const [activeDot, setActiveDot] = useState(0);
  const [activeMobilePage, setActiveMobilePage] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateActiveDot = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      const progress = maxScroll > 0 ? track.scrollLeft / maxScroll : 0;
      setActiveDot(Math.round(progress * (dotCount - 1)));
    };

    const updateMobilePage = () => {
      const mobileTrack = mobileTrackRef.current;
      if (!mobileTrack?.clientWidth) return;
      const page = Math.round(mobileTrack.scrollLeft / mobileTrack.clientWidth);
      setActiveMobilePage(Math.min(page, mobilePageCount - 1));
    };

    updateActiveDot();
    updateMobilePage();
    window.addEventListener("resize", updateActiveDot);
    window.addEventListener("resize", updateMobilePage);
    return () => {
      window.removeEventListener("resize", updateActiveDot);
      window.removeEventListener("resize", updateMobilePage);
      clearTimeout(scrollTimer.current);
      clearTimeout(mobileScrollTimer.current);
    };
  }, [dotCount, mobilePageCount]);

  const handleScroll = () => {
    clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      const track = trackRef.current;
      if (!track) return;
      const maxScroll = track.scrollWidth - track.clientWidth;
      const progress = maxScroll > 0 ? track.scrollLeft / maxScroll : 0;
      setActiveDot(Math.round(progress * (dotCount - 1)));
      trackEvent("carousel_scroll", {
        section: CAROUSEL_TITLE,
        position: Math.round(progress * (items.length - 1)) + 1,
      });
    }, 100);
  };

  const scroll = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction * track.clientWidth * 0.85,
      behavior: "smooth",
    });
  };

  const scrollToDot = (index) => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const target = dotCount > 1 ? (maxScroll * index) / (dotCount - 1) : 0;
    track.scrollTo({ left: target, behavior: "smooth" });
    setActiveDot(index);
  };

  const handleMobileScroll = () => {
    clearTimeout(mobileScrollTimer.current);
    mobileScrollTimer.current = setTimeout(() => {
      const track = mobileTrackRef.current;
      if (!track?.clientWidth) return;
      const page = Math.min(
        Math.round(track.scrollLeft / track.clientWidth),
        mobilePageCount - 1,
      );
      setActiveMobilePage(page);
      trackEvent("carousel_scroll", {
        section: CAROUSEL_TITLE,
        position: page * 4 + 1,
      });
    }, 100);
  };

  const scrollToMobilePage = (index) => {
    const track = mobileTrackRef.current;
    if (!track) return;
    track.scrollTo({ left: track.clientWidth * index, behavior: "smooth" });
    setActiveMobilePage(index);
  };

  const mobilePages = Array.from({ length: mobilePageCount }, (_, pageIndex) =>
    items.slice(pageIndex * 4, pageIndex * 4 + 4),
  );

  return (
    <>
      <div className="product-carousel-shell">
        <button
          type="button"
          onClick={() => scroll(-1)}
          className="carousel-arrow carousel-arrow-prev"
          aria-label="Show previous gifts"
        >
          <ArrowLeft size={19} />
        </button>
        <div
          ref={trackRef}
          className="product-rail-track product-carousel-track"
          onScroll={handleScroll}
          role="region"
          aria-label={CAROUSEL_TITLE}
          aria-labelledby="featured-products-heading"
          tabIndex={0}
        >
          {items.map((product, index) => (
            <ProductCard
              key={`desktop-${product._id}`}
              product={product}
              section={CAROUSEL_TITLE}
              position={index + 1}
              className="product-rail-card"
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => scroll(1)}
          className="carousel-arrow carousel-arrow-next"
          aria-label="Show more gifts"
        >
          <ArrowRight size={19} />
        </button>
      </div>

      {dotCount > 1 && (
        <div className="carousel-dots desktop-carousel-dots" role="group" aria-label="Choose product carousel position">
          {Array.from({ length: dotCount }, (_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollToDot(index)}
              className={`carousel-dot ${activeDot === index ? "is-active" : ""}`}
              aria-label={`Go to product section ${index + 1} of ${dotCount}`}
              aria-pressed={activeDot === index}
            />
          ))}
        </div>
      )}

      <div
        ref={mobileTrackRef}
        className="mobile-product-carousel"
        onScroll={handleMobileScroll}
        role="region"
        aria-label={`${CAROUSEL_TITLE} carousel`}
        aria-labelledby="featured-products-heading"
        tabIndex={0}
      >
        {mobilePages.map((page, pageIndex) => (
          <div
            key={`page-${pageIndex}`}
            className="mobile-product-page"
            role="group"
            aria-label={`Product group ${pageIndex + 1} of ${mobilePageCount}`}
          >
            {page.map((product, productIndex) => (
              <ProductCard
                key={`mobile-${product._id}`}
                product={product}
                section={CAROUSEL_TITLE}
                position={pageIndex * 4 + productIndex + 1}
                className="mobile-product-card"
              />
            ))}
          </div>
        ))}
      </div>

      {mobilePageCount > 1 && (
        <div className="carousel-dots mobile-carousel-dots" role="group" aria-label="Choose a group of mobile products">
          {mobilePages.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollToMobilePage(index)}
              className={`carousel-dot ${activeMobilePage === index ? "is-active" : ""}`}
              aria-label={`Show product group ${index + 1} of ${mobilePageCount}`}
              aria-pressed={activeMobilePage === index}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?limit=25&sort=createdAt&order=desc")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Products unavailable"))))
      .then((data) => setProducts(data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="product-showcase-section bg-white">
      <div className="container-luxury">
        <div className="product-section-heading flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7">
          <div>
            <span className="section-tag">Thoughtfully curated</span>
            <h2
              id="featured-products-heading"
              className="font-heading text-3xl sm:text-4xl md:text-5xl font-medium text-charcoal mt-1"
            >
              Find a Gift to Remember
            </h2>
          </div>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 min-h-11 text-sm font-medium text-emerald hover:text-gold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
          >
            Explore all gifts <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <>
            <div className="product-carousel-shell" aria-hidden="true">
              <div className="product-rail-track product-carousel-track">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="product-rail-skeleton skeleton" />
                ))}
              </div>
            </div>
            <div className="mobile-product-carousel" aria-hidden="true">
              <div className="mobile-product-page">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="mobile-product-skeleton skeleton" />
                ))}
              </div>
            </div>
          </>
        ) : products.length ? (
          <ProductCarousel items={products} />
        ) : null}
      </div>
    </section>
  );
}
