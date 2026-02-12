import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const ADMIN_EMAILS = new Set([
  "rafael_apodaca@hotmail.com",
]);

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // públicos
  if (
  pathname.startsWith("/_next") ||
  pathname.startsWith("/api") ||
  pathname.startsWith("/login") ||
  pathname.startsWith("/auth/callback") ||
  pathname.startsWith("/.well-known") ||
  pathname === "/favicon.ico"
) {
  return NextResponse.next();
}

  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookies) =>
          cookies.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          ),
      },
    }
  );

  const { data } = await supabase.auth.getUser();

  // 🔒 sin sesión → login
  if (!data?.user) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname + (search || ""));
    return NextResponse.redirect(url);
  }

  // 🔐 protección ADMIN
  if (pathname.startsWith("/admin")) {
    const email = data.user.email?.toLowerCase() || "";
    if (!ADMIN_EMAILS.has(email)) {
      return NextResponse.redirect(new URL("/inicio", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};