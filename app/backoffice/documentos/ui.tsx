"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { COLORS } from "../../lib/theme";

type Documento = {
  id: string;
  cliente_id: string;
  tipo: string | null;
  nombre: string | null;
  estatus: string | null;
  url: string | null;
  created_at: string | null;
  clientes?: { nombre: string | null; email: string | null } | null;
};

export default function DocumentosClient({ documentos }: { documentos: Documento[] }) {
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return documentos;
    return documentos.filter((d) => {
      const hay =
        (d.tipo || "").toLowerCase().includes(s) ||
        (d.nombre || "").toLowerCase().includes(s) ||
        (d.estatus || "").toLowerCase().includes(s) ||
        (d.clientes?.nombre || "").toLowerCase().includes(s) ||
        (d.clientes?.email || "").toLowerCase().includes(s) ||
        (d.cliente_id || "").toLowerCase().includes(s);
      return hay;
    });
  }, [documentos, q]);

  const input: CSSProperties = {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.06)",
    color: COLORS.text,
    outline: "none",
  };

  const tag = (estatus?: string | null) => {
    const v = (estatus || "pendiente").toLowerCase();
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
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por tipo, estatus, cliente, email o cliente_id..." style={input} />
        <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 900 }}>{rows.length} resultados</div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {rows.map((d) => (
          <div
            key={d.id}
            style={{
              border: `1px solid ${COLORS.border}`,
              borderRadius: 14,
              padding: 12,
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
              <div>
                <div style={{ fontWeight: 950, color: COLORS.white }}>
                  {(d.tipo || "documento").toUpperCase()}{" "}
                  <span style={{ color: COLORS.muted, fontWeight: 800, fontSize: 12 }}>
                    {d.nombre ? `— ${d.nombre}` : ""}
                  </span>
                </div>

                <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 4 }}>
                  Cliente: {d.clientes?.nombre || "-"} {d.clientes?.email ? `— ${d.clientes.email}` : ""}
                </div>
                <div style={{ color: COLORS.muted, fontSize: 12 }}>cliente_id: {d.cliente_id}</div>
                <div style={{ color: COLORS.muted, fontSize: 12 }}>id: {d.id}</div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                <span style={tag(d.estatus)}>{d.estatus || "pendiente"}</span>
                {d.url ? (
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: "8px 10px",
                      borderRadius: 12,
                      border: `1px solid ${COLORS.border}`,
                      background: "rgba(255,255,255,0.06)",
                      color: COLORS.white,
                      fontWeight: 900,
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Ver
                  </a>
                ) : (
                  <span style={{ color: COLORS.muted, fontSize: 12 }}>Sin URL</span>
                )}
              </div>
            </div>
          </div>
        ))}

        {!rows.length ? <div style={{ color: COLORS.muted }}>Sin resultados.</div> : null}
      </div>
    </div>
  );
}