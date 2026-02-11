"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { COLORS } from "../lib/theme";

export default function LoginClient() {
  const sp = useSearchParams();
  const router = useRouter();

  // Si vienen de /admin, el middleware manda ?redirect=/admin
  const redirectParam = useMemo(() => sp.get("redirect") || "/inicio", [sp]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setMsg("");

    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const j: any = await r.json().catch(() => ({}));
    setLoading(false);

    if (!r.ok) {
      setMsg(j?.message || "No se pudo iniciar sesión");
      return;
    }

    // ✅ prioridad: lo que diga el API (admin vs cliente)
    const dest = j?.redirectTo || redirectParam;
    router.push(dest);
    router.refresh();
  }

  const brandRow = {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 18,
  } as const;

  const badge = {
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.7,
    padding: "8px 10px",
    borderRadius: 999,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.04)",
    color: COLORS.muted,
    textTransform: "uppercase" as const,
    whiteSpace: "nowrap" as const,
  } as const;

  const title = {
    fontSize: 24,
    fontWeight: 950,
    color: COLORS.white,
    lineHeight: 1.1,
  } as const;

  const subtitle = {
    marginTop: 6,
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 1.5,
  } as const;

  const label = {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: 800,
    marginBottom: 6,
  } as const;

  const input = {
    width: "100%",
    padding: 12,
    borderRadius: 14,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(0,0,0,0.20)",
    color: COLORS.white,
    outline: "none",
  } as const;

  const btn = {
    width: "100%",
    padding: 12,
    borderRadius: 14,
    border: `1px solid rgba(31,106,225,0.35)`,
    background: `linear-gradient(180deg, rgba(31,106,225,0.95), rgba(31,106,225,0.78))`,
    color: COLORS.white,
    fontWeight: 950,
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.75 : 1,
    boxShadow: "0 14px 30px rgba(31,106,225,0.18)",
  } as const;

  const help = {
    marginTop: 12,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    color: COLORS.muted,
    fontSize: 12,
  } as const;

  const divider = {
    marginTop: 16,
    height: 1,
    background: `linear-gradient(90deg, transparent, ${COLORS.border}, transparent)`,
  } as const;

  return (
    <>
      <div style={brandRow}>
        <div>
          <div style={title}>Acceso</div>
          <div style={subtitle}>Portal privado de clientes y administración.</div>
        </div>
        <div style={badge}>Fintech Premium</div>
      </div>

      <form onSubmit={onLogin} style={{ display: "grid", gap: 12 }}>
        <div>
          <div style={label}>Correo</div>
          <input
            style={input}
            placeholder="tucorreo@dominio.com"
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <div style={label}>Clave de acceso</div>
          <input
            style={input}
            placeholder="••••••••••••"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button style={btn} disabled={loading} type="submit">
          {loading ? "Entrando..." : "Entrar"}
        </button>

        {msg ? (
          <div style={{ color: "#fca5a5", fontWeight: 900, fontSize: 13 }}>
            {msg}
          </div>
        ) : null}

        <div style={divider} />

        <div style={help}>
          <span>Acceso restringido</span>
          <span style={{ opacity: 0.9 }}>Soporte: soporte@tudominio.com</span>
        </div>
      </form>
    </>
  );
}