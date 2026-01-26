// app/inicio/page.tsx
import DashboardClient from "./DashboardClient";
import { supabaseAdmin } from "../lib/supabase-admin";
import { COLORS } from "../lib/theme";

export const dynamic = "force-dynamic";

type SearchParams = { cliente_id?: string };

type Cliente = { id: string; nombre: string; email: string | null };
type Cuenta = { saldo: number; mtd: number; ytd: number; updated_at: string | null };
type EquityPoint = { fecha: string; valor: number };
type MonthlyCashflow = { mes: string; aportaciones: number; retiros: number };
type AlertItem = { id: string; titulo: string; mensaje: string; importante: boolean; created_at: string | null };
type DocItem = { id: string; titulo: string; url: string; created_at: string | null };

function toNum(v: any): number {
  if (v === null || v === undefined) return 0;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

function monthKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function monthLabel(key: string) {
  const [y, m] = key.split("-");
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  return `${meses[Number(m) - 1]} ${y}`;
}

function pickAtOrBefore(points: EquityPoint[], cutoff: Date): EquityPoint | null {
  let candidate: EquityPoint | null = null;
  for (const p of points) {
    const d = new Date(p.fecha + "T00:00:00");
    if (d <= cutoff) candidate = p;
    else break;
  }
  return candidate;
}

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  // 1) Elegimos cliente por ?cliente_id=... (luego lo amarramos al login)
  const clienteIdParam = searchParams?.cliente_id;

  let cliente: Cliente | null = null;

  if (clienteIdParam) {
    const r = await supabaseAdmin
      .from("clientes")
      .select("id, nombre, email")
      .eq("id", clienteIdParam)
      .limit(1)
      .single();

    if (!r.error && r.data) cliente = r.data as Cliente;
  }

  if (!cliente) {
    const r = await supabaseAdmin
      .from("clientes")
      .select("id, nombre, email")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!r.error && r.data) cliente = r.data as Cliente;
  }

  // ✅ Si no hay clientes, NO mandamos a /admin (ni mostramos link)
  if (!cliente) {
    const page: React.CSSProperties = {
      minHeight: "100vh",
      background: COLORS.bg,
      color: COLORS.text,
      fontFamily: "system-ui",
      padding: 24,
    };

    return (
      <main style={page}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 950, color: COLORS.white }}>No hay clientes</h1>
        <p style={{ marginTop: 8, color: COLORS.muted }}>
          Aún no existe ningún cliente en la base de datos.
          <br />
          (Cuando crees el primero, este dashboard aparecerá automáticamente.)
        </p>
      </main>
    );
  }

  // 2) Cuenta (saldo/MTD/YTD)
  let cuenta: Cuenta = { saldo: 0, mtd: 0, ytd: 0, updated_at: null };
  {
    const r = await supabaseAdmin
      .from("cuentas")
      .select("saldo, mtd, ytd, updated_at")
      .eq("cliente_id", cliente.id)
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    if (!r.error && r.data) {
      cuenta = {
        saldo: toNum((r.data as any).saldo),
        mtd: toNum((r.data as any).mtd),
        ytd: toNum((r.data as any).ytd),
        updated_at: (r.data as any).updated_at ?? null,
      };
    }
  }

  // 3) Equity points
  let equity: EquityPoint[] = [];
  {
    const r = await supabaseAdmin
      .from("equity_points")
      .select("fecha, valor")
      .eq("cliente_id", cliente.id)
      .order("fecha", { ascending: true })
      .limit(800);

    if (!r.error && r.data && Array.isArray(r.data)) {
      equity = (r.data as any[]).map((x) => ({ fecha: String(x.fecha), valor: toNum(x.valor) }));
    }
  }

  if (equity.length === 0) {
    const d = cuenta.updated_at ? new Date(cuenta.updated_at) : new Date();
    equity = [{ fecha: d.toISOString().slice(0, 10), valor: cuenta.saldo }];
  }

  const lastEquity = equity[equity.length - 1]?.valor ?? cuenta.saldo;

  // 4) Rendimientos extra: 12m y desde inicio (en %)
  const today = new Date();
  const d12 = new Date(today);
  d12.setMonth(d12.getMonth() - 12);

  const p12 = pickAtOrBefore(equity, d12);
  const p0 = equity[0] ?? null;

  const r12 = p12 && p12.valor > 0 ? (lastEquity - p12.valor) / p12.valor : 0;
  const rAll = p0 && p0.valor > 0 ? (lastEquity - p0.valor) / p0.valor : 0;

  // 5) Movimientos -> aportaciones vs retiros (últimos 12 meses)
  let cashflow: MonthlyCashflow[] = [];
  {
    const r = await supabaseAdmin
      .from("movimientos")
      .select("fecha, tipo, monto")
      .eq("cliente_id", cliente.id)
      .order("fecha", { ascending: true })
      .limit(2000);

    if (!r.error && r.data && Array.isArray(r.data)) {
      const map = new Map<string, { a: number; r: number }>();

      for (const row of r.data as any[]) {
        const fecha = String(row.fecha ?? "");
        if (!fecha) continue;

        const d = new Date(fecha + "T00:00:00");
        const key = monthKey(d);

        const tipo = String(row.tipo ?? "").toLowerCase();
        const monto = Math.abs(toNum(row.monto));

        const cur = map.get(key) ?? { a: 0, r: 0 };
        if (tipo.includes("retiro")) cur.r += monto;
        else if (tipo.includes("aport") || tipo.includes("deposit") || tipo.includes("abono")) cur.a += monto;
        else cur.a += monto;
        map.set(key, cur);
      }

      const keys: string[] = [];
      const base = new Date(today.getFullYear(), today.getMonth(), 1);
      for (let i = 11; i >= 0; i--) {
        const d2 = new Date(base);
        d2.setMonth(d2.getMonth() - i);
        keys.push(monthKey(d2));
      }

      cashflow = keys.map((k) => {
        const v = map.get(k) ?? { a: 0, r: 0 };
        return { mes: monthLabel(k), aportaciones: v.a, retiros: v.r };
      });
    }
  }

  // 6) Último estado de cuenta
  let lastStatement: DocItem | null = null;
  {
    const r = await supabaseAdmin
      .from("documentos")
      .select("id, titulo, url, created_at")
      .eq("cliente_id", cliente.id)
      .eq("tipo", "estado_cuenta")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!r.error && r.data) lastStatement = r.data as any;
  }

  // 7) Alertas
  let alerts: AlertItem[] = [];
  {
    const r = await supabaseAdmin
      .from("alertas")
      .select("id, titulo, mensaje, importante, created_at")
      .eq("cliente_id", cliente.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (!r.error && r.data && Array.isArray(r.data)) {
      alerts = (r.data as any[]).map((x) => ({
        id: String(x.id),
        titulo: String(x.titulo ?? ""),
        mensaje: String(x.mensaje ?? ""),
        importante: Boolean(x.importante),
        created_at: x.created_at ?? null,
      }));
    }
  }

  return (
    <DashboardClient
      cliente={cliente}
      cuenta={cuenta}
      rendimiento={{ m12: r12, desdeInicio: rAll }}
      equity={equity}
      cashflow={cashflow}
      lastStatement={lastStatement}
      alerts={alerts}
    />
  );
}