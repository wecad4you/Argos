import { cn } from "@/lib/utils";

/** Chip/pill seleccionable (fila de facultad del dashboard). */
export function Chip({
  children,
  active = false,
  onClick,
  className,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const Tag = onClick ? "button" : "span";
  return (
    <Tag
      {...(onClick ? { type: "button" as const, onClick, "aria-pressed": active } : {})}
      className={cn(
        "inline-flex items-center rounded-full border px-3.5 py-1.5 text-13.5 transition-colors",
        onClick && "cursor-pointer",
        active
          ? "border-purple-900 bg-purple-900 text-cream-50"
          : "border-border-field bg-surface-card text-navy-900/70",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** Chip estático de dato, como la celda Seniority de la tabla. */
export function DataChip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block rounded-chip bg-surface-chip-strong px-2.5 py-[3px] text-12 whitespace-nowrap text-purple-900",
        className,
      )}
    >
      {children}
    </span>
  );
}
