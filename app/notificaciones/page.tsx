"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { COLORS, SHADOW } from "../lib/theme";

export default function NotificacionesPage() {
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

  const label: CSSProperties = { fontSize: 12, color: COLORS.muted, fontWeight: 900, marginBottom: 6 };

  const checkboxRow: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "10px 12px",
    borderRadius: 14,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.04)",
  };

  const topBtn: CSSProperties = {
    padding: "10px 12px",
    borderRadius: 14,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.06)",
    color: COLORS.white,
    fontWeight: 950,
    textDecoration: "none",
    whiteSpace: "nowrap",
  };

  return (
    <main style={page}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <div>
          <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 900 }}>INVERSIONES DE MÉXICO</div>
          <h1 style={{ margin: "6px 0 0 0", fontSize: 22, fontWeight: 950, color: COLORS.white }}>
            Notificaciones
          </h1>
          <div style={{ marginTop: 6, color: COLORS.muted }}>
            Email / push: avisos, estados de cuenta y confirmaciones
          </div>
        </div>

        <Link href={withCid("/inicio")} style={topBtn}>
          ← Inicio
        </Link>
      </div>

      <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
        <section style={card}>
          <div style={{ fontWeight: 950, color: COLORS.white }}>Preferencias</div>
          <div style={hr} />

          <div style={{ display: "grid", gap: 10 }}>
            <div style={checkboxRow}>
              <div>
                <div style={label}>Estados de cuenta</div>
                <div style={{ color: COLORS.muted, fontSize: 12 }}>Cuando se cargue un PDF mensual</div>
              </div>
              <input type="checkbox" defaultChecked />
            </div>

            <div style={checkboxRow}>
              <div>
                <div style={label}>Confirmaciones</div>
                <div style={{ color: COLORS.muted, fontSize: 12 }}>Aportaciones / retiros / solicitudes</div>
              </div>
              <input type="checkbox" defaultChecked />
            </div>

            <div style={checkboxRow}>
              <div>
                <div style={label}>Comunicados</div>
                <div style={{ color: COLORS.muted, fontSize: 12 }}>Avisos importantes del fondo</div>
              </div>
              <input type="checkbox" defaultChecked />
            </div>
          </div>

          <div style={{ marginTop: 10, fontSize: 12, color: COLORS.muted }}>
            * MVP: esto es UI. Luego lo conectamos a tu tabla/config de usuario.
          </div>
        </section>

        <section style={card}>
          <div style={{ fontWeight: 950, color: COLORS.white }}>Últimos avisos</div>
          <div style={hr} />

          <div style={{ display: "grid", gap: 10 }}>
            {[
              { t: "Estado de cuenta disponible", d: "Enero 2026", s: "Revisa Documentos para descargar el PDF." },
              { t: "Ventana de retiros", d: "Esta semana", s: "Corte: jueves 12:00 pm. Liquidación: viernes." },
            ].map((n, i) => (
              <div
                key={i}
                style={{
                  padding: 12,
                  borderRadius: 14,
                  border: `1px solid ${COLORS.border}`,
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ fontWeight: 950, color: COLORS.white }}>{n.t}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 900 }}>{n.d}</div>
                </div>
                <div style={{ marginTop: 6, color: COLORS.muted, whiteSpace: "pre-wrap" }}>{n.s}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href={withCid("/documentos")} style={topBtn}>
              Ver Documentos
            </Link>
            <Link href={withCid("/mensajes")} style={topBtn}>
              Centro de mensajes
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
