type Props = { variant?: "light" | "dark"; size?: number };

export function SaviaMark({ size = 28 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-md bg-savia"
      style={{ height: size, width: size }}
    >
      <svg
        width={size * 0.58}
        height={size * 0.58}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#F6F4EF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22V11" />
        <path d="M12 11c0-4 3-7 8-7 0 4-3 7-8 7Z" />
        <path d="M12 14c0-3-2.5-5-6-5 0 3 2.5 5 6 5Z" />
      </svg>
    </span>
  );
}

export function SaviaLogo({ variant = "light", size = 28 }: Props) {
  const color = variant === "light" ? "text-blanco" : "text-raiz";
  return (
    <div className="flex items-center gap-2.5">
      <SaviaMark size={size} />
      <span
        className={`font-display font-bold lowercase tracking-tight ${color}`}
        style={{ fontSize: size * 0.8 }}
      >
        savia
      </span>
    </div>
  );
}
