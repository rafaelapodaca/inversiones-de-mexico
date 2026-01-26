"use client";

import type { CSSProperties } from "react";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { COLORS } from "../../lib/theme";
import { crearDocumento, type State } from "../actions";

type Cliente = { id: string; nombre: string };
type Doc = { id: string; cliente_id: string; tipo: string; titulo: string; url: string; created_at: string };

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
      }}
    >
      {state.message}
    </div>
  );
}

export default function DocumentosClient({ clientes, docs }: { clientes: Cliente[]; docs: Doc[] }) {
  const router = useRouter();
  const [state, action] = useActionState(crearDocumento, initialState);

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  const input: CSSProperties = {
    width: "100%",
    padding: 10,
    borderRadius: 12,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.06)",
    color: "white",
    outline: "none",
  };

  const btn: CSSProperties = {
    padding: "10px 12px",
    borderRadius: 12,
    border: `1px solid ${COLORS.border}`,
    background: COLORS.primary,
    color: "white",
    fontWeight: 950,
    cursor: "pointer",
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Banner state={state} />

      <form action={action} style={{ display: "grid", gap: 10, padding: 12, borderRadius: 14, border: `1px solid ${COLORS.border}`, background: "rgba(255,255,255,0.04)" }}>
        <div style={{ fontWeight: 950, color: "white" }}>Registrar documento</div>

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

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 900, marginBottom: 6 }}>Tipo</div>
            <select name="tipo" style={input} defaultValue="" required>
              <option value="" disabled>Selecciona tipo</option>
              <option value="estado_cuenta">estado_cuenta</option>
              <option value="contrato">contrato</option>
              <option value="anexo">anexo</option>
              <option value="comunicado">comunicado</option>
              <option value="fiscal">fiscal</option>
              <option value="factsheet">factsheet</option>
              <option value="kid">kid</option>
            </select>
          </div>

          <div>
            <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 900, marginBottom: 6 }}>Título</div>
            <input name="titulo" placeholder="Estado de cuenta Dic 2025" style={input} required />
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 900, marginBottom: 6 }}>URL</div>
          <input name="url" placeholder="/documentos/estado-cuenta-dic-2025.pdf" style={input} required />
          <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 6 }}>
            Tip: si lo guardas en <b>public/documentos</b>, la URL es <b>/documentos/archivo.pdf</b>
          </div>
        </div>

        <button type="submit" style={btn}>Guardar</button>
      </form>

      <div style={{ display: "grid", gap: 10 }}>
        {docs.map((d) => (
          <div key={d.id} style={{ padding: 12, borderRadius: 14, border: `1px solid ${COLORS.border}`, background: "rgba(255,255,255,0.04)" }}>
            <div style={{ fontWeight: 950, color: "white" }}>{d.titulo}</div>
            <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 6 }}>
              {d.tipo} · {new Date(d.created_at).toLocaleDateString("es-MX")}
            </div>
            <a href={d.url} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: 10, color: "white", fontWeight: 900 }}>
              Abrir
            </a>
          </div>
        ))}
        {!docs.length ? <div style={{ color: COLORS.muted }}>Sin documentos.</div> : null}
      </div>
    </div>
  );
}
