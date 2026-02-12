import { Suspense } from "react";
import type { CSSProperties } from "react";
import LoginClient from "./LoginClient";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const page: CSSProperties = {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 24,
    background: `
      radial-gradient(900px 600px at 20% 12%, rgba(12, 90, 210, 0.18), transparent 60%),
      radial-gradient(900px 600px at 80% 20%, rgba(8, 40, 95, 0.16), transparent 60%),
      linear-gradient(180deg, #EEF3F8 0%, #DFE8F2 55%, #D5E2EF 100%)
    `,
  };

  const shell: CSSProperties = {
    width: "min(520px, 100%)",
  };

  const frame: CSSProperties = {
    borderRadius: 28,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.65)",
    background: "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(248,250,252,0.92))",
    boxShadow: "0 28px 90px rgba(10, 25, 45, 0.35)",
  };

  const header: CSSProperties = {
    padding: "34px 28px 26px",
    textAlign: "center",
    color: "#fff",
    background: "linear-gradient(135deg, #0A254A 0%, #133B70 55%, #1B4F8F 100%)",
  };

  const mark: CSSProperties = {
    width: 66,
    height: 66,
    margin: "0 auto 14px",
    borderRadius: 18,
    display: "grid",
    placeItems: "center",
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.18)",
    boxShadow: "0 14px 40px rgba(0,0,0,0.18)",
    fontWeight: 900,
    fontSize: 34,
    letterSpacing: -1,
    userSelect: "none",
  };

  const title: CSSProperties = {
    margin: 0,
    fontSize: 34,
    fontWeight: 800,
    letterSpacing: -0.5,
  };

  const subtitle: CSSProperties = {
    margin: "8px 0 0",
    fontSize: 16,
    opacity: 0.92,
  };

  const body: CSSProperties = {
    padding: 22,
    background: "linear-gradient(180deg, #F6F8FB 0%, #EEF3F8 100%)",
  };

  const innerCard: CSSProperties = {
    background: "rgba(255,255,255,0.92)",
    border: "1px solid rgba(15, 30, 55, 0.10)",
    borderRadius: 20,
    padding: 18,
    boxShadow: "0 24px 60px rgba(11, 30, 54, 0.20)",
  };

  return (
    <main style={page}>
      <section style={shell}>
        <div style={frame}>
          <header style={header}>
            <div style={mark}>M</div>
            <h1 style={title}>Acceso al portal</h1>
            <p style={subtitle}>Plataforma privada de Inversiones de México</p>
          </header>

          <div style={body}>
            <div style={innerCard}>
              <Suspense fallback={<div style={{ color: "#5b6b7c" }}>Cargando…</div>}>
                <LoginClient />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}