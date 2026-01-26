import type { CSSProperties } from "react";
import Link from "next/link";
import { COLORS, SHADOW } from "../../lib/theme";
import { supabaseAdmin } from "../../lib/supabase-admin";
import DocumentosClient from "./ui";

export const dynamic = "force-dynamic";

type Cliente = { id: string; nombre: string };
type Doc = { id: string; cliente_id: string; tipo: string; titulo: string; url: string; created_at: string };

export default async function BackofficeDocumentosPage() {
  const c = await supabaseAdmin.from("clientes").select("id,nombre").order("created_at", { ascending: false }).limit(500);
  const clientes = (c.data ?? []) as Cliente[];

  const d = await supabaseAdmin.from("documentos").select("id,cliente_id,tipo,titulo,url,created_at").order("created_at", { ascending: false }).limit(200);
  const docs = (d.data ?? []) as Doc[];

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
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 950, color: COLORS.white }}>Documentos</h1>
          <div style={{ marginTop: 6, color: COLORS.muted }}>Contratos, estados de cuenta, anexos, comunicados</div>
        </div>
        <Link href="/backoffice" style={{ color: COLORS.primary, textDecoration: "none", fontWeight: 900 }}>
          ← Backoffice
        </Link>
      </div>

      <section style={{ ...card, marginTop: 14 }}>
        <DocumentosClient clientes={clientes} docs={docs} />
      </section>
    </main>
  );
}
