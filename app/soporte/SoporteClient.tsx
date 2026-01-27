"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { COLORS } from "../lib/theme";

export default function SoporteClient({ cardStyle }: { cardStyle: CSSProperties }) {
  const sp = useSearchParams();
  const cid = sp.get("cliente_id") || "";

  const withCid = (path: string) => {
    if (!cid) return path;
    return path.includes("?") ? `${path}&cliente_id=${cid}` : `${path}?cliente_id=${cid}`;
  };

  const h: CSSProperties = { margin: 0, fontSize: 22, fontWeight: 950, color: COLORS.white };
  const sub: CSSProperties = { marginTop: 6, color: COLORS.muted };

  const back: CSSProperties = {
    padding: "10px 12px",
    borderRadius: 14,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.06)",
    color: COLORS.white,
    fontWeight: 950,
    textDecoration: "none",
    display: "inline-block",
    whiteSpace: "nowrap",
  };

  const input: CSSProperties = {
    width: "100%",
    padding: 10,
    borderRadius: 12,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(0,0,0,0.25)",
    color: COLORS.white,
    outline: "none",
  };

  const btn: CSSProperties = {
    padding: "10px 12px",
    borderRadius: 12,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.08)",
    color: COLORS.white,
    fontWeight: 950,
    cursor: "pointer",
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <div>
          <h1 style={h}>Soporte</h1>
          <div style={sub}>Crea un ticket (MVP)</div>
        </div>

        <Link href={withCid("/inicio")} style={back}>
          ← Inicio
        </Link>
      </div>

      <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
        <section style={cardStyle}>
          <div style={{ fontWeight: 950, color: COLORS.white }}>Nuevo ticket</div>
          <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
            <div>
              <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 6 }}>Asunto</div>
              <input placeholder="Ej. Retiro pendiente" style={input} />
            </div>

            <div>
              <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 6 }}>Mensaje</div>
              <textarea placeholder="Describe tu problema..." style={{ ...input, minHeight: 120, resize: "vertical" }} />
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" style={btn}>
                Enviar (demo)
              </button>
              <Link href={withCid("/notificaciones")} style={back}>
                Ver notificaciones
              </Link>
              <Link href={withCid("/mensajes")} style={back}>
                Ir a mensajes
              </Link>
            </div>

            <div style={{ marginTop: 8, color: COLORS.muted, fontSize: 12, lineHeight: 1.6 }}>
              *Esto es MVP demo. Luego conectamos a DB + envío de notificaciones.
            </div>
          </div>
        </section>
      </div>
    </>
  );
}