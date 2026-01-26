"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { COLORS, SHADOW } from "../lib/theme";

type State = { ok: boolean; message: string };

export default function SoportePage() {
  const sp = useSearchParams();
  const cid = sp.get("cliente_id") || "";

  const withCid = (path: string) => {
    if (!cid) return path;
    return path.includes("?") ? `${path}&cliente_id=${cid}` : `${path}?cliente_id=${cid}`;
  };

  const [state, setState] = useState<State>({ ok: false, message: "" });

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

  const input: CSSProperties = {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.06)",
    color: COLORS.white,
    outline: "none",
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

  const banner: CSSProperties = {
    padding: "10px 12px",
    borderRadius: 12,
    border: `1px solid ${state.ok ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
    background: state.ok ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
    color: state.ok ? "#86efac" : "#fca5a5",
    fontWeight: 950,
    whiteSpace: "pre-wrap",
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState({
      ok: true,
      message: "✅ Ticket recibido.\n(MVP) Aún no se guarda en base de datos, pero ya quedó la pantalla lista.",
    });
  };

  return (
    <main style={page}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <div>
          <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 900 }}>INVERSIONES DE MÉXICO</div>
          <h1 style={{ margin: "6px 0 0 0", fontSize: 22, fontWeight: 950, color: COLORS.white }}>
            Soporte / Tickets
          </h1>
          <div style={{ marginTop: 6, color: COLORS.muted }}>Solicitud · Documento · Aclaración</div>
        </div>

        <Link href={withCid("/inicio")} style={ghost}>
          ← Inicio
        </Link>
      </div>

      <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
        <section style={card}>
          <div style={{ fontWeight: 950, color: COLORS.white }}>Crear ticket</div>
          <div style={hr} />

          {state.message ? <div style={{ marginBottom: 10, ...banner }}>{state.message}</div> : null}

          <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
            <div>
              <div style={label}>Tipo</div>
              <select name="tipo" style={input} defaultValue="solicitud" required>
                <option value="solicitud">Solicitud</option>
                <option value="documento">Documento</option>
                <option value="aclaracion">Aclaración</option>
              </select>
            </div>

            <div>
              <div style={label}>Asunto</div>
              <input name="asunto" style={input} placeholder="Ej: Retiro enero / Documento faltante" required />
            </div>

            <div>
              <div style={label}>Mensaje</div>
              <textarea
                name="mensaje"
                style={{ ...input, minHeight: 120, resize: "vertical" }}
                placeholder="Describe tu solicitud..."
                required
              />
            </div>

            <button type="submit" style={btn}>
              Enviar ticket
            </button>

            <div style={{ fontSize: 12, color: COLORS.muted }}>
              * MVP: luego conectamos a una tabla `tickets` y notificaciones.
            </div>
          </form>
        </section>

        <section style={card}>
          <div style={{ fontWeight: 950, color: COLORS.white }}>Atajos</div>
          <div style={hr} />

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href={withCid("/mensajes")} style={ghost}>
              Centro de mensajes
            </Link>
            <Link href={withCid("/agenda")} style={ghost}>
              Agendar llamada
            </Link>
            <Link href={withCid("/notificaciones")} style={ghost}>
              Notificaciones
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
