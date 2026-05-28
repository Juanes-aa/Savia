import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { SaviaLogo, SaviaMark } from "@/components/SaviaLogo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Savia — El dato que alimenta" },
      {
        name: "description",
        content:
          "Trazabilidad e impacto nutricional para bancos de alimentos. Datos en tiempo real. Misión humana.",
      },
      { property: "og:title", content: "Savia — El dato que alimenta" },
      {
        property: "og:description",
        content:
          "Plataforma de trazabilidad y seguimiento nutricional para bancos de alimentos.",
      },
    ],
  }),
  component: Landing,
});

function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    document.querySelectorAll(".reveal").forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = `${Math.min(i % 4, 3) * 70}ms`;
      obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);
}

function Landing() {
  useReveal();
  return (
    <div className="bg-blanco text-tinta">
      {/* NAV */}
      <header className="root-texture sticky top-0 z-50">
        <nav className="mx-auto max-w-7xl px-6 lg:px-10 h-[72px] flex items-center justify-between">
          <SaviaLogo variant="light" size={28} />
          <ul className="hidden md:flex items-center gap-9 font-medium text-[15px] text-blanco/70">
            <li><a href="#problema" className="hover:text-blanco transition-colors">Problema</a></li>
            <li><a href="#plataforma" className="hover:text-blanco transition-colors">Plataforma</a></li>
            <li><a href="#funciona" className="hover:text-blanco transition-colors">Cómo funciona</a></li>
            <li><a href="#impacto" className="hover:text-blanco transition-colors">Impacto</a></li>
          </ul>
          <div className="flex items-center gap-3">
            <Link to="/app" className="hidden sm:inline-flex font-medium text-[15px] text-blanco/80 hover:text-blanco transition-colors">
              Iniciar sesión
            </Link>
            <Link to="/app" className="inline-flex items-center rounded-lg bg-ambar px-4 py-2.5 font-semibold text-[14px] text-tinta hover:bg-blanco transition-colors">
              Solicitar demo
            </Link>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className="root-texture text-blanco overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 lg:py-28 grid lg:grid-cols-[1.05fr_1fr] gap-14 lg:gap-12 items-center">
          <div className="reveal">
            <div className="inline-flex items-center gap-2 rounded-full border border-blanco/15 bg-blanco/5 px-3.5 py-1.5 mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-ambar" />
              <span className="label text-blanco/80">Trazabilidad nutricional en tiempo real</span>
            </div>
            <h1 className="font-display font-bold text-[44px] sm:text-[56px] lg:text-[64px] leading-[1.04] tracking-[-0.02em] text-blanco">
              El dato que<br />alimenta
            </h1>
            <p className="mt-6 text-[20px] leading-[1.6] text-blanco/75 measure">
              Trazabilidad e impacto nutricional para bancos de alimentos. Datos en tiempo real. Misión humana.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3.5">
              <Link to="/app" className="inline-flex items-center justify-center rounded-lg bg-savia px-6 py-3.5 font-semibold text-[15px] text-blanco hover:bg-[#22895f] transition-colors shadow-card">
                Ver plataforma
              </Link>
              <Link to="/bot" className="inline-flex items-center justify-center rounded-lg border border-blanco/60 px-6 py-3.5 font-semibold text-[15px] text-blanco hover:bg-blanco/10 transition-colors">
                Probar el bot
              </Link>
            </div>
            <div className="mt-12 flex items-center gap-7 text-blanco/55">
              <Stat n="12" l="Bancos activos" />
              <Divider />
              <Stat n="98%" l="Despachos trazados" />
              <Divider />
              <Stat n="2.400" l="Niños monitoreados" />
            </div>
          </div>

          {/* dashboard mockup */}
          <div className="reveal">
            <div className="dash-grid rounded-xl border border-blanco/[0.12] bg-[#0c3527]/60 p-4 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)]">
              <div className="flex items-center justify-between px-2 pb-3.5">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-blanco/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-blanco/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-blanco/20" />
                </div>
                <span className="label text-blanco/40">savia · panel de impacto</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <MockStat label="Despachos hoy" value="184" tone="ok" />
                <MockStat label="Stock crítico" value="7" tone="warn" />
                <MockStat label="Cadena rota" value="2" tone="crit" />
              </div>
              <div className="mt-3 rounded-lg bg-blanco/[0.06] border border-blanco/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="label text-blanco/55">Aporte nutricional · 7 días</div>
                  <span className="font-mono font-bold text-[13px] text-savia">+14%</span>
                </div>
                <div className="mt-4 flex items-end gap-2.5 h-[92px]">
                  {[42, 58, 50, 72, 64, 84, 96].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: i === 3 ? "rgba(232,169,64,0.7)" : `rgba(30,123,91,${0.35 + i * 0.08})` }} />
                  ))}
                </div>
              </div>
              <div className="mt-3 rounded-lg bg-blanco/[0.06] border border-blanco/10 p-3.5">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="label text-blanco/55">Lote #A-2240 · Trazabilidad</div>
                  <span className="label text-[10px] text-[#7fd9b3]">Verificado</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Dot c="savia" /><Line c="savia" /><Dot c="savia" /><Line c="savia" /><Dot c="ambar" /><Line c="dim" /><Dot c="dim" />
                </div>
                <div className="mt-2 flex items-center justify-between label text-[10px] text-blanco/40">
                  <span>Donante</span><span>Centro</span><span>Despacho</span><span>Familia</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEMA / SOLUCIÓN */}
      <section id="problema" className="bg-blanco">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-28">
          <div className="reveal max-w-2xl">
            <div className="label text-savia mb-4">El contexto</div>
            <h2 className="font-display font-bold text-[32px] lg:text-[40px] leading-[1.1] tracking-[-0.01em] text-raiz">
              Operar a ciegas tiene un costo nutricional real
            </h2>
          </div>
          <div className="mt-14 grid md:grid-cols-2 gap-6 lg:gap-7">
            <div className="reveal rounded-xl border border-crema-dark bg-crema/50 p-8 lg:p-10">
              <div className="inline-flex items-center gap-2 mb-5">
                <span className="h-2 w-2 rounded-full bg-critico" />
                <span className="label text-critico">El problema</span>
              </div>
              <h3 className="font-display font-semibold text-[24px] leading-snug text-raiz measure">
                Los bancos de alimentos operan sin visibilidad del impacto nutricional real.
              </h3>
              <ul className="mt-6 space-y-3.5 text-[16px] leading-[1.6] text-tinta/80 measure">
                {[
                  "Despachos registrados en planillas dispersas, imposibles de auditar.",
                  "Sin trazabilidad del alimento desde el donante hasta la familia.",
                  "Reportes a donantes lentos, manuales y difíciles de verificar.",
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gris" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="reveal rounded-xl border border-savia/25 root-texture text-blanco p-8 lg:p-10">
              <div className="inline-flex items-center gap-2 mb-5">
                <span className="h-2 w-2 rounded-full bg-ambar" />
                <span className="label text-ambar">La solución Savia</span>
              </div>
              <h3 className="font-display font-semibold text-[24px] leading-snug text-blanco measure">
                Una plataforma que convierte cada despacho en un dato trazable y medible.
              </h3>
              <ul className="mt-6 space-y-3.5 text-[16px] leading-[1.6] text-blanco/80 measure">
                {[
                  "Cada lote se rastrea de extremo a extremo, en tiempo real.",
                  "Semáforo nutricional basado en estándares OMS.",
                  "Reportes para donantes generados con un clic, auditables.",
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <Check />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACTO */}
      <section id="impacto" className="bg-crema">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-28">
          <div className="reveal max-w-2xl mb-14">
            <div className="label text-savia mb-4">Impacto medible</div>
            <h2 className="font-display font-bold text-[32px] lg:text-[40px] leading-[1.1] tracking-[-0.01em] text-raiz">
              Resultados que se pueden auditar
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <BigStat value="2.400" label="Niños monitoreados" />
            <BigStat value="98" suffix="%" label="Despachos trazados" />
            <BigStat value="12" label="Bancos activos" />
            <BigStat value="1.2" suffix="M" label="Raciones despachadas" />
          </div>
        </div>
      </section>

      {/* PLATAFORMA */}
      <section id="plataforma" className="bg-blanco">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-28">
          <div className="reveal max-w-2xl mb-14">
            <div className="label text-savia mb-4">La plataforma</div>
            <h2 className="font-display font-bold text-[32px] lg:text-[40px] leading-[1.1] tracking-[-0.01em] text-raiz">
              Todo lo que un banco necesita para medir su misión
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Feature
              title="Trazabilidad de despachos"
              text="Sigue cada lote desde el donante hasta la familia receptora, con sellos de tiempo verificables en cada paso."
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1E7B5B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 7h11l3 3v7H5z"/><circle cx="8" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M2 7h3M2 11h4"/></svg>
              }
            />
            <Feature
              title="Semáforo nutricional OMS"
              text="Clasifica el aporte de cada despacho según estándares de la OMS y alerta cuando un perfil cae en riesgo."
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1E7B5B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="20" rx="4"/><circle cx="12" cy="7" r="1.6" fill="#1E7B5B" stroke="none"/><circle cx="12" cy="12" r="1.6" fill="#E8A940" stroke="none"/><circle cx="12" cy="17" r="1.6" fill="#C0392B" stroke="none"/></svg>
              }
            />
            <Feature
              title="Reportes para donantes"
              text="Genera informes de impacto auditables en segundos y compártelos con donantes y entes reguladores."
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1E7B5B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5"/><path d="M9 13v4M12 11v6M15 14v3"/></svg>
              }
            />
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="funciona" className="bg-crema">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-28">
          <div className="reveal max-w-2xl mb-14">
            <div className="label text-savia mb-4">Cómo funciona</div>
            <h2 className="font-display font-bold text-[32px] lg:text-[40px] leading-[1.1] tracking-[-0.01em] text-raiz">
              Del registro al impacto, en tres pasos
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            <Step n="01" title="Registra el ingreso" text="Cada donación se escanea al entrar. Origen, peso y categoría quedan capturados al instante." />
            <Step n="02" title="Despacha y traza" text="Savia asigna cada lote a un centro o familia y registra el recorrido completo, paso a paso." />
            <Step n="03" title="Mide el impacto" text="El semáforo nutricional y los reportes se actualizan solos. La misión se vuelve auditable." />
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="root-texture text-blanco">
        <div className="mx-auto max-w-4xl px-6 lg:px-10 py-24 lg:py-32 text-center">
          <div className="reveal">
            <span className="font-display font-bold text-[80px] leading-none text-ambar block mb-2">“</span>
            <blockquote className="font-display font-semibold text-[24px] lg:text-[30px] leading-[1.4] text-blanco measure mx-auto">
              Por primera vez podemos demostrarle a un donante, con datos, que su aporte llegó a una familia y mejoró su nutrición. Savia le dio raíces a nuestra misión.
            </blockquote>
            <div className="mt-9 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-ambar" />
              <div className="text-left">
                <div className="text-[14px] text-blanco">Lucía Fernández</div>
                <div className="text-[14px] text-blanco/65">Directora · Banco Arquidiocesano de Alimentos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="bg-blanco">
        <div className="mx-auto max-w-3xl px-6 lg:px-10 py-24 lg:py-32 text-center">
          <div className="reveal">
            <h2 className="font-display font-bold text-[32px] lg:text-[40px] leading-[1.1] tracking-[-0.01em] text-raiz">
              Dale raíces a tu misión
            </h2>
            <p className="mt-5 text-[18px] leading-[1.6] text-tinta/75 mx-auto max-w-xl">
              Únete a los bancos de alimentos que ya miden su impacto nutricional en tiempo real. Comienza con una demo guiada.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
              <Link to="/app" className="inline-flex items-center justify-center rounded-lg bg-savia px-8 py-4 font-semibold text-[16px] text-blanco hover:bg-[#22895f] transition-colors shadow-card">
                Explorar la plataforma
              </Link>
              <Link to="/bot" className="inline-flex items-center justify-center rounded-lg border border-raiz/20 px-8 py-4 font-semibold text-[16px] text-raiz hover:bg-crema transition-colors">
                Ver el bot en acción
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-tinta text-blanco">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
          <div className="grid md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10">
            <div>
              <div className="mb-4"><SaviaLogo variant="light" size={24} /></div>
              <p className="text-[14px] leading-[1.6] text-blanco/55 max-w-xs">
                Plataforma de trazabilidad e impacto nutricional para bancos de alimentos.
              </p>
            </div>
            <FootCol title="Producto" links={["Plataforma", "Bot", "Reportes"]} />
            <FootCol title="Organización" links={["Sobre Savia", "Bancos aliados", "Contacto"]} />
            <FootCol title="Legal" links={["Privacidad", "Términos"]} />
          </div>
          <div className="mt-14 pt-7 border-t border-blanco/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-blanco/40">
            <span>© 2026 Savia. Datos que tienen raíces.</span>
            <span className="font-mono">v1.0 · prototipo · Creatón ABACO</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

