import { Suspense } from "react";
import type { CSSProperties } from "react";
import { COLORS, SHADOW } from "../lib/theme";
import MensajesClient from "./MensajesClient";

export const dynamic = "force-dynamic";

export default function MensajesPage() {
  const page: CSSProperties = {
    minHeight: "100vh",
    background: COLORS.bg,
    color: COLORS.text,
    fontFamily: "system-ui",
    padding: 24,
    paddingBottom: 110,
  };

  const card: CSSProperties = {
    padding: 16,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 16,
    background: COLORS.card,
    boxShadow: SHADOW,
  };

  return (
    <main style={page}>
      <Suspense fallback={<div style={{ color: COLORS.muted }}>Cargando mensajes...</div>}>
        <MensajesClient cardStyle={card} />
      </Suspense>
    </main>
  );
}