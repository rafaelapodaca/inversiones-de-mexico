"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { COLORS } from "../../lib/theme";

type Cliente = { id: string; nombre: string };

export default function MovimientosCsvClient({ clientes }: { clientes: Cliente[] }) {
  const [clienteId, setClienteId] = useState<string>("");
  const [csvText, setCsvText] = useState<string>("");

  const input: CSSProperties = {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.06)",
    color: COLORS.text,
    outline: "none",
  };

  const textarea: CSSProperties = {
    ...input,
    minHeight: 180,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSize: 12,
  };

  const hint: CSSProperties = { color: COLORS.muted, fontSize: 12, marginTop: 8, whiteSpace: "pre-wrap" };

  const selected = useMemo(() => clientes.find((c) => c.id === clienteId) || null, [clientes, clienteId]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div>
        <div style={{ fontWeight: 950, color: COLORS.white, marginBottom: 6 }}>Cliente</div>
        <select value={clienteId} onChange={(e) => setClienteId(e.target.value)} style={input}>
          <option value="">Selecciona un cliente…</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
        {selected ? <div style={hint}>Seleccionado: {selected.nombre}</div> : <div style={hint}>Elige un cliente para asociar la carga.</div>}
      </div>

      <div>
        <div style={{ fontWeight: 950, color: COLORS.white, marginBottom: 6 }}>CSV (pegar aquí)</div>
        <textarea
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          placeholder={`fecha,tipo,monto,nota\n2026-01-01,Aportación,10000,Inicio\n2026-01-15,Retiro,5000,Parcial`}
          style={textarea}
        />
        <div style={hint}>
          Este componente es UI (client). Aquí normalmente parseas CSV y llamas una Server Action.
          {"\n"}Por ahora solo evita errores de build en Vercel.
        </div>
      </div>
    </div>
  );
}