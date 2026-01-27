cd ~/inversiones-de-mexico

cat > middleware.ts <<'EOF'
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isPublic(pathname: string) {
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/favicon.ico")) return true;
  if (pathname === "/login") return true;
  // si tienes assets públicos extra, agrega aquí
  return false;
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (isPublic(pathname)) return NextResponse.next();

  // Supabase Auth (cookies) — para SSR/middleware
  const hasAuthCookie = req.cookies.getAll().some((c) => {
    const n = c.name;
    return n.startsWith("sb-") && n.includes("auth-token");
  });

  if (!hasAuthCookie) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname + search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
EOF