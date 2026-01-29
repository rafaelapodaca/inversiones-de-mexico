import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const ADMIN_EMAILS = new Set(["rafael_apodaca@hotmail.com"]);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const next = url.searchParams.get("next") || "/inicio";

  const cookieStore = cookies();

  // respuesta base (la usaremos para setear cookies)
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // Next cookies acepta (name, value, options)
          cookieStore.set({ name, value, ...options });
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options, maxAge: 0 });
          res.cookies.set({ name, value: "", ...options, maxAge: 0 });
        },
      },
    }
  );

  // Ya con cookies, intentamos leer user
  const { data } = await supabase.auth.getUser();
  const email = (data?.user?.email || "").toLowerCase();

  const isAdmin = ADMIN_EMAILS.has(email);
  const dest = isAdmin ? "/admin" : next;

  // redirige preservando headers/cookies que se pudieron setear
  const redirectUrl = new URL(dest, url.origin);
  const redirectRes = NextResponse.redirect(redirectUrl);
  res.headers.forEach((v, k) => redirectRes.headers.set(k, v));
  return redirectRes;
}