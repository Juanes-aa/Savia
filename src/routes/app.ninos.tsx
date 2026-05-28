import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { ninos, type Nino } from "@/lib/demoData";
import { Card, CardHeader } from "./app.index";

export const Route = createFileRoute("/app/ninos")({
  component: Page,
});

const tones: Record<Nino["estado"], { chip: string; text: string; dot: string }> = {
  Normal: { chip: "bg-savia/15", text: "text-savia", dot: "bg-savia" },
  Riesgo: { chip: "bg-ambar/20", text: "text-ambar", dot: "bg-ambar" },
  Crítico: { chip: "bg-critico/15", text: "text-critico", dot: "bg-critico" },
};

function Page() {
  const [selected, setSelected] = useState<Nino>(ninos[2]);
  return (
    <div className="space-y-6 max-w-[1400px]">
      <header>
        <div className="label text-ambar mb-2">Vista estrella</div>
        <h1 className="font-display font-bold text-[32px] text-raiz">Seguimiento nutricional · &lt; 5 años</h1>
        <p className="text-tinta/65 mt-2 text-[15px]">Mediciones longitudinales con indicadores OMS calculados automáticamente.</p>
      </header>

      <div className="grid grid-cols-3 gap-4">
        <SummaryCard tone="Normal" count={ninos.filter((n) => n.estado === "Normal").length} />
        <SummaryCard tone="Riesgo" count={ninos.filter((n) => n.estado === "Riesgo").length} />
        <SummaryCard tone="Crítico" count={ninos.filter((n) => n.estado === "Crítico").length} />
      </div>

      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6">
        <Card>
          <CardHeader title="Niños registrados" subtitle="Seleccione para ver detalle" />
          <ul className="mt-4 divide-y divide-crema">
            {ninos.map((n) => {
              const t = tones[n.estado];
              const active = selected.id === n.id;
              return (
                <li key={n.id}>
                  <button
                    onClick={() => setSelected(n)}
                    className={`w-full text-left py-3 px-2 -mx-2 rounded-lg flex items-center gap-3 transition-colors ${active ? "bg-crema" : "hover:bg-crema/60"}`}
                  >
                    <span className={`h-2 w-2 rounded-full ${t.dot}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-medium text-tinta">{n.nombre}</div>
                      <div className="text-[12px] text-gris">{n.edadMeses} meses · {n.sexo === "F" ? "Niña" : "Niño"}</div>
                    </div>
                    <span className={`label text-[10px] ${t.text}`}>{n.estado}</span>
                    <span className="font-mono text-[12px] text-tinta/60 w-12 text-right">{n.zScore.toFixed(1)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="label text-savia">Detalle</div>
              <h2 className="font-display font-bold text-[24px] text-raiz mt-1">{selected.nombre}</h2>
              <div className="text-[13px] text-gris mt-1">{selected.edadMeses} meses · Familia {selected.familia}</div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-md ${tones[selected.estado].chip} ${tones[selected.estado].text} px-3 py-1 label text-[11px]`}>
                <span className={`h-1.5 w-1.5 rounded-full ${tones[selected.estado].dot}`} />
                {selected.estado}
              </span>
              <div className="text-right">
                <div className="label text-gris">Z-score peso/edad</div>
                <div className={`font-mono font-bold text-[28px] leading-none ${tones[selected.estado].text}`}>{selected.zScore.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {selected.estado === "Crítico" && (
            <div className="mt-4 rounded-lg border border-critico/30 bg-critico/5 p-3 flex items-start gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-critico mt-2" />
              <div className="text-[13px] text-critico/90">
                <span className="font-semibold">Alerta crítica:</span> Z-score por debajo del umbral OMS (−2). Caso remitido a centro de salud.
              </div>
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 gap-4">
            <MiniChart data={selected.mediciones} k="peso" label="Peso (kg)" color="#1E7B5B" />
            <MiniChart data={selected.mediciones} k="talla" label="Talla (cm)" color="#E8A940" />
          </div>

          <div className="mt-6">
            <div className="label text-gris mb-2">Histórico de mediciones</div>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="text-left label text-gris border-b border-crema-dark">
                    <th className="py-2 pr-3">Fecha</th>
                    <th className="py-2 pr-3 text-right">Peso</th>
                    <th className="py-2 pr-3 text-right">Talla</th>
                    <th className="py-2 pr-3 text-right">PB</th>
                    <th className="py-2">Observación</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.mediciones.map((m) => (
                    <tr key={m.fecha} className="border-b border-crema last:border-0">
                      <td className="py-2.5 pr-3 font-mono text-tinta/70">{m.fecha}</td>
                      <td className="py-2.5 pr-3 text-right font-mono text-tinta">{m.peso}</td>
                      <td className="py-2.5 pr-3 text-right font-mono text-tinta">{m.talla}</td>
                      <td className="py-2.5 pr-3 text-right font-mono text-tinta">{m.pb}</td>
                      <td className="py-2.5 text-tinta/65">{m.obs ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function SummaryCard({ tone, count }: { tone: Nino["estado"]; count: number }) {
  const t = tones[tone];
  return (
    <div className="rounded-xl border border-crema-dark bg-white p-5 shadow-card">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${t.dot}`} />
        <span className={`label ${t.text}`}>{tone}</span>
      </div>
      <div className="font-mono font-bold text-[40px] leading-none text-raiz mt-3">{count}</div>
      <div className="label text-gris mt-3">niños</div>
    </div>
  );
}

function MiniChart({ data, k, label, color }: { data: { fecha: string; peso: number; talla: number }[]; k: "peso" | "talla"; label: string; color: string }) {
  return (
    <div className="rounded-lg border border-crema bg-crema/40 p-3">
      <div className="label text-gris">{label}</div>
      <div className="h-[120px] mt-2">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 4, right: 6, left: -28, bottom: 0 }}>
            <CartesianGrid stroke="#EBE8E1" vertical={false} />
            <XAxis dataKey="fecha" hide />
            <YAxis stroke="#6B7280" fontSize={10} tickLine={false} axisLine={false} domain={["dataMin - 0.5", "dataMax + 0.5"]} />
            <Tooltip contentStyle={{ borderRadius: 6, border: "1px solid #D9D5CB", fontFamily: "Inter", fontSize: 12 }} />
            <Line type="monotone" dataKey={k} stroke={color} strokeWidth={2.5} dot={{ r: 3, fill: color }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
