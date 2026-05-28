import { createFileRoute } from "@tanstack/react-router";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { despachosPorMes, ninos } from "@/lib/demoData";
import { Card, CardHeader } from "./app.index";

export const Route = createFileRoute("/app/reportes")({
  component: Page,
});

function Page() {
  const dist = [
    { name: "Normal", value: ninos.filter((n) => n.estado === "Normal").length, color: "#1E7B5B" },
    { name: "Riesgo", value: ninos.filter((n) => n.estado === "Riesgo").length, color: "#E8A940" },
    { name: "Crítico", value: ninos.filter((n) => n.estado === "Crítico").length, color: "#C0392B" },
  ];

  return (
    <div className="space-y-6 max-w-[1400px]">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="label text-savia mb-2">Impacto auditable</div>
          <h1 className="font-display font-bold text-[32px] text-raiz">Reportes</h1>
          <p className="text-tinta/65 mt-2 text-[15px]">Reportes operativos y nutricionales listos para compartir con donantes.</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-lg border border-crema-dark px-4 py-2.5 text-[14px] font-medium text-tinta hover:bg-crema">Exportar Excel</button>
          <button className="rounded-lg bg-raiz px-4 py-2.5 text-blanco font-semibold text-[14px] hover:bg-tinta">Exportar PDF</button>
        </div>
      </header>

      <div className="flex flex-wrap gap-3">
        <Filter label="Desde"><input type="date" defaultValue="2026-01-01" className="rounded-lg border border-crema-dark px-3 py-1.5 text-[13px] font-mono" /></Filter>
        <Filter label="Hasta"><input type="date" defaultValue="2026-05-28" className="rounded-lg border border-crema-dark px-3 py-1.5 text-[13px] font-mono" /></Filter>
        <Filter label="Institución">
          <select className="rounded-lg border border-crema-dark px-3 py-1.5 text-[13px]">
            <option>Todas</option>
          </select>
        </Filter>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Despachos por mes" subtitle="Volumen operativo" />
          <div className="h-[280px] mt-4">
            <ResponsiveContainer>
              <BarChart data={despachosPorMes} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#EBE8E1" vertical={false} />
                <XAxis dataKey="mes" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #D9D5CB", fontFamily: "Inter" }} />
                <Bar dataKey="v" fill="#0F3D2E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Estado nutricional · menores 5 años" subtitle="Distribución según OMS" />
          <div className="h-[280px] mt-4 grid grid-cols-[1fr_1fr] items-center">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={dist} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                  {dist.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #D9D5CB", fontFamily: "Inter" }} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="space-y-3">
              {dist.map((d) => (
                <li key={d.name} className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-[14px] text-tinta flex-1">{d.name}</span>
                  <span className="font-mono font-bold text-raiz">{d.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Plantillas disponibles" subtitle="Generadas con el branding de Savia" />
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { t: "Reporte de impacto · Donante", d: "PDF · 12 páginas · KPIs operativos y nutricionales." },
            { t: "Resumen operativo mensual", d: "Excel · despachos, kg, instituciones y familias." },
            { t: "Seguimiento nutricional individual", d: "PDF por niño · histórico, gráficas, Z-scores." },
          ].map((r) => (
            <div key={r.t} className="rounded-lg border border-crema-dark bg-crema/40 p-5 hover:bg-crema transition-colors cursor-pointer">
              <div className="font-display font-semibold text-[16px] text-raiz">{r.t}</div>
              <div className="text-[13px] text-tinta/70 mt-2">{r.d}</div>
              <button className="mt-4 text-[13px] text-savia font-medium hover:underline">Generar →</button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Filter({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-2">
      <span className="label text-gris">{label}</span>
      {children}
    </label>
  );
}
