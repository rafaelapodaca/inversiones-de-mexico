import type { CSSProperties } from "react";
import Link from "next/link";
import { COLORS, SHADOW } from "../lib/theme";

export const dynamic = "force-dynamic";

type SP = { cliente_id?: string };

function addOrReplaceClienteId(path: string, clienteId: string) {
  if (!clienteId) return path;
  const [base, qs = ""] = path.split("?");
  const params = new URLSearchParams(qs);
  params.set("cliente_id", clienteId);
  const q = params.toString();
  return q ? `${base}?${q}` : base;
}

export default function SolicitudesPage({ searchParams }: { searchParams: SP }) {
  const clienteId = searchParams?.cliente_id ?? "";
  const withCid = (path: string) => addOrReplaceClienteId(path, clienteId);

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

  const btnGhost: CSSProperties = {
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

  return (
    <main style={page}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 950, color: COLORS.white }}>Solicitudes</h1>
          <div style={{ marginTop: 6, color: COLORS.muted }}>
            (MVP) Aquí irá la sección de trámites y solicitudes.
          </div>
        </div>

        <Link href={withCid("/inicio")} style={btnGhost}>
          ← Inicio
        </Link>
      </div>

      <section style={{ ...card, marginTop: 14 }}>
        <div style={{ fontWeight: 950, color: COLORS.white, marginBottom: 6 }}>Próximamente</div>
        <div style={{ color: COLORS.muted, lineHeight: 1.6 }}>
          En esta sección vas a poder ver y crear solicitudes (ej. actualización de datos, cartas, etc.).
          <br />
          Cliente ID: <b style={{ color: COLORS.white }}>{clienteId || "—"}</b>
        </div>
      </section>
    </main>
  );
}