"use client";

import type { CSSProperties } from "react";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { COLORS } from "../../lib/theme";
import { cargarMovimientosCsv, type State } from "../actions";

type Cliente = { id: string; nombre: string };
const initialState: State = { ok: false, message: "" };

function Banner({ state }: { state: State }) {
  if (!state.message) return null;
  return (
    <div
      style={{
        marginBottom: 12,
        padding: "10px 12px",
        borderRadius: 12,
        border: `1px solid ${state.ok ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
        background: state.ok ? "rgba(34,197,94,0.10)" : "rgba(239,68,68,0.10)",
        color: state.ok ? "#86efac" : "#fca5a5",
        fontWeight: 900,
        whiteSpace: "pre-wrap",
      }}
    >
      {state.message}
    </div>
  );
}

export default function MovimientosCsvClient({ clientes }: { clientes: Cliente[] }) {
  const router = useRouter();
  const [state, action] = useActionState(cargarMovimientosCsv, initialState);

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  const input: CSSProperties = {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.06)",
    color: "white",
    outline: "none",
  };

  const btn: CSSProperties = {
    padding: "12px 14px",
    borderRadius: 14,
    border: `1px solid ${COLORS.border}`,
    background: COLORS.primary,
    color: "white",
    fontWeight: 950,
    cursor: "pointer",
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Banner state={state} />

      <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 900 }}>
        CSV esperado: columnas <b>fecha, tipo, monto, nota</b> (separador , o ;). Ejemplo fecha: 2026-01-20
      </div>

      <form action={action} style={{ display: "grid", gap: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 900, marginBottom: 6 }}>Admin password</div>
            <input name="admin_pass" type="password" placeholder="********" style={input} required />
          </div>

          <div>
            <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 900, marginBottom: 6 }}>Cliente</div>
            <select name="cliente_id" style={input} defaultValue="" required>
              <option value="" disabled>Selecciona cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 900, marginBottom: 6 }}>Archivo CSV</div>
          <input name="file" type="file" accept=".csv,text/csv" style={input} required />
        </div>

        <button type="submit" style={btn}>Cargar CSV</button>
      </form>
    </div>
  );
}
