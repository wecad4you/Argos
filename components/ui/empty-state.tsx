import type { ReactNode } from "react";
import { ArgosMark } from "@/components/argos/argos-mark";
import { cn } from "@/lib/utils";

/**
 * Estado vacío honesto (§1, §10). Nunca sustituye un dato inexistente por un
 * número: explica por qué no hay dato. `action` permite ofrecer la salida
 * ("Limpiar filtros", "Reintentar").
 */
export function EmptyState({
  title,
  description,
  action,
  className,
  compact = false,
}: {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3.5 text-center",
        compact ? "py-10" : "py-[90px] px-8",
        className,
      )}
    >
      <ArgosMark variant="cream" size={34} className="opacity-50" />
      <p className="text-19 font-semibold text-navy-900">{title}</p>
      {description ? (
        <p className="max-w-[420px] text-14.5 text-text-tertiary">{description}</p>
      ) : null}
      {action}
    </div>
  );
}
