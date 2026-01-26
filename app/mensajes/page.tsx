"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { COLORS, SHADOW } from "../lib/theme";

export default function MensajesPage() {
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
    padding: 16,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 16,
    background: COLORS.card,
    boxShadow: SHADOW,
  };

  const h: CSSProperties = { margin: 0, fontSize: 22, fontWeight: 950, color: COLORS.white };
  const sub: CSSProperties = { marginTop: 6, color: COLORS.muted };

  const back: CSSProperties = {
    padding: "10px 12px",
    borderRadius: 14,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.06)",
    color: COLORS.white, // ✅ antes estaba COLORS.text
    fontWeight: 950,
    textDecoration: "none",
    display: "inline-block",
    whiteSpace: "nowrap",
  };

  const pill: CSSProperties = {
    padding: "6px 10px",
    borderRadius: 999,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.06)",
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: 900,
    width: "fit-content",
  };

  return (
    <main style={page}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <div>
          <h1 style={h}>Centro de mensajes</h1>
          <div style={sub}>Comunicados oficiales del fondo (MVP)</div>
        </div>

        <Link href={withCid("/inicio")} style={back}>
          ← Inicio
        </Link>
      </div>

      <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
        <section style={card}>
          <div style={pill}>Próximo</div>
          <div style={{ marginTop: 10, fontWeight: 950, color: COLORS.white }}>
            Aquí verás comunicados oficiales
          </div>
          <div style={{ marginTop: 8, color: COLORS.muted, lineHeight: 1.7 }}>
            Ejemplos: avisos de corte, ventanas de retiro, cambios operativos, cartas al inversionista.
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href={withCid("/soporte")} style={back}>
              Crear ticket
            </Link>
            <Link href={withCid("/notificaciones")} style={back}>
              Ver notificaciones
            </Link>
          </div>
        </section>

        <section style={card}>
          <div style={{ fontWeight: 950, color: COLORS.white }}>Bandeja (demo)</div>
          <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
            {["Ventana de retiro — Enero", "Carta semanal — Resumen", "Actualización operativa"].map((t) => (
              <div
                key={t}
                style={{
                  padding: 12,
                  borderRadius: 14,
                  border: `1px solid ${COLORS.border}`,
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                <div style={{ fontWeight: 950, color: COLORS.white }}>{t}</div>
                <div style={{ marginTop: 6, color: COLORS.muted, fontSize: 12 }}>
                  MVP · pronto conectamos a base de datos
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
