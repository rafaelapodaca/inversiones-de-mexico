"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { COLORS, SHADOW } from "../lib/theme";

export default function AgendaPage() {
  const sp = useSearchParams();
  const cid = sp.get("cliente_id") || "";

  const withCid = (path: string) => {
    if (!cid) return path;
    return path.includes("?") ? `${path}&cliente_id=${cid}` : `${path}?cliente_id=${cid}`;
  };

  const page: CSSProperties = {
    minHeight: "100vh",
    background: COLORS.bg,
    color: COLORS.text,
    fontFamily: "system-ui",
    padding: 24,
    paddingBottom: 110,
  };

  const card: CSSProperties = {
    border: `1px solid ${COLORS.border}`,
    borderRadius: 16,
    padding: 16,
    background: COLORS.card,
    boxShadow: SHADOW,
  };

  const hr: CSSProperties = {
    border: "none",
    borderTop: `1px solid ${COLORS.border}`,
    margin: "12px 0",
  };

  const btn: CSSProperties = {
    padding: "12px 14px",
    borderRadius: 14,
    border: `1px solid ${COLORS.primary}`,
    background: COLORS.primary,
    color: COLORS.white,
    fontWeight: 950,
    textDecoration: "none",
    display: "inline-block",
    whiteSpace: "nowrap",
  };

  const ghost: CSSProperties = {
    padding: "10px 12px",
    borderRadius: 14,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.06)",
    color: COLORS.white,
    fontWeight: 950,
    textDecoration: "none",
    whiteSpace: "nowrap",
  };

  // (Luego pegamos tu link real de Calendly aquí)
  const calendlyUrl = "https://calendly.com/tu-link-aqui";

  return (
    <main style={page}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <div>
          <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 900 }}>INVERSIONES DE MÉXICO</div>
          <h1 style={{ margin: "6px 0 0 0", fontSize: 22, fontWeight: 950, color: COLORS.white }}>
            Agenda
          </h1>
          <div style={{ marginTop: 6, color: COLORS.muted }}>Agendar llamada / reunión</div>
        </div>

        <Link href={withCid("/inicio")} style={ghost}>
          ← Inicio
        </Link>
      </div>

      <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
        <section style={card}>
          <div style={{ fontWeight: 950, color: COLORS.white }}>Agendar</div>
          <div style={hr} />

          <div style={{ color: COLORS.muted, lineHeight: 1.6 }}>
            * MVP: aquí conectamos Calendly (o Google Calendar booking).
            <br />
            Por ahora dejé un link placeholder.
          </div>

          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href={calendlyUrl} target="_blank" rel="noreferrer" style={btn}>
              Abrir agenda
            </a>
            <Link href={withCid("/soporte")} style={ghost}>
              Ir a soporte
            </Link>
          </div>
        </section>

        <section style={card}>
          <div style={{ fontWeight: 950, color: COLORS.white }}>Tipos de reunión</div>
          <div style={hr} />

          <div style={{ display: "grid", gap: 10 }}>
            {[
              { t: "Aclaración", s: "Dudas sobre estado de cuenta / documentos." },
              { t: "Seguimiento", s: "Revisión general (mensual/semanal)." },
              { t: "Operativa", s: "Temas de aportación / retiro / estatus." },
            ].map((x, i) => (
              <div
                key={i}
                style={{
                  padding: 12,
                  borderRadius: 14,
                  border: `1px solid ${COLORS.border}`,
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                <div style={{ fontWeight: 950, color: COLORS.white }}>{x.t}</div>
                <div style={{ marginTop: 4, color: COLORS.muted }}>{x.s}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