const Stat = ({ n, l }: { n: string; l: string }) => (
  <div>
    <div className="font-mono font-bold text-[20px] text-blanco">{n}</div>
    <div className="label mt-1">{l}</div>
  </div>
);
const Divider = () => <div className="h-9 w-px bg-blanco/15" />;
const Check = () => (
  <svg className="mt-1 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7fd9b3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
);
const Dot = ({ c }: { c: "savia" | "ambar" | "dim" }) => (
  <span className="h-2 w-2 rounded-full" style={{ background: c === "savia" ? "#1E7B5B" : c === "ambar" ? "#E8A940" : "rgba(246,244,239,0.25)" }} />
);
const Line = ({ c }: { c: "savia" | "dim" }) => (
  <span className="h-px flex-1" style={{ background: c === "savia" ? "rgba(30,123,91,0.4)" : "rgba(246,244,239,0.15)" }} />
);
function MockStat({ label, value, tone }: { label: string; value: string; tone: "ok" | "warn" | "crit" }) {
  const map = { ok: { color: "#F6F4EF", chip: "bg-savia/20", txt: "#7fd9b3", dot: "bg-savia", word: "Normal" }, warn: { color: "#E8A940", chip: "bg-ambar/20", txt: "#E8A940", dot: "bg-ambar", word: "Atención" }, crit: { color: "#e57163", chip: "bg-critico/25", txt: "#e88a7f", dot: "bg-[#e57163]", word: "Crítico" } } as const;
  const m = map[tone];
  return (
    <div className="rounded-lg bg-blanco/[0.06] border border-blanco/10 p-3.5">
      <div className="label text-blanco/45">{label}</div>
      <div className="font-mono font-bold text-[26px] mt-1.5 leading-none" style={{ color: m.color }}>{value}</div>
      <div className={`mt-2 inline-flex items-center gap-1.5 rounded-sm ${m.chip} px-2 py-0.5`}>
        <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
        <span className="label text-[10px]" style={{ color: m.txt }}>{m.word}</span>
      </div>
    </div>
  );
}
function BigStat({ value, suffix, label }: { value: string; suffix?: string; label: string }) {
  return (
    <div className="reveal rounded-lg border border-crema-dark bg-blanco p-6 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all">
      <div className="font-mono font-bold text-[48px] lg:text-[56px] leading-none text-raiz">
        {value}{suffix && <span className="text-[34px]">{suffix}</span>}
      </div>
      <div className="label text-gris mt-4">{label}</div>
    </div>
  );
}
function Feature({ title, text, icon }: { title: string; text: string; icon: React.ReactNode }) {
  return (
    <div className="reveal group rounded-lg border border-crema-dark bg-blanco p-7 hover:shadow-card-hover transition-shadow">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-savia/10 mb-6">{icon}</span>
      <h3 className="font-display font-semibold text-[24px] text-raiz leading-snug">{title}</h3>
      <p className="mt-3 text-[16px] leading-[1.6] text-tinta/75">{text}</p>
    </div>
  );
}
function Step({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <div className="reveal">
      <div className="flex items-center gap-4 mb-5">
        <span className="font-mono font-bold text-[40px] leading-none text-ambar">{n}</span>
        <span className="h-px flex-1 bg-crema-dark" />
      </div>
      <h3 className="font-display font-semibold text-[24px] text-raiz leading-snug">{title}</h3>
      <p className="mt-3 text-[16px] leading-[1.6] text-tinta/75 measure">{text}</p>
    </div>
  );
}
function FootCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <div className="label text-blanco/40 mb-4">{title}</div>
      <ul className="space-y-2.5 text-[14px] text-blanco/50">
        {links.map((l) => (
          <li key={l}><a href="#" className="hover:text-blanco/80 transition-colors">{l}</a></li>
        ))}
      </ul>
    </div>
  );
}
