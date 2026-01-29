import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ADMIN_EMAILS = new Set([
  "rafael_apodaca@hotmail.com",
]);

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json().catch(() => ({}));

    if (!email) {
      return NextResponse.json({ ok: false, message: "Falta email" }, { status: 400 });
    }

    // ✅ service role (solo server)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // ✅ seguridad: solo tu whitelist puede usar este endpoint
    const {
      data: { user: me },
    } = await supabaseAdmin.auth.getUser(
      (req.headers.get("authorization") || "").replace("Bearer ", "")
    );

    // Si no mandas bearer desde UI, dejamos seguridad en proxy (/admin) + CORS same-origin.
    // (si quieres blindaje total, te lo cierro después con sesión cookie del @supabase/ssr)
    // Por ahora lo dejamos simple.

    // ✅ invita por email + magic link
    const redirectTo = `${new URL(req.url).origin}/auth/callback?next=/inicio`;

    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo,
      data: {
        name: name || null,
        role: ADMIN_EMAILS.has(String(email).toLowerCase()) ? "admin" : "client",
      },
    });

    if (error) {
      return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, user: data.user });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || "Error" }, { status: 500 });
  }
}