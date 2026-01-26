"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "../lib/supabase-admin";

export type State = { ok: boolean; message: string };
const ok = (message: string): State => ({ ok: true, message });
const bad = (message: string): State => ({ ok: false, message });

function adminOk(pass: FormDataEntryValue | null) {
  const p = typeof pass === "string" ? pass : "";
  const env = process.env.ADMIN_PASS || "";
  return Boolean(env) && p === env;
}

function toNum(v: any): number {
  if (v === null || v === undefined) return 0;
  const n = typeof v === "number" ? v : Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function detectDelimiter(line: string) {
  const commas = (line.match(/,/g) || []).length;
  const semis = (line.match(/;/g) || []).length;
  const tabs = (line.match(/\t/g) || []).length;
  if (tabs >= commas && tabs >= semis) return "\t";
  if (semis > commas) return ";";
  return ",";
}

function splitCsvLine(line: string, delim: string) {
  // mini parser con comillas
  const out: string[] = [];
  let cur = "";
  let q = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (ch === '"') {
      if (q && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        q = !q;
      }
      continue;
    }

    if (!q && ch === delim) {
      out.push(cur.trim());
      cur = "";
      continue;
    }

    cur += ch;
  }

  out.push(cur.trim());
  return out;
}

function normalizeHeader(h: string) {
  return h.toLowerCase().trim().replace(/\s+/g, "_");
}

function parseCsv(text: string) {
  const raw = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
  if (!raw) return { headers: [] as string[], rows: [] as Record<string, string>[] };

  const lines = raw.split("\n").filter(Boolean);
  const delim = detectDelimiter(lines[0]);

  const headers = splitCsvLine(lines[0], delim).map(normalizeHeader);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i], delim);
    if (!cols.some((c) => c && c.trim().length)) continue;

    const obj: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) obj[headers[j]] = String(cols[j] ?? "").trim();
    rows.push(obj);
  }

  return { headers, rows };
}

async function insertInChunks(table: string, rows: any[], chunkSize = 500) {
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const r = await supabaseAdmin.from(table).insert(chunk);
    if (r.error) return r.error.message;
  }
  return null;
}

/** ✅ Onboarding */
export async function setOnboardingStatus(prev: State, formData: FormData): Promise<State> {
  if (!adminOk(formData.get("admin_pass"))) return bad("Admin password incorrecto.");

  const cliente_id = String(formData.get("cliente_id") ?? "");
  const status = String(formData.get("status") ?? "pendiente");
  const notas = String(formData.get("onboarding_notas") ?? "");

  if (!cliente_id) return bad("Falta cliente_id.");

  const payload: any = {
    onboarding_status: status,
    onboarding_notas: notas || null,
    onboarding_updated_at: new Date().toISOString(),
    validated_at: status === "validado" ? new Date().toISOString() : null,
  };

  const r = await supabaseAdmin.from("clientes").update(payload).eq("id", cliente_id);
  if (r.error) return bad(r.error.message);

  revalidatePath("/backoffice/clientes");
  return ok("Actualizado.");
}

/** ✅ Carga masiva CSV movimientos */
export async function cargarMovimientosCsv(prev: State, formData: FormData): Promise<State> {
  if (!adminOk(formData.get("admin_pass"))) return bad("Admin password incorrecto.");

  const cliente_id = String(formData.get("cliente_id") ?? "");
  const file = formData.get("file") as File | null;

  if (!cliente_id) return bad("Selecciona un cliente.");
  if (!file) return bad("Adjunta un CSV.");

  const text = await file.text();
  const { rows } = parseCsv(text);

  if (!rows.length) return bad("CSV vacío o sin filas.");

  // columnas esperadas (acepta variaciones)
  const pick = (obj: Record<string, string>, keys: string[]) => {
    for (const k of keys) {
      if (obj[k] !== undefined && obj[k] !== null && String(obj[k]).trim() !== "") return obj[k];
    }
    return "";
  };

  const inserts = rows.map((r) => {
    const fecha = pick(r, ["fecha", "date"]);
    const tipo = pick(r, ["tipo", "type"]);
    const montoRaw = pick(r, ["monto", "amount", "importe"]);
    const nota = pick(r, ["nota", "note", "concepto", "descripcion"]);

    return {
      cliente_id,
      fecha,
      tipo: tipo || "Aportación",
      monto: toNum(montoRaw),
      nota: nota || null,
    };
  });

  // validación mínima
  const invalid = inserts.find((x) => !x.fecha);
  if (invalid) return bad("Hay filas sin FECHA. Asegúrate que el CSV tenga columna fecha.");

  const err = await insertInChunks("movimientos", inserts, 400);
  if (err) return bad(err);

  revalidatePath("/backoffice/movimientos");
  return ok(`Listo. Insertadas: ${inserts.length} filas.`);
}

/** ✅ Solicitudes: cambiar status */
export async function actualizarSolicitud(prev: State, formData: FormData): Promise<State> {
  if (!adminOk(formData.get("admin_pass"))) return bad("Admin password incorrecto.");

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const nota = String(formData.get("nota") ?? "");
  const folio = String(formData.get("folio") ?? "");
  const comprobante_url = String(formData.get("comprobante_url") ?? "");

  if (!id) return bad("Falta id.");

  const payload: any = {
    status: status || undefined,
    nota: nota || null,
    folio: folio || null,
    comprobante_url: comprobante_url || null,
    updated_at: new Date().toISOString(),
  };

  const r = await supabaseAdmin.from("solicitudes").update(payload).eq("id", id);
  if (r.error) return bad(r.error.message);

  revalidatePath("/backoffice/solicitudes");
  return ok("Solicitud actualizada.");
}

/** ✅ Documentos: registrar link */
export async function crearDocumento(prev: State, formData: FormData): Promise<State> {
  if (!adminOk(formData.get("admin_pass"))) return bad("Admin password incorrecto.");

  const cliente_id = String(formData.get("cliente_id") ?? "");
  const tipo = String(formData.get("tipo") ?? "");
  const titulo = String(formData.get("titulo") ?? "");
  const url = String(formData.get("url") ?? "");

  if (!cliente_id) return bad("Selecciona cliente.");
  if (!tipo) return bad("Selecciona tipo.");
  if (!titulo) return bad("Pon título.");
  if (!url) return bad("Pon URL (ej: /documentos/archivo.pdf o un link).");

  const r = await supabaseAdmin.from("documentos").insert([{ cliente_id, tipo, titulo, url }]);
  if (r.error) return bad(r.error.message);

  revalidatePath("/backoffice/documentos");
  return ok("Documento registrado.");
}
