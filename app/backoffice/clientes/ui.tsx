"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { COLORS } from "../../lib/theme";

type Cliente = {
  id: string;
  nombre: string;
  email: string | null;
  onboarding_status: string | null;
  onboarding_notas: string | null;
  validated_at: string | null;
};

export default function ClientesOnboardingClient({ clientes }: { clientes: Cliente[] }) {
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return clientes;
    return clientes.filter((c) => {
      const hay =
        (c.nombre || "").toLowerCase().includes(s) ||
        (c.email || "").toLowerCase().includes(s) ||
        (c.id || "").toLowerCase().includes(s) ||
        (c.onboarding_status || "").toLowerCase().includes(s);
      return hay;
    });
  }, [clientes, q]);

  const input: CSSProperties = {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.06)",
    color: COLORS.text,
    outline: "none",
  };

  const pill = (status: string | null) => {
    const v = (status || "pendiente").toLowerCase();
    const ok = v.includes("valid") || v.includes("aprob");
    const bad = v.includes("rech") || v.includes("fall");
    return {
      padding: "6px 10px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 900,
      border: `1px solid ${COLORS.border}`,
      background: ok ? "rgba(34,197,94,0.15)" : bad ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.08)",
      color: ok ? "#86efac" : bad ? "#fca5a5" : "rgba(255,255,255,0.85)",
      width: "fit-content",
      whiteSpace: "nowrap",
    } as CSSProperties;
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nombre, email, status o ID..." style={input} />
        <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 900 }}>{rows.length} resultados</div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {rows.map((c) => (
          <div
            key={c.id}
            style={{
              border: `1px solid ${COLORS.border}`,
              borderRadius: 14,
              padding: 12,
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
              <div>
                <div style={{ fontWeight: 950, color: COLORS.white }}>
                  {c.nombre}{" "}
                  <span style={{ color: COLORS.muted, fontWeight: 800, fontSize: 12 }}>
                    {c.email ? `— ${c.email}` : ""}
                  </span>
                </div>
                <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 4 }}>ID: {c.id}</div>
                {c.onboarding_notas ? (
                  <div style={{ marginTop: 8, color: COLORS.muted, fontSize: 12, whiteSpace: "pre-wrap" }}>
                    Nota: {c.onboarding_notas}
                  </div>
                ) : null}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                <span style={pill(c.onboarding_status)}>{c.onboarding_status || "pendiente"}</span>
                <div style={{ fontSize: 12, color: COLORS.muted }}>
                  {c.validated_at ? `Validado: ${String(c.validated_at).slice(0, 10)}` : "Sin validar"}
                </div>
              </div>
            </div>
          </div>
        ))}

        {!rows.length ? <div style={{ color: COLORS.muted }}>Sin resultados.</div> : null}
      </div>
    </div>
  );
}