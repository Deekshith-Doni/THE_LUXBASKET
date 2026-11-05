"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export default function HeroSection() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for Next, -1 for Prev
  const [isHovered, setIsHovered] = useState(false);
  const autoplayTimer = useRef(null);

  // Fetch banners
  useEffect(() => {
    async function fetchBanners() {
      try {
        const res = await fetch("/api/banners");
        if (res.ok) {
          const data = await res.json();
          // Filter for active banners
          const activeBanners = (data.banners || []).filter((b) => b.isActive);
          setBanners(activeBanners);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBanners();
  }, []);

  // Determine active list (use default if empty or loading)
  const displayBanners =
    banners.length > 0
      ? banners
      : [
          {
            _id: "default",
            title: "Gift the *Art* of Luxury",
            subtitle:
              "Thoughtfully curated luxury hampers for corporate gifting, weddings, festive celebrations & customized moments that last forever.",
            image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1920&q=80",
            link: "/collections",
            buttonText: "Explore Collections",
          },
        ];

  const currentBanner = displayBanners[currentIndex] || displayBanners[0];

  // Autoplay setup
  useEffect(() => {
    if (displayBanners.length <= 1 || isHovered) {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
      return;
    }

    autoplayTimer.current = setInterval(() => {
      handleNext();
    }, 6000); // 6 seconds

    return () => {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    };
  }, [displayBanners, isHovered, currentIndex]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % displayBanners.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + displayBanners.length) % displayBanners.length);
  };

  const selectSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Helper to format title with bold/italic golden text styling inside asterisks
  const formatTitle = (title) => {
    if (!title) return "";
    const parts = title.split(/\*(.*?)\*/g);
    if (parts.length > 1) {
      return parts.map((part, index) => {
        if (index % 2 === 1) {
          return (
            <span key={index} className="italic text-gradient-gold font-medium">
              {part}
            </span>
          );
        }
        return part;
      });
    }
    return title;
  };

  // Child animation variants for staggered elements
  const childVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
  };

  return (
    <section
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="home-hero group relative flex items-center overflow-hidden bg-emerald-dark"
    >
      {/* Animated / Ken Burns Background Slide */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.25 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {/* Desktop Image */}
            <Image
              src={currentBanner.image}
              alt={currentBanner.title}
              fill
              className="object-cover object-center hidden md:block"
              priority
            />
            {/* Mobile Image */}
            {currentBanner.mobileImage ? (
              <Image
                src={currentBanner.mobileImage}
                alt={currentBanner.title}
                fill
                className="object-cover object-center block md:hidden"
                priority
              />
            ) : (
              <Image
                src={currentBanner.image}
                alt={currentBanner.title}
                fill
                className="object-cover object-center block md:hidden"
                priority
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-dark via-emerald-dark/80 to-emerald/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-dark via-transparent to-transparent z-10" />
      </div>

      {/* Floating decorative elements */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-10 w-64 h-64 rounded-full bg-gold/5 blur-3xl z-10"
      />

      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -3, 0] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-gold/5 blur-3xl z-10"
      />

      {/* Content */}
      <div className="container-luxury relative z-20 py-12 sm:py-16 lg:py-20">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={{
                initial: (dir) => ({
                  x: dir > 0 ? 40 : dir < 0 ? -40 : 0,
                  opacity: 0,
                }),
                animate: {
                  x: 0,
                  opacity: 1,
                  transition: {
                    x: { type: "spring", stiffness: 260, damping: 26 },
                    opacity: { duration: 0.5 },
                    staggerChildren: 0.12,
                  },
                },
                exit: (dir) => ({
                  x: dir > 0 ? -40 : dir < 0 ? 40 : 0,
                  opacity: 0,
                  transition: {
                    x: { type: "spring", stiffness: 260, damping: 26 },
                    opacity: { duration: 0.4 },
                  },
                }),
              }}
              className="space-y-4 md:space-y-5"
            >
              {/* Tag */}
              <motion.div variants={childVariants} className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-gold" />
                <span className="section-tag text-gold">The Finer Way To Gifting</span>
                <Sparkles size={14} className="text-gold" />
              </motion.div>

              {/* Heading */}
              <motion.h1
                variants={childVariants}
                className="font-heading text-[clamp(2.75rem,12vw,4.25rem)] sm:text-[clamp(3.5rem,6.5vw,5.5rem)] lg:text-[clamp(4rem,5.4vw,5.75rem)] font-light text-ivory leading-[1.02] tracking-[-0.025em] text-balance max-w-[14ch]"
              >
                {formatTitle(currentBanner.title)}
              </motion.h1>

              {/* Divider */}
              <motion.div
                variants={childVariants}
                className="w-24 h-px bg-gold my-4 origin-left"
              />

              {/* Subtitle */}
              {currentBanner.subtitle && (
                <motion.p
                  variants={childVariants}
                  className="text-[0.95rem] sm:text-base lg:text-lg font-body font-light text-ivory/80 max-w-xl leading-7"
                >
                  {currentBanner.subtitle}
                </motion.p>
              )}

              {/* CTAs */}
              <motion.div variants={childVariants} className="flex flex-wrap gap-3 pt-1">
                <Link
                  href={currentBanner.link || "/collections"}
                  className="btn-gold min-h-11 px-5 py-3 md:px-8 md:py-4"
                  onClick={() => trackEvent("cta_click", { section: "hero", item_name: currentBanner.buttonText || "Shop Now" })}
                >
                  {currentBanner.buttonText || "Shop Now"}
                  <ArrowRight size={16} />
                </Link>
                {currentBanner.link !== "/corporate" && (
                  <Link
                    href="/corporate"
                    className="btn-outline-gold min-h-11 px-5 py-3 md:px-8 md:py-4"
                    onClick={() => trackEvent("cta_click", { section: "hero", item_name: "Corporate Gifting" })}
                  >
                    Corporate Gifting
                  </Link>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Stats — hidden temporarily */}
          {/*
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex items-center gap-10 mt-16 pt-10 border-t border-ivory/10"
          >
            {[
              { value: "10,000+", label: "Happy Clients" },
              { value: "500+", label: "Gift Options" },
              { value: "50+", label: "Corporate Partners" },
              { value: "4.9\u2605", label: "Average Rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-heading text-2xl md:text-3xl font-medium text-gold">{stat.value}</p>
                <p className="text-xs font-body text-ivory/50 tracking-wide mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
          */}
        </div>
      </div>

      {/* Navigation Arrows */}
      {displayBanners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-3 md:left-6 bottom-5 md:bottom-auto md:top-1/2 -translate-y-0 md:-translate-y-1/2 z-30 w-11 h-11 rounded-full border border-ivory/20 bg-emerald-dark/50 text-ivory hover:text-gold hover:border-gold hover:bg-gold/10 transition-all duration-300 backdrop-blur-md flex items-center justify-center"
            aria-label="Previous slide"
          >
            <ChevronLeft size={22} className="transition-transform duration-300 hover:-translate-x-0.5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 md:right-6 bottom-5 md:bottom-auto md:top-1/2 -translate-y-0 md:-translate-y-1/2 z-30 w-11 h-11 rounded-full border border-ivory/20 bg-emerald-dark/50 text-ivory hover:text-gold hover:border-gold hover:bg-gold/10 transition-all duration-300 backdrop-blur-md flex items-center justify-center"
            aria-label="Next slide"
          >
            <ChevronRight size={22} className="transition-transform duration-300 hover:translate-x-0.5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-8 md:bottom-28 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1">
            {displayBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => selectSlide(index)}
                className={`min-w-11 min-h-11 flex items-center justify-center after:block after:h-2 after:rounded-full after:transition-all after:duration-500 ${
                  currentIndex === index
                    ? "after:w-8 after:bg-gold after:shadow-[0_0_12px_rgba(212,175,55,0.6)]"
                    : "after:w-2 after:bg-ivory/40 hover:after:bg-ivory"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 z-20 hidden sm:flex"
      >
        <span className="text-xs font-body text-ivory/30 tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-12 bg-gradient-to-b from-ivory/30 to-transparent"
        />
      </motion.div>
    </section>
  );
}
