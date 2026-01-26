"use client";

import type { CSSProperties } from "react";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { COLORS } from "../../lib/theme";
import { setOnboardingStatus, type State } from "../actions";

type Cliente = {
  id: string;
  nombre: string;
  email: string | null;
  onboarding_status: string;
  onboarding_notas: string | null;
  validated_at: string | null;
};

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

export default function ClientesOnboardingClient({ clientes }: { clientes: Cliente[] }) {
  const router = useRouter();
  const [state, action] = useActionState(setOnboardingStatus, initialState);

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  const row: CSSProperties = {
    padding: 12,
    borderRadius: 14,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.04)",
    display: "grid",
    gap: 10,
  };

  const pill = (s: string): CSSProperties => ({
    padding: "6px 10px",
    borderRadius: 999,
    border: `1px solid ${COLORS.border}`,
    background: s === "validado" ? "rgba(34,197,94,0.18)" : "rgba(255,255,255,0.06)",
    color: "white",
    fontWeight: 950,
    fontSize: 12,
    width: "fit-content",
  });

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
    background: "rgba(255,255,255,0.06)",
    color: "white",
    fontWeight: 950,
    cursor: "pointer",
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Banner state={state} />

      {clientes.map((c) => (
        <div key={c.id} style={row}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
            <div>
              <div style={{ fontWeight: 950, color: "white" }}>
                {c.nombre}{" "}
                <span style={{ color: COLORS.muted, fontWeight: 800 }}>
                  — {c.email ?? "sin email"}
                </span>
              </div>
              <div style={{ marginTop: 6, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <span style={pill(c.onboarding_status || "pendiente")}>
                  {c.onboarding_status || "pendiente"}
                </span>
                <span style={{ fontSize: 12, color: COLORS.muted }}>
                  {c.validated_at ? `Validado: ${new Date(c.validated_at).toLocaleDateString("es-MX")}` : ""}
                </span>
              </div>
              <div style={{ marginTop: 6, fontSize: 12, color: COLORS.muted }}>ID: {c.id}</div>
            </div>

            <a
              href={`/admin/cliente/${c.id}`}
              style={{ ...btn, textDecoration: "none", display: "inline-block", textAlign: "center" }}
            >
              Ver en Admin
            </a>
          </div>

          <form action={action} style={{ display: "grid", gap: 10 }}>
            <input type="hidden" name="cliente_id" value={c.id} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 900, marginBottom: 6 }}>
                  Admin password
                </div>
                <input name="admin_pass" type="password" placeholder="********" style={input} required />
              </div>

              <div>
                <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 900, marginBottom: 6 }}>
                  Status
                </div>
                <select name="status" defaultValue={c.onboarding_status || "pendiente"} style={input}>
                  <option value="pendiente">pendiente</option>
                  <option value="validado">validado</option>
                </select>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 900, marginBottom: 6 }}>Notas</div>
              <input name="onboarding_notas" defaultValue={c.onboarding_notas ?? ""} placeholder="Notas..." style={input} />
            </div>

            <button type="submit" style={btn}>
              Guardar
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}
