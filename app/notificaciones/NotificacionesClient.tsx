"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { COLORS } from "../lib/theme";

export default function NotificacionesClient({ cardStyle }: { cardStyle: CSSProperties }) {
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
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <div>
          <h1 style={h}>Notificaciones</h1>
          <div style={sub}>Alertas del sistema (MVP)</div>
        </div>

        <Link href={withCid("/inicio")} style={back}>
          ← Inicio
        </Link>
      </div>

      <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
        <section style={cardStyle}>
          <div style={pill}>Próximo</div>
          <div style={{ marginTop: 10, fontWeight: 950, color: COLORS.white }}>
            Aquí aparecerán notificaciones importantes
          </div>
          <div style={{ marginTop: 8, color: COLORS.muted, lineHeight: 1.7 }}>
            Ejemplos: confirmaciones de aportación, estatus de retiro, avisos de documentos, recordatorios.
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href={withCid("/mensajes")} style={back}>
              Ir a mensajes
            </Link>
            <Link href={withCid("/soporte")} style={back}>
              Soporte
            </Link>
          </div>
        </section>

        <section style={cardStyle}>
          <div style={{ fontWeight: 950, color: COLORS.white }}>Bandeja (demo)</div>
          <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
            {["Depósito recibido", "Documento pendiente", "Retiro en revisión"].map((t) => (
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
                  MVP · luego conectamos a base de datos
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}