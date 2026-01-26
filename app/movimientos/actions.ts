"use server";

import { supabaseAdmin } from "../lib/supabase-admin";
import { revalidatePath } from "next/cache";

export type State = { ok: boolean; message: string };
const ok = (message: string): State => ({ ok: true, message });
const fail = (message: string): State => ({ ok: false, message });

function toNum(v: any): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

function folio(prefix: string) {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rnd = Math.random().toString(16).slice(2, 6).toUpperCase();
  return `${prefix}-${y}${m}${day}-${rnd}`;
}

export async function solicitarAportacion(_: State, formData: FormData): Promise<State> {
  const cliente_id = String(formData.get("cliente_id") || "");
  const monto = toNum(formData.get("monto"));
  const referencia = String(formData.get("referencia") || "");
  const nota_cliente = String(formData.get("nota_cliente") || "");

  if (!cliente_id) return fail("Falta cliente_id.");
  if (!(monto > 0)) return fail("Monto inválido.");
  const f = folio("APO");

  const { error } = await supabaseAdmin.from("solicitudes").insert({
    cliente_id,
    tipo: "aportacion",
    monto,
    status: "recibida",
    folio: f,
    referencia,
    nota_cliente,
  });

  if (error) return fail(error.message);

  revalidatePath("/movimientos");
  return ok(`✅ Solicitud de aportación enviada.\nFolio: ${f}`);
}

export async function solicitarRetiro(_: State, formData: FormData): Promise<State> {
  const cliente_id = String(formData.get("cliente_id") || "");
  const monto = toNum(formData.get("monto"));
  const clabe_confirmada = String(formData.get("clabe_confirmada") || "");
  const nota_cliente = String(formData.get("nota_cliente") || "");

  if (!cliente_id) return fail("Falta cliente_id.");
  if (!(monto > 0)) return fail("Monto inválido.");
  if (clabe_confirmada !== "si") return fail("Confirma que el retiro se envía a la CLABE registrada.");

  const f = folio("RET");

  const { error } = await supabaseAdmin.from("solicitudes").insert({
    cliente_id,
    tipo: "retiro",
    monto,
    status: "recibida",
    folio: f,
    nota_cliente,
  });

  if (error) return fail(error.message);

  revalidatePath("/movimientos");
  return ok(`✅ Solicitud de retiro enviada.\nFolio: ${f}\nEstatus: recibida`);
}
