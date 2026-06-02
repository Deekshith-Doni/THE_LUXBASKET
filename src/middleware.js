import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
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
  const { pathname } = req.nextUrl;

  // Admin route protection
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(
        new URL(`/auth/login?callbackUrl=${pathname}`, req.url),
      );
    }
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Dashboard protection
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(
        new URL(`/auth/login?callbackUrl=${pathname}`, req.url),
      );
    }
  }

  // Checkout protection
  if (pathname.startsWith("/checkout")) {
    if (!token) {
      return NextResponse.redirect(
        new URL("/auth/login?callbackUrl=/checkout", req.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/checkout/:path*"],
};
