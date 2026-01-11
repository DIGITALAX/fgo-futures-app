import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextRequest, NextResponse } from "next/server";

let locales = ["en", "es", "pt", "fr", "yi", "gd"];
let defaultLocale = "en";

function getLocale(request: NextRequest) {
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  let headers = {
    "accept-language": request.headers.get("accept-language") || "en",
  };
  let languages = new Negotiator({ headers }).languages();
  return match(languages, locales, defaultLocale);
}

function isBot(userAgent: string) {
  return /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|sogou/i.test(
    userAgent
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get("user-agent") || "";
 
  if (pathname.startsWith("/api")) {
    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }
    
    return response;
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/fonts") ||
    pathname.startsWith("/videos") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/opengraph-image.png") ||
    pathname.startsWith("/sitemap.xml") ||
    pathname.startsWith("/BingSiteAuth.xml")
  ) {
    return NextResponse.next();
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  if (isBot(userAgent)) {
    return NextResponse.next();
  }

  const locale = getLocale(request);

  if (locale === defaultLocale) {
    return NextResponse.next();
  }

  const url = new URL(`/${locale}${pathname}`, request.url);
  url.search = request.nextUrl.search;
  
  
  const response = NextResponse.redirect(url);

  response.cookies.set("NEXT_LOCALE", locale, { path: "/", sameSite: "lax" });

  return response;
}

export const config = {
  matcher: [
    "/((?!_next|images|fonts|videos|favicon.ico|opengraph-image.png|sitemap|BingSiteAuth).*)",
  ],
};
