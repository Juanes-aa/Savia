import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { despachos, instituciones } from "@/lib/demoData";
import { Card, CardHeader, EstadoBadge } from "./app.index";

export const Route = createFileRoute("/app/despachos")({
  component: Page,
});

const estados = ["Todos", "Preparación", "En camino", "Entregado", "Confirmado"] as const;

function Page() {
  const [filter, setFilter] = useState<(typeof estados)[number]>("Todos");
  const [open, setOpen] = useState(false);
  const filtered = filter === "Todos" ? despachos : despachos.filter((d) => d.estado === filter);

  return (
    <div className="space-y-6 max-w-[1400px]">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="label text-savia mb-2">Operación logística</div>
          <h1 className="font-display font-bold text-[32px] text-raiz">Despachos</h1>
          <p className="text-tinta/65 mt-2 text-[15px]">Trazabilidad de cada lote desde el banco hasta la institución aliada.</p>
        </div>
        <button onClick={() => setOpen(true)} className="rounded-lg bg-savia px-4 py-2.5 text-blanco font-semibold text-[14px] hover:bg-[#22895f] transition-colors">+ Crear despacho</button>
      </header>

      <div className="flex flex-wrap gap-2">
        {estados.map((e) => (
          <button
            key={e}
            onClick={() => setFilter(e)}
            className={`rounded-lg px-3 py-1.5 text-[13px] font-medium border transition-colors ${
              filter === e ? "bg-raiz text-blanco border-raiz" : "bg-white text-tinta/70 border-crema-dark hover:bg-crema"
            }`}
          >
            {e}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader title={`${filtered.length} despachos`} subtitle="Ordenados por fecha" />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="text-left label text-gris border-b border-crema-dark">
                <th className="py-2.5 pr-4">ID</th>
                <th className="py-2.5 pr-4">Institución</th>
                <th className="py-2.5 pr-4">Contenido</th>
                <th className="py-2.5 pr-4 text-right">Kg</th>
                <th className="py-2.5 pr-4">Fecha</th>
                <th className="py-2.5">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id} className="border-b border-crema last:border-0">
                  <td className="py-3.5 pr-4 font-mono text-[13px] text-tinta/70">{d.id}</td>
                  <td className="py-3.5 pr-4 text-tinta font-medium">{d.institucion}</td>
                  <td className="py-3.5 pr-4 text-tinta/75">{d.contenido}</td>
                  <td className="py-3.5 pr-4 text-right font-mono text-raiz">{d.kg}</td>
                  <td className="py-3.5 pr-4 text-tinta/65 font-mono text-[13px]">{d.fecha}</td>
                  <td className="py-3.5"><EstadoBadge estado={d.estado} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-tinta/40 p-4" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-xl shadow-card-hover max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display font-semibold text-[20px] text-raiz">Nuevo despacho</h3>
            <p className="text-[13px] text-gris mt-1">Demo · este formulario no persiste datos.</p>
            <div className="mt-5 space-y-4">
              <Field label="Institución">
                <select className="w-full rounded-lg border border-crema-dark bg-white px-3 py-2.5 text-[14px]">
                  {instituciones.map((i) => <option key={i.id}>{i.nombre}</option>)}
                </select>
              </Field>
              <Field label="Contenido"><input className="w-full rounded-lg border border-crema-dark bg-white px-3 py-2.5 text-[14px]" placeholder="Mercado nutricional · 30 mercados" /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Kg"><input type="number" className="w-full rounded-lg border border-crema-dark bg-white px-3 py-2.5 text-[14px] font-mono" placeholder="300" /></Field>
                <Field label="Fecha estimada"><input type="date" className="w-full rounded-lg border border-crema-dark bg-white px-3 py-2.5 text-[14px] font-mono" /></Field>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="rounded-lg border border-crema-dark px-4 py-2 text-[14px] font-medium text-tinta/70 hover:bg-crema">Cancelar</button>
              <button onClick={() => setOpen(false)} className="rounded-lg bg-savia text-blanco px-4 py-2 text-[14px] font-semibold hover:bg-[#22895f]">Crear</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label text-gris block mb-1.5">{label}</span>
      {children}
    </label>
  );
}
