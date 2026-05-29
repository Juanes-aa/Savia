import { createFileRoute, Link } from "@tanstack/react-router";
import { memo, useCallback, useEffect, useMemo, useReducer, useRef } from "react";

export const Route = createFileRoute("/bot")({
  head: () => ({ meta: [{ title: "Savia · Bot institución" }] }),
  component: BotPage,
});

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = "sending" | "sent" | "read";
type Msg = {
  id: string;
  from: "bot" | "user";
  text: string;
  ts: string;
  status?: Status;
  quick?: string[];
  isLast?: boolean;
};

type State =
  | "menu"
  | "confirmar_asociar"
  | "famil_nombre"
  | "famil_integrantes"
  | "famil_ninos"
  | "famil_medicion_prompt"
  | "famil_medicion_input"
  | "historial_detalle"
  | "peso_input";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function nowTs() {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

function formatText(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const parts = line.split(/(\*[^*]+\*)/g).map((part, j) =>
      part.startsWith("*") && part.endsWith("*")
        ? <strong key={j}>{part.slice(1, -1)}</strong>
        : part
    );
    return <span key={i}>{parts}{i < lines.length - 1 && <br />}</span>;
  });
}

function toName(s: string) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Pure state machine (no shared object references) ─────────────────────────

type BotReply = { text: string; quick?: string[] };

const MENU_REPLY: BotReply = {
  text: "¿En qué puedo ayudarte? 😊",
  quick: ["Confirmar recepción", "Registrar familia", "Ver historial", "Registrar peso/talla"],
};

