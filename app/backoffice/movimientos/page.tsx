import type { CSSProperties } from "react";
import Link from "next/link";
import { COLORS, SHADOW } from "../../lib/theme";
import { supabaseAdmin } from "../../lib/supabase-admin";
import MovimientosCsvClient from "./MovimientosCsvClient";

export const dynamic = "force-dynamic";

type Cliente = { id: string; nombre: string };

export default async function BackofficeMovimientosPage() {
  const { data, error } = await supabaseAdmin
    .from("clientes")
    .select("id, nombre")
    .order("created_at", { ascending: false })
    .limit(500);

  const clientes: Cliente[] = Array.isArray(data)
    ? data.map((r: any) => ({ id: String(r?.id ?? ""), nombre: String(r?.nombre ?? "") }))
    : [];

  const card: CSSProperties = {
    padding: 16,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 16,
    background: COLORS.card,
    boxShadow: SHADOW,
  };

  return (
    <main style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "system-ui", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 950, color: COLORS.white }}>Carga masiva (CSV)</h1>
          <div style={{ marginTop: 6, color: COLORS.muted }}>Aportaciones / Retiros / Comisiones / Ajustes</div>

          {error ? (
            <div style={{ marginTop: 10, color: "#fca5a5", fontWeight: 800 }}>
              Error cargando clientes: {error.message}
            </div>
          ) : null}
        </div>

        <Link href="/backoffice" style={{ color: COLORS.primary, textDecoration: "none", fontWeight: 900 }}>
          ← Backoffice
        </Link>
      </div>

      <section style={{ ...card, marginTop: 14 }}>
        <MovimientosCsvClient clientes={clientes} />
      </section>
    </main>
  );
}