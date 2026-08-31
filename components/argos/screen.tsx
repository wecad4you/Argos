import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Contenedor de pantalla. Aplica `argosFade` (única animación de entrada) y
 * el padding de contenido del handoff: 24px 32px 56px.
 */
export function Screen({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("animate-argosFade px-8 pb-14 pt-6", className)}>{children}</div>
  );
}
