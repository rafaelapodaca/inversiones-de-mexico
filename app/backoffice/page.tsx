import type { CSSProperties } from "react";
import Link from "next/link";
import { COLORS, SHADOW } from "../lib/theme";
import { supabaseAdmin } from "../lib/supabase-admin";

export const dynamic = "force-dynamic";

function money(n: number) {
  const safe = Number.isFinite(n) ? n : 0;
  return safe.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}

export default async function BackofficeHome() {
  const card: CSSProperties = {
    padding: 16,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 16,
    background: COLORS.card,
    boxShadow: SHADOW,
  };

  // clientes count
  const c1 = await supabaseAdmin.from("clientes").select("id", { count: "exact", head: true });
  const clientesCount = c1.count ?? 0;

  // solicitudes pendientes
  const s1 = await supabaseAdmin
    .from("solicitudes")
    .select("id", { count: "exact", head: true })
    .in("status", ["recibida", "en_revision"]);
  const pendientes = s1.count ?? 0;

  // AUM (último saldo por cliente)
  const r = await supabaseAdmin
    .from("cuentas")
    .select("cliente_id, saldo, updated_at")
    .order("updated_at", { ascending: false })
    .limit(5000);

  const map = new Map<string, number>();
  if (!r.error && Array.isArray(r.data)) {
    for (const row of r.data as any[]) {
      const cid = String(row.cliente_id ?? "");
      if (!cid) continue;
      if (map.has(cid)) continue;
      const saldo = Number(row.saldo ?? 0);
      map.set(cid, Number.isFinite(saldo) ? saldo : 0);
    }
  }
  const aum = Array.from(map.values()).reduce((a, b) => a + b, 0);

  return (
    <main style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "system-ui", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 950, color: COLORS.white }}>Backoffice</h1>
          <div style={{ marginTop: 6, color: COLORS.muted }}>Operación interna del fondo</div>
        </div>

        <Link href="/" style={{ color: COLORS.primary, textDecoration: "none", fontWeight: 900 }}>
          ← Inicio
        </Link>
      </div>

      <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
        <section style={card}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 900 }}>Clientes</div>
              <div style={{ fontSize: 22, fontWeight: 950, color: COLORS.white }}>{clientesCount}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 900 }}>AUM (aprox)</div>
              <div style={{ fontSize: 22, fontWeight: 950, color: COLORS.white }}>{money(aum)}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 900 }}>Solicitudes pendientes</div>
              <div style={{ fontSize: 22, fontWeight: 950, color: COLORS.white }}>{pendientes}</div>
            </div>
          </div>
        </section>

        <section style={card}>
          <div style={{ fontWeight: 950, color: COLORS.white, marginBottom: 10 }}>Módulos</div>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
            <Link href="/backoffice/clientes" style={btn()}>
              Onboarding / Clientes
            </Link>
            <Link href="/backoffice/movimientos" style={btn()}>
              Carga masiva Movimientos (CSV)
            </Link>
            <Link href="/backoffice/solicitudes" style={btn()}>
              Incidencias / Solicitudes
            </Link>
            <Link href="/backoffice/documentos" style={btn()}>
              Gestión documental
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function btn(): CSSProperties {
  return {
    padding: "12px 14px",
    borderRadius: 14,
    border: `1px solid rgba(255,255,255,0.14)`,
    background: "rgba(255,255,255,0.06)",
    color: "white",
    fontWeight: 950,
    textDecoration: "none",
    textAlign: "center",
  };
}
