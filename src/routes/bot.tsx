import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/bot")({
  head: () => ({ meta: [{ title: "Savia · Bot institución" }] }),
  component: BotPage,
});

type Msg = { from: "bot" | "user"; text: string; ts: string; quick?: string[] };

const initial: Msg[] = [
  {
    from: "bot",
    text: "Hola Parroquia San Judas 👋\n\nTienes un despacho en camino:\n📦 Lote D-2240 · 35 mercados nutricionales · 420 kg\nLlegada estimada: hoy 3:00 pm",
    ts: "10:42",
    quick: ["Confirmar recepción", "Registrar familia", "Ver historial"],
  },
];

function nowTs() {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

function BotPage() {
  const [msgs, setMsgs] = useState<Msg[]>(initial);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 999999, behavior: "smooth" });
  }, [msgs, thinking]);

  function send(text: string) {
    const userMsg: Msg = { from: "user", text, ts: nowTs() };
    setMsgs((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setMsgs((m) => [...m, botReply(text)]);
    }, 900);
  }

  return (
    <div className="min-h-screen bg-blanco">
      {/* nav */}
      <header className="root-texture text-blanco">
        <div className="mx-auto max-w-6xl px-6 lg:px-10 h-[64px] flex items-center justify-between">
          <Link to="/" className="text-blanco/80 hover:text-blanco text-[14px] flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
            Volver a Savia
          </Link>
          <span className="label text-blanco/70">Simulador · bot conversacional</span>
          <Link to="/app" className="text-[14px] text-blanco/80 hover:text-blanco">Vista del banco →</Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 lg:px-10 py-12 grid lg:grid-cols-[1fr_380px] gap-10 items-start">
        {/* Phone */}
        <div className="mx-auto w-full max-w-[420px]">
          <div className="rounded-[40px] border-[10px] border-tinta bg-tinta shadow-card-hover overflow-hidden">
            <div className="bg-[#075E54] text-white">
              <div className="px-4 pt-3 pb-2 flex items-center justify-between text-[11px] font-mono opacity-80">
                <span>{nowTs()}</span>
                <span>● ● ●</span>
              </div>
              <div className="px-4 py-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-savia grid place-items-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F6F4EF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V11"/><path d="M12 11c0-4 3-7 8-7 0 4-3 7-8 7Z"/><path d="M12 14c0-3-2.5-5-6-5 0 3 2.5 5 6 5Z"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[15px]">Savia · bot</div>
                  <div className="text-[11px] opacity-75">en línea · responde al instante</div>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>
              </div>
            </div>

            <div ref={scrollRef} className="bg-[#ECE5DD] h-[520px] overflow-y-auto px-3 py-4 space-y-2">
              {msgs.map((m, i) => <Bubble key={i} m={m} onQuick={send} />)}
              {thinking && (
                <div className="flex">
                  <div className="bg-white rounded-lg px-3 py-2 shadow-sm">
                    <div className="flex gap-1 items-center h-4">
                      <Dot /><Dot d=".15s" /><Dot d=".3s" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#F0F0F0] px-3 py-2 flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && input.trim() && send(input.trim())}
                placeholder="Escribe un mensaje"
                className="flex-1 rounded-full bg-white px-4 py-2 text-[14px] outline-none"
              />
              <button
                onClick={() => input.trim() && send(input.trim())}
                className="h-9 w-9 rounded-full bg-[#075E54] grid place-items-center text-white"
                aria-label="Enviar"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4 20-7Z"/></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Explain */}
        <aside className="space-y-6">
          <div>
            <div className="label text-savia mb-2">Cómo funciona</div>
            <h2 className="font-display font-bold text-[26px] text-raiz leading-tight">
              El bot que reemplaza la planilla en papel
            </h2>
            <p className="mt-3 text-[15px] leading-[1.6] text-tinta/75">
              Las instituciones aliadas no necesitan instalar una app. Reciben notificaciones de despacho, confirman recepción y registran familias por WhatsApp.
            </p>
          </div>
          <ul className="space-y-3 text-[14px] text-tinta/80">
            {[
              "Notifica cuando hay un despacho en camino",
              "Recibe confirmación con un solo toque",
              "Registra familias y mediciones de niños",
              "Datos suben en tiempo real al panel del banco",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <svg className="mt-0.5 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E7B5B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                {t}
              </li>
            ))}
          </ul>
          <div className="rounded-xl border border-crema-dark bg-crema/50 p-5 text-[13px] text-tinta/75">
            <div className="label text-ambar mb-2">Demo</div>
            Esta simulación replica el flujo de WhatsApp. En producción se conecta a WhatsApp Business API (fase 2).
          </div>
        </aside>
      </div>
    </div>
  );
}

