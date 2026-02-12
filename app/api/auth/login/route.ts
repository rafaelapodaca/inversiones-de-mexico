export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const ADMIN_EMAILS = new Set<string>([
  "rafael_apodaca@hotmail.com",
]);

function sanitizeRedirect(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const r = input.trim();
  if (!r.startsWith("/")) return null;
  if (r.startsWith("//")) return null;
  return r;
}

export async function POST(req: Request) {
  const { email, password, redirectTo } = await req.json().catch(() => ({}));

  if (!email || !password) {
    return NextResponse.json({ ok: false, message: "Faltan credenciales" }, { status: 400 });
  }

  const emailLower = String(email).toLowerCase();

  // ✅ En Next 16 cookies() puede ser async → await
  const cookieStore = await cookies();

  // ✅ Respuesta base donde vamos a setear cookies
  const res = NextResponse.json({ ok: true });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // ✅ API compatible: get(name) / set(name,value,options) / remove(...)
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set(name, value, options);
        },
        remove(name: string, options: any) {
          res.cookies.set(name, "", { ...options, maxAge: 0 });
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

  let finalRedirect = isAdmin ? "/admin" : "/inicio";

  if (safeRequested) {
    if (isAdmin) {
      if (safeRequested === "/admin" || safeRequested.startsWith("/admin/")) {
        finalRedirect = safeRequested;
      }
    } else {
      if (!(safeRequested === "/admin" || safeRequested.startsWith("/admin/"))) {
        finalRedirect = safeRequested;
      }
    }
  }

  // ✅ Importante: devolver headers/cookies del res original
  return NextResponse.json({ ok: true, redirectTo: finalRedirect }, { headers: res.headers });
}