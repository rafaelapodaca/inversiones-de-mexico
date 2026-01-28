"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { COLORS } from "./lib/theme";

export default function HeaderAdmin() {
  const pathname = usePathname();

  // ✅ NO mostrar header en /login
  const hideHeader = useMemo(() => pathname === "/login", [pathname]);
  if (hideHeader) return null;

  const bar = {
    position: "sticky" as const,
    top: 0,
    zIndex: 50,
    padding: "12px 16px",
    background: "rgba(10, 14, 25, 0.85)",
    borderBottom: `1px solid ${COLORS.border}`,
    backdropFilter: "blur(10px)",
  };

  const wrap = {
    maxWidth: 1100,
    margin: "0 auto",
    display: "flex",
    gap: 10,
    alignItems: "center",
    justifyContent: "space-between",
  };

  const left = { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" as const };

  const a = {
    color: COLORS.white,
    textDecoration: "none",
    fontWeight: 900,
    padding: "8px 10px",
    borderRadius: 12,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.05)",
  };

  return (
    <div style={bar}>
      <div style={wrap}>
        <div style={left}>
          <Link href="/admin" style={a}>Admin</Link>
          <Link href="/backoffice" style={a}>Backoffice</Link>
          <Link href="/backoffice/clientes" style={a}>Clientes</Link>
          <Link href="/backoffice/documentos" style={a}>Documentos</Link>
          <Link href="/backoffice/movimientos" style={a}>Movimientos</Link>
          <Link href="/backoffice/solicitudes" style={a}>Solicitudes</Link>
          <Link href="/inicio" style={a}>Ver portal cliente</Link>
        </div>
      </div>
    </div>
  );
}