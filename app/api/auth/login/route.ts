import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const ADMIN_EMAILS = new Set<string>([
  "rafael_apodaca@hotmail.com",
  // agrega aquí otros admins si quieres
]);

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));

  if (!email || !password) {
    return NextResponse.json({ ok: false, message: "Faltan credenciales" }, { status: 400 });
  }

  const cookieStore = cookies();
  const res = NextResponse.json({ ok: true, redirectTo: "/inicio" });

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

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 401 });
  }

  // ✅ Decide destino por rol (whitelist)
  const redirectTo = ADMIN_EMAILS.has(String(email).toLowerCase()) ? "/admin" : "/inicio";

  // ✅ devolver redirectTo (y mantener cookies en res)
  return NextResponse.json({ ok: true, redirectTo }, { headers: res.headers });
}