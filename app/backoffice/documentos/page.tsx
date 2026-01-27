import type { CSSProperties } from "react";
import Link from "next/link";
import { COLORS, SHADOW } from "../../lib/theme";
import { supabaseAdmin } from "../../lib/supabase-admin";
import DocumentosClient from "./ui";

export const dynamic = "force-dynamic";

type Documento = {
  id: string;
  cliente_id: string;
  tipo: string | null;
  nombre: string | null;
  estatus: string | null;
  url: string | null;
  created_at: string | null;
  clientes?: { nombre: string | null; email: string | null } | null;
};

export default async function BackofficeDocumentosPage() {
  const { data, error } = await supabaseAdmin
    .from("documentos")
    .select("id, cliente_id, tipo, nombre, estatus, url, created_at, clientes(nombre,email)")
    .order("created_at", { ascending: false })
    .limit(500);

  const documentos: Documento[] = Array.isArray(data)
    ? data.map((r: any) => ({
        id: String(r?.id ?? ""),
        cliente_id: String(r?.cliente_id ?? ""),
        tipo: r?.tipo ?? null,
        nombre: r?.nombre ?? null,
        estatus: r?.estatus ?? null,
        url: r?.url ?? null,
        created_at: r?.created_at ?? null,
        clientes: r?.clientes
          ? { nombre: r.clientes?.nombre ?? null, email: r.clientes?.email ?? null }
          : null,
      }))
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
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 950, color: COLORS.white }}>Documentos</h1>
          <div style={{ marginTop: 6, color: COLORS.muted }}>INE / Domicilio / Contratos — revisión y estatus</div>

          {error ? (
            <div style={{ marginTop: 10, color: "#fca5a5", fontWeight: 800 }}>
              Error cargando documentos: {error.message}
            </div>
          ) : null}
        </div>

        <Link href="/backoffice" style={{ color: COLORS.primary, textDecoration: "none", fontWeight: 900 }}>
          ← Backoffice
        </Link>
      </div>

      <section style={{ ...card, marginTop: 14 }}>
        <DocumentosClient documentos={documentos} />
      </section>
    </main>
  );
}