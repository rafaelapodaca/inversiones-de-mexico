"use client";

import type { CSSProperties } from "react";
import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { COLORS, SHADOW } from "../lib/theme";
import {
  actualizarCuenta,
  agregarMovimiento,
  crearCliente,
  actualizarCliente,
  crearAccesoCliente,
  guardarBeneficiarios,
} from "./actions";

type ClienteLite = {
  id: string;
  nombre: string;
  email: string | null;
  telefono: string | null;
  clabe: string | null;
  banco?: string | null;
  agente_captacion?: string | null;
  created_at: string | null;
  rfc?: string | null;
  direccion?: string | null;
};

type State = { ok: boolean; message: string };
const initialState: State = { ok: false, message: "" };

function money(n: number) {
  const safe = Number.isFinite(n) ? n : 0;
  return safe.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}

/** Acepta 2 o 0.02 y lo convierte a decimal (0.02). */
function parsePctToDecimal(input: string) {
  const n = Number(input || 0);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return n > 1 ? n / 100 : n;
}

function SubmitButton({
  children,
  disabled,
  style,
}: {
  children: string;
  disabled?: boolean;
  style: CSSProperties;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      style={{
        ...style,
        opacity: pending || disabled ? 0.65 : 1,
        cursor: pending || disabled ? "not-allowed" : "pointer",
      }}
    >
      {pending ? "Guardando..." : children}
    </button>
  );
}

function Banner({ state }: { state: State }) {
  if (!state.message) return null;

  const okBg = "rgba(34,197,94,0.10)";
  const okBorder = "rgba(34,197,94,0.25)";
  const okText = "#86efac";

  const errBg = "rgba(239,68,68,0.10)";
  const errBorder = "rgba(239,68,68,0.25)";
  const errText = "#fca5a5";

  return (
    <div
      style={{
        marginBottom: 10,
        padding: "10px 12px",
        borderRadius: 12,
        border: `1px solid ${state.ok ? okBorder : errBorder}`,
        background: state.ok ? okBg : errBg,
        color: state.ok ? okText : errText,
        fontWeight: 800,
        whiteSpace: "pre-wrap",
      }}
    >
      {state.message}
    </div>
  );
}

function ErrorBanner({ msg }: { msg: string }) {
  if (!msg) return null;
  return (
    <div
      style={{
        marginTop: 12,
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid rgba(239,68,68,0.25)",
        background: "rgba(239,68,68,0.10)",
        color: "#fca5a5",
        fontWeight: 900,
        whiteSpace: "pre-wrap",
      }}
    >
      Error cargando clientes (Supabase): {msg}
    </div>
  );
}

type TabKey =
  | "clientes"
  | "crear"
  | "editar"
  | "acceso"
  | "saldo"
  | "movimiento"
  | "beneficiarios";

