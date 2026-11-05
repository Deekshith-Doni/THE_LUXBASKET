import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { SITE_URL } from "@/lib/site";

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const isPrivatePage = ["/admin", "/dashboard", "/checkout", "/cart", "/auth"].some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const canonicalHostname = new URL(SITE_URL).hostname;
  const aliasHostname = canonicalHostname.startsWith("www.")
    ? canonicalHostname.slice(4)
    : `www.${canonicalHostname}`;
  const forwardedProtocol = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const requestProtocol = forwardedProtocol || req.nextUrl.protocol.replace(":", "");

  if (process.env.NODE_ENV === "production" && req.nextUrl.hostname === aliasHostname) {
    const canonicalUrl = req.nextUrl.clone();
    canonicalUrl.hostname = canonicalHostname;
    canonicalUrl.protocol = "https:";
    return NextResponse.redirect(canonicalUrl, 308);
  }

  if (
    process.env.NODE_ENV === "production" &&
    requestProtocol === "http" &&
    !["localhost", "127.0.0.1", "::1"].includes(req.nextUrl.hostname)
  ) {
    const secureUrl = req.nextUrl.clone();
    secureUrl.protocol = "https:";
    return NextResponse.redirect(secureUrl, 308);
  }

  if (!isPrivatePage) return NextResponse.next();

  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;

  // NextAuth v4 and v5 use different cookie names in dev and production
  const cookieNames = [
    "__Secure-authjs.session-token",
    "authjs.session-token",
    "__Secure-next-auth.session-token",
    "next-auth.session-token",
  ];

  let foundCookieName = undefined;
  for (const name of cookieNames) {
    if (req.cookies.has(name)) {
      foundCookieName = name;
      break;
    }
  }

  const token = await getToken({
    req,
    secret,
    cookieName: foundCookieName,
    secureCookie: foundCookieName ? foundCookieName.startsWith("__Secure-") : undefined,
  });
  const noIndex = (response) => {
    if (isPrivatePage) response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  };

  // Admin route protection
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return noIndex(NextResponse.redirect(
        new URL(`/auth/login?callbackUrl=${pathname}`, req.url),
      ));
    }
    if (token.role !== "admin") {
      return noIndex(NextResponse.redirect(new URL("/", req.url)));
    }
  }

  // Dashboard protection
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return noIndex(NextResponse.redirect(
        new URL(`/auth/login?callbackUrl=${pathname}`, req.url),
      ));
    }
  }

  // Checkout protection
  if (pathname.startsWith("/checkout")) {
    if (!token) {
      return noIndex(NextResponse.redirect(
        new URL("/auth/login?callbackUrl=/checkout", req.url),
      ));
    }
  }

  return noIndex(NextResponse.next());
}

export const config = {
  matcher: ["/:path*"],
};
