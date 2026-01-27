"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { COLORS } from "../../lib/theme";

type Cliente = { id: string; nombre: string };

type Row = Record<string, string>;

export default function MovimientosCsvClient({ clientes }: { clientes: Cliente[] }) {
  const [clienteId, setClienteId] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string>("");

  const input: CSSProperties = {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.06)",
    color: COLORS.text,
    outline: "none",
  };

  const hint: CSSProperties = { color: COLORS.muted, fontSize: 12, fontWeight: 800 };

  function parseCsv(text: string): Row[] {
    const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").filter(Boolean);
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map((h) => h.trim());
    return lines.slice(1).map((ln) => {
      const cols = ln.split(",").map((c) => c.trim());
      const obj: Row = {};
      headers.forEach((h, i) => (obj[h] = cols[i] ?? ""));
      return obj;
    });
  }

  async function onFile(file: File | null) {
    setError("");
    setRows([]);
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = parseCsv(text);
      setRows(parsed);
      if (!parsed.length) setError("No pude leer el CSV (asegúrate de que tenga encabezados y al menos 1 fila).");
    } catch (e: any) {
      setError(e?.message || "Error leyendo CSV");
    }
  }

  const preview = useMemo(() => rows.slice(0, 15), [rows]);

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

  const button: CSSProperties = {
    padding: "12px 14px",
    borderRadius: 14,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.06)",
    color: COLORS.white,
    fontWeight: 950,
    cursor: "pointer",
  };

  const cols = rows.length ? Object.keys(rows[0]) : [];

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div>
          <div style={{ fontSize: 12, color: COLORS.white, fontWeight: 900, marginBottom: 6 }}>Cliente</div>
          <select value={clienteId} onChange={(e) => setClienteId(e.target.value)} style={input}>
            <option value="">Selecciona…</option>
            {(clientes ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
          <div style={{ marginTop: 6, ...hint }}>Para el MVP, esto solo es selección (no sube nada aún).</div>
        </div>

        <div>
          <div style={{ fontSize: 12, color: COLORS.white, fontWeight: 900, marginBottom: 6 }}>CSV</div>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            style={input}
          />
          <div style={{ marginTop: 6, ...hint }}>Encabezados esperados típicos: fecha,tipo,monto,nota</div>
        </div>
      </div>

      {error ? (
        <div
          style={{
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid rgba(239,68,68,0.25)",
            background: "rgba(239,68,68,0.10)",
            color: "#fca5a5",
            fontWeight: 900,
            whiteSpace: "pre-wrap",
          }}
        >
          {error}
        </div>
      ) : null}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ color: COLORS.muted, fontWeight: 900, fontSize: 12 }}>
          Filas leídas: <span style={{ color: COLORS.white }}>{rows.length}</span>
        </div>
        <button
          type="button"
          style={button}
          onClick={() => alert("Listo: aquí conectamos tu action server para guardar movimientos.")}
          disabled={!clienteId || !rows.length}
        >
          (MVP) Enviar a backend
        </button>
      </div>

      {rows.length ? (
        <div style={{ overflowX: "auto", borderRadius: 14, border: `1px solid ${COLORS.border}` }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {cols.map((c) => (
                  <th key={c} style={th}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.map((r, idx) => (
                <tr key={idx}>
                  {cols.map((c) => (
                    <td key={c} style={td}>
                      <span style={{ color: COLORS.text }}>{r[c] ?? ""}</span>
                    </td>
                  ))}
                </tr>
              ))}
              {rows.length > preview.length ? (
                <tr>
                  <td style={{ ...td, color: COLORS.muted }} colSpan={cols.length}>
                    … mostrando {preview.length} de {rows.length}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}