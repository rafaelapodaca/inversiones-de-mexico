"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { COLORS, SHADOW } from "../lib/theme";

type Cliente = { id: string; nombre: string; email: string | null };
type Cuenta = { saldo: number; mtd: number; ytd: number; updated_at: string | null };
type EquityPoint = { fecha: string; valor: number };
type MonthlyCashflow = { mes: string; aportaciones: number; retiros: number };
type AlertItem = { id: string; titulo: string; mensaje: string; importante: boolean; created_at: string | null };
type DocItem = { id: string; titulo: string; url: string; created_at: string | null };

function money(n: number) {
  const safe = Number.isFinite(n) ? n : 0;
  return safe.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}
function pct(n: number) {
  const safe = Number.isFinite(n) ? n : 0;
  return `${(safe * 100).toFixed(2)}%`;
}

// ✅ helper robusto: agrega/actualiza cliente_id sin duplicarlo
function addOrReplaceClienteId(path: string, clienteId: string) {
  if (!clienteId) return path;

  const [base, qs = ""] = path.split("?");
  const params = new URLSearchParams(qs);
  params.set("cliente_id", clienteId);

  const q = params.toString();
  return q ? `${base}?${q}` : base;
}

function LineChart({
  points,
  accent = COLORS.accent,
}: {
  points: { x: number; y: number }[];
  accent?: string;
}) {
  const w = 900;
  const h = 260;
  const pad = 18;

  if (!points.length) {
    return (
      <div
        style={{
          height: h,
          borderRadius: 14,
          border: `1px dashed ${COLORS.border}`,
          background: "rgba(255,255,255,0.03)",
          display: "grid",
          placeItems: "center",
          color: COLORS.muted,
          fontSize: 12,
          fontWeight: 800,
        }}
      >
        Sin datos de equity aún
      </div>
    );
  }

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const sx = (x: number) => {
    if (maxX === minX) return pad;
    return pad + ((x - minX) / (maxX - minX)) * (w - pad * 2);
  };
  const sy = (y: number) => {
    if (maxY === minY) return h / 2;
    return pad + (1 - (y - minY) / (maxY - minY)) * (h - pad * 2);
  };

  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${sx(p.x).toFixed(2)} ${sy(p.y).toFixed(2)}`)
    .join(" ");

  const last = points[points.length - 1];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} style={{ display: "block" }}>
      <defs>
        <linearGradient id="equity_fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={accent} stopOpacity="0.32" />
          <stop offset="1" stopColor={accent} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      <path
        d={`M ${pad} ${h - pad} L ${w - pad} ${h - pad}`}
        stroke="rgba(255,255,255,0.10)"
        strokeWidth="1"
        fill="none"
      />

      <path
        d={`${d} L ${sx(last.x).toFixed(2)} ${(h - pad).toFixed(2)} L ${sx(points[0].x).toFixed(
          2
        )} ${(h - pad).toFixed(2)} Z`}
        fill="url(#equity_fill)"
        stroke="none"
      />

      <path d={d} stroke={accent} strokeWidth="2.5" fill="none" />
    </svg>
  );
}

function Bars({
  rows,
  accent = COLORS.accent,
}: {
  rows: MonthlyCashflow[];
  accent?: string;
}) {
  const w = 900;
  const h = 220;
  const pad = 18;

  if (!rows.length) {
    return (
      <div
        style={{
          height: h,
          borderRadius: 14,
          border: `1px dashed ${COLORS.border}`,
          background: "rgba(255,255,255,0.03)",
          display: "grid",
          placeItems: "center",
          color: COLORS.muted,
          fontSize: 12,
          fontWeight: 800,
        }}
      >
        Sin movimientos aún
      </div>
    );
  }

  const maxV = Math.max(1, ...rows.flatMap((r) => [r.aportaciones, r.retiros]));
  const bw = (w - pad * 2) / rows.length;
  const barW = Math.max(6, bw * 0.32);
  const y = (v: number) => pad + (1 - v / maxV) * (h - pad * 2);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} style={{ display: "block" }}>
      <path
        d={`M ${pad} ${h - pad} L ${w - pad} ${h - pad}`}
        stroke="rgba(255,255,255,0.10)"
        strokeWidth="1"
        fill="none"
      />

      {rows.map((r, i) => {
        const x0 = pad + i * bw + bw / 2;
        const aY = y(r.aportaciones);
        const rY = y(r.retiros);

        return (
          <g key={r.mes}>
            <rect
              x={x0 - barW - 3}
              y={aY}
              width={barW}
              height={h - pad - aY}
              rx={6}
              fill={accent}
              opacity={0.85}
            />
            <rect
              x={x0 + 3}
              y={rY}
              width={barW}
              height={h - pad - rY}
              rx={6}
              fill="rgba(255,255,255,0.22)"
            />
          </g>
        );
      })}
    </svg>
  );
}

export default function DashboardClient({
  cliente,
  cuenta,
  rendimiento,
  equity,
  cashflow,
  lastStatement,
  alerts,
}: {
  cliente: Cliente;
  cuenta: Cuenta;
  rendimiento: { m12: number; desdeInicio: number };
  equity: EquityPoint[];
  cashflow: MonthlyCashflow[];
  lastStatement: DocItem | null;
  alerts: AlertItem[];
}) {
  const pathname = usePathname();
  const cid = cliente?.id ?? "";

  // ✅ Siempre construye links con cliente_id sin duplicar
  const withCid = (path: string) => addOrReplaceClienteId(path, cid);

  // ✅ Active: Inicio SOLO en /inicio (no en /)
  const isActive = (path: string) => {
    if (path === "/inicio") return pathname === "/inicio" || pathname.startsWith("/inicio/");
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const page: CSSProperties = {
    padding: 20,
    paddingBottom: 110,
    fontFamily: "system-ui",
    background: COLORS.bg,
    color: COLORS.text,
    minHeight: "100vh",
  };

  const grid: CSSProperties = { marginTop: 14, display: "grid", gap: 12 };

  const box: CSSProperties = {
    border: `1px solid ${COLORS.border}`,
    borderRadius: 16,
    padding: 16,
    background: COLORS.card,
    boxShadow: SHADOW,
  };

  const title: CSSProperties = {
    fontWeight: 950,
    marginBottom: 8,
    display: "flex",
    justifyContent: "space-between",
    color: COLORS.white,
  };

  const hr: CSSProperties = {
    border: "none",
    borderTop: "1px solid rgba(255,255,255,0.10)",
    margin: "12px 0",
  };

  const cardRow: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 };

  const card: CSSProperties = {
    border: `1px solid ${COLORS.border}`,
    borderRadius: 14,
    padding: 12,
    background: "rgba(255,255,255,0.05)",
  };

  const k: CSSProperties = { fontSize: 12, color: COLORS.muted, marginBottom: 6, fontWeight: 900 };
  const v: CSSProperties = { fontSize: 18, fontWeight: 950, color: COLORS.white };

  const equityPoints = (equity ?? []).map((p, i) => ({ x: i, y: p.valor }));

  const shortcutsGrid: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 10,
  };

  const shortcutBtn: CSSProperties = {
    display: "flex",
    gap: 10,
    alignItems: "center",
    padding: "12px 12px",
    borderRadius: 14,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.06)",
    color: COLORS.white,
    textDecoration: "none",
    fontWeight: 950,
    userSelect: "none",
  };

  const shortcutIcon: CSSProperties = {
    width: 36,
    height: 36,
    borderRadius: 12,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(0,0,0,0.18)",
    display: "grid",
    placeItems: "center",
    flex: "0 0 auto",
  };

  const shortcutMeta: CSSProperties = {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: 900,
    marginTop: 2,
  };

  // ✅ Accesos rápidos (SIN "Inicio" para que no se duplique)
  const shortcuts = [
    { label: "Movimientos", meta: "Aportaciones, retiros, estatus", href: withCid("/movimientos"), icon: "💸" },
    { label: "Documentos", meta: "Estados de cuenta / PDFs", href: withCid("/documentos"), icon: "📄" },

    { label: "Perfil", meta: "Datos del cliente", href: withCid("/perfil"), icon: "👤" },
    { label: "Información del fondo", meta: "Estrategia / riesgos / FAQ", href: withCid("/fondo"), icon: "🏦" },

    { label: "Centro de mensajes", meta: "Comunicados oficiales", href: withCid("/mensajes"), icon: "📬" },
    { label: "Notificaciones", meta: "Push / email (MVP)", href: withCid("/notificaciones"), icon: "🔔" },

    { label: "Soporte / Tickets", meta: "Solicitud / documento / aclaración", href: withCid("/soporte"), icon: "🎫" },
    { label: "Agendar llamada", meta: "Calendly o similar", href: withCid("/agenda"), icon: "📅" },

    { label: "Solicitudes", meta: "Peticiones / trámites", href: withCid("/solicitudes"), icon: "🧾" },
    { label: "Boletines", meta: "Cartas e informes", href: withCid("/boletin"), icon: "📰" },
  ];

  const navWrap: CSSProperties = {
    position: "fixed",
    left: "50%",
    bottom: 18,
    transform: "translateX(-50%)",
    width: "min(740px, calc(100% - 28px))",
    borderRadius: 18,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(0,0,0,0.22)",
    boxShadow: SHADOW,
    padding: 10,
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    zIndex: 50,
  };

  const navGrid: CSSProperties = { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 };

  const navBtn = (active: boolean): CSSProperties => ({
    display: "grid",
    placeItems: "center",
    padding: "10px 10px",
    borderRadius: 14,
    border: `1px solid ${active ? "rgba(255,255,255,0.18)" : COLORS.border}`,
    background: active ? COLORS.primary : "rgba(255,255,255,0.06)",
    color: active ? COLORS.white : COLORS.text,
    fontWeight: 950,
    textDecoration: "none",
    whiteSpace: "nowrap",
    userSelect: "none",
  });

  return (
    <main style={page}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 900 }}>INVERSIONES DE MÉXICO</div>
          <h1 style={{ fontSize: 22, fontWeight: 950, margin: "6px 0 0 0", color: COLORS.white }}>
            Inicio / Dashboard
          </h1>
          <div style={{ marginTop: 6, color: COLORS.muted }}>
            {cliente.nombre} · {cliente.email ?? "sin email"} · <span style={{ opacity: 0.8 }}>ID {cliente.id}</span>
          </div>
        </div>

        <div style={{ display: "grid", gap: 8, textAlign: "right" }}>
          <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 900 }}>Última actualización</div>
          <div style={{ fontWeight: 900, color: COLORS.white }}>
            {cuenta.updated_at ? new Date(cuenta.updated_at).toLocaleString("es-MX") : "—"}
          </div>
        </div>
      </div>

      <div style={grid}>
        {/* Accesos rápidos */}
        <section style={box}>
          <div style={title}>
            <span>Accesos rápidos</span>
            <span style={{ fontSize: 12, color: COLORS.muted, fontWeight: 900 }}>MVP</span>
          </div>
          <div style={hr} />

          <div style={shortcutsGrid}>
            {shortcuts.map((s) => (
              <Link key={s.label} href={s.href} style={shortcutBtn}>
                <div style={shortcutIcon}>
                  <span style={{ fontSize: 18 }}>{s.icon}</span>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.label}</div>
                  <div style={shortcutMeta}>{s.meta}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Resumen */}
        <section style={box}>
          <div style={title}>
            <span>Resumen</span>
            <span style={{ fontSize: 12, color: COLORS.muted, fontWeight: 900 }}>Saldo actual</span>
          </div>
          <div style={hr} />

          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 12, alignItems: "stretch" }}>
            <div
              style={{
                borderRadius: 16,
                padding: 16,
                border: `1px solid ${COLORS.border}`,
                background: `linear-gradient(135deg, ${COLORS.primary}, rgba(11,45,92,0.35))`,
              }}
            >
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", fontWeight: 900 }}>Valor de la cuenta</div>
              <div style={{ fontSize: 34, fontWeight: 950, marginTop: 6, color: COLORS.white }}>
                {money(cuenta.saldo)}
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: "rgba(255,255,255,0.82)" }}>
                Rendimiento 12m: <b>{pct(rendimiento.m12)}</b> · Desde inicio: <b>{pct(rendimiento.desdeInicio)}</b>
              </div>
            </div>

            <div style={cardRow}>
              <div style={card}>
                <div style={k}>MTD</div>
                <div style={v}>{pct(cuenta.mtd)}</div>
              </div>
              <div style={card}>
                <div style={k}>YTD</div>
                <div style={v}>{pct(cuenta.ytd)}</div>
              </div>
              <div style={card}>
                <div style={k}>12 meses</div>
                <div style={v}>{pct(rendimiento.m12)}</div>
              </div>
              <div style={card}>
                <div style={k}>Desde inicio</div>
                <div style={v}>{pct(rendimiento.desdeInicio)}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Equity */}
        <section style={box}>
          <div style={title}>
            <span>Gráfica de equity</span>
            <span style={{ fontSize: 12, color: COLORS.muted, fontWeight: 900 }}>{equity.length} puntos</span>
          </div>
          <div style={hr} />
          <LineChart points={equityPoints} />
          <div style={{ marginTop: 10, fontSize: 12, color: COLORS.muted }}>
            * MVP: si aún no cargas históricos, verás solo el último punto.
          </div>
        </section>

        {/* Cashflow */}
        <section style={box}>
          <div style={title}>
            <span>Aportaciones vs. retiros (12 meses)</span>
            <span style={{ fontSize: 12, color: COLORS.muted, fontWeight: 900 }}>
              Azul = Aportaciones · Gris = Retiros
            </span>
          </div>
          <div style={hr} />
          <Bars rows={cashflow} />
        </section>

        {/* Último estado */}
        <section style={box}>
          <div style={title}>
            <span>Último estado de cuenta</span>
          </div>
          <div style={hr} />

          {lastStatement?.url ? (
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 950, color: COLORS.white }}>
                  {lastStatement.titulo ?? "Estado de cuenta"}
                </div>
                <div style={{ fontSize: 12, color: COLORS.muted }}>
                  {lastStatement.created_at ? new Date(lastStatement.created_at).toLocaleDateString("es-MX") : "—"}
                </div>
              </div>

              <a
                href={lastStatement.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: `1px solid ${COLORS.border}`,
                  background: "rgba(42,169,255,0.16)",
                  color: COLORS.white,
                  fontWeight: 950,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Descargar
              </a>
            </div>
          ) : (
            <div style={{ color: COLORS.muted }}>
              Aún no hay estado de cuenta cargado (cuando lo subas, aquí aparecerá el botón).
            </div>
          )}
        </section>

        {/* Alertas */}
        <section style={box}>
          <div style={title}>
            <span>Alertas importantes</span>
          </div>
          <div style={hr} />

          {alerts.length ? (
            <div style={{ display: "grid", gap: 10 }}>
              {alerts.map((a) => (
                <div
                  key={a.id}
                  style={{
                    padding: 12,
                    borderRadius: 14,
                    border: `1px solid ${COLORS.border}`,
                    background: a.importante ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ fontWeight: 950, color: COLORS.white }}>
                      {a.importante ? "🔔 " : "• "}
                      {a.titulo}
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.muted, fontWeight: 900 }}>
                      {a.created_at ? new Date(a.created_at).toLocaleDateString("es-MX") : ""}
                    </div>
                  </div>
                  <div style={{ marginTop: 6, color: COLORS.muted, whiteSpace: "pre-wrap" }}>{a.mensaje}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: COLORS.muted }}>Sin alertas por ahora.</div>
          )}
        </section>
      </div>

      {/* NAV CLIENTE - SIN ADMIN */}
      <nav style={navWrap}>
        <div style={navGrid}>
          <Link href={withCid("/movimientos")} style={navBtn(isActive("/movimientos"))}>
            Movimientos
          </Link>
          <Link href={withCid("/documentos")} style={navBtn(isActive("/documentos"))}>
            Documentos
          </Link>
          <Link href={withCid("/inicio")} style={navBtn(isActive("/inicio"))}>
            Inicio
          </Link>
          <Link href={withCid("/perfil")} style={navBtn(isActive("/perfil"))}>
            Perfil
          </Link>
          <Link href={withCid("/fondo")} style={navBtn(isActive("/fondo"))}>
            Fondo
          </Link>
        </div>
      </nav>
    </main>
  );
}