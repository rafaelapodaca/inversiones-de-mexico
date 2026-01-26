"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "../lib/supabase-admin";

type ActionState = { ok: boolean; message: string };

function ok(message: string): ActionState {
  return { ok: true, message };
}
function fail(message: string): ActionState {
  return { ok: false, message };
}

function requireAdmin(formData: FormData): ActionState | null {
  const pass = String(formData.get("admin_pass") ?? "").trim();
  const expected = String(process.env.ADMIN_PASSWORD ?? "").trim();

  if (!expected) return fail("ADMIN_PASSWORD no está configurado en .env.local");
  if (!pass) return fail("Admin password es obligatorio");
  if (pass !== expected) return fail("Admin password incorrecto");
  return null;
}

function genPassword(len = 14) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function toNum(v: any): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}
function toInt(v: any): number {
  const n = Math.trunc(toNum(v));
  return Number.isFinite(n) ? n : 0;
}

/**
 * Acepta:
 * - "2" => 2% mensual => 0.02
 * - "0.02" => 2% mensual => 0.02
 */
function parsePct(v: any): number {
  const n = toNum(v);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return n > 1 ? n / 100 : n;
}

function addMonthsISO(startISO: string, months: number) {
  // startISO: "YYYY-MM-DD"
  const d = new Date(startISO + "T00:00:00");
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

function moneyMXN(n: number) {
  return n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}

export async function crearCliente(_prev: ActionState, formData: FormData) {
  const adminErr = requireAdmin(formData);
  if (adminErr) return adminErr;

  const nombre = String(formData.get("nombre") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim() || null;
  const telefono = String(formData.get("telefono") ?? "").trim() || null;
  const clabe = String(formData.get("clabe") ?? "").trim() || null;

  if (!nombre) return fail("Nombre es obligatorio");

  const { data: cliente, error } = await supabaseAdmin
    .from("clientes")
    .insert([{ nombre, email, telefono, clabe }])
    .select("id, nombre")
    .single();

  if (error) return fail(`Error creando cliente: ${error.message}`);
  if (!cliente?.id) return fail("No se pudo obtener el ID del cliente");

  // crear cuenta base (si tu tabla cuentas ya tiene más columnas, no pasa nada)
  const { error: e2 } = await supabaseAdmin.from("cuentas").upsert(
    [
      {
        cliente_id: cliente.id,
        moneda: "MXN",
        saldo: 0,
        mtd: 0,
        ytd: 0,
      },
    ],
    { onConflict: "cliente_id" }
  );

  if (e2) return fail(`Error creando cuenta: ${e2.message}`);

  revalidatePath("/admin");
  return ok(`Cliente guardado: ${cliente.nombre}`);
}

export async function actualizarCliente(_prev: ActionState, formData: FormData) {
  const adminErr = requireAdmin(formData);
  if (adminErr) return adminErr;

  const cliente_id = String(formData.get("cliente_id") ?? "").trim();
  const nombre = String(formData.get("nombre") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim() || null;
  const telefono = String(formData.get("telefono") ?? "").trim() || null;
  const clabe = String(formData.get("clabe") ?? "").trim() || null;

  if (!cliente_id) return fail("Selecciona un cliente");
  if (!nombre) return fail("Nombre es obligatorio");

  const { error } = await supabaseAdmin
    .from("clientes")
    .update({ nombre, email, telefono, clabe })
    .eq("id", cliente_id);

  if (error) return fail(`Error actualizando cliente: ${error.message}`);

  revalidatePath("/admin");
  return ok("Cliente actualizado ✅");
}

export async function crearAccesoCliente(_prev: ActionState, formData: FormData) {
  const adminErr = requireAdmin(formData);
  if (adminErr) return adminErr;

  const cliente_id = String(formData.get("cliente_id") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const passwordInput = String(formData.get("password") ?? "").trim();
  const password = passwordInput || genPassword();

  if (!cliente_id) return fail("Selecciona un cliente");
  if (!email) return fail("Email es obligatorio para crear acceso");

  // buscamos nombre del cliente (para profiles / metadata)
  const c = await supabaseAdmin
    .from("clientes")
    .select("nombre")
    .eq("id", cliente_id)
    .limit(1)
    .single();
  const nombreCliente = !c.error && c.data?.nombre ? String(c.data.nombre) : "Cliente";

  // 1) crear usuario en Supabase Auth
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { nombre: nombreCliente, cliente_id },
  });

  if (error) return fail(`Error creando usuario Auth: ${error.message}`);

  const userId = data.user?.id;
  if (!userId) return fail("No se pudo obtener el ID del usuario Auth");

  // 2) ligar auth user -> cliente_id en profiles
  // OJO: usamos role = 'client' (no 'cliente') porque tu constraint está así.
  const { error: e2 } = await supabaseAdmin
    .from("profiles")
    .upsert([{ id: userId, email, cliente_id, role: "client", nombre: nombreCliente }], { onConflict: "id" });

  if (e2) return fail(`Error guardando profiles: ${e2.message}`);

  // guardar email en clientes
  await supabaseAdmin.from("clientes").update({ email }).eq("id", cliente_id);

  revalidatePath("/admin");
  return ok(`Acceso creado ✅\nEmail: ${email}\nPassword temporal: ${password}`);
}

export async function actualizarCuenta(_prev: ActionState, formData: FormData) {
  const adminErr = requireAdmin(formData);
  if (adminErr) return adminErr;

  const cliente_id = String(formData.get("cliente_id") ?? "").trim();
  if (!cliente_id) return fail("Selecciona un cliente");

  const saldo = toNum(formData.get("saldo"));
  const mtd = toNum(formData.get("mtd"));
  const ytd = toNum(formData.get("ytd"));

  // NUEVO: plan
  const meses_inversion = toInt(formData.get("meses_inversion"));
  const utilidad_mensual = parsePct(formData.get("utilidad_mensual"));
  const fecha_inicio_input = String(formData.get("fecha_inicio") ?? "").trim();
  const fecha_inicio = fecha_inicio_input || new Date().toISOString().slice(0, 10);

  let fecha_fin: string | null = null;
  let proy_gan: number | null = null;
  let proy_total: number | null = null;

  if (meses_inversion > 0 && utilidad_mensual > 0) {
    fecha_fin = addMonthsISO(fecha_inicio, meses_inversion);
    proy_gan = saldo * utilidad_mensual * meses_inversion;
    proy_total = saldo + proy_gan;
  }

  const payload: any = {
    cliente_id,
    moneda: "MXN",
    saldo,
    mtd,
    ytd,
    updated_at: new Date().toISOString(),
  };

  // guardamos plan solo si viene cargado
  if (meses_inversion > 0) payload.meses_inversion = meses_inversion;
  if (utilidad_mensual > 0) payload.utilidad_mensual = utilidad_mensual;
  if (fecha_inicio) payload.fecha_inicio = fecha_inicio;
  if (fecha_fin) payload.fecha_fin = fecha_fin;
  if (proy_gan !== null) payload.proyeccion_ganancia = proy_gan;
  if (proy_total !== null) payload.proyeccion_total = proy_total;

  const { error } = await supabaseAdmin.from("cuentas").upsert([payload], { onConflict: "cliente_id" });
  if (error) return fail(`Error actualizando cuenta: ${error.message}`);

  revalidatePath("/admin");

  const lines = [`Cuenta actualizada ✅`];

  if (meses_inversion > 0 && utilidad_mensual > 0 && proy_gan !== null && proy_total !== null) {
    lines.push(`Plan: ${meses_inversion} meses @ ${(utilidad_mensual * 100).toFixed(2)}% mensual`);
    lines.push(`Proyección ganancia: ${moneyMXN(proy_gan)}`);
    lines.push(`Proyección total: ${moneyMXN(proy_total)}`);
    lines.push(`Fin estimado: ${fecha_fin}`);
  } else {
    lines.push(`(Tip) Si llenas meses + % mensual, te calcula y guarda la proyección.`);
  }

  return ok(lines.join("\n"));
}

export async function agregarMovimiento(_prev: ActionState, formData: FormData) {
  const adminErr = requireAdmin(formData);
  if (adminErr) return adminErr;

  const cliente_id = String(formData.get("cliente_id") ?? "").trim();
  const fecha = String(formData.get("fecha") ?? "").trim();
  const tipo = String(formData.get("tipo") ?? "").trim();
  const monto = toNum(formData.get("monto"));
  const nota = String(formData.get("nota") ?? "").trim() || null;

  if (!cliente_id) return fail("Selecciona un cliente");
  if (!fecha) return fail("Fecha obligatoria (YYYY-MM-DD)");
  if (!tipo) return fail("Tipo obligatorio");

  const { error } = await supabaseAdmin.from("movimientos").insert([{ cliente_id, fecha, tipo, monto, nota }]);
  if (error) return fail(`Error guardando movimiento: ${error.message}`);

  revalidatePath("/admin");
  return ok("Movimiento guardado ✅");
}

export async function guardarBeneficiarios(_prev: ActionState, formData: FormData) {
  const adminErr = requireAdmin(formData);
  if (adminErr) return adminErr;

  const cliente_id = String(formData.get("cliente_id") ?? "").trim();
  if (!cliente_id) return fail("Selecciona un cliente");

  // Guardamos 1..3. Si el nombre viene vacío => eliminamos ese slot.
  const errors: string[] = [];

  for (let slot = 1; slot <= 3; slot++) {
    const nombre = String(formData.get(`b${slot}_nombre`) ?? "").trim();
    const parentesco = String(formData.get(`b${slot}_parentesco`) ?? "").trim() || null;
    const telefono = String(formData.get(`b${slot}_telefono`) ?? "").trim() || null;
    const email = String(formData.get(`b${slot}_email`) ?? "").trim() || null;

    try {
      if (!nombre) {
        const { error } = await supabaseAdmin
          .from("beneficiarios")
          .delete()
          .eq("cliente_id", cliente_id)
          .eq("slot", slot);

        if (error) errors.push(`Slot ${slot}: ${error.message}`);
        continue;
      }

      const { error } = await supabaseAdmin
        .from("beneficiarios")
        .upsert(
          [
            {
              cliente_id,
              slot,
              nombre,
              parentesco,
              telefono,
              email,
            },
          ],
          { onConflict: "cliente_id,slot" }
        );

      if (error) errors.push(`Slot ${slot}: ${error.message}`);
    } catch (e: any) {
      errors.push(`Slot ${slot}: ${e?.message ?? "error inesperado"}`);
    }
  }

  if (errors.length) return fail(`Error guardando beneficiarios:\n- ${errors.join("\n- ")}`);

  revalidatePath("/admin");
  return ok("Beneficiarios guardados ✅");
}
