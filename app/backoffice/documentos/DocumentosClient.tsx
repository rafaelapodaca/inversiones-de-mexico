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
  const [estatus, setEstatus] = useState<string>("todos");

  const rows = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return (documentos ?? []).filter((d) => {
      const matchesQ =
        !qq ||
        String(d.nombre ?? "").toLowerCase().includes(qq) ||
        String(d.tipo ?? "").toLowerCase().includes(qq) ||
        String(d.cliente_id ?? "").toLowerCase().includes(qq) ||
        String(d.clientes?.nombre ?? "").toLowerCase().includes(qq) ||
        String(d.clientes?.email ?? "").toLowerCase().includes(qq);

      const st = String(d.estatus ?? "").toLowerCase();
      const matchesStatus = estatus === "todos" || st === estatus;

      return matchesQ && matchesStatus;
    });
  }, [documentos, q, estatus]);

  const allStatuses = useMemo(() => {
    const set = new Set<string>();
    (documentos ?? []).forEach((d) => {
      const s = String(d.estatus ?? "").trim().toLowerCase();
      if (s) set.add(s);
    });
    return ["todos", ...Array.from(set).sort()];
  }, [documentos]);

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

  const linkStyle: CSSProperties = { color: COLORS.primary, textDecoration: "none", fontWeight: 900 };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 10 }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar (cliente, email, tipo, nombre)…" style={input} />
        <select value={estatus} onChange={(e) => setEstatus(e.target.value)} style={input}>
          {allStatuses.map((s) => (
            <option key={s} value={s}>
              {s === "todos" ? "Todos" : s}
            </option>
          ))}
        </select>
      </div>

      <div style={{ overflowX: "auto", borderRadius: 14, border: `1px solid ${COLORS.border}` }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>Cliente</th>
              <th style={th}>Documento</th>
              <th style={th}>Estatus</th>
              <th style={th}>Fecha</th>
              <th style={th}>URL</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.id}>
                <td style={td}>
                  <div style={{ fontWeight: 950, color: COLORS.white }}>{d.clientes?.nombre || "—"}</div>
                  <div style={{ color: COLORS.muted, fontSize: 12 }}>{d.clientes?.email || "—"}</div>
                  <div style={{ color: COLORS.muted, fontSize: 12, fontFamily: "ui-monospace, SFMono-Regular" }}>
                    {d.cliente_id}
                  </div>
                </td>
                <td style={td}>
                  <div style={{ fontWeight: 950, color: COLORS.white }}>{d.tipo || "—"}</div>
                  <div style={{ color: COLORS.muted, fontSize: 12 }}>{d.nombre || "—"}</div>
                </td>
                <td style={td}>
                  <span style={{ color: COLORS.white, fontWeight: 900 }}>{d.estatus || "—"}</span>
                </td>
                <td style={td}>
                  <div style={{ color: COLORS.muted, fontSize: 12 }}>{d.created_at || "—"}</div>
                </td>
                <td style={td}>
                  {d.url ? (
                    <a href={d.url} target="_blank" rel="noreferrer" style={linkStyle}>
                      Ver
                    </a>
                  ) : (
                    <span style={{ color: COLORS.muted }}>—</span>
                  )}
                </td>
              </tr>
            ))}

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