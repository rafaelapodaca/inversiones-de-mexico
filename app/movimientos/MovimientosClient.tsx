"use client";

import type { CSSProperties } from "react";
import { useActionState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import Link from "next/link";

// ✅ Este archivo está en app/movimientos/, theme está en app/lib/theme.ts
import { COLORS, SHADOW } from "../lib/theme";

import { solicitarAportacion, solicitarRetiro, type State } from "./actions";

type ClienteMini = { id: string; nombre: string };

type Mov = {
  id: string;
  fecha: string;
  tipo: string;
  monto: number;
  nota: string | null;
  created_at: string | null;
};

type Sol = {
  id: string;
  created_at: string | null;
  tipo: "aportacion" | "retiro";
  monto: number;
  status: "recibida" | "en_revision" | "aprobada" | "pagada" | "rechazada";
  folio: string | null;
  referencia: string | null;
  comprobante_url: string | null;
  nota_cliente: string | null;
  nota_admin: string | null;
};

const initialState: State = { ok: false, message: "" };

// ✅ helper robusto: agrega/actualiza cliente_id sin duplicarlo
function addOrReplaceClienteId(path: string, clienteId: string) {
  if (!clienteId) return path;

  const [base, qs = ""] = path.split("?");
  const params = new URLSearchParams(qs);

  params.set("cliente_id", clienteId);

  const q = params.toString();
  return q ? `${base}?${q}` : base;
}

function SubmitButton({ children, style }: { children: string; style: CSSProperties }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{ ...style, opacity: pending ? 0.65 : 1, cursor: pending ? "not-allowed" : "pointer" }}
    >
      {pending ? "Enviando..." : children}
    </button>
  );
}

function Banner({ state }: { state: State }) {
  if (!state.message) return null;

  const okBg = "rgba(34,197,94,0.12)";
  const okBorder = "rgba(34,197,94,0.25)";
  const okText = "#86efac";

  const errBg = "rgba(239,68,68,0.12)";
  const errBorder = "rgba(239,68,68,0.25)";
  const errText = "#fca5a5";

  return (
    <div
      style={{
        marginTop: 10,
        padding: "10px 12px",
        borderRadius: 12,
        border: `1px solid ${state.ok ? okBorder : errBorder}`,
        background: state.ok ? okBg : errBg,
        color: state.ok ? okText : errText,
        fontWeight: 900,
        whiteSpace: "pre-wrap",
      }}
    >
      {state.message}
    </div>
  );
}

function fmtMoney(n: number) {
  try {
    return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n || 0);
  } catch {
    return `$${(n || 0).toFixed(2)}`;
  }
}

function StatusPill({ s }: { s: Sol["status"] }) {
  const map: Record<string, { bg: string; border: string; text: string }> = {
    recibida: { bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.25)", text: "#bfdbfe" },
    en_revision: { bg: "rgba(234,179,8,0.12)", border: "rgba(234,179,8,0.25)", text: "#fde68a" },
    aprobada: { bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.25)", text: "#86efac" },
    pagada: { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", text: "#6ee7b7" },
    rechazada: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.25)", text: "#fca5a5" },
  };

  const c = map[s] || map.recibida;

  return (
    <span
      style={{
        padding: "6px 10px",
        borderRadius: 999,
        border: `1px solid ${c.border}`,
        background: c.bg,
        color: c.text,
        fontWeight: 900,
        fontSize: 12,
      }}
    >
      {s.replace("_", " ")}
    </span>
  );
}

