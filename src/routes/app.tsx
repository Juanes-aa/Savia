import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { SaviaLogo } from "@/components/SaviaLogo";

export const Route = createFileRoute("/app")({
  head: () => ({ meta: [{ title: "Savia · Panel del banco" }] }),
  component: AppLayout,
});

const nav = [
  { to: "/app", label: "Dashboard", end: true, icon: "M3 12l9-9 9 9M5 10v10h14V10" },
  { to: "/app/instituciones", label: "Instituciones", icon: "M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6" },
  { to: "/app/despachos", label: "Despachos", icon: "M3 7h13l4 4v6H3zM7 17a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z" },
  { to: "/app/familias", label: "Familias", icon: "M16 11a4 4 0 10-8 0 4 4 0 008 0zM3 21a9 9 0 0118 0" },
  { to: "/app/ninos", label: "Seguimiento nutricional", icon: "M12 3v18M3 12h18" },
  { to: "/app/reportes", label: "Reportes", icon: "M6 3h9l4 4v14H6zM14 3v5h5M9 13h6M9 17h4" },
];

function AppLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navLinks = nav.map((n) => {
    const active = n.end ? pathname === n.to : pathname.startsWith(n.to);
    return { ...n, active };
  });

  return (
    <div className="min-h-screen flex bg-blanco">
      <aside className="hidden md:flex w-64 shrink-0 root-texture text-blanco flex-col">
        <div className="h-[72px] px-6 flex items-center border-b border-blanco/10">
          <Link to="/"><SaviaLogo variant="light" size={26} /></Link>
        </div>
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navLinks.map((n) => (
            <NavLinkItem key={n.to} item={n} variant="desktop" />
          ))}
        </nav>
        <div className="px-6 py-5 border-t border-blanco/10 text-[12px] text-blanco/45">
          <div className="font-mono">v1.0 · demo</div>
          <div className="mt-1">Banco Arquidiocesano</div>
        </div>
      </aside>
      <main className="flex-1 min-w-0 flex flex-col">
        <header className="relative h-[72px] bg-blanco border-b border-crema-dark flex items-center justify-between px-4 sm:px-6 lg:px-10">
          <div>
            <div className="label text-savia">Panel del banco</div>
            <div className="font-display font-semibold text-[17px] sm:text-[18px] text-raiz leading-snug">Banco Arquidiocesano de Alimentos</div>
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-crema-dark px-3 py-2 text-[13px] text-tinta/75 hover:bg-crema transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
              Buscar
            </button>
            <div className="h-9 w-9 rounded-full bg-raiz text-blanco grid place-items-center font-display font-bold text-[14px]">LF</div>
            <button
              type="button"
              className="md:hidden h-9 w-9 rounded-lg border border-crema-dark bg-white text-raiz grid place-items-center hover:bg-crema transition-colors"
              aria-label={mobileNavOpen ? "Cerrar menu" : "Abrir menu"}
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen((open) => !open)}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round">
                {mobileNavOpen ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
          {mobileNavOpen && (
            <div className="md:hidden absolute left-4 right-4 top-[calc(100%+8px)] z-50 rounded-xl border border-crema-dark bg-white p-2 shadow-card-hover">
              {navLinks.map((n) => (
                <NavLinkItem
                  key={n.to}
                  item={n}
                  variant="mobile"
                  onClick={() => setMobileNavOpen(false)}
                />
              ))}
            </div>
          )}
        </header>
        <div className="flex-1 p-6 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

type NavItem = (typeof nav)[number] & { active: boolean };

function NavLinkItem({
  item,
  variant,
  onClick,
}: {
  item: NavItem;
  variant: "desktop" | "mobile";
  onClick?: () => void;
}) {
  const base = "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors";
  const styles =
    variant === "desktop"
      ? item.active
        ? "bg-blanco/10 text-blanco"
        : "text-blanco/65 hover:text-blanco hover:bg-blanco/[0.06]"
      : item.active
        ? "bg-raiz text-blanco"
        : "text-tinta/75 hover:bg-crema";

  return (
    <Link to={item.to} onClick={onClick} className={`${base} ${styles}`}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d={item.icon} />
      </svg>
      {item.label}
    </Link>
  );
}
