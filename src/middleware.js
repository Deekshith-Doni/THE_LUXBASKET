import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
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
