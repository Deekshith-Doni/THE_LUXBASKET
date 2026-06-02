/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          DEFAULT: "#0F3D3E",
          dark: "#0A2829",
          light: "#1A5254",
          50: "#E8F4F4",
          100: "#C5E3E4",
        },
        gold: {
          DEFAULT: "#D4AF37",
          light: "#E8C860",
          dark: "#B8960C",
          50: "#FDF8E7",
          100: "#F7EDBE",
        },
        ivory: {
          DEFAULT: "#F8F5F0",
          dark: "#EDE9E3",
        },
        charcoal: {
          DEFAULT: "#2B2B2B",
          light: "#3D3D3D",
          50: "#F5F5F5",
        },
        beige: {
          DEFAULT: "#E8DDCF",
          dark: "#D4C5B0",
          light: "#F2EDE6",
        },
      },
      fontFamily: {
        cormorant: ["var(--font-cormorant)", "serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-in-left": "slideInLeft 0.6s ease-out",
        shimmer: "shimmer 2s infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(212, 175, 55, 0.4)" },
          "50%": { boxShadow: "0 0 0 15px rgba(212, 175, 55, 0)" },
        },
      },
      backgroundImage: {
        "gradient-luxury":
          "linear-gradient(135deg, #0F3D3E 0%, #0A2829 50%, #1A5254 100%)",
        "gradient-gold":
          "linear-gradient(135deg, #D4AF37 0%, #E8C860 50%, #B8960C 100%)",
        "gradient-ivory":
          "linear-gradient(180deg, #F8F5F0 0%, #EDE9E3 100%)",
        "gradient-glass":
          "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
      },
      boxShadow: {
        luxury: "0 25px 60px -12px rgba(15, 61, 62, 0.3)",
        gold: "0 10px 40px -10px rgba(212, 175, 55, 0.5)",
        card: "0 4px 30px rgba(0, 0, 0, 0.08)",
        "card-hover": "0 20px 60px rgba(0, 0, 0, 0.15)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.1)",
      },
      backdropBlur: {
        xs: "2px",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "120": "30rem",
        "160": "40rem",
      },
      maxWidth: {
        "8xl": "90rem",
        "9xl": "100rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
      },
    },
  },
  plugins: [],
};