export default function MovimientosClient({
  clienteId,
  clientes,
  movimientos,
  solicitudes,
}: {
  clienteId: string;
  clientes: ClienteMini[];
  movimientos: Mov[];
  solicitudes: Sol[];
}) {
  const router = useRouter();

  const [apState, apAction] = useActionState(solicitarAportacion, initialState);
  const [retState, retAction] = useActionState(solicitarRetiro, initialState);

  useEffect(() => {
    if (apState.ok || retState.ok) router.refresh();
  }, [apState.ok, retState.ok, router]);

  const withCid = (path: string) => addOrReplaceClienteId(path, clienteId);

  const page: CSSProperties = {
    minHeight: "100vh",
    background: COLORS.bg,
    color: COLORS.text,
    fontFamily: "system-ui",
    padding: 24,
    paddingBottom: 90,
  };

  const card: CSSProperties = {
    border: `1px solid ${COLORS.border}`,
    borderRadius: 16,
    padding: 16,
    background: COLORS.card,
    boxShadow: SHADOW,
  };

  const label: CSSProperties = { fontSize: 12, color: COLORS.white, fontWeight: 900, marginBottom: 6 };

  const input: CSSProperties = {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.06)",
    color: COLORS.text,
    outline: "none",
  };

  const btnPrimary: CSSProperties = {
    padding: "12px 14px",
    borderRadius: 14,
    border: `1px solid ${COLORS.primary}`,
    background: COLORS.primary,
    color: COLORS.white,
    fontWeight: 950,
  };

  const btnGhost: CSSProperties = {
    padding: "12px 14px",
    borderRadius: 14,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.06)",
    color: COLORS.text,
    fontWeight: 950,
    textDecoration: "none",
    display: "inline-block",
    whiteSpace: "nowrap",
  };

  const hr: CSSProperties = { border: "none", borderTop: `1px solid ${COLORS.border}`, margin: "12px 0" };

  const nombreCliente = useMemo(() => clientes.find((x) => x.id === clienteId)?.nombre, [clientes, clienteId]);

  return (
    <main style={page}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 950 }}>Movimientos</h1>
          <div style={{ marginTop: 6, color: COLORS.muted }}>
            {nombreCliente ? (
              <>
                Cliente: <b style={{ color: COLORS.white }}>{nombreCliente}</b>
              </>
            ) : (
              "Historial y solicitudes"
            )}
          </div>
        </div>

        {/* ✅ Inicio SIEMPRE /inicio + cliente_id */}
        <Link href={withCid("/inicio")} style={btnGhost}>
          ← Inicio
        </Link>
      </div>

      <section style={{ ...card, marginTop: 14 }}>
        <div style={{ fontWeight: 950, color: COLORS.white, marginBottom: 6 }}>Cliente</div>

        <select
          style={input}
          value={clienteId}
          onChange={(e) => router.push(addOrReplaceClienteId("/movimientos", e.target.value))}
        >
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </section>

      {/* HISTORIAL */}
      <section style={{ ...card, marginTop: 12 }}>
        <div style={{ fontWeight: 950, color: COLORS.white }}>Historial de transacciones</div>
        <div style={hr} />

        {movimientos.length ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ textAlign: "left", color: COLORS.white }}>
                  <th style={{ padding: "10px 8px" }}>Fecha</th>
                  <th style={{ padding: "10px 8px" }}>Tipo</th>
                  <th style={{ padding: "10px 8px" }}>Monto</th>
                  <th style={{ padding: "10px 8px" }}>Nota</th>
                </tr>
              </thead>
              <tbody>
                {movimientos.map((m) => (
                  <tr key={m.id} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                    <td style={{ padding: "10px 8px", color: COLORS.text }}>{m.fecha}</td>
                    <td style={{ padding: "10px 8px", color: COLORS.text }}>{m.tipo}</td>
                    <td style={{ padding: "10px 8px", color: COLORS.text, fontWeight: 900 }}>
                      {fmtMoney(Number(m.monto || 0))}
                    </td>
                    <td style={{ padding: "10px 8px", color: COLORS.muted }}>{m.nota || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ color: COLORS.muted }}>Aún no hay movimientos.</div>
        )}
      </section>

      {/* SOLICITUDES */}
      <section style={{ ...card, marginTop: 12 }}>
        <div style={{ fontWeight: 950, color: COLORS.white }}>Solicitudes (aportación / retiro)</div>
        <div style={hr} />

        {solicitudes.length ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ textAlign: "left", color: COLORS.white }}>
                  <th style={{ padding: "10px 8px" }}>Folio</th>
                  <th style={{ padding: "10px 8px" }}>Tipo</th>
                  <th style={{ padding: "10px 8px" }}>Monto</th>
                  <th style={{ padding: "10px 8px" }}>Estatus</th>
                  <th style={{ padding: "10px 8px" }}>Comprobante</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((s) => (
                  <tr key={s.id} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                    <td style={{ padding: "10px 8px", color: COLORS.text, fontWeight: 900 }}>{s.folio || "-"}</td>
                    <td style={{ padding: "10px 8px", color: COLORS.text }}>{s.tipo}</td>
                    <td style={{ padding: "10px 8px", color: COLORS.text, fontWeight: 900 }}>
                      {fmtMoney(Number(s.monto || 0))}
                    </td>
                    <td style={{ padding: "10px 8px" }}>
                      <StatusPill s={s.status} />
                    </td>
                    <td style={{ padding: "10px 8px" }}>
                      {s.comprobante_url ? (
                        <a
                          href={s.comprobante_url}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: COLORS.white, fontWeight: 900 }}
                        >
                          Ver
                        </a>
                      ) : (
                        <span style={{ color: COLORS.muted }}>-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ color: COLORS.muted }}>Aún no hay solicitudes.</div>
        )}
      </section>

      {/* SOLICITAR APORTACIÓN */}
      <section style={{ ...card, marginTop: 12 }}>
        <div style={{ fontWeight: 950, color: COLORS.white }}>Solicitar aportación</div>
        <div style={hr} />

        <div style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.6 }}>
          Instrucciones (MVP): realiza la transferencia y coloca tu referencia. Nosotros la validamos y la aplicamos.
        </div>

        <form action={apAction} style={{ marginTop: 12, display: "grid", gap: 10 }}>
          <input type="hidden" name="cliente_id" value={clienteId} />

          <div>
            <div style={label}>Monto</div>
            <input name="monto" type="number" step="0.01" placeholder="50000" style={input} required />
          </div>

          <div>
            <div style={label}>Referencia (opcional)</div>
            <input name="referencia" placeholder="REF-123 / SPEI / etc" style={input} />
          </div>

          <div>
            <div style={label}>Nota (opcional)</div>
            <input name="nota_cliente" placeholder="Detalle..." style={input} />
          </div>

          <SubmitButton style={btnPrimary}>Enviar solicitud</SubmitButton>
          <Banner state={apState} />
        </form>
      </section>

      {/* SOLICITAR RETIRO */}
      <section style={{ ...card, marginTop: 12 }}>
        <div style={{ fontWeight: 950, color: COLORS.white }}>Solicitar retiro</div>
        <div style={hr} />

        <div style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.6 }}>
          Reglas (MVP): se procesa en ventana de corte. Confirma que el retiro se envía a la <b>CLABE registrada</b>.
        </div>

        <form action={retAction} style={{ marginTop: 12, display: "grid", gap: 10 }}>
          <input type="hidden" name="cliente_id" value={clienteId} />

          <div>
            <div style={label}>Monto</div>
            <input name="monto" type="number" step="0.01" placeholder="25000" style={input} required />
          </div>

          <div>
            <div style={label}>Confirmación</div>
            <select name="clabe_confirmada" style={input} defaultValue="no" required>
              <option value="no">No confirmado</option>
              <option value="si">Sí, a mi CLABE registrada</option>
            </select>
          </div>

          <div>
            <div style={label}>Nota (opcional)</div>
            <input name="nota_cliente" placeholder="Detalle..." style={input} />
          </div>

          <SubmitButton style={btnPrimary}>Enviar solicitud</SubmitButton>
          <Banner state={retState} />
        </form>
      </section>
    </main>
  );
}