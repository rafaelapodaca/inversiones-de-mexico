import type { CSSProperties } from "react";
import Link from "next/link";
import { COLORS, SHADOW } from "../lib/theme";

export const dynamic = "force-dynamic";

type SP = { cliente_id?: string };

type DocItem = {
  id: string;
  titulo: string;
  fecha?: string;
  descripcion?: string;
  pdfUrl: string;
  tag?: string;
};

function DocCard({ item }: { item: DocItem }) {
  const card: CSSProperties = {
    padding: 16,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 16,
    background: COLORS.card,
    boxShadow: SHADOW,
  };

  const title: CSSProperties = { fontWeight: 950, fontSize: 15, color: COLORS.white };
  const meta: CSSProperties = { fontSize: 12, color: COLORS.muted, marginTop: 6 };
  const desc: CSSProperties = { marginTop: 10, color: COLORS.text, opacity: 0.92, lineHeight: 1.5 };

  const btnPrimary: CSSProperties = {
    padding: "10px 12px",
    borderRadius: 14,
    border: `1px solid ${COLORS.primary}`,
    background: COLORS.primary,
    color: COLORS.white,
    fontWeight: 950,
    textDecoration: "none",
    display: "inline-block",
  };

  const btnGhost: CSSProperties = {
    padding: "10px 12px",
    borderRadius: 14,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.06)",
    color: COLORS.text,
    fontWeight: 900,
    textDecoration: "none",
    display: "inline-block",
  };

  const chip: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 10px",
    borderRadius: 999,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.06)",
    color: COLORS.text,
    fontSize: 12,
    fontWeight: 900,
  };

  return (
    <section style={card}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
        <div>
          <div style={title}>{item.titulo}</div>
          {(item.fecha || item.tag) && (
            <div style={meta}>
              {item.fecha ? item.fecha : null}
              {item.fecha && item.tag ? " • " : null}
              {item.tag ? item.tag : null}
            </div>
          )}
          {item.descripcion ? <div style={desc}>{item.descripcion}</div> : null}
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <span style={chip}>PDF</span>
        </div>
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <a href={item.pdfUrl} target="_blank" rel="noreferrer" style={btnPrimary}>
          Ver PDF
        </a>

        <a href={item.pdfUrl} download style={btnGhost}>
          Descargar
        </a>
      </div>
    </section>
  );
}

function Section({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle?: string;
  items: DocItem[];
}) {
  const blockTitle: CSSProperties = { fontSize: 16, fontWeight: 950, color: COLORS.white };
  const blockSub: CSSProperties = { marginTop: 6, color: COLORS.muted, fontSize: 12 };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div>
        <div style={blockTitle}>{title}</div>
        {subtitle ? <div style={blockSub}>{subtitle}</div> : null}
      </div>

      {items.length ? (
        <div style={{ display: "grid", gap: 12 }}>
          {items.map((it) => (
            <DocCard key={it.id} item={it} />
          ))}
        </div>
      ) : (
        <div style={{ color: COLORS.muted, fontSize: 13 }}>Aún no hay documentos en esta sección.</div>
      )}
    </div>
  );
}

export default function DocumentosPage({ searchParams }: { searchParams: SP }) {
  const clienteId = searchParams?.cliente_id || "";

  // ✅ helper robusto: respeta si ya hay query
  const withCid = (path: string) => {
    if (!clienteId) return path;
    return path.includes("?") ? `${path}&cliente_id=${clienteId}` : `${path}?cliente_id=${clienteId}`;
  };

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

  const estadosCuenta: DocItem[] = [
    {
      id: "ec-2025-12",
      titulo: "Estado de cuenta — Dic 2025",
      fecha: "Dic 2025",
      descripcion: "Resumen mensual de capital, rendimiento y movimientos.",
      pdfUrl: "/documentos/estado-cuenta-dic-2025.pdf",
      tag: "Mensual",
    },
  ];

  const cartas: DocItem[] = [
    {
      id: "carta-2026-01",
      titulo: "Carta al inversionista — Ene 2026",
      fecha: "Ene 2026",
      descripcion: "Comentario de mercado, desempeño y enfoque del mes.",
      pdfUrl: "/documentos/carta-inversionista-ene-2026.pdf",
      tag: "Mensual",
    },
  ];

  const factsheet: DocItem[] = [
    {
      id: "factsheet",
      titulo: "Factsheet del fondo",
      fecha: "Actualizado",
      descripcion: "Resumen del fondo: objetivo, estrategia, métricas clave y perfil.",
      pdfUrl: "/documentos/factsheet.pdf",
      tag: "Resumen",
    },
  ];

  const kid: DocItem[] = [
    {
      id: "kid",
      titulo: "KID / Documento informativo",
      fecha: "Actualizado",
      descripcion: "Documento informativo y consideraciones relevantes.",
      pdfUrl: "/documentos/kid.pdf",
      tag: "Informativo",
    },
  ];

  const contratos: DocItem[] = [
    {
      id: "contrato-marco",
      titulo: "Contrato marco + anexos",
      fecha: "Vigente",
      descripcion: "Contrato, anexos y documentos firmados (si aplica).",
      pdfUrl: "/documentos/contrato-marco.pdf",
      tag: "Legal",
    },
  ];

  const fiscales: DocItem[] = [
    {
      id: "reporte-fiscal-2025",
      titulo: "Constancia / reporte fiscal — 2025",
      fecha: "2025",
      descripcion: "Documentación fiscal (si aplica a tu estructura).",
      pdfUrl: "/documentos/reporte-fiscal-2025.pdf",
      tag: "Fiscal",
    },
  ];

  return (
    <main style={page}>
      <div style={topBar}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 950, color: COLORS.white }}>Reportes y documentos</h1>
          <div style={{ marginTop: 6, color: COLORS.muted }}>
            Estados de cuenta, cartas, factsheet, legales y fiscales.
          </div>
        </div>

        {/* ✅ Inicio SIEMPRE /inicio y conserva cliente_id */}
        <Link href={withCid("/inicio")} style={buttonGhost}>
          ← Inicio
        </Link>
      </div>

      <div style={{ marginTop: 16, display: "grid", gap: 20 }}>
        <Section
          title="Estados de cuenta (PDF por mes)"
          subtitle="Tu evidencia mensual: capital, rendimiento y movimientos."
          items={estadosCuenta}
        />

        <Section
          title="Carta al inversionista"
          subtitle="Comunicados semanales/mensuales para dar claridad y contexto."
          items={cartas}
        />

        <Section
          title="Factsheet del fondo"
          subtitle="Resumen ejecutivo: estrategia, métricas clave y perfil."
          items={factsheet}
        />

        <Section title="KID / Documento informativo" subtitle="Documento informativo (si lo usas)." items={kid} />

        <Section title="Contratos y anexos" subtitle="Siempre accesibles." items={contratos} />

        <Section title="Constancias / reportes fiscales" subtitle="Si aplica a tu estructura." items={fiscales} />
      </div>
    </main>
  );
}