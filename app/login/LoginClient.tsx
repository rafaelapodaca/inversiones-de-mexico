"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { COLORS } from "../lib/theme";

export default function LoginClient() {
  const sp = useSearchParams();
  const router = useRouter();

  const redirectTo = useMemo(() => sp.get("redirect") || "/inicio", [sp]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    const j: any = await r.json().catch(() => ({}));
    if (!r.ok) {
      setMsg(j?.message || "Error de login");
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

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
    <>
      <div style={{ fontSize: 22, fontWeight: 950, color: COLORS.white }}>Acceso</div>
      <div style={{ marginTop: 6, color: COLORS.muted }}>Inicia sesión para entrar al portal.</div>

      <form onSubmit={onLogin} style={{ marginTop: 14, display: "grid", gap: 10 }}>
        <input style={input} placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input style={input} placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button style={btn} disabled={loading} type="submit">
          {loading ? "Entrando..." : "Entrar"}
        </button>

        {msg ? <div style={{ marginTop: 6, color: "#fca5a5", fontWeight: 800 }}>{msg}</div> : null}
      </form>
    </>
  );
}