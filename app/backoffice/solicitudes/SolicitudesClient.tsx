"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { COLORS } from "../../lib/theme";

type Solicitud = {
  id: string;
  cliente_id: string;
  tipo: string;
  monto: number | null;
  status: string;
  nota: string | null;
  folio: string | null;
  comprobante_url: string | null;
  created_at: string;
  clientes?: { nombre: string; email: string | null } | null;
};

function money(n: number | null) {
  const v = Number.isFinite(Number(n)) ? Number(n) : 0;
  return v.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("es-MX");
}

export default function SolicitudesClient({ solicitudes }: { solicitudes: Solicitud[] }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("");

  const uniqueStatuses = useMemo(() => {
    const set = new Set<string>();
    (solicitudes || []).forEach((x) => {
      const v = String(x.status || "").trim();
      if (v) set.add(v);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [solicitudes]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (solicitudes || []).filter((x) => {
      const okStatus = status
        ? String(x.status || "").toLowerCase() === status.toLowerCase()
        : true;

      if (!s) return okStatus;

      const nombre = (x.clientes?.nombre || "").toLowerCase();
      const email = (x.clientes?.email || "").toLowerCase();
      const folio = (x.folio || "").toLowerCase();
      const tipo = (x.tipo || "").toLowerCase();
      const nota = (x.nota || "").toLowerCase();
      const id = (x.id || "").toLowerCase();

      const okText =
        nombre.includes(s) ||
        email.includes(s) ||
        folio.includes(s) ||
        tipo.includes(s) ||
        nota.includes(s) ||
        id.includes(s);

      return okStatus && okText;
    });
  }, [solicitudes, q, status]);

  const input: CSSProperties = {
    padding: 12,
    borderRadius: 12,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.06)",
    color: COLORS.text,
    outline: "none",
    minWidth: 260,
    flex: "1 1 260px",
  };

  const select: CSSProperties = {
    padding: 12,
    borderRadius: 12,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.06)",
    color: COLORS.text,
    outline: "none",
    minWidth: 200,
  };

  const cardRow: CSSProperties = {
    border: `1px solid ${COLORS.border}`,
    borderRadius: 14,
    padding: 12,
    background: "rgba(255,255,255,0.03)",
    display: "grid",
    gap: 6,
  };

  const muted: CSSProperties = { color: COLORS.muted, fontSize: 12, fontWeight: 800 };

  const statusPill = (s: string) => {
    const v = (s || "").toLowerCase();
    const ok = v === "aprobada" || v === "aprobado" || v === "pagada" || v === "completada";
    const bad = v === "rechazada" || v === "rechazado" || v === "cancelada";
    const pending = v === "pendiente" || v === "en_revision" || v === "en revisión" || v === "revision";

    return {
      display: "inline-flex",
      alignItems: "center",
      padding: "6px 10px",
      borderRadius: 999,
      border: `1px solid ${COLORS.border}`,
      background: ok
        ? "rgba(34,197,94,0.12)"
        : bad
        ? "rgba(239,68,68,0.12)"
        : pending
        ? "rgba(234,179,8,0.12)"
        : "rgba(255,255,255,0.06)",
      color: ok ? "#86efac" : bad ? "#fca5a5" : pending ? "#fde68a" : COLORS.text,
      fontSize: 12,
      fontWeight: 950,
      width: "fit-content",
      whiteSpace: "nowrap",
    } as CSSProperties;
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre, email, folio, tipo, nota, id..."
          style={input}
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)} style={select}>
          <option value="">Todos los status</option>
          {uniqueStatuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div style={{ ...muted, marginTop: 2 }}>
        Mostrando <b style={{ color: COLORS.white }}>{filtered.length}</b> de{" "}
        <b style={{ color: COLORS.white }}>{(solicitudes || []).length}</b>
      </div>

      {filtered.length ? (
        <div style={{ display: "grid", gap: 10 }}>
          {filtered.map((x) => (
            <div key={x.id} style={cardRow}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ fontWeight: 950, color: COLORS.white }}>{x.clientes?.nombre || "Cliente"}</div>
                <span style={statusPill(x.status)}>{x.status || "sin status"}</span>
                <div style={{ ...muted, marginLeft: "auto" }}>{fmtDate(x.created_at)}</div>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <div style={muted}>
                  Tipo: <b style={{ color: COLORS.white }}>{x.tipo || "-"}</b>
                </div>
                <div style={muted}>
                  Monto: <b style={{ color: COLORS.white }}>{money(x.monto)}</b>
                </div>
                <div style={muted}>
                  Folio: <b style={{ color: COLORS.white }}>{x.folio || "-"}</b>
                </div>
              </div>

              <div style={muted}>
                Email: <b style={{ color: COLORS.white }}>{x.clientes?.email || "-"}</b>
              </div>

              {x.nota ? (
                <div style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.5 }}>
                  <b style={{ color: COLORS.white }}>Nota:</b> {x.nota}
                </div>
              ) : null}

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
                {x.comprobante_url ? (
                  <a
                    href={x.comprobante_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: "10px 12px",
                      borderRadius: 12,
                      border: `1px solid ${COLORS.border}`,
                      background: "rgba(255,255,255,0.06)",
                      color: COLORS.white,
                      fontWeight: 950,
                      textDecoration: "none",
                    }}
                  >
                    Ver comprobante
                  </a>
                ) : (
                  <span style={{ ...muted }}>Sin comprobante</span>
                )}

                <span style={{ ...muted }}>
                  ID: <span style={{ color: COLORS.white }}>{x.id}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ color: COLORS.muted, padding: 12 }}>
          No hay solicitudes (o no hay coincidencias con tu búsqueda).
        </div>
      )}
    </div>
  );
}