export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-6VRQNFPYC1";

export const ANALYTICS_CONSENT_KEY = "luxbasket-analytics-consent";
export const ATTRIBUTION_STORAGE_KEY = "luxbasket-campaign-attribution";

export function hasAnalyticsConsent() {
  if (typeof window === "undefined") return false;

  try {
    return window.localStorage.getItem(ANALYTICS_CONSENT_KEY) === "accepted";
  } catch {
    return false;
  }
}

export function trackEvent(eventName, parameters = {}) {
  if (!hasAnalyticsConsent() || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, parameters);
}

export function getCampaignAttribution() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
