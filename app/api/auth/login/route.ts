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

  // ✅ Next 16: cookies() puede ser async
  const cookieStore = await cookies();

  // ✅ aquí guardaremos las cookies que supabase quiera setear
  const pendingCookies: Array<{ name: string; value: string; options: any }> = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // No podemos setear en el response aún, así que las guardamos
          pendingCookies.push(...cookiesToSet);
        },
      },
    }
  );

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 401 });
  }

  // ✅ Decide destino por rol (whitelist)
  const redirectTo = ADMIN_EMAILS.has(String(email).toLowerCase()) ? "/admin" : "/inicio";

  // ✅ Ahora sí: creamos respuesta FINAL y aplicamos cookies ahí
  const res = NextResponse.json({ ok: true, redirectTo });

  for (const { name, value, options } of pendingCookies) {
    res.cookies.set(name, value, options);
  }

  return res;
}