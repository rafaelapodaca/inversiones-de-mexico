import { Suspense } from "react";
import type { CSSProperties } from "react";
import { COLORS, SHADOW } from "../lib/theme";
import LoginClient from "./LoginClient";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const page: CSSProperties = {
    minHeight: "100vh",
    background: COLORS.bg,
    color: COLORS.text,
    fontFamily: "system-ui",
    display: "grid",
    placeItems: "center",
    padding: 24,
  };

  const card: CSSProperties = {
    width: "min(520px, 100%)",
    padding: 18,
    borderRadius: 16,
    border: `1px solid ${COLORS.border}`,
    background: COLORS.card,
    boxShadow: SHADOW,
  };

  return (
    <main style={page}>
      <section style={card}>
        <Suspense fallback={<div style={{ color: COLORS.muted }}>Cargando login...</div>}>
          <LoginClient />
        </Suspense>
      </section>
    </main>
  );
}