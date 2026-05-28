import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { despachos, instituciones, ninos, despachosPorMes } from "@/lib/demoData";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

function Dashboard() {
  const niñosCriticos = ninos.filter((n) => n.estado === "Crítico").length;
  const niñosRiesgo = ninos.filter((n) => n.estado === "Riesgo").length;
  const totalFamilias = instituciones.reduce((a, b) => a + b.familias, 0);

  return (
    <div className="space-y-8 max-w-[1400px]">
      <header>
        <div className="label text-savia mb-2">Vista general</div>
        <h1 className="font-display font-bold text-[32px] text-raiz leading-tight">Impacto del mes</h1>
        <p className="text-tinta/65 mt-2 text-[15px]">Datos consolidados de mayo de 2026 · Actualizado hace 3 minutos.</p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Metric label="Instituciones activas" value={String(instituciones.length)} hint="+1 vs mes anterior" tone="ok" />
        <Metric label="Despachos del mes" value="218" hint="+10.6%" tone="ok" />
        <Metric label="Familias beneficiadas" value={totalFamilias.toLocaleString("es-CO")} hint="+38 nuevas" tone="ok" />
        <Metric label="Niños < 5 años" value={String(ninos.length * 24)} hint={`${niñosCriticos} críticos · ${niñosRiesgo} en riesgo`} tone={niñosCriticos > 0 ? "crit" : "warn"} />
      </div>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6">
        <Card>
          <CardHeader title="Evolución de despachos" subtitle="Últimos 6 meses" right={<Badge>+14% vs Q1</Badge>} />
          <div className="h-[260px] mt-4">
            <ResponsiveContainer>
              <AreaChart data={despachosPorMes} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1E7B5B" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#1E7B5B" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#EBE8E1" vertical={false} />
                <XAxis dataKey="mes" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #D9D5CB", fontFamily: "Inter" }} />
                <Area type="monotone" dataKey="v" stroke="#1E7B5B" strokeWidth={2.5} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Top instituciones" subtitle="Por familias atendidas" />
          <ul className="mt-4 space-y-3">
            {[...instituciones].sort((a, b) => b.familias - a.familias).slice(0, 5).map((i, idx) => (
              <li key={i.id} className="flex items-center gap-3">
                <span className="font-mono font-bold text-[14px] text-ambar w-5">{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-medium text-tinta truncate">{i.nombre}</div>
                  <div className="h-1.5 bg-crema rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-savia rounded-full" style={{ width: `${(i.familias / 70) * 100}%` }} />
                  </div>
                </div>
                <span className="font-mono font-bold text-[13px] text-raiz">{i.familias}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <CardHeader title="Últimos despachos" subtitle="Estado en tiempo real" right={<Link to="/app/despachos" className="text-[13px] text-savia font-medium hover:underline">Ver todos →</Link>} />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="text-left label text-gris border-b border-crema-dark">
                <th className="py-2.5 pr-4">ID</th>
                <th className="py-2.5 pr-4">Institución</th>
                <th className="py-2.5 pr-4">Contenido</th>
                <th className="py-2.5 pr-4">Kg</th>
                <th className="py-2.5 pr-4">Fecha</th>
                <th className="py-2.5">Estado</th>
              </tr>
            </thead>
            <tbody>
              {despachos.slice(0, 5).map((d) => (
                <tr key={d.id} className="border-b border-crema last:border-0">
                  <td className="py-3 pr-4 font-mono text-[13px] text-tinta/70">{d.id}</td>
                  <td className="py-3 pr-4 text-tinta">{d.institucion}</td>
                  <td className="py-3 pr-4 text-tinta/75">{d.contenido}</td>
                  <td className="py-3 pr-4 font-mono text-tinta">{d.kg}</td>
                  <td className="py-3 pr-4 text-tinta/65 font-mono text-[13px]">{d.fecha}</td>
                  <td className="py-3"><EstadoBadge estado={d.estado} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Metric({ label, value, hint, tone }: { label: string; value: string; hint: string; tone: "ok" | "warn" | "crit" }) {
  const c = tone === "ok" ? "text-savia" : tone === "warn" ? "text-ambar" : "text-critico";
  return (
    <div className="rounded-xl border border-crema-dark bg-white p-5 shadow-card">
      <div className="label text-gris">{label}</div>
      <div className="font-mono font-bold text-[42px] leading-none text-raiz mt-3">{value}</div>
      <div className={`mt-3 text-[12px] font-medium ${c}`}>{hint}</div>
    </div>
  );
}
export function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-crema-dark bg-white p-6 shadow-card">{children}</div>;
}
export function CardHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="font-display font-semibold text-[18px] text-raiz">{title}</h2>
        {subtitle && <div className="text-[13px] text-gris mt-1">{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}
export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-1.5 rounded-sm bg-savia/15 px-2 py-0.5 label text-[10px] text-savia">{children}</span>;
}
export function EstadoBadge({ estado }: { estado: string }) {
  const map: Record<string, { bg: string; tx: string }> = {
    Preparación: { bg: "bg-crema", tx: "text-tinta/70" },
    "En camino": { bg: "bg-ambar/15", tx: "text-ambar" },
    Entregado: { bg: "bg-savia/15", tx: "text-savia" },
    Confirmado: { bg: "bg-raiz/10", tx: "text-raiz" },
  };
  const s = map[estado] ?? map.Preparación;
  return <span className={`inline-flex items-center gap-1.5 rounded-sm ${s.bg} ${s.tx} px-2 py-1 label text-[10px]`}>{estado}</span>;
}
