"use client";

import Link from "next/link";
import { useMemo, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { COLORS } from "./lib/theme";

export default function HeaderClient() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // ✅ NO mostrar header en /login
  const hideHeader = useMemo(() => {
    const HIDE_ON = new Set<string>(["/login"]);
    return HIDE_ON.has(pathname);
  }, [pathname]);

  if (hideHeader) return null;

  async function onLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      startTransition(() => {
        router.replace("/login");
        router.refresh();
      });
    }
  }

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
  const right = { display: "flex", gap: 10, alignItems: "center" };

  const a = {
    color: COLORS.white,
    textDecoration: "none",
    fontWeight: 900,
    padding: "8px 10px",
    borderRadius: 12,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.05)",
  };

  const btn = {
    ...a,
    cursor: isPending ? "not-allowed" : "pointer",
    opacity: isPending ? 0.7 : 1,
  };

  return (
    <div style={bar}>
      <div style={wrap}>
        <div style={left}>
          <Link href="/inicio" style={a}>Inicio</Link>
          <Link href="/perfil" style={a}>Perfil</Link>
          <Link href="/fondo" style={a}>Fondo</Link>
          <Link href="/movimientos" style={a}>Movimientos</Link>
          <Link href="/documentos" style={a}>Documentos</Link>
          <Link href="/solicitudes" style={a}>Solicitudes</Link>
          <Link href="/soporte" style={a}>Soporte</Link>
        </div>

        <div style={right}>
          <button onClick={onLogout} style={btn} disabled={isPending}>
            {isPending ? "Cerrando..." : "Cerrar sesión"}
          </button>
        </div>
      </div>
    </div>
  );
}