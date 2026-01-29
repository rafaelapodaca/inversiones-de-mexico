import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const ADMIN_EMAILS = new Set(["rafael_apodaca@hotmail.com"]);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const next = url.searchParams.get("next") || "/inicio";

  // ✅ En Next 16, tipado de cookies es quisquilloso → usamos getAll/setAll (como en proxy)
  const cookieStore = cookies();

  // Creamos una respuesta base para poder setear cookies
  const res = NextResponse.redirect(new URL(next, url.origin));

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

  // ✅ Intercambia el code del magic link y deja sesión en cookies
  // (Si no hay code, esto igual no truena; solo no habrá sesión)
  await supabase.auth.exchangeCodeForSession(url.searchParams.get("code") || "");

  // ✅ Ya con sesión/cookies, leemos el usuario
  const { data } = await supabase.auth.getUser();
  const email = (data?.user?.email || "").toLowerCase();

  const dest = ADMIN_EMAILS.has(email) ? "/admin" : next;

  // ✅ IMPORTANTE: redirigir usando EL MISMO res (para que viajen cookies)
  res.headers.set("Location", new URL(dest, url.origin).toString());
  return res;
}