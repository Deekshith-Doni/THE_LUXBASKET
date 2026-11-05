const PRODUCTION_SITE_URL = "https://www.theluxbasket.com";

function getConfiguredSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!configured) return PRODUCTION_SITE_URL;

  try {
    const url = new URL(configured);
    if (["localhost", "127.0.0.1", "::1"].includes(url.hostname)) {
      return PRODUCTION_SITE_URL;
    }
    url.protocol = "https:";
    return url.origin;
  } catch {
    return PRODUCTION_SITE_URL;
  }
}

export const SITE_URL = getConfiguredSiteUrl();
