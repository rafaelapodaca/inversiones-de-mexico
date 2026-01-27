"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import type { CSSProperties } from "react";
import { COLORS } from "./lib/theme";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Rutas donde NO queremos mostrar header (login, etc)
const HIDE_ON = new Set<string>(["/login"]);

export default function HeaderClient() {
  const pathname = usePathname();
  const sp = useSearchParams();
  const router = useRouter();

  if (!pathname || HIDE_ON.has(pathname)) return null;

  const cid = sp.get("cliente_id") || "";

  const withCid = (path: string) => {
    if (!cid) return path;
    return path.includes("?") ? `${path}&cliente_id=${cid}` : `${path}?cliente_id=${cid}`;
  };

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const bar: CSSProperties = {
    position: "sticky",
    top: 0,
    zIndex: 50,
    padding: "12px 16px",
    borderBottom: `1px solid ${COLORS.border}`,
    background: COLORS.bg,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  };

  const left: CSSProperties = { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" };

  const btn: CSSProperties = {
    padding: "10px 12px",
    borderRadius: 14,
    border: `1px solid ${COLORS.border}`,
    background: "rgba(255,255,255,0.06)",
    color: COLORS.white,
    fontWeight: 950,
    textDecoration: "none",
    cursor: "pointer",
    whiteSpace: "nowrap",
  };

  const title: CSSProperties = { fontWeight: 950, color: COLORS.white };

  return (
    <header style={bar}>
      <div style={left}>
        <span style={title}>Inversiones de México</span>

        <Link href={withCid("/inicio")} style={btn}>
          Inicio
        </Link>
        <Link href={withCid("/perfil")} style={btn}>
          Perfil
        </Link>
      </div>

      <button type="button" onClick={handleLogout} style={btn}>
        Cerrar sesión
      </button>
    </header>
  );
}