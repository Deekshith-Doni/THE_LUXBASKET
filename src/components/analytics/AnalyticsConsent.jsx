"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  ANALYTICS_CONSENT_KEY,
  ATTRIBUTION_STORAGE_KEY,
  GA_MEASUREMENT_ID,
} from "@/lib/analytics";

const UTM_FIELDS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
];

function getAttributionFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const values = {};

  for (const key of UTM_FIELDS) {
    const value = params.get(key)?.trim().slice(0, 200);
    if (value) values[key] = value;
  }

  return Object.keys(values).length
    ? { ...values, landing_page: window.location.pathname, captured_at: new Date().toISOString() }
    : null;
}

function persistAttribution(touch) {
  try {
    const current = JSON.parse(window.localStorage.getItem(ATTRIBUTION_STORAGE_KEY) || "null");
    const next = {
      first_touch: current?.first_touch || touch,
      last_touch: touch,
    };
    window.localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Browser storage may be disabled. Campaign attribution is optional.
  }
}

function clearGoogleAnalyticsCookies() {
  const hostParts = window.location.hostname.split(".");
  const baseDomain = hostParts.length > 1 ? `.${hostParts.slice(-2).join(".")}` : "";
  const domains = ["", baseDomain].filter((value, index, list) => list.indexOf(value) === index);
  const names = document.cookie
    .split(";")
    .map((cookie) => cookie.trim().split("=")[0])
    .filter((name) => name === "_ga" || name.startsWith("_ga_"));

  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/;${domain ? ` domain=${domain};` : ""} SameSite=Lax`;
    }
  }
}

export default function AnalyticsConsent() {
  const pathname = usePathname();
  const [consent, setConsent] = useState(null);
  const [visible, setVisible] = useState(false);
  const [pendingAttribution, setPendingAttribution] = useState(null);

  useEffect(() => {
    let saved = null;
    try {
      saved = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
    } catch {
      // Keep analytics disabled when storage is unavailable.
    }
    setConsent(saved === "accepted" || saved === "rejected" ? saved : null);
    setVisible(!saved);

    const openSettings = () => setVisible(true);
    window.addEventListener("luxbasket:open-cookie-settings", openSettings);
    return () => window.removeEventListener("luxbasket:open-cookie-settings", openSettings);
  }, []);

  useEffect(() => {
    const touch = getAttributionFromUrl();
    if (!touch) return;

    try {
      if (window.localStorage.getItem(ANALYTICS_CONSENT_KEY) === "accepted") {
        persistAttribution(touch);
      } else {
        // Keep campaign tags in memory until consent; do not write analytics data to browser storage first.
        setPendingAttribution(touch);
      }
    } catch {
      // Analytics and attribution stay off if consent or browser storage cannot be read.
    }
  }, [pathname]);

  useEffect(() => {
    if (consent === "accepted" && pendingAttribution) {
      persistAttribution(pendingAttribution);
      setPendingAttribution(null);
    }
  }, [consent, pendingAttribution]);

  useEffect(() => {
    if (consent !== "accepted") return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("consent", "default", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    let campaignConfig = { send_page_view: false };
    try {
      const attribution = JSON.parse(window.localStorage.getItem(ATTRIBUTION_STORAGE_KEY) || "null");
      const touch = attribution?.last_touch;
      const campaignFields = {
        campaign_source: touch?.utm_source,
        campaign_medium: touch?.utm_medium,
        campaign_name: touch?.utm_campaign,
        campaign_term: touch?.utm_term,
        campaign_content: touch?.utm_content,
        campaign_id: touch?.utm_id,
      };
      campaignConfig = {
        ...campaignConfig,
        ...Object.fromEntries(Object.entries(campaignFields).filter(([, value]) => typeof value === "string" && value)),
      };
    } catch {
      // Campaign information is optional; the page still loads without it.
    }
    window.gtag("config", GA_MEASUREMENT_ID, campaignConfig);

    if (!document.querySelector(`script[data-luxbasket-ga="${GA_MEASUREMENT_ID}"]`)) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      script.dataset.luxbasketGa = GA_MEASUREMENT_ID;
      document.head.appendChild(script);
    }

    window.gtag("event", "page_view", {
      page_path: `${window.location.pathname}${window.location.search}`,
      page_title: document.title,
    });
  }, [consent, pathname]);

  const saveChoice = useCallback((choice) => {
    try {
      window.localStorage.setItem(ANALYTICS_CONSENT_KEY, choice);
      if (choice !== "accepted") {
        window.localStorage.removeItem(ATTRIBUTION_STORAGE_KEY);
        setPendingAttribution(null);
        if (typeof window.gtag === "function") {
          window.gtag("consent", "update", { analytics_storage: "denied" });
        }
        clearGoogleAnalyticsCookies();
      }
    } catch {
      // A choice cannot be persisted; do not start analytics.
      if (choice === "accepted") choice = "rejected";
    }
    setConsent(choice);
    setVisible(false);
  }, []);

  const openSettings = () => setVisible(true);

  if (!visible) {
    return consent ? (
      <button
        type="button"
        onClick={openSettings}
        className="fixed bottom-3 left-3 z-40 rounded-full border border-beige-dark bg-white px-3 py-2 text-xs font-body text-charcoal shadow-md hover:border-emerald hover:text-emerald focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
        aria-label="Change analytics cookie settings"
      >
        Cookie settings
      </button>
    ) : null;
  }

  return (
    <section
      className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-3xl border border-beige-dark bg-white p-5 shadow-xl sm:inset-x-6 sm:bottom-6 sm:p-6"
      role="region"
      aria-label="Analytics cookie preferences"
      aria-live="polite"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <h2 className="font-heading text-xl font-medium text-charcoal">Your privacy choices</h2>
          <p className="mt-1 text-sm leading-relaxed text-charcoal/70">
            Allow optional analytics cookies to help us understand visits and campaign performance. Shopping and account features work either way. Read our{" "}
            <Link href="/privacy" className="font-medium text-emerald underline underline-offset-2">Privacy Policy</Link>.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:min-w-40">
          <button type="button" onClick={() => saveChoice("accepted")} className="min-h-11 bg-emerald px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-dark">
            Allow analytics
          </button>
          <button type="button" onClick={() => saveChoice("rejected")} className="min-h-11 border border-beige-dark px-5 py-2 text-sm font-medium text-charcoal hover:border-emerald hover:text-emerald">
            Reject optional analytics
          </button>
        </div>
      </div>
    </section>
  );
}
