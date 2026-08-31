/**
 * Isotipo de Argos: el ojo. viewBox 0 0 32 32.
 *
 * Dos variantes (§6):
 *  - `navy`  → sobre fondo oscuro: trazo e iris en purple-300.
 *  - `cream` → sobre fondo claro: trazo en purple-900, iris en purple-600.
 *
 * El isotipo NUNCA contiene el texto "Argos". El wordmark es un componente
 * aparte (<Wordmark />).
 */
export type ArgosMarkVariant = "navy" | "cream";

const VARIANTS: Record<ArgosMarkVariant, { stroke: string; iris: string; pupil: string }> = {
  navy: { stroke: "#AFA9EC", iris: "#AFA9EC", pupil: "#0D1B2A" },
  cream: { stroke: "#26215C", iris: "#534AB7", pupil: "#0D1B2A" },
};

export function ArgosMark({
  variant = "cream",
  size = 26,
  className,
  title,
}: {
  variant?: ArgosMarkVariant;
  size?: number;
  className?: string;
  title?: string;
}) {
  const tone = VARIANTS[variant];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      style={{ display: "block", flex: "none" }}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M1.5 16C6 8.5 10.8 5 16 5s10 3.5 14.5 11C26 23.5 21.2 27 16 27S6 23.5 1.5 16Z"
        stroke={tone.stroke}
        strokeWidth={1.8}
        fill="none"
      />
      <circle cx="16" cy="16" r="6" fill={tone.iris} />
      <circle cx="16" cy="16" r="2.4" fill={tone.pupil} />
      <circle cx="18.2" cy="13.4" r="1.05" fill="#F8F7F2" />
    </svg>
  );
}
