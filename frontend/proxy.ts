import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const role = request.cookies.get("gfg_role")?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/admin-login", request.url));
  }

  if (pathname.startsWith("/leader") && role !== "leader") {
    return NextResponse.redirect(new URL("/leader-login", request.url));
  }

  if (pathname.startsWith("/member") && role !== "member") {
    return NextResponse.redirect(new URL("/member-login", request.url));
  }

  return NextResponse.next();
}

export const middleware = proxy;

export const config = {
  matcher: ["/admin/:path*", "/leader/:path*", "/member/:path*"]
};
