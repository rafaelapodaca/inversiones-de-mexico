import Link from "next/link";
import type { CSSProperties } from "react";
import { supabaseAdmin } from "../lib/supabase-admin";
import { COLORS, SHADOW } from "../lib/theme";
import MovimientosClient from "./MovimientosClient";

export const dynamic = "force-dynamic";

type SP = { cliente_id?: string };
type ClienteMini = { id: string; nombre: string; created_at?: string | null };

// ✅ helper robusto: agrega/actualiza cliente_id sin duplicarlo
function addOrReplaceClienteId(path: string, clienteId: string) {
  if (!clienteId) return path;

  const [base, qs = ""] = path.split("?");
  const params = new URLSearchParams(qs);

  params.set("cliente_id", clienteId);

  const q = params.toString();
  return q ? `${base}?${q}` : base;
}

export default async function MovimientosPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const clienteId = searchParams?.cliente_id ?? "";

  // Lista de clientes (para selector)
  const { data: clientes, error: errClientes } = await supabaseAdmin
    .from("clientes")
    .select("id, nombre, created_at")
    .order("created_at", { ascending: false });

  const list: ClienteMini[] = (clientes as ClienteMini[]) || [];

  const page: CSSProperties = {
    minHeight: "100vh",
    background: COLORS.bg,
    color: COLORS.text,
    fontFamily: "system-ui",
    padding: 24,
    paddingBottom: 90,
  };

  const card: CSSProperties = {
    padding: 16,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 16,
    background: COLORS.card,
    boxShadow: SHADOW,
  };

  const hr: CSSProperties = {
    border: "none",
    borderTop: `1px solid ${COLORS.border}`,
    margin: "12px 0",
  };

  const pill: CSSProperties = {
    padding: "10px 12px",
    borderRadius: 14,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.06)",
    color: COLORS.text,
    fontWeight: 900,
    textDecoration: "none",
    display: "inline-block",
  };

  // ✅ Si no hay cliente_id, mostramos selector (sin redirects)
  if (!clienteId) {
    return (
      <main style={page}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 950, color: COLORS.white }}>
              Movimientos
            </h1>
            <div style={{ marginTop: 6, color: COLORS.muted }}>
              Selecciona un cliente para ver historial y solicitudes
            </div>
          </div>

          {/* ✅ Inicio SIEMPRE /inicio */}
          <Link href="/inicio" style={pill}>
            ← Inicio
          </Link>
        </div>

        <section style={{ ...card, marginTop: 14 }}>
          <div style={{ fontWeight: 950, color: COLORS.white }}>Clientes</div>
          <div style={hr} />

          {errClientes ? (
            <div style={{ color: COLORS.muted }}>
              Error cargando clientes: {String((errClientes as any)?.message || errClientes)}
            </div>
          ) : list.length === 0 ? (
            <div style={{ color: COLORS.muted }}>No hay clientes aún.</div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {list.map((c) => (
                <Link key={c.id} href={addOrReplaceClienteId("/movimientos", c.id)} style={pill}>
                  {c.nombre}
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    );
  }

  // ✅ Ya hay cliente_id: cargamos movimientos
  const { data: movimientos, error: errMov } = await supabaseAdmin
    .from("movimientos")
    .select("id, fecha, tipo, monto, nota, created_at")
    .eq("cliente_id", clienteId)
    .order("fecha", { ascending: false });

  const movs = errMov ? [] : (movimientos as any[]) || [];

  // ✅ Cargar solicitudes (aportación/retiro)
  const { data: solicitudes, error: errSol } = await supabaseAdmin
    .from("solicitudes")
    .select("id, created_at, tipo, monto, status, folio, referencia, comprobante_url, nota_cliente, nota_admin")
    .eq("cliente_id", clienteId)
    .order("created_at", { ascending: false });

  const sols = errSol ? [] : (solicitudes as any[]) || [];

  return (
    <MovimientosClient
      clienteId={clienteId}
      clientes={list}
      movimientos={movs}
      solicitudes={sols}
    />
  );
}