import { cn } from "@/lib/utils";

type Tone = "accent" | "solid" | "neutral";

const TONES: Record<Tone, string> = {
  // "nuevo cargo" — acento tenue.
  accent: "bg-surface-accent-badge text-purple-600",
  // "nuevo" (alerta sin leer) y badge de conteo del sidebar — sólido.
  solid: "bg-purple-600 text-cream-50",
  neutral: "bg-surface-chip text-navy-900/70",
};

export function Badge({
  children,
  tone = "accent",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex flex-none items-center rounded-full px-2 py-[2px] text-10.5 font-semibold whitespace-nowrap",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
