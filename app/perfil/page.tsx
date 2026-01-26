import type { CSSProperties } from "react";
import Link from "next/link";
import { supabaseAdmin } from "../lib/supabase-admin";
import { COLORS, SHADOW } from "../lib/theme";

export const dynamic = "force-dynamic";

type SP = { cliente_id?: string };

async function unwrapSearchParams(searchParams: SP | Promise<SP>): Promise<SP> {
  // @ts-ignore
  if (searchParams && typeof (searchParams as any).then === "function") {
    return searchParams as Promise<SP>;
  }
  return searchParams as SP;
}

// ✅ helper robusto: agrega/actualiza cliente_id sin duplicarlo
function addOrReplaceClienteId(path: string, clienteId: string) {
  if (!clienteId) return path;

  const [base, qs = ""] = path.split("?");
  const params = new URLSearchParams(qs);
  params.set("cliente_id", clienteId);

  const q = params.toString();
  return q ? `${base}?${q}` : base;
}

export default async function PerfilPage({
  searchParams,
}: {
  searchParams: SP | Promise<SP>;
}) {
  const sp = await unwrapSearchParams(searchParams);
  const clienteId = sp?.cliente_id ?? "";

  const withCid = (path: string) => addOrReplaceClienteId(path, clienteId);

  const { data: clientes } = await supabaseAdmin
    .from("clientes")
    .select("id, nombre")
    .order("created_at", { ascending: false });

  const page: CSSProperties = {
    minHeight: "100vh",
    background: COLORS.bg,
    color: COLORS.text,
    fontFamily: "system-ui",
    padding: 24,
    paddingBottom: 110, // deja espacio para tu nav fijo de abajo
  };

  const card: CSSProperties = {
    border: `1px solid ${COLORS.border}`,
    borderRadius: 16,
    padding: 16,
    background: COLORS.card,
    boxShadow: SHADOW,
  };

  const title: CSSProperties = {
    fontSize: 22,
    fontWeight: 950,
    margin: 0,
    color: COLORS.white,
  };

  const muted: CSSProperties = { color: COLORS.muted };

  const buttonGhost: CSSProperties = {
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

  // ✅ Si NO viene cliente_id, mostramos selector
  if (!clienteId) {
    return (
      <main style={page}>
        <div>
          <h1 style={title}>Perfil</h1>
          <p style={{ ...muted, marginTop: 6 }}>
            Falta <b>cliente_id</b>. Selecciona un cliente:
          </p>
        </div>

        <section style={{ ...card, marginTop: 14 }}>
          {clientes?.length ? (
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9 }}>
              {clientes.map((c) => (
                <li key={c.id}>
                  <Link
                    href={addOrReplaceClienteId("/perfil", c.id)}
                    style={{ color: COLORS.white, textDecoration: "none" }}
                  >
                    {c.nombre}{" "}
                    <span style={{ color: COLORS.muted, fontSize: 12 }}>
                      ({c.id})
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div style={muted}>No hay clientes aún.</div>
          )}
        </section>

        <div style={{ marginTop: 14 }}>
          <Link href="/admin" style={buttonGhost}>
            ← Volver a admin
          </Link>
        </div>
      </main>
    );
  }

  const { data: c, error } = await supabaseAdmin
    .from("clientes")
    .select("id, nombre, email, telefono, clabe, rfc, direccion, created_at")
    .eq("id", clienteId)
    .maybeSingle();

  // ✅ Si hay error o no existe
  if (error || !c) {
    return (
      <main style={page}>
        <div>
          <h1 style={title}>Perfil</h1>
          <p style={{ ...muted, marginTop: 6 }}>
            No se encontró el cliente con ese ID.
          </p>
        </div>

        <div style={{ marginTop: 14 }}>
          <Link href="/admin" style={buttonGhost}>
            ← Volver a admin
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={page}>
      <div>
        <h1 style={title}>Perfil</h1>
        <p style={{ ...muted, marginTop: 6, marginBottom: 0 }}>
          Datos del cliente y preferencias.
        </p>
      </div>

      <div style={{ marginTop: 14 }}>
        <Link href="/admin" style={buttonGhost}>
          ← Volver a admin
        </Link>
      </div>

      <section style={{ ...card, marginTop: 14 }}>
        <div style={{ fontWeight: 950, color: COLORS.white, marginBottom: 6 }}>
          Datos personales y fiscales
        </div>

        <div style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.6 }}>
          <div>
            <b style={{ color: COLORS.white }}>Nombre:</b> {c.nombre}
          </div>
          <div>
            <b style={{ color: COLORS.white }}>Email:</b> {c.email || "-"}
          </div>
          <div>
            <b style={{ color: COLORS.white }}>Teléfono:</b> {c.telefono || "-"}
          </div>
          <div>
            <b style={{ color: COLORS.white }}>RFC:</b> {c.rfc || "-"}
          </div>
          <div>
            <b style={{ color: COLORS.white }}>Domicilio:</b> {c.direccion || "-"}
          </div>
        </div>
      </section>

      <section style={{ ...card, marginTop: 12 }}>
        <div style={{ fontWeight: 950, color: COLORS.white, marginBottom: 6 }}>
          Cuenta bancaria registrada (CLABE)
        </div>
        <div style={{ color: COLORS.muted }}>
          {c.clabe || "Sin CLABE registrada"}
        </div>
      </section>

      <section style={{ ...card, marginTop: 12 }}>
        <div style={{ fontWeight: 950, color: COLORS.white, marginBottom: 6 }}>
          Documentos del cliente
        </div>
        <div style={{ color: COLORS.muted }}>
          (INE/Pasaporte, comprobante, contratos) — lo conectamos después.
        </div>
      </section>

      <section style={{ ...card, marginTop: 12 }}>
        <div style={{ fontWeight: 950, color: COLORS.white, marginBottom: 6 }}>
          Preferencias
        </div>
        <div style={{ color: COLORS.muted }}>
          (Notificaciones, idioma, método de contacto) — lo conectamos después.
        </div>
      </section>
    </main>
  );
}