function Bubble({ m, onQuick }: { m: Msg; onQuick: (t: string) => void }) {
  const isBot = m.from === "bot";
  return (
    <div className={`flex ${isBot ? "" : "justify-end"}`}>
      <div className={`max-w-[80%] rounded-lg px-3 py-2 text-[14px] leading-snug shadow-sm whitespace-pre-line ${isBot ? "bg-white text-tinta rounded-tl-sm" : "bg-[#DCF8C6] text-tinta rounded-tr-sm"}`}>
        {m.text}
        {m.quick && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {m.quick.map((q) => (
              <button key={q} onClick={() => onQuick(q)} className="rounded-full border border-savia/40 text-savia bg-savia/5 hover:bg-savia/15 px-2.5 py-1 text-[12px] font-medium">
                {q}
              </button>
            ))}
          </div>
        )}
        <div className="text-[10px] text-tinta/40 text-right mt-1">{m.ts}</div>
      </div>
    </div>
  );
}

function Dot({ d = "0s" }: { d?: string }) {
  return <span className="h-1.5 w-1.5 rounded-full bg-tinta/30 animate-bounce" style={{ animationDelay: d }} />;
}

function botReply(text: string): Msg {
  const t = text.toLowerCase();
  const ts = nowTs();
  if (t.includes("confirm")) {
    return {
      from: "bot",
      text: "✅ Recepción confirmada del lote D-2240.\n\n¿Quieres asociarlo a las familias que reciben hoy?",
      ts,
      quick: ["Registrar familia", "Asociar familia existente", "Después"],
    };
  }
  if (t.includes("registr") && t.includes("famil")) {
    return {
      from: "bot",
      text: "📋 Registremos una familia nueva.\n\nEscribe el nombre del jefe de hogar.",
      ts,
      quick: ["María Restrepo", "Carlos Ospina"],
    };
  }
  if (t.includes("maría") || t.includes("maria") || t.includes("carlos") || t.includes("ospina") || t.includes("restrepo")) {
    return {
      from: "bot",
      text: `Familia registrada: *${text}*.\n\n¿Cuántos integrantes son?`,
      ts,
      quick: ["3", "4", "5", "6"],
    };
  }
  if (/^\d+$/.test(text.trim())) {
    return {
      from: "bot",
      text: `Anotado: ${text} integrantes.\n\n¿Hay niños menores de 5 años?`,
      ts,
      quick: ["Sí, 1", "Sí, 2", "No"],
    };
  }
  if (t.startsWith("sí") || t.startsWith("si")) {
    return {
      from: "bot",
      text: "Perfecto. ¿Quieres registrar el peso y la talla del niño ahora?\n(Es opcional, también lo puedes hacer luego)",
      ts,
      quick: ["Registrar peso/talla", "Más tarde"],
    };
  }
  if (t.includes("peso") || t.includes("talla")) {
    return {
      from: "bot",
      text: "📐 Envía el peso en kg y la talla en cm separados por coma.\nEj: 9.6, 75",
      ts,
    };
  }
  if (t.includes("histor")) {
    return {
      from: "bot",
      text: "🗂 En el último mes recibiste 4 despachos · 1.180 kg · 35 familias atendidas.\n\n¿Quieres ver el detalle de algún despacho?",
      ts,
      quick: ["D-2240", "D-2231", "Volver"],
    };
  }
  if (t.includes("d-22")) {
    return {
      from: "bot",
      text: `Detalle ${text.toUpperCase()}:\n• 420 kg mercado nutricional\n• Entregado el 26/05\n• Asociado a 35 familias\n\nReporte completo disponible en el panel del banco.`,
      ts,
      quick: ["Registrar familia", "Confirmar recepción"],
    };
  }
  return {
    from: "bot",
    text: "Recibido ✅. ¿Qué quieres hacer ahora?",
    ts,
    quick: ["Confirmar recepción", "Registrar familia", "Ver historial"],
  };
}