function nextState(state: State, input: string): { next: State; reply: BotReply } {
  const t = input.trim();

  if (state === "menu") {
    if (/confirmar/i.test(t)) {
      return {
        next: "confirmar_asociar",
        reply: {
          text: "✅ *Recepción confirmada* del lote D-2240.\n\nRegistré 35 mercados nutricionales · 420 kg.\n\n¿Deseas asociarlo a las familias que recibieron hoy?",
          quick: ["Sí, registrar familias", "No por ahora"],
        },
      };
    }
    if (/registrar familia|nueva familia/i.test(t)) {
      return {
        next: "famil_nombre",
        reply: {
          text: "📋 Registremos una familia nueva.\n\n¿Cuál es el nombre del jefe o jefa de hogar?",
          quick: ["María Restrepo", "Carlos Ospina", "Otro nombre"],
        },
      };
    }
    if (/historial/i.test(t)) {
      return {
        next: "historial_detalle",
        reply: {
          text: "🗂 *Últimos 30 días — Parroquia San Judas:*\n\n• 4 despachos recibidos\n• 1.180 kg en alimentos\n• 35 familias atendidas\n• 12 niños monitoreados\n\n¿Quieres ver el detalle de algún despacho?",
          quick: ["D-2240", "D-2231", "D-2218", "Volver al menú"],
        },
      };
    }
    if (/peso|talla|medici/i.test(t)) {
      return {
        next: "peso_input",
        reply: {
          text: "📐 *Registrar medición nutricional*\n\nEnvía el *peso en kg* y la *talla en cm*, separados por coma.\n\n_Ejemplo: 9.6, 75_",
        },
      };
    }
    return { next: "menu", reply: MENU_REPLY };
  }

  if (state === "confirmar_asociar") {
    if (/sí|si|registrar famil/i.test(t)) {
      return {
        next: "famil_nombre",
        reply: {
          text: "📋 Registremos la familia.\n\n¿Cuál es el nombre del jefe o jefa de hogar?",
          quick: ["María Restrepo", "Carlos Ospina", "Otro nombre"],
        },
      };
    }
    return {
      next: "menu",
      reply: {
        text: "Entendido 👍\n\nEl despacho quedó registrado en el panel.",
        quick: ["Registrar familia", "Ver historial", "Registrar peso/talla"],
      },
    };
  }

  if (state === "famil_nombre") {
    const isPlaceholder = /^otro nombre$/i.test(t);
    if (isPlaceholder) {
      return {
        next: "famil_nombre",
        reply: { text: "¿Cuál es el nombre del jefe o jefa de hogar? Escríbelo directamente." },
      };
    }
    return {
      next: "famil_integrantes",
      reply: {
        text: `Familia *${toName(t)}* anotada.\n\n¿Cuántos integrantes tiene el hogar?`,
        quick: ["2", "3", "4", "5", "6 o más"],
      },
    };
  }

  if (state === "famil_integrantes") {
    return {
      next: "famil_ninos",
      reply: {
        text: `Anotado: *${t} integrante${t === "1" ? "" : "s"}*.\n\n¿Hay niños menores de 5 años en el hogar?`,
        quick: ["Sí, 1 niño", "Sí, 2 niños", "No hay niños"],
      },
    };
  }

  if (state === "famil_ninos") {
    if (/no/i.test(t)) {
      return {
        next: "menu",
        reply: {
          text: "✅ Familia registrada correctamente.\n\nLos datos ya están en el panel del banco.",
          quick: ["Registrar otra familia", "Ver historial", "Menú principal"],
        },
      };
    }
    return {
      next: "famil_medicion_prompt",
      reply: {
        text: "¿Quieres registrar el peso y talla del niño ahora?\n_(Puedes hacerlo después también)_",
        quick: ["Sí, registrar ahora", "Más tarde"],
      },
    };
  }

  if (state === "famil_medicion_prompt") {
    if (/sí|si|ahora|registrar/i.test(t)) {
      return {
        next: "famil_medicion_input",
        reply: { text: "📐 Envía el *peso en kg* y la *talla en cm*, separados por coma.\n\n_Ejemplo: 9.6, 75_" },
      };
    }
    return {
      next: "menu",
      reply: {
        text: "✅ Familia registrada. Puedes registrar las medidas después desde el panel.",
        quick: ["Registrar otra familia", "Menú principal"],
      },
    };
  }

  if (state === "famil_medicion_input") {
    const match = t.match(/^(\d+[.,]\d+|\d+)\s*[,;]\s*(\d+[.,]?\d*)$/);
    if (match) {
      const peso = match[1].replace(",", ".");
      const talla = match[2].replace(",", ".");
      return {
        next: "menu",
        reply: {
          text: `✅ *Medición registrada:*\n• Peso: *${peso} kg*\n• Talla: *${talla} cm*\n\nEl z-score fue calculado automáticamente. Todo en el panel del banco.`,
          quick: ["Registrar otra medición", "Registrar otra familia", "Menú principal"],
        },
      };
    }
    return {
      next: "famil_medicion_input",
      reply: { text: "No entendí el formato. Por favor escribe el peso y talla separados por coma.\n\n_Ejemplo: 9.6, 75_" },
    };
  }

  if (state === "historial_detalle") {
    if (/volver|menú|menu/i.test(t)) {
      return { next: "menu", reply: MENU_REPLY };
    }
    const lote = t.toUpperCase().match(/D-\d+/)?.[0] ?? t.toUpperCase();
    const datos: Record<string, string> = {
      "D-2240": "420 kg · 35 familias · Entregado 26/05/2026 · Confirmado por Hna. Lucía F.",
      "D-2231": "380 kg · 31 familias · Entregado 12/05/2026 · Confirmado por Hna. Lucía F.",
      "D-2218": "410 kg · 33 familias · Entregado 28/04/2026 · Confirmado por Hno. Mauricio R.",
    };
    return {
      next: "historial_detalle",
      reply: {
        text: `📦 *${lote}:*\n${datos[lote] ?? "Despacho no encontrado."}\n\nReporte completo disponible en el panel del banco.`,
        quick: ["D-2240", "D-2231", "D-2218", "Volver al menú"],
      },
    };
  }

  if (state === "peso_input") {
    const match = t.match(/^(\d+[.,]\d+|\d+)\s*[,;]\s*(\d+[.,]?\d*)$/);
    if (match) {
      const peso = match[1].replace(",", ".");
      const talla = match[2].replace(",", ".");
      return {
        next: "menu",
        reply: {
          text: `✅ *Medición registrada:*\n• Peso: *${peso} kg*\n• Talla: *${talla} cm*\n\nZ-score calculado automáticamente y guardado en el panel.`,
          quick: ["Registrar otra medición", "Registrar familia", "Menú principal"],
        },
      };
    }
    return {
      next: "peso_input",
      reply: { text: "Por favor escribe el peso y talla separados por coma.\n\n_Ejemplo: 9.6, 75_" },
    };
  }

  return { next: "menu", reply: MENU_REPLY };
}

