import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

function isPublic(pathname: string) {
  // Next internals / assets
  if (pathname.startsWith("/_next")) return true;
  if (pathname === "/favicon.ico") return true;

  // ✅ IMPORTANTÍSIMO: nunca proteger /api (incluye /api/auth/login y /api/auth/logout)
  if (pathname.startsWith("/api")) return true;

  // ✅ login público
  if (pathname === "/login") return true;

  // (Opcional) archivos tipo .well-known
  if (pathname.startsWith("/.well-known")) return true;

  return false;
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (isPublic(pathname)) return NextResponse.next();

  // Creamos respuesta "passthrough" para que Supabase pueda setear cookies si lo requiere
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // ✅ Validación real de sesión
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname + (search || ""));
    return NextResponse.redirect(url);
  }

  return res;
}

// ✅ Extra seguridad: además de isPublic, el matcher NO aplica para /api
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};