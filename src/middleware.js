import { NextResponse } from "next/server"; 
import { getToken } from "next-auth/jwt";

const PROTECTED_ROUTES = [
  "/user/dashboard",
  "/user/products",
  "/user/settings",
];

const GUEST_ROUTES = [
  "/",
  "/login",
  "/register",
];

function isGuestRoute(pathname) {
  return GUEST_ROUTES.some((route) => {
    if (route === "/") return pathname === "/";
    return pathname.startsWith(route);
  });
}

function isProtectedRoute(pathname) {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Protected routes
  if (isProtectedRoute(pathname) && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Prevent logged-in users visiting guest pages
  if (isGuestRoute(pathname) && token) {
    return NextResponse.redirect(new URL("/user/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/user/:path*",
  ],
};