export default function AdminClient({
  clientes,
  errorMsg = "",
}: {
  clientes: ClienteLite[];
  errorMsg?: string;
}) {
  const router = useRouter();
  const hasClientes = clientes.length > 0;

  const [tab, setTab] = useState<TabKey>("clientes");

  const [createState, createAction] = useActionState(crearCliente, initialState);
  const [editState, editAction] = useActionState(actualizarCliente, initialState);
  const [accessState, accessAction] = useActionState(crearAccesoCliente, initialState);
  const [saldoState, saldoAction] = useActionState(actualizarCuenta, initialState);
  const [movState, movAction] = useActionState(agregarMovimiento, initialState);
  const [benState, benAction] = useActionState(guardarBeneficiarios, initialState);

  useEffect(() => {
    if (
      createState.ok ||
      editState.ok ||
      accessState.ok ||
      saldoState.ok ||
      movState.ok ||
      benState.ok
    ) {
      router.refresh();
    }
  }, [
    createState.ok,
    editState.ok,
    accessState.ok,
    saldoState.ok,
    movState.ok,
    benState.ok,
    router,
  ]);

  // ---- estilos base
  const page: CSSProperties = {
    minHeight: "100vh",
    background: COLORS.bg,
    color: COLORS.text,
    fontFamily: "system-ui",
    padding: 24,
    paddingBottom: 90,
  };

  const topBar: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 12,
  };

  const card: CSSProperties = {
    border: `1px solid ${COLORS.border}`,
    borderRadius: 16,
    padding: 16,
    background: COLORS.card,
    boxShadow: SHADOW,
  };

  const sectionTitle: CSSProperties = {
    fontWeight: 950,
    marginBottom: 8,
    color: COLORS.white,
  };

  const label: CSSProperties = {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 6,
    fontWeight: 900,
  };

  const input: CSSProperties = {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.06)",
    color: COLORS.text,
    outline: "none",
  };

  const buttonPrimary: CSSProperties = {
    padding: "12px 14px",
    borderRadius: 14,
    border: `1px solid ${COLORS.primary}`,
    background: COLORS.primary,
    color: COLORS.white,
    fontWeight: 950,
  };

  const buttonGhost: CSSProperties = {
    padding: "12px 14px",
    borderRadius: 14,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.06)",
    color: COLORS.white,
    fontWeight: 950,
    textDecoration: "none",
    display: "inline-block",
    height: "fit-content",
    whiteSpace: "nowrap",
  };

  const hr: CSSProperties = {
    border: "none",
    borderTop: `1px solid ${COLORS.border}`,
    margin: "12px 0",
  };

  // ---- tabs UI
  const tabWrap: CSSProperties = {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 12,
  };

  const tabBtn = (active: boolean): CSSProperties => ({
    padding: "10px 12px",
    borderRadius: 999,
    border: `1px solid ${active ? COLORS.primary : COLORS.border}`,
    background: active ? "rgba(11,45,92,0.35)" : "rgba(255,255,255,0.06)",
    color: COLORS.white,
    fontWeight: 900,
    cursor: "pointer",
    userSelect: "none",
  });

  const pill: CSSProperties = {
    padding: "6px 10px",
    borderRadius: 999,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.06)",
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: 900,
    width: "fit-content",
  };

  const adminBadge: CSSProperties = {
    padding: "10px 12px",
    borderRadius: 999,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.06)",
    color: COLORS.muted,
    fontWeight: 950,
    whiteSpace: "nowrap",
  };

  // ---- Crear cliente: proyección
  const [cSaldo, setCSaldo] = useState<string>("");
  const [cMeses, setCMeses] = useState<string>("12");
  const [cPct, setCPct] = useState<string>("2");

  const createProjection = useMemo(() => {
    const capital = Number(cSaldo || 0);
    const meses = Math.max(0, Math.floor(Number(cMeses || 0)));
    const r = parsePctToDecimal(cPct);
    const gananciaSimple = capital * r * meses;
    const finalSimple = capital + gananciaSimple;
    return { capital, meses, r, gananciaSimple, finalSimple };
  }, [cSaldo, cMeses, cPct]);

  // ---- Actualizar saldo: proyección
  const [sClienteId, setSClienteId] = useState<string>("");
  const [sSaldo, setSSaldo] = useState<string>("");
  const [sMeses, setSMeses] = useState<string>("");
  const [sPct, setSPct] = useState<string>("");

  const saldoProjection = useMemo(() => {
    const capital = Number(sSaldo || 0);
    const meses = Math.max(0, Math.floor(Number(sMeses || 0)));
    const r = parsePctToDecimal(sPct);
    const gananciaSimple = capital * r * meses;
    const finalSimple = capital + gananciaSimple;
    return { capital, meses, r, gananciaSimple, finalSimple };
  }, [sSaldo, sMeses, sPct]);

  // ---- Movimiento
  const [mClienteId, setMClienteId] = useState<string>("");

  // ---- Editar cliente
  const [eClienteId, setEClienteId] = useState<string>("");

  // ---- Acceso
  const [aClienteId, setAClienteId] = useState<string>("");

  // ---- Beneficiarios (FIX: controlado)
  const [bClienteId, setBClienteId] = useState<string>("");

  return (
    <main style={page}>
      <div style={topBar}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 950, margin: 0, color: COLORS.white }}>
            Admin
          </h1>
          <p style={{ marginTop: 6, marginBottom: 0, color: COLORS.muted }}>
            Panel por secciones (tabs).
          </p>
        </div>

        <div style={adminBadge}>Modo Admin</div>
      </div>

      <ErrorBanner msg={errorMsg} />

      {/* TABS */}
      <div style={tabWrap}>
        <button style={tabBtn(tab === "clientes")} onClick={() => setTab("clientes")} type="button">
          Clientes
        </button>
        <button style={tabBtn(tab === "crear")} onClick={() => setTab("crear")} type="button">
          Crear cliente
        </button>
        <button style={tabBtn(tab === "editar")} onClick={() => setTab("editar")} type="button">
          Editar cliente
        </button>
        <button style={tabBtn(tab === "acceso")} onClick={() => setTab("acceso")} type="button">
          Crear acceso
        </button>
        <button style={tabBtn(tab === "saldo")} onClick={() => setTab("saldo")} type="button">
          Actualizar saldo
        </button>
        <button style={tabBtn(tab === "movimiento")} onClick={() => setTab("movimiento")} type="button">
          Agregar movimiento
        </button>
        <button style={tabBtn(tab === "beneficiarios")} onClick={() => setTab("beneficiarios")} type="button">
          Beneficiarios
        </button>
      </div>

      <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
        {/* 1) CLIENTES */}
        {tab === "clientes" && (
          <section style={card}>
            <div style={sectionTitle}>Clientes</div>
            <div style={hr} />

            {hasClientes ? (
              <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
                {clientes.map((c) => (
                  <li key={c.id} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                      <div>
                        <b style={{ color: COLORS.white }}>{c.nombre}</b>{" "}
                        — <span style={{ color: COLORS.muted }}>{c.email || "sin email"}</span>

                        <div style={{ fontSize: 12, color: COLORS.muted }}>
                          Tel: {c.telefono || "-"} | Banco: {c.banco || "-"} | CLABE/Cuenta: {c.clabe || "-"}
                        </div>

                        <div style={{ fontSize: 12, color: COLORS.muted }}>
                          Captación: {c.agente_captacion || "-"}
                        </div>

                        <div style={{ fontSize: 12, color: COLORS.muted }}>ID: {c.id}</div>

                        <div style={{ marginTop: 8, display: "flex", gap: 10, flexWrap: "wrap" }}>
                          {/* ✅ FIX: encodeURIComponent */}
                          <a href={`/admin/cliente/${encodeURIComponent(c.id)}`} style={buttonGhost}>
                            Editar
                          </a>
                          <a href={`/perfil?cliente_id=${encodeURIComponent(c.id)}`} style={buttonGhost}>
                            Perfil
                          </a>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ color: COLORS.muted }}>
                {errorMsg ? "No se pudieron cargar clientes." : "Aún no hay clientes."}
              </div>
            )}
          </section>
        )}

        {/* 2) CREAR CLIENTE */}
        {tab === "crear" && (
          <section style={card}>
            <div style={sectionTitle}>Crear cliente (alta completa)</div>
            <div style={hr} />
            <Banner state={createState} />

            <form action={createAction} style={{ display: "grid", gap: 12 }}>
              <div>
                <div style={label}>Admin password</div>
                <input name="admin_pass" type="password" placeholder="********" style={input} required />
              </div>

              <div>
                <div style={label}>Nombre</div>
                <input name="nombre" placeholder="Cliente" style={input} required />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <div style={label}>Email (opcional)</div>
                  <input name="email" placeholder="cliente@email.com" style={input} />
                </div>
                <div>
                  <div style={label}>Teléfono (opcional)</div>
                  <input name="telefono" placeholder="668..." style={input} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <div style={label}>Banco (opcional)</div>
                  <input name="banco" placeholder="BANORTE / BBVA / etc" style={input} />
                  <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 6 }}>
                    Nota: si tu backend no guarda banco aún, se ignorará.
                  </div>
                </div>
                <div>
                  <div style={label}>CLABE / Cuenta (opcional)</div>
                  <input name="clabe" placeholder="**** **** **** 1234" style={input} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <div style={label}>RFC (opcional)</div>
                  <input name="rfc" placeholder="RFC" style={input} />
                </div>
                <div>
                  <div style={label}>Dirección (opcional)</div>
                  <input name="direccion" placeholder="Dirección" style={input} />
                </div>
              </div>

              <div>
                <div style={label}>Agente de captación (opcional)</div>
                <input name="agente_captacion" placeholder="Nombre del agente" style={input} />
                <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 6 }}>
                  Nota: si tu backend no guarda captación aún, se ignorará.
                </div>
              </div>

              <div style={{ fontWeight: 950, color: COLORS.white }}>Plan / Proyección (MVP)</div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
                <div>
                  <div style={label}>Capital (saldo)</div>
                  <input
                    name="saldo"
                    type="number"
                    step="0.01"
                    placeholder="0"
                    style={input}
                    value={cSaldo}
                    onChange={(e) => setCSaldo(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <div>
                  <div style={label}>Meses de inversión</div>
                  <input
                    name="meses_inversion"
                    type="number"
                    step="1"
                    placeholder="12"
                    style={input}
                    value={cMeses}
                    onChange={(e) => setCMeses(e.target.value)}
                  />
                </div>

                <div>
                  <div style={label}>Utilidad mensual (2 ó 0.02)</div>
                  <input
                    name="utilidad_mensual"
                    type="number"
                    step="0.01"
                    placeholder="2"
                    style={input}
                    value={cPct}
                    onChange={(e) => setCPct(e.target.value)}
                  />
                  <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 6 }}>
                    Ej: 2% escribe <b>2</b> o <b>0.02</b>.
                  </div>
                </div>

                <div>
                  <div style={label}>Fecha inicio</div>
                  <input name="fecha_inicio" type="date" style={input} />
                </div>
              </div>

              <div
                style={{
                  borderRadius: 16,
                  border: `1px solid ${COLORS.border}`,
                  background: "rgba(255,255,255,0.04)",
                  padding: 14,
                }}
              >
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={pill}>Proyección (MVP)</div>
                  <div style={{ color: COLORS.muted, fontSize: 12, fontWeight: 900 }}>
                    Con saldo + utilidad mensual + meses
                  </div>
                </div>

                <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div style={{ padding: 12, borderRadius: 14, border: `1px solid ${COLORS.border}`, background: "rgba(0,0,0,0.14)" }}>
                      <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 900 }}>Capital</div>
                      <div style={{ marginTop: 6, fontWeight: 950, color: COLORS.white }}>
                        {money(createProjection.capital)}
                      </div>
                    </div>

                    <div style={{ padding: 12, borderRadius: 14, border: `1px solid ${COLORS.border}`, background: "rgba(0,0,0,0.14)" }}>
                      <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 900 }}>Parámetros</div>
                      <div style={{ marginTop: 6, fontWeight: 950, color: COLORS.white }}>
                        {createProjection.meses || 0} meses · {(createProjection.r * 100).toFixed(2)}% mensual
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: 12, borderRadius: 14, border: `1px solid ${COLORS.border}`, background: "rgba(255,255,255,0.03)" }}>
                    <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 900 }}>Proyección simple (lineal)</div>
                    <div style={{ marginTop: 6, fontWeight: 950, color: COLORS.white }}>
                      Ganancia: {money(createProjection.gananciaSimple)}
                    </div>
                    <div style={{ marginTop: 6, color: COLORS.muted }}>
                      Final: <b style={{ color: COLORS.white }}>{money(createProjection.finalSimple)}</b>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ fontWeight: 950, color: COLORS.white }}>Beneficiarios (máximo 3)</div>

              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  style={{
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 16,
                    padding: 12,
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  <div style={{ fontWeight: 950, color: COLORS.white, marginBottom: 10 }}>
                    Beneficiario #{n}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div>
                      <div style={label}>Nombre</div>
                      <input name={`b${n}_nombre`} placeholder="Nombre completo" style={input} />
                    </div>

                    <div>
                      <div style={label}>Parentesco</div>
                      <input name={`b${n}_parentesco`} placeholder="Ej: Esposa, Hijo, Padre" style={input} />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
                    <div>
                      <div style={label}>Teléfono</div>
                      <input name={`b${n}_telefono`} placeholder="668..." style={input} />
                    </div>

                    <div>
                      <div style={label}>Email</div>
                      <input name={`b${n}_email`} placeholder="correo@ejemplo.com" style={input} />
                    </div>
                  </div>

                  <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 8 }}>
                    Nota: estos beneficiarios se guardarán solo si tu backend los procesa en crearCliente.
                  </div>
                </div>
              ))}

              <SubmitButton style={buttonPrimary}>Guardar cliente (alta completa)</SubmitButton>
            </form>
          </section>
        )}

        {/* 3) EDITAR CLIENTE */}
        {tab === "editar" && (
          <section style={card}>
            <div style={sectionTitle}>Editar cliente (rápido)</div>
            <div style={hr} />
            <Banner state={editState} />

            <form action={editAction} style={{ display: "grid", gap: 12 }}>
              <div>
                <div style={label}>Admin password</div>
                <input name="admin_pass" type="password" placeholder="********" style={input} required />
              </div>

              <div>
                <div style={label}>Cliente</div>
                <select
                  name="cliente_id"
                  style={input}
                  value={eClienteId}
                  onChange={(e) => setEClienteId(e.target.value)}
                  required
                  disabled={!hasClientes}
                >
                  <option value="" disabled>
                    {hasClientes ? "Selecciona cliente" : "Primero crea un cliente"}
                  </option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div style={label}>Nombre</div>
                <input name="nombre" placeholder="Nombre" style={input} required />
                <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 6 }}>
                  Tip: en esta fase no hacemos prefill; escribe el valor final que quieres guardar.
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <div style={label}>Email</div>
                  <input name="email" placeholder="cliente@email.com" style={input} />
                </div>
                <div>
                  <div style={label}>Teléfono</div>
                  <input name="telefono" placeholder="668..." style={input} />
                </div>
              </div>

              <div>
                <div style={label}>CLABE / Cuenta</div>
                <input name="clabe" placeholder="**** **** **** 1234" style={input} />
              </div>

              <SubmitButton style={buttonPrimary} disabled={!hasClientes}>
                Guardar cambios
              </SubmitButton>
            </form>
          </section>
        )}

        {/* 4) CREAR ACCESO */}
        {tab === "acceso" && (
          <section style={card}>
            <div style={sectionTitle}>Crear acceso (usuario + contraseña)</div>
            <div style={hr} />
            <Banner state={accessState} />

            <form action={accessAction} style={{ display: "grid", gap: 12 }}>
              <div>
                <div style={label}>Admin password</div>
                <input name="admin_pass" type="password" placeholder="********" style={input} required />
              </div>

              <div>
                <div style={label}>Cliente</div>
                <select
                  name="cliente_id"
                  style={input}
                  value={aClienteId}
                  onChange={(e) => setAClienteId(e.target.value)}
                  required
                  disabled={!hasClientes}
                >
                  <option value="" disabled>
                    {hasClientes ? "Selecciona cliente" : "Primero crea un cliente"}
                  </option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div style={label}>Email (login)</div>
                <input name="email" placeholder="cliente@email.com" style={input} required />
              </div>

              <div>
                <div style={label}>Password (opcional)</div>
                <input name="password" placeholder="Si lo dejas vacío se genera" style={input} />
                <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 6 }}>
                  Si lo dejas vacío, el sistema genera uno y te lo muestra en el mensaje.
                </div>
              </div>

              <SubmitButton style={buttonPrimary} disabled={!hasClientes}>
                Crear acceso
              </SubmitButton>
            </form>
          </section>
        )}

        {/* 5) ACTUALIZAR SALDO */}
        {tab === "saldo" && (
          <section style={card}>
            <div style={sectionTitle}>Actualizar saldo + plan del cliente</div>
            <div style={hr} />
            <Banner state={saldoState} />

            <form action={saldoAction} style={{ display: "grid", gap: 12 }}>
              <div>
                <div style={label}>Admin password</div>
                <input name="admin_pass" type="password" placeholder="********" style={input} required />
              </div>

              <div>
                <div style={label}>Cliente</div>
                <select
                  name="cliente_id"
                  style={input}
                  value={sClienteId}
                  onChange={(e) => setSClienteId(e.target.value)}
                  required
                  disabled={!hasClientes}
                >
                  <option value="" disabled>
                    {hasClientes ? "Selecciona cliente" : "Primero crea un cliente"}
                  </option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* fila 1 (solo saldo) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
                <div>
                  <div style={label}>Saldo (capital)</div>
                  <input
                    name="saldo"
                    type="number"
                    step="0.01"
                    placeholder="1250000"
                    style={input}
                    required
                    value={sSaldo}
                    onChange={(e) => setSSaldo(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ fontWeight: 950, color: COLORS.white }}>Plan / Proyección</div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <div>
                  <div style={label}>Meses de inversión</div>
                  <input
                    name="meses_inversion"
                    type="number"
                    step="1"
                    placeholder="12"
                    style={input}
                    value={sMeses}
                    onChange={(e) => setSMeses(e.target.value)}
                  />
                </div>

                <div>
                  <div style={label}>Utilidad mensual (2 ó 0.02)</div>
                  <input
                    name="utilidad_mensual"
                    type="number"
                    step="0.01"
                    placeholder="2"
                    style={input}
                    value={sPct}
                    onChange={(e) => setSPct(e.target.value)}
                  />
                  <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 6 }}>
                    Ej: 2% escribe <b>2</b> o <b>0.02</b>.
                  </div>
                </div>

                <div>
                  <div style={label}>Fecha inicio</div>
                  <input name="fecha_inicio" type="date" style={input} />
                </div>
              </div>

              <div
                style={{
                  borderRadius: 16,
                  border: `1px solid ${COLORS.border}`,
                  background: "rgba(255,255,255,0.04)",
                  padding: 14,
                }}
              >
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={pill}>Proyección (MVP)</div>
                  <div style={{ color: COLORS.muted, fontSize: 12, fontWeight: 900 }}>
                    Con saldo + utilidad mensual + meses
                  </div>
                </div>

                <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div style={{ padding: 12, borderRadius: 14, border: `1px solid ${COLORS.border}`, background: "rgba(0,0,0,0.14)" }}>
                      <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 900 }}>Capital</div>
                      <div style={{ marginTop: 6, fontWeight: 950, color: COLORS.white }}>
                        {money(saldoProjection.capital)}
                      </div>
                    </div>

                    <div style={{ padding: 12, borderRadius: 14, border: `1px solid ${COLORS.border}`, background: "rgba(0,0,0,0.14)" }}>
                      <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 900 }}>Parámetros</div>
                      <div style={{ marginTop: 6, fontWeight: 950, color: COLORS.white }}>
                        {saldoProjection.meses || 0} meses · {(saldoProjection.r * 100).toFixed(2)}% mensual
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: 12, borderRadius: 14, border: `1px solid ${COLORS.border}`, background: "rgba(255,255,255,0.03)" }}>
                    <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 900 }}>Proyección simple (lineal)</div>
                    <div style={{ marginTop: 6, fontWeight: 950, color: COLORS.white }}>
                      Ganancia: {money(saldoProjection.gananciaSimple)}
                    </div>
                    <div style={{ marginTop: 6, color: COLORS.muted }}>
                      Final: <b style={{ color: COLORS.white }}>{money(saldoProjection.finalSimple)}</b>
                    </div>
                  </div>
                </div>
              </div>

              <SubmitButton style={buttonPrimary} disabled={!hasClientes}>
                Guardar saldo + plan
              </SubmitButton>
            </form>
          </section>
        )}

        {/* 6) AGREGAR MOVIMIENTO */}
        {tab === "movimiento" && (
          <section style={card}>
            <div style={sectionTitle}>Agregar movimiento</div>
            <div style={hr} />
            <Banner state={movState} />

            <form action={movAction} style={{ display: "grid", gap: 12 }}>
              <div>
                <div style={label}>Admin password</div>
                <input name="admin_pass" type="password" placeholder="********" style={input} required />
              </div>

              <div>
                <div style={label}>Cliente</div>
                <select
                  name="cliente_id"
                  style={input}
                  value={mClienteId}
                  onChange={(e) => setMClienteId(e.target.value)}
                  required
                  disabled={!hasClientes}
                >
                  <option value="" disabled>
                    {hasClientes ? "Selecciona cliente" : "Primero crea un cliente"}
                  </option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <div style={label}>Fecha</div>
                  <input name="fecha" type="date" style={input} required />
                </div>

                <div>
                  <div style={label}>Tipo</div>
                  <input name="tipo" placeholder="Depósito / Retiro / Rendimiento..." style={input} required />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <div style={label}>Monto</div>
                  <input name="monto" type="number" step="0.01" placeholder="0" style={input} required />
                </div>
                <div>
                  <div style={label}>Nota (opcional)</div>
                  <input name="nota" placeholder="Detalle..." style={input} />
                </div>
              </div>

              <SubmitButton style={buttonPrimary} disabled={!hasClientes}>
                Guardar movimiento
              </SubmitButton>
            </form>
          </section>
        )}

        {/* 7) BENEFICIARIOS */}
        {tab === "beneficiarios" && (
          <section style={card}>
            <div style={sectionTitle}>Beneficiarios (máximo 3)</div>
            <div style={hr} />
            <Banner state={benState} />

            <form action={benAction} style={{ display: "grid", gap: 12 }}>
              <div>
                <div style={label}>Admin password</div>
                <input name="admin_pass" type="password" placeholder="********" style={input} required />
              </div>

              <div>
                <div style={label}>Cliente</div>

                {/* ✅ FIX: CONTROLADO para evitar cliente_id vacío */}
                <select
                  name="cliente_id"
                  style={input}
                  value={bClienteId}
                  onChange={(e) => setBClienteId(e.target.value)}
                  required
                  disabled={!hasClientes}
                >
                  <option value="" disabled>
                    {hasClientes ? "Selecciona cliente" : "Primero crea un cliente"}
                  </option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  style={{
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 16,
                    padding: 12,
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  <div style={{ fontWeight: 950, color: COLORS.white, marginBottom: 10 }}>
                    Beneficiario #{n}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div>
                      <div style={label}>Nombre</div>
                      <input name={`b${n}_nombre`} placeholder="Nombre completo" style={input} />
                    </div>

                    <div>
                      <div style={label}>Parentesco</div>
                      <input name={`b${n}_parentesco`} placeholder="Ej: Esposa, Hijo, Padre" style={input} />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
                    <div>
                      <div style={label}>Teléfono</div>
                      <input name={`b${n}_telefono`} placeholder="668..." style={input} />
                    </div>

                    <div>
                      <div style={label}>Email</div>
                      <input name={`b${n}_email`} placeholder="correo@ejemplo.com" style={input} />
                    </div>
                  </div>

                  <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 8 }}>
                    Tip: si dejas <b>Nombre</b> vacío y guardas, ese beneficiario se elimina.
                  </div>
                </div>
              ))}

              <SubmitButton style={buttonPrimary} disabled={!hasClientes}>
                Guardar beneficiarios
              </SubmitButton>
            </form>
          </section>
        )}
      </div>
    </main>
  );
}