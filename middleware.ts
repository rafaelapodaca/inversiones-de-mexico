import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isPublic(pathname: string) {
  // Next internals / assets
  if (pathname.startsWith("/_next")) return true;
  if (pathname === "/favicon.ico") return true;

  // ✅ deja pasar TODO /api (incluye /api/auth/login y /api/auth/logout)
  if (pathname.startsWith("/api")) return true;

  // ✅ login público
  if (pathname === "/login") return true;

  // (Opcional) archivos tipo .well-known (Chrome devtools, etc.)
  if (pathname.startsWith("/.well-known")) return true;

  return false;
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (isPublic(pathname)) return NextResponse.next();

  // revisa si existe cookie de sesión (Supabase)
  const hasAuthCookie = req.cookies.getAll().some((c) => {
    const n = c.name;
    return n.startsWith("sb-") && n.includes("auth-token");
  });

  if (!hasAuthCookie) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname + (search || ""));
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
