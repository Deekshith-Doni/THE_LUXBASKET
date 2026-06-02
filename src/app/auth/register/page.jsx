"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, Phone, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Registration failed");
        return;
      }
      toast.success("Account created! Signing you in...");
      await signIn("credentials", {
        email: form.email,
        password: form.password,
        callbackUrl: "/dashboard",
      });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex">
      {/* Left Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-emerald-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-dark via-emerald-dark/90 to-emerald" />
        <div className="relative z-10 flex flex-col justify-center px-16">
          <Link href="/">
            <span className="font-heading text-4xl font-medium text-ivory">
              The LuxBasket
            </span>
            <span className="block text-xs tracking-[0.35em] uppercase text-gold font-body mt-1">
              Premium Gifting
            </span>
          </Link>
          <h2 className="font-heading text-4xl font-light text-ivory leading-tight mt-12 mb-4">
            Join the world of{" "}
            <span className="italic text-gold">luxury gifting</span>
          </h2>
          <p className="font-body text-ivory/60 text-lg leading-relaxed max-w-sm">
            Create an account to unlock exclusive member perks, track orders,
            and save your favourite gifts.
          </p>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden text-center mb-8">
            <Link href="/">
              <span className="font-heading text-3xl font-medium text-emerald">
                The LuxBasket
              </span>
            </Link>
          </div>

          <h1 className="font-heading text-3xl text-charcoal mb-2">
            Create Account
          </h1>
          <p className="font-body text-sm text-charcoal/50 mb-8">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-emerald hover:text-gold transition-colors font-medium"
            >
              Sign in
            </Link>
          </p>

          {/* Google */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 py-3.5 border border-beige-dark bg-white text-charcoal text-sm font-body font-medium hover:border-emerald hover:bg-beige-light transition-all mb-6"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <hr className="flex-1 border-beige" />
            <span className="text-xs font-body text-charcoal/40 tracking-widest">
              OR
            </span>
            <hr className="flex-1 border-beige" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="luxury-label">Full Name</label>
              <div className="relative">
                <User
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40"
                />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="luxury-input pl-10"
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>
            <div>
              <label className="luxury-label">Email Address</label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40"
                />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="luxury-input pl-10"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="luxury-label">Phone (Optional)</label>
              <div className="relative">
                <Phone
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40"
                />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="luxury-input pl-10"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>
            <div>
              <label className="luxury-label">Password</label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="luxury-input pl-10 pr-10"
                  placeholder="Min. 8 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className="luxury-label">Confirm Password</label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40"
                />
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  className="luxury-input pl-10"
                  placeholder="Repeat password"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center mt-2"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-xs font-body text-charcoal/40 text-center mt-6 leading-relaxed">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-gold">
              Terms
            </Link>{" "}
            &{" "}
            <Link href="/privacy" className="underline hover:text-gold">
              Privacy Policy
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
