import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type SP = {
  cliente_id?: string;
};

export default function Page({
  searchParams,
}: {
  searchParams?: SP;
}) {
  const clienteId = searchParams?.cliente_id;

  // Si viene con cliente_id, lo preservamos
  if (clienteId && clienteId.trim() !== "") {
    redirect(`/inicio?cliente_id=${encodeURIComponent(clienteId)}`);
  }

  // Por defecto mandamos a /inicio
  redirect("/inicio");
}