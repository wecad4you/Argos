import { cn } from "@/lib/utils";

/**
 * Barra de progreso / barra de dato. `value` es 0–100 y ya viene calculado
 * desde /lib/domain — este componente no calcula porcentajes.
 */
type Fill = "accent" | "lavender";
type Track = "purple" | "purple-soft" | "on-navy";

// Clases completas: Tailwind no puede detectar nombres construidos por interpolación.
const FILLS: Record<Fill, string> = {
  accent: "bg-purple-600",
  lavender: "bg-purple-300",
};

const TRACKS: Record<Track, string> = {
  purple: "bg-surface-track",
  "purple-soft": "bg-surface-track-soft",
  "on-navy": "bg-sidebar-track",
};

export function ProgressBar({
  value,
  height = 6,
  fill = "accent",
  track = "purple",
  label,
  className,
}: {
  value: number;
  height?: 6 | 7 | 8 | 12;
  fill?: Fill;
  track?: Track;
  label?: string;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn("overflow-hidden rounded-full", TRACKS[track], className)}
      style={{ height }}
    >
      <div className={cn("h-full rounded-full", FILLS[fill])} style={{ width: `${pct}%` }} />
    </div>
  );
}
