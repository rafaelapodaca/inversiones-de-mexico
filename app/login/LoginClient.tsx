"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { COLORS, SHADOW } from "../lib/theme";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginClient() {
  const sp = useSearchParams();
  const router = useRouter();

  const redirectTo = useMemo(() => sp.get("redirect") || "/inicio", [sp]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string>("");

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setMsg(error.message);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  const page = {
    minHeight: "100vh",
    background: COLORS.bg,
    color: COLORS.text,
    fontFamily: "system-ui",
    display: "grid",
    placeItems: "center",
    padding: 24,
  } as const;

  const card = {
    width: "min(520px, 100%)",
    padding: 18,
    borderRadius: 16,
    border: `1px solid ${COLORS.border}`,
    background: COLORS.card,
    boxShadow: SHADOW,
  } as const;

  const input = {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(0,0,0,0.25)",
    color: COLORS.white,
    outline: "none",
  } as const;

  const btn = {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.08)",
    color: COLORS.white,
    fontWeight: 950,
    cursor: "pointer",
  } as const;

  return (
    <main style={page}>
      <section style={card}>
        <div style={{ fontSize: 22, fontWeight: 950, color: COLORS.white }}>Acceso</div>
        <div style={{ marginTop: 6, color: COLORS.muted }}>
          Inicia sesión para entrar al portal.
        </div>

        <form onSubmit={onLogin} style={{ marginTop: 14, display: "grid", gap: 10 }}>
          <input
            style={input}
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            style={input}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button style={btn} disabled={loading} type="submit">
            {loading ? "Entrando..." : "Entrar"}
          </button>

          {msg ? (
            <div style={{ marginTop: 6, color: "#fca5a5", fontWeight: 800 }}>
              {msg}
            </div>
          ) : null}
        </form>
      </section>
    </main>
  );
}