import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Tarjeta base. La app no usa sombras: la separación es un borde de 1px.
 * `tone="navy"` es la tarjeta inversa (KPI de cambios, "Señales de Argos").
 */
export function Card({
  children,
  className,
  tone = "light",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  tone?: "light" | "navy" | "purple";
  as?: "div" | "section" | "article";
}) {
  return (
    <Tag
      className={cn(
        "rounded-card",
        tone === "light" && "bg-surface-card border border-border-card",
        tone === "navy" && "bg-navy-900 text-cream-50",
        tone === "purple" && "bg-purple-900 text-cream-50",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** Encabezado de tarjeta: título + anotación numérica a la derecha. */
export function CardHeader({
  title,
  annotation,
  action,
  className,
}: {
  title: ReactNode;
  annotation?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-baseline justify-between gap-4", className)}>
      <h2 className="text-15.5 font-semibold text-navy-900">{title}</h2>
      {annotation ? <span className="num text-11 text-text-annotation">{annotation}</span> : null}
      {action}
    </div>
  );
}
