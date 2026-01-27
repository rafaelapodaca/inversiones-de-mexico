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
  const [status, setStatus] = useState<"todos" | "pendiente" | "validado">("todos");

  const rows = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return (clientes ?? []).filter((c) => {
      const matchesQ =
        !qq ||
        String(c.nombre ?? "").toLowerCase().includes(qq) ||
        String(c.email ?? "").toLowerCase().includes(qq) ||
        String(c.id ?? "").toLowerCase().includes(qq);

      const s = (c.onboarding_status ?? "").toLowerCase();
      const matchesStatus =
        status === "todos" ||
        (status === "pendiente" && s === "pendiente") ||
        (status === "validado" && (s === "validado" || !!c.validated_at));

      return matchesQ && matchesStatus;
    });
  }, [clientes, q, status]);

  const input: CSSProperties = {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.06)",
    color: COLORS.text,
    outline: "none",
  };

  const th: CSSProperties = {
    textAlign: "left",
    padding: "10px 8px",
    fontSize: 12,
    color: COLORS.muted,
    borderBottom: `1px solid ${COLORS.border}`,
    whiteSpace: "nowrap",
  };

  const td: CSSProperties = {
    padding: "10px 8px",
    borderBottom: `1px solid ${COLORS.border}`,
    verticalAlign: "top",
  };

  const pill = (label: string, tone: "ok" | "warn" | "muted" = "muted") => {
    const map = {
      ok: { bg: "rgba(34,197,94,0.10)", bd: "rgba(34,197,94,0.30)", tx: "#86efac" },
      warn: { bg: "rgba(245,158,11,0.10)", bd: "rgba(245,158,11,0.30)", tx: "#fde68a" },
      muted: { bg: "rgba(255,255,255,0.06)", bd: COLORS.border, tx: COLORS.muted },
    } as const;

    const c = map[tone];
    return (
      <span
        style={{
          display: "inline-block",
          padding: "6px 10px",
          borderRadius: 999,
          border: `1px solid ${c.bd}`,
          background: c.bg,
          color: c.tx,
          fontSize: 12,
          fontWeight: 900,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    );
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 10 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre / email / id…"
          style={input}
        />

        <select value={status} onChange={(e) => setStatus(e.target.value as any)} style={input}>
          <option value="todos">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="validado">Validado</option>
        </select>
      </div>

      <div style={{ overflowX: "auto", borderRadius: 14, border: `1px solid ${COLORS.border}` }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>Cliente</th>
              <th style={th}>Status</th>
              <th style={th}>Notas</th>
              <th style={th}>Validado</th>
              <th style={th}>ID</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => {
              const s = (c.onboarding_status ?? "").toLowerCase();
              const isOk = s === "validado" || !!c.validated_at;
              const isPending = s === "pendiente" || (!s && !c.validated_at);

              return (
                <tr key={c.id}>
                  <td style={td}>
                    <div style={{ fontWeight: 950, color: COLORS.white }}>{c.nombre}</div>
                    <div style={{ color: COLORS.muted, fontSize: 12 }}>{c.email || "sin email"}</div>
                  </td>
                  <td style={td}>
                    {isOk ? pill("Validado", "ok") : isPending ? pill("Pendiente", "warn") : pill(s || "—", "muted")}
                  </td>
                  <td style={td}>
                    <div style={{ color: COLORS.text, opacity: 0.9, whiteSpace: "pre-wrap" }}>
                      {c.onboarding_notas || "—"}
                    </div>
                  </td>
                  <td style={td}>
                    <div style={{ color: COLORS.muted, fontSize: 12 }}>{c.validated_at || "—"}</div>
                  </td>
                  <td style={td}>
                    <div style={{ color: COLORS.muted, fontSize: 12, fontFamily: "ui-monospace, SFMono-Regular" }}>
                      {c.id}
                    </div>
                  </td>
                </tr>
              );
            })}

            {!rows.length ? (
              <tr>
                <td style={{ ...td, color: COLORS.muted }} colSpan={5}>
                  No hay resultados.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}