import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "amazon_scaler_secret_1234567890_rb_ac_integration";
const key = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("session")?.value;

  // Protect Admin Routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!token) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }
    try {
        const { payload } = await jwtVerify(token, key);
        if (payload.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/unauthorized", request.url));
        }
    } catch (e) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  // Protect Delivery Routes
  if (pathname.startsWith("/delivery") || pathname.startsWith("/api/delivery")) {
    if (!token) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }
    try {
        const { payload } = await jwtVerify(token, key);
        // Admin also has delivery access
        if (payload.role !== "DELIVERY" && payload.role !== "ADMIN") {
            return NextResponse.json({ error: "Access Denied" }, { status: 403 });
        }
    } catch (e) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/delivery/:path*",
    "/api/admin/:path*",
    "/api/delivery/:path*",
  ],
};
