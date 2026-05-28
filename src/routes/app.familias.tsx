import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { familias, instituciones } from "@/lib/demoData";
import { Card, CardHeader } from "./app.index";

export const Route = createFileRoute("/app/familias")({
  component: Page,
});

function Page() {
  const [inst, setInst] = useState<string>("Todas");
  const [cond, setCond] = useState<string>("Todas");
  const condiciones = Array.from(new Set(familias.map((f) => f.condicion)));
  const filtered = familias.filter((f) => (inst === "Todas" || f.institucion === inst) && (cond === "Todas" || f.condicion === cond));

  return (
    <div className="space-y-6 max-w-[1400px]">
      <header>
        <div className="label text-savia mb-2">Caracterización</div>
        <h1 className="font-display font-bold text-[32px] text-raiz">Familias beneficiarias</h1>
        <p className="text-tinta/65 mt-2 text-[15px]">Registro de las familias atendidas por cada institución aliada vía bot.</p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Familias totales" value={familias.length.toString()} />
        <Stat label="Personas atendidas" value={familias.reduce((a, b) => a + b.integrantes, 0).toString()} />
        <Stat label="Menores < 5 años" value={familias.reduce((a, b) => a + b.menores, 0).toString()} />
        <Stat label="Gestantes" value={familias.filter((f) => f.condicion === "Gestante").length.toString()} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Select label="Institución" value={inst} onChange={setInst} options={["Todas", ...instituciones.map((i) => i.nombre)]} />
        <Select label="Condición" value={cond} onChange={setCond} options={["Todas", ...condiciones]} />
      </div>

      <Card>
        <CardHeader title={`${filtered.length} familias`} subtitle="Registradas vía bot conversacional" />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="text-left label text-gris border-b border-crema-dark">
                <th className="py-2.5 pr-4">ID</th>
                <th className="py-2.5 pr-4">Jefe de hogar</th>
                <th className="py-2.5 pr-4 text-right">Integrantes</th>
                <th className="py-2.5 pr-4 text-right">Menores</th>
                <th className="py-2.5 pr-4">Condición</th>
                <th className="py-2.5">Institución</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f.id} className="border-b border-crema last:border-0">
                  <td className="py-3.5 pr-4 font-mono text-[13px] text-tinta/70">{f.id}</td>
                  <td className="py-3.5 pr-4 font-medium text-tinta">{f.jefe}</td>
                  <td className="py-3.5 pr-4 text-right font-mono text-tinta">{f.integrantes}</td>
                  <td className="py-3.5 pr-4 text-right font-mono text-raiz font-semibold">{f.menores}</td>
                  <td className="py-3.5 pr-4">
                    <span className="inline-flex rounded-sm bg-crema px-2 py-0.5 label text-[10px] text-tinta/70">{f.condicion}</span>
                  </td>
                  <td className="py-3.5 text-tinta/75">{f.institucion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-crema-dark bg-white p-5 shadow-card">
      <div className="label text-gris">{label}</div>
      <div className="font-mono font-bold text-[36px] leading-none text-raiz mt-2">{value}</div>
    </div>
  );
}
function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="flex items-center gap-2 text-[13px]">
      <span className="label text-gris">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="rounded-lg border border-crema-dark bg-white px-3 py-1.5 text-[13px]">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}
