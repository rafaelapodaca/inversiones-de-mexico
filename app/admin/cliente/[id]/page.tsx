import Link from "next/link";
import type { CSSProperties } from "react";
import { supabaseAdmin } from "../../../lib/supabase-admin";
import { actualizarCliente, crearAccesoCliente } from "../../actions";
import { COLORS, SHADOW } from "../../../lib/theme";

export const dynamic = "force-dynamic";

type State = { ok: boolean; message: string };
const initialState: State = { ok: false, message: "" };

async function actualizarClienteForm(formData: FormData) {
  "use server";
  await actualizarCliente(initialState, formData);
}

async function crearAccesoClienteForm(formData: FormData) {
  "use server";
  await crearAccesoCliente(initialState, formData);
}

type ParamsShape = { id?: string };
async function unwrapParams(params: ParamsShape | Promise<ParamsShape>): Promise<ParamsShape> {
  // @ts-ignore
  if (params && typeof (params as any).then === "function") return params as Promise<ParamsShape>;
  return params as ParamsShape;
}

function isUUID(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
}

export default async function Page({ params }: { params: ParamsShape | Promise<ParamsShape> }) {
  const p = await unwrapParams(params);
  const id = String(p?.id ?? "").trim();

  // ---- THEME (igual que Admin)
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

  const inputStyle: CSSProperties = {
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
    cursor: "pointer",
  };

  const buttonGhost: CSSProperties = {
    display: "inline-block",
    padding: "12px 14px",
    borderRadius: 14,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.06)",
    color: COLORS.white,
    fontWeight: 950,
    textDecoration: "none",
    height: "fit-content",
    whiteSpace: "nowrap",
  };

  const hr: CSSProperties = {
    border: "none",
    borderTop: `1px solid ${COLORS.border}`,
    margin: "12px 0",
  };

  // ✅ No consultes Supabase si id viene vacío
  if (!id) {
    return (
      <main style={page}>
        <Link href="/admin" style={buttonGhost}>
          ← Volver a Admin
        </Link>

        <h1 style={{ fontSize: 22, fontWeight: 950, marginTop: 14, color: COLORS.white }}>
          Cliente no encontrado
        </h1>

        <p style={{ color: COLORS.muted, marginTop: 6 }}>
          El parámetro <b>id</b> viene vacío. Entra desde el listado de clientes.
        </p>
      </main>
    );
  }

  // ✅ No consultes si no es UUID válido
  if (!isUUID(id)) {
    return (
      <main style={page}>
        <Link href="/admin" style={buttonGhost}>
          ← Volver a Admin
        </Link>

        <h1 style={{ fontSize: 22, fontWeight: 950, marginTop: 14, color: COLORS.white }}>ID inválido</h1>

        <p style={{ color: COLORS.muted, marginTop: 6 }}>
          El ID recibido no tiene formato UUID válido:
        </p>

        <pre style={{ marginTop: 12, color: "#fca5a5", whiteSpace: "pre-wrap" }}>{id}</pre>
      </main>
    );
  }

  const { data: c, error } = await supabaseAdmin
    .from("clientes")
    .select("id, nombre, email, telefono, clabe, banco, rfc, direccion, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error || !c) {
    return (
      <main style={page}>
        <Link href="/admin" style={buttonGhost}>
          ← Volver a Admin
        </Link>

        <h1 style={{ fontSize: 22, fontWeight: 950, marginTop: 14, color: COLORS.white }}>
          Cliente no encontrado
        </h1>

        <p style={{ color: COLORS.muted, marginTop: 6 }}>
          No existe el cliente con ID: <b style={{ color: COLORS.white }}>{id}</b>
        </p>

        {error ? (
          <pre style={{ marginTop: 12, color: "#fca5a5", whiteSpace: "pre-wrap" }}>{error.message}</pre>
        ) : null}
      </main>
    );
  }

  return (
    <main style={page}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 950, margin: 0, color: COLORS.white }}>Cliente</h1>
          <p style={{ marginTop: 6, marginBottom: 0, color: COLORS.muted }}>
            Editar datos y crear acceso (usuario + contraseña).
          </p>
        </div>

        <Link href="/admin" style={buttonGhost}>
          ← Volver a Admin
        </Link>
      </div>

      <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
        {/* DATOS CLIENTE */}
        <section style={card}>
          <div style={sectionTitle}>
            {c.nombre}{" "}
            <span style={{ color: COLORS.muted, fontWeight: 800, fontSize: 12 }}>
              ({c.id})
            </span>
          </div>
          <div style={hr} />

          <form action={actualizarClienteForm} style={{ display: "grid", gap: 10 }}>
            <input type="hidden" name="cliente_id" value={c.id} />

            <div>
              <div style={label}>Admin password</div>
              <input name="admin_pass" type="password" placeholder="********" style={inputStyle} required />
            </div>

            <div>
              <div style={label}>Nombre</div>
              <input name="nombre" defaultValue={c.nombre ?? ""} placeholder="Nombre" style={inputStyle} required />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <div style={label}>Email</div>
                <input name="email" defaultValue={c.email ?? ""} placeholder="cliente@email.com" style={inputStyle} />
              </div>
              <div>
                <div style={label}>Teléfono</div>
                <input name="telefono" defaultValue={c.telefono ?? ""} placeholder="668..." style={inputStyle} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <div style={label}>Banco</div>
                <input name="banco" defaultValue={(c as any).banco ?? ""} placeholder="BANORTE / BBVA / etc" style={inputStyle} />
              </div>
              <div>
                <div style={label}>CLABE / Cuenta</div>
                <input name="clabe" defaultValue={c.clabe ?? ""} placeholder="**** **** **** 1234" style={inputStyle} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <div style={label}>RFC</div>
                <input name="rfc" defaultValue={(c as any).rfc ?? ""} placeholder="RFC" style={inputStyle} />
              </div>
              <div>
                <div style={label}>Dirección</div>
                <input name="direccion" defaultValue={(c as any).direccion ?? ""} placeholder="Dirección" style={inputStyle} />
              </div>
            </div>

            <button type="submit" style={buttonPrimary}>
              Guardar cambios
            </button>
          </form>
        </section>

        {/* CREAR ACCESO */}
        <section style={card}>
          <div style={sectionTitle}>Crear acceso del cliente (Auth)</div>
          <div style={hr} />

          <form action={crearAccesoClienteForm} style={{ display: "grid", gap: 10 }}>
            <input type="hidden" name="cliente_id" value={c.id} />

            <div>
              <div style={label}>Admin password</div>
              <input name="admin_pass" type="password" placeholder="********" style={inputStyle} required />
            </div>

            <div>
              <div style={label}>Email (será el usuario)</div>
              <input name="email" defaultValue={c.email ?? ""} placeholder="cliente@email.com" style={inputStyle} required />
            </div>

            <div>
              <div style={label}>Password (opcional)</div>
              <input name="password" placeholder="Si lo dejas vacío, se genera uno temporal" style={inputStyle} />
            </div>

            <button type="submit" style={buttonPrimary}>
              Crear acceso
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}