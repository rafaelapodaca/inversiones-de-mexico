import { supabaseAdmin } from "../lib/supabase-admin";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

type Cliente = {
  id: string;
  nombre: string;
  email: string | null;
  telefono: string | null;
  clabe: string | null;
  banco: string | null;
  agente_captacion: string | null;
  rfc: string | null;
  direccion: string | null;
  created_at: string | null;
};

export default async function Page() {
  const { data, error } = await supabaseAdmin
    .from("clientes")
    .select("id, nombre, email, telefono, clabe, banco, agente_captacion, rfc, direccion, created_at")
    .order("created_at", { ascending: false });

  const clientes: Cliente[] = (Array.isArray(data) ? (data as Cliente[]) : []) ?? [];

  return <AdminClient clientes={clientes} errorMsg={error ? error.message : ""} />;
}