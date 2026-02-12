import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const ADMIN_EMAILS = new Set<string>([
  "rafael_apodaca@hotmail.com",
  // agrega más admins aquí si quieres
]);

function sanitizeRedirect(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const r = input.trim();
  if (!r.startsWith("/")) return null;
  if (r.startsWith("//")) return null; // evita open-redirect tipo //evil.com
  return r;
}

export async function POST(req: Request) {
  const { email, password, redirectTo } = await req.json().catch(() => ({}));

  if (!email || !password) {
    return NextResponse.json({ ok: false, message: "Faltan credenciales" }, { status: 400 });
  }

  const emailLower = String(email).toLowerCase();
  const cookieStore = await cookies();

  // ✅ Creamos respuesta base para que Supabase setee cookies sobre ESTE objeto
  const res = NextResponse.json({ ok: true });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { error } = await supabase.auth.signInWithPassword({
    email: String(email),
    password: String(password),
  });

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 401 });
  }

  const isAdmin = ADMIN_EMAILS.has(emailLower);
  const safeRequested = sanitizeRedirect(redirectTo);

  // ✅ destino final con whitelist por rol
  let finalRedirect = isAdmin ? "/admin" : "/inicio";

  if (safeRequested) {
    if (isAdmin) {
      // Admin SOLO aterriza en admin (o subrutas admin)
      if (safeRequested === "/admin" || safeRequested.startsWith("/admin/")) {
        finalRedirect = safeRequested;
      }
    } else {
      // No-admin NUNCA puede ir a /admin
      if (!(safeRequested === "/admin" || safeRequested.startsWith("/admin/"))) {
        finalRedirect = safeRequested;
      }
    }
  }

  // ✅ devolvemos cookies + redirectTo
  return NextResponse.json({ ok: true, redirectTo: finalRedirect }, { headers: res.headers });
}