// ─── Reducer (single atomic update per event) ────────────────────────────────

type ChatState = {
  msgs: Msg[];
  convState: State;
  input: string;
  thinking: boolean;
};

type Action =
  | { type: "INPUT"; value: string }
  | { type: "SEND_START"; userMsg: Msg }
  | { type: "MARK_SENT"; id: string }
  | { type: "REPLY"; userId: string; reply: Msg; next: State }
  | { type: "RESET"; initial: Msg[] };

function reducer(s: ChatState, a: Action): ChatState {
  switch (a.type) {
    case "INPUT":
      return s.input === a.value ? s : { ...s, input: a.value };

    case "SEND_START": {
      const cleared = s.msgs.map((m) => (m.isLast ? { ...m, isLast: false } : m));
      return {
        ...s,
        msgs: [...cleared, a.userMsg],
        input: "",
        thinking: true,
      };
    }

    case "MARK_SENT": {
      let changed = false;
      const msgs = s.msgs.map((m) => {
        if (m.id === a.id && m.status !== "sent") {
          changed = true;
          return { ...m, status: "sent" as Status };
        }
        return m;
      });
      return changed ? { ...s, msgs } : s;
    }

    case "REPLY": {
      const msgs = s.msgs.map((m) =>
        m.id === a.userId ? { ...m, status: "read" as Status } : m
      );
      return {
        ...s,
        msgs: [...msgs, a.reply],
        convState: a.next,
        thinking: false,
      };
    }

    case "RESET":
      return { msgs: a.initial, convState: "menu", input: "", thinking: false };

    default:
      return s;
  }
}

// ─── Stable id generator (per-mount, no module-level mutation) ────────────────

function useIdGen() {
  const ref = useRef(0);
  return useCallback(() => {
    ref.current += 1;
    return `m_${ref.current}_${Math.random().toString(36).slice(2, 7)}`;
  }, []);
}

// ─── Component ────────────────────────────────────────────────────────────────

