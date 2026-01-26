import Link from "next/link";
import { demo } from "../../data";
import { COLORS, SHADOW } from "../../lib/theme";

export default function BoletinDetalle({ params }: { params: { id: string } }) {
  const b = demo.boletines?.find((x) => x.id === params.id);

  const page: React.CSSProperties = {
    minHeight: "100vh",
    background: COLORS.bg,
    color: COLORS.text,
    fontFamily: "system-ui",
    padding: 24,
    paddingBottom: 90,
  };

  const topBar: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 12,
  };

  const buttonGhost: React.CSSProperties = {
    padding: "12px 14px",
    borderRadius: 14,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.06)",
    color: COLORS.white,
    fontWeight: 950,
    textDecoration: "none",
    display: "inline-block",
    height: "fit-content",
    whiteSpace: "nowrap",
  };

  const card: React.CSSProperties = {
    padding: 16,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 16,
    background: COLORS.card, // ✅ antes era COLORS.white
    boxShadow: SHADOW,
  };

  const pill: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: 999,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.06)",
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: 900,
  };

  const btnPrimary: React.CSSProperties = {
    padding: "10px 12px",
    borderRadius: 14,
    border: `1px solid ${COLORS.primary}`,
    background: COLORS.primary,
    color: COLORS.white,
    fontWeight: 950,
    textDecoration: "none",
    display: "inline-block",
  };

  const hr: React.CSSProperties = {
    border: "none",
    borderTop: `1px solid ${COLORS.border}`,
    margin: "12px 0",
  };

  if (!b) {
    return (
      <main style={page}>
        <div style={topBar}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 950, color: COLORS.white }}>
              Boletines
            </h1>
            <div style={{ marginTop: 6, color: COLORS.muted }}>Detalle</div>
          </div>

          <Link href="/boletin" style={buttonGhost}>
            ← Volver
          </Link>
        </div>

        <section style={{ ...card, marginTop: 14 }}>
          <div style={{ fontWeight: 950, color: COLORS.white }}>Boletín no encontrado</div>
          <div style={{ marginTop: 8, color: COLORS.muted }}>
            Revisa el link o vuelve a la lista.
          </div>
        </section>
      </main>
    );
  }

  return (
    <main style={page}>
      <div style={topBar}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 950, color: COLORS.white }}>
            Boletín
          </h1>
          <div style={{ marginTop: 6, color: COLORS.muted }}>Detalle del informe</div>
        </div>

        <Link href="/boletin" style={buttonGhost}>
          ← Volver
        </Link>
      </div>

      <section style={{ ...card, marginTop: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
          <div style={{ margin: 0, fontSize: 20, fontWeight: 950, color: COLORS.white }}>{b.titulo}</div>
          <span style={pill}>{b.fecha}</span>
        </div>

        <div style={hr} />

        <div style={{ marginTop: 10, whiteSpace: "pre-wrap", lineHeight: 1.7, color: COLORS.text }}>
          {b.contenido || b.resumen}
        </div>

        {b.pdfUrl ? (
          <div style={{ marginTop: 14 }}>
            <a href={b.pdfUrl} target="_blank" rel="noreferrer" style={btnPrimary}>
              Ver PDF
            </a>
          </div>
        ) : null}
      </section>
    </main>
  );
}
