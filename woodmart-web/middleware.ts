import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 🔒 Protect all admin routes
  if (pathname.startsWith("/admin")) {
    // ✅ Allow admin login page
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    // 🔑 Check admin auth cookie
    const adminToken = request.cookies.get("admin_token")?.value;

    // ❌ Not authenticated → redirect to login
    if (!adminToken) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Apply ONLY to admin routes
export const config = {
  matcher: ["/admin/:path*"],
};