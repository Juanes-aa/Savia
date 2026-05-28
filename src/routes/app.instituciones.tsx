import { createFileRoute } from "@tanstack/react-router";
import { instituciones } from "@/lib/demoData";
import { Card, CardHeader } from "./app.index";

export const Route = createFileRoute("/app/instituciones")({
  component: Page,
});

function Page() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="label text-savia mb-2">Red operativa</div>
          <h1 className="font-display font-bold text-[32px] text-raiz">Instituciones aliadas</h1>
          <p className="text-tinta/65 mt-2 text-[15px]">{instituciones.length} instituciones activas reciben despachos del banco.</p>
        </div>
        <button className="rounded-lg bg-raiz px-4 py-2.5 text-blanco font-semibold text-[14px] hover:bg-tinta transition-colors">+ Agregar institución</button>
      </header>

      <Card>
        <CardHeader title="Todas las instituciones" subtitle="Filtrar y exportar" />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="text-left label text-gris border-b border-crema-dark">
                <th className="py-2.5 pr-4">ID</th>
                <th className="py-2.5 pr-4">Nombre</th>
                <th className="py-2.5 pr-4">Tipo</th>
                <th className="py-2.5 pr-4">Zona</th>
                <th className="py-2.5 pr-4 text-right">Familias</th>
                <th className="py-2.5 pr-4 text-right">Despachos</th>
                <th className="py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {instituciones.map((i) => (
                <tr key={i.id} className="border-b border-crema last:border-0">
                  <td className="py-3.5 pr-4 font-mono text-[13px] text-tinta/70">{i.id}</td>
                  <td className="py-3.5 pr-4 font-medium text-tinta">{i.nombre}</td>
                  <td className="py-3.5 pr-4">
                    <span className="inline-flex rounded-sm bg-crema px-2 py-0.5 label text-[10px] text-tinta/70">{i.tipo}</span>
                  </td>
                  <td className="py-3.5 pr-4 text-tinta/75">{i.zona}</td>
                  <td className="py-3.5 pr-4 text-right font-mono text-raiz font-semibold">{i.familias}</td>
                  <td className="py-3.5 pr-4 text-right font-mono text-tinta/75">{i.despachos}</td>
                  <td className="py-3.5"><button className="text-[13px] font-medium text-savia hover:underline">Ver historial →</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