function BotPage() {
  const newId = useIdGen();

  const buildInitial = useCallback((): Msg[] => [
    {
      id: newId(),
      from: "bot",
      ts: "10:42",
      text: "Hola Parroquia San Judas 👋\n\nTienes un despacho en camino:\n📦 *Lote D-2240* · 35 mercados nutricionales · 420 kg\nLlegada estimada: hoy 3:00 pm",
      quick: ["Confirmar recepción", "Registrar familia", "Ver historial", "Registrar peso/talla"],
      isLast: true,
    },
  ], [newId]);

  const [state, dispatch] = useReducer(reducer, undefined as unknown as ChatState, () => ({
    msgs: buildInitial(),
    convState: "menu" as State,
    input: "",
    thinking: false,
  }));

  const { msgs, convState, input, thinking } = state;

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const announcerRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);
  const t1Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t2Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t3Ref = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (t1Ref.current) { clearTimeout(t1Ref.current); t1Ref.current = null; }
    if (t2Ref.current) { clearTimeout(t2Ref.current); t2Ref.current = null; }
    if (t3Ref.current) { clearTimeout(t3Ref.current); t3Ref.current = null; }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const id = requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
    return () => cancelAnimationFrame(id);
  }, [msgs.length, thinking]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const announce = useCallback((text: string) => {
    if (announcerRef.current) announcerRef.current.textContent = text;
  }, []);

  const send = useCallback((rawText: string) => {
    const text = rawText.trim();
    if (!text || busyRef.current) return;
    busyRef.current = true;

    try {
      const userId = newId();
      const userMsg: Msg = { id: userId, from: "user", text, ts: nowTs(), status: "sending" };
      dispatch({ type: "SEND_START", userMsg });

      t1Ref.current = setTimeout(() => {
        t1Ref.current = null;
        dispatch({ type: "MARK_SENT", id: userId });
      }, 300);

      const stateAtSend = convState;
      t2Ref.current = setTimeout(() => {
        t2Ref.current = null;
        try {
          const { next, reply } = nextState(stateAtSend, text);
          const replyMsg: Msg = {
            id: newId(),
            from: "bot",
            ts: nowTs(),
            text: reply.text,
            quick: reply.quick,
            isLast: true,
          };
          dispatch({ type: "REPLY", userId, reply: replyMsg, next });
          announce(`Savia bot: ${reply.text.replace(/\n/g, " ").substring(0, 80)}`);
          t3Ref.current = setTimeout(() => {
            t3Ref.current = null;
            inputRef.current?.focus();
          }, 50);
        } catch (err) {
          console.error("[bot] reply error:", err);
          dispatch({
            type: "REPLY",
            userId,
            next: "menu",
            reply: {
              id: newId(),
              from: "bot",
              ts: nowTs(),
              text: "Ups, algo falló. Volvamos al menú principal.",
              quick: ["Confirmar recepción", "Registrar familia", "Ver historial"],
              isLast: true,
            },
          });
        } finally {
          busyRef.current = false;
        }
      }, 900);
    } catch (err) {
      console.error("[bot] send error:", err);
      busyRef.current = false;
    }
  }, [convState, newId, announce]);

  const reset = useCallback(() => {
    clearTimers();
    busyRef.current = false;
    dispatch({ type: "RESET", initial: buildInitial() });
  }, [clearTimers, buildInitial]);

  const startFlow = useCallback((cmd: string) => {
    clearTimers();
    busyRef.current = false;
    dispatch({ type: "RESET", initial: buildInitial() });
    queueMicrotask(() => send(cmd));
  }, [clearTimers, buildInitial, send]);

  const onChangeInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "INPUT", value: e.target.value });
  }, []);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!thinking) send(input);
    }
  }, [thinking, send, input]);

  const canSend = input.trim().length > 0 && !thinking;

  const onSendClick = useCallback(() => {
    if (!thinking && input.trim().length > 0) send(input);
  }, [thinking, input, send]);

  const headerTs = useMemo(() => nowTs(), []);

  return (
    <div className="min-h-screen bg-blanco">
      <div ref={announcerRef} role="status" aria-live="polite" aria-atomic="true" className="sr-only" />

      {/* Nav */}
      <header className="root-texture text-blanco">
        <div className="mx-auto max-w-6xl px-6 lg:px-10 h-[64px] flex items-center justify-between">
          <Link to="/" className="text-blanco/80 hover:text-blanco text-[14px] flex items-center gap-2 transition-colors" aria-label="Volver a Savia">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
            Volver
          </Link>
          <span className="label text-blanco/70">Simulador · bot conversacional</span>
          <Link to="/app" className="text-[14px] text-blanco/80 hover:text-blanco transition-colors">Vista del banco →</Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 lg:px-10 py-12 grid lg:grid-cols-[1fr_360px] gap-12 items-start">

        {/* Phone */}
        <div className="mx-auto w-full max-w-[400px]" role="region" aria-label="Simulador de WhatsApp">
          <div className="rounded-[44px] border-[11px] border-tinta bg-tinta shadow-[0_32px_64px_rgba(15,61,46,0.28)] overflow-hidden">

            {/* Status bar */}
            <div className="bg-[#075E54] px-5 pt-2.5 pb-0 flex items-center justify-between">
              <span className="text-white text-[11px] font-semibold tabular-nums" aria-hidden="true">{headerTs}</span>
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <svg width="15" height="11" viewBox="0 0 15 11" fill="white" opacity="0.9"><rect x="0" y="7" width="2.5" height="4" rx="0.5"/><rect x="4" y="5" width="2.5" height="6" rx="0.5"/><rect x="8" y="2.5" width="2.5" height="8.5" rx="0.5"/><rect x="12" y="0" width="2.5" height="11" rx="0.5"/></svg>
                <svg width="15" height="11" viewBox="0 0 24 18" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.9"><path d="M1 6C5.3 1.8 10.4 0 12 0s6.7 1.8 11 6"/><path d="M4 10c2.2-2.5 4.9-4 8-4s5.8 1.5 8 4"/><path d="M7.5 14c1.2-1.5 2.8-2 4.5-2s3.3.5 4.5 2"/><circle cx="12" cy="18" r="1.5" fill="white" stroke="none"/></svg>
                <svg width="22" height="11" viewBox="0 0 22 11" fill="none" opacity="0.9"><rect x="0.5" y="0.5" width="18" height="10" rx="2.5" stroke="white" strokeWidth="1"/><rect x="19.5" y="3.5" width="2" height="4" rx="1" fill="white"/><rect x="2" y="2" width="14" height="7" rx="1.5" fill="white"/></svg>
              </div>
            </div>

            {/* WA Header */}
            <div className="bg-[#075E54] px-3 py-2.5 flex items-center gap-3">
              <button type="button" className="text-white/80 hover:text-white p-1 -ml-1 rounded-full hover:bg-white/10 transition-colors" aria-label="Volver" tabIndex={-1}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <div className="relative">
                <div className="h-9 w-9 rounded-full bg-[#1E7B5B] flex items-center justify-center shadow-sm" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F6F4EF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V11"/><path d="M12 11c0-4 3-7 8-7 0 4-3 7-8 7Z"/><path d="M12 14c0-3-2.5-5-6-5 0 3 2.5 5 6 5Z"/></svg>
                </div>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#4ADE80] border-2 border-[#075E54]" aria-hidden="true"/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white text-[15px] leading-tight">Savia · bot</div>
                <div className="text-[11px] text-white/75 flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#4ADE80]" aria-hidden="true"/>
                  en línea
                </div>
              </div>
              <div className="flex items-center gap-1" aria-hidden="true">
                <button type="button" className="text-white/80 p-2 rounded-full" tabIndex={-1} aria-label="Videollamada (no disponible en demo)">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>
                </button>
                <button type="button" className="text-white/80 p-2 rounded-full" tabIndex={-1} aria-label="Llamada (no disponible en demo)">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.13 11.7 19.79 19.79 0 0 1 1.06 3 2 2 0 0 1 3.04.99h3a2 2 0 0 1 2 1.72c.128 1.006.362 1.996.7 2.95a2 2 0 0 1-.45 2.11L7.09 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.954.338 1.944.572 2.95.7A2 2 0 0 1 22 16.92Z"/></svg>
                </button>
              </div>
            </div>

            {/* Chat */}
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
              <div className="flex justify-center my-2" aria-hidden="true">
                <span className="bg-[#E1F2FB]/90 text-[#54656F] text-[11.5px] px-3 py-1 rounded-full shadow-sm font-medium">Hoy</span>
              </div>

              {msgs.map((m) => (
                <Bubble key={m.id} m={m} onQuick={send} disabled={thinking} />
              ))}

              {thinking && (
                <div className="flex items-end gap-1.5" role="status" aria-label="Savia bot está escribiendo">
                  <div className="h-7 w-7 rounded-full bg-[#1E7B5B] flex items-center justify-center shrink-0 mb-0.5" aria-hidden="true">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F6F4EF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V11"/><path d="M12 11c0-4 3-7 8-7 0 4-3 7-8 7Z"/><path d="M12 14c0-3-2.5-5-6-5 0 3 2.5 5 6 5Z"/></svg>
                  </div>
                  <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                    <div className="flex gap-1 items-center h-4" aria-hidden="true"><Dot /><Dot d=".2s" /><Dot d=".4s" /></div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="bg-[#F0F2F5] px-2 py-2 flex items-end gap-2">
              <button type="button" className="h-10 w-10 rounded-full text-[#54656F] flex items-center justify-center shrink-0" aria-label="Adjuntar (no disponible en demo)" tabIndex={-1}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              </button>
              <input
                ref={inputRef}
                value={input}
                onChange={onChangeInput}
                onKeyDown={onKeyDown}
                placeholder={thinking ? "Savia está escribiendo…" : "Escribe un mensaje"}
                readOnly={thinking}
                className={`flex-1 rounded-3xl bg-white px-4 py-2.5 text-[14px] text-tinta outline-none placeholder:text-[#54656F]/70 transition-opacity ${thinking ? "opacity-60" : ""}`}
                aria-label="Escribe un mensaje"
                aria-busy={thinking}
                autoComplete="off"
              />
              <button
                type="button"
                onClick={onSendClick}
                disabled={!canSend}
                className="h-10 w-10 rounded-full bg-[#00A884] flex items-center justify-center shrink-0 text-white transition-all disabled:opacity-80"
                aria-label={canSend ? "Enviar mensaje" : "Nota de voz (no disponible en demo)"}
              >
                {canSend ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4 20-7Z"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
                )}
              </button>
            </div>
          </div>

          {/* Reset + hint */}
          <div className="flex items-center justify-between mt-3 px-1">
            <p className="text-[12px] text-tinta/40">Demo interactivo · escribe o usa los botones</p>
            <button
              type="button"
              onClick={reset}
              className="text-[12px] text-savia/70 hover:text-savia transition-colors flex items-center gap-1"
              aria-label="Reiniciar conversación"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              Reiniciar
            </button>
          </div>
        </div>

        {/* Sidebar */}
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
            <div className="label text-tinta/50 mb-1">Prueba los 4 flujos</div>
            {[
              { label: "Confirmar recepción de despacho", cmd: "Confirmar recepción" },
              { label: "Registrar nueva familia", cmd: "Registrar familia" },
              { label: "Ver historial de despachos", cmd: "Ver historial" },
              { label: "Registrar peso y talla de un niño", cmd: "Registrar peso/talla" },
            ].map(({ label, cmd }) => (
              <button
                type="button"
                key={cmd}
                onClick={() => startFlow(cmd)}
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
            En producción se conecta a la <strong className="text-tinta/90">WhatsApp Business API</strong>. Las instituciones reciben mensajes reales sin necesidad de esta interfaz.
          </div>
        </aside>
      </div>
    </div>
  );
}

// ─── Bubble (memoized) ────────────────────────────────────────────────────────

const Bubble = memo(function Bubble({ m, onQuick, disabled }: { m: Msg; onQuick: (t: string) => void; disabled: boolean }) {
  const isBot = m.from === "bot";
  const showQuick = isBot && m.isLast && m.quick && m.quick.length > 0;
  return (
    <article
      className={`flex items-end gap-1.5 ${isBot ? "" : "justify-end"}`}
      aria-label={`${isBot ? "Savia bot" : "Tú"}: ${m.text}`}
    >
      {isBot && (
        <div className="h-7 w-7 rounded-full bg-[#1E7B5B] flex items-center justify-center shrink-0 mb-0.5" aria-hidden="true">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F6F4EF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V11"/><path d="M12 11c0-4 3-7 8-7 0 4-3 7-8 7Z"/><path d="M12 14c0-3-2.5-5-6-5 0 3 2.5 5 6 5Z"/></svg>
        </div>
      )}
      <div className={`max-w-[78%] min-w-[80px] rounded-2xl px-3.5 py-2 text-[14px] leading-snug shadow-sm ${isBot ? "bg-white text-tinta rounded-bl-sm" : "bg-[#D9FDD3] text-tinta rounded-br-sm"}`}>
        <div className="whitespace-pre-line">{formatText(m.text)}</div>

        {showQuick && (
          <div className="mt-2.5 flex flex-wrap gap-1.5" role="group" aria-label="Respuestas rápidas">
            {m.quick!.map((q) => (
              <button
                type="button"
                key={q}
                onClick={() => onQuick(q)}
                disabled={disabled}
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
});

function StatusTicks({ status }: { status: Status }) {
  if (status === "sending") return (
    <svg width="14" height="10" viewBox="0 0 16 11" fill="none"><path d="M1 5.5L5 9.5L15 1.5" stroke="#8696A0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );
  if (status === "sent") return (
    <svg width="18" height="10" viewBox="0 0 20 11" fill="none"><path d="M1 5.5L5 9.5L15 1.5" stroke="#8696A0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 5.5L10 9.5L20 1.5" stroke="#8696A0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );
  return (
    <svg width="18" height="10" viewBox="0 0 20 11" fill="none"><path d="M1 5.5L5 9.5L15 1.5" stroke="#53BDEB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 5.5L10 9.5L20 1.5" stroke="#53BDEB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );
}

function Dot({ d = "0s" }: { d?: string }) {
  return <span className="h-2 w-2 rounded-full bg-[#8696A0] animate-bounce" style={{ animationDelay: d, animationDuration: "1s" }}/>;
}
