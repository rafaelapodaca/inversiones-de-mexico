import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type SP = { cliente_id?: string };

export default function Page({ searchParams }: { searchParams?: SP }) {
  const clienteId = searchParams?.cliente_id ?? "";

  if (clienteId) {
    redirect(`/inicio?cliente_id=${clienteId}`);
  }

  redirect("/inicio");
}