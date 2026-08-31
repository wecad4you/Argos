import { cn } from "@/lib/utils";

/**
 * Bloque de carga. La app NUNCA usa spinners (§10): cada pantalla compone sus
 * skeletons con la geometría exacta de la tarjeta o fila que va a reemplazar.
 * El pulso se apaga bajo prefers-reduced-motion (globals.css).
 */
export function Skeleton({
  className,
  width,
  height,
}: {
  className?: string;
  width?: number | string;
  height?: number | string;
}) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-chip bg-surface-track-soft", className)}
      style={{ width, height }}
    />
  );
}
