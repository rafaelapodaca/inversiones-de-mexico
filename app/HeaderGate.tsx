"use client";

import { usePathname } from "next/navigation";
import HeaderClient from "./HeaderClient";
import HeaderAdmin from "./HeaderAdmin";

export default function HeaderGate() {
  const pathname = usePathname();

  // ✅ No header en login
  if (pathname === "/login") return null;

  // ✅ Admin header en /admin y /backoffice
  if (pathname.startsWith("/admin") || pathname.startsWith("/backoffice")) {
    return <HeaderAdmin />;
  }

  // ✅ Cliente header en todo lo demás
  return <HeaderClient />;
}