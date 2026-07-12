/**
 * YieldSense AI — Next.js Middleware
 *
 * Protects dashboard routes by checking for Firebase auth state.
 * In a production app, this would verify a session cookie.
 * For M1, we rely on client-side auth guards in the dashboard layout.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define public routes that don't require authentication
const publicPaths = ["/", "/login", "/signup", "/forgot-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicPaths.some((path) => pathname === path)) {
    return NextResponse.next();
  }

  // Allow static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // For protected routes, we allow through and let the client-side
  // AuthContext handle the redirect. This is because Firebase Auth
  // state is managed client-side via onAuthStateChanged.
  // A production implementation would use HTTP-only session cookies.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
