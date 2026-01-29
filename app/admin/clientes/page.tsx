"use client";

import { useState, type FormEvent } from "react";
import { COLORS, SHADOW } from "../../lib/theme";

export default function AdminClientesPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string>("");

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const r = await fetch("/api/admin/create-client", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, name }),
    });

    const j: any = await r.json().catch(() => ({}));
    setLoading(false);

    if (!r.ok) {
      setMsg(j?.message || "Error creando cliente");
      return;
    }

    setMsg("✅ Invitación enviada por email (magic link).");
    setEmail("");
    setName("");
  }

  const page = {
    minHeight: "100vh",
    background: COLORS.bg,
    color: COLORS.text,
    fontFamily: "system-ui",
    padding: 24,
  } as const;

  const card = {
    maxWidth: 720,
    margin: "0 auto",
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
        <div style={{ fontSize: 22, fontWeight: 950, color: COLORS.white }}>
          Alta de clientes
        </div>
        <div style={{ marginTop: 6, color: COLORS.muted }}>
          Crea/invita un cliente por email (magic link). No necesitas password.
        </div>

        <form onSubmit={onCreate} style={{ marginTop: 14, display: "grid", gap: 10 }}>
          <input
            style={input}
            placeholder="Nombre (opcional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            style={input}
            placeholder="Email del cliente"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button style={btn} disabled={loading} type="submit">
            {loading ? "Enviando..." : "Invitar cliente"}
          </button>

          {msg ? (
            <div
              style={{
                marginTop: 6,
                color: msg.startsWith("✅") ? "#86efac" : "#fca5a5",
                fontWeight: 800,
              }}
            >
              {msg}
            </div>
          ) : null}
        </form>
      </section>
    </main>
  );
}