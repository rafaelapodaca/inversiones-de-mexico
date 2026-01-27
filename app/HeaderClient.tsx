"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { COLORS } from "./lib/theme";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function HeaderClient() {
  const pathname = usePathname();
  const router = useRouter();

  // ✅ NO mostrar header en /login (y si agregas otras rutas, ponlas aquí)
  const hideHeader = useMemo(() => {
    const HIDE_ON = new Set<string>(["/login"]);
    return HIDE_ON.has(pathname);
  }, [pathname]);

  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      const ok = !!data.session;
      setHasSession(ok);
      setReady(true);

      // ✅ si no hay sesión y no estás en /login -> manda a /login
      if (!ok && pathname !== "/login") {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      }
    })();

    // escuchar cambios de sesión (login/logout)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      const ok = !!session;
      setHasSession(ok);

      if (!ok && pathname !== "/login") {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      }
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe();
    };
  }, [pathname, router]);

  // ✅ si es /login no mostrar header
  if (hideHeader) return null;

  // ✅ mientras valida sesión, no flashes el header
  if (!ready) return null;

  // ✅ si no hay sesión, no muestres header (igual ya redirige)
  if (!hasSession) return null;

  async function onLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
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
    cursor: "pointer",
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
          <button onClick={onLogout} style={btn}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}