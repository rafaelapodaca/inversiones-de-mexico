import Link from "next/link";
import { COLORS, SHADOW } from "../lib/theme";

export const dynamic = "force-dynamic";

type SP = { cliente_id?: string };

export default function FondoPage({ searchParams }: { searchParams: SP }) {
  const clienteId = searchParams?.cliente_id || "";

  // ✅ helper robusto: respeta si ya hay query
  const withCid = (path: string) => {
    if (!clienteId) return path;
    return path.includes("?") ? `${path}&cliente_id=${clienteId}` : `${path}?cliente_id=${clienteId}`;
  };

  const page: React.CSSProperties = {
    minHeight: "100vh",
    background: COLORS.bg,
    color: COLORS.text,
    fontFamily: "system-ui",
    padding: 24,
    paddingBottom: 110,
  };

  const top: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 12,
  };

  const card: React.CSSProperties = {
    padding: 16,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 16,
    background: COLORS.card,
    boxShadow: SHADOW,
  };

  const brand: React.CSSProperties = { fontSize: 12, color: COLORS.muted, fontWeight: 900 };
  const h1: React.CSSProperties = { margin: "6px 0 0 0", fontSize: 22, fontWeight: 950, color: COLORS.white };
  const sub: React.CSSProperties = { marginTop: 6, color: COLORS.muted };

  const sectionTitle: React.CSSProperties = { margin: 0, fontWeight: 950, color: COLORS.white, fontSize: 16 };
  const p: React.CSSProperties = { marginTop: 10, color: COLORS.muted, lineHeight: 1.7 };

  const ul: React.CSSProperties = { margin: 0, paddingLeft: 18 };
  const li: React.CSSProperties = { marginTop: 8, color: COLORS.muted, lineHeight: 1.7 };

  const back: React.CSSProperties = {
    padding: "10px 12px",
    borderRadius: 14,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.06)",
    color: COLORS.white,
    fontWeight: 950,
    textDecoration: "none",
    display: "inline-block",
    whiteSpace: "nowrap",
  };

  return (
    <main style={page}>
      <div style={top}>
        <div>
          <div style={brand}>INVERSIONES DE MÉXICO</div>
          <h1 style={h1}>Fondo</h1>
          <div style={sub}>Transparencia controlada</div>
        </div>

        {/* ✅ Inicio siempre /inicio y conserva cliente_id */}
        <Link href={withCid("/inicio")} style={back}>
          ← Inicio
        </Link>
      </div>

      <div style={{ marginTop: 14, display: "grid", gap: 12 }}>
        <section style={card}>
          <h2 style={sectionTitle}>Objetivo, filosofía y horizonte</h2>
          <div style={p}>
            • Objetivo: crecimiento de capital con enfoque disciplinado.<br />
            • Filosofía: gestión de riesgo primero, consistencia sobre velocidad.<br />
            • Horizonte: mediano/largo plazo, con ciclos de mercado.
          </div>
        </section>

        <section style={card}>
          <h2 style={sectionTitle}>Estrategia (resumen)</h2>
          <div style={p}>En bullets claros sin revelar el edge completo:</div>
          <ul style={ul}>
            <li style={li}>Selección y seguimiento con análisis técnico + fundamental.</li>
            <li style={li}>Enfoque en liquidez y calidad (mercado US como base).</li>
            <li style={li}>Gestión activa del riesgo: tamaños, stops, exposición.</li>
            <li style={li}>Rebalanceos y ajustes según condiciones de mercado.</li>
          </ul>
        </section>

        <section style={card}>
          <h2 style={sectionTitle}>Riesgos (simple)</h2>
          <ul style={ul}>
            <li style={li}>Riesgo de mercado: caídas generales pueden afectar el valor.</li>
            <li style={li}>Riesgo de concentración: exposición a sectores/activos.</li>
            <li style={li}>Riesgo de liquidez: en condiciones extremas hay spreads.</li>
            <li style={li}>Riesgo operativo: fallas de sistema/ejecución (mitigado con controles).</li>
          </ul>
        </section>

        <section style={card}>
          <h2 style={sectionTitle}>Comisiones</h2>
          <div style={p}>
            • Comisión de administración: ___% anual (prorrateado).<br />
            • Performance: ___% sobre utilidad (con regla de high-watermark si aplica).<br />
            • Otros: costos de operación/transferencias según el caso.
          </div>
        </section>

        <section style={card}>
          <h2 style={sectionTitle}>Fechas y procesos</h2>
          <div style={p}>
            • Valuación: diaria/semanal (define tu regla).<br />
            • Corte: día __ de cada mes.<br />
            • Liquidación: __ días hábiles después del corte.<br />
            • Ventanas de retiro: fechas específicas (comunicadas por alertas).
          </div>
        </section>

        <section style={card}>
          <h2 style={sectionTitle}>FAQ</h2>
          <div style={p}>
            <b style={{ color: COLORS.white }}>¿Cómo retiro?</b>
            <br />
            Desde “Movimientos” → Solicitar retiro. Se aplica ventana y corte.
            <br />
            <br />
            <b style={{ color: COLORS.white }}>¿Cómo aporto?</b>
            <br />
            Desde “Movimientos” → Solicitar aportación. Se muestran instrucciones y referencia.
          </div>
        </section>
      </div>
    </main>
  );
}