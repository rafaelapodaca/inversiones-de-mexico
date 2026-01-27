import type { CSSProperties } from "react";
import Link from "next/link";
import { COLORS, SHADOW } from "../../lib/theme";
import { supabaseAdmin } from "../../lib/supabase-admin";
import SolicitudesClient from "./ui";

export const dynamic = "force-dynamic";

type Solicitud = {
  id: string;
  cliente_id: string;
  tipo: string;
  monto: number | null;
  status: string;
  nota: string | null;
  folio: string | null;
  comprobante_url: string | null;
  created_at: string;
  clientes?: { nombre: string; email: string | null } | null;
};

export default async function BackofficeSolicitudesPage() {
  const { data } = await supabaseAdmin
    .from("solicitudes")
    .select(
      "id, cliente_id, tipo, monto, status, nota, folio, comprobante_url, created_at, clientes(nombre,email)"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  const solicitudes = (data ?? []) as Solicitud[];

  const card: CSSProperties = {
    padding: 16,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 16,
    background: COLORS.card,
    boxShadow: SHADOW,
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: COLORS.bg,
        color: COLORS.text,
        fontFamily: "system-ui",
        padding: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 12,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 950,
              color: COLORS.white,
            }}
          >
            Solicitudes
          </h1>
          <div style={{ marginTop: 6, color: COLORS.muted }}>
            Retiros / Aportaciones / Cambios / Aclaraciones
          </div>
        </div>

        <Link
          href="/backoffice"
          style={{ color: COLORS.primary, textDecoration: "none", fontWeight: 900 }}
        >
          ← Backoffice
        </Link>
      </div>

      <section style={{ ...card, marginTop: 14 }}>
        <SolicitudesClient solicitudes={solicitudes} />
      </section>
    </main>
  );
}