import Link from "next/link";
import { demo } from "../data";
import { COLORS, SHADOW } from "../lib/theme";

export default function BoletinPage() {
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

  const card: React.CSSProperties = {
    padding: 16,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 16,
    background: COLORS.card, // ✅ antes era COLORS.white
    boxShadow: SHADOW,
  };

  const title: React.CSSProperties = {
    margin: 0,
    fontSize: 22,
    fontWeight: 950,
    color: COLORS.white, // ✅ blanco
  };

  const subtitle: React.CSSProperties = {
    marginTop: 6,
    color: COLORS.muted,
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

  const pill: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
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

  return (
    <main style={page}>
      <div style={topBar}>
        <div>
          <h1 style={title}>Boletines</h1>
          <div style={subtitle}>Informes semanales</div>
        </div>

        <Link href="/" style={buttonGhost}>
          ← Inicio
        </Link>
      </div>

      <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
        {demo.boletines?.map((b) => (
          <section key={b.id} style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
              <div style={{ fontWeight: 950, color: COLORS.white }}>{b.titulo}</div>
              <span style={pill}>{b.fecha}</span>
            </div>

            <div style={hr} />

            <div style={{ marginTop: 10, color: COLORS.text }}>{b.resumen}</div>

            <div style={{ marginTop: 12 }}>
              <Link href={`/boletin/${b.id}`} style={btnPrimary}>
                Ver boletín
              </Link>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
