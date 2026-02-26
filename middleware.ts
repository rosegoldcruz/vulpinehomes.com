import { NextRequest, NextResponse } from "next/server";

const C4L_HOST = "cabinets4less.vulpinehomes.com";

function normalizeHost(rawHost: string | null): string {
  return (rawHost || "").toLowerCase().split(":")[0];
}

export function middleware(req: NextRequest) {
  const host = normalizeHost(req.headers.get("host"));

  if (!host.startsWith(C4L_HOST)) {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;

  if (pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/c4l";
    return NextResponse.rewrite(url);
  }

  if (pathname === "/thank-you") {
    const url = req.nextUrl.clone();
    url.pathname = "/c4l/thank-you";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};

