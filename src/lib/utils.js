import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function truncate(text, length) {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

export function calculateDiscount(original, discounted) {
  return Math.round(((original - discounted) / original) * 100);
}

export function generateOrderId() {
  return `LUX-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
}

export function getWhatsAppUrl(phone, message) {
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${encodedMsg}`;
}
