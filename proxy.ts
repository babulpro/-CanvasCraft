import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all admin web routes and admin API routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const sessionCookie = getSessionCookie(request);

    // 1. If not authenticated at all
    if (!sessionCookie) {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json(
          { success: false, error: "Unauthorized: Administrator sign-in required." },
          { status: 401 }
        );
      }
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // 2. Authenticated user: verify admin role via internal session endpoint
    try {
      const sessionUrl = new URL("/api/auth/get-session", request.url);
      const res = await fetch(sessionUrl.toString(), {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });

      if (res.ok) {
        const data = await res.json();
        const role = data?.user?.role;

        if (role !== "admin") {
          // If not admin:
          if (pathname.startsWith("/api/admin")) {
            return NextResponse.json(
              {
                success: false,
                error: `Forbidden: Admin access required (current role: '${role || "user"}').`,
              },
              { status: 403 }
            );
          }
          // Redirect regular users and moderators away from admin files to profile
          const profileUrl = new URL("/profile", request.url);
          profileUrl.searchParams.set("error", "admin_required");
          return NextResponse.redirect(profileUrl);
        }
      } else {
        // Session invalid or expired
        if (pathname.startsWith("/api/admin")) {
          return NextResponse.json(
            { success: false, error: "Unauthorized: Invalid or expired session." },
            { status: 401 }
          );
        }
        const signInUrl = new URL("/sign-in", request.url);
        signInUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(signInUrl);
      }
    } catch (err) {
      console.error("[Proxy Admin Auth Check Error]:", err);
      // Fallback: If verification fails, safely deny access to admin files
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json(
          { success: false, error: "Authorization verification failed." },
          { status: 500 }
        );
      }
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
