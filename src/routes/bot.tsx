import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/bot")({
  head: () => ({ meta: [{ title: "Savia · Bot institución" }] }),
  component: BotPage,
});

type Status = "sending" | "sent" | "read";
type Msg = {
  id: number;
  from: "bot" | "user";
  text: string;
  ts: string;
  status?: Status;
  quick?: string[];
};

let _id = 0;
const uid = () => ++_id;

const initial: Msg[] = [
  {
    id: uid(),
    from: "bot",
    text: "Hola Parroquia San Judas 👋\n\nTienes un despacho en camino:\n📦 *Lote D-2240* · 35 mercados nutricionales · 420 kg\nLlegada estimada: hoy 3:00 pm",
    ts: "10:42",
    quick: ["Confirmar recepción", "Registrar familia", "Ver historial"],
  },
];

function nowTs() {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

function formatText(text: string) {
  return text.split("\n").map((line, i) => {
    const parts = line.split(/(\*[^*]+\*)/g).map((part, j) =>
      part.startsWith("*") && part.endsWith("*")
        ? <strong key={j}>{part.slice(1, -1)}</strong>
        : part
    );
    return <span key={i}>{parts}{i < text.split("\n").length - 1 && <br />}</span>;
  });
}

function BotPage() {
  const [msgs, setMsgs] = useState<Msg[]>(initial);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const announcerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 999999, behavior: "smooth" });
  }, [msgs, thinking]);

  function announce(text: string) {
    if (announcerRef.current) announcerRef.current.textContent = text;
  }

  function send(text: string) {
    const msgId = uid();
    const userMsg: Msg = { id: msgId, from: "user", text, ts: nowTs(), status: "sending" };
    setMsgs((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);

    // Mark as sent after brief delay
    setTimeout(() => {
      setMsgs((m) => m.map((msg) => msg.id === msgId ? { ...msg, status: "sent" } : msg));
    }, 300);

    setTimeout(() => {
      const reply = botReply(text);
      setThinking(false);
      setMsgs((m) => [
        ...m.map((msg) => msg.id === msgId ? { ...msg, status: "read" } : msg),
        reply,
      ]);
      announce(`Savia bot: ${reply.text.replace(/\n/g, " ").substring(0, 80)}`);
      setTimeout(() => inputRef.current?.focus(), 50);
    }, 1100);
  }

  const canSend = input.trim().length > 0 && !thinking;

  return (
    <div className="min-h-screen bg-blanco">
      {/* Screen reader announcer */}
      <div
        ref={announcerRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      {/* Nav */}
      <header className="root-texture text-blanco">
        <div className="mx-auto max-w-6xl px-6 lg:px-10 h-[64px] flex items-center justify-between">
          <Link
            to="/"
            className="text-blanco/80 hover:text-blanco text-[14px] flex items-center gap-2 transition-colors"
            aria-label="Volver a Savia"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Volver
          </Link>
          <span className="label text-blanco/70" aria-label="Simulador de bot conversacional">
            Simulador · bot conversacional
          </span>
          <Link
            to="/app"
            className="text-[14px] text-blanco/80 hover:text-blanco transition-colors"
          >
            Vista del banco →
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 lg:px-10 py-12 grid lg:grid-cols-[1fr_360px] gap-12 items-start">

        {/* Phone mockup */}
        <div className="mx-auto w-full max-w-[400px]" role="region" aria-label="Simulador de WhatsApp">
          <div className="rounded-[44px] border-[11px] border-tinta bg-tinta shadow-[0_32px_64px_rgba(15,61,46,0.28)] overflow-hidden">

            {/* Status bar */}
            <div className="bg-[#075E54] px-5 pt-2.5 pb-0 flex items-center justify-between">
              <span className="text-white text-[11px] font-semibold tabular-nums" aria-hidden="true">{nowTs()}</span>
              <div className="flex items-center gap-1.5" aria-hidden="true">
                {/* Signal */}
                <svg width="15" height="11" viewBox="0 0 15 11" fill="white" opacity="0.9">
                  <rect x="0" y="7" width="2.5" height="4" rx="0.5"/>
                  <rect x="4" y="5" width="2.5" height="6" rx="0.5"/>
                  <rect x="8" y="2.5" width="2.5" height="8.5" rx="0.5"/>
                  <rect x="12" y="0" width="2.5" height="11" rx="0.5"/>
                </svg>
                {/* Wifi */}
                <svg width="15" height="11" viewBox="0 0 24 18" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.9">
                  <path d="M1 6C5.3 1.8 10.4 0 12 0s6.7 1.8 11 6"/>
                  <path d="M4 10c2.2-2.5 4.9-4 8-4s5.8 1.5 8 4"/>
                  <path d="M7.5 14c1.2-1.5 2.8-2 4.5-2s3.3.5 4.5 2"/>
                  <circle cx="12" cy="18" r="1.5" fill="white" stroke="none"/>
                </svg>
                {/* Battery */}
                <svg width="22" height="11" viewBox="0 0 22 11" fill="none" opacity="0.9">
                  <rect x="0.5" y="0.5" width="18" height="10" rx="2.5" stroke="white" strokeWidth="1"/>
                  <rect x="19.5" y="3.5" width="2" height="4" rx="1" fill="white"/>
                  <rect x="2" y="2" width="14" height="7" rx="1.5" fill="white"/>
                </svg>
              </div>
            </div>

            {/* WA Header */}
            <div className="bg-[#075E54] px-3 py-2.5 flex items-center gap-3">
              <button
                className="text-white/80 hover:text-white p-1 -ml-1 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Volver a chats"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
              <div className="relative">
                <div className="h-9 w-9 rounded-full bg-[#1E7B5B] flex items-center justify-center shadow-sm" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F6F4EF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22V11"/>
                    <path d="M12 11c0-4 3-7 8-7 0 4-3 7-8 7Z"/>
                    <path d="M12 14c0-3-2.5-5-6-5 0 3 2.5 5 6 5Z"/>
                  </svg>
                </div>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#4ADE80] border-2 border-[#075E54]" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white text-[15px] leading-tight">Savia · bot</div>
                <div className="text-[11px] text-white/75 flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#4ADE80]" aria-hidden="true"/>
                  en línea
                </div>
              </div>
              <div className="flex items-center gap-1" aria-hidden="true">
                <button className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Videollamada (no disponible en demo)">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2"/>
                  </svg>
                </button>
                <button className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Llamada (no disponible en demo)">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.13 11.7 19.79 19.79 0 0 1 1.06 3 2 2 0 0 1 3.04.99h3a2 2 0 0 1 2 1.72c.128 1.006.362 1.996.7 2.95a2 2 0 0 1-.45 2.11L7.09 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.954.338 1.944.572 2.95.7A2 2 0 0 1 22 16.92Z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Chat area */}
            <div
              ref={scrollRef}
              role="log"
              aria-label="Conversación con Savia bot"
              aria-live="polite"
              className="h-[500px] overflow-y-auto px-3 py-3 space-y-1"
              style={{
                background: "#E5DDD5",
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8bdb5' fill-opacity='0.18'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            >
              {/* Date separator */}
              <div className="flex justify-center my-2" aria-hidden="true">
                <span className="bg-[#E1F2FB]/90 text-[#54656F] text-[11.5px] px-3 py-1 rounded-full shadow-sm font-medium">
                  Hoy
                </span>
              </div>

              {msgs.map((m) => (
                <Bubble key={m.id} m={m} onQuick={send} thinking={thinking} />
              ))}

              {thinking && (
                <div className="flex items-end gap-1.5" role="status" aria-label="Savia bot está escribiendo">
                  <div className="h-7 w-7 rounded-full bg-[#1E7B5B] flex items-center justify-center shrink-0 mb-0.5" aria-hidden="true">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F6F4EF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22V11"/>
                      <path d="M12 11c0-4 3-7 8-7 0 4-3 7-8 7Z"/>
                      <path d="M12 14c0-3-2.5-5-6-5 0 3 2.5 5 6 5Z"/>
                    </svg>
                  </div>
                  <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                    <div className="flex gap-1 items-center h-4" aria-hidden="true">
                      <Dot /><Dot d=".2s" /><Dot d=".4s" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input bar */}
            <div className="bg-[#F0F2F5] px-2 py-2 flex items-end gap-2">
              <button
                className="h-10 w-10 rounded-full text-[#54656F] hover:bg-[#D1D7DB]/60 flex items-center justify-center transition-colors shrink-0"
                aria-label="Adjuntar archivo (no disponible en demo)"
                tabIndex={-1}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
              </button>

              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && canSend && send(input.trim())}
                  placeholder="Escribe un mensaje"
                  disabled={thinking}
                  className="w-full rounded-3xl bg-white px-4 py-2.5 text-[14px] text-tinta outline-none placeholder:text-[#54656F]/70 disabled:opacity-60 transition-opacity resize-none leading-snug"
                  aria-label="Escribe un mensaje para el bot"
                  aria-disabled={thinking}
                  autoComplete="off"
                />
              </div>

              <button
                onClick={() => canSend ? send(input.trim()) : undefined}
                disabled={!canSend}
                className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  canSend
                    ? "bg-[#00A884] hover:bg-[#008f72] text-white shadow-sm scale-100"
                    : "bg-[#00A884] text-white"
                }`}
                aria-label={canSend ? "Enviar mensaje" : "Mantén presionado para mensaje de voz (no disponible en demo)"}
              >
                {canSend ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m22 2-7 20-4-9-9-4 20-7Z"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="22"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Demo hint */}
          <p className="text-center text-[12px] text-tinta/40 mt-4" aria-label="Indicación de demo">
            Demo interactivo · escribe o usa los botones de respuesta rápida
          </p>
        </div>

        {/* Explanation panel */}
        <aside className="space-y-7 lg:pt-4" aria-labelledby="how-it-works-heading">
          <div>
            <div className="label text-savia mb-2">Cómo funciona</div>
            <h2 id="how-it-works-heading" className="font-display font-bold text-[26px] text-raiz leading-tight">
              El bot que reemplaza<br/>la planilla en papel
            </h2>
            <p className="mt-3 text-[15px] leading-[1.7] text-tinta/70">
              Las instituciones aliadas no necesitan instalar una app. Reciben notificaciones de despacho, confirman recepción y registran familias directamente por WhatsApp.
            </p>
          </div>

          <ul className="space-y-3.5" aria-label="Funcionalidades del bot">
            {[
              { icon: "📦", text: "Notifica cuando hay un despacho en camino" },
              { icon: "✅", text: "Recibe confirmación de recepción con un toque" },
              { icon: "👨‍👩‍👧", text: "Registra familias y mediciones de niños" },
              { icon: "📊", text: "Los datos suben en tiempo real al panel del banco" },
              { icon: "🔒", text: "Sin apps ni contraseñas — solo WhatsApp" },
            ].map(({ icon, text }) => (
              <li key={text} className="flex gap-3 items-start text-[14px] text-tinta/80">
                <span className="text-[16px] mt-0.5 shrink-0" aria-hidden="true">{icon}</span>
                {text}
              </li>
            ))}
          </ul>

          <div className="space-y-3">
            <div className="label text-tinta/50 mb-1">Flujos disponibles en este demo</div>
            {[
              { label: "Confirmar recepción de despacho", cmd: "Confirmar recepción" },
              { label: "Registrar nueva familia", cmd: "Registrar familia" },
              { label: "Ver historial de despachos", cmd: "Ver historial" },
              { label: "Registrar peso y talla de un niño", cmd: "Registrar peso/talla" },
            ].map(({ label, cmd }) => (
              <button
                key={cmd}
                onClick={() => !thinking && send(cmd)}
                disabled={thinking}
                className="w-full text-left rounded-xl border border-crema-dark bg-crema/60 hover:bg-crema px-4 py-3 text-[13px] text-tinta/80 hover:text-tinta transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={`Iniciar flujo: ${label}`}
              >
                <span className="font-medium text-raiz">{label}</span>
                <span className="text-tinta/40 ml-2 font-mono text-[11px]">→ «{cmd}»</span>
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-savia/20 bg-savia/5 p-4 text-[13px] text-tinta/70 leading-relaxed">
            <div className="label text-ambar mb-2">Fase 2 · producción</div>
            En producción se conecta a la <strong className="text-tinta/90">WhatsApp Business API</strong>. Las instituciones reciben mensajes reales, sin necesidad de esta interfaz.
          </div>
        </aside>
      </div>
    </div>
  );
}

// ─── Bubble ───────────────────────────────────────────────────────────────────

function Bubble({ m, onQuick, thinking }: { m: Msg; onQuick: (t: string) => void; thinking: boolean }) {
  const isBot = m.from === "bot";
  return (
    <article
      className={`flex items-end gap-1.5 ${isBot ? "" : "justify-end"} animate-in fade-in slide-in-from-bottom-1 duration-200`}
      aria-label={`${isBot ? "Savia bot" : "Tú"}: ${m.text}`}
    >
      {isBot && (
        <div className="h-7 w-7 rounded-full bg-[#1E7B5B] flex items-center justify-center shrink-0 mb-0.5" aria-hidden="true">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F6F4EF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22V11"/>
            <path d="M12 11c0-4 3-7 8-7 0 4-3 7-8 7Z"/>
            <path d="M12 14c0-3-2.5-5-6-5 0 3 2.5 5 6 5Z"/>
          </svg>
        </div>
      )}
      <div
        className={`max-w-[78%] min-w-[80px] rounded-2xl px-3.5 py-2 text-[14px] leading-snug shadow-sm ${
          isBot
            ? "bg-white text-tinta rounded-bl-sm"
            : "bg-[#D9FDD3] text-tinta rounded-br-sm"
        }`}
      >
        <div className="whitespace-pre-line">{formatText(m.text)}</div>

        {m.quick && (
          <div className="mt-2.5 flex flex-wrap gap-1.5" role="group" aria-label="Respuestas rápidas">
            {m.quick.map((q) => (
              <button
                key={q}
                onClick={() => !thinking && onQuick(q)}
                disabled={thinking}
                className="rounded-full border border-[#00A884]/40 text-[#00A884] bg-[#00A884]/5 hover:bg-[#00A884]/15 px-3 py-1 text-[12px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={`Responder: ${q}`}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-end gap-1 mt-1" aria-hidden="true">
          <span className="text-[10px] text-tinta/40">{m.ts}</span>
          {!isBot && m.status && <StatusTicks status={m.status} />}
        </div>
      </div>
    </article>
  );
}

function StatusTicks({ status }: { status: Status }) {
  if (status === "sending") {
    return (
      <svg width="14" height="10" viewBox="0 0 16 11" fill="none">
        <path d="M1 5.5L5 9.5L15 1.5" stroke="#8696A0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  if (status === "sent") {
    return (
      <svg width="18" height="10" viewBox="0 0 20 11" fill="none">
        <path d="M1 5.5L5 9.5L15 1.5" stroke="#8696A0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 5.5L10 9.5L20 1.5" stroke="#8696A0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  return (
    <svg width="18" height="10" viewBox="0 0 20 11" fill="none">
      <path d="M1 5.5L5 9.5L15 1.5" stroke="#53BDEB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 5.5L10 9.5L20 1.5" stroke="#53BDEB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Dot({ d = "0s" }: { d?: string }) {
  return (
    <span
      className="h-2 w-2 rounded-full bg-[#8696A0] animate-bounce"
      style={{ animationDelay: d, animationDuration: "1s" }}
    />
  );
}

// ─── Bot replies ──────────────────────────────────────────────────────────────

function botReply(text: string): Msg {
  const t = text.toLowerCase().trim();
  const ts = nowTs();

  if (t.includes("confirm")) {
    return {
      id: uid(), from: "bot", ts,
      text: "✅ *Recepción confirmada* del lote D-2240.\n\nRegistré 35 mercados nutricionales · 420 kg.\n\n¿Deseas asociarlo a las familias que recibieron hoy?",
      quick: ["Sí, registrar familias", "Después"],
    };
  }
  if (t.includes("registr") && t.includes("famil") || t === "sí, registrar familias") {
    return {
      id: uid(), from: "bot", ts,
      text: "📋 Registremos una familia nueva.\n\n¿Cuál es el nombre del jefe o jefa de hogar?",
      quick: ["María Restrepo", "Carlos Ospina", "Otro nombre"],
    };
  }
  if (t.includes("maría") || t.includes("maria") || t.includes("carlos") || t.includes("ospina") || t.includes("restrepo") || t === "otro nombre") {
    const name = t === "otro nombre" ? "Nueva Familia" : text;
    return {
      id: uid(), from: "bot", ts,
      text: `Familia *${name}* registrada.\n\n¿Cuántos integrantes tiene el hogar?`,
      quick: ["2", "3", "4", "5 o más"],
    };
  }
  if (/^[2-9]$/.test(t) || t === "5 o más") {
    return {
      id: uid(), from: "bot", ts,
      text: `Anotado: *${text} integrantes*.\n\n¿Hay niños menores de 5 años en el hogar?`,
      quick: ["Sí, 1 niño", "Sí, 2 niños", "No"],
    };
  }
  if (t.startsWith("sí, 1") || t.startsWith("sí, 2")) {
    return {
      id: uid(), from: "bot", ts,
      text: "¿Quieres registrar el peso y talla del niño ahora?\n_(Puedes hacerlo más tarde también)_",
      quick: ["Registrar peso/talla", "Más tarde"],
    };
  }
  if (t === "no" || t === "después" || t === "mas tarde" || t === "más tarde") {
    return {
      id: uid(), from: "bot", ts,
      text: "Entendido 👍\n\nRegistro guardado. Los datos ya están disponibles en el panel del banco.\n\n¿Hay algo más en lo que pueda ayudarte?",
      quick: ["Confirmar recepción", "Registrar familia", "Ver historial"],
    };
  }
  if (t.includes("peso") || t.includes("talla") || t.includes("registrar peso")) {
    return {
      id: uid(), from: "bot", ts,
      text: "📐 Envía el *peso en kg* y la *talla en cm*, separados por coma.\n\n_Ejemplo: 9.6, 75_",
    };
  }
  if (/^\d+[\.,]\d+\s*,\s*\d+/.test(t)) {
    const parts = text.split(",").map((s) => s.trim());
    return {
      id: uid(), from: "bot", ts,
      text: `✅ Medición registrada:\n• Peso: *${parts[0]} kg*\n• Talla: *${parts[1]} cm*\n\nLos datos nutricionales ya están en el panel. El sistema calculó el z-score automáticamente.`,
      quick: ["Registrar otra medición", "Volver al menú"],
    };
  }
  if (t.includes("histor")) {
    return {
      id: uid(), from: "bot", ts,
      text: "🗂 *Últimos 30 días — Parroquia San Judas:*\n\n• 4 despachos recibidos\n• 1.180 kg en alimentos\n• 35 familias atendidas\n• 12 niños monitoreados\n\n¿Quieres ver el detalle de algún despacho?",
      quick: ["D-2240", "D-2231", "D-2218", "Volver"],
    };
  }
  if (t.includes("d-22")) {
    const lote = text.toUpperCase().match(/D-\d+/)?.[0] ?? text.toUpperCase();
    return {
      id: uid(), from: "bot", ts,
      text: `📦 *${lote}:*\n• 420 kg mercado nutricional\n• Entregado 26/05/2026\n• Asociado a 35 familias\n• Confirmado por: Hna. Lucía F.\n\nReporte completo disponible en el panel del banco.`,
      quick: ["Registrar familia", "Ver historial", "Menú principal"],
    };
  }
  if (t.includes("menú") || t.includes("menu") || t.includes("volver")) {
    return {
      id: uid(), from: "bot", ts,
      text: "¿En qué puedo ayudarte? 😊",
      quick: ["Confirmar recepción", "Registrar familia", "Ver historial"],
    };
  }

  return {
    id: uid(), from: "bot", ts,
    text: "Recibido ✅\n\n¿Qué quieres hacer ahora?",
    quick: ["Confirmar recepción", "Registrar familia", "Ver historial"],
  };
}
