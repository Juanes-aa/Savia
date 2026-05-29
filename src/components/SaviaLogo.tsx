type Props = { variant?: "light" | "dark"; size?: number };

const RAIZ = "#0F3D2E";
const BLANCO = "#F6F4EF";

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
  const color = variant === "light" ? BLANCO : RAIZ;
  // SVG height scaled relative to size prop (base size=28 → height=44px viewBox)
  const svgHeight = size * 1.57;

  return (
    <svg
      viewBox="0 0 200 44"
      height={svgHeight}
      style={{ width: "auto", display: "block" }}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Savia"
      role="img"
    >
      {/* Wordmark */}
      <text
        x="0"
        y="38"
        fontFamily="'Plus Jakarta Sans', sans-serif"
        fontWeight="800"
        fontSize="42"
        fill={color}
        letterSpacing="-1"
      >
        savia
      </text>

      {/* Square dot replacing the round dot on the "i"
          measured: i starts at x=67 with width=10, center=72 */}
      <rect x="67" y="2" width="10" height="10" fill={color} rx="0" />

      {/* Leaf/sprout flourish at the top of the "S"
          s spans x=0–21; curves upward from the s top like a plant tendril */}
      <path
        d="M 12 13 C 16 7 24 3 31 5"
        stroke={color}
        strokeWidth="3.